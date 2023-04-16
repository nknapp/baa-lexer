import { CompiledState, CompiledStateDict } from "../internal-types";
import { LexerTypings, StateName } from "../types";

export interface StateStack<T extends LexerTypings> {
  current: CompiledState<T>;
  push(name: StateName<T>): void;
  next(name: StateName<T>): void;
  pop(): void;
}

export function createStateStack<T extends LexerTypings>(
  states: CompiledStateDict<T>
) {
  const stateStack: CompiledState<T>[] = [states.main];
  let currentIndex = 0;
  const result: StateStack<T> = {
    current: states.main,
    push(name: StateName<T>) {
      this.current = states[name];
      stateStack[++currentIndex] = this.current;
    },
    pop() {
      this.current = stateStack[--currentIndex];
    },
    next(name: StateName<T>) {
      this.current = states[name];
      stateStack[currentIndex] = this.current;
    },
  };
  return result;
}
