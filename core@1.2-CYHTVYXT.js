import {
  __export,
  __name
} from "./chunk-JKJYCBCI.js";

// deno:https://esm.sh/@noble/hashes@^1.1.5/sha3?target=es2022
var sha3_target_es2022_exports = {};
__export(sha3_target_es2022_exports, {
  Keccak: () => x2,
  keccakP: () => W2,
  keccak_224: () => ot,
  keccak_256: () => rt,
  keccak_384: () => it,
  keccak_512: () => ct,
  sha3_224: () => tt,
  sha3_256: () => st,
  sha3_384: () => nt,
  sha3_512: () => et,
  shake128: () => ht,
  shake256: () => at
});

// deno:https://esm.sh/@noble/hashes@1.8.0/es2022/crypto.mjs
var o = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;

// deno:https://esm.sh/@noble/hashes@1.8.0/es2022/utils.mjs
function m(t) {
  return t instanceof Uint8Array || ArrayBuffer.isView(t) && t.constructor.name === "Uint8Array";
}
__name(m, "m");
function x(t) {
  if (!Number.isSafeInteger(t) || t < 0) throw new Error("positive integer expected, got " + t);
}
__name(x, "x");
function u(t, ...e) {
  if (!m(t)) throw new Error("Uint8Array expected");
  if (e.length > 0 && !e.includes(t.length)) throw new Error("Uint8Array expected of length " + e + ", got length=" + t.length);
}
__name(u, "u");
function S(t, e = true) {
  if (t.destroyed) throw new Error("Hash instance has been destroyed");
  if (e && t.finished) throw new Error("Hash#digest() has already been called");
}
__name(S, "S");
function I(t, e) {
  u(t);
  let n2 = e.outputLen;
  if (t.length < n2) throw new Error("digestInto() expects output buffer of length at least " + n2);
}
__name(I, "I");
function _(t) {
  return new Uint32Array(t.buffer, t.byteOffset, Math.floor(t.byteLength / 4));
}
__name(_, "_");
function j(...t) {
  for (let e = 0; e < t.length; e++) t[e].fill(0);
}
__name(j, "j");
var w = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function d(t) {
  return t << 24 & 4278190080 | t << 8 & 16711680 | t >>> 8 & 65280 | t >>> 24 & 255;
}
__name(d, "d");
function L(t) {
  for (let e = 0; e < t.length; e++) t[e] = d(t[e]);
  return t;
}
__name(L, "L");
var W = w ? (t) => t : L;
var g = typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function";
var E = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function h(t) {
  if (typeof t != "string") throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(t));
}
__name(h, "h");
function p(t) {
  return typeof t == "string" && (t = h(t)), u(t), t;
}
__name(p, "p");
var y = class {
  static {
    __name(this, "y");
  }
};
function B(t) {
  let e = /* @__PURE__ */ __name((r31) => t().update(p(r31)).digest(), "e"), n2 = t();
  return e.outputLen = n2.outputLen, e.blockLen = n2.blockLen, e.create = () => t(), e;
}
__name(B, "B");
function O(t) {
  let e = /* @__PURE__ */ __name((r31, o3) => t(o3).update(p(r31)).digest(), "e"), n2 = t({});
  return e.outputLen = n2.outputLen, e.blockLen = n2.blockLen, e.create = (r31) => t(r31), e;
}
__name(O, "O");

// deno:https://esm.sh/@noble/hashes@1.8.0/es2022/sha3.mjs
var d2 = BigInt(4294967295);
var k = BigInt(32);
function M(n2, t = false) {
  return t ? { h: Number(n2 & d2), l: Number(n2 >> k & d2) } : { h: Number(n2 >> k & d2) | 0, l: Number(n2 & d2) | 0 };
}
__name(M, "M");
function _2(n2, t = false) {
  let s2 = n2.length, o3 = new Uint32Array(s2), r31 = new Uint32Array(s2);
  for (let i2 = 0; i2 < s2; i2++) {
    let { h: e, l: c3 } = M(n2[i2], t);
    [o3[i2], r31[i2]] = [e, c3];
  }
  return [o3, r31];
}
__name(_2, "_");
var I2 = /* @__PURE__ */ __name((n2, t, s2) => n2 << s2 | t >>> 32 - s2, "I");
var B2 = /* @__PURE__ */ __name((n2, t, s2) => t << s2 | n2 >>> 32 - s2, "B");
var L2 = /* @__PURE__ */ __name((n2, t, s2) => t << s2 - 32 | n2 >>> 64 - s2, "L");
var g2 = /* @__PURE__ */ __name((n2, t, s2) => n2 << s2 - 32 | t >>> 64 - s2, "g");
var C = BigInt(0);
var l = BigInt(1);
var D = BigInt(2);
var G = BigInt(7);
var J = BigInt(256);
var K = BigInt(113);
var m2 = [];
var T = [];
var F = [];
for (let n2 = 0, t = l, s2 = 1, o3 = 0; n2 < 24; n2++) {
  [s2, o3] = [o3, (2 * s2 + 3 * o3) % 5], m2.push(2 * (5 * o3 + s2)), T.push((n2 + 1) * (n2 + 2) / 2 % 64);
  let r31 = C;
  for (let i2 = 0; i2 < 7; i2++) t = (t << l ^ (t >> G) * K) % J, t & D && (r31 ^= l << (l << BigInt(i2)) - l);
  F.push(r31);
}
var U = _2(F, true);
var Q = U[0];
var V = U[1];
var A = /* @__PURE__ */ __name((n2, t, s2) => s2 > 32 ? L2(n2, t, s2) : I2(n2, t, s2), "A");
var b = /* @__PURE__ */ __name((n2, t, s2) => s2 > 32 ? g2(n2, t, s2) : B2(n2, t, s2), "b");
function W2(n2, t = 24) {
  let s2 = new Uint32Array(10);
  for (let o3 = 24 - t; o3 < 24; o3++) {
    for (let e = 0; e < 10; e++) s2[e] = n2[e] ^ n2[e + 10] ^ n2[e + 20] ^ n2[e + 30] ^ n2[e + 40];
    for (let e = 0; e < 10; e += 2) {
      let c3 = (e + 8) % 10, f4 = (e + 2) % 10, u6 = s2[f4], a = s2[f4 + 1], E6 = A(u6, a, 1) ^ s2[c3], N6 = b(u6, a, 1) ^ s2[c3 + 1];
      for (let p4 = 0; p4 < 50; p4 += 10) n2[e + p4] ^= E6, n2[e + p4 + 1] ^= N6;
    }
    let r31 = n2[2], i2 = n2[3];
    for (let e = 0; e < 24; e++) {
      let c3 = T[e], f4 = A(r31, i2, c3), u6 = b(r31, i2, c3), a = m2[e];
      r31 = n2[a], i2 = n2[a + 1], n2[a] = f4, n2[a + 1] = u6;
    }
    for (let e = 0; e < 50; e += 10) {
      for (let c3 = 0; c3 < 10; c3++) s2[c3] = n2[e + c3];
      for (let c3 = 0; c3 < 10; c3++) n2[e + c3] ^= ~s2[(c3 + 2) % 10] & s2[(c3 + 4) % 10];
    }
    n2[0] ^= Q[o3], n2[1] ^= V[o3];
  }
  j(s2);
}
__name(W2, "W");
var x2 = class n extends y {
  static {
    __name(this, "n");
  }
  constructor(t, s2, o3, r31 = false, i2 = 24) {
    if (super(), this.pos = 0, this.posOut = 0, this.finished = false, this.destroyed = false, this.enableXOF = false, this.blockLen = t, this.suffix = s2, this.outputLen = o3, this.enableXOF = r31, this.rounds = i2, x(o3), !(0 < t && t < 200)) throw new Error("only keccak-f1600 function is supported");
    this.state = new Uint8Array(200), this.state32 = _(this.state);
  }
  clone() {
    return this._cloneInto();
  }
  keccak() {
    W(this.state32), W2(this.state32, this.rounds), W(this.state32), this.posOut = 0, this.pos = 0;
  }
  update(t) {
    S(this), t = p(t), u(t);
    let { blockLen: s2, state: o3 } = this, r31 = t.length;
    for (let i2 = 0; i2 < r31; ) {
      let e = Math.min(s2 - this.pos, r31 - i2);
      for (let c3 = 0; c3 < e; c3++) o3[this.pos++] ^= t[i2++];
      this.pos === s2 && this.keccak();
    }
    return this;
  }
  finish() {
    if (this.finished) return;
    this.finished = true;
    let { state: t, suffix: s2, pos: o3, blockLen: r31 } = this;
    t[o3] ^= s2, (s2 & 128) !== 0 && o3 === r31 - 1 && this.keccak(), t[r31 - 1] ^= 128, this.keccak();
  }
  writeInto(t) {
    S(this, false), u(t), this.finish();
    let s2 = this.state, { blockLen: o3 } = this;
    for (let r31 = 0, i2 = t.length; r31 < i2; ) {
      this.posOut >= o3 && this.keccak();
      let e = Math.min(o3 - this.posOut, i2 - r31);
      t.set(s2.subarray(this.posOut, this.posOut + e), r31), this.posOut += e, r31 += e;
    }
    return t;
  }
  xofInto(t) {
    if (!this.enableXOF) throw new Error("XOF is not possible for this instance");
    return this.writeInto(t);
  }
  xof(t) {
    return x(t), this.xofInto(new Uint8Array(t));
  }
  digestInto(t) {
    if (I(t, this), this.finished) throw new Error("digest() was already called");
    return this.writeInto(t), this.destroy(), t;
  }
  digest() {
    return this.digestInto(new Uint8Array(this.outputLen));
  }
  destroy() {
    this.destroyed = true, j(this.state);
  }
  _cloneInto(t) {
    let { blockLen: s2, suffix: o3, outputLen: r31, rounds: i2, enableXOF: e } = this;
    return t || (t = new n(s2, o3, r31, e, i2)), t.state32.set(this.state32), t.pos = this.pos, t.posOut = this.posOut, t.finished = this.finished, t.rounds = i2, t.suffix = o3, t.outputLen = r31, t.enableXOF = e, t.destroyed = this.destroyed, t;
  }
};
var h2 = /* @__PURE__ */ __name((n2, t, s2) => B(() => new x2(t, n2, s2)), "h");
var tt = h2(6, 144, 224 / 8);
var st = h2(6, 136, 256 / 8);
var nt = h2(6, 104, 384 / 8);
var et = h2(6, 72, 512 / 8);
var ot = h2(1, 144, 224 / 8);
var rt = h2(1, 136, 256 / 8);
var it = h2(1, 104, 384 / 8);
var ct = h2(1, 72, 512 / 8);
var X = /* @__PURE__ */ __name((n2, t, s2) => O((o3 = {}) => new x2(t, n2, o3.dkLen === void 0 ? s2 : o3.dkLen, true)), "X");
var ht = X(31, 168, 128 / 8);
var at = X(31, 136, 256 / 8);

// deno:https://esm.sh/@orama/cuid2@2.2.3/es2022/cuid2.mjs
var require2 = /* @__PURE__ */ __name((n2) => {
  const e = /* @__PURE__ */ __name((m7) => typeof m7.default < "u" ? m7.default : m7, "e"), c3 = /* @__PURE__ */ __name((m7) => Object.assign({ __esModule: true }, m7), "c");
  switch (n2) {
    case "@noble/hashes/sha3":
      return e(sha3_target_es2022_exports);
    default:
      console.error('module "' + n2 + '" not found');
      return null;
  }
}, "require");
var L3 = Object.create;
var g3 = Object.defineProperty;
var j2 = Object.getOwnPropertyDescriptor;
var $ = Object.getOwnPropertyNames;
var q = Object.getPrototypeOf;
var v = Object.prototype.hasOwnProperty;
var z = ((t) => typeof require2 < "u" ? require2 : typeof Proxy < "u" ? new Proxy(t, { get: /* @__PURE__ */ __name((e, n2) => (typeof require2 < "u" ? require2 : e)[n2], "get") }) : t)(function(t) {
  if (typeof require2 < "u") return require2.apply(this, arguments);
  throw Error('Dynamic require of "' + t + '" is not supported');
});
var l2 = /* @__PURE__ */ __name((t, e) => () => (e || t((e = { exports: {} }).exports, e), e.exports), "l");
var F2 = /* @__PURE__ */ __name((t, e, n2, o3) => {
  if (e && typeof e == "object" || typeof e == "function") for (let r31 of $(e)) !v.call(t, r31) && r31 !== n2 && g3(t, r31, { get: /* @__PURE__ */ __name(() => e[r31], "get"), enumerable: !(o3 = j2(e, r31)) || o3.enumerable });
  return t;
}, "F");
var T2 = /* @__PURE__ */ __name((t, e, n2) => (n2 = t != null ? L3(q(t)) : {}, F2(e || !t || !t.__esModule ? g3(n2, "default", { value: t, enumerable: true }) : n2, t)), "T");
var I3 = l2((N6, s2) => {
  var { sha3_512: k6 } = z("@noble/hashes/sha3"), p4 = 24, i2 = 32, u6 = /* @__PURE__ */ __name((t = 4, e = Math.random) => {
    let n2 = "";
    for (; n2.length < t; ) n2 = n2 + Math.floor(e() * 36).toString(36);
    return n2;
  }, "u");
  function h7(t) {
    let e = BigInt(8), n2 = BigInt(0);
    for (let o3 of t.values()) {
      let r31 = BigInt(o3);
      n2 = (n2 << e) + r31;
    }
    return n2;
  }
  __name(h7, "h");
  var d7 = /* @__PURE__ */ __name((t = "") => h7(k6(t)).toString(36).slice(1), "d"), f4 = Array.from({ length: 26 }, (t, e) => String.fromCharCode(e + 97)), A7 = /* @__PURE__ */ __name((t) => f4[Math.floor(t() * f4.length)], "A"), x8 = /* @__PURE__ */ __name(({ globalObj: t = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : {}, random: e = Math.random } = {}) => {
    let n2 = Object.keys(t).toString(), o3 = n2.length ? n2 + u6(i2, e) : u6(i2, e);
    return d7(o3).substring(0, i2);
  }, "x"), C7 = /* @__PURE__ */ __name((t) => () => t++, "C"), D6 = 476782367, b6 = /* @__PURE__ */ __name(({ random: t = Math.random, counter: e = C7(Math.floor(t() * D6)), length: n2 = p4, fingerprint: o3 = x8({ random: t }) } = {}) => function() {
    let m7 = A7(t), M7 = Date.now().toString(36), S8 = e().toString(36), w8 = u6(n2, t), B8 = `${M7 + w8 + S8 + o3}`;
    return `${m7 + d7(B8).substring(1, n2)}`;
  }, "b"), E6 = b6(), O7 = /* @__PURE__ */ __name((t, { minLength: e = 2, maxLength: n2 = i2 } = {}) => {
    let o3 = t.length, r31 = /^[a-z][0-9a-z]+$/;
    try {
      if (typeof t == "string" && o3 >= e && o3 <= n2 && r31.test(t)) return true;
    } finally {
    }
    return false;
  }, "O");
  s2.exports.getConstants = () => ({ defaultLength: p4, bigLength: i2 });
  s2.exports.init = b6;
  s2.exports.createId = E6;
  s2.exports.bufToBigInt = h7;
  s2.exports.createCounter = C7;
  s2.exports.createFingerprint = x8;
  s2.exports.isCuid = O7;
});
var y2 = l2((P6, a) => {
  var { createId: _8, init: G7, getConstants: H6, isCuid: J7 } = I3();
  a.exports.createId = _8;
  a.exports.init = G7;
  a.exports.getConstants = H6;
  a.exports.isCuid = J7;
});
var c = T2(y2());
var { createId: Q2, init: R, getConstants: U2, isCuid: V2 } = c;
var W3 = c.default ?? c;

// deno:https://esm.sh/@orama/oramacore-events-parser@0.0.5/es2022/oramacore-events-parser.mjs
var w2 = ["initializing", "handle_gpu_overload", "get_llm_config", "determine_query_strategy", "simple_rag", "advanced_autoquery", "handle_system_prompt", "optimize_query", "execute_search", "execute_before_answer_hook", "generate_answer", "generate_related_queries", "completed", "error", "advanced_autoquery_initializing", "advanced_autoquery_analyzing_input", "advanced_autoquery_query_optimized", "advanced_autoquery_select_properties", "advanced_autoquery_properties_selected", "advanced_autoquery_combine_queries", "advanced_autoquery_queries_combined", "advanced_autoquery_generate_tracked_queries", "advanced_autoquery_tracked_queries_generated", "advanced_autoquery_execute_before_retrieval_hook", "advanced_autoquery_hooks_executed", "advanced_autoquery_execute_searches", "advanced_autoquery_search_results", "advanced_autoquery_completed"];
var l3 = class extends TransformStream {
  static {
    __name(this, "l");
  }
  constructor() {
    let e = new TextDecoder("utf-8", { ignoreBOM: false }), r31 = "";
    super({ start() {
      r31 = "";
    }, transform(o3, n2) {
      let i2 = e.decode(o3);
      r31 += i2;
      let a = r31.indexOf(`

`);
      for (; a === -1 && r31.indexOf(`\r
\r
`) !== -1; ) a = r31.indexOf(`\r
\r
`);
      for (; a !== -1; ) {
        let h7 = 2;
        r31.slice(a, a + 4) === `\r
\r
` && (h7 = 4);
        let f4 = r31.slice(0, a);
        r31 = r31.slice(a + h7);
        let m7 = f4.split(/\r?\n/).filter((p4) => p4.startsWith("data:"));
        for (let p4 of m7) {
          let u6 = p4.replace(/^data:\s*/, "");
          try {
            if (u6.startsWith('"') && u6.endsWith('"')) {
              let d7 = JSON.parse(u6);
              n2.enqueue({ type: d7 });
              continue;
            }
            let s2 = JSON.parse(u6);
            if (typeof s2 == "object" && s2 !== null && !("type" in s2)) {
              let d7 = Object.keys(s2);
              if (d7.length === 1) {
                let [y7] = d7, c3 = s2[y7];
                typeof c3 == "object" && c3 !== null ? s2 = { type: y7, ...c3 } : s2 = { type: y7, data: c3 };
              }
            }
            n2.enqueue(s2);
          } catch {
            n2.enqueue({ type: "error", error: "Invalid JSON in SSE data", state: "parse_error" });
          }
        }
        a = r31.indexOf(`

`), a === -1 && r31.indexOf(`\r
\r
`) !== -1 && (a = r31.indexOf(`\r
\r
`));
      }
    } });
  }
};
var _3 = class {
  static {
    __name(this, "_");
  }
  constructor() {
    Object.defineProperty(this, "handlers", { enumerable: true, configurable: true, writable: true, value: {} }), Object.defineProperty(this, "endHandlers", { enumerable: true, configurable: true, writable: true, value: [] }), Object.defineProperty(this, "done", { enumerable: true, configurable: true, writable: true, value: void 0 }), Object.defineProperty(this, "resolveDone", { enumerable: true, configurable: true, writable: true, value: /* @__PURE__ */ __name(() => {
    }, "value") }), this.done = new Promise((e) => {
      this.resolveDone = e;
    });
  }
  on(e, r31) {
    return this.handlers[e] || (this.handlers[e] = []), this.handlers[e].push(r31), this;
  }
  onStateChange(e) {
    return this.on("state_changed", e);
  }
  onProgress(e) {
    return this.on("progress", e);
  }
  onEnd(e) {
    return this.endHandlers.push(e), this;
  }
  emit(e) {
    let r31 = this.handlers[e.type];
    if (r31) for (let n2 of r31) n2(e);
    (e.type === "state_changed" && "state" in e && (e.state === "completed" || e.state === "advanced_autoquery_completed") || e.type === "error" && "is_terminal" in e && e.is_terminal === true) && this._triggerEnd();
  }
  _triggerEnd() {
    for (let e of this.endHandlers) e();
  }
  _markDone() {
    this.resolveDone();
  }
};
function g4(t) {
  return t.type === "acknowledged" || t.type === "selected_llm" || t.type === "optimizing_query" || t.type === "answer_token" || t.type === "related_queries" || t.type === "result_action" || t.type === "state_changed" || t.type === "error" || t.type === "progress" || t.type === "search_results";
}
__name(g4, "g");
function q2(t) {
  return t.type === "state_changed" || t.type === "error" || t.type === "progress" || t.type === "search_results";
}
__name(q2, "q");
function x3(t) {
  let e = new _3(), r31 = new l3();
  return (async () => {
    let o3 = t.pipeThrough(r31).getReader();
    for (; ; ) {
      let { value: n2, done: i2 } = await o3.read();
      if (i2) break;
      g4(n2) && e.emit(n2);
    }
    await new Promise((n2) => setTimeout(n2, 0)), e._markDone();
  })(), e;
}
__name(x3, "x");
function S2(t) {
  let e = new _3(), r31 = new l3();
  return (async () => {
    let o3 = t.pipeThrough(r31).getReader();
    for (; ; ) {
      let { value: n2, done: i2 } = await o3.read();
      if (i2) break;
      q2(n2) && e.emit(n2);
    }
    await new Promise((n2) => setTimeout(n2, 0)), e._markDone();
  })(), e;
}
__name(S2, "S");

// deno:https://esm.sh/node/process.mjs
var v2 = /* @__PURE__ */ __name(function() {
}, "v");
function u2(e, t = {}) {
  v2.prototype.name = e;
  let r31 = {};
  return new Proxy(v2, { get(n2, a) {
    return a === "caller" ? null : a === "__createMock__" ? u2 : a === "__unenv__" ? true : a in t ? t[a] : r31[a] = r31[a] || u2(`${e}.${a.toString()}`);
  }, apply(n2, a, o3) {
    return u2(`${e}()`);
  }, construct(n2, a, o3) {
    return u2(`[${e}]`);
  }, enumerate() {
    return [];
  } });
}
__name(u2, "u");
var d3 = u2("mock");
function m3(e) {
  return new Error(`[unenv] ${e} is not implemented yet!`);
}
__name(m3, "m");
function s(e) {
  return Object.assign(() => {
    throw m3(e);
  }, { __unenv__: true });
}
__name(s, "s");
var b2 = Object.freeze(Object.create(null, { __unenv__: { get: /* @__PURE__ */ __name(() => true, "get") } }));
var p2 = /* @__PURE__ */ Object.create(null);
var h3 = globalThis.process?.env;
var l4 = /* @__PURE__ */ __name((e) => h3 || globalThis.__env__ || (e ? p2 : globalThis), "l");
var x4 = new Proxy(p2, { get(e, t) {
  return l4()[t] ?? p2[t];
}, has(e, t) {
  let r31 = l4();
  return t in r31 || t in p2;
}, set(e, t, r31) {
  let n2 = l4(true);
  return n2[t] = r31, true;
}, deleteProperty(e, t) {
  let r31 = l4(true);
  return delete r31[t], true;
}, ownKeys() {
  let e = l4();
  return Object.keys(e);
} });
var k2 = Object.assign(function(e) {
  let t = Date.now(), r31 = Math.trunc(t / 1e3), n2 = t % 1e3 * 1e6;
  if (e) {
    let a = r31 - e[0], o3 = n2 - e[0];
    return o3 < 0 && (a = a - 1, o3 = 1e9 + o3), [a, o3];
  }
  return [r31, n2];
}, { bigint: /* @__PURE__ */ __name(function() {
  return BigInt(Date.now() * 1e6);
}, "bigint") });
var E2 = globalThis.queueMicrotask ? (e, ...t) => {
  globalThis.queueMicrotask(e.bind(void 0, ...t));
} : M2();
function M2() {
  let e = [], t = false, r31, n2 = -1;
  function a() {
    !t || !r31 || (t = false, r31.length > 0 ? e = [...r31, ...e] : n2 = -1, e.length > 0 && o3());
  }
  __name(a, "a");
  function o3() {
    if (t) return;
    let g8 = setTimeout(a);
    t = true;
    let c3 = e.length;
    for (; c3; ) {
      for (r31 = e, e = []; ++n2 < c3; ) r31 && r31[n2]();
      n2 = -1, c3 = e.length;
    }
    r31 = void 0, t = false, clearTimeout(g8);
  }
  __name(o3, "o");
  return (g8, ...c3) => {
    e.push(g8.bind(void 0, ...c3)), e.length === 1 && !t && setTimeout(o3);
  };
}
__name(M2, "M");
var w3 = "unenv";
var L4 = [];
var y3 = "";
var C2 = { ares: "", http_parser: "", icu: "", modules: "", node: "", openssl: "", uv: "", v8: "", zlib: "" };
function i() {
  return _4;
}
__name(i, "i");
var P = i;
var U3 = i;
var O2 = i;
var A2 = i;
var j3 = i;
var N = i;
var T3 = /* @__PURE__ */ __name(function(e) {
  return e === "message" || e === "multipleResolves" ? _4 : false;
}, "T");
var R2 = i;
var I4 = i;
var S3 = /* @__PURE__ */ __name(function(e) {
  return [];
}, "S");
var B3 = /* @__PURE__ */ __name(() => 0, "B");
var D2 = /* @__PURE__ */ __name(function(e) {
  throw new Error("[unenv] process.binding is not supported");
}, "D");
var f = "/";
var F3 = /* @__PURE__ */ __name(function() {
  return f;
}, "F");
var $2 = /* @__PURE__ */ __name(function(e) {
  f = e;
}, "$");
var q3 = /* @__PURE__ */ __name(function() {
  return 0;
}, "q");
var z2 = /* @__PURE__ */ __name(function() {
  return 1e3;
}, "z");
var H = /* @__PURE__ */ __name(function() {
  return 1e3;
}, "H");
var W4 = /* @__PURE__ */ __name(function() {
  return 1e3;
}, "W");
var K2 = /* @__PURE__ */ __name(function() {
  return 1e3;
}, "K");
var G2 = /* @__PURE__ */ __name(function() {
  return [];
}, "G");
var J2 = /* @__PURE__ */ __name((e) => {
}, "J");
var Q3 = s("process.abort");
var V3 = /* @__PURE__ */ new Set();
var X2 = "";
var Y = "";
var Z = b2;
var ee = false;
var se = /* @__PURE__ */ __name(() => 0, "se");
var te = /* @__PURE__ */ __name(() => 0, "te");
var re = s("process.cpuUsage");
var ae = 0;
var ne = s("process.dlopen");
var ie = i;
var oe = i;
var ce = s("process.eventNames");
var ue = [];
var le = "";
var de = s("process.exit");
var pe = /* @__PURE__ */ Object.create({ inspector: void 0, debug: void 0, uv: void 0, ipv6: void 0, tls_alpn: void 0, tls_sni: void 0, tls_ocsp: void 0, tls: void 0, cached_builtins: void 0 });
var ge = /* @__PURE__ */ __name(() => [], "ge");
var _e = s("process.getMaxListeners");
var ve = s("process.kill");
var fe = Object.assign(() => ({ arrayBuffers: 0, rss: 0, external: 0, heapTotal: 0, heapUsed: 0 }), { rss: /* @__PURE__ */ __name(() => 0, "rss") });
var me = 1e3;
var be = "";
var he = 1e3;
var xe = s("process.rawListeners");
var ke = /* @__PURE__ */ Object.create({ name: "", lts: "", sourceUrl: void 0, headersUrl: void 0 });
var Ee = /* @__PURE__ */ Object.create({ compact: void 0, directory: void 0, filename: void 0, getReport: s("process.report.getReport"), reportOnFatalError: void 0, reportOnSignal: void 0, reportOnUncaughtException: void 0, signal: void 0, writeReport: s("process.report.writeReport") });
var Me = s("process.resourceUsage");
var we = s("process.setegid");
var Le = s("process.seteuid");
var ye = s("process.setgid");
var Ce = s("process.setgroups");
var Pe = s("process.setuid");
var Ue = s("process.setMaxListeners");
var Oe = s("process.setSourceMapsEnabled");
var Ae = d3.__createMock__("process.stdout");
var je = d3.__createMock__("process.stderr");
var Ne = d3.__createMock__("process.stdin");
var Te = false;
var Re = /* @__PURE__ */ __name(() => 0, "Re");
var Ie = 0;
var Se = s("process.setUncaughtExceptionCaptureCallback");
var Be = /* @__PURE__ */ __name(() => false, "Be");
var De = false;
var Fe = s("process.loadEnvFile");
var $e = void 0;
var qe = { has: /* @__PURE__ */ __name(() => false, "has") };
var ze = { ref() {
}, unref() {
} };
var He = false;
var We = { register() {
}, unregister() {
}, registerBeforeExit() {
} };
var Ke = s("process.assert");
var Ge = s("process.openStdin");
var Je = s("process._debugEnd");
var Qe = s("process._debugProcess");
var Ve = s("process._fatalException");
var Xe = s("process._getActiveHandles");
var Ye = s("process._getActiveRequests");
var Ze = s("process._kill");
var es = [];
var ss = s("process._rawDebug");
var ts = s("process._startProfilerIdleNotifier");
var rs = s("process.__stopProfilerIdleNotifier");
var as = s("process._tickCallback");
var hs = s("process._linkedBinding");
var ns = void 0;
var is = s("process.initgroups");
var os = [];
var cs = i;
var us = false;
var ls = [];
var ds = 0;
var ps = 0;
var _4 = { _events: ls, _eventsCount: ds, _exiting: us, _maxListeners: ps, _debugEnd: Je, _debugProcess: Qe, _fatalException: Ve, _getActiveHandles: Xe, _getActiveRequests: Ye, _kill: Ze, _preload_modules: es, _rawDebug: ss, _startProfilerIdleNotifier: ts, _stopProfilerIdleNotifier: rs, _tickCallback: as, domain: ns, initgroups: is, moduleLoadList: os, reallyExit: cs, exitCode: Ie, abort: Q3, addListener: U3, allowedNodeEnvironmentFlags: V3, hasUncaughtExceptionCaptureCallback: Be, setUncaughtExceptionCaptureCallback: Se, loadEnvFile: Fe, sourceMapsEnabled: De, throwDeprecation: He, mainModule: $e, permission: qe, channel: ze, arch: X2, argv: L4, argv0: Y, assert: Ke, binding: D2, chdir: $2, config: Z, connected: ee, constrainedMemory: se, availableMemory: te, cpuUsage: re, cwd: F3, debugPort: ae, dlopen: ne, disconnect: ie, emit: T3, emitWarning: oe, env: x4, eventNames: ce, execArgv: ue, execPath: le, exit: de, finalization: We, features: pe, getBuiltinModule: J2, getegid: z2, geteuid: H, getgid: W4, getgroups: G2, getuid: K2, getActiveResourcesInfo: ge, getMaxListeners: _e, hrtime: k2, kill: ve, listeners: S3, listenerCount: B3, memoryUsage: fe, nextTick: E2, on: P, off: A2, once: O2, openStdin: Ge, pid: me, platform: be, ppid: he, prependListener: R2, prependOnceListener: I4, rawListeners: xe, release: ke, removeAllListeners: N, removeListener: j3, report: Ee, resourceUsage: Me, setegid: we, seteuid: Le, setgid: ye, setgroups: Ce, setuid: Pe, setMaxListeners: Ue, setSourceMapsEnabled: Oe, stderr: je, stdin: Ne, stdout: Ae, title: w3, traceDeprecation: Te, umask: q3, uptime: Re, version: y3, versions: C2 };
var xs = _4;

