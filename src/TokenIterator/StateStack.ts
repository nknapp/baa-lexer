import { CompiledState } from "../compiledState";
import { LexerTypings, StateName } from "../types";

export class StateStack<T extends LexerTypings> {
  readonly #states: Record<StateName<T>, CompiledState<T>>;
  readonly #stateStack: CompiledState<T>[];
  current: CompiledState<T>;

  constructor(states: Record<StateName<T>, CompiledState<T>>) {
    this.#states = states;
    this.#stateStack = [this.#states.main];
    this.current = this.#states.main;
  }

  push(name: StateName<T>) {
    this.current = this.#states[name];
    this.#stateStack.unshift(this.current);
  }

  pop() {
    this.#stateStack.shift();
    this.current = this.#stateStack[0];
  }

  next(name: StateName<T>) {
    this.current = this.#states[name];
    this.#stateStack[0] = this.current;
  }
}
