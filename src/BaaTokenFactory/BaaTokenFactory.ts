import { LexerTypings, Match, TokenFactory } from "../types";
import { LocationTracker } from "./LocationTracker";

export class BaaTokenFactory<T extends LexerTypings>
  implements TokenFactory<T>
{
  private _location = new LocationTracker();
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
