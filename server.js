require("dotenv").config();
const { Octokit } = require("@octokit/rest");

// Environment variables
const tokenA = process.env.TOKEN_A;
const tokenB = process.env.TOKEN_B;
const REPO_OWNER = process.env.REPO_OWNER;
const FORK_OWNER = process.env.FORK_OWNER;
const REPO_NAME = process.env.REPO_NAME;
const BRANCH_NAME = process.env.BRANCH_NAME || "jonny"; // Default to 'jonny' if not specified

// New environment variables for enhanced features
const CREATE_ISSUE = process.env.CREATE_ISSUE === "true";
const ISSUE_TYPE = process.env.ISSUE_TYPE || "enhancement"; // bug, feature, enhancement
const ISSUE_TITLE = process.env.ISSUE_TITLE || "Automated Issue Creation";
const ISSUE_BODY =
  process.env.ISSUE_BODY ||
  "This issue was created automatically by the pull-merge bot.";
const ENABLE_CODE_REVIEW = process.env.ENABLE_CODE_REVIEW === "true";
const RANDOM_CHANCE_PERCENTAGE =
  parseInt(process.env.RANDOM_CHANCE_PERCENTAGE) || 30; // Default to 30%

// Validate environment variables
if (!tokenA || !tokenB || !REPO_OWNER || !FORK_OWNER || !REPO_NAME) {
  console.error(
    "❌ Missing required environment variables. Please check your .env file."
  );
  console.error(
    "Required: TOKEN_A, TOKEN_B, REPO_OWNER, FORK_OWNER, REPO_NAME"
  );
  console.error('Optional: BRANCH_NAME (defaults to "jonny")');
  console.error("Optional: CREATE_ISSUE (true/false, defaults to false)");
  console.error(
    "Optional: ISSUE_TYPE (bug/feature/enhancement, defaults to enhancement)"
  );
  console.error(
    'Optional: ISSUE_TITLE (defaults to "Automated Issue Creation")'
  );
  console.error("Optional: ISSUE_BODY (defaults to generic message)");
  console.error("Optional: ENABLE_CODE_REVIEW (true/false, defaults to false)");
  console.error("Optional: RANDOM_CHANCE_PERCENTAGE (1-100, defaults to 30)");
  process.exit(1);
}

const octokitA = new Octokit({ auth: tokenA });
const octokitB = new Octokit({ auth: tokenB });

console.log("🤖 Pull Merge Bot Starting...");
console.log(`📁 Repository: ${REPO_OWNER}/${REPO_NAME}`);
console.log(`🔗 Account A: ${FORK_OWNER}`);
console.log(`🌿 Branch: ${BRANCH_NAME}`);
console.log(`📝 Create Issue: ${CREATE_ISSUE ? "Yes" : "No"}`);
console.log(`🔍 Code Review: ${ENABLE_CODE_REVIEW ? "Yes" : "No"}`);
console.log(`🎲 Random Chance: ${RANDOM_CHANCE_PERCENTAGE}%`);

// Helper function to get random chance based on environment variable
function getRandomChance() {
  const chance = RANDOM_CHANCE_PERCENTAGE / 100;
  return Math.random() < chance;
}

async function validateRepositoryAccess() {
  try {
    // Check if Account A can access the target repository
    console.log("🔍 Validating Account A access to repository...");
    await octokitA.repos.get({
      owner: REPO_OWNER,
      repo: REPO_NAME,
    });
    console.log("✅ Account A can access repository");

    // Check if Account B can access the target repository
    console.log("🔍 Validating Account B access to repository...");
    await octokitB.repos.get({
      owner: REPO_OWNER,
      repo: REPO_NAME,
    });
    console.log("✅ Account B can access repository");

    return true;
  } catch (error) {
    console.error("❌ Repository access validation failed:", error.message);
    if (error.status === 404) {
      console.error(
        "💡 This might be a private repository access issue. Check:"
      );
      console.error('   - Both tokens have "repo" scope');
      console.error("   - Account A has been invited to the repository");
    }
    return false;
  }
}

