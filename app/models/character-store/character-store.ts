import { Instance, SnapshotOut, types, flow } from "mobx-state-tree"
import { CharacterModel, CharacterSnapshot, Character } from "../character/character"
import { withEnvironment } from "../extensions"
import { GetCharactersResult } from "../../services/api"

/**
 * Model description here for TypeScript hints.
 */
export const CharacterStoreModel = types
  .model("CharacterStore")
  .props({
    characters: types.optional(types.array(CharacterModel), []),
    favorites: types.optional(types.array(types.reference(CharacterModel)), []),
  })
  .extend(withEnvironment)
  .views(self => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions(self => ({
    saveCharacters: (characterSnapshots: CharacterSnapshot[]) => {
      const characterModels: Character[] = characterSnapshots.map(c => CharacterModel.create(c)) // create model instances from the plain objects
      self.characters.replace(characterModels) // Replace the existing data with the new data
    },
  }))
  .actions(self => ({
    getCharacters: flow(function*() {
      const result: GetCharactersResult = yield self.environment.api.getCharacters()

      if (result.kind === "ok") {
        self.saveCharacters(result.characters)
      } else {
        __DEV__ && console.tron.log(result.kind)
      }
    }),
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

/**
  * Un-comment the following to omit model attributes from your snapshots (and from async storage).
  * Useful for sensitive data like passwords, or transitive state like whether a modal is open.

  * Note that you'll need to import `omit` from ramda, which is already included in the project!
  *  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
  */

type CharacterStoreType = Instance<typeof CharacterStoreModel>
export interface CharacterStore extends CharacterStoreType {}
type CharacterStoreSnapshotType = SnapshotOut<typeof CharacterStoreModel>
export interface CharacterStoreSnapshot extends CharacterStoreSnapshotType {}
