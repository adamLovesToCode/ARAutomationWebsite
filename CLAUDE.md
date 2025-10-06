# CLAUDE.md

This file provides comprehensive guidance to Claude Code when working with the AR Automation Website built with Next.js 14, Strapi CMS, and PostgreSQL in a Docker environment.

## Core Development Philosophy

### KISS (Keep It Simple, Stupid)
Simplicity should be a key goal in design. Choose straightforward solutions over complex ones whenever possible. Simple solutions are easier to understand, maintain, and debug.

### YAGNI (You Aren't Gonna Need It)
Avoid building functionality on speculation. Implement features only when they are needed, not when you anticipate they might be useful in the future.

### Design Principles
- **Dependency Inversion**: High-level modules should not depend on low-level modules. Both should depend on abstractions.
- **Open/Closed Principle**: Software entities should be open for extension but closed for modification.
- **Vertical Slice Architecture**: Organize by features, not layers
- **Component-First**: Build with reusable, composable components with single responsibility
- **Fail Fast**: Validate inputs early, throw errors immediately

## 🤖 AI Assistant Guidelines

### Context Awareness
- When implementing features, always check existing patterns first
- Prefer composition over inheritance in all designs
- Use existing utilities before creating new ones
- Check for similar functionality in other domains/features

### Common Pitfalls to Avoid
- Creating duplicate functionality
- Overwriting existing tests
- Modifying core frameworks without explicit instruction
- Adding dependencies without checking existing alternatives

### Workflow Patterns
- Preferably create tests BEFORE implementation (TDD)
- Use "think hard" for architecture decisions
- Break complex tasks into smaller, testable units
- Validate understanding before implementation

### Search Command Requirements
**CRITICAL**: Always use `rg` (ripgrep) instead of traditional `grep` and `find` commands:

```bash
# ❌ Don't use grep
grep -r "pattern" .

# ✅ Use rg instead
rg "pattern"

# ❌ Don't use find with name
find . -name "*.tsx"

# ✅ Use rg with file filtering
rg --files | rg "\\.tsx$"
# or
rg --files -g "*.tsx"
```

## 🧱 Code Structure & Modularity

### File and Component Limits
- **Never create a file longer than 500 lines of code.** If approaching this limit, refactor by splitting into modules or helper files.
- **Components should be under 200 lines** for better maintainability.
- **Functions should be short and focused sub 50 lines** and have a single responsibility.
- **Organize code into clearly separated modules**, grouped by feature or responsibility.

## 🏗️ Project Architecture (Docker-First Development)

### Project Structure
```
ARAutomationWebsite/
├── frontend/              # Next.js 14 application
│   ├── app/              # App Router pages and layouts
│   │   ├── globals.css    # Global styles
│   │   ├── layout.tsx     # Root layout
│   │   └── page.tsx       # Home page
│   ├── components/        # React components
│   │   ├── ui/           # shadcn/ui components
│   │   └── common/       # Application-specific shared components
│   ├── lib/              # Utility functions and API clients
│   │   ├── utils.ts      # Utility functions
│   │   ├── strapi.ts     # Strapi API client
│   │   └── env.ts        # Environment validation
│   ├── types/            # TypeScript type definitions
│   └── __tests__/        # Test files
├── backend/              # Strapi 4 CMS
│   ├── config/          # Strapi configuration
│   ├── src/             # API endpoints and customizations
│   └── public/          # Uploaded media files
├── docker/               # Docker configuration
│   ├── Dockerfile.backend
│   └── Dockerfile.frontend
├── docker-compose.yml    # Docker orchestration
└── package.json         # Workspace scripts
```

## 🚀 Next.js 14 & React 18 Stack Features

### Next.js 14 Core Features
- **App Router**: File-system based router with layouts and nested routing
- **Server Components**: React Server Components for performance
- **Server Actions**: Type-safe server functions
- **Parallel Routes**: Concurrent rendering of multiple pages
- **Intercepting Routes**: Modal-like experiences

