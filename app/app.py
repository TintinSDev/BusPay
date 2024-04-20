from flask import Flask, request, jsonify, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_migrate import Migrate
from flask_cors import CORS
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
import os

app = Flask(__name__)
BASEDIR = os.path.join(os.path.dirname(__file__))

CORS(app)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})



# Database connection
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(BASEDIR, 'app.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Init db
db = SQLAlchemy(app)

# Init Marshmallow
ma = Marshmallow(app)

migrate = Migrate(app, db)

@app.route('/trips', methods=['OPTIONS'])
def handle_options():
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
        
# Trips


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

@app.route('/trips/<int:trip_id>', methods=['PUT'])
def update_trip(trip_id):
    trip = Trip.query.get(trip_id)
    if not trip:
        return jsonify({'error': 'Trip not found'}), 404

    data = request.get_json()
    trip.departure_time = datetime.fromisoformat(data['departureTime'])
    trip.arrival_time = datetime.fromisoformat(data['arrivalTime'])
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

class TripSchema(ma.Schema):
    class Meta:
        fields = ('id', 'departure_time', 'arrival_time', 'route', 'bus_identifier')

Trip_schema = TripSchema()
Trips_schema = TripSchema(many=True)

with app.app_context():
    db.create_all()

@app.route('/')
def index():
    return 'Hello, World!'

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



# user_accounts = [
#     {"username": "admin", "role": "admin"},
#     {"username": "operator1", "role": "operator"},
# ]

# # Endpoint to get all user accounts
# @app.route("/users", methods=["GET"])
# def get_user_accounts():
#     return jsonify(user_accounts)

# # Endpoint to add a new user account
# @app.route("/users", methods=["POST"])
# def add_user_account():
#     data = request.get_json()
#     user_accounts.append(data)
#     return jsonify({"message": "User account added successfully"}), 201

# # Endpoint to edit user account
# @app.route("/users/<username>", methods=["PUT"])
# def edit_user_account(username):
#     data = request.get_json()
#     # Logic to update user account
#     return jsonify({"message": "User account updated successfully"}), 200

# # Endpoint to deactivate user account
# @app.route("/users/<username>", methods=["DELETE"])
# def deactivate_user_account(username):
#     # Logic to deactivate user account
#     return jsonify({"message": "User account deactivated successfully"}), 200

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, host='0.0.0.0')