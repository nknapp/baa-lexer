export interface LexerTypings {
    stateName: string;
    tokenType: string;
}

export type StateName<T extends LexerTypings> = T["stateName"] | "main";
export type TokenType<T extends LexerTypings> = T["tokenType"];

export type StateDict<T extends LexerTypings> = Record<StateName<T>, CompiledState<T>> & { main: CompiledState<T>}

export interface Token<T extends LexerTypings> {
    type: TokenType<T>
    original: string,
    value: string
    start: Location
    end: Location
}

export interface Location {
    column: number;
    line: number;
}

export interface BaaContext<T extends LexerTypings> {
    string: string
    offset: number
    addToken(type: TokenType<T>, original: string, value: string, linebreaks?: boolean): void
    addTokenUpToEnd(type: TokenType<T>): void
    pushState(name: StateName<T>): void
    replaceState(name: StateName<T>): void
    popState(): void

}

export interface CompiledState<T extends LexerTypings> {
    process(context: BaaContext<T>): void
}
