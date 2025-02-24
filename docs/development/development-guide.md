# Development Guide

## Quick Start

1. Install dependencies:

```bash
npm install
```

1. Start development server (with clean start):

```bash
npm run dev:clean
```

This command will:

- Stop any running Node.js processes
- Start a fresh development server on port 3000
- Enable live reloading and hot module replacement

1. Visit `http://localhost:3000`

## Available Scripts

- `npm run dev:clean` - Clean start development server
- `npm run dev` - Start development server
- `npm run clean` - Stop all Node.js processes
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run linting

## Live Development

The project is configured for optimal development experience with:

- Fast Refresh: See changes instantly without losing component state
- Hot Module Replacement: Update modules in-place
- Live Reloading: Automatic browser refresh on file changes

### Development Features

- **Fast Refresh**: Changes to React components update instantly
- **CSS Hot Reloading**: Style changes apply immediately
- **Type Checking**: Real-time TypeScript errors
- **Error Overlay**: Clear error reporting in browser
- **Source Maps**: Easy debugging

### Best Practices

1. **Component Development**
   - Keep components focused and single-responsibility
   - Use TypeScript for better type safety
   - Follow the established patterns in `src/components`

2. **Styling**
   - Use Tailwind utilities when possible
   - Follow the design system tokens
   - Keep styles modular and reusable

3. **State Management**
   - Keep state close to where it's used
   - Use React hooks effectively
   - Follow established patterns

4. **Performance**
   - Use React.memo for expensive renders
   - Lazy load components when appropriate
   - Optimize images and assets

### File Organization

src/
├── app/              # Next.js app directory
├── components/       # Reusable components
├── lib/             # Utilities and helpers
├── styles/          # Global styles
└── types/           # TypeScript types

### Development Workflow

1. **Starting Development**

   ```bash
   npm run dev
   ```

2. **Making Changes**
   - Edit files in `src/`
   - Changes reflect immediately in browser
   - Check console for errors

3. **Testing Changes**

   ```bash
   npm run test        # Run tests
   npm run lint        # Check linting
   npm run build       # Test production build
   ```

4. **Committing Changes**
   - Follow conventional commits
   - Update documentation
   - Add tests for new features

### Troubleshooting

If live reload isn't working:

1. Check if development server is running
2. Clear browser cache
3. Restart development server
4. Check for TypeScript errors

### Documentation

Keep documentation up to date:

1. Update component documentation
2. Document new features
3. Update changelog
4. Add migration notes if needed

## Next Steps

1. Review the [Architecture Overview](../getting-started/architecture.md)
2. Check the [UI Components](../components/ui-components.md)
3. Follow the [Contributing Guidelines](./contributing.md)
