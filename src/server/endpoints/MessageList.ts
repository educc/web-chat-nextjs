import { messages } from '@prisma/client';
import { z } from 'zod';
import { MessageList, MessageResponse } from '~/models/Message';
import { SortType, SortTypeOrder } from '~/models/Sorts';
import { db } from '~/server/db';
import { publicProcedure } from '~/server/trpc';
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { ApiResponse } from '~/models/ApiResponse';

const client = new S3Client({
  region: "us-east-1"
});

const LIMIT = 10

interface Request {
  sortingBy: SortType;
  order: SortTypeOrder;
  cursor?: string | null | undefined;
}

export const listMessage = publicProcedure
  .input(
    z.object({
      sortingBy:
        z.enum([SortType.ByCreatedAt, SortType.ByText]),
      order:
        z.enum([SortTypeOrder.Ascending, SortTypeOrder.Descending]),
      cursor: z.string().nullish(),
    }),
  )
  .query(async ({ input }) => {
    try {
      return await getMessageList(input)
    } catch (ex) {
      return { success: false }
    }
  })

async function getMessageList(input: Request): Promise<ApiResponse<MessageList>> {
  // [1] find results
  const messageList = await find(input)

  let nextCursor: typeof input.cursor | undefined = undefined;
  if (messageList.length > LIMIT) {
    const nextItem = messageList.pop()
    nextCursor = nextItem!.id;
  }

  // [2] get signed url
  const allKeys = messageList
    .filter((m) => m.imgS3Key)
    .map((m) => m.imgS3Key as string) || []

  const signedUrlMap = await getSignedFileUrlForAll(allKeys);

  // [3] transform results

  const result: MessageResponse[] = messageList.map((message) => {
    const imageUrl = message.imgS3Key ?
      signedUrlMap.get(message.imgS3Key as string) : undefined

    return {
      desc: message.desc || "",
      createdAt: message.createdAt.toISOString(),
      id: message.id,
      imageUrl
    }
  })

  const response: ApiResponse<MessageList> = {
    success: true,
    data: {
      messages: result,
      nextCursor
    }
  }
  return response
}

async function find(input: Request): Promise<messages[]> {
  const { cursor } = input;

  const orderBy: any = (() => {
    const order: string =
      input.order === SortTypeOrder.Ascending ? "asc" : "desc"
    if (input.sortingBy === SortType.ByCreatedAt) {
      return { createdAt: order }
    }
    return { desc: order }
  })()

  const myCursor: any = (() => {
    if (!cursor) return undefined;
    return { id: cursor }
  })();


  return await db.messages.findMany({
    take: LIMIT + 1,
    cursor: myCursor,
    orderBy: [orderBy]
  })
}

async function getSignedFileUrlForAll(keys: string[]): Promise<Map<string, string>> {
  const allPromises = keys.map(async (key) => {
    const signedUrl = await getSignedFileUrl(key);
    return [key, signedUrl];
  })

  const allSignedUrls = await Promise.all(allPromises);
  return allSignedUrls.reduce((map, [key, signedUrl]) => {
    map.set(key, signedUrl);
    return map;
  }, new Map<string, string>());
}



async function getSignedFileUrl(key: string) {
  const expireIn24h = 60 * 60 * 24;
  const command = new GetObjectCommand({
    Bucket: "aerialops",
    Key: key,
  });

  // await the signed URL and return it
  return await getSignedUrl(client, command, { expiresIn: expireIn24h });
}