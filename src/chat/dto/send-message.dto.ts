interface File {
  url: string;
  type: string;
  name: string;
}

export class SendMessageDto {
  readonly chat_id: string;
  readonly user_id: string;
  readonly content: {
    readonly text: string;
    readonly files: File[];
    readonly audio: File | undefined;
  };
}
