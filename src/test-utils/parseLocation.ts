import { Location } from "baa-lexer";

export function parseLocation(location: string): Location {
  const [line, column] = location.split(":").map(Number);
  return { line, column };
}
