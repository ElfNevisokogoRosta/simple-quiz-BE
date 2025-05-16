import { z } from 'zod';

const authDTO = z
  .object({
    email: z.string().email(),
    password: z.string(),
  })
  .strict();

type AuthDTO = z.infer<typeof authDTO>;

export { authDTO };
export type { AuthDTO };
