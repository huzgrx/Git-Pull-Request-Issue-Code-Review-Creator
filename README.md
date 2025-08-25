# 🤖 Pull-Merge Bot

[![Node.js](https://img.shields.io/badge/Node.js-14+-green.svg)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/Version-2.0.0-orange.svg)](package.json)
[![GitHub](https://img.shields.io/badge/GitHub-API-orange.svg)](https://developer.github.com/v3/)
[![npm](https://img.shields.io/badge/npm-package-blue.svg)](https://www.npmjs.com/)

> **Automated GitHub bot that creates pull requests, performs code reviews, and creates issues with configurable random chance. Perfect for increasing GitHub contribution graphs and maintaining repository activity.**

## 🚀 Quick Start

### Install as npm package

```bash
npm install pull-merge-bot
```

### Use in your code

```javascript
const { PullMergeBot } = require("pull-merge-bot");

const bot = new PullMergeBot({
  tokenA: "your_github_token_a",
  tokenB: "your_github_token_b",
  repoOwner: "your_username",
  repoName: "your-repo",
  forkOwner: "your_username",
  createIssue: true,
  enableCodeReview: true,
  randomChancePercentage: 30,
});

// Run the bot
const success = await bot.run();
```

### Use as CLI tool

```bash
# Install globally
npm install -g pull-merge-bot

# Run with configuration
pull-merge-bot run

# Show current config
pull-merge-bot config

# Setup wizard
pull-merge-bot setup
```

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

- **Issue Creation**: Triggers based on `randomChancePercentage` when enabled
- **Code Review**: Triggers based on `randomChancePercentage` when enabled
- **Natural Patterns**: Makes activity look organic and human-like
- **Predictable**: Same PR will have consistent behavior

## 🛠️ Installation & Usage

### Method 1: npm package (Recommended)

#### Install

```bash
npm install pull-merge-bot
```

#### Basic Usage

```javascript
const { PullMergeBot } = require("pull-merge-bot");

const bot = new PullMergeBot({
  tokenA: process.env.TOKEN_A,
  tokenB: process.env.TOKEN_B,
  repoOwner: "yourusername",
  repoName: "your-repo",
  forkOwner: "yourusername",
});

// Run the bot
bot.run().then((success) => {
  if (success) {
    console.log("✅ Bot completed successfully!");
  }
});
```

#### Advanced Configuration

```javascript
const bot = new PullMergeBot({
  // Required
  tokenA: "ghp_your_token_a",
  tokenB: "ghp_your_token_b",
  repoOwner: "yourusername",
  repoName: "your-repo",
  forkOwner: "yourusername",

  // Optional
  branchName: "feature-branch",
  createIssue: true,
  issueType: "enhancement",
  issueTitle: "Custom Issue Title",
  issueBody: "Custom issue description",
  enableCodeReview: true,
  randomChancePercentage: 50,
});
```

### Method 2: CLI Tool

#### Install globally

```bash
npm install -g pull-merge-bot
```

#### Run with environment variables

```bash
# Set environment variables in .env file
export TOKEN_A=your_token_a
export TOKEN_B=your_token_b
export REPO_OWNER=yourusername
export REPO_NAME=your-repo
export FORK_OWNER=yourusername

# Run the bot
pull-merge-bot run
```

#### Run with command line options

```bash
pull-merge-bot run \
  --token-a your_token_a \
  --token-b your_token_b \
  --repo-owner yourusername \
  --repo-name your-repo \
  --fork-owner yourusername \
  --create-issue \
  --enable-code-review \
  --random-chance 50
```

#### CLI Commands

```bash
# Show help
pull-merge-bot --help

# Show current configuration
pull-merge-bot config

# Setup wizard
pull-merge-bot setup

# Run with specific options
pull-merge-bot run --create-issue --enable-code-review
```

## 🔧 Configuration

### Configuration Options

| Option                   | Type    | Required | Default                      | Description                          |
| ------------------------ | ------- | -------- | ---------------------------- | ------------------------------------ |
| `tokenA`                 | string  | ✅       | -                            | GitHub token for invited user        |
| `tokenB`                 | string  | ✅       | -                            | GitHub token for repository owner    |
| `repoOwner`              | string  | ✅       | -                            | Repository owner username            |
| `repoName`               | string  | ✅       | -                            | Repository name                      |
| `forkOwner`              | string  | ✅       | -                            | Invited user username                |
| `branchName`             | string  | ❌       | `"jonny"`                    | Branch to work with                  |
| `createIssue`            | boolean | ❌       | `false`                      | Enable issue creation                |
| `issueType`              | string  | ❌       | `"enhancement"`              | Issue type (bug/feature/enhancement) |
| `issueTitle`             | string  | ❌       | `"Automated Issue Creation"` | Custom issue title                   |
| `issueBody`              | string  | ❌       | Generic message              | Custom issue description             |
| `enableCodeReview`       | boolean | ❌       | `false`                      | Enable code review                   |
| `randomChancePercentage` | number  | ❌       | `30`                         | Probability percentage (1-100)       |

### Environment Variables

Create a `.env` file:

```env
# Required
TOKEN_A=your_github_token_a
TOKEN_B=your_github_token_b
REPO_OWNER=your_username
REPO_NAME=your_repo
FORK_OWNER=your_username

# Optional
BRANCH_NAME=feature-branch
CREATE_ISSUE=true
ISSUE_TYPE=enhancement
ENABLE_CODE_REVIEW=true
RANDOM_CHANCE_PERCENTAGE=30
```

## 📊 Examples

### Example 1: Minimal Setup

```javascript
const { PullMergeBot } = require("pull-merge-bot");

const bot = new PullMergeBot({
  tokenA: process.env.TOKEN_A,
  tokenB: process.env.TOKEN_B,
  repoOwner: "yourusername",
  repoName: "your-repo",
  forkOwner: "yourusername",
});

await bot.run();
```

### Example 2: Full Features

```javascript
const bot = new PullMergeBot({
  tokenA: "ghp_your_token_a",
  tokenB: "ghp_your_token_b",
  repoOwner: "yourusername",
  repoName: "your-repo",
  forkOwner: "yourusername",
  branchName: "enhancement-branch",
  createIssue: true,
  issueType: "feature",
  issueTitle: "New Feature Request",
  issueBody: "Requesting new feature implementation",
  enableCodeReview: true,
  randomChancePercentage: 50,
});

await bot.run();
```

### Example 3: Factory Function

```javascript
const { createBot } = require("pull-merge-bot");

const bot = createBot({
  tokenA: process.env.TOKEN_A,
  tokenB: process.env.TOKEN_B,
  repoOwner: process.env.REPO_OWNER,
  repoName: process.env.REPO_NAME,
  forkOwner: process.env.FORK_OWNER,
  createIssue: true,
  enableCodeReview: true,
});

await bot.run();
```

## 🎯 Use Cases

### Low Activity (10-20%)

```javascript
randomChancePercentage: 10;
```

Perfect for maintaining minimal activity without being too obvious.

### Balanced Activity (30-40%)

```javascript
randomChancePercentage: 30;
```

Default setting for natural, balanced contribution patterns.

### High Activity (50-70%)

```javascript
randomChancePercentage: 50;
```

For more frequent contributions and active repository engagement.

### Maximum Activity (80-100%)

```javascript
randomChancePercentage: 100;
```

For maximum contribution activity and repository maintenance.

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

## 📈 Benefits

### For Developers

- **Automated Workflow**: Reduces manual repository maintenance by 90%
- **Contribution Enhancement**: Naturally increases GitHub activity
- **Learning Tool**: Great for understanding GitHub API and automation
- **Customizable**: Flexible configuration for different needs

### For Repositories

- **Active Maintenance**: Keeps repositories engaging and active
- **Quality Reviews**: Automated code review with detailed analysis
- **Issue Tracking**: Automated issue creation and management
- **Natural Patterns**: Realistic activity that doesn't look automated

### For Teams

- **Collaboration**: Supports multiple account workflows
- **Role Separation**: Clear separation of responsibilities
- **Audit Trail**: Detailed logging and activity tracking
- **Scalable**: Easy to configure for multiple repositories

## 🛠️ Development

### Clone and Install

```bash
git clone https://github.com/yourusername/pull-merge-bot.git
cd pull-merge-bot
npm install
```

### Build

```bash
npm run build
```

### Development

```bash
npm run dev
```

### Test

```bash
npm test
```

## 📞 Support

### Documentation

- **README.md**: This file with comprehensive examples
- **CONFIGURATION.md**: Detailed configuration guide
- **PROJECT_INDEX.md**: Complete project overview
- **examples/**: Code examples and usage patterns

### Getting Help

1. **Check the documentation** - README.md and CONFIGURATION.md
2. **Review examples** - examples/basic-usage.js
3. **Use CLI help** - `pull-merge-bot --help`
4. **Open an issue** - GitHub issues for bugs and questions

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Octokit](https://github.com/octokit/octokit.js) for GitHub API integration
- Uses [dotenv](https://github.com/motdotla/dotenv) for environment management
- CLI built with [Commander.js](https://github.com/tj/commander.js)
- Inspired by the need for automated repository maintenance

---

⭐ **If this project helps you, please give it a star!** ⭐

🔗 **GitHub**: https://github.com/yourusername/pull-merge-bot

📦 **npm**: https://www.npmjs.com/package/pull-merge-bot
