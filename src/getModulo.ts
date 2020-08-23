import { SideLabel, TruthyError } from "./types"
import { error } from "./visualize"

export const getModulo = (side: SideLabel, basis: any): any => {
  const type = typeof basis
  if (side === SideLabel.left) {
    switch (type) {
      case "number":
        if (basis === 0) {
          throw new Error(error(side, "%", basis, TruthyError.ModuloNumberZero))
        }
        return basis * 0.5
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
  } else {
    switch (type) {
      case "number":
        if (basis === 0) {
          throw new Error(error(side, "%", basis, TruthyError.ModuloNumberZero))
        }
        return basis * 2
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
}