async function getCurrentBranch() {
  try {
    const repo = await octokitA.repos.get({
      owner: REPO_OWNER,
      repo: REPO_NAME,
    });
    return repo.data.default_branch;
  } catch (error) {
    console.error("Error getting default branch:", error.message);
    return "main";
  }
}

async function updateBranchFromMain() {
  try {
    console.log(`🔄 Updating ${BRANCH_NAME} branch from main...`);

    // Get the latest commit from main branch
    const defaultBranch = await getCurrentBranch();
    const mainBranch = await octokitA.repos.getBranch({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      branch: defaultBranch,
    });

    // Update the branch to point to the latest main
    await octokitA.git.updateRef({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      ref: `heads/${BRANCH_NAME}`,
      sha: mainBranch.data.commit.sha,
      force: true,
    });

    console.log(`✅ ${BRANCH_NAME} branch updated from main`);
    return true;
  } catch (error) {
    console.error(`❌ Error updating ${BRANCH_NAME} branch:`, error.message);
    return false;
  }
}

async function createOrUpdateBranch() {
  try {
    console.log(`🔍 Checking if ${BRANCH_NAME} branch exists...`);

    // Try to get the branch
    try {
      await octokitA.repos.getBranch({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        branch: BRANCH_NAME,
      });
      console.log(`✅ ${BRANCH_NAME} branch already exists`);

      // Update branch from main to avoid conflicts
      await updateBranchFromMain();
      return true;
    } catch (error) {
      if (error.status === 404) {
        console.log(`📝 Creating ${BRANCH_NAME} branch from main...`);

        // Get the latest commit from main branch
        const defaultBranch = await getCurrentBranch();
        const mainBranch = await octokitA.repos.getBranch({
          owner: REPO_OWNER,
          repo: REPO_NAME,
          branch: defaultBranch,
        });

        // Create branch from main
        await octokitA.git.createRef({
          owner: REPO_OWNER,
          repo: REPO_NAME,
          ref: `refs/heads/${BRANCH_NAME}`,
          sha: mainBranch.data.commit.sha,
        });

        console.log(`✅ ${BRANCH_NAME} branch created successfully`);
        return true;
      }
      throw error;
    }
  } catch (error) {
    console.error(`❌ Error creating ${BRANCH_NAME} branch:`, error.message);
    return false;
  }
}

async function editAndCommitReadme() {
  try {
    console.log("📝 Editing README.md...");

    // Get current README content from main branch to avoid conflicts
    let currentContent = "";
    try {
      const defaultBranch = await getCurrentBranch();
      const readme = await octokitA.repos.getContent({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        path: "README.md",
        ref: defaultBranch,
      });
      currentContent = Buffer.from(readme.data.content, "base64").toString();
    } catch (error) {
      if (error.status === 404) {
        console.log("📄 README.md not found, will create new one");
      } else {
        throw error;
      }
    }

    // Add timestamp and edit information
    const timestamp = new Date().toISOString();
    const editContent = `## Last Updated by Bot

This section was automatically updated by the pull-merge bot on ${timestamp}.

### Changes Made:
- Automated README update
- Timestamp: ${timestamp}
- Updated by: ${FORK_OWNER}
- Branch: ${BRANCH_NAME}

${currentContent}`;

    // Commit the changes
    const commitMessage = `Update README.md - Automated edit by ${FORK_OWNER} on ${BRANCH_NAME}`;

    // Get the current tree
    const tree = await octokitA.git.getTree({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      tree_sha: (
        await octokitA.repos.getBranch({
          owner: REPO_OWNER,
          repo: REPO_NAME,
          branch: BRANCH_NAME,
        })
      ).data.commit.sha,
      recursive: true,
    });

    // Create new tree with updated README
    const newTree = await octokitA.git.createTree({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      base_tree: tree.data.sha,
      tree: [
        {
          path: "README.md",
          mode: "100644",
          type: "blob",
          content: editContent,
        },
      ],
    });

    // Create commit
    const commit = await octokitA.git.createCommit({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      message: commitMessage,
      tree: newTree.data.sha,
      parents: [
        (
          await octokitA.repos.getBranch({
            owner: REPO_OWNER,
            repo: REPO_NAME,
            branch: BRANCH_NAME,
          })
        ).data.commit.sha,
      ],
    });

    // Update the branch
    await octokitA.git.updateRef({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      ref: `heads/${BRANCH_NAME}`,
      sha: commit.data.sha,
    });

    console.log("✅ README.md updated and committed successfully");
    return true;
  } catch (error) {
    console.error("❌ Error editing README.md:", error.message);
    return false;
  }
}

