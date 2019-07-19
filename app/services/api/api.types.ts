import { GeneralApiProblem } from "./api-problem"
import { CharacterSnapshot } from "../../models/character"

export type GetCharactersResult =
  | { kind: "ok"; characters: CharacterSnapshot[] }
  | GeneralApiProblem
export type GetCharacterResult = { kind: "ok"; character: CharacterSnapshot } | GeneralApiProblem
