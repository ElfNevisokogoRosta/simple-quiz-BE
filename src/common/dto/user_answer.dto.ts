import { z } from "zod";

const userAnswerSchema = z.object({
    textAnswer: z.string().min(1,"This field could not be empty")
});

const userAnswerCreateDTO = userAnswerSchema.strict();
const userAnswerUpdateDTO = userAnswerSchema.partial();

type UserAnswerCreateDTO = z.infer<typeof userAnswerCreateDTO> 
type UserAnswerUpdateDTO = z.infer<typeof userAnswerUpdateDTO>

export {userAnswerCreateDTO, userAnswerUpdateDTO}
export type {UserAnswerUpdateDTO, UserAnswerCreateDTO}