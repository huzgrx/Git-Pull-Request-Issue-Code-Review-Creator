#!/usr/bin/env node
"use strict";

const {
  Command
} = require("commander");
const chalk = require("chalk");
const {
  PullMergeBot
} = require("./index");
require("dotenv").config();
const program = new Command();
program.name("pull-merge-bot").description("🤖 Automated GitHub bot for creating PRs, code reviews, and issues").version("2.0.0");
program.command("run").description("Run the Pull-Merge Bot with configuration").option("-t, --token-a <token>", "GitHub token for Account A (invited user)").option("-T, --token-b <token>", "GitHub token for Account B (repository owner)").option("-o, --repo-owner <owner>", "Repository owner username").option("-r, --repo-name <name>", "Repository name").option("-f, --fork-owner <owner>", "Fork owner username (Account A)").option("-b, --branch-name <branch>", "Branch name (default: jonny)").option("-i, --create-issue", "Enable issue creation").option("-I, --issue-type <type>", "Issue type: bug, feature, or enhancement").option("-t, --issue-title <title>", "Custom issue title").option("-B, --issue-body <body>", "Custom issue body").option("-c, --enable-code-review", "Enable code review").option("-p, --random-chance <percentage>", "Random chance percentage (1-100, default: 30)").option("--env-file <path>", "Path to .env file (default: .env)").action(async options => {
  try {
    // Load configuration from environment variables or command line options
    const config = {
      tokenA: options.tokenA || process.env.TOKEN_A,
      tokenB: options.tokenB || process.env.TOKEN_B,
      repoOwner: options.repoOwner || process.env.REPO_OWNER,
      forkOwner: options.forkOwner || process.env.FORK_OWNER,
      repoName: options.repoName || process.env.REPO_NAME,
      branchName: options.branchName || process.env.BRANCH_NAME || "jonny",
      createIssue: options.createIssue || process.env.CREATE_ISSUE === "true",
      issueType: options.issueType || process.env.ISSUE_TYPE || "enhancement",
      issueTitle: options.issueTitle || process.env.ISSUE_TITLE || "Automated Issue Creation",
      issueBody: options.issueBody || process.env.ISSUE_BODY || "This issue was created automatically by the pull-merge bot.",
      enableCodeReview: options.enableCodeReview || process.env.ENABLE_CODE_REVIEW === "true",
      randomChancePercentage: parseInt(options.randomChance || process.env.RANDOM_CHANCE_PERCENTAGE) || 30
    };

    // Validate required configuration
    const requiredFields = ["tokenA", "tokenB", "repoOwner", "forkOwner", "repoName"];
    const missingFields = requiredFields.filter(field => !config[field]);
    if (missingFields.length > 0) {
      console.error(chalk.red("❌ Missing required configuration:"));
      missingFields.forEach(field => {
        console.error(chalk.yellow(`   - ${field}`));
      });
      console.error(chalk.blue("\n💡 You can set these via:"));
      console.error(chalk.blue("   - Environment variables (.env file)"));
      console.error(chalk.blue("   - Command line options"));
      console.error(chalk.blue("   - Example: pull-merge-bot run --token-a <token> --repo-owner <owner>"));
      process.exit(1);
    }

    // Validate random chance percentage
    if (config.randomChancePercentage < 1 || config.randomChancePercentage > 100) {
      console.error(chalk.red("❌ Random chance percentage must be between 1 and 100"));
      process.exit(1);
    }

    // Create and run the bot
    const bot = new PullMergeBot(config);
    const success = await bot.run();
    if (success) {
      console.log(chalk.green("\n🎉 Pull-Merge Bot completed successfully!"));
    } else {
      console.log(chalk.red("\n❌ Pull-Merge Bot encountered errors. Check the logs above."));
      process.exit(1);
    }
  } catch (error) {
    console.error(chalk.red("❌ Error running Pull-Merge Bot:"), error.message);
    process.exit(1);
  }
});
program.command("config").description("Show current configuration").action(() => {
  console.log(chalk.blue("🔧 Current Configuration:"));
  console.log(chalk.blue("========================"));
  const config = {
    TOKEN_A: process.env.TOKEN_A ? "***" + process.env.TOKEN_A.slice(-4) : "Not set",
    TOKEN_B: process.env.TOKEN_B ? "***" + process.env.TOKEN_B.slice(-4) : "Not set",
    REPO_OWNER: process.env.REPO_OWNER || "Not set",
    FORK_OWNER: process.env.FORK_OWNER || "Not set",
    REPO_NAME: process.env.REPO_NAME || "Not set",
    BRANCH_NAME: process.env.BRANCH_NAME || "jonny (default)",
    CREATE_ISSUE: process.env.CREATE_ISSUE || "false",
    ISSUE_TYPE: process.env.ISSUE_TYPE || "enhancement",
    ENABLE_CODE_REVIEW: process.env.ENABLE_CODE_REVIEW || "false",
    RANDOM_CHANCE_PERCENTAGE: process.env.RANDOM_CHANCE_PERCENTAGE || "30"
  };
  Object.entries(config).forEach(([key, value]) => {
    console.log(chalk.cyan(`${key.padEnd(25)}: ${value}`));
  });
});
program.command("setup").description("Interactive setup wizard for configuration").action(async () => {
  console.log(chalk.blue("🚀 Pull-Merge Bot Setup Wizard"));
  console.log(chalk.blue("==============================\n"));
  console.log(chalk.yellow("This wizard will help you create a .env file with your configuration.\n"));

  // Note: In a real implementation, you'd use a library like inquirer for interactive prompts
  // For now, we'll show the user what they need to do
  console.log(chalk.green("📝 Create a .env file in your project root with the following variables:\n"));
  const envTemplate = `# Required Variables
TOKEN_A=your_github_token_for_account_a
TOKEN_B=your_github_token_for_account_b
REPO_OWNER=your_repository_owner
REPO_NAME=your_repository_name
FORK_OWNER=your_fork_owner_username

# Optional Variables
BRANCH_NAME=your_branch_name
CREATE_ISSUE=true
ISSUE_TYPE=enhancement
ENABLE_CODE_REVIEW=true
RANDOM_CHANCE_PERCENTAGE=30`;
  console.log(chalk.gray(envTemplate));
  console.log(chalk.blue("\n💡 After creating the .env file, run:"));
  console.log(chalk.blue("   pull-merge-bot run"));
  console.log(chalk.blue("\n📚 For more information, visit:"));
  console.log(chalk.blue("   https://github.com/yourusername/pull-merge-bot"));
});

// Handle unknown commands
program.on("command:*", () => {
  console.error(chalk.red("❌ Invalid command. See --help for a list of available commands."));
  process.exit(1);
});

// Add help text
program.addHelpText("after", `

Examples:
  $ pull-merge-bot run
  $ pull-merge-bot run --create-issue --enable-code-review
  $ pull-merge-bot run --random-chance 50
  $ pull-merge-bot config
  $ pull-merge-bot setup

Environment Variables:
  All options can be set via environment variables in a .env file.
  See the setup command for more details.

Documentation:
  https://github.com/yourusername/pull-merge-bot
`);

// Parse command line arguments
program.parse(process.argv);

// Show help if no command is provided
if (!process.argv.slice(2).length) {
  program.help();
}