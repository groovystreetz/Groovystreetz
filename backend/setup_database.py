#!/usr/bin/env python3
"""
Groovystreetz Backend - First Time Setup Script

This script sets up a fresh Groovystreetz backend database with:
- Database migrations
- Superuser creation
- Sample development data (products, categories, users, orders)

Usage:
    python setup_database.py
    
Or with custom admin credentials:
    python setup_database.py --admin-email admin@example.com --admin-password mypassword
"""

import os
import sys
import subprocess
import argparse
from pathlib import Path

def run_command(command, description, check_return=True):
    """Run a shell command and handle errors"""
    print(f"🔄 {description}...")
    
    try:
        result = subprocess.run(
            command, 
            shell=True, 
            capture_output=True, 
            text=True, 
            cwd=Path(__file__).parent
        )
        
        if result.returncode != 0 and check_return:
            print(f"❌ Error in {description}:")
            print(f"Command: {command}")
            print(f"Error: {result.stderr}")
            return False
        else:
            if result.stdout:
                print(result.stdout)
            print(f"✅ {description} completed")
            return True
            
    except Exception as e:
        print(f"❌ Exception in {description}: {str(e)}")
        return False

def check_requirements():
    """Check if required files exist"""
    print("🔍 Checking requirements...")
    
    required_files = [
        'manage.py',
        '.venv/bin/python',
        'api/management/commands/setup_dev_data.py',
        'docker-compose.yml',
        '.env'
    ]
    
    for file_path in required_files:
        if not Path(file_path).exists():
            print(f"❌ Required file not found: {file_path}")
            if file_path == '.venv/bin/python':
                print("💡 Create virtual environment: python -m venv .venv")
                print("💡 Activate it: source .venv/bin/activate")
                print("💡 Install requirements: pip install -r requirements.txt")
            elif file_path == '.env':
                print("💡 Create environment file: cp .env.example .env")
            return False
    
    print("✅ Requirements check passed")
    return True

def main():
    parser = argparse.ArgumentParser(description='Setup Groovystreetz database for first time use')
    parser.add_argument('--admin-email', default='admin@groovystreetz.com', 
                       help='Email for superuser account')
    parser.add_argument('--admin-password', default='admin123',
                       help='Password for superuser account')
    parser.add_argument('--reset', action='store_true',
                       help='Reset existing data before setup')
    
    args = parser.parse_args()
    
    print("🚀 Groovystreetz Backend - First Time Setup")
    print("=" * 50)
    
    # Step 0: Create .env file if it doesn't exist
    if not Path('.env').exists() and Path('.env.example').exists():
        if not run_command(
            "cp .env.example .env",
            "Creating environment file from template"
        ):
            sys.exit(1)
    
    # Check requirements
    if not check_requirements():
        sys.exit(1)
    
    # Step 1: Start PostgreSQL database (if docker-compose exists)
    if Path('docker-compose.yml').exists():
        run_command(
            "docker-compose up -d",
            "Starting PostgreSQL database",
            check_return=False
        )
        
        # Wait a moment for database to start
        import time
        print("⏳ Waiting for database to initialize...")
        time.sleep(5)
    
    # Step 2: Run migrations
    if not run_command(
        ".venv/bin/python manage.py migrate",
        "Running database migrations"
    ):
        sys.exit(1)
    
    # Step 2: Collect static files (if needed)
    run_command(
        ".venv/bin/python manage.py collectstatic --noinput",
        "Collecting static files",
        check_return=False  # Don't fail if this doesn't work
    )
    
    # Step 3: Setup development data
    setup_cmd = f".venv/bin/python manage.py setup_dev_data --admin-email '{args.admin_email}' --admin-password '{args.admin_password}'"
    if args.reset:
        setup_cmd += " --reset"
    
    if not run_command(setup_cmd, "Setting up development data"):
        sys.exit(1)
    
    # Step 4: Run tests to verify setup
    print("\n🧪 Running API tests to verify setup...")
    if not run_command(
        "python simple_api_test.py",
        "Running API tests",
        check_return=False
    ):
        print("⚠️ Some tests may have failed, but setup is complete")
    
    print("\n" + "=" * 60)
    print("🎉 GROOVYSTREETZ BACKEND SETUP COMPLETE!")
    print("=" * 60)
    print(f"🔑 Admin Login: {args.admin_email} / {args.admin_password}")
    print("🌐 Start server: source .venv/bin/activate && python manage.py runserver")
    print("🧪 Run tests: python simple_api_test.py")
    print("📖 API Docs: http://127.0.0.1:8000/api/ (when server running)")
    print("=" * 60)

if __name__ == '__main__':
    main()