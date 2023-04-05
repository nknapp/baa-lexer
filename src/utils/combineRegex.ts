interface CombinedRegex {
  lastMatch: string | null;
  lastIndex: number;
  lastGroup: number;

  exec(string: string): boolean;
}

export function combineRegex(regExps: RegExp[], { sticky = false } = {}): CombinedRegex {
  return new CombinedRegexImpl(regExps, {sticky});
}

class CombinedRegexImpl implements CombinedRegex {
  lastMatch: string | null = null;
  lastIndex = 0;
  lastGroup = -1;
  regex: RegExp

  constructor(regexes: RegExp[],  { sticky = false } = {}) {
      this.regex = new RegExp(regexes[0].source,sticky ? "y" : "g")
  }

  exec(string: string): boolean {
      const match = this.regex.exec(string);
      if (match != null) {
          this.lastMatch = match[0]
          this.lastGroup = 0
          this.lastIndex = this.regex.lastIndex
          return true
      }
      return false;
  }
}
