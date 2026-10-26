import os
import django
from datetime import date, timedelta, time
from decimal import Decimal

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model
from turfs.models import Sport, Amenity, Turf, TurfImage, AvailabilitySlot
from bookings.models import Booking
from reviews.models import Review

User = get_user_model()


def seed():
    print("--- Seeding TurfBook Database ---")

    # 1. Create Users
    admin, created = User.objects.get_or_create(
        email='admin@turfbook.com',
        defaults={
            'username': 'admin',
            'name': 'System Administrator',
            'role': 'admin',
            'is_staff': True,
            'is_superuser': True
        }
    )
    if created:
        admin.set_password('admin123')
        admin.save()
        print("Created Superuser: admin@turfbook.com / admin123")

    owner, created = User.objects.get_or_create(
        email='owner@turfbook.com',
        defaults={
            'username': 'owner',
            'name': 'Rajesh Sharma (Owner)',
            'role': 'owner',
            'phone': '+91 9876543210',
            'is_staff': True
        }
    )
    if created:
        owner.set_password('owner123')
        owner.save()
        print("Created Owner: owner@turfbook.com / owner123")

    customer, created = User.objects.get_or_create(
        email='customer@turfbook.com',
        defaults={
            'username': 'customer',
            'name': 'Aditya Kulkarni',
            'role': 'customer',
            'phone': '+91 9123456780'
        }
    )
    if created:
        customer.set_password('customer123')
        customer.save()
        print("Created Customer: customer@turfbook.com / customer123")

    # 2. Sports
    sports_data = [
        ('Cricket', 'Trophy'),
        ('Football', 'Activity'),
        ('Box Cricket', 'Target'),
        ('Badminton', 'Zap'),
    ]
    sports_map = {}
    for name, icon in sports_data:
        sport, _ = Sport.objects.get_or_create(name=name, defaults={'icon': icon})
        sports_map[name] = sport
    print(f"Created/verified {len(sports_map)} sports.")

    # 3. Amenities
    amenities_data = [
        ('Drinking Water', 'Droplets'),
        ('Parking', 'Car'),
        ('Washroom', 'CheckCircle'),
        ('Changing Room', 'UserCheck'),
        ('Floodlights', 'Sun'),
        ('Seating Area', 'Users'),
        ('First Aid', 'HeartPulse'),
        ('Equipment Rental', 'Shield'),
        ('Cafeteria', 'Coffee'),
    ]
    amenities_map = {}
    for name, icon in amenities_data:
        amenity, _ = Amenity.objects.get_or_create(name=name, defaults={'icon': icon})
        amenities_map[name] = amenity
    print(f"Created/verified {len(amenities_map)} amenities.")

    # 4. Realistic Turfs
    sample_turfs = [
        {
            'name': 'The Arena Sports Complex',
            'city': 'Pune',
            'area': 'Kothrud',
            'address': 'Survey No. 44, Near Chandani Chowk, Paud Road, Kothrud, Pune - 411038',
            'description': 'Premier FIFA-standard artificial grass turf equipped with high-intensity LED floodlights, spacious pavilion seating, and pro cricket bowling nets.',
            'latitude': Decimal('18.507400'),
            'longitude': Decimal('73.807700'),
            'contact_phone': '+91 9822012345',
            'base_price': Decimal('1200.00'),
            'weekend_price': Decimal('1500.00'),
            'turf_type': 'outdoor',
            'cover_url': 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&w=1200&q=80',
            'sports': ['Cricket', 'Football', 'Box Cricket'],
            'amenities': ['Drinking Water', 'Parking', 'Washroom', 'Changing Room', 'Floodlights', 'Seating Area', 'Cafeteria']
        },
        {
            'name': 'Skyline Turf & Arena',
            'city': 'Pune',
            'area': 'Viman Nagar',
            'address': 'Plot 18, Behind Phoenix Marketcity, Viman Nagar, Pune - 411014',
            'description': 'Rooftop multisport ground offering breathtaking city views, rebound nets for fast box cricket, and full 7-a-side football turf.',
            'latitude': Decimal('18.567900'),
            'longitude': Decimal('73.914300'),
            'contact_phone': '+91 9822054321',
            'base_price': Decimal('1400.00'),
            'weekend_price': Decimal('1700.00'),
            'turf_type': 'outdoor',
            'cover_url': 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80',
            'sports': ['Football', 'Box Cricket'],
            'amenities': ['Drinking Water', 'Parking', 'Washroom', 'Floodlights', 'First Aid', 'Cafeteria']
        },
        {
            'name': 'Legends Turf Club',
            'city': 'Pune',
            'area': 'Baner',
            'address': 'Opposite Balewadi High Street, Baner Road, Pune - 411045',
            'description': 'State-of-the-art sports arena featuring dual cricket pitches, automated ball dispensers, professional coaching facilities, and comfortable player lounges.',
            'latitude': Decimal('18.559000'),
            'longitude': Decimal('73.786800'),
            'contact_phone': '+91 9822099887',
            'base_price': Decimal('1100.00'),
            'weekend_price': Decimal('1350.00'),
            'turf_type': 'both',
            'cover_url': 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80',
            'sports': ['Cricket', 'Football'],
            'amenities': ['Drinking Water', 'Parking', 'Washroom', 'Changing Room', 'Floodlights', 'Equipment Rental']
        },
        {
            'name': 'Urban Kick Turf',
            'city': 'Mumbai',
            'area': 'Bandra West',
            'address': 'Hill Road, Near Mehboob Studio, Bandra West, Mumbai - 400050',
            'description': 'South Mumbai and Bandra youth favorite! Shock-absorbent turf carpet, high side netting for uninterrupted games, and chilled refreshments kiosk.',
            'latitude': Decimal('19.059600'),
            'longitude': Decimal('72.829500'),
            'contact_phone': '+91 9820011223',
            'base_price': Decimal('1800.00'),
            'weekend_price': Decimal('2200.00'),
            'turf_type': 'outdoor',
            'cover_url': 'https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&w=1200&q=80',
            'sports': ['Football', 'Cricket'],
            'amenities': ['Drinking Water', 'Parking', 'Washroom', 'Changing Room', 'Floodlights', 'Seating Area', 'Cafeteria']
        },
        {
            'name': 'Bengaluru Kickers Pitch',
            'city': 'Bangalore',
            'area': 'Koramangala',
            'address': '80 Feet Road, 4th Block, Koramangala, Bengaluru - 560034',
            'description': 'Top-rated tech park weekend hub for corporate tournaments, box cricket leagues, and 5v5 futsal with electronic scoreboard.',
            'latitude': Decimal('12.935200'),
            'longitude': Decimal('77.624500'),
            'contact_phone': '+91 9845012345',
            'base_price': Decimal('1500.00'),
            'weekend_price': Decimal('1800.00'),
            'turf_type': 'outdoor',
            'cover_url': 'https://images.unsplash.com/photo-1518604666864-74239527e743?auto=format&fit=crop&w=1200&q=80',
            'sports': ['Football', 'Cricket', 'Box Cricket'],
            'amenities': ['Drinking Water', 'Parking', 'Washroom', 'Changing Room', 'Floodlights', 'Seating Area', 'Cafeteria']
        },
        {
            'name': 'Hyderabad Super Strikers Arena',
            'city': 'Hyderabad',
            'area': 'Gachibowli',
            'address': 'Near Financial District, Old Mumbai Highway, Gachibowli, Hyderabad - 500032',
            'description': 'High-performance rubber infill artificial grass turf with dedicated warm-up zones, umpire stands, and spectator bleachers.',
            'latitude': Decimal('17.440100'),
            'longitude': Decimal('78.348900'),
            'contact_phone': '+91 9849012345',
            'base_price': Decimal('1300.00'),
            'weekend_price': Decimal('1600.00'),
            'turf_type': 'both',
            'cover_url': 'https://images.unsplash.com/photo-1459865264687-595d652de67e?auto=format&fit=crop&w=1200&q=80',
            'sports': ['Cricket', 'Football'],
            'amenities': ['Drinking Water', 'Parking', 'Washroom', 'Changing Room', 'Floodlights', 'First Aid']
        }
    ]

    for item in sample_turfs:
        turf, created = Turf.objects.get_or_create(
            name=item['name'],
            defaults={
                'owner': owner,
                'city': item['city'],
                'area': item['area'],
                'address': item['address'],
                'description': item['description'],
                'latitude': item['latitude'],
                'longitude': item['longitude'],
                'contact_phone': item['contact_phone'],
                'contact_email': f"contact@{item['name'].lower().replace(' ', '')}.com",
                'base_price_per_hour': item['base_price'],
                'weekend_price_per_hour': item['weekend_price'],
                'turf_type': item['turf_type'],
                'cover_image_url': item['cover_url'],
                'approval_status': 'approved'
            }
        )

        for s_name in item['sports']:
            turf.sports.add(sports_map[s_name])

        for a_name in item['amenities']:
            turf.amenities.add(amenities_map[a_name])

        # Add gallery images
        TurfImage.objects.get_or_create(
            turf=turf,
            image_url=item['cover_url'],
            defaults={'caption': f"Main view of {turf.name}", 'is_cover': True}
        )

        # Generate sample availability slots for today, tomorrow, and next 5 days
        today = date.today()
        for day_offset in range(5):
            slot_date = today + timedelta(days=day_offset)
            # Hours 06:00 to 23:00
            for hour in [6, 7, 8, 9, 10, 16, 17, 18, 19, 20, 21, 22]:
                s_time = time(hour=hour, minute=0)
                e_time = time(hour=hour + 1, minute=0)
                is_weekend = slot_date.weekday() >= 5
                hourly_price = turf.weekend_price_per_hour if is_weekend and turf.weekend_price_per_hour else turf.base_price_per_hour

                AvailabilitySlot.objects.get_or_create(
                    turf=turf,
                    date=slot_date,
                    start_time=s_time,
                    defaults={
                        'end_time': e_time,
                        'price': hourly_price,
                        'is_blocked': False
                    }
                )

        # 5. Reviews
        Review.objects.get_or_create(
            customer=customer,
            turf=turf,
            defaults={
                'rating': 5 if 'Arena' in turf.name else 4,
                'comment': f"Fantastic playing surface and brilliant floodlights at {turf.name}! Booking through TurfBook was super smooth."
            }
        )

        print(f"Created/verified Turf: {turf.name} in {turf.city}")

    # Create a sample past booking for customer
    first_turf = Turf.objects.first()
    if first_turf:
        Booking.objects.get_or_create(
            customer=customer,
            turf=first_turf,
            booking_date=date.today() - timedelta(days=1),
            start_time=time(18, 0),
            defaults={
                'end_time': time(19, 0),
                'duration_hours': Decimal('1.00'),
                'base_price': first_turf.base_price_per_hour,
                'platform_fee': Decimal('40.00'),
                'total_price': first_turf.base_price_per_hour + Decimal('40.00'),
                'booking_status': 'completed'
            }
        )

    print("--- Database Seeding Complete! ---")


if __name__ == '__main__':
    seed()
