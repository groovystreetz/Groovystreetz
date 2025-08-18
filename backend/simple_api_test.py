#!/usr/bin/env python3
"""
Simple API Endpoint Testing Script for Groovystreetz Backend
Tests endpoints using curl commands for accurate CSRF handling.
"""

import subprocess
import json
import sys
import time
import os
import tempfile
import platform
from datetime import datetime
from pathlib import Path

class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    CYAN = '\033[96m'
    WHITE = '\033[97m'
    BOLD = '\033[1m'
    END = '\033[0m'

class SimpleAPITester:
    def __init__(self, base_url: str = "http://127.0.0.1:8000"):
        self.base_url = base_url
        self.results = []
        self.temp_dir = tempfile.gettempdir()
        self.is_windows = platform.system().lower() == 'windows'
        self.dev_null = 'nul' if self.is_windows else '/dev/null'
        
    def log(self, message: str, color: str = Colors.WHITE):
        print(f"{color}{message}{Colors.END}")
        
    def extract_csrf_token(self, cookie_file):
        """Extract CSRF token from cookie file - cross platform"""
        try:
            with open(cookie_file, 'r') as f:
                for line in f:
                    if 'csrftoken' in line:
                        parts = line.strip().split('\t')
                        if len(parts) >= 7:
                            return parts[6]
            return ""
        except (FileNotFoundError, IOError):
            return ""
        
    def run_curl(self, command: str, expected_status: int = 200, description: str = ""):
        """Run curl command and check response"""
        try:
            result = subprocess.run(command, shell=True, capture_output=True, text=True, timeout=30)
            
            # Extract status code from the end of curl output (using -w flag)
            output_lines = result.stdout.strip().split('\n') if result.stdout else ['']
            last_line = output_lines[-1] if output_lines else ''
            
            # Try to extract status code from last line
            try:
                status_code = int(last_line[-3:]) if len(last_line) >= 3 else 200
            except (ValueError, IndexError):
                status_code = 200 if result.returncode == 0 else 500
            
            success = status_code == expected_status
            status_color = Colors.GREEN if success else Colors.RED
            status_text = "✅ PASS" if success else "❌ FAIL"
            
            self.log(f"  {status_text} {description} - Expected: {expected_status}, Got: {status_code}", status_color)
            
            if result.stdout and len(result.stdout.strip()) > 0:
                try:
                    # Try to parse JSON response
                    response_data = json.loads(result.stdout)
                    if isinstance(response_data, dict) and len(response_data) < 5:
                        self.log(f"    Response: {json.dumps(response_data, indent=2)}", Colors.CYAN)
                except:
                    # Show first 100 chars if not JSON
                    preview = result.stdout[:100] + "..." if len(result.stdout) > 100 else result.stdout
                    self.log(f"    Response preview: {preview}", Colors.CYAN)
            
            self.results.append({
                'description': description,
                'expected': expected_status,
                'actual': status_code,
                'success': success,
                'command': command,
                'stdout': result.stdout,
                'stderr': result.stderr
            })
            
            return result.stdout, status_code
            
        except subprocess.TimeoutExpired:
            self.log(f"  ❌ TIMEOUT {description}", Colors.RED)
            return None, 408
        except Exception as e:
            self.log(f"  ❌ ERROR {description}: {str(e)}", Colors.RED)
            return None, 500
    
    def test_public_endpoints(self):
        """Test public endpoints"""
        self.log(f"\n{Colors.CYAN}=== Testing Public Endpoints ==={Colors.END}")
        
        temp_response = os.path.join(self.temp_dir, 'response.json')
        
        self.run_curl(
            f'curl -s -w "%{{http_code}}" -o "{temp_response}" {self.base_url}/api/categories/',
            200, "GET /api/categories/"
        )
        
        self.run_curl(
            f'curl -s -w "%{{http_code}}" -o "{temp_response}" {self.base_url}/api/products/',
            200, "GET /api/products/"
        )
    
    def test_authentication(self):
        """Test authentication endpoints"""
        self.log(f"\n{Colors.CYAN}=== Testing Authentication ==={Colors.END}")
        
        timestamp = int(time.time())
        
        # Test registration
        register_cmd = f'''curl -s -w "%{{http_code}}" -X POST {self.base_url}/api/register/ \\
            -H "Content-Type: application/json" \\
            -d '{{"username": "testuser_{timestamp}", "email": "test_{timestamp}@example.com", "password": "TestPassword123!", "password2": "TestPassword123!"}}'
        '''
        self.run_curl(register_cmd, 201, "POST /api/register/")
        
        # Test login and save cookies
        cookies_file = os.path.join(self.temp_dir, 'cookies.txt')
        login_cmd = f'''curl -s -w "%{{http_code}}" -c "{cookies_file}" -X POST {self.base_url}/api/login/ \\
            -H "Content-Type: application/json" \\
            -d '{{"email": "test_{timestamp}@example.com", "password": "TestPassword123!"}}'
        '''
        response, status = self.run_curl(login_cmd, 200, "POST /api/login/")
        
        if status == 200:
            csrf_token = self.extract_csrf_token(cookies_file)
            
            # Test authenticated user endpoint
            user_cmd = f'''curl -s -w "%{{http_code}}" -b "{cookies_file}" -X GET {self.base_url}/api/auth/user/ \\
                -H "X-CSRFToken: {csrf_token}"
            '''
            self.run_curl(user_cmd, 200, "GET /api/auth/user/")
            
            # Test logout
            logout_cmd = f'''curl -s -w "%{{http_code}}" -b "{cookies_file}" -X POST {self.base_url}/api/logout/ \\
                -H "X-CSRFToken: {csrf_token}"
            '''
            self.run_curl(logout_cmd, 200, "POST /api/logout/")
    
    def test_admin_endpoints(self):
        """Test admin endpoints"""
        self.log(f"\n{Colors.CYAN}=== Testing Admin Endpoints ==={Colors.END}")
        
        # Login as admin (use default dev data admin)
        admin_cookies_file = os.path.join(self.temp_dir, 'admin_cookies.txt')
        admin_login_cmd = f'''curl -s -w "%{{http_code}}" -c "{admin_cookies_file}" -X POST {self.base_url}/api/login/ \\
            -H "Content-Type: application/json" \\
            -d '{{"email": "admin@groovystreetz.com", "password": "admin123"}}'
        '''
        response, status = self.run_curl(admin_login_cmd, 200, "Admin login")
        
        if status == 200:
            csrf_token = self.extract_csrf_token(admin_cookies_file)
            
            # Test admin endpoints
            users_cmd = f'''curl -s -w "%{{http_code}}" -b "{admin_cookies_file}" -X GET {self.base_url}/api/admin/users/ \\
                -H "X-CSRFToken: {csrf_token}"
            '''
            self.run_curl(users_cmd, 200, "GET /api/admin/users/")
            
            orders_cmd = f'''curl -s -w "%{{http_code}}" -b "{admin_cookies_file}" -X GET {self.base_url}/api/admin/orders/ \\
                -H "X-CSRFToken: {csrf_token}"
            '''
            self.run_curl(orders_cmd, 200, "GET /api/admin/orders/")
            
            sales_cmd = f'''curl -s -w "%{{http_code}}" -b "{admin_cookies_file}" -X GET {self.base_url}/api/admin/sales-report/ \\
                -H "X-CSRFToken: {csrf_token}"
            '''
            self.run_curl(sales_cmd, 200, "GET /api/admin/sales-report/")
        else:
            self.log("Skipping admin tests - admin login failed", Colors.YELLOW)
    
    def check_dev_data_setup(self):
        """Check if development data is already set up"""
        self.log("Checking for development data...", Colors.YELLOW)
        
        # Check if we have products and admin user
        products_response, products_status = self.run_curl(
            f'curl -s {self.base_url}/api/products/', 
            200, 
            "Check products"
        )
        
        if products_status == 200:
            try:
                products = json.loads(products_response)
                if isinstance(products, list) and len(products) > 0:
                    self.log(f"✅ Found {len(products)} products in database", Colors.GREEN)
                    return True
            except json.JSONDecodeError:
                pass
        
        self.log("⚠️ No development data found", Colors.YELLOW)
        self.log("💡 Run 'python manage.py setup_dev_data' to create sample data", Colors.CYAN)
        return False

    def get_available_products(self):
        """Get list of available products for order testing"""
        products_cmd = f'curl -s {self.base_url}/api/products/'
        
        try:
            result = subprocess.run(products_cmd, shell=True, capture_output=True, text=True, timeout=10)
            if result.returncode == 0:
                try:
                    products = json.loads(result.stdout)
                    if isinstance(products, list) and len(products) >= 2:
                        return products[:2]  # Return first 2 products
                except json.JSONDecodeError:
                    pass
        except:
            pass
        
        return []

    def test_customer_orders(self):
        """Test customer order endpoints"""
        self.log(f"\n{Colors.CYAN}=== Testing Customer Order Endpoints ==={Colors.END}")
        
        # Check if dev data is set up
        has_dev_data = self.check_dev_data_setup()
        
        # Get available products
        available_products = self.get_available_products()
        
        if not available_products:
            self.log("⚠️ No products available for order testing - creating minimal order test", Colors.YELLOW)
            # Test with empty order to check endpoint exists
            test_items = []
            expected_status = 201  # Empty order is allowed
        else:
            # Use first 2 available products
            test_items = [
                {"product": available_products[0]["id"], "quantity": 1, "price": str(available_products[0]["price"])},
                {"product": available_products[1]["id"] if len(available_products) > 1 else available_products[0]["id"], 
                 "quantity": 1, "price": str(available_products[1]["price"] if len(available_products) > 1 else available_products[0]["price"])}
            ]
            expected_status = 201
            total_price = sum(float(item["price"]) for item in test_items)
        
        timestamp = int(time.time())
        
        # Register and login a new customer
        register_cmd = f'''curl -s -w "%{{http_code}}" -X POST {self.base_url}/api/register/ \\
            -H "Content-Type: application/json" \\
            -d '{{"username": "customer_{timestamp}", "email": "customer_{timestamp}@example.com", "password": "TestPassword123!", "password2": "TestPassword123!"}}'
        '''
        self.run_curl(register_cmd, 201, "Register customer for order test")
        
        # Login customer
        customer_cookies_file = os.path.join(self.temp_dir, 'customer_cookies.txt')
        login_cmd = f'''curl -s -w "%{{http_code}}" -c "{customer_cookies_file}" -X POST {self.base_url}/api/login/ \\
            -H "Content-Type: application/json" \\
            -d '{{"email": "customer_{timestamp}@example.com", "password": "TestPassword123!"}}'
        '''
        response, status = self.run_curl(login_cmd, 200, "Customer login for orders")
        
        if status == 200:
            csrf_token = self.extract_csrf_token(customer_cookies_file)
            
            # Test getting customer orders (should be empty initially)
            orders_cmd = f'''curl -s -w "%{{http_code}}" -b "{customer_cookies_file}" -X GET {self.base_url}/api/orders/ \\
                -H "X-CSRFToken: {csrf_token}"
            '''
            self.run_curl(orders_cmd, 200, "GET /api/orders/ (customer)")
            
            # Test creating an order with available products or empty for validation test
            if test_items:
                order_data = {
                    "shipping_address": "123 Test St, Test City, TC 12345",
                    "total_price": f"{total_price:.2f}",
                    "items": test_items
                }
            else:
                order_data = {
                    "shipping_address": "123 Test St, Test City, TC 12345", 
                    "total_price": "0.00",
                    "items": []
                }
            
            order_cmd = f'''curl -s -w "%{{http_code}}" -b "{customer_cookies_file}" -X POST {self.base_url}/api/orders/create/ \\
                -H "Content-Type: application/json" \\
                -H "X-CSRFToken: {csrf_token}" \\
                -d '{json.dumps(order_data)}'
            '''
            self.run_curl(order_cmd, expected_status, "POST /api/orders/create/")
        else:
            self.log("Skipping order tests - customer login failed", Colors.YELLOW)
    
    def test_unauthorized_access(self):
        """Test unauthorized access protection"""
        self.log(f"\n{Colors.CYAN}=== Testing Unauthorized Access ==={Colors.END}")
        
        # These should return 403 (Forbidden) or 401 (Unauthorized)
        temp_response = os.path.join(self.temp_dir, 'response.json')
        
        self.run_curl(
            f'curl -s -w "%{{http_code}}" -o "{temp_response}" {self.base_url}/api/admin/users/',
            403, "GET /api/admin/users/ (no auth)"
        )
        
        self.run_curl(
            f'curl -s -w "%{{http_code}}" -o "{temp_response}" {self.base_url}/api/admin/orders/',
            403, "GET /api/admin/orders/ (no auth)"
        )
    
    def generate_report(self):
        """Generate test report"""
        self.log(f"\n{Colors.BOLD}=== TEST REPORT ==={Colors.END}")
        
        total = len(self.results)
        passed = sum(1 for r in self.results if r['success'])
        failed = total - passed
        
        self.log(f"\nSummary:")
        self.log(f"  Total Tests: {total}")
        self.log(f"  Passed: {Colors.GREEN}{passed}{Colors.END}")
        self.log(f"  Failed: {Colors.RED}{failed}{Colors.END}")
        self.log(f"  Success Rate: {Colors.CYAN}{(passed/total*100):.1f}%{Colors.END}")
        
        if failed > 0:
            self.log(f"\n{Colors.RED}Failed Tests:{Colors.END}")
            for result in self.results:
                if not result['success']:
                    self.log(f"  ❌ {result['description']} - Expected: {result['expected']}, Got: {result['actual']}", Colors.RED)
    
    def run_all_tests(self):
        """Run all tests"""
        self.log(f"{Colors.BOLD}{Colors.BLUE}🚀 Simple Groovystreetz API Test Suite{Colors.END}")
        self.log(f"Testing against: {self.base_url}")
        self.log(f"Timestamp: {datetime.now().isoformat()}")
        
        # Check if curl is available
        try:
            subprocess.run(['curl', '--version'], capture_output=True, check=True)
        except:
            self.log("❌ curl is not available. Please install curl to run this test.", Colors.RED)
            return
        
        # Check if server is running
        try:
            result = subprocess.run(['curl', '-s', '-o', self.dev_null, '-w', '%{http_code}', f'{self.base_url}/api/categories/'], 
                                  capture_output=True, timeout=5, text=True)
            if result.stdout.strip() != "200":
                raise Exception(f"Server returned status: {result.stdout.strip()}")
            self.log("✅ Server is running and responding", Colors.GREEN)
        except Exception as e:
            self.log(f"❌ Server is not accessible at {self.base_url}: {str(e)}", Colors.RED)
            return
        
        # Run test suites
        self.test_public_endpoints()
        self.test_authentication()
        self.test_admin_endpoints()
        self.test_customer_orders()
        self.test_unauthorized_access()
        
        # Generate report
        self.generate_report()
        
        # Cleanup - cross platform
        cleanup_files = [
            os.path.join(self.temp_dir, 'cookies.txt'),
            os.path.join(self.temp_dir, 'admin_cookies.txt'), 
            os.path.join(self.temp_dir, 'customer_cookies.txt'),
            os.path.join(self.temp_dir, 'response.json')
        ]
        
        for file_path in cleanup_files:
            try:
                if os.path.exists(file_path):
                    os.remove(file_path)
            except OSError:
                pass  # Ignore cleanup errors

def main():
    tester = SimpleAPITester()
    tester.run_all_tests()

if __name__ == "__main__":
    main()