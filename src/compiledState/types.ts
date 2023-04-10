import {LexerTypings} from "../types";
import {Match} from "../internal-types";

export interface Matcher<T extends LexerTypings> {
    match(string: string, offset: number): Match<T> | null
}