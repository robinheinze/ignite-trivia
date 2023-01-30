import { QuestionModel } from "./Question"

test("can be created", () => {
  const instance = QuestionModel.create({})

  expect(instance).toBeTruthy()
})
