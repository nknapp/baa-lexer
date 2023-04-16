import { describe, bench } from "vitest";
import { TokenFactoryImpl } from "./TokenFactory";
import {createTokenFactory} from "./tokenFactoryFn";

const string = "abcdefg\n".repeat(1000);

const RULE = { type: "A", match: null };
describe("TokenFactory", () => {
  bench("class", () => {
    const tokenFactory = new TokenFactoryImpl();
    for (let i = 0; i < string.length; i += 5) {
      tokenFactory.createToken({
        rule: RULE,
        offset: i,
        text: string.slice(i, i + 5),
      });
    }
  });

  bench("fn", () => {
      const tokenFactory = createTokenFactory();
      for (let i = 0; i < string.length; i += 5) {
          tokenFactory.createToken({
              rule: RULE,
              offset: i,
              text: string.slice(i, i + 5),
          });
      }
  });
});
