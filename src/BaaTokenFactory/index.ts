import { TokenFactory, LexerTypings } from "../types";
import { BaaTokenFactory } from "./BaaTokenFactory";

export function createTokenFactory<T extends LexerTypings>(): TokenFactory<T> {
  return new BaaTokenFactory<T>();
}
