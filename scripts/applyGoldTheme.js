const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const EXCLUDE = ["node_modules", ".git", "server", "public/assets"];
const FILE_EXTS = [".ts", ".tsx", ".js", ".jsx", ".css", ".html", ".md"];

const replacements = [
  // Specific class prefixes first
  { r: /text-gold-(\d{1,3})/g, s: "text-gold-$1" },
  { r: /bg-gold-(\d{1,3})/g, s: "bg-gold-$1" },
  { r: /border-gold-(\d{1,3})/g, s: "border-gold-$1" },
  { r: /shadow-gold-(\d{1,3})/g, s: "shadow-gold-$1" },
  { r: /from-gold-(\d{1,3})/g, s: "from-gold-$1" },
  { r: /via-gold-(\d{1,3})/g, s: "via-gold-$1" },
  { r: /to-gold-(\d{1,3})/g, s: "to-gold-$1" },
  { r: /focus:ring-gold-(\d{1,3})/g, s: "focus:ring-gold-$1" },
  { r: /hover:bg-gold-(\d{1,3})/g, s: "hover:bg-gold-$1" },
  { r: /text-gold/g, s: "text-gold" },
  { r: /bg-gold/g, s: "bg-gold" },
  { r: /border-gold/g, s: "border-gold" },
  { r: /shadow-gold/g, s: "shadow-gold" },

  // Generic gold- fallback
  { r: /gold-(\d{1,3})/g, s: "gold-$1" },
  { r: /gold/g, s: "gold" },

  // Map rose/pink/purple to gold equivalents (use same numeric stop where possible)
  { r: /via-rose-(\d{1,3})/g, s: "via-gold-$1" },
  { r: /from-rose-(\d{1,3})/g, s: "from-gold-$1" },
  { r: /to-rose-(\d{1,3})/g, s: "to-gold-$1" },
  { r: /rose-(\d{1,3})/g, s: "gold-$1" },
  { r: /pink-(\d{1,3})/g, s: "gold-$1" },
  { r: /purple-(\d{1,3})/g, s: "gold-$1" },

  // Common utility replacements
  { r: /hover:from-gold-(\d{1,3})/g, s: "hover:from-gold-$1" },
  { r: /hover:to-gold-(\d{1,3})/g, s: "hover:to-gold-$1" },
  { r: /hover:via-gold-(\d{1,3})/g, s: "hover:via-gold-$1" },

  // Text color utilities
  { r: /text-gold-400/g, s: "text-gold-400" },
  { r: /text-gold-500/g, s: "text-gold-500" },
  { r: /text-gold-600/g, s: "text-gold-600" },
  { r: /text-gold-300/g, s: "text-gold-300" },

  // Focus / ring / spinner
  { r: /focus:ring-gold-500/g, s: "focus:ring-gold-500" },
  { r: /border-gold-500/g, s: "border-gold-500" },
  { r: /shadow-gold-900/g, s: "shadow-gold-900" },
  { r: /shadow-gold-950/g, s: "shadow-gold-950" },

  // Gradients mapping: common patterns -> gold gradient
  {
    r: /from-orange-500\s+via-gold-500\s+to-gold-500/g,
    s: "from-gold-400 via-gold-500 to-gold-700",
  },
  {
    r: /from-gold-400\s+via-gold-500\s+to-gold-500/g,
    s: "from-gold-400 via-gold-500 to-gold-700",
  },
  { r: /from-gold-600\s+to-gold-600/g, s: "from-gold-500 to-gold-700" },
];

function shouldSkip(dir) {
  return EXCLUDE.some(
    (ex) =>
      dir.includes(path.sep + ex + path.sep) || dir.endsWith(path.sep + ex),
  );
}

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (let file of list) {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat && stat.isDirectory()) {
      if (shouldSkip(full)) continue;
      results = results.concat(walk(full));
    } else {
      if (FILE_EXTS.includes(path.extname(full))) results.push(full);
    }
  }
  return results;
}

const files = walk(ROOT);
let totalChanged = 0;
let changedFiles = [];

for (const file of files) {
  let content = fs.readFileSync(file, "utf8");
  let original = content;
  let fileReplCount = 0;

  for (const rep of replacements) {
    const before = content;
    content = content.replace(rep.r, rep.s);
    if (content !== before) {
      // estimate count diff
      const matches = (before.match(rep.r) || []).length;
      fileReplCount += matches;
    }
  }

  if (content !== original) {
    fs.writeFileSync(file, content, "utf8");
    totalChanged += fileReplCount;
    changedFiles.push({ file, replacements: fileReplCount });
  }
}

console.log(
  `Codemod complete. Files changed: ${changedFiles.length}. Total token replacements (approx): ${totalChanged}`,
);
if (changedFiles.length)
  console.log(
    changedFiles.map((f) => `${f.file} (${f.replacements})`).join("\n"),
  );
else console.log("No files changed.");
