FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

# Copy the rest of the application code
# Note: In dev, we mount the volume so this is less critical but good for consistency
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
