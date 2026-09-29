import os
import json
import re
import shutil
import uuid
import asyncio
from datetime import datetime, timedelta
from typing import List, Optional, Dict, Any, Union

from fastapi import (
    FastAPI,
    HTTPException,
    Depends,
    File,
    UploadFile,
    Form,
    Request,
    status,
    Response
)
from fastapi.responses import JSONResponse, RedirectResponse, HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel, EmailStr
from passlib.context import CryptContext
from jose import JWTError, jwt
from dotenv import load_dotenv

from models import RegisterUser, Token, UserInDB, HomeBudgetInput, PartyBudgetInput, JewelryBudgetInput
from gemini_utils import (
    get_home_recommendations,
    get_party_recommendations,
    get_jewelry_recommendations
)

load_dotenv()

# # FastAPI app initialization
app = FastAPI(title="PocketSmart: AI Budget Planner")

SECRET_KEY = os.getenv("SECRET_KEY", "your_secret_key_pocketsmart_2026")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token", auto_error=False)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static files & Jinja2 Templates
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TEMPLATES_DIR = os.path.join(BASE_DIR, "templates")
STATIC_DIR = os.path.join(BASE_DIR, "static")
UPLOADS_DIR = os.path.join(STATIC_DIR, "uploads")

os.makedirs(UPLOADS_DIR, exist_ok=True)
templates = Jinja2Templates(directory=TEMPLATES_DIR)
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

# In-memory stores
users_db: Dict[str, Dict[str, Any]] = {
    "sai": {
        "username": "sai",
        "email": "sai@example.com",
        "full_name": "Sai Krishna",
        "hashed_password": pwd_context.hash("password123"),
        "disabled": False
    }
}

blacklisted_tokens = set()
active_sessions: Dict[str, Any] = {}
user_recommendations: Dict[str, List[Dict[str, Any]]] = {
    "sai": [
        {
            "id": "rec-init-01",
            "timestamp": "2026-05-22T12:02:00",
            "type": "home",
            "input_summary": {"budget": 5000, "rooms": ["Living Room", "Kitchen"], "lights": 5, "fans": 4, "furniture": 2},
            "result_summary": {"total_budget": 5000, "remaining_budget": 500, "highlight": "Living Room & Kitchen"},
            "full_result": {"total_budget": 5000, "remaining_budget": 500}
        }
    ]
}

class UserSession:
    def __init__(self, username: str, login_time: datetime, last_activity: datetime, token: str, user_data: Optional[Dict] = None):
        self.username = username
        self.login_time = login_time
        self.last_activity = last_activity
        self.token = token
        self.user_data = user_data or {}

# Helper Functions
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_token(request: Request) -> Optional[str]:
    # Check Authorization header
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer "):
        return auth_header.split(" ")[1]
    # Check cookie
    return request.cookies.get("access_token")

async def get_current_user(request: Request, token: Optional[str] = Depends(get_token)) -> Optional[UserInDB]:
    if not token or token in blacklisted_tokens:
        return None
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            return None
    except JWTError:
        return None
    
    user_dict = users_db.get(username)
    if not user_dict:
        return None
    return UserInDB(**user_dict)

async def get_current_active_user(user: Optional[UserInDB] = Depends(get_current_user)) -> UserInDB:
    if not user:
        # Default mock user if not logged in for smooth navigation
        return UserInDB(username="sai", email="sai@example.com", full_name="Sai Krishna")
    return user

def save_upload_file(upload_file: UploadFile) -> str:
    filename = f"{datetime.now().strftime('%Y%m%d%H%M%S')}_{upload_file.filename}"
    filepath = os.path.join(UPLOADS_DIR, filename)
    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(upload_file.file, buffer)
    return filepath

