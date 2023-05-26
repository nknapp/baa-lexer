import type { BaaMatchRule, LexerTypings } from "../types";

export function toRegexCaptureGroup(rule: BaaMatchRule<LexerTypings>): string {
  const source =
    rule.match instanceof RegExp ? rule.match.source : regexEscape(rule.match);
  return `(${source})`;
}

const reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
function regexEscape(string: string) {
  return string.replace(reRegExpChar, "\\$&");
}
