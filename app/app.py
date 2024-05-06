from flask import Flask, request, jsonify, Blueprint
import json, requests
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_migrate import Migrate
from flask_cors import CORS, cross_origin
from mpesa_payment import MpesaPayment
from werkzeug.security import generate_password_hash, check_password_hash
import os
from os import environ

app = Flask(__name__)
BASEDIR = os.path.join(os.path.dirname(__file__))

CORS(app)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})
CORS(app, origins="http://127.0.0.1:5173")




# Database connection
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(BASEDIR, 'app.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# payment bleuprints
payments_bp = Blueprint('payments', __name__)
app.register_blueprint(payments_bp)

# Init db
db = SQLAlchemy(app)

# Init Marshmallow
ma = Marshmallow(app)

migrate = Migrate(app, db)
# @app.after_request
# def after_request(response):
#     response.headers.add('Access-Control-Allow-Origin', 'http://127.0.0.1:5173')
#     response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
#     response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
#     return response

@app.route('/trips', methods=['OPTIONS'])
def handle_options():
    return jsonify(), 200, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    }
    

@app.route('/payments', methods=['OPTIONS'])
def handle_payments_options():
    return jsonify(), 200, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    }

# User model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    # role = db.Column(db.String(20), nullable=False)  # Admin or Bus Operator

    def check_password(self, password):
        return check_password_hash(self.password, password)

# Trip Model
class Trip(db.Model):
    __tablename__ = 'trips'
    id = db.Column(db.Integer, primary_key=True)
    departure_time = db.Column(db.String(255), nullable=False)
    arrival_time = db.Column(db.String(255), nullable=False)
    route = db.Column(db.String(100), nullable=False)
    bus_identifier = db.Column(db.String(50), nullable=False)

    def __init__(self, departure_time, arrival_time, route, bus_identifier):
        self.departure_time = departure_time
        self.arrival_time = arrival_time
        self.route = route
        self.bus_identifier = bus_identifier

    def to_dict(self):
        return {
            'id': self.id,
            'departureTime': self.departure_time,
            'arrivalTime': self.arrival_time,
            'route': self.route,
            'busIdentifier': self.bus_identifier
        }
        
#  payments
class Payment(db.Model):
    __tablename__ = 'payments'
    id = db.Column(db.Integer, primary_key=True)
    amount = db.Column(db.Float, nullable=False)
    phone_number = db.Column(db.String(20), nullable=False)
    payment_method = db.Column(db.String(50), nullable=False)
    trip_id = db.Column(db.Integer, db.ForeignKey('trips.id'), nullable=False)
    trip = db.relationship('Trip', backref=db.backref('payments', lazy=True))
    
    def __init__(self, amount, phone_number, payment_method, trip_id):
        self.amount = amount
        self.phone_number = phone_number
        self.payment_method = payment_method
        self.trip_id = trip_id

    def to_dict(self):
        return {
            'id': self.id,
            'amount': self.amount,
            'phone_number': self.phone_number,
            'payment_method': self.payment_method,
            'trips_id': self.trip_id
        }
        

    def __repr__(self):
        return f"<Payment {self.id}>" # Mobile Money or Cash
    

