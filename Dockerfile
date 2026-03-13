FROM node:20-slim

# Instalar Ghostscript desde los repos de Debian
RUN apt-get update && apt-get install -y --no-install-recommends ghostscript \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY src/ ./src/

# Crear carpeta de uploads con los permisos correctos
RUN mkdir -p uploads/temp

EXPOSE 8080

CMD ["node", "src/server.js"]
