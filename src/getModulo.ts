import { SideLabel, TruthyError } from "./types"
import { error } from "./visualize"

const getLeftNumber = (side: SideLabel, basis: any) => {
  if (basis === 0) {
    throw new Error(error(side, "%", basis, TruthyError.ModuloNumberZero))
  }
  return basis * 0.5
}

const getRightNumber = (side: SideLabel, basis: any) => {
  if (basis === 0) {
    throw new Error(error(side, "%", basis, TruthyError.ModuloNumberZero))
  }
  return basis * 2
}

const getLeft = (side: SideLabel, basis: any) => {
  const type = typeof basis
  switch (type) {
    case "number":
      return getLeftNumber(side, basis)

    case "string": {
      const parsed = parseFloat(basis)
      if (isNaN(parsed)) {
        throw new Error(
          error(
            side,
            "%",
            basis,
            basis
              ? TruthyError.ModuloLeftStringWord
              : TruthyError.ModuloLeftStringEmpty,
          ),
        )
      }
      return getModulo(side, parsed)
    }
    default:
      throw new Error(`unhandled case "${type}"`)
  }
}

const getRight = (side: SideLabel, basis: any) => {
  const type = typeof basis
  switch (type) {
    case "number":
      return getRightNumber(side, basis)
    case "string": {
      const parsed = parseFloat(basis)
      if (isNaN(parsed)) {
        throw new Error(
          error(
            side,
            "%",
            basis,
            basis
              ? TruthyError.ModuloRightStringWord
              : TruthyError.ModuloRightStringEmpty,
          ) + "\nhttps://www.destroyallsoftware.com/talks/wat",
        )
      }
      return getModulo(side, parsed)
    }
    default:
      throw new Error(`unhandled case "${type}"`)
  }
}

export const getModulo = (side: SideLabel, basis: any): any =>
  side === SideLabel.left
    ? //
      getLeft(side, basis)
    : //
      getRight(side, basis)
