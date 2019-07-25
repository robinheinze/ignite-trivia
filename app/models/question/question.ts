import { Instance, SnapshotOut, types } from "mobx-state-tree"
import shuffle from "lodash.shuffle"
/**
 * A trivia questions with several answer choices
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
  })
  .views(self => ({
    get radioProps() {
      const allAnswers = self.incorrectAnswers.concat([self.correctAnswer])
      const radioProps = allAnswers.map(answer => ({ label: answer, value: answer }))
      return shuffle(radioProps)
    },
    isCorrectAnswer(guess: string) {
      return guess === self.correctAnswer
    },
  }))
  .actions(self => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars

/**
  * Un-comment the following to omit model attributes from your snapshots (and from async storage).
  * Useful for sensitive data like passwords, or transitive state like whether a modal is open.

  * Note that you'll need to import `omit` from ramda, which is already included in the project!
  *  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
  */

type QuestionType = Instance<typeof QuestionModel>
export interface Question extends QuestionType {}
type QuestionSnapshotType = SnapshotOut<typeof QuestionModel>
export interface QuestionSnapshot extends QuestionSnapshotType {}