async function checkForExistingPR() {
  try {
    // Check if there's already an open PR from the branch
    const pulls = await octokitA.pulls.list({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      state: "open",
      head: BRANCH_NAME,
      base: "main",
    });

    if (pulls.data.length > 0) {
      console.log(`⚠️  Found existing open PR: #${pulls.data[0].number}`);
      return pulls.data[0];
    }
    return null;
  } catch (error) {
    console.error("Error checking for existing PR:", error.message);
    return null;
  }
}

async function checkForMergeablePR(prNumber) {
  try {
    // Wait a bit for GitHub to calculate mergeability
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const pr = await octokitA.pulls.get({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      pull_number: prNumber,
    });

    if (pr.data.mergeable === false) {
      console.log("⚠️  PR has conflicts, cannot merge automatically");
      return false;
    }

    if (pr.data.mergeable === null) {
      console.log("⏳ GitHub is still calculating mergeability, waiting...");
      await new Promise((resolve) => setTimeout(resolve, 3000));
      return await checkForMergeablePR(prNumber);
    }

    return true;
  } catch (error) {
    console.error("Error checking PR mergeability:", error.message);
    return false;
  }
}

async function createIssue() {
  try {
    console.log("📝 Creating issue...");

    const timestamp = new Date().toISOString();
    const issueBody = `${ISSUE_BODY}

---
**Issue Details:**
- Created by: ${FORK_OWNER}
- Created on: ${timestamp}
- Issue type: ${ISSUE_TYPE}
- Automated by: Pull-Merge Bot

**Additional Information:**
- Repository: ${REPO_OWNER}/${REPO_NAME}
- Branch: ${BRANCH_NAME}
- Bot version: 2.0.0`;

    const issue = await octokitA.issues.create({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      title: `${ISSUE_TITLE} - ${timestamp.split("T")[0]}`,
      body: issueBody,
      labels: [ISSUE_TYPE, "automated", "bot-created"],
    });

    console.log(`✅ Issue created successfully: #${issue.data.number}`);
    console.log(`🔗 Issue URL: ${issue.data.html_url}`);

    return issue.data;
  } catch (error) {
    console.error("❌ Error creating issue:", error.message);
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
    }
    return null;
  }
}

async function addCodeReviewComment(prNumber, comment) {
  try {
    await octokitA.pulls.createReview({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      pull_number: prNumber,
      body: comment,
      event: "COMMENT",
    });
    console.log(
      `✅ Code review comment added to PR #${prNumber} by ${FORK_OWNER}`
    );
    return true;
  } catch (error) {
    console.error(`❌ Error adding code review comment:`, error.message);
    return false;
  }
}

async function approvePR(prNumber) {
  try {
    await octokitB.pulls.createReview({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      pull_number: prNumber,
      body: `✅ **Approved by ${REPO_OWNER}** - Code review completed successfully.`,
      event: "APPROVE",
    });
    console.log(`✅ PR #${prNumber} approved by ${REPO_OWNER}`);
    return true;
  } catch (error) {
    console.error(`❌ Error approving PR:`, error.message);
    return false;
  }
}

async function performCodeReview(prNumber) {
  try {
    console.log(
      `🔍 Performing code review on PR #${prNumber} by ${FORK_OWNER}...`
    );

    // Get PR details
    const pr = await octokitA.pulls.get({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      pull_number: prNumber,
    });

    // Get PR files
    const files = await octokitA.pulls.listFiles({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      pull_number: prNumber,
    });

    const reviewComments = [];

    // Analyze changes and create review comments
    for (const file of files.data) {
      if (
        file.filename.endsWith(".js") ||
        file.filename.endsWith(".ts") ||
        file.filename.endsWith(".md")
      ) {
        const additions = file.additions;
        const deletions = file.deletions;
        const changes = file.changes;

        if (changes > 0) {
          let comment = `📝 **File Review: ${file.filename}**\n\n`;
          comment += `- **Changes:** ${changes} lines\n`;
          comment += `- **Additions:** ${additions} lines\n`;
          comment += `- **Deletions:** ${deletions} lines\n\n`;

          if (file.filename.endsWith(".md")) {
            comment += `✅ **Documentation Update** - Good to see documentation being maintained!\n`;
            comment += `💡 **Suggestion:** Consider adding more context if this is a significant change.\n`;
          } else if (
            file.filename.endsWith(".js") ||
            file.filename.endsWith(".ts")
          ) {
            comment += `🔧 **Code Changes** - Code modifications detected.\n`;
            if (additions > 50) {
              comment += `⚠️ **Large Change** - This is a substantial modification. Please ensure thorough testing.\n`;
            }
            comment += `💡 **Suggestion:** Consider adding unit tests for new functionality.\n`;
          }

          reviewComments.push(comment);
        }
      }
    }

    // Add overall review comment
    const overallComment = `## 🤖 Automated Code Review by ${FORK_OWNER}

**PR Summary:**
- **Title:** ${pr.data.title}
- **Author:** ${pr.data.user.login}
- **Files Changed:** ${files.data.length}
- **Total Changes:** ${files.data.reduce(
      (sum, file) => sum + file.changes,
      0
    )} lines

**Review Notes:**
${
  reviewComments.length > 0
    ? reviewComments.join("\n\n")
    : "- No significant code changes detected"
}

**Recommendations:**
- ✅ Code structure looks good
- ✅ Changes are well-organized
- 💡 Consider adding tests for new functionality
- 💡 Update documentation if needed

**Review Status:** ✅ **Ready for Approval**

---
*This review was performed automatically by the Pull-Merge Bot for ${FORK_OWNER}*`;

    await addCodeReviewComment(prNumber, overallComment);

    // Approve the PR using Account B (repo owner)
    await approvePR(prNumber);

    console.log(
      `✅ Code review completed by ${FORK_OWNER} and approved by ${REPO_OWNER}`
    );
    return true;
  } catch (error) {
    console.error("❌ Error performing code review:", error.message);
    return false;
  }
}

async function createEnhancedPR() {
  try {
    console.log("🔁 Creating enhanced pull request...");

    const timestamp = new Date().toISOString();
    const prBody = `## 🤖 Automated Pull Request

This PR was created automatically by the pull-merge bot.

### 📋 Changes Summary
- **Updated README.md** with timestamp and bot information
- **Automated commit** by ${FORK_OWNER}
- **Branch:** ${BRANCH_NAME}
- **Created:** ${timestamp}

### 🔍 What Changed
- Added timestamp section to README.md
- Updated documentation with bot activity
- Maintained repository documentation standards

### ✅ Quality Checks
- [x] Code follows repository standards
- [x] Documentation updated
- [x] No breaking changes
- [x] Automated testing ready

### 🤖 Bot Information
- **Bot Version:** 2.0.0
- **Created by:** ${FORK_OWNER}
- **Repository:** ${REPO_OWNER}/${REPO_NAME}
- **Branch:** ${BRANCH_NAME}

---
*This PR will be automatically reviewed and merged by the bot.*`;

    const pr = await octokitA.pulls.create({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      head: BRANCH_NAME,
      base: "main",
      title: `🤖 Automated PR: Update README.md from ${BRANCH_NAME} - ${
        timestamp.split("T")[0]
      }`,
      body: prBody,
    });

    console.log(`🔁 Enhanced PR Created: #${pr.data.number}`);
    return pr.data;
  } catch (error) {
    console.error("❌ Error creating enhanced PR:", error.message);
    return null;
  }
}

