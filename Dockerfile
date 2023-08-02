FROM node:20

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos del API (asegúrate de tener el package.json y package-lock.json en el mismo directorio)
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto de los archivos
COPY . .

# Expone el puerto que utilizará tu API
EXPOSE 3001

# Comando para iniciar tu API (asegúrate de que esto coincida con el comando que usas para ejecutar tu API localmente)
CMD ["npm", "run", "dev"]