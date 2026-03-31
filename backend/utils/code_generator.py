import random
import string

def generate_reservation_code():
    """Generate a unique reservation code like SALON-8F3K92"""
    prefix = "SALON"
    random_part = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
    return f"{prefix}-{random_part}"