file_path = 'keys.txt'

try:
    with open(file_path, 'r') as file:
        ACCESS_KEY_ID = file.readline().strip()
        ACCESS_SECRET_KEY = file.readline().strip()
except FileNotFoundError:
    print(f"No se pudo encontrar el archivo: {file_path}")
except Exception as e:
    print(f"Ocurrió un error al leer el archivo: {str(e)}")