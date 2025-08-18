"""
Django management command to set up development/test data for Groovystreetz backend.
Run after migrations to populate database with sample data.

Usage: python manage.py setup_dev_data
"""

from django.core.management.base import BaseCommand, CommandError
from django.contrib.auth import get_user_model
from django.db import transaction
from decimal import Decimal
import json

from api.models import Category, Product, Order, OrderItem

User = get_user_model()


class Command(BaseCommand):
    help = 'Set up development/test data for Groovystreetz backend'

    def add_arguments(self, parser):
        parser.add_argument(
            '--reset',
            action='store_true',
            help='Reset existing data before creating new data',
        )
        parser.add_argument(
            '--admin-email',
            type=str,
            default='admin@groovystreetz.com',
            help='Email for admin user (default: admin@groovystreetz.com)',
        )
        parser.add_argument(
            '--admin-password',
            type=str,
            default='admin123',
            help='Password for admin user (default: admin123)',
        )

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('🚀 Setting up Groovystreetz development data...'))
        
        try:
            with transaction.atomic():
                if options['reset']:
                    self.reset_data()
                
                self.create_users(options)
                self.create_categories()
                self.create_products()
                self.create_sample_orders()
                
            self.stdout.write(self.style.SUCCESS('✅ Development data setup completed successfully!'))
            self.print_summary(options)
            
        except Exception as e:
            raise CommandError(f'Error setting up data: {str(e)}')

    def reset_data(self):
        """Reset existing data"""
        self.stdout.write('🔄 Resetting existing data...')
        
        OrderItem.objects.all().delete()
        Order.objects.all().delete()
        Product.objects.all().delete()
        Category.objects.all().delete()
        User.objects.filter(is_superuser=False).delete()
        
        self.stdout.write('✅ Data reset completed')

    def create_users(self, options):
        """Create admin and test users"""
        self.stdout.write('👥 Creating users...')
        
        # Create superadmin user
        admin_email = options['admin_email']
        admin_password = options['admin_password']
        
        if not User.objects.filter(email=admin_email).exists():
            admin_user = User.objects.create_user(
                username='admin',
                email=admin_email,
                password=admin_password,
                first_name='Admin',
                last_name='User',
                role='superadmin',
                is_staff=True,
                is_superuser=True
            )
            self.stdout.write(f'  ✅ Created superadmin: {admin_email}')
        else:
            admin_user = User.objects.get(email=admin_email)
            admin_user.role = 'superadmin'
            admin_user.is_staff = True
            admin_user.is_superuser = True
            admin_user.save()
            self.stdout.write(f'  ✅ Updated existing admin: {admin_email}')

        # Create regular admin user
        if not User.objects.filter(email='manager@groovystreetz.com').exists():
            User.objects.create_user(
                username='manager',
                email='manager@groovystreetz.com',
                password='manager123',
                first_name='Store',
                last_name='Manager',
                role='admin',
                is_staff=True
            )
            self.stdout.write('  ✅ Created admin: manager@groovystreetz.com')

        # Create test customer users
        test_customers = [
            {
                'username': 'testcustomer1',
                'email': 'customer1@test.com',
                'password': 'test123',
                'first_name': 'John',
                'last_name': 'Doe'
            },
            {
                'username': 'testcustomer2', 
                'email': 'customer2@test.com',
                'password': 'test123',
                'first_name': 'Jane',
                'last_name': 'Smith'
            }
        ]
        
        for customer_data in test_customers:
            if not User.objects.filter(email=customer_data['email']).exists():
                User.objects.create_user(
                    username=customer_data['username'],
                    email=customer_data['email'],
                    password=customer_data['password'],
                    first_name=customer_data['first_name'],
                    last_name=customer_data['last_name'],
                    role='customer'
                )
                self.stdout.write(f'  ✅ Created customer: {customer_data["email"]}')

    def create_categories(self):
        """Create product categories"""
        self.stdout.write('📁 Creating categories...')
        
        categories_data = [
            {
                'name': 'Streetwear',
                'slug': 'streetwear'
            },
            {
                'name': 'Accessories',
                'slug': 'accessories'
            },
            {
                'name': 'Footwear',
                'slug': 'footwear'
            },
            {
                'name': 'Electronics',
                'slug': 'electronics'
            }
        ]
        
        for cat_data in categories_data:
            category, created = Category.objects.get_or_create(
                name=cat_data['name'],
                defaults={'slug': cat_data['slug']}
            )
            if created:
                self.stdout.write(f'  ✅ Created category: {category.name}')

    def create_products(self):
        """Create sample products"""
        self.stdout.write('🛍️ Creating products...')
        
        # Get categories
        streetwear = Category.objects.get(name='Streetwear')
        accessories = Category.objects.get(name='Accessories')
        footwear = Category.objects.get(name='Footwear')
        electronics = Category.objects.get(name='Electronics')
        
        products_data = [
            {
                'name': 'Groovy Street Hoodie',
                'description': 'Premium cotton hoodie with urban street design',
                'price': Decimal('79.99'),
                'category': streetwear,
                'stock': 50
            },
            {
                'name': 'Urban Graphic Tee',
                'description': 'Comfortable cotton t-shirt with street art graphics',
                'price': Decimal('29.99'),
                'category': streetwear,
                'stock': 100
            },
            {
                'name': 'Street Style Cap',
                'description': 'Adjustable snapback cap with embroidered logo',
                'price': Decimal('24.99'),
                'category': accessories,
                'stock': 75
            },
            {
                'name': 'Groovy Backpack',
                'description': 'Durable backpack for urban adventures',
                'price': Decimal('59.99'),
                'category': accessories,
                'stock': 30
            },
            {
                'name': 'Street Runner Sneakers',
                'description': 'Comfortable sneakers for street style',
                'price': Decimal('129.99'),
                'category': footwear,
                'stock': 40
            },
            {
                'name': 'Urban Boots',
                'description': 'Stylish boots for street fashion',
                'price': Decimal('149.99'),
                'category': footwear,
                'stock': 25
            },
            {
                'name': 'Wireless Earbuds',
                'description': 'Premium wireless earbuds for music lovers',
                'price': Decimal('89.99'),
                'category': electronics,
                'stock': 60
            },
            {
                'name': 'Phone Case - Street Art',
                'description': 'Protective phone case with street art design',
                'price': Decimal('19.99'),
                'category': electronics,
                'stock': 150
            }
        ]
        
        for product_data in products_data:
            product, created = Product.objects.get_or_create(
                name=product_data['name'],
                defaults=product_data
            )
            if created:
                self.stdout.write(f'  ✅ Created product: {product.name} - ${product.price}')

    def create_sample_orders(self):
        """Create sample orders for testing"""
        self.stdout.write('📦 Creating sample orders...')
        
        # Get test customers
        try:
            customer1 = User.objects.get(email='customer1@test.com')
            customer2 = User.objects.get(email='customer2@test.com')
        except User.DoesNotExist:
            self.stdout.write('  ⚠️ Test customers not found, skipping sample orders')
            return
        
        # Get some products
        products = Product.objects.all()[:4]
        if len(products) < 2:
            self.stdout.write('  ⚠️ Not enough products, skipping sample orders')
            return
        
        # Create sample orders
        orders_data = [
            {
                'user': customer1,
                'shipping_address': '123 Street Style Ave, Urban City, UC 12345',
                'items': [
                    {'product': products[0], 'quantity': 1},
                    {'product': products[1], 'quantity': 2}
                ]
            },
            {
                'user': customer2,
                'shipping_address': '456 Groovy Lane, Hip Town, HT 67890',
                'items': [
                    {'product': products[2], 'quantity': 1},
                    {'product': products[3], 'quantity': 1}
                ]
            }
        ]
        
        for order_data in orders_data:
            # Calculate total
            total_price = sum(
                item['product'].price * item['quantity'] 
                for item in order_data['items']
            )
            
            order = Order.objects.create(
                user=order_data['user'],
                shipping_address=order_data['shipping_address'],
                total_price=total_price,
                original_price=total_price,
                status='pending'
            )
            
            # Create order items
            for item_data in order_data['items']:
                OrderItem.objects.create(
                    order=order,
                    product=item_data['product'],
                    quantity=item_data['quantity'],
                    price=item_data['product'].price
                )
            
            self.stdout.write(f'  ✅ Created order for {order.user.email} - ${order.total_price}')

    def print_summary(self, options):
        """Print setup summary"""
        self.stdout.write('\n' + '='*50)
        self.stdout.write(self.style.SUCCESS('🎉 GROOVYSTREETZ DEV DATA SETUP COMPLETE'))
        self.stdout.write('='*50)
        
        # User counts
        total_users = User.objects.count()
        superadmins = User.objects.filter(role='superadmin').count()
        admins = User.objects.filter(role='admin').count()
        customers = User.objects.filter(role='customer').count()
        
        self.stdout.write(f'👥 Users Created: {total_users} total')
        self.stdout.write(f'   - Superadmins: {superadmins}')
        self.stdout.write(f'   - Admins: {admins}')
        self.stdout.write(f'   - Customers: {customers}')
        
        # Product counts
        categories = Category.objects.count()
        products = Product.objects.count()
        
        self.stdout.write(f'🛍️ Products: {products} total in {categories} categories')
        
        # Order counts
        orders = Order.objects.count()
        order_items = OrderItem.objects.count()
        
        self.stdout.write(f'📦 Sample Orders: {orders} orders with {order_items} items')
        
        # Login credentials
        self.stdout.write('\n🔑 LOGIN CREDENTIALS:')
        self.stdout.write(f'   Superadmin: {options["admin_email"]} / {options["admin_password"]}')
        self.stdout.write('   Admin: manager@groovystreetz.com / manager123')
        self.stdout.write('   Customer: customer1@test.com / test123')
        self.stdout.write('   Customer: customer2@test.com / test123')
        
        self.stdout.write('\n🧪 TESTING:')
        self.stdout.write('   Run: python simple_api_test.py')
        self.stdout.write('   All endpoints should now work with sample data')
        
        self.stdout.write('\n' + '='*50)