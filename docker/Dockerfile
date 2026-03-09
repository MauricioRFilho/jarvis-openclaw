FROM node:20-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    python3 \
    python3-pip \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install global CLIs
RUN npm install -g vercel

WORKDIR /app

# Non-root user for security
RUN useradd -m smith
USER smith

CMD ["node"]
