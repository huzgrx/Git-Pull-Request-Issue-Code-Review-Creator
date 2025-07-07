# Configuration Guide

This guide explains all the environment variables available for the Pull-Merge Bot v2.0.0.

## Environment Variables

Create a `.env` file in your project root with the following variables:

### Required Variables

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
```

### Optional Variables

```env
# Branch name (defaults to "jonny")
BRANCH_NAME=your_branch_name
```

### 🆕 Enhanced Features (Optional)

```env
# Enable issue creation (true/false, defaults to false)
CREATE_ISSUE=true

# Type of issue to create (bug/feature/enhancement, defaults to enhancement)
ISSUE_TYPE=enhancement

# Custom issue title (defaults to "Automated Issue Creation")
ISSUE_TITLE=Automated Issue Creation

# Custom issue description (defaults to generic message)
ISSUE_BODY=This issue was created automatically by the pull-merge bot.

# Enable automated code review (true/false, defaults to false)
ENABLE_CODE_REVIEW=true

# Probability percentage for features (1-100, defaults to 30)
RANDOM_CHANCE_PERCENTAGE=30
```

## Configuration Examples

### Basic Setup (v1.0.0 compatible)

```env
TOKEN_A=ghp_your_token_a_here
TOKEN_B=ghp_your_token_b_here
REPO_OWNER=huzgrx
REPO_NAME=your-repo
FORK_OWNER=huzgrx
BRANCH_NAME=main
```

### Issue Creation Only

```env
TOKEN_A=ghp_your_token_a_here
TOKEN_B=ghp_your_token_b_here
REPO_OWNER=huzgrx
REPO_NAME=your-repo
FORK_OWNER=huzgrx
BRANCH_NAME=feature-branch
CREATE_ISSUE=true
ISSUE_TYPE=feature
ISSUE_TITLE=New Feature Request
ISSUE_BODY=Requesting implementation of new feature
```

### Code Review Only

```env
TOKEN_A=ghp_your_token_a_here
TOKEN_B=ghp_your_token_b_here
REPO_OWNER=huzgrx
REPO_NAME=your-repo
FORK_OWNER=huzgrx
BRANCH_NAME=main
ENABLE_CODE_REVIEW=true
```

### Full Feature Set

```env
TOKEN_A=ghp_your_token_a_here
TOKEN_B=ghp_your_token_b_here
REPO_OWNER=huzgrx
REPO_NAME=your-repo
FORK_OWNER=huzgrx
BRANCH_NAME=enhancement-branch
CREATE_ISSUE=true
ISSUE_TYPE=enhancement
ISSUE_TITLE=Repository Enhancement
ISSUE_BODY=Automated enhancement request for repository improvements
ENABLE_CODE_REVIEW=true
RANDOM_CHANCE_PERCENTAGE=50
```

## Issue Types

The `ISSUE_TYPE` variable supports the following values:

- `bug`: For bug reports and fixes
- `feature`: For new feature requests
- `enhancement`: For improvements to existing features

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

### 🎲 Random Chance System

- **Configurable Probability**: Set `RANDOM_CHANCE_PERCENTAGE` (1-100, defaults to 30)
- **Independent Events**: Each feature has its own random chance
- **Clear Logging**: Console shows when features are triggered or skipped
- **Predictable**: Same PR will have consistent behavior (triggered or skipped)

## Token Permissions

### Token A (Account creating PR)

Required scopes:

- `repo` (full control of private repositories)
- `issues` (if issue creation is enabled)

**Important**: Token A will be used for code reviews, so review contributions will be credited to Account A.

### Token B (Account merging PR)

Required scopes:

- `repo` (full control of private repositories)

**Note**: Token B is only used for merging PRs and approving reviews, not for code review comments.

## Validation

The bot will validate all required environment variables on startup and provide helpful error messages if any are missing or invalid.

## Troubleshooting

### Common Issues

1. **Missing Environment Variables**

   ```
   ❌ Missing required environment variables. Please check your .env file.
   Required: TOKEN_A, TOKEN_B, REPO_OWNER, FORK_OWNER, REPO_NAME
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

## Best Practices

1. **Use descriptive branch names** - Instead of "jonny", use meaningful names like "feature-bot-enhancement"
2. **Customize issue content** - Make issues more meaningful with specific titles and descriptions
3. **Enable code review** - Get detailed analysis of your changes and increase Account A's review contributions (30% chance)
4. **Regular updates** - Run the bot regularly to maintain activity
5. **Monitor logs** - Check console output for any issues or warnings
6. **Account attribution** - Remember that code reviews will be credited to Account A (invited user)
7. **Random chance awareness** - Understand that features only trigger 30% of the time when enabled
8. **Separated roles** - Account A reviews, Account B approves and merges

## 🎲 Random Chance Examples

### Configuration with Random Chance

```env
# Enable features with configurable chance
CREATE_ISSUE=true
ENABLE_CODE_REVIEW=true
RANDOM_CHANCE_PERCENTAGE=50

# These will only trigger 50% of the time
ISSUE_TYPE=enhancement
ISSUE_TITLE=Random Enhancement
ENABLE_CODE_REVIEW=true
```

### Expected Behavior

- **50% of runs**: No issue created, no code review performed
- **50% of runs**: Issue created and/or code review performed
- **Clear logging**: Console shows exactly what's happening

### Different Chance Percentages

```env
# 10% chance (rare activity)
RANDOM_CHANCE_PERCENTAGE=10

# 30% chance (default, moderate activity)
RANDOM_CHANCE_PERCENTAGE=30

# 50% chance (frequent activity)
RANDOM_CHANCE_PERCENTAGE=50

# 80% chance (very frequent activity)
RANDOM_CHANCE_PERCENTAGE=80

# 100% chance (always active)
RANDOM_CHANCE_PERCENTAGE=100
```

### Use Cases

- **Low Activity (10-20%)**: For maintaining minimal activity
- **Moderate Activity (30-40%)**: Default balanced approach
- **High Activity (50-70%)**: For more frequent contributions
- **Always Active (100%)**: For maximum contribution activity
