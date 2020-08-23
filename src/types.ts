export enum TruthyError {
  DivisionLeftEmptyString = `Dividing by an empty string is Infinity.`,
  DivisionRightEmptyString = `'' % is 0.`,
  DivisionNumberZero = `0 divided by anything is NaN.`,
  DivisionString = `Any string division is NaN.`,
  LessThanStringEmpty = `Nothing can be less than an empty string.`,
  ModuloLeftStringEmpty = `Anything % '' is NaN.`,
  ModuloLeftStringWord = `Anything % this string is NaN.`,
  ModuloNumberZero = `Any number % 0 is NaN.`,
  ModuloRightNumberZero = `0 % anything is falsy.`,
  ModuloRightStringEmpty = `Any empty string % is 0.`,
  ModuloRightStringWord = `This string % anything is falsy.`,
  MultiplyEmptyString = `Multiplying an empty string is 0.`,
  MultiplyStringWord = `Multiplying any non-numeric string is NaN`,
  MultiplyZero = `Anything multiplied by 0 is falsy.`,
  SubractionString = `Subtracting any string leads to NaN`,
}

export enum SideLabel {
  left,
  right,
}

export type Operator =
  | ">"
  | "<"
  | ">="
  | "<="
  | "=="
  | "==="
  | "!="
  | "!=="
  | "+"
  | "-"
  | "*"
  | "/"
  | "%"
// | "**"

// relational
// in
// <
// >
// <=
// >=
//
// equality operators
//==
// !=
// ===
// !==
//
// bitwise
// &
// |
// ^
// | ">>"
// | ">>>"
// | "<<"
//
// binary logical
// &&
// ||
//
//
// | "instanceof"
