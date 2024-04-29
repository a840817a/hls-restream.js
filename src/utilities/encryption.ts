import crypto from "crypto";

export class EncryptionUtilities {
    static DecryptAes128Data(input: Buffer, key: Buffer, ivString: string) {
        try {
            const iv = Buffer.from(ivString.replace(/^0[xX]/g, ""), 'hex');
            const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
            return Buffer.concat([decipher.update(input), decipher.final()]);
        } catch (error) {
            console.error('Error decrypting data:', error);
            return undefined;
        }
    }
}
