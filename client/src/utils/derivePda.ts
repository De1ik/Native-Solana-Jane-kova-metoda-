import { PublicKey } from "@solana/web3.js";
import { sha256 } from "@noble/hashes/sha256";



export class PdaDerivation {

    static hashString(input: string): Buffer {
        const hashBytes = sha256(new TextEncoder().encode(input)); // returns Uint8Array(32)
        return Buffer.from(hashBytes); // бинарные байты
    }

    static derivePollPda(
        programId: PublicKey,
        title: string,
        description: string
    ): [PublicKey, number] {
        const titleHash = this.hashString(title);
        const descriptionHash = this.hashString(description);
        return PublicKey.findProgramAddressSync(
            [Buffer.from('poll'), Buffer.from(titleHash), Buffer.from(descriptionHash)],
            programId
        );
    }
}