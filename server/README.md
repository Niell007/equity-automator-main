# Equity Automator Server

Backend server for the Equity Automator platform, providing APIs for B-BBEE management and compliance automation.

## Tech Stack

- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **TypeScript** - Type safety and enhanced developer experience
- **Prisma** - Type-safe ORM for database operations
- **PostgreSQL** - Primary database
- **JWT** - Authentication and authorization
- **Zod** - Runtime type validation
- **Vitest** - Testing framework

## Project Structure

```
src/
├── config/         # Configuration files
├── lib/           # Shared utilities and libraries
├── middleware/    # Express middleware
├── routes/        # API routes
└── index.ts      # Application entry point

prisma/
└── schema.prisma # Database schema

```

## Prerequisites

- Node.js >= 18
- npm >= 9
- PostgreSQL >= 14

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy the environment variables:
   ```bash
   cp .env.example .env
   ```
4. Update the environment variables in `.env`
5. Generate Prisma client:
   ```bash
   npm run db:generate
   ```
6. Push the database schema:
   ```bash
   npm run db:push
   ```
7. Start the development server:
   ```bash
   npm run dev
   ```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run test` - Run tests
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push database schema
- `npm run db:studio` - Open Prisma Studio

## API Documentation

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Documents

- `GET /api/documents` - List all documents
- `GET /api/documents/:id` - Get document by ID
- `POST /api/documents` - Create document
- `PATCH /api/documents/:id` - Update document
- `DELETE /api/documents/:id` - Delete document
- `POST /api/documents/:id/review` - Review document (admin only)

### Reports

- `GET /api/reports` - List all reports
- `GET /api/reports/:id` - Get report by ID
- `POST /api/reports` - Create report
- `PATCH /api/reports/:id` - Update report
- `DELETE /api/reports/:id` - Delete report
- `POST /api/reports/generate/compliance` - Generate compliance report (admin only)

### Support Tickets

- `GET /api/tickets` - List all tickets
- `GET /api/tickets/:id` - Get ticket by ID
- `POST /api/tickets` - Create ticket
- `PATCH /api/tickets/:id/status` - Update ticket status (admin only)
- `POST /api/tickets/:id/messages` - Add message to ticket

## Error Handling

The API uses a centralized error handling mechanism. All errors are formatted consistently:

```json
{
  "status": "error",
  "message": "Error message here"
}
```

## Security

- JWT authentication
- Rate limiting
- CORS protection
- Input validation with Zod
- Password hashing with bcrypt
- SQL injection protection with Prisma

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License. 