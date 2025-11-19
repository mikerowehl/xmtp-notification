import { xmtpKeys } from "./generateKeys";
import { access } from "fs/promises";
import { join } from "node:path";
import { writeFile, readFile } from "node:fs/promises";
import { Agent } from "@xmtp/agent-sdk";

const notification = process.argv[2];

if (!notification) {
  console.error("Error: Missing notification to send");
  process.exit(1);
}

const envFile = join(process.cwd(), ".env.notifier");
try {
  await access(envFile);
  console.log("Have existing notifier config");
  // file exists already
} catch {
  // file doesn't exist, so we create it
  console.log("Creating new notifier config");
  const { walletKey, encryptionKeyHex, publicKey } = xmtpKeys();
  const envContent = `# keys for notifier
XMTP_WALLET_KEY=${walletKey}
XMTP_DB_ENCRYPTION_KEY=${encryptionKeyHex}
XMTP_ENV=dev
# public key is ${publicKey}
`;
  await writeFile(envFile, envContent, { flag: "a" });
}
process.loadEnvFile(envFile);

const agent = await Agent.createFromEnv();
agent.on(`start`, async () => {
  console.log(`Address: ${agent.address}`);
  console.log(`Sending notification: "${notification}"`);
  const content = await readFile(
    join(process.cwd(), "notificationList.txt"),
    "utf-8",
  );
  const addresses = content
    .split("\n")
    .map((line) => line.trim() as `0x${string}`)
    .filter((line) => line);
  for (const address of addresses) {
    if (!address.startsWith("0x")) {
      console.error(`  Invalid address: ${address}`);
      continue;
    }
    console.log(`  Sending to ${address}`);
    const dm = await agent.createDmWithAddress(address);
    await dm.send(notification);
  }
  agent.stop();
});
await agent.start();
