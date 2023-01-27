/**
 * This Api class lets you define an API endpoint and methods to request
 * data and process it.
 *
 * See the [Backend API Integration](https://github.com/infinitered/ignite/blob/master/docs/Backend-API-Integration.md)
 * documentation for more details.
 */
import { ApiResponse, ApisauceInstance, create } from "apisauce"
import Config from "../../config"
import type { ApiConfig } from "./api.types"
import * as uuid from "react-native-uuid"
import { QuestionSnapshotOut } from "../../models"
import { getGeneralApiProblem } from "./apiProblem"
import * as Types from "./api.types"

const API_PAGE_SIZE = 50

const convertQuestion = (raw: any): QuestionSnapshotOut => {
  const id = uuid.default.v1().toString()

  return {
    id,
    category: raw.category,
    type: raw.type,
    difficulty: raw.difficulty,
    question: raw.question,
    correctAnswer: raw.correct_answer,
    incorrectAnswers: raw.incorrect_answers,
    guess: "",
  }
}

/**
 * Configuring the apisauce instance.
 */
export const DEFAULT_API_CONFIG: ApiConfig = {
  url: Config.API_URL,
  timeout: 10000,
}

/**
 * Manages all requests to the API. You can use this class to build out
 * various requests that you need to call from your backend API.
 */
export class Api {
  apisauce: ApisauceInstance
  config: ApiConfig

  /**
   * Set up our API instance. Keep this lightweight!
   */
  constructor(config: ApiConfig = DEFAULT_API_CONFIG) {
    this.config = config
    this.apisauce = create({
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: {
        Accept: "application/json",
      },
    })
  }

  /**
   * Gets a list of trivia questions.
   */
  async getQuestions(): Promise<Types.GetQuestionsResult> {
    // make the api call
    const response: ApiResponse<any> = await this.apisauce.get("", {
      amount: API_PAGE_SIZE,
    })

    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      const rawQuestions = response.data.results
      const convertedQuestions: QuestionSnapshotOut[] = rawQuestions.map(convertQuestion)
      return { kind: "ok", questions: convertedQuestions }
    } catch (e) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }
}

// Singleton instance of the API for convenience
export const api = new Api()
