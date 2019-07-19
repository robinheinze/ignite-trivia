import { CharacterStoreModel, CharacterStore } from "./character-store"

test("can be created", () => {
  const instance: CharacterStore = CharacterStoreModel.create({})

  expect(instance).toBeTruthy()
})