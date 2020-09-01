export const getNotEqual = (basis: unknown): string | boolean => {
  const type = typeof basis
  switch (type) {
    case "string":
      return "!" + basis
    default:
      return !basis
  }
}
