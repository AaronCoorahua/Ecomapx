from app import app, dynamodb
from flask import jsonify, request
import hashlib
import uuid

@app.route('/')
def index():
    return 'Hola desde Flask!'

@app.route('/register', methods=['POST'])
def register():
    try:
        user_type = request.json['user_type']
        nombre = request.json['nombre']
        apellidos = request.json['apellidos']
        b_date = request.json['b_date']
        email = request.json['email']
        contrasena = request.json['contrasena']
        genero = request.json['genero']

        #Verificar tipo de usuario y seleccionar tabla
        if user_type == "ecobuscador":
            table = dynamodb.Table('ecobuscadores')
            data = {
                id:str(uuid.uuid4()),
                'nombres':nombre,
                'apellidos':apellidos,
                'b_date':b_date,
                'descripcion':None,
                'email':email,
                'contrasena': hashlib.sha256(contrasena.encode()).hexdigest(),
                'genero':genero,
                'pais':None,
                'provincia' : None,
                'telefono':None,
                'count_events': None,
                'list_events':None,
                'rol':'ecobuscador',
                'foto': None
            }
        elif user_type == "ecoorganizador":
            table = dynamodb.Table('ecoorganizador')
            data = {
                id:str(uuid.uuid4()),
                'nombres':nombre,
                'apellidos':apellidos,
                'b_date':b_date,
                'descripcion':None,
                'asosiacion':None,
                'email':email,
                'contrasena': hashlib.sha256(contrasena.encode()).hexdigest(),
                'genero':genero,
                'pais':None,
                'provincia':None,
                'telefono':None,
                'created_events':None,
                'promedio': None,
                'rol':'ecoorganizador',
                'foto': None
            }
        else:
            return jsonify({'error':'Invalid user type'}),400
        table.put_item(Item=data)
        return jsonify({'message': f'{user_type} registered successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

@app.route('/login', methods=['POST'])
def login():
    try:
        user_type = request.json['usertype']
        email = request.json['email']
        contrasena = request.json['contrasena']

         # Hashear la contraseña para compararla con la almacenada
        hashed_password = hashlib.sha256(contrasena.encode()).hexdigest()


        if 'Item' not in response:
            return jsonify({'error': 'Username not found'}), 404

        stored_password = response['Item']['password']
        hashed_password = hashlib.sha256(password.encode()).hexdigest()

        if stored_password != hashed_password:
            return jsonify({'error': 'Invalid password'}), 401

        # Aquí puedes generar un token o simplemente responder exitosamente
        # Si usas un token, Flask-JWT-Extended es una buena opción para manejar JWTs
        return jsonify({'message': 'Logged in successfully'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500