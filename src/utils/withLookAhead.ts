export function withLookAhead(regex: RegExp, lookahead: RegExp): RegExp {
  return new RegExp("(?:" + regex.source + ")(?=" + lookahead.source + ")");
}
