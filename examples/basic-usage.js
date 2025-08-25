const { PullMergeBot, createBot } = require("pull-merge-bot");

// Example 1: Using the class directly
async function example1() {
  const bot = new PullMergeBot({
    tokenA: "your_github_token_a",
    tokenB: "your_github_token_b",
    repoOwner: "your_username",
    repoName: "your-repo",
    forkOwner: "your_username",
    branchName: "feature-branch",
    createIssue: true,
    enableCodeReview: true,
    randomChancePercentage: 30,
  });

  try {
    const success = await bot.run();
    if (success) {
      console.log("✅ Bot completed successfully!");
    } else {
      console.log("❌ Bot encountered errors");
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
}

// Example 2: Using the factory function
async function example2() {
  const bot = createBot({
    tokenA: process.env.TOKEN_A,
    tokenB: process.env.TOKEN_B,
    repoOwner: process.env.REPO_OWNER,
    repoName: process.env.REPO_NAME,
    forkOwner: process.env.FORK_OWNER,
    createIssue: true,
    issueType: "enhancement",
    enableCodeReview: true,
    randomChancePercentage: 50,
  });

  const success = await bot.run();
  return success;
}

// Example 3: Custom configuration with all options
async function example3() {
  const config = {
    // Required
    tokenA: "ghp_your_token_a_here",
    tokenB: "ghp_your_token_b_here",
    repoOwner: "yourusername",
    repoName: "your-repo",
    forkOwner: "yourusername",

    // Optional
    branchName: "enhancement-branch",
    createIssue: true,
    issueType: "feature",
    issueTitle: "New Feature Request",
    issueBody: "This is a custom issue description",
    enableCodeReview: true,
    randomChancePercentage: 80,
  };

  const bot = new PullMergeBot(config);
  return await bot.run();
}

// Example 4: Running with minimal configuration
async function example4() {
  const bot = new PullMergeBot({
    tokenA: process.env.TOKEN_A,
    tokenB: process.env.TOKEN_B,
    repoOwner: process.env.REPO_OWNER,
    repoName: process.env.REPO_NAME,
    forkOwner: process.env.FORK_OWNER,
    // All other options will use defaults
  });

  return await bot.run();
}

// Example 5: Error handling and validation
async function example5() {
  try {
    const bot = new PullMergeBot({
      tokenA: "invalid_token",
      tokenB: "invalid_token",
      repoOwner: "nonexistent",
      repoName: "nonexistent",
      forkOwner: "nonexistent",
    });

    const success = await bot.run();
    console.log("Success:", success);
  } catch (error) {
    console.error("Expected error:", error.message);
  }
}

// Export examples for use in other files
module.exports = {
  example1,
  example2,
  example3,
  example4,
  example5,
};

// Run examples if this file is executed directly
if (require.main === module) {
  console.log("🚀 Pull-Merge Bot Examples");
  console.log("==========================\n");

  console.log("Available examples:");
  console.log("1. example1() - Basic usage with class");
  console.log("2. example2() - Factory function usage");
  console.log("3. example3() - Full configuration");
  console.log("4. example4() - Minimal configuration");
  console.log("5. example5() - Error handling");

  console.log("\nTo run an example, call the function directly.");
  console.log("Make sure to set your environment variables first!");
}
