# AR Automation Website

A modern web application built with **Next.js** (frontend), **Strapi CMS** (backend), and **PostgreSQL** (database), fully containerized with Docker.

## 🏗️ Project Structure

```
ARAutomationWebsite/
├── frontend/              # Next.js application
│   ├── app/              # App Router pages and layouts
│   ├── components/       # React components
│   ├── lib/             # Utility functions and API clients
│   ├── types/           # TypeScript type definitions
│   └── public/          # Static assets
├── backend/              # Strapi CMS
│   ├── config/          # Strapi configuration
│   ├── src/             # API endpoints and customizations
│   └── public/          # Uploaded media files
├── docker/               # Docker configuration
│   ├── Dockerfile.backend
│   └── Dockerfile.frontend
├── docker-compose.yml    # Docker orchestration
└── package.json         # Workspace scripts
```

## 🚀 Quick Start

### Prerequisites

- **Docker** (v24.0+)
- **Docker Compose** (v2.20+)
- **Node.js** (v20+) - Only for local IDE autocomplete
- **npm** (v10+) - Only for local IDE autocomplete

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd ARAutomationWebsite
```

### 2. Set Up Environment Variables

```bash
# Copy the template
cp .env.template .env

# Generate secure secrets for production (optional for development)
# You can use: openssl rand -base64 32
# Edit .env and replace the "toBeModified" values
```

### 3. Install Dependencies Locally (For IDE Support)

This step is **optional** but **highly recommended** for IDE autocomplete, TypeScript intellisense, and linting:

```bash
# Install all dependencies locally
npm run install:all

# OR install individually
npm run frontend:install
npm run backend:install
```

**Note:** These local `node_modules` won't be used by Docker (they're dockerignored). Docker containers will install and use their own platform-specific dependencies.

### 4. Start All Services with Docker

```bash
# Start all services (PostgreSQL, Strapi, Next.js)
npm run dev

# OR with fresh build
npm run dev:build
```

This will start:
- **PostgreSQL**: http://localhost:5432
- **Strapi Admin**: http://localhost:1337/admin
- **Next.js Frontend**: http://localhost:3000

### 5. Create Strapi Admin User

On first run, visit http://localhost:1337/admin and create your admin user.

## 📋 Available Scripts

### Docker Commands

```bash
# Start all services
npm run dev

# Start with rebuild
npm run dev:build

# Stop all services
npm run down

# Stop and remove volumes (⚠️ deletes database data)
npm run down:volumes

# View all logs
npm run logs

# View specific service logs
npm run logs:frontend
npm run logs:strapi
npm run logs:db
```

### Local Development Commands

```bash
# Install dependencies for IDE support
npm run install:all
npm run frontend:install
npm run backend:install

# Clean everything (containers, volumes, node_modules)
npm run clean
```

## 🔧 Configuration

### Environment Variables

Key environment variables in `.env`:

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `DATABASE_HOST` | PostgreSQL host | `postgres` (Docker service name) |
| `DATABASE_NAME` | Database name | `strapi` |
| `DATABASE_USERNAME` | Database user | `strapi` |
| `DATABASE_PASSWORD` | Database password | `strapi` |
| `APP_KEYS` | Strapi encryption keys | ⚠️ Change for production |
| `API_TOKEN_SALT` | API token salt | ⚠️ Change for production |
| `ADMIN_JWT_SECRET` | Admin JWT secret | ⚠️ Change for production |
| `JWT_SECRET` | JWT secret | ⚠️ Change for production |

### Strapi Configuration

- Database config: `backend/config/database.ts`
- Server config: `backend/config/server.ts`
- Admin panel: `backend/config/admin.ts`
- Middleware: `backend/config/middlewares.ts`

### Next.js Configuration

- Next.js config: `frontend/next.config.mjs`
- Tailwind config: `frontend/tailwind.config.ts`
- TypeScript config: `frontend/tsconfig.json`
- Strapi API client: `frontend/lib/strapi.ts`

## 🐳 Docker Architecture

### Services

1. **PostgreSQL** (`postgres`)
   - Image: `postgres:16-alpine`
   - Port: `5432`
   - Data persistence: `postgres-data` volume

2. **Strapi Backend** (`strapi`)
   - Built from: `docker/Dockerfile.backend`
   - Port: `1337`
   - Depends on: `postgres`
   - Volume mounts:
     - Source code (live reload)
     - Isolated `node_modules`
     - Persistent uploads

3. **Next.js Frontend** (`frontend`)
   - Built from: `docker/Dockerfile.frontend`
   - Port: `3000`
   - Depends on: `strapi`
   - Volume mounts:
     - Source code (live reload)
     - Isolated `node_modules`
     - Isolated `.next` cache

### Why Local `node_modules` + Docker `node_modules`?

**Docker containers** use their own `node_modules` (platform-specific, Alpine Linux builds) via volume overrides in `docker-compose.yml`.

**Local `node_modules`** are installed for IDE features only:
- TypeScript autocomplete
- IntelliSense
- Linting and error checking

The `.dockerignore` files prevent local `node_modules` from being copied into containers, and volume overrides ensure containers use their own dependencies at runtime.

## 📚 Development Workflow

### Adding a New Strapi Content Type

1. Visit http://localhost:1337/admin
2. Go to **Content-Type Builder**
3. Create your content type
4. Strapi will auto-save to `backend/src/api/`
5. Changes are automatically available via the REST API

### Fetching Data in Next.js

```typescript
// frontend/app/page.tsx
import { fetchAPI } from '@/lib/strapi';

export default async function Page() {
  const data = await fetchAPI('/posts?populate=*');
  return <div>{/* Render your data */}</div>;
}
```

### Accessing the Database

```bash
# Connect to PostgreSQL via Docker
docker exec -it ar-automation-postgres psql -U strapi -d strapi
```

## 🧹 Cleanup

```bash
# Stop services and remove containers
npm run down

# Stop services and remove ALL data (⚠️ destructive)
npm run down:volumes

# Full cleanup including node_modules
npm run clean
```

## 🚀 Production Deployment

### Build Production Images

```bash
# Set environment to production
export NODE_ENV=production

# Build optimized images
docker-compose build
```

### Security Checklist

- [ ] Generate new secure values for all secrets in `.env`
- [ ] Change database credentials
- [ ] Set `NODE_ENV=production`
- [ ] Configure proper CORS in `backend/config/middlewares.ts`
- [ ] Set up SSL/TLS certificates
- [ ] Use environment-specific `.env` files
- [ ] Review and restrict database access
- [ ] Enable PostgreSQL SSL if using managed database

## 🛠️ Troubleshooting

### Port Already in Use

If ports 3000, 1337, or 5432 are in use:

```bash
# Stop conflicting services or change ports in docker-compose.yml
# Example: Change "3000:3000" to "3001:3000"
```

### Database Connection Errors

```bash
# Check if PostgreSQL is healthy
docker-compose ps

# View database logs
npm run logs:db

# Restart database
docker-compose restart postgres
```

### Strapi Build Errors

```bash
# Rebuild Strapi container
docker-compose up --build strapi
```

### Permission Issues on Linux

```bash
# Fix file permissions
sudo chown -R $USER:$USER .
```

## 📖 Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Strapi Documentation](https://docs.strapi.io)
- [Docker Documentation](https://docs.docker.com)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)

## 📝 License

MIT

---

**Built with ❤️ by the AR Automation Team**
