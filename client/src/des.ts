import { Connection, PublicKey } from "@solana/web3.js";
import { deserialize } from "borsh";

// 1. Описание класса, соответствующего структуре аккаунта в Rust
class PollState {
  discriminator: any;
  title: any;
  description: any;
  phase: any;
  owner: any;

  constructor(fields: { discriminator: string; title: string; description: string; phase: number; owner: Uint8Array }) {
    Object.assign(this, fields);
  }
}

// 2. Схема для десериализации
const PollStateSchema = new Map([
  [PollState, {
    kind: 'struct',
    fields: [
      ['discriminator', 'string'],
      ['title', 'string'],
      ['description', 'string'],
      ['phase', 'u8'],
      ['owner', [32]], // Pubkey как 32 байта
    ],
  }],
]);

// 3. Получение данных и десериализация
async function getPollState(pdaAddress: string) {
  const connection = new Connection("https://api.mainnet-beta.solana.com");
  const accountInfo = await connection.getAccountInfo(new PublicKey(pdaAddress));
  if (!accountInfo) throw new Error("PDA не найден");

  const data = accountInfo.data;

  // ⚡ Вот здесь вызывается метод десериализации:
  const pollState = deserialize(PollStateSchema, PollState, data);

  return pollState;
}