@app.route("/payments", methods=["POST"])
@cross_origin(origin="http://127.0.0.1:5173")
def process_payment():
    data = request.get_json()
    amount = data.get('amount')
    phone_number = data.get('phoneNumber')
    payment_method = data.get('paymentMethod')
    
    
    if not all([amount, phone_number, payment_method]):
        return jsonify({'error': 'Amount and phone number are required'}), 400

    try:
        mpesa = MpesaPayment(app.config, phone_number)
        authorization = json.loads(mpesa.authorization())
        access_token = authorization["access_token"]
        
        callback_url = f"{request.host}/confirm_payment" \
            if environ.get("ENVIRONMENT") == "PRODUCTION" \
            else "https://picpazz.com"
        
        payment_response = mpesa.stk_push(access_token, amount=amount, callback_url=callback_url)
        
        # Record the payment in the database
        payment = Payment(amount=amount, phone_number=phone_number, payment_method='M-Pesa')
        db.session.add(payment)
        db.session.commit()
        
        return jsonify({'success': True, 'response': json.loads(payment_response)}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
    
@app.route("/confirm_payment")
def confirm_payment():
    print(request.get_json)
    return "Thank you"
    
MOBILE_MONEY_REFUND_API = "https://sandbox.safaricom.co.ke/refund"

@app.route('/payments/<int:payment_id>/refund', methods=['POST'])
def refund_payment(payment_id):
    payment = Payment.query.get(payment_id)
    if not payment:
        return jsonify({'error': 'Payment not found'}), 404

    try:
        # Initiate refund through mobile money API
        refund_data = {
            'amount': payment.amount,
            'phone_number': payment.phone_number
        }
        headers = {
            'Authorization': 'Bearer YOUR_API_KEY',
            'Content-Type': 'application/json'
        }
        response = requests.post(MOBILE_MONEY_REFUND_API, json=refund_data, headers=headers)
        
        if response.ok:
            # Refund successful, delete payment record
            db.session.delete(payment)
            db.session.commit()
            return jsonify({'success': True, 'message': 'Payment refunded successfully'}), 200
        else:
            # Refund failed
            return jsonify({'error': 'Failed to refund payment. Mobile money API returned an error.'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/trips/<int:trip_id>/payments', methods=['GET'])
def get_trip_payments(trip_id):
    trip = Trip.query.get(trip_id)
    if not trip:
        return jsonify({'error': 'Trip not found'}), 404

    payments = Payment.query.filter_by(trip_id=trip_id).all()
    payment_data = [{'id': payment.id, 'amount': payment.amount, 'phone_number': payment.phone_number, 'payment_method': payment.payment_method} for payment in payments]

    return jsonify({'trip_id': trip_id, 'payments': payment_data}), 200
    
    # MONILE-PAYMENTS
# MOBILE_MONEY_API = "https://example.com/mobile_money/api/pay"
# API_KEY = "YOUR_API_KEY"

# def initiate_payment(amount, user_id):
#     data = {
#         "amount": amount,
#         "user_id": user_id
#     }
#     headers = {
#         "Authorization": f"Bearer {API_KEY}",
#         "Content-Type": "application/json"
#     }
#     try:
#         response = requests.post(MOBILE_MONEY_API, json=data, headers=headers)
#         response.raise_for_status()  # Raise exception for non-2xx status codes
#         return "Payment initiated successfully"
#     except requests.exceptions.RequestException as e:
#         # Handle any exceptions that occur during the request (e.g., network errors)
#         return f"Failed to initiate payment: {e}"
#     except Exception as e:
#         # Handle any other unexpected exceptions
#         return f"An unexpected error occurred: {e}"
fare_transactions = []

# Endpoint to record fare transactions
@app.route("/fare_transactions", methods=["POST"])
def record_fare_transaction():
    data = request.get_json()
    fare_transactions.append(data)
    return jsonify({"message": "Fare transaction recorded successfully"}), 201

# Endpoint to handle fare refunds
@app.route("/fare_refunds", methods=["POST"])
def handle_fare_refund():
    data = request.get_json()
    # Logic to process fare refund
    return jsonify({"message": "Fare refund processed successfully"}), 200

# Report Model
@app.route('/')
def index():
    return 'Hello, World!'
    
# Trips
class TripSchema(ma.Schema):
    class Meta:
        fields = ('id', 'departure_time', 'arrival_time', 'route', 'bus_identifier')

Trip_schema = TripSchema()
Trips_schema = TripSchema(many=True)

with app.app_context():
    db.create_all()
@app.route('/trips', methods=['GET'])
def get_trips():
    trips = Trip.query.all()
    return Trips_schema.jsonify(trips)

@app.route('/trips/<int:trip_id>', methods=['GET'])
def get_trip(trip_id):
    trip = Trip.query.get(trip_id)
    if not trip:
        return jsonify({'error': 'Trip not found'}), 404
    return Trip_schema.jsonify(trip)

@app.route('/trips', methods=['POST'])
def add_trip():
    try:
        data = request.get_json()
        departure_time = data.get('departureTime')
        arrival_time = data.get('arrivalTime')
        route = data.get('route')
        bus_identifier = data.get('busIdentifier')

        # Data validation
        if not all([departure_time, arrival_time, route, bus_identifier]):
            return jsonify({'error': 'All fields are required'}), 400

        # Additional validation checks
        if departure_time >= arrival_time:
            return jsonify({'error': 'Departure time must be before arrival time'}), 400

        # Create a new Trip instance
        new_trip = Trip(departure_time=departure_time, arrival_time=arrival_time, route=route, bus_identifier=bus_identifier)
        db.session.add(new_trip)
        db.session.commit()

        return jsonify({'message': 'Trip added successfully'}), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500



@app.route('/trips/<int:trip_id>', methods=['PUT'])
def update_trip(trip_id):
    trip = Trip.query.get(trip_id)
    if not trip:
        return jsonify({'error': 'Trip not found'}), 404

    data = request.get_json()
    trip.departure_time = data['departureTime']
    trip.arrival_time = data['arrivalTime']
    trip.route = data['route']
    trip.bus_identifier = data['busIdentifier']

    db.session.commit()
    return jsonify({'message': 'Trip updated successfully'})

@app.route('/trips/<int:trip_id>', methods=['DELETE'])
def delete_trip(trip_id):
    trip = Trip.query.get(trip_id)
    if not trip:
        return jsonify({'error': 'Trip not found'}), 404

    db.session.delete(trip)
    db.session.commit()
    return jsonify({'message': 'Trip deleted successfully'})


@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    

    if not username or not email or not password:
        return jsonify({'message': 'Username, email, and password are required'}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({'message': 'Username already exists'}), 400

    hashed_password = generate_password_hash(password)  # Hash the password
    new_user = User(username=username, email=email, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User registered successfully'}), 201

# User login route
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()

    if not user or not user.check_password(password):  # Check password using check_password_hash
        return jsonify({'message': 'Invalid email or password'}), 401

    return jsonify({'message': 'Login successful'}), 200



if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, host='0.0.0.0')