### React 18 Features
- **Suspense**: Enhanced loading states and error boundaries
- **Concurrent Features**: useTransition, useDeferredValue
- **Server Components**: Zero-bundle server-side rendering

### TypeScript Integration (MANDATORY)
- **PREFER `React.ReactNode` for most cases** - Most flexible for children and return types
- **AVOID explicit return types** unless they add value for type safety
- **IMPORT types from 'react'** explicitly when needed
- **USE `ReactElement` when specific element constraints are needed**

```typescript
// ✅ PREFERRED: Modern React 18 typing
import { ReactNode } from 'react';

function MyComponent({ children }: { children: ReactNode }) {
  return <div>{children}</div>; // No explicit return type needed
}

// ✅ ACCEPTABLE: When explicit typing helps
import { ReactElement } from 'react';
function SpecificComponent(): ReactElement<'div'> {
  return <div>Content</div>;
}

// ✅ ACCEPTABLE: JSX.Element is valid in modern TypeScript
function MyComponent(): JSX.Element {
  return <div>Content</div>;
}

// ❌ AVOID: Unnecessary explicit return types
function SimpleComponent(): ReactElement {
  return <div>Simple content</div>; // Type can be inferred
}
```

## 🎯 TypeScript Configuration (STRICT REQUIREMENTS)

### Current Configuration (DO NOT MODIFY)
The project uses the existing TypeScript configuration. Key requirements:
- **NEVER use `any` type** - use `unknown` if type is truly unknown
- **USE explicit return types** when they improve type safety or API clarity
- **MUST use proper generic constraints** for reusable components
- **MUST use type inference from Zod schemas** using `z.infer<typeof schema>`
- **NEVER use `@ts-ignore`** or `@ts-expect-error` - fix the type issue properly

### TypeScript 5.4 Configuration Details
- **Strict mode enabled**: Includes strictNullChecks, strictFunctionTypes, etc.
- **Incremental compilation**: Supported for large Next.js applications  
- **TypeScript 5.1.3+**: Required for async Server Components
- **Type checking optimization**: Use incremental builds in development

### Advanced TypeScript Features
- **Satisfies operator**: Use for better type inference with object literals
- **Template literal types**: Leverage for API endpoint typing
- **Conditional types**: Useful for complex component prop relationships
- **Branded types**: Required for ID types as mandated in the Zod section

## 📦 Dependencies & Stack

### Core Stack (DO NOT MODIFY)
```json
{
  "frontend": {
    "next": "^14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "typescript": "^5.4.0",
    "tailwindcss": "^3.4.0"
  },
  "backend": {
    "@strapi/strapi": "^4.25.0",
    "pg": "^8.11.0"
  }
}
```

### Required Additional Dependencies
```bash
# UI Components
npm install @radix-ui/react-* class-variance-authority clsx tailwind-merge lucide-react

# Form Handling and Validation
npm install react-hook-form @hookform/resolvers zod

# Testing
npm install -D jest @testing-library/react @testing-library/jest-dom @testing-library/user-event
npm install -D playwright @playwright/test

# shadcn/ui setup
npx shadcn@latest init
```

## 🛡️ Data Validation with Zod (MANDATORY FOR ALL EXTERNAL DATA)

### MUST Follow These Validation Rules
- **MUST validate ALL external data**: Strapi API responses, form inputs, URL params, environment variables
- **MUST use branded types**: For all IDs and domain-specific values
- **MUST fail fast**: Validate at system boundaries, throw errors immediately
- **MUST use type inference**: Always derive TypeScript types from Zod schemas

### Environment Validation (REQUIRED)
```typescript
// lib/env.ts
import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']),
  NEXT_PUBLIC_STRAPI_URL: z.string().url(),
  STRAPI_API_TOKEN: z.string().optional(),
});

export const env = envSchema.parse(process.env);
```

