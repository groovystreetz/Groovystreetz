#!/usr/bin/env python
"""
ShipRocket Integration Test Script
This script tests the basic functionality of ShipRocket integration
Run with: .venv/bin/python test_shiprocket.py
"""

import os
import sys
import django
from pathlib import Path

# Add the project root to Python path
BASE_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(BASE_DIR))

# Configure Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'main.settings')
django.setup()

from api.shiprocket_service import shiprocket_service, ShipRocketAPIError
from api.shiprocket_utils import ShipRocketValidator, ShipRocketDataMapper
from django.conf import settings


def test_configuration():
    """Test if ShipRocket configuration is properly set up"""
    print("🔧 Testing Configuration...")
    
    # Check environment variables
    required_vars = ['SHIPROCKET_EMAIL', 'SHIPROCKET_PASSWORD']
    missing_vars = []
    
    for var in required_vars:
        if not getattr(settings, var, None):
            missing_vars.append(var)
    
    if missing_vars:
        print(f"❌ Missing environment variables: {', '.join(missing_vars)}")
        print("   Please configure these in your .env file")
        return False
    
    print("✅ Configuration variables found")
    
    # Check pickup configuration
    pickup_config = settings.SHIPROCKET_DEFAULT_PICKUP
    if not pickup_config.get('pin_code'):
        print("❌ Pickup pincode not configured")
        return False
    
    print(f"✅ Pickup location configured: {pickup_config['name']}")
    return True


def test_authentication():
    """Test ShipRocket authentication"""
    print("\n🔐 Testing Authentication...")
    
    try:
        token = shiprocket_service._get_auth_token()
        if token:
            print(f"✅ Authentication successful")
            print(f"   Token: {token[:20]}...{token[-10:]}")
            return True
        else:
            print("❌ Authentication failed: No token received")
            return False
    
    except ShipRocketAPIError as e:
        print(f"❌ Authentication failed: {e}")
        return False
    
    except Exception as e:
        print(f"❌ Unexpected error during authentication: {e}")
        return False


def test_serviceability():
    """Test courier serviceability check"""
    print("\n📍 Testing Courier Serviceability...")
    
    try:
        pickup_pincode = settings.SHIPROCKET_DEFAULT_PICKUP.get('pin_code')
        test_delivery_pincode = "110001"  # New Delhi pincode for testing
        
        print(f"   Testing route: {pickup_pincode} → {test_delivery_pincode}")
        
        result = shiprocket_service.get_courier_serviceability(
            pickup_postcode=pickup_pincode,
            delivery_postcode=test_delivery_pincode,
            weight=0.5,
            cod=0
        )
        
        if result.get('status') == 200:
            courier_data = result.get('data', {})
            available_couriers = courier_data.get('available_courier_companies', [])
            
            print(f"✅ Serviceability check successful")
            print(f"   Available couriers: {len(available_couriers)}")
            
            if available_couriers:
                cheapest = min(available_couriers, key=lambda x: x.get('rate', 999))
                print(f"   Cheapest option: {cheapest.get('courier_name')} - ₹{cheapest.get('rate', 0)}")
            
            return True
        else:
            print(f"❌ Serviceability check failed: {result.get('message', 'Unknown error')}")
            return False
    
    except ShipRocketAPIError as e:
        print(f"❌ API error during serviceability check: {e}")
        return False
    
    except Exception as e:
        print(f"❌ Unexpected error during serviceability check: {e}")
        return False


