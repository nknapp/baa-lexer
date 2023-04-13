import { LexerTypings } from "../types";
import { Match, Matcher } from "../internal-types";

export class FirstMatchingMatcher<T extends LexerTypings>
  implements Matcher<T>
{
  private subMatcher: Matcher<T>;
  private fallback: Matcher<T>;

  constructor(subMatcher: Matcher<T>, fallback: Matcher<T>) {
    this.subMatcher = subMatcher;
    this.fallback = fallback;
  }

  match(string: string, offset: number): Match<T> | null {
    return (
      this.subMatcher.match(string, offset) ??
      this.fallback.match(string, offset)
    );
  }

  expectedTypes() {
    return Array.from(
      new Set([
        ...this.subMatcher.expectedTypes(),
        ...this.fallback.expectedTypes(),
      ])
    );
  }
}
