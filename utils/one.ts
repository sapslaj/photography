export function one<T>(value: T | T[]): T {
  if (value instanceof Array) {
    return value[0]
  }
  return value
}
