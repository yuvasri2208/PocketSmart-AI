# PocketSmart AI: Complete VS Code Setup, Installation, Running & Testing Guide

This guide walks you through setting up and running **PocketSmart AI: Your Smart Budget & Recommendation Assistant** in Visual Studio Code.

---

## Architecture Overview

PocketSmart AI comes with two execution modes:
1. **Interactive Fullstack Web App (Node.js + Express + React + Tailwind + @google/genai SDK)**: Runs live on Port 3000 with rich interactive UI matching all PDF screenshots.
2. **Modular Python FastAPI Backend (`/python_backend`)**: Contains the course curriculum files (`app.py`, `gemini_utils.py`, `models.py`, `templates/`, `static/`, `requirements.txt`).

---

## Option 1: Running the Live Fullstack Web Application (Node.js + React + Express)

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18+ or 20+)
- [VS Code](https://code.visualstudio.com/)

### Step 1: Open Project in VS Code
1. Open VS Code.
2. Click **File > Open Folder...** and select the root project folder (`PocketSmart-AI`).

### Step 2: Install Dependencies
Open the VS Code integrated terminal (`Ctrl + \`` or **Terminal > New Terminal**) and run:
```bash
npm install
```

### Step 3: Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Ensure your Gemini API key is configured:
```env
GEMINI_API_KEY="your_actual_gemini_api_key"
```

### Step 4: Run the Development Server
```bash
npm run dev
```
The server will start on `http://localhost:3000`. Open your browser and navigate to:
**`http://localhost:3000`**

---

## Option 2: Running the Standalone Python FastAPI Backend

### Prerequisites
- [Python 3.10+](https://www.python.org/downloads/)
- VS Code with the **Python Extension** installed.

### Step 1: Navigate to the Python Backend Folder
In your VS Code terminal:
```bash
cd python_backend
```

### Step 2: Create a Virtual Environment
```bash
python -m venv venv
```

### Step 3: Activate the Virtual Environment
- **On Windows (Command Prompt)**:
  ```cmd
  venv\Scripts\activate.bat
  ```
- **On Windows (PowerShell)**:
  ```powershell
  .\venv\Scripts\Activate.ps1
  ```
- **On macOS / Linux**:
  ```bash
  source venv/bin/activate
  ```

### Step 4: Install Python Dependencies
```bash
pip install -r requirements.txt
```

### Step 5: Configure the Python `.env` File
Create a `.env` file inside `python_backend/`:
```env
GEMINI_API_KEY="your_actual_gemini_api_key"
GOOGLE_API_KEY="your_actual_gemini_api_key"
SECRET_KEY="supersecretjwtkeyforpocketsmartai2026"
```

### Step 6: Run the FastAPI Server
```bash
uvicorn app:app --reload --port 8000
```

Once running:
- Web App UI: **`http://localhost:8000`**
- Interactive Swagger API Documentation: **`http://localhost:8000/docs`**
- ReDoc Documentation: **`http://localhost:8000/redoc`**

### Default Login Credentials
- **Username**: `sai`
- **Password**: `password123`

---

## Testing Instructions

### 1. Automated Test Suite (Python)
Inside `python_backend/`, run the automated test script:
```bash
python test_api.py
```
This tests:
1. Currency conversion logic (`usd_to_inr`)
2. Scenario 1: Home Interior Planner API & shopping link generators (Amazon, Flipkart, IKEA, Myntra, Ajio)
3. Scenario 2: Party Budget Planner API with venue suggestions (Swiggy, Zomato, OYO, MakeMyTrip)
4. Scenario 3: Jewelry Budget Planner API with multimodal outfit analysis (Tanishq, CaratLane, BlueStone)

### 2. Manual Testing in the Web UI
1. **Home Planner**:
   - Go to **Home Planner** in the top navigation.
   - Enter budget `5000`, select `5` lights, `4` fans, `2` furniture pieces, `1` dining table.
   - Check `Living Room` and `Kitchen`.
   - Click **Generate Recommendations**.
   - Verify that the budget breakdown, remaining budget, and external shopping links (Amazon, Flipkart, IKEA) appear.
2. **Party Planner**:
   - Go to **Party Planner**.
   - Enter budget `5000`, guests `3`, party type `Wedding`, venue `Home`.
   - Toggle `Catering`, `Decoration`, `Entertainment`.
   - Click **Generate Budget Plan**.
   - Verify that venue and vendor recommendations appear with **Print / Save** action.
3. **Jewelry Planner (Multimodal)**:
   - Go to **Jewelry Planner**.
   - Enter budget `5000`, occasion `Birthday`.
   - Upload any outfit image (PNG/JPG).
   - Click **Get Recommendations**.
   - Verify that the AI analyzes outfit colors, style formality, and gives matching jewelry with links to Tanishq, CaratLane, BlueStone, and Amazon.
4. **Recommendation History**:
   - Go to **History** to see all previous queries saved with timestamps and click **View Full Details** to open the item modal.
