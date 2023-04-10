export interface CombinedRegex {
  match: string | null;
  matchIndex: number;
  matchingRegex: number;

  exec(string: string): boolean;

  reset(index: number): void;
}

export function combineRegex(
  regExps: RegExp[],
  { sticky = false, fastMatch = [] as (number | null)[] } = {}
): CombinedRegex {
  return new CombinedRegexImpl(regExps, { sticky, fastMatch });
}

class CombinedRegexImpl implements CombinedRegex {
  match: string | null = null;
  matchIndex = 0;
  matchingRegex = -1;
  regex: RegExp;
  fastMatchMapping: number[] | null = null;

  constructor(
    regexes: RegExp[],
    { sticky = false, fastMatch = [] as (number | null)[] } = {}
  ) {
    const sources = regexes.map((regex) => "(" + regex.source + ")");
    this.regex = new RegExp(sources.join("|"), sticky ? "y" : "g");
    if (sticky) {
      this.fastMatchMapping = [];
      for (let i = 0; i < fastMatch.length; i++) {
        const charCode = fastMatch[i];
        if (charCode != null) this.fastMatchMapping[charCode] = i;
      }
    }
  }

  reset(index: number) {
    this.regex.lastIndex = index;
  }

  exec(string: string): boolean {
    if (this.fastMatchMapping != null) {
      const fastMatch = this.fastMatchMapping[string.charCodeAt(this.regex.lastIndex)]
      if (fastMatch) {
        this.matchIndex = this.regex.lastIndex
        this.match = string[this.regex.lastIndex]
        this.matchingRegex = fastMatch
        return true
      }
    }
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
