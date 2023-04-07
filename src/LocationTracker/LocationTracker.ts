import { endLocationMultiline } from "./endLocationMultiline";
import { endLocationSingleLine } from "./endLocationSingleLine";

export class LocationTracker {
  current = { line: 1, column: 0 };

  advance(token: string, { multiline = false } = {}) {
    this.current = multiline
      ? endLocationMultiline(this.current, token)
      : endLocationSingleLine(this.current, token);
  }
}
