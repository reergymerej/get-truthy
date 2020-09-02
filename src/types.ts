export enum TruthyError {
  AdditionSymbol = `Any addition with a Symbol always throws.`,
  MultiplySymbol = `Any multiplication with a Symbol always throws.`,
  ModSymbol = `Any mod with a Symbol always throws.`,
  ExpoSymbol = `Any exponentiation with a Symbol always throws.`,
  DivisionSymbol = `Any division with a Symbol always throws.`,
  DivisionLeftEmptyString = `Anything divided by an empty string is falsy.`,
  DivisionNumberZero = `0 divided by anything is falsy.`,
  DivisionRightEmptyString = `Any empty string divided by anything is falsy.`,
  DivisionString = `Any string division is falsy.`,
  ExpoLeftStringWord = `Anything raised to this exponent is falsy.`,
  GreaterThanLessThanSymbol = `Comparing < or > with a Symbol always throws.`,
  LessThanStringEmpty = `Nothing can be less than an empty string.`,
  LogicalAnd = `Anything && this value is falsy.`,
  ModuloLeftStringEmpty = `Anything % an empty string is falsy.`,
  ModuloLeftStringWord = `Anything % this string is falsy.`,
  ModuloNumberZero = `Any number % 0 is falsy.`,
  ModuloRightNumberZero = `0 % anything is falsy.`,
  ModuloRightStringEmpty = `'' % anything is 0.`,
  ModuloRightStringWord = `This string % anything is falsy.`,
  MultiplyEmptyString = `Multiplying an empty string is 0.`,
  MultiplyStringWord = `Multiplying any non-numeric string is falsy`,
  MultiplyZero = `Anything multiplied by 0 is falsy.`,
  SubractionString = `Subtraction with this string is always falsy.`,
  SubtractionSymbol = `Any subtractions with a Symbol always throws.`,
}

export enum SideLabel {
  left,
  right,
}

export type Operator =
  // relational
  // in
  // "instanceof"
  | ">"
  | "<"
  | ">="
  | "<="
  // equality
  | "=="
  | "==="
  | "!="
  | "!=="
  // arithmetic
  | "+"
  | "-"
  | "*"
  | "/"
  | "%"
  | "**"
  // binary logical
  | "&&"
  | "||"
// bitwise
// | "|"
// | "&"
// | "^"
// | ">>"
// | ">>>"
// | "<<"

export enum StringType {
  Empty,
  Numeric,
  Normal,
}
