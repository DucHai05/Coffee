FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
# Sử dụng thư viện phục vụ file tĩnh hoặc chạy dev mode (tùy ông)
CMD ["npm", "run", "dev"]