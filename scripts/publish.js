#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

console.log("🚀 Pull-Merge Bot Publishing Script");
console.log("===================================\n");

// Check if we're in the right directory
if (!fs.existsSync("package.json")) {
  console.error(
    "❌ package.json not found. Please run this script from the project root."
  );
  process.exit(1);
}

// Read package.json
const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
const currentVersion = packageJson.version;

console.log(`📦 Current version: ${currentVersion}`);
console.log("🔍 Checking build status...\n");

// Check if dist directory exists
if (!fs.existsSync("dist")) {
  console.log("📁 Building project...");
  try {
    execSync("npm run build", { stdio: "inherit" });
    console.log("✅ Build completed successfully\n");
  } catch (error) {
    console.error("❌ Build failed");
    process.exit(1);
  }
} else {
  console.log("✅ Build directory exists\n");
}

// Check if user wants to proceed
console.log("⚠️  This will publish the package to npm.");
console.log("📋 Make sure you have:");
console.log("   1. ✅ Updated version in package.json");
console.log("   2. ✅ Committed all changes");
console.log("   3. ✅ Pushed to GitHub");
console.log("   4. ✅ npm login completed");
console.log("   5. ✅ Proper npm permissions\n");

// In a real implementation, you'd prompt the user
// For now, we'll just show the commands
console.log("🚀 To publish, run these commands:\n");

console.log("1. Update version (if needed):");
console.log(`   npm version patch|minor|major\n`);

console.log("2. Build the project:");
console.log("   npm run build\n");

console.log("3. Publish to npm:");
console.log("   npm publish\n");

console.log("4. Push version tag:");
console.log("   git push --follow-tags\n");

console.log("📚 For more information:");
console.log("   - npm publish --help");
console.log("   - npm version --help");
console.log("   - https://docs.npmjs.com/cli/v8/commands/npm-publish");

console.log("\n🎯 Current package.json configuration:");
console.log(`   - Name: ${packageJson.name}`);
console.log(`   - Version: ${packageJson.version}`);
console.log(`   - Main: ${packageJson.main}`);
console.log(`   - Bin: ${JSON.stringify(packageJson.bin)}`);
console.log(`   - Files: ${JSON.stringify(packageJson.files)}`);
console.log(`   - License: ${packageJson.license}`);
console.log(`   - Access: ${packageJson.publishConfig?.access || "default"}`);

console.log("\n✨ Ready to publish! Follow the steps above.");
