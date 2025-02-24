#!/bin/bash

echo "🚀 Setting up Equity Automator..."

# Install dependencies
echo "📦 Installing dependencies..."
npm run install:all

# Setup environment variables if they don't exist
if [ ! -f "./client/.env" ]; then
    echo "Creating client .env file..."
    cp ./client/.env.example ./client/.env
fi

if [ ! -f "./server/.env" ]; then
    echo "Creating server .env file..."
    cp ./server/.env.example ./server/.env
fi

# Initialize database
echo "🗄️ Setting up database..."
cd server
npx prisma generate
npx prisma db push
npx prisma db seed

# Start the application
echo "🌟 Starting the application..."
cd ..
npm run dev 