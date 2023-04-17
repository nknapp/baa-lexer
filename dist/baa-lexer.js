function p(n, t) {
  return Object.fromEntries(
    Object.entries(n).map((e) => [
      e[0],
      t(e[1], e[0])
    ])
  );
}
function a(n, t) {
  if (t instanceof RegExp || typeof t == "string")
    return {
      type: n,
      pop: void 0,
      push: void 0,
      next: void 0,
      lineBreaks: !1,
      value: void 0,
      match: t
    };
  const e = t;
  return {
    type: n,
    pop: e.pop,
    push: e.push,
    next: e.next,
    lineBreaks: e.lineBreaks,
    value: e.value,
    match: e.match
  };
}
function x(n) {
  const t = [];
  let e = null, r = null;
  for (const [o, c] of g(n))
    Object.hasOwn(c, "fallback") ? e = a(o, c) : Object.hasOwn(c, "error") ? r = a(o, c) : t.push(a(o, c));
  return {
    error: r,
    match: t,
    fallback: e
  };
}
const g = Object.entries;
function m(n) {
  if (!_(n))
    throw new Error("All rules must be single chars");
  const t = [];
  for (const e of n)
    t[e.match.charCodeAt(0)] = e;
  return {
    match(e, r) {
      const o = t[e.charCodeAt(r)];
      return o == null ? null : {
        rule: o,
        offset: r,
        text: o.match
      };
    }
  };
}
function f(n) {
  return typeof n.match == "string" && n.match.length === 1;
}
function _(n) {
  return n.every((t) => f(t));
}
function l(n, t) {
  const e = n.map(d), r = new RegExp(e.join("|"), t ? "y" : "g");
  return {
    match(o, c) {
      r.lastIndex = c;
      const s = r.exec(o);
      if (s != null) {
        for (let u = 1; u <= n.length; u++)
          if (s[u] != null)
            return {
              rule: n[u - 1],
              offset: s.index,
              text: s[0]
            };
      }
      return null;
    }
  };
}
function d(n) {
  return `(${n.match instanceof RegExp ? n.match.source : w(n.match)})`;
}
const k = /[\\^$.*+?()[\]{}|]/g;
function w(n) {
  return n.replace(k, "\\$&");
}
function v(n, t = !1) {
  if (!t)
    return l(n, t);
  const e = [], r = [];
  for (const o of n)
    f(o) ? e.push(o) : r.push(o);
  if (e.length > 0) {
    const o = m(e), c = l(r, t);
    return {
      match(s, u) {
        return o.match(s, u) ?? c.match(s, u);
      }
    };
  }
  return l(r, t);
}
class h extends Error {
  constructor(t) {
    super(t);
  }
}
class y extends h {
  constructor(t, e) {
    const r = t.map((o) => `\`${o}\``).join(", ");
    super(`Expected one of ${r} but got '${e}'`), this.expected = t, this.found = e;
  }
}
function L(n, t, e, r) {
  let o = null;
  return {
    nextMatch(c, s) {
      if (o != null) {
        const i = o;
        return o = null, i;
      }
      const u = t.match(c, s);
      if (u == null) {
        const i = e ?? r;
        if (i == null)
          throw new y(n, c[s]);
        return {
          rule: i,
          offset: s,
          text: c.slice(s)
        };
      }
      return u.offset > s && e ? (o = u, {
        rule: e,
        offset: s,
        text: c.slice(s, u.offset)
      }) : u;
    }
  };
}
function R(n) {
  const { error: t, match: e, fallback: r } = x(n), o = v(e, r == null), c = Object.keys(n);
  return L(c, o, r, t);
}
function E(n) {
  const t = [n.main];
  let e = 0;
  return {
    current: n.main,
    push(o) {
      this.current = n[o], t[++e] = this.current;
    },
    pop() {
      if (e === 0)
        throw new h("Cannot pop empty state stack");
      this.current = t[--e];
    },
    next(o) {
      this.current = n[o], t[e] = this.current;
    }
  };
}
const C = {
  done: !0,
  value: void 0
};
class b {
  constructor(t, e, r) {
    this._string = e, this._offset = 0, this._states = E(t), this._tokenFactory = r;
  }
  [Symbol.iterator]() {
    return this;
  }
  next() {
    const t = this.nextToken();
    return t == null ? C : { done: !1, value: t };
  }
  nextToken() {
    if (this._offset >= this._string.length)
      return null;
    const t = this._tokenFactory.currentLocation;
    try {
      const e = this._states.current.nextMatch(this._string, this._offset);
      this._offset += e.text.length;
      const r = this._tokenFactory.createToken(e);
      return e.rule.push && this._states.push(e.rule.push), e.rule.pop && this._states.pop(), e.rule.next && this._states.next(e.rule.next), r;
    } catch (e) {
      throw e instanceof h && (e.message = O(e.message, t)), e;
    }
  }
}
function O(n, t) {
  const { line: e, column: r } = t, o = n[0].toLowerCase() + n.slice(1);
  return `Syntax error at ${e}:${r}, ${o}`;
}
class S {
  constructor(t, e) {
    this._createTokenFactory = e, this._states = t;
  }
  lex(t) {
    return new b(this._states, t, this._createTokenFactory());
  }
}
function T(n, t) {
  return new S(n, t);
}
class M {
  constructor() {
    this.current = { line: 1, column: 0 };
  }
  advance(t, { multiline: e = !1 } = {}) {
    return this.current = this._nextLocation(t, e), this.current;
  }
  _nextLocation(t, e) {
    if (!e)
      return this._singleLine(t);
    const r = t.indexOf(`
`);
    return r < 0 ? this._singleLine(t) : this._multiLine(t, r);
  }
  _multiLine(t, e) {
    let r = this.current.line, o = e, c = e;
    for (; c >= 0; )
      r++, o = c, c = t.indexOf(`
`, c + 1);
    const s = t.length - o - 1;
    return { line: r, column: s };
  }
  _singleLine(t) {
    const { line: e, column: r } = this.current;
    return { line: e, column: r + t.length };
  }
}
class $ {
  constructor() {
    this._location = new M(), this.currentLocation = this._location.current;
  }
  createToken(t) {
    const e = this._location.current, r = this.currentLocation = this._location.advance(t.text, {
      multiline: t.rule.lineBreaks
    });
    return {
      type: t.rule.type,
      original: t.text,
      value: t.rule.value ? t.rule.value(t.text) : t.text,
      start: e,
      end: r
    };
  }
}
function j() {
  return new $();
}
function B(n, t) {
  return new RegExp(n.source + "(?=" + t.source + ")");
}
function F(n) {
  const t = p(
    n,
    (e) => R(e)
  );
  return T(t, () => j());
}
export {
  h as ParseError,
  y as UnexpectedToken,
  F as baa,
  T as createLexer,
  v as createMatcher,
  L as createStateProcessor,
  j as createTokenFactory,
  B as withLookAhead
};
