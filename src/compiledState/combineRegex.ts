export interface CombinedRegex {
  match: string | null;
  matchIndex: number;
  matchingRegex: number;

  exec(string: string): boolean;

  reset(index: number): void;
}

export function combineRegex(
  regExps: RegExp[],
  { sticky = false } = {}
): CombinedRegex {
  return new CombinedRegexImpl(regExps, { sticky });
}

class CombinedRegexImpl implements CombinedRegex {
  match: string | null = null;
  matchIndex = 0;
  matchingRegex = -1;
  regex: RegExp;

  constructor(regexes: RegExp[], { sticky = false } = {}) {
    const sources = regexes.map((regex) => "(" + regex.source + ")");
    this.regex = new RegExp(sources.join("|"), sticky ? "y" : "g");
  }

  reset(index: number) {
    this.regex.lastIndex = index;
  }

  exec(string: string): boolean {
    const match = this.regex.exec(string);
    if (match != null) {
      this.matchIndex = match.index;
      this.match = match[0];
      this.matchingRegex = 0;
      while (match[this.matchingRegex + 1] == null) {
        this.matchingRegex++;
      }

      return true;
    }
    return false;
  }
}