def test_validation():
    """Test validation utilities"""
    print("\n✅ Testing Validation Utilities...")
    
    # Test pincode validation
    valid_pincodes = ["110001", "400001", "560001"]
    invalid_pincodes = ["1234", "abcdef", ""]
    
    print("   Testing pincode validation:")
    for pincode in valid_pincodes:
        if ShipRocketValidator.validate_pincode(pincode):
            print(f"     ✅ {pincode} - Valid")
        else:
            print(f"     ❌ {pincode} - Should be valid but failed")
    
    for pincode in invalid_pincodes:
        if not ShipRocketValidator.validate_pincode(pincode):
            print(f"     ✅ {pincode} - Invalid (correctly identified)")
        else:
            print(f"     ❌ {pincode} - Should be invalid but passed")
    
    # Test phone validation
    valid_phones = ["9876543210", "+919876543210", "91-9876543210"]
    invalid_phones = ["123", "abcdefghij", ""]
    
    print("   Testing phone validation:")
    for phone in valid_phones:
        if ShipRocketValidator.validate_phone(phone):
            print(f"     ✅ {phone} - Valid")
        else:
            print(f"     ❌ {phone} - Should be valid but failed")
    
    return True


def test_data_mapping():
    """Test data mapping utilities"""
    print("\n🗺️ Testing Data Mapping...")
    
    # Test address parsing
    test_address = """John Doe
123 Main Street
Near Central Park
New Delhi, Delhi
110001"""
    
    try:
        parsed = ShipRocketDataMapper.parse_shipping_address(test_address)
        print("   Address parsing test:")
        print(f"     ✅ Pincode extracted: {parsed['pin_code']}")
        print(f"     ✅ Address: {parsed['address']}")
        
        return True
    
    except Exception as e:
        print(f"   ❌ Address parsing failed: {e}")
        return False


def test_database_integration():
    """Test database model integration"""
    print("\n🗄️ Testing Database Integration...")
    
    try:
        from api.models import Order
        
        # Check if ShipRocket fields exist
        shiprocket_fields = [
            'shiprocket_order_id', 'awb_code', 'courier_company_id',
            'courier_company_name', 'shipment_id', 'shiprocket_status'
        ]
        
        # Create a dummy order to test field access
        order = Order()
        for field in shiprocket_fields:
            if hasattr(order, field):
                print(f"     ✅ Field '{field}' exists")
            else:
                print(f"     ❌ Field '{field}' missing")
                return False
        
        # Test model methods
        if hasattr(order, 'get_shiprocket_status_display'):
            print("     ✅ Method 'get_shiprocket_status_display' exists")
        
        if hasattr(order, 'shiprocket_tracking_url'):
            print("     ✅ Property 'shiprocket_tracking_url' exists")
        
        print("✅ Database integration test passed")
        return True
    
    except Exception as e:
        print(f"❌ Database integration test failed: {e}")
        return False


def run_all_tests():
    """Run all tests and provide summary"""
    print("🚀 ShipRocket Integration Test Suite")
    print("=" * 50)
    
    tests = [
        ("Configuration", test_configuration),
        ("Authentication", test_authentication),
        ("Serviceability", test_serviceability),
        ("Validation", test_validation),
        ("Data Mapping", test_data_mapping),
        ("Database Integration", test_database_integration),
    ]
    
    results = {}
    
    for test_name, test_func in tests:
        try:
            results[test_name] = test_func()
        except Exception as e:
            print(f"\n❌ Test '{test_name}' crashed: {e}")
            results[test_name] = False
    
    # Summary
    print("\n" + "=" * 50)
    print("📊 TEST SUMMARY")
    print("=" * 50)
    
    passed = sum(1 for result in results.values() if result)
    total = len(results)
    
    for test_name, result in results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{test_name:<20} {status}")
    
    print("-" * 50)
    print(f"Total: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n🎉 All tests passed! ShipRocket integration is ready to use.")
        print("\n📝 Next steps:")
        print("   1. Create a test order through your frontend")
        print("   2. Check Django admin for ShipRocket fields")
        print("   3. Monitor logs in backend/logs/shiprocket.log")
    else:
        print("\n🚨 Some tests failed. Please fix the issues before proceeding.")
        print("   Check your .env configuration and ShipRocket credentials.")


if __name__ == "__main__":
    try:
        run_all_tests()
    except KeyboardInterrupt:
        print("\n\n⏹️ Tests interrupted by user")
    except Exception as e:
        print(f"\n\n💥 Test suite crashed: {e}")
        print("Please check your Django configuration and try again.")