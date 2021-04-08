import { QuestionModel } from "./question"

test("can be created", () => {
  const instance = QuestionModel.create({})

  expect(instance).toBeTruthy()
})
