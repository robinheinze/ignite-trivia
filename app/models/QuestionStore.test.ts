import { QuestionStoreModel } from "./QuestionStore"

test("can be created", () => {
  const instance = QuestionStoreModel.create({})

  expect(instance).toBeTruthy()
})
