import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { api, GetQuestionsResult } from "../services/api"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { QuestionModel } from "./Question"

/**
 * Model description here for TypeScript hints.
 */
export const QuestionStoreModel = types
  .model("QuestionStore")
  .props({
    questions: types.optional(types.array(QuestionModel), []),
  })
  .actions(withSetPropAction)
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    async getQuestions() {
      const result: GetQuestionsResult = await api.getQuestions()
      if (result.kind === "ok") {
        self.setProp("questions", result.questions)
      } else {
        console.tron.error(`Error fetching questions: ${JSON.stringify(result)}`, [])
      }
    },
  }))

export interface QuestionStore extends Instance<typeof QuestionStoreModel> {}
export interface QuestionStoreSnapshotOut extends SnapshotOut<typeof QuestionStoreModel> {}
export interface QuestionStoreSnapshotIn extends SnapshotIn<typeof QuestionStoreModel> {}
export const createQuestionStoreDefaultModel = () => types.optional(QuestionStoreModel, {})