// deno:https://esm.sh/zod@3.25.76/es2022/zod.mjs
var $e2 = Object.defineProperty;
var Me2 = /* @__PURE__ */ __name((r31, e) => {
  for (var t in e) $e2(r31, t, { get: e[t], enumerable: true });
}, "Me");
var be2 = {};
Me2(be2, { BRAND: /* @__PURE__ */ __name(() => ct2, "BRAND"), DIRTY: /* @__PURE__ */ __name(() => D3, "DIRTY"), EMPTY_PATH: /* @__PURE__ */ __name(() => De2, "EMPTY_PATH"), INVALID: /* @__PURE__ */ __name(() => p3, "INVALID"), NEVER: /* @__PURE__ */ __name(() => qt, "NEVER"), OK: /* @__PURE__ */ __name(() => k3, "OK"), ParseStatus: /* @__PURE__ */ __name(() => x5, "ParseStatus"), Schema: /* @__PURE__ */ __name(() => _5, "Schema"), ZodAny: /* @__PURE__ */ __name(() => P2, "ZodAny"), ZodArray: /* @__PURE__ */ __name(() => $3, "ZodArray"), ZodBigInt: /* @__PURE__ */ __name(() => U4, "ZodBigInt"), ZodBoolean: /* @__PURE__ */ __name(() => F4, "ZodBoolean"), ZodBranded: /* @__PURE__ */ __name(() => le2, "ZodBranded"), ZodCatch: /* @__PURE__ */ __name(() => ee2, "ZodCatch"), ZodDate: /* @__PURE__ */ __name(() => B4, "ZodDate"), ZodDefault: /* @__PURE__ */ __name(() => K3, "ZodDefault"), ZodDiscriminatedUnion: /* @__PURE__ */ __name(() => me2, "ZodDiscriminatedUnion"), ZodEffects: /* @__PURE__ */ __name(() => S4, "ZodEffects"), ZodEnum: /* @__PURE__ */ __name(() => Q4, "ZodEnum"), ZodError: /* @__PURE__ */ __name(() => b3, "ZodError"), ZodFirstPartyTypeKind: /* @__PURE__ */ __name(() => m4, "ZodFirstPartyTypeKind"), ZodFunction: /* @__PURE__ */ __name(() => _e2, "ZodFunction"), ZodIntersection: /* @__PURE__ */ __name(() => Y2, "ZodIntersection"), ZodIssueCode: /* @__PURE__ */ __name(() => c2, "ZodIssueCode"), ZodLazy: /* @__PURE__ */ __name(() => H2, "ZodLazy"), ZodLiteral: /* @__PURE__ */ __name(() => G3, "ZodLiteral"), ZodMap: /* @__PURE__ */ __name(() => oe2, "ZodMap"), ZodNaN: /* @__PURE__ */ __name(() => de2, "ZodNaN"), ZodNativeEnum: /* @__PURE__ */ __name(() => X3, "ZodNativeEnum"), ZodNever: /* @__PURE__ */ __name(() => A3, "ZodNever"), ZodNull: /* @__PURE__ */ __name(() => q4, "ZodNull"), ZodNullable: /* @__PURE__ */ __name(() => j4, "ZodNullable"), ZodNumber: /* @__PURE__ */ __name(() => L5, "ZodNumber"), ZodObject: /* @__PURE__ */ __name(() => w4, "ZodObject"), ZodOptional: /* @__PURE__ */ __name(() => C3, "ZodOptional"), ZodParsedType: /* @__PURE__ */ __name(() => u3, "ZodParsedType"), ZodPipeline: /* @__PURE__ */ __name(() => fe2, "ZodPipeline"), ZodPromise: /* @__PURE__ */ __name(() => z3, "ZodPromise"), ZodReadonly: /* @__PURE__ */ __name(() => te2, "ZodReadonly"), ZodRecord: /* @__PURE__ */ __name(() => ye2, "ZodRecord"), ZodSchema: /* @__PURE__ */ __name(() => _5, "ZodSchema"), ZodSet: /* @__PURE__ */ __name(() => ce2, "ZodSet"), ZodString: /* @__PURE__ */ __name(() => V4, "ZodString"), ZodSymbol: /* @__PURE__ */ __name(() => ne2, "ZodSymbol"), ZodTransformer: /* @__PURE__ */ __name(() => S4, "ZodTransformer"), ZodTuple: /* @__PURE__ */ __name(() => N2, "ZodTuple"), ZodType: /* @__PURE__ */ __name(() => _5, "ZodType"), ZodUndefined: /* @__PURE__ */ __name(() => W5, "ZodUndefined"), ZodUnion: /* @__PURE__ */ __name(() => J3, "ZodUnion"), ZodUnknown: /* @__PURE__ */ __name(() => Z2, "ZodUnknown"), ZodVoid: /* @__PURE__ */ __name(() => ie2, "ZodVoid"), addIssueToContext: /* @__PURE__ */ __name(() => d4, "addIssueToContext"), any: /* @__PURE__ */ __name(() => _t, "any"), array: /* @__PURE__ */ __name(() => kt, "array"), bigint: /* @__PURE__ */ __name(() => ft, "bigint"), boolean: /* @__PURE__ */ __name(() => Ze2, "boolean"), coerce: /* @__PURE__ */ __name(() => Wt, "coerce"), custom: /* @__PURE__ */ __name(() => je2, "custom"), date: /* @__PURE__ */ __name(() => ht2, "date"), datetimeRegex: /* @__PURE__ */ __name(() => Re2, "datetimeRegex"), defaultErrorMap: /* @__PURE__ */ __name(() => I5, "defaultErrorMap"), discriminatedUnion: /* @__PURE__ */ __name(() => Ct, "discriminatedUnion"), effect: /* @__PURE__ */ __name(() => Vt, "effect"), enum: /* @__PURE__ */ __name(() => Zt, "enum"), function: /* @__PURE__ */ __name(() => jt, "function"), getErrorMap: /* @__PURE__ */ __name(() => re2, "getErrorMap"), getParsedType: /* @__PURE__ */ __name(() => R3, "getParsedType"), instanceof: /* @__PURE__ */ __name(() => ut, "instanceof"), intersection: /* @__PURE__ */ __name(() => Ot, "intersection"), isAborted: /* @__PURE__ */ __name(() => he2, "isAborted"), isAsync: /* @__PURE__ */ __name(() => se2, "isAsync"), isDirty: /* @__PURE__ */ __name(() => pe2, "isDirty"), isValid: /* @__PURE__ */ __name(() => M3, "isValid"), late: /* @__PURE__ */ __name(() => dt, "late"), lazy: /* @__PURE__ */ __name(() => It, "lazy"), literal: /* @__PURE__ */ __name(() => Et, "literal"), makeIssue: /* @__PURE__ */ __name(() => ue2, "makeIssue"), map: /* @__PURE__ */ __name(() => Rt, "map"), nan: /* @__PURE__ */ __name(() => lt, "nan"), nativeEnum: /* @__PURE__ */ __name(() => $t, "nativeEnum"), never: /* @__PURE__ */ __name(() => vt, "never"), null: /* @__PURE__ */ __name(() => yt, "null"), nullable: /* @__PURE__ */ __name(() => zt, "nullable"), number: /* @__PURE__ */ __name(() => Ee2, "number"), object: /* @__PURE__ */ __name(() => bt, "object"), objectUtil: /* @__PURE__ */ __name(() => ve2, "objectUtil"), oboolean: /* @__PURE__ */ __name(() => Bt, "oboolean"), onumber: /* @__PURE__ */ __name(() => Ft, "onumber"), optional: /* @__PURE__ */ __name(() => Pt, "optional"), ostring: /* @__PURE__ */ __name(() => Ut, "ostring"), pipeline: /* @__PURE__ */ __name(() => Lt, "pipeline"), preprocess: /* @__PURE__ */ __name(() => Dt, "preprocess"), promise: /* @__PURE__ */ __name(() => Mt, "promise"), quotelessJson: /* @__PURE__ */ __name(() => Ve2, "quotelessJson"), record: /* @__PURE__ */ __name(() => At, "record"), set: /* @__PURE__ */ __name(() => Nt, "set"), setErrorMap: /* @__PURE__ */ __name(() => ze2, "setErrorMap"), strictObject: /* @__PURE__ */ __name(() => wt, "strictObject"), string: /* @__PURE__ */ __name(() => Ie2, "string"), symbol: /* @__PURE__ */ __name(() => pt, "symbol"), transformer: /* @__PURE__ */ __name(() => Vt, "transformer"), tuple: /* @__PURE__ */ __name(() => St, "tuple"), undefined: /* @__PURE__ */ __name(() => mt, "undefined"), union: /* @__PURE__ */ __name(() => Tt, "union"), unknown: /* @__PURE__ */ __name(() => gt, "unknown"), util: /* @__PURE__ */ __name(() => g5, "util"), void: /* @__PURE__ */ __name(() => xt, "void") });
var g5;
(function(r31) {
  r31.assertEqual = (a) => {
  };
  function e(a) {
  }
  __name(e, "e");
  r31.assertIs = e;
  function t(a) {
    throw new Error();
  }
  __name(t, "t");
  r31.assertNever = t, r31.arrayToEnum = (a) => {
    let n2 = {};
    for (let i2 of a) n2[i2] = i2;
    return n2;
  }, r31.getValidEnumValues = (a) => {
    let n2 = r31.objectKeys(a).filter((o3) => typeof a[a[o3]] != "number"), i2 = {};
    for (let o3 of n2) i2[o3] = a[o3];
    return r31.objectValues(i2);
  }, r31.objectValues = (a) => r31.objectKeys(a).map(function(n2) {
    return a[n2];
  }), r31.objectKeys = typeof Object.keys == "function" ? (a) => Object.keys(a) : (a) => {
    let n2 = [];
    for (let i2 in a) Object.prototype.hasOwnProperty.call(a, i2) && n2.push(i2);
    return n2;
  }, r31.find = (a, n2) => {
    for (let i2 of a) if (n2(i2)) return i2;
  }, r31.isInteger = typeof Number.isInteger == "function" ? (a) => Number.isInteger(a) : (a) => typeof a == "number" && Number.isFinite(a) && Math.floor(a) === a;
  function s2(a, n2 = " | ") {
    return a.map((i2) => typeof i2 == "string" ? `'${i2}'` : i2).join(n2);
  }
  __name(s2, "s");
  r31.joinValues = s2, r31.jsonStringifyReplacer = (a, n2) => typeof n2 == "bigint" ? n2.toString() : n2;
})(g5 || (g5 = {}));
var ve2;
(function(r31) {
  r31.mergeShapes = (e, t) => ({ ...e, ...t });
})(ve2 || (ve2 = {}));
var u3 = g5.arrayToEnum(["string", "nan", "number", "integer", "float", "boolean", "date", "bigint", "symbol", "function", "undefined", "null", "array", "object", "unknown", "promise", "void", "never", "map", "set"]);
var R3 = /* @__PURE__ */ __name((r31) => {
  switch (typeof r31) {
    case "undefined":
      return u3.undefined;
    case "string":
      return u3.string;
    case "number":
      return Number.isNaN(r31) ? u3.nan : u3.number;
    case "boolean":
      return u3.boolean;
    case "function":
      return u3.function;
    case "bigint":
      return u3.bigint;
    case "symbol":
      return u3.symbol;
    case "object":
      return Array.isArray(r31) ? u3.array : r31 === null ? u3.null : r31.then && typeof r31.then == "function" && r31.catch && typeof r31.catch == "function" ? u3.promise : typeof Map < "u" && r31 instanceof Map ? u3.map : typeof Set < "u" && r31 instanceof Set ? u3.set : typeof Date < "u" && r31 instanceof Date ? u3.date : u3.object;
    default:
      return u3.unknown;
  }
}, "R");
var c2 = g5.arrayToEnum(["invalid_type", "invalid_literal", "custom", "invalid_union", "invalid_union_discriminator", "invalid_enum_value", "unrecognized_keys", "invalid_arguments", "invalid_return_type", "invalid_date", "invalid_string", "too_small", "too_big", "invalid_intersection_types", "not_multiple_of", "not_finite"]);
var Ve2 = /* @__PURE__ */ __name((r31) => JSON.stringify(r31, null, 2).replace(/"([^"]+)":/g, "$1:"), "Ve");
var b3 = class r extends Error {
  static {
    __name(this, "r");
  }
  get errors() {
    return this.issues;
  }
  constructor(e) {
    super(), this.issues = [], this.addIssue = (s2) => {
      this.issues = [...this.issues, s2];
    }, this.addIssues = (s2 = []) => {
      this.issues = [...this.issues, ...s2];
    };
    let t = new.target.prototype;
    Object.setPrototypeOf ? Object.setPrototypeOf(this, t) : this.__proto__ = t, this.name = "ZodError", this.issues = e;
  }
  format(e) {
    let t = e || function(n2) {
      return n2.message;
    }, s2 = { _errors: [] }, a = /* @__PURE__ */ __name((n2) => {
      for (let i2 of n2.issues) if (i2.code === "invalid_union") i2.unionErrors.map(a);
      else if (i2.code === "invalid_return_type") a(i2.returnTypeError);
      else if (i2.code === "invalid_arguments") a(i2.argumentsError);
      else if (i2.path.length === 0) s2._errors.push(t(i2));
      else {
        let o3 = s2, f4 = 0;
        for (; f4 < i2.path.length; ) {
          let l6 = i2.path[f4];
          f4 === i2.path.length - 1 ? (o3[l6] = o3[l6] || { _errors: [] }, o3[l6]._errors.push(t(i2))) : o3[l6] = o3[l6] || { _errors: [] }, o3 = o3[l6], f4++;
        }
      }
    }, "a");
    return a(this), s2;
  }
  static assert(e) {
    if (!(e instanceof r)) throw new Error(`Not a ZodError: ${e}`);
  }
  toString() {
    return this.message;
  }
  get message() {
    return JSON.stringify(this.issues, g5.jsonStringifyReplacer, 2);
  }
  get isEmpty() {
    return this.issues.length === 0;
  }
  flatten(e = (t) => t.message) {
    let t = {}, s2 = [];
    for (let a of this.issues) if (a.path.length > 0) {
      let n2 = a.path[0];
      t[n2] = t[n2] || [], t[n2].push(e(a));
    } else s2.push(e(a));
    return { formErrors: s2, fieldErrors: t };
  }
  get formErrors() {
    return this.flatten();
  }
};
b3.create = (r31) => new b3(r31);
var Pe2 = /* @__PURE__ */ __name((r31, e) => {
  let t;
  switch (r31.code) {
    case c2.invalid_type:
      r31.received === u3.undefined ? t = "Required" : t = `Expected ${r31.expected}, received ${r31.received}`;
      break;
    case c2.invalid_literal:
      t = `Invalid literal value, expected ${JSON.stringify(r31.expected, g5.jsonStringifyReplacer)}`;
      break;
    case c2.unrecognized_keys:
      t = `Unrecognized key(s) in object: ${g5.joinValues(r31.keys, ", ")}`;
      break;
    case c2.invalid_union:
      t = "Invalid input";
      break;
    case c2.invalid_union_discriminator:
      t = `Invalid discriminator value. Expected ${g5.joinValues(r31.options)}`;
      break;
    case c2.invalid_enum_value:
      t = `Invalid enum value. Expected ${g5.joinValues(r31.options)}, received '${r31.received}'`;
      break;
    case c2.invalid_arguments:
      t = "Invalid function arguments";
      break;
    case c2.invalid_return_type:
      t = "Invalid function return type";
      break;
    case c2.invalid_date:
      t = "Invalid date";
      break;
    case c2.invalid_string:
      typeof r31.validation == "object" ? "includes" in r31.validation ? (t = `Invalid input: must include "${r31.validation.includes}"`, typeof r31.validation.position == "number" && (t = `${t} at one or more positions greater than or equal to ${r31.validation.position}`)) : "startsWith" in r31.validation ? t = `Invalid input: must start with "${r31.validation.startsWith}"` : "endsWith" in r31.validation ? t = `Invalid input: must end with "${r31.validation.endsWith}"` : g5.assertNever(r31.validation) : r31.validation !== "regex" ? t = `Invalid ${r31.validation}` : t = "Invalid";
      break;
    case c2.too_small:
      r31.type === "array" ? t = `Array must contain ${r31.exact ? "exactly" : r31.inclusive ? "at least" : "more than"} ${r31.minimum} element(s)` : r31.type === "string" ? t = `String must contain ${r31.exact ? "exactly" : r31.inclusive ? "at least" : "over"} ${r31.minimum} character(s)` : r31.type === "number" ? t = `Number must be ${r31.exact ? "exactly equal to " : r31.inclusive ? "greater than or equal to " : "greater than "}${r31.minimum}` : r31.type === "bigint" ? t = `Number must be ${r31.exact ? "exactly equal to " : r31.inclusive ? "greater than or equal to " : "greater than "}${r31.minimum}` : r31.type === "date" ? t = `Date must be ${r31.exact ? "exactly equal to " : r31.inclusive ? "greater than or equal to " : "greater than "}${new Date(Number(r31.minimum))}` : t = "Invalid input";
      break;
    case c2.too_big:
      r31.type === "array" ? t = `Array must contain ${r31.exact ? "exactly" : r31.inclusive ? "at most" : "less than"} ${r31.maximum} element(s)` : r31.type === "string" ? t = `String must contain ${r31.exact ? "exactly" : r31.inclusive ? "at most" : "under"} ${r31.maximum} character(s)` : r31.type === "number" ? t = `Number must be ${r31.exact ? "exactly" : r31.inclusive ? "less than or equal to" : "less than"} ${r31.maximum}` : r31.type === "bigint" ? t = `BigInt must be ${r31.exact ? "exactly" : r31.inclusive ? "less than or equal to" : "less than"} ${r31.maximum}` : r31.type === "date" ? t = `Date must be ${r31.exact ? "exactly" : r31.inclusive ? "smaller than or equal to" : "smaller than"} ${new Date(Number(r31.maximum))}` : t = "Invalid input";
      break;
    case c2.custom:
      t = "Invalid input";
      break;
    case c2.invalid_intersection_types:
      t = "Intersection results could not be merged";
      break;
    case c2.not_multiple_of:
      t = `Number must be a multiple of ${r31.multipleOf}`;
      break;
    case c2.not_finite:
      t = "Number must be finite";
      break;
    default:
      t = e.defaultError, g5.assertNever(r31);
  }
  return { message: t };
}, "Pe");
var I5 = Pe2;
var Te2 = I5;
function ze2(r31) {
  Te2 = r31;
}
__name(ze2, "ze");
function re2() {
  return Te2;
}
__name(re2, "re");
var ue2 = /* @__PURE__ */ __name((r31) => {
  let { data: e, path: t, errorMaps: s2, issueData: a } = r31, n2 = [...t, ...a.path || []], i2 = { ...a, path: n2 };
  if (a.message !== void 0) return { ...a, path: n2, message: a.message };
  let o3 = "", f4 = s2.filter((l6) => !!l6).slice().reverse();
  for (let l6 of f4) o3 = l6(i2, { data: e, defaultError: o3 }).message;
  return { ...a, path: n2, message: o3 };
}, "ue");
var De2 = [];
function d4(r31, e) {
  let t = re2(), s2 = ue2({ issueData: e, data: r31.data, path: r31.path, errorMaps: [r31.common.contextualErrorMap, r31.schemaErrorMap, t, t === I5 ? void 0 : I5].filter((a) => !!a) });
  r31.common.issues.push(s2);
}
__name(d4, "d");
var x5 = class r2 {
  static {
    __name(this, "r");
  }
  constructor() {
    this.value = "valid";
  }
  dirty() {
    this.value === "valid" && (this.value = "dirty");
  }
  abort() {
    this.value !== "aborted" && (this.value = "aborted");
  }
  static mergeArray(e, t) {
    let s2 = [];
    for (let a of t) {
      if (a.status === "aborted") return p3;
      a.status === "dirty" && e.dirty(), s2.push(a.value);
    }
    return { status: e.value, value: s2 };
  }
  static async mergeObjectAsync(e, t) {
    let s2 = [];
    for (let a of t) {
      let n2 = await a.key, i2 = await a.value;
      s2.push({ key: n2, value: i2 });
    }
    return r2.mergeObjectSync(e, s2);
  }
  static mergeObjectSync(e, t) {
    let s2 = {};
    for (let a of t) {
      let { key: n2, value: i2 } = a;
      if (n2.status === "aborted" || i2.status === "aborted") return p3;
      n2.status === "dirty" && e.dirty(), i2.status === "dirty" && e.dirty(), n2.value !== "__proto__" && (typeof i2.value < "u" || a.alwaysSet) && (s2[n2.value] = i2.value);
    }
    return { status: e.value, value: s2 };
  }
};
var p3 = Object.freeze({ status: "aborted" });
var D3 = /* @__PURE__ */ __name((r31) => ({ status: "dirty", value: r31 }), "D");
var k3 = /* @__PURE__ */ __name((r31) => ({ status: "valid", value: r31 }), "k");
var he2 = /* @__PURE__ */ __name((r31) => r31.status === "aborted", "he");
var pe2 = /* @__PURE__ */ __name((r31) => r31.status === "dirty", "pe");
var M3 = /* @__PURE__ */ __name((r31) => r31.status === "valid", "M");
var se2 = /* @__PURE__ */ __name((r31) => typeof Promise < "u" && r31 instanceof Promise, "se");
var h4;
(function(r31) {
  r31.errToObj = (e) => typeof e == "string" ? { message: e } : e || {}, r31.toString = (e) => typeof e == "string" ? e : e?.message;
})(h4 || (h4 = {}));
var O3 = class {
  static {
    __name(this, "O");
  }
  constructor(e, t, s2, a) {
    this._cachedPath = [], this.parent = e, this.data = t, this._path = s2, this._key = a;
  }
  get path() {
    return this._cachedPath.length || (Array.isArray(this._key) ? this._cachedPath.push(...this._path, ...this._key) : this._cachedPath.push(...this._path, this._key)), this._cachedPath;
  }
};
var Ce2 = /* @__PURE__ */ __name((r31, e) => {
  if (M3(e)) return { success: true, data: e.value };
  if (!r31.common.issues.length) throw new Error("Validation failed but no issues detected.");
  return { success: false, get error() {
    if (this._error) return this._error;
    let t = new b3(r31.common.issues);
    return this._error = t, this._error;
  } };
}, "Ce");
function y4(r31) {
  if (!r31) return {};
  let { errorMap: e, invalid_type_error: t, required_error: s2, description: a } = r31;
  if (e && (t || s2)) throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
  return e ? { errorMap: e, description: a } : { errorMap: /* @__PURE__ */ __name((i2, o3) => {
    let { message: f4 } = r31;
    return i2.code === "invalid_enum_value" ? { message: f4 ?? o3.defaultError } : typeof o3.data > "u" ? { message: f4 ?? s2 ?? o3.defaultError } : i2.code !== "invalid_type" ? { message: o3.defaultError } : { message: f4 ?? t ?? o3.defaultError };
  }, "errorMap"), description: a };
}
__name(y4, "y");
var _5 = class {
  static {
    __name(this, "_");
  }
  get description() {
    return this._def.description;
  }
  _getType(e) {
    return R3(e.data);
  }
  _getOrReturnCtx(e, t) {
    return t || { common: e.parent.common, data: e.data, parsedType: R3(e.data), schemaErrorMap: this._def.errorMap, path: e.path, parent: e.parent };
  }
  _processInputParams(e) {
    return { status: new x5(), ctx: { common: e.parent.common, data: e.data, parsedType: R3(e.data), schemaErrorMap: this._def.errorMap, path: e.path, parent: e.parent } };
  }
  _parseSync(e) {
    let t = this._parse(e);
    if (se2(t)) throw new Error("Synchronous parse encountered promise.");
    return t;
  }
  _parseAsync(e) {
    let t = this._parse(e);
    return Promise.resolve(t);
  }
  parse(e, t) {
    let s2 = this.safeParse(e, t);
    if (s2.success) return s2.data;
    throw s2.error;
  }
  safeParse(e, t) {
    let s2 = { common: { issues: [], async: t?.async ?? false, contextualErrorMap: t?.errorMap }, path: t?.path || [], schemaErrorMap: this._def.errorMap, parent: null, data: e, parsedType: R3(e) }, a = this._parseSync({ data: e, path: s2.path, parent: s2 });
    return Ce2(s2, a);
  }
  "~validate"(e) {
    let t = { common: { issues: [], async: !!this["~standard"].async }, path: [], schemaErrorMap: this._def.errorMap, parent: null, data: e, parsedType: R3(e) };
    if (!this["~standard"].async) try {
      let s2 = this._parseSync({ data: e, path: [], parent: t });
      return M3(s2) ? { value: s2.value } : { issues: t.common.issues };
    } catch (s2) {
      s2?.message?.toLowerCase()?.includes("encountered") && (this["~standard"].async = true), t.common = { issues: [], async: true };
    }
    return this._parseAsync({ data: e, path: [], parent: t }).then((s2) => M3(s2) ? { value: s2.value } : { issues: t.common.issues });
  }
  async parseAsync(e, t) {
    let s2 = await this.safeParseAsync(e, t);
    if (s2.success) return s2.data;
    throw s2.error;
  }
  async safeParseAsync(e, t) {
    let s2 = { common: { issues: [], contextualErrorMap: t?.errorMap, async: true }, path: t?.path || [], schemaErrorMap: this._def.errorMap, parent: null, data: e, parsedType: R3(e) }, a = this._parse({ data: e, path: s2.path, parent: s2 }), n2 = await (se2(a) ? a : Promise.resolve(a));
    return Ce2(s2, n2);
  }
  refine(e, t) {
    let s2 = /* @__PURE__ */ __name((a) => typeof t == "string" || typeof t > "u" ? { message: t } : typeof t == "function" ? t(a) : t, "s");
    return this._refinement((a, n2) => {
      let i2 = e(a), o3 = /* @__PURE__ */ __name(() => n2.addIssue({ code: c2.custom, ...s2(a) }), "o");
      return typeof Promise < "u" && i2 instanceof Promise ? i2.then((f4) => f4 ? true : (o3(), false)) : i2 ? true : (o3(), false);
    });
  }
  refinement(e, t) {
    return this._refinement((s2, a) => e(s2) ? true : (a.addIssue(typeof t == "function" ? t(s2, a) : t), false));
  }
  _refinement(e) {
    return new S4({ schema: this, typeName: m4.ZodEffects, effect: { type: "refinement", refinement: e } });
  }
  superRefine(e) {
    return this._refinement(e);
  }
  constructor(e) {
    this.spa = this.safeParseAsync, this._def = e, this.parse = this.parse.bind(this), this.safeParse = this.safeParse.bind(this), this.parseAsync = this.parseAsync.bind(this), this.safeParseAsync = this.safeParseAsync.bind(this), this.spa = this.spa.bind(this), this.refine = this.refine.bind(this), this.refinement = this.refinement.bind(this), this.superRefine = this.superRefine.bind(this), this.optional = this.optional.bind(this), this.nullable = this.nullable.bind(this), this.nullish = this.nullish.bind(this), this.array = this.array.bind(this), this.promise = this.promise.bind(this), this.or = this.or.bind(this), this.and = this.and.bind(this), this.transform = this.transform.bind(this), this.brand = this.brand.bind(this), this.default = this.default.bind(this), this.catch = this.catch.bind(this), this.describe = this.describe.bind(this), this.pipe = this.pipe.bind(this), this.readonly = this.readonly.bind(this), this.isNullable = this.isNullable.bind(this), this.isOptional = this.isOptional.bind(this), this["~standard"] = { version: 1, vendor: "zod", validate: /* @__PURE__ */ __name((t) => this["~validate"](t), "validate") };
  }
  optional() {
    return C3.create(this, this._def);
  }
  nullable() {
    return j4.create(this, this._def);
  }
  nullish() {
    return this.nullable().optional();
  }
  array() {
    return $3.create(this);
  }
  promise() {
    return z3.create(this, this._def);
  }
  or(e) {
    return J3.create([this, e], this._def);
  }
  and(e) {
    return Y2.create(this, e, this._def);
  }
  transform(e) {
    return new S4({ ...y4(this._def), schema: this, typeName: m4.ZodEffects, effect: { type: "transform", transform: e } });
  }
  default(e) {
    let t = typeof e == "function" ? e : () => e;
    return new K3({ ...y4(this._def), innerType: this, defaultValue: t, typeName: m4.ZodDefault });
  }
  brand() {
    return new le2({ typeName: m4.ZodBranded, type: this, ...y4(this._def) });
  }
  catch(e) {
    let t = typeof e == "function" ? e : () => e;
    return new ee2({ ...y4(this._def), innerType: this, catchValue: t, typeName: m4.ZodCatch });
  }
  describe(e) {
    let t = this.constructor;
    return new t({ ...this._def, description: e });
  }
  pipe(e) {
    return fe2.create(this, e);
  }
  readonly() {
    return te2.create(this);
  }
  isOptional() {
    return this.safeParse(void 0).success;
  }
  isNullable() {
    return this.safeParse(null).success;
  }
};
var Le2 = /^c[^\s-]{8,}$/i;
var Ue2 = /^[0-9a-z]+$/;
var Fe2 = /^[0-9A-HJKMNP-TV-Z]{26}$/i;
var Be2 = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i;
var We2 = /^[a-z0-9_-]{21}$/i;
var qe2 = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/;
var Je2 = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/;
var Ye2 = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i;
var He2 = "^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$";
var xe2;
var Ge2 = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
var Qe2 = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/;
var Xe2 = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
var Ke2 = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
var et2 = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
var tt2 = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/;
var Se2 = "((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))";
var rt2 = new RegExp(`^${Se2}$`);
function Ae2(r31) {
  let e = "[0-5]\\d";
  r31.precision ? e = `${e}\\.\\d{${r31.precision}}` : r31.precision == null && (e = `${e}(\\.\\d+)?`);
  let t = r31.precision ? "+" : "?";
  return `([01]\\d|2[0-3]):[0-5]\\d(:${e})${t}`;
}
__name(Ae2, "Ae");
function st2(r31) {
  return new RegExp(`^${Ae2(r31)}$`);
}
__name(st2, "st");
function Re2(r31) {
  let e = `${Se2}T${Ae2(r31)}`, t = [];
  return t.push(r31.local ? "Z?" : "Z"), r31.offset && t.push("([+-]\\d{2}:?\\d{2})"), e = `${e}(${t.join("|")})`, new RegExp(`^${e}$`);
}
__name(Re2, "Re");
function at2(r31, e) {
  return !!((e === "v4" || !e) && Ge2.test(r31) || (e === "v6" || !e) && Xe2.test(r31));
}
__name(at2, "at");
function nt2(r31, e) {
  if (!qe2.test(r31)) return false;
  try {
    let [t] = r31.split(".");
    if (!t) return false;
    let s2 = t.replace(/-/g, "+").replace(/_/g, "/").padEnd(t.length + (4 - t.length % 4) % 4, "="), a = JSON.parse(atob(s2));
    return !(typeof a != "object" || a === null || "typ" in a && a?.typ !== "JWT" || !a.alg || e && a.alg !== e);
  } catch {
    return false;
  }
}
__name(nt2, "nt");
function it2(r31, e) {
  return !!((e === "v4" || !e) && Qe2.test(r31) || (e === "v6" || !e) && Ke2.test(r31));
}
__name(it2, "it");
var V4 = class r3 extends _5 {
  static {
    __name(this, "r");
  }
  _parse(e) {
    if (this._def.coerce && (e.data = String(e.data)), this._getType(e) !== u3.string) {
      let n2 = this._getOrReturnCtx(e);
      return d4(n2, { code: c2.invalid_type, expected: u3.string, received: n2.parsedType }), p3;
    }
    let s2 = new x5(), a;
    for (let n2 of this._def.checks) if (n2.kind === "min") e.data.length < n2.value && (a = this._getOrReturnCtx(e, a), d4(a, { code: c2.too_small, minimum: n2.value, type: "string", inclusive: true, exact: false, message: n2.message }), s2.dirty());
    else if (n2.kind === "max") e.data.length > n2.value && (a = this._getOrReturnCtx(e, a), d4(a, { code: c2.too_big, maximum: n2.value, type: "string", inclusive: true, exact: false, message: n2.message }), s2.dirty());
    else if (n2.kind === "length") {
      let i2 = e.data.length > n2.value, o3 = e.data.length < n2.value;
      (i2 || o3) && (a = this._getOrReturnCtx(e, a), i2 ? d4(a, { code: c2.too_big, maximum: n2.value, type: "string", inclusive: true, exact: true, message: n2.message }) : o3 && d4(a, { code: c2.too_small, minimum: n2.value, type: "string", inclusive: true, exact: true, message: n2.message }), s2.dirty());
    } else if (n2.kind === "email") Ye2.test(e.data) || (a = this._getOrReturnCtx(e, a), d4(a, { validation: "email", code: c2.invalid_string, message: n2.message }), s2.dirty());
    else if (n2.kind === "emoji") xe2 || (xe2 = new RegExp(He2, "u")), xe2.test(e.data) || (a = this._getOrReturnCtx(e, a), d4(a, { validation: "emoji", code: c2.invalid_string, message: n2.message }), s2.dirty());
    else if (n2.kind === "uuid") Be2.test(e.data) || (a = this._getOrReturnCtx(e, a), d4(a, { validation: "uuid", code: c2.invalid_string, message: n2.message }), s2.dirty());
    else if (n2.kind === "nanoid") We2.test(e.data) || (a = this._getOrReturnCtx(e, a), d4(a, { validation: "nanoid", code: c2.invalid_string, message: n2.message }), s2.dirty());
    else if (n2.kind === "cuid") Le2.test(e.data) || (a = this._getOrReturnCtx(e, a), d4(a, { validation: "cuid", code: c2.invalid_string, message: n2.message }), s2.dirty());
    else if (n2.kind === "cuid2") Ue2.test(e.data) || (a = this._getOrReturnCtx(e, a), d4(a, { validation: "cuid2", code: c2.invalid_string, message: n2.message }), s2.dirty());
    else if (n2.kind === "ulid") Fe2.test(e.data) || (a = this._getOrReturnCtx(e, a), d4(a, { validation: "ulid", code: c2.invalid_string, message: n2.message }), s2.dirty());
    else if (n2.kind === "url") try {
      new URL(e.data);
    } catch {
      a = this._getOrReturnCtx(e, a), d4(a, { validation: "url", code: c2.invalid_string, message: n2.message }), s2.dirty();
    }
    else n2.kind === "regex" ? (n2.regex.lastIndex = 0, n2.regex.test(e.data) || (a = this._getOrReturnCtx(e, a), d4(a, { validation: "regex", code: c2.invalid_string, message: n2.message }), s2.dirty())) : n2.kind === "trim" ? e.data = e.data.trim() : n2.kind === "includes" ? e.data.includes(n2.value, n2.position) || (a = this._getOrReturnCtx(e, a), d4(a, { code: c2.invalid_string, validation: { includes: n2.value, position: n2.position }, message: n2.message }), s2.dirty()) : n2.kind === "toLowerCase" ? e.data = e.data.toLowerCase() : n2.kind === "toUpperCase" ? e.data = e.data.toUpperCase() : n2.kind === "startsWith" ? e.data.startsWith(n2.value) || (a = this._getOrReturnCtx(e, a), d4(a, { code: c2.invalid_string, validation: { startsWith: n2.value }, message: n2.message }), s2.dirty()) : n2.kind === "endsWith" ? e.data.endsWith(n2.value) || (a = this._getOrReturnCtx(e, a), d4(a, { code: c2.invalid_string, validation: { endsWith: n2.value }, message: n2.message }), s2.dirty()) : n2.kind === "datetime" ? Re2(n2).test(e.data) || (a = this._getOrReturnCtx(e, a), d4(a, { code: c2.invalid_string, validation: "datetime", message: n2.message }), s2.dirty()) : n2.kind === "date" ? rt2.test(e.data) || (a = this._getOrReturnCtx(e, a), d4(a, { code: c2.invalid_string, validation: "date", message: n2.message }), s2.dirty()) : n2.kind === "time" ? st2(n2).test(e.data) || (a = this._getOrReturnCtx(e, a), d4(a, { code: c2.invalid_string, validation: "time", message: n2.message }), s2.dirty()) : n2.kind === "duration" ? Je2.test(e.data) || (a = this._getOrReturnCtx(e, a), d4(a, { validation: "duration", code: c2.invalid_string, message: n2.message }), s2.dirty()) : n2.kind === "ip" ? at2(e.data, n2.version) || (a = this._getOrReturnCtx(e, a), d4(a, { validation: "ip", code: c2.invalid_string, message: n2.message }), s2.dirty()) : n2.kind === "jwt" ? nt2(e.data, n2.alg) || (a = this._getOrReturnCtx(e, a), d4(a, { validation: "jwt", code: c2.invalid_string, message: n2.message }), s2.dirty()) : n2.kind === "cidr" ? it2(e.data, n2.version) || (a = this._getOrReturnCtx(e, a), d4(a, { validation: "cidr", code: c2.invalid_string, message: n2.message }), s2.dirty()) : n2.kind === "base64" ? et2.test(e.data) || (a = this._getOrReturnCtx(e, a), d4(a, { validation: "base64", code: c2.invalid_string, message: n2.message }), s2.dirty()) : n2.kind === "base64url" ? tt2.test(e.data) || (a = this._getOrReturnCtx(e, a), d4(a, { validation: "base64url", code: c2.invalid_string, message: n2.message }), s2.dirty()) : g5.assertNever(n2);
    return { status: s2.value, value: e.data };
  }
  _regex(e, t, s2) {
    return this.refinement((a) => e.test(a), { validation: t, code: c2.invalid_string, ...h4.errToObj(s2) });
  }
  _addCheck(e) {
    return new r3({ ...this._def, checks: [...this._def.checks, e] });
  }
  email(e) {
    return this._addCheck({ kind: "email", ...h4.errToObj(e) });
  }
  url(e) {
    return this._addCheck({ kind: "url", ...h4.errToObj(e) });
  }
  emoji(e) {
    return this._addCheck({ kind: "emoji", ...h4.errToObj(e) });
  }
  uuid(e) {
    return this._addCheck({ kind: "uuid", ...h4.errToObj(e) });
  }
  nanoid(e) {
    return this._addCheck({ kind: "nanoid", ...h4.errToObj(e) });
  }
  cuid(e) {
    return this._addCheck({ kind: "cuid", ...h4.errToObj(e) });
  }
  cuid2(e) {
    return this._addCheck({ kind: "cuid2", ...h4.errToObj(e) });
  }
  ulid(e) {
    return this._addCheck({ kind: "ulid", ...h4.errToObj(e) });
  }
  base64(e) {
    return this._addCheck({ kind: "base64", ...h4.errToObj(e) });
  }
  base64url(e) {
    return this._addCheck({ kind: "base64url", ...h4.errToObj(e) });
  }
  jwt(e) {
    return this._addCheck({ kind: "jwt", ...h4.errToObj(e) });
  }
  ip(e) {
    return this._addCheck({ kind: "ip", ...h4.errToObj(e) });
  }
  cidr(e) {
    return this._addCheck({ kind: "cidr", ...h4.errToObj(e) });
  }
  datetime(e) {
    return typeof e == "string" ? this._addCheck({ kind: "datetime", precision: null, offset: false, local: false, message: e }) : this._addCheck({ kind: "datetime", precision: typeof e?.precision > "u" ? null : e?.precision, offset: e?.offset ?? false, local: e?.local ?? false, ...h4.errToObj(e?.message) });
  }
  date(e) {
    return this._addCheck({ kind: "date", message: e });
  }
  time(e) {
    return typeof e == "string" ? this._addCheck({ kind: "time", precision: null, message: e }) : this._addCheck({ kind: "time", precision: typeof e?.precision > "u" ? null : e?.precision, ...h4.errToObj(e?.message) });
  }
  duration(e) {
    return this._addCheck({ kind: "duration", ...h4.errToObj(e) });
  }
  regex(e, t) {
    return this._addCheck({ kind: "regex", regex: e, ...h4.errToObj(t) });
  }
  includes(e, t) {
    return this._addCheck({ kind: "includes", value: e, position: t?.position, ...h4.errToObj(t?.message) });
  }
  startsWith(e, t) {
    return this._addCheck({ kind: "startsWith", value: e, ...h4.errToObj(t) });
  }
  endsWith(e, t) {
    return this._addCheck({ kind: "endsWith", value: e, ...h4.errToObj(t) });
  }
  min(e, t) {
    return this._addCheck({ kind: "min", value: e, ...h4.errToObj(t) });
  }
  max(e, t) {
    return this._addCheck({ kind: "max", value: e, ...h4.errToObj(t) });
  }
  length(e, t) {
    return this._addCheck({ kind: "length", value: e, ...h4.errToObj(t) });
  }
  nonempty(e) {
    return this.min(1, h4.errToObj(e));
  }
  trim() {
    return new r3({ ...this._def, checks: [...this._def.checks, { kind: "trim" }] });
  }
  toLowerCase() {
    return new r3({ ...this._def, checks: [...this._def.checks, { kind: "toLowerCase" }] });
  }
  toUpperCase() {
    return new r3({ ...this._def, checks: [...this._def.checks, { kind: "toUpperCase" }] });
  }
  get isDatetime() {
    return !!this._def.checks.find((e) => e.kind === "datetime");
  }
  get isDate() {
    return !!this._def.checks.find((e) => e.kind === "date");
  }
  get isTime() {
    return !!this._def.checks.find((e) => e.kind === "time");
  }
  get isDuration() {
    return !!this._def.checks.find((e) => e.kind === "duration");
  }
  get isEmail() {
    return !!this._def.checks.find((e) => e.kind === "email");
  }
  get isURL() {
    return !!this._def.checks.find((e) => e.kind === "url");
  }
  get isEmoji() {
    return !!this._def.checks.find((e) => e.kind === "emoji");
  }
  get isUUID() {
    return !!this._def.checks.find((e) => e.kind === "uuid");
  }
  get isNANOID() {
    return !!this._def.checks.find((e) => e.kind === "nanoid");
  }
  get isCUID() {
    return !!this._def.checks.find((e) => e.kind === "cuid");
  }
  get isCUID2() {
    return !!this._def.checks.find((e) => e.kind === "cuid2");
  }
  get isULID() {
    return !!this._def.checks.find((e) => e.kind === "ulid");
  }
  get isIP() {
    return !!this._def.checks.find((e) => e.kind === "ip");
  }
  get isCIDR() {
    return !!this._def.checks.find((e) => e.kind === "cidr");
  }
  get isBase64() {
    return !!this._def.checks.find((e) => e.kind === "base64");
  }
  get isBase64url() {
    return !!this._def.checks.find((e) => e.kind === "base64url");
  }
  get minLength() {
    let e = null;
    for (let t of this._def.checks) t.kind === "min" && (e === null || t.value > e) && (e = t.value);
    return e;
  }
  get maxLength() {
    let e = null;
    for (let t of this._def.checks) t.kind === "max" && (e === null || t.value < e) && (e = t.value);
    return e;
  }
};
V4.create = (r31) => new V4({ checks: [], typeName: m4.ZodString, coerce: r31?.coerce ?? false, ...y4(r31) });
function ot2(r31, e) {
  let t = (r31.toString().split(".")[1] || "").length, s2 = (e.toString().split(".")[1] || "").length, a = t > s2 ? t : s2, n2 = Number.parseInt(r31.toFixed(a).replace(".", "")), i2 = Number.parseInt(e.toFixed(a).replace(".", ""));
  return n2 % i2 / 10 ** a;
}
__name(ot2, "ot");
var L5 = class r4 extends _5 {
  static {
    __name(this, "r");
  }
  constructor() {
    super(...arguments), this.min = this.gte, this.max = this.lte, this.step = this.multipleOf;
  }
  _parse(e) {
    if (this._def.coerce && (e.data = Number(e.data)), this._getType(e) !== u3.number) {
      let n2 = this._getOrReturnCtx(e);
      return d4(n2, { code: c2.invalid_type, expected: u3.number, received: n2.parsedType }), p3;
    }
    let s2, a = new x5();
    for (let n2 of this._def.checks) n2.kind === "int" ? g5.isInteger(e.data) || (s2 = this._getOrReturnCtx(e, s2), d4(s2, { code: c2.invalid_type, expected: "integer", received: "float", message: n2.message }), a.dirty()) : n2.kind === "min" ? (n2.inclusive ? e.data < n2.value : e.data <= n2.value) && (s2 = this._getOrReturnCtx(e, s2), d4(s2, { code: c2.too_small, minimum: n2.value, type: "number", inclusive: n2.inclusive, exact: false, message: n2.message }), a.dirty()) : n2.kind === "max" ? (n2.inclusive ? e.data > n2.value : e.data >= n2.value) && (s2 = this._getOrReturnCtx(e, s2), d4(s2, { code: c2.too_big, maximum: n2.value, type: "number", inclusive: n2.inclusive, exact: false, message: n2.message }), a.dirty()) : n2.kind === "multipleOf" ? ot2(e.data, n2.value) !== 0 && (s2 = this._getOrReturnCtx(e, s2), d4(s2, { code: c2.not_multiple_of, multipleOf: n2.value, message: n2.message }), a.dirty()) : n2.kind === "finite" ? Number.isFinite(e.data) || (s2 = this._getOrReturnCtx(e, s2), d4(s2, { code: c2.not_finite, message: n2.message }), a.dirty()) : g5.assertNever(n2);
    return { status: a.value, value: e.data };
  }
  gte(e, t) {
    return this.setLimit("min", e, true, h4.toString(t));
  }
  gt(e, t) {
    return this.setLimit("min", e, false, h4.toString(t));
  }
  lte(e, t) {
    return this.setLimit("max", e, true, h4.toString(t));
  }
  lt(e, t) {
    return this.setLimit("max", e, false, h4.toString(t));
  }
  setLimit(e, t, s2, a) {
    return new r4({ ...this._def, checks: [...this._def.checks, { kind: e, value: t, inclusive: s2, message: h4.toString(a) }] });
  }
  _addCheck(e) {
    return new r4({ ...this._def, checks: [...this._def.checks, e] });
  }
  int(e) {
    return this._addCheck({ kind: "int", message: h4.toString(e) });
  }
  positive(e) {
    return this._addCheck({ kind: "min", value: 0, inclusive: false, message: h4.toString(e) });
  }
  negative(e) {
    return this._addCheck({ kind: "max", value: 0, inclusive: false, message: h4.toString(e) });
  }
  nonpositive(e) {
    return this._addCheck({ kind: "max", value: 0, inclusive: true, message: h4.toString(e) });
  }
  nonnegative(e) {
    return this._addCheck({ kind: "min", value: 0, inclusive: true, message: h4.toString(e) });
  }
  multipleOf(e, t) {
    return this._addCheck({ kind: "multipleOf", value: e, message: h4.toString(t) });
  }
  finite(e) {
    return this._addCheck({ kind: "finite", message: h4.toString(e) });
  }
  safe(e) {
    return this._addCheck({ kind: "min", inclusive: true, value: Number.MIN_SAFE_INTEGER, message: h4.toString(e) })._addCheck({ kind: "max", inclusive: true, value: Number.MAX_SAFE_INTEGER, message: h4.toString(e) });
  }
  get minValue() {
    let e = null;
    for (let t of this._def.checks) t.kind === "min" && (e === null || t.value > e) && (e = t.value);
    return e;
  }
  get maxValue() {
    let e = null;
    for (let t of this._def.checks) t.kind === "max" && (e === null || t.value < e) && (e = t.value);
    return e;
  }
  get isInt() {
    return !!this._def.checks.find((e) => e.kind === "int" || e.kind === "multipleOf" && g5.isInteger(e.value));
  }
  get isFinite() {
    let e = null, t = null;
    for (let s2 of this._def.checks) {
      if (s2.kind === "finite" || s2.kind === "int" || s2.kind === "multipleOf") return true;
      s2.kind === "min" ? (t === null || s2.value > t) && (t = s2.value) : s2.kind === "max" && (e === null || s2.value < e) && (e = s2.value);
    }
    return Number.isFinite(t) && Number.isFinite(e);
  }
};
L5.create = (r31) => new L5({ checks: [], typeName: m4.ZodNumber, coerce: r31?.coerce || false, ...y4(r31) });
var U4 = class r5 extends _5 {
  static {
    __name(this, "r");
  }
  constructor() {
    super(...arguments), this.min = this.gte, this.max = this.lte;
  }
  _parse(e) {
    if (this._def.coerce) try {
      e.data = BigInt(e.data);
    } catch {
      return this._getInvalidInput(e);
    }
    if (this._getType(e) !== u3.bigint) return this._getInvalidInput(e);
    let s2, a = new x5();
    for (let n2 of this._def.checks) n2.kind === "min" ? (n2.inclusive ? e.data < n2.value : e.data <= n2.value) && (s2 = this._getOrReturnCtx(e, s2), d4(s2, { code: c2.too_small, type: "bigint", minimum: n2.value, inclusive: n2.inclusive, message: n2.message }), a.dirty()) : n2.kind === "max" ? (n2.inclusive ? e.data > n2.value : e.data >= n2.value) && (s2 = this._getOrReturnCtx(e, s2), d4(s2, { code: c2.too_big, type: "bigint", maximum: n2.value, inclusive: n2.inclusive, message: n2.message }), a.dirty()) : n2.kind === "multipleOf" ? e.data % n2.value !== BigInt(0) && (s2 = this._getOrReturnCtx(e, s2), d4(s2, { code: c2.not_multiple_of, multipleOf: n2.value, message: n2.message }), a.dirty()) : g5.assertNever(n2);
    return { status: a.value, value: e.data };
  }
  _getInvalidInput(e) {
    let t = this._getOrReturnCtx(e);
    return d4(t, { code: c2.invalid_type, expected: u3.bigint, received: t.parsedType }), p3;
  }
  gte(e, t) {
    return this.setLimit("min", e, true, h4.toString(t));
  }
  gt(e, t) {
    return this.setLimit("min", e, false, h4.toString(t));
  }
  lte(e, t) {
    return this.setLimit("max", e, true, h4.toString(t));
  }
  lt(e, t) {
    return this.setLimit("max", e, false, h4.toString(t));
  }
  setLimit(e, t, s2, a) {
    return new r5({ ...this._def, checks: [...this._def.checks, { kind: e, value: t, inclusive: s2, message: h4.toString(a) }] });
  }
  _addCheck(e) {
    return new r5({ ...this._def, checks: [...this._def.checks, e] });
  }
  positive(e) {
    return this._addCheck({ kind: "min", value: BigInt(0), inclusive: false, message: h4.toString(e) });
  }
  negative(e) {
    return this._addCheck({ kind: "max", value: BigInt(0), inclusive: false, message: h4.toString(e) });
  }
  nonpositive(e) {
    return this._addCheck({ kind: "max", value: BigInt(0), inclusive: true, message: h4.toString(e) });
  }
  nonnegative(e) {
    return this._addCheck({ kind: "min", value: BigInt(0), inclusive: true, message: h4.toString(e) });
  }
  multipleOf(e, t) {
    return this._addCheck({ kind: "multipleOf", value: e, message: h4.toString(t) });
  }
  get minValue() {
    let e = null;
    for (let t of this._def.checks) t.kind === "min" && (e === null || t.value > e) && (e = t.value);
    return e;
  }
  get maxValue() {
    let e = null;
    for (let t of this._def.checks) t.kind === "max" && (e === null || t.value < e) && (e = t.value);
    return e;
  }
};
U4.create = (r31) => new U4({ checks: [], typeName: m4.ZodBigInt, coerce: r31?.coerce ?? false, ...y4(r31) });
var F4 = class extends _5 {
  static {
    __name(this, "F");
  }
  _parse(e) {
    if (this._def.coerce && (e.data = !!e.data), this._getType(e) !== u3.boolean) {
      let s2 = this._getOrReturnCtx(e);
      return d4(s2, { code: c2.invalid_type, expected: u3.boolean, received: s2.parsedType }), p3;
    }
    return k3(e.data);
  }
};
F4.create = (r31) => new F4({ typeName: m4.ZodBoolean, coerce: r31?.coerce || false, ...y4(r31) });
var B4 = class r6 extends _5 {
  static {
    __name(this, "r");
  }
  _parse(e) {
    if (this._def.coerce && (e.data = new Date(e.data)), this._getType(e) !== u3.date) {
      let n2 = this._getOrReturnCtx(e);
      return d4(n2, { code: c2.invalid_type, expected: u3.date, received: n2.parsedType }), p3;
    }
    if (Number.isNaN(e.data.getTime())) {
      let n2 = this._getOrReturnCtx(e);
      return d4(n2, { code: c2.invalid_date }), p3;
    }
    let s2 = new x5(), a;
    for (let n2 of this._def.checks) n2.kind === "min" ? e.data.getTime() < n2.value && (a = this._getOrReturnCtx(e, a), d4(a, { code: c2.too_small, message: n2.message, inclusive: true, exact: false, minimum: n2.value, type: "date" }), s2.dirty()) : n2.kind === "max" ? e.data.getTime() > n2.value && (a = this._getOrReturnCtx(e, a), d4(a, { code: c2.too_big, message: n2.message, inclusive: true, exact: false, maximum: n2.value, type: "date" }), s2.dirty()) : g5.assertNever(n2);
    return { status: s2.value, value: new Date(e.data.getTime()) };
  }
  _addCheck(e) {
    return new r6({ ...this._def, checks: [...this._def.checks, e] });
  }
  min(e, t) {
    return this._addCheck({ kind: "min", value: e.getTime(), message: h4.toString(t) });
  }
  max(e, t) {
    return this._addCheck({ kind: "max", value: e.getTime(), message: h4.toString(t) });
  }
  get minDate() {
    let e = null;
    for (let t of this._def.checks) t.kind === "min" && (e === null || t.value > e) && (e = t.value);
    return e != null ? new Date(e) : null;
  }
  get maxDate() {
    let e = null;
    for (let t of this._def.checks) t.kind === "max" && (e === null || t.value < e) && (e = t.value);
    return e != null ? new Date(e) : null;
  }
};
B4.create = (r31) => new B4({ checks: [], coerce: r31?.coerce || false, typeName: m4.ZodDate, ...y4(r31) });
var ne2 = class extends _5 {
  static {
    __name(this, "ne");
  }
  _parse(e) {
    if (this._getType(e) !== u3.symbol) {
      let s2 = this._getOrReturnCtx(e);
      return d4(s2, { code: c2.invalid_type, expected: u3.symbol, received: s2.parsedType }), p3;
    }
    return k3(e.data);
  }
};
ne2.create = (r31) => new ne2({ typeName: m4.ZodSymbol, ...y4(r31) });
var W5 = class extends _5 {
  static {
    __name(this, "W");
  }
  _parse(e) {
    if (this._getType(e) !== u3.undefined) {
      let s2 = this._getOrReturnCtx(e);
      return d4(s2, { code: c2.invalid_type, expected: u3.undefined, received: s2.parsedType }), p3;
    }
    return k3(e.data);
  }
};
W5.create = (r31) => new W5({ typeName: m4.ZodUndefined, ...y4(r31) });
var q4 = class extends _5 {
  static {
    __name(this, "q");
  }
  _parse(e) {
    if (this._getType(e) !== u3.null) {
      let s2 = this._getOrReturnCtx(e);
      return d4(s2, { code: c2.invalid_type, expected: u3.null, received: s2.parsedType }), p3;
    }
    return k3(e.data);
  }
};
q4.create = (r31) => new q4({ typeName: m4.ZodNull, ...y4(r31) });
var P2 = class extends _5 {
  static {
    __name(this, "P");
  }
  constructor() {
    super(...arguments), this._any = true;
  }
  _parse(e) {
    return k3(e.data);
  }
};
P2.create = (r31) => new P2({ typeName: m4.ZodAny, ...y4(r31) });
var Z2 = class extends _5 {
  static {
    __name(this, "Z");
  }
  constructor() {
    super(...arguments), this._unknown = true;
  }
  _parse(e) {
    return k3(e.data);
  }
};
Z2.create = (r31) => new Z2({ typeName: m4.ZodUnknown, ...y4(r31) });
var A3 = class extends _5 {
  static {
    __name(this, "A");
  }
  _parse(e) {
    let t = this._getOrReturnCtx(e);
    return d4(t, { code: c2.invalid_type, expected: u3.never, received: t.parsedType }), p3;
  }
};
A3.create = (r31) => new A3({ typeName: m4.ZodNever, ...y4(r31) });
var ie2 = class extends _5 {
  static {
    __name(this, "ie");
  }
  _parse(e) {
    if (this._getType(e) !== u3.undefined) {
      let s2 = this._getOrReturnCtx(e);
      return d4(s2, { code: c2.invalid_type, expected: u3.void, received: s2.parsedType }), p3;
    }
    return k3(e.data);
  }
};
ie2.create = (r31) => new ie2({ typeName: m4.ZodVoid, ...y4(r31) });
var $3 = class r7 extends _5 {
  static {
    __name(this, "r");
  }
  _parse(e) {
    let { ctx: t, status: s2 } = this._processInputParams(e), a = this._def;
    if (t.parsedType !== u3.array) return d4(t, { code: c2.invalid_type, expected: u3.array, received: t.parsedType }), p3;
    if (a.exactLength !== null) {
      let i2 = t.data.length > a.exactLength.value, o3 = t.data.length < a.exactLength.value;
      (i2 || o3) && (d4(t, { code: i2 ? c2.too_big : c2.too_small, minimum: o3 ? a.exactLength.value : void 0, maximum: i2 ? a.exactLength.value : void 0, type: "array", inclusive: true, exact: true, message: a.exactLength.message }), s2.dirty());
    }
    if (a.minLength !== null && t.data.length < a.minLength.value && (d4(t, { code: c2.too_small, minimum: a.minLength.value, type: "array", inclusive: true, exact: false, message: a.minLength.message }), s2.dirty()), a.maxLength !== null && t.data.length > a.maxLength.value && (d4(t, { code: c2.too_big, maximum: a.maxLength.value, type: "array", inclusive: true, exact: false, message: a.maxLength.message }), s2.dirty()), t.common.async) return Promise.all([...t.data].map((i2, o3) => a.type._parseAsync(new O3(t, i2, t.path, o3)))).then((i2) => x5.mergeArray(s2, i2));
    let n2 = [...t.data].map((i2, o3) => a.type._parseSync(new O3(t, i2, t.path, o3)));
    return x5.mergeArray(s2, n2);
  }
  get element() {
    return this._def.type;
  }
  min(e, t) {
    return new r7({ ...this._def, minLength: { value: e, message: h4.toString(t) } });
  }
  max(e, t) {
    return new r7({ ...this._def, maxLength: { value: e, message: h4.toString(t) } });
  }
  length(e, t) {
    return new r7({ ...this._def, exactLength: { value: e, message: h4.toString(t) } });
  }
  nonempty(e) {
    return this.min(1, e);
  }
};
$3.create = (r31, e) => new $3({ type: r31, minLength: null, maxLength: null, exactLength: null, typeName: m4.ZodArray, ...y4(e) });
function ae2(r31) {
  if (r31 instanceof w4) {
    let e = {};
    for (let t in r31.shape) {
      let s2 = r31.shape[t];
      e[t] = C3.create(ae2(s2));
    }
    return new w4({ ...r31._def, shape: /* @__PURE__ */ __name(() => e, "shape") });
  } else return r31 instanceof $3 ? new $3({ ...r31._def, type: ae2(r31.element) }) : r31 instanceof C3 ? C3.create(ae2(r31.unwrap())) : r31 instanceof j4 ? j4.create(ae2(r31.unwrap())) : r31 instanceof N2 ? N2.create(r31.items.map((e) => ae2(e))) : r31;
}
__name(ae2, "ae");
var w4 = class r8 extends _5 {
  static {
    __name(this, "r");
  }
  constructor() {
    super(...arguments), this._cached = null, this.nonstrict = this.passthrough, this.augment = this.extend;
  }
  _getCached() {
    if (this._cached !== null) return this._cached;
    let e = this._def.shape(), t = g5.objectKeys(e);
    return this._cached = { shape: e, keys: t }, this._cached;
  }
  _parse(e) {
    if (this._getType(e) !== u3.object) {
      let l6 = this._getOrReturnCtx(e);
      return d4(l6, { code: c2.invalid_type, expected: u3.object, received: l6.parsedType }), p3;
    }
    let { status: s2, ctx: a } = this._processInputParams(e), { shape: n2, keys: i2 } = this._getCached(), o3 = [];
    if (!(this._def.catchall instanceof A3 && this._def.unknownKeys === "strip")) for (let l6 in a.data) i2.includes(l6) || o3.push(l6);
    let f4 = [];
    for (let l6 of i2) {
      let v5 = n2[l6], T7 = a.data[l6];
      f4.push({ key: { status: "valid", value: l6 }, value: v5._parse(new O3(a, T7, a.path, l6)), alwaysSet: l6 in a.data });
    }
    if (this._def.catchall instanceof A3) {
      let l6 = this._def.unknownKeys;
      if (l6 === "passthrough") for (let v5 of o3) f4.push({ key: { status: "valid", value: v5 }, value: { status: "valid", value: a.data[v5] } });
      else if (l6 === "strict") o3.length > 0 && (d4(a, { code: c2.unrecognized_keys, keys: o3 }), s2.dirty());
      else if (l6 !== "strip") throw new Error("Internal ZodObject error: invalid unknownKeys value.");
    } else {
      let l6 = this._def.catchall;
      for (let v5 of o3) {
        let T7 = a.data[v5];
        f4.push({ key: { status: "valid", value: v5 }, value: l6._parse(new O3(a, T7, a.path, v5)), alwaysSet: v5 in a.data });
      }
    }
    return a.common.async ? Promise.resolve().then(async () => {
      let l6 = [];
      for (let v5 of f4) {
        let T7 = await v5.key, we3 = await v5.value;
        l6.push({ key: T7, value: we3, alwaysSet: v5.alwaysSet });
      }
      return l6;
    }).then((l6) => x5.mergeObjectSync(s2, l6)) : x5.mergeObjectSync(s2, f4);
  }
  get shape() {
    return this._def.shape();
  }
  strict(e) {
    return h4.errToObj, new r8({ ...this._def, unknownKeys: "strict", ...e !== void 0 ? { errorMap: /* @__PURE__ */ __name((t, s2) => {
      let a = this._def.errorMap?.(t, s2).message ?? s2.defaultError;
      return t.code === "unrecognized_keys" ? { message: h4.errToObj(e).message ?? a } : { message: a };
    }, "errorMap") } : {} });
  }
  strip() {
    return new r8({ ...this._def, unknownKeys: "strip" });
  }
  passthrough() {
    return new r8({ ...this._def, unknownKeys: "passthrough" });
  }
  extend(e) {
    return new r8({ ...this._def, shape: /* @__PURE__ */ __name(() => ({ ...this._def.shape(), ...e }), "shape") });
  }
  merge(e) {
    return new r8({ unknownKeys: e._def.unknownKeys, catchall: e._def.catchall, shape: /* @__PURE__ */ __name(() => ({ ...this._def.shape(), ...e._def.shape() }), "shape"), typeName: m4.ZodObject });
  }
  setKey(e, t) {
    return this.augment({ [e]: t });
  }
  catchall(e) {
    return new r8({ ...this._def, catchall: e });
  }
  pick(e) {
    let t = {};
    for (let s2 of g5.objectKeys(e)) e[s2] && this.shape[s2] && (t[s2] = this.shape[s2]);
    return new r8({ ...this._def, shape: /* @__PURE__ */ __name(() => t, "shape") });
  }
  omit(e) {
    let t = {};
    for (let s2 of g5.objectKeys(this.shape)) e[s2] || (t[s2] = this.shape[s2]);
    return new r8({ ...this._def, shape: /* @__PURE__ */ __name(() => t, "shape") });
  }
  deepPartial() {
    return ae2(this);
  }
  partial(e) {
    let t = {};
    for (let s2 of g5.objectKeys(this.shape)) {
      let a = this.shape[s2];
      e && !e[s2] ? t[s2] = a : t[s2] = a.optional();
    }
    return new r8({ ...this._def, shape: /* @__PURE__ */ __name(() => t, "shape") });
  }
  required(e) {
    let t = {};
    for (let s2 of g5.objectKeys(this.shape)) if (e && !e[s2]) t[s2] = this.shape[s2];
    else {
      let n2 = this.shape[s2];
      for (; n2 instanceof C3; ) n2 = n2._def.innerType;
      t[s2] = n2;
    }
    return new r8({ ...this._def, shape: /* @__PURE__ */ __name(() => t, "shape") });
  }
  keyof() {
    return Ne2(g5.objectKeys(this.shape));
  }
};
w4.create = (r31, e) => new w4({ shape: /* @__PURE__ */ __name(() => r31, "shape"), unknownKeys: "strip", catchall: A3.create(), typeName: m4.ZodObject, ...y4(e) });
w4.strictCreate = (r31, e) => new w4({ shape: /* @__PURE__ */ __name(() => r31, "shape"), unknownKeys: "strict", catchall: A3.create(), typeName: m4.ZodObject, ...y4(e) });
w4.lazycreate = (r31, e) => new w4({ shape: r31, unknownKeys: "strip", catchall: A3.create(), typeName: m4.ZodObject, ...y4(e) });
var J3 = class extends _5 {
  static {
    __name(this, "J");
  }
  _parse(e) {
    let { ctx: t } = this._processInputParams(e), s2 = this._def.options;
    function a(n2) {
      for (let o3 of n2) if (o3.result.status === "valid") return o3.result;
      for (let o3 of n2) if (o3.result.status === "dirty") return t.common.issues.push(...o3.ctx.common.issues), o3.result;
      let i2 = n2.map((o3) => new b3(o3.ctx.common.issues));
      return d4(t, { code: c2.invalid_union, unionErrors: i2 }), p3;
    }
    __name(a, "a");
    if (t.common.async) return Promise.all(s2.map(async (n2) => {
      let i2 = { ...t, common: { ...t.common, issues: [] }, parent: null };
      return { result: await n2._parseAsync({ data: t.data, path: t.path, parent: i2 }), ctx: i2 };
    })).then(a);
    {
      let n2, i2 = [];
      for (let f4 of s2) {
        let l6 = { ...t, common: { ...t.common, issues: [] }, parent: null }, v5 = f4._parseSync({ data: t.data, path: t.path, parent: l6 });
        if (v5.status === "valid") return v5;
        v5.status === "dirty" && !n2 && (n2 = { result: v5, ctx: l6 }), l6.common.issues.length && i2.push(l6.common.issues);
      }
      if (n2) return t.common.issues.push(...n2.ctx.common.issues), n2.result;
      let o3 = i2.map((f4) => new b3(f4));
      return d4(t, { code: c2.invalid_union, unionErrors: o3 }), p3;
    }
  }
  get options() {
    return this._def.options;
  }
};
J3.create = (r31, e) => new J3({ options: r31, typeName: m4.ZodUnion, ...y4(e) });
var E3 = /* @__PURE__ */ __name((r31) => r31 instanceof H2 ? E3(r31.schema) : r31 instanceof S4 ? E3(r31.innerType()) : r31 instanceof G3 ? [r31.value] : r31 instanceof Q4 ? r31.options : r31 instanceof X3 ? g5.objectValues(r31.enum) : r31 instanceof K3 ? E3(r31._def.innerType) : r31 instanceof W5 ? [void 0] : r31 instanceof q4 ? [null] : r31 instanceof C3 ? [void 0, ...E3(r31.unwrap())] : r31 instanceof j4 ? [null, ...E3(r31.unwrap())] : r31 instanceof le2 || r31 instanceof te2 ? E3(r31.unwrap()) : r31 instanceof ee2 ? E3(r31._def.innerType) : [], "E");
var me2 = class r9 extends _5 {
  static {
    __name(this, "r");
  }
  _parse(e) {
    let { ctx: t } = this._processInputParams(e);
    if (t.parsedType !== u3.object) return d4(t, { code: c2.invalid_type, expected: u3.object, received: t.parsedType }), p3;
    let s2 = this.discriminator, a = t.data[s2], n2 = this.optionsMap.get(a);
    return n2 ? t.common.async ? n2._parseAsync({ data: t.data, path: t.path, parent: t }) : n2._parseSync({ data: t.data, path: t.path, parent: t }) : (d4(t, { code: c2.invalid_union_discriminator, options: Array.from(this.optionsMap.keys()), path: [s2] }), p3);
  }
  get discriminator() {
    return this._def.discriminator;
  }
  get options() {
    return this._def.options;
  }
  get optionsMap() {
    return this._def.optionsMap;
  }
  static create(e, t, s2) {
    let a = /* @__PURE__ */ new Map();
    for (let n2 of t) {
      let i2 = E3(n2.shape[e]);
      if (!i2.length) throw new Error(`A discriminator value for key \`${e}\` could not be extracted from all schema options`);
      for (let o3 of i2) {
        if (a.has(o3)) throw new Error(`Discriminator property ${String(e)} has duplicate value ${String(o3)}`);
        a.set(o3, n2);
      }
    }
    return new r9({ typeName: m4.ZodDiscriminatedUnion, discriminator: e, options: t, optionsMap: a, ...y4(s2) });
  }
};
function ke2(r31, e) {
  let t = R3(r31), s2 = R3(e);
  if (r31 === e) return { valid: true, data: r31 };
  if (t === u3.object && s2 === u3.object) {
    let a = g5.objectKeys(e), n2 = g5.objectKeys(r31).filter((o3) => a.indexOf(o3) !== -1), i2 = { ...r31, ...e };
    for (let o3 of n2) {
      let f4 = ke2(r31[o3], e[o3]);
      if (!f4.valid) return { valid: false };
      i2[o3] = f4.data;
    }
    return { valid: true, data: i2 };
  } else if (t === u3.array && s2 === u3.array) {
    if (r31.length !== e.length) return { valid: false };
    let a = [];
    for (let n2 = 0; n2 < r31.length; n2++) {
      let i2 = r31[n2], o3 = e[n2], f4 = ke2(i2, o3);
      if (!f4.valid) return { valid: false };
      a.push(f4.data);
    }
    return { valid: true, data: a };
  } else return t === u3.date && s2 === u3.date && +r31 == +e ? { valid: true, data: r31 } : { valid: false };
}
__name(ke2, "ke");
var Y2 = class extends _5 {
  static {
    __name(this, "Y");
  }
  _parse(e) {
    let { status: t, ctx: s2 } = this._processInputParams(e), a = /* @__PURE__ */ __name((n2, i2) => {
      if (he2(n2) || he2(i2)) return p3;
      let o3 = ke2(n2.value, i2.value);
      return o3.valid ? ((pe2(n2) || pe2(i2)) && t.dirty(), { status: t.value, value: o3.data }) : (d4(s2, { code: c2.invalid_intersection_types }), p3);
    }, "a");
    return s2.common.async ? Promise.all([this._def.left._parseAsync({ data: s2.data, path: s2.path, parent: s2 }), this._def.right._parseAsync({ data: s2.data, path: s2.path, parent: s2 })]).then(([n2, i2]) => a(n2, i2)) : a(this._def.left._parseSync({ data: s2.data, path: s2.path, parent: s2 }), this._def.right._parseSync({ data: s2.data, path: s2.path, parent: s2 }));
  }
};
Y2.create = (r31, e, t) => new Y2({ left: r31, right: e, typeName: m4.ZodIntersection, ...y4(t) });
var N2 = class r10 extends _5 {
  static {
    __name(this, "r");
  }
  _parse(e) {
    let { status: t, ctx: s2 } = this._processInputParams(e);
    if (s2.parsedType !== u3.array) return d4(s2, { code: c2.invalid_type, expected: u3.array, received: s2.parsedType }), p3;
    if (s2.data.length < this._def.items.length) return d4(s2, { code: c2.too_small, minimum: this._def.items.length, inclusive: true, exact: false, type: "array" }), p3;
    !this._def.rest && s2.data.length > this._def.items.length && (d4(s2, { code: c2.too_big, maximum: this._def.items.length, inclusive: true, exact: false, type: "array" }), t.dirty());
    let n2 = [...s2.data].map((i2, o3) => {
      let f4 = this._def.items[o3] || this._def.rest;
      return f4 ? f4._parse(new O3(s2, i2, s2.path, o3)) : null;
    }).filter((i2) => !!i2);
    return s2.common.async ? Promise.all(n2).then((i2) => x5.mergeArray(t, i2)) : x5.mergeArray(t, n2);
  }
  get items() {
    return this._def.items;
  }
  rest(e) {
    return new r10({ ...this._def, rest: e });
  }
};
N2.create = (r31, e) => {
  if (!Array.isArray(r31)) throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
  return new N2({ items: r31, typeName: m4.ZodTuple, rest: null, ...y4(e) });
};
var ye2 = class r11 extends _5 {
  static {
    __name(this, "r");
  }
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(e) {
    let { status: t, ctx: s2 } = this._processInputParams(e);
    if (s2.parsedType !== u3.object) return d4(s2, { code: c2.invalid_type, expected: u3.object, received: s2.parsedType }), p3;
    let a = [], n2 = this._def.keyType, i2 = this._def.valueType;
    for (let o3 in s2.data) a.push({ key: n2._parse(new O3(s2, o3, s2.path, o3)), value: i2._parse(new O3(s2, s2.data[o3], s2.path, o3)), alwaysSet: o3 in s2.data });
    return s2.common.async ? x5.mergeObjectAsync(t, a) : x5.mergeObjectSync(t, a);
  }
  get element() {
    return this._def.valueType;
  }
  static create(e, t, s2) {
    return t instanceof _5 ? new r11({ keyType: e, valueType: t, typeName: m4.ZodRecord, ...y4(s2) }) : new r11({ keyType: V4.create(), valueType: e, typeName: m4.ZodRecord, ...y4(t) });
  }
};
var oe2 = class extends _5 {
  static {
    __name(this, "oe");
  }
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(e) {
    let { status: t, ctx: s2 } = this._processInputParams(e);
    if (s2.parsedType !== u3.map) return d4(s2, { code: c2.invalid_type, expected: u3.map, received: s2.parsedType }), p3;
    let a = this._def.keyType, n2 = this._def.valueType, i2 = [...s2.data.entries()].map(([o3, f4], l6) => ({ key: a._parse(new O3(s2, o3, s2.path, [l6, "key"])), value: n2._parse(new O3(s2, f4, s2.path, [l6, "value"])) }));
    if (s2.common.async) {
      let o3 = /* @__PURE__ */ new Map();
      return Promise.resolve().then(async () => {
        for (let f4 of i2) {
          let l6 = await f4.key, v5 = await f4.value;
          if (l6.status === "aborted" || v5.status === "aborted") return p3;
          (l6.status === "dirty" || v5.status === "dirty") && t.dirty(), o3.set(l6.value, v5.value);
        }
        return { status: t.value, value: o3 };
      });
    } else {
      let o3 = /* @__PURE__ */ new Map();
      for (let f4 of i2) {
        let l6 = f4.key, v5 = f4.value;
        if (l6.status === "aborted" || v5.status === "aborted") return p3;
        (l6.status === "dirty" || v5.status === "dirty") && t.dirty(), o3.set(l6.value, v5.value);
      }
      return { status: t.value, value: o3 };
    }
  }
};
oe2.create = (r31, e, t) => new oe2({ valueType: e, keyType: r31, typeName: m4.ZodMap, ...y4(t) });
var ce2 = class r12 extends _5 {
  static {
    __name(this, "r");
  }
  _parse(e) {
    let { status: t, ctx: s2 } = this._processInputParams(e);
    if (s2.parsedType !== u3.set) return d4(s2, { code: c2.invalid_type, expected: u3.set, received: s2.parsedType }), p3;
    let a = this._def;
    a.minSize !== null && s2.data.size < a.minSize.value && (d4(s2, { code: c2.too_small, minimum: a.minSize.value, type: "set", inclusive: true, exact: false, message: a.minSize.message }), t.dirty()), a.maxSize !== null && s2.data.size > a.maxSize.value && (d4(s2, { code: c2.too_big, maximum: a.maxSize.value, type: "set", inclusive: true, exact: false, message: a.maxSize.message }), t.dirty());
    let n2 = this._def.valueType;
    function i2(f4) {
      let l6 = /* @__PURE__ */ new Set();
      for (let v5 of f4) {
        if (v5.status === "aborted") return p3;
        v5.status === "dirty" && t.dirty(), l6.add(v5.value);
      }
      return { status: t.value, value: l6 };
    }
    __name(i2, "i");
    let o3 = [...s2.data.values()].map((f4, l6) => n2._parse(new O3(s2, f4, s2.path, l6)));
    return s2.common.async ? Promise.all(o3).then((f4) => i2(f4)) : i2(o3);
  }
  min(e, t) {
    return new r12({ ...this._def, minSize: { value: e, message: h4.toString(t) } });
  }
  max(e, t) {
    return new r12({ ...this._def, maxSize: { value: e, message: h4.toString(t) } });
  }
  size(e, t) {
    return this.min(e, t).max(e, t);
  }
  nonempty(e) {
    return this.min(1, e);
  }
};
ce2.create = (r31, e) => new ce2({ valueType: r31, minSize: null, maxSize: null, typeName: m4.ZodSet, ...y4(e) });
var _e2 = class r13 extends _5 {
  static {
    __name(this, "r");
  }
  constructor() {
    super(...arguments), this.validate = this.implement;
  }
  _parse(e) {
    let { ctx: t } = this._processInputParams(e);
    if (t.parsedType !== u3.function) return d4(t, { code: c2.invalid_type, expected: u3.function, received: t.parsedType }), p3;
    function s2(o3, f4) {
      return ue2({ data: o3, path: t.path, errorMaps: [t.common.contextualErrorMap, t.schemaErrorMap, re2(), I5].filter((l6) => !!l6), issueData: { code: c2.invalid_arguments, argumentsError: f4 } });
    }
    __name(s2, "s");
    function a(o3, f4) {
      return ue2({ data: o3, path: t.path, errorMaps: [t.common.contextualErrorMap, t.schemaErrorMap, re2(), I5].filter((l6) => !!l6), issueData: { code: c2.invalid_return_type, returnTypeError: f4 } });
    }
    __name(a, "a");
    let n2 = { errorMap: t.common.contextualErrorMap }, i2 = t.data;
    if (this._def.returns instanceof z3) {
      let o3 = this;
      return k3(async function(...f4) {
        let l6 = new b3([]), v5 = await o3._def.args.parseAsync(f4, n2).catch((ge4) => {
          throw l6.addIssue(s2(f4, ge4)), l6;
        }), T7 = await Reflect.apply(i2, this, v5);
        return await o3._def.returns._def.type.parseAsync(T7, n2).catch((ge4) => {
          throw l6.addIssue(a(T7, ge4)), l6;
        });
      });
    } else {
      let o3 = this;
      return k3(function(...f4) {
        let l6 = o3._def.args.safeParse(f4, n2);
        if (!l6.success) throw new b3([s2(f4, l6.error)]);
        let v5 = Reflect.apply(i2, this, l6.data), T7 = o3._def.returns.safeParse(v5, n2);
        if (!T7.success) throw new b3([a(v5, T7.error)]);
        return T7.data;
      });
    }
  }
  parameters() {
    return this._def.args;
  }
  returnType() {
    return this._def.returns;
  }
  args(...e) {
    return new r13({ ...this._def, args: N2.create(e).rest(Z2.create()) });
  }
  returns(e) {
    return new r13({ ...this._def, returns: e });
  }
  implement(e) {
    return this.parse(e);
  }
  strictImplement(e) {
    return this.parse(e);
  }
  static create(e, t, s2) {
    return new r13({ args: e || N2.create([]).rest(Z2.create()), returns: t || Z2.create(), typeName: m4.ZodFunction, ...y4(s2) });
  }
};
var H2 = class extends _5 {
  static {
    __name(this, "H");
  }
  get schema() {
    return this._def.getter();
  }
  _parse(e) {
    let { ctx: t } = this._processInputParams(e);
    return this._def.getter()._parse({ data: t.data, path: t.path, parent: t });
  }
};
H2.create = (r31, e) => new H2({ getter: r31, typeName: m4.ZodLazy, ...y4(e) });
var G3 = class extends _5 {
  static {
    __name(this, "G");
  }
  _parse(e) {
    if (e.data !== this._def.value) {
      let t = this._getOrReturnCtx(e);
      return d4(t, { received: t.data, code: c2.invalid_literal, expected: this._def.value }), p3;
    }
    return { status: "valid", value: e.data };
  }
  get value() {
    return this._def.value;
  }
};
G3.create = (r31, e) => new G3({ value: r31, typeName: m4.ZodLiteral, ...y4(e) });
function Ne2(r31, e) {
  return new Q4({ values: r31, typeName: m4.ZodEnum, ...y4(e) });
}
__name(Ne2, "Ne");
var Q4 = class r14 extends _5 {
  static {
    __name(this, "r");
  }
  _parse(e) {
    if (typeof e.data != "string") {
      let t = this._getOrReturnCtx(e), s2 = this._def.values;
      return d4(t, { expected: g5.joinValues(s2), received: t.parsedType, code: c2.invalid_type }), p3;
    }
    if (this._cache || (this._cache = new Set(this._def.values)), !this._cache.has(e.data)) {
      let t = this._getOrReturnCtx(e), s2 = this._def.values;
      return d4(t, { received: t.data, code: c2.invalid_enum_value, options: s2 }), p3;
    }
    return k3(e.data);
  }
  get options() {
    return this._def.values;
  }
  get enum() {
    let e = {};
    for (let t of this._def.values) e[t] = t;
    return e;
  }
  get Values() {
    let e = {};
    for (let t of this._def.values) e[t] = t;
    return e;
  }
  get Enum() {
    let e = {};
    for (let t of this._def.values) e[t] = t;
    return e;
  }
  extract(e, t = this._def) {
    return r14.create(e, { ...this._def, ...t });
  }
  exclude(e, t = this._def) {
    return r14.create(this.options.filter((s2) => !e.includes(s2)), { ...this._def, ...t });
  }
};
Q4.create = Ne2;
var X3 = class extends _5 {
  static {
    __name(this, "X");
  }
  _parse(e) {
    let t = g5.getValidEnumValues(this._def.values), s2 = this._getOrReturnCtx(e);
    if (s2.parsedType !== u3.string && s2.parsedType !== u3.number) {
      let a = g5.objectValues(t);
      return d4(s2, { expected: g5.joinValues(a), received: s2.parsedType, code: c2.invalid_type }), p3;
    }
    if (this._cache || (this._cache = new Set(g5.getValidEnumValues(this._def.values))), !this._cache.has(e.data)) {
      let a = g5.objectValues(t);
      return d4(s2, { received: s2.data, code: c2.invalid_enum_value, options: a }), p3;
    }
    return k3(e.data);
  }
  get enum() {
    return this._def.values;
  }
};
X3.create = (r31, e) => new X3({ values: r31, typeName: m4.ZodNativeEnum, ...y4(e) });
var z3 = class extends _5 {
  static {
    __name(this, "z");
  }
  unwrap() {
    return this._def.type;
  }
  _parse(e) {
    let { ctx: t } = this._processInputParams(e);
    if (t.parsedType !== u3.promise && t.common.async === false) return d4(t, { code: c2.invalid_type, expected: u3.promise, received: t.parsedType }), p3;
    let s2 = t.parsedType === u3.promise ? t.data : Promise.resolve(t.data);
    return k3(s2.then((a) => this._def.type.parseAsync(a, { path: t.path, errorMap: t.common.contextualErrorMap })));
  }
};
z3.create = (r31, e) => new z3({ type: r31, typeName: m4.ZodPromise, ...y4(e) });
var S4 = class extends _5 {
  static {
    __name(this, "S");
  }
  innerType() {
    return this._def.schema;
  }
  sourceType() {
    return this._def.schema._def.typeName === m4.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
  }
  _parse(e) {
    let { status: t, ctx: s2 } = this._processInputParams(e), a = this._def.effect || null, n2 = { addIssue: /* @__PURE__ */ __name((i2) => {
      d4(s2, i2), i2.fatal ? t.abort() : t.dirty();
    }, "addIssue"), get path() {
      return s2.path;
    } };
    if (n2.addIssue = n2.addIssue.bind(n2), a.type === "preprocess") {
      let i2 = a.transform(s2.data, n2);
      if (s2.common.async) return Promise.resolve(i2).then(async (o3) => {
        if (t.value === "aborted") return p3;
        let f4 = await this._def.schema._parseAsync({ data: o3, path: s2.path, parent: s2 });
        return f4.status === "aborted" ? p3 : f4.status === "dirty" ? D3(f4.value) : t.value === "dirty" ? D3(f4.value) : f4;
      });
      {
        if (t.value === "aborted") return p3;
        let o3 = this._def.schema._parseSync({ data: i2, path: s2.path, parent: s2 });
        return o3.status === "aborted" ? p3 : o3.status === "dirty" ? D3(o3.value) : t.value === "dirty" ? D3(o3.value) : o3;
      }
    }
    if (a.type === "refinement") {
      let i2 = /* @__PURE__ */ __name((o3) => {
        let f4 = a.refinement(o3, n2);
        if (s2.common.async) return Promise.resolve(f4);
        if (f4 instanceof Promise) throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
        return o3;
      }, "i");
      if (s2.common.async === false) {
        let o3 = this._def.schema._parseSync({ data: s2.data, path: s2.path, parent: s2 });
        return o3.status === "aborted" ? p3 : (o3.status === "dirty" && t.dirty(), i2(o3.value), { status: t.value, value: o3.value });
      } else return this._def.schema._parseAsync({ data: s2.data, path: s2.path, parent: s2 }).then((o3) => o3.status === "aborted" ? p3 : (o3.status === "dirty" && t.dirty(), i2(o3.value).then(() => ({ status: t.value, value: o3.value }))));
    }
    if (a.type === "transform") if (s2.common.async === false) {
      let i2 = this._def.schema._parseSync({ data: s2.data, path: s2.path, parent: s2 });
      if (!M3(i2)) return p3;
      let o3 = a.transform(i2.value, n2);
      if (o3 instanceof Promise) throw new Error("Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.");
      return { status: t.value, value: o3 };
    } else return this._def.schema._parseAsync({ data: s2.data, path: s2.path, parent: s2 }).then((i2) => M3(i2) ? Promise.resolve(a.transform(i2.value, n2)).then((o3) => ({ status: t.value, value: o3 })) : p3);
    g5.assertNever(a);
  }
};
S4.create = (r31, e, t) => new S4({ schema: r31, typeName: m4.ZodEffects, effect: e, ...y4(t) });
S4.createWithPreprocess = (r31, e, t) => new S4({ schema: e, effect: { type: "preprocess", transform: r31 }, typeName: m4.ZodEffects, ...y4(t) });
var C3 = class extends _5 {
  static {
    __name(this, "C");
  }
  _parse(e) {
    return this._getType(e) === u3.undefined ? k3(void 0) : this._def.innerType._parse(e);
  }
  unwrap() {
    return this._def.innerType;
  }
};
C3.create = (r31, e) => new C3({ innerType: r31, typeName: m4.ZodOptional, ...y4(e) });
var j4 = class extends _5 {
  static {
    __name(this, "j");
  }
  _parse(e) {
    return this._getType(e) === u3.null ? k3(null) : this._def.innerType._parse(e);
  }
  unwrap() {
    return this._def.innerType;
  }
};
j4.create = (r31, e) => new j4({ innerType: r31, typeName: m4.ZodNullable, ...y4(e) });
var K3 = class extends _5 {
  static {
    __name(this, "K");
  }
  _parse(e) {
    let { ctx: t } = this._processInputParams(e), s2 = t.data;
    return t.parsedType === u3.undefined && (s2 = this._def.defaultValue()), this._def.innerType._parse({ data: s2, path: t.path, parent: t });
  }
  removeDefault() {
    return this._def.innerType;
  }
};
K3.create = (r31, e) => new K3({ innerType: r31, typeName: m4.ZodDefault, defaultValue: typeof e.default == "function" ? e.default : () => e.default, ...y4(e) });
var ee2 = class extends _5 {
  static {
    __name(this, "ee");
  }
  _parse(e) {
    let { ctx: t } = this._processInputParams(e), s2 = { ...t, common: { ...t.common, issues: [] } }, a = this._def.innerType._parse({ data: s2.data, path: s2.path, parent: { ...s2 } });
    return se2(a) ? a.then((n2) => ({ status: "valid", value: n2.status === "valid" ? n2.value : this._def.catchValue({ get error() {
      return new b3(s2.common.issues);
    }, input: s2.data }) })) : { status: "valid", value: a.status === "valid" ? a.value : this._def.catchValue({ get error() {
      return new b3(s2.common.issues);
    }, input: s2.data }) };
  }
  removeCatch() {
    return this._def.innerType;
  }
};
ee2.create = (r31, e) => new ee2({ innerType: r31, typeName: m4.ZodCatch, catchValue: typeof e.catch == "function" ? e.catch : () => e.catch, ...y4(e) });
var de2 = class extends _5 {
  static {
    __name(this, "de");
  }
  _parse(e) {
    if (this._getType(e) !== u3.nan) {
      let s2 = this._getOrReturnCtx(e);
      return d4(s2, { code: c2.invalid_type, expected: u3.nan, received: s2.parsedType }), p3;
    }
    return { status: "valid", value: e.data };
  }
};
de2.create = (r31) => new de2({ typeName: m4.ZodNaN, ...y4(r31) });
var ct2 = Symbol("zod_brand");
var le2 = class extends _5 {
  static {
    __name(this, "le");
  }
  _parse(e) {
    let { ctx: t } = this._processInputParams(e), s2 = t.data;
    return this._def.type._parse({ data: s2, path: t.path, parent: t });
  }
  unwrap() {
    return this._def.type;
  }
};
var fe2 = class r15 extends _5 {
  static {
    __name(this, "r");
  }
  _parse(e) {
    let { status: t, ctx: s2 } = this._processInputParams(e);
    if (s2.common.async) return (async () => {
      let n2 = await this._def.in._parseAsync({ data: s2.data, path: s2.path, parent: s2 });
      return n2.status === "aborted" ? p3 : n2.status === "dirty" ? (t.dirty(), D3(n2.value)) : this._def.out._parseAsync({ data: n2.value, path: s2.path, parent: s2 });
    })();
    {
      let a = this._def.in._parseSync({ data: s2.data, path: s2.path, parent: s2 });
      return a.status === "aborted" ? p3 : a.status === "dirty" ? (t.dirty(), { status: "dirty", value: a.value }) : this._def.out._parseSync({ data: a.value, path: s2.path, parent: s2 });
    }
  }
  static create(e, t) {
    return new r15({ in: e, out: t, typeName: m4.ZodPipeline });
  }
};
var te2 = class extends _5 {
  static {
    __name(this, "te");
  }
  _parse(e) {
    let t = this._def.innerType._parse(e), s2 = /* @__PURE__ */ __name((a) => (M3(a) && (a.value = Object.freeze(a.value)), a), "s");
    return se2(t) ? t.then((a) => s2(a)) : s2(t);
  }
  unwrap() {
    return this._def.innerType;
  }
};
te2.create = (r31, e) => new te2({ innerType: r31, typeName: m4.ZodReadonly, ...y4(e) });
function Oe2(r31, e) {
  let t = typeof r31 == "function" ? r31(e) : typeof r31 == "string" ? { message: r31 } : r31;
  return typeof t == "string" ? { message: t } : t;
}
__name(Oe2, "Oe");
function je2(r31, e = {}, t) {
  return r31 ? P2.create().superRefine((s2, a) => {
    let n2 = r31(s2);
    if (n2 instanceof Promise) return n2.then((i2) => {
      if (!i2) {
        let o3 = Oe2(e, s2), f4 = o3.fatal ?? t ?? true;
        a.addIssue({ code: "custom", ...o3, fatal: f4 });
      }
    });
    if (!n2) {
      let i2 = Oe2(e, s2), o3 = i2.fatal ?? t ?? true;
      a.addIssue({ code: "custom", ...i2, fatal: o3 });
    }
  }) : P2.create();
}
__name(je2, "je");
var dt = { object: w4.lazycreate };
var m4;
(function(r31) {
  r31.ZodString = "ZodString", r31.ZodNumber = "ZodNumber", r31.ZodNaN = "ZodNaN", r31.ZodBigInt = "ZodBigInt", r31.ZodBoolean = "ZodBoolean", r31.ZodDate = "ZodDate", r31.ZodSymbol = "ZodSymbol", r31.ZodUndefined = "ZodUndefined", r31.ZodNull = "ZodNull", r31.ZodAny = "ZodAny", r31.ZodUnknown = "ZodUnknown", r31.ZodNever = "ZodNever", r31.ZodVoid = "ZodVoid", r31.ZodArray = "ZodArray", r31.ZodObject = "ZodObject", r31.ZodUnion = "ZodUnion", r31.ZodDiscriminatedUnion = "ZodDiscriminatedUnion", r31.ZodIntersection = "ZodIntersection", r31.ZodTuple = "ZodTuple", r31.ZodRecord = "ZodRecord", r31.ZodMap = "ZodMap", r31.ZodSet = "ZodSet", r31.ZodFunction = "ZodFunction", r31.ZodLazy = "ZodLazy", r31.ZodLiteral = "ZodLiteral", r31.ZodEnum = "ZodEnum", r31.ZodEffects = "ZodEffects", r31.ZodNativeEnum = "ZodNativeEnum", r31.ZodOptional = "ZodOptional", r31.ZodNullable = "ZodNullable", r31.ZodDefault = "ZodDefault", r31.ZodCatch = "ZodCatch", r31.ZodPromise = "ZodPromise", r31.ZodBranded = "ZodBranded", r31.ZodPipeline = "ZodPipeline", r31.ZodReadonly = "ZodReadonly";
})(m4 || (m4 = {}));
var ut = /* @__PURE__ */ __name((r31, e = { message: `Input not instance of ${r31.name}` }) => je2((t) => t instanceof r31, e), "ut");
var Ie2 = V4.create;
var Ee2 = L5.create;
var lt = de2.create;
var ft = U4.create;
var Ze2 = F4.create;
var ht2 = B4.create;
var pt = ne2.create;
var mt = W5.create;
var yt = q4.create;
var _t = P2.create;
var gt = Z2.create;
var vt = A3.create;
var xt = ie2.create;
var kt = $3.create;
var bt = w4.create;
var wt = w4.strictCreate;
var Tt = J3.create;
var Ct = me2.create;
var Ot = Y2.create;
var St = N2.create;
var At = ye2.create;
var Rt = oe2.create;
var Nt = ce2.create;
var jt = _e2.create;
var It = H2.create;
var Et = G3.create;
var Zt = Q4.create;
var $t = X3.create;
var Mt = z3.create;
var Vt = S4.create;
var Pt = C3.create;
var zt = j4.create;
var Dt = S4.createWithPreprocess;
var Lt = fe2.create;
var Ut = /* @__PURE__ */ __name(() => Ie2().optional(), "Ut");
var Ft = /* @__PURE__ */ __name(() => Ee2().optional(), "Ft");
var Bt = /* @__PURE__ */ __name(() => Ze2().optional(), "Bt");
var Wt = { string: /* @__PURE__ */ __name((r31) => V4.create({ ...r31, coerce: true }), "string"), number: /* @__PURE__ */ __name((r31) => L5.create({ ...r31, coerce: true }), "number"), boolean: /* @__PURE__ */ __name((r31) => F4.create({ ...r31, coerce: true }), "boolean"), bigint: /* @__PURE__ */ __name((r31) => U4.create({ ...r31, coerce: true }), "bigint"), date: /* @__PURE__ */ __name((r31) => B4.create({ ...r31, coerce: true }), "date") };
var qt = p3;

