import { QuestionModel, Question } from "./question"

test("can be created", () => {
  const instance: Question = QuestionModel.create({
    id: "1",
    difficulty: "easy",
    type: "multiple",
    correctAnswer: "foo",
    incorrectAnswers: ["bar", "baz", "bop"],
    question: "What is the best 3-letter nonsense word?",
    category: "Random",
  })

  expect(instance).toBeTruthy()
})
