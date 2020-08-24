import { StringType } from "./types"

export const getStringType = (string: string): StringType => {
  if (string === "") {
    return StringType.Empty
  }
  if (!isNaN(Number(string))) {
    return StringType.Numeric
  }
  return StringType.Normal
}