// deno:https://esm.sh/zod-to-json-schema@3.24.5/es2022/zod-to-json-schema.mjs
var S5 = Symbol("Let zodToJsonSchema decide on which parser to use");
var Z3 = { name: void 0, $refStrategy: "root", basePath: ["#"], effectStrategy: "input", pipeStrategy: "all", dateStrategy: "format:date-time", mapStrategy: "entries", removeAdditionalStrategy: "passthrough", allowedAdditionalProperties: true, rejectedAdditionalProperties: false, definitionPath: "definitions", target: "jsonSchema7", strictUnions: false, definitions: {}, errorMessages: false, markdownDescription: false, patternStrategy: "escape", applyRegexFlags: false, emailStrategy: "format:email", base64Strategy: "contentEncoding:base64", nameStrategy: "ref" };
var O4 = /* @__PURE__ */ __name((t) => typeof t == "string" ? { ...Z3, name: t } : { ...Z3, ...t }, "O");
var j5 = /* @__PURE__ */ __name((t) => {
  let e = O4(t), r31 = e.name !== void 0 ? [...e.basePath, e.definitionPath, e.name] : e.basePath;
  return { ...e, currentPath: r31, propertyPath: void 0, seen: new Map(Object.entries(e.definitions).map(([n2, a]) => [a._def, { def: a._def, path: [...e.basePath, e.definitionPath, n2], jsonSchema: void 0 }])) };
}, "j");
function D4(t, e, r31, n2) {
  n2?.errorMessages && r31 && (t.errorMessage = { ...t.errorMessage, [e]: r31 });
}
__name(D4, "D");
function u4(t, e, r31, n2, a) {
  t[e] = r31, D4(t, e, n2, a);
}
__name(u4, "u");
function M4() {
  return {};
}
__name(M4, "M");
function T4(t, e) {
  let r31 = { type: "array" };
  return t.type?._def && t.type?._def?.typeName !== m4.ZodAny && (r31.items = o2(t.type._def, { ...e, currentPath: [...e.currentPath, "items"] })), t.minLength && u4(r31, "minItems", t.minLength.value, t.minLength.message, e), t.maxLength && u4(r31, "maxItems", t.maxLength.value, t.maxLength.message, e), t.exactLength && (u4(r31, "minItems", t.exactLength.value, t.exactLength.message, e), u4(r31, "maxItems", t.exactLength.value, t.exactLength.message, e)), r31;
}
__name(T4, "T");
function N3(t, e) {
  let r31 = { type: "integer", format: "int64" };
  if (!t.checks) return r31;
  for (let n2 of t.checks) switch (n2.kind) {
    case "min":
      e.target === "jsonSchema7" ? n2.inclusive ? u4(r31, "minimum", n2.value, n2.message, e) : u4(r31, "exclusiveMinimum", n2.value, n2.message, e) : (n2.inclusive || (r31.exclusiveMinimum = true), u4(r31, "minimum", n2.value, n2.message, e));
      break;
    case "max":
      e.target === "jsonSchema7" ? n2.inclusive ? u4(r31, "maximum", n2.value, n2.message, e) : u4(r31, "exclusiveMaximum", n2.value, n2.message, e) : (n2.inclusive || (r31.exclusiveMaximum = true), u4(r31, "maximum", n2.value, n2.message, e));
      break;
    case "multipleOf":
      u4(r31, "multipleOf", n2.value, n2.message, e);
      break;
  }
  return r31;
}
__name(N3, "N");
function $4() {
  return { type: "boolean" };
}
__name($4, "$");
function x6(t, e) {
  return o2(t.type._def, e);
}
__name(x6, "x");
var w5 = /* @__PURE__ */ __name((t, e) => o2(t.innerType._def, e), "w");
function A4(t, e, r31) {
  let n2 = r31 ?? e.dateStrategy;
  if (Array.isArray(n2)) return { anyOf: n2.map((a, i2) => A4(t, e, a)) };
  switch (n2) {
    case "string":
    case "format:date-time":
      return { type: "string", format: "date-time" };
    case "format:date":
      return { type: "string", format: "date" };
    case "integer":
      return se3(t, e);
  }
}
__name(A4, "A");
var se3 = /* @__PURE__ */ __name((t, e) => {
  let r31 = { type: "integer", format: "unix-time" };
  if (e.target === "openApi3") return r31;
  for (let n2 of t.checks) switch (n2.kind) {
    case "min":
      u4(r31, "minimum", n2.value, n2.message, e);
      break;
    case "max":
      u4(r31, "maximum", n2.value, n2.message, e);
      break;
  }
  return r31;
}, "se");
function E4(t, e) {
  return { ...o2(t.innerType._def, e), default: t.defaultValue() };
}
__name(E4, "E");
function z4(t, e) {
  return e.effectStrategy === "input" ? o2(t.schema._def, e) : {};
}
__name(z4, "z");
function L6(t) {
  return { type: "string", enum: Array.from(t.values) };
}
__name(L6, "L");
var pe3 = /* @__PURE__ */ __name((t) => "type" in t && t.type === "string" ? false : "allOf" in t, "pe");
function F5(t, e) {
  let r31 = [o2(t.left._def, { ...e, currentPath: [...e.currentPath, "allOf", "0"] }), o2(t.right._def, { ...e, currentPath: [...e.currentPath, "allOf", "1"] })].filter((i2) => !!i2), n2 = e.target === "jsonSchema2019-09" ? { unevaluatedProperties: false } : void 0, a = [];
  return r31.forEach((i2) => {
    if (pe3(i2)) a.push(...i2.allOf), i2.unevaluatedProperties === void 0 && (n2 = void 0);
    else {
      let m7 = i2;
      if ("additionalProperties" in i2 && i2.additionalProperties === false) {
        let { additionalProperties: c3, ...s2 } = i2;
        m7 = s2;
      } else n2 = void 0;
      a.push(m7);
    }
  }), a.length ? { allOf: a, ...n2 } : void 0;
}
__name(F5, "F");
function R4(t, e) {
  let r31 = typeof t.value;
  return r31 !== "bigint" && r31 !== "number" && r31 !== "boolean" && r31 !== "string" ? { type: Array.isArray(t.value) ? "array" : "object" } : e.target === "openApi3" ? { type: r31 === "bigint" ? "integer" : r31, enum: [t.value] } : { type: r31 === "bigint" ? "integer" : r31, const: t.value };
}
__name(R4, "R");
var k4;
var f2 = { cuid: /^[cC][^\s-]{8,}$/, cuid2: /^[0-9a-z]+$/, ulid: /^[0-9A-HJKMNP-TV-Z]{26}$/, email: /^(?!\.)(?!.*\.\.)([a-zA-Z0-9_'+\-\.]*)[a-zA-Z0-9_+-]@([a-zA-Z0-9][a-zA-Z0-9\-]*\.)+[a-zA-Z]{2,}$/, emoji: /* @__PURE__ */ __name(() => (k4 === void 0 && (k4 = RegExp("^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$", "u")), k4), "emoji"), uuid: /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/, ipv4: /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/, ipv4Cidr: /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/, ipv6: /^(([a-f0-9]{1,4}:){7}|::([a-f0-9]{1,4}:){0,6}|([a-f0-9]{1,4}:){1}:([a-f0-9]{1,4}:){0,5}|([a-f0-9]{1,4}:){2}:([a-f0-9]{1,4}:){0,4}|([a-f0-9]{1,4}:){3}:([a-f0-9]{1,4}:){0,3}|([a-f0-9]{1,4}:){4}:([a-f0-9]{1,4}:){0,2}|([a-f0-9]{1,4}:){5}:([a-f0-9]{1,4}:){0,1})([a-f0-9]{1,4}|(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2})))$/, ipv6Cidr: /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/, base64: /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/, base64url: /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/, nanoid: /^[a-zA-Z0-9_-]{21}$/, jwt: /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/ };
function v3(t, e) {
  let r31 = { type: "string" };
  if (t.checks) for (let n2 of t.checks) switch (n2.kind) {
    case "min":
      u4(r31, "minLength", typeof r31.minLength == "number" ? Math.max(r31.minLength, n2.value) : n2.value, n2.message, e);
      break;
    case "max":
      u4(r31, "maxLength", typeof r31.maxLength == "number" ? Math.min(r31.maxLength, n2.value) : n2.value, n2.message, e);
      break;
    case "email":
      switch (e.emailStrategy) {
        case "format:email":
          d5(r31, "email", n2.message, e);
          break;
        case "format:idn-email":
          d5(r31, "idn-email", n2.message, e);
          break;
        case "pattern:zod":
          l5(r31, f2.email, n2.message, e);
          break;
      }
      break;
    case "url":
      d5(r31, "uri", n2.message, e);
      break;
    case "uuid":
      d5(r31, "uuid", n2.message, e);
      break;
    case "regex":
      l5(r31, n2.regex, n2.message, e);
      break;
    case "cuid":
      l5(r31, f2.cuid, n2.message, e);
      break;
    case "cuid2":
      l5(r31, f2.cuid2, n2.message, e);
      break;
    case "startsWith":
      l5(r31, RegExp(`^${_6(n2.value, e)}`), n2.message, e);
      break;
    case "endsWith":
      l5(r31, RegExp(`${_6(n2.value, e)}$`), n2.message, e);
      break;
    case "datetime":
      d5(r31, "date-time", n2.message, e);
      break;
    case "date":
      d5(r31, "date", n2.message, e);
      break;
    case "time":
      d5(r31, "time", n2.message, e);
      break;
    case "duration":
      d5(r31, "duration", n2.message, e);
      break;
    case "length":
      u4(r31, "minLength", typeof r31.minLength == "number" ? Math.max(r31.minLength, n2.value) : n2.value, n2.message, e), u4(r31, "maxLength", typeof r31.maxLength == "number" ? Math.min(r31.maxLength, n2.value) : n2.value, n2.message, e);
      break;
    case "includes": {
      l5(r31, RegExp(_6(n2.value, e)), n2.message, e);
      break;
    }
    case "ip": {
      n2.version !== "v6" && d5(r31, "ipv4", n2.message, e), n2.version !== "v4" && d5(r31, "ipv6", n2.message, e);
      break;
    }
    case "base64url":
      l5(r31, f2.base64url, n2.message, e);
      break;
    case "jwt":
      l5(r31, f2.jwt, n2.message, e);
      break;
    case "cidr": {
      n2.version !== "v6" && l5(r31, f2.ipv4Cidr, n2.message, e), n2.version !== "v4" && l5(r31, f2.ipv6Cidr, n2.message, e);
      break;
    }
    case "emoji":
      l5(r31, f2.emoji(), n2.message, e);
      break;
    case "ulid": {
      l5(r31, f2.ulid, n2.message, e);
      break;
    }
    case "base64": {
      switch (e.base64Strategy) {
        case "format:binary": {
          d5(r31, "binary", n2.message, e);
          break;
        }
        case "contentEncoding:base64": {
          u4(r31, "contentEncoding", "base64", n2.message, e);
          break;
        }
        case "pattern:zod": {
          l5(r31, f2.base64, n2.message, e);
          break;
        }
      }
      break;
    }
    case "nanoid":
      l5(r31, f2.nanoid, n2.message, e);
    case "toLowerCase":
    case "toUpperCase":
    case "trim":
      break;
    default:
  }
  return r31;
}
__name(v3, "v");
function _6(t, e) {
  return e.patternStrategy === "escape" ? me3(t) : t;
}
__name(_6, "_");
var ue3 = new Set("ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvxyz0123456789");
function me3(t) {
  let e = "";
  for (let r31 = 0; r31 < t.length; r31++) ue3.has(t[r31]) || (e += "\\"), e += t[r31];
  return e;
}
__name(me3, "me");
function d5(t, e, r31, n2) {
  t.format || t.anyOf?.some((a) => a.format) ? (t.anyOf || (t.anyOf = []), t.format && (t.anyOf.push({ format: t.format, ...t.errorMessage && n2.errorMessages && { errorMessage: { format: t.errorMessage.format } } }), delete t.format, t.errorMessage && (delete t.errorMessage.format, Object.keys(t.errorMessage).length === 0 && delete t.errorMessage)), t.anyOf.push({ format: e, ...r31 && n2.errorMessages && { errorMessage: { format: r31 } } })) : u4(t, "format", e, r31, n2);
}
__name(d5, "d");
function l5(t, e, r31, n2) {
  t.pattern || t.allOf?.some((a) => a.pattern) ? (t.allOf || (t.allOf = []), t.pattern && (t.allOf.push({ pattern: t.pattern, ...t.errorMessage && n2.errorMessages && { errorMessage: { pattern: t.errorMessage.pattern } } }), delete t.pattern, t.errorMessage && (delete t.errorMessage.pattern, Object.keys(t.errorMessage).length === 0 && delete t.errorMessage)), t.allOf.push({ pattern: I6(e, n2), ...r31 && n2.errorMessages && { errorMessage: { pattern: r31 } } })) : u4(t, "pattern", I6(e, n2), r31, n2);
}
__name(l5, "l");
function I6(t, e) {
  if (!e.applyRegexFlags || !t.flags) return t.source;
  let r31 = { i: t.flags.includes("i"), m: t.flags.includes("m"), s: t.flags.includes("s") }, n2 = r31.i ? t.source.toLowerCase() : t.source, a = "", i2 = false, m7 = false, c3 = false;
  for (let s2 = 0; s2 < n2.length; s2++) {
    if (i2) {
      a += n2[s2], i2 = false;
      continue;
    }
    if (r31.i) {
      if (m7) {
        if (n2[s2].match(/[a-z]/)) {
          c3 ? (a += n2[s2], a += `${n2[s2 - 2]}-${n2[s2]}`.toUpperCase(), c3 = false) : n2[s2 + 1] === "-" && n2[s2 + 2]?.match(/[a-z]/) ? (a += n2[s2], c3 = true) : a += `${n2[s2]}${n2[s2].toUpperCase()}`;
          continue;
        }
      } else if (n2[s2].match(/[a-z]/)) {
        a += `[${n2[s2]}${n2[s2].toUpperCase()}]`;
        continue;
      }
    }
    if (r31.m) {
      if (n2[s2] === "^") {
        a += `(^|(?<=[\r
]))`;
        continue;
      } else if (n2[s2] === "$") {
        a += `($|(?=[\r
]))`;
        continue;
      }
    }
    if (r31.s && n2[s2] === ".") {
      a += m7 ? `${n2[s2]}\r
` : `[${n2[s2]}\r
]`;
      continue;
    }
    a += n2[s2], n2[s2] === "\\" ? i2 = true : m7 && n2[s2] === "]" ? m7 = false : !m7 && n2[s2] === "[" && (m7 = true);
  }
  try {
    new RegExp(a);
  } catch {
    return console.warn(`Could not convert regex pattern at ${e.currentPath.join("/")} to a flag-independent form! Falling back to the flag-ignorant source`), t.source;
  }
  return a;
}
__name(I6, "I");
function P3(t, e) {
  if (e.target === "openAi" && console.warn("Warning: OpenAI may not support records in schemas! Try an array of key-value pairs instead."), e.target === "openApi3" && t.keyType?._def.typeName === m4.ZodEnum) return { type: "object", required: t.keyType._def.values, properties: t.keyType._def.values.reduce((n2, a) => ({ ...n2, [a]: o2(t.valueType._def, { ...e, currentPath: [...e.currentPath, "properties", a] }) ?? {} }), {}), additionalProperties: e.rejectedAdditionalProperties };
  let r31 = { type: "object", additionalProperties: o2(t.valueType._def, { ...e, currentPath: [...e.currentPath, "additionalProperties"] }) ?? e.allowedAdditionalProperties };
  if (e.target === "openApi3") return r31;
  if (t.keyType?._def.typeName === m4.ZodString && t.keyType._def.checks?.length) {
    let { type: n2, ...a } = v3(t.keyType._def, e);
    return { ...r31, propertyNames: a };
  } else {
    if (t.keyType?._def.typeName === m4.ZodEnum) return { ...r31, propertyNames: { enum: t.keyType._def.values } };
    if (t.keyType?._def.typeName === m4.ZodBranded && t.keyType._def.type._def.typeName === m4.ZodString && t.keyType._def.type._def.checks?.length) {
      let { type: n2, ...a } = x6(t.keyType._def, e);
      return { ...r31, propertyNames: a };
    }
  }
  return r31;
}
__name(P3, "P");
function C4(t, e) {
  if (e.mapStrategy === "record") return P3(t, e);
  let r31 = o2(t.keyType._def, { ...e, currentPath: [...e.currentPath, "items", "items", "0"] }) || {}, n2 = o2(t.valueType._def, { ...e, currentPath: [...e.currentPath, "items", "items", "1"] }) || {};
  return { type: "array", maxItems: 125, items: { type: "array", items: [r31, n2], minItems: 2, maxItems: 2 } };
}
__name(C4, "C");
function U5(t) {
  let e = t.values, n2 = Object.keys(t.values).filter((i2) => typeof e[e[i2]] != "number").map((i2) => e[i2]), a = Array.from(new Set(n2.map((i2) => typeof i2)));
  return { type: a.length === 1 ? a[0] === "string" ? "string" : "number" : ["string", "number"], enum: n2 };
}
__name(U5, "U");
function B5() {
  return { not: {} };
}
__name(B5, "B");
function V5(t) {
  return t.target === "openApi3" ? { enum: ["null"], nullable: true } : { type: "null" };
}
__name(V5, "V");
var h5 = { ZodString: "string", ZodNumber: "number", ZodBigInt: "integer", ZodBoolean: "boolean", ZodNull: "null" };
function J4(t, e) {
  if (e.target === "openApi3") return K4(t, e);
  let r31 = t.options instanceof Map ? Array.from(t.options.values()) : t.options;
  if (r31.every((n2) => n2._def.typeName in h5 && (!n2._def.checks || !n2._def.checks.length))) {
    let n2 = r31.reduce((a, i2) => {
      let m7 = h5[i2._def.typeName];
      return m7 && !a.includes(m7) ? [...a, m7] : a;
    }, []);
    return { type: n2.length > 1 ? n2 : n2[0] };
  } else if (r31.every((n2) => n2._def.typeName === "ZodLiteral" && !n2.description)) {
    let n2 = r31.reduce((a, i2) => {
      let m7 = typeof i2._def.value;
      switch (m7) {
        case "string":
        case "number":
        case "boolean":
          return [...a, m7];
        case "bigint":
          return [...a, "integer"];
        case "object":
          if (i2._def.value === null) return [...a, "null"];
        case "symbol":
        case "undefined":
        case "function":
        default:
          return a;
      }
    }, []);
    if (n2.length === r31.length) {
      let a = n2.filter((i2, m7, c3) => c3.indexOf(i2) === m7);
      return { type: a.length > 1 ? a : a[0], enum: r31.reduce((i2, m7) => i2.includes(m7._def.value) ? i2 : [...i2, m7._def.value], []) };
    }
  } else if (r31.every((n2) => n2._def.typeName === "ZodEnum")) return { type: "string", enum: r31.reduce((n2, a) => [...n2, ...a._def.values.filter((i2) => !n2.includes(i2))], []) };
  return K4(t, e);
}
__name(J4, "J");
var K4 = /* @__PURE__ */ __name((t, e) => {
  let r31 = (t.options instanceof Map ? Array.from(t.options.values()) : t.options).map((n2, a) => o2(n2._def, { ...e, currentPath: [...e.currentPath, "anyOf", `${a}`] })).filter((n2) => !!n2 && (!e.strictUnions || typeof n2 == "object" && Object.keys(n2).length > 0));
  return r31.length ? { anyOf: r31 } : void 0;
}, "K");
function q5(t, e) {
  if (["ZodString", "ZodNumber", "ZodBigInt", "ZodBoolean", "ZodNull"].includes(t.innerType._def.typeName) && (!t.innerType._def.checks || !t.innerType._def.checks.length)) return e.target === "openApi3" ? { type: h5[t.innerType._def.typeName], nullable: true } : { type: [h5[t.innerType._def.typeName], "null"] };
  if (e.target === "openApi3") {
    let n2 = o2(t.innerType._def, { ...e, currentPath: [...e.currentPath] });
    return n2 && "$ref" in n2 ? { allOf: [n2], nullable: true } : n2 && { ...n2, nullable: true };
  }
  let r31 = o2(t.innerType._def, { ...e, currentPath: [...e.currentPath, "anyOf", "0"] });
  return r31 && { anyOf: [r31, { type: "null" }] };
}
__name(q5, "q");
function W6(t, e) {
  let r31 = { type: "number" };
  if (!t.checks) return r31;
  for (let n2 of t.checks) switch (n2.kind) {
    case "int":
      r31.type = "integer", D4(r31, "type", n2.message, e);
      break;
    case "min":
      e.target === "jsonSchema7" ? n2.inclusive ? u4(r31, "minimum", n2.value, n2.message, e) : u4(r31, "exclusiveMinimum", n2.value, n2.message, e) : (n2.inclusive || (r31.exclusiveMinimum = true), u4(r31, "minimum", n2.value, n2.message, e));
      break;
    case "max":
      e.target === "jsonSchema7" ? n2.inclusive ? u4(r31, "maximum", n2.value, n2.message, e) : u4(r31, "exclusiveMaximum", n2.value, n2.message, e) : (n2.inclusive || (r31.exclusiveMaximum = true), u4(r31, "maximum", n2.value, n2.message, e));
      break;
    case "multipleOf":
      u4(r31, "multipleOf", n2.value, n2.message, e);
      break;
  }
  return r31;
}
__name(W6, "W");
function G4(t, e) {
  let r31 = e.target === "openAi", n2 = { type: "object", properties: {} }, a = [], i2 = t.shape();
  for (let c3 in i2) {
    let s2 = i2[c3];
    if (s2 === void 0 || s2._def === void 0) continue;
    let g8 = fe3(s2);
    g8 && r31 && (s2 instanceof C3 && (s2 = s2._def.innerType), s2.isNullable() || (s2 = s2.nullable()), g8 = false);
    let b6 = o2(s2._def, { ...e, currentPath: [...e.currentPath, "properties", c3], propertyPath: [...e.currentPath, "properties", c3] });
    b6 !== void 0 && (n2.properties[c3] = b6, g8 || a.push(c3));
  }
  a.length && (n2.required = a);
  let m7 = le3(t, e);
  return m7 !== void 0 && (n2.additionalProperties = m7), n2;
}
__name(G4, "G");
function le3(t, e) {
  if (t.catchall._def.typeName !== "ZodNever") return o2(t.catchall._def, { ...e, currentPath: [...e.currentPath, "additionalProperties"] });
  switch (t.unknownKeys) {
    case "passthrough":
      return e.allowedAdditionalProperties;
    case "strict":
      return e.rejectedAdditionalProperties;
    case "strip":
      return e.removeAdditionalStrategy === "strict" ? e.allowedAdditionalProperties : e.rejectedAdditionalProperties;
  }
}
__name(le3, "le");
function fe3(t) {
  try {
    return t.isOptional();
  } catch {
    return true;
  }
}
__name(fe3, "fe");
var H3 = /* @__PURE__ */ __name((t, e) => {
  if (e.currentPath.toString() === e.propertyPath?.toString()) return o2(t.innerType._def, e);
  let r31 = o2(t.innerType._def, { ...e, currentPath: [...e.currentPath, "anyOf", "1"] });
  return r31 ? { anyOf: [{ not: {} }, r31] } : {};
}, "H");
var Q5 = /* @__PURE__ */ __name((t, e) => {
  if (e.pipeStrategy === "input") return o2(t.in._def, e);
  if (e.pipeStrategy === "output") return o2(t.out._def, e);
  let r31 = o2(t.in._def, { ...e, currentPath: [...e.currentPath, "allOf", "0"] }), n2 = o2(t.out._def, { ...e, currentPath: [...e.currentPath, "allOf", r31 ? "1" : "0"] });
  return { allOf: [r31, n2].filter((a) => a !== void 0) };
}, "Q");
function X4(t, e) {
  return o2(t.type._def, e);
}
__name(X4, "X");
function Y3(t, e) {
  let n2 = { type: "array", uniqueItems: true, items: o2(t.valueType._def, { ...e, currentPath: [...e.currentPath, "items"] }) };
  return t.minSize && u4(n2, "minItems", t.minSize.value, t.minSize.message, e), t.maxSize && u4(n2, "maxItems", t.maxSize.value, t.maxSize.message, e), n2;
}
__name(Y3, "Y");
function ee3(t, e) {
  return t.rest ? { type: "array", minItems: t.items.length, items: t.items.map((r31, n2) => o2(r31._def, { ...e, currentPath: [...e.currentPath, "items", `${n2}`] })).reduce((r31, n2) => n2 === void 0 ? r31 : [...r31, n2], []), additionalItems: o2(t.rest._def, { ...e, currentPath: [...e.currentPath, "additionalItems"] }) } : { type: "array", minItems: t.items.length, maxItems: t.items.length, items: t.items.map((r31, n2) => o2(r31._def, { ...e, currentPath: [...e.currentPath, "items", `${n2}`] })).reduce((r31, n2) => n2 === void 0 ? r31 : [...r31, n2], []) };
}
__name(ee3, "ee");
function te3() {
  return { not: {} };
}
__name(te3, "te");
function re3() {
  return {};
}
__name(re3, "re");
var ne3 = /* @__PURE__ */ __name((t, e) => o2(t.innerType._def, e), "ne");
var ae3 = /* @__PURE__ */ __name((t, e, r31) => {
  switch (e) {
    case m4.ZodString:
      return v3(t, r31);
    case m4.ZodNumber:
      return W6(t, r31);
    case m4.ZodObject:
      return G4(t, r31);
    case m4.ZodBigInt:
      return N3(t, r31);
    case m4.ZodBoolean:
      return $4();
    case m4.ZodDate:
      return A4(t, r31);
    case m4.ZodUndefined:
      return te3();
    case m4.ZodNull:
      return V5(r31);
    case m4.ZodArray:
      return T4(t, r31);
    case m4.ZodUnion:
    case m4.ZodDiscriminatedUnion:
      return J4(t, r31);
    case m4.ZodIntersection:
      return F5(t, r31);
    case m4.ZodTuple:
      return ee3(t, r31);
    case m4.ZodRecord:
      return P3(t, r31);
    case m4.ZodLiteral:
      return R4(t, r31);
    case m4.ZodEnum:
      return L6(t);
    case m4.ZodNativeEnum:
      return U5(t);
    case m4.ZodNullable:
      return q5(t, r31);
    case m4.ZodOptional:
      return H3(t, r31);
    case m4.ZodMap:
      return C4(t, r31);
    case m4.ZodSet:
      return Y3(t, r31);
    case m4.ZodLazy:
      return () => t.getter()._def;
    case m4.ZodPromise:
      return X4(t, r31);
    case m4.ZodNaN:
    case m4.ZodNever:
      return B5();
    case m4.ZodEffects:
      return z4(t, r31);
    case m4.ZodAny:
      return M4();
    case m4.ZodUnknown:
      return re3();
    case m4.ZodDefault:
      return E4(t, r31);
    case m4.ZodBranded:
      return x6(t, r31);
    case m4.ZodReadonly:
      return ne3(t, r31);
    case m4.ZodCatch:
      return w5(t, r31);
    case m4.ZodPipeline:
      return Q5(t, r31);
    case m4.ZodFunction:
    case m4.ZodVoid:
    case m4.ZodSymbol:
      return;
    default:
      return /* @__PURE__ */ ((n2) => {
      })(e);
  }
}, "ae");
function o2(t, e, r31 = false) {
  let n2 = e.seen.get(t);
  if (e.override) {
    let c3 = e.override?.(t, e, n2, r31);
    if (c3 !== S5) return c3;
  }
  if (n2 && !r31) {
    let c3 = de3(n2, e);
    if (c3 !== void 0) return c3;
  }
  let a = { def: t, path: e.currentPath, jsonSchema: void 0 };
  e.seen.set(t, a);
  let i2 = ae3(t, t.typeName, e), m7 = typeof i2 == "function" ? o2(i2(), e) : i2;
  if (m7 && ye3(t, e, m7), e.postProcess) {
    let c3 = e.postProcess(m7, t, e);
    return a.jsonSchema = m7, c3;
  }
  return a.jsonSchema = m7, m7;
}
__name(o2, "o");
var de3 = /* @__PURE__ */ __name((t, e) => {
  switch (e.$refStrategy) {
    case "root":
      return { $ref: t.path.join("/") };
    case "relative":
      return { $ref: ge2(e.currentPath, t.path) };
    case "none":
    case "seen":
      return t.path.length < e.currentPath.length && t.path.every((r31, n2) => e.currentPath[n2] === r31) ? (console.warn(`Recursive reference detected at ${e.currentPath.join("/")}! Defaulting to any`), {}) : e.$refStrategy === "seen" ? {} : void 0;
  }
}, "de");
var ge2 = /* @__PURE__ */ __name((t, e) => {
  let r31 = 0;
  for (; r31 < t.length && r31 < e.length && t[r31] === e[r31]; r31++) ;
  return [(t.length - r31).toString(), ...e.slice(r31)].join("/");
}, "ge");
var ye3 = /* @__PURE__ */ __name((t, e, r31) => (t.description && (r31.description = t.description, e.markdownDescription && (r31.markdownDescription = t.description)), r31), "ye");
var oe3 = /* @__PURE__ */ __name((t, e) => {
  let r31 = j5(e), n2 = typeof e == "object" && e.definitions ? Object.entries(e.definitions).reduce((s2, [g8, b6]) => ({ ...s2, [g8]: o2(b6._def, { ...r31, currentPath: [...r31.basePath, r31.definitionPath, g8] }, true) ?? {} }), {}) : void 0, a = typeof e == "string" ? e : e?.nameStrategy === "title" ? void 0 : e?.name, i2 = o2(t._def, a === void 0 ? r31 : { ...r31, currentPath: [...r31.basePath, r31.definitionPath, a] }, false) ?? {}, m7 = typeof e == "object" && e.name !== void 0 && e.nameStrategy === "title" ? e.name : void 0;
  m7 !== void 0 && (i2.title = m7);
  let c3 = a === void 0 ? n2 ? { ...i2, [r31.definitionPath]: n2 } : i2 : { $ref: [...r31.$refStrategy === "relative" ? [] : r31.basePath, r31.definitionPath, a].join("/"), [r31.definitionPath]: { ...n2, [a]: i2 } };
  return r31.target === "jsonSchema7" ? c3.$schema = "http://json-schema.org/draft-07/schema#" : (r31.target === "jsonSchema2019-09" || r31.target === "openAi") && (c3.$schema = "https://json-schema.org/draft/2019-09/schema#"), r31.target === "openAi" && ("anyOf" in c3 || "oneOf" in c3 || "allOf" in c3 || "type" in c3 && Array.isArray(c3.type)) && console.warn("Warning: OpenAI may not support schemas with unions as roots! Try wrapping it in an object property."), c3;
}, "oe");

// deno:https://esm.sh/zod@3.24.3/es2022/zod.mjs
var g6;
(function(r31) {
  r31.assertEqual = (n2) => n2;
  function e(n2) {
  }
  __name(e, "e");
  r31.assertIs = e;
  function t(n2) {
    throw new Error();
  }
  __name(t, "t");
  r31.assertNever = t, r31.arrayToEnum = (n2) => {
    let a = {};
    for (let i2 of n2) a[i2] = i2;
    return a;
  }, r31.getValidEnumValues = (n2) => {
    let a = r31.objectKeys(n2).filter((o3) => typeof n2[n2[o3]] != "number"), i2 = {};
    for (let o3 of a) i2[o3] = n2[o3];
    return r31.objectValues(i2);
  }, r31.objectValues = (n2) => r31.objectKeys(n2).map(function(a) {
    return n2[a];
  }), r31.objectKeys = typeof Object.keys == "function" ? (n2) => Object.keys(n2) : (n2) => {
    let a = [];
    for (let i2 in n2) Object.prototype.hasOwnProperty.call(n2, i2) && a.push(i2);
    return a;
  }, r31.find = (n2, a) => {
    for (let i2 of n2) if (a(i2)) return i2;
  }, r31.isInteger = typeof Number.isInteger == "function" ? (n2) => Number.isInteger(n2) : (n2) => typeof n2 == "number" && isFinite(n2) && Math.floor(n2) === n2;
  function s2(n2, a = " | ") {
    return n2.map((i2) => typeof i2 == "string" ? `'${i2}'` : i2).join(a);
  }
  __name(s2, "s");
  r31.joinValues = s2, r31.jsonStringifyReplacer = (n2, a) => typeof a == "bigint" ? a.toString() : a;
})(g6 || (g6 = {}));
var be3;
(function(r31) {
  r31.mergeShapes = (e, t) => ({ ...e, ...t });
})(be3 || (be3 = {}));
var f3 = g6.arrayToEnum(["string", "nan", "number", "integer", "float", "boolean", "date", "bigint", "symbol", "function", "undefined", "null", "array", "object", "unknown", "promise", "void", "never", "map", "set"]);
var R5 = /* @__PURE__ */ __name((r31) => {
  switch (typeof r31) {
    case "undefined":
      return f3.undefined;
    case "string":
      return f3.string;
    case "number":
      return isNaN(r31) ? f3.nan : f3.number;
    case "boolean":
      return f3.boolean;
    case "function":
      return f3.function;
    case "bigint":
      return f3.bigint;
    case "symbol":
      return f3.symbol;
    case "object":
      return Array.isArray(r31) ? f3.array : r31 === null ? f3.null : r31.then && typeof r31.then == "function" && r31.catch && typeof r31.catch == "function" ? f3.promise : typeof Map < "u" && r31 instanceof Map ? f3.map : typeof Set < "u" && r31 instanceof Set ? f3.set : typeof Date < "u" && r31 instanceof Date ? f3.date : f3.object;
    default:
      return f3.unknown;
  }
}, "R");
var d6 = g6.arrayToEnum(["invalid_type", "invalid_literal", "custom", "invalid_union", "invalid_union_discriminator", "invalid_enum_value", "unrecognized_keys", "invalid_arguments", "invalid_return_type", "invalid_date", "invalid_string", "too_small", "too_big", "invalid_intersection_types", "not_multiple_of", "not_finite"]);
var ze3 = /* @__PURE__ */ __name((r31) => JSON.stringify(r31, null, 2).replace(/"([^"]+)":/g, "$1:"), "ze");
var T5 = class r16 extends Error {
  static {
    __name(this, "r");
  }
  get errors() {
    return this.issues;
  }
  constructor(e) {
    super(), this.issues = [], this.addIssue = (s2) => {
      this.issues = [...this.issues, s2];
    }, this.addIssues = (s2 = []) => {
      this.issues = [...this.issues, ...s2];
    };
    let t = new.target.prototype;
    Object.setPrototypeOf ? Object.setPrototypeOf(this, t) : this.__proto__ = t, this.name = "ZodError", this.issues = e;
  }
  format(e) {
    let t = e || function(a) {
      return a.message;
    }, s2 = { _errors: [] }, n2 = /* @__PURE__ */ __name((a) => {
      for (let i2 of a.issues) if (i2.code === "invalid_union") i2.unionErrors.map(n2);
      else if (i2.code === "invalid_return_type") n2(i2.returnTypeError);
      else if (i2.code === "invalid_arguments") n2(i2.argumentsError);
      else if (i2.path.length === 0) s2._errors.push(t(i2));
      else {
        let o3 = s2, l6 = 0;
        for (; l6 < i2.path.length; ) {
          let c3 = i2.path[l6];
          l6 === i2.path.length - 1 ? (o3[c3] = o3[c3] || { _errors: [] }, o3[c3]._errors.push(t(i2))) : o3[c3] = o3[c3] || { _errors: [] }, o3 = o3[c3], l6++;
        }
      }
    }, "n");
    return n2(this), s2;
  }
  static assert(e) {
    if (!(e instanceof r16)) throw new Error(`Not a ZodError: ${e}`);
  }
  toString() {
    return this.message;
  }
  get message() {
    return JSON.stringify(this.issues, g6.jsonStringifyReplacer, 2);
  }
  get isEmpty() {
    return this.issues.length === 0;
  }
  flatten(e = (t) => t.message) {
    let t = {}, s2 = [];
    for (let n2 of this.issues) n2.path.length > 0 ? (t[n2.path[0]] = t[n2.path[0]] || [], t[n2.path[0]].push(e(n2))) : s2.push(e(n2));
    return { formErrors: s2, fieldErrors: t };
  }
  get formErrors() {
    return this.flatten();
  }
};
T5.create = (r31) => new T5(r31);
var re4 = /* @__PURE__ */ __name((r31, e) => {
  let t;
  switch (r31.code) {
    case d6.invalid_type:
      r31.received === f3.undefined ? t = "Required" : t = `Expected ${r31.expected}, received ${r31.received}`;
      break;
    case d6.invalid_literal:
      t = `Invalid literal value, expected ${JSON.stringify(r31.expected, g6.jsonStringifyReplacer)}`;
      break;
    case d6.unrecognized_keys:
      t = `Unrecognized key(s) in object: ${g6.joinValues(r31.keys, ", ")}`;
      break;
    case d6.invalid_union:
      t = "Invalid input";
      break;
    case d6.invalid_union_discriminator:
      t = `Invalid discriminator value. Expected ${g6.joinValues(r31.options)}`;
      break;
    case d6.invalid_enum_value:
      t = `Invalid enum value. Expected ${g6.joinValues(r31.options)}, received '${r31.received}'`;
      break;
    case d6.invalid_arguments:
      t = "Invalid function arguments";
      break;
    case d6.invalid_return_type:
      t = "Invalid function return type";
      break;
    case d6.invalid_date:
      t = "Invalid date";
      break;
    case d6.invalid_string:
      typeof r31.validation == "object" ? "includes" in r31.validation ? (t = `Invalid input: must include "${r31.validation.includes}"`, typeof r31.validation.position == "number" && (t = `${t} at one or more positions greater than or equal to ${r31.validation.position}`)) : "startsWith" in r31.validation ? t = `Invalid input: must start with "${r31.validation.startsWith}"` : "endsWith" in r31.validation ? t = `Invalid input: must end with "${r31.validation.endsWith}"` : g6.assertNever(r31.validation) : r31.validation !== "regex" ? t = `Invalid ${r31.validation}` : t = "Invalid";
      break;
    case d6.too_small:
      r31.type === "array" ? t = `Array must contain ${r31.exact ? "exactly" : r31.inclusive ? "at least" : "more than"} ${r31.minimum} element(s)` : r31.type === "string" ? t = `String must contain ${r31.exact ? "exactly" : r31.inclusive ? "at least" : "over"} ${r31.minimum} character(s)` : r31.type === "number" ? t = `Number must be ${r31.exact ? "exactly equal to " : r31.inclusive ? "greater than or equal to " : "greater than "}${r31.minimum}` : r31.type === "date" ? t = `Date must be ${r31.exact ? "exactly equal to " : r31.inclusive ? "greater than or equal to " : "greater than "}${new Date(Number(r31.minimum))}` : t = "Invalid input";
      break;
    case d6.too_big:
      r31.type === "array" ? t = `Array must contain ${r31.exact ? "exactly" : r31.inclusive ? "at most" : "less than"} ${r31.maximum} element(s)` : r31.type === "string" ? t = `String must contain ${r31.exact ? "exactly" : r31.inclusive ? "at most" : "under"} ${r31.maximum} character(s)` : r31.type === "number" ? t = `Number must be ${r31.exact ? "exactly" : r31.inclusive ? "less than or equal to" : "less than"} ${r31.maximum}` : r31.type === "bigint" ? t = `BigInt must be ${r31.exact ? "exactly" : r31.inclusive ? "less than or equal to" : "less than"} ${r31.maximum}` : r31.type === "date" ? t = `Date must be ${r31.exact ? "exactly" : r31.inclusive ? "smaller than or equal to" : "smaller than"} ${new Date(Number(r31.maximum))}` : t = "Invalid input";
      break;
    case d6.custom:
      t = "Invalid input";
      break;
    case d6.invalid_intersection_types:
      t = "Intersection results could not be merged";
      break;
    case d6.not_multiple_of:
      t = `Number must be a multiple of ${r31.multipleOf}`;
      break;
    case d6.not_finite:
      t = "Number must be finite";
      break;
    default:
      t = e.defaultError, g6.assertNever(r31);
  }
  return { message: t };
}, "re");
var Ee3 = re4;
function De3(r31) {
  Ee3 = r31;
}
__name(De3, "De");
function pe4() {
  return Ee3;
}
__name(pe4, "pe");
var me4 = /* @__PURE__ */ __name((r31) => {
  let { data: e, path: t, errorMaps: s2, issueData: n2 } = r31, a = [...t, ...n2.path || []], i2 = { ...n2, path: a };
  if (n2.message !== void 0) return { ...n2, path: a, message: n2.message };
  let o3 = "", l6 = s2.filter((c3) => !!c3).slice().reverse();
  for (let c3 of l6) o3 = c3(i2, { data: e, defaultError: o3 }).message;
  return { ...n2, path: a, message: o3 };
}, "me");
var Le3 = [];
function u5(r31, e) {
  let t = pe4(), s2 = me4({ issueData: e, data: r31.data, path: r31.path, errorMaps: [r31.common.contextualErrorMap, r31.schemaErrorMap, t, t === re4 ? void 0 : re4].filter((n2) => !!n2) });
  r31.common.issues.push(s2);
}
__name(u5, "u");
var x7 = class r17 {
  static {
    __name(this, "r");
  }
  constructor() {
    this.value = "valid";
  }
  dirty() {
    this.value === "valid" && (this.value = "dirty");
  }
  abort() {
    this.value !== "aborted" && (this.value = "aborted");
  }
  static mergeArray(e, t) {
    let s2 = [];
    for (let n2 of t) {
      if (n2.status === "aborted") return v4;
      n2.status === "dirty" && e.dirty(), s2.push(n2.value);
    }
    return { status: e.value, value: s2 };
  }
  static async mergeObjectAsync(e, t) {
    let s2 = [];
    for (let n2 of t) {
      let a = await n2.key, i2 = await n2.value;
      s2.push({ key: a, value: i2 });
    }
    return r17.mergeObjectSync(e, s2);
  }
  static mergeObjectSync(e, t) {
    let s2 = {};
    for (let n2 of t) {
      let { key: a, value: i2 } = n2;
      if (a.status === "aborted" || i2.status === "aborted") return v4;
      a.status === "dirty" && e.dirty(), i2.status === "dirty" && e.dirty(), a.value !== "__proto__" && (typeof i2.value < "u" || n2.alwaysSet) && (s2[a.value] = i2.value);
    }
    return { status: e.value, value: s2 };
  }
};
var v4 = Object.freeze({ status: "aborted" });
var te4 = /* @__PURE__ */ __name((r31) => ({ status: "dirty", value: r31 }), "te");
var b4 = /* @__PURE__ */ __name((r31) => ({ status: "valid", value: r31 }), "b");
var we2 = /* @__PURE__ */ __name((r31) => r31.status === "aborted", "we");
var Te3 = /* @__PURE__ */ __name((r31) => r31.status === "dirty", "Te");
var P4 = /* @__PURE__ */ __name((r31) => r31.status === "valid", "P");
var ue4 = /* @__PURE__ */ __name((r31) => typeof Promise < "u" && r31 instanceof Promise, "ue");
function ve3(r31, e, t, s2) {
  if (t === "a" && !s2) throw new TypeError("Private accessor was defined without a getter");
  if (typeof e == "function" ? r31 !== e || !s2 : !e.has(r31)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return t === "m" ? s2 : t === "a" ? s2.call(r31) : s2 ? s2.value : e.get(r31);
}
__name(ve3, "ve");
function Ze3(r31, e, t, s2, n2) {
  if (s2 === "m") throw new TypeError("Private method is not writable");
  if (s2 === "a" && !n2) throw new TypeError("Private accessor was defined without a setter");
  if (typeof e == "function" ? r31 !== e || !n2 : !e.has(r31)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return s2 === "a" ? n2.call(r31, t) : n2 ? n2.value = t : e.set(r31, t), t;
}
__name(Ze3, "Ze");
var h6;
(function(r31) {
  r31.errToObj = (e) => typeof e == "string" ? { message: e } : e || {}, r31.toString = (e) => typeof e == "string" ? e : e?.message;
})(h6 || (h6 = {}));
var de4;
var ce3;
var S6 = class {
  static {
    __name(this, "S");
  }
  constructor(e, t, s2, n2) {
    this._cachedPath = [], this.parent = e, this.data = t, this._path = s2, this._key = n2;
  }
  get path() {
    return this._cachedPath.length || (this._key instanceof Array ? this._cachedPath.push(...this._path, ...this._key) : this._cachedPath.push(...this._path, this._key)), this._cachedPath;
  }
};
var Oe3 = /* @__PURE__ */ __name((r31, e) => {
  if (P4(e)) return { success: true, data: e.value };
  if (!r31.common.issues.length) throw new Error("Validation failed but no issues detected.");
  return { success: false, get error() {
    if (this._error) return this._error;
    let t = new T5(r31.common.issues);
    return this._error = t, this._error;
  } };
}, "Oe");
function _7(r31) {
  if (!r31) return {};
  let { errorMap: e, invalid_type_error: t, required_error: s2, description: n2 } = r31;
  if (e && (t || s2)) throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
  return e ? { errorMap: e, description: n2 } : { errorMap: /* @__PURE__ */ __name((i2, o3) => {
    var l6, c3;
    let { message: p4 } = r31;
    return i2.code === "invalid_enum_value" ? { message: p4 ?? o3.defaultError } : typeof o3.data > "u" ? { message: (l6 = p4 ?? s2) !== null && l6 !== void 0 ? l6 : o3.defaultError } : i2.code !== "invalid_type" ? { message: o3.defaultError } : { message: (c3 = p4 ?? t) !== null && c3 !== void 0 ? c3 : o3.defaultError };
  }, "errorMap"), description: n2 };
}
__name(_7, "_");
var y5 = class {
  static {
    __name(this, "y");
  }
  get description() {
    return this._def.description;
  }
  _getType(e) {
    return R5(e.data);
  }
  _getOrReturnCtx(e, t) {
    return t || { common: e.parent.common, data: e.data, parsedType: R5(e.data), schemaErrorMap: this._def.errorMap, path: e.path, parent: e.parent };
  }
  _processInputParams(e) {
    return { status: new x7(), ctx: { common: e.parent.common, data: e.data, parsedType: R5(e.data), schemaErrorMap: this._def.errorMap, path: e.path, parent: e.parent } };
  }
  _parseSync(e) {
    let t = this._parse(e);
    if (ue4(t)) throw new Error("Synchronous parse encountered promise.");
    return t;
  }
  _parseAsync(e) {
    let t = this._parse(e);
    return Promise.resolve(t);
  }
  parse(e, t) {
    let s2 = this.safeParse(e, t);
    if (s2.success) return s2.data;
    throw s2.error;
  }
  safeParse(e, t) {
    var s2;
    let n2 = { common: { issues: [], async: (s2 = t?.async) !== null && s2 !== void 0 ? s2 : false, contextualErrorMap: t?.errorMap }, path: t?.path || [], schemaErrorMap: this._def.errorMap, parent: null, data: e, parsedType: R5(e) }, a = this._parseSync({ data: e, path: n2.path, parent: n2 });
    return Oe3(n2, a);
  }
  "~validate"(e) {
    var t, s2;
    let n2 = { common: { issues: [], async: !!this["~standard"].async }, path: [], schemaErrorMap: this._def.errorMap, parent: null, data: e, parsedType: R5(e) };
    if (!this["~standard"].async) try {
      let a = this._parseSync({ data: e, path: [], parent: n2 });
      return P4(a) ? { value: a.value } : { issues: n2.common.issues };
    } catch (a) {
      !((s2 = (t = a?.message) === null || t === void 0 ? void 0 : t.toLowerCase()) === null || s2 === void 0) && s2.includes("encountered") && (this["~standard"].async = true), n2.common = { issues: [], async: true };
    }
    return this._parseAsync({ data: e, path: [], parent: n2 }).then((a) => P4(a) ? { value: a.value } : { issues: n2.common.issues });
  }
  async parseAsync(e, t) {
    let s2 = await this.safeParseAsync(e, t);
    if (s2.success) return s2.data;
    throw s2.error;
  }
  async safeParseAsync(e, t) {
    let s2 = { common: { issues: [], contextualErrorMap: t?.errorMap, async: true }, path: t?.path || [], schemaErrorMap: this._def.errorMap, parent: null, data: e, parsedType: R5(e) }, n2 = this._parse({ data: e, path: s2.path, parent: s2 }), a = await (ue4(n2) ? n2 : Promise.resolve(n2));
    return Oe3(s2, a);
  }
  refine(e, t) {
    let s2 = /* @__PURE__ */ __name((n2) => typeof t == "string" || typeof t > "u" ? { message: t } : typeof t == "function" ? t(n2) : t, "s");
    return this._refinement((n2, a) => {
      let i2 = e(n2), o3 = /* @__PURE__ */ __name(() => a.addIssue({ code: d6.custom, ...s2(n2) }), "o");
      return typeof Promise < "u" && i2 instanceof Promise ? i2.then((l6) => l6 ? true : (o3(), false)) : i2 ? true : (o3(), false);
    });
  }
  refinement(e, t) {
    return this._refinement((s2, n2) => e(s2) ? true : (n2.addIssue(typeof t == "function" ? t(s2, n2) : t), false));
  }
  _refinement(e) {
    return new C5({ schema: this, typeName: m5.ZodEffects, effect: { type: "refinement", refinement: e } });
  }
  superRefine(e) {
    return this._refinement(e);
  }
  constructor(e) {
    this.spa = this.safeParseAsync, this._def = e, this.parse = this.parse.bind(this), this.safeParse = this.safeParse.bind(this), this.parseAsync = this.parseAsync.bind(this), this.safeParseAsync = this.safeParseAsync.bind(this), this.spa = this.spa.bind(this), this.refine = this.refine.bind(this), this.refinement = this.refinement.bind(this), this.superRefine = this.superRefine.bind(this), this.optional = this.optional.bind(this), this.nullable = this.nullable.bind(this), this.nullish = this.nullish.bind(this), this.array = this.array.bind(this), this.promise = this.promise.bind(this), this.or = this.or.bind(this), this.and = this.and.bind(this), this.transform = this.transform.bind(this), this.brand = this.brand.bind(this), this.default = this.default.bind(this), this.catch = this.catch.bind(this), this.describe = this.describe.bind(this), this.pipe = this.pipe.bind(this), this.readonly = this.readonly.bind(this), this.isNullable = this.isNullable.bind(this), this.isOptional = this.isOptional.bind(this), this["~standard"] = { version: 1, vendor: "zod", validate: /* @__PURE__ */ __name((t) => this["~validate"](t), "validate") };
  }
  optional() {
    return O5.create(this, this._def);
  }
  nullable() {
    return Z4.create(this, this._def);
  }
  nullish() {
    return this.nullable().optional();
  }
  array() {
    return I7.create(this);
  }
  promise() {
    return V6.create(this, this._def);
  }
  or(e) {
    return W7.create([this, e], this._def);
  }
  and(e) {
    return q6.create(this, e, this._def);
  }
  transform(e) {
    return new C5({ ..._7(this._def), schema: this, typeName: m5.ZodEffects, effect: { type: "transform", transform: e } });
  }
  default(e) {
    let t = typeof e == "function" ? e : () => e;
    return new X5({ ..._7(this._def), innerType: this, defaultValue: t, typeName: m5.ZodDefault });
  }
  brand() {
    return new le4({ typeName: m5.ZodBranded, type: this, ..._7(this._def) });
  }
  catch(e) {
    let t = typeof e == "function" ? e : () => e;
    return new Q6({ ..._7(this._def), innerType: this, catchValue: t, typeName: m5.ZodCatch });
  }
  describe(e) {
    let t = this.constructor;
    return new t({ ...this._def, description: e });
  }
  pipe(e) {
    return fe4.create(this, e);
  }
  readonly() {
    return K5.create(this);
  }
  isOptional() {
    return this.safeParse(void 0).success;
  }
  isNullable() {
    return this.safeParse(null).success;
  }
};
var Ue3 = /^c[^\s-]{8,}$/i;
var Fe3 = /^[0-9a-z]+$/;
var Be3 = /^[0-9A-HJKMNP-TV-Z]{26}$/i;
var We3 = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i;
var qe3 = /^[a-z0-9_-]{21}$/i;
var Je3 = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/;
var Ye3 = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/;
var He3 = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i;
var Ge3 = "^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$";
var ke3;
var Xe3 = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
var Qe3 = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/;
var Ke3 = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
var et3 = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
var tt3 = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
var rt3 = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/;
var je3 = "((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))";
var st3 = new RegExp(`^${je3}$`);
function Re3(r31) {
  let e = "([01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d";
  return r31.precision ? e = `${e}\\.\\d{${r31.precision}}` : r31.precision == null && (e = `${e}(\\.\\d+)?`), e;
}
__name(Re3, "Re");
function nt3(r31) {
  return new RegExp(`^${Re3(r31)}$`);
}
__name(nt3, "nt");
function Ne3(r31) {
  let e = `${je3}T${Re3(r31)}`, t = [];
  return t.push(r31.local ? "Z?" : "Z"), r31.offset && t.push("([+-]\\d{2}:?\\d{2})"), e = `${e}(${t.join("|")})`, new RegExp(`^${e}$`);
}
__name(Ne3, "Ne");
function at3(r31, e) {
  return !!((e === "v4" || !e) && Xe3.test(r31) || (e === "v6" || !e) && Ke3.test(r31));
}
__name(at3, "at");
function it3(r31, e) {
  if (!Je3.test(r31)) return false;
  try {
    let [t] = r31.split("."), s2 = t.replace(/-/g, "+").replace(/_/g, "/").padEnd(t.length + (4 - t.length % 4) % 4, "="), n2 = JSON.parse(atob(s2));
    return !(typeof n2 != "object" || n2 === null || !n2.typ || !n2.alg || e && n2.alg !== e);
  } catch {
    return false;
  }
}
__name(it3, "it");
function ot3(r31, e) {
  return !!((e === "v4" || !e) && Qe3.test(r31) || (e === "v6" || !e) && et3.test(r31));
}
__name(ot3, "ot");
var $5 = class r18 extends y5 {
  static {
    __name(this, "r");
  }
  _parse(e) {
    if (this._def.coerce && (e.data = String(e.data)), this._getType(e) !== f3.string) {
      let a = this._getOrReturnCtx(e);
      return u5(a, { code: d6.invalid_type, expected: f3.string, received: a.parsedType }), v4;
    }
    let s2 = new x7(), n2;
    for (let a of this._def.checks) if (a.kind === "min") e.data.length < a.value && (n2 = this._getOrReturnCtx(e, n2), u5(n2, { code: d6.too_small, minimum: a.value, type: "string", inclusive: true, exact: false, message: a.message }), s2.dirty());
    else if (a.kind === "max") e.data.length > a.value && (n2 = this._getOrReturnCtx(e, n2), u5(n2, { code: d6.too_big, maximum: a.value, type: "string", inclusive: true, exact: false, message: a.message }), s2.dirty());
    else if (a.kind === "length") {
      let i2 = e.data.length > a.value, o3 = e.data.length < a.value;
      (i2 || o3) && (n2 = this._getOrReturnCtx(e, n2), i2 ? u5(n2, { code: d6.too_big, maximum: a.value, type: "string", inclusive: true, exact: true, message: a.message }) : o3 && u5(n2, { code: d6.too_small, minimum: a.value, type: "string", inclusive: true, exact: true, message: a.message }), s2.dirty());
    } else if (a.kind === "email") He3.test(e.data) || (n2 = this._getOrReturnCtx(e, n2), u5(n2, { validation: "email", code: d6.invalid_string, message: a.message }), s2.dirty());
    else if (a.kind === "emoji") ke3 || (ke3 = new RegExp(Ge3, "u")), ke3.test(e.data) || (n2 = this._getOrReturnCtx(e, n2), u5(n2, { validation: "emoji", code: d6.invalid_string, message: a.message }), s2.dirty());
    else if (a.kind === "uuid") We3.test(e.data) || (n2 = this._getOrReturnCtx(e, n2), u5(n2, { validation: "uuid", code: d6.invalid_string, message: a.message }), s2.dirty());
    else if (a.kind === "nanoid") qe3.test(e.data) || (n2 = this._getOrReturnCtx(e, n2), u5(n2, { validation: "nanoid", code: d6.invalid_string, message: a.message }), s2.dirty());
    else if (a.kind === "cuid") Ue3.test(e.data) || (n2 = this._getOrReturnCtx(e, n2), u5(n2, { validation: "cuid", code: d6.invalid_string, message: a.message }), s2.dirty());
    else if (a.kind === "cuid2") Fe3.test(e.data) || (n2 = this._getOrReturnCtx(e, n2), u5(n2, { validation: "cuid2", code: d6.invalid_string, message: a.message }), s2.dirty());
    else if (a.kind === "ulid") Be3.test(e.data) || (n2 = this._getOrReturnCtx(e, n2), u5(n2, { validation: "ulid", code: d6.invalid_string, message: a.message }), s2.dirty());
    else if (a.kind === "url") try {
      new URL(e.data);
    } catch {
      n2 = this._getOrReturnCtx(e, n2), u5(n2, { validation: "url", code: d6.invalid_string, message: a.message }), s2.dirty();
    }
    else a.kind === "regex" ? (a.regex.lastIndex = 0, a.regex.test(e.data) || (n2 = this._getOrReturnCtx(e, n2), u5(n2, { validation: "regex", code: d6.invalid_string, message: a.message }), s2.dirty())) : a.kind === "trim" ? e.data = e.data.trim() : a.kind === "includes" ? e.data.includes(a.value, a.position) || (n2 = this._getOrReturnCtx(e, n2), u5(n2, { code: d6.invalid_string, validation: { includes: a.value, position: a.position }, message: a.message }), s2.dirty()) : a.kind === "toLowerCase" ? e.data = e.data.toLowerCase() : a.kind === "toUpperCase" ? e.data = e.data.toUpperCase() : a.kind === "startsWith" ? e.data.startsWith(a.value) || (n2 = this._getOrReturnCtx(e, n2), u5(n2, { code: d6.invalid_string, validation: { startsWith: a.value }, message: a.message }), s2.dirty()) : a.kind === "endsWith" ? e.data.endsWith(a.value) || (n2 = this._getOrReturnCtx(e, n2), u5(n2, { code: d6.invalid_string, validation: { endsWith: a.value }, message: a.message }), s2.dirty()) : a.kind === "datetime" ? Ne3(a).test(e.data) || (n2 = this._getOrReturnCtx(e, n2), u5(n2, { code: d6.invalid_string, validation: "datetime", message: a.message }), s2.dirty()) : a.kind === "date" ? st3.test(e.data) || (n2 = this._getOrReturnCtx(e, n2), u5(n2, { code: d6.invalid_string, validation: "date", message: a.message }), s2.dirty()) : a.kind === "time" ? nt3(a).test(e.data) || (n2 = this._getOrReturnCtx(e, n2), u5(n2, { code: d6.invalid_string, validation: "time", message: a.message }), s2.dirty()) : a.kind === "duration" ? Ye3.test(e.data) || (n2 = this._getOrReturnCtx(e, n2), u5(n2, { validation: "duration", code: d6.invalid_string, message: a.message }), s2.dirty()) : a.kind === "ip" ? at3(e.data, a.version) || (n2 = this._getOrReturnCtx(e, n2), u5(n2, { validation: "ip", code: d6.invalid_string, message: a.message }), s2.dirty()) : a.kind === "jwt" ? it3(e.data, a.alg) || (n2 = this._getOrReturnCtx(e, n2), u5(n2, { validation: "jwt", code: d6.invalid_string, message: a.message }), s2.dirty()) : a.kind === "cidr" ? ot3(e.data, a.version) || (n2 = this._getOrReturnCtx(e, n2), u5(n2, { validation: "cidr", code: d6.invalid_string, message: a.message }), s2.dirty()) : a.kind === "base64" ? tt3.test(e.data) || (n2 = this._getOrReturnCtx(e, n2), u5(n2, { validation: "base64", code: d6.invalid_string, message: a.message }), s2.dirty()) : a.kind === "base64url" ? rt3.test(e.data) || (n2 = this._getOrReturnCtx(e, n2), u5(n2, { validation: "base64url", code: d6.invalid_string, message: a.message }), s2.dirty()) : g6.assertNever(a);
    return { status: s2.value, value: e.data };
  }
  _regex(e, t, s2) {
    return this.refinement((n2) => e.test(n2), { validation: t, code: d6.invalid_string, ...h6.errToObj(s2) });
  }
  _addCheck(e) {
    return new r18({ ...this._def, checks: [...this._def.checks, e] });
  }
  email(e) {
    return this._addCheck({ kind: "email", ...h6.errToObj(e) });
  }
  url(e) {
    return this._addCheck({ kind: "url", ...h6.errToObj(e) });
  }
  emoji(e) {
    return this._addCheck({ kind: "emoji", ...h6.errToObj(e) });
  }
  uuid(e) {
    return this._addCheck({ kind: "uuid", ...h6.errToObj(e) });
  }
  nanoid(e) {
    return this._addCheck({ kind: "nanoid", ...h6.errToObj(e) });
  }
  cuid(e) {
    return this._addCheck({ kind: "cuid", ...h6.errToObj(e) });
  }
  cuid2(e) {
    return this._addCheck({ kind: "cuid2", ...h6.errToObj(e) });
  }
  ulid(e) {
    return this._addCheck({ kind: "ulid", ...h6.errToObj(e) });
  }
  base64(e) {
    return this._addCheck({ kind: "base64", ...h6.errToObj(e) });
  }
  base64url(e) {
    return this._addCheck({ kind: "base64url", ...h6.errToObj(e) });
  }
  jwt(e) {
    return this._addCheck({ kind: "jwt", ...h6.errToObj(e) });
  }
  ip(e) {
    return this._addCheck({ kind: "ip", ...h6.errToObj(e) });
  }
  cidr(e) {
    return this._addCheck({ kind: "cidr", ...h6.errToObj(e) });
  }
  datetime(e) {
    var t, s2;
    return typeof e == "string" ? this._addCheck({ kind: "datetime", precision: null, offset: false, local: false, message: e }) : this._addCheck({ kind: "datetime", precision: typeof e?.precision > "u" ? null : e?.precision, offset: (t = e?.offset) !== null && t !== void 0 ? t : false, local: (s2 = e?.local) !== null && s2 !== void 0 ? s2 : false, ...h6.errToObj(e?.message) });
  }
  date(e) {
    return this._addCheck({ kind: "date", message: e });
  }
  time(e) {
    return typeof e == "string" ? this._addCheck({ kind: "time", precision: null, message: e }) : this._addCheck({ kind: "time", precision: typeof e?.precision > "u" ? null : e?.precision, ...h6.errToObj(e?.message) });
  }
  duration(e) {
    return this._addCheck({ kind: "duration", ...h6.errToObj(e) });
  }
  regex(e, t) {
    return this._addCheck({ kind: "regex", regex: e, ...h6.errToObj(t) });
  }
  includes(e, t) {
    return this._addCheck({ kind: "includes", value: e, position: t?.position, ...h6.errToObj(t?.message) });
  }
  startsWith(e, t) {
    return this._addCheck({ kind: "startsWith", value: e, ...h6.errToObj(t) });
  }
  endsWith(e, t) {
    return this._addCheck({ kind: "endsWith", value: e, ...h6.errToObj(t) });
  }
  min(e, t) {
    return this._addCheck({ kind: "min", value: e, ...h6.errToObj(t) });
  }
  max(e, t) {
    return this._addCheck({ kind: "max", value: e, ...h6.errToObj(t) });
  }
  length(e, t) {
    return this._addCheck({ kind: "length", value: e, ...h6.errToObj(t) });
  }
  nonempty(e) {
    return this.min(1, h6.errToObj(e));
  }
  trim() {
    return new r18({ ...this._def, checks: [...this._def.checks, { kind: "trim" }] });
  }
  toLowerCase() {
    return new r18({ ...this._def, checks: [...this._def.checks, { kind: "toLowerCase" }] });
  }
  toUpperCase() {
    return new r18({ ...this._def, checks: [...this._def.checks, { kind: "toUpperCase" }] });
  }
  get isDatetime() {
    return !!this._def.checks.find((e) => e.kind === "datetime");
  }
  get isDate() {
    return !!this._def.checks.find((e) => e.kind === "date");
  }
  get isTime() {
    return !!this._def.checks.find((e) => e.kind === "time");
  }
  get isDuration() {
    return !!this._def.checks.find((e) => e.kind === "duration");
  }
  get isEmail() {
    return !!this._def.checks.find((e) => e.kind === "email");
  }
  get isURL() {
    return !!this._def.checks.find((e) => e.kind === "url");
  }
  get isEmoji() {
    return !!this._def.checks.find((e) => e.kind === "emoji");
  }
  get isUUID() {
    return !!this._def.checks.find((e) => e.kind === "uuid");
  }
  get isNANOID() {
    return !!this._def.checks.find((e) => e.kind === "nanoid");
  }
  get isCUID() {
    return !!this._def.checks.find((e) => e.kind === "cuid");
  }
  get isCUID2() {
    return !!this._def.checks.find((e) => e.kind === "cuid2");
  }
  get isULID() {
    return !!this._def.checks.find((e) => e.kind === "ulid");
  }
  get isIP() {
    return !!this._def.checks.find((e) => e.kind === "ip");
  }
  get isCIDR() {
    return !!this._def.checks.find((e) => e.kind === "cidr");
  }
  get isBase64() {
    return !!this._def.checks.find((e) => e.kind === "base64");
  }
  get isBase64url() {
    return !!this._def.checks.find((e) => e.kind === "base64url");
  }
  get minLength() {
    let e = null;
    for (let t of this._def.checks) t.kind === "min" && (e === null || t.value > e) && (e = t.value);
    return e;
  }
  get maxLength() {
    let e = null;
    for (let t of this._def.checks) t.kind === "max" && (e === null || t.value < e) && (e = t.value);
    return e;
  }
};
$5.create = (r31) => {
  var e;
  return new $5({ checks: [], typeName: m5.ZodString, coerce: (e = r31?.coerce) !== null && e !== void 0 ? e : false, ..._7(r31) });
};
function dt2(r31, e) {
  let t = (r31.toString().split(".")[1] || "").length, s2 = (e.toString().split(".")[1] || "").length, n2 = t > s2 ? t : s2, a = parseInt(r31.toFixed(n2).replace(".", "")), i2 = parseInt(e.toFixed(n2).replace(".", ""));
  return a % i2 / Math.pow(10, n2);
}
__name(dt2, "dt");
var z5 = class r19 extends y5 {
  static {
    __name(this, "r");
  }
  constructor() {
    super(...arguments), this.min = this.gte, this.max = this.lte, this.step = this.multipleOf;
  }
  _parse(e) {
    if (this._def.coerce && (e.data = Number(e.data)), this._getType(e) !== f3.number) {
      let a = this._getOrReturnCtx(e);
      return u5(a, { code: d6.invalid_type, expected: f3.number, received: a.parsedType }), v4;
    }
    let s2, n2 = new x7();
    for (let a of this._def.checks) a.kind === "int" ? g6.isInteger(e.data) || (s2 = this._getOrReturnCtx(e, s2), u5(s2, { code: d6.invalid_type, expected: "integer", received: "float", message: a.message }), n2.dirty()) : a.kind === "min" ? (a.inclusive ? e.data < a.value : e.data <= a.value) && (s2 = this._getOrReturnCtx(e, s2), u5(s2, { code: d6.too_small, minimum: a.value, type: "number", inclusive: a.inclusive, exact: false, message: a.message }), n2.dirty()) : a.kind === "max" ? (a.inclusive ? e.data > a.value : e.data >= a.value) && (s2 = this._getOrReturnCtx(e, s2), u5(s2, { code: d6.too_big, maximum: a.value, type: "number", inclusive: a.inclusive, exact: false, message: a.message }), n2.dirty()) : a.kind === "multipleOf" ? dt2(e.data, a.value) !== 0 && (s2 = this._getOrReturnCtx(e, s2), u5(s2, { code: d6.not_multiple_of, multipleOf: a.value, message: a.message }), n2.dirty()) : a.kind === "finite" ? Number.isFinite(e.data) || (s2 = this._getOrReturnCtx(e, s2), u5(s2, { code: d6.not_finite, message: a.message }), n2.dirty()) : g6.assertNever(a);
    return { status: n2.value, value: e.data };
  }
  gte(e, t) {
    return this.setLimit("min", e, true, h6.toString(t));
  }
  gt(e, t) {
    return this.setLimit("min", e, false, h6.toString(t));
  }
  lte(e, t) {
    return this.setLimit("max", e, true, h6.toString(t));
  }
  lt(e, t) {
    return this.setLimit("max", e, false, h6.toString(t));
  }
  setLimit(e, t, s2, n2) {
    return new r19({ ...this._def, checks: [...this._def.checks, { kind: e, value: t, inclusive: s2, message: h6.toString(n2) }] });
  }
  _addCheck(e) {
    return new r19({ ...this._def, checks: [...this._def.checks, e] });
  }
  int(e) {
    return this._addCheck({ kind: "int", message: h6.toString(e) });
  }
  positive(e) {
    return this._addCheck({ kind: "min", value: 0, inclusive: false, message: h6.toString(e) });
  }
  negative(e) {
    return this._addCheck({ kind: "max", value: 0, inclusive: false, message: h6.toString(e) });
  }
  nonpositive(e) {
    return this._addCheck({ kind: "max", value: 0, inclusive: true, message: h6.toString(e) });
  }
  nonnegative(e) {
    return this._addCheck({ kind: "min", value: 0, inclusive: true, message: h6.toString(e) });
  }
  multipleOf(e, t) {
    return this._addCheck({ kind: "multipleOf", value: e, message: h6.toString(t) });
  }
  finite(e) {
    return this._addCheck({ kind: "finite", message: h6.toString(e) });
  }
  safe(e) {
    return this._addCheck({ kind: "min", inclusive: true, value: Number.MIN_SAFE_INTEGER, message: h6.toString(e) })._addCheck({ kind: "max", inclusive: true, value: Number.MAX_SAFE_INTEGER, message: h6.toString(e) });
  }
  get minValue() {
    let e = null;
    for (let t of this._def.checks) t.kind === "min" && (e === null || t.value > e) && (e = t.value);
    return e;
  }
  get maxValue() {
    let e = null;
    for (let t of this._def.checks) t.kind === "max" && (e === null || t.value < e) && (e = t.value);
    return e;
  }
  get isInt() {
    return !!this._def.checks.find((e) => e.kind === "int" || e.kind === "multipleOf" && g6.isInteger(e.value));
  }
  get isFinite() {
    let e = null, t = null;
    for (let s2 of this._def.checks) {
      if (s2.kind === "finite" || s2.kind === "int" || s2.kind === "multipleOf") return true;
      s2.kind === "min" ? (t === null || s2.value > t) && (t = s2.value) : s2.kind === "max" && (e === null || s2.value < e) && (e = s2.value);
    }
    return Number.isFinite(t) && Number.isFinite(e);
  }
};
z5.create = (r31) => new z5({ checks: [], typeName: m5.ZodNumber, coerce: r31?.coerce || false, ..._7(r31) });
var D5 = class r20 extends y5 {
  static {
    __name(this, "r");
  }
  constructor() {
    super(...arguments), this.min = this.gte, this.max = this.lte;
  }
  _parse(e) {
    if (this._def.coerce) try {
      e.data = BigInt(e.data);
    } catch {
      return this._getInvalidInput(e);
    }
    if (this._getType(e) !== f3.bigint) return this._getInvalidInput(e);
    let s2, n2 = new x7();
    for (let a of this._def.checks) a.kind === "min" ? (a.inclusive ? e.data < a.value : e.data <= a.value) && (s2 = this._getOrReturnCtx(e, s2), u5(s2, { code: d6.too_small, type: "bigint", minimum: a.value, inclusive: a.inclusive, message: a.message }), n2.dirty()) : a.kind === "max" ? (a.inclusive ? e.data > a.value : e.data >= a.value) && (s2 = this._getOrReturnCtx(e, s2), u5(s2, { code: d6.too_big, type: "bigint", maximum: a.value, inclusive: a.inclusive, message: a.message }), n2.dirty()) : a.kind === "multipleOf" ? e.data % a.value !== BigInt(0) && (s2 = this._getOrReturnCtx(e, s2), u5(s2, { code: d6.not_multiple_of, multipleOf: a.value, message: a.message }), n2.dirty()) : g6.assertNever(a);
    return { status: n2.value, value: e.data };
  }
  _getInvalidInput(e) {
    let t = this._getOrReturnCtx(e);
    return u5(t, { code: d6.invalid_type, expected: f3.bigint, received: t.parsedType }), v4;
  }
  gte(e, t) {
    return this.setLimit("min", e, true, h6.toString(t));
  }
  gt(e, t) {
    return this.setLimit("min", e, false, h6.toString(t));
  }
  lte(e, t) {
    return this.setLimit("max", e, true, h6.toString(t));
  }
  lt(e, t) {
    return this.setLimit("max", e, false, h6.toString(t));
  }
  setLimit(e, t, s2, n2) {
    return new r20({ ...this._def, checks: [...this._def.checks, { kind: e, value: t, inclusive: s2, message: h6.toString(n2) }] });
  }
  _addCheck(e) {
    return new r20({ ...this._def, checks: [...this._def.checks, e] });
  }
  positive(e) {
    return this._addCheck({ kind: "min", value: BigInt(0), inclusive: false, message: h6.toString(e) });
  }
  negative(e) {
    return this._addCheck({ kind: "max", value: BigInt(0), inclusive: false, message: h6.toString(e) });
  }
  nonpositive(e) {
    return this._addCheck({ kind: "max", value: BigInt(0), inclusive: true, message: h6.toString(e) });
  }
  nonnegative(e) {
    return this._addCheck({ kind: "min", value: BigInt(0), inclusive: true, message: h6.toString(e) });
  }
  multipleOf(e, t) {
    return this._addCheck({ kind: "multipleOf", value: e, message: h6.toString(t) });
  }
  get minValue() {
    let e = null;
    for (let t of this._def.checks) t.kind === "min" && (e === null || t.value > e) && (e = t.value);
    return e;
  }
  get maxValue() {
    let e = null;
    for (let t of this._def.checks) t.kind === "max" && (e === null || t.value < e) && (e = t.value);
    return e;
  }
};
D5.create = (r31) => {
  var e;
  return new D5({ checks: [], typeName: m5.ZodBigInt, coerce: (e = r31?.coerce) !== null && e !== void 0 ? e : false, ..._7(r31) });
};
var L7 = class extends y5 {
  static {
    __name(this, "L");
  }
  _parse(e) {
    if (this._def.coerce && (e.data = !!e.data), this._getType(e) !== f3.boolean) {
      let s2 = this._getOrReturnCtx(e);
      return u5(s2, { code: d6.invalid_type, expected: f3.boolean, received: s2.parsedType }), v4;
    }
    return b4(e.data);
  }
};
L7.create = (r31) => new L7({ typeName: m5.ZodBoolean, coerce: r31?.coerce || false, ..._7(r31) });
var U6 = class r21 extends y5 {
  static {
    __name(this, "r");
  }
  _parse(e) {
    if (this._def.coerce && (e.data = new Date(e.data)), this._getType(e) !== f3.date) {
      let a = this._getOrReturnCtx(e);
      return u5(a, { code: d6.invalid_type, expected: f3.date, received: a.parsedType }), v4;
    }
    if (isNaN(e.data.getTime())) {
      let a = this._getOrReturnCtx(e);
      return u5(a, { code: d6.invalid_date }), v4;
    }
    let s2 = new x7(), n2;
    for (let a of this._def.checks) a.kind === "min" ? e.data.getTime() < a.value && (n2 = this._getOrReturnCtx(e, n2), u5(n2, { code: d6.too_small, message: a.message, inclusive: true, exact: false, minimum: a.value, type: "date" }), s2.dirty()) : a.kind === "max" ? e.data.getTime() > a.value && (n2 = this._getOrReturnCtx(e, n2), u5(n2, { code: d6.too_big, message: a.message, inclusive: true, exact: false, maximum: a.value, type: "date" }), s2.dirty()) : g6.assertNever(a);
    return { status: s2.value, value: new Date(e.data.getTime()) };
  }
  _addCheck(e) {
    return new r21({ ...this._def, checks: [...this._def.checks, e] });
  }
  min(e, t) {
    return this._addCheck({ kind: "min", value: e.getTime(), message: h6.toString(t) });
  }
  max(e, t) {
    return this._addCheck({ kind: "max", value: e.getTime(), message: h6.toString(t) });
  }
  get minDate() {
    let e = null;
    for (let t of this._def.checks) t.kind === "min" && (e === null || t.value > e) && (e = t.value);
    return e != null ? new Date(e) : null;
  }
  get maxDate() {
    let e = null;
    for (let t of this._def.checks) t.kind === "max" && (e === null || t.value < e) && (e = t.value);
    return e != null ? new Date(e) : null;
  }
};
U6.create = (r31) => new U6({ checks: [], coerce: r31?.coerce || false, typeName: m5.ZodDate, ..._7(r31) });
var se4 = class extends y5 {
  static {
    __name(this, "se");
  }
  _parse(e) {
    if (this._getType(e) !== f3.symbol) {
      let s2 = this._getOrReturnCtx(e);
      return u5(s2, { code: d6.invalid_type, expected: f3.symbol, received: s2.parsedType }), v4;
    }
    return b4(e.data);
  }
};
se4.create = (r31) => new se4({ typeName: m5.ZodSymbol, ..._7(r31) });
var F6 = class extends y5 {
  static {
    __name(this, "F");
  }
  _parse(e) {
    if (this._getType(e) !== f3.undefined) {
      let s2 = this._getOrReturnCtx(e);
      return u5(s2, { code: d6.invalid_type, expected: f3.undefined, received: s2.parsedType }), v4;
    }
    return b4(e.data);
  }
};
F6.create = (r31) => new F6({ typeName: m5.ZodUndefined, ..._7(r31) });
var B6 = class extends y5 {
  static {
    __name(this, "B");
  }
  _parse(e) {
    if (this._getType(e) !== f3.null) {
      let s2 = this._getOrReturnCtx(e);
      return u5(s2, { code: d6.invalid_type, expected: f3.null, received: s2.parsedType }), v4;
    }
    return b4(e.data);
  }
};
B6.create = (r31) => new B6({ typeName: m5.ZodNull, ..._7(r31) });
var M5 = class extends y5 {
  static {
    __name(this, "M");
  }
  constructor() {
    super(...arguments), this._any = true;
  }
  _parse(e) {
    return b4(e.data);
  }
};
M5.create = (r31) => new M5({ typeName: m5.ZodAny, ..._7(r31) });
var N4 = class extends y5 {
  static {
    __name(this, "N");
  }
  constructor() {
    super(...arguments), this._unknown = true;
  }
  _parse(e) {
    return b4(e.data);
  }
};
N4.create = (r31) => new N4({ typeName: m5.ZodUnknown, ..._7(r31) });
var A5 = class extends y5 {
  static {
    __name(this, "A");
  }
  _parse(e) {
    let t = this._getOrReturnCtx(e);
    return u5(t, { code: d6.invalid_type, expected: f3.never, received: t.parsedType }), v4;
  }
};
A5.create = (r31) => new A5({ typeName: m5.ZodNever, ..._7(r31) });
var ne4 = class extends y5 {
  static {
    __name(this, "ne");
  }
  _parse(e) {
    if (this._getType(e) !== f3.undefined) {
      let s2 = this._getOrReturnCtx(e);
      return u5(s2, { code: d6.invalid_type, expected: f3.void, received: s2.parsedType }), v4;
    }
    return b4(e.data);
  }
};
ne4.create = (r31) => new ne4({ typeName: m5.ZodVoid, ..._7(r31) });
var I7 = class r22 extends y5 {
  static {
    __name(this, "r");
  }
  _parse(e) {
    let { ctx: t, status: s2 } = this._processInputParams(e), n2 = this._def;
    if (t.parsedType !== f3.array) return u5(t, { code: d6.invalid_type, expected: f3.array, received: t.parsedType }), v4;
    if (n2.exactLength !== null) {
      let i2 = t.data.length > n2.exactLength.value, o3 = t.data.length < n2.exactLength.value;
      (i2 || o3) && (u5(t, { code: i2 ? d6.too_big : d6.too_small, minimum: o3 ? n2.exactLength.value : void 0, maximum: i2 ? n2.exactLength.value : void 0, type: "array", inclusive: true, exact: true, message: n2.exactLength.message }), s2.dirty());
    }
    if (n2.minLength !== null && t.data.length < n2.minLength.value && (u5(t, { code: d6.too_small, minimum: n2.minLength.value, type: "array", inclusive: true, exact: false, message: n2.minLength.message }), s2.dirty()), n2.maxLength !== null && t.data.length > n2.maxLength.value && (u5(t, { code: d6.too_big, maximum: n2.maxLength.value, type: "array", inclusive: true, exact: false, message: n2.maxLength.message }), s2.dirty()), t.common.async) return Promise.all([...t.data].map((i2, o3) => n2.type._parseAsync(new S6(t, i2, t.path, o3)))).then((i2) => x7.mergeArray(s2, i2));
    let a = [...t.data].map((i2, o3) => n2.type._parseSync(new S6(t, i2, t.path, o3)));
    return x7.mergeArray(s2, a);
  }
  get element() {
    return this._def.type;
  }
  min(e, t) {
    return new r22({ ...this._def, minLength: { value: e, message: h6.toString(t) } });
  }
  max(e, t) {
    return new r22({ ...this._def, maxLength: { value: e, message: h6.toString(t) } });
  }
  length(e, t) {
    return new r22({ ...this._def, exactLength: { value: e, message: h6.toString(t) } });
  }
  nonempty(e) {
    return this.min(1, e);
  }
};
I7.create = (r31, e) => new I7({ type: r31, minLength: null, maxLength: null, exactLength: null, typeName: m5.ZodArray, ..._7(e) });
function ee4(r31) {
  if (r31 instanceof w6) {
    let e = {};
    for (let t in r31.shape) {
      let s2 = r31.shape[t];
      e[t] = O5.create(ee4(s2));
    }
    return new w6({ ...r31._def, shape: /* @__PURE__ */ __name(() => e, "shape") });
  } else return r31 instanceof I7 ? new I7({ ...r31._def, type: ee4(r31.element) }) : r31 instanceof O5 ? O5.create(ee4(r31.unwrap())) : r31 instanceof Z4 ? Z4.create(ee4(r31.unwrap())) : r31 instanceof E5 ? E5.create(r31.items.map((e) => ee4(e))) : r31;
}
__name(ee4, "ee");
var w6 = class r23 extends y5 {
  static {
    __name(this, "r");
  }
  constructor() {
    super(...arguments), this._cached = null, this.nonstrict = this.passthrough, this.augment = this.extend;
  }
  _getCached() {
    if (this._cached !== null) return this._cached;
    let e = this._def.shape(), t = g6.objectKeys(e);
    return this._cached = { shape: e, keys: t };
  }
  _parse(e) {
    if (this._getType(e) !== f3.object) {
      let c3 = this._getOrReturnCtx(e);
      return u5(c3, { code: d6.invalid_type, expected: f3.object, received: c3.parsedType }), v4;
    }
    let { status: s2, ctx: n2 } = this._processInputParams(e), { shape: a, keys: i2 } = this._getCached(), o3 = [];
    if (!(this._def.catchall instanceof A5 && this._def.unknownKeys === "strip")) for (let c3 in n2.data) i2.includes(c3) || o3.push(c3);
    let l6 = [];
    for (let c3 of i2) {
      let p4 = a[c3], k6 = n2.data[c3];
      l6.push({ key: { status: "valid", value: c3 }, value: p4._parse(new S6(n2, k6, n2.path, c3)), alwaysSet: c3 in n2.data });
    }
    if (this._def.catchall instanceof A5) {
      let c3 = this._def.unknownKeys;
      if (c3 === "passthrough") for (let p4 of o3) l6.push({ key: { status: "valid", value: p4 }, value: { status: "valid", value: n2.data[p4] } });
      else if (c3 === "strict") o3.length > 0 && (u5(n2, { code: d6.unrecognized_keys, keys: o3 }), s2.dirty());
      else if (c3 !== "strip") throw new Error("Internal ZodObject error: invalid unknownKeys value.");
    } else {
      let c3 = this._def.catchall;
      for (let p4 of o3) {
        let k6 = n2.data[p4];
        l6.push({ key: { status: "valid", value: p4 }, value: c3._parse(new S6(n2, k6, n2.path, p4)), alwaysSet: p4 in n2.data });
      }
    }
    return n2.common.async ? Promise.resolve().then(async () => {
      let c3 = [];
      for (let p4 of l6) {
        let k6 = await p4.key, he3 = await p4.value;
        c3.push({ key: k6, value: he3, alwaysSet: p4.alwaysSet });
      }
      return c3;
    }).then((c3) => x7.mergeObjectSync(s2, c3)) : x7.mergeObjectSync(s2, l6);
  }
  get shape() {
    return this._def.shape();
  }
  strict(e) {
    return h6.errToObj, new r23({ ...this._def, unknownKeys: "strict", ...e !== void 0 ? { errorMap: /* @__PURE__ */ __name((t, s2) => {
      var n2, a, i2, o3;
      let l6 = (i2 = (a = (n2 = this._def).errorMap) === null || a === void 0 ? void 0 : a.call(n2, t, s2).message) !== null && i2 !== void 0 ? i2 : s2.defaultError;
      return t.code === "unrecognized_keys" ? { message: (o3 = h6.errToObj(e).message) !== null && o3 !== void 0 ? o3 : l6 } : { message: l6 };
    }, "errorMap") } : {} });
  }
  strip() {
    return new r23({ ...this._def, unknownKeys: "strip" });
  }
  passthrough() {
    return new r23({ ...this._def, unknownKeys: "passthrough" });
  }
  extend(e) {
    return new r23({ ...this._def, shape: /* @__PURE__ */ __name(() => ({ ...this._def.shape(), ...e }), "shape") });
  }
  merge(e) {
    return new r23({ unknownKeys: e._def.unknownKeys, catchall: e._def.catchall, shape: /* @__PURE__ */ __name(() => ({ ...this._def.shape(), ...e._def.shape() }), "shape"), typeName: m5.ZodObject });
  }
  setKey(e, t) {
    return this.augment({ [e]: t });
  }
  catchall(e) {
    return new r23({ ...this._def, catchall: e });
  }
  pick(e) {
    let t = {};
    return g6.objectKeys(e).forEach((s2) => {
      e[s2] && this.shape[s2] && (t[s2] = this.shape[s2]);
    }), new r23({ ...this._def, shape: /* @__PURE__ */ __name(() => t, "shape") });
  }
  omit(e) {
    let t = {};
    return g6.objectKeys(this.shape).forEach((s2) => {
      e[s2] || (t[s2] = this.shape[s2]);
    }), new r23({ ...this._def, shape: /* @__PURE__ */ __name(() => t, "shape") });
  }
  deepPartial() {
    return ee4(this);
  }
  partial(e) {
    let t = {};
    return g6.objectKeys(this.shape).forEach((s2) => {
      let n2 = this.shape[s2];
      e && !e[s2] ? t[s2] = n2 : t[s2] = n2.optional();
    }), new r23({ ...this._def, shape: /* @__PURE__ */ __name(() => t, "shape") });
  }
  required(e) {
    let t = {};
    return g6.objectKeys(this.shape).forEach((s2) => {
      if (e && !e[s2]) t[s2] = this.shape[s2];
      else {
        let a = this.shape[s2];
        for (; a instanceof O5; ) a = a._def.innerType;
        t[s2] = a;
      }
    }), new r23({ ...this._def, shape: /* @__PURE__ */ __name(() => t, "shape") });
  }
  keyof() {
    return Ie3(g6.objectKeys(this.shape));
  }
};
w6.create = (r31, e) => new w6({ shape: /* @__PURE__ */ __name(() => r31, "shape"), unknownKeys: "strip", catchall: A5.create(), typeName: m5.ZodObject, ..._7(e) });
w6.strictCreate = (r31, e) => new w6({ shape: /* @__PURE__ */ __name(() => r31, "shape"), unknownKeys: "strict", catchall: A5.create(), typeName: m5.ZodObject, ..._7(e) });
w6.lazycreate = (r31, e) => new w6({ shape: r31, unknownKeys: "strip", catchall: A5.create(), typeName: m5.ZodObject, ..._7(e) });
var W7 = class extends y5 {
  static {
    __name(this, "W");
  }
  _parse(e) {
    let { ctx: t } = this._processInputParams(e), s2 = this._def.options;
    function n2(a) {
      for (let o3 of a) if (o3.result.status === "valid") return o3.result;
      for (let o3 of a) if (o3.result.status === "dirty") return t.common.issues.push(...o3.ctx.common.issues), o3.result;
      let i2 = a.map((o3) => new T5(o3.ctx.common.issues));
      return u5(t, { code: d6.invalid_union, unionErrors: i2 }), v4;
    }
    __name(n2, "n");
    if (t.common.async) return Promise.all(s2.map(async (a) => {
      let i2 = { ...t, common: { ...t.common, issues: [] }, parent: null };
      return { result: await a._parseAsync({ data: t.data, path: t.path, parent: i2 }), ctx: i2 };
    })).then(n2);
    {
      let a, i2 = [];
      for (let l6 of s2) {
        let c3 = { ...t, common: { ...t.common, issues: [] }, parent: null }, p4 = l6._parseSync({ data: t.data, path: t.path, parent: c3 });
        if (p4.status === "valid") return p4;
        p4.status === "dirty" && !a && (a = { result: p4, ctx: c3 }), c3.common.issues.length && i2.push(c3.common.issues);
      }
      if (a) return t.common.issues.push(...a.ctx.common.issues), a.result;
      let o3 = i2.map((l6) => new T5(l6));
      return u5(t, { code: d6.invalid_union, unionErrors: o3 }), v4;
    }
  }
  get options() {
    return this._def.options;
  }
};
W7.create = (r31, e) => new W7({ options: r31, typeName: m5.ZodUnion, ..._7(e) });
var j6 = /* @__PURE__ */ __name((r31) => r31 instanceof J5 ? j6(r31.schema) : r31 instanceof C5 ? j6(r31.innerType()) : r31 instanceof Y4 ? [r31.value] : r31 instanceof H4 ? r31.options : r31 instanceof G5 ? g6.objectValues(r31.enum) : r31 instanceof X5 ? j6(r31._def.innerType) : r31 instanceof F6 ? [void 0] : r31 instanceof B6 ? [null] : r31 instanceof O5 ? [void 0, ...j6(r31.unwrap())] : r31 instanceof Z4 ? [null, ...j6(r31.unwrap())] : r31 instanceof le4 || r31 instanceof K5 ? j6(r31.unwrap()) : r31 instanceof Q6 ? j6(r31._def.innerType) : [], "j");
var _e3 = class r24 extends y5 {
  static {
    __name(this, "r");
  }
  _parse(e) {
    let { ctx: t } = this._processInputParams(e);
    if (t.parsedType !== f3.object) return u5(t, { code: d6.invalid_type, expected: f3.object, received: t.parsedType }), v4;
    let s2 = this.discriminator, n2 = t.data[s2], a = this.optionsMap.get(n2);
    return a ? t.common.async ? a._parseAsync({ data: t.data, path: t.path, parent: t }) : a._parseSync({ data: t.data, path: t.path, parent: t }) : (u5(t, { code: d6.invalid_union_discriminator, options: Array.from(this.optionsMap.keys()), path: [s2] }), v4);
  }
  get discriminator() {
    return this._def.discriminator;
  }
  get options() {
    return this._def.options;
  }
  get optionsMap() {
    return this._def.optionsMap;
  }
  static create(e, t, s2) {
    let n2 = /* @__PURE__ */ new Map();
    for (let a of t) {
      let i2 = j6(a.shape[e]);
      if (!i2.length) throw new Error(`A discriminator value for key \`${e}\` could not be extracted from all schema options`);
      for (let o3 of i2) {
        if (n2.has(o3)) throw new Error(`Discriminator property ${String(e)} has duplicate value ${String(o3)}`);
        n2.set(o3, a);
      }
    }
    return new r24({ typeName: m5.ZodDiscriminatedUnion, discriminator: e, options: t, optionsMap: n2, ..._7(s2) });
  }
};
function Ce3(r31, e) {
  let t = R5(r31), s2 = R5(e);
  if (r31 === e) return { valid: true, data: r31 };
  if (t === f3.object && s2 === f3.object) {
    let n2 = g6.objectKeys(e), a = g6.objectKeys(r31).filter((o3) => n2.indexOf(o3) !== -1), i2 = { ...r31, ...e };
    for (let o3 of a) {
      let l6 = Ce3(r31[o3], e[o3]);
      if (!l6.valid) return { valid: false };
      i2[o3] = l6.data;
    }
    return { valid: true, data: i2 };
  } else if (t === f3.array && s2 === f3.array) {
    if (r31.length !== e.length) return { valid: false };
    let n2 = [];
    for (let a = 0; a < r31.length; a++) {
      let i2 = r31[a], o3 = e[a], l6 = Ce3(i2, o3);
      if (!l6.valid) return { valid: false };
      n2.push(l6.data);
    }
    return { valid: true, data: n2 };
  } else return t === f3.date && s2 === f3.date && +r31 == +e ? { valid: true, data: r31 } : { valid: false };
}
__name(Ce3, "Ce");
var q6 = class extends y5 {
  static {
    __name(this, "q");
  }
  _parse(e) {
    let { status: t, ctx: s2 } = this._processInputParams(e), n2 = /* @__PURE__ */ __name((a, i2) => {
      if (we2(a) || we2(i2)) return v4;
      let o3 = Ce3(a.value, i2.value);
      return o3.valid ? ((Te3(a) || Te3(i2)) && t.dirty(), { status: t.value, value: o3.data }) : (u5(s2, { code: d6.invalid_intersection_types }), v4);
    }, "n");
    return s2.common.async ? Promise.all([this._def.left._parseAsync({ data: s2.data, path: s2.path, parent: s2 }), this._def.right._parseAsync({ data: s2.data, path: s2.path, parent: s2 })]).then(([a, i2]) => n2(a, i2)) : n2(this._def.left._parseSync({ data: s2.data, path: s2.path, parent: s2 }), this._def.right._parseSync({ data: s2.data, path: s2.path, parent: s2 }));
  }
};
q6.create = (r31, e, t) => new q6({ left: r31, right: e, typeName: m5.ZodIntersection, ..._7(t) });
var E5 = class r25 extends y5 {
  static {
    __name(this, "r");
  }
  _parse(e) {
    let { status: t, ctx: s2 } = this._processInputParams(e);
    if (s2.parsedType !== f3.array) return u5(s2, { code: d6.invalid_type, expected: f3.array, received: s2.parsedType }), v4;
    if (s2.data.length < this._def.items.length) return u5(s2, { code: d6.too_small, minimum: this._def.items.length, inclusive: true, exact: false, type: "array" }), v4;
    !this._def.rest && s2.data.length > this._def.items.length && (u5(s2, { code: d6.too_big, maximum: this._def.items.length, inclusive: true, exact: false, type: "array" }), t.dirty());
    let a = [...s2.data].map((i2, o3) => {
      let l6 = this._def.items[o3] || this._def.rest;
      return l6 ? l6._parse(new S6(s2, i2, s2.path, o3)) : null;
    }).filter((i2) => !!i2);
    return s2.common.async ? Promise.all(a).then((i2) => x7.mergeArray(t, i2)) : x7.mergeArray(t, a);
  }
  get items() {
    return this._def.items;
  }
  rest(e) {
    return new r25({ ...this._def, rest: e });
  }
};
E5.create = (r31, e) => {
  if (!Array.isArray(r31)) throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
  return new E5({ items: r31, typeName: m5.ZodTuple, rest: null, ..._7(e) });
};
var ye4 = class r26 extends y5 {
  static {
    __name(this, "r");
  }
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(e) {
    let { status: t, ctx: s2 } = this._processInputParams(e);
    if (s2.parsedType !== f3.object) return u5(s2, { code: d6.invalid_type, expected: f3.object, received: s2.parsedType }), v4;
    let n2 = [], a = this._def.keyType, i2 = this._def.valueType;
    for (let o3 in s2.data) n2.push({ key: a._parse(new S6(s2, o3, s2.path, o3)), value: i2._parse(new S6(s2, s2.data[o3], s2.path, o3)), alwaysSet: o3 in s2.data });
    return s2.common.async ? x7.mergeObjectAsync(t, n2) : x7.mergeObjectSync(t, n2);
  }
  get element() {
    return this._def.valueType;
  }
  static create(e, t, s2) {
    return t instanceof y5 ? new r26({ keyType: e, valueType: t, typeName: m5.ZodRecord, ..._7(s2) }) : new r26({ keyType: $5.create(), valueType: e, typeName: m5.ZodRecord, ..._7(t) });
  }
};
var ae4 = class extends y5 {
  static {
    __name(this, "ae");
  }
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(e) {
    let { status: t, ctx: s2 } = this._processInputParams(e);
    if (s2.parsedType !== f3.map) return u5(s2, { code: d6.invalid_type, expected: f3.map, received: s2.parsedType }), v4;
    let n2 = this._def.keyType, a = this._def.valueType, i2 = [...s2.data.entries()].map(([o3, l6], c3) => ({ key: n2._parse(new S6(s2, o3, s2.path, [c3, "key"])), value: a._parse(new S6(s2, l6, s2.path, [c3, "value"])) }));
    if (s2.common.async) {
      let o3 = /* @__PURE__ */ new Map();
      return Promise.resolve().then(async () => {
        for (let l6 of i2) {
          let c3 = await l6.key, p4 = await l6.value;
          if (c3.status === "aborted" || p4.status === "aborted") return v4;
          (c3.status === "dirty" || p4.status === "dirty") && t.dirty(), o3.set(c3.value, p4.value);
        }
        return { status: t.value, value: o3 };
      });
    } else {
      let o3 = /* @__PURE__ */ new Map();
      for (let l6 of i2) {
        let c3 = l6.key, p4 = l6.value;
        if (c3.status === "aborted" || p4.status === "aborted") return v4;
        (c3.status === "dirty" || p4.status === "dirty") && t.dirty(), o3.set(c3.value, p4.value);
      }
      return { status: t.value, value: o3 };
    }
  }
};
ae4.create = (r31, e, t) => new ae4({ valueType: e, keyType: r31, typeName: m5.ZodMap, ..._7(t) });
var ie3 = class r27 extends y5 {
  static {
    __name(this, "r");
  }
  _parse(e) {
    let { status: t, ctx: s2 } = this._processInputParams(e);
    if (s2.parsedType !== f3.set) return u5(s2, { code: d6.invalid_type, expected: f3.set, received: s2.parsedType }), v4;
    let n2 = this._def;
    n2.minSize !== null && s2.data.size < n2.minSize.value && (u5(s2, { code: d6.too_small, minimum: n2.minSize.value, type: "set", inclusive: true, exact: false, message: n2.minSize.message }), t.dirty()), n2.maxSize !== null && s2.data.size > n2.maxSize.value && (u5(s2, { code: d6.too_big, maximum: n2.maxSize.value, type: "set", inclusive: true, exact: false, message: n2.maxSize.message }), t.dirty());
    let a = this._def.valueType;
    function i2(l6) {
      let c3 = /* @__PURE__ */ new Set();
      for (let p4 of l6) {
        if (p4.status === "aborted") return v4;
        p4.status === "dirty" && t.dirty(), c3.add(p4.value);
      }
      return { status: t.value, value: c3 };
    }
    __name(i2, "i");
    let o3 = [...s2.data.values()].map((l6, c3) => a._parse(new S6(s2, l6, s2.path, c3)));
    return s2.common.async ? Promise.all(o3).then((l6) => i2(l6)) : i2(o3);
  }
  min(e, t) {
    return new r27({ ...this._def, minSize: { value: e, message: h6.toString(t) } });
  }
  max(e, t) {
    return new r27({ ...this._def, maxSize: { value: e, message: h6.toString(t) } });
  }
  size(e, t) {
    return this.min(e, t).max(e, t);
  }
  nonempty(e) {
    return this.min(1, e);
  }
};
ie3.create = (r31, e) => new ie3({ valueType: r31, minSize: null, maxSize: null, typeName: m5.ZodSet, ..._7(e) });
var ge3 = class r28 extends y5 {
  static {
    __name(this, "r");
  }
  constructor() {
    super(...arguments), this.validate = this.implement;
  }
  _parse(e) {
    let { ctx: t } = this._processInputParams(e);
    if (t.parsedType !== f3.function) return u5(t, { code: d6.invalid_type, expected: f3.function, received: t.parsedType }), v4;
    function s2(o3, l6) {
      return me4({ data: o3, path: t.path, errorMaps: [t.common.contextualErrorMap, t.schemaErrorMap, pe4(), re4].filter((c3) => !!c3), issueData: { code: d6.invalid_arguments, argumentsError: l6 } });
    }
    __name(s2, "s");
    function n2(o3, l6) {
      return me4({ data: o3, path: t.path, errorMaps: [t.common.contextualErrorMap, t.schemaErrorMap, pe4(), re4].filter((c3) => !!c3), issueData: { code: d6.invalid_return_type, returnTypeError: l6 } });
    }
    __name(n2, "n");
    let a = { errorMap: t.common.contextualErrorMap }, i2 = t.data;
    if (this._def.returns instanceof V6) {
      let o3 = this;
      return b4(async function(...l6) {
        let c3 = new T5([]), p4 = await o3._def.args.parseAsync(l6, a).catch((xe3) => {
          throw c3.addIssue(s2(l6, xe3)), c3;
        }), k6 = await Reflect.apply(i2, this, p4);
        return await o3._def.returns._def.type.parseAsync(k6, a).catch((xe3) => {
          throw c3.addIssue(n2(k6, xe3)), c3;
        });
      });
    } else {
      let o3 = this;
      return b4(function(...l6) {
        let c3 = o3._def.args.safeParse(l6, a);
        if (!c3.success) throw new T5([s2(l6, c3.error)]);
        let p4 = Reflect.apply(i2, this, c3.data), k6 = o3._def.returns.safeParse(p4, a);
        if (!k6.success) throw new T5([n2(p4, k6.error)]);
        return k6.data;
      });
    }
  }
  parameters() {
    return this._def.args;
  }
  returnType() {
    return this._def.returns;
  }
  args(...e) {
    return new r28({ ...this._def, args: E5.create(e).rest(N4.create()) });
  }
  returns(e) {
    return new r28({ ...this._def, returns: e });
  }
  implement(e) {
    return this.parse(e);
  }
  strictImplement(e) {
    return this.parse(e);
  }
  static create(e, t, s2) {
    return new r28({ args: e || E5.create([]).rest(N4.create()), returns: t || N4.create(), typeName: m5.ZodFunction, ..._7(s2) });
  }
};
var J5 = class extends y5 {
  static {
    __name(this, "J");
  }
  get schema() {
    return this._def.getter();
  }
  _parse(e) {
    let { ctx: t } = this._processInputParams(e);
    return this._def.getter()._parse({ data: t.data, path: t.path, parent: t });
  }
};
J5.create = (r31, e) => new J5({ getter: r31, typeName: m5.ZodLazy, ..._7(e) });
var Y4 = class extends y5 {
  static {
    __name(this, "Y");
  }
  _parse(e) {
    if (e.data !== this._def.value) {
      let t = this._getOrReturnCtx(e);
      return u5(t, { received: t.data, code: d6.invalid_literal, expected: this._def.value }), v4;
    }
    return { status: "valid", value: e.data };
  }
  get value() {
    return this._def.value;
  }
};
Y4.create = (r31, e) => new Y4({ value: r31, typeName: m5.ZodLiteral, ..._7(e) });
function Ie3(r31, e) {
  return new H4({ values: r31, typeName: m5.ZodEnum, ..._7(e) });
}
__name(Ie3, "Ie");
var H4 = class r29 extends y5 {
  static {
    __name(this, "r");
  }
  constructor() {
    super(...arguments), de4.set(this, void 0);
  }
  _parse(e) {
    if (typeof e.data != "string") {
      let t = this._getOrReturnCtx(e), s2 = this._def.values;
      return u5(t, { expected: g6.joinValues(s2), received: t.parsedType, code: d6.invalid_type }), v4;
    }
    if (ve3(this, de4, "f") || Ze3(this, de4, new Set(this._def.values), "f"), !ve3(this, de4, "f").has(e.data)) {
      let t = this._getOrReturnCtx(e), s2 = this._def.values;
      return u5(t, { received: t.data, code: d6.invalid_enum_value, options: s2 }), v4;
    }
    return b4(e.data);
  }
  get options() {
    return this._def.values;
  }
  get enum() {
    let e = {};
    for (let t of this._def.values) e[t] = t;
    return e;
  }
  get Values() {
    let e = {};
    for (let t of this._def.values) e[t] = t;
    return e;
  }
  get Enum() {
    let e = {};
    for (let t of this._def.values) e[t] = t;
    return e;
  }
  extract(e, t = this._def) {
    return r29.create(e, { ...this._def, ...t });
  }
  exclude(e, t = this._def) {
    return r29.create(this.options.filter((s2) => !e.includes(s2)), { ...this._def, ...t });
  }
};
de4 = /* @__PURE__ */ new WeakMap();
H4.create = Ie3;
var G5 = class extends y5 {
  static {
    __name(this, "G");
  }
  constructor() {
    super(...arguments), ce3.set(this, void 0);
  }
  _parse(e) {
    let t = g6.getValidEnumValues(this._def.values), s2 = this._getOrReturnCtx(e);
    if (s2.parsedType !== f3.string && s2.parsedType !== f3.number) {
      let n2 = g6.objectValues(t);
      return u5(s2, { expected: g6.joinValues(n2), received: s2.parsedType, code: d6.invalid_type }), v4;
    }
    if (ve3(this, ce3, "f") || Ze3(this, ce3, new Set(g6.getValidEnumValues(this._def.values)), "f"), !ve3(this, ce3, "f").has(e.data)) {
      let n2 = g6.objectValues(t);
      return u5(s2, { received: s2.data, code: d6.invalid_enum_value, options: n2 }), v4;
    }
    return b4(e.data);
  }
  get enum() {
    return this._def.values;
  }
};
ce3 = /* @__PURE__ */ new WeakMap();
G5.create = (r31, e) => new G5({ values: r31, typeName: m5.ZodNativeEnum, ..._7(e) });
var V6 = class extends y5 {
  static {
    __name(this, "V");
  }
  unwrap() {
    return this._def.type;
  }
  _parse(e) {
    let { ctx: t } = this._processInputParams(e);
    if (t.parsedType !== f3.promise && t.common.async === false) return u5(t, { code: d6.invalid_type, expected: f3.promise, received: t.parsedType }), v4;
    let s2 = t.parsedType === f3.promise ? t.data : Promise.resolve(t.data);
    return b4(s2.then((n2) => this._def.type.parseAsync(n2, { path: t.path, errorMap: t.common.contextualErrorMap })));
  }
};
V6.create = (r31, e) => new V6({ type: r31, typeName: m5.ZodPromise, ..._7(e) });
var C5 = class extends y5 {
  static {
    __name(this, "C");
  }
  innerType() {
    return this._def.schema;
  }
  sourceType() {
    return this._def.schema._def.typeName === m5.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
  }
  _parse(e) {
    let { status: t, ctx: s2 } = this._processInputParams(e), n2 = this._def.effect || null, a = { addIssue: /* @__PURE__ */ __name((i2) => {
      u5(s2, i2), i2.fatal ? t.abort() : t.dirty();
    }, "addIssue"), get path() {
      return s2.path;
    } };
    if (a.addIssue = a.addIssue.bind(a), n2.type === "preprocess") {
      let i2 = n2.transform(s2.data, a);
      if (s2.common.async) return Promise.resolve(i2).then(async (o3) => {
        if (t.value === "aborted") return v4;
        let l6 = await this._def.schema._parseAsync({ data: o3, path: s2.path, parent: s2 });
        return l6.status === "aborted" ? v4 : l6.status === "dirty" || t.value === "dirty" ? te4(l6.value) : l6;
      });
      {
        if (t.value === "aborted") return v4;
        let o3 = this._def.schema._parseSync({ data: i2, path: s2.path, parent: s2 });
        return o3.status === "aborted" ? v4 : o3.status === "dirty" || t.value === "dirty" ? te4(o3.value) : o3;
      }
    }
    if (n2.type === "refinement") {
      let i2 = /* @__PURE__ */ __name((o3) => {
        let l6 = n2.refinement(o3, a);
        if (s2.common.async) return Promise.resolve(l6);
        if (l6 instanceof Promise) throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
        return o3;
      }, "i");
      if (s2.common.async === false) {
        let o3 = this._def.schema._parseSync({ data: s2.data, path: s2.path, parent: s2 });
        return o3.status === "aborted" ? v4 : (o3.status === "dirty" && t.dirty(), i2(o3.value), { status: t.value, value: o3.value });
      } else return this._def.schema._parseAsync({ data: s2.data, path: s2.path, parent: s2 }).then((o3) => o3.status === "aborted" ? v4 : (o3.status === "dirty" && t.dirty(), i2(o3.value).then(() => ({ status: t.value, value: o3.value }))));
    }
    if (n2.type === "transform") if (s2.common.async === false) {
      let i2 = this._def.schema._parseSync({ data: s2.data, path: s2.path, parent: s2 });
      if (!P4(i2)) return i2;
      let o3 = n2.transform(i2.value, a);
      if (o3 instanceof Promise) throw new Error("Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.");
      return { status: t.value, value: o3 };
    } else return this._def.schema._parseAsync({ data: s2.data, path: s2.path, parent: s2 }).then((i2) => P4(i2) ? Promise.resolve(n2.transform(i2.value, a)).then((o3) => ({ status: t.value, value: o3 })) : i2);
    g6.assertNever(n2);
  }
};
C5.create = (r31, e, t) => new C5({ schema: r31, typeName: m5.ZodEffects, effect: e, ..._7(t) });
C5.createWithPreprocess = (r31, e, t) => new C5({ schema: e, effect: { type: "preprocess", transform: r31 }, typeName: m5.ZodEffects, ..._7(t) });
var O5 = class extends y5 {
  static {
    __name(this, "O");
  }
  _parse(e) {
    return this._getType(e) === f3.undefined ? b4(void 0) : this._def.innerType._parse(e);
  }
  unwrap() {
    return this._def.innerType;
  }
};
O5.create = (r31, e) => new O5({ innerType: r31, typeName: m5.ZodOptional, ..._7(e) });
var Z4 = class extends y5 {
  static {
    __name(this, "Z");
  }
  _parse(e) {
    return this._getType(e) === f3.null ? b4(null) : this._def.innerType._parse(e);
  }
  unwrap() {
    return this._def.innerType;
  }
};
Z4.create = (r31, e) => new Z4({ innerType: r31, typeName: m5.ZodNullable, ..._7(e) });
var X5 = class extends y5 {
  static {
    __name(this, "X");
  }
  _parse(e) {
    let { ctx: t } = this._processInputParams(e), s2 = t.data;
    return t.parsedType === f3.undefined && (s2 = this._def.defaultValue()), this._def.innerType._parse({ data: s2, path: t.path, parent: t });
  }
  removeDefault() {
    return this._def.innerType;
  }
};
X5.create = (r31, e) => new X5({ innerType: r31, typeName: m5.ZodDefault, defaultValue: typeof e.default == "function" ? e.default : () => e.default, ..._7(e) });
var Q6 = class extends y5 {
  static {
    __name(this, "Q");
  }
  _parse(e) {
    let { ctx: t } = this._processInputParams(e), s2 = { ...t, common: { ...t.common, issues: [] } }, n2 = this._def.innerType._parse({ data: s2.data, path: s2.path, parent: { ...s2 } });
    return ue4(n2) ? n2.then((a) => ({ status: "valid", value: a.status === "valid" ? a.value : this._def.catchValue({ get error() {
      return new T5(s2.common.issues);
    }, input: s2.data }) })) : { status: "valid", value: n2.status === "valid" ? n2.value : this._def.catchValue({ get error() {
      return new T5(s2.common.issues);
    }, input: s2.data }) };
  }
  removeCatch() {
    return this._def.innerType;
  }
};
Q6.create = (r31, e) => new Q6({ innerType: r31, typeName: m5.ZodCatch, catchValue: typeof e.catch == "function" ? e.catch : () => e.catch, ..._7(e) });
var oe4 = class extends y5 {
  static {
    __name(this, "oe");
  }
  _parse(e) {
    if (this._getType(e) !== f3.nan) {
      let s2 = this._getOrReturnCtx(e);
      return u5(s2, { code: d6.invalid_type, expected: f3.nan, received: s2.parsedType }), v4;
    }
    return { status: "valid", value: e.data };
  }
};
oe4.create = (r31) => new oe4({ typeName: m5.ZodNaN, ..._7(r31) });
var ct3 = Symbol("zod_brand");
var le4 = class extends y5 {
  static {
    __name(this, "le");
  }
  _parse(e) {
    let { ctx: t } = this._processInputParams(e), s2 = t.data;
    return this._def.type._parse({ data: s2, path: t.path, parent: t });
  }
  unwrap() {
    return this._def.type;
  }
};
var fe4 = class r30 extends y5 {
  static {
    __name(this, "r");
  }
  _parse(e) {
    let { status: t, ctx: s2 } = this._processInputParams(e);
    if (s2.common.async) return (async () => {
      let a = await this._def.in._parseAsync({ data: s2.data, path: s2.path, parent: s2 });
      return a.status === "aborted" ? v4 : a.status === "dirty" ? (t.dirty(), te4(a.value)) : this._def.out._parseAsync({ data: a.value, path: s2.path, parent: s2 });
    })();
    {
      let n2 = this._def.in._parseSync({ data: s2.data, path: s2.path, parent: s2 });
      return n2.status === "aborted" ? v4 : n2.status === "dirty" ? (t.dirty(), { status: "dirty", value: n2.value }) : this._def.out._parseSync({ data: n2.value, path: s2.path, parent: s2 });
    }
  }
  static create(e, t) {
    return new r30({ in: e, out: t, typeName: m5.ZodPipeline });
  }
};
var K5 = class extends y5 {
  static {
    __name(this, "K");
  }
  _parse(e) {
    let t = this._def.innerType._parse(e), s2 = /* @__PURE__ */ __name((n2) => (P4(n2) && (n2.value = Object.freeze(n2.value)), n2), "s");
    return ue4(t) ? t.then((n2) => s2(n2)) : s2(t);
  }
  unwrap() {
    return this._def.innerType;
  }
};
K5.create = (r31, e) => new K5({ innerType: r31, typeName: m5.ZodReadonly, ..._7(e) });
function Se3(r31, e) {
  let t = typeof r31 == "function" ? r31(e) : typeof r31 == "string" ? { message: r31 } : r31;
  return typeof t == "string" ? { message: t } : t;
}
__name(Se3, "Se");
function $e3(r31, e = {}, t) {
  return r31 ? M5.create().superRefine((s2, n2) => {
    var a, i2;
    let o3 = r31(s2);
    if (o3 instanceof Promise) return o3.then((l6) => {
      var c3, p4;
      if (!l6) {
        let k6 = Se3(e, s2), he3 = (p4 = (c3 = k6.fatal) !== null && c3 !== void 0 ? c3 : t) !== null && p4 !== void 0 ? p4 : true;
        n2.addIssue({ code: "custom", ...k6, fatal: he3 });
      }
    });
    if (!o3) {
      let l6 = Se3(e, s2), c3 = (i2 = (a = l6.fatal) !== null && a !== void 0 ? a : t) !== null && i2 !== void 0 ? i2 : true;
      n2.addIssue({ code: "custom", ...l6, fatal: c3 });
    }
  }) : M5.create();
}
__name($e3, "$e");
var ut2 = { object: w6.lazycreate };
var m5;
(function(r31) {
  r31.ZodString = "ZodString", r31.ZodNumber = "ZodNumber", r31.ZodNaN = "ZodNaN", r31.ZodBigInt = "ZodBigInt", r31.ZodBoolean = "ZodBoolean", r31.ZodDate = "ZodDate", r31.ZodSymbol = "ZodSymbol", r31.ZodUndefined = "ZodUndefined", r31.ZodNull = "ZodNull", r31.ZodAny = "ZodAny", r31.ZodUnknown = "ZodUnknown", r31.ZodNever = "ZodNever", r31.ZodVoid = "ZodVoid", r31.ZodArray = "ZodArray", r31.ZodObject = "ZodObject", r31.ZodUnion = "ZodUnion", r31.ZodDiscriminatedUnion = "ZodDiscriminatedUnion", r31.ZodIntersection = "ZodIntersection", r31.ZodTuple = "ZodTuple", r31.ZodRecord = "ZodRecord", r31.ZodMap = "ZodMap", r31.ZodSet = "ZodSet", r31.ZodFunction = "ZodFunction", r31.ZodLazy = "ZodLazy", r31.ZodLiteral = "ZodLiteral", r31.ZodEnum = "ZodEnum", r31.ZodEffects = "ZodEffects", r31.ZodNativeEnum = "ZodNativeEnum", r31.ZodOptional = "ZodOptional", r31.ZodNullable = "ZodNullable", r31.ZodDefault = "ZodDefault", r31.ZodCatch = "ZodCatch", r31.ZodPromise = "ZodPromise", r31.ZodBranded = "ZodBranded", r31.ZodPipeline = "ZodPipeline", r31.ZodReadonly = "ZodReadonly";
})(m5 || (m5 = {}));
var lt2 = /* @__PURE__ */ __name((r31, e = { message: `Input not instance of ${r31.name}` }) => $e3((t) => t instanceof r31, e), "lt");
var Me3 = $5.create;
var Ve3 = z5.create;
var ft2 = oe4.create;
var ht3 = D5.create;
var Pe3 = L7.create;
var pt2 = U6.create;
var mt2 = se4.create;
var vt2 = F6.create;
var _t2 = B6.create;
var yt2 = M5.create;
var gt2 = N4.create;
var xt2 = A5.create;
var kt2 = ne4.create;
var bt2 = I7.create;
var wt2 = w6.create;
var Tt2 = w6.strictCreate;
var Ct2 = W7.create;
var Ot2 = _e3.create;
var St2 = q6.create;
var At2 = E5.create;
var Et2 = ye4.create;
var Zt2 = ae4.create;
var jt2 = ie3.create;
var Rt2 = ge3.create;
var Nt2 = J5.create;
var It2 = Y4.create;
var $t2 = H4.create;
var Mt2 = G5.create;
var Vt2 = V6.create;
var Ae3 = C5.create;
var Pt2 = O5.create;
var zt2 = Z4.create;
var Dt2 = C5.createWithPreprocess;
var Lt2 = fe4.create;
var Ut2 = /* @__PURE__ */ __name(() => Me3().optional(), "Ut");
var Ft2 = /* @__PURE__ */ __name(() => Ve3().optional(), "Ft");
var Bt2 = /* @__PURE__ */ __name(() => Pe3().optional(), "Bt");
var Wt2 = { string: /* @__PURE__ */ __name((r31) => $5.create({ ...r31, coerce: true }), "string"), number: /* @__PURE__ */ __name((r31) => z5.create({ ...r31, coerce: true }), "number"), boolean: /* @__PURE__ */ __name((r31) => L7.create({ ...r31, coerce: true }), "boolean"), bigint: /* @__PURE__ */ __name((r31) => D5.create({ ...r31, coerce: true }), "bigint"), date: /* @__PURE__ */ __name((r31) => U6.create({ ...r31, coerce: true }), "date") };
var qt2 = v4;
var Jt = Object.freeze({ __proto__: null, defaultErrorMap: re4, setErrorMap: De3, getErrorMap: pe4, makeIssue: me4, EMPTY_PATH: Le3, addIssueToContext: u5, ParseStatus: x7, INVALID: v4, DIRTY: te4, OK: b4, isAborted: we2, isDirty: Te3, isValid: P4, isAsync: ue4, get util() {
  return g6;
}, get objectUtil() {
  return be3;
}, ZodParsedType: f3, getParsedType: R5, ZodType: y5, datetimeRegex: Ne3, ZodString: $5, ZodNumber: z5, ZodBigInt: D5, ZodBoolean: L7, ZodDate: U6, ZodSymbol: se4, ZodUndefined: F6, ZodNull: B6, ZodAny: M5, ZodUnknown: N4, ZodNever: A5, ZodVoid: ne4, ZodArray: I7, ZodObject: w6, ZodUnion: W7, ZodDiscriminatedUnion: _e3, ZodIntersection: q6, ZodTuple: E5, ZodRecord: ye4, ZodMap: ae4, ZodSet: ie3, ZodFunction: ge3, ZodLazy: J5, ZodLiteral: Y4, ZodEnum: H4, ZodNativeEnum: G5, ZodPromise: V6, ZodEffects: C5, ZodTransformer: C5, ZodOptional: O5, ZodNullable: Z4, ZodDefault: X5, ZodCatch: Q6, ZodNaN: oe4, BRAND: ct3, ZodBranded: le4, ZodPipeline: fe4, ZodReadonly: K5, custom: $e3, Schema: y5, ZodSchema: y5, late: ut2, get ZodFirstPartyTypeKind() {
  return m5;
}, coerce: Wt2, any: yt2, array: bt2, bigint: ht3, boolean: Pe3, date: pt2, discriminatedUnion: Ot2, effect: Ae3, enum: $t2, function: Rt2, instanceof: lt2, intersection: St2, lazy: Nt2, literal: It2, map: Zt2, nan: ft2, nativeEnum: Mt2, never: xt2, null: _t2, nullable: zt2, number: Ve3, object: wt2, oboolean: Bt2, onumber: Ft2, optional: Pt2, ostring: Ut2, pipeline: Lt2, preprocess: Dt2, promise: Vt2, record: Et2, set: jt2, strictObject: Tt2, string: Me3, symbol: mt2, transformer: Ae3, tuple: At2, undefined: vt2, union: Ct2, unknown: gt2, void: kt2, NEVER: qt2, ZodIssueCode: d6, quotelessJson: ze3, ZodError: T5 });

// deno:https://esm.sh/@jsr/orama__core@1.2.4/es2022/orama__core.mjs
function w7(o3) {
  let e = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-$", t = "";
  for (let s2 = 0; s2 < o3; s2++) t += e.charAt(Math.floor(Math.random() * e.length));
  return t;
}
__name(w7, "w");
function z6(o3) {
  if (o3 < 1e3) return `${o3}ms`;
  {
    let e = o3 / 1e3;
    return Number.isInteger(e) ? `${e}s` : `${e.toFixed(1)}s`;
  }
}
__name(z6, "z");
var B7 = typeof localStorage < "u";
function F7() {
  return typeof window < "u" || typeof document < "u" ? false : !!(typeof xs < "u" && xs.versions?.node || typeof Deno < "u" && typeof Deno.version < "u" || typeof Bun < "u" && typeof Bun.version < "u" || typeof globalThis < "u" && typeof globalThis.Response == "function" && typeof globalThis.fetch == "function" && typeof globalThis.navigator > "u" || typeof xs < "u" && xs?.env.AWS_LAMBDA_FUNCTION_NAME);
}
__name(F7, "F");
function V7(o3) {
  let e = oe3(o3, "Tool");
  if (e.$ref && e.definitions) {
    let t = e.$ref.replace("#/definitions/", ""), s2 = e.definitions[t];
    if (!s2) throw new Error(`Could not resolve definition: ${t}`);
    return s2;
  }
  return e;
}
__name(V7, "V");
var I8 = "___$orama_user_id$___";
var Q7 = "ssid";
var P5 = class extends TransformStream {
  static {
    __name(this, "P");
  }
  constructor() {
    let e = new TextDecoder("utf-8", { ignoreBOM: false }), t, s2;
    super({ start() {
      t = "", s2 = { data: "" };
    }, transform(i2, r31) {
      let c3 = e.decode(i2);
      t += c3;
      let l6;
      for (; (l6 = /\r\n|\n|\r/.exec(t)) !== null; ) {
        let a = t.substring(0, l6.index);
        if (t = t.substring(l6.index + l6[0].length), a.length === 0) r31.enqueue(s2), s2 = { data: "" };
        else if (!a.startsWith(":")) {
          let d7 = /:/.exec(a);
          if (!d7) {
            s2[a] = "";
            continue;
          }
          let u6 = a.substring(0, d7.index), p4 = a.substring(d7.index + 1);
          s2[u6] = p4?.replace(/^\u0020/, "");
        }
      }
    } });
  }
};
var m6 = class {
  static {
    __name(this, "m");
  }
  config;
  constructor(e) {
    this.config = e;
  }
  async getRef(e, t) {
    let s2, i2;
    switch (this.config.type) {
      case "apiKey": {
        if (s2 = this.config.apiKey, e == "writer" && !this.config.writerURL) throw new Error("Cannot perform a request to a writer without the writerURL. Use `cluster.writerURL` to configure it");
        if (e == "reader" && !this.config.readerURL) throw new Error("Cannot perform a request to a writer without the writerURL. Use `cluster.readerURL` to configure it");
        i2 = e == "writer" ? this.config.writerURL : this.config.readerURL;
        break;
      }
      case "jwt": {
        let r31 = await te5(this.config.authJwtURL, this.config.collectionID, this.config.privateApiKey, "write", t);
        e == "reader" ? (i2 = this.config.readerURL ?? r31.readerURL, s2 = r31.readerApiKey) : (s2 = r31.jwt, i2 = this.config.writerURL ?? r31.writerURL);
        break;
      }
    }
    return { bearer: s2, baseURL: i2 };
  }
};
var g7 = class {
  static {
    __name(this, "g");
  }
  config;
  constructor(e) {
    this.config = e;
  }
  async request(e) {
    let t = await this.getResponse(e);
    if (!t.ok) {
      let s2;
      try {
        s2 = await t.text();
      } catch (i2) {
        s2 = `Unable to got response body ${i2}`;
      }
      throw new Error(`Request to "${e.path}?${new URLSearchParams(e.params ?? {}).toString()}" failed with status ${t.status}: ${s2}`);
    }
    return t.json();
  }
  async requestStream(e) {
    let t = await this.getResponse(e);
    if (t.body === null) throw new Error(`Response body is null for "${e.path}"`);
    return t.body?.pipeThrough(new P5());
  }
  async eventSource(e) {
    if (e.apiKeyPosition !== "query-params") throw new Error(`EventSource only supports apiKeyPosition as 'query-params', but got ${e.apiKeyPosition}`);
    if (e.method !== "GET") throw new Error(`EventSource only supports GET requests, but got ${e.method}`);
    let { baseURL: t, bearer: s2 } = await this.config.auth.getRef(e.target, e.init), i2 = new URL(e.path, t);
    return e.params = e.params ?? {}, e.params["api-key"] = s2, e.params && (i2.search = new URLSearchParams(e.params).toString()), new EventSource(i2);
  }
  async getResponse({ method: e, path: t, body: s2, params: i2, apiKeyPosition: r31, init: c3, target: l6 }) {
    let { baseURL: a, bearer: d7 } = await this.config.auth.getRef(l6, c3), u6 = new URL(t, a), p4 = new Headers();
    p4.append("Content-Type", "application/json"), r31 === "header" && p4.append("Authorization", `Bearer ${d7}`), r31 === "query-params" && (i2 = i2 ?? {}, i2["api-key"] = d7);
    let n2 = { method: e, headers: p4, ...c3 };
    s2 && e === "POST" && (n2.body = JSON.stringify(s2)), i2 && (u6.search = new URLSearchParams(i2).toString());
    let h7 = await fetch(u6, n2);
    if (h7.status === 401) throw new Error("Unauthorized: are you using the correct Api Key?");
    if (h7.status === 400) {
      let f4 = await h7.text();
      throw new Error(`Bad Request: ${f4} (path: ${u6.toString()})`);
    }
    return h7;
  }
};
async function te5(o3, e, t, s2, i2) {
  let c3 = await fetch(o3, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ collectionId: e, privateApiKey: t, scope: s2 }), ...i2 });
  if (!c3.ok) throw new Error(`JWT request to ${c3.url} failed with status ${c3.status}: ${await c3.text()}`);
  return c3.json();
}
__name(te5, "te");
function Y5(o3, e = true) {
  try {
    return JSON.parse(o3);
  } catch (t) {
    return e || console.warn("Recovered from failed JSON parsing with error:", t), o3;
  }
}
__name(Y5, "Y");
var S7 = class {
  static {
    __name(this, "S");
  }
  collectionID;
  oramaInterface;
  abortController;
  events;
  LLMConfig;
  sessionID;
  lastInteractionParams;
  messages;
  state = [];
  constructor(e) {
    this.collectionID = e.collectionID, this.oramaInterface = e.common, this.LLMConfig = e.LLMConfig, this.messages = e.initialMessages || [], this.events = e.events, this.sessionID = e.sessionID || Q2();
  }
  async answer(e, t) {
    let s2 = this.answerStream(e, t), i2 = "";
    for await (let r31 of s2) i2 = r31;
    return i2;
  }
  async *answerStream(e, t) {
    this.lastInteractionParams = { ...e }, e = this._enrichConfig(e), this.abortController = new AbortController();
    let s2 = t ?? {};
    s2.signal = this.abortController.signal, this.messages.push({ role: "user", content: e.query }), this.messages.push({ role: "assistant", content: "" });
    let i2 = e.interactionID || Q2();
    this.state.push({ id: i2, query: e.query, optimizedQuery: null, response: "", sources: null, loading: true, error: false, aborted: false, errorMessage: null, related: e.related?.enabled ? "" : null, currentStep: "starting", currentStepVerbose: null, selectedLLM: null, advancedAutoquery: null }), this._pushState();
    let r31 = this.state.length - 1, c3 = this.messages.length - 1;
    try {
      let l6 = { interaction_id: i2, query: e.query, visitor_id: e.visitorID, conversation_id: e.sessionID, messages: this.messages.slice(0, -1), llm_config: null, related: e.related, min_similarity: e.min_similarity, max_documents: e.max_documents, ragat_notation: e.ragat_notation };
      this.LLMConfig && (l6.llm_config = this.LLMConfig);
      let a = await this.oramaInterface.getResponse({ method: "POST", path: `/v1/collections/${this.collectionID}/generate/answer`, body: l6, init: s2, apiKeyPosition: "query-params", target: "reader" });
      if (!a.body) throw new Error("No response body");
      let d7 = x3(a.body), u6 = false, p4 = "";
      for (d7.on("answer_token", (n2) => {
        this.state[r31].response += n2.token, this.messages[c3].content = this.state[r31].response, this._pushState();
      }), d7.on("selected_llm", (n2) => {
        this.state[r31].selectedLLM = { provider: n2.provider, model: n2.model }, this._pushState();
      }), d7.on("optimizing_query", (n2) => {
        this.state[r31].optimizedQuery = Y5(n2.optimized_query), this._pushState();
      }), d7.on("search_results", (n2) => {
        this.state[r31].sources = n2.results, this._pushState();
      }), d7.on("related_queries", (n2) => {
        this.state[r31].related = n2.queries, this._pushState();
      }), d7.onStateChange((n2) => {
        this.state[r31].currentStep = n2.state, this._pushState();
      }), d7.on("state_changed", (n2) => {
        this.events?.onIncomingEvent?.(n2);
        let h7 = n2.data;
        if (n2.state === "advanced_autoquery_query_optimized" && h7?.optimized_queries) {
          this.state[r31].advancedAutoquery || (this.state[r31].advancedAutoquery = {}), this.state[r31].advancedAutoquery.optimizedQueries = h7.optimized_queries;
          let f4 = this.state[r31].advancedAutoquery.optimizedQueries?.join(`
Also, `);
          y6(f4) && (this.state[r31].currentStepVerbose = f4, this._pushState());
        }
        if (n2.state === "advanced_autoquery_properties_selected" && h7?.selected_properties) {
          this.state[r31].advancedAutoquery || (this.state[r31].advancedAutoquery = {}), this.state[r31].advancedAutoquery.selectedProperties = h7.selected_properties;
          let _8 = `Filtering by ${this.state[r31].advancedAutoquery.selectedProperties?.map(Object.values).flat().map((D6) => D6.selected_properties).flat().map((D6) => `${D6.property}`).join(", ")}`;
          y6(_8) && (this.state[r31].currentStepVerbose = _8, this._pushState());
        }
        if (n2.state === "advanced_autoquery_combine_queries" && h7?.queries_and_properties && (this.state[r31].advancedAutoquery || (this.state[r31].advancedAutoquery = {}), this.state[r31].advancedAutoquery.queriesAndProperties = h7.queries_and_properties, this._pushState()), n2.state === "advanced_autoquery_tracked_queries_generated" && h7?.tracked_queries && (this.state[r31].advancedAutoquery || (this.state[r31].advancedAutoquery = {}), this.state[r31].advancedAutoquery.trackedQueries = h7.tracked_queries, this._pushState()), n2.state === "advanced_autoquery_search_results" && h7?.search_results) {
          this.state[r31].advancedAutoquery || (this.state[r31].advancedAutoquery = {}), this.state[r31].advancedAutoquery.searchResults = h7.search_results;
          let f4 = h7.search_results.reduce((E6, X6) => E6 + X6.results[0].count, 0), _8 = h7.search_results.map((E6) => JSON.parse(E6.generated_query).term).join(", "), x8 = `Found ${f4} result${f4 === 1 ? "" : "s"} for "${_8}"`;
          y6(x8) && (this.state[r31].currentStepVerbose = x8, this._pushState());
        }
        n2.state === "advanced_autoquery_completed" && h7?.results && (this.state[r31].advancedAutoquery || (this.state[r31].advancedAutoquery = {}), this.state[r31].advancedAutoquery.results = h7.results, this.state[r31].currentStepVerbose = null, this._pushState()), n2.state === "completed" && (u6 = true, this.state[r31].loading = false, this._pushState()), this.events?.onEnd && this.events.onEnd(this.state);
      }); !u6; ) {
        let n2 = this.state[r31].response;
        n2 !== p4 ? (p4 = n2, yield n2) : u6 || await new Promise((h7) => setTimeout(h7, 0));
      }
    } catch (l6) {
      if (l6 instanceof Error && l6.name === "AbortError") {
        this.state[r31].loading = false, this.state[r31].aborted = true, this._pushState();
        return;
      }
      throw this.state[r31].loading = false, this.state[r31].error = true, this.state[r31].errorMessage = l6 instanceof Error ? l6.message : "Unknown error", this._pushState(), l6;
    }
  }
  regenerateLast({ stream: e = true } = {}, t) {
    if (this.state.length === 0 || this.messages.length === 0) throw new Error("No messages to regenerate");
    if (!(this.messages.at(-1)?.role === "assistant")) throw new Error("Last message is not an assistant message");
    if (this.messages.pop(), this.state.pop(), !this.lastInteractionParams) throw new Error("No last interaction parameters available");
    return e ? this.answerStream(this.lastInteractionParams, t) : this.answer(this.lastInteractionParams, t);
  }
  abort() {
    if (!this.abortController) throw new Error("AbortController is not available.");
    if (this.state.length === 0) throw new Error("There is no active request to abort.");
    this.abortController.abort(), this.abortController = void 0;
    let e = this.state[this.state.length - 1];
    e.aborted = true, e.loading = false, this._pushState();
  }
  clearSession() {
    this.messages = [], this.state = [], this._pushState();
  }
  _pushState() {
    this.events?.onStateChange?.(this.state);
  }
  _enrichConfig(e) {
    return e.visitorID || (e.visitorID = re5()), e.interactionID || (e.interactionID = Q2()), e.sessionID || (e.sessionID = this.sessionID), e;
  }
};
function re5() {
  if (F7()) return Q7;
  if (B7) {
    let o3 = localStorage.getItem(I8);
    if (o3) return o3;
  }
  return Q2();
}
__name(re5, "re");
var W8 = class {
  static {
    __name(this, "W");
  }
  collection;
  constructor(e) {
    let t = new g7({ auth: new m6({ type: "apiKey", apiKey: e.masterAPIKey, writerURL: e.url, readerURL: void 0 }) });
    this.collection = new T6(t);
  }
};
var T6 = class {
  static {
    __name(this, "T");
  }
  client;
  constructor(e) {
    this.client = e;
  }
  async create(e, t) {
    let s2 = { id: e.id, description: e.description, write_api_key: e.writeAPIKey ?? w7(32), read_api_key: e.readAPIKey ?? w7(32) };
    return e.embeddingsModel && (s2.embeddings_model = e.embeddingsModel), await this.client.request({ path: "/v1/collections/create", body: s2, method: "POST", init: t, apiKeyPosition: "header", target: "writer" }), { id: s2.id, description: s2.description, writeAPIKey: s2.write_api_key, readonlyAPIKey: s2.read_api_key };
  }
  list(e) {
    return this.client.request({ path: "/v1/collections", method: "GET", init: e, apiKeyPosition: "header", target: "writer" });
  }
  get(e, t) {
    return this.client.request({ path: `/v1/collections/${e}`, method: "GET", init: t, apiKeyPosition: "header", target: "writer" });
  }
  delete(e, t) {
    return this.client.request({ path: "/v1/collections/delete", method: "POST", body: { collection_id_to_delete: e }, init: t, apiKeyPosition: "header", target: "writer" });
  }
};
function Z5(o3, e) {
  if (typeof navigator < "u") {
    typeof navigator.sendBeacon < "u" && navigator.sendBeacon(o3, e);
    return;
  }
  fetch(o3, { method: "POST", body: e, headers: { "Content-Type": "application/json" } }).then(() => {
  }, (t) => console.log(t));
}
__name(Z5, "Z");
var b5 = class {
  static {
    __name(this, "b");
  }
  endpoint;
  apiKey;
  userId;
  identity;
  userAlias;
  params;
  constructor({ endpoint: e, apiKey: t }) {
    if (!e || !t) throw new Error("Endpoint and API Key are required to create a Profile");
    if (typeof e != "string" || typeof t != "string") throw new Error("Endpoint and API Key must be strings");
    if (typeof localStorage < "u") {
      let s2 = localStorage.getItem(I8);
      s2 ? this.userId = s2 : (this.userId = Q2(), localStorage.setItem(I8, this.userId));
    } else this.userId = Q2();
    this.endpoint = e, this.apiKey = t;
  }
  setParams(e) {
    let { protocol: t, host: s2 } = new URL(e.identifyUrl), i2 = `${t}//${s2}/identify`;
    this.params = { identifyUrl: i2, index: e.index };
  }
  getIdentity() {
    return this.identity;
  }
  getUserId() {
    return this.userId;
  }
  getAlias() {
    return this.userAlias;
  }
  async sendProfileData(e) {
    if (!this.params) throw new Error("Orama Profile is not initialized");
    let t = JSON.stringify({ ...e, visitorId: this.getUserId(), index: this.params.index });
    await Z5(`${this.params?.identifyUrl}?api-key=${this.apiKey}`, t);
  }
  async identify(e) {
    if (typeof e != "string") throw new Error("Identity must be a string");
    await this.sendProfileData({ entity: "identity", id: e }), this.identity = e;
  }
  async alias(e) {
    if (typeof e != "string") throw new Error("Identity must be a string");
    await this.sendProfileData({ entity: "alias", id: e }), this.userAlias = e;
  }
  reset() {
    this.userId = Q2(), this.identity = void 0, this.userAlias = void 0;
  }
};
var A6 = "https://collections.orama.com";
var ne5 = "https://app.orama.com/api/user/jwt";
var q7 = class {
  static {
    __name(this, "q");
  }
  collectionID;
  apiKey;
  client;
  profile;
  ai;
  collections;
  index;
  hooks;
  logs;
  systemPrompts;
  tools;
  identity;
  trainingSets;
  constructor(e) {
    let t;
    e.apiKey.startsWith("p_") ? t = new m6({ type: "jwt", authJwtURL: e.authJwtURL ?? ne5, collectionID: e.collectionID, privateApiKey: e.apiKey, readerURL: e.cluster?.readURL ?? A6, writerURL: e.cluster?.writerURL }) : (t = new m6({ type: "apiKey", readerURL: e.cluster?.readURL ?? A6, writerURL: e.cluster?.writerURL, apiKey: e.apiKey }), this.profile = new b5({ endpoint: e.cluster?.readURL ?? A6, apiKey: e.apiKey }));
    let s2 = { auth: t };
    this.collectionID = e.collectionID, this.client = new g7(s2), this.apiKey = e.apiKey, this.ai = new L8(this.client, this.collectionID, this.profile), this.collections = new $6(this.client, this.collectionID), this.index = new K6(this.client, this.collectionID), this.hooks = new U7(this.client, this.collectionID), this.logs = new O6(this.client, this.collectionID), this.systemPrompts = new k5(this.client, this.collectionID), this.tools = new C6(this.client, this.collectionID), this.identity = new M6(this.profile), this.trainingSets = new J6(this.client, this.collectionID);
  }
  async search(e, t) {
    let s2 = Date.now(), { datasourceIDs: i2, indexes: r31, ...c3 } = e, l6 = await this.client.request({ path: `/v1/collections/${this.collectionID}/search`, body: { userID: this.profile?.getUserId() || void 0, ...c3, indexes: i2 || r31 }, method: "POST", params: void 0, init: t, apiKeyPosition: "query-params", target: "reader" }), a = Date.now() - s2;
    return { ...l6, elapsed: { raw: a, formatted: z6(a) } };
  }
};
var L8 = class {
  static {
    __name(this, "L");
  }
  client;
  collectionID;
  profile;
  constructor(e, t, s2) {
    this.client = e, this.collectionID = t, this.profile = s2;
  }
  NLPSearch(e, t) {
    return this.client.request({ method: "POST", path: `/v1/collections/${this.collectionID}/nlp_search`, body: { userID: this.profile?.getUserId() || void 0, ...e }, init: t, apiKeyPosition: "query-params", target: "reader" });
  }
  async *NLPSearchStream(e, t) {
    let s2 = { llm_config: e.LLMConfig ? { ...e.LLMConfig } : void 0, userID: this.profile?.getUserId() || void 0, messages: [{ role: "user", content: e.query }] }, i2 = await this.client.getResponse({ method: "POST", path: `/v1/collections/${this.collectionID}/generate/nlp_query`, body: s2, init: t, apiKeyPosition: "query-params", target: "reader" });
    if (!i2.body) throw new Error("No response body");
    let r31 = false, c3 = null, l6 = S2(i2.body);
    for (l6.on("error", (a) => {
      throw a.is_terminal && (r31 = true), new Error(a.error);
    }), l6.on("state_changed", (a) => {
      c3 = { status: a.state, data: a.data || [] };
    }), l6.on("search_results", (a) => {
      c3 = { status: "SEARCH_RESULTS", data: a.results }, r31 = true;
    }); !r31; ) c3 !== null && y6(c3.status) && (yield c3), await new Promise((a) => setTimeout(a, 10));
    c3 !== null && y6(c3.status) && (yield c3);
  }
  createAISession(e) {
    return new S7({ collectionID: this.collectionID, common: this.client, ...e });
  }
};
var $6 = class {
  static {
    __name(this, "$");
  }
  client;
  collectionID;
  constructor(e, t) {
    this.client = e, this.collectionID = t;
  }
  getStats(e, t) {
    return this.client.request({ path: `/v1/collections/${e}/stats`, method: "GET", init: t, apiKeyPosition: "query-params", target: "reader" });
  }
  getAllDocs(e, t) {
    return this.client.request({ path: "/v1/collections/list", method: "POST", body: { id: e }, init: t, apiKeyPosition: "header", target: "writer" });
  }
};
var K6 = class {
  static {
    __name(this, "K");
  }
  client;
  collectionID;
  constructor(e, t) {
    this.client = e, this.collectionID = t;
  }
  async create(e, t) {
    let s2 = { id: e.id, embedding: e.embeddings };
    await this.client.request({ path: `/v1/collections/${this.collectionID}/indexes/create`, body: s2, method: "POST", init: t, apiKeyPosition: "header", target: "writer" });
  }
  async delete(e, t) {
    await this.client.request({ path: `/v1/collections/${this.collectionID}/indexes/delete`, body: { index_id_to_delete: e }, method: "POST", init: t, apiKeyPosition: "header", target: "writer" });
  }
  set(e) {
    return new j7(this.client, this.collectionID, e);
  }
};
var U7 = class {
  static {
    __name(this, "U");
  }
  client;
  collectionID;
  constructor(e, t) {
    this.client = e, this.collectionID = t;
  }
  async insert(e, t) {
    let s2 = { name: e.name, code: e.code };
    return await this.client.request({ path: `/v1/collections/${this.collectionID}/hooks/set`, body: s2, method: "POST", init: t, apiKeyPosition: "header", target: "writer" }), { hookID: s2.name, code: s2.code };
  }
  async list(e) {
    return (await this.client.request({ path: `/v1/collections/${this.collectionID}/hooks/list`, method: "GET", init: e, apiKeyPosition: "header", target: "writer" })).hooks || {};
  }
  async delete(e, t) {
    let s2 = { name_to_delete: e };
    await this.client.request({ path: `/v1/collections/${this.collectionID}/hooks/delete`, body: s2, method: "POST", init: t, apiKeyPosition: "header", target: "writer" });
  }
};
var O6 = class {
  static {
    __name(this, "O");
  }
  client;
  collectionID;
  constructor(e, t) {
    this.client = e, this.collectionID = t;
  }
  stream(e) {
    return this.client.eventSource({ path: `/v1/collections/${this.collectionID}/logs`, method: "GET", init: e, apiKeyPosition: "query-params", target: "reader" });
  }
};
var k5 = class {
  static {
    __name(this, "k");
  }
  client;
  collectionID;
  constructor(e, t) {
    this.client = e, this.collectionID = t;
  }
  insert(e, t) {
    return this.client.request({ path: `/v1/collections/${this.collectionID}/system_prompts/insert`, body: e, method: "POST", init: t, apiKeyPosition: "header", target: "writer" });
  }
  get(e, t) {
    return this.client.request({ path: `/v1/collections/${this.collectionID}/system_prompts/get`, params: { system_prompt_id: e }, method: "GET", init: t, apiKeyPosition: "query-params", target: "reader" });
  }
  getAll(e) {
    return this.client.request({ path: `/v1/collections/${this.collectionID}/system_prompts/all`, method: "GET", init: e, apiKeyPosition: "query-params", target: "reader" });
  }
  delete(e, t) {
    return this.client.request({ path: `/v1/collections/${this.collectionID}/system_prompts/delete`, body: { id: e }, method: "POST", init: t, apiKeyPosition: "header", target: "writer" });
  }
  update(e, t) {
    return this.client.request({ path: `/v1/collections/${this.collectionID}/system_prompts/update`, body: e, method: "POST", init: t, apiKeyPosition: "header", target: "writer" });
  }
  validate(e, t) {
    return this.client.request({ path: `/v1/collections/${this.collectionID}/system_prompts/validate`, body: e, method: "POST", init: t, apiKeyPosition: "header", target: "writer" });
  }
};
var C6 = class {
  static {
    __name(this, "C");
  }
  client;
  collectionID;
  constructor(e, t) {
    this.client = e, this.collectionID = t;
  }
  insert(e, t) {
    let s2;
    switch (true) {
      case typeof e.parameters == "string": {
        s2 = e.parameters;
        break;
      }
      case e.parameters instanceof y5: {
        let i2 = V7(e.parameters);
        s2 = JSON.stringify(i2);
        break;
      }
      case typeof e.parameters == "object": {
        s2 = JSON.stringify(e.parameters);
        break;
      }
      default:
        throw new Error("Invalid parameters type. Must be string, object or ZodType");
    }
    return this.client.request({ path: `/v1/collections/${this.collectionID}/tools/insert`, body: { ...e, parameters: s2 }, method: "POST", init: t, apiKeyPosition: "header", target: "writer" });
  }
  get(e, t) {
    return this.client.request({ path: `/v1/collections/${this.collectionID}/tools/get`, params: { tool_id: e }, method: "GET", init: t, apiKeyPosition: "query-params", target: "reader" });
  }
  getAll(e) {
    return this.client.request({ path: `/v1/collections/${this.collectionID}/tools/all`, method: "GET", init: e, apiKeyPosition: "query-params", target: "reader" });
  }
  delete(e, t) {
    return this.client.request({ path: `/v1/collections/${this.collectionID}/tools/delete`, body: { id: e }, method: "POST", init: t, apiKeyPosition: "header", target: "writer" });
  }
  update(e, t) {
    return this.client.request({ path: `/v1/collections/${this.collectionID}/tools/update`, body: e, method: "POST", init: t, apiKeyPosition: "header", target: "writer" });
  }
  async execute(e, t) {
    let s2 = await this.client.request({ path: `/v1/collections/${this.collectionID}/tools/run`, body: e, method: "POST", init: t, apiKeyPosition: "query-params", target: "reader" });
    return s2.results ? { results: s2.results.map((i2) => "functionResult" in i2 ? { functionResult: { tool_id: i2.functionResult.tool_id, result: JSON.parse(i2.functionResult.result) } } : "functionParameters" in i2 ? { functionParameters: { tool_id: i2.functionParameters.tool_id, result: JSON.parse(i2.functionParameters.result) } } : i2) } : { results: null };
  }
};
var M6 = class {
  static {
    __name(this, "M");
  }
  profile;
  constructor(e) {
    this.profile = e;
  }
  get() {
    if (!this.profile) throw new Error("Profile is not defined");
    return this.profile.getIdentity();
  }
  getUserId() {
    if (!this.profile) throw new Error("Profile is not defined");
    return this.profile.getUserId();
  }
  getAlias() {
    if (!this.profile) throw new Error("Profile is not defined");
    return this.profile.getAlias();
  }
  async identify(e) {
    if (!this.profile) throw new Error("Profile is not defined");
    await this.profile.identify(e);
  }
  async alias(e) {
    if (!this.profile) throw new Error("Profile is not defined");
    await this.profile.alias(e);
  }
  reset() {
    if (!this.profile) throw new Error("Profile is not defined");
    this.profile.reset();
  }
};
var J6 = class {
  static {
    __name(this, "J");
  }
  client;
  collectionID;
  constructor(e, t) {
    this.client = e, this.collectionID = t;
  }
  async get(e, t) {
    let s2 = await this.client.request({ path: `/v1/collections/${this.collectionID}/training_sets/${e}/get`, method: "GET", init: t, apiKeyPosition: "query-params", target: "reader" });
    return { training_sets: s2.training_sets && JSON.parse(s2.training_sets) };
  }
  generate(e, t, s2) {
    return this.client.request({ path: `/v1/collections/${this.collectionID}/training_sets/${e}/generate`, method: "POST", body: { llm_config: t ? { ...t } : void 0 }, init: s2, apiKeyPosition: "query-params", target: "reader" });
  }
  insert(e, t, s2) {
    return this.client.request({ path: `/v1/collections/${this.collectionID}/training_sets/${e}/insert`, method: "POST", body: { training_set: t }, init: s2, apiKeyPosition: "header", target: "writer" });
  }
  delete(e, t) {
    return this.client.request({ path: `/v1/collections/${this.collectionID}/training_sets/${e}/delete`, method: "POST", init: t, apiKeyPosition: "header", target: "writer" });
  }
};
var j7 = class {
  static {
    __name(this, "j");
  }
  indexID;
  collectionID;
  oramaInterface;
  transaction;
  constructor(e, t, s2) {
    this.indexID = s2, this.collectionID = t, this.oramaInterface = e, this.transaction = new G6(e, t, s2);
  }
  async reindex(e) {
    await this.oramaInterface.request({ path: `/v1/collections/${this.collectionID}/indexes/${this.indexID}/reindex`, method: "POST", init: e, apiKeyPosition: "header", target: "writer" });
  }
  async insertDocuments(e, t) {
    await this.oramaInterface.request({ path: `/v1/collections/${this.collectionID}/indexes/${this.indexID}/insert`, body: Array.isArray(e) ? e : [e], method: "POST", init: t, apiKeyPosition: "header", target: "writer" });
  }
  async deleteDocuments(e, t) {
    await this.oramaInterface.request({ path: `/v1/collections/${this.collectionID}/indexes/${this.indexID}/delete`, body: Array.isArray(e) ? e : [e], method: "POST", init: t, apiKeyPosition: "header", target: "writer" });
  }
  async upsertDocuments(e, t) {
    await this.oramaInterface.request({ path: `/v1/collections/${this.collectionID}/indexes/${this.indexID}/upsert`, body: e, method: "POST", init: t, apiKeyPosition: "header", target: "writer" });
  }
};
var G6 = class {
  static {
    __name(this, "G");
  }
  indexID;
  collectionID;
  tempIndexID;
  oramaInterface;
  constructor(e, t, s2, i2 = w7(16)) {
    this.oramaInterface = e, this.collectionID = t, this.indexID = s2, this.tempIndexID = i2;
  }
  open(e) {
    return this.oramaInterface.request({ path: `/v1/collections/${this.collectionID}/indexes/${this.indexID}/create-temporary-index`, method: "POST", body: { id: this.tempIndexID }, init: e, apiKeyPosition: "header", target: "writer" });
  }
  insertDocuments(e, t) {
    return this.oramaInterface.request({ path: `/v1/collections/${this.collectionID}/indexes/${this.tempIndexID}/insert`, body: Array.isArray(e) ? e : [e], method: "POST", init: t, apiKeyPosition: "header", target: "writer" });
  }
  commit(e) {
    return this.oramaInterface.request({ path: `/v1/collections/${this.collectionID}/replace-index`, method: "POST", body: { target_index_id: this.indexID, temp_index_id: this.tempIndexID }, init: e, apiKeyPosition: "header", target: "writer" });
  }
  rollback(e) {
    return this.oramaInterface.request({ path: `/v1/collections/${this.collectionID}/indexes/${this.tempIndexID}/delete`, method: "POST", init: e, apiKeyPosition: "header", target: "writer" });
  }
};
var H5 = class {
  static {
    __name(this, "H");
  }
  client;
  identity;
  ai;
  collections;
  index;
  hooks;
  logs;
  systemPrompts;
  tools;
  constructor(e) {
    this.client = new q7({ ...e, collectionID: e.projectId }), this.identity = this.client.identity, this.ai = this.client.ai, this.collections = this.client.collections, this.index = this.client.index, this.hooks = this.client.hooks, this.logs = this.client.logs, this.systemPrompts = this.client.systemPrompts, this.tools = this.client.tools;
  }
  search(e) {
    let { datasources: t, ...s2 } = e;
    return this.client.search({ ...s2, indexes: t });
  }
  dataSource(e) {
    let t = this.client.index.set(e);
    return new N5(t);
  }
};
var N5 = class {
  static {
    __name(this, "N");
  }
  index;
  constructor(e) {
    this.index = e;
  }
  reindex() {
    return this.index.reindex();
  }
  insertDocuments(e) {
    return this.index.insertDocuments(e);
  }
  deleteDocuments(e) {
    return this.index.deleteDocuments(e);
  }
  upsertDocuments(e) {
    return this.index.upsertDocuments(e);
  }
};
var y6 = /* @__PURE__ */ (() => {
  let o3 = /* @__PURE__ */ new Set();
  return function(e) {
    return !e || o3.has(e) ? "" : (o3.add(e), e);
  };
})();
export {
  S7 as AnswerSession,
  q7 as CollectionManager,
  j7 as Index,
  H5 as OramaCloud,
  W8 as OramaCoreManager,
  G6 as Transaction,
  w2 as answerSessionSteps,
  w7 as createRandomString,
  y6 as dedupe
};
/*! Bundled license information:

@noble/hashes/esm/utils.js:
  (*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) *)
*/