### Strapi Content Type Validation
```typescript
// types/strapi.ts
import { z } from 'zod';

// Brand IDs for type safety
const ContentIdSchema = z.string().uuid().brand<'ContentId'>();
type ContentId = z.infer<typeof ContentIdSchema>;

// Example: Article content type
export const articleSchema = z.object({
  id: ContentIdSchema,
  attributes: z.object({
    title: z.string(),
    content: z.string(),
    slug: z.string(),
    publishedAt: z.string().datetime(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  }),
});

export type Article = z.infer<typeof articleSchema>;

// Strapi collection response
export const strapiCollectionSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    data: z.array(itemSchema),
    meta: z.object({
      pagination: z.object({
        page: z.number(),
        pageSize: z.number(),
        pageCount: z.number(),
        total: z.number(),
      }),
    }),
  });

// Strapi single response
export const strapiSingleSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    data: itemSchema,
    meta: z.object({}),
  });
```

## 🔗 Strapi Integration Patterns (MANDATORY)

### Enhanced Type-Safe API Client
```typescript
// lib/strapi.ts
import { z } from 'zod';
import { env } from './env';

class StrapiError extends Error {
  constructor(
    message: string,
    public status: number,
    public details?: unknown
  ) {
    super(message);
    this.name = 'StrapiError';
  }
}

export async function fetchFromStrapi<T>(
  path: string,
  schema: z.ZodSchema<T>,
  options: RequestInit = {}
): Promise<T> {
  const url = `${env.NEXT_PUBLIC_STRAPI_URL}/api${path}`;
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(env.STRAPI_API_TOKEN && {
        Authorization: `Bearer ${env.STRAPI_API_TOKEN}`,
      }),
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new StrapiError(
      `Strapi API error: ${response.statusText}`,
      response.status
    );
  }

  const rawData = await response.json();
  
  try {
    return schema.parse(rawData);
  } catch (error) {
    throw new StrapiError(
      'Invalid data received from Strapi',
      500,
      error
    );
  }
}

// Usage examples
export async function getArticles() {
  return fetchFromStrapi(
    '/articles?populate=*',
    strapiCollectionSchema(articleSchema)
  );
}

export async function getArticle(slug: string) {
  return fetchFromStrapi(
    `/articles?filters[slug][$eq]=${slug}&populate=*`,
    strapiCollectionSchema(articleSchema)
  );
}
```

### Strapi OpenAPI Integration (2024 Best Practice)

For automatic type generation instead of manual Zod schemas:

```bash
# Install Strapi OpenAPI plugin
npm install @strapi/plugin-documentation

# Generate TypeScript types automatically
npx openapi-typescript http://localhost:1337/documentation/v1.0.0/full.json -o types/strapi-api.ts
```

This approach generates types directly from your Strapi API schema, reducing manual maintenance and ensuring type accuracy.

### Form Validation with React Hook Form
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

function ContactForm(): ReactElement {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: ContactFormData): Promise<void> => {
    // Send validated data to Strapi
    await fetchFromStrapi('/contact-submissions', z.unknown(), {
      method: 'POST',
      body: JSON.stringify({ data }),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Form fields with error handling */}
    </form>
  );
}
```

## 🧪 Testing Strategy (MANDATORY REQUIREMENTS)

### MUST Meet These Testing Standards
- **MINIMUM 80% code coverage** - NO EXCEPTIONS
- **MUST co-locate tests** with components in `__tests__` folders
- **MUST use Jest + React Testing Library** for component tests
- **MUST use Playwright** for E2E testing including Strapi integration
- **MUST test user behavior** not implementation details
- **MUST mock Strapi API calls** appropriately

### Test Configuration
```javascript
// jest.config.js (Jest 29.7+ with Next.js 14)
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './frontend',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom', // Must specify jsdom explicitly in Jest 29.7+
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
}

