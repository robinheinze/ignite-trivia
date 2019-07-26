import { QuestionModel, Question, QuestionSnapshot } from "./question"

const questionData: QuestionSnapshot = {
  id: "1",
  difficulty: "easy",
  type: "multiple",
  correctAnswer: "foo",
  incorrectAnswers: ["bar", "baz", "bop"],
  question: "What is the best 3-letter nonsense word?",
  category: "Random",
  guess: "",
}

test("can be created", () => {
  const instance: Question = QuestionModel.create(questionData)

  expect(instance).toBeTruthy()
})

test("can list all answers randomly", () => {
  const instance: Question = QuestionModel.create(questionData)

  expect(instance.allAnswers).toHaveLength(4)
  expect(instance.allAnswers).not.toEqual(
    instance.incorrectAnswers.concat([instance.correctAnswer]),
  )
})

test("can set a guess", () => {
  const instance: Question = QuestionModel.create(questionData)

  instance.setGuess("foo")
  expect(instance.guess).toEqual("foo")
})

test("knows if a guess is correct", () => {
  const instance: Question = QuestionModel.create(questionData)

  instance.setGuess("foo")
  expect(instance.isCorrect).toBe(true)

  instance.setGuess("bar")
  expect(instance.isCorrect).toBe(false)
})
