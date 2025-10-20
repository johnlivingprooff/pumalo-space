#!/bin/bash

echo "🚀 Pumalo Space - Neon Integration Setup"
echo "========================================="
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo "Please make sure your .env file exists with:"
    echo "  - DATABASE_URL"
    echo "  - NEXT_PUBLIC_STACK_PROJECT_ID"
    echo "  - NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY"
    echo "  - STACK_SECRET_SERVER_KEY"
    exit 1
fi

echo "✅ Found .env file"
echo ""

# Install tsx if not installed
echo "📦 Installing dependencies..."
npm install --save-dev tsx
echo ""

# Generate Prisma Client
echo "🔧 Generating Prisma Client..."
npx prisma generate
echo ""

# Push schema to database
echo "🗄️  Pushing schema to Neon database..."
npx prisma db push
echo ""

# Seed database
echo "🌱 Seeding database with demo data..."
npm run db:seed
echo ""

echo "✅ Setup Complete!"
echo ""
echo "🎉 Next steps:"
echo "  1. Run 'npm run dev' to start the development server"
echo "  2. Visit http://localhost:3000"
echo "  3. Try signing up at http://localhost:3000/handler/sign-up"
echo "  4. View your database at http://localhost:5555 (run 'npm run db:studio')"
echo ""
echo "📚 Read NEON_INTEGRATION.md for full documentation"
echo ""
