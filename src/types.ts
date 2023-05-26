export interface LexerTypings {
  stateName: string;
  tokenType: string;
}

export type StateName<T extends LexerTypings> = T["stateName"] | "main";
export type TokenType<T extends LexerTypings> = T["tokenType"];

export interface Lexer<T extends LexerTypings> extends Debuggable {
  lex(string: string): IterableIterator<BaaToken<T>>;
}

export interface TokenFactory<T extends LexerTypings> {
  createToken(match: Match<T>): BaaToken<T>;
  currentLocation: Location;
}

export type StateProcessorDict<T extends LexerTypings> = Record<
  StateName<T>,
  StateProcessor<T>
>;

export interface StateProcessor<T extends LexerTypings> extends Debuggable {
  nextMatch(string: string, offset: number, context: BaaContext<T>): Match<T>;
}

export interface Matcher<T extends LexerTypings> extends Debuggable {
  match(string: string, offset: number): Match<T> | null;
}

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

export interface BaaRule<T extends LexerTypings> {
  type: TokenType<T>;
  match?: string | RegExp;
  push?: StateName<T>;
  pop?: 1;
  next?: StateName<T>;
  lineBreaks?: boolean;
  value?: Transform;
}

export interface BaaMatchRule<T extends LexerTypings> extends BaaRule<T> {
  match: string | RegExp;
}

export type Transform = (original: string) => string;

export interface Match<T extends LexerTypings> {
  rule: BaaRule<T>;
  text: string;
  offset: number;
}

export interface BaaContext<T extends LexerTypings> {
  pendingMatch: Match<T> | null;
}

export type MooStates<T extends LexerTypings> = Record<
  StateName<T>,
  MooState<T>
>;

export type MooState<T extends LexerTypings> = {
  [P in TokenType<T>]?: MooRule<T>;
};

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

export interface Debuggable {
  /**
   * Warning: The result of this method is intended
   * for debugging purposes only and should be read by humans.
   * Semantic versioning does not apply to this method.
   */
  debug(): Record<string, unknown>;
}
