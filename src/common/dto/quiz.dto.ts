import { z } from "zod";

const quizSchema = z.object({
    title: z.string().min(1, "This field can not be empty"),
    description: z.string(),
    creatorId: z.string()
})

const quizCreateDTO = quizSchema.strict();
const quizUpdateDTO = quizSchema.partial();

type QuizCreateDTO = z.infer<typeof quizCreateDTO>;
type QuizUpdateDTO = z.infer<typeof quizUpdateDTO>;

export {quizCreateDTO, quizUpdateDTO};
export type {QuizCreateDTO, QuizUpdateDTO}