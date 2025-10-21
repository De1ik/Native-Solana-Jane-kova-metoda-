import { PublicKey, Transaction, TransactionInstruction, Connection, Keypair, SystemProgram } from "@solana/web3.js";
import { serializeAccount } from "../utils/serialize";
import { CreatePollPayload, CreatePollSchema } from "../types/CreatePoll"
import { PdaDerivation } from "../utils/derivePda";
import { CREATE_POLL_DISCRIMINATOR } from "../types/Discriminator";

const PROGRAM_ID = new PublicKey("6LKL9MnuNGd3fpEp5U3P9Sm8LW5YuHasKRp8Jwyp9Hhy");

export async function createPoll(
    connection: Connection,
    payer: Keypair,
    title: string,
    description: string,
) {
    const [pollPda] = PdaDerivation.derivePollPda(PROGRAM_ID, title, description);

    const payload = new CreatePollPayload({title, description});
    const serialized = serializeAccount(CreatePollSchema, CreatePollPayload, payload);

    const variant = Buffer.from(Uint8Array.of(CREATE_POLL_DISCRIMINATOR));
    const data = Buffer.concat([variant, serialized]);

    const instruction = new TransactionInstruction({
        keys: [
            { pubkey: payer.publicKey, isSigner: true, isWritable: true },
            { pubkey: pollPda, isSigner: false, isWritable: true },
            { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
        ],
        programId: PROGRAM_ID,
        data,
    });

    const tx = new Transaction().add(instruction);
    const signature = await connection.sendTransaction(tx, [payer]);
    return { pollPda, signature }; 
}   