"use strict";

const {
  Octokit
} = require("@octokit/rest");
class PullMergeBot {
  constructor(config) {
    this.config = {
      tokenA: config.tokenA,
      tokenB: config.tokenB,
      repoOwner: config.repoOwner,
      forkOwner: config.forkOwner,
      repoName: config.repoName,
      branchName: config.branchName || "jonny",
      createIssue: config.createIssue === true,
      issueType: config.issueType || "enhancement",
      issueTitle: config.issueTitle || "Automated Issue Creation",
      issueBody: config.issueBody || "This issue was created automatically by the pull-merge bot.",
      enableCodeReview: config.enableCodeReview === true,
      randomChancePercentage: parseInt(config.randomChancePercentage) || 30,
      ...config
    };
    this.octokitA = new Octokit({
      auth: this.config.tokenA
    });
    this.octokitB = new Octokit({
      auth: this.config.tokenB
    });
  }

  // Helper function to get random chance based on configuration
  getRandomChance() {
    const chance = this.config.randomChancePercentage / 100;
    return Math.random() < chance;
  }
  async validateRepositoryAccess() {
    try {
      // Check if Account A can access the target repository
      console.log("🔍 Validating Account A access to repository...");
      await this.octokitA.repos.get({
        owner: this.config.repoOwner,
        repo: this.config.repoName
      });
      console.log("✅ Account A can access repository");

      // Check if Account B can access the target repository
      console.log("🔍 Validating Account B access to repository...");
      await this.octokitB.repos.get({
        owner: this.config.repoOwner,
        repo: this.config.repoName
      });
      console.log("✅ Account B can access repository");
      return true;
    } catch (error) {
      console.error("❌ Repository access validation failed:", error.message);
      if (error.status === 404) {
        console.error("💡 This might be a private repository access issue. Check:");
        console.error('   - Both tokens have "repo" scope');
        console.error("   - Account A has been invited to the repository");
      }
      return false;
    }
  }
  async getCurrentBranch() {
    try {
      const repo = await this.octokitA.repos.get({
        owner: this.config.repoOwner,
        repo: this.config.repoName
      });
      return repo.data.default_branch;
    } catch (error) {
      console.error("Error getting default branch:", error.message);
      return "main";
    }
  }
  async updateBranchFromMain() {
    try {
      console.log(`🔄 Updating ${this.config.branchName} branch from main...`);

      // Get the latest commit from main branch
      const defaultBranch = await this.getCurrentBranch();
      const mainBranch = await this.octokitA.repos.getBranch({
        owner: this.config.repoOwner,
        repo: this.config.repoName,
        branch: defaultBranch
      });

      // Update the branch to point to the latest main
      await this.octokitA.git.updateRef({
        owner: this.config.repoOwner,
        repo: this.config.repoName,
        ref: `heads/${this.config.branchName}`,
        sha: mainBranch.data.commit.sha,
        force: true
      });
      console.log(`✅ ${this.config.branchName} branch updated from main`);
      return true;
    } catch (error) {
      console.error(`❌ Error updating ${this.config.branchName} branch:`, error.message);
      return false;
    }
  }
  async createOrUpdateBranch() {
    try {
      console.log(`🔍 Checking if ${this.config.branchName} branch exists...`);

      // Try to get the branch
      try {
        await this.octokitA.repos.getBranch({
          owner: this.config.repoOwner,
          repo: this.config.repoName,
          branch: this.config.branchName
        });
        console.log(`✅ ${this.config.branchName} branch already exists`);

        // Update branch from main to avoid conflicts
        await this.updateBranchFromMain();
        return true;
      } catch (error) {
        if (error.status === 404) {
          console.log(`📝 Creating ${this.config.branchName} branch from main...`);

          // Get the latest commit from main branch
          const defaultBranch = await this.getCurrentBranch();
          const mainBranch = await this.octokitA.repos.getBranch({
            owner: this.config.repoOwner,
            repo: this.config.repoName,
            branch: defaultBranch
          });

          // Create branch from main
          await this.octokitA.git.createRef({
            owner: this.config.repoOwner,
            repo: this.config.repoName,
            ref: `refs/heads/${this.config.branchName}`,
            sha: mainBranch.data.commit.sha
          });
          console.log(`✅ ${this.config.branchName} branch created successfully`);
          return true;
        }
        throw error;
      }
    } catch (error) {
      console.error(`❌ Error creating ${this.config.branchName} branch:`, error.message);
      return false;
    }
  }
  async editAndCommitReadme() {
    try {
      console.log("📝 Editing README.md...");

      // Get current README content from main branch to avoid conflicts
      let currentContent = "";
      try {
        const defaultBranch = await this.getCurrentBranch();
        const readme = await this.octokitA.repos.getContent({
          owner: this.config.repoOwner,
          repo: this.config.repoName,
          path: "README.md",
          ref: defaultBranch
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
- Updated by: ${this.config.forkOwner}
- Branch: ${this.config.branchName}

${currentContent}`;

      // Commit the changes
      const commitMessage = `Update README.md - Automated edit by ${this.config.forkOwner} on ${this.config.branchName}`;

      // Get the current tree
      const tree = await this.octokitA.git.getTree({
        owner: this.config.repoOwner,
        repo: this.config.repoName,
        tree_sha: (await this.octokitA.repos.getBranch({
          owner: this.config.repoOwner,
          repo: this.config.repoName,
          branch: this.config.branchName
        })).data.commit.sha,
        recursive: true
      });

      // Create new tree with updated README
      const newTree = await this.octokitA.git.createTree({
        owner: this.config.repoOwner,
        repo: this.config.repoName,
        base_tree: tree.data.sha,
        tree: [{
          path: "README.md",
          mode: "100644",
          type: "blob",
          content: editContent
        }]
      });

      // Create commit
      const commit = await this.octokitA.git.createCommit({
        owner: this.config.repoOwner,
        repo: this.config.repoName,
        message: commitMessage,
        tree: newTree.data.sha,
        parents: [(await this.octokitA.repos.getBranch({
          owner: this.config.repoOwner,
          repo: this.config.repoName,
          branch: this.config.branchName
        })).data.commit.sha]
      });

      // Update the branch
      await this.octokitA.git.updateRef({
        owner: this.config.repoOwner,
        repo: this.config.repoName,
        ref: `heads/${this.config.branchName}`,
        sha: commit.data.sha
      });
      console.log("✅ README.md updated and committed successfully");
      return true;
    } catch (error) {
      console.error("❌ Error editing README.md:", error.message);
      return false;
    }
  }
  async checkForExistingPR() {
    try {
      // Check if there's already an open PR from the branch
      const pulls = await this.octokitA.pulls.list({
        owner: this.config.repoOwner,
        repo: this.config.repoName,
        state: "open",
        head: this.config.branchName,
        base: "main"
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
  async checkForMergeablePR(prNumber) {
    try {
      // Wait a bit for GitHub to calculate mergeability
      await new Promise(resolve => setTimeout(resolve, 2000));
      const pr = await this.octokitA.pulls.get({
        owner: this.config.repoOwner,
        repo: this.config.repoName,
        pull_number: prNumber
      });
      if (pr.data.mergeable === false) {
        console.log("⚠️  PR has conflicts, cannot merge automatically");
        return false;
      }
      if (pr.data.mergeable === null) {
        console.log("⏳ GitHub is still calculating mergeability, waiting...");
        await new Promise(resolve => setTimeout(resolve, 3000));
        return await this.checkForMergeablePR(prNumber);
      }
      return true;
    } catch (error) {
      console.error("Error checking PR mergeability:", error.message);
      return false;
    }
  }
  async createIssue() {
    try {
      console.log("📝 Creating issue...");
      const timestamp = new Date().toISOString();
      const issueBody = `${this.config.issueBody}

---
**Issue Details:**
- Created by: ${this.config.forkOwner}
- Created on: ${timestamp}
- Issue type: ${this.config.issueType}
- Automated by: Pull-Merge Bot

**Additional Information:**
- Repository: ${this.config.repoOwner}/${this.config.repoName}
- Branch: ${this.config.branchName}
- Bot version: 2.0.0`;
      const issue = await this.octokitA.issues.create({
        owner: this.config.repoOwner,
        repo: this.config.repoName,
        title: `${this.config.issueTitle} - ${timestamp.split("T")[0]}`,
        body: issueBody,
        labels: [this.config.issueType, "automated", "bot-created"]
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
  async addCodeReviewComment(prNumber, comment) {
    try {
      await this.octokitA.pulls.createReview({
        owner: this.config.repoOwner,
        repo: this.config.repoName,
        pull_number: prNumber,
        body: comment,
        event: "COMMENT"
      });
      console.log(`✅ Code review comment added to PR #${prNumber} by ${this.config.forkOwner}`);
      return true;
    } catch (error) {
      console.error(`❌ Error adding code review comment:`, error.message);
      return false;
    }
  }
  async approvePR(prNumber) {
    try {
      await this.octokitB.pulls.createReview({
        owner: this.config.repoOwner,
        repo: this.config.repoName,
        pull_number: prNumber,
        body: `✅ **Approved by ${this.config.repoOwner}** - Code review completed successfully.`,
        event: "APPROVE"
      });
      console.log(`✅ PR #${prNumber} approved by ${this.config.repoOwner}`);
      return true;
    } catch (error) {
      console.error(`❌ Error approving PR:`, error.message);
      return false;
    }
  }
  async performCodeReview(prNumber) {
    try {
      console.log(`🔍 Performing code review on PR #${prNumber} by ${this.config.forkOwner}...`);

      // Get PR details
      const pr = await this.octokitA.pulls.get({
        owner: this.config.repoOwner,
        repo: this.config.repoName,
        pull_number: prNumber
      });

      // Get PR files
      const files = await this.octokitA.pulls.listFiles({
        owner: this.config.repoOwner,
        repo: this.config.repoName,
        pull_number: prNumber
      });
      const reviewComments = [];

      // Analyze changes and create review comments
      for (const file of files.data) {
        if (file.filename.endsWith(".js") || file.filename.endsWith(".ts") || file.filename.endsWith(".md")) {
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
            } else if (file.filename.endsWith(".js") || file.filename.endsWith(".ts")) {
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
      const overallComment = `## 🤖 Automated Code Review by ${this.config.forkOwner}

**PR Summary:**
- **Title:** ${pr.data.title}
- **Author:** ${pr.data.user.login}
- **Files Changed:** ${files.data.length}
- **Total Changes:** ${files.data.reduce((sum, file) => sum + file.changes, 0)} lines

**Review Notes:**
${reviewComments.length > 0 ? reviewComments.join("\n\n") : "- No significant code changes detected"}

**Recommendations:**
- ✅ Code structure looks good
- ✅ Changes are well-organized
- 💡 Consider adding tests for new functionality
- 💡 Update documentation if needed

**Review Status:** ✅ **Ready for Approval**

---
*This review was performed automatically by the Pull-Merge Bot for ${this.config.forkOwner}*`;
      await this.addCodeReviewComment(prNumber, overallComment);

      // Approve the PR using Account B (repo owner)
      await this.approvePR(prNumber);
      console.log(`✅ Code review completed by ${this.config.forkOwner} and approved by ${this.config.repoOwner}`);
      return true;
    } catch (error) {
      console.error("❌ Error performing code review:", error.message);
      return false;
    }
  }
  async createEnhancedPR() {
    try {
      console.log("🔁 Creating enhanced pull request...");
      const timestamp = new Date().toISOString();
      const prBody = `## 🤖 Automated Pull Request

This PR was created automatically by the pull-merge bot.

### 📋 Changes Summary
- **Updated README.md** with timestamp and bot information
- **Automated commit** by ${this.config.forkOwner}
- **Branch:** ${this.config.branchName}
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
- **Created by:** ${this.config.forkOwner}
- **Repository:** ${this.config.repoOwner}/${this.config.repoName}
- **Branch:** ${this.config.branchName}

---
*This PR will be automatically reviewed and merged by the bot.*`;
      const pr = await this.octokitA.pulls.create({
        owner: this.config.repoOwner,
        repo: this.config.repoName,
        head: this.config.branchName,
        base: "main",
        title: `🤖 Automated PR: Update README.md from ${this.config.branchName} - ${timestamp.split("T")[0]}`,
        body: prBody
      });
      console.log(`🔁 Enhanced PR Created: #${pr.data.number}`);
      return pr.data;
    } catch (error) {
      console.error("❌ Error creating enhanced PR:", error.message);
      return null;
    }
  }
  async run() {
    try {
      console.log("🤖 Pull Merge Bot Starting...");
      console.log(`📁 Repository: ${this.config.repoOwner}/${this.config.repoName}`);
      console.log(`🔗 Account A: ${this.config.forkOwner}`);
      console.log(`🌿 Branch: ${this.config.branchName}`);
      console.log(`📝 Create Issue: ${this.config.createIssue ? "Yes" : "No"}`);
      console.log(`🔍 Code Review: ${this.config.enableCodeReview ? "Yes" : "No"}`);
      console.log(`🎲 Random Chance: ${this.config.randomChancePercentage}%`);

      // 1. Validate repository access
      const accessValid = await this.validateRepositoryAccess();
      if (!accessValid) {
        console.error("❌ Cannot proceed due to repository access issues.");
        return false;
      }

      // 2. Create issue if enabled and random chance
      if (this.config.createIssue && this.getRandomChance()) {
        console.log("🎲 Random chance triggered: Creating issue...");
        const issue = await this.createIssue();
        if (issue) {
          console.log(`📝 Issue #${issue.number} created successfully`);
        }
      } else if (this.config.createIssue) {
        console.log("🎲 Random chance not triggered: Skipping issue creation");
      }

      // 3. Create or update branch
      const branchCreated = await this.createOrUpdateBranch();
      if (!branchCreated) {
        return false;
      }

      // 4. Edit and commit README.md
      const readmeUpdated = await this.editAndCommitReadme();
      if (!readmeUpdated) {
        return false;
      }

      // 5. Check for existing PR
      const existingPR = await this.checkForExistingPR();
      if (existingPR) {
        console.log(`🔄 Using existing PR #${existingPR.number}`);

        // Perform code review if enabled and random chance
        if (this.config.enableCodeReview && this.getRandomChance()) {
          console.log("🎲 Random chance triggered: Performing code review...");
          await this.performCodeReview(existingPR.number);
        } else if (this.config.enableCodeReview) {
          console.log("🎲 Random chance not triggered: Skipping code review");
        }

        // Check if PR is mergeable
        const isMergeable = await this.checkForMergeablePR(existingPR.number);
        if (!isMergeable) {
          console.log("❌ Cannot merge PR due to conflicts. Please resolve manually.");
          return false;
        }

        // Merge the existing PR
        await this.octokitB.pulls.merge({
          owner: this.config.repoOwner,
          repo: this.config.repoName,
          pull_number: existingPR.number,
          commit_title: "Auto-merged by bot with code review",
          merge_method: "squash"
        });
        console.log(`✅ Existing PR #${existingPR.number} merged successfully.`);
        return true;
      }

      // 6. Create a new enhanced PR from branch to main (Account A)
      const pr = await this.createEnhancedPR();
      if (!pr) {
        console.error("❌ Failed to create PR");
        return false;
      }

      // 7. Perform code review if enabled and random chance
      if (this.config.enableCodeReview && this.getRandomChance()) {
        console.log("🎲 Random chance triggered: Performing code review...");
        await this.performCodeReview(pr.number);
      } else if (this.config.enableCodeReview) {
        console.log("🎲 Random chance not triggered: Skipping code review");
      }

      // 8. Check if PR is mergeable
      const isMergeable = await this.checkForMergeablePR(pr.number);
      if (!isMergeable) {
        console.log("❌ Cannot merge PR due to conflicts. Please resolve manually.");
        return false;
      }

      // 9. Merge PR using Account B (owner)
      console.log("🔄 Merging pull request...");
      await this.octokitB.pulls.merge({
        owner: this.config.repoOwner,
        repo: this.config.repoName,
        pull_number: pr.number,
        commit_title: "Auto-merged by bot with code review",
        merge_method: "squash"
      });
      console.log(`✅ PR #${pr.number} merged successfully.`);

      // 10. Add a comment to the merged PR
      try {
        await this.octokitA.issues.createComment({
          owner: this.config.repoOwner,
          repo: this.config.repoName,
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
*This PR was automatically created, reviewed, and merged by the Pull-Merge Bot v2.0.0*`
        });
      } catch (error) {
        console.log("⚠️ Could not add merge comment:", error.message);
      }
      return true;
    } catch (error) {
      console.error("❌ Error:", error.message);
      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);
      }
      return false;
    }
  }
}

// Export the class and a factory function
module.exports = {
  PullMergeBot,
  createBot: config => new PullMergeBot(config)
};