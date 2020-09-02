import { getCodePoint } from "./greaterOrLessThan"

describe("getCodePoint", () => {
  describe("with an empty string", () => {
    it("should throw", () => {
      expect(() => {
        getCodePoint("")
      }).toThrow(/empty/)
    })
  })
})
