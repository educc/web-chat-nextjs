import { z } from 'zod';
import { ApiResponse } from '~/models/ApiResponse';
import { db } from '~/server/db';
import { publicProcedure } from '~/server/trpc';
import { S3Client, PutObjectCommand, PutObjectCommandOutput } from "@aws-sdk/client-s3";
import { uuid } from 'uuidv4';

const client = new S3Client({
  region: "us-east-1"
});

export const addMessage = publicProcedure
  .input(
    z.object({
      desc: z.string(),
      imgBase64: z.string().optional(),
    }),
  )
  .mutation(async ({ input }) => {

    try {
      const s3Result = await uploadToS3(input.imgBase64)
      await db.messages.create({
        data: { desc: input.desc, imgS3Key: s3Result?.awsFileKey }
      })

      //I am assuming everything is OK
      return { success: true } as ApiResponse
    } catch (ex) {
      console.error("At adding new message", ex)
      return { success: false } as ApiResponse
    }
  })

interface UploadResult {
  awsFileKey: string;
  uploadResult: PutObjectCommandOutput;
}

async function uploadToS3(fileBase64: string | undefined): Promise<UploadResult | undefined> {
  if (!fileBase64) { return undefined }

  const { content, base64 } = extractContentAndBase64(fileBase64);

  const file = Buffer.from(base64, 'base64');
  const filename = uuid();
  const uploadCommand = new PutObjectCommand({
    Bucket: 'aerialops',
    Key: filename,
    Body: file,
    ContentType: content

  });
  const uploadResult: PutObjectCommandOutput = await client.send(uploadCommand);
  return {
    awsFileKey: filename,
    uploadResult
  };
}

function extractContentAndBase64(fileBase64: string): { content: string, base64: string } {
  const content = fileBase64.split(';base64,')[0];
  const base64 = fileBase64.split(';base64,')[1];
  return { content, base64 }
}
