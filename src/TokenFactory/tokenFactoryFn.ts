import { LexerTypings } from "../types";
import { Match, TokenFactory } from "../internal-types";
import { createLocationTracker } from "./locationTrackerFn";

export function createTokenFactory<T extends LexerTypings>(): TokenFactory<T> {
  const location = createLocationTracker();

  return {
    currentLocation: location.current,
    createToken(match: Match<T>) {
      const start = location.current;
      this.currentLocation = location.advance(match.text, {
        multiline: match.rule.lineBreaks,
      });
      const end = this.currentLocation;
      return {
        type: match.rule.type,
        original: match.text,
        value: match.rule.value ? match.rule.value(match.text) : match.text,
        start,
        end,
      };
    },
  };
}
