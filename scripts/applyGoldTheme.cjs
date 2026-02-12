const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const EXCLUDE = ["node_modules", ".git", "server", "public/assets"];
const FILE_EXTS = [".ts", ".tsx", ".js", ".jsx", ".css", ".html", ".md"];

const replacements = [
  { r: /text-indigo-(\d{1,3})/g, s: "text-gold-$1" },
  { r: /bg-indigo-(\d{1,3})/g, s: "bg-gold-$1" },
  { r: /border-indigo-(\d{1,3})/g, s: "border-gold-$1" },
  { r: /shadow-indigo-(\d{1,3})/g, s: "shadow-gold-$1" },
  { r: /from-indigo-(\d{1,3})/g, s: "from-gold-$1" },
  { r: /via-indigo-(\d{1,3})/g, s: "via-gold-$1" },
  { r: /to-indigo-(\d{1,3})/g, s: "to-gold-$1" },
  { r: /focus:ring-indigo-(\d{1,3})/g, s: "focus:ring-gold-$1" },
  { r: /hover:bg-indigo-(\d{1,3})/g, s: "hover:bg-gold-$1" },
  { r: /text-indigo/g, s: "text-gold" },
  { r: /bg-indigo/g, s: "bg-gold" },
  { r: /border-indigo/g, s: "border-gold" },
  { r: /shadow-indigo/g, s: "shadow-gold" },
  { r: /indigo-(\d{1,3})/g, s: "gold-$1" },
  { r: /indigo/g, s: "gold" },
  { r: /via-rose-(\d{1,3})/g, s: "via-gold-$1" },
  { r: /from-rose-(\d{1,3})/g, s: "from-gold-$1" },
  { r: /to-rose-(\d{1,3})/g, s: "to-gold-$1" },
  { r: /rose-(\d{1,3})/g, s: "gold-$1" },
  { r: /pink-(\d{1,3})/g, s: "gold-$1" },
  { r: /purple-(\d{1,3})/g, s: "gold-$1" },
  { r: /hover:from-indigo-(\d{1,3})/g, s: "hover:from-gold-$1" },
  { r: /hover:to-indigo-(\d{1,3})/g, s: "hover:to-gold-$1" },
  { r: /hover:via-indigo-(\d{1,3})/g, s: "hover:via-gold-$1" },
  { r: /text-indigo-400/g, s: "text-gold-400" },
  { r: /text-indigo-500/g, s: "text-gold-500" },
  { r: /text-indigo-600/g, s: "text-gold-600" },
  { r: /text-indigo-300/g, s: "text-gold-300" },
  { r: /focus:ring-indigo-500/g, s: "focus:ring-gold-500" },
  { r: /border-indigo-500/g, s: "border-gold-500" },
  { r: /shadow-indigo-900/g, s: "shadow-gold-900" },
  { r: /shadow-indigo-950/g, s: "shadow-gold-950" },
  {
    r: /from-orange-500\s+via-rose-500\s+to-pink-500/g,
    s: "from-gold-400 via-gold-500 to-gold-700",
  },
  {
    r: /from-indigo-400\s+via-indigo-500\s+to-rose-500/g,
    s: "from-gold-400 via-gold-500 to-gold-700",
  },
  { r: /from-indigo-600\s+to-purple-600/g, s: "from-gold-500 to-gold-700" },
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
