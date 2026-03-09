FROM node:16-alpine

# Set working directory to /app
WORKDIR /app

# Copy package*.json to /app
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the code to /app
COPY . .

# Install Go and Python
RUN apk add --no-cache go python3

# Install Git
RUN apk add --no-cache git

# Install Vercel and Fly.io CLI
RUN npm install -g @vercel/cli @fly/flyctl

# Set environment variables
ENV NODE_ENV production
ENV GEMINI_API_KEY=${GEMINI_API_KEY}
ENV GITHUB_TOKEN=${GITHUB_TOKEN}
ENV GITHUB_USERNAME=${GITHUB_USERNAME}
ENV GITHUB_REPOSITORY=${GITHUB_REPOSITORY}

# Expose port 3000
EXPOSE 3000

# Run command when container starts
CMD ["npm", "start"]