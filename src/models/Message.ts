
export interface Message {
  id: string;
  desc: string;
  imgBase64?: string;
}

export interface MessageResponse {
  id: string;
  desc: string;
  createdAt: string;
  imageUrl?: string;
}

export interface MessageList {
  messages: MessageResponse[];
  nextCursor: string;
}