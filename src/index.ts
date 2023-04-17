import { Lexer, LexerTypings, MooStates, StateName } from "./types";
import { mapValues } from "./utils/mapValues";
import { StateProcessor } from "./internal-types";
import { mooState } from "./mooState";
import { createLexer} from "./BaaLexer";
import { createTokenFactory } from "./BaaTokenFactory";

export type {
  MooStates,
  BaaToken,
  LexerTypings,
  Lexer,
  Location,
  MooState,
} from "./types";

export { withLookAhead } from "./utils/withLookAhead";

export function baa<T extends LexerTypings>(mooStates: MooStates<T>): Lexer<T> {
  const states: Record<StateName<T>, StateProcessor<T>> = mapValues(
    mooStates,
    (state) => mooState(state)
  );
  return createLexer(states, () => createTokenFactory());
}
