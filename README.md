# AI-Powered Notes Management System

A full-stack notes application built with Laravel, React, PostgreSQL, and AI provider integrations.

Users can create and manage notes, configure an AI provider, and generate summaries for their notes.

## Features

- User registration and login
- Token-based authentication with Laravel Sanctum
- Notes CRUD operations
- User-specific notes
- AI provider configuration
- OpenAI, Google Gemini, and Groq support
- Encrypted AI API key storage
- Active AI provider selection
- AI-generated note summaries
- Request validation
- API rate limiting
- React frontend
- Laravel feature tests

## Tech Stack

### Backend

- PHP 8.3+
- Laravel 13
- Laravel Sanctum
- PostgreSQL

### Frontend

- React
- Axios
- Tailwind CSS

### AI Providers

- OpenAI
- Google Gemini
- Groq

## Project Structure

```text
ai-powered-notes-management-system/
├── backend/
│   ├── app/
│   │   ├── Http/Controllers/
│   │   ├── Models/
│   │   └── Services/AI/
│   ├── database/
│   │   ├── factories/
│   │   ├── migrations/
│   │   └── seeders/
│   ├── routes/
│   │   └── api.php
│   └── tests/
│       └── Feature/
│
├── frontend/
│   └── src/
│       ├── components/
│       ├── constants/
│       ├── context/
│       ├── pages/
│       ├── services/
│       └── utils/
│
└── README.md
```

## Requirements

- PHP 8.3+
- Composer
- Node.js and npm
- PostgreSQL
- Git

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/DevrajJaiswal/ai-powered-notes-management-system.git
cd ai-powered-notes-management-system
```

### 2. Configure the backend

```bash
cd backend
composer install
```

Create the `.env` file from `.env.example` and generate the application key:

```bash
php artisan key:generate
```

Configure PostgreSQL in `backend/.env`:

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=ai_notes
DB_USERNAME=postgres
DB_PASSWORD=your_password
```

Run the migrations:

```bash
php artisan migrate
```

Start the Laravel API:

```bash
php artisan serve
```

The API runs at:

```text
http://127.0.0.1:8000
```

### 3. Configure the frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at:

```text
http://localhost:5173
```

## API Overview

All protected endpoints require a Sanctum bearer token.

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/register` | Register a user |
| POST | `/api/login` | Login |
| GET | `/api/me` | Get the authenticated user |
| POST | `/api/logout` | Logout |

### Notes

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/notes` | List notes |
| POST | `/api/notes` | Create a note |
| GET | `/api/notes/{id}` | Get a note |
| PUT/PATCH | `/api/notes/{id}` | Update a note |
| DELETE | `/api/notes/{id}` | Delete a note |
| POST | `/api/notes/{id}/summary` | Generate an AI summary |

### AI Providers

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/ai/providers` | List configured providers |
| POST | `/api/ai/providers` | Add a provider |
| PUT | `/api/ai/providers/{id}` | Update a provider |
| PATCH | `/api/ai/providers/{id}/activate` | Activate a provider |
| DELETE | `/api/ai/providers/{id}` | Delete a provider |

## AI Integration

AI providers are implemented behind a common interface:

For note summaries, the backend uses the user's active provider and sends the note title and content to the selected AI provider.

AI API keys are encrypted before being stored in PostgreSQL and are not returned by the provider API.

## Security

- Laravel Sanctum protects authenticated endpoints.
- Notes and provider configurations are scoped to the authenticated user.
- Request data is validated by Laravel.
- AI API keys are encrypted at rest.
- API keys are hidden from model serialization.
- Authentication and AI endpoints are rate limited.
- Database access uses Laravel Eloquent/query builder.

## Testing

Run the backend test suite from `backend`:

```bash
php artisan test
```
## AI-Assisted Development

AI tools were used during development for:

- API design and implementation
- AI provider integration
- Debugging and refactoring
- Writing tests
- Documentation

Generated suggestions and code were reviewed, adapted, and tested before being used in the project.
