# Указываем образ с платформой
FROM --platform=linux/amd64 node:20-bookworm

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json перед кодом, чтобы npm ci использовало кеш
COPY package.json package-lock.json ./

# Устанавливаем зависимости
RUN npm ci --only=production

# Копируем остальной код
COPY . .

# Выполняем подготовительную команду refresh (например, для сборки)
RUN npm run refresh

EXPOSE 3001

# Определяем команду запуска
CMD ["npm", "run", "start"]