def save_to_history(username: str, recommendation_type: str, input_data: dict, result: dict):
    if username not in user_recommendations:
        user_recommendations[username] = []
    
    item = {
        "id": f"rec-{uuid.uuid4().hex[:8]}",
        "timestamp": datetime.utcnow().isoformat(),
        "type": recommendation_type,
        "input_summary": input_data,
        "result_summary": {
            "total_budget": result.get("total_budget", 0),
            "remaining_budget": result.get("remaining_budget", 0),
            "highlight": f"{recommendation_type.title()} Plan"
        },
        "full_result": result
    }
    user_recommendations[username].insert(0, item)

# ==========================================
# Authentication Routes
# ==========================================

@app.get("/login", response_class=HTMLResponse)
async def login_page(request: Request):
    """Serve the login page"""
    token = await get_token(request)
    if token:
        user = await get_current_user(request, token)
        if user:
            return RedirectResponse(url="/dashboard", status_code=status.HTTP_302_FOUND)
    return templates.TemplateResponse("login.html", {"request": request})

@app.get("/register", response_class=HTMLResponse)
async def register_page(request: Request):
    """Serve the registration page"""
    token = await get_token(request)
    if token:
        user = await get_current_user(request, token)
        if user:
            return RedirectResponse(url="/dashboard", status_code=status.HTTP_302_FOUND)
    return templates.TemplateResponse("register.html", {"request": request})

@app.post("/register")
async def register_user(user: RegisterUser):
    if user.username in users_db:
        raise HTTPException(status_code=400, detail="Username already exists")
    users_db[user.username] = {
        "username": user.username,
        "email": user.email,
        "full_name": user.full_name or user.username,
        "hashed_password": get_password_hash(user.password),
        "disabled": False
    }
    return {"message": "User registered successfully"}

@app.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user_dict = users_db.get(form_data.username)
    if not user_dict or not verify_password(form_data.password, user_dict["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user_dict["username"]}, expires_delta=access_token_expires
    )
    
    active_sessions[user_dict["username"]] = UserSession(
        username=user_dict["username"],
        login_time=datetime.utcnow(),
        last_activity=datetime.utcnow(),
        token=access_token
    )
    
    response = JSONResponse(content={"access_token": access_token, "token_type": "bearer"})
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        samesite="lax"
    )
    return response

@app.post("/logout")
async def logout(request: Request):
    token = await get_token(request)
    if token:
        blacklisted_tokens.add(token)
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            username = payload.get("sub")
            if username in active_sessions:
                del active_sessions[username]
        except JWTError:
            pass
    response = RedirectResponse(url="/login", status_code=status.HTTP_302_FOUND)
    response.delete_cookie(key="access_token")
    return response

# ==========================================
# Session Routes
# ==========================================

