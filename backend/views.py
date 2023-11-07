from app import app, dynamodb
from flask import jsonify, request
from boto3.dynamodb.conditions import Key
import hashlib
import uuid
from flask_jwt_extended import create_access_token, get_jwt_identity,get_jwt, jwt_required

import re
from bs4 import BeautifulSoup

def sanitize_text(text, max_length=500):
    # 1. Escape de caracteres especiales
    text = re.escape(text)
    
    # 2. Eliminar etiquetas HTML y JavaScript
    soup = BeautifulSoup(text, "html.parser")
    sanitized_text = soup.get_text()
    
    # 3. Limitar la longitud del texto
    if len(sanitized_text) > max_length:
        sanitized_text = sanitized_text[:max_length]
    
    # 4. Uso de listas negras
    blacklist = ["badword1", "badword2"]  # Define tus propias palabras prohibidas
    for word in blacklist:
        sanitized_text = sanitized_text.replace(word, "***")  # Reemplazar palabras prohibidas con ***

    return sanitized_text


@app.route('/')
def index():
    return 'Hola desde Flask!'

#------------------------
#METODOS PARA EL USUARIO
#------------------------


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
            table = dynamodb.Table('ecoorganizadores')
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
                'created_events':[],
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


        access_token = create_access_token(identity=user['id'], additional_claims={"rol": user['rol']})
        return jsonify({
            'message': 'Logged in successfully',
            'token': access_token,
            'id': user['id'],
            'nombre': user['nombres'],
            'b_date': user['b_date'],
            'genero': user['genero']
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

   
    
@app.route('/get_user_profile', methods=['GET'])
@jwt_required()
def get_user_profile():
    current_user_id = get_jwt_identity()
    current_user_rol = get_jwt()['rol']
    
    try:
        # Seleccionar la tabla basada en el rol del usuario
        if current_user_rol == 'ecobuscador':
            table = dynamodb.Table('ecobuscadores')
        elif current_user_rol == 'ecoorganizador':
            table = dynamodb.Table('ecoorganizadores')
        else:
            return jsonify({'error': 'Invalid role'}), 400

        response = table.get_item(Key={'id': current_user_id})
        
        # Verificar si se encontró al usuario
        if 'Item' not in response:
            return jsonify({'error': 'User not found'}), 404
        
        user = response['Item']
        del user['contrasena']
        return jsonify(user), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/user', methods=['DELETE'])
def delete_user():
    try:
        user_id = request.json['user_id']
        table = dynamodb.Table('ecobuscadores')
        response = table.delete_item(Key={'id': user_id})

        if response['ResponseMetadata']['HTTPStatusCode'] == 400:  
            table = dynamodb.Table('ecoorganizadores')
            response = table.delete_item(Key={'id': user_id})
        if response['ResponseMetadata']['HTTPStatusCode'] == 400: 
            return jsonify({'error': 'User not found'}), 404

        return jsonify({'message': 'User deleted successfully'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

#------------------------
#METODOS PARA LOS EVENTOS
#------------------------

@app.route('/create_event', methods=['POST'])
@jwt_required()
def create_event():
    current_user_id = get_jwt_identity()
    try:

        nombre = request.json['nombre']
        banner = request.json.get('banner', '') 
        fotos = request.json.get('fotos', [])   
        ubicacion = request.json['ubicacion']
        puntaje = int(request.json.get('puntaje', 0))  
        descripcion = request.json['descripcion']
        descrip_detail = request.json['descrip_detail']
        tag = request.json['tag']
        capacidad = int(request.json['capacidad'])
        duracion = int(request.json['duracion'])  
        fecha = request.json['fecha']
        hora = request.json['hora']
        status = request.json['status']
        resenas = request.json.get('resenas', [])  
        confirmados = int(request.json.get('confirmados', 0))  
        coordenadas = request.json.get('map_coordinates', {})


        table = dynamodb.Table('eventos')
        event_id = str(uuid.uuid4())

        data = {
            'id': event_id,
            'id_organizador': current_user_id,
            'nombre': nombre,
            'banner': banner,
            'fotos': fotos,
            'ubicacion': ubicacion,
            'puntaje': puntaje,
            'descripcion': descripcion,
            'descrip_detail': descrip_detail,
            'tag': tag,
            'capacidad': capacidad,
            'duracion': duracion,
            'fecha': fecha,
            'hora': hora,
            'status': status,
            'resenas': resenas,
            'confirmados': confirmados
        }
        table.put_item(Item=data)
        
        ecoorganizadores_table = dynamodb.Table('ecoorganizadores')
        organizer = ecoorganizadores_table.get_item(Key={'id': current_user_id}).get('Item', {})
        if 'created_events' not in organizer:
            organizer['created_events'] = []

        response = ecoorganizadores_table.update_item(
            Key={
                'id': current_user_id
            },
            UpdateExpression="SET created_events = list_append(if_not_exists(created_events, :emptyList), :event_id)",
            ExpressionAttributeValues={
                ':event_id': [event_id],
                ':emptyList': []
            },
            ReturnValues="UPDATED_NEW"
        )


        if response['ResponseMetadata']['HTTPStatusCode'] != 200:
            return jsonify({'error': 'Failed to update ecoorganizadores table'}), 500

        return jsonify({'message': 'Event created successfully', 'event_id': event_id}), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

@app.route('/listEvents', methods=['GET'])
@jwt_required()
def list_events():
    try:
        table = dynamodb.Table('eventos')
        # Escaneamos la tabla para obtener todos los eventos
        response = table.scan()
        if 'Items' not in response:
            return jsonify({'error': 'Failed to fetch events'}), 500

        events = response['Items']

        # Devolvemos la lista de eventos
        return jsonify(events), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/add_review', methods=['POST'])
@jwt_required()
def add_review():
    try:
        user_id = get_jwt_identity() 
        event_id = request.json['event_id']  
        review_text = request.json['review']  
        # Sanear el texto del comentario
        sanitized_review = sanitize_text(review_text)
        review_data = {
            'user_id': user_id,
            'review': sanitized_review
        }
        table = dynamodb.Table('eventos')
        response = table.update_item(
            Key={'id': event_id},
            UpdateExpression="SET resenas = list_append(resenas, :new_review)",
            ExpressionAttributeValues={
                ':new_review': [review_data],
            }
        )


        if response['ResponseMetadata']['HTTPStatusCode'] == 200:
            return jsonify({'message': 'Review added successfully'}), 201
        else:
            return jsonify({'error': 'Failed to add review'}), 500

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    