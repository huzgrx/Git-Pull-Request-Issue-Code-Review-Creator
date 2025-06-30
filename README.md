# Pull Merge Bot

A GitHub bot that automatically creates pull requests from a fork and merges them using two different GitHub accounts. Now with enhanced features including issue creation and automated code review!

## 🆕 New Features in v2.0.0

### 📝 Issue Creation

- Automatically create issues with customizable types (bug, feature, enhancement)
- Configurable issue titles and descriptions
- Automatic labeling and metadata

### 🔍 Code Review Contribution

- Automated code review with detailed analysis
- File-by-file change analysis
- Smart suggestions and recommendations
- **Code review by invited account, approval by repo owner**
- Enhanced PR descriptions and documentation
- **Review contributions credited to invited account (Account A)**
- **Random 30% chance for code review (when enabled)**

## Setup

1. Create a `.env` file in the root directory with the following variables:

```env
# GitHub Account A (the one creating the PR)
TOKEN_A=your_github_token_for_account_a

# GitHub Account B (the one merging the PR - should be the owner)
TOKEN_B=your_github_token_for_account_b

# Repository details
REPO_OWNER=your_repository_owner
REPO_NAME=your_repository_name

# Fork owner (Account A's username)
FORK_OWNER=your_fork_owner_username

# Branch name (optional, defaults to "jonny")
BRANCH_NAME=your_branch_name

# 🆕 Enhanced Features (optional)
CREATE_ISSUE=true
ISSUE_TYPE=enhancement
ISSUE_TITLE=Automated Issue Creation
ISSUE_BODY=This issue was created automatically by the pull-merge bot.
ENABLE_CODE_REVIEW=true
RANDOM_CHANCE_PERCENTAGE=30
```

2. Install dependencies:

```bash
npm install
```

3. Run the bot:

```bash
node server.js
```

## How it works

### 🤖 Enhanced Workflow (v2.0.0)

1. **Issue Creation** (if enabled + 30% chance): Creates an issue with specified type and details
2. **Account A** creates a pull request from the specified branch to the `main` branch
3. **Code Review** (if enabled + 30% chance): Performs automated code review with detailed analysis
4. **Account A** provides review comments, **Account B** approves the PR
5. **Account B** (repository owner) automatically merges the pull request
6. **Post-merge**: Adds detailed merge summary comment

### 🎲 Random Chance System

The bot now uses a **configurable random chance** for both issue creation and code review:

- **Issue Creation**: Only triggers based on `RANDOM_CHANCE_PERCENTAGE` when `CREATE_ISSUE=true`
- **Code Review**: Only triggers based on `RANDOM_CHANCE_PERCENTAGE` when `ENABLE_CODE_REVIEW=true`
- **Configurable**: Set `RANDOM_CHANCE_PERCENTAGE=50` for 50% chance, `RANDOM_CHANCE_PERCENTAGE=10` for 10% chance
- **Logging**: Clear console messages show when features are triggered or skipped
- **Predictable**: Same features will be skipped/triggered for existing PRs

### 📊 Code Review Features

The bot now provides comprehensive code review including:

- **File Analysis**: Reviews each changed file for type and scope
- **Change Metrics**: Tracks additions, deletions, and total changes
- **Smart Suggestions**: Provides context-aware recommendations
- **Documentation Review**: Special handling for README and documentation files
- **Code Quality Checks**: Identifies large changes and suggests testing
- **Separated Roles**: Account A reviews, Account B approves
- **Automatic Approval**: Approves PRs with detailed review comments

### 📝 Issue Creation Features

- **Multiple Types**: Support for bug, feature, and enhancement issues
- **Custom Content**: Configurable titles and descriptions
- **Automatic Labeling**: Adds relevant labels automatically
- **Metadata**: Includes creation timestamp and bot information
- **Random 30% chance for issue creation (when enabled)**

## Environment Variables

### Required:

- `TOKEN_A`: GitHub token for Account A (invited user)
- `TOKEN_B`: GitHub token for Account B (repository owner)
- `REPO_OWNER`: Username of the repository owner
- `REPO_NAME`: Name of the repository
- `FORK_OWNER`: Username of Account A (invited user)

### Optional:

- `BRANCH_NAME`: Name of the branch to work with (defaults to "jonny")

### 🆕 Enhanced Features (Optional):

- `CREATE_ISSUE`: Enable issue creation (true/false, defaults to false)
- `ISSUE_TYPE`: Type of issue to create (bug/feature/enhancement, defaults to enhancement)
- `ISSUE_TITLE`: Custom issue title (defaults to "Automated Issue Creation")
- `ISSUE_BODY`: Custom issue description (defaults to generic message)
- `ENABLE_CODE_REVIEW`: Enable automated code review (true/false, defaults to false)
- `RANDOM_CHANCE_PERCENTAGE`: Probability percentage for features (1-100, defaults to 30)

## Requirements

