# Project Structure Documentation

## Overview

The Equity Automator is a comprehensive Employment Equity management system designed specifically for South African businesses to comply with EE regulations.

## Directory Structure

equity-automator/
├── src/
│   ├── app/                    # Next.js App Router directory
│   │   ├── (auth)/            # Authentication routes
│   │   ├── (marketing)/       # Public marketing pages
│   │   ├── (dashboard)/       # Protected dashboard routes
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/            # Reusable components
│   │   ├── ui/               # UI components
│   │   └── shared/           # Shared components
│   ├── lib/                   # Utility functions
│   └── styles/               # Global styles
├── public/                    # Static assets
└── docs/                     # Documentation
    ├── components/           # Component documentation
    ├── features/            # Feature documentation
    └── guides/              # Development guides

## Key Features

- Public Marketing Site
- Authentication System
- Employment Equity Dashboard
- Documentation System
- Live Updates

## Development Guidelines

- All code changes must be documented
- Live reload enabled for development
- TypeScript for type safety
- Tailwind CSS for styling
- Component-based architecture

## Documentation Standards

1. All new features must be documented
2. Code changes must be reflected in docs
3. Documentation must be categorized by:
   - Components
   - Features
   - API References
   - Development Guides
