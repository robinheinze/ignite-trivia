import { CharacterModel, Character } from "./character"

test("can be created", () => {
  const instance: Character = CharacterModel.create({})

  expect(instance).toBeTruthy()
})