export class CreatePollPayload {
    title!: string;
    description!: string;

    constructor(fields: Partial<CreatePollPayload> = {}) {
        Object.assign(this, fields);
    }
}

export const CreatePollSchema = new Map([
    [
        CreatePollPayload,
        {
            kind: "struct",
            fields: [
                ["title", "string"],
                ["description", "string"],
            ],
        },
    ],
]);