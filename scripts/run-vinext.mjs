import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const [, , command, ...args] = process.argv;
const supportedCommands = new Set(["dev", "build", "start"]);

if (!supportedCommands.has(command)) {
  console.error("Gunakan salah satu perintah Vinext: dev, build, atau start.");
  process.exit(1);
}

const vinextCli = fileURLToPath(new URL("../node_modules/vinext/dist/cli.js", import.meta.url));
const child = spawn(process.execPath, [vinextCli, command, ...args], {
  stdio: "inherit",
  env: {
    ...process.env,
    WRANGLER_LOG_PATH: process.env.WRANGLER_LOG_PATH ?? ".wrangler/wrangler.log",
  },
});

child.on("error", (error) => {
  console.error(`Vinext tidak dapat dijalankan: ${error.message}`);
  process.exit(1);
});

child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  process.exit(code ?? 1);
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => {
    if (!child.killed) child.kill(signal);
  });
}
