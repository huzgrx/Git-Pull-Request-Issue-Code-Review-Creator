# 🤖 Pull Merge Bot

[![Node.js](https://img.shields.io/badge/Node.js-14+-green.svg)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/Version-2.0.0-orange.svg)](package.json)
[![GitHub](https://img.shields.io/badge/GitHub-API-orange.svg)](https://developer.github.com/v3/)

> **Automated GitHub bot that creates pull requests, performs code reviews, and creates issues with configurable random chance. Perfect for increasing GitHub contribution graphs and maintaining repository activity.**

## ✨ Features

### 🚀 Core Features

- **Automated PR Creation**: Creates pull requests from specified branches
- **Smart Code Review**: Performs detailed code analysis with file-by-file review
- **Issue Management**: Creates issues with customizable types and content
- **Random Chance System**: Configurable probability for realistic activity patterns
- **Dual Account Support**: Separate roles for invited user and repository owner

### 🎯 Advanced Features

- **Contribution Optimization**: Increases GitHub contribution graphs naturally
- **File Analysis**: Reviews JavaScript, TypeScript, and Markdown files
- **Quality Metrics**: Tracks code quality and provides smart suggestions
- **Separated Roles**: Review comments from invited account, approval from owner
- **Configurable Activity**: Set custom probability for features (1-100%)

## 🎲 Random Chance System

The bot uses a **configurable random chance** for realistic activity patterns:

- **Issue Creation**: Triggers based on `RANDOM_CHANCE_PERCENTAGE` when enabled
- **Code Review**: Triggers based on `RANDOM_CHANCE_PERCENTAGE` when enabled
- **Natural Patterns**: Makes activity look organic and human-like
- **Predictable**: Same PR will have consistent behavior

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/huzgrx/pull-merge-bot.git
cd pull-merge-bot
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Create a `.env` file:

```env
# Required Variables
TOKEN_A=your_github_token_for_account_a
TOKEN_B=your_github_token_for_account_b
REPO_OWNER=your_repository_owner
REPO_NAME=your_repository_name
FORK_OWNER=your_fork_owner_username

# Optional Variables
BRANCH_NAME=feature-branch
CREATE_ISSUE=true
ENABLE_CODE_REVIEW=true
RANDOM_CHANCE_PERCENTAGE=30
```

### 4. Run the Bot

```bash
npm start
```

## 📋 Requirements

### GitHub Tokens

- **Token A** (invited user): `repo` scope + `issues` scope (if issue creation enabled)
- **Token B** (repository owner): `repo` scope

### Repository Setup

- Account A must be invited as collaborator to the repository
- Account B must have admin/owner permissions
- Repository must be accessible by both accounts

## 🔧 Configuration

### Environment Variables

#### Required

| Variable     | Description                       | Example        |
| ------------ | --------------------------------- | -------------- |
| `TOKEN_A`    | GitHub token for invited user     | `ghp_xxxxxxxx` |
| `TOKEN_B`    | GitHub token for repository owner | `ghp_xxxxxxxx` |
| `REPO_OWNER` | Repository owner username         | `huzgrx`       |
| `REPO_NAME`  | Repository name                   | `my-project`   |
| `FORK_OWNER` | Invited user username             | `invited-user` |

#### Optional

| Variable                   | Description              | Default                    | Example          |
| -------------------------- | ------------------------ | -------------------------- | ---------------- |
| `BRANCH_NAME`              | Branch to work with      | `jonny`                    | `feature-branch` |
| `CREATE_ISSUE`             | Enable issue creation    | `false`                    | `true`           |
| `ISSUE_TYPE`               | Issue type               | `enhancement`              | `feature`        |
| `ISSUE_TITLE`              | Custom issue title       | `Automated Issue Creation` | `Bug Report`     |
| `ISSUE_BODY`               | Custom issue description | Generic message            | Custom text      |
| `ENABLE_CODE_REVIEW`       | Enable code review       | `false`                    | `true`           |
| `RANDOM_CHANCE_PERCENTAGE` | Probability percentage   | `30`                       | `50`             |

## 🎯 Use Cases

### Low Activity (10-20%)

```env
RANDOM_CHANCE_PERCENTAGE=10
```

Perfect for maintaining minimal activity without being too obvious.

### Balanced Activity (30-40%)

```env
RANDOM_CHANCE_PERCENTAGE=30
```

Default setting for natural, balanced contribution patterns.

### High Activity (50-70%)

```env
RANDOM_CHANCE_PERCENTAGE=50
```

For more frequent contributions and active repository engagement.

### Maximum Activity (80-100%)

```env
RANDOM_CHANCE_PERCENTAGE=100
```

For maximum contribution activity and repository maintenance.

## 📊 How It Works

### 🤖 Enhanced Workflow (v2.0.0)

1. **Issue Creation** (configurable chance): Creates issues with specified details
2. **PR Creation**: Account A creates pull request from specified branch
3. **Code Review** (configurable chance): Account A provides detailed review comments
4. **Approval**: Account B approves the PR (if review was performed)
5. **Merge**: Account B merges the pull request
6. **Post-merge**: Account A adds summary comment

### 📈 Contribution Impact

This bot helps increase your GitHub contribution graph by:

1. **Regular Commits**: Automated README updates create regular commit activity
2. **Pull Requests**: Creates and manages PRs automatically
3. **Code Reviews**: Performs detailed code reviews (credited to Account A)
4. **Issue Creation**: Creates issues (counts as issue contributions)
5. **Repository Activity**: Maintains active repository engagement

## 🔍 Code Review Features

- **File Analysis**: Reviews JavaScript, TypeScript, and Markdown files
- **Change Metrics**: Tracks additions, deletions, and total changes
- **Smart Suggestions**: Provides context-aware recommendations
- **Documentation Review**: Special handling for README and documentation files
- **Code Quality Checks**: Identifies large changes and suggests testing
- **Separated Roles**: Account A reviews, Account B approves

## 🎲 Random Chance Examples

### When Features Are Triggered

```
🎲 Random chance triggered: Creating issue...
🎲 Random chance triggered: Performing code review...
```

### When Features Are Skipped

```
🎲 Random chance not triggered: Skipping issue creation
🎲 Random chance not triggered: Skipping code review
```

## 🛠️ Troubleshooting

### Common Issues

1. **Missing Environment Variables**

   ```
   ❌ Missing required environment variables. Please check your .env file.
   ```

2. **Invalid Token**

   ```
   ❌ Repository access validation failed: Bad credentials
   ```

3. **Permission Denied**
   ```
   ❌ Repository access validation failed: Not Found
   ```

### Solutions

1. **Check your `.env` file** - Ensure all required variables are set
2. **Verify token permissions** - Make sure tokens have the correct scopes
3. **Check repository access** - Ensure Account A has been invited to the repository
4. **Validate usernames** - Double-check REPO_OWNER and FORK_OWNER values

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Octokit](https://github.com/octokit/octokit.js) for GitHub API integration
- Uses [dotenv](https://github.com/motdotla/dotenv) for environment management
- Inspired by the need for automated repository maintenance

## 📞 Support

If you have any questions or need help, please:

1. Check the [Configuration Guide](CONFIGURATION.md)
2. Review the [troubleshooting section](#troubleshooting)
3. Open an [issue](https://github.com/huzgrx/pull-merge-bot/issues)

---

⭐ **If this project helps you, please give it a star!** ⭐
