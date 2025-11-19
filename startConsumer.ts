import { xmtpKeys } from "./generateKeys";
import { access } from "fs/promises";
import { join } from "node:path";
import { writeFile } from "node:fs/promises";
import { Agent } from "@xmtp/agent-sdk";

const consumerName = process.argv[2];

if (!consumerName) {
  console.error("Error: Missing required consumer name");
  process.exit(1);
}

const envFile = join(process.cwd(), ".env." + consumerName);

try {
  await access(envFile);
  console.log("Have existing consumer config");
  // file exists already
} catch {
  // file doesn't exist, so we create it
  console.log("Creating new consumer config");
  const { walletKey, encryptionKeyHex, publicKey } = xmtpKeys();
  const envContent = `# keys for ${consumerName}
XMTP_WALLET_KEY=${walletKey}
XMTP_DB_ENCRYPTION_KEY=${encryptionKeyHex}
XMTP_ENV=dev
# public key is ${publicKey}
`;
  await writeFile(envFile, envContent, { flag: "a" });

  // also write the address to the notification list file
  const notificationList = join(process.cwd(), "notificationList.txt");
  await writeFile(notificationList, `${publicKey}\n`, { flag: "a" });
}

process.loadEnvFile(envFile);

const agent = await Agent.createFromEnv();
agent.on("text", async (ctx) => {
  console.log(`New notification: ${ctx.message.content}`);
});
agent.on(`start`, () => {
  console.log(`Address: ${agent.address}`);
  console.log("Waiting for notifications...");
});
await agent.start();
