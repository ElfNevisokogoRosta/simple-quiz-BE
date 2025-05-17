import { z } from 'zod';

const quizAttemptSchema = z.object({
  userId: z.string(),
  quizId: z.string(),
  completedAt: z.date(),
});

const quizAttemptCreateDTO = quizAttemptSchema.strict();
const quizAttemptUpdateDTO = quizAttemptSchema.partial();

type QuizAttemptCreateDTO = z.infer<typeof quizAttemptCreateDTO>;
type QuizAttemptUpdateDTO = z.infer<typeof quizAttemptUpdateDTO>;

export { quizAttemptCreateDTO, quizAttemptUpdateDTO };
export type { QuizAttemptCreateDTO, QuizAttemptUpdateDTO };
