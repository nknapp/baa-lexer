import { LexerTypings } from "../types";
import { CompiledRule, Matcher } from "../internal-types";
import { createSingleCharMatcher, isSingleCharRule } from "./SingleCharMatcher";
import { RegexMatcher } from "./RegexMatcher";

export function createMatcher<T extends LexerTypings>(
  rules: CompiledRule<T>[],
  { sticky = false }
): Matcher<T> {
  const singleCharRules: CompiledRule<T>[] = [];
  const rest: CompiledRule<T>[] = [];
  if (!sticky) return new RegexMatcher(rules);

  for (const rule of rules) {
    if (isSingleCharRule(rule)) {
      singleCharRules.push(rule);
    } else {
      rest.push(rule);
    }
  }
  if (singleCharRules.length > 0) {
    const singleChar = createSingleCharMatcher(singleCharRules);
    const regex = new RegexMatcher(rest, { sticky });
    return {
      match(string: string, offset: number) {
        return singleChar.match(string, offset) ?? regex.match(string, offset);
      },
      expectedTypes() {
        return rules.map((rule) => rule.type);
      },
    };
  }
  return new RegexMatcher(rest, { sticky });
}