- Account A must have a fork of the repository
- Account A must have access to the repository (invited as collaborator)
- Account B must be the owner of the target repository
- Both accounts must have appropriate permissions

## Private Repository Setup

Since your repository is private, ensure both tokens have the following permissions:

### Token A (Account creating PR):

- `repo` scope (full control of private repositories)
- Access to the repository (invited as collaborator)
- Permission to create pull requests to the original repository
- Permission to create issues (if issue creation is enabled)

### Token B (Account merging PR):

- `repo` scope (full control of private repositories)
- Owner or admin access to the target repository
- Permission to merge pull requests
- Permission to review and approve PRs (if code review is enabled)

### Additional Steps for Private Repos:

1. **Invite Account A**: Account B (owner) must invite Account A as a collaborator
2. **Verify access**: Both accounts should be able to see and access the repository
3. **Enable features**: Set appropriate environment variables for desired features

## 🤖 Bot Capabilities

### Code Review Contribution

The bot significantly increases your code review contribution by:

- **Automated Reviews**: Performs detailed code reviews on every PR (30% chance)
- **File Analysis**: Analyzes changes in JavaScript, TypeScript, and Markdown files
- **Smart Comments**: Provides context-aware suggestions and feedback
- **Quality Metrics**: Tracks code quality and change patterns
- **Documentation**: Maintains detailed review records
- **Account Attribution**: All review contributions are credited to the invited account (Account A)
- **Separated Roles**: Review comments from Account A, approval from Account B

### Issue Management

- **Automated Creation**: Creates issues with proper categorization (30% chance)
- **Metadata Tracking**: Includes timestamps and bot information
- **Label Management**: Automatically applies relevant labels
- **Custom Content**: Supports customizable issue content

## Troubleshooting

If you get permission errors:

- Check that both tokens have the `repo` scope
- Verify Account A has access to the private repository
- Ensure Account B has admin/owner permissions on the repository
- Make sure the repository is properly accessible by Account A
- For issue creation: Ensure Account A has permission to create issues
- For code review: Ensure Account B has permission to review and approve PRs

## 🚀 Getting Started with Enhanced Features

### Enable Issue Creation

```env
CREATE_ISSUE=true
ISSUE_TYPE=enhancement
ISSUE_TITLE=My Custom Issue
ISSUE_BODY=This is a custom issue description
```

### Enable Code Review

```env
ENABLE_CODE_REVIEW=true
```

### Full Feature Set

```env
CREATE_ISSUE=true
ISSUE_TYPE=feature
ISSUE_TITLE=New Feature Request
ISSUE_BODY=Requesting new feature implementation
ENABLE_CODE_REVIEW=true
BRANCH_NAME=feature-branch
RANDOM_CHANCE_PERCENTAGE=50
```

## 📈 Contribution Impact

This bot helps increase your GitHub contribution graph by:

1. **Regular Commits**: Automated README updates create regular commit activity
2. **Pull Requests**: Creates and manages PRs automatically
3. **Code Reviews**: Performs detailed code reviews (configurable chance, credited to Account A)
4. **Issue Creation**: Creates issues (configurable chance, counts as issue contributions)
5. **Repository Activity**: Maintains active repository engagement

**Note**: Code review contributions are specifically credited to the invited account (Account A), helping increase that account's GitHub contribution graph and review activity. Both issue creation and code review have a configurable random chance to occur when enabled.

## 🎲 Random Chance Examples

### When Code Review is Triggered (configurable chance)

```
🎲 Random chance triggered: Performing code review...
🔍 Performing code review on PR #123 by invited-user...
✅ Code review comment added to PR #123 by invited-user
✅ PR #123 approved by repo-owner
✅ Code review completed by invited-user and approved by repo-owner
```

### When Code Review is Skipped

```
🎲 Random chance not triggered: Skipping code review
```

### When Issue Creation is Triggered (configurable chance)

```
🎲 Random chance triggered: Creating issue...
📝 Creating issue...
✅ Issue created successfully: #456
```

### When Issue Creation is Skipped

```
🎲 Random chance not triggered: Skipping issue creation
```

### Different Chance Percentages

```env
# 10% chance (rare)
RANDOM_CHANCE_PERCENTAGE=10

# 30% chance (default)
RANDOM_CHANCE_PERCENTAGE=30

# 50% chance (frequent)
RANDOM_CHANCE_PERCENTAGE=50

# 80% chance (very frequent)
RANDOM_CHANCE_PERCENTAGE=80

# 100% chance (always)
RANDOM_CHANCE_PERCENTAGE=100
```

## Version History

### v2.0.0 (Current)

- ✅ Added issue creation functionality
- ✅ Added automated code review system
- ✅ Enhanced PR descriptions and documentation
- ✅ Improved error handling and logging
- ✅ Added post-merge comments and summaries

### v1.0.0

- ✅ Basic PR creation and merging
- ✅ README.md updates
- ✅ Branch management
- ✅ Conflict detection and handling
