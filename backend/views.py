from app import app, dynamodb
from flask import Flask, jsonify, request, session
from datetime import datetime
import key_config as keys
import boto3
import uuid

from boto3.dynamodb.conditions import Key, Attr


@app.route("/")
def index():
    return "Hola Amigo como esta"

@app.route("/signup", methods=["POST"])
def signup():
    error1 = False
    error2 = False
    error3 = False
    error = False
    response = {}
    try:
        user_id = uuid.uuid4()
        fecha_registro = datetime.now().isoformat()
        name = request.get_json()["name"]
        username = request.get_json()["username"]
        email = request.get_json()["email"]
        password = request.get_json()["password"]
    
        #Elijo la tabla con la que estoy trabajando
        table = dynamodb.Table('users')
        #-----------------------------------------------------------------------
        # MANEJO DE ERRORES
        # Verificar si el usuario ya existe en DynamoDB
        response = table.scan(
            FilterExpression=Attr("username").eq(username) | Attr("email").eq(email)
        )
        if len(response["Items"]) > 0:
            raise Exception("El usuario o correo ya existe. Inicie sesión")

        #Validar campos requeridos y longitud de campos
        if len(username) == 0:
            raise Exception("Ingrese un usuario")
        if len(password) == 0:
            raise Exception("Ingrese una contraseña")
        if len(email) == 0:
            raise Exception("Ingrese un correo válido")
        if len(username) > 20:
            raise Exception("El nombre de usuario debe tener un máximo de 20 caracteres")
        if len(password) < 8:
            raise Exception("La contraseña debe tener un mínimo de 8 caracteres")
        #-----------------------------------------------------------------------

        # Crear el item que se va a guardar en DynamoDB
        item={
                'user_id': str(user_id),
                'fecha_registro': fecha_registro,
                'username': username,
                'name': name,
                'email': email,
                'password': password
            }   
        print(item.get("user_id"))
        # Guardar el usuario en DynamoDB
        table.put_item(Item = item)

        
        response["user_id"] = user_id
        response["fecha_registro"] = fecha_registro
        response["name"] = name
        response["username"] = username
        response["email"] = email
        response["password"] = password
        response["message"] = "Usuario creado exitosamente"

    except Exception as e:
        error = True
        response["message"] = str(e)
    finally:
        return jsonify(response)#response["message"]


@app.route('/login', methods=['POST'])
def login_user():
    exist = True
    error_uc = False
    response = {}

    try:
        email = request.get_json()['email']
        password = request.get_json()['password']

        #Elijo la tabla con la que estoy trabajando
        table = dynamodb.Table('users')

        user_data = table.scan(
            FilterExpression = Attr("email").eq(email)
        )
        
        session['user_id'] = user_data["Items"][0]["user_id"] #Uso de cookies para almacenar datos del usuario

        if user_data["Items"] == 0 or password != user_data["Items"][0]["password"]:
            error_uc = True
            raise Exception
        print(session["user_id"]) 

    except Exception as e:
        if error_uc:
            response['message'] = "Usuario o contraseña incorrecta"
        else: response['message'] = str(e)
        
        exist = False    

    response['exist'] = exist
    
    return jsonify(response)