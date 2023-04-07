export interface CombinedRegex {
  lastMatch: string | null;
  lastIndex: number;
  lastRegex: number;

  exec(string: string): boolean;
}

export function combineRegex(
  regExps: RegExp[],
  { sticky = false } = {}
): CombinedRegex {
  return new CombinedRegexImpl(regExps, { sticky });
}

class CombinedRegexImpl implements CombinedRegex {
  lastMatch: string | null = null;
  lastIndex = 0;
  lastRegex = -1;
  regex: RegExp;

  constructor(regexes: RegExp[], { sticky = false } = {}) {
    const sources = regexes.map((regex) => "(" + regex.source + ")");
    this.regex = new RegExp(sources.join("|"), sticky ? "y" : "g");
  }

  exec(string: string): boolean {
    this.regex.lastIndex = this.lastIndex
    const match = this.regex.exec(string);
    if (match != null) {
      this.lastMatch = match[0];
      this.lastRegex = 0;
      while (match[this.lastRegex + 1] == null) {
        this.lastRegex++;
      }
      this.lastIndex = this.regex.lastIndex;
      return true;
    }
    return false;
  }
}
