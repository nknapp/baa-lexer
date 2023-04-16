import { Lexer, LexerTypings, MooStates, StateName } from "./types";
import { mapValues } from "./utils/mapValues";
import { CompiledState } from "./internal-types";
import { compileMooState } from "./mooState";
import { BaaLexer } from "./BaaLexer";
import { BaaTokenFactory } from "./BaaTokenFactory";

export type {
  MooStates,
  Token,
  LexerTypings,
  Lexer,
  Location,
  MooState,
} from "./types";

export { withLookAhead } from "./utils/withLookAhead";

export function baa<T extends LexerTypings>(mooStates: MooStates<T>): Lexer<T> {
  const states: Record<StateName<T>, CompiledState<T>> = mapValues(
    mooStates,
    (state) => compileMooState(state)
  );
  return new BaaLexer<T>(states, () => new BaaTokenFactory());
}
