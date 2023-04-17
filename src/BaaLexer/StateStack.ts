import {
  StateProcessor,
  StateProcessorDict,
  LexerTypings,
  StateName,
} from "../types";
import { ParseError } from "../errors";

export interface StateStack<T extends LexerTypings> {
  current: StateProcessor<T>;
  push(name: StateName<T>): void;
  next(name: StateName<T>): void;
  pop(): void;
}

export function createStateStack<T extends LexerTypings>(
  states: StateProcessorDict<T>
) {
  const stateStack: StateProcessor<T>[] = [states.main];
  let currentIndex = 0;
  const result: StateStack<T> = {
    current: states.main,
    push(name: StateName<T>) {
      this.current = states[name];
      stateStack[++currentIndex] = this.current;
    },
    pop() {
      if (currentIndex === 0)
        throw new ParseError("Cannot pop empty state stack");
      this.current = stateStack[--currentIndex];
    },
    next(name: StateName<T>) {
      this.current = states[name];
      stateStack[currentIndex] = this.current;
    },
  };
  return result;
}
