import { QuestionModel, Question } from "./question"

test("can be created", () => {
  const instance: Question = QuestionModel.create({ id: "foo" })

  expect(instance).toBeTruthy()
})
