export interface LexerTypings {
  stateName: string;
  tokenType: string;
}

export type Rule<T extends LexerTypings> =
  | MatchRule<T>
  | FallbackRule
  | ErrorRule;

export type MatchRule<T extends LexerTypings> =
  | ObjectMatchRule<T>
  | RegExp
  | string;

export interface ObjectMatchRule<T extends LexerTypings> {
  match: RegExp | string;
  lineBreaks?: boolean;
  push?: StateName<T>;
  pop?: 1;
  next?: StateName<T>;
  value?: (original: string) => string;
}

export interface FallbackRule {
  fallback: true;
  lineBreaks?: boolean;
}

export interface ErrorRule {
  error: true;
}

export type MooState<T extends LexerTypings> = {
  [P in TokenType<T>]?: Rule<T>;
}

export type MooStates<T extends LexerTypings> = Record<
  StateName<T>,
  MooState<T>
>;

export type StateName<T extends LexerTypings> = T["stateName"] | "main";
export type TokenType<T extends LexerTypings> = T["tokenType"];

export interface Token<T extends LexerTypings> {
  type: TokenType<T>;
  original: string;
  value: string;
  start: Location;
  end: Location;
}

export interface Location {
  column: number;
  line: number;
}

export interface Lexer<T extends LexerTypings> {
  lex(string: string): IterableIterator<Token<T>>;
}
