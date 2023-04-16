import { Location } from "../types";

export class LocationTracker {
    current = { line: 1, column: 0 };

    advance(token: string, { multiline = false } = {}): Location {
        this.current = this.#nextLocation(token, multiline);
        return this.current;
    }

    #nextLocation(token: string, multiline: boolean) {
        if (!multiline) {
            return this.#singleLine(token);
        }
        const firstNewline = token.indexOf("\n");
        if (firstNewline < 0) {
            return this.#singleLine(token);
        }
        return this.#multiLine(token, firstNewline);
    }

    #multiLine(token: string, firstNewline: number) {
        let line = this.current.line;
        let lastNewline = firstNewline;
        let next: number = firstNewline;
        while (next >= 0) {
            line++;
            lastNewline = next;
            next = token.indexOf("\n", next + 1);
        }
        const column = token.length - lastNewline - 1;
        return { line, column };
    }

    #singleLine(token: string) {
        const { line, column } = this.current;
        return { line, column: column + token.length };
    }
}
