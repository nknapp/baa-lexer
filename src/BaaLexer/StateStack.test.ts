import { describe, expect, it } from "vitest";
import { createStateStack } from "./StateStack";
import { DummyStateProcessor } from "../test-utils/DummyStateProcessor";

const compiledStateA = new DummyStateProcessor("A");
const compiledStateB = new DummyStateProcessor("B");
const compiledStateC = new DummyStateProcessor("C");

describe("StateStack", function () {
  it("initially contains the main state", () => {
    const stack = createStateStack({
      main: compiledStateA,
      b: compiledStateB,
    });
    expect(stack.current).toEqual(compiledStateA);
  });

  it("'push' changes the current state", () => {
    const stack = createStateStack({
      main: compiledStateA,
      b: compiledStateB,
    });
    stack.push("b");
    expect(stack.current).toEqual(compiledStateB);
  });

  it("'push' and 'pop' returns the first current state", () => {
    const stack = createStateStack({
      main: compiledStateA,
      b: compiledStateB,
    });
    stack.push("b");
    stack.pop();
    expect(stack.current).toEqual(compiledStateA);
  });

  it("'next' changes the current state", () => {
    const stack = createStateStack({
      main: compiledStateA,
      b: compiledStateB,
    });

    stack.next("b");
    expect(stack.current).toEqual(compiledStateB);
  });

  it("'push', 'next' and then 'pop' reverts to the stack before the push", () => {
    const stack = createStateStack({
      main: compiledStateA,
      b: compiledStateB,
      c: compiledStateC,
    });

    stack.push("b");
    stack.next("c");
    stack.pop();
    expect(stack.current).toEqual(compiledStateA);
  });

  it("'next' and then 'push' and 'pop' reverts to the stack before the push", () => {
    const stack = createStateStack({
      main: compiledStateA,
      b: compiledStateB,
      c: compiledStateC,
    });

    stack.next("c");
    stack.push("b");
    stack.pop();
    expect(stack.current).toEqual(compiledStateC);
  });
});
