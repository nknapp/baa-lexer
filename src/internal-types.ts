import { LexerTypings, Location, StateName, Token, TokenType } from "./types";

export interface TokenFactory<T extends LexerTypings> {
  createToken(match: Match<T>): Token<T>;
  currentLocation: Location;
}

export type Transform = (original: string) => string;

export interface CompiledRule<T extends LexerTypings> {
  type: TokenType<T>;
  match: string | RegExp | null;
  push?: StateName<T>;
  pop?: 1;
  next?: StateName<T>;
  lineBreaks?: boolean;
  value?: Transform;
}

export interface Match<T extends LexerTypings> {
  rule: CompiledRule<T>;
  text: string;
  offset: number;
}

export interface CompiledState<T extends LexerTypings> {
  nextMatch(string: string, offset: number): Match<T>;
}

export type CompiledStateDict<T extends LexerTypings> = Record<
  StateName<T>,
  CompiledState<T>
>;

export interface Matcher<T extends LexerTypings> {
  match(string: string, offset: number): Match<T> | null;
}