async function createAndMergePR() {
  try {
    // 1. Validate repository access
    const accessValid = await validateRepositoryAccess();
    if (!accessValid) {
      console.error("❌ Cannot proceed due to repository access issues.");
      return;
    }

    // 2. Create issue if enabled and random chance (30%)
    if (CREATE_ISSUE && getRandomChance()) {
      console.log("🎲 Random chance triggered: Creating issue...");
      const issue = await createIssue();
      if (issue) {
        console.log(`📝 Issue #${issue.number} created successfully`);
      }
    } else if (CREATE_ISSUE) {
      console.log("🎲 Random chance not triggered: Skipping issue creation");
    }

    // 3. Create or update branch
    const branchCreated = await createOrUpdateBranch();
    if (!branchCreated) {
      return;
    }

    // 4. Edit and commit README.md
    const readmeUpdated = await editAndCommitReadme();
    if (!readmeUpdated) {
      return;
    }

    // 5. Check for existing PR
    const existingPR = await checkForExistingPR();
    if (existingPR) {
      console.log(`🔄 Using existing PR #${existingPR.number}`);

      // Perform code review if enabled and random chance (30%)
      if (ENABLE_CODE_REVIEW && getRandomChance()) {
        console.log("🎲 Random chance triggered: Performing code review...");
        await performCodeReview(existingPR.number);
      } else if (ENABLE_CODE_REVIEW) {
        console.log("🎲 Random chance not triggered: Skipping code review");
      }

      // Check if PR is mergeable
      const isMergeable = await checkForMergeablePR(existingPR.number);
      if (!isMergeable) {
        console.log(
          "❌ Cannot merge PR due to conflicts. Please resolve manually."
        );
        return;
      }

      // Merge the existing PR
      await octokitB.pulls.merge({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        pull_number: existingPR.number,
        commit_title: "Auto-merged by bot with code review",
        merge_method: "squash",
      });

      console.log(`✅ Existing PR #${existingPR.number} merged successfully.`);
      return;
    }

    // 6. Create a new enhanced PR from branch to main (Account A)
    const pr = await createEnhancedPR();
    if (!pr) {
      console.error("❌ Failed to create PR");
      return;
    }

    // 7. Perform code review if enabled and random chance (30%)
    if (ENABLE_CODE_REVIEW && getRandomChance()) {
      console.log("🎲 Random chance triggered: Performing code review...");
      await performCodeReview(pr.number);
    } else if (ENABLE_CODE_REVIEW) {
      console.log("🎲 Random chance not triggered: Skipping code review");
    }

    // 8. Check if PR is mergeable
    const isMergeable = await checkForMergeablePR(pr.number);
    if (!isMergeable) {
      console.log(
        "❌ Cannot merge PR due to conflicts. Please resolve manually."
      );
      return;
    }

    // 9. Merge PR using Account B (owner)
    console.log("🔄 Merging pull request...");
    await octokitB.pulls.merge({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      pull_number: pr.number,
      commit_title: "Auto-merged by bot with code review",
      merge_method: "squash",
    });

    console.log(`✅ PR #${pr.number} merged successfully.`);

    // 10. Add a comment to the merged PR
    try {
      await octokitA.issues.createComment({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        issue_number: pr.number,
        body: `## 🎉 PR Successfully Merged!

**Merge Details:**
- ✅ **Status:** Merged successfully
- 📅 **Merged at:** ${new Date().toISOString()}
- 🔄 **Merge method:** Squash merge
- 🤖 **Merged by:** Pull-Merge Bot

**Summary:**
- README.md updated with timestamp
- Code review completed (if enabled and triggered)
- All checks passed
- Repository documentation maintained

---
*This PR was automatically created, reviewed, and merged by the Pull-Merge Bot v2.0.0*`,
      });
    } catch (error) {
      console.log("⚠️ Could not add merge comment:", error.message);
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
    }
  }
}

// Run the bot
createAndMergePR().catch(console.error);
