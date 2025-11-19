import { getRandomValues } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { toString } from "uint8arrays";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";

/**
 * Generate a random encryption key
 * @returns The encryption key
 */
export const generateEncryptionKeyHex = () => {
	/* Generate a random encryption key */
	const uint8Array = getRandomValues(new Uint8Array(32));
	/* Convert the encryption key to a hex string */
	return toString(uint8Array, "hex");
};

export const xmtpKeys = () => {
	const walletKey = generatePrivateKey();
	const account = privateKeyToAccount(walletKey);
	const encryptionKeyHex = generateEncryptionKeyHex();
	const publicKey = account.address;
	return { walletKey, encryptionKeyHex, publicKey };
};
