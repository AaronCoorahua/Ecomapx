from flask import Flask
#from flask_session import Session
from flask_dynamo import Dynamo
from flask_cors import CORS
import key_config as keys
import boto3
import os
print("Hola Mundo")