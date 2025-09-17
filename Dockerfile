FROM node:18-alpine

# Install Python and pip for yt-dlp
RUN apk add --no-cache python3 py3-pip python3-dev

# Create virtual environment and install yt-dlp
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
RUN pip install yt-dlp

# Make sure yt-dlp is accessible globally
RUN ln -s /opt/venv/bin/yt-dlp /usr/local/bin/yt-dlp

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