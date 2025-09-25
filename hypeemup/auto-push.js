// auto-push.js
import { execSync } from "node:child_process";
import chokidar from "chokidar";

// Ignore hidden files, build outputs, node_modules, lockfiles, etc.
const IGNORED =
  /(^|[\/\\])\..|node_modules|dist|build|out|.next|.turbo|coverage|pnpm-lock.yaml/;

function sh(cmd) {
  try {
    return execSync(cmd, { stdio: "pipe" }).toString().trim();
  } catch {
    return "";
  }
}

function changed() {
  return sh("git status --porcelain");
}

function commitAndPush() {
  if (!changed()) return;
  const ts = new Date().toISOString();
  try {
    execSync("git add -A", { stdio: "inherit" });
    execSync(`git commit -m "auto: ${ts}"`, { stdio: "inherit" });
    execSync("git push", { stdio: "inherit" });
    console.log("✅ Auto-pushed at", ts);
  } catch (e) {
    console.error("❌ Auto-push failed:", e?.message || e);
  }
}

console.log("👀 Watching for changes… (Ctrl+C to stop)");

const watcher = chokidar.watch(".", {
  ignored: IGNORED,
  ignoreInitial: true,
  persistent: true,
  awaitWriteFinish: { stabilityThreshold: 500, pollInterval: 100 }
});

let timer = null;
watcher.on("all", (_event, path) => {
  if (IGNORED.test(path)) return;
  if (timer) clearTimeout(timer);
  timer = setTimeout(commitAndPush, 1000);
});
