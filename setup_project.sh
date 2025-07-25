#!/bin/bash

# --- Configuration ---
PROJECT_NAME="ecommerce-project"

# --- Colors for Output ---
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# --- Start of Script ---
echo -e "${GREEN}Starting project setup for: ${YELLOW}${PROJECT_NAME}${NC}"

# 1. Create the root project directory and navigate into it
echo -e "\n${GREEN}Step 1: Creating root project directory...${NC}"
mkdir -p "$PROJECT_NAME"
cd "$PROJECT_NAME"
mkdir -p backend frontend

# 2. Set up the Django Backend
echo -e "\n${GREEN}Step 2: Setting up Django backend...${NC}"
cd backend

# Create and activate a Python virtual environment
python3 -m venv venv
source venv/bin/activate

# Install Django and required packages
echo "Installing Django, DRF, Cors-Headers, and Pillow..."
pip install django djangorestframework django-cors-headers Pillow > /dev/null 2>&1

# Create the Django project and an API app
django-admin startproject main .
python manage.py startapp api

# Deactivate virtual environment for now
deactivate
cd ..
echo -e "${YELLOW}Backend setup complete.${NC}"

# 3. Set up the React Frontend
echo -e "\n${GREEN}Step 3: Setting up React frontend...${NC}"
cd frontend

# Create a React project with Vite
echo "Initializing React project with Vite..."
npm create vite@latest . -- --template react > /dev/null 2>&1

# Install npm dependencies
echo "Installing npm dependencies (react-router-dom, axios)..."
npm install react-router-dom axios > /dev/null 2>&1

cd ..
echo -e "${YELLOW}Frontend setup complete.${NC}"

# --- Final Output ---
echo -e "\n${GREEN}-------------------------------------------"
echo -e "Project setup is complete!"
echo -e "-------------------------------------------${NC}\n"

echo -e "${YELLOW}Final Directory Structure:${NC}"
ls -l

echo -e "\n${YELLOW}Next Steps:${NC}"
echo "1. Configure Django settings in ${YELLOW}backend/main/settings.py${NC} (add 'rest_framework', 'corsheaders', and 'api' to INSTALLED_APPS)."
echo "2. Add 'corsheaders.middleware.CorsMiddleware' to MIDDLEWARE in settings.py."
echo "3. Define allowed origins for CORS (e.g., 'http://localhost:5173')."
echo -e "\nTo run the servers:"
echo "- Backend: cd ${PROJECT_NAME}/backend && source venv/bin/activate && python manage.py runserver"
echo "- Frontend: cd ${PROJECT_NAME}/frontend && npm run dev"
