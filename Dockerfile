FROM node:18-alpine

# Install Python and pip for yt-dlp
RUN apk add --no-cache python3 py3-pip

# Install yt-dlp using --break-system-packages (safe in container)
RUN pip3 install --break-system-packages yt-dlp

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy app source
COPY . .

# Build the app
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]