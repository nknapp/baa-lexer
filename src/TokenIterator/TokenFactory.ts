import { Match } from "../compiledState";
import { LexerTypings, Location } from "../types";
import { LocationTracker } from "../LocationTracker";

export class TokenFactory<T extends LexerTypings> {
  #location = new LocationTracker();

  createToken(match: Match<T>) {
    const start = this.#location.current;
    const end = this.#location.advance(match.text, {
      multiline: match.rule.lineBreaks,
    });
    return {
      type: match.rule.type,
      original: match.text,
      value: match.rule.value ? match.rule.value(match.text) : match.text,
      start,
      end,
    };
  }

  get currentLocation(): Location {
    return this.#location.current;
  }
}
