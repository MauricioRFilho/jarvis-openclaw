FROM ubuntu:20.04

# Set working directory to /app
WORKDIR /app

# Install dependencies
RUN apt-get update && apt-get install -y \
    nodejs \
    npm \
    git \
    python3 \
    python3-pip \
    go

# Install Node.js and TypeScript dependencies
RUN npm install -g typescript

# Set environment variables
ENV NODE_ENV production
ENV PYTHONUNBUFFERED 1

# Copy project files
COPY . /app/

# Install project dependencies
RUN npm install
RUN pip3 install -r requirements.txt

# Expose port for Vercel/Fly.io CLI
EXPOSE 8080

# Set default command to run
CMD ["node", "start.js"]

# Configure Docker to run as non-root user for security
RUN groupadd -r app && useradd -r -g app app
USER app

# Configure Docker volume for project files
VOLUME ["/app/projects"]

# Install Vercel/Fly.io CLI
RUN npm install -g @vercel/cli @fly/flyctl

# Configure timezone
ENV TZ=America/Sao_Paulo

# Set locale
ENV LANG=en_US.UTF-8
ENV LANGUAGE=en_US:en
ENV LC_ALL=en_US.UTF-8

# Configure Docker to prevent privilege escalation
RUN apt-get install -y apt-utils
RUN apt-get install -y libseccomp2
RUN apt-get autoremove -y
RUN apt-get clean

# Remove unnecessary files
RUN rm -rf /var/lib/apt/lists/*

# Configure Docker for production
RUN npm run build

# Set working directory to /app/projects
WORKDIR /app/projects

# Configure Docker to run as non-root user for security
USER app

# Set umask to prevent file permission issues
RUN umask 002

# Make directory for project files
RUN mkdir -p /app/projects/template

# Copy template files
COPY projects/template /app/projects/template

# Configure Docker volume for project files
VOLUME ["/app/projects"]