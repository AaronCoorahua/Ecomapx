from app import app, dynamodb
from flask import Flask, request, jsonify
import boto3
from boto3.dynamodb.conditions import Key
import hashlib
import uuid
from flask_jwt_extended import create_access_token, get_jwt_identity,get_jwt, jwt_required
import decimal
from decimal import Decimal, getcontext, Inexact, Rounded, ROUND_HALF_UP
from boto3.dynamodb.conditions import Attr
from boto3.dynamodb.types import DYNAMODB_CONTEXT
import re
from bs4 import BeautifulSoup
from datetime import datetime, timedelta
import pytz
from pytz import timezone

# Establecer el contexto para obtener 1 dígito de precisión decimal
getcontext().prec = 2
# Suponiendo que tus eventos están en UTC-5
local_tz = timezone('Etc/GMT+5')

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
        userType = request.json['userType']
        nombre = request.json['nombre']
        apellidos = request.json['apellidos']
        b_date = request.json['b_date']
        email = request.json['email']
        contrasena = request.json['contrasena']
        genero = request.json['genero']
        descripcion = request.json['descripcion']
        print("Llamado al register")

        # Definir imágenes predeterminadas basadas en el rol y el género
        default_images = {
            'ecobuscador': {
                'masculino': 'https://media.discordapp.net/attachments/996002132891271188/1171557183574511756/image_24.png?ex=655d1ca7&is=654aa7a7&hm=ae91272407d0a2a4bb49614f85738d77c7d6f90943a15be2d2a910756abad4d1&=&width=425&height=423',
                'femenino': 'https://media.discordapp.net/attachments/1155323431915630594/1171520201183998045/image_17.png?ex=655cfa35&is=654a8535&hm=7bd18544dbac9719106aee1b8e756209f2afa458da7ded9cae2c532d3be19089&=&width=421&height=423',
            },
            'ecoorganizador': {
                'masculino': 'https://media.discordapp.net/attachments/996002132891271188/1171499478965043220/52192746108.png?ex=655ce6e9&is=654a71e9&hm=829c64d55e52dd999db144bbb1aceb4f16b6dca71bfdd7ff11776bbac0652135&=&width=425&height=423',
                'femenino': 'https://media.discordapp.net/attachments/996002132891271188/1171511781114523778/image_13.png?ex=655cf25e&is=654a7d5e&hm=4750c062a637908ba6980974d245c6a4b4e39df728b872299658ebf783c4909d&=&width=418&height=423',
            }
        }

        #Verificar tipo de usuario y seleccionar tabla
        if userType == "ecobuscador":
            table = dynamodb.Table('ecobuscadores')
            data = {
                'id':str(uuid.uuid4()),
                'nombres':nombre,
                'apellidos':apellidos,
                'b_date':b_date,
                'ciudad': None,
                'descripcion':descripcion,
                'email':email,
                'contrasena': hashlib.sha256(contrasena.encode()).hexdigest(),
                'genero':genero,
                'pais':None,
                'ciudad': None,
                'telefono':None,
                'count_events': None,
                'assisted_events':[],
                'rol':'ecobuscador',
                'foto': default_images['ecobuscador'][genero],
            }
        elif userType == "ecoorganizador":
            table = dynamodb.Table('ecoorganizadores')
            data = {
                'id':str(uuid.uuid4()),
                'nombres':nombre,
                'apellidos':apellidos,
                'b_date':b_date,
                'descripcion':descripcion,
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
                'foto': default_images['ecoorganizador'][genero],
            }
        else:
            return jsonify({'error':'Invalid user type'}),400
        print(data)
        table.put_item(Item=data)
        return jsonify({'message': f'{userType} registered successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500


#METODO PARA ACTUALIZAR LA FOTO DE PERFIL:

@app.route('/update_photo', methods=['PATCH'])
@jwt_required()
def update_photo():
    try:
        # Obtén el ID del usuario actual de JWT
        current_user_id = get_jwt_identity()

        # Obtén el nuevo URL de la foto del cuerpo de la solicitud
        new_photo_url = request.json.get('photo', '')

        # Valida que el URL de la foto no esté vacío
        if not new_photo_url:
            return jsonify({'error': 'Photo URL is required'}), 400

        # Asigna la tabla de DynamoDB según el tipo de usuario
        # Esto es un ejemplo, deberás ajustar según tu lógica de negocio
        user_type = request.json.get('userType', '')
        if user_type == "ecobuscador":
            table_name = 'ecobuscadores'
        elif user_type == "ecoorganizador":
            table_name = 'ecoorganizadores'
        else:
            return jsonify({'error': 'Invalid user type'}), 400

        # Inicializa el cliente de DynamoDB

        table = dynamodb.Table(table_name)

        # Actualiza la foto del usuario en la tabla correspondiente
        response = table.update_item(
            Key={'id': current_user_id},
            UpdateExpression='SET foto = :val',
            ExpressionAttributeValues={
                ':val': new_photo_url
            },
            ReturnValues='UPDATED_NEW'
        )

        # Devuelve una respuesta exitosa con la nueva URL de la foto
        return jsonify({'message': 'Photo updated successfully', 'new_photo': new_photo_url}), 200
    
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

@app.route('/get_user_assisted_events', methods=['GET'])
@jwt_required()
def get_user_assisted_events():
    current_user_id = get_jwt_identity()
    try:
        table = dynamodb.Table('ecobuscadores')
        response = table.get_item(Key={'id': current_user_id})
        if 'Item' not in response:
            return jsonify({'error': 'Usuario no encontrado'}), 404
        user = response['Item']
        assisted_events = user.get('assisted_events', [])
        return jsonify({'assistedEvents': assisted_events}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/assist_event', methods=['POST'])
@jwt_required()
def assist_event():
    current_user_id = get_jwt_identity()
    event_id = request.json.get('event_id')
    if not event_id:
        return jsonify({'error': 'Event ID is required'}), 400

    try:
        # Actualiza la lista de eventos asistidos del usuario
        ecobuscadores_table = dynamodb.Table('ecobuscadores')
        ecobuscadores_table.update_item(
            Key={'id': current_user_id},
            UpdateExpression="SET assisted_events = list_append(if_not_exists(assisted_events, :emptyList), :event_id)",
            ExpressionAttributeValues={
                ':event_id': [event_id],
                ':emptyList': []
            }
        )

        # Incrementa el contador de confirmados en el evento
        eventos_table = dynamodb.Table('eventos')
        response = eventos_table.update_item(
            Key={'id': event_id},
            UpdateExpression="ADD confirmados :incr",
            ExpressionAttributeValues={':incr': 1},
            ReturnValues="UPDATED_NEW"
        )

        if response['ResponseMetadata']['HTTPStatusCode'] != 200:
            return jsonify({'error': 'Failed to update eventos table'}), 500

        return jsonify({'message': 'Event assisted successfully'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/event_confirm_count/<string:event_id>', methods=['GET'])
def get_confirm_count(event_id):
    try:
        table = dynamodb.Table('eventos')
        response = table.get_item(Key={'id': event_id})

        if 'Item' not in response:
            return jsonify({'error': 'Evento no encontrado'}), 404

        event = response['Item']
        confirm_count = event.get('confirmados', 0)

        return jsonify({'confirmados': confirm_count}), 200

    except Exception as e:
        print(e.response['Error']['Message'])
        return jsonify({'error': 'Error al obtener datos del evento'}), 500


@app.route('/create_event', methods=['POST'])
@jwt_required()
def create_event():
    current_user_id = get_jwt_identity()
    try:

        nombre = request.json['nombre']
        banner = request.json.get('banner', '') 
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
        coordenadas = request.json.get('coordenadas', {})
        if coordenadas:  
            coordenadas['latitude'] = Decimal(str(coordenadas['latitude']))
            coordenadas['longitude'] = Decimal(str(coordenadas['longitude']))


        table = dynamodb.Table('eventos')
        event_id = str(uuid.uuid4())
        fecha_creacion = datetime.now(pytz.timezone('America/Lima'))
        fecha_creacion_str = fecha_creacion.strftime('%d/%m/%Y %H:%M:%S')

        data = {
            'id': event_id,
            'fecha_creacion': fecha_creacion_str,
            'id_organizador': current_user_id,
            'nombre': nombre,
            'banner': banner,
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
            'confirmados': confirmados,
            'coordenadas': coordenadas
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
        # Es bueno imprimir la excepción para depurar mejor
        print("Error al procesar el evento:", e)
        return jsonify({'error': str(e)}), 500

#METODO PARA ACTUALIZAR LAS ESTRELLAS EN LOS EVENTOS:
@app.route('/rate_event', methods=['POST'])
@jwt_required()
def rate_event():

    DYNAMODB_CONTEXT.prec = 2
    DYNAMODB_CONTEXT.rounding = ROUND_HALF_UP
    DYNAMODB_CONTEXT.traps[Inexact] = False
    DYNAMODB_CONTEXT.traps[Rounded] = False
    
    current_user_id = get_jwt_identity()
    event_id = request.json.get('event_id', '')
    user_rating = Decimal(request.json.get('rating', '0.0'))  # Acepta decimales

    # Verifica que user_rating sea un Decimal válido
    if not isinstance(user_rating, Decimal):
        raise TypeError("La puntuación debe ser un número decimal.")

    # Asegúrate de que la calificación está en el rango permitido
    if user_rating < Decimal('0') or user_rating > Decimal('5'):
        return jsonify({'error': 'La calificación debe estar entre 0 y 5'}), 400
    table = dynamodb.Table('eventos')
    # Recupera el evento de la base de datos
    response = table.get_item(Key={'id': event_id})
    event = response.get('Item', {})
    if not event:
        return jsonify({'error': 'Event not found'}), 404
    # Inicializa ratings2 como un mapa si no existe
    if 'ratings2' not in event or not isinstance(event['ratings2'], dict):
        event['ratings2'] = {}
    # Actualiza la calificación para el usuario actual en ratings2
    event['ratings2'][current_user_id] = user_rating

    # Calcula el nuevo promedio
    total_ratings = sum(Decimal(str(r)) for r in event['ratings2'].values())
    new_average = total_ratings / len(event['ratings2'])
    new_average = min(new_average.quantize(Decimal('0.0'), rounding=ROUND_HALF_UP), Decimal('5'))
    # Actualiza el evento con el nuevo promedio y ratings2 actualizado
    update_response = table.update_item(
        Key={'id': event_id},
        UpdateExpression="SET puntaje = :val, ratings2 = :ratings",
        ExpressionAttributeValues={
            ':val': new_average,
            ':ratings': event['ratings2']
        },
            ReturnValues="UPDATED_NEW"
    )
    
    #NUEVO:
    # Obtén el ID del ecoorganizador del evento que está siendo calificado
    ecoorganizador_id = event.get('id_organizador', None)
    
    if ecoorganizador_id:
        update_organizer_average(ecoorganizador_id)
        
    return jsonify({'message': 'Rating updated successfully', 'new_average': str(new_average)}), 200

def update_organizer_average(ecoorganizador_id):
    table_organizadores = dynamodb.Table('ecoorganizadores')

    response_organizador = table_organizadores.get_item(Key={'id': ecoorganizador_id})
    organizer = response_organizador.get('Item', {})
    
    if 'created_events' in organizer and organizer['created_events']:
        total_score = Decimal('0')
        event_count = len(organizer['created_events'])
        
        for event_id in organizer['created_events']:
            event_table = dynamodb.Table('eventos')
            event_response = event_table.get_item(Key={'id': event_id})
            event = event_response.get('Item', {})
            
            if 'puntaje' in event:
                total_score += Decimal(event['puntaje'])

        if event_count > 0:
            new_average = (total_score / event_count).quantize(Decimal('0.0'), rounding=ROUND_HALF_UP)
        else:
            new_average = Decimal('0')

        update_response = table_organizadores.update_item(
            Key={'id': ecoorganizador_id},
            UpdateExpression="SET promedio = :val",
            ExpressionAttributeValues={
                ':val': new_average
            },
            ReturnValues="UPDATED_NEW"
        )

        if new_average == Decimal('5') and not organizer.get('haAlcanzadoCincoEstrellas', False):
            update_response = table_organizadores.update_item(
                Key={'id': ecoorganizador_id},
                UpdateExpression='SET haAlcanzadoCincoEstrellas = :val',
                ExpressionAttributeValues={
                    ':val': True
                },
                ReturnValues="UPDATED_NEW"
            )
    
    

#METODO PARA RECUPERAR LA CANTIDAD ESTRELLAS EN EL PERFIL DEL ECOORGANIZADOR:

@app.route('/get_organizer_rating/<organizer_id>', methods=['GET'])
@jwt_required()
def get_organizer_rating(organizer_id):
    try:
        organizers_table = dynamodb.Table('ecoorganizadores')
        # Obtener el ecoorganizador por ID
        organizer_response = organizers_table.get_item(Key={'id': organizer_id})
        organizer = organizer_response.get('Item', None)
        
        if not organizer:
            return jsonify({'error': 'Organizer not found'}), 404

        # Devolver el promedio de calificaciones del ecoorganizador
        return jsonify({'promedio': organizer.get('promedio', 0)}), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': 'Internal Server Error'}), 500


@app.route('/get_events_by_organizer', methods=['GET'])
@jwt_required()
def get_events_by_organizer():
    current_user_id = get_jwt_identity()
    try:
        table = dynamodb.Table('eventos')
        response = table.scan(FilterExpression=Attr('id_organizador').eq(current_user_id))
        events = response['Items']

        return jsonify(events), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

#METODO PARA OBTENER LOS DETALLES DE LOS EVENTOS A LOS QUE ESTAN ASISTIENDO LOS ECOBUSCADORES:

@app.route('/get_events_details', methods=['POST'])
@jwt_required()
def get_events_details():
    try:
        current_user_id = get_jwt_identity()
        user_table = dynamodb.Table('ecobuscadores')
        event_table = dynamodb.Table('eventos')
        events_details = []

        # Obtener los eventos asistidos por el usuario
        user_response = user_table.get_item(Key={'id': current_user_id})
        user = user_response.get('Item', {})
        user_assisted_events = user.get('assisted_events', [])

        for event_id in user_assisted_events:
            response = event_table.get_item(Key={'id': event_id})
            event = response.get('Item')
            if event:
                events_details.append(event)

        return jsonify(events_details), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


#PARA LOS POSTS:
@app.route('/listEvents', methods=['GET'])
@jwt_required()
def list_events():
    try:
        table = dynamodb.Table('eventos')
        response = table.scan()

        if 'Items' not in response:
            return jsonify({'error': 'Failed to fetch events'}), 500

        events = response['Items']

        # Convertir la fecha de creación a objeto datetime y ordenar
        for event in events:
            event['fecha_creacion_datetime'] = datetime.strptime(event['fecha_creacion'], '%d/%m/%Y %H:%M:%S')
        events.sort(key=lambda x: x['fecha_creacion_datetime'], reverse=True)

        # Eliminar la clave 'fecha_creacion_datetime'
        for event in events:
            del event['fecha_creacion_datetime']

            # Aquí se procesa la lógica de estado de cada evento basada en la fecha y hora actual
            try:
                event_date_str = event['fecha'] + ' ' + event['hora']
                event_date = datetime.strptime(event_date_str, '%d/%m/%Y %H:%M')
                event_date = local_tz.localize(event_date)

                duracion = int(Decimal(event['duracion']))
                event_end = event_date + timedelta(minutes=duracion)

                current_time = datetime.utcnow().replace(tzinfo=timezone('UTC')).astimezone(local_tz)

                if current_time > event_end:
                    event['status'] = 'Finalizado'
                elif event_date <= current_time <= event_end:
                    event['status'] = 'En Progreso'
                else:
                    event['status'] = 'Por Empezar'
            except Exception as e:
                print(f"Error al procesar el evento {event['id']}: {str(e)}")

        return jsonify(events), 200

    except Exception as e:
        print(f"Error al listar eventos: {str(e)}")
        return jsonify({'error': str(e)}), 500
    

#PARA RECUPERAR LA INFO DEL EVENTO SELECCIONADO EN VER MAS EN LOS POSTS:
@app.route('/event_details/<event_id>', methods=['GET'])
def get_event_details(event_id):
    try:
        table = dynamodb.Table('eventos')
        response = table.get_item(Key={'id': event_id})
        event = response.get('Item')

        if not event:
            return jsonify({'error': 'Event not found'}), 404

        # Aquí puedes añadir cualquier lógica adicional si es necesario
        # Por ejemplo, calcular nuevamente el promedio si lo necesitas

        return jsonify(event), 200

    except Exception as e:
        print("Error al obtener detalles del evento:", e)
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

#------------------------
#METODOS DATACRIME
#------------------------

@app.route('/add_crime', methods=['POST'])
@jwt_required()
def add_crime():
    try:

        user_id_from_jwt = get_jwt_identity()
        data = request.json
        user_id = data.get('user_id') if data.get('user_id') == 'anonymous' else user_id_from_jwt
        crime_id = str(uuid.uuid4())
        coordenadas = data.get('coordenadas', {})
        coordenadas['latitude'] = Decimal(coordenadas['latitude'])
        coordenadas['longitude'] = Decimal(coordenadas['longitude'])
        tipo = data.get('tipo', '')
        detalles = data.get('detalles', '')

        # Validar que los datos requeridos no estén vacíos
        if not (coordenadas and tipo):
            return jsonify({'error': 'Coordenadas y Tipo son campos obligatorios'}), 400

        item = {
            'id': crime_id,
            'user_id': user_id,
            'coordenadas': coordenadas,
            'tipo': tipo,
            'detalles': detalles
        }
        table = dynamodb.Table('datacrime')
        table.put_item(Item=item)

        return jsonify({'message': 'Crimen agregado exitosamente'}), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
    
@app.route('/get_crimes', methods=['GET'])
def get_crimes():
    try:
        table = dynamodb.Table('datacrime')
        tipo = request.args.get('tipo')
        
        if not tipo:
            return jsonify({'error': 'Tipo es un campo obligatorio'}), 400

        response = table.query(
            IndexName='tipo-index',
            KeyConditionExpression=Key('tipo').eq(tipo)
        )

        return jsonify(response['Items']), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500