import {
  LexerTypings,
  Location,
  StateName,
  BaaToken,
  TokenType,
} from "./types";

export interface TokenFactory<T extends LexerTypings> {
  createToken(match: Match<T>): BaaToken<T>;
  currentLocation: Location;
}

export type Transform = (original: string) => string;

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

export interface Match<T extends LexerTypings> {
  rule: BaaRule<T>;
  text: string;
  offset: number;
}

export interface StateProcessor<T extends LexerTypings> {
  nextMatch(string: string, offset: number): Match<T>;
}

export type StateProcessorDict<T extends LexerTypings> = Record<
  StateName<T>,
  StateProcessor<T>
>;

export interface Matcher<T extends LexerTypings> {
  match(string: string, offset: number): Match<T> | null;
}
