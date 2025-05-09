# Contributing to WhatsApp Clone with CRM

Thank you for your interest in contributing to our WhatsApp Clone with CRM capabilities! This document provides guidelines and instructions for contributing.

## Team Structure

Our project is managed by a team with specific roles:

- **Team Leader**: Overall project coordination and final decision maker
- **Product Manager**: Feature prioritization and user story development
- **Architect**: Technical architecture decisions and code quality standards
- **Engineers**: Implementation of features and bug fixes
- **Testers**: Quality assurance and regression testing

## Getting Started

1. Fork the repository and clone it locally
2. Install dependencies with `npm install`
3. Create a new branch for your work
4. Make your changes
5. Write or update tests as necessary
6. Run tests with `npm run test`
7. Submit a pull request

## Development Workflow

1. **Pick an Issue**: Choose an open issue to work on, or create a new one
2. **Discuss**: For significant changes, discuss in the issue first
3. **Branch**: Create a feature branch from `main` (e.g., `feature/contact-tags`)
4. **Code**: Write your code following the code standards
5. **Test**: Add tests and ensure all tests pass
6. **Document**: Update documentation as needed
7. **PR**: Submit a pull request with a clear description of changes

## Code Style and Standards

- Follow the existing code style (ESLint and Prettier are configured)
- Use TypeScript for type safety
- Write comprehensive tests for new features
- Document your code with comments as needed
- Run `npm run lint:fix` and `npm run prettier:fix` before committing

## Pull Request Process

1. Ensure your PR addresses a specific issue
2. Include a clear description of changes
3. Update documentation as necessary
4. Write or update tests to cover your changes
5. Ensure all tests and CI checks pass
6. Request review from at least one team member
7. Address feedback from reviewers

## CRM Feature Development

When working on CRM features:

1. Maintain consistent UI/UX with the rest of the application
2. Follow the established pattern for API routes and data handling
3. Consider performance implications, especially for database operations
4. Update Prisma schema when adding new data models
5. Create migrations for database changes (`npx prisma migrate dev`)

## Commit Guidelines

- Use clear, descriptive commit messages
- Reference issue numbers in commits when applicable
- Keep commits focused on a single logical change
- Squash multiple commits on a feature branch if needed

## Testing Guidelines

- Write unit tests for utility functions and hooks
- Write integration tests for API routes
- Write component tests for React components
- For CRM features, ensure database operations are tested

## Communication

- Use GitHub issues for bug reports and feature requests
- Use pull requests for code review discussions
- Tag relevant team members when needed

## License

By contributing, you agree that your contributions will be licensed under the project's MIT License. 