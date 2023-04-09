import { endLocationMultiline } from "./endLocationMultiline";
import { endLocationSingleLine } from "./endLocationSingleLine";
import {Location} from "../types";

export class LocationTracker {
  current = { line: 1, column: 0 };

  advance(token: string, { multiline = false } = {}): Location {
    this.current = multiline
      ? endLocationMultiline(this.current, token)
      : endLocationSingleLine(this.current, token);
    return this.current
  }
}