@app.get("/session-info")
async def get_session_info(request: Request, current_user: UserInDB = Depends(get_current_active_user)):
    session = active_sessions.get(current_user.username)
    if session:
        return {
            "username": session.username,
            "login_time": session.login_time,
            "last_activity": session.last_activity,
            "session_duration": int((datetime.utcnow() - session.login_time).total_seconds() // 60),
            "user_data": session.user_data
        }
    return {
        "username": current_user.username,
        "login_time": datetime.utcnow().isoformat(),
        "last_activity": datetime.utcnow().isoformat(),
        "session_duration": 0,
        "user_data": {}
    }

@app.post("/session-data")
async def update_session_data(data: Dict[str, Any], current_user: UserInDB = Depends(get_current_active_user)):
    session = active_sessions.get(current_user.username)
    if session:
        session.user_data.update(data)
        session.last_activity = datetime.utcnow()
        return {"message": "Session data updated", "data": session.user_data}
    return {"message": "Session created", "data": data}

# ==========================================
# Planner Pages & API Routes
# ==========================================

@app.get("/", response_class=HTMLResponse)
async def home_page(request: Request):
    """Landing Page"""
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/dashboard", response_class=HTMLResponse)
async def dashboard_page(request: Request, current_user: UserInDB = Depends(get_current_active_user)):
    """User Dashboard"""
    history = user_recommendations.get(current_user.username, [])
    return templates.TemplateResponse("dashboard.html", {
        "request": request,
        "user": current_user,
        "recent_activity": history[:5]
    })

# 1. Home Interior Planner
@app.get("/home-planner", response_class=HTMLResponse)
async def home_planner_view(request: Request, current_user: UserInDB = Depends(get_current_active_user)):
    return templates.TemplateResponse("home_planner.html", {"request": request, "user": current_user})

@app.post("/generate-home")
@app.post("/home-budget")
async def plan_home_budget(budget_input: HomeBudgetInput, current_user: UserInDB = Depends(get_current_active_user)):
    result = get_home_recommendations(budget_input)
    save_to_history(current_user.username, "home", budget_input.dict(), result)
    return result

# 2. Party Planner
@app.get("/party-planner", response_class=HTMLResponse)
async def party_planner_view(request: Request, current_user: UserInDB = Depends(get_current_active_user)):
    return templates.TemplateResponse("party_planner.html", {"request": request, "user": current_user})

@app.post("/generate-party")
@app.post("/party-budget")
async def plan_party_budget(budget_input: PartyBudgetInput, current_user: UserInDB = Depends(get_current_active_user)):
    result = get_party_recommendations(budget_input)
    save_to_history(current_user.username, "party", budget_input.dict(), result)
    return result

# 3. Jewelry Planner
@app.get("/jewelry-planner", response_class=HTMLResponse)
async def jewelry_planner_view(request: Request, current_user: UserInDB = Depends(get_current_active_user)):
    return templates.TemplateResponse("jewelry_planner.html", {"request": request, "user": current_user})

@app.post("/generate-jewelry")
@app.post("/jewelry-budget")
async def plan_jewelry_budget(
    total_budget: float = Form(...),
    occasion: str = Form(...),
    preferences: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None),
    current_user: UserInDB = Depends(get_current_active_user)
):
    budget_input = JewelryBudgetInput(
        total_budget=total_budget,
        occasion=occasion,
        preferences=preferences or "Casual minimalist with metal accents"
    )
    image_path = None
    if image and image.filename:
        image_path = save_upload_file(image)
        
    result = get_jewelry_recommendations(budget_input, image_path)
    
    input_data = budget_input.dict()
    if image_path:
        input_data["image_path"] = image_path
    save_to_history(current_user.username, "jewelry", input_data, result)
    return result

# History Routes
@app.get("/history", response_class=HTMLResponse)
async def history_page(request: Request, current_user: UserInDB = Depends(get_current_active_user)):
    history = user_recommendations.get(current_user.username, [])
    return templates.TemplateResponse("history.html", {"request": request, "user": current_user, "history": history})

@app.get("/recommendation-history")
async def get_recommendation_history(current_user: UserInDB = Depends(get_current_active_user)):
    history = user_recommendations.get(current_user.username, [])
    return {"history": history}

@app.get("/recommendation-details/{recommendation_id}")
async def get_recommendation_details(recommendation_id: str, current_user: UserInDB = Depends(get_current_active_user)):
    for item in user_recommendations.get(current_user.username, []):
        if item.get("id") == recommendation_id:
            return item
    raise HTTPException(status_code=404, detail="Recommendation not found")

# Startup background task for session cleanup
@app.on_event("startup")
async def setup_session_cleanup():
    async def cleanup_expired_sessions():
        while True:
            current_time = datetime.utcnow()
            expired_users = [
                uname for uname, s in active_sessions.items()
                if (current_time - s.last_activity).total_seconds() > 1800 # 30 mins
            ]
            for uname in expired_users:
                print(f"Removing expired session for: {uname}")
                active_sessions.pop(uname, None)
            await asyncio.sleep(300)
    asyncio.create_task(cleanup_expired_sessions())

if __name__ == "__main__":
    import uvicorn
    print("Starting PocketSmart: AI Budget Planner on port 8000...")
    uvicorn.run(app, host="0.0.0.0", port=8000)
