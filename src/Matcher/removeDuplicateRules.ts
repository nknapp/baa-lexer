import type { BaaMatchRule, LexerTypings } from "../types";
import { toRegexCaptureGroup } from "./toRegexCaptureGroup";

/**
 * This will increase regex performance if rules are added to the config without thought
 * @param rules
 */
export function removeDuplicateRules<T extends LexerTypings>(
  rules: BaaMatchRule<T>[]
): BaaMatchRule<T>[] {
  const result: BaaMatchRule<T>[] = [];
  const existing = new Set<string>();
  for (const rule of rules) {
    const key = toRegexCaptureGroup(rule);
    if (!existing.has(key)) {
      existing.add(key);
      result.push(rule);
    }
  }
  return result;
}
