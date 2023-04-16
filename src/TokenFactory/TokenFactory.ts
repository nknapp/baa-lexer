import { LexerTypings } from "../types";
import { createLocationTracker } from "./locationTrackerFn";
import { Match, TokenFactory } from "../internal-types";

export class TokenFactoryImpl<T extends LexerTypings>
  implements TokenFactory<T>
{
  private _location = createLocationTracker();
  currentLocation = this._location.current;

  createToken(match: Match<T>) {
    const start = this._location.current;
    const end = (this.currentLocation = this._location.advance(match.text, {
      multiline: match.rule.lineBreaks,
    }));
    return {
      type: match.rule.type,
      original: match.text,
      value: match.rule.value ? match.rule.value(match.text) : match.text,
      start,
      end,
    };
  }
}
