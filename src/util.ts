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

type BasisType =
  | "bigint"
  | "boolean"
  | "function"
  | "null"
  | "number"
  | "object"
  | "string"
  | "symbol"
  | "undefined"

export const getType = (basis: unknown): BasisType => {
  const type = typeof basis
  if (type === "object") {
    return basis === null
      ? "null" //
      : "object"
  }
  return type
}
