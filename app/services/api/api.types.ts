import { GeneralApiProblem } from "./apiProblem"
import { QuestionSnapshotOut } from "../../models"

export type GetQuestionsResult =
  | { kind: "ok"; questions: QuestionSnapshotOut[] }
  | GeneralApiProblem

export interface ApiConfig {
  /**
   * The URL of the api.
   */
  url: string

  /**
   * Milliseconds before we timeout the request.
   */
  timeout: number
}
