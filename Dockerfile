# Create Dockerfile using a text editor (like Notepad)
# Content should be exactly:
FROM node:14

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]