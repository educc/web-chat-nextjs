# Web Chat
A web chat based on a single global room. No login required to talk in the chat.

## Stack
- Typescript + Next.js + tRPC
- Prisma + MongoDB
- React Query + Infinite React Query
- AWS S3 client to upload images

## Features Developed
- Send messages with upload image (uploading optional).
- Sort messages by time or text.
- Infinite scroll up to load more messages.
- Messages show text, time and image.
- Images are showing using signed S3 urls.
- UI responsible for any device (some ui issues on ios devices).

## Demo
Go to https://web-chat-nextjs.vercel.app/

### Start project

```bash
npm run dev        # starts next.js
```
