import { QuestionStoreModel, QuestionStore } from "./question-store"

test("can be created", () => {
  const instance: QuestionStore = QuestionStoreModel.create({} as any)

  expect(instance).toBeTruthy()
})
