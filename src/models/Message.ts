
export interface Message {
  id: string;
  desc: string;
  createdAt: string;
}

export interface MessageList {
  messages: Message[];
  nextCursor: string;
}