import { z } from "zod";

export const sendMessagesValidator = z.object({
  messages: z.array(z.object({
    role: z.string(),
    content: z.string()
  })),
  fileId: z.string()
})