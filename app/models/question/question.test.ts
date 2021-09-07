import { QuestionModel } from "./question"

test("can be created", () => {
  const instance = QuestionModel.create({ id: "1", type: "multiple", difficulty: "easy" })

  expect(instance).toBeTruthy()
})