// Note: Server Components with async operations require E2E testing
// Jest cannot test async Server Components - use Playwright instead
module.exports = createJestConfig(customJestConfig)
```

### Server Component Testing Limitations
- **Jest limitation**: Cannot test async Server Components
- **E2E requirement**: Use Playwright for testing Server Components with data fetching
- **Testing strategy**: Unit tests for Client Components, E2E for Server Components

### Component Test Example
```typescript
// components/__tests__/ArticleCard.test.tsx
import { describe, it, expect, vi } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { ArticleCard } from '../ArticleCard';
import type { Article } from '../../types/strapi';

const mockArticle: Article = {
  id: '123e4567-e89b-12d3-a456-426614174000' as any,
  attributes: {
    title: 'Test Article',
    content: 'Test content',
    slug: 'test-article',
    publishedAt: '2024-01-01T00:00:00.000Z',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
};

describe('ArticleCard', () => {
  it('should display article title and content preview', () => {
    render(<ArticleCard article={mockArticle} />);
    
    expect(screen.getByText('Test Article')).toBeInTheDocument();
    expect(screen.getByText(/Test content/)).toBeInTheDocument();
  });
});
```

### E2E Test Example
```typescript
// e2e/strapi-integration.spec.ts
import { test, expect } from '@playwright/test';

test('should fetch and display articles from Strapi', async ({ page }) => {
  // Navigate to articles page
  await page.goto('http://localhost:3000/articles');
  
  // Wait for articles to load from Strapi
  await page.waitForSelector('[data-testid="article-card"]');
  
  // Verify articles are displayed
  const articles = await page.locator('[data-testid="article-card"]');
  await expect(articles).toHaveCountGreaterThan(0);
});
```

## 🎨 Component Guidelines with shadcn/ui

### MANDATORY Component Documentation
```typescript
/**
 * Article card component for displaying blog posts from Strapi CMS.
 * 
 * Renders article metadata with responsive design and accessible interactions.
 * Integrates with Next.js routing for navigation to full article pages.
 * 
 * @component
 * @example
 * ```tsx
 * <ArticleCard 
 *   article={strapiArticle}
 *   variant="featured"
 *   showExcerpt={true}
 * />
 * ```
 */
interface ArticleCardProps {
  /** Article data from Strapi CMS */
  article: Article;
  
  /** Visual variant of the card @default 'default' */
  variant?: 'default' | 'featured' | 'compact';
  
  /** Whether to show content excerpt @default true */
  showExcerpt?: boolean;
  
  /** Optional click handler for custom behavior */
  onCardClick?: (article: Article) => void;
}
```

### shadcn/ui Integration Pattern
```typescript
"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const articleCardVariants = cva(
  "transition-all duration-200 hover:shadow-lg",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground",
        featured: "bg-primary text-primary-foreground",
        compact: "bg-muted text-muted-foreground",
      },
      size: {
        default: "p-6",
        sm: "p-4",
        lg: "p-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ArticleCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof articleCardVariants> {
  article: Article
  showExcerpt?: boolean
}

