import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import shuffle from "lodash.shuffle"

/**
 * Model description here for TypeScript hints.
 */
export const QuestionModel = types
  .model("Question")
  .props({
    id: types.identifier,
    category: types.maybe(types.string),
    type: types.enumeration(["multiple", "boolean"]),
    difficulty: types.enumeration(["easy", "medium", "hard"]),
    question: types.maybe(types.string),
    correctAnswer: types.maybe(types.string),
    incorrectAnswers: types.optional(types.array(types.string), []),
    guess: types.maybe(types.string),
  })
  .actions(withSetPropAction)
  .views((self) => ({
    get allAnswers() {
      return shuffle(self.incorrectAnswers.concat([self.correctAnswer]))
    },
    get isCorrect() {
      return self.guess === self.correctAnswer
    },
  })) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    setGuess(guess: string) {
      self.setProp("guess", guess)
    },
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface Question extends Instance<typeof QuestionModel> {}
export interface QuestionSnapshotOut extends SnapshotOut<typeof QuestionModel> {}
export interface QuestionSnapshotIn extends SnapshotIn<typeof QuestionModel> {}
export const createQuestionDefaultModel = () => types.optional(QuestionModel, {})
