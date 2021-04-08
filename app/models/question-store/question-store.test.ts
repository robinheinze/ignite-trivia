import { QuestionStoreModel } from "./question-store"

test("can be created", () => {
  const instance = QuestionStoreModel.create({})

  expect(instance).toBeTruthy()
})
