# Contract Conflict AI - Python Version

This is a Python version of the Contract Conflict AI application, built with **Streamlit**. It is designed for users who prefer Python over Node.js for local development.

## How to run in VS Code

### 1. Prerequisites
Make sure you have **Python 3.8+** installed on your laptop.

### 2. Setup
1. Open this project folder in VS Code.
2. Open a terminal (``Ctrl + ` ``).
3. Create a virtual environment (recommended):
   ```bash
   python -m venv venv
   ```
4. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - Mac/Linux: `source venv/bin/activate`

### 3. Install Dependencies
Run the following command to install the required libraries:
```bash
pip install -r requirements.txt
```

### 4. Configure API Key
1. Create a file named `.env` in the root folder.
2. Add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_actual_key_here
   ```

### 5. Run the App
Start the Streamlit server:
```bash
streamlit run app.py
```

The app will automatically open in your default web browser at `http://localhost:8501`.

## Features
- **File Upload**: Supports PDF, DOCX, and TXT files.
- **AI Analysis**: Uses Gemini 1.5 Flash to detect conflicts.
- **Premium UI**: Dark theme with glassmorphism effects, matching the original React version.
- **Strategic Suggestions**: Provides high-level legal advice for document harmonization.
