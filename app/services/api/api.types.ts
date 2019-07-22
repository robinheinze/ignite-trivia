import { GeneralApiProblem } from "./api-problem"
import { QuestionSnapshot } from "../../models/question"

export type GetQuestionsResult = { kind: "ok"; questions: QuestionSnapshot[] } | GeneralApiProblem
