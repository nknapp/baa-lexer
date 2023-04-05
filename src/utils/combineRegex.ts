interface CombinedRegex {
  lastMatch: string | null;
  lastIndex: number;
  lastGroup: number;

  exec(string: string): boolean;
}

export function combineRegex(regExps: RegExp[]): CombinedRegex {
  return new CombinedRegexImpl(regExps);
}

class CombinedRegexImpl implements CombinedRegex {
  lastMatch: string | null = null;
  lastIndex = 0;
  lastGroup = -1;
  regex: RegExp

  constructor(regexes: RegExp[]) {
      this.regex = new RegExp(regexes[0].source,"g")
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
