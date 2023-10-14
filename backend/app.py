from flask import Flask
#from flask_session import Session
from flask_dynamo import Dynamo
from flask_cors import CORS
import key_config as keys
import boto3
import os
from flask_jwt_extended import JWTManager


# Genera una clave secreta aleatoria
def generate_secret_key():
    return os.urandom(16).hex()


app = Flask(__name__)
app.secret_key = generate_secret_key()
#app.config['SESSION_TYPE'] = 'filesystem'
#Session(app)
app.config['JWT_SECRET_KEY'] = generate_secret_key()  # Cambia esto a una clave aleatoria y segura
jwt = JWTManager(app)
# Configuración de CORS
cors = CORS(app, resources={r"/*": {"origins": "*"}})

dynamodb = boto3.resource(
    'dynamodb', region_name='us-east-1',
    aws_access_key_id=keys.ACCESS_KEY_ID,
    aws_secret_access_key=keys.ACCESS_SECRET_KEY,
)

import views

