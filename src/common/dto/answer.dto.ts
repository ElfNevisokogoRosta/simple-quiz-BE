import { z } from 'zod';

const answerSchema = z.object({
  text: z.string().min(1, 'This field can not be empty'),
  isCorrect: z.boolean(),
  answerId: z.string(),
});

const answerCreateDTO = answerSchema.strict();
const answerUpdateDTO = answerSchema.partial();

type AnswerCreateDTO = z.infer<typeof answerCreateDTO>;
type AnswerUpdateDTO = z.infer<typeof answerUpdateDTO>;

export { answerCreateDTO, answerUpdateDTO };
export type { AnswerCreateDTO, AnswerUpdateDTO };
