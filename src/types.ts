export interface LexerTypings {
  stateName: string;
  tokenType: string;
}

export type MooRule<T extends LexerTypings> =
  | MooMatchRule<T>
  | MooFallbackRule
  | MooErrorRule;

export type MooMatchRule<T extends LexerTypings> =
  | MooObjectMatchRule<T>
  | RegExp
  | string;

export interface MooObjectMatchRule<T extends LexerTypings> {
  match: RegExp | string;
  lineBreaks?: boolean;
  push?: StateName<T>;
  pop?: 1;
  next?: StateName<T>;
  value?: (original: string) => string;
}

export interface MooFallbackRule {
  fallback: true;
  lineBreaks?: boolean;
}

export interface MooErrorRule {
  error: true;
  lineBreaks?: boolean;
}

export type MooState<T extends LexerTypings> = {
  [P in TokenType<T>]?: MooRule<T>;
};

export type MooStates<T extends LexerTypings> = Record<
  StateName<T>,
  MooState<T>
>;

export type StateName<T extends LexerTypings> = T["stateName"] | "main";
export type TokenType<T extends LexerTypings> = T["tokenType"];

export interface BaaToken<T extends LexerTypings> {
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
  lex(string: string): IterableIterator<BaaToken<T>>;
}
