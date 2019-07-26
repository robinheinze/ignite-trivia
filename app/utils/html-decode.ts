var entities = {
  amp: "&",
  apos: "'",
  lt: "<",
  gt: ">",
  quot: '"',
  nbsp: "\xa0",
  ouml: "ö",
  auml: "ä",
  uuml: "ü",
  oacute: "ó",
  aacute: "á",
  eacute: "é",
  ntilde: "ñ",
}
entities["#039"] = "'"
var entityPattern: RegExp = /&(([a-z0-9]|#)+);/gi

export const decodeHTMLEntities = (text: string): string => {
  // A single replace pass with a static RegExp is faster than a loop
  return text.replace(entityPattern, (match, entity) => {
    entity = entity.toLowerCase()
    if (entities.hasOwnProperty(entity)) {
      return entities[entity]
    }
    // return original string if there is no matching entity (no replace)
    return match
  })
}
