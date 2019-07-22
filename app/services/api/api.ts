import { ApisauceInstance, create, ApiResponse } from "apisauce"
import { getGeneralApiProblem } from "./api-problem"
import { ApiConfig, DEFAULT_API_CONFIG } from "./api-config"
import * as Types from "./api.types"
import { CharacterSnapshot } from "../../models/character"

const convertCharacter = (raw: any): CharacterSnapshot => {
  const url: string = raw.url
  const id = url.replace("https://anapioficeandfire.com/api/characters/", "")
  return {
    id: id,
    name: raw.name,
    gender: raw.gender,
    titles: raw.titles,
    playedBy: raw.playedBy[0],
    isAlive: raw.isAlive,
  }
}

/**
 * Manages all requests to the API.
 */
export class Api {
  /**
   * The underlying apisauce instance which performs the requests.
   */
  apisauce: ApisauceInstance

  /**
   * Configurable options.
   */
  config: ApiConfig

  /**
   * Creates the api.
   *
   * @param config The configuration to use.
   */
  constructor(config: ApiConfig = DEFAULT_API_CONFIG) {
    this.config = config
  }

  /**
   * Sets up the API.  This will be called during the bootup
   * sequence and will happen before the first React component
   * is mounted.
   *
   * Be as quick as possible in here.
   */
  setup() {
    // construct the apisauce instance
    this.apisauce = create({
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: {
        Accept: "application/json",
      },
    })
  }

  /**
   * Gets a list of characters.
   */
  async getCharacters(): Promise<Types.GetCharactersResult> {
    // make the api call
    const response: ApiResponse<any> = await this.apisauce.get(`/characters`)

    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      const rawCharacters = response.data
      const convertedCharacters: CharacterSnapshot[] = rawCharacters.map(convertCharacter)
      return { kind: "ok", characters: convertedCharacters }
    } catch {
      return { kind: "bad-data" }
    }
  }

  /**
   * Gets a single character by ID
   */

  async getCharacter(id: string): Promise<Types.GetCharacterResult> {
    // make the api call
    const response: ApiResponse<any> = await this.apisauce.get(`/characters/${id}`)

    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      const convertedCharacter: CharacterSnapshot = convertCharacter(response.data)
      return { kind: "ok", character: convertedCharacter }
    } catch {
      return { kind: "bad-data" }
    }
  }
}
