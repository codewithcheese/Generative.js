const fs = require("fs");
const path = require("path");

function copyExamples(srcDir, destDir, inclusive) {
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  const files = fs.readdirSync(srcDir);
  for (const file of files) {
    const srcPath = path.join(srcDir, file);
    const destPath = path.join(destDir, `${file}.sandpack`);
    const stats = fs.statSync(srcPath);

    if (stats.isDirectory()) {
      copyExamples(srcPath, path.join(destDir, file), true);
    } else if (inclusive) {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

const srcDir = path.join(__dirname, "../../examples/src");
const destDir = path.join(__dirname, "./examples");

copyExamples(srcDir, destDir, false);
fs.copyFileSync(
  path.join(srcDir, "index.json"),
  path.join(destDir, "index.json"),
);
console.log("Examples copied");
