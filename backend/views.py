from app import app, dynamodb
from flask import jsonify, request
from boto3.dynamodb.conditions import Key
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
        print("Llamado al register")
        #Verificar tipo de usuario y seleccionar tabla
        if user_type == "ecobuscador":
            table = dynamodb.Table('ecobuscadores')
            data = {
                'id':str(uuid.uuid4()),
                'nombres':nombre,
                'apellidos':apellidos,
                'b_date':b_date,
                'ciudad': None,
                'descripcion':None,
                'email':email,
                'contrasena': hashlib.sha256(contrasena.encode()).hexdigest(),
                'genero':genero,
                'pais':None,
                'ciudad': None,
                'telefono':None,
                'count_events': None,
                'list_events':None,
                'rol':'ecobuscador',
                'foto': None
            }
        elif user_type == "ecoorganizador":
            table = dynamodb.Table('ecoorganizador')
            data = {
                'id':str(uuid.uuid4()),
                'nombres':nombre,
                'apellidos':apellidos,
                'b_date':b_date,
                'descripcion':None,
                'asosiacion':None,
                'email':email,
                'contrasena': hashlib.sha256(contrasena.encode()).hexdigest(),
                'genero':genero,
                'pais':None,
                'ciudad':None,
                'telefono':None,
                'created_events':None,
                'promedio': None,
                'rol':'ecoorganizador',
                'foto': None
            }
        else:
            return jsonify({'error':'Invalid user type'}),400
        print(data)
        table.put_item(Item=data)
        return jsonify({'message': f'{user_type} registered successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

@app.route('/login', methods=['POST'])
def login():
    try:
        user_type = request.json['user_type']
        email = request.json['email']
        contrasena = request.json['contrasena']

        # Hashear la contraseña para compararla con la almacenada
        hashed_password = hashlib.sha256(contrasena.encode()).hexdigest()
       
        # Determinar que tabla buscar primero:
        if user_type == "ecobuscador":
            primary_table = dynamodb.Table('ecobuscadores')
        elif user_type == "ecoorganizador":
            primary_table = dynamodb.Table('ecoorganizadores')
        else:
            print("Invalid user type")
            return jsonify({'error':'Invalid user type'}),400
        
        response = primary_table.query(
            IndexName = 'email_index',
            KeyConditionExpression = Key('email').eq(email)
        )

        if not response.get('Items'):
            print("Email not found in database")
            return jsonify({'error': 'Email not found in database'})
        
        user = response['Items'][0]
        stored_password = user['contrasena']
    
        if stored_password != hashed_password:
            print("Invalid Password")
            return jsonify({'error':'Invalid password'})


        # En este punto, el inicio de sesión fue exitoso
        print("Logueo exitoso")
        return jsonify({
            'message': 'Logged in successfully',
            'id': user['id'],
            'nombre': user['nombres'],
            'b_date': user['b_date'],
            'genero': user['genero']
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

   
    
@app.route('/user/<user_id>', methods=['GET'])
def get_user_details(user_id):
    try:
        table = dynamodb.Table('ecobuscadores')
        # Buscar primero en la tabla 'ecobuscadores'
        response = table.get_item(Key={'id': user_id})
        # Si no se encuentra en 'ecobuscadores', buscar en 'ecoorganizadores'
        if 'Item' not in response:
            table = dynamodb.Table('ecoorganizadores')
            response = table.get_item(Key={'id': user_id})
        # Si no se encuentra en ambas tablas
        if 'Item' not in response:
            return jsonify({'error': 'User not found'}), 404
        user = response['Item']
        # Eliminando la contraseña del objeto de respuesta por razones de seguridad
        del user['contrasena']
        return jsonify(user), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500



@app.route('/user', methods=['DELETE'])
def delete_user():
    try:
        user_id = request.json['user_id']

        # Asumimos que el usuario será, por defecto, un "ecobuscador"
        table = dynamodb.Table('ecobuscadores')
        response = table.delete_item(Key={'id': user_id})

        if response['ResponseMetadata']['HTTPStatusCode'] == 400:  
            table = dynamodb.Table('ecoorganizadores')
            response = table.delete_item(Key={'id': user_id})
        # Si no se encuentra en ambas tablas
        if response['ResponseMetadata']['HTTPStatusCode'] == 400: 
            return jsonify({'error': 'User not found'}), 404

        return jsonify({'message': 'User deleted successfully'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500