import { CompiledState, LexerTypings } from "../types";
import { RuleBasedState } from "./RuleBasedState";

import {
  ErrorRule,
  FallbackRule,
  RuleMatcherFactory,
} from "./RuleBasedState.types";

export interface RulesOptions<T extends LexerTypings> {
  matcher: RuleMatcherFactory<T>;
  fallbackRule?: FallbackRule<T>;
  errorRule?: ErrorRule<T>;
}

export function rules<T extends LexerTypings>(
  options: RulesOptions<T>
): CompiledState<T> {
  return new RuleBasedState<T>(options);
}

