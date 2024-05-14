from flask_marshmallow import Marshmallow
from flask import Flask
from flask_restful import Resource
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import check_password_hash

app = Flask(__name__)
db = SQLAlchemy()

# Init Marshmallow
ma = Marshmallow(app)


# User model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    # role = db.Column(db.String(20), nullable=False)  # Admin or Bus Operator

    def check_password(self, password):
        return check_password_hash(self.password, password)

# Trips
class TripSchema(ma.Schema):
    class Meta:
        fields = ('id', 'departure_time', 'arrival_time', 'from_route', 'to_route', 'bus_identifier')

Trip_schema = TripSchema()
Trips_schema = TripSchema(many=True)
# Trip Model
class Trip(db.Model):
    __tablename__ = 'trips'
    id = db.Column(db.Integer, primary_key=True)
    departure_time = db.Column(db.String(255), nullable=False)
    arrival_time = db.Column(db.String(255), nullable=False)
    from_route = db.Column(db.String(100), nullable=False)
    to_route = db.Column(db.String(100), nullable=False)
    bus_identifier = db.Column(db.String(50), nullable=False)

    def __init__(self, departure_time, arrival_time, from_route, to_route, bus_identifier):
        self.departure_time = departure_time
        self.arrival_time = arrival_time
        self.from_route = from_route
        self.to_route = to_route
        self.bus_identifier = bus_identifier

    def to_dict(self):
        return {
            'id': self.id,
            'departureTime': self.departure_time,
            'arrivalTime': self.arrival_time,
            'route': self.from_route + ' - ' + self.to_route,
            'busIdentifier': self.bus_identifier
        }
        
class TripResource(Resource):
    def get(self, trip_id):
        trip = Trip.query.get(trip_id)
        if not trip:
            return {'error': 'Trip not found'}, 404
        return Trips_schema.dump(trip)
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
    