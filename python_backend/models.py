from typing import Optional, List, Dict, Any
from pydantic import BaseModel, EmailStr

class RegisterUser(BaseModel):
    username: str
    email: EmailStr
    full_name: Optional[str] = None
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class UserInDB(BaseModel):
    username: str
    email: str
    full_name: Optional[str] = None
    disabled: Optional[bool] = False

class HomeBudgetInput(BaseModel):
    total_budget: float
    num_lights: int = 5
    num_fans: int = 4
    num_furniture: int = 2
    num_dining_tables: int = 1
    has_living_room: bool = True
    has_kitchen: bool = True
    has_bedroom: bool = False
    additional_requirements: Optional[str] = "None"

class PartyBudgetInput(BaseModel):
    total_budget: float
    num_guests: int = 3
    party_type: str = "Wedding"
    venue_type: Optional[str] = "Home"
    needs_catering: bool = True
    needs_decoration: bool = True
    needs_entertainment: bool = True
    additional_requirements: Optional[str] = "None"

class JewelryBudgetInput(BaseModel):
    total_budget: float
    occasion: str = "Birthday"
    preferences: Optional[str] = "Casual minimalist with metal accents"