export const ArticleCard = React.forwardRef<HTMLDivElement, ArticleCardProps>(
  ({ className, variant, size, article, showExcerpt = true, ...props }, ref) => {
    return (
      <Card
        ref={ref}
        className={cn(articleCardVariants({ variant, size, className }))}
        {...props}
      >
        <CardHeader>
          <CardTitle>{article.attributes.title}</CardTitle>
          <CardDescription>
            {new Date(article.attributes.publishedAt).toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        {showExcerpt && (
          <CardContent>
            <p className="line-clamp-3">{article.attributes.content}</p>
          </CardContent>
        )}
      </Card>
    )
  }
)
ArticleCard.displayName = "ArticleCard"
```

## 🔐 Security Requirements (MANDATORY)

### Input Validation (MUST IMPLEMENT ALL)
- **MUST sanitize ALL user inputs** with Zod before processing
- **MUST validate file uploads**: type, size, and content
- **MUST prevent XSS** with proper escaping
- **MUST implement CSRF protection** for forms
- **NEVER use dangerouslySetInnerHTML** without sanitization

### Strapi Security Configuration
```typescript
// backend/config/middlewares.ts
export default [
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': ["'self'", 'data:', 'blob:', 'https:'],
          'media-src': ["'self'", 'data:', 'blob:'],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
```

## 🐳 Docker Development Workflow

### Essential Docker Commands
```bash
# Start all services (PostgreSQL, Strapi, Next.js)
npm run dev

# Start with fresh build
npm run dev:build

# Stop all services
npm run down

# View logs
npm run logs
npm run logs:frontend
npm run logs:strapi
npm run logs:db

# Clean everything (destructive)
npm run down:volumes
npm run clean
```

### Docker Development Patterns
- **ALWAYS use Docker for development** - ensures consistency across team
- **Local node_modules** are for IDE support only
- **Container node_modules** are used at runtime
- **Volume mounts** enable hot reload for code changes
- **Persistent volumes** preserve database data between restarts

## 💅 Code Style & Quality

### Development Commands
```json
{
  "scripts": {
    "dev": "docker-compose up",
    "dev:build": "docker-compose up --build",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:e2e": "playwright test",
    "lint": "next lint --max-warnings 0",
    "lint:fix": "next lint --fix",
    "type-check": "tsc --noEmit",
    "validate": "npm run type-check && npm run lint && npm run test:coverage"
  }
}
```

## ⚠️ CRITICAL GUIDELINES (MUST FOLLOW ALL)

1. **ENFORCE strict TypeScript** - ZERO compromises on type safety
2. **VALIDATE everything with Zod** - ALL external data must be validated
3. **MINIMUM 80% test coverage** - NO EXCEPTIONS
4. **MUST use Docker for development** - Ensures environment consistency
5. **MAXIMUM 500 lines per file** - Split if larger
6. **MAXIMUM 200 lines per component** - Refactor if larger
7. **MUST handle ALL states** - Loading, error, empty, and success
8. **MUST use semantic commits** - feat:, fix:, docs:, refactor:, test:
9. **MUST write complete JSDoc** - ALL exports must be documented
10. **NEVER use `any` type** - Use proper typing or `unknown`
11. **MUST validate Strapi responses** - Never trust external API data

## 📋 Pre-commit Checklist (MUST COMPLETE ALL)

- [ ] TypeScript compiles with ZERO errors (`npm run type-check`)
- [ ] Tests written and passing with 80%+ coverage (`npm run test:coverage`)
- [ ] E2E tests pass (`npm run test:e2e`)
- [ ] ESLint passes with ZERO warnings (`npm run lint`)
- [ ] All Strapi API calls use validated schemas
- [ ] All components have complete JSDoc documentation
- [ ] Zod schemas validate ALL external data
- [ ] ALL states handled (loading, error, empty, success)
- [ ] Error boundaries implemented for features
- [ ] Accessibility requirements met (ARIA labels, keyboard nav)
- [ ] No console.log statements in production code
- [ ] Environment variables validated with Zod
- [ ] Component files under 200 lines
- [ ] Docker services start successfully
- [ ] Strapi CMS integration tested

### FORBIDDEN Practices
- **NEVER use `any` type** (except library declaration merging with comments)
- **NEVER skip tests** for new functionality
- **NEVER ignore TypeScript errors** with `@ts-ignore`
- **NEVER trust external data** without Zod validation
- **NEVER use `JSX.Element`** - use `ReactElement` instead
- **NEVER store sensitive data** in localStorage or client state
- **NEVER use dangerouslySetInnerHTML** without sanitization
- **NEVER exceed file/component size limits**
- **NEVER develop outside Docker** - breaks environment consistency
- **NEVER commit** without passing all quality checks
- **NEVER modify core dependencies** without team discussion

---

*This guide is optimized for the AR Automation Website stack: Next.js 14 + React 18 + Strapi 4 + PostgreSQL.*
*Focus on type safety, Docker consistency, and Strapi integration in all development decisions.*
*Last updated: October 2025*