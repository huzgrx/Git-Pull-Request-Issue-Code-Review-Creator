# 🤝 Contributing to Pull-Merge Bot

Thank you for your interest in contributing to Pull-Merge Bot! This document provides guidelines and information for contributors.

## 🎯 How to Contribute

### 🐛 Reporting Bugs

1. **Check existing issues** - Search for similar issues before creating a new one
2. **Use the bug report template** - Provide detailed information about the bug
3. **Include environment details** - OS, Node.js version, configuration
4. **Describe the expected behavior** - What should happen vs what actually happens

### 💡 Suggesting Features

1. **Check existing feature requests** - Search for similar suggestions
2. **Use the feature request template** - Provide detailed description
3. **Explain the use case** - How would this feature help users?
4. **Consider implementation** - Is this feasible and valuable?

### 🔧 Code Contributions

1. **Fork the repository** - Create your own fork
2. **Create a feature branch** - Use descriptive branch names
3. **Make your changes** - Follow the coding standards
4. **Test your changes** - Ensure everything works correctly
5. **Submit a pull request** - Use the PR template

## 📋 Development Setup

### Prerequisites

- Node.js >= 14.0.0
- Git
- GitHub account with repository access

### Local Development

```bash
# Clone your fork
git clone https://github.com/huzgrx/pull-merge-bot.git
cd pull-merge-bot

# Install dependencies
npm install

# Create environment file
cp env_default .env

# Configure your environment variables
# Edit .env with your GitHub tokens and settings

# Run the bot
npm start
```

### Development Scripts

```bash
# Start development with nodemon
npm run dev

# Run tests (when implemented)
npm test

# Start production
npm start
```

## 📝 Coding Standards

### JavaScript Style

- Use **ES6+ features** where appropriate
- Follow **consistent indentation** (2 spaces)
- Use **descriptive variable names**
- Add **comments** for complex logic
- Handle **errors properly**

### Code Structure

```javascript
// Good example
async function performCodeReview(prNumber) {
  try {
    console.log(`🔍 Performing code review on PR #${prNumber}...`);

    // Implementation here

    return true;
  } catch (error) {
    console.error("❌ Error performing code review:", error.message);
    return false;
  }
}
```

### Documentation

- **Update README.md** for new features
- **Add comments** to complex functions
- **Update CONFIGURATION.md** for new environment variables
- **Include examples** for new features

## 🧪 Testing

### Manual Testing

1. **Test with different configurations** - Try various environment variable combinations
2. **Test error scenarios** - Invalid tokens, missing permissions, etc.
3. **Test edge cases** - Empty repositories, large files, etc.
4. **Test with different repositories** - Public, private, different sizes

### Automated Testing (Future)

```bash
# Run unit tests
npm test

# Run integration tests
npm run test:integration

# Run all tests with coverage
npm run test:coverage
```

## 📋 Pull Request Guidelines

### Before Submitting

1. **Test your changes** - Ensure everything works correctly
2. **Update documentation** - Add/update relevant documentation
3. **Follow coding standards** - Use consistent style and formatting
4. **Add tests** - Include tests for new features (when test framework is added)

### PR Template

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Configuration change

## Testing

- [ ] Tested locally
- [ ] Updated documentation
- [ ] No breaking changes

## Checklist

- [ ] Code follows project style
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No console errors
```

## 🏷️ Issue Labels

### Bug Reports

- `bug` - Something isn't working
- `high-priority` - Critical issue affecting functionality
- `low-priority` - Minor issue or enhancement

### Feature Requests

- `enhancement` - New feature or improvement
- `good first issue` - Good for new contributors
- `help wanted` - Looking for contributors

### Documentation

- `documentation` - Documentation improvements
- `question` - Questions about usage or implementation

## 🎯 Areas for Contribution

### High Priority

- **Error Handling**: Improve error messages and recovery
- **Documentation**: Enhance guides and examples
- **Configuration**: Add more environment variable options
- **Testing**: Implement automated test suite

### Medium Priority

- **Performance**: Optimize API calls and processing
- **Features**: Add new automation capabilities
- **UI**: Create web dashboard (if desired)
- **Analytics**: Add activity reporting and metrics

### Low Priority

- **Refactoring**: Improve code structure and organization
- **Examples**: Add more configuration examples
- **Templates**: Create issue and PR templates
- **CI/CD**: Add GitHub Actions workflows

## 🤝 Community Guidelines

### Be Respectful

- **Be kind** to other contributors
- **Provide constructive feedback**
- **Help newcomers** get started
- **Respect different opinions**

### Communication

- **Use clear language** in issues and PRs
- **Provide context** for suggestions
- **Ask questions** when unsure
- **Share knowledge** with the community

### Recognition

- **Contributors will be credited** in the README
- **Significant contributions** will be highlighted
- **All contributors** are appreciated and valued

## 📞 Getting Help

### Before Asking

1. **Check the documentation** - README.md and CONFIGURATION.md
2. **Search existing issues** - Your question might already be answered
3. **Try the troubleshooting guide** - Common solutions are documented

### When Asking

1. **Provide context** - What are you trying to accomplish?
2. **Include details** - Environment, configuration, error messages
3. **Be specific** - What exactly isn't working?
4. **Show effort** - What have you already tried?

## 🎉 Recognition

### Contributors Hall of Fame

Contributors will be recognized in the project README and documentation.

### Types of Recognition

- **Code Contributors** - Direct code contributions
- **Documentation Contributors** - Documentation improvements
- **Bug Reporters** - Helpful bug reports
- **Feature Suggesters** - Valuable feature ideas
- **Community Helpers** - Supporting other users

---

Thank you for contributing to Pull-Merge Bot! Your contributions help make this project better for everyone. 🌟
