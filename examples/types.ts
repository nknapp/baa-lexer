import {baa} from "baa-lexer";

interface Typings {
    tokenType: "A" | "B",
    stateName: "main" | "other"
}

const lexer = baa<Typings>({
    main: {
        A: { match: "a", push: "other" }
    },
    other: {
        B: { match: "b", pop: 1 }
    }
})


for (const token of lexer.lex("abc")) {
    switch (token.type) {
      case "A":
    }
}
