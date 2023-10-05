# Abre el archivo y lee las líneas
with open('keys.txt', 'r') as file:
    lines = file.readlines()

# Asume que la primera línea tiene el ACCESS_KEY_ID y la segunda tiene el ACCESS_SECRET_KEY
ACCESS_KEY_ID = lines[0].strip()
ACCESS_SECRET_KEY = lines[1].strip()
