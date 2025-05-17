import { QuestionType } from '@prisma/client';
import { z } from 'zod';

const questionSchema = z.object({
  text: z.string().min(1, 'This field can not be empty'),
  questionType: z.nativeEnum(QuestionType),
  quizId: z.string(),
});

const questionCreateDTO = questionSchema.strict();
const questionUpdateDTO = questionSchema.partial();

type QuestionCreateDTO = z.infer<typeof questionCreateDTO>;
type QuestionUpdateDTO = z.infer<typeof questionUpdateDTO>;

export { questionCreateDTO, questionUpdateDTO };
export type { QuestionCreateDTO, QuestionUpdateDTO };
