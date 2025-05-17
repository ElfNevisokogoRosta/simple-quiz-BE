import { z } from 'zod';

const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(7, 'Password must be at least 7 symbols'),
  name: z.string().trim().min(1, 'Name can not be empty'),
});

const userCreateDTO = userSchema.strict();
const userUpdateDTO = userSchema.partial();

type UserCreateDTO = z.infer<typeof userCreateDTO>;
type UserUpdateDTO = z.infer<typeof userUpdateDTO>;

export { userCreateDTO, userUpdateDTO };
export type { UserCreateDTO, UserUpdateDTO };
