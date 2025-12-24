import {
  __export,
  __name
} from "./chunk-JKJYCBCI.js";

// deno:https://esm.sh/@noble/hashes@^1.1.5/sha3?target=esnext
var sha3_target_esnext_exports = {};
__export(sha3_target_esnext_exports, {
  Keccak: () => x2,
  keccakP: () => Q,
  keccak_224: () => tt,
  keccak_256: () => st,
  keccak_384: () => et,
  keccak_512: () => nt,
  sha3_224: () => Y,
  sha3_256: () => Z,
  sha3_384: () => $,
  sha3_512: () => K,
  shake128: () => ot,
  shake256: () => it
});

// deno:https://esm.sh/@noble/hashes@1.8.0/esnext/esm/_u64.mjs
var l = BigInt(4294967295);
var s = BigInt(32);
function d(t2, o6 = false) {
  return o6 ? { h: Number(t2 & l), l: Number(t2 >> s & l) } : { h: Number(t2 >> s & l) | 0, l: Number(t2 & l) | 0 };
}
__name(d, "d");
function a(t2, o6 = false) {
  let n = t2.length, r34 = new Uint32Array(n), c6 = new Uint32Array(n);
  for (let e2 = 0; e2 < n; e2++) {
    let { h: i2, l: u6 } = d(t2[e2], o6);
    [r34[e2], c6[e2]] = [i2, u6];
  }
  return [r34, c6];
}
__name(a, "a");
var _ = /* @__PURE__ */ __name((t2, o6, n) => t2 << n | o6 >>> 32 - n, "_");
var b = /* @__PURE__ */ __name((t2, o6, n) => o6 << n | t2 >>> 32 - n, "b");
var I = /* @__PURE__ */ __name((t2, o6, n) => o6 << n - 32 | t2 >>> 64 - n, "I");
var N = /* @__PURE__ */ __name((t2, o6, n) => t2 << n - 32 | o6 >>> 64 - n, "N");

// deno:https://esm.sh/@noble/hashes@1.8.0/esnext/crypto.mjs
var o = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;

// deno:https://esm.sh/@noble/hashes@1.8.0/esnext/utils.mjs
function m(t2) {
  return t2 instanceof Uint8Array || ArrayBuffer.isView(t2) && t2.constructor.name === "Uint8Array";
}
__name(m, "m");
function x(t2) {
  if (!Number.isSafeInteger(t2) || t2 < 0) throw new Error("positive integer expected, got " + t2);
}
__name(x, "x");
function u(t2, ...e2) {
  if (!m(t2)) throw new Error("Uint8Array expected");
  if (e2.length > 0 && !e2.includes(t2.length)) throw new Error("Uint8Array expected of length " + e2 + ", got length=" + t2.length);
}
__name(u, "u");
function S(t2, e2 = true) {
  if (t2.destroyed) throw new Error("Hash instance has been destroyed");
  if (e2 && t2.finished) throw new Error("Hash#digest() has already been called");
}
__name(S, "S");
function I2(t2, e2) {
  u(t2);
  let n = e2.outputLen;
  if (t2.length < n) throw new Error("digestInto() expects output buffer of length at least " + n);
}
__name(I2, "I");
function _2(t2) {
  return new Uint32Array(t2.buffer, t2.byteOffset, Math.floor(t2.byteLength / 4));
}
__name(_2, "_");
function j(...t2) {
  for (let e2 = 0; e2 < t2.length; e2++) t2[e2].fill(0);
}
__name(j, "j");
var w = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function d2(t2) {
  return t2 << 24 & 4278190080 | t2 << 8 & 16711680 | t2 >>> 8 & 65280 | t2 >>> 24 & 255;
}
__name(d2, "d");
function L(t2) {
  for (let e2 = 0; e2 < t2.length; e2++) t2[e2] = d2(t2[e2]);
  return t2;
}
__name(L, "L");
var W = w ? (t2) => t2 : L;
var g = typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function";
var E = Array.from({ length: 256 }, (t2, e2) => e2.toString(16).padStart(2, "0"));
function h(t2) {
  if (typeof t2 != "string") throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(t2));
}
__name(h, "h");
function p(t2) {
  return typeof t2 == "string" && (t2 = h(t2)), u(t2), t2;
}
__name(p, "p");
var y = class {
  static {
    __name(this, "y");
  }
};
function B(t2) {
  let e2 = /* @__PURE__ */ __name((r34) => t2().update(p(r34)).digest(), "e"), n = t2();
  return e2.outputLen = n.outputLen, e2.blockLen = n.blockLen, e2.create = () => t2(), e2;
}
__name(B, "B");
function O(t2) {
  let e2 = /* @__PURE__ */ __name((r34, o6) => t2(o6).update(p(r34)).digest(), "e"), n = t2({});
  return e2.outputLen = n.outputLen, e2.blockLen = n.blockLen, e2.create = (r34) => t2(r34), e2;
}
__name(O, "O");

// deno:https://esm.sh/@noble/hashes@1.8.0/esnext/sha3.mjs
var v = BigInt(0);
var f = BigInt(1);
var z = BigInt(2);
var C = BigInt(7);
var D = BigInt(256);
var G = BigInt(113);
var g2 = [];
var B2 = [];
var L2 = [];
for (let e2 = 0, t2 = f, s4 = 1, o6 = 0; e2 < 24; e2++) {
  [s4, o6] = [o6, (2 * s4 + 3 * o6) % 5], g2.push(2 * (5 * o6 + s4)), B2.push((e2 + 1) * (e2 + 2) / 2 % 64);
  let i2 = v;
  for (let r34 = 0; r34 < 7; r34++) t2 = (t2 << f ^ (t2 >> C) * G) % D, t2 & z && (i2 ^= f << (f << BigInt(r34)) - f);
  L2.push(i2);
}
var A = a(L2, true);
var J = A[0];
var N2 = A[1];
var O2 = /* @__PURE__ */ __name((e2, t2, s4) => s4 > 32 ? I(e2, t2, s4) : _(e2, t2, s4), "O");
var w2 = /* @__PURE__ */ __name((e2, t2, s4) => s4 > 32 ? N(e2, t2, s4) : b(e2, t2, s4), "w");
function Q(e2, t2 = 24) {
  let s4 = new Uint32Array(10);
  for (let o6 = 24 - t2; o6 < 24; o6++) {
    for (let n = 0; n < 10; n++) s4[n] = e2[n] ^ e2[n + 10] ^ e2[n + 20] ^ e2[n + 30] ^ e2[n + 40];
    for (let n = 0; n < 10; n += 2) {
      let h6 = (n + 8) % 10, u6 = (n + 2) % 10, l6 = s4[u6], a6 = s4[u6 + 1], H7 = O2(l6, a6, 1) ^ s4[h6], S10 = w2(l6, a6, 1) ^ s4[h6 + 1];
      for (let p3 = 0; p3 < 50; p3 += 10) e2[n + p3] ^= H7, e2[n + p3 + 1] ^= S10;
    }
    let i2 = e2[2], r34 = e2[3];
    for (let n = 0; n < 24; n++) {
      let h6 = B2[n], u6 = O2(i2, r34, h6), l6 = w2(i2, r34, h6), a6 = g2[n];
      i2 = e2[a6], r34 = e2[a6 + 1], e2[a6] = u6, e2[a6 + 1] = l6;
    }
    for (let n = 0; n < 50; n += 10) {
      for (let h6 = 0; h6 < 10; h6++) s4[h6] = e2[n + h6];
      for (let h6 = 0; h6 < 10; h6++) e2[n + h6] ^= ~s4[(h6 + 2) % 10] & s4[(h6 + 4) % 10];
    }
    e2[0] ^= J[o6], e2[1] ^= N2[o6];
  }
  j(s4);
}
__name(Q, "Q");
var x2 = class e extends y {
  static {
    __name(this, "e");
  }
  constructor(t2, s4, o6, i2 = false, r34 = 24) {
    if (super(), this.pos = 0, this.posOut = 0, this.finished = false, this.destroyed = false, this.enableXOF = false, this.blockLen = t2, this.suffix = s4, this.outputLen = o6, this.enableXOF = i2, this.rounds = r34, x(o6), !(0 < t2 && t2 < 200)) throw new Error("only keccak-f1600 function is supported");
    this.state = new Uint8Array(200), this.state32 = _2(this.state);
  }
  clone() {
    return this._cloneInto();
  }
  keccak() {
    W(this.state32), Q(this.state32, this.rounds), W(this.state32), this.posOut = 0, this.pos = 0;
  }
  update(t2) {
    S(this), t2 = p(t2), u(t2);
    let { blockLen: s4, state: o6 } = this, i2 = t2.length;
    for (let r34 = 0; r34 < i2; ) {
      let n = Math.min(s4 - this.pos, i2 - r34);
      for (let h6 = 0; h6 < n; h6++) o6[this.pos++] ^= t2[r34++];
      this.pos === s4 && this.keccak();
    }
    return this;
  }
  finish() {
    if (this.finished) return;
    this.finished = true;
    let { state: t2, suffix: s4, pos: o6, blockLen: i2 } = this;
    t2[o6] ^= s4, (s4 & 128) !== 0 && o6 === i2 - 1 && this.keccak(), t2[i2 - 1] ^= 128, this.keccak();
  }
  writeInto(t2) {
    S(this, false), u(t2), this.finish();
    let s4 = this.state, { blockLen: o6 } = this;
    for (let i2 = 0, r34 = t2.length; i2 < r34; ) {
      this.posOut >= o6 && this.keccak();
      let n = Math.min(o6 - this.posOut, r34 - i2);
      t2.set(s4.subarray(this.posOut, this.posOut + n), i2), this.posOut += n, i2 += n;
    }
    return t2;
  }
  xofInto(t2) {
    if (!this.enableXOF) throw new Error("XOF is not possible for this instance");
    return this.writeInto(t2);
  }
  xof(t2) {
    return x(t2), this.xofInto(new Uint8Array(t2));
  }
  digestInto(t2) {
    if (I2(t2, this), this.finished) throw new Error("digest() was already called");
    return this.writeInto(t2), this.destroy(), t2;
  }
  digest() {
    return this.digestInto(new Uint8Array(this.outputLen));
  }
  destroy() {
    this.destroyed = true, j(this.state);
  }
  _cloneInto(t2) {
    let { blockLen: s4, suffix: o6, outputLen: i2, rounds: r34, enableXOF: n } = this;
    return t2 || (t2 = new e(s4, o6, i2, n, r34)), t2.state32.set(this.state32), t2.pos = this.pos, t2.posOut = this.posOut, t2.finished = this.finished, t2.rounds = r34, t2.suffix = o6, t2.outputLen = i2, t2.enableXOF = n, t2.destroyed = this.destroyed, t2;
  }
};
var c = /* @__PURE__ */ __name((e2, t2, s4) => B(() => new x2(t2, e2, s4)), "c");
var Y = c(6, 144, 224 / 8);
var Z = c(6, 136, 256 / 8);
var $ = c(6, 104, 384 / 8);
var K = c(6, 72, 512 / 8);
var tt = c(1, 144, 224 / 8);
var st = c(1, 136, 256 / 8);
var et = c(1, 104, 384 / 8);
var nt = c(1, 72, 512 / 8);
var b2 = /* @__PURE__ */ __name((e2, t2, s4) => O((o6 = {}) => new x2(t2, e2, o6.dkLen === void 0 ? s4 : o6.dkLen, true)), "b");
var ot = b2(31, 168, 128 / 8);
var it = b2(31, 136, 256 / 8);

// deno:https://esm.sh/@orama/cuid2@2.2.3/esnext/cuid2.mjs
var require2 = /* @__PURE__ */ __name((n) => {
  const e2 = /* @__PURE__ */ __name((m7) => typeof m7.default < "u" ? m7.default : m7, "e"), c6 = /* @__PURE__ */ __name((m7) => Object.assign({ __esModule: true }, m7), "c");
  switch (n) {
    case "@noble/hashes/sha3":
      return e2(sha3_target_esnext_exports);
    default:
      console.error('module "' + n + '" not found');
      return null;
  }
}, "require");
var L3 = Object.create;
var g3 = Object.defineProperty;
var j2 = Object.getOwnPropertyDescriptor;
var $2 = Object.getOwnPropertyNames;
var q = Object.getPrototypeOf;
var v2 = Object.prototype.hasOwnProperty;
var z2 = ((t2) => typeof require2 < "u" ? require2 : typeof Proxy < "u" ? new Proxy(t2, { get: /* @__PURE__ */ __name((e2, n) => (typeof require2 < "u" ? require2 : e2)[n], "get") }) : t2)(function(t2) {
  if (typeof require2 < "u") return require2.apply(this, arguments);
  throw Error('Dynamic require of "' + t2 + '" is not supported');
});
var l2 = /* @__PURE__ */ __name((t2, e2) => () => (e2 || t2((e2 = { exports: {} }).exports, e2), e2.exports), "l");
var F = /* @__PURE__ */ __name((t2, e2, n, o6) => {
  if (e2 && typeof e2 == "object" || typeof e2 == "function") for (let r34 of $2(e2)) !v2.call(t2, r34) && r34 !== n && g3(t2, r34, { get: /* @__PURE__ */ __name(() => e2[r34], "get"), enumerable: !(o6 = j2(e2, r34)) || o6.enumerable });
  return t2;
}, "F");
var T = /* @__PURE__ */ __name((t2, e2, n) => (n = t2 != null ? L3(q(t2)) : {}, F(e2 || !t2 || !t2.__esModule ? g3(n, "default", { value: t2, enumerable: true }) : n, t2)), "T");
var I3 = l2((N9, s4) => {
  var { sha3_512: k6 } = z2("@noble/hashes/sha3"), p3 = 24, i2 = 32, u6 = /* @__PURE__ */ __name((t2 = 4, e2 = Math.random) => {
    let n = "";
    for (; n.length < t2; ) n = n + Math.floor(e2() * 36).toString(36);
    return n;
  }, "u");
  function h6(t2) {
    let e2 = BigInt(8), n = BigInt(0);
    for (let o6 of t2.values()) {
      let r34 = BigInt(o6);
      n = (n << e2) + r34;
    }
    return n;
  }
  __name(h6, "h");
  var d7 = /* @__PURE__ */ __name((t2 = "") => h6(k6(t2)).toString(36).slice(1), "d"), f6 = Array.from({ length: 26 }, (t2, e2) => String.fromCharCode(e2 + 97)), A8 = /* @__PURE__ */ __name((t2) => f6[Math.floor(t2() * f6.length)], "A"), x9 = /* @__PURE__ */ __name(({ globalObj: t2 = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : {}, random: e2 = Math.random } = {}) => {
    let n = Object.keys(t2).toString(), o6 = n.length ? n + u6(i2, e2) : u6(i2, e2);
    return d7(o6).substring(0, i2);
  }, "x"), C7 = /* @__PURE__ */ __name((t2) => () => t2++, "C"), D7 = 476782367, b8 = /* @__PURE__ */ __name(({ random: t2 = Math.random, counter: e2 = C7(Math.floor(t2() * D7)), length: n = p3, fingerprint: o6 = x9({ random: t2 }) } = {}) => function() {
    let m7 = A8(t2), M6 = Date.now().toString(36), S10 = e2().toString(36), w9 = u6(n, t2), B9 = `${M6 + w9 + S10 + o6}`;
    return `${m7 + d7(B9).substring(1, n)}`;
  }, "b"), E8 = b8(), O9 = /* @__PURE__ */ __name((t2, { minLength: e2 = 2, maxLength: n = i2 } = {}) => {
    let o6 = t2.length, r34 = /^[a-z][0-9a-z]+$/;
    try {
      if (typeof t2 == "string" && o6 >= e2 && o6 <= n && r34.test(t2)) return true;
    } finally {
    }
    return false;
  }, "O");
  s4.exports.getConstants = () => ({ defaultLength: p3, bigLength: i2 });
  s4.exports.init = b8;
  s4.exports.createId = E8;
  s4.exports.bufToBigInt = h6;
  s4.exports.createCounter = C7;
  s4.exports.createFingerprint = x9;
  s4.exports.isCuid = O9;
});
var y2 = l2((P6, a6) => {
  var { createId: _10, init: G8, getConstants: H7, isCuid: J8 } = I3();
  a6.exports.createId = _10;
  a6.exports.init = G8;
  a6.exports.getConstants = H7;
  a6.exports.isCuid = J8;
});
var c2 = T(y2());
var { createId: Q2, init: R, getConstants: U, isCuid: V } = c2;
var W2 = c2.default ?? c2;

// deno:https://esm.sh/@orama/oramacore-events-parser@0.0.5/esnext/oramacore-events-parser.mjs
var w3 = ["initializing", "handle_gpu_overload", "get_llm_config", "determine_query_strategy", "simple_rag", "advanced_autoquery", "handle_system_prompt", "optimize_query", "execute_search", "execute_before_answer_hook", "generate_answer", "generate_related_queries", "completed", "error", "advanced_autoquery_initializing", "advanced_autoquery_analyzing_input", "advanced_autoquery_query_optimized", "advanced_autoquery_select_properties", "advanced_autoquery_properties_selected", "advanced_autoquery_combine_queries", "advanced_autoquery_queries_combined", "advanced_autoquery_generate_tracked_queries", "advanced_autoquery_tracked_queries_generated", "advanced_autoquery_execute_before_retrieval_hook", "advanced_autoquery_hooks_executed", "advanced_autoquery_execute_searches", "advanced_autoquery_search_results", "advanced_autoquery_completed"];
var l3 = class extends TransformStream {
  static {
    __name(this, "l");
  }
  constructor() {
    let e2 = new TextDecoder("utf-8", { ignoreBOM: false }), r34 = "";
    super({ start() {
      r34 = "";
    }, transform(o6, n) {
      let i2 = e2.decode(o6);
      r34 += i2;
      let a6 = r34.indexOf(`

`);
      for (; a6 === -1 && r34.indexOf(`\r
\r
`) !== -1; ) a6 = r34.indexOf(`\r
\r
`);
      for (; a6 !== -1; ) {
        let h6 = 2;
        r34.slice(a6, a6 + 4) === `\r
\r
` && (h6 = 4);
        let f6 = r34.slice(0, a6);
        r34 = r34.slice(a6 + h6);
        let m7 = f6.split(/\r?\n/).filter((p3) => p3.startsWith("data:"));
        for (let p3 of m7) {
          let u6 = p3.replace(/^data:\s*/, "");
          try {
            if (u6.startsWith('"') && u6.endsWith('"')) {
              let d7 = JSON.parse(u6);
              n.enqueue({ type: d7 });
              continue;
            }
            let s4 = JSON.parse(u6);
            if (typeof s4 == "object" && s4 !== null && !("type" in s4)) {
              let d7 = Object.keys(s4);
              if (d7.length === 1) {
                let [y9] = d7, c6 = s4[y9];
                typeof c6 == "object" && c6 !== null ? s4 = { type: y9, ...c6 } : s4 = { type: y9, data: c6 };
              }
            }
            n.enqueue(s4);
          } catch {
            n.enqueue({ type: "error", error: "Invalid JSON in SSE data", state: "parse_error" });
          }
        }
        a6 = r34.indexOf(`

`), a6 === -1 && r34.indexOf(`\r
\r
`) !== -1 && (a6 = r34.indexOf(`\r
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
    }, "value") }), this.done = new Promise((e2) => {
      this.resolveDone = e2;
    });
  }
  on(e2, r34) {
    return this.handlers[e2] || (this.handlers[e2] = []), this.handlers[e2].push(r34), this;
  }
  onStateChange(e2) {
    return this.on("state_changed", e2);
  }
  onProgress(e2) {
    return this.on("progress", e2);
  }
  onEnd(e2) {
    return this.endHandlers.push(e2), this;
  }
  emit(e2) {
    let r34 = this.handlers[e2.type];
    if (r34) for (let n of r34) n(e2);
    (e2.type === "state_changed" && "state" in e2 && (e2.state === "completed" || e2.state === "advanced_autoquery_completed") || e2.type === "error" && "is_terminal" in e2 && e2.is_terminal === true) && this._triggerEnd();
  }
  _triggerEnd() {
    for (let e2 of this.endHandlers) e2();
  }
  _markDone() {
    this.resolveDone();
  }
};
function g4(t2) {
  return t2.type === "acknowledged" || t2.type === "selected_llm" || t2.type === "optimizing_query" || t2.type === "answer_token" || t2.type === "related_queries" || t2.type === "result_action" || t2.type === "state_changed" || t2.type === "error" || t2.type === "progress" || t2.type === "search_results";
}
__name(g4, "g");
function q2(t2) {
  return t2.type === "state_changed" || t2.type === "error" || t2.type === "progress" || t2.type === "search_results";
}
__name(q2, "q");
function x3(t2) {
  let e2 = new _3(), r34 = new l3();
  return (async () => {
    let o6 = t2.pipeThrough(r34).getReader();
    for (; ; ) {
      let { value: n, done: i2 } = await o6.read();
      if (i2) break;
      g4(n) && e2.emit(n);
    }
    await new Promise((n) => setTimeout(n, 0)), e2._markDone();
  })(), e2;
}
__name(x3, "x");
function S2(t2) {
  let e2 = new _3(), r34 = new l3();
  return (async () => {
    let o6 = t2.pipeThrough(r34).getReader();
    for (; ; ) {
      let { value: n, done: i2 } = await o6.read();
      if (i2) break;
      q2(n) && e2.emit(n);
    }
    await new Promise((n) => setTimeout(n, 0)), e2._markDone();
  })(), e2;
}
__name(S2, "S");

// deno:https://esm.sh/node/async_hooks.mjs
var c3 = class {
  static {
    __name(this, "c");
  }
  __unenv__ = true;
  _currentStore;
  _enterStore;
  _enabled = true;
  getStore() {
    return this._currentStore ?? this._enterStore;
  }
  disable() {
    this._enabled = false;
  }
  enable() {
    this._enabled = true;
  }
  enterWith(e2) {
    this._enterStore = e2;
  }
  run(e2, r34, ...t2) {
    this._currentStore = e2;
    let n = r34(...t2);
    return this._currentStore = void 0, n;
  }
  exit(e2, ...r34) {
    let t2 = this._currentStore;
    this._currentStore = void 0;
    let n = e2(...r34);
    return this._currentStore = t2, n;
  }
  static snapshot() {
    throw new Error("[unenv] `AsyncLocalStorage.snapshot` is not implemented!");
  }
};
var S3 = globalThis.AsyncLocalStorage || c3;
var R2 = Symbol("init");
var a2 = Symbol("before");
var o2 = Symbol("after");
var i = Symbol("destroy");
var A2 = Symbol("promiseResolve");
var T2 = class {
  static {
    __name(this, "T");
  }
  __unenv__ = true;
  _enabled = false;
  _callbacks = {};
  constructor(e2 = {}) {
    this._callbacks = e2;
  }
  enable() {
    return this._enabled = true, this;
  }
  disable() {
    return this._enabled = false, this;
  }
  get [R2]() {
    return this._callbacks.init;
  }
  get [a2]() {
    return this._callbacks.before;
  }
  get [o2]() {
    return this._callbacks.after;
  }
  get [i]() {
    return this._callbacks.destroy;
  }
  get [A2]() {
    return this._callbacks.promiseResolve;
  }
};
var s2 = /* @__PURE__ */ __name(function() {
  return 0;
}, "s");
var I4 = Object.assign(/* @__PURE__ */ Object.create(null), { NONE: 0, DIRHANDLE: 1, DNSCHANNEL: 2, ELDHISTOGRAM: 3, FILEHANDLE: 4, FILEHANDLECLOSEREQ: 5, BLOBREADER: 6, FSEVENTWRAP: 7, FSREQCALLBACK: 8, FSREQPROMISE: 9, GETADDRINFOREQWRAP: 10, GETNAMEINFOREQWRAP: 11, HEAPSNAPSHOT: 12, HTTP2SESSION: 13, HTTP2STREAM: 14, HTTP2PING: 15, HTTP2SETTINGS: 16, HTTPINCOMINGMESSAGE: 17, HTTPCLIENTREQUEST: 18, JSSTREAM: 19, JSUDPWRAP: 20, MESSAGEPORT: 21, PIPECONNECTWRAP: 22, PIPESERVERWRAP: 23, PIPEWRAP: 24, PROCESSWRAP: 25, PROMISE: 26, QUERYWRAP: 27, QUIC_ENDPOINT: 28, QUIC_LOGSTREAM: 29, QUIC_PACKET: 30, QUIC_SESSION: 31, QUIC_STREAM: 32, QUIC_UDP: 33, SHUTDOWNWRAP: 34, SIGNALWRAP: 35, STATWATCHER: 36, STREAMPIPE: 37, TCPCONNECTWRAP: 38, TCPSERVERWRAP: 39, TCPWRAP: 40, TTYWRAP: 41, UDPSENDWRAP: 42, UDPWRAP: 43, SIGINTWATCHDOG: 44, WORKER: 45, WORKERHEAPSNAPSHOT: 46, WRITEWRAP: 47, ZLIB: 48, CHECKPRIMEREQUEST: 49, PBKDF2REQUEST: 50, KEYPAIRGENREQUEST: 51, KEYGENREQUEST: 52, KEYEXPORTREQUEST: 53, CIPHERREQUEST: 54, DERIVEBITSREQUEST: 55, HASHREQUEST: 56, RANDOMBYTESREQUEST: 57, RANDOMPRIMEREQUEST: 58, SCRYPTREQUEST: 59, SIGNREQUEST: 60, TLSWRAP: 61, VERIFYREQUEST: 62 });
var _4 = 100;
var y3 = class {
  static {
    __name(this, "y");
  }
  __unenv__ = true;
  type;
  _asyncId;
  _triggerAsyncId;
  constructor(e2, r34 = s2()) {
    this.type = e2, this._asyncId = -1 * _4++, this._triggerAsyncId = typeof r34 == "number" ? r34 : r34?.triggerAsyncId;
  }
  static bind(e2, r34, t2) {
    return new E2(r34 ?? "anonymous").bind(e2);
  }
  bind(e2, r34) {
    let t2 = /* @__PURE__ */ __name((...n) => this.runInAsyncScope(e2, r34, ...n), "t");
    return t2.asyncResource = this, t2;
  }
  runInAsyncScope(e2, r34, ...t2) {
    return e2.apply(r34, t2);
  }
  emitDestroy() {
    return this;
  }
  asyncId() {
    return this._asyncId;
  }
  triggerAsyncId() {
    return this._triggerAsyncId;
  }
};
var E2 = globalThis.AsyncResource || y3;

// deno:https://esm.sh/node/events.mjs
function te(e2) {
  return new Error(`[unenv] ${e2} is not implemented yet!`);
}
__name(te, "te");
function w4(e2) {
  return Object.assign(() => {
    throw te(e2);
  }, { __unenv__: true });
}
__name(w4, "w");
var y4 = 10;
var ne = Object.getPrototypeOf(Object.getPrototypeOf(async function* () {
}).prototype);
var G2 = /* @__PURE__ */ __name((e2, t2) => e2, "G");
var _5 = Error;
var ie = Error;
var v3 = Error;
var b3 = Error;
var se = Error;
var C2 = Symbol.for("nodejs.rejection");
var f2 = Symbol.for("kCapture");
var M = Symbol.for("events.errorMonitor");
var d3 = Symbol.for("shapeMode");
var x4 = Symbol.for("events.maxEventTargetListeners");
var oe = Symbol.for("kEnhanceStackBeforeInspector");
var ue = Symbol.for("nodejs.watermarkData");
var S4 = Symbol.for("kEventEmitter");
var h2 = Symbol.for("kAsyncResource");
var le = Symbol.for("kFirstEventParam");
var P = Symbol.for("kResistStopPropagation");
var W3 = Symbol.for("events.maxEventTargetListenersWarned");
var U2 = class E3 {
  static {
    __name(this, "E");
  }
  _events = void 0;
  _eventsCount = 0;
  _maxListeners = y4;
  [f2] = false;
  [d3] = false;
  static captureRejectionSymbol = C2;
  static errorMonitor = M;
  static kMaxEventTargetListeners = x4;
  static kMaxEventTargetListenersWarned = W3;
  static usingDomains = false;
  static get on() {
    return fe;
  }
  static get once() {
    return he;
  }
  static get getEventListeners() {
    return ve;
  }
  static get getMaxListeners() {
    return me;
  }
  static get addAbortListener() {
    return X;
  }
  static get EventEmitterAsyncResource() {
    return ae;
  }
  static get EventEmitter() {
    return E3;
  }
  static setMaxListeners(t2 = y4, ...r34) {
    if (r34.length === 0) y4 = t2;
    else for (let n of r34) if (J2(n)) n[x4] = t2, n[W3] = false;
    else if (typeof n.setMaxListeners == "function") n.setMaxListeners(t2);
    else throw new v3("eventTargets", ["EventEmitter", "EventTarget"], n);
  }
  static listenerCount(t2, r34) {
    if (typeof t2.listenerCount == "function") return t2.listenerCount(r34);
    E3.prototype.listenerCount.call(t2, r34);
  }
  static init() {
    throw new Error("EventEmitter.init() is not implemented.");
  }
  static get captureRejections() {
    return this[f2];
  }
  static set captureRejections(t2) {
    this[f2] = t2;
  }
  static get defaultMaxListeners() {
    return y4;
  }
  static set defaultMaxListeners(t2) {
    y4 = t2;
  }
  constructor(t2) {
    this._events === void 0 || this._events === Object.getPrototypeOf(this)._events ? (this._events = { __proto__: null }, this._eventsCount = 0, this[d3] = false) : this[d3] = true, this._maxListeners = this._maxListeners || void 0, t2?.captureRejections ? this[f2] = !!t2.captureRejections : this[f2] = E3.prototype[f2];
  }
  setMaxListeners(t2) {
    return this._maxListeners = t2, this;
  }
  getMaxListeners() {
    return T3(this);
  }
  emit(t2, ...r34) {
    let n = t2 === "error", i2 = this._events;
    if (i2 !== void 0) n && i2[M] !== void 0 && this.emit(M, ...r34), n = n && i2.error === void 0;
    else if (!n) return false;
    if (n) {
      let s4;
      if (r34.length > 0 && (s4 = r34[0]), s4 instanceof Error) {
        try {
          let c6 = {};
          Error.captureStackTrace?.(c6, E3.prototype.emit), Object.defineProperty(s4, oe, { __proto__: null, value: Function.prototype.bind(de, this, s4, c6), configurable: true });
        } catch {
        }
        throw s4;
      }
      let l6;
      try {
        l6 = G2(s4);
      } catch {
        l6 = s4;
      }
      let a6 = new ie(l6);
      throw a6.context = s4, a6;
    }
    let o6 = i2[t2];
    if (o6 === void 0) return false;
    if (typeof o6 == "function") {
      let s4 = o6.apply(this, r34);
      s4 != null && K2(this, s4, t2, r34);
    } else {
      let s4 = o6.length, l6 = I5(o6);
      for (let a6 = 0; a6 < s4; ++a6) {
        let c6 = l6[a6].apply(this, r34);
        c6 != null && K2(this, c6, t2, r34);
      }
    }
    return true;
  }
  addListener(t2, r34) {
    return q3(this, t2, r34, false), this;
  }
  on(t2, r34) {
    return this.addListener(t2, r34);
  }
  prependListener(t2, r34) {
    return q3(this, t2, r34, true), this;
  }
  once(t2, r34) {
    return this.on(t2, z3(this, t2, r34)), this;
  }
  prependOnceListener(t2, r34) {
    return this.prependListener(t2, z3(this, t2, r34)), this;
  }
  removeListener(t2, r34) {
    let n = this._events;
    if (n === void 0) return this;
    let i2 = n[t2];
    if (i2 === void 0) return this;
    if (i2 === r34 || i2.listener === r34) this._eventsCount -= 1, this[d3] ? n[t2] = void 0 : this._eventsCount === 0 ? this._events = { __proto__: null } : (delete n[t2], n.removeListener && this.emit("removeListener", t2, i2.listener || r34));
    else if (typeof i2 != "function") {
      let o6 = -1;
      for (let s4 = i2.length - 1; s4 >= 0; s4--) if (i2[s4] === r34 || i2[s4].listener === r34) {
        o6 = s4;
        break;
      }
      if (o6 < 0) return this;
      o6 === 0 ? i2.shift() : ge(i2, o6), i2.length === 1 && (n[t2] = i2[0]), n.removeListener !== void 0 && this.emit("removeListener", t2, r34);
    }
    return this;
  }
  off(t2, r34) {
    return this.removeListener(t2, r34);
  }
  removeAllListeners(t2) {
    let r34 = this._events;
    if (r34 === void 0) return this;
    if (r34.removeListener === void 0) return arguments.length === 0 ? (this._events = { __proto__: null }, this._eventsCount = 0) : r34[t2] !== void 0 && (--this._eventsCount === 0 ? this._events = { __proto__: null } : delete r34[t2]), this[d3] = false, this;
    if (arguments.length === 0) {
      for (let i2 of Reflect.ownKeys(r34)) i2 !== "removeListener" && this.removeAllListeners(i2);
      return this.removeAllListeners("removeListener"), this._events = { __proto__: null }, this._eventsCount = 0, this[d3] = false, this;
    }
    let n = r34[t2];
    if (typeof n == "function") this.removeListener(t2, n);
    else if (n !== void 0) for (let i2 = n.length - 1; i2 >= 0; i2--) this.removeListener(t2, n[i2]);
    return this;
  }
  listeners(t2) {
    return B3(this, t2, true);
  }
  rawListeners(t2) {
    return B3(this, t2, false);
  }
  eventNames() {
    return this._eventsCount > 0 ? Reflect.ownKeys(this._events) : [];
  }
  listenerCount(t2, r34) {
    let n = this._events;
    if (n !== void 0) {
      let i2 = n[t2];
      if (typeof i2 == "function") return r34 != null ? r34 === i2 || r34 === i2.listener ? 1 : 0 : 1;
      if (i2 !== void 0) {
        if (r34 != null) {
          let o6 = 0;
          for (let s4 = 0, l6 = i2.length; s4 < l6; s4++) (i2[s4] === r34 || i2[s4].listener === r34) && o6++;
          return o6;
        }
        return i2.length;
      }
    }
    return 0;
  }
};
var ae = class extends U2 {
  static {
    __name(this, "ae");
  }
  constructor(e2) {
    let t2;
    typeof e2 == "string" ? (t2 = e2, e2 = void 0) : t2 = e2?.name || new.target.name, super(e2), this[h2] = new ce(this, t2, e2);
  }
  emit(e2, ...t2) {
    if (this[h2] === void 0) throw new _5("EventEmitterAsyncResource");
    let { asyncResource: r34 } = this;
    return Array.prototype.unshift(t2, super.emit, this, e2), Reflect.apply(r34.runInAsyncScope, r34, t2);
  }
  emitDestroy() {
    if (this[h2] === void 0) throw new _5("EventEmitterAsyncResource");
    this.asyncResource.emitDestroy();
  }
  get asyncId() {
    if (this[h2] === void 0) throw new _5("EventEmitterAsyncResource");
    return this.asyncResource.asyncId();
  }
  get triggerAsyncId() {
    if (this[h2] === void 0) throw new _5("EventEmitterAsyncResource");
    return this.asyncResource.triggerAsyncId();
  }
  get asyncResource() {
    if (this[h2] === void 0) throw new _5("EventEmitterAsyncResource");
    return this[h2];
  }
};
var ce = class extends E2 {
  static {
    __name(this, "ce");
  }
  constructor(e2, t2, r34) {
    super(t2, r34), this[S4] = e2;
  }
  get eventEmitter() {
    if (this[S4] === void 0) throw new _5("EventEmitterReferencingAsyncResource");
    return this[S4];
  }
};
var fe = /* @__PURE__ */ __name(function(e2, t2, r34 = {}) {
  let n = r34.signal;
  if (n?.aborted) throw new b3(void 0, { cause: n?.reason });
  let i2 = r34.highWaterMark ?? r34.highWatermark ?? Number.MAX_SAFE_INTEGER, o6 = r34.lowWaterMark ?? r34.lowWatermark ?? 1, s4 = new N3(), l6 = new N3(), a6 = false, c6 = null, m7 = false, p3 = 0, Q8 = Object.setPrototypeOf({ next() {
    if (p3) {
      let u6 = s4.shift();
      return p3--, a6 && p3 < o6 && (e2.resume?.(), a6 = false), Promise.resolve(k(u6, false));
    }
    if (c6) {
      let u6 = Promise.reject(c6);
      return c6 = null, u6;
    }
    return m7 ? L8() : new Promise(function(u6, ee5) {
      l6.push({ resolve: u6, reject: ee5 });
    });
  }, return() {
    return L8();
  }, throw(u6) {
    if (!u6 || !(u6 instanceof Error)) throw new v3("EventEmitter.AsyncIterator", "Error", u6);
    R7(u6);
  }, [Symbol.asyncIterator]() {
    return this;
  }, [ue]: { get size() {
    return p3;
  }, get low() {
    return o6;
  }, get high() {
    return i2;
  }, get isPaused() {
    return a6;
  } } }, ne), { addEventListener: A8, removeAll: V7 } = Ee();
  A8(e2, t2, r34[le] ? $8 : function(...u6) {
    return $8(u6);
  }), t2 !== "error" && typeof e2.on == "function" && A8(e2, "error", R7);
  let F7 = r34?.close;
  if (F7?.length) for (let u6 of F7) A8(e2, u6, L8);
  let Y7 = n ? X(n, Z7) : null;
  return Q8;
  function Z7() {
    R7(new b3(void 0, { cause: n?.reason }));
  }
  __name(Z7, "Z");
  function $8(u6) {
    l6.isEmpty() ? (p3++, !a6 && p3 > i2 && (a6 = true, e2.pause?.()), s4.push(u6)) : l6.shift().resolve(k(u6, false));
  }
  __name($8, "$");
  function R7(u6) {
    l6.isEmpty() ? c6 = u6 : l6.shift().reject(u6), L8();
  }
  __name(R7, "R");
  function L8() {
    Y7?.[Symbol.dispose](), V7(), m7 = true;
    let u6 = k(void 0, true);
    for (; !l6.isEmpty(); ) l6.shift().resolve(u6);
    return Promise.resolve(u6);
  }
  __name(L8, "L");
}, "fe");
var he = /* @__PURE__ */ __name(async function(e2, t2, r34 = {}) {
  let n = r34?.signal;
  if (n?.aborted) throw new b3(void 0, { cause: n?.reason });
  return new Promise((i2, o6) => {
    let s4 = /* @__PURE__ */ __name((m7) => {
      typeof e2.removeListener == "function" && e2.removeListener(t2, l6), n != null && g5(n, "abort", c6), o6(m7);
    }, "s"), l6 = /* @__PURE__ */ __name((...m7) => {
      typeof e2.removeListener == "function" && e2.removeListener("error", s4), n != null && g5(n, "abort", c6), i2(m7);
    }, "l"), a6 = { __proto__: null, once: true, [P]: true };
    O3(e2, t2, l6, a6), t2 !== "error" && typeof e2.once == "function" && e2.once("error", s4);
    function c6() {
      g5(e2, t2, l6), g5(e2, "error", s4), o6(new b3(void 0, { cause: n?.reason }));
    }
    __name(c6, "c");
    n != null && O3(n, "abort", c6, { __proto__: null, once: true, [P]: true });
  });
}, "he");
var X = /* @__PURE__ */ __name(function(e2, t2) {
  if (e2 === void 0) throw new v3("signal", "AbortSignal", e2);
  let r34;
  return e2.aborted ? queueMicrotask(() => t2()) : (e2.addEventListener("abort", t2, { __proto__: null, once: true, [P]: true }), r34 = /* @__PURE__ */ __name(() => {
    e2.removeEventListener("abort", t2);
  }, "r")), { __proto__: null, [Symbol.dispose]() {
    r34?.();
  } };
}, "X");
var ve = /* @__PURE__ */ __name(function(e2, t2) {
  if (typeof e2.listeners == "function") return e2.listeners(t2);
  if (J2(e2)) {
    let r34 = e2[kEvents].get(t2), n = [], i2 = r34?.next;
    for (; i2?.listener !== void 0; ) {
      let o6 = i2.listener?.deref ? i2.listener.deref() : i2.listener;
      n.push(o6), i2 = i2.next;
    }
    return n;
  }
  throw new v3("emitter", ["EventEmitter", "EventTarget"], e2);
}, "ve");
var me = /* @__PURE__ */ __name(function(e2) {
  if (typeof e2?.getMaxListeners == "function") return T3(e2);
  if (e2?.[x4]) return e2[x4];
  throw new v3("emitter", ["EventEmitter", "EventTarget"], e2);
}, "me");
var H = 2048;
var j3 = H - 1;
var D2 = class {
  static {
    __name(this, "D");
  }
  bottom;
  top;
  list;
  next;
  constructor() {
    this.bottom = 0, this.top = 0, this.list = new Array(H), this.next = null;
  }
  isEmpty() {
    return this.top === this.bottom;
  }
  isFull() {
    return (this.top + 1 & j3) === this.bottom;
  }
  push(e2) {
    this.list[this.top] = e2, this.top = this.top + 1 & j3;
  }
  shift() {
    let e2 = this.list[this.bottom];
    return e2 === void 0 ? null : (this.list[this.bottom] = void 0, this.bottom = this.bottom + 1 & j3, e2);
  }
};
var N3 = class {
  static {
    __name(this, "N");
  }
  head;
  tail;
  constructor() {
    this.head = this.tail = new D2();
  }
  isEmpty() {
    return this.head.isEmpty();
  }
  push(e2) {
    this.head.isFull() && (this.head = this.head.next = new D2()), this.head.push(e2);
  }
  shift() {
    let e2 = this.tail, t2 = e2.shift();
    return e2.isEmpty() && e2.next !== null && (this.tail = e2.next, e2.next = null), t2;
  }
};
function J2(e2) {
  return typeof e2?.addEventListener == "function";
}
__name(J2, "J");
function K2(e2, t2, r34, n) {
  if (e2[f2]) try {
    let i2 = t2.then;
    typeof i2 == "function" && i2.call(t2, void 0, function(o6) {
      setTimeout(pe, 0, e2, o6, r34, n);
    });
  } catch (i2) {
    e2.emit("error", i2);
  }
}
__name(K2, "K");
function pe(e2, t2, r34, n) {
  if (typeof e2[C2] == "function") e2[C2](t2, r34, ...n);
  else {
    let i2 = e2[f2];
    try {
      e2[f2] = false, e2.emit("error", t2);
    } finally {
      e2[f2] = i2;
    }
  }
}
__name(pe, "pe");
function T3(e2) {
  return e2._maxListeners === void 0 ? y4 : e2._maxListeners;
}
__name(T3, "T");
function de(e2, t2) {
  let r34 = "";
  try {
    let { name: o6 } = this.constructor;
    o6 !== "EventEmitter" && (r34 = ` on ${o6} instance`);
  } catch {
  }
  let n = `
Emitted 'error' event${r34} at:
`, i2 = (t2.stack || "").split(`
`).slice(1);
  return e2.stack + n + i2.join(`
`);
}
__name(de, "de");
function q3(e2, t2, r34, n) {
  let i2, o6, s4;
  if (o6 = e2._events, o6 === void 0 ? (o6 = e2._events = { __proto__: null }, e2._eventsCount = 0) : (o6.newListener !== void 0 && (e2.emit("newListener", t2, r34.listener ?? r34), o6 = e2._events), s4 = o6[t2]), s4 === void 0) o6[t2] = r34, ++e2._eventsCount;
  else if (typeof s4 == "function" ? s4 = o6[t2] = n ? [r34, s4] : [s4, r34] : n ? s4.unshift(r34) : s4.push(r34), i2 = T3(e2), i2 > 0 && s4.length > i2 && !s4.warned) {
    s4.warned = true;
    let l6 = new se(`Possible EventEmitter memory leak detected. ${s4.length} ${String(t2)} listeners added to ${G2(e2, { depth: -1 })}. MaxListeners is ${i2}. Use emitter.setMaxListeners() to increase limit`, { name: "MaxListenersExceededWarning", emitter: e2, type: t2, count: s4.length });
    console.warn(l6);
  }
  return e2;
}
__name(q3, "q");
function ye() {
  if (!this.fired) return this.target.removeListener(this.type, this.wrapFn), this.fired = true, arguments.length === 0 ? this.listener.call(this.target) : this.listener.apply(this.target, arguments);
}
__name(ye, "ye");
function z3(e2, t2, r34) {
  let n = { fired: false, wrapFn: void 0, target: e2, type: t2, listener: r34 }, i2 = ye.bind(n);
  return i2.listener = r34, n.wrapFn = i2, i2;
}
__name(z3, "z");
function B3(e2, t2, r34) {
  let n = e2._events;
  if (n === void 0) return [];
  let i2 = n[t2];
  return i2 === void 0 ? [] : typeof i2 == "function" ? r34 ? [i2.listener || i2] : [i2] : r34 ? _e(i2) : I5(i2);
}
__name(B3, "B");
function I5(e2) {
  switch (e2.length) {
    case 2:
      return [e2[0], e2[1]];
    case 3:
      return [e2[0], e2[1], e2[2]];
    case 4:
      return [e2[0], e2[1], e2[2], e2[3]];
    case 5:
      return [e2[0], e2[1], e2[2], e2[3], e2[4]];
    case 6:
      return [e2[0], e2[1], e2[2], e2[3], e2[4], e2[5]];
  }
  return Array.prototype.slice.call(e2);
}
__name(I5, "I");
function _e(e2) {
  let t2 = I5(e2);
  for (let r34 = 0; r34 < t2.length; ++r34) {
    let n = t2[r34].listener;
    typeof n == "function" && (t2[r34] = n);
  }
  return t2;
}
__name(_e, "_e");
function k(e2, t2) {
  return { value: e2, done: t2 };
}
__name(k, "k");
function g5(e2, t2, r34, n) {
  if (typeof e2.removeListener == "function") e2.removeListener(t2, r34);
  else if (typeof e2.removeEventListener == "function") e2.removeEventListener(t2, r34, n);
  else throw new v3("emitter", "EventEmitter", e2);
}
__name(g5, "g");
function O3(e2, t2, r34, n) {
  if (typeof e2.on == "function") n?.once ? e2.once(t2, r34) : e2.on(t2, r34);
  else if (typeof e2.addEventListener == "function") e2.addEventListener(t2, r34, n);
  else throw new v3("emitter", "EventEmitter", e2);
}
__name(O3, "O");
function Ee() {
  let e2 = [];
  return { addEventListener(t2, r34, n, i2) {
    O3(t2, r34, n, i2), Array.prototype.push(e2, [t2, r34, n, i2]);
  }, removeAll() {
    for (; e2.length > 0; ) Reflect.apply(g5, void 0, e2.pop());
  } };
}
__name(Ee, "Ee");
function ge(e2, t2) {
  for (; t2 + 1 < e2.length; t2++) e2[t2] = e2[t2 + 1];
  e2.pop();
}
__name(ge, "ge");
var Me = Symbol.for("nodejs.rejection");
var je = Symbol.for("events.errorMonitor");
var Ce = w4("node:events.setMaxListeners");
var Pe = w4("node:events.listenerCount");
var Oe = w4("node:events.init");

// deno:https://esm.sh/node/tty.mjs
var o3 = class {
  static {
    __name(this, "o");
  }
  fd;
  isRaw = false;
  isTTY = false;
  constructor(t2) {
    this.fd = t2;
  }
  setRawMode(t2) {
    return this.isRaw = t2, this;
  }
};
var s3 = class {
  static {
    __name(this, "s");
  }
  fd;
  columns = 80;
  rows = 24;
  isTTY = false;
  constructor(t2) {
    this.fd = t2;
  }
  clearLine(t2, r34) {
    return r34 && r34(), false;
  }
  clearScreenDown(t2) {
    return t2 && t2(), false;
  }
  cursorTo(t2, r34, e2) {
    return e2 && typeof e2 == "function" && e2(), false;
  }
  moveCursor(t2, r34, e2) {
    return e2 && e2(), false;
  }
  getColorDepth(t2) {
    return 1;
  }
  hasColors(t2, r34) {
    return false;
  }
  getWindowSize() {
    return [this.columns, this.rows];
  }
  write(t2, r34, e2) {
    t2 instanceof Uint8Array && (t2 = new TextDecoder().decode(t2));
    try {
      console.log(t2);
    } catch {
    }
    return e2 && typeof e2 == "function" && e2(), false;
  }
};

// deno:https://esm.sh/node/process.mjs
function r(t2) {
  return new Error(`[unenv] ${t2} is not implemented yet!`);
}
__name(r, "r");
function a3(t2) {
  return Object.assign(() => {
    throw r(t2);
  }, { __unenv__: true });
}
__name(a3, "a");
var v4 = "22.14.0";
var _6 = class m2 extends U2 {
  static {
    __name(this, "m");
  }
  env;
  hrtime;
  nextTick;
  constructor(e2) {
    super(), this.env = e2.env, this.hrtime = e2.hrtime, this.nextTick = e2.nextTick;
    for (let s4 of [...Object.getOwnPropertyNames(m2.prototype), ...Object.getOwnPropertyNames(U2.prototype)]) {
      let i2 = this[s4];
      typeof i2 == "function" && (this[s4] = i2.bind(this));
    }
  }
  emitWarning(e2, s4, i2) {
    console.warn(`${i2 ? `[${i2}] ` : ""}${s4 ? `${s4}: ` : ""}${e2}`);
  }
  emit(...e2) {
    return super.emit(...e2);
  }
  listeners(e2) {
    return super.listeners(e2);
  }
  #t;
  #s;
  #r;
  get stdin() {
    return this.#t ??= new o3(0);
  }
  get stdout() {
    return this.#s ??= new s3(1);
  }
  get stderr() {
    return this.#r ??= new s3(2);
  }
  #e = "/";
  chdir(e2) {
    this.#e = e2;
  }
  cwd() {
    return this.#e;
  }
  arch = "";
  platform = "";
  argv = [];
  argv0 = "";
  execArgv = [];
  execPath = "";
  title = "";
  pid = 200;
  ppid = 100;
  get version() {
    return `v${v4}`;
  }
  get versions() {
    return { node: v4 };
  }
  get allowedNodeEnvironmentFlags() {
    return /* @__PURE__ */ new Set();
  }
  get sourceMapsEnabled() {
    return false;
  }
  get debugPort() {
    return 0;
  }
  get throwDeprecation() {
    return false;
  }
  get traceDeprecation() {
    return false;
  }
  get features() {
    return {};
  }
  get release() {
    return {};
  }
  get connected() {
    return false;
  }
  get config() {
    return {};
  }
  get moduleLoadList() {
    return [];
  }
  constrainedMemory() {
    return 0;
  }
  availableMemory() {
    return 0;
  }
  uptime() {
    return 0;
  }
  resourceUsage() {
    return {};
  }
  ref() {
  }
  unref() {
  }
  umask() {
    throw r("process.umask");
  }
  getBuiltinModule() {
  }
  getActiveResourcesInfo() {
    throw r("process.getActiveResourcesInfo");
  }
  exit() {
    throw r("process.exit");
  }
  reallyExit() {
    throw r("process.reallyExit");
  }
  kill() {
    throw r("process.kill");
  }
  abort() {
    throw r("process.abort");
  }
  dlopen() {
    throw r("process.dlopen");
  }
  setSourceMapsEnabled() {
    throw r("process.setSourceMapsEnabled");
  }
  loadEnvFile() {
    throw r("process.loadEnvFile");
  }
  disconnect() {
    throw r("process.disconnect");
  }
  cpuUsage() {
    throw r("process.cpuUsage");
  }
  setUncaughtExceptionCaptureCallback() {
    throw r("process.setUncaughtExceptionCaptureCallback");
  }
  hasUncaughtExceptionCaptureCallback() {
    throw r("process.hasUncaughtExceptionCaptureCallback");
  }
  initgroups() {
    throw r("process.initgroups");
  }
  openStdin() {
    throw r("process.openStdin");
  }
  assert() {
    throw r("process.assert");
  }
  binding() {
    throw r("process.binding");
  }
  permission = { has: a3("process.permission.has") };
  report = { directory: "", filename: "", signal: "SIGUSR2", compact: false, reportOnFatalError: false, reportOnSignal: false, reportOnUncaughtException: false, getReport: a3("process.report.getReport"), writeReport: a3("process.report.writeReport") };
  finalization = { register: a3("process.finalization.register"), unregister: a3("process.finalization.unregister"), registerBeforeExit: a3("process.finalization.registerBeforeExit") };
  memoryUsage = Object.assign(() => ({ arrayBuffers: 0, rss: 0, external: 0, heapTotal: 0, heapUsed: 0 }), { rss: /* @__PURE__ */ __name(() => 0, "rss") });
  mainModule = void 0;
  domain = void 0;
  send = void 0;
  exitCode = void 0;
  channel = void 0;
  getegid = void 0;
  geteuid = void 0;
  getgid = void 0;
  getgroups = void 0;
  getuid = void 0;
  setegid = void 0;
  seteuid = void 0;
  setgid = void 0;
  setgroups = void 0;
  setuid = void 0;
  _events = void 0;
  _eventsCount = void 0;
  _exiting = void 0;
  _maxListeners = void 0;
  _debugEnd = void 0;
  _debugProcess = void 0;
  _fatalException = void 0;
  _getActiveHandles = void 0;
  _getActiveRequests = void 0;
  _kill = void 0;
  _preload_modules = void 0;
  _rawDebug = void 0;
  _startProfilerIdleNotifier = void 0;
  _stopProfilerIdleNotifier = void 0;
  _tickCallback = void 0;
  _disconnect = void 0;
  _handleQueue = void 0;
  _pendingMessage = void 0;
  _channel = void 0;
  _send = void 0;
  _linkedBinding = void 0;
};
var u2 = /* @__PURE__ */ Object.create(null);
var b4 = globalThis.process;
var o4 = /* @__PURE__ */ __name((t2) => globalThis.__env__ || b4?.env || (t2 ? u2 : globalThis), "o");
var x5 = new Proxy(u2, { get(t2, e2) {
  return o4()[e2] ?? u2[e2];
}, has(t2, e2) {
  let s4 = o4();
  return e2 in s4 || e2 in u2;
}, set(t2, e2, s4) {
  let i2 = o4(true);
  return i2[e2] = s4, true;
}, deleteProperty(t2, e2) {
  let s4 = o4(true);
  return delete s4[e2], true;
}, ownKeys() {
  let t2 = o4();
  return Object.keys(t2);
}, getOwnPropertyDescriptor(t2, e2) {
  let s4 = o4();
  if (e2 in s4) return { value: s4[e2], writable: true, enumerable: true, configurable: true };
} });
var w5 = Object.assign(function(t2) {
  let e2 = Date.now(), s4 = Math.trunc(e2 / 1e3), i2 = e2 % 1e3 * 1e6;
  if (t2) {
    let d7 = s4 - t2[0], n = i2 - t2[0];
    return n < 0 && (d7 = d7 - 1, n = 1e9 + n), [d7, n];
  }
  return [s4, i2];
}, { bigint: /* @__PURE__ */ __name(function() {
  return BigInt(Date.now() * 1e6);
}, "bigint") });
var E4 = globalThis.queueMicrotask ? (t2, ...e2) => {
  globalThis.queueMicrotask(t2.bind(void 0, ...e2));
} : k2();
function k2() {
  let t2 = [], e2 = false, s4, i2 = -1;
  function d7() {
    !e2 || !s4 || (e2 = false, s4.length > 0 ? t2 = [...s4, ...t2] : i2 = -1, t2.length > 0 && n());
  }
  __name(d7, "d");
  function n() {
    if (e2) return;
    let c6 = setTimeout(d7);
    e2 = true;
    let l6 = t2.length;
    for (; l6; ) {
      for (s4 = t2, t2 = []; ++i2 < l6; ) s4 && s4[i2]();
      i2 = -1, l6 = t2.length;
    }
    s4 = void 0, e2 = false, clearTimeout(c6);
  }
  __name(n, "n");
  return (c6, ...l6) => {
    t2.push(c6.bind(void 0, ...l6)), t2.length === 1 && !e2 && setTimeout(n);
  };
}
__name(k2, "k");
var h3 = new _6({ env: x5, hrtime: w5, nextTick: E4 });
var A3 = h3;
var { abort: O4, addListener: T4, allowedNodeEnvironmentFlags: S5, hasUncaughtExceptionCaptureCallback: N4, setUncaughtExceptionCaptureCallback: R3, loadEnvFile: I6, sourceMapsEnabled: B4, arch: j4, argv: D3, argv0: F2, chdir: $3, config: z4, connected: q4, constrainedMemory: W4, availableMemory: H2, cpuUsage: Q3, cwd: G3, debugPort: K3, dlopen: J3, disconnect: V2, emit: X2, emitWarning: Y2, env: Z2, eventNames: ee, execArgv: te2, execPath: se2, exit: re, finalization: ie2, features: ne2, getBuiltinModule: ae2, getActiveResourcesInfo: oe2, getMaxListeners: de2, hrtime: le2, kill: ue2, listeners: ce2, listenerCount: ge2, memoryUsage: pe2, nextTick: ve2, on: me2, off: he2, once: fe2, pid: _e2, platform: be, ppid: xe, prependListener: we, prependOnceListener: Ee2, rawListeners: ke, release: ye2, removeAllListeners: Me2, removeListener: Ce2, report: Le, resourceUsage: Pe2, setMaxListeners: Ue, setSourceMapsEnabled: Ae, stderr: Oe2, stdin: Te, stdout: Se, title: Ne, umask: Re, uptime: Ie, version: Be, versions: je2, domain: De, initgroups: Fe, moduleLoadList: $e, reallyExit: ze, openStdin: qe, assert: We, binding: He, send: Qe, exitCode: Ge, channel: Ke, getegid: Je, geteuid: Ve, getgid: Xe, getgroups: Ye, getuid: Ze, setegid: et2, seteuid: tt2, setgid: st2, setgroups: rt, setuid: it2, permission: nt2, mainModule: at, ref: ot2, unref: dt, _events: lt, _eventsCount: ut, _exiting: ct, _maxListeners: gt, _debugEnd: pt, _debugProcess: vt, _fatalException: mt, _getActiveHandles: ht, _getActiveRequests: ft, _kill: _t, _preload_modules: bt, _rawDebug: xt, _startProfilerIdleNotifier: wt, _stopProfilerIdleNotifier: Et, _tickCallback: kt, _disconnect: yt, _handleQueue: Mt, _pendingMessage: Ct, _channel: Lt, _send: Pt, _linkedBinding: Ut } = h3;

// deno:https://esm.sh/zod@3.25.76/esnext/v3/helpers/util.mjs
var u3;
(function(n) {
  n.assertEqual = (e2) => {
  };
  function s4(e2) {
  }
  __name(s4, "s");
  n.assertIs = s4;
  function f6(e2) {
    throw new Error();
  }
  __name(f6, "f");
  n.assertNever = f6, n.arrayToEnum = (e2) => {
    let r34 = {};
    for (let o6 of e2) r34[o6] = o6;
    return r34;
  }, n.getValidEnumValues = (e2) => {
    let r34 = n.objectKeys(e2).filter((i2) => typeof e2[e2[i2]] != "number"), o6 = {};
    for (let i2 of r34) o6[i2] = e2[i2];
    return n.objectValues(o6);
  }, n.objectValues = (e2) => n.objectKeys(e2).map(function(r34) {
    return e2[r34];
  }), n.objectKeys = typeof Object.keys == "function" ? (e2) => Object.keys(e2) : (e2) => {
    let r34 = [];
    for (let o6 in e2) Object.prototype.hasOwnProperty.call(e2, o6) && r34.push(o6);
    return r34;
  }, n.find = (e2, r34) => {
    for (let o6 of e2) if (r34(o6)) return o6;
  }, n.isInteger = typeof Number.isInteger == "function" ? (e2) => Number.isInteger(e2) : (e2) => typeof e2 == "number" && Number.isFinite(e2) && Math.floor(e2) === e2;
  function a6(e2, r34 = " | ") {
    return e2.map((o6) => typeof o6 == "string" ? `'${o6}'` : o6).join(r34);
  }
  __name(a6, "a");
  n.joinValues = a6, n.jsonStringifyReplacer = (e2, r34) => typeof r34 == "bigint" ? r34.toString() : r34;
})(u3 || (u3 = {}));
var c4;
(function(n) {
  n.mergeShapes = (s4, f6) => ({ ...s4, ...f6 });
})(c4 || (c4 = {}));
var t = u3.arrayToEnum(["string", "nan", "number", "integer", "float", "boolean", "date", "bigint", "symbol", "function", "undefined", "null", "array", "object", "unknown", "promise", "void", "never", "map", "set"]);
var y5 = /* @__PURE__ */ __name((n) => {
  switch (typeof n) {
    case "undefined":
      return t.undefined;
    case "string":
      return t.string;
    case "number":
      return Number.isNaN(n) ? t.nan : t.number;
    case "boolean":
      return t.boolean;
    case "function":
      return t.function;
    case "bigint":
      return t.bigint;
    case "symbol":
      return t.symbol;
    case "object":
      return Array.isArray(n) ? t.array : n === null ? t.null : n.then && typeof n.then == "function" && n.catch && typeof n.catch == "function" ? t.promise : typeof Map < "u" && n instanceof Map ? t.map : typeof Set < "u" && n instanceof Set ? t.set : typeof Date < "u" && n instanceof Date ? t.date : t.object;
    default:
      return t.unknown;
  }
}, "y");

// deno:https://esm.sh/zod@3.25.76/esnext/v3/ZodError.mjs
var f3 = u3.arrayToEnum(["invalid_type", "invalid_literal", "custom", "invalid_union", "invalid_union_discriminator", "invalid_enum_value", "unrecognized_keys", "invalid_arguments", "invalid_return_type", "invalid_date", "invalid_string", "too_small", "too_big", "invalid_intersection_types", "not_multiple_of", "not_finite"]);
var c5 = class a4 extends Error {
  static {
    __name(this, "a");
  }
  get errors() {
    return this.issues;
  }
  constructor(e2) {
    super(), this.issues = [], this.addIssue = (r34) => {
      this.issues = [...this.issues, r34];
    }, this.addIssues = (r34 = []) => {
      this.issues = [...this.issues, ...r34];
    };
    let s4 = new.target.prototype;
    Object.setPrototypeOf ? Object.setPrototypeOf(this, s4) : this.__proto__ = s4, this.name = "ZodError", this.issues = e2;
  }
  format(e2) {
    let s4 = e2 || function(n) {
      return n.message;
    }, r34 = { _errors: [] }, i2 = /* @__PURE__ */ __name((n) => {
      for (let t2 of n.issues) if (t2.code === "invalid_union") t2.unionErrors.map(i2);
      else if (t2.code === "invalid_return_type") i2(t2.returnTypeError);
      else if (t2.code === "invalid_arguments") i2(t2.argumentsError);
      else if (t2.path.length === 0) r34._errors.push(s4(t2));
      else {
        let o6 = r34, l6 = 0;
        for (; l6 < t2.path.length; ) {
          let u6 = t2.path[l6];
          l6 === t2.path.length - 1 ? (o6[u6] = o6[u6] || { _errors: [] }, o6[u6]._errors.push(s4(t2))) : o6[u6] = o6[u6] || { _errors: [] }, o6 = o6[u6], l6++;
        }
      }
    }, "i");
    return i2(this), r34;
  }
  static assert(e2) {
    if (!(e2 instanceof a4)) throw new Error(`Not a ZodError: ${e2}`);
  }
  toString() {
    return this.message;
  }
  get message() {
    return JSON.stringify(this.issues, u3.jsonStringifyReplacer, 2);
  }
  get isEmpty() {
    return this.issues.length === 0;
  }
  flatten(e2 = (s4) => s4.message) {
    let s4 = {}, r34 = [];
    for (let i2 of this.issues) if (i2.path.length > 0) {
      let n = i2.path[0];
      s4[n] = s4[n] || [], s4[n].push(e2(i2));
    } else r34.push(e2(i2));
    return { formErrors: r34, fieldErrors: s4 };
  }
  get formErrors() {
    return this.flatten();
  }
};
c5.create = (a6) => new c5(a6);

// deno:https://esm.sh/zod@3.25.76/esnext/v3/locales/en.mjs
var r2 = /* @__PURE__ */ __name((e2, i2) => {
  let t2;
  switch (e2.code) {
    case f3.invalid_type:
      e2.received === t.undefined ? t2 = "Required" : t2 = `Expected ${e2.expected}, received ${e2.received}`;
      break;
    case f3.invalid_literal:
      t2 = `Invalid literal value, expected ${JSON.stringify(e2.expected, u3.jsonStringifyReplacer)}`;
      break;
    case f3.unrecognized_keys:
      t2 = `Unrecognized key(s) in object: ${u3.joinValues(e2.keys, ", ")}`;
      break;
    case f3.invalid_union:
      t2 = "Invalid input";
      break;
    case f3.invalid_union_discriminator:
      t2 = `Invalid discriminator value. Expected ${u3.joinValues(e2.options)}`;
      break;
    case f3.invalid_enum_value:
      t2 = `Invalid enum value. Expected ${u3.joinValues(e2.options)}, received '${e2.received}'`;
      break;
    case f3.invalid_arguments:
      t2 = "Invalid function arguments";
      break;
    case f3.invalid_return_type:
      t2 = "Invalid function return type";
      break;
    case f3.invalid_date:
      t2 = "Invalid date";
      break;
    case f3.invalid_string:
      typeof e2.validation == "object" ? "includes" in e2.validation ? (t2 = `Invalid input: must include "${e2.validation.includes}"`, typeof e2.validation.position == "number" && (t2 = `${t2} at one or more positions greater than or equal to ${e2.validation.position}`)) : "startsWith" in e2.validation ? t2 = `Invalid input: must start with "${e2.validation.startsWith}"` : "endsWith" in e2.validation ? t2 = `Invalid input: must end with "${e2.validation.endsWith}"` : u3.assertNever(e2.validation) : e2.validation !== "regex" ? t2 = `Invalid ${e2.validation}` : t2 = "Invalid";
      break;
    case f3.too_small:
      e2.type === "array" ? t2 = `Array must contain ${e2.exact ? "exactly" : e2.inclusive ? "at least" : "more than"} ${e2.minimum} element(s)` : e2.type === "string" ? t2 = `String must contain ${e2.exact ? "exactly" : e2.inclusive ? "at least" : "over"} ${e2.minimum} character(s)` : e2.type === "number" ? t2 = `Number must be ${e2.exact ? "exactly equal to " : e2.inclusive ? "greater than or equal to " : "greater than "}${e2.minimum}` : e2.type === "bigint" ? t2 = `Number must be ${e2.exact ? "exactly equal to " : e2.inclusive ? "greater than or equal to " : "greater than "}${e2.minimum}` : e2.type === "date" ? t2 = `Date must be ${e2.exact ? "exactly equal to " : e2.inclusive ? "greater than or equal to " : "greater than "}${new Date(Number(e2.minimum))}` : t2 = "Invalid input";
      break;
    case f3.too_big:
      e2.type === "array" ? t2 = `Array must contain ${e2.exact ? "exactly" : e2.inclusive ? "at most" : "less than"} ${e2.maximum} element(s)` : e2.type === "string" ? t2 = `String must contain ${e2.exact ? "exactly" : e2.inclusive ? "at most" : "under"} ${e2.maximum} character(s)` : e2.type === "number" ? t2 = `Number must be ${e2.exact ? "exactly" : e2.inclusive ? "less than or equal to" : "less than"} ${e2.maximum}` : e2.type === "bigint" ? t2 = `BigInt must be ${e2.exact ? "exactly" : e2.inclusive ? "less than or equal to" : "less than"} ${e2.maximum}` : e2.type === "date" ? t2 = `Date must be ${e2.exact ? "exactly" : e2.inclusive ? "smaller than or equal to" : "smaller than"} ${new Date(Number(e2.maximum))}` : t2 = "Invalid input";
      break;
    case f3.custom:
      t2 = "Invalid input";
      break;
    case f3.invalid_intersection_types:
      t2 = "Intersection results could not be merged";
      break;
    case f3.not_multiple_of:
      t2 = `Number must be a multiple of ${e2.multipleOf}`;
      break;
    case f3.not_finite:
      t2 = "Number must be finite";
      break;
    default:
      t2 = i2.defaultError, u3.assertNever(e2);
  }
  return { message: t2 };
}, "r");
var m3 = r2;

// deno:https://esm.sh/zod@3.25.76/esnext/v3/errors.mjs
var r3 = m3;
function a5() {
  return r3;
}
__name(a5, "a");

// deno:https://esm.sh/zod@3.25.76/esnext/v3/external.mjs
var ce3 = /* @__PURE__ */ __name((r34) => {
  let { data: e2, path: t2, errorMaps: s4, issueData: a6 } = r34, n = [...t2, ...a6.path || []], o6 = { ...a6, path: n };
  if (a6.message !== void 0) return { ...a6, path: n, message: a6.message };
  let i2 = "", u6 = s4.filter((f6) => !!f6).slice().reverse();
  for (let f6 of u6) i2 = f6(o6, { data: e2, defaultError: i2 }).message;
  return { ...a6, path: n, message: i2 };
}, "ce");
function d4(r34, e2) {
  let t2 = a5(), s4 = ce3({ issueData: e2, data: r34.data, path: r34.path, errorMaps: [r34.common.contextualErrorMap, r34.schemaErrorMap, t2, t2 === m3 ? void 0 : m3].filter((a6) => !!a6) });
  r34.common.issues.push(s4);
}
__name(d4, "d");
var x6 = class r4 {
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
  static mergeArray(e2, t2) {
    let s4 = [];
    for (let a6 of t2) {
      if (a6.status === "aborted") return p2;
      a6.status === "dirty" && e2.dirty(), s4.push(a6.value);
    }
    return { status: e2.value, value: s4 };
  }
  static async mergeObjectAsync(e2, t2) {
    let s4 = [];
    for (let a6 of t2) {
      let n = await a6.key, o6 = await a6.value;
      s4.push({ key: n, value: o6 });
    }
    return r4.mergeObjectSync(e2, s4);
  }
  static mergeObjectSync(e2, t2) {
    let s4 = {};
    for (let a6 of t2) {
      let { key: n, value: o6 } = a6;
      if (n.status === "aborted" || o6.status === "aborted") return p2;
      n.status === "dirty" && e2.dirty(), o6.status === "dirty" && e2.dirty(), n.value !== "__proto__" && (typeof o6.value < "u" || a6.alwaysSet) && (s4[n.value] = o6.value);
    }
    return { status: e2.value, value: s4 };
  }
};
var p2 = Object.freeze({ status: "aborted" });
var L4 = /* @__PURE__ */ __name((r34) => ({ status: "dirty", value: r34 }), "L");
var k3 = /* @__PURE__ */ __name((r34) => ({ status: "valid", value: r34 }), "k");
var fe3 = /* @__PURE__ */ __name((r34) => r34.status === "aborted", "fe");
var he3 = /* @__PURE__ */ __name((r34) => r34.status === "dirty", "he");
var M2 = /* @__PURE__ */ __name((r34) => r34.status === "valid", "M");
var se3 = /* @__PURE__ */ __name((r34) => typeof Promise < "u" && r34 instanceof Promise, "se");
var l4;
(function(r34) {
  r34.errToObj = (e2) => typeof e2 == "string" ? { message: e2 } : e2 || {}, r34.toString = (e2) => typeof e2 == "string" ? e2 : e2?.message;
})(l4 || (l4 = {}));
var T5 = class {
  static {
    __name(this, "T");
  }
  constructor(e2, t2, s4, a6) {
    this._cachedPath = [], this.parent = e2, this.data = t2, this._path = s4, this._key = a6;
  }
  get path() {
    return this._cachedPath.length || (Array.isArray(this._key) ? this._cachedPath.push(...this._path, ...this._key) : this._cachedPath.push(...this._path, this._key)), this._cachedPath;
  }
};
var we2 = /* @__PURE__ */ __name((r34, e2) => {
  if (M2(e2)) return { success: true, data: e2.value };
  if (!r34.common.issues.length) throw new Error("Validation failed but no issues detected.");
  return { success: false, get error() {
    if (this._error) return this._error;
    let t2 = new c5(r34.common.issues);
    return this._error = t2, this._error;
  } };
}, "we");
function _7(r34) {
  if (!r34) return {};
  let { errorMap: e2, invalid_type_error: t2, required_error: s4, description: a6 } = r34;
  if (e2 && (t2 || s4)) throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
  return e2 ? { errorMap: e2, description: a6 } : { errorMap: /* @__PURE__ */ __name((o6, i2) => {
    let { message: u6 } = r34;
    return o6.code === "invalid_enum_value" ? { message: u6 ?? i2.defaultError } : typeof i2.data > "u" ? { message: u6 ?? s4 ?? i2.defaultError } : o6.code !== "invalid_type" ? { message: i2.defaultError } : { message: u6 ?? t2 ?? i2.defaultError };
  }, "errorMap"), description: a6 };
}
__name(_7, "_");
var y6 = class {
  static {
    __name(this, "y");
  }
  get description() {
    return this._def.description;
  }
  _getType(e2) {
    return y5(e2.data);
  }
  _getOrReturnCtx(e2, t2) {
    return t2 || { common: e2.parent.common, data: e2.data, parsedType: y5(e2.data), schemaErrorMap: this._def.errorMap, path: e2.path, parent: e2.parent };
  }
  _processInputParams(e2) {
    return { status: new x6(), ctx: { common: e2.parent.common, data: e2.data, parsedType: y5(e2.data), schemaErrorMap: this._def.errorMap, path: e2.path, parent: e2.parent } };
  }
  _parseSync(e2) {
    let t2 = this._parse(e2);
    if (se3(t2)) throw new Error("Synchronous parse encountered promise.");
    return t2;
  }
  _parseAsync(e2) {
    let t2 = this._parse(e2);
    return Promise.resolve(t2);
  }
  parse(e2, t2) {
    let s4 = this.safeParse(e2, t2);
    if (s4.success) return s4.data;
    throw s4.error;
  }
  safeParse(e2, t2) {
    let s4 = { common: { issues: [], async: t2?.async ?? false, contextualErrorMap: t2?.errorMap }, path: t2?.path || [], schemaErrorMap: this._def.errorMap, parent: null, data: e2, parsedType: y5(e2) }, a6 = this._parseSync({ data: e2, path: s4.path, parent: s4 });
    return we2(s4, a6);
  }
  "~validate"(e2) {
    let t2 = { common: { issues: [], async: !!this["~standard"].async }, path: [], schemaErrorMap: this._def.errorMap, parent: null, data: e2, parsedType: y5(e2) };
    if (!this["~standard"].async) try {
      let s4 = this._parseSync({ data: e2, path: [], parent: t2 });
      return M2(s4) ? { value: s4.value } : { issues: t2.common.issues };
    } catch (s4) {
      s4?.message?.toLowerCase()?.includes("encountered") && (this["~standard"].async = true), t2.common = { issues: [], async: true };
    }
    return this._parseAsync({ data: e2, path: [], parent: t2 }).then((s4) => M2(s4) ? { value: s4.value } : { issues: t2.common.issues });
  }
  async parseAsync(e2, t2) {
    let s4 = await this.safeParseAsync(e2, t2);
    if (s4.success) return s4.data;
    throw s4.error;
  }
  async safeParseAsync(e2, t2) {
    let s4 = { common: { issues: [], contextualErrorMap: t2?.errorMap, async: true }, path: t2?.path || [], schemaErrorMap: this._def.errorMap, parent: null, data: e2, parsedType: y5(e2) }, a6 = this._parse({ data: e2, path: s4.path, parent: s4 }), n = await (se3(a6) ? a6 : Promise.resolve(a6));
    return we2(s4, n);
  }
  refine(e2, t2) {
    let s4 = /* @__PURE__ */ __name((a6) => typeof t2 == "string" || typeof t2 > "u" ? { message: t2 } : typeof t2 == "function" ? t2(a6) : t2, "s");
    return this._refinement((a6, n) => {
      let o6 = e2(a6), i2 = /* @__PURE__ */ __name(() => n.addIssue({ code: f3.custom, ...s4(a6) }), "i");
      return typeof Promise < "u" && o6 instanceof Promise ? o6.then((u6) => u6 ? true : (i2(), false)) : o6 ? true : (i2(), false);
    });
  }
  refinement(e2, t2) {
    return this._refinement((s4, a6) => e2(s4) ? true : (a6.addIssue(typeof t2 == "function" ? t2(s4, a6) : t2), false));
  }
  _refinement(e2) {
    return new A4({ schema: this, typeName: m4.ZodEffects, effect: { type: "refinement", refinement: e2 } });
  }
  superRefine(e2) {
    return this._refinement(e2);
  }
  constructor(e2) {
    this.spa = this.safeParseAsync, this._def = e2, this.parse = this.parse.bind(this), this.safeParse = this.safeParse.bind(this), this.parseAsync = this.parseAsync.bind(this), this.safeParseAsync = this.safeParseAsync.bind(this), this.spa = this.spa.bind(this), this.refine = this.refine.bind(this), this.refinement = this.refinement.bind(this), this.superRefine = this.superRefine.bind(this), this.optional = this.optional.bind(this), this.nullable = this.nullable.bind(this), this.nullish = this.nullish.bind(this), this.array = this.array.bind(this), this.promise = this.promise.bind(this), this.or = this.or.bind(this), this.and = this.and.bind(this), this.transform = this.transform.bind(this), this.brand = this.brand.bind(this), this.default = this.default.bind(this), this.catch = this.catch.bind(this), this.describe = this.describe.bind(this), this.pipe = this.pipe.bind(this), this.readonly = this.readonly.bind(this), this.isNullable = this.isNullable.bind(this), this.isOptional = this.isOptional.bind(this), this["~standard"] = { version: 1, vendor: "zod", validate: /* @__PURE__ */ __name((t2) => this["~validate"](t2), "validate") };
  }
  optional() {
    return C3.create(this, this._def);
  }
  nullable() {
    return N5.create(this, this._def);
  }
  nullish() {
    return this.nullable().optional();
  }
  array() {
    return Z3.create(this);
  }
  promise() {
    return z5.create(this, this._def);
  }
  or(e2) {
    return H3.create([this, e2], this._def);
  }
  and(e2) {
    return J4.create(this, e2, this._def);
  }
  transform(e2) {
    return new A4({ ..._7(this._def), schema: this, typeName: m4.ZodEffects, effect: { type: "transform", transform: e2 } });
  }
  default(e2) {
    let t2 = typeof e2 == "function" ? e2 : () => e2;
    return new K4({ ..._7(this._def), innerType: this, defaultValue: t2, typeName: m4.ZodDefault });
  }
  brand() {
    return new de3({ typeName: m4.ZodBranded, type: this, ..._7(this._def) });
  }
  catch(e2) {
    let t2 = typeof e2 == "function" ? e2 : () => e2;
    return new ee2({ ..._7(this._def), innerType: this, catchValue: t2, typeName: m4.ZodCatch });
  }
  describe(e2) {
    let t2 = this.constructor;
    return new t2({ ...this._def, description: e2 });
  }
  pipe(e2) {
    return ue3.create(this, e2);
  }
  readonly() {
    return te3.create(this);
  }
  isOptional() {
    return this.safeParse(void 0).success;
  }
  isNullable() {
    return this.safeParse(null).success;
  }
};
var Re2 = /^c[^\s-]{8,}$/i;
var Ne2 = /^[0-9a-z]+$/;
var je3 = /^[0-9A-HJKMNP-TV-Z]{26}$/i;
var Ie2 = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i;
var Ee3 = /^[a-z0-9_-]{21}$/i;
var Ze2 = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/;
var Me3 = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/;
var Ve2 = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i;
var Pe3 = "^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$";
var pe3;
var ze2 = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
var Le2 = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/;
var $e2 = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
var De2 = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
var Fe2 = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
var Ue2 = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/;
var Ce3 = "((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))";
var Be2 = new RegExp(`^${Ce3}$`);
function Ae2(r34) {
  let e2 = "[0-5]\\d";
  r34.precision ? e2 = `${e2}\\.\\d{${r34.precision}}` : r34.precision == null && (e2 = `${e2}(\\.\\d+)?`);
  let t2 = r34.precision ? "+" : "?";
  return `([01]\\d|2[0-3]):[0-5]\\d(:${e2})${t2}`;
}
__name(Ae2, "Ae");
function We2(r34) {
  return new RegExp(`^${Ae2(r34)}$`);
}
__name(We2, "We");
function Ye2(r34) {
  let e2 = `${Ce3}T${Ae2(r34)}`, t2 = [];
  return t2.push(r34.local ? "Z?" : "Z"), r34.offset && t2.push("([+-]\\d{2}:?\\d{2})"), e2 = `${e2}(${t2.join("|")})`, new RegExp(`^${e2}$`);
}
__name(Ye2, "Ye");
function He2(r34, e2) {
  return !!((e2 === "v4" || !e2) && ze2.test(r34) || (e2 === "v6" || !e2) && $e2.test(r34));
}
__name(He2, "He");
function Je2(r34, e2) {
  if (!Ze2.test(r34)) return false;
  try {
    let [t2] = r34.split(".");
    if (!t2) return false;
    let s4 = t2.replace(/-/g, "+").replace(/_/g, "/").padEnd(t2.length + (4 - t2.length % 4) % 4, "="), a6 = JSON.parse(atob(s4));
    return !(typeof a6 != "object" || a6 === null || "typ" in a6 && a6?.typ !== "JWT" || !a6.alg || e2 && a6.alg !== e2);
  } catch {
    return false;
  }
}
__name(Je2, "Je");
function qe2(r34, e2) {
  return !!((e2 === "v4" || !e2) && Le2.test(r34) || (e2 === "v6" || !e2) && De2.test(r34));
}
__name(qe2, "qe");
var V3 = class r5 extends y6 {
  static {
    __name(this, "r");
  }
  _parse(e2) {
    if (this._def.coerce && (e2.data = String(e2.data)), this._getType(e2) !== t.string) {
      let n = this._getOrReturnCtx(e2);
      return d4(n, { code: f3.invalid_type, expected: t.string, received: n.parsedType }), p2;
    }
    let s4 = new x6(), a6;
    for (let n of this._def.checks) if (n.kind === "min") e2.data.length < n.value && (a6 = this._getOrReturnCtx(e2, a6), d4(a6, { code: f3.too_small, minimum: n.value, type: "string", inclusive: true, exact: false, message: n.message }), s4.dirty());
    else if (n.kind === "max") e2.data.length > n.value && (a6 = this._getOrReturnCtx(e2, a6), d4(a6, { code: f3.too_big, maximum: n.value, type: "string", inclusive: true, exact: false, message: n.message }), s4.dirty());
    else if (n.kind === "length") {
      let o6 = e2.data.length > n.value, i2 = e2.data.length < n.value;
      (o6 || i2) && (a6 = this._getOrReturnCtx(e2, a6), o6 ? d4(a6, { code: f3.too_big, maximum: n.value, type: "string", inclusive: true, exact: true, message: n.message }) : i2 && d4(a6, { code: f3.too_small, minimum: n.value, type: "string", inclusive: true, exact: true, message: n.message }), s4.dirty());
    } else if (n.kind === "email") Ve2.test(e2.data) || (a6 = this._getOrReturnCtx(e2, a6), d4(a6, { validation: "email", code: f3.invalid_string, message: n.message }), s4.dirty());
    else if (n.kind === "emoji") pe3 || (pe3 = new RegExp(Pe3, "u")), pe3.test(e2.data) || (a6 = this._getOrReturnCtx(e2, a6), d4(a6, { validation: "emoji", code: f3.invalid_string, message: n.message }), s4.dirty());
    else if (n.kind === "uuid") Ie2.test(e2.data) || (a6 = this._getOrReturnCtx(e2, a6), d4(a6, { validation: "uuid", code: f3.invalid_string, message: n.message }), s4.dirty());
    else if (n.kind === "nanoid") Ee3.test(e2.data) || (a6 = this._getOrReturnCtx(e2, a6), d4(a6, { validation: "nanoid", code: f3.invalid_string, message: n.message }), s4.dirty());
    else if (n.kind === "cuid") Re2.test(e2.data) || (a6 = this._getOrReturnCtx(e2, a6), d4(a6, { validation: "cuid", code: f3.invalid_string, message: n.message }), s4.dirty());
    else if (n.kind === "cuid2") Ne2.test(e2.data) || (a6 = this._getOrReturnCtx(e2, a6), d4(a6, { validation: "cuid2", code: f3.invalid_string, message: n.message }), s4.dirty());
    else if (n.kind === "ulid") je3.test(e2.data) || (a6 = this._getOrReturnCtx(e2, a6), d4(a6, { validation: "ulid", code: f3.invalid_string, message: n.message }), s4.dirty());
    else if (n.kind === "url") try {
      new URL(e2.data);
    } catch {
      a6 = this._getOrReturnCtx(e2, a6), d4(a6, { validation: "url", code: f3.invalid_string, message: n.message }), s4.dirty();
    }
    else n.kind === "regex" ? (n.regex.lastIndex = 0, n.regex.test(e2.data) || (a6 = this._getOrReturnCtx(e2, a6), d4(a6, { validation: "regex", code: f3.invalid_string, message: n.message }), s4.dirty())) : n.kind === "trim" ? e2.data = e2.data.trim() : n.kind === "includes" ? e2.data.includes(n.value, n.position) || (a6 = this._getOrReturnCtx(e2, a6), d4(a6, { code: f3.invalid_string, validation: { includes: n.value, position: n.position }, message: n.message }), s4.dirty()) : n.kind === "toLowerCase" ? e2.data = e2.data.toLowerCase() : n.kind === "toUpperCase" ? e2.data = e2.data.toUpperCase() : n.kind === "startsWith" ? e2.data.startsWith(n.value) || (a6 = this._getOrReturnCtx(e2, a6), d4(a6, { code: f3.invalid_string, validation: { startsWith: n.value }, message: n.message }), s4.dirty()) : n.kind === "endsWith" ? e2.data.endsWith(n.value) || (a6 = this._getOrReturnCtx(e2, a6), d4(a6, { code: f3.invalid_string, validation: { endsWith: n.value }, message: n.message }), s4.dirty()) : n.kind === "datetime" ? Ye2(n).test(e2.data) || (a6 = this._getOrReturnCtx(e2, a6), d4(a6, { code: f3.invalid_string, validation: "datetime", message: n.message }), s4.dirty()) : n.kind === "date" ? Be2.test(e2.data) || (a6 = this._getOrReturnCtx(e2, a6), d4(a6, { code: f3.invalid_string, validation: "date", message: n.message }), s4.dirty()) : n.kind === "time" ? We2(n).test(e2.data) || (a6 = this._getOrReturnCtx(e2, a6), d4(a6, { code: f3.invalid_string, validation: "time", message: n.message }), s4.dirty()) : n.kind === "duration" ? Me3.test(e2.data) || (a6 = this._getOrReturnCtx(e2, a6), d4(a6, { validation: "duration", code: f3.invalid_string, message: n.message }), s4.dirty()) : n.kind === "ip" ? He2(e2.data, n.version) || (a6 = this._getOrReturnCtx(e2, a6), d4(a6, { validation: "ip", code: f3.invalid_string, message: n.message }), s4.dirty()) : n.kind === "jwt" ? Je2(e2.data, n.alg) || (a6 = this._getOrReturnCtx(e2, a6), d4(a6, { validation: "jwt", code: f3.invalid_string, message: n.message }), s4.dirty()) : n.kind === "cidr" ? qe2(e2.data, n.version) || (a6 = this._getOrReturnCtx(e2, a6), d4(a6, { validation: "cidr", code: f3.invalid_string, message: n.message }), s4.dirty()) : n.kind === "base64" ? Fe2.test(e2.data) || (a6 = this._getOrReturnCtx(e2, a6), d4(a6, { validation: "base64", code: f3.invalid_string, message: n.message }), s4.dirty()) : n.kind === "base64url" ? Ue2.test(e2.data) || (a6 = this._getOrReturnCtx(e2, a6), d4(a6, { validation: "base64url", code: f3.invalid_string, message: n.message }), s4.dirty()) : u3.assertNever(n);
    return { status: s4.value, value: e2.data };
  }
  _regex(e2, t2, s4) {
    return this.refinement((a6) => e2.test(a6), { validation: t2, code: f3.invalid_string, ...l4.errToObj(s4) });
  }
  _addCheck(e2) {
    return new r5({ ...this._def, checks: [...this._def.checks, e2] });
  }
  email(e2) {
    return this._addCheck({ kind: "email", ...l4.errToObj(e2) });
  }
  url(e2) {
    return this._addCheck({ kind: "url", ...l4.errToObj(e2) });
  }
  emoji(e2) {
    return this._addCheck({ kind: "emoji", ...l4.errToObj(e2) });
  }
  uuid(e2) {
    return this._addCheck({ kind: "uuid", ...l4.errToObj(e2) });
  }
  nanoid(e2) {
    return this._addCheck({ kind: "nanoid", ...l4.errToObj(e2) });
  }
  cuid(e2) {
    return this._addCheck({ kind: "cuid", ...l4.errToObj(e2) });
  }
  cuid2(e2) {
    return this._addCheck({ kind: "cuid2", ...l4.errToObj(e2) });
  }
  ulid(e2) {
    return this._addCheck({ kind: "ulid", ...l4.errToObj(e2) });
  }
  base64(e2) {
    return this._addCheck({ kind: "base64", ...l4.errToObj(e2) });
  }
  base64url(e2) {
    return this._addCheck({ kind: "base64url", ...l4.errToObj(e2) });
  }
  jwt(e2) {
    return this._addCheck({ kind: "jwt", ...l4.errToObj(e2) });
  }
  ip(e2) {
    return this._addCheck({ kind: "ip", ...l4.errToObj(e2) });
  }
  cidr(e2) {
    return this._addCheck({ kind: "cidr", ...l4.errToObj(e2) });
  }
  datetime(e2) {
    return typeof e2 == "string" ? this._addCheck({ kind: "datetime", precision: null, offset: false, local: false, message: e2 }) : this._addCheck({ kind: "datetime", precision: typeof e2?.precision > "u" ? null : e2?.precision, offset: e2?.offset ?? false, local: e2?.local ?? false, ...l4.errToObj(e2?.message) });
  }
  date(e2) {
    return this._addCheck({ kind: "date", message: e2 });
  }
  time(e2) {
    return typeof e2 == "string" ? this._addCheck({ kind: "time", precision: null, message: e2 }) : this._addCheck({ kind: "time", precision: typeof e2?.precision > "u" ? null : e2?.precision, ...l4.errToObj(e2?.message) });
  }
  duration(e2) {
    return this._addCheck({ kind: "duration", ...l4.errToObj(e2) });
  }
  regex(e2, t2) {
    return this._addCheck({ kind: "regex", regex: e2, ...l4.errToObj(t2) });
  }
  includes(e2, t2) {
    return this._addCheck({ kind: "includes", value: e2, position: t2?.position, ...l4.errToObj(t2?.message) });
  }
  startsWith(e2, t2) {
    return this._addCheck({ kind: "startsWith", value: e2, ...l4.errToObj(t2) });
  }
  endsWith(e2, t2) {
    return this._addCheck({ kind: "endsWith", value: e2, ...l4.errToObj(t2) });
  }
  min(e2, t2) {
    return this._addCheck({ kind: "min", value: e2, ...l4.errToObj(t2) });
  }
  max(e2, t2) {
    return this._addCheck({ kind: "max", value: e2, ...l4.errToObj(t2) });
  }
  length(e2, t2) {
    return this._addCheck({ kind: "length", value: e2, ...l4.errToObj(t2) });
  }
  nonempty(e2) {
    return this.min(1, l4.errToObj(e2));
  }
  trim() {
    return new r5({ ...this._def, checks: [...this._def.checks, { kind: "trim" }] });
  }
  toLowerCase() {
    return new r5({ ...this._def, checks: [...this._def.checks, { kind: "toLowerCase" }] });
  }
  toUpperCase() {
    return new r5({ ...this._def, checks: [...this._def.checks, { kind: "toUpperCase" }] });
  }
  get isDatetime() {
    return !!this._def.checks.find((e2) => e2.kind === "datetime");
  }
  get isDate() {
    return !!this._def.checks.find((e2) => e2.kind === "date");
  }
  get isTime() {
    return !!this._def.checks.find((e2) => e2.kind === "time");
  }
  get isDuration() {
    return !!this._def.checks.find((e2) => e2.kind === "duration");
  }
  get isEmail() {
    return !!this._def.checks.find((e2) => e2.kind === "email");
  }
  get isURL() {
    return !!this._def.checks.find((e2) => e2.kind === "url");
  }
  get isEmoji() {
    return !!this._def.checks.find((e2) => e2.kind === "emoji");
  }
  get isUUID() {
    return !!this._def.checks.find((e2) => e2.kind === "uuid");
  }
  get isNANOID() {
    return !!this._def.checks.find((e2) => e2.kind === "nanoid");
  }
  get isCUID() {
    return !!this._def.checks.find((e2) => e2.kind === "cuid");
  }
  get isCUID2() {
    return !!this._def.checks.find((e2) => e2.kind === "cuid2");
  }
  get isULID() {
    return !!this._def.checks.find((e2) => e2.kind === "ulid");
  }
  get isIP() {
    return !!this._def.checks.find((e2) => e2.kind === "ip");
  }
  get isCIDR() {
    return !!this._def.checks.find((e2) => e2.kind === "cidr");
  }
  get isBase64() {
    return !!this._def.checks.find((e2) => e2.kind === "base64");
  }
  get isBase64url() {
    return !!this._def.checks.find((e2) => e2.kind === "base64url");
  }
  get minLength() {
    let e2 = null;
    for (let t2 of this._def.checks) t2.kind === "min" && (e2 === null || t2.value > e2) && (e2 = t2.value);
    return e2;
  }
  get maxLength() {
    let e2 = null;
    for (let t2 of this._def.checks) t2.kind === "max" && (e2 === null || t2.value < e2) && (e2 = t2.value);
    return e2;
  }
};
V3.create = (r34) => new V3({ checks: [], typeName: m4.ZodString, coerce: r34?.coerce ?? false, ..._7(r34) });
function Ge2(r34, e2) {
  let t2 = (r34.toString().split(".")[1] || "").length, s4 = (e2.toString().split(".")[1] || "").length, a6 = t2 > s4 ? t2 : s4, n = Number.parseInt(r34.toFixed(a6).replace(".", "")), o6 = Number.parseInt(e2.toFixed(a6).replace(".", ""));
  return n % o6 / 10 ** a6;
}
__name(Ge2, "Ge");
var D4 = class r6 extends y6 {
  static {
    __name(this, "r");
  }
  constructor() {
    super(...arguments), this.min = this.gte, this.max = this.lte, this.step = this.multipleOf;
  }
  _parse(e2) {
    if (this._def.coerce && (e2.data = Number(e2.data)), this._getType(e2) !== t.number) {
      let n = this._getOrReturnCtx(e2);
      return d4(n, { code: f3.invalid_type, expected: t.number, received: n.parsedType }), p2;
    }
    let s4, a6 = new x6();
    for (let n of this._def.checks) n.kind === "int" ? u3.isInteger(e2.data) || (s4 = this._getOrReturnCtx(e2, s4), d4(s4, { code: f3.invalid_type, expected: "integer", received: "float", message: n.message }), a6.dirty()) : n.kind === "min" ? (n.inclusive ? e2.data < n.value : e2.data <= n.value) && (s4 = this._getOrReturnCtx(e2, s4), d4(s4, { code: f3.too_small, minimum: n.value, type: "number", inclusive: n.inclusive, exact: false, message: n.message }), a6.dirty()) : n.kind === "max" ? (n.inclusive ? e2.data > n.value : e2.data >= n.value) && (s4 = this._getOrReturnCtx(e2, s4), d4(s4, { code: f3.too_big, maximum: n.value, type: "number", inclusive: n.inclusive, exact: false, message: n.message }), a6.dirty()) : n.kind === "multipleOf" ? Ge2(e2.data, n.value) !== 0 && (s4 = this._getOrReturnCtx(e2, s4), d4(s4, { code: f3.not_multiple_of, multipleOf: n.value, message: n.message }), a6.dirty()) : n.kind === "finite" ? Number.isFinite(e2.data) || (s4 = this._getOrReturnCtx(e2, s4), d4(s4, { code: f3.not_finite, message: n.message }), a6.dirty()) : u3.assertNever(n);
    return { status: a6.value, value: e2.data };
  }
  gte(e2, t2) {
    return this.setLimit("min", e2, true, l4.toString(t2));
  }
  gt(e2, t2) {
    return this.setLimit("min", e2, false, l4.toString(t2));
  }
  lte(e2, t2) {
    return this.setLimit("max", e2, true, l4.toString(t2));
  }
  lt(e2, t2) {
    return this.setLimit("max", e2, false, l4.toString(t2));
  }
  setLimit(e2, t2, s4, a6) {
    return new r6({ ...this._def, checks: [...this._def.checks, { kind: e2, value: t2, inclusive: s4, message: l4.toString(a6) }] });
  }
  _addCheck(e2) {
    return new r6({ ...this._def, checks: [...this._def.checks, e2] });
  }
  int(e2) {
    return this._addCheck({ kind: "int", message: l4.toString(e2) });
  }
  positive(e2) {
    return this._addCheck({ kind: "min", value: 0, inclusive: false, message: l4.toString(e2) });
  }
  negative(e2) {
    return this._addCheck({ kind: "max", value: 0, inclusive: false, message: l4.toString(e2) });
  }
  nonpositive(e2) {
    return this._addCheck({ kind: "max", value: 0, inclusive: true, message: l4.toString(e2) });
  }
  nonnegative(e2) {
    return this._addCheck({ kind: "min", value: 0, inclusive: true, message: l4.toString(e2) });
  }
  multipleOf(e2, t2) {
    return this._addCheck({ kind: "multipleOf", value: e2, message: l4.toString(t2) });
  }
  finite(e2) {
    return this._addCheck({ kind: "finite", message: l4.toString(e2) });
  }
  safe(e2) {
    return this._addCheck({ kind: "min", inclusive: true, value: Number.MIN_SAFE_INTEGER, message: l4.toString(e2) })._addCheck({ kind: "max", inclusive: true, value: Number.MAX_SAFE_INTEGER, message: l4.toString(e2) });
  }
  get minValue() {
    let e2 = null;
    for (let t2 of this._def.checks) t2.kind === "min" && (e2 === null || t2.value > e2) && (e2 = t2.value);
    return e2;
  }
  get maxValue() {
    let e2 = null;
    for (let t2 of this._def.checks) t2.kind === "max" && (e2 === null || t2.value < e2) && (e2 = t2.value);
    return e2;
  }
  get isInt() {
    return !!this._def.checks.find((e2) => e2.kind === "int" || e2.kind === "multipleOf" && u3.isInteger(e2.value));
  }
  get isFinite() {
    let e2 = null, t2 = null;
    for (let s4 of this._def.checks) {
      if (s4.kind === "finite" || s4.kind === "int" || s4.kind === "multipleOf") return true;
      s4.kind === "min" ? (t2 === null || s4.value > t2) && (t2 = s4.value) : s4.kind === "max" && (e2 === null || s4.value < e2) && (e2 = s4.value);
    }
    return Number.isFinite(t2) && Number.isFinite(e2);
  }
};
D4.create = (r34) => new D4({ checks: [], typeName: m4.ZodNumber, coerce: r34?.coerce || false, ..._7(r34) });
var F3 = class r7 extends y6 {
  static {
    __name(this, "r");
  }
  constructor() {
    super(...arguments), this.min = this.gte, this.max = this.lte;
  }
  _parse(e2) {
    if (this._def.coerce) try {
      e2.data = BigInt(e2.data);
    } catch {
      return this._getInvalidInput(e2);
    }
    if (this._getType(e2) !== t.bigint) return this._getInvalidInput(e2);
    let s4, a6 = new x6();
    for (let n of this._def.checks) n.kind === "min" ? (n.inclusive ? e2.data < n.value : e2.data <= n.value) && (s4 = this._getOrReturnCtx(e2, s4), d4(s4, { code: f3.too_small, type: "bigint", minimum: n.value, inclusive: n.inclusive, message: n.message }), a6.dirty()) : n.kind === "max" ? (n.inclusive ? e2.data > n.value : e2.data >= n.value) && (s4 = this._getOrReturnCtx(e2, s4), d4(s4, { code: f3.too_big, type: "bigint", maximum: n.value, inclusive: n.inclusive, message: n.message }), a6.dirty()) : n.kind === "multipleOf" ? e2.data % n.value !== BigInt(0) && (s4 = this._getOrReturnCtx(e2, s4), d4(s4, { code: f3.not_multiple_of, multipleOf: n.value, message: n.message }), a6.dirty()) : u3.assertNever(n);
    return { status: a6.value, value: e2.data };
  }
  _getInvalidInput(e2) {
    let t2 = this._getOrReturnCtx(e2);
    return d4(t2, { code: f3.invalid_type, expected: t.bigint, received: t2.parsedType }), p2;
  }
  gte(e2, t2) {
    return this.setLimit("min", e2, true, l4.toString(t2));
  }
  gt(e2, t2) {
    return this.setLimit("min", e2, false, l4.toString(t2));
  }
  lte(e2, t2) {
    return this.setLimit("max", e2, true, l4.toString(t2));
  }
  lt(e2, t2) {
    return this.setLimit("max", e2, false, l4.toString(t2));
  }
  setLimit(e2, t2, s4, a6) {
    return new r7({ ...this._def, checks: [...this._def.checks, { kind: e2, value: t2, inclusive: s4, message: l4.toString(a6) }] });
  }
  _addCheck(e2) {
    return new r7({ ...this._def, checks: [...this._def.checks, e2] });
  }
  positive(e2) {
    return this._addCheck({ kind: "min", value: BigInt(0), inclusive: false, message: l4.toString(e2) });
  }
  negative(e2) {
    return this._addCheck({ kind: "max", value: BigInt(0), inclusive: false, message: l4.toString(e2) });
  }
  nonpositive(e2) {
    return this._addCheck({ kind: "max", value: BigInt(0), inclusive: true, message: l4.toString(e2) });
  }
  nonnegative(e2) {
    return this._addCheck({ kind: "min", value: BigInt(0), inclusive: true, message: l4.toString(e2) });
  }
  multipleOf(e2, t2) {
    return this._addCheck({ kind: "multipleOf", value: e2, message: l4.toString(t2) });
  }
  get minValue() {
    let e2 = null;
    for (let t2 of this._def.checks) t2.kind === "min" && (e2 === null || t2.value > e2) && (e2 = t2.value);
    return e2;
  }
  get maxValue() {
    let e2 = null;
    for (let t2 of this._def.checks) t2.kind === "max" && (e2 === null || t2.value < e2) && (e2 = t2.value);
    return e2;
  }
};
F3.create = (r34) => new F3({ checks: [], typeName: m4.ZodBigInt, coerce: r34?.coerce ?? false, ..._7(r34) });
var U3 = class extends y6 {
  static {
    __name(this, "U");
  }
  _parse(e2) {
    if (this._def.coerce && (e2.data = !!e2.data), this._getType(e2) !== t.boolean) {
      let s4 = this._getOrReturnCtx(e2);
      return d4(s4, { code: f3.invalid_type, expected: t.boolean, received: s4.parsedType }), p2;
    }
    return k3(e2.data);
  }
};
U3.create = (r34) => new U3({ typeName: m4.ZodBoolean, coerce: r34?.coerce || false, ..._7(r34) });
var B5 = class r8 extends y6 {
  static {
    __name(this, "r");
  }
  _parse(e2) {
    if (this._def.coerce && (e2.data = new Date(e2.data)), this._getType(e2) !== t.date) {
      let n = this._getOrReturnCtx(e2);
      return d4(n, { code: f3.invalid_type, expected: t.date, received: n.parsedType }), p2;
    }
    if (Number.isNaN(e2.data.getTime())) {
      let n = this._getOrReturnCtx(e2);
      return d4(n, { code: f3.invalid_date }), p2;
    }
    let s4 = new x6(), a6;
    for (let n of this._def.checks) n.kind === "min" ? e2.data.getTime() < n.value && (a6 = this._getOrReturnCtx(e2, a6), d4(a6, { code: f3.too_small, message: n.message, inclusive: true, exact: false, minimum: n.value, type: "date" }), s4.dirty()) : n.kind === "max" ? e2.data.getTime() > n.value && (a6 = this._getOrReturnCtx(e2, a6), d4(a6, { code: f3.too_big, message: n.message, inclusive: true, exact: false, maximum: n.value, type: "date" }), s4.dirty()) : u3.assertNever(n);
    return { status: s4.value, value: new Date(e2.data.getTime()) };
  }
  _addCheck(e2) {
    return new r8({ ...this._def, checks: [...this._def.checks, e2] });
  }
  min(e2, t2) {
    return this._addCheck({ kind: "min", value: e2.getTime(), message: l4.toString(t2) });
  }
  max(e2, t2) {
    return this._addCheck({ kind: "max", value: e2.getTime(), message: l4.toString(t2) });
  }
  get minDate() {
    let e2 = null;
    for (let t2 of this._def.checks) t2.kind === "min" && (e2 === null || t2.value > e2) && (e2 = t2.value);
    return e2 != null ? new Date(e2) : null;
  }
  get maxDate() {
    let e2 = null;
    for (let t2 of this._def.checks) t2.kind === "max" && (e2 === null || t2.value < e2) && (e2 = t2.value);
    return e2 != null ? new Date(e2) : null;
  }
};
B5.create = (r34) => new B5({ checks: [], coerce: r34?.coerce || false, typeName: m4.ZodDate, ..._7(r34) });
var re2 = class extends y6 {
  static {
    __name(this, "re");
  }
  _parse(e2) {
    if (this._getType(e2) !== t.symbol) {
      let s4 = this._getOrReturnCtx(e2);
      return d4(s4, { code: f3.invalid_type, expected: t.symbol, received: s4.parsedType }), p2;
    }
    return k3(e2.data);
  }
};
re2.create = (r34) => new re2({ typeName: m4.ZodSymbol, ..._7(r34) });
var W5 = class extends y6 {
  static {
    __name(this, "W");
  }
  _parse(e2) {
    if (this._getType(e2) !== t.undefined) {
      let s4 = this._getOrReturnCtx(e2);
      return d4(s4, { code: f3.invalid_type, expected: t.undefined, received: s4.parsedType }), p2;
    }
    return k3(e2.data);
  }
};
W5.create = (r34) => new W5({ typeName: m4.ZodUndefined, ..._7(r34) });
var Y3 = class extends y6 {
  static {
    __name(this, "Y");
  }
  _parse(e2) {
    if (this._getType(e2) !== t.null) {
      let s4 = this._getOrReturnCtx(e2);
      return d4(s4, { code: f3.invalid_type, expected: t.null, received: s4.parsedType }), p2;
    }
    return k3(e2.data);
  }
};
Y3.create = (r34) => new Y3({ typeName: m4.ZodNull, ..._7(r34) });
var P2 = class extends y6 {
  static {
    __name(this, "P");
  }
  constructor() {
    super(...arguments), this._any = true;
  }
  _parse(e2) {
    return k3(e2.data);
  }
};
P2.create = (r34) => new P2({ typeName: m4.ZodAny, ..._7(r34) });
var E5 = class extends y6 {
  static {
    __name(this, "E");
  }
  constructor() {
    super(...arguments), this._unknown = true;
  }
  _parse(e2) {
    return k3(e2.data);
  }
};
E5.create = (r34) => new E5({ typeName: m4.ZodUnknown, ..._7(r34) });
var O5 = class extends y6 {
  static {
    __name(this, "O");
  }
  _parse(e2) {
    let t2 = this._getOrReturnCtx(e2);
    return d4(t2, { code: f3.invalid_type, expected: t.never, received: t2.parsedType }), p2;
  }
};
O5.create = (r34) => new O5({ typeName: m4.ZodNever, ..._7(r34) });
var ae3 = class extends y6 {
  static {
    __name(this, "ae");
  }
  _parse(e2) {
    if (this._getType(e2) !== t.undefined) {
      let s4 = this._getOrReturnCtx(e2);
      return d4(s4, { code: f3.invalid_type, expected: t.void, received: s4.parsedType }), p2;
    }
    return k3(e2.data);
  }
};
ae3.create = (r34) => new ae3({ typeName: m4.ZodVoid, ..._7(r34) });
var Z3 = class r9 extends y6 {
  static {
    __name(this, "r");
  }
  _parse(e2) {
    let { ctx: t2, status: s4 } = this._processInputParams(e2), a6 = this._def;
    if (t2.parsedType !== t.array) return d4(t2, { code: f3.invalid_type, expected: t.array, received: t2.parsedType }), p2;
    if (a6.exactLength !== null) {
      let o6 = t2.data.length > a6.exactLength.value, i2 = t2.data.length < a6.exactLength.value;
      (o6 || i2) && (d4(t2, { code: o6 ? f3.too_big : f3.too_small, minimum: i2 ? a6.exactLength.value : void 0, maximum: o6 ? a6.exactLength.value : void 0, type: "array", inclusive: true, exact: true, message: a6.exactLength.message }), s4.dirty());
    }
    if (a6.minLength !== null && t2.data.length < a6.minLength.value && (d4(t2, { code: f3.too_small, minimum: a6.minLength.value, type: "array", inclusive: true, exact: false, message: a6.minLength.message }), s4.dirty()), a6.maxLength !== null && t2.data.length > a6.maxLength.value && (d4(t2, { code: f3.too_big, maximum: a6.maxLength.value, type: "array", inclusive: true, exact: false, message: a6.maxLength.message }), s4.dirty()), t2.common.async) return Promise.all([...t2.data].map((o6, i2) => a6.type._parseAsync(new T5(t2, o6, t2.path, i2)))).then((o6) => x6.mergeArray(s4, o6));
    let n = [...t2.data].map((o6, i2) => a6.type._parseSync(new T5(t2, o6, t2.path, i2)));
    return x6.mergeArray(s4, n);
  }
  get element() {
    return this._def.type;
  }
  min(e2, t2) {
    return new r9({ ...this._def, minLength: { value: e2, message: l4.toString(t2) } });
  }
  max(e2, t2) {
    return new r9({ ...this._def, maxLength: { value: e2, message: l4.toString(t2) } });
  }
  length(e2, t2) {
    return new r9({ ...this._def, exactLength: { value: e2, message: l4.toString(t2) } });
  }
  nonempty(e2) {
    return this.min(1, e2);
  }
};
Z3.create = (r34, e2) => new Z3({ type: r34, minLength: null, maxLength: null, exactLength: null, typeName: m4.ZodArray, ..._7(e2) });
function $4(r34) {
  if (r34 instanceof b5) {
    let e2 = {};
    for (let t2 in r34.shape) {
      let s4 = r34.shape[t2];
      e2[t2] = C3.create($4(s4));
    }
    return new b5({ ...r34._def, shape: /* @__PURE__ */ __name(() => e2, "shape") });
  } else return r34 instanceof Z3 ? new Z3({ ...r34._def, type: $4(r34.element) }) : r34 instanceof C3 ? C3.create($4(r34.unwrap())) : r34 instanceof N5 ? N5.create($4(r34.unwrap())) : r34 instanceof R4 ? R4.create(r34.items.map((e2) => $4(e2))) : r34;
}
__name($4, "$");
var b5 = class r10 extends y6 {
  static {
    __name(this, "r");
  }
  constructor() {
    super(...arguments), this._cached = null, this.nonstrict = this.passthrough, this.augment = this.extend;
  }
  _getCached() {
    if (this._cached !== null) return this._cached;
    let e2 = this._def.shape(), t2 = u3.objectKeys(e2);
    return this._cached = { shape: e2, keys: t2 }, this._cached;
  }
  _parse(e2) {
    if (this._getType(e2) !== t.object) {
      let f6 = this._getOrReturnCtx(e2);
      return d4(f6, { code: f3.invalid_type, expected: t.object, received: f6.parsedType }), p2;
    }
    let { status: s4, ctx: a6 } = this._processInputParams(e2), { shape: n, keys: o6 } = this._getCached(), i2 = [];
    if (!(this._def.catchall instanceof O5 && this._def.unknownKeys === "strip")) for (let f6 in a6.data) o6.includes(f6) || i2.push(f6);
    let u6 = [];
    for (let f6 of o6) {
      let g8 = n[f6], w9 = a6.data[f6];
      u6.push({ key: { status: "valid", value: f6 }, value: g8._parse(new T5(a6, w9, a6.path, f6)), alwaysSet: f6 in a6.data });
    }
    if (this._def.catchall instanceof O5) {
      let f6 = this._def.unknownKeys;
      if (f6 === "passthrough") for (let g8 of i2) u6.push({ key: { status: "valid", value: g8 }, value: { status: "valid", value: a6.data[g8] } });
      else if (f6 === "strict") i2.length > 0 && (d4(a6, { code: f3.unrecognized_keys, keys: i2 }), s4.dirty());
      else if (f6 !== "strip") throw new Error("Internal ZodObject error: invalid unknownKeys value.");
    } else {
      let f6 = this._def.catchall;
      for (let g8 of i2) {
        let w9 = a6.data[g8];
        u6.push({ key: { status: "valid", value: g8 }, value: f6._parse(new T5(a6, w9, a6.path, g8)), alwaysSet: g8 in a6.data });
      }
    }
    return a6.common.async ? Promise.resolve().then(async () => {
      let f6 = [];
      for (let g8 of u6) {
        let w9 = await g8.key, ve4 = await g8.value;
        f6.push({ key: w9, value: ve4, alwaysSet: g8.alwaysSet });
      }
      return f6;
    }).then((f6) => x6.mergeObjectSync(s4, f6)) : x6.mergeObjectSync(s4, u6);
  }
  get shape() {
    return this._def.shape();
  }
  strict(e2) {
    return l4.errToObj, new r10({ ...this._def, unknownKeys: "strict", ...e2 !== void 0 ? { errorMap: /* @__PURE__ */ __name((t2, s4) => {
      let a6 = this._def.errorMap?.(t2, s4).message ?? s4.defaultError;
      return t2.code === "unrecognized_keys" ? { message: l4.errToObj(e2).message ?? a6 } : { message: a6 };
    }, "errorMap") } : {} });
  }
  strip() {
    return new r10({ ...this._def, unknownKeys: "strip" });
  }
  passthrough() {
    return new r10({ ...this._def, unknownKeys: "passthrough" });
  }
  extend(e2) {
    return new r10({ ...this._def, shape: /* @__PURE__ */ __name(() => ({ ...this._def.shape(), ...e2 }), "shape") });
  }
  merge(e2) {
    return new r10({ unknownKeys: e2._def.unknownKeys, catchall: e2._def.catchall, shape: /* @__PURE__ */ __name(() => ({ ...this._def.shape(), ...e2._def.shape() }), "shape"), typeName: m4.ZodObject });
  }
  setKey(e2, t2) {
    return this.augment({ [e2]: t2 });
  }
  catchall(e2) {
    return new r10({ ...this._def, catchall: e2 });
  }
  pick(e2) {
    let t2 = {};
    for (let s4 of u3.objectKeys(e2)) e2[s4] && this.shape[s4] && (t2[s4] = this.shape[s4]);
    return new r10({ ...this._def, shape: /* @__PURE__ */ __name(() => t2, "shape") });
  }
  omit(e2) {
    let t2 = {};
    for (let s4 of u3.objectKeys(this.shape)) e2[s4] || (t2[s4] = this.shape[s4]);
    return new r10({ ...this._def, shape: /* @__PURE__ */ __name(() => t2, "shape") });
  }
  deepPartial() {
    return $4(this);
  }
  partial(e2) {
    let t2 = {};
    for (let s4 of u3.objectKeys(this.shape)) {
      let a6 = this.shape[s4];
      e2 && !e2[s4] ? t2[s4] = a6 : t2[s4] = a6.optional();
    }
    return new r10({ ...this._def, shape: /* @__PURE__ */ __name(() => t2, "shape") });
  }
  required(e2) {
    let t2 = {};
    for (let s4 of u3.objectKeys(this.shape)) if (e2 && !e2[s4]) t2[s4] = this.shape[s4];
    else {
      let n = this.shape[s4];
      for (; n instanceof C3; ) n = n._def.innerType;
      t2[s4] = n;
    }
    return new r10({ ...this._def, shape: /* @__PURE__ */ __name(() => t2, "shape") });
  }
  keyof() {
    return Oe3(u3.objectKeys(this.shape));
  }
};
b5.create = (r34, e2) => new b5({ shape: /* @__PURE__ */ __name(() => r34, "shape"), unknownKeys: "strip", catchall: O5.create(), typeName: m4.ZodObject, ..._7(e2) });
b5.strictCreate = (r34, e2) => new b5({ shape: /* @__PURE__ */ __name(() => r34, "shape"), unknownKeys: "strict", catchall: O5.create(), typeName: m4.ZodObject, ..._7(e2) });
b5.lazycreate = (r34, e2) => new b5({ shape: r34, unknownKeys: "strip", catchall: O5.create(), typeName: m4.ZodObject, ..._7(e2) });
var H3 = class extends y6 {
  static {
    __name(this, "H");
  }
  _parse(e2) {
    let { ctx: t2 } = this._processInputParams(e2), s4 = this._def.options;
    function a6(n) {
      for (let i2 of n) if (i2.result.status === "valid") return i2.result;
      for (let i2 of n) if (i2.result.status === "dirty") return t2.common.issues.push(...i2.ctx.common.issues), i2.result;
      let o6 = n.map((i2) => new c5(i2.ctx.common.issues));
      return d4(t2, { code: f3.invalid_union, unionErrors: o6 }), p2;
    }
    __name(a6, "a");
    if (t2.common.async) return Promise.all(s4.map(async (n) => {
      let o6 = { ...t2, common: { ...t2.common, issues: [] }, parent: null };
      return { result: await n._parseAsync({ data: t2.data, path: t2.path, parent: o6 }), ctx: o6 };
    })).then(a6);
    {
      let n, o6 = [];
      for (let u6 of s4) {
        let f6 = { ...t2, common: { ...t2.common, issues: [] }, parent: null }, g8 = u6._parseSync({ data: t2.data, path: t2.path, parent: f6 });
        if (g8.status === "valid") return g8;
        g8.status === "dirty" && !n && (n = { result: g8, ctx: f6 }), f6.common.issues.length && o6.push(f6.common.issues);
      }
      if (n) return t2.common.issues.push(...n.ctx.common.issues), n.result;
      let i2 = o6.map((u6) => new c5(u6));
      return d4(t2, { code: f3.invalid_union, unionErrors: i2 }), p2;
    }
  }
  get options() {
    return this._def.options;
  }
};
H3.create = (r34, e2) => new H3({ options: r34, typeName: m4.ZodUnion, ..._7(e2) });
var S6 = /* @__PURE__ */ __name((r34) => r34 instanceof q5 ? S6(r34.schema) : r34 instanceof A4 ? S6(r34.innerType()) : r34 instanceof G4 ? [r34.value] : r34 instanceof Q4 ? r34.options : r34 instanceof X3 ? u3.objectValues(r34.enum) : r34 instanceof K4 ? S6(r34._def.innerType) : r34 instanceof W5 ? [void 0] : r34 instanceof Y3 ? [null] : r34 instanceof C3 ? [void 0, ...S6(r34.unwrap())] : r34 instanceof N5 ? [null, ...S6(r34.unwrap())] : r34 instanceof de3 || r34 instanceof te3 ? S6(r34.unwrap()) : r34 instanceof ee2 ? S6(r34._def.innerType) : [], "S");
var me3 = class r11 extends y6 {
  static {
    __name(this, "r");
  }
  _parse(e2) {
    let { ctx: t2 } = this._processInputParams(e2);
    if (t2.parsedType !== t.object) return d4(t2, { code: f3.invalid_type, expected: t.object, received: t2.parsedType }), p2;
    let s4 = this.discriminator, a6 = t2.data[s4], n = this.optionsMap.get(a6);
    return n ? t2.common.async ? n._parseAsync({ data: t2.data, path: t2.path, parent: t2 }) : n._parseSync({ data: t2.data, path: t2.path, parent: t2 }) : (d4(t2, { code: f3.invalid_union_discriminator, options: Array.from(this.optionsMap.keys()), path: [s4] }), p2);
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
  static create(e2, t2, s4) {
    let a6 = /* @__PURE__ */ new Map();
    for (let n of t2) {
      let o6 = S6(n.shape[e2]);
      if (!o6.length) throw new Error(`A discriminator value for key \`${e2}\` could not be extracted from all schema options`);
      for (let i2 of o6) {
        if (a6.has(i2)) throw new Error(`Discriminator property ${String(e2)} has duplicate value ${String(i2)}`);
        a6.set(i2, n);
      }
    }
    return new r11({ typeName: m4.ZodDiscriminatedUnion, discriminator: e2, options: t2, optionsMap: a6, ..._7(s4) });
  }
};
function _e3(r34, e2) {
  let t2 = y5(r34), s4 = y5(e2);
  if (r34 === e2) return { valid: true, data: r34 };
  if (t2 === t.object && s4 === t.object) {
    let a6 = u3.objectKeys(e2), n = u3.objectKeys(r34).filter((i2) => a6.indexOf(i2) !== -1), o6 = { ...r34, ...e2 };
    for (let i2 of n) {
      let u6 = _e3(r34[i2], e2[i2]);
      if (!u6.valid) return { valid: false };
      o6[i2] = u6.data;
    }
    return { valid: true, data: o6 };
  } else if (t2 === t.array && s4 === t.array) {
    if (r34.length !== e2.length) return { valid: false };
    let a6 = [];
    for (let n = 0; n < r34.length; n++) {
      let o6 = r34[n], i2 = e2[n], u6 = _e3(o6, i2);
      if (!u6.valid) return { valid: false };
      a6.push(u6.data);
    }
    return { valid: true, data: a6 };
  } else return t2 === t.date && s4 === t.date && +r34 == +e2 ? { valid: true, data: r34 } : { valid: false };
}
__name(_e3, "_e");
var J4 = class extends y6 {
  static {
    __name(this, "J");
  }
  _parse(e2) {
    let { status: t2, ctx: s4 } = this._processInputParams(e2), a6 = /* @__PURE__ */ __name((n, o6) => {
      if (fe3(n) || fe3(o6)) return p2;
      let i2 = _e3(n.value, o6.value);
      return i2.valid ? ((he3(n) || he3(o6)) && t2.dirty(), { status: t2.value, value: i2.data }) : (d4(s4, { code: f3.invalid_intersection_types }), p2);
    }, "a");
    return s4.common.async ? Promise.all([this._def.left._parseAsync({ data: s4.data, path: s4.path, parent: s4 }), this._def.right._parseAsync({ data: s4.data, path: s4.path, parent: s4 })]).then(([n, o6]) => a6(n, o6)) : a6(this._def.left._parseSync({ data: s4.data, path: s4.path, parent: s4 }), this._def.right._parseSync({ data: s4.data, path: s4.path, parent: s4 }));
  }
};
J4.create = (r34, e2, t2) => new J4({ left: r34, right: e2, typeName: m4.ZodIntersection, ..._7(t2) });
var R4 = class r12 extends y6 {
  static {
    __name(this, "r");
  }
  _parse(e2) {
    let { status: t2, ctx: s4 } = this._processInputParams(e2);
    if (s4.parsedType !== t.array) return d4(s4, { code: f3.invalid_type, expected: t.array, received: s4.parsedType }), p2;
    if (s4.data.length < this._def.items.length) return d4(s4, { code: f3.too_small, minimum: this._def.items.length, inclusive: true, exact: false, type: "array" }), p2;
    !this._def.rest && s4.data.length > this._def.items.length && (d4(s4, { code: f3.too_big, maximum: this._def.items.length, inclusive: true, exact: false, type: "array" }), t2.dirty());
    let n = [...s4.data].map((o6, i2) => {
      let u6 = this._def.items[i2] || this._def.rest;
      return u6 ? u6._parse(new T5(s4, o6, s4.path, i2)) : null;
    }).filter((o6) => !!o6);
    return s4.common.async ? Promise.all(n).then((o6) => x6.mergeArray(t2, o6)) : x6.mergeArray(t2, n);
  }
  get items() {
    return this._def.items;
  }
  rest(e2) {
    return new r12({ ...this._def, rest: e2 });
  }
};
R4.create = (r34, e2) => {
  if (!Array.isArray(r34)) throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
  return new R4({ items: r34, typeName: m4.ZodTuple, rest: null, ..._7(e2) });
};
var ye3 = class r13 extends y6 {
  static {
    __name(this, "r");
  }
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(e2) {
    let { status: t2, ctx: s4 } = this._processInputParams(e2);
    if (s4.parsedType !== t.object) return d4(s4, { code: f3.invalid_type, expected: t.object, received: s4.parsedType }), p2;
    let a6 = [], n = this._def.keyType, o6 = this._def.valueType;
    for (let i2 in s4.data) a6.push({ key: n._parse(new T5(s4, i2, s4.path, i2)), value: o6._parse(new T5(s4, s4.data[i2], s4.path, i2)), alwaysSet: i2 in s4.data });
    return s4.common.async ? x6.mergeObjectAsync(t2, a6) : x6.mergeObjectSync(t2, a6);
  }
  get element() {
    return this._def.valueType;
  }
  static create(e2, t2, s4) {
    return t2 instanceof y6 ? new r13({ keyType: e2, valueType: t2, typeName: m4.ZodRecord, ..._7(s4) }) : new r13({ keyType: V3.create(), valueType: e2, typeName: m4.ZodRecord, ..._7(t2) });
  }
};
var ne3 = class extends y6 {
  static {
    __name(this, "ne");
  }
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(e2) {
    let { status: t2, ctx: s4 } = this._processInputParams(e2);
    if (s4.parsedType !== t.map) return d4(s4, { code: f3.invalid_type, expected: t.map, received: s4.parsedType }), p2;
    let a6 = this._def.keyType, n = this._def.valueType, o6 = [...s4.data.entries()].map(([i2, u6], f6) => ({ key: a6._parse(new T5(s4, i2, s4.path, [f6, "key"])), value: n._parse(new T5(s4, u6, s4.path, [f6, "value"])) }));
    if (s4.common.async) {
      let i2 = /* @__PURE__ */ new Map();
      return Promise.resolve().then(async () => {
        for (let u6 of o6) {
          let f6 = await u6.key, g8 = await u6.value;
          if (f6.status === "aborted" || g8.status === "aborted") return p2;
          (f6.status === "dirty" || g8.status === "dirty") && t2.dirty(), i2.set(f6.value, g8.value);
        }
        return { status: t2.value, value: i2 };
      });
    } else {
      let i2 = /* @__PURE__ */ new Map();
      for (let u6 of o6) {
        let f6 = u6.key, g8 = u6.value;
        if (f6.status === "aborted" || g8.status === "aborted") return p2;
        (f6.status === "dirty" || g8.status === "dirty") && t2.dirty(), i2.set(f6.value, g8.value);
      }
      return { status: t2.value, value: i2 };
    }
  }
};
ne3.create = (r34, e2, t2) => new ne3({ valueType: e2, keyType: r34, typeName: m4.ZodMap, ..._7(t2) });
var ie3 = class r14 extends y6 {
  static {
    __name(this, "r");
  }
  _parse(e2) {
    let { status: t2, ctx: s4 } = this._processInputParams(e2);
    if (s4.parsedType !== t.set) return d4(s4, { code: f3.invalid_type, expected: t.set, received: s4.parsedType }), p2;
    let a6 = this._def;
    a6.minSize !== null && s4.data.size < a6.minSize.value && (d4(s4, { code: f3.too_small, minimum: a6.minSize.value, type: "set", inclusive: true, exact: false, message: a6.minSize.message }), t2.dirty()), a6.maxSize !== null && s4.data.size > a6.maxSize.value && (d4(s4, { code: f3.too_big, maximum: a6.maxSize.value, type: "set", inclusive: true, exact: false, message: a6.maxSize.message }), t2.dirty());
    let n = this._def.valueType;
    function o6(u6) {
      let f6 = /* @__PURE__ */ new Set();
      for (let g8 of u6) {
        if (g8.status === "aborted") return p2;
        g8.status === "dirty" && t2.dirty(), f6.add(g8.value);
      }
      return { status: t2.value, value: f6 };
    }
    __name(o6, "o");
    let i2 = [...s4.data.values()].map((u6, f6) => n._parse(new T5(s4, u6, s4.path, f6)));
    return s4.common.async ? Promise.all(i2).then((u6) => o6(u6)) : o6(i2);
  }
  min(e2, t2) {
    return new r14({ ...this._def, minSize: { value: e2, message: l4.toString(t2) } });
  }
  max(e2, t2) {
    return new r14({ ...this._def, maxSize: { value: e2, message: l4.toString(t2) } });
  }
  size(e2, t2) {
    return this.min(e2, t2).max(e2, t2);
  }
  nonempty(e2) {
    return this.min(1, e2);
  }
};
ie3.create = (r34, e2) => new ie3({ valueType: r34, minSize: null, maxSize: null, typeName: m4.ZodSet, ..._7(e2) });
var ge3 = class r15 extends y6 {
  static {
    __name(this, "r");
  }
  constructor() {
    super(...arguments), this.validate = this.implement;
  }
  _parse(e2) {
    let { ctx: t2 } = this._processInputParams(e2);
    if (t2.parsedType !== t.function) return d4(t2, { code: f3.invalid_type, expected: t.function, received: t2.parsedType }), p2;
    function s4(i2, u6) {
      return ce3({ data: i2, path: t2.path, errorMaps: [t2.common.contextualErrorMap, t2.schemaErrorMap, a5(), m3].filter((f6) => !!f6), issueData: { code: f3.invalid_arguments, argumentsError: u6 } });
    }
    __name(s4, "s");
    function a6(i2, u6) {
      return ce3({ data: i2, path: t2.path, errorMaps: [t2.common.contextualErrorMap, t2.schemaErrorMap, a5(), m3].filter((f6) => !!f6), issueData: { code: f3.invalid_return_type, returnTypeError: u6 } });
    }
    __name(a6, "a");
    let n = { errorMap: t2.common.contextualErrorMap }, o6 = t2.data;
    if (this._def.returns instanceof z5) {
      let i2 = this;
      return k3(async function(...u6) {
        let f6 = new c5([]), g8 = await i2._def.args.parseAsync(u6, n).catch((le5) => {
          throw f6.addIssue(s4(u6, le5)), f6;
        }), w9 = await Reflect.apply(o6, this, g8);
        return await i2._def.returns._def.type.parseAsync(w9, n).catch((le5) => {
          throw f6.addIssue(a6(w9, le5)), f6;
        });
      });
    } else {
      let i2 = this;
      return k3(function(...u6) {
        let f6 = i2._def.args.safeParse(u6, n);
        if (!f6.success) throw new c5([s4(u6, f6.error)]);
        let g8 = Reflect.apply(o6, this, f6.data), w9 = i2._def.returns.safeParse(g8, n);
        if (!w9.success) throw new c5([a6(g8, w9.error)]);
        return w9.data;
      });
    }
  }
  parameters() {
    return this._def.args;
  }
  returnType() {
    return this._def.returns;
  }
  args(...e2) {
    return new r15({ ...this._def, args: R4.create(e2).rest(E5.create()) });
  }
  returns(e2) {
    return new r15({ ...this._def, returns: e2 });
  }
  implement(e2) {
    return this.parse(e2);
  }
  strictImplement(e2) {
    return this.parse(e2);
  }
  static create(e2, t2, s4) {
    return new r15({ args: e2 || R4.create([]).rest(E5.create()), returns: t2 || E5.create(), typeName: m4.ZodFunction, ..._7(s4) });
  }
};
var q5 = class extends y6 {
  static {
    __name(this, "q");
  }
  get schema() {
    return this._def.getter();
  }
  _parse(e2) {
    let { ctx: t2 } = this._processInputParams(e2);
    return this._def.getter()._parse({ data: t2.data, path: t2.path, parent: t2 });
  }
};
q5.create = (r34, e2) => new q5({ getter: r34, typeName: m4.ZodLazy, ..._7(e2) });
var G4 = class extends y6 {
  static {
    __name(this, "G");
  }
  _parse(e2) {
    if (e2.data !== this._def.value) {
      let t2 = this._getOrReturnCtx(e2);
      return d4(t2, { received: t2.data, code: f3.invalid_literal, expected: this._def.value }), p2;
    }
    return { status: "valid", value: e2.data };
  }
  get value() {
    return this._def.value;
  }
};
G4.create = (r34, e2) => new G4({ value: r34, typeName: m4.ZodLiteral, ..._7(e2) });
function Oe3(r34, e2) {
  return new Q4({ values: r34, typeName: m4.ZodEnum, ..._7(e2) });
}
__name(Oe3, "Oe");
var Q4 = class r16 extends y6 {
  static {
    __name(this, "r");
  }
  _parse(e2) {
    if (typeof e2.data != "string") {
      let t2 = this._getOrReturnCtx(e2), s4 = this._def.values;
      return d4(t2, { expected: u3.joinValues(s4), received: t2.parsedType, code: f3.invalid_type }), p2;
    }
    if (this._cache || (this._cache = new Set(this._def.values)), !this._cache.has(e2.data)) {
      let t2 = this._getOrReturnCtx(e2), s4 = this._def.values;
      return d4(t2, { received: t2.data, code: f3.invalid_enum_value, options: s4 }), p2;
    }
    return k3(e2.data);
  }
  get options() {
    return this._def.values;
  }
  get enum() {
    let e2 = {};
    for (let t2 of this._def.values) e2[t2] = t2;
    return e2;
  }
  get Values() {
    let e2 = {};
    for (let t2 of this._def.values) e2[t2] = t2;
    return e2;
  }
  get Enum() {
    let e2 = {};
    for (let t2 of this._def.values) e2[t2] = t2;
    return e2;
  }
  extract(e2, t2 = this._def) {
    return r16.create(e2, { ...this._def, ...t2 });
  }
  exclude(e2, t2 = this._def) {
    return r16.create(this.options.filter((s4) => !e2.includes(s4)), { ...this._def, ...t2 });
  }
};
Q4.create = Oe3;
var X3 = class extends y6 {
  static {
    __name(this, "X");
  }
  _parse(e2) {
    let t2 = u3.getValidEnumValues(this._def.values), s4 = this._getOrReturnCtx(e2);
    if (s4.parsedType !== t.string && s4.parsedType !== t.number) {
      let a6 = u3.objectValues(t2);
      return d4(s4, { expected: u3.joinValues(a6), received: s4.parsedType, code: f3.invalid_type }), p2;
    }
    if (this._cache || (this._cache = new Set(u3.getValidEnumValues(this._def.values))), !this._cache.has(e2.data)) {
      let a6 = u3.objectValues(t2);
      return d4(s4, { received: s4.data, code: f3.invalid_enum_value, options: a6 }), p2;
    }
    return k3(e2.data);
  }
  get enum() {
    return this._def.values;
  }
};
X3.create = (r34, e2) => new X3({ values: r34, typeName: m4.ZodNativeEnum, ..._7(e2) });
var z5 = class extends y6 {
  static {
    __name(this, "z");
  }
  unwrap() {
    return this._def.type;
  }
  _parse(e2) {
    let { ctx: t2 } = this._processInputParams(e2);
    if (t2.parsedType !== t.promise && t2.common.async === false) return d4(t2, { code: f3.invalid_type, expected: t.promise, received: t2.parsedType }), p2;
    let s4 = t2.parsedType === t.promise ? t2.data : Promise.resolve(t2.data);
    return k3(s4.then((a6) => this._def.type.parseAsync(a6, { path: t2.path, errorMap: t2.common.contextualErrorMap })));
  }
};
z5.create = (r34, e2) => new z5({ type: r34, typeName: m4.ZodPromise, ..._7(e2) });
var A4 = class extends y6 {
  static {
    __name(this, "A");
  }
  innerType() {
    return this._def.schema;
  }
  sourceType() {
    return this._def.schema._def.typeName === m4.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
  }
  _parse(e2) {
    let { status: t2, ctx: s4 } = this._processInputParams(e2), a6 = this._def.effect || null, n = { addIssue: /* @__PURE__ */ __name((o6) => {
      d4(s4, o6), o6.fatal ? t2.abort() : t2.dirty();
    }, "addIssue"), get path() {
      return s4.path;
    } };
    if (n.addIssue = n.addIssue.bind(n), a6.type === "preprocess") {
      let o6 = a6.transform(s4.data, n);
      if (s4.common.async) return Promise.resolve(o6).then(async (i2) => {
        if (t2.value === "aborted") return p2;
        let u6 = await this._def.schema._parseAsync({ data: i2, path: s4.path, parent: s4 });
        return u6.status === "aborted" ? p2 : u6.status === "dirty" ? L4(u6.value) : t2.value === "dirty" ? L4(u6.value) : u6;
      });
      {
        if (t2.value === "aborted") return p2;
        let i2 = this._def.schema._parseSync({ data: o6, path: s4.path, parent: s4 });
        return i2.status === "aborted" ? p2 : i2.status === "dirty" ? L4(i2.value) : t2.value === "dirty" ? L4(i2.value) : i2;
      }
    }
    if (a6.type === "refinement") {
      let o6 = /* @__PURE__ */ __name((i2) => {
        let u6 = a6.refinement(i2, n);
        if (s4.common.async) return Promise.resolve(u6);
        if (u6 instanceof Promise) throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
        return i2;
      }, "o");
      if (s4.common.async === false) {
        let i2 = this._def.schema._parseSync({ data: s4.data, path: s4.path, parent: s4 });
        return i2.status === "aborted" ? p2 : (i2.status === "dirty" && t2.dirty(), o6(i2.value), { status: t2.value, value: i2.value });
      } else return this._def.schema._parseAsync({ data: s4.data, path: s4.path, parent: s4 }).then((i2) => i2.status === "aborted" ? p2 : (i2.status === "dirty" && t2.dirty(), o6(i2.value).then(() => ({ status: t2.value, value: i2.value }))));
    }
    if (a6.type === "transform") if (s4.common.async === false) {
      let o6 = this._def.schema._parseSync({ data: s4.data, path: s4.path, parent: s4 });
      if (!M2(o6)) return p2;
      let i2 = a6.transform(o6.value, n);
      if (i2 instanceof Promise) throw new Error("Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.");
      return { status: t2.value, value: i2 };
    } else return this._def.schema._parseAsync({ data: s4.data, path: s4.path, parent: s4 }).then((o6) => M2(o6) ? Promise.resolve(a6.transform(o6.value, n)).then((i2) => ({ status: t2.value, value: i2 })) : p2);
    u3.assertNever(a6);
  }
};
A4.create = (r34, e2, t2) => new A4({ schema: r34, typeName: m4.ZodEffects, effect: e2, ..._7(t2) });
A4.createWithPreprocess = (r34, e2, t2) => new A4({ schema: e2, effect: { type: "preprocess", transform: r34 }, typeName: m4.ZodEffects, ..._7(t2) });
var C3 = class extends y6 {
  static {
    __name(this, "C");
  }
  _parse(e2) {
    return this._getType(e2) === t.undefined ? k3(void 0) : this._def.innerType._parse(e2);
  }
  unwrap() {
    return this._def.innerType;
  }
};
C3.create = (r34, e2) => new C3({ innerType: r34, typeName: m4.ZodOptional, ..._7(e2) });
var N5 = class extends y6 {
  static {
    __name(this, "N");
  }
  _parse(e2) {
    return this._getType(e2) === t.null ? k3(null) : this._def.innerType._parse(e2);
  }
  unwrap() {
    return this._def.innerType;
  }
};
N5.create = (r34, e2) => new N5({ innerType: r34, typeName: m4.ZodNullable, ..._7(e2) });
var K4 = class extends y6 {
  static {
    __name(this, "K");
  }
  _parse(e2) {
    let { ctx: t2 } = this._processInputParams(e2), s4 = t2.data;
    return t2.parsedType === t.undefined && (s4 = this._def.defaultValue()), this._def.innerType._parse({ data: s4, path: t2.path, parent: t2 });
  }
  removeDefault() {
    return this._def.innerType;
  }
};
K4.create = (r34, e2) => new K4({ innerType: r34, typeName: m4.ZodDefault, defaultValue: typeof e2.default == "function" ? e2.default : () => e2.default, ..._7(e2) });
var ee2 = class extends y6 {
  static {
    __name(this, "ee");
  }
  _parse(e2) {
    let { ctx: t2 } = this._processInputParams(e2), s4 = { ...t2, common: { ...t2.common, issues: [] } }, a6 = this._def.innerType._parse({ data: s4.data, path: s4.path, parent: { ...s4 } });
    return se3(a6) ? a6.then((n) => ({ status: "valid", value: n.status === "valid" ? n.value : this._def.catchValue({ get error() {
      return new c5(s4.common.issues);
    }, input: s4.data }) })) : { status: "valid", value: a6.status === "valid" ? a6.value : this._def.catchValue({ get error() {
      return new c5(s4.common.issues);
    }, input: s4.data }) };
  }
  removeCatch() {
    return this._def.innerType;
  }
};
ee2.create = (r34, e2) => new ee2({ innerType: r34, typeName: m4.ZodCatch, catchValue: typeof e2.catch == "function" ? e2.catch : () => e2.catch, ..._7(e2) });
var oe3 = class extends y6 {
  static {
    __name(this, "oe");
  }
  _parse(e2) {
    if (this._getType(e2) !== t.nan) {
      let s4 = this._getOrReturnCtx(e2);
      return d4(s4, { code: f3.invalid_type, expected: t.nan, received: s4.parsedType }), p2;
    }
    return { status: "valid", value: e2.data };
  }
};
oe3.create = (r34) => new oe3({ typeName: m4.ZodNaN, ..._7(r34) });
var lt2 = Symbol("zod_brand");
var de3 = class extends y6 {
  static {
    __name(this, "de");
  }
  _parse(e2) {
    let { ctx: t2 } = this._processInputParams(e2), s4 = t2.data;
    return this._def.type._parse({ data: s4, path: t2.path, parent: t2 });
  }
  unwrap() {
    return this._def.type;
  }
};
var ue3 = class r17 extends y6 {
  static {
    __name(this, "r");
  }
  _parse(e2) {
    let { status: t2, ctx: s4 } = this._processInputParams(e2);
    if (s4.common.async) return (async () => {
      let n = await this._def.in._parseAsync({ data: s4.data, path: s4.path, parent: s4 });
      return n.status === "aborted" ? p2 : n.status === "dirty" ? (t2.dirty(), L4(n.value)) : this._def.out._parseAsync({ data: n.value, path: s4.path, parent: s4 });
    })();
    {
      let a6 = this._def.in._parseSync({ data: s4.data, path: s4.path, parent: s4 });
      return a6.status === "aborted" ? p2 : a6.status === "dirty" ? (t2.dirty(), { status: "dirty", value: a6.value }) : this._def.out._parseSync({ data: a6.value, path: s4.path, parent: s4 });
    }
  }
  static create(e2, t2) {
    return new r17({ in: e2, out: t2, typeName: m4.ZodPipeline });
  }
};
var te3 = class extends y6 {
  static {
    __name(this, "te");
  }
  _parse(e2) {
    let t2 = this._def.innerType._parse(e2), s4 = /* @__PURE__ */ __name((a6) => (M2(a6) && (a6.value = Object.freeze(a6.value)), a6), "s");
    return se3(t2) ? t2.then((a6) => s4(a6)) : s4(t2);
  }
  unwrap() {
    return this._def.innerType;
  }
};
te3.create = (r34, e2) => new te3({ innerType: r34, typeName: m4.ZodReadonly, ..._7(e2) });
var ft2 = { object: b5.lazycreate };
var m4;
(function(r34) {
  r34.ZodString = "ZodString", r34.ZodNumber = "ZodNumber", r34.ZodNaN = "ZodNaN", r34.ZodBigInt = "ZodBigInt", r34.ZodBoolean = "ZodBoolean", r34.ZodDate = "ZodDate", r34.ZodSymbol = "ZodSymbol", r34.ZodUndefined = "ZodUndefined", r34.ZodNull = "ZodNull", r34.ZodAny = "ZodAny", r34.ZodUnknown = "ZodUnknown", r34.ZodNever = "ZodNever", r34.ZodVoid = "ZodVoid", r34.ZodArray = "ZodArray", r34.ZodObject = "ZodObject", r34.ZodUnion = "ZodUnion", r34.ZodDiscriminatedUnion = "ZodDiscriminatedUnion", r34.ZodIntersection = "ZodIntersection", r34.ZodTuple = "ZodTuple", r34.ZodRecord = "ZodRecord", r34.ZodMap = "ZodMap", r34.ZodSet = "ZodSet", r34.ZodFunction = "ZodFunction", r34.ZodLazy = "ZodLazy", r34.ZodLiteral = "ZodLiteral", r34.ZodEnum = "ZodEnum", r34.ZodEffects = "ZodEffects", r34.ZodNativeEnum = "ZodNativeEnum", r34.ZodOptional = "ZodOptional", r34.ZodNullable = "ZodNullable", r34.ZodDefault = "ZodDefault", r34.ZodCatch = "ZodCatch", r34.ZodPromise = "ZodPromise", r34.ZodBranded = "ZodBranded", r34.ZodPipeline = "ZodPipeline", r34.ZodReadonly = "ZodReadonly";
})(m4 || (m4 = {}));
var Xe2 = V3.create;
var Ke2 = D4.create;
var pt2 = oe3.create;
var mt2 = F3.create;
var et3 = U3.create;
var _t2 = B5.create;
var yt2 = re2.create;
var gt2 = W5.create;
var vt2 = Y3.create;
var xt2 = P2.create;
var kt2 = E5.create;
var bt2 = O5.create;
var wt2 = ae3.create;
var Tt = Z3.create;
var Ct2 = b5.create;
var At = b5.strictCreate;
var Ot = H3.create;
var St = me3.create;
var Rt = J4.create;
var Nt = R4.create;
var jt = ye3.create;
var It = ne3.create;
var Et2 = ie3.create;
var Zt = ge3.create;
var Mt2 = q5.create;
var Vt = G4.create;
var Pt2 = Q4.create;
var zt = X3.create;
var Lt2 = z5.create;
var $t = A4.create;
var Dt = C3.create;
var Ft = N5.create;
var Ut2 = A4.createWithPreprocess;
var Bt = ue3.create;

// deno:https://esm.sh/zod-to-json-schema@3.24.5/esnext/zod-to-json-schema.mjs
var S7 = Symbol("Let zodToJsonSchema decide on which parser to use");
var Z4 = { name: void 0, $refStrategy: "root", basePath: ["#"], effectStrategy: "input", pipeStrategy: "all", dateStrategy: "format:date-time", mapStrategy: "entries", removeAdditionalStrategy: "passthrough", allowedAdditionalProperties: true, rejectedAdditionalProperties: false, definitionPath: "definitions", target: "jsonSchema7", strictUnions: false, definitions: {}, errorMessages: false, markdownDescription: false, patternStrategy: "escape", applyRegexFlags: false, emailStrategy: "format:email", base64Strategy: "contentEncoding:base64", nameStrategy: "ref" };
var O6 = /* @__PURE__ */ __name((t2) => typeof t2 == "string" ? { ...Z4, name: t2 } : { ...Z4, ...t2 }, "O");
var j5 = /* @__PURE__ */ __name((t2) => {
  let e2 = O6(t2), r34 = e2.name !== void 0 ? [...e2.basePath, e2.definitionPath, e2.name] : e2.basePath;
  return { ...e2, currentPath: r34, propertyPath: void 0, seen: new Map(Object.entries(e2.definitions).map(([n, a6]) => [a6._def, { def: a6._def, path: [...e2.basePath, e2.definitionPath, n], jsonSchema: void 0 }])) };
}, "j");
function D5(t2, e2, r34, n) {
  n?.errorMessages && r34 && (t2.errorMessage = { ...t2.errorMessage, [e2]: r34 });
}
__name(D5, "D");
function u4(t2, e2, r34, n, a6) {
  t2[e2] = r34, D5(t2, e2, n, a6);
}
__name(u4, "u");
function M3() {
  return {};
}
__name(M3, "M");
function T6(t2, e2) {
  let r34 = { type: "array" };
  return t2.type?._def && t2.type?._def?.typeName !== m4.ZodAny && (r34.items = o5(t2.type._def, { ...e2, currentPath: [...e2.currentPath, "items"] })), t2.minLength && u4(r34, "minItems", t2.minLength.value, t2.minLength.message, e2), t2.maxLength && u4(r34, "maxItems", t2.maxLength.value, t2.maxLength.message, e2), t2.exactLength && (u4(r34, "minItems", t2.exactLength.value, t2.exactLength.message, e2), u4(r34, "maxItems", t2.exactLength.value, t2.exactLength.message, e2)), r34;
}
__name(T6, "T");
function N6(t2, e2) {
  let r34 = { type: "integer", format: "int64" };
  if (!t2.checks) return r34;
  for (let n of t2.checks) switch (n.kind) {
    case "min":
      e2.target === "jsonSchema7" ? n.inclusive ? u4(r34, "minimum", n.value, n.message, e2) : u4(r34, "exclusiveMinimum", n.value, n.message, e2) : (n.inclusive || (r34.exclusiveMinimum = true), u4(r34, "minimum", n.value, n.message, e2));
      break;
    case "max":
      e2.target === "jsonSchema7" ? n.inclusive ? u4(r34, "maximum", n.value, n.message, e2) : u4(r34, "exclusiveMaximum", n.value, n.message, e2) : (n.inclusive || (r34.exclusiveMaximum = true), u4(r34, "maximum", n.value, n.message, e2));
      break;
    case "multipleOf":
      u4(r34, "multipleOf", n.value, n.message, e2);
      break;
  }
  return r34;
}
__name(N6, "N");
function $5() {
  return { type: "boolean" };
}
__name($5, "$");
function x7(t2, e2) {
  return o5(t2.type._def, e2);
}
__name(x7, "x");
var w6 = /* @__PURE__ */ __name((t2, e2) => o5(t2.innerType._def, e2), "w");
function A5(t2, e2, r34) {
  let n = r34 ?? e2.dateStrategy;
  if (Array.isArray(n)) return { anyOf: n.map((a6, i2) => A5(t2, e2, a6)) };
  switch (n) {
    case "string":
    case "format:date-time":
      return { type: "string", format: "date-time" };
    case "format:date":
      return { type: "string", format: "date" };
    case "integer":
      return se4(t2, e2);
  }
}
__name(A5, "A");
var se4 = /* @__PURE__ */ __name((t2, e2) => {
  let r34 = { type: "integer", format: "unix-time" };
  if (e2.target === "openApi3") return r34;
  for (let n of t2.checks) switch (n.kind) {
    case "min":
      u4(r34, "minimum", n.value, n.message, e2);
      break;
    case "max":
      u4(r34, "maximum", n.value, n.message, e2);
      break;
  }
  return r34;
}, "se");
function E6(t2, e2) {
  return { ...o5(t2.innerType._def, e2), default: t2.defaultValue() };
}
__name(E6, "E");
function z6(t2, e2) {
  return e2.effectStrategy === "input" ? o5(t2.schema._def, e2) : {};
}
__name(z6, "z");
function L5(t2) {
  return { type: "string", enum: Array.from(t2.values) };
}
__name(L5, "L");
var pe4 = /* @__PURE__ */ __name((t2) => "type" in t2 && t2.type === "string" ? false : "allOf" in t2, "pe");
function F4(t2, e2) {
  let r34 = [o5(t2.left._def, { ...e2, currentPath: [...e2.currentPath, "allOf", "0"] }), o5(t2.right._def, { ...e2, currentPath: [...e2.currentPath, "allOf", "1"] })].filter((i2) => !!i2), n = e2.target === "jsonSchema2019-09" ? { unevaluatedProperties: false } : void 0, a6 = [];
  return r34.forEach((i2) => {
    if (pe4(i2)) a6.push(...i2.allOf), i2.unevaluatedProperties === void 0 && (n = void 0);
    else {
      let m7 = i2;
      if ("additionalProperties" in i2 && i2.additionalProperties === false) {
        let { additionalProperties: c6, ...s4 } = i2;
        m7 = s4;
      } else n = void 0;
      a6.push(m7);
    }
  }), a6.length ? { allOf: a6, ...n } : void 0;
}
__name(F4, "F");
function R5(t2, e2) {
  let r34 = typeof t2.value;
  return r34 !== "bigint" && r34 !== "number" && r34 !== "boolean" && r34 !== "string" ? { type: Array.isArray(t2.value) ? "array" : "object" } : e2.target === "openApi3" ? { type: r34 === "bigint" ? "integer" : r34, enum: [t2.value] } : { type: r34 === "bigint" ? "integer" : r34, const: t2.value };
}
__name(R5, "R");
var k4;
var f4 = { cuid: /^[cC][^\s-]{8,}$/, cuid2: /^[0-9a-z]+$/, ulid: /^[0-9A-HJKMNP-TV-Z]{26}$/, email: /^(?!\.)(?!.*\.\.)([a-zA-Z0-9_'+\-\.]*)[a-zA-Z0-9_+-]@([a-zA-Z0-9][a-zA-Z0-9\-]*\.)+[a-zA-Z]{2,}$/, emoji: /* @__PURE__ */ __name(() => (k4 === void 0 && (k4 = RegExp("^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$", "u")), k4), "emoji"), uuid: /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/, ipv4: /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/, ipv4Cidr: /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/, ipv6: /^(([a-f0-9]{1,4}:){7}|::([a-f0-9]{1,4}:){0,6}|([a-f0-9]{1,4}:){1}:([a-f0-9]{1,4}:){0,5}|([a-f0-9]{1,4}:){2}:([a-f0-9]{1,4}:){0,4}|([a-f0-9]{1,4}:){3}:([a-f0-9]{1,4}:){0,3}|([a-f0-9]{1,4}:){4}:([a-f0-9]{1,4}:){0,2}|([a-f0-9]{1,4}:){5}:([a-f0-9]{1,4}:){0,1})([a-f0-9]{1,4}|(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2})))$/, ipv6Cidr: /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/, base64: /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/, base64url: /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/, nanoid: /^[a-zA-Z0-9_-]{21}$/, jwt: /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/ };
function v5(t2, e2) {
  let r34 = { type: "string" };
  if (t2.checks) for (let n of t2.checks) switch (n.kind) {
    case "min":
      u4(r34, "minLength", typeof r34.minLength == "number" ? Math.max(r34.minLength, n.value) : n.value, n.message, e2);
      break;
    case "max":
      u4(r34, "maxLength", typeof r34.maxLength == "number" ? Math.min(r34.maxLength, n.value) : n.value, n.message, e2);
      break;
    case "email":
      switch (e2.emailStrategy) {
        case "format:email":
          d5(r34, "email", n.message, e2);
          break;
        case "format:idn-email":
          d5(r34, "idn-email", n.message, e2);
          break;
        case "pattern:zod":
          l5(r34, f4.email, n.message, e2);
          break;
      }
      break;
    case "url":
      d5(r34, "uri", n.message, e2);
      break;
    case "uuid":
      d5(r34, "uuid", n.message, e2);
      break;
    case "regex":
      l5(r34, n.regex, n.message, e2);
      break;
    case "cuid":
      l5(r34, f4.cuid, n.message, e2);
      break;
    case "cuid2":
      l5(r34, f4.cuid2, n.message, e2);
      break;
    case "startsWith":
      l5(r34, RegExp(`^${_8(n.value, e2)}`), n.message, e2);
      break;
    case "endsWith":
      l5(r34, RegExp(`${_8(n.value, e2)}$`), n.message, e2);
      break;
    case "datetime":
      d5(r34, "date-time", n.message, e2);
      break;
    case "date":
      d5(r34, "date", n.message, e2);
      break;
    case "time":
      d5(r34, "time", n.message, e2);
      break;
    case "duration":
      d5(r34, "duration", n.message, e2);
      break;
    case "length":
      u4(r34, "minLength", typeof r34.minLength == "number" ? Math.max(r34.minLength, n.value) : n.value, n.message, e2), u4(r34, "maxLength", typeof r34.maxLength == "number" ? Math.min(r34.maxLength, n.value) : n.value, n.message, e2);
      break;
    case "includes": {
      l5(r34, RegExp(_8(n.value, e2)), n.message, e2);
      break;
    }
    case "ip": {
      n.version !== "v6" && d5(r34, "ipv4", n.message, e2), n.version !== "v4" && d5(r34, "ipv6", n.message, e2);
      break;
    }
    case "base64url":
      l5(r34, f4.base64url, n.message, e2);
      break;
    case "jwt":
      l5(r34, f4.jwt, n.message, e2);
      break;
    case "cidr": {
      n.version !== "v6" && l5(r34, f4.ipv4Cidr, n.message, e2), n.version !== "v4" && l5(r34, f4.ipv6Cidr, n.message, e2);
      break;
    }
    case "emoji":
      l5(r34, f4.emoji(), n.message, e2);
      break;
    case "ulid": {
      l5(r34, f4.ulid, n.message, e2);
      break;
    }
    case "base64": {
      switch (e2.base64Strategy) {
        case "format:binary": {
          d5(r34, "binary", n.message, e2);
          break;
        }
        case "contentEncoding:base64": {
          u4(r34, "contentEncoding", "base64", n.message, e2);
          break;
        }
        case "pattern:zod": {
          l5(r34, f4.base64, n.message, e2);
          break;
        }
      }
      break;
    }
    case "nanoid":
      l5(r34, f4.nanoid, n.message, e2);
    case "toLowerCase":
    case "toUpperCase":
    case "trim":
      break;
    default:
  }
  return r34;
}
__name(v5, "v");
function _8(t2, e2) {
  return e2.patternStrategy === "escape" ? me4(t2) : t2;
}
__name(_8, "_");
var ue4 = new Set("ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvxyz0123456789");
function me4(t2) {
  let e2 = "";
  for (let r34 = 0; r34 < t2.length; r34++) ue4.has(t2[r34]) || (e2 += "\\"), e2 += t2[r34];
  return e2;
}
__name(me4, "me");
function d5(t2, e2, r34, n) {
  t2.format || t2.anyOf?.some((a6) => a6.format) ? (t2.anyOf || (t2.anyOf = []), t2.format && (t2.anyOf.push({ format: t2.format, ...t2.errorMessage && n.errorMessages && { errorMessage: { format: t2.errorMessage.format } } }), delete t2.format, t2.errorMessage && (delete t2.errorMessage.format, Object.keys(t2.errorMessage).length === 0 && delete t2.errorMessage)), t2.anyOf.push({ format: e2, ...r34 && n.errorMessages && { errorMessage: { format: r34 } } })) : u4(t2, "format", e2, r34, n);
}
__name(d5, "d");
function l5(t2, e2, r34, n) {
  t2.pattern || t2.allOf?.some((a6) => a6.pattern) ? (t2.allOf || (t2.allOf = []), t2.pattern && (t2.allOf.push({ pattern: t2.pattern, ...t2.errorMessage && n.errorMessages && { errorMessage: { pattern: t2.errorMessage.pattern } } }), delete t2.pattern, t2.errorMessage && (delete t2.errorMessage.pattern, Object.keys(t2.errorMessage).length === 0 && delete t2.errorMessage)), t2.allOf.push({ pattern: I7(e2, n), ...r34 && n.errorMessages && { errorMessage: { pattern: r34 } } })) : u4(t2, "pattern", I7(e2, n), r34, n);
}
__name(l5, "l");
function I7(t2, e2) {
  if (!e2.applyRegexFlags || !t2.flags) return t2.source;
  let r34 = { i: t2.flags.includes("i"), m: t2.flags.includes("m"), s: t2.flags.includes("s") }, n = r34.i ? t2.source.toLowerCase() : t2.source, a6 = "", i2 = false, m7 = false, c6 = false;
  for (let s4 = 0; s4 < n.length; s4++) {
    if (i2) {
      a6 += n[s4], i2 = false;
      continue;
    }
    if (r34.i) {
      if (m7) {
        if (n[s4].match(/[a-z]/)) {
          c6 ? (a6 += n[s4], a6 += `${n[s4 - 2]}-${n[s4]}`.toUpperCase(), c6 = false) : n[s4 + 1] === "-" && n[s4 + 2]?.match(/[a-z]/) ? (a6 += n[s4], c6 = true) : a6 += `${n[s4]}${n[s4].toUpperCase()}`;
          continue;
        }
      } else if (n[s4].match(/[a-z]/)) {
        a6 += `[${n[s4]}${n[s4].toUpperCase()}]`;
        continue;
      }
    }
    if (r34.m) {
      if (n[s4] === "^") {
        a6 += `(^|(?<=[\r
]))`;
        continue;
      } else if (n[s4] === "$") {
        a6 += `($|(?=[\r
]))`;
        continue;
      }
    }
    if (r34.s && n[s4] === ".") {
      a6 += m7 ? `${n[s4]}\r
` : `[${n[s4]}\r
]`;
      continue;
    }
    a6 += n[s4], n[s4] === "\\" ? i2 = true : m7 && n[s4] === "]" ? m7 = false : !m7 && n[s4] === "[" && (m7 = true);
  }
  try {
    new RegExp(a6);
  } catch {
    return console.warn(`Could not convert regex pattern at ${e2.currentPath.join("/")} to a flag-independent form! Falling back to the flag-ignorant source`), t2.source;
  }
  return a6;
}
__name(I7, "I");
function P3(t2, e2) {
  if (e2.target === "openAi" && console.warn("Warning: OpenAI may not support records in schemas! Try an array of key-value pairs instead."), e2.target === "openApi3" && t2.keyType?._def.typeName === m4.ZodEnum) return { type: "object", required: t2.keyType._def.values, properties: t2.keyType._def.values.reduce((n, a6) => ({ ...n, [a6]: o5(t2.valueType._def, { ...e2, currentPath: [...e2.currentPath, "properties", a6] }) ?? {} }), {}), additionalProperties: e2.rejectedAdditionalProperties };
  let r34 = { type: "object", additionalProperties: o5(t2.valueType._def, { ...e2, currentPath: [...e2.currentPath, "additionalProperties"] }) ?? e2.allowedAdditionalProperties };
  if (e2.target === "openApi3") return r34;
  if (t2.keyType?._def.typeName === m4.ZodString && t2.keyType._def.checks?.length) {
    let { type: n, ...a6 } = v5(t2.keyType._def, e2);
    return { ...r34, propertyNames: a6 };
  } else {
    if (t2.keyType?._def.typeName === m4.ZodEnum) return { ...r34, propertyNames: { enum: t2.keyType._def.values } };
    if (t2.keyType?._def.typeName === m4.ZodBranded && t2.keyType._def.type._def.typeName === m4.ZodString && t2.keyType._def.type._def.checks?.length) {
      let { type: n, ...a6 } = x7(t2.keyType._def, e2);
      return { ...r34, propertyNames: a6 };
    }
  }
  return r34;
}
__name(P3, "P");
function C4(t2, e2) {
  if (e2.mapStrategy === "record") return P3(t2, e2);
  let r34 = o5(t2.keyType._def, { ...e2, currentPath: [...e2.currentPath, "items", "items", "0"] }) || {}, n = o5(t2.valueType._def, { ...e2, currentPath: [...e2.currentPath, "items", "items", "1"] }) || {};
  return { type: "array", maxItems: 125, items: { type: "array", items: [r34, n], minItems: 2, maxItems: 2 } };
}
__name(C4, "C");
function U4(t2) {
  let e2 = t2.values, n = Object.keys(t2.values).filter((i2) => typeof e2[e2[i2]] != "number").map((i2) => e2[i2]), a6 = Array.from(new Set(n.map((i2) => typeof i2)));
  return { type: a6.length === 1 ? a6[0] === "string" ? "string" : "number" : ["string", "number"], enum: n };
}
__name(U4, "U");
function B6() {
  return { not: {} };
}
__name(B6, "B");
function V4(t2) {
  return t2.target === "openApi3" ? { enum: ["null"], nullable: true } : { type: "null" };
}
__name(V4, "V");
var h4 = { ZodString: "string", ZodNumber: "number", ZodBigInt: "integer", ZodBoolean: "boolean", ZodNull: "null" };
function J5(t2, e2) {
  if (e2.target === "openApi3") return K5(t2, e2);
  let r34 = t2.options instanceof Map ? Array.from(t2.options.values()) : t2.options;
  if (r34.every((n) => n._def.typeName in h4 && (!n._def.checks || !n._def.checks.length))) {
    let n = r34.reduce((a6, i2) => {
      let m7 = h4[i2._def.typeName];
      return m7 && !a6.includes(m7) ? [...a6, m7] : a6;
    }, []);
    return { type: n.length > 1 ? n : n[0] };
  } else if (r34.every((n) => n._def.typeName === "ZodLiteral" && !n.description)) {
    let n = r34.reduce((a6, i2) => {
      let m7 = typeof i2._def.value;
      switch (m7) {
        case "string":
        case "number":
        case "boolean":
          return [...a6, m7];
        case "bigint":
          return [...a6, "integer"];
        case "object":
          if (i2._def.value === null) return [...a6, "null"];
        case "symbol":
        case "undefined":
        case "function":
        default:
          return a6;
      }
    }, []);
    if (n.length === r34.length) {
      let a6 = n.filter((i2, m7, c6) => c6.indexOf(i2) === m7);
      return { type: a6.length > 1 ? a6 : a6[0], enum: r34.reduce((i2, m7) => i2.includes(m7._def.value) ? i2 : [...i2, m7._def.value], []) };
    }
  } else if (r34.every((n) => n._def.typeName === "ZodEnum")) return { type: "string", enum: r34.reduce((n, a6) => [...n, ...a6._def.values.filter((i2) => !n.includes(i2))], []) };
  return K5(t2, e2);
}
__name(J5, "J");
var K5 = /* @__PURE__ */ __name((t2, e2) => {
  let r34 = (t2.options instanceof Map ? Array.from(t2.options.values()) : t2.options).map((n, a6) => o5(n._def, { ...e2, currentPath: [...e2.currentPath, "anyOf", `${a6}`] })).filter((n) => !!n && (!e2.strictUnions || typeof n == "object" && Object.keys(n).length > 0));
  return r34.length ? { anyOf: r34 } : void 0;
}, "K");
function q6(t2, e2) {
  if (["ZodString", "ZodNumber", "ZodBigInt", "ZodBoolean", "ZodNull"].includes(t2.innerType._def.typeName) && (!t2.innerType._def.checks || !t2.innerType._def.checks.length)) return e2.target === "openApi3" ? { type: h4[t2.innerType._def.typeName], nullable: true } : { type: [h4[t2.innerType._def.typeName], "null"] };
  if (e2.target === "openApi3") {
    let n = o5(t2.innerType._def, { ...e2, currentPath: [...e2.currentPath] });
    return n && "$ref" in n ? { allOf: [n], nullable: true } : n && { ...n, nullable: true };
  }
  let r34 = o5(t2.innerType._def, { ...e2, currentPath: [...e2.currentPath, "anyOf", "0"] });
  return r34 && { anyOf: [r34, { type: "null" }] };
}
__name(q6, "q");
function W6(t2, e2) {
  let r34 = { type: "number" };
  if (!t2.checks) return r34;
  for (let n of t2.checks) switch (n.kind) {
    case "int":
      r34.type = "integer", D5(r34, "type", n.message, e2);
      break;
    case "min":
      e2.target === "jsonSchema7" ? n.inclusive ? u4(r34, "minimum", n.value, n.message, e2) : u4(r34, "exclusiveMinimum", n.value, n.message, e2) : (n.inclusive || (r34.exclusiveMinimum = true), u4(r34, "minimum", n.value, n.message, e2));
      break;
    case "max":
      e2.target === "jsonSchema7" ? n.inclusive ? u4(r34, "maximum", n.value, n.message, e2) : u4(r34, "exclusiveMaximum", n.value, n.message, e2) : (n.inclusive || (r34.exclusiveMaximum = true), u4(r34, "maximum", n.value, n.message, e2));
      break;
    case "multipleOf":
      u4(r34, "multipleOf", n.value, n.message, e2);
      break;
  }
  return r34;
}
__name(W6, "W");
function G5(t2, e2) {
  let r34 = e2.target === "openAi", n = { type: "object", properties: {} }, a6 = [], i2 = t2.shape();
  for (let c6 in i2) {
    let s4 = i2[c6];
    if (s4 === void 0 || s4._def === void 0) continue;
    let g8 = fe4(s4);
    g8 && r34 && (s4 instanceof C3 && (s4 = s4._def.innerType), s4.isNullable() || (s4 = s4.nullable()), g8 = false);
    let b8 = o5(s4._def, { ...e2, currentPath: [...e2.currentPath, "properties", c6], propertyPath: [...e2.currentPath, "properties", c6] });
    b8 !== void 0 && (n.properties[c6] = b8, g8 || a6.push(c6));
  }
  a6.length && (n.required = a6);
  let m7 = le3(t2, e2);
  return m7 !== void 0 && (n.additionalProperties = m7), n;
}
__name(G5, "G");
function le3(t2, e2) {
  if (t2.catchall._def.typeName !== "ZodNever") return o5(t2.catchall._def, { ...e2, currentPath: [...e2.currentPath, "additionalProperties"] });
  switch (t2.unknownKeys) {
    case "passthrough":
      return e2.allowedAdditionalProperties;
    case "strict":
      return e2.rejectedAdditionalProperties;
    case "strip":
      return e2.removeAdditionalStrategy === "strict" ? e2.allowedAdditionalProperties : e2.rejectedAdditionalProperties;
  }
}
__name(le3, "le");
function fe4(t2) {
  try {
    return t2.isOptional();
  } catch {
    return true;
  }
}
__name(fe4, "fe");
var H4 = /* @__PURE__ */ __name((t2, e2) => {
  if (e2.currentPath.toString() === e2.propertyPath?.toString()) return o5(t2.innerType._def, e2);
  let r34 = o5(t2.innerType._def, { ...e2, currentPath: [...e2.currentPath, "anyOf", "1"] });
  return r34 ? { anyOf: [{ not: {} }, r34] } : {};
}, "H");
var Q5 = /* @__PURE__ */ __name((t2, e2) => {
  if (e2.pipeStrategy === "input") return o5(t2.in._def, e2);
  if (e2.pipeStrategy === "output") return o5(t2.out._def, e2);
  let r34 = o5(t2.in._def, { ...e2, currentPath: [...e2.currentPath, "allOf", "0"] }), n = o5(t2.out._def, { ...e2, currentPath: [...e2.currentPath, "allOf", r34 ? "1" : "0"] });
  return { allOf: [r34, n].filter((a6) => a6 !== void 0) };
}, "Q");
function X4(t2, e2) {
  return o5(t2.type._def, e2);
}
__name(X4, "X");
function Y4(t2, e2) {
  let n = { type: "array", uniqueItems: true, items: o5(t2.valueType._def, { ...e2, currentPath: [...e2.currentPath, "items"] }) };
  return t2.minSize && u4(n, "minItems", t2.minSize.value, t2.minSize.message, e2), t2.maxSize && u4(n, "maxItems", t2.maxSize.value, t2.maxSize.message, e2), n;
}
__name(Y4, "Y");
function ee3(t2, e2) {
  return t2.rest ? { type: "array", minItems: t2.items.length, items: t2.items.map((r34, n) => o5(r34._def, { ...e2, currentPath: [...e2.currentPath, "items", `${n}`] })).reduce((r34, n) => n === void 0 ? r34 : [...r34, n], []), additionalItems: o5(t2.rest._def, { ...e2, currentPath: [...e2.currentPath, "additionalItems"] }) } : { type: "array", minItems: t2.items.length, maxItems: t2.items.length, items: t2.items.map((r34, n) => o5(r34._def, { ...e2, currentPath: [...e2.currentPath, "items", `${n}`] })).reduce((r34, n) => n === void 0 ? r34 : [...r34, n], []) };
}
__name(ee3, "ee");
function te4() {
  return { not: {} };
}
__name(te4, "te");
function re3() {
  return {};
}
__name(re3, "re");
var ne4 = /* @__PURE__ */ __name((t2, e2) => o5(t2.innerType._def, e2), "ne");
var ae4 = /* @__PURE__ */ __name((t2, e2, r34) => {
  switch (e2) {
    case m4.ZodString:
      return v5(t2, r34);
    case m4.ZodNumber:
      return W6(t2, r34);
    case m4.ZodObject:
      return G5(t2, r34);
    case m4.ZodBigInt:
      return N6(t2, r34);
    case m4.ZodBoolean:
      return $5();
    case m4.ZodDate:
      return A5(t2, r34);
    case m4.ZodUndefined:
      return te4();
    case m4.ZodNull:
      return V4(r34);
    case m4.ZodArray:
      return T6(t2, r34);
    case m4.ZodUnion:
    case m4.ZodDiscriminatedUnion:
      return J5(t2, r34);
    case m4.ZodIntersection:
      return F4(t2, r34);
    case m4.ZodTuple:
      return ee3(t2, r34);
    case m4.ZodRecord:
      return P3(t2, r34);
    case m4.ZodLiteral:
      return R5(t2, r34);
    case m4.ZodEnum:
      return L5(t2);
    case m4.ZodNativeEnum:
      return U4(t2);
    case m4.ZodNullable:
      return q6(t2, r34);
    case m4.ZodOptional:
      return H4(t2, r34);
    case m4.ZodMap:
      return C4(t2, r34);
    case m4.ZodSet:
      return Y4(t2, r34);
    case m4.ZodLazy:
      return () => t2.getter()._def;
    case m4.ZodPromise:
      return X4(t2, r34);
    case m4.ZodNaN:
    case m4.ZodNever:
      return B6();
    case m4.ZodEffects:
      return z6(t2, r34);
    case m4.ZodAny:
      return M3();
    case m4.ZodUnknown:
      return re3();
    case m4.ZodDefault:
      return E6(t2, r34);
    case m4.ZodBranded:
      return x7(t2, r34);
    case m4.ZodReadonly:
      return ne4(t2, r34);
    case m4.ZodCatch:
      return w6(t2, r34);
    case m4.ZodPipeline:
      return Q5(t2, r34);
    case m4.ZodFunction:
    case m4.ZodVoid:
    case m4.ZodSymbol:
      return;
    default:
      return /* @__PURE__ */ ((n) => {
      })(e2);
  }
}, "ae");
function o5(t2, e2, r34 = false) {
  let n = e2.seen.get(t2);
  if (e2.override) {
    let c6 = e2.override?.(t2, e2, n, r34);
    if (c6 !== S7) return c6;
  }
  if (n && !r34) {
    let c6 = de4(n, e2);
    if (c6 !== void 0) return c6;
  }
  let a6 = { def: t2, path: e2.currentPath, jsonSchema: void 0 };
  e2.seen.set(t2, a6);
  let i2 = ae4(t2, t2.typeName, e2), m7 = typeof i2 == "function" ? o5(i2(), e2) : i2;
  if (m7 && ye4(t2, e2, m7), e2.postProcess) {
    let c6 = e2.postProcess(m7, t2, e2);
    return a6.jsonSchema = m7, c6;
  }
  return a6.jsonSchema = m7, m7;
}
__name(o5, "o");
var de4 = /* @__PURE__ */ __name((t2, e2) => {
  switch (e2.$refStrategy) {
    case "root":
      return { $ref: t2.path.join("/") };
    case "relative":
      return { $ref: ge4(e2.currentPath, t2.path) };
    case "none":
    case "seen":
      return t2.path.length < e2.currentPath.length && t2.path.every((r34, n) => e2.currentPath[n] === r34) ? (console.warn(`Recursive reference detected at ${e2.currentPath.join("/")}! Defaulting to any`), {}) : e2.$refStrategy === "seen" ? {} : void 0;
  }
}, "de");
var ge4 = /* @__PURE__ */ __name((t2, e2) => {
  let r34 = 0;
  for (; r34 < t2.length && r34 < e2.length && t2[r34] === e2[r34]; r34++) ;
  return [(t2.length - r34).toString(), ...e2.slice(r34)].join("/");
}, "ge");
var ye4 = /* @__PURE__ */ __name((t2, e2, r34) => (t2.description && (r34.description = t2.description, e2.markdownDescription && (r34.markdownDescription = t2.description)), r34), "ye");
var oe4 = /* @__PURE__ */ __name((t2, e2) => {
  let r34 = j5(e2), n = typeof e2 == "object" && e2.definitions ? Object.entries(e2.definitions).reduce((s4, [g8, b8]) => ({ ...s4, [g8]: o5(b8._def, { ...r34, currentPath: [...r34.basePath, r34.definitionPath, g8] }, true) ?? {} }), {}) : void 0, a6 = typeof e2 == "string" ? e2 : e2?.nameStrategy === "title" ? void 0 : e2?.name, i2 = o5(t2._def, a6 === void 0 ? r34 : { ...r34, currentPath: [...r34.basePath, r34.definitionPath, a6] }, false) ?? {}, m7 = typeof e2 == "object" && e2.name !== void 0 && e2.nameStrategy === "title" ? e2.name : void 0;
  m7 !== void 0 && (i2.title = m7);
  let c6 = a6 === void 0 ? n ? { ...i2, [r34.definitionPath]: n } : i2 : { $ref: [...r34.$refStrategy === "relative" ? [] : r34.basePath, r34.definitionPath, a6].join("/"), [r34.definitionPath]: { ...n, [a6]: i2 } };
  return r34.target === "jsonSchema7" ? c6.$schema = "http://json-schema.org/draft-07/schema#" : (r34.target === "jsonSchema2019-09" || r34.target === "openAi") && (c6.$schema = "https://json-schema.org/draft/2019-09/schema#"), r34.target === "openAi" && ("anyOf" in c6 || "oneOf" in c6 || "allOf" in c6 || "type" in c6 && Array.isArray(c6.type)) && console.warn("Warning: OpenAI may not support schemas with unions as roots! Try wrapping it in an object property."), c6;
}, "oe");

// deno:https://esm.sh/zod@3.24.3/esnext/zod.mjs
var g6;
(function(r34) {
  r34.assertEqual = (n) => n;
  function e2(n) {
  }
  __name(e2, "e");
  r34.assertIs = e2;
  function t2(n) {
    throw new Error();
  }
  __name(t2, "t");
  r34.assertNever = t2, r34.arrayToEnum = (n) => {
    let a6 = {};
    for (let i2 of n) a6[i2] = i2;
    return a6;
  }, r34.getValidEnumValues = (n) => {
    let a6 = r34.objectKeys(n).filter((o6) => typeof n[n[o6]] != "number"), i2 = {};
    for (let o6 of a6) i2[o6] = n[o6];
    return r34.objectValues(i2);
  }, r34.objectValues = (n) => r34.objectKeys(n).map(function(a6) {
    return n[a6];
  }), r34.objectKeys = typeof Object.keys == "function" ? (n) => Object.keys(n) : (n) => {
    let a6 = [];
    for (let i2 in n) Object.prototype.hasOwnProperty.call(n, i2) && a6.push(i2);
    return a6;
  }, r34.find = (n, a6) => {
    for (let i2 of n) if (a6(i2)) return i2;
  }, r34.isInteger = typeof Number.isInteger == "function" ? (n) => Number.isInteger(n) : (n) => typeof n == "number" && isFinite(n) && Math.floor(n) === n;
  function s4(n, a6 = " | ") {
    return n.map((i2) => typeof i2 == "string" ? `'${i2}'` : i2).join(a6);
  }
  __name(s4, "s");
  r34.joinValues = s4, r34.jsonStringifyReplacer = (n, a6) => typeof a6 == "bigint" ? a6.toString() : a6;
})(g6 || (g6 = {}));
var be2;
(function(r34) {
  r34.mergeShapes = (e2, t2) => ({ ...e2, ...t2 });
})(be2 || (be2 = {}));
var f5 = g6.arrayToEnum(["string", "nan", "number", "integer", "float", "boolean", "date", "bigint", "symbol", "function", "undefined", "null", "array", "object", "unknown", "promise", "void", "never", "map", "set"]);
var R6 = /* @__PURE__ */ __name((r34) => {
  switch (typeof r34) {
    case "undefined":
      return f5.undefined;
    case "string":
      return f5.string;
    case "number":
      return isNaN(r34) ? f5.nan : f5.number;
    case "boolean":
      return f5.boolean;
    case "function":
      return f5.function;
    case "bigint":
      return f5.bigint;
    case "symbol":
      return f5.symbol;
    case "object":
      return Array.isArray(r34) ? f5.array : r34 === null ? f5.null : r34.then && typeof r34.then == "function" && r34.catch && typeof r34.catch == "function" ? f5.promise : typeof Map < "u" && r34 instanceof Map ? f5.map : typeof Set < "u" && r34 instanceof Set ? f5.set : typeof Date < "u" && r34 instanceof Date ? f5.date : f5.object;
    default:
      return f5.unknown;
  }
}, "R");
var d6 = g6.arrayToEnum(["invalid_type", "invalid_literal", "custom", "invalid_union", "invalid_union_discriminator", "invalid_enum_value", "unrecognized_keys", "invalid_arguments", "invalid_return_type", "invalid_date", "invalid_string", "too_small", "too_big", "invalid_intersection_types", "not_multiple_of", "not_finite"]);
var ze3 = /* @__PURE__ */ __name((r34) => JSON.stringify(r34, null, 2).replace(/"([^"]+)":/g, "$1:"), "ze");
var T7 = class r19 extends Error {
  static {
    __name(this, "r");
  }
  get errors() {
    return this.issues;
  }
  constructor(e2) {
    super(), this.issues = [], this.addIssue = (s4) => {
      this.issues = [...this.issues, s4];
    }, this.addIssues = (s4 = []) => {
      this.issues = [...this.issues, ...s4];
    };
    let t2 = new.target.prototype;
    Object.setPrototypeOf ? Object.setPrototypeOf(this, t2) : this.__proto__ = t2, this.name = "ZodError", this.issues = e2;
  }
  format(e2) {
    let t2 = e2 || function(a6) {
      return a6.message;
    }, s4 = { _errors: [] }, n = /* @__PURE__ */ __name((a6) => {
      for (let i2 of a6.issues) if (i2.code === "invalid_union") i2.unionErrors.map(n);
      else if (i2.code === "invalid_return_type") n(i2.returnTypeError);
      else if (i2.code === "invalid_arguments") n(i2.argumentsError);
      else if (i2.path.length === 0) s4._errors.push(t2(i2));
      else {
        let o6 = s4, l6 = 0;
        for (; l6 < i2.path.length; ) {
          let c6 = i2.path[l6];
          l6 === i2.path.length - 1 ? (o6[c6] = o6[c6] || { _errors: [] }, o6[c6]._errors.push(t2(i2))) : o6[c6] = o6[c6] || { _errors: [] }, o6 = o6[c6], l6++;
        }
      }
    }, "n");
    return n(this), s4;
  }
  static assert(e2) {
    if (!(e2 instanceof r19)) throw new Error(`Not a ZodError: ${e2}`);
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
  flatten(e2 = (t2) => t2.message) {
    let t2 = {}, s4 = [];
    for (let n of this.issues) n.path.length > 0 ? (t2[n.path[0]] = t2[n.path[0]] || [], t2[n.path[0]].push(e2(n))) : s4.push(e2(n));
    return { formErrors: s4, fieldErrors: t2 };
  }
  get formErrors() {
    return this.flatten();
  }
};
T7.create = (r34) => new T7(r34);
var re4 = /* @__PURE__ */ __name((r34, e2) => {
  let t2;
  switch (r34.code) {
    case d6.invalid_type:
      r34.received === f5.undefined ? t2 = "Required" : t2 = `Expected ${r34.expected}, received ${r34.received}`;
      break;
    case d6.invalid_literal:
      t2 = `Invalid literal value, expected ${JSON.stringify(r34.expected, g6.jsonStringifyReplacer)}`;
      break;
    case d6.unrecognized_keys:
      t2 = `Unrecognized key(s) in object: ${g6.joinValues(r34.keys, ", ")}`;
      break;
    case d6.invalid_union:
      t2 = "Invalid input";
      break;
    case d6.invalid_union_discriminator:
      t2 = `Invalid discriminator value. Expected ${g6.joinValues(r34.options)}`;
      break;
    case d6.invalid_enum_value:
      t2 = `Invalid enum value. Expected ${g6.joinValues(r34.options)}, received '${r34.received}'`;
      break;
    case d6.invalid_arguments:
      t2 = "Invalid function arguments";
      break;
    case d6.invalid_return_type:
      t2 = "Invalid function return type";
      break;
    case d6.invalid_date:
      t2 = "Invalid date";
      break;
    case d6.invalid_string:
      typeof r34.validation == "object" ? "includes" in r34.validation ? (t2 = `Invalid input: must include "${r34.validation.includes}"`, typeof r34.validation.position == "number" && (t2 = `${t2} at one or more positions greater than or equal to ${r34.validation.position}`)) : "startsWith" in r34.validation ? t2 = `Invalid input: must start with "${r34.validation.startsWith}"` : "endsWith" in r34.validation ? t2 = `Invalid input: must end with "${r34.validation.endsWith}"` : g6.assertNever(r34.validation) : r34.validation !== "regex" ? t2 = `Invalid ${r34.validation}` : t2 = "Invalid";
      break;
    case d6.too_small:
      r34.type === "array" ? t2 = `Array must contain ${r34.exact ? "exactly" : r34.inclusive ? "at least" : "more than"} ${r34.minimum} element(s)` : r34.type === "string" ? t2 = `String must contain ${r34.exact ? "exactly" : r34.inclusive ? "at least" : "over"} ${r34.minimum} character(s)` : r34.type === "number" ? t2 = `Number must be ${r34.exact ? "exactly equal to " : r34.inclusive ? "greater than or equal to " : "greater than "}${r34.minimum}` : r34.type === "date" ? t2 = `Date must be ${r34.exact ? "exactly equal to " : r34.inclusive ? "greater than or equal to " : "greater than "}${new Date(Number(r34.minimum))}` : t2 = "Invalid input";
      break;
    case d6.too_big:
      r34.type === "array" ? t2 = `Array must contain ${r34.exact ? "exactly" : r34.inclusive ? "at most" : "less than"} ${r34.maximum} element(s)` : r34.type === "string" ? t2 = `String must contain ${r34.exact ? "exactly" : r34.inclusive ? "at most" : "under"} ${r34.maximum} character(s)` : r34.type === "number" ? t2 = `Number must be ${r34.exact ? "exactly" : r34.inclusive ? "less than or equal to" : "less than"} ${r34.maximum}` : r34.type === "bigint" ? t2 = `BigInt must be ${r34.exact ? "exactly" : r34.inclusive ? "less than or equal to" : "less than"} ${r34.maximum}` : r34.type === "date" ? t2 = `Date must be ${r34.exact ? "exactly" : r34.inclusive ? "smaller than or equal to" : "smaller than"} ${new Date(Number(r34.maximum))}` : t2 = "Invalid input";
      break;
    case d6.custom:
      t2 = "Invalid input";
      break;
    case d6.invalid_intersection_types:
      t2 = "Intersection results could not be merged";
      break;
    case d6.not_multiple_of:
      t2 = `Number must be a multiple of ${r34.multipleOf}`;
      break;
    case d6.not_finite:
      t2 = "Number must be finite";
      break;
    default:
      t2 = e2.defaultError, g6.assertNever(r34);
  }
  return { message: t2 };
}, "re");
var Ee4 = re4;
function De3(r34) {
  Ee4 = r34;
}
__name(De3, "De");
function pe5() {
  return Ee4;
}
__name(pe5, "pe");
var me5 = /* @__PURE__ */ __name((r34) => {
  let { data: e2, path: t2, errorMaps: s4, issueData: n } = r34, a6 = [...t2, ...n.path || []], i2 = { ...n, path: a6 };
  if (n.message !== void 0) return { ...n, path: a6, message: n.message };
  let o6 = "", l6 = s4.filter((c6) => !!c6).slice().reverse();
  for (let c6 of l6) o6 = c6(i2, { data: e2, defaultError: o6 }).message;
  return { ...n, path: a6, message: o6 };
}, "me");
var Le3 = [];
function u5(r34, e2) {
  let t2 = pe5(), s4 = me5({ issueData: e2, data: r34.data, path: r34.path, errorMaps: [r34.common.contextualErrorMap, r34.schemaErrorMap, t2, t2 === re4 ? void 0 : re4].filter((n) => !!n) });
  r34.common.issues.push(s4);
}
__name(u5, "u");
var x8 = class r20 {
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
  static mergeArray(e2, t2) {
    let s4 = [];
    for (let n of t2) {
      if (n.status === "aborted") return v6;
      n.status === "dirty" && e2.dirty(), s4.push(n.value);
    }
    return { status: e2.value, value: s4 };
  }
  static async mergeObjectAsync(e2, t2) {
    let s4 = [];
    for (let n of t2) {
      let a6 = await n.key, i2 = await n.value;
      s4.push({ key: a6, value: i2 });
    }
    return r20.mergeObjectSync(e2, s4);
  }
  static mergeObjectSync(e2, t2) {
    let s4 = {};
    for (let n of t2) {
      let { key: a6, value: i2 } = n;
      if (a6.status === "aborted" || i2.status === "aborted") return v6;
      a6.status === "dirty" && e2.dirty(), i2.status === "dirty" && e2.dirty(), a6.value !== "__proto__" && (typeof i2.value < "u" || n.alwaysSet) && (s4[a6.value] = i2.value);
    }
    return { status: e2.value, value: s4 };
  }
};
var v6 = Object.freeze({ status: "aborted" });
var te5 = /* @__PURE__ */ __name((r34) => ({ status: "dirty", value: r34 }), "te");
var b6 = /* @__PURE__ */ __name((r34) => ({ status: "valid", value: r34 }), "b");
var we3 = /* @__PURE__ */ __name((r34) => r34.status === "aborted", "we");
var Te2 = /* @__PURE__ */ __name((r34) => r34.status === "dirty", "Te");
var P4 = /* @__PURE__ */ __name((r34) => r34.status === "valid", "P");
var ue5 = /* @__PURE__ */ __name((r34) => typeof Promise < "u" && r34 instanceof Promise, "ue");
function ve3(r34, e2, t2, s4) {
  if (t2 === "a" && !s4) throw new TypeError("Private accessor was defined without a getter");
  if (typeof e2 == "function" ? r34 !== e2 || !s4 : !e2.has(r34)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return t2 === "m" ? s4 : t2 === "a" ? s4.call(r34) : s4 ? s4.value : e2.get(r34);
}
__name(ve3, "ve");
function Ze3(r34, e2, t2, s4, n) {
  if (s4 === "m") throw new TypeError("Private method is not writable");
  if (s4 === "a" && !n) throw new TypeError("Private accessor was defined without a setter");
  if (typeof e2 == "function" ? r34 !== e2 || !n : !e2.has(r34)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return s4 === "a" ? n.call(r34, t2) : n ? n.value = t2 : e2.set(r34, t2), t2;
}
__name(Ze3, "Ze");
var h5;
(function(r34) {
  r34.errToObj = (e2) => typeof e2 == "string" ? { message: e2 } : e2 || {}, r34.toString = (e2) => typeof e2 == "string" ? e2 : e2?.message;
})(h5 || (h5 = {}));
var de5;
var ce4;
var S8 = class {
  static {
    __name(this, "S");
  }
  constructor(e2, t2, s4, n) {
    this._cachedPath = [], this.parent = e2, this.data = t2, this._path = s4, this._key = n;
  }
  get path() {
    return this._cachedPath.length || (this._key instanceof Array ? this._cachedPath.push(...this._path, ...this._key) : this._cachedPath.push(...this._path, this._key)), this._cachedPath;
  }
};
var Oe4 = /* @__PURE__ */ __name((r34, e2) => {
  if (P4(e2)) return { success: true, data: e2.value };
  if (!r34.common.issues.length) throw new Error("Validation failed but no issues detected.");
  return { success: false, get error() {
    if (this._error) return this._error;
    let t2 = new T7(r34.common.issues);
    return this._error = t2, this._error;
  } };
}, "Oe");
function _9(r34) {
  if (!r34) return {};
  let { errorMap: e2, invalid_type_error: t2, required_error: s4, description: n } = r34;
  if (e2 && (t2 || s4)) throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
  return e2 ? { errorMap: e2, description: n } : { errorMap: /* @__PURE__ */ __name((i2, o6) => {
    var l6, c6;
    let { message: p3 } = r34;
    return i2.code === "invalid_enum_value" ? { message: p3 ?? o6.defaultError } : typeof o6.data > "u" ? { message: (l6 = p3 ?? s4) !== null && l6 !== void 0 ? l6 : o6.defaultError } : i2.code !== "invalid_type" ? { message: o6.defaultError } : { message: (c6 = p3 ?? t2) !== null && c6 !== void 0 ? c6 : o6.defaultError };
  }, "errorMap"), description: n };
}
__name(_9, "_");
var y7 = class {
  static {
    __name(this, "y");
  }
  get description() {
    return this._def.description;
  }
  _getType(e2) {
    return R6(e2.data);
  }
  _getOrReturnCtx(e2, t2) {
    return t2 || { common: e2.parent.common, data: e2.data, parsedType: R6(e2.data), schemaErrorMap: this._def.errorMap, path: e2.path, parent: e2.parent };
  }
  _processInputParams(e2) {
    return { status: new x8(), ctx: { common: e2.parent.common, data: e2.data, parsedType: R6(e2.data), schemaErrorMap: this._def.errorMap, path: e2.path, parent: e2.parent } };
  }
  _parseSync(e2) {
    let t2 = this._parse(e2);
    if (ue5(t2)) throw new Error("Synchronous parse encountered promise.");
    return t2;
  }
  _parseAsync(e2) {
    let t2 = this._parse(e2);
    return Promise.resolve(t2);
  }
  parse(e2, t2) {
    let s4 = this.safeParse(e2, t2);
    if (s4.success) return s4.data;
    throw s4.error;
  }
  safeParse(e2, t2) {
    var s4;
    let n = { common: { issues: [], async: (s4 = t2?.async) !== null && s4 !== void 0 ? s4 : false, contextualErrorMap: t2?.errorMap }, path: t2?.path || [], schemaErrorMap: this._def.errorMap, parent: null, data: e2, parsedType: R6(e2) }, a6 = this._parseSync({ data: e2, path: n.path, parent: n });
    return Oe4(n, a6);
  }
  "~validate"(e2) {
    var t2, s4;
    let n = { common: { issues: [], async: !!this["~standard"].async }, path: [], schemaErrorMap: this._def.errorMap, parent: null, data: e2, parsedType: R6(e2) };
    if (!this["~standard"].async) try {
      let a6 = this._parseSync({ data: e2, path: [], parent: n });
      return P4(a6) ? { value: a6.value } : { issues: n.common.issues };
    } catch (a6) {
      !((s4 = (t2 = a6?.message) === null || t2 === void 0 ? void 0 : t2.toLowerCase()) === null || s4 === void 0) && s4.includes("encountered") && (this["~standard"].async = true), n.common = { issues: [], async: true };
    }
    return this._parseAsync({ data: e2, path: [], parent: n }).then((a6) => P4(a6) ? { value: a6.value } : { issues: n.common.issues });
  }
  async parseAsync(e2, t2) {
    let s4 = await this.safeParseAsync(e2, t2);
    if (s4.success) return s4.data;
    throw s4.error;
  }
  async safeParseAsync(e2, t2) {
    let s4 = { common: { issues: [], contextualErrorMap: t2?.errorMap, async: true }, path: t2?.path || [], schemaErrorMap: this._def.errorMap, parent: null, data: e2, parsedType: R6(e2) }, n = this._parse({ data: e2, path: s4.path, parent: s4 }), a6 = await (ue5(n) ? n : Promise.resolve(n));
    return Oe4(s4, a6);
  }
  refine(e2, t2) {
    let s4 = /* @__PURE__ */ __name((n) => typeof t2 == "string" || typeof t2 > "u" ? { message: t2 } : typeof t2 == "function" ? t2(n) : t2, "s");
    return this._refinement((n, a6) => {
      let i2 = e2(n), o6 = /* @__PURE__ */ __name(() => a6.addIssue({ code: d6.custom, ...s4(n) }), "o");
      return typeof Promise < "u" && i2 instanceof Promise ? i2.then((l6) => l6 ? true : (o6(), false)) : i2 ? true : (o6(), false);
    });
  }
  refinement(e2, t2) {
    return this._refinement((s4, n) => e2(s4) ? true : (n.addIssue(typeof t2 == "function" ? t2(s4, n) : t2), false));
  }
  _refinement(e2) {
    return new C5({ schema: this, typeName: m5.ZodEffects, effect: { type: "refinement", refinement: e2 } });
  }
  superRefine(e2) {
    return this._refinement(e2);
  }
  constructor(e2) {
    this.spa = this.safeParseAsync, this._def = e2, this.parse = this.parse.bind(this), this.safeParse = this.safeParse.bind(this), this.parseAsync = this.parseAsync.bind(this), this.safeParseAsync = this.safeParseAsync.bind(this), this.spa = this.spa.bind(this), this.refine = this.refine.bind(this), this.refinement = this.refinement.bind(this), this.superRefine = this.superRefine.bind(this), this.optional = this.optional.bind(this), this.nullable = this.nullable.bind(this), this.nullish = this.nullish.bind(this), this.array = this.array.bind(this), this.promise = this.promise.bind(this), this.or = this.or.bind(this), this.and = this.and.bind(this), this.transform = this.transform.bind(this), this.brand = this.brand.bind(this), this.default = this.default.bind(this), this.catch = this.catch.bind(this), this.describe = this.describe.bind(this), this.pipe = this.pipe.bind(this), this.readonly = this.readonly.bind(this), this.isNullable = this.isNullable.bind(this), this.isOptional = this.isOptional.bind(this), this["~standard"] = { version: 1, vendor: "zod", validate: /* @__PURE__ */ __name((t2) => this["~validate"](t2), "validate") };
  }
  optional() {
    return O7.create(this, this._def);
  }
  nullable() {
    return Z5.create(this, this._def);
  }
  nullish() {
    return this.nullable().optional();
  }
  array() {
    return I8.create(this);
  }
  promise() {
    return V5.create(this, this._def);
  }
  or(e2) {
    return W7.create([this, e2], this._def);
  }
  and(e2) {
    return q7.create(this, e2, this._def);
  }
  transform(e2) {
    return new C5({ ..._9(this._def), schema: this, typeName: m5.ZodEffects, effect: { type: "transform", transform: e2 } });
  }
  default(e2) {
    let t2 = typeof e2 == "function" ? e2 : () => e2;
    return new X5({ ..._9(this._def), innerType: this, defaultValue: t2, typeName: m5.ZodDefault });
  }
  brand() {
    return new le4({ typeName: m5.ZodBranded, type: this, ..._9(this._def) });
  }
  catch(e2) {
    let t2 = typeof e2 == "function" ? e2 : () => e2;
    return new Q6({ ..._9(this._def), innerType: this, catchValue: t2, typeName: m5.ZodCatch });
  }
  describe(e2) {
    let t2 = this.constructor;
    return new t2({ ...this._def, description: e2 });
  }
  pipe(e2) {
    return fe5.create(this, e2);
  }
  readonly() {
    return K6.create(this);
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
var ke2;
var Xe3 = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
var Qe2 = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/;
var Ke3 = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
var et4 = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
var tt3 = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
var rt2 = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/;
var je4 = "((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))";
var st3 = new RegExp(`^${je4}$`);
function Re3(r34) {
  let e2 = "([01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d";
  return r34.precision ? e2 = `${e2}\\.\\d{${r34.precision}}` : r34.precision == null && (e2 = `${e2}(\\.\\d+)?`), e2;
}
__name(Re3, "Re");
function nt3(r34) {
  return new RegExp(`^${Re3(r34)}$`);
}
__name(nt3, "nt");
function Ne3(r34) {
  let e2 = `${je4}T${Re3(r34)}`, t2 = [];
  return t2.push(r34.local ? "Z?" : "Z"), r34.offset && t2.push("([+-]\\d{2}:?\\d{2})"), e2 = `${e2}(${t2.join("|")})`, new RegExp(`^${e2}$`);
}
__name(Ne3, "Ne");
function at2(r34, e2) {
  return !!((e2 === "v4" || !e2) && Xe3.test(r34) || (e2 === "v6" || !e2) && Ke3.test(r34));
}
__name(at2, "at");
function it3(r34, e2) {
  if (!Je3.test(r34)) return false;
  try {
    let [t2] = r34.split("."), s4 = t2.replace(/-/g, "+").replace(/_/g, "/").padEnd(t2.length + (4 - t2.length % 4) % 4, "="), n = JSON.parse(atob(s4));
    return !(typeof n != "object" || n === null || !n.typ || !n.alg || e2 && n.alg !== e2);
  } catch {
    return false;
  }
}
__name(it3, "it");
function ot3(r34, e2) {
  return !!((e2 === "v4" || !e2) && Qe2.test(r34) || (e2 === "v6" || !e2) && et4.test(r34));
}
__name(ot3, "ot");
var $6 = class r21 extends y7 {
  static {
    __name(this, "r");
  }
  _parse(e2) {
    if (this._def.coerce && (e2.data = String(e2.data)), this._getType(e2) !== f5.string) {
      let a6 = this._getOrReturnCtx(e2);
      return u5(a6, { code: d6.invalid_type, expected: f5.string, received: a6.parsedType }), v6;
    }
    let s4 = new x8(), n;
    for (let a6 of this._def.checks) if (a6.kind === "min") e2.data.length < a6.value && (n = this._getOrReturnCtx(e2, n), u5(n, { code: d6.too_small, minimum: a6.value, type: "string", inclusive: true, exact: false, message: a6.message }), s4.dirty());
    else if (a6.kind === "max") e2.data.length > a6.value && (n = this._getOrReturnCtx(e2, n), u5(n, { code: d6.too_big, maximum: a6.value, type: "string", inclusive: true, exact: false, message: a6.message }), s4.dirty());
    else if (a6.kind === "length") {
      let i2 = e2.data.length > a6.value, o6 = e2.data.length < a6.value;
      (i2 || o6) && (n = this._getOrReturnCtx(e2, n), i2 ? u5(n, { code: d6.too_big, maximum: a6.value, type: "string", inclusive: true, exact: true, message: a6.message }) : o6 && u5(n, { code: d6.too_small, minimum: a6.value, type: "string", inclusive: true, exact: true, message: a6.message }), s4.dirty());
    } else if (a6.kind === "email") He3.test(e2.data) || (n = this._getOrReturnCtx(e2, n), u5(n, { validation: "email", code: d6.invalid_string, message: a6.message }), s4.dirty());
    else if (a6.kind === "emoji") ke2 || (ke2 = new RegExp(Ge3, "u")), ke2.test(e2.data) || (n = this._getOrReturnCtx(e2, n), u5(n, { validation: "emoji", code: d6.invalid_string, message: a6.message }), s4.dirty());
    else if (a6.kind === "uuid") We3.test(e2.data) || (n = this._getOrReturnCtx(e2, n), u5(n, { validation: "uuid", code: d6.invalid_string, message: a6.message }), s4.dirty());
    else if (a6.kind === "nanoid") qe3.test(e2.data) || (n = this._getOrReturnCtx(e2, n), u5(n, { validation: "nanoid", code: d6.invalid_string, message: a6.message }), s4.dirty());
    else if (a6.kind === "cuid") Ue3.test(e2.data) || (n = this._getOrReturnCtx(e2, n), u5(n, { validation: "cuid", code: d6.invalid_string, message: a6.message }), s4.dirty());
    else if (a6.kind === "cuid2") Fe3.test(e2.data) || (n = this._getOrReturnCtx(e2, n), u5(n, { validation: "cuid2", code: d6.invalid_string, message: a6.message }), s4.dirty());
    else if (a6.kind === "ulid") Be3.test(e2.data) || (n = this._getOrReturnCtx(e2, n), u5(n, { validation: "ulid", code: d6.invalid_string, message: a6.message }), s4.dirty());
    else if (a6.kind === "url") try {
      new URL(e2.data);
    } catch {
      n = this._getOrReturnCtx(e2, n), u5(n, { validation: "url", code: d6.invalid_string, message: a6.message }), s4.dirty();
    }
    else a6.kind === "regex" ? (a6.regex.lastIndex = 0, a6.regex.test(e2.data) || (n = this._getOrReturnCtx(e2, n), u5(n, { validation: "regex", code: d6.invalid_string, message: a6.message }), s4.dirty())) : a6.kind === "trim" ? e2.data = e2.data.trim() : a6.kind === "includes" ? e2.data.includes(a6.value, a6.position) || (n = this._getOrReturnCtx(e2, n), u5(n, { code: d6.invalid_string, validation: { includes: a6.value, position: a6.position }, message: a6.message }), s4.dirty()) : a6.kind === "toLowerCase" ? e2.data = e2.data.toLowerCase() : a6.kind === "toUpperCase" ? e2.data = e2.data.toUpperCase() : a6.kind === "startsWith" ? e2.data.startsWith(a6.value) || (n = this._getOrReturnCtx(e2, n), u5(n, { code: d6.invalid_string, validation: { startsWith: a6.value }, message: a6.message }), s4.dirty()) : a6.kind === "endsWith" ? e2.data.endsWith(a6.value) || (n = this._getOrReturnCtx(e2, n), u5(n, { code: d6.invalid_string, validation: { endsWith: a6.value }, message: a6.message }), s4.dirty()) : a6.kind === "datetime" ? Ne3(a6).test(e2.data) || (n = this._getOrReturnCtx(e2, n), u5(n, { code: d6.invalid_string, validation: "datetime", message: a6.message }), s4.dirty()) : a6.kind === "date" ? st3.test(e2.data) || (n = this._getOrReturnCtx(e2, n), u5(n, { code: d6.invalid_string, validation: "date", message: a6.message }), s4.dirty()) : a6.kind === "time" ? nt3(a6).test(e2.data) || (n = this._getOrReturnCtx(e2, n), u5(n, { code: d6.invalid_string, validation: "time", message: a6.message }), s4.dirty()) : a6.kind === "duration" ? Ye3.test(e2.data) || (n = this._getOrReturnCtx(e2, n), u5(n, { validation: "duration", code: d6.invalid_string, message: a6.message }), s4.dirty()) : a6.kind === "ip" ? at2(e2.data, a6.version) || (n = this._getOrReturnCtx(e2, n), u5(n, { validation: "ip", code: d6.invalid_string, message: a6.message }), s4.dirty()) : a6.kind === "jwt" ? it3(e2.data, a6.alg) || (n = this._getOrReturnCtx(e2, n), u5(n, { validation: "jwt", code: d6.invalid_string, message: a6.message }), s4.dirty()) : a6.kind === "cidr" ? ot3(e2.data, a6.version) || (n = this._getOrReturnCtx(e2, n), u5(n, { validation: "cidr", code: d6.invalid_string, message: a6.message }), s4.dirty()) : a6.kind === "base64" ? tt3.test(e2.data) || (n = this._getOrReturnCtx(e2, n), u5(n, { validation: "base64", code: d6.invalid_string, message: a6.message }), s4.dirty()) : a6.kind === "base64url" ? rt2.test(e2.data) || (n = this._getOrReturnCtx(e2, n), u5(n, { validation: "base64url", code: d6.invalid_string, message: a6.message }), s4.dirty()) : g6.assertNever(a6);
    return { status: s4.value, value: e2.data };
  }
  _regex(e2, t2, s4) {
    return this.refinement((n) => e2.test(n), { validation: t2, code: d6.invalid_string, ...h5.errToObj(s4) });
  }
  _addCheck(e2) {
    return new r21({ ...this._def, checks: [...this._def.checks, e2] });
  }
  email(e2) {
    return this._addCheck({ kind: "email", ...h5.errToObj(e2) });
  }
  url(e2) {
    return this._addCheck({ kind: "url", ...h5.errToObj(e2) });
  }
  emoji(e2) {
    return this._addCheck({ kind: "emoji", ...h5.errToObj(e2) });
  }
  uuid(e2) {
    return this._addCheck({ kind: "uuid", ...h5.errToObj(e2) });
  }
  nanoid(e2) {
    return this._addCheck({ kind: "nanoid", ...h5.errToObj(e2) });
  }
  cuid(e2) {
    return this._addCheck({ kind: "cuid", ...h5.errToObj(e2) });
  }
  cuid2(e2) {
    return this._addCheck({ kind: "cuid2", ...h5.errToObj(e2) });
  }
  ulid(e2) {
    return this._addCheck({ kind: "ulid", ...h5.errToObj(e2) });
  }
  base64(e2) {
    return this._addCheck({ kind: "base64", ...h5.errToObj(e2) });
  }
  base64url(e2) {
    return this._addCheck({ kind: "base64url", ...h5.errToObj(e2) });
  }
  jwt(e2) {
    return this._addCheck({ kind: "jwt", ...h5.errToObj(e2) });
  }
  ip(e2) {
    return this._addCheck({ kind: "ip", ...h5.errToObj(e2) });
  }
  cidr(e2) {
    return this._addCheck({ kind: "cidr", ...h5.errToObj(e2) });
  }
  datetime(e2) {
    var t2, s4;
    return typeof e2 == "string" ? this._addCheck({ kind: "datetime", precision: null, offset: false, local: false, message: e2 }) : this._addCheck({ kind: "datetime", precision: typeof e2?.precision > "u" ? null : e2?.precision, offset: (t2 = e2?.offset) !== null && t2 !== void 0 ? t2 : false, local: (s4 = e2?.local) !== null && s4 !== void 0 ? s4 : false, ...h5.errToObj(e2?.message) });
  }
  date(e2) {
    return this._addCheck({ kind: "date", message: e2 });
  }
  time(e2) {
    return typeof e2 == "string" ? this._addCheck({ kind: "time", precision: null, message: e2 }) : this._addCheck({ kind: "time", precision: typeof e2?.precision > "u" ? null : e2?.precision, ...h5.errToObj(e2?.message) });
  }
  duration(e2) {
    return this._addCheck({ kind: "duration", ...h5.errToObj(e2) });
  }
  regex(e2, t2) {
    return this._addCheck({ kind: "regex", regex: e2, ...h5.errToObj(t2) });
  }
  includes(e2, t2) {
    return this._addCheck({ kind: "includes", value: e2, position: t2?.position, ...h5.errToObj(t2?.message) });
  }
  startsWith(e2, t2) {
    return this._addCheck({ kind: "startsWith", value: e2, ...h5.errToObj(t2) });
  }
  endsWith(e2, t2) {
    return this._addCheck({ kind: "endsWith", value: e2, ...h5.errToObj(t2) });
  }
  min(e2, t2) {
    return this._addCheck({ kind: "min", value: e2, ...h5.errToObj(t2) });
  }
  max(e2, t2) {
    return this._addCheck({ kind: "max", value: e2, ...h5.errToObj(t2) });
  }
  length(e2, t2) {
    return this._addCheck({ kind: "length", value: e2, ...h5.errToObj(t2) });
  }
  nonempty(e2) {
    return this.min(1, h5.errToObj(e2));
  }
  trim() {
    return new r21({ ...this._def, checks: [...this._def.checks, { kind: "trim" }] });
  }
  toLowerCase() {
    return new r21({ ...this._def, checks: [...this._def.checks, { kind: "toLowerCase" }] });
  }
  toUpperCase() {
    return new r21({ ...this._def, checks: [...this._def.checks, { kind: "toUpperCase" }] });
  }
  get isDatetime() {
    return !!this._def.checks.find((e2) => e2.kind === "datetime");
  }
  get isDate() {
    return !!this._def.checks.find((e2) => e2.kind === "date");
  }
  get isTime() {
    return !!this._def.checks.find((e2) => e2.kind === "time");
  }
  get isDuration() {
    return !!this._def.checks.find((e2) => e2.kind === "duration");
  }
  get isEmail() {
    return !!this._def.checks.find((e2) => e2.kind === "email");
  }
  get isURL() {
    return !!this._def.checks.find((e2) => e2.kind === "url");
  }
  get isEmoji() {
    return !!this._def.checks.find((e2) => e2.kind === "emoji");
  }
  get isUUID() {
    return !!this._def.checks.find((e2) => e2.kind === "uuid");
  }
  get isNANOID() {
    return !!this._def.checks.find((e2) => e2.kind === "nanoid");
  }
  get isCUID() {
    return !!this._def.checks.find((e2) => e2.kind === "cuid");
  }
  get isCUID2() {
    return !!this._def.checks.find((e2) => e2.kind === "cuid2");
  }
  get isULID() {
    return !!this._def.checks.find((e2) => e2.kind === "ulid");
  }
  get isIP() {
    return !!this._def.checks.find((e2) => e2.kind === "ip");
  }
  get isCIDR() {
    return !!this._def.checks.find((e2) => e2.kind === "cidr");
  }
  get isBase64() {
    return !!this._def.checks.find((e2) => e2.kind === "base64");
  }
  get isBase64url() {
    return !!this._def.checks.find((e2) => e2.kind === "base64url");
  }
  get minLength() {
    let e2 = null;
    for (let t2 of this._def.checks) t2.kind === "min" && (e2 === null || t2.value > e2) && (e2 = t2.value);
    return e2;
  }
  get maxLength() {
    let e2 = null;
    for (let t2 of this._def.checks) t2.kind === "max" && (e2 === null || t2.value < e2) && (e2 = t2.value);
    return e2;
  }
};
$6.create = (r34) => {
  var e2;
  return new $6({ checks: [], typeName: m5.ZodString, coerce: (e2 = r34?.coerce) !== null && e2 !== void 0 ? e2 : false, ..._9(r34) });
};
function dt2(r34, e2) {
  let t2 = (r34.toString().split(".")[1] || "").length, s4 = (e2.toString().split(".")[1] || "").length, n = t2 > s4 ? t2 : s4, a6 = parseInt(r34.toFixed(n).replace(".", "")), i2 = parseInt(e2.toFixed(n).replace(".", ""));
  return a6 % i2 / Math.pow(10, n);
}
__name(dt2, "dt");
var z7 = class r22 extends y7 {
  static {
    __name(this, "r");
  }
  constructor() {
    super(...arguments), this.min = this.gte, this.max = this.lte, this.step = this.multipleOf;
  }
  _parse(e2) {
    if (this._def.coerce && (e2.data = Number(e2.data)), this._getType(e2) !== f5.number) {
      let a6 = this._getOrReturnCtx(e2);
      return u5(a6, { code: d6.invalid_type, expected: f5.number, received: a6.parsedType }), v6;
    }
    let s4, n = new x8();
    for (let a6 of this._def.checks) a6.kind === "int" ? g6.isInteger(e2.data) || (s4 = this._getOrReturnCtx(e2, s4), u5(s4, { code: d6.invalid_type, expected: "integer", received: "float", message: a6.message }), n.dirty()) : a6.kind === "min" ? (a6.inclusive ? e2.data < a6.value : e2.data <= a6.value) && (s4 = this._getOrReturnCtx(e2, s4), u5(s4, { code: d6.too_small, minimum: a6.value, type: "number", inclusive: a6.inclusive, exact: false, message: a6.message }), n.dirty()) : a6.kind === "max" ? (a6.inclusive ? e2.data > a6.value : e2.data >= a6.value) && (s4 = this._getOrReturnCtx(e2, s4), u5(s4, { code: d6.too_big, maximum: a6.value, type: "number", inclusive: a6.inclusive, exact: false, message: a6.message }), n.dirty()) : a6.kind === "multipleOf" ? dt2(e2.data, a6.value) !== 0 && (s4 = this._getOrReturnCtx(e2, s4), u5(s4, { code: d6.not_multiple_of, multipleOf: a6.value, message: a6.message }), n.dirty()) : a6.kind === "finite" ? Number.isFinite(e2.data) || (s4 = this._getOrReturnCtx(e2, s4), u5(s4, { code: d6.not_finite, message: a6.message }), n.dirty()) : g6.assertNever(a6);
    return { status: n.value, value: e2.data };
  }
  gte(e2, t2) {
    return this.setLimit("min", e2, true, h5.toString(t2));
  }
  gt(e2, t2) {
    return this.setLimit("min", e2, false, h5.toString(t2));
  }
  lte(e2, t2) {
    return this.setLimit("max", e2, true, h5.toString(t2));
  }
  lt(e2, t2) {
    return this.setLimit("max", e2, false, h5.toString(t2));
  }
  setLimit(e2, t2, s4, n) {
    return new r22({ ...this._def, checks: [...this._def.checks, { kind: e2, value: t2, inclusive: s4, message: h5.toString(n) }] });
  }
  _addCheck(e2) {
    return new r22({ ...this._def, checks: [...this._def.checks, e2] });
  }
  int(e2) {
    return this._addCheck({ kind: "int", message: h5.toString(e2) });
  }
  positive(e2) {
    return this._addCheck({ kind: "min", value: 0, inclusive: false, message: h5.toString(e2) });
  }
  negative(e2) {
    return this._addCheck({ kind: "max", value: 0, inclusive: false, message: h5.toString(e2) });
  }
  nonpositive(e2) {
    return this._addCheck({ kind: "max", value: 0, inclusive: true, message: h5.toString(e2) });
  }
  nonnegative(e2) {
    return this._addCheck({ kind: "min", value: 0, inclusive: true, message: h5.toString(e2) });
  }
  multipleOf(e2, t2) {
    return this._addCheck({ kind: "multipleOf", value: e2, message: h5.toString(t2) });
  }
  finite(e2) {
    return this._addCheck({ kind: "finite", message: h5.toString(e2) });
  }
  safe(e2) {
    return this._addCheck({ kind: "min", inclusive: true, value: Number.MIN_SAFE_INTEGER, message: h5.toString(e2) })._addCheck({ kind: "max", inclusive: true, value: Number.MAX_SAFE_INTEGER, message: h5.toString(e2) });
  }
  get minValue() {
    let e2 = null;
    for (let t2 of this._def.checks) t2.kind === "min" && (e2 === null || t2.value > e2) && (e2 = t2.value);
    return e2;
  }
  get maxValue() {
    let e2 = null;
    for (let t2 of this._def.checks) t2.kind === "max" && (e2 === null || t2.value < e2) && (e2 = t2.value);
    return e2;
  }
  get isInt() {
    return !!this._def.checks.find((e2) => e2.kind === "int" || e2.kind === "multipleOf" && g6.isInteger(e2.value));
  }
  get isFinite() {
    let e2 = null, t2 = null;
    for (let s4 of this._def.checks) {
      if (s4.kind === "finite" || s4.kind === "int" || s4.kind === "multipleOf") return true;
      s4.kind === "min" ? (t2 === null || s4.value > t2) && (t2 = s4.value) : s4.kind === "max" && (e2 === null || s4.value < e2) && (e2 = s4.value);
    }
    return Number.isFinite(t2) && Number.isFinite(e2);
  }
};
z7.create = (r34) => new z7({ checks: [], typeName: m5.ZodNumber, coerce: r34?.coerce || false, ..._9(r34) });
var D6 = class r23 extends y7 {
  static {
    __name(this, "r");
  }
  constructor() {
    super(...arguments), this.min = this.gte, this.max = this.lte;
  }
  _parse(e2) {
    if (this._def.coerce) try {
      e2.data = BigInt(e2.data);
    } catch {
      return this._getInvalidInput(e2);
    }
    if (this._getType(e2) !== f5.bigint) return this._getInvalidInput(e2);
    let s4, n = new x8();
    for (let a6 of this._def.checks) a6.kind === "min" ? (a6.inclusive ? e2.data < a6.value : e2.data <= a6.value) && (s4 = this._getOrReturnCtx(e2, s4), u5(s4, { code: d6.too_small, type: "bigint", minimum: a6.value, inclusive: a6.inclusive, message: a6.message }), n.dirty()) : a6.kind === "max" ? (a6.inclusive ? e2.data > a6.value : e2.data >= a6.value) && (s4 = this._getOrReturnCtx(e2, s4), u5(s4, { code: d6.too_big, type: "bigint", maximum: a6.value, inclusive: a6.inclusive, message: a6.message }), n.dirty()) : a6.kind === "multipleOf" ? e2.data % a6.value !== BigInt(0) && (s4 = this._getOrReturnCtx(e2, s4), u5(s4, { code: d6.not_multiple_of, multipleOf: a6.value, message: a6.message }), n.dirty()) : g6.assertNever(a6);
    return { status: n.value, value: e2.data };
  }
  _getInvalidInput(e2) {
    let t2 = this._getOrReturnCtx(e2);
    return u5(t2, { code: d6.invalid_type, expected: f5.bigint, received: t2.parsedType }), v6;
  }
  gte(e2, t2) {
    return this.setLimit("min", e2, true, h5.toString(t2));
  }
  gt(e2, t2) {
    return this.setLimit("min", e2, false, h5.toString(t2));
  }
  lte(e2, t2) {
    return this.setLimit("max", e2, true, h5.toString(t2));
  }
  lt(e2, t2) {
    return this.setLimit("max", e2, false, h5.toString(t2));
  }
  setLimit(e2, t2, s4, n) {
    return new r23({ ...this._def, checks: [...this._def.checks, { kind: e2, value: t2, inclusive: s4, message: h5.toString(n) }] });
  }
  _addCheck(e2) {
    return new r23({ ...this._def, checks: [...this._def.checks, e2] });
  }
  positive(e2) {
    return this._addCheck({ kind: "min", value: BigInt(0), inclusive: false, message: h5.toString(e2) });
  }
  negative(e2) {
    return this._addCheck({ kind: "max", value: BigInt(0), inclusive: false, message: h5.toString(e2) });
  }
  nonpositive(e2) {
    return this._addCheck({ kind: "max", value: BigInt(0), inclusive: true, message: h5.toString(e2) });
  }
  nonnegative(e2) {
    return this._addCheck({ kind: "min", value: BigInt(0), inclusive: true, message: h5.toString(e2) });
  }
  multipleOf(e2, t2) {
    return this._addCheck({ kind: "multipleOf", value: e2, message: h5.toString(t2) });
  }
  get minValue() {
    let e2 = null;
    for (let t2 of this._def.checks) t2.kind === "min" && (e2 === null || t2.value > e2) && (e2 = t2.value);
    return e2;
  }
  get maxValue() {
    let e2 = null;
    for (let t2 of this._def.checks) t2.kind === "max" && (e2 === null || t2.value < e2) && (e2 = t2.value);
    return e2;
  }
};
D6.create = (r34) => {
  var e2;
  return new D6({ checks: [], typeName: m5.ZodBigInt, coerce: (e2 = r34?.coerce) !== null && e2 !== void 0 ? e2 : false, ..._9(r34) });
};
var L6 = class extends y7 {
  static {
    __name(this, "L");
  }
  _parse(e2) {
    if (this._def.coerce && (e2.data = !!e2.data), this._getType(e2) !== f5.boolean) {
      let s4 = this._getOrReturnCtx(e2);
      return u5(s4, { code: d6.invalid_type, expected: f5.boolean, received: s4.parsedType }), v6;
    }
    return b6(e2.data);
  }
};
L6.create = (r34) => new L6({ typeName: m5.ZodBoolean, coerce: r34?.coerce || false, ..._9(r34) });
var U5 = class r24 extends y7 {
  static {
    __name(this, "r");
  }
  _parse(e2) {
    if (this._def.coerce && (e2.data = new Date(e2.data)), this._getType(e2) !== f5.date) {
      let a6 = this._getOrReturnCtx(e2);
      return u5(a6, { code: d6.invalid_type, expected: f5.date, received: a6.parsedType }), v6;
    }
    if (isNaN(e2.data.getTime())) {
      let a6 = this._getOrReturnCtx(e2);
      return u5(a6, { code: d6.invalid_date }), v6;
    }
    let s4 = new x8(), n;
    for (let a6 of this._def.checks) a6.kind === "min" ? e2.data.getTime() < a6.value && (n = this._getOrReturnCtx(e2, n), u5(n, { code: d6.too_small, message: a6.message, inclusive: true, exact: false, minimum: a6.value, type: "date" }), s4.dirty()) : a6.kind === "max" ? e2.data.getTime() > a6.value && (n = this._getOrReturnCtx(e2, n), u5(n, { code: d6.too_big, message: a6.message, inclusive: true, exact: false, maximum: a6.value, type: "date" }), s4.dirty()) : g6.assertNever(a6);
    return { status: s4.value, value: new Date(e2.data.getTime()) };
  }
  _addCheck(e2) {
    return new r24({ ...this._def, checks: [...this._def.checks, e2] });
  }
  min(e2, t2) {
    return this._addCheck({ kind: "min", value: e2.getTime(), message: h5.toString(t2) });
  }
  max(e2, t2) {
    return this._addCheck({ kind: "max", value: e2.getTime(), message: h5.toString(t2) });
  }
  get minDate() {
    let e2 = null;
    for (let t2 of this._def.checks) t2.kind === "min" && (e2 === null || t2.value > e2) && (e2 = t2.value);
    return e2 != null ? new Date(e2) : null;
  }
  get maxDate() {
    let e2 = null;
    for (let t2 of this._def.checks) t2.kind === "max" && (e2 === null || t2.value < e2) && (e2 = t2.value);
    return e2 != null ? new Date(e2) : null;
  }
};
U5.create = (r34) => new U5({ checks: [], coerce: r34?.coerce || false, typeName: m5.ZodDate, ..._9(r34) });
var se5 = class extends y7 {
  static {
    __name(this, "se");
  }
  _parse(e2) {
    if (this._getType(e2) !== f5.symbol) {
      let s4 = this._getOrReturnCtx(e2);
      return u5(s4, { code: d6.invalid_type, expected: f5.symbol, received: s4.parsedType }), v6;
    }
    return b6(e2.data);
  }
};
se5.create = (r34) => new se5({ typeName: m5.ZodSymbol, ..._9(r34) });
var F5 = class extends y7 {
  static {
    __name(this, "F");
  }
  _parse(e2) {
    if (this._getType(e2) !== f5.undefined) {
      let s4 = this._getOrReturnCtx(e2);
      return u5(s4, { code: d6.invalid_type, expected: f5.undefined, received: s4.parsedType }), v6;
    }
    return b6(e2.data);
  }
};
F5.create = (r34) => new F5({ typeName: m5.ZodUndefined, ..._9(r34) });
var B7 = class extends y7 {
  static {
    __name(this, "B");
  }
  _parse(e2) {
    if (this._getType(e2) !== f5.null) {
      let s4 = this._getOrReturnCtx(e2);
      return u5(s4, { code: d6.invalid_type, expected: f5.null, received: s4.parsedType }), v6;
    }
    return b6(e2.data);
  }
};
B7.create = (r34) => new B7({ typeName: m5.ZodNull, ..._9(r34) });
var M4 = class extends y7 {
  static {
    __name(this, "M");
  }
  constructor() {
    super(...arguments), this._any = true;
  }
  _parse(e2) {
    return b6(e2.data);
  }
};
M4.create = (r34) => new M4({ typeName: m5.ZodAny, ..._9(r34) });
var N7 = class extends y7 {
  static {
    __name(this, "N");
  }
  constructor() {
    super(...arguments), this._unknown = true;
  }
  _parse(e2) {
    return b6(e2.data);
  }
};
N7.create = (r34) => new N7({ typeName: m5.ZodUnknown, ..._9(r34) });
var A6 = class extends y7 {
  static {
    __name(this, "A");
  }
  _parse(e2) {
    let t2 = this._getOrReturnCtx(e2);
    return u5(t2, { code: d6.invalid_type, expected: f5.never, received: t2.parsedType }), v6;
  }
};
A6.create = (r34) => new A6({ typeName: m5.ZodNever, ..._9(r34) });
var ne5 = class extends y7 {
  static {
    __name(this, "ne");
  }
  _parse(e2) {
    if (this._getType(e2) !== f5.undefined) {
      let s4 = this._getOrReturnCtx(e2);
      return u5(s4, { code: d6.invalid_type, expected: f5.void, received: s4.parsedType }), v6;
    }
    return b6(e2.data);
  }
};
ne5.create = (r34) => new ne5({ typeName: m5.ZodVoid, ..._9(r34) });
var I8 = class r25 extends y7 {
  static {
    __name(this, "r");
  }
  _parse(e2) {
    let { ctx: t2, status: s4 } = this._processInputParams(e2), n = this._def;
    if (t2.parsedType !== f5.array) return u5(t2, { code: d6.invalid_type, expected: f5.array, received: t2.parsedType }), v6;
    if (n.exactLength !== null) {
      let i2 = t2.data.length > n.exactLength.value, o6 = t2.data.length < n.exactLength.value;
      (i2 || o6) && (u5(t2, { code: i2 ? d6.too_big : d6.too_small, minimum: o6 ? n.exactLength.value : void 0, maximum: i2 ? n.exactLength.value : void 0, type: "array", inclusive: true, exact: true, message: n.exactLength.message }), s4.dirty());
    }
    if (n.minLength !== null && t2.data.length < n.minLength.value && (u5(t2, { code: d6.too_small, minimum: n.minLength.value, type: "array", inclusive: true, exact: false, message: n.minLength.message }), s4.dirty()), n.maxLength !== null && t2.data.length > n.maxLength.value && (u5(t2, { code: d6.too_big, maximum: n.maxLength.value, type: "array", inclusive: true, exact: false, message: n.maxLength.message }), s4.dirty()), t2.common.async) return Promise.all([...t2.data].map((i2, o6) => n.type._parseAsync(new S8(t2, i2, t2.path, o6)))).then((i2) => x8.mergeArray(s4, i2));
    let a6 = [...t2.data].map((i2, o6) => n.type._parseSync(new S8(t2, i2, t2.path, o6)));
    return x8.mergeArray(s4, a6);
  }
  get element() {
    return this._def.type;
  }
  min(e2, t2) {
    return new r25({ ...this._def, minLength: { value: e2, message: h5.toString(t2) } });
  }
  max(e2, t2) {
    return new r25({ ...this._def, maxLength: { value: e2, message: h5.toString(t2) } });
  }
  length(e2, t2) {
    return new r25({ ...this._def, exactLength: { value: e2, message: h5.toString(t2) } });
  }
  nonempty(e2) {
    return this.min(1, e2);
  }
};
I8.create = (r34, e2) => new I8({ type: r34, minLength: null, maxLength: null, exactLength: null, typeName: m5.ZodArray, ..._9(e2) });
function ee4(r34) {
  if (r34 instanceof w7) {
    let e2 = {};
    for (let t2 in r34.shape) {
      let s4 = r34.shape[t2];
      e2[t2] = O7.create(ee4(s4));
    }
    return new w7({ ...r34._def, shape: /* @__PURE__ */ __name(() => e2, "shape") });
  } else return r34 instanceof I8 ? new I8({ ...r34._def, type: ee4(r34.element) }) : r34 instanceof O7 ? O7.create(ee4(r34.unwrap())) : r34 instanceof Z5 ? Z5.create(ee4(r34.unwrap())) : r34 instanceof E7 ? E7.create(r34.items.map((e2) => ee4(e2))) : r34;
}
__name(ee4, "ee");
var w7 = class r26 extends y7 {
  static {
    __name(this, "r");
  }
  constructor() {
    super(...arguments), this._cached = null, this.nonstrict = this.passthrough, this.augment = this.extend;
  }
  _getCached() {
    if (this._cached !== null) return this._cached;
    let e2 = this._def.shape(), t2 = g6.objectKeys(e2);
    return this._cached = { shape: e2, keys: t2 };
  }
  _parse(e2) {
    if (this._getType(e2) !== f5.object) {
      let c6 = this._getOrReturnCtx(e2);
      return u5(c6, { code: d6.invalid_type, expected: f5.object, received: c6.parsedType }), v6;
    }
    let { status: s4, ctx: n } = this._processInputParams(e2), { shape: a6, keys: i2 } = this._getCached(), o6 = [];
    if (!(this._def.catchall instanceof A6 && this._def.unknownKeys === "strip")) for (let c6 in n.data) i2.includes(c6) || o6.push(c6);
    let l6 = [];
    for (let c6 of i2) {
      let p3 = a6[c6], k6 = n.data[c6];
      l6.push({ key: { status: "valid", value: c6 }, value: p3._parse(new S8(n, k6, n.path, c6)), alwaysSet: c6 in n.data });
    }
    if (this._def.catchall instanceof A6) {
      let c6 = this._def.unknownKeys;
      if (c6 === "passthrough") for (let p3 of o6) l6.push({ key: { status: "valid", value: p3 }, value: { status: "valid", value: n.data[p3] } });
      else if (c6 === "strict") o6.length > 0 && (u5(n, { code: d6.unrecognized_keys, keys: o6 }), s4.dirty());
      else if (c6 !== "strip") throw new Error("Internal ZodObject error: invalid unknownKeys value.");
    } else {
      let c6 = this._def.catchall;
      for (let p3 of o6) {
        let k6 = n.data[p3];
        l6.push({ key: { status: "valid", value: p3 }, value: c6._parse(new S8(n, k6, n.path, p3)), alwaysSet: p3 in n.data });
      }
    }
    return n.common.async ? Promise.resolve().then(async () => {
      let c6 = [];
      for (let p3 of l6) {
        let k6 = await p3.key, he4 = await p3.value;
        c6.push({ key: k6, value: he4, alwaysSet: p3.alwaysSet });
      }
      return c6;
    }).then((c6) => x8.mergeObjectSync(s4, c6)) : x8.mergeObjectSync(s4, l6);
  }
  get shape() {
    return this._def.shape();
  }
  strict(e2) {
    return h5.errToObj, new r26({ ...this._def, unknownKeys: "strict", ...e2 !== void 0 ? { errorMap: /* @__PURE__ */ __name((t2, s4) => {
      var n, a6, i2, o6;
      let l6 = (i2 = (a6 = (n = this._def).errorMap) === null || a6 === void 0 ? void 0 : a6.call(n, t2, s4).message) !== null && i2 !== void 0 ? i2 : s4.defaultError;
      return t2.code === "unrecognized_keys" ? { message: (o6 = h5.errToObj(e2).message) !== null && o6 !== void 0 ? o6 : l6 } : { message: l6 };
    }, "errorMap") } : {} });
  }
  strip() {
    return new r26({ ...this._def, unknownKeys: "strip" });
  }
  passthrough() {
    return new r26({ ...this._def, unknownKeys: "passthrough" });
  }
  extend(e2) {
    return new r26({ ...this._def, shape: /* @__PURE__ */ __name(() => ({ ...this._def.shape(), ...e2 }), "shape") });
  }
  merge(e2) {
    return new r26({ unknownKeys: e2._def.unknownKeys, catchall: e2._def.catchall, shape: /* @__PURE__ */ __name(() => ({ ...this._def.shape(), ...e2._def.shape() }), "shape"), typeName: m5.ZodObject });
  }
  setKey(e2, t2) {
    return this.augment({ [e2]: t2 });
  }
  catchall(e2) {
    return new r26({ ...this._def, catchall: e2 });
  }
  pick(e2) {
    let t2 = {};
    return g6.objectKeys(e2).forEach((s4) => {
      e2[s4] && this.shape[s4] && (t2[s4] = this.shape[s4]);
    }), new r26({ ...this._def, shape: /* @__PURE__ */ __name(() => t2, "shape") });
  }
  omit(e2) {
    let t2 = {};
    return g6.objectKeys(this.shape).forEach((s4) => {
      e2[s4] || (t2[s4] = this.shape[s4]);
    }), new r26({ ...this._def, shape: /* @__PURE__ */ __name(() => t2, "shape") });
  }
  deepPartial() {
    return ee4(this);
  }
  partial(e2) {
    let t2 = {};
    return g6.objectKeys(this.shape).forEach((s4) => {
      let n = this.shape[s4];
      e2 && !e2[s4] ? t2[s4] = n : t2[s4] = n.optional();
    }), new r26({ ...this._def, shape: /* @__PURE__ */ __name(() => t2, "shape") });
  }
  required(e2) {
    let t2 = {};
    return g6.objectKeys(this.shape).forEach((s4) => {
      if (e2 && !e2[s4]) t2[s4] = this.shape[s4];
      else {
        let a6 = this.shape[s4];
        for (; a6 instanceof O7; ) a6 = a6._def.innerType;
        t2[s4] = a6;
      }
    }), new r26({ ...this._def, shape: /* @__PURE__ */ __name(() => t2, "shape") });
  }
  keyof() {
    return Ie3(g6.objectKeys(this.shape));
  }
};
w7.create = (r34, e2) => new w7({ shape: /* @__PURE__ */ __name(() => r34, "shape"), unknownKeys: "strip", catchall: A6.create(), typeName: m5.ZodObject, ..._9(e2) });
w7.strictCreate = (r34, e2) => new w7({ shape: /* @__PURE__ */ __name(() => r34, "shape"), unknownKeys: "strict", catchall: A6.create(), typeName: m5.ZodObject, ..._9(e2) });
w7.lazycreate = (r34, e2) => new w7({ shape: r34, unknownKeys: "strip", catchall: A6.create(), typeName: m5.ZodObject, ..._9(e2) });
var W7 = class extends y7 {
  static {
    __name(this, "W");
  }
  _parse(e2) {
    let { ctx: t2 } = this._processInputParams(e2), s4 = this._def.options;
    function n(a6) {
      for (let o6 of a6) if (o6.result.status === "valid") return o6.result;
      for (let o6 of a6) if (o6.result.status === "dirty") return t2.common.issues.push(...o6.ctx.common.issues), o6.result;
      let i2 = a6.map((o6) => new T7(o6.ctx.common.issues));
      return u5(t2, { code: d6.invalid_union, unionErrors: i2 }), v6;
    }
    __name(n, "n");
    if (t2.common.async) return Promise.all(s4.map(async (a6) => {
      let i2 = { ...t2, common: { ...t2.common, issues: [] }, parent: null };
      return { result: await a6._parseAsync({ data: t2.data, path: t2.path, parent: i2 }), ctx: i2 };
    })).then(n);
    {
      let a6, i2 = [];
      for (let l6 of s4) {
        let c6 = { ...t2, common: { ...t2.common, issues: [] }, parent: null }, p3 = l6._parseSync({ data: t2.data, path: t2.path, parent: c6 });
        if (p3.status === "valid") return p3;
        p3.status === "dirty" && !a6 && (a6 = { result: p3, ctx: c6 }), c6.common.issues.length && i2.push(c6.common.issues);
      }
      if (a6) return t2.common.issues.push(...a6.ctx.common.issues), a6.result;
      let o6 = i2.map((l6) => new T7(l6));
      return u5(t2, { code: d6.invalid_union, unionErrors: o6 }), v6;
    }
  }
  get options() {
    return this._def.options;
  }
};
W7.create = (r34, e2) => new W7({ options: r34, typeName: m5.ZodUnion, ..._9(e2) });
var j6 = /* @__PURE__ */ __name((r34) => r34 instanceof J6 ? j6(r34.schema) : r34 instanceof C5 ? j6(r34.innerType()) : r34 instanceof Y5 ? [r34.value] : r34 instanceof H5 ? r34.options : r34 instanceof G6 ? g6.objectValues(r34.enum) : r34 instanceof X5 ? j6(r34._def.innerType) : r34 instanceof F5 ? [void 0] : r34 instanceof B7 ? [null] : r34 instanceof O7 ? [void 0, ...j6(r34.unwrap())] : r34 instanceof Z5 ? [null, ...j6(r34.unwrap())] : r34 instanceof le4 || r34 instanceof K6 ? j6(r34.unwrap()) : r34 instanceof Q6 ? j6(r34._def.innerType) : [], "j");
var _e4 = class r27 extends y7 {
  static {
    __name(this, "r");
  }
  _parse(e2) {
    let { ctx: t2 } = this._processInputParams(e2);
    if (t2.parsedType !== f5.object) return u5(t2, { code: d6.invalid_type, expected: f5.object, received: t2.parsedType }), v6;
    let s4 = this.discriminator, n = t2.data[s4], a6 = this.optionsMap.get(n);
    return a6 ? t2.common.async ? a6._parseAsync({ data: t2.data, path: t2.path, parent: t2 }) : a6._parseSync({ data: t2.data, path: t2.path, parent: t2 }) : (u5(t2, { code: d6.invalid_union_discriminator, options: Array.from(this.optionsMap.keys()), path: [s4] }), v6);
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
  static create(e2, t2, s4) {
    let n = /* @__PURE__ */ new Map();
    for (let a6 of t2) {
      let i2 = j6(a6.shape[e2]);
      if (!i2.length) throw new Error(`A discriminator value for key \`${e2}\` could not be extracted from all schema options`);
      for (let o6 of i2) {
        if (n.has(o6)) throw new Error(`Discriminator property ${String(e2)} has duplicate value ${String(o6)}`);
        n.set(o6, a6);
      }
    }
    return new r27({ typeName: m5.ZodDiscriminatedUnion, discriminator: e2, options: t2, optionsMap: n, ..._9(s4) });
  }
};
function Ce4(r34, e2) {
  let t2 = R6(r34), s4 = R6(e2);
  if (r34 === e2) return { valid: true, data: r34 };
  if (t2 === f5.object && s4 === f5.object) {
    let n = g6.objectKeys(e2), a6 = g6.objectKeys(r34).filter((o6) => n.indexOf(o6) !== -1), i2 = { ...r34, ...e2 };
    for (let o6 of a6) {
      let l6 = Ce4(r34[o6], e2[o6]);
      if (!l6.valid) return { valid: false };
      i2[o6] = l6.data;
    }
    return { valid: true, data: i2 };
  } else if (t2 === f5.array && s4 === f5.array) {
    if (r34.length !== e2.length) return { valid: false };
    let n = [];
    for (let a6 = 0; a6 < r34.length; a6++) {
      let i2 = r34[a6], o6 = e2[a6], l6 = Ce4(i2, o6);
      if (!l6.valid) return { valid: false };
      n.push(l6.data);
    }
    return { valid: true, data: n };
  } else return t2 === f5.date && s4 === f5.date && +r34 == +e2 ? { valid: true, data: r34 } : { valid: false };
}
__name(Ce4, "Ce");
var q7 = class extends y7 {
  static {
    __name(this, "q");
  }
  _parse(e2) {
    let { status: t2, ctx: s4 } = this._processInputParams(e2), n = /* @__PURE__ */ __name((a6, i2) => {
      if (we3(a6) || we3(i2)) return v6;
      let o6 = Ce4(a6.value, i2.value);
      return o6.valid ? ((Te2(a6) || Te2(i2)) && t2.dirty(), { status: t2.value, value: o6.data }) : (u5(s4, { code: d6.invalid_intersection_types }), v6);
    }, "n");
    return s4.common.async ? Promise.all([this._def.left._parseAsync({ data: s4.data, path: s4.path, parent: s4 }), this._def.right._parseAsync({ data: s4.data, path: s4.path, parent: s4 })]).then(([a6, i2]) => n(a6, i2)) : n(this._def.left._parseSync({ data: s4.data, path: s4.path, parent: s4 }), this._def.right._parseSync({ data: s4.data, path: s4.path, parent: s4 }));
  }
};
q7.create = (r34, e2, t2) => new q7({ left: r34, right: e2, typeName: m5.ZodIntersection, ..._9(t2) });
var E7 = class r28 extends y7 {
  static {
    __name(this, "r");
  }
  _parse(e2) {
    let { status: t2, ctx: s4 } = this._processInputParams(e2);
    if (s4.parsedType !== f5.array) return u5(s4, { code: d6.invalid_type, expected: f5.array, received: s4.parsedType }), v6;
    if (s4.data.length < this._def.items.length) return u5(s4, { code: d6.too_small, minimum: this._def.items.length, inclusive: true, exact: false, type: "array" }), v6;
    !this._def.rest && s4.data.length > this._def.items.length && (u5(s4, { code: d6.too_big, maximum: this._def.items.length, inclusive: true, exact: false, type: "array" }), t2.dirty());
    let a6 = [...s4.data].map((i2, o6) => {
      let l6 = this._def.items[o6] || this._def.rest;
      return l6 ? l6._parse(new S8(s4, i2, s4.path, o6)) : null;
    }).filter((i2) => !!i2);
    return s4.common.async ? Promise.all(a6).then((i2) => x8.mergeArray(t2, i2)) : x8.mergeArray(t2, a6);
  }
  get items() {
    return this._def.items;
  }
  rest(e2) {
    return new r28({ ...this._def, rest: e2 });
  }
};
E7.create = (r34, e2) => {
  if (!Array.isArray(r34)) throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
  return new E7({ items: r34, typeName: m5.ZodTuple, rest: null, ..._9(e2) });
};
var ye5 = class r29 extends y7 {
  static {
    __name(this, "r");
  }
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(e2) {
    let { status: t2, ctx: s4 } = this._processInputParams(e2);
    if (s4.parsedType !== f5.object) return u5(s4, { code: d6.invalid_type, expected: f5.object, received: s4.parsedType }), v6;
    let n = [], a6 = this._def.keyType, i2 = this._def.valueType;
    for (let o6 in s4.data) n.push({ key: a6._parse(new S8(s4, o6, s4.path, o6)), value: i2._parse(new S8(s4, s4.data[o6], s4.path, o6)), alwaysSet: o6 in s4.data });
    return s4.common.async ? x8.mergeObjectAsync(t2, n) : x8.mergeObjectSync(t2, n);
  }
  get element() {
    return this._def.valueType;
  }
  static create(e2, t2, s4) {
    return t2 instanceof y7 ? new r29({ keyType: e2, valueType: t2, typeName: m5.ZodRecord, ..._9(s4) }) : new r29({ keyType: $6.create(), valueType: e2, typeName: m5.ZodRecord, ..._9(t2) });
  }
};
var ae5 = class extends y7 {
  static {
    __name(this, "ae");
  }
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(e2) {
    let { status: t2, ctx: s4 } = this._processInputParams(e2);
    if (s4.parsedType !== f5.map) return u5(s4, { code: d6.invalid_type, expected: f5.map, received: s4.parsedType }), v6;
    let n = this._def.keyType, a6 = this._def.valueType, i2 = [...s4.data.entries()].map(([o6, l6], c6) => ({ key: n._parse(new S8(s4, o6, s4.path, [c6, "key"])), value: a6._parse(new S8(s4, l6, s4.path, [c6, "value"])) }));
    if (s4.common.async) {
      let o6 = /* @__PURE__ */ new Map();
      return Promise.resolve().then(async () => {
        for (let l6 of i2) {
          let c6 = await l6.key, p3 = await l6.value;
          if (c6.status === "aborted" || p3.status === "aborted") return v6;
          (c6.status === "dirty" || p3.status === "dirty") && t2.dirty(), o6.set(c6.value, p3.value);
        }
        return { status: t2.value, value: o6 };
      });
    } else {
      let o6 = /* @__PURE__ */ new Map();
      for (let l6 of i2) {
        let c6 = l6.key, p3 = l6.value;
        if (c6.status === "aborted" || p3.status === "aborted") return v6;
        (c6.status === "dirty" || p3.status === "dirty") && t2.dirty(), o6.set(c6.value, p3.value);
      }
      return { status: t2.value, value: o6 };
    }
  }
};
ae5.create = (r34, e2, t2) => new ae5({ valueType: e2, keyType: r34, typeName: m5.ZodMap, ..._9(t2) });
var ie4 = class r30 extends y7 {
  static {
    __name(this, "r");
  }
  _parse(e2) {
    let { status: t2, ctx: s4 } = this._processInputParams(e2);
    if (s4.parsedType !== f5.set) return u5(s4, { code: d6.invalid_type, expected: f5.set, received: s4.parsedType }), v6;
    let n = this._def;
    n.minSize !== null && s4.data.size < n.minSize.value && (u5(s4, { code: d6.too_small, minimum: n.minSize.value, type: "set", inclusive: true, exact: false, message: n.minSize.message }), t2.dirty()), n.maxSize !== null && s4.data.size > n.maxSize.value && (u5(s4, { code: d6.too_big, maximum: n.maxSize.value, type: "set", inclusive: true, exact: false, message: n.maxSize.message }), t2.dirty());
    let a6 = this._def.valueType;
    function i2(l6) {
      let c6 = /* @__PURE__ */ new Set();
      for (let p3 of l6) {
        if (p3.status === "aborted") return v6;
        p3.status === "dirty" && t2.dirty(), c6.add(p3.value);
      }
      return { status: t2.value, value: c6 };
    }
    __name(i2, "i");
    let o6 = [...s4.data.values()].map((l6, c6) => a6._parse(new S8(s4, l6, s4.path, c6)));
    return s4.common.async ? Promise.all(o6).then((l6) => i2(l6)) : i2(o6);
  }
  min(e2, t2) {
    return new r30({ ...this._def, minSize: { value: e2, message: h5.toString(t2) } });
  }
  max(e2, t2) {
    return new r30({ ...this._def, maxSize: { value: e2, message: h5.toString(t2) } });
  }
  size(e2, t2) {
    return this.min(e2, t2).max(e2, t2);
  }
  nonempty(e2) {
    return this.min(1, e2);
  }
};
ie4.create = (r34, e2) => new ie4({ valueType: r34, minSize: null, maxSize: null, typeName: m5.ZodSet, ..._9(e2) });
var ge5 = class r31 extends y7 {
  static {
    __name(this, "r");
  }
  constructor() {
    super(...arguments), this.validate = this.implement;
  }
  _parse(e2) {
    let { ctx: t2 } = this._processInputParams(e2);
    if (t2.parsedType !== f5.function) return u5(t2, { code: d6.invalid_type, expected: f5.function, received: t2.parsedType }), v6;
    function s4(o6, l6) {
      return me5({ data: o6, path: t2.path, errorMaps: [t2.common.contextualErrorMap, t2.schemaErrorMap, pe5(), re4].filter((c6) => !!c6), issueData: { code: d6.invalid_arguments, argumentsError: l6 } });
    }
    __name(s4, "s");
    function n(o6, l6) {
      return me5({ data: o6, path: t2.path, errorMaps: [t2.common.contextualErrorMap, t2.schemaErrorMap, pe5(), re4].filter((c6) => !!c6), issueData: { code: d6.invalid_return_type, returnTypeError: l6 } });
    }
    __name(n, "n");
    let a6 = { errorMap: t2.common.contextualErrorMap }, i2 = t2.data;
    if (this._def.returns instanceof V5) {
      let o6 = this;
      return b6(async function(...l6) {
        let c6 = new T7([]), p3 = await o6._def.args.parseAsync(l6, a6).catch((xe2) => {
          throw c6.addIssue(s4(l6, xe2)), c6;
        }), k6 = await Reflect.apply(i2, this, p3);
        return await o6._def.returns._def.type.parseAsync(k6, a6).catch((xe2) => {
          throw c6.addIssue(n(k6, xe2)), c6;
        });
      });
    } else {
      let o6 = this;
      return b6(function(...l6) {
        let c6 = o6._def.args.safeParse(l6, a6);
        if (!c6.success) throw new T7([s4(l6, c6.error)]);
        let p3 = Reflect.apply(i2, this, c6.data), k6 = o6._def.returns.safeParse(p3, a6);
        if (!k6.success) throw new T7([n(p3, k6.error)]);
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
  args(...e2) {
    return new r31({ ...this._def, args: E7.create(e2).rest(N7.create()) });
  }
  returns(e2) {
    return new r31({ ...this._def, returns: e2 });
  }
  implement(e2) {
    return this.parse(e2);
  }
  strictImplement(e2) {
    return this.parse(e2);
  }
  static create(e2, t2, s4) {
    return new r31({ args: e2 || E7.create([]).rest(N7.create()), returns: t2 || N7.create(), typeName: m5.ZodFunction, ..._9(s4) });
  }
};
var J6 = class extends y7 {
  static {
    __name(this, "J");
  }
  get schema() {
    return this._def.getter();
  }
  _parse(e2) {
    let { ctx: t2 } = this._processInputParams(e2);
    return this._def.getter()._parse({ data: t2.data, path: t2.path, parent: t2 });
  }
};
J6.create = (r34, e2) => new J6({ getter: r34, typeName: m5.ZodLazy, ..._9(e2) });
var Y5 = class extends y7 {
  static {
    __name(this, "Y");
  }
  _parse(e2) {
    if (e2.data !== this._def.value) {
      let t2 = this._getOrReturnCtx(e2);
      return u5(t2, { received: t2.data, code: d6.invalid_literal, expected: this._def.value }), v6;
    }
    return { status: "valid", value: e2.data };
  }
  get value() {
    return this._def.value;
  }
};
Y5.create = (r34, e2) => new Y5({ value: r34, typeName: m5.ZodLiteral, ..._9(e2) });
function Ie3(r34, e2) {
  return new H5({ values: r34, typeName: m5.ZodEnum, ..._9(e2) });
}
__name(Ie3, "Ie");
var H5 = class r32 extends y7 {
  static {
    __name(this, "r");
  }
  constructor() {
    super(...arguments), de5.set(this, void 0);
  }
  _parse(e2) {
    if (typeof e2.data != "string") {
      let t2 = this._getOrReturnCtx(e2), s4 = this._def.values;
      return u5(t2, { expected: g6.joinValues(s4), received: t2.parsedType, code: d6.invalid_type }), v6;
    }
    if (ve3(this, de5, "f") || Ze3(this, de5, new Set(this._def.values), "f"), !ve3(this, de5, "f").has(e2.data)) {
      let t2 = this._getOrReturnCtx(e2), s4 = this._def.values;
      return u5(t2, { received: t2.data, code: d6.invalid_enum_value, options: s4 }), v6;
    }
    return b6(e2.data);
  }
  get options() {
    return this._def.values;
  }
  get enum() {
    let e2 = {};
    for (let t2 of this._def.values) e2[t2] = t2;
    return e2;
  }
  get Values() {
    let e2 = {};
    for (let t2 of this._def.values) e2[t2] = t2;
    return e2;
  }
  get Enum() {
    let e2 = {};
    for (let t2 of this._def.values) e2[t2] = t2;
    return e2;
  }
  extract(e2, t2 = this._def) {
    return r32.create(e2, { ...this._def, ...t2 });
  }
  exclude(e2, t2 = this._def) {
    return r32.create(this.options.filter((s4) => !e2.includes(s4)), { ...this._def, ...t2 });
  }
};
de5 = /* @__PURE__ */ new WeakMap();
H5.create = Ie3;
var G6 = class extends y7 {
  static {
    __name(this, "G");
  }
  constructor() {
    super(...arguments), ce4.set(this, void 0);
  }
  _parse(e2) {
    let t2 = g6.getValidEnumValues(this._def.values), s4 = this._getOrReturnCtx(e2);
    if (s4.parsedType !== f5.string && s4.parsedType !== f5.number) {
      let n = g6.objectValues(t2);
      return u5(s4, { expected: g6.joinValues(n), received: s4.parsedType, code: d6.invalid_type }), v6;
    }
    if (ve3(this, ce4, "f") || Ze3(this, ce4, new Set(g6.getValidEnumValues(this._def.values)), "f"), !ve3(this, ce4, "f").has(e2.data)) {
      let n = g6.objectValues(t2);
      return u5(s4, { received: s4.data, code: d6.invalid_enum_value, options: n }), v6;
    }
    return b6(e2.data);
  }
  get enum() {
    return this._def.values;
  }
};
ce4 = /* @__PURE__ */ new WeakMap();
G6.create = (r34, e2) => new G6({ values: r34, typeName: m5.ZodNativeEnum, ..._9(e2) });
var V5 = class extends y7 {
  static {
    __name(this, "V");
  }
  unwrap() {
    return this._def.type;
  }
  _parse(e2) {
    let { ctx: t2 } = this._processInputParams(e2);
    if (t2.parsedType !== f5.promise && t2.common.async === false) return u5(t2, { code: d6.invalid_type, expected: f5.promise, received: t2.parsedType }), v6;
    let s4 = t2.parsedType === f5.promise ? t2.data : Promise.resolve(t2.data);
    return b6(s4.then((n) => this._def.type.parseAsync(n, { path: t2.path, errorMap: t2.common.contextualErrorMap })));
  }
};
V5.create = (r34, e2) => new V5({ type: r34, typeName: m5.ZodPromise, ..._9(e2) });
var C5 = class extends y7 {
  static {
    __name(this, "C");
  }
  innerType() {
    return this._def.schema;
  }
  sourceType() {
    return this._def.schema._def.typeName === m5.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
  }
  _parse(e2) {
    let { status: t2, ctx: s4 } = this._processInputParams(e2), n = this._def.effect || null, a6 = { addIssue: /* @__PURE__ */ __name((i2) => {
      u5(s4, i2), i2.fatal ? t2.abort() : t2.dirty();
    }, "addIssue"), get path() {
      return s4.path;
    } };
    if (a6.addIssue = a6.addIssue.bind(a6), n.type === "preprocess") {
      let i2 = n.transform(s4.data, a6);
      if (s4.common.async) return Promise.resolve(i2).then(async (o6) => {
        if (t2.value === "aborted") return v6;
        let l6 = await this._def.schema._parseAsync({ data: o6, path: s4.path, parent: s4 });
        return l6.status === "aborted" ? v6 : l6.status === "dirty" || t2.value === "dirty" ? te5(l6.value) : l6;
      });
      {
        if (t2.value === "aborted") return v6;
        let o6 = this._def.schema._parseSync({ data: i2, path: s4.path, parent: s4 });
        return o6.status === "aborted" ? v6 : o6.status === "dirty" || t2.value === "dirty" ? te5(o6.value) : o6;
      }
    }
    if (n.type === "refinement") {
      let i2 = /* @__PURE__ */ __name((o6) => {
        let l6 = n.refinement(o6, a6);
        if (s4.common.async) return Promise.resolve(l6);
        if (l6 instanceof Promise) throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
        return o6;
      }, "i");
      if (s4.common.async === false) {
        let o6 = this._def.schema._parseSync({ data: s4.data, path: s4.path, parent: s4 });
        return o6.status === "aborted" ? v6 : (o6.status === "dirty" && t2.dirty(), i2(o6.value), { status: t2.value, value: o6.value });
      } else return this._def.schema._parseAsync({ data: s4.data, path: s4.path, parent: s4 }).then((o6) => o6.status === "aborted" ? v6 : (o6.status === "dirty" && t2.dirty(), i2(o6.value).then(() => ({ status: t2.value, value: o6.value }))));
    }
    if (n.type === "transform") if (s4.common.async === false) {
      let i2 = this._def.schema._parseSync({ data: s4.data, path: s4.path, parent: s4 });
      if (!P4(i2)) return i2;
      let o6 = n.transform(i2.value, a6);
      if (o6 instanceof Promise) throw new Error("Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.");
      return { status: t2.value, value: o6 };
    } else return this._def.schema._parseAsync({ data: s4.data, path: s4.path, parent: s4 }).then((i2) => P4(i2) ? Promise.resolve(n.transform(i2.value, a6)).then((o6) => ({ status: t2.value, value: o6 })) : i2);
    g6.assertNever(n);
  }
};
C5.create = (r34, e2, t2) => new C5({ schema: r34, typeName: m5.ZodEffects, effect: e2, ..._9(t2) });
C5.createWithPreprocess = (r34, e2, t2) => new C5({ schema: e2, effect: { type: "preprocess", transform: r34 }, typeName: m5.ZodEffects, ..._9(t2) });
var O7 = class extends y7 {
  static {
    __name(this, "O");
  }
  _parse(e2) {
    return this._getType(e2) === f5.undefined ? b6(void 0) : this._def.innerType._parse(e2);
  }
  unwrap() {
    return this._def.innerType;
  }
};
O7.create = (r34, e2) => new O7({ innerType: r34, typeName: m5.ZodOptional, ..._9(e2) });
var Z5 = class extends y7 {
  static {
    __name(this, "Z");
  }
  _parse(e2) {
    return this._getType(e2) === f5.null ? b6(null) : this._def.innerType._parse(e2);
  }
  unwrap() {
    return this._def.innerType;
  }
};
Z5.create = (r34, e2) => new Z5({ innerType: r34, typeName: m5.ZodNullable, ..._9(e2) });
var X5 = class extends y7 {
  static {
    __name(this, "X");
  }
  _parse(e2) {
    let { ctx: t2 } = this._processInputParams(e2), s4 = t2.data;
    return t2.parsedType === f5.undefined && (s4 = this._def.defaultValue()), this._def.innerType._parse({ data: s4, path: t2.path, parent: t2 });
  }
  removeDefault() {
    return this._def.innerType;
  }
};
X5.create = (r34, e2) => new X5({ innerType: r34, typeName: m5.ZodDefault, defaultValue: typeof e2.default == "function" ? e2.default : () => e2.default, ..._9(e2) });
var Q6 = class extends y7 {
  static {
    __name(this, "Q");
  }
  _parse(e2) {
    let { ctx: t2 } = this._processInputParams(e2), s4 = { ...t2, common: { ...t2.common, issues: [] } }, n = this._def.innerType._parse({ data: s4.data, path: s4.path, parent: { ...s4 } });
    return ue5(n) ? n.then((a6) => ({ status: "valid", value: a6.status === "valid" ? a6.value : this._def.catchValue({ get error() {
      return new T7(s4.common.issues);
    }, input: s4.data }) })) : { status: "valid", value: n.status === "valid" ? n.value : this._def.catchValue({ get error() {
      return new T7(s4.common.issues);
    }, input: s4.data }) };
  }
  removeCatch() {
    return this._def.innerType;
  }
};
Q6.create = (r34, e2) => new Q6({ innerType: r34, typeName: m5.ZodCatch, catchValue: typeof e2.catch == "function" ? e2.catch : () => e2.catch, ..._9(e2) });
var oe5 = class extends y7 {
  static {
    __name(this, "oe");
  }
  _parse(e2) {
    if (this._getType(e2) !== f5.nan) {
      let s4 = this._getOrReturnCtx(e2);
      return u5(s4, { code: d6.invalid_type, expected: f5.nan, received: s4.parsedType }), v6;
    }
    return { status: "valid", value: e2.data };
  }
};
oe5.create = (r34) => new oe5({ typeName: m5.ZodNaN, ..._9(r34) });
var ct2 = Symbol("zod_brand");
var le4 = class extends y7 {
  static {
    __name(this, "le");
  }
  _parse(e2) {
    let { ctx: t2 } = this._processInputParams(e2), s4 = t2.data;
    return this._def.type._parse({ data: s4, path: t2.path, parent: t2 });
  }
  unwrap() {
    return this._def.type;
  }
};
var fe5 = class r33 extends y7 {
  static {
    __name(this, "r");
  }
  _parse(e2) {
    let { status: t2, ctx: s4 } = this._processInputParams(e2);
    if (s4.common.async) return (async () => {
      let a6 = await this._def.in._parseAsync({ data: s4.data, path: s4.path, parent: s4 });
      return a6.status === "aborted" ? v6 : a6.status === "dirty" ? (t2.dirty(), te5(a6.value)) : this._def.out._parseAsync({ data: a6.value, path: s4.path, parent: s4 });
    })();
    {
      let n = this._def.in._parseSync({ data: s4.data, path: s4.path, parent: s4 });
      return n.status === "aborted" ? v6 : n.status === "dirty" ? (t2.dirty(), { status: "dirty", value: n.value }) : this._def.out._parseSync({ data: n.value, path: s4.path, parent: s4 });
    }
  }
  static create(e2, t2) {
    return new r33({ in: e2, out: t2, typeName: m5.ZodPipeline });
  }
};
var K6 = class extends y7 {
  static {
    __name(this, "K");
  }
  _parse(e2) {
    let t2 = this._def.innerType._parse(e2), s4 = /* @__PURE__ */ __name((n) => (P4(n) && (n.value = Object.freeze(n.value)), n), "s");
    return ue5(t2) ? t2.then((n) => s4(n)) : s4(t2);
  }
  unwrap() {
    return this._def.innerType;
  }
};
K6.create = (r34, e2) => new K6({ innerType: r34, typeName: m5.ZodReadonly, ..._9(e2) });
function Se2(r34, e2) {
  let t2 = typeof r34 == "function" ? r34(e2) : typeof r34 == "string" ? { message: r34 } : r34;
  return typeof t2 == "string" ? { message: t2 } : t2;
}
__name(Se2, "Se");
function $e3(r34, e2 = {}, t2) {
  return r34 ? M4.create().superRefine((s4, n) => {
    var a6, i2;
    let o6 = r34(s4);
    if (o6 instanceof Promise) return o6.then((l6) => {
      var c6, p3;
      if (!l6) {
        let k6 = Se2(e2, s4), he4 = (p3 = (c6 = k6.fatal) !== null && c6 !== void 0 ? c6 : t2) !== null && p3 !== void 0 ? p3 : true;
        n.addIssue({ code: "custom", ...k6, fatal: he4 });
      }
    });
    if (!o6) {
      let l6 = Se2(e2, s4), c6 = (i2 = (a6 = l6.fatal) !== null && a6 !== void 0 ? a6 : t2) !== null && i2 !== void 0 ? i2 : true;
      n.addIssue({ code: "custom", ...l6, fatal: c6 });
    }
  }) : M4.create();
}
__name($e3, "$e");
var ut2 = { object: w7.lazycreate };
var m5;
(function(r34) {
  r34.ZodString = "ZodString", r34.ZodNumber = "ZodNumber", r34.ZodNaN = "ZodNaN", r34.ZodBigInt = "ZodBigInt", r34.ZodBoolean = "ZodBoolean", r34.ZodDate = "ZodDate", r34.ZodSymbol = "ZodSymbol", r34.ZodUndefined = "ZodUndefined", r34.ZodNull = "ZodNull", r34.ZodAny = "ZodAny", r34.ZodUnknown = "ZodUnknown", r34.ZodNever = "ZodNever", r34.ZodVoid = "ZodVoid", r34.ZodArray = "ZodArray", r34.ZodObject = "ZodObject", r34.ZodUnion = "ZodUnion", r34.ZodDiscriminatedUnion = "ZodDiscriminatedUnion", r34.ZodIntersection = "ZodIntersection", r34.ZodTuple = "ZodTuple", r34.ZodRecord = "ZodRecord", r34.ZodMap = "ZodMap", r34.ZodSet = "ZodSet", r34.ZodFunction = "ZodFunction", r34.ZodLazy = "ZodLazy", r34.ZodLiteral = "ZodLiteral", r34.ZodEnum = "ZodEnum", r34.ZodEffects = "ZodEffects", r34.ZodNativeEnum = "ZodNativeEnum", r34.ZodOptional = "ZodOptional", r34.ZodNullable = "ZodNullable", r34.ZodDefault = "ZodDefault", r34.ZodCatch = "ZodCatch", r34.ZodPromise = "ZodPromise", r34.ZodBranded = "ZodBranded", r34.ZodPipeline = "ZodPipeline", r34.ZodReadonly = "ZodReadonly";
})(m5 || (m5 = {}));
var lt3 = /* @__PURE__ */ __name((r34, e2 = { message: `Input not instance of ${r34.name}` }) => $e3((t2) => t2 instanceof r34, e2), "lt");
var Me4 = $6.create;
var Ve3 = z7.create;
var ft3 = oe5.create;
var ht2 = D6.create;
var Pe4 = L6.create;
var pt3 = U5.create;
var mt3 = se5.create;
var vt3 = F5.create;
var _t3 = B7.create;
var yt3 = M4.create;
var gt3 = N7.create;
var xt3 = A6.create;
var kt3 = ne5.create;
var bt3 = I8.create;
var wt3 = w7.create;
var Tt2 = w7.strictCreate;
var Ct3 = W7.create;
var Ot2 = _e4.create;
var St2 = q7.create;
var At2 = E7.create;
var Et3 = ye5.create;
var Zt2 = ae5.create;
var jt2 = ie4.create;
var Rt2 = ge5.create;
var Nt2 = J6.create;
var It2 = Y5.create;
var $t2 = H5.create;
var Mt3 = G6.create;
var Vt2 = V5.create;
var Ae3 = C5.create;
var Pt3 = O7.create;
var zt2 = Z5.create;
var Dt2 = C5.createWithPreprocess;
var Lt3 = fe5.create;
var Ut3 = /* @__PURE__ */ __name(() => Me4().optional(), "Ut");
var Ft2 = /* @__PURE__ */ __name(() => Ve3().optional(), "Ft");
var Bt2 = /* @__PURE__ */ __name(() => Pe4().optional(), "Bt");
var Wt = { string: /* @__PURE__ */ __name((r34) => $6.create({ ...r34, coerce: true }), "string"), number: /* @__PURE__ */ __name((r34) => z7.create({ ...r34, coerce: true }), "number"), boolean: /* @__PURE__ */ __name((r34) => L6.create({ ...r34, coerce: true }), "boolean"), bigint: /* @__PURE__ */ __name((r34) => D6.create({ ...r34, coerce: true }), "bigint"), date: /* @__PURE__ */ __name((r34) => U5.create({ ...r34, coerce: true }), "date") };
var qt = v6;
var Jt = Object.freeze({ __proto__: null, defaultErrorMap: re4, setErrorMap: De3, getErrorMap: pe5, makeIssue: me5, EMPTY_PATH: Le3, addIssueToContext: u5, ParseStatus: x8, INVALID: v6, DIRTY: te5, OK: b6, isAborted: we3, isDirty: Te2, isValid: P4, isAsync: ue5, get util() {
  return g6;
}, get objectUtil() {
  return be2;
}, ZodParsedType: f5, getParsedType: R6, ZodType: y7, datetimeRegex: Ne3, ZodString: $6, ZodNumber: z7, ZodBigInt: D6, ZodBoolean: L6, ZodDate: U5, ZodSymbol: se5, ZodUndefined: F5, ZodNull: B7, ZodAny: M4, ZodUnknown: N7, ZodNever: A6, ZodVoid: ne5, ZodArray: I8, ZodObject: w7, ZodUnion: W7, ZodDiscriminatedUnion: _e4, ZodIntersection: q7, ZodTuple: E7, ZodRecord: ye5, ZodMap: ae5, ZodSet: ie4, ZodFunction: ge5, ZodLazy: J6, ZodLiteral: Y5, ZodEnum: H5, ZodNativeEnum: G6, ZodPromise: V5, ZodEffects: C5, ZodTransformer: C5, ZodOptional: O7, ZodNullable: Z5, ZodDefault: X5, ZodCatch: Q6, ZodNaN: oe5, BRAND: ct2, ZodBranded: le4, ZodPipeline: fe5, ZodReadonly: K6, custom: $e3, Schema: y7, ZodSchema: y7, late: ut2, get ZodFirstPartyTypeKind() {
  return m5;
}, coerce: Wt, any: yt3, array: bt3, bigint: ht2, boolean: Pe4, date: pt3, discriminatedUnion: Ot2, effect: Ae3, enum: $t2, function: Rt2, instanceof: lt3, intersection: St2, lazy: Nt2, literal: It2, map: Zt2, nan: ft3, nativeEnum: Mt3, never: xt3, null: _t3, nullable: zt2, number: Ve3, object: wt3, oboolean: Bt2, onumber: Ft2, optional: Pt3, ostring: Ut3, pipeline: Lt3, preprocess: Dt2, promise: Vt2, record: Et3, set: jt2, strictObject: Tt2, string: Me4, symbol: mt3, transformer: Ae3, tuple: At2, undefined: vt3, union: Ct3, unknown: gt3, void: kt3, NEVER: qt, ZodIssueCode: d6, quotelessJson: ze3, ZodError: T7 });

// deno:https://esm.sh/@jsr/orama__core@1.2.4/esnext/orama__core.mjs
function w8(o6) {
  let e2 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-$", t2 = "";
  for (let s4 = 0; s4 < o6; s4++) t2 += e2.charAt(Math.floor(Math.random() * e2.length));
  return t2;
}
__name(w8, "w");
function z8(o6) {
  if (o6 < 1e3) return `${o6}ms`;
  {
    let e2 = o6 / 1e3;
    return Number.isInteger(e2) ? `${e2}s` : `${e2.toFixed(1)}s`;
  }
}
__name(z8, "z");
var B8 = typeof localStorage < "u";
function F6() {
  return typeof window < "u" || typeof document < "u" ? false : !!(typeof A3 < "u" && A3.versions?.node || typeof Deno < "u" && typeof Deno.version < "u" || typeof Bun < "u" && typeof Bun.version < "u" || typeof globalThis < "u" && typeof globalThis.Response == "function" && typeof globalThis.fetch == "function" && typeof globalThis.navigator > "u" || typeof A3 < "u" && A3?.env.AWS_LAMBDA_FUNCTION_NAME);
}
__name(F6, "F");
function V6(o6) {
  let e2 = oe4(o6, "Tool");
  if (e2.$ref && e2.definitions) {
    let t2 = e2.$ref.replace("#/definitions/", ""), s4 = e2.definitions[t2];
    if (!s4) throw new Error(`Could not resolve definition: ${t2}`);
    return s4;
  }
  return e2;
}
__name(V6, "V");
var I9 = "___$orama_user_id$___";
var Q7 = "ssid";
var P5 = class extends TransformStream {
  static {
    __name(this, "P");
  }
  constructor() {
    let e2 = new TextDecoder("utf-8", { ignoreBOM: false }), t2, s4;
    super({ start() {
      t2 = "", s4 = { data: "" };
    }, transform(i2, r34) {
      let c6 = e2.decode(i2);
      t2 += c6;
      let l6;
      for (; (l6 = /\r\n|\n|\r/.exec(t2)) !== null; ) {
        let a6 = t2.substring(0, l6.index);
        if (t2 = t2.substring(l6.index + l6[0].length), a6.length === 0) r34.enqueue(s4), s4 = { data: "" };
        else if (!a6.startsWith(":")) {
          let d7 = /:/.exec(a6);
          if (!d7) {
            s4[a6] = "";
            continue;
          }
          let u6 = a6.substring(0, d7.index), p3 = a6.substring(d7.index + 1);
          s4[u6] = p3?.replace(/^\u0020/, "");
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
  constructor(e2) {
    this.config = e2;
  }
  async getRef(e2, t2) {
    let s4, i2;
    switch (this.config.type) {
      case "apiKey": {
        if (s4 = this.config.apiKey, e2 == "writer" && !this.config.writerURL) throw new Error("Cannot perform a request to a writer without the writerURL. Use `cluster.writerURL` to configure it");
        if (e2 == "reader" && !this.config.readerURL) throw new Error("Cannot perform a request to a writer without the writerURL. Use `cluster.readerURL` to configure it");
        i2 = e2 == "writer" ? this.config.writerURL : this.config.readerURL;
        break;
      }
      case "jwt": {
        let r34 = await te6(this.config.authJwtURL, this.config.collectionID, this.config.privateApiKey, "write", t2);
        e2 == "reader" ? (i2 = this.config.readerURL ?? r34.readerURL, s4 = r34.readerApiKey) : (s4 = r34.jwt, i2 = this.config.writerURL ?? r34.writerURL);
        break;
      }
    }
    return { bearer: s4, baseURL: i2 };
  }
};
var g7 = class {
  static {
    __name(this, "g");
  }
  config;
  constructor(e2) {
    this.config = e2;
  }
  async request(e2) {
    let t2 = await this.getResponse(e2);
    if (!t2.ok) {
      let s4;
      try {
        s4 = await t2.text();
      } catch (i2) {
        s4 = `Unable to got response body ${i2}`;
      }
      throw new Error(`Request to "${e2.path}?${new URLSearchParams(e2.params ?? {}).toString()}" failed with status ${t2.status}: ${s4}`);
    }
    return t2.json();
  }
  async requestStream(e2) {
    let t2 = await this.getResponse(e2);
    if (t2.body === null) throw new Error(`Response body is null for "${e2.path}"`);
    return t2.body?.pipeThrough(new P5());
  }
  async eventSource(e2) {
    if (e2.apiKeyPosition !== "query-params") throw new Error(`EventSource only supports apiKeyPosition as 'query-params', but got ${e2.apiKeyPosition}`);
    if (e2.method !== "GET") throw new Error(`EventSource only supports GET requests, but got ${e2.method}`);
    let { baseURL: t2, bearer: s4 } = await this.config.auth.getRef(e2.target, e2.init), i2 = new URL(e2.path, t2);
    return e2.params = e2.params ?? {}, e2.params["api-key"] = s4, e2.params && (i2.search = new URLSearchParams(e2.params).toString()), new EventSource(i2);
  }
  async getResponse({ method: e2, path: t2, body: s4, params: i2, apiKeyPosition: r34, init: c6, target: l6 }) {
    let { baseURL: a6, bearer: d7 } = await this.config.auth.getRef(l6, c6), u6 = new URL(t2, a6), p3 = new Headers();
    p3.append("Content-Type", "application/json"), r34 === "header" && p3.append("Authorization", `Bearer ${d7}`), r34 === "query-params" && (i2 = i2 ?? {}, i2["api-key"] = d7);
    let n = { method: e2, headers: p3, ...c6 };
    s4 && e2 === "POST" && (n.body = JSON.stringify(s4)), i2 && (u6.search = new URLSearchParams(i2).toString());
    let h6 = await fetch(u6, n);
    if (h6.status === 401) throw new Error("Unauthorized: are you using the correct Api Key?");
    if (h6.status === 400) {
      let f6 = await h6.text();
      throw new Error(`Bad Request: ${f6} (path: ${u6.toString()})`);
    }
    return h6;
  }
};
async function te6(o6, e2, t2, s4, i2) {
  let c6 = await fetch(o6, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ collectionId: e2, privateApiKey: t2, scope: s4 }), ...i2 });
  if (!c6.ok) throw new Error(`JWT request to ${c6.url} failed with status ${c6.status}: ${await c6.text()}`);
  return c6.json();
}
__name(te6, "te");
function Y6(o6, e2 = true) {
  try {
    return JSON.parse(o6);
  } catch (t2) {
    return e2 || console.warn("Recovered from failed JSON parsing with error:", t2), o6;
  }
}
__name(Y6, "Y");
var S9 = class {
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
  constructor(e2) {
    this.collectionID = e2.collectionID, this.oramaInterface = e2.common, this.LLMConfig = e2.LLMConfig, this.messages = e2.initialMessages || [], this.events = e2.events, this.sessionID = e2.sessionID || Q2();
  }
  async answer(e2, t2) {
    let s4 = this.answerStream(e2, t2), i2 = "";
    for await (let r34 of s4) i2 = r34;
    return i2;
  }
  async *answerStream(e2, t2) {
    this.lastInteractionParams = { ...e2 }, e2 = this._enrichConfig(e2), this.abortController = new AbortController();
    let s4 = t2 ?? {};
    s4.signal = this.abortController.signal, this.messages.push({ role: "user", content: e2.query }), this.messages.push({ role: "assistant", content: "" });
    let i2 = e2.interactionID || Q2();
    this.state.push({ id: i2, query: e2.query, optimizedQuery: null, response: "", sources: null, loading: true, error: false, aborted: false, errorMessage: null, related: e2.related?.enabled ? "" : null, currentStep: "starting", currentStepVerbose: null, selectedLLM: null, advancedAutoquery: null }), this._pushState();
    let r34 = this.state.length - 1, c6 = this.messages.length - 1;
    try {
      let l6 = { interaction_id: i2, query: e2.query, visitor_id: e2.visitorID, conversation_id: e2.sessionID, messages: this.messages.slice(0, -1), llm_config: null, related: e2.related, min_similarity: e2.min_similarity, max_documents: e2.max_documents, ragat_notation: e2.ragat_notation };
      this.LLMConfig && (l6.llm_config = this.LLMConfig);
      let a6 = await this.oramaInterface.getResponse({ method: "POST", path: `/v1/collections/${this.collectionID}/generate/answer`, body: l6, init: s4, apiKeyPosition: "query-params", target: "reader" });
      if (!a6.body) throw new Error("No response body");
      let d7 = x3(a6.body), u6 = false, p3 = "";
      for (d7.on("answer_token", (n) => {
        this.state[r34].response += n.token, this.messages[c6].content = this.state[r34].response, this._pushState();
      }), d7.on("selected_llm", (n) => {
        this.state[r34].selectedLLM = { provider: n.provider, model: n.model }, this._pushState();
      }), d7.on("optimizing_query", (n) => {
        this.state[r34].optimizedQuery = Y6(n.optimized_query), this._pushState();
      }), d7.on("search_results", (n) => {
        this.state[r34].sources = n.results, this._pushState();
      }), d7.on("related_queries", (n) => {
        this.state[r34].related = n.queries, this._pushState();
      }), d7.onStateChange((n) => {
        this.state[r34].currentStep = n.state, this._pushState();
      }), d7.on("state_changed", (n) => {
        this.events?.onIncomingEvent?.(n);
        let h6 = n.data;
        if (n.state === "advanced_autoquery_query_optimized" && h6?.optimized_queries) {
          this.state[r34].advancedAutoquery || (this.state[r34].advancedAutoquery = {}), this.state[r34].advancedAutoquery.optimizedQueries = h6.optimized_queries;
          let f6 = this.state[r34].advancedAutoquery.optimizedQueries?.join(`
Also, `);
          y8(f6) && (this.state[r34].currentStepVerbose = f6, this._pushState());
        }
        if (n.state === "advanced_autoquery_properties_selected" && h6?.selected_properties) {
          this.state[r34].advancedAutoquery || (this.state[r34].advancedAutoquery = {}), this.state[r34].advancedAutoquery.selectedProperties = h6.selected_properties;
          let _10 = `Filtering by ${this.state[r34].advancedAutoquery.selectedProperties?.map(Object.values).flat().map((D7) => D7.selected_properties).flat().map((D7) => `${D7.property}`).join(", ")}`;
          y8(_10) && (this.state[r34].currentStepVerbose = _10, this._pushState());
        }
        if (n.state === "advanced_autoquery_combine_queries" && h6?.queries_and_properties && (this.state[r34].advancedAutoquery || (this.state[r34].advancedAutoquery = {}), this.state[r34].advancedAutoquery.queriesAndProperties = h6.queries_and_properties, this._pushState()), n.state === "advanced_autoquery_tracked_queries_generated" && h6?.tracked_queries && (this.state[r34].advancedAutoquery || (this.state[r34].advancedAutoquery = {}), this.state[r34].advancedAutoquery.trackedQueries = h6.tracked_queries, this._pushState()), n.state === "advanced_autoquery_search_results" && h6?.search_results) {
          this.state[r34].advancedAutoquery || (this.state[r34].advancedAutoquery = {}), this.state[r34].advancedAutoquery.searchResults = h6.search_results;
          let f6 = h6.search_results.reduce((E8, X6) => E8 + X6.results[0].count, 0), _10 = h6.search_results.map((E8) => JSON.parse(E8.generated_query).term).join(", "), x9 = `Found ${f6} result${f6 === 1 ? "" : "s"} for "${_10}"`;
          y8(x9) && (this.state[r34].currentStepVerbose = x9, this._pushState());
        }
        n.state === "advanced_autoquery_completed" && h6?.results && (this.state[r34].advancedAutoquery || (this.state[r34].advancedAutoquery = {}), this.state[r34].advancedAutoquery.results = h6.results, this.state[r34].currentStepVerbose = null, this._pushState()), n.state === "completed" && (u6 = true, this.state[r34].loading = false, this._pushState()), this.events?.onEnd && this.events.onEnd(this.state);
      }); !u6; ) {
        let n = this.state[r34].response;
        n !== p3 ? (p3 = n, yield n) : u6 || await new Promise((h6) => setTimeout(h6, 0));
      }
    } catch (l6) {
      if (l6 instanceof Error && l6.name === "AbortError") {
        this.state[r34].loading = false, this.state[r34].aborted = true, this._pushState();
        return;
      }
      throw this.state[r34].loading = false, this.state[r34].error = true, this.state[r34].errorMessage = l6 instanceof Error ? l6.message : "Unknown error", this._pushState(), l6;
    }
  }
  regenerateLast({ stream: e2 = true } = {}, t2) {
    if (this.state.length === 0 || this.messages.length === 0) throw new Error("No messages to regenerate");
    if (!(this.messages.at(-1)?.role === "assistant")) throw new Error("Last message is not an assistant message");
    if (this.messages.pop(), this.state.pop(), !this.lastInteractionParams) throw new Error("No last interaction parameters available");
    return e2 ? this.answerStream(this.lastInteractionParams, t2) : this.answer(this.lastInteractionParams, t2);
  }
  abort() {
    if (!this.abortController) throw new Error("AbortController is not available.");
    if (this.state.length === 0) throw new Error("There is no active request to abort.");
    this.abortController.abort(), this.abortController = void 0;
    let e2 = this.state[this.state.length - 1];
    e2.aborted = true, e2.loading = false, this._pushState();
  }
  clearSession() {
    this.messages = [], this.state = [], this._pushState();
  }
  _pushState() {
    this.events?.onStateChange?.(this.state);
  }
  _enrichConfig(e2) {
    return e2.visitorID || (e2.visitorID = re5()), e2.interactionID || (e2.interactionID = Q2()), e2.sessionID || (e2.sessionID = this.sessionID), e2;
  }
};
function re5() {
  if (F6()) return Q7;
  if (B8) {
    let o6 = localStorage.getItem(I9);
    if (o6) return o6;
  }
  return Q2();
}
__name(re5, "re");
var W8 = class {
  static {
    __name(this, "W");
  }
  collection;
  constructor(e2) {
    let t2 = new g7({ auth: new m6({ type: "apiKey", apiKey: e2.masterAPIKey, writerURL: e2.url, readerURL: void 0 }) });
    this.collection = new T8(t2);
  }
};
var T8 = class {
  static {
    __name(this, "T");
  }
  client;
  constructor(e2) {
    this.client = e2;
  }
  async create(e2, t2) {
    let s4 = { id: e2.id, description: e2.description, write_api_key: e2.writeAPIKey ?? w8(32), read_api_key: e2.readAPIKey ?? w8(32) };
    return e2.embeddingsModel && (s4.embeddings_model = e2.embeddingsModel), await this.client.request({ path: "/v1/collections/create", body: s4, method: "POST", init: t2, apiKeyPosition: "header", target: "writer" }), { id: s4.id, description: s4.description, writeAPIKey: s4.write_api_key, readonlyAPIKey: s4.read_api_key };
  }
  list(e2) {
    return this.client.request({ path: "/v1/collections", method: "GET", init: e2, apiKeyPosition: "header", target: "writer" });
  }
  get(e2, t2) {
    return this.client.request({ path: `/v1/collections/${e2}`, method: "GET", init: t2, apiKeyPosition: "header", target: "writer" });
  }
  delete(e2, t2) {
    return this.client.request({ path: "/v1/collections/delete", method: "POST", body: { collection_id_to_delete: e2 }, init: t2, apiKeyPosition: "header", target: "writer" });
  }
};
function Z6(o6, e2) {
  if (typeof navigator < "u") {
    typeof navigator.sendBeacon < "u" && navigator.sendBeacon(o6, e2);
    return;
  }
  fetch(o6, { method: "POST", body: e2, headers: { "Content-Type": "application/json" } }).then(() => {
  }, (t2) => console.log(t2));
}
__name(Z6, "Z");
var b7 = class {
  static {
    __name(this, "b");
  }
  endpoint;
  apiKey;
  userId;
  identity;
  userAlias;
  params;
  constructor({ endpoint: e2, apiKey: t2 }) {
    if (!e2 || !t2) throw new Error("Endpoint and API Key are required to create a Profile");
    if (typeof e2 != "string" || typeof t2 != "string") throw new Error("Endpoint and API Key must be strings");
    if (typeof localStorage < "u") {
      let s4 = localStorage.getItem(I9);
      s4 ? this.userId = s4 : (this.userId = Q2(), localStorage.setItem(I9, this.userId));
    } else this.userId = Q2();
    this.endpoint = e2, this.apiKey = t2;
  }
  setParams(e2) {
    let { protocol: t2, host: s4 } = new URL(e2.identifyUrl), i2 = `${t2}//${s4}/identify`;
    this.params = { identifyUrl: i2, index: e2.index };
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
  async sendProfileData(e2) {
    if (!this.params) throw new Error("Orama Profile is not initialized");
    let t2 = JSON.stringify({ ...e2, visitorId: this.getUserId(), index: this.params.index });
    await Z6(`${this.params?.identifyUrl}?api-key=${this.apiKey}`, t2);
  }
  async identify(e2) {
    if (typeof e2 != "string") throw new Error("Identity must be a string");
    await this.sendProfileData({ entity: "identity", id: e2 }), this.identity = e2;
  }
  async alias(e2) {
    if (typeof e2 != "string") throw new Error("Identity must be a string");
    await this.sendProfileData({ entity: "alias", id: e2 }), this.userAlias = e2;
  }
  reset() {
    this.userId = Q2(), this.identity = void 0, this.userAlias = void 0;
  }
};
var A7 = "https://collections.orama.com";
var ne6 = "https://app.orama.com/api/user/jwt";
var q8 = class {
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
  constructor(e2) {
    let t2;
    e2.apiKey.startsWith("p_") ? t2 = new m6({ type: "jwt", authJwtURL: e2.authJwtURL ?? ne6, collectionID: e2.collectionID, privateApiKey: e2.apiKey, readerURL: e2.cluster?.readURL ?? A7, writerURL: e2.cluster?.writerURL }) : (t2 = new m6({ type: "apiKey", readerURL: e2.cluster?.readURL ?? A7, writerURL: e2.cluster?.writerURL, apiKey: e2.apiKey }), this.profile = new b7({ endpoint: e2.cluster?.readURL ?? A7, apiKey: e2.apiKey }));
    let s4 = { auth: t2 };
    this.collectionID = e2.collectionID, this.client = new g7(s4), this.apiKey = e2.apiKey, this.ai = new L7(this.client, this.collectionID, this.profile), this.collections = new $7(this.client, this.collectionID), this.index = new K7(this.client, this.collectionID), this.hooks = new U6(this.client, this.collectionID), this.logs = new O8(this.client, this.collectionID), this.systemPrompts = new k5(this.client, this.collectionID), this.tools = new C6(this.client, this.collectionID), this.identity = new M5(this.profile), this.trainingSets = new J7(this.client, this.collectionID);
  }
  async search(e2, t2) {
    let s4 = Date.now(), { datasourceIDs: i2, indexes: r34, ...c6 } = e2, l6 = await this.client.request({ path: `/v1/collections/${this.collectionID}/search`, body: { userID: this.profile?.getUserId() || void 0, ...c6, indexes: i2 || r34 }, method: "POST", params: void 0, init: t2, apiKeyPosition: "query-params", target: "reader" }), a6 = Date.now() - s4;
    return { ...l6, elapsed: { raw: a6, formatted: z8(a6) } };
  }
};
var L7 = class {
  static {
    __name(this, "L");
  }
  client;
  collectionID;
  profile;
  constructor(e2, t2, s4) {
    this.client = e2, this.collectionID = t2, this.profile = s4;
  }
  NLPSearch(e2, t2) {
    return this.client.request({ method: "POST", path: `/v1/collections/${this.collectionID}/nlp_search`, body: { userID: this.profile?.getUserId() || void 0, ...e2 }, init: t2, apiKeyPosition: "query-params", target: "reader" });
  }
  async *NLPSearchStream(e2, t2) {
    let s4 = { llm_config: e2.LLMConfig ? { ...e2.LLMConfig } : void 0, userID: this.profile?.getUserId() || void 0, messages: [{ role: "user", content: e2.query }] }, i2 = await this.client.getResponse({ method: "POST", path: `/v1/collections/${this.collectionID}/generate/nlp_query`, body: s4, init: t2, apiKeyPosition: "query-params", target: "reader" });
    if (!i2.body) throw new Error("No response body");
    let r34 = false, c6 = null, l6 = S2(i2.body);
    for (l6.on("error", (a6) => {
      throw a6.is_terminal && (r34 = true), new Error(a6.error);
    }), l6.on("state_changed", (a6) => {
      c6 = { status: a6.state, data: a6.data || [] };
    }), l6.on("search_results", (a6) => {
      c6 = { status: "SEARCH_RESULTS", data: a6.results }, r34 = true;
    }); !r34; ) c6 !== null && y8(c6.status) && (yield c6), await new Promise((a6) => setTimeout(a6, 10));
    c6 !== null && y8(c6.status) && (yield c6);
  }
  createAISession(e2) {
    return new S9({ collectionID: this.collectionID, common: this.client, ...e2 });
  }
};
var $7 = class {
  static {
    __name(this, "$");
  }
  client;
  collectionID;
  constructor(e2, t2) {
    this.client = e2, this.collectionID = t2;
  }
  getStats(e2, t2) {
    return this.client.request({ path: `/v1/collections/${e2}/stats`, method: "GET", init: t2, apiKeyPosition: "query-params", target: "reader" });
  }
  getAllDocs(e2, t2) {
    return this.client.request({ path: "/v1/collections/list", method: "POST", body: { id: e2 }, init: t2, apiKeyPosition: "header", target: "writer" });
  }
};
var K7 = class {
  static {
    __name(this, "K");
  }
  client;
  collectionID;
  constructor(e2, t2) {
    this.client = e2, this.collectionID = t2;
  }
  async create(e2, t2) {
    let s4 = { id: e2.id, embedding: e2.embeddings };
    await this.client.request({ path: `/v1/collections/${this.collectionID}/indexes/create`, body: s4, method: "POST", init: t2, apiKeyPosition: "header", target: "writer" });
  }
  async delete(e2, t2) {
    await this.client.request({ path: `/v1/collections/${this.collectionID}/indexes/delete`, body: { index_id_to_delete: e2 }, method: "POST", init: t2, apiKeyPosition: "header", target: "writer" });
  }
  set(e2) {
    return new j7(this.client, this.collectionID, e2);
  }
};
var U6 = class {
  static {
    __name(this, "U");
  }
  client;
  collectionID;
  constructor(e2, t2) {
    this.client = e2, this.collectionID = t2;
  }
  async insert(e2, t2) {
    let s4 = { name: e2.name, code: e2.code };
    return await this.client.request({ path: `/v1/collections/${this.collectionID}/hooks/set`, body: s4, method: "POST", init: t2, apiKeyPosition: "header", target: "writer" }), { hookID: s4.name, code: s4.code };
  }
  async list(e2) {
    return (await this.client.request({ path: `/v1/collections/${this.collectionID}/hooks/list`, method: "GET", init: e2, apiKeyPosition: "header", target: "writer" })).hooks || {};
  }
  async delete(e2, t2) {
    let s4 = { name_to_delete: e2 };
    await this.client.request({ path: `/v1/collections/${this.collectionID}/hooks/delete`, body: s4, method: "POST", init: t2, apiKeyPosition: "header", target: "writer" });
  }
};
var O8 = class {
  static {
    __name(this, "O");
  }
  client;
  collectionID;
  constructor(e2, t2) {
    this.client = e2, this.collectionID = t2;
  }
  stream(e2) {
    return this.client.eventSource({ path: `/v1/collections/${this.collectionID}/logs`, method: "GET", init: e2, apiKeyPosition: "query-params", target: "reader" });
  }
};
var k5 = class {
  static {
    __name(this, "k");
  }
  client;
  collectionID;
  constructor(e2, t2) {
    this.client = e2, this.collectionID = t2;
  }
  insert(e2, t2) {
    return this.client.request({ path: `/v1/collections/${this.collectionID}/system_prompts/insert`, body: e2, method: "POST", init: t2, apiKeyPosition: "header", target: "writer" });
  }
  get(e2, t2) {
    return this.client.request({ path: `/v1/collections/${this.collectionID}/system_prompts/get`, params: { system_prompt_id: e2 }, method: "GET", init: t2, apiKeyPosition: "query-params", target: "reader" });
  }
  getAll(e2) {
    return this.client.request({ path: `/v1/collections/${this.collectionID}/system_prompts/all`, method: "GET", init: e2, apiKeyPosition: "query-params", target: "reader" });
  }
  delete(e2, t2) {
    return this.client.request({ path: `/v1/collections/${this.collectionID}/system_prompts/delete`, body: { id: e2 }, method: "POST", init: t2, apiKeyPosition: "header", target: "writer" });
  }
  update(e2, t2) {
    return this.client.request({ path: `/v1/collections/${this.collectionID}/system_prompts/update`, body: e2, method: "POST", init: t2, apiKeyPosition: "header", target: "writer" });
  }
  validate(e2, t2) {
    return this.client.request({ path: `/v1/collections/${this.collectionID}/system_prompts/validate`, body: e2, method: "POST", init: t2, apiKeyPosition: "header", target: "writer" });
  }
};
var C6 = class {
  static {
    __name(this, "C");
  }
  client;
  collectionID;
  constructor(e2, t2) {
    this.client = e2, this.collectionID = t2;
  }
  insert(e2, t2) {
    let s4;
    switch (true) {
      case typeof e2.parameters == "string": {
        s4 = e2.parameters;
        break;
      }
      case e2.parameters instanceof y7: {
        let i2 = V6(e2.parameters);
        s4 = JSON.stringify(i2);
        break;
      }
      case typeof e2.parameters == "object": {
        s4 = JSON.stringify(e2.parameters);
        break;
      }
      default:
        throw new Error("Invalid parameters type. Must be string, object or ZodType");
    }
    return this.client.request({ path: `/v1/collections/${this.collectionID}/tools/insert`, body: { ...e2, parameters: s4 }, method: "POST", init: t2, apiKeyPosition: "header", target: "writer" });
  }
  get(e2, t2) {
    return this.client.request({ path: `/v1/collections/${this.collectionID}/tools/get`, params: { tool_id: e2 }, method: "GET", init: t2, apiKeyPosition: "query-params", target: "reader" });
  }
  getAll(e2) {
    return this.client.request({ path: `/v1/collections/${this.collectionID}/tools/all`, method: "GET", init: e2, apiKeyPosition: "query-params", target: "reader" });
  }
  delete(e2, t2) {
    return this.client.request({ path: `/v1/collections/${this.collectionID}/tools/delete`, body: { id: e2 }, method: "POST", init: t2, apiKeyPosition: "header", target: "writer" });
  }
  update(e2, t2) {
    return this.client.request({ path: `/v1/collections/${this.collectionID}/tools/update`, body: e2, method: "POST", init: t2, apiKeyPosition: "header", target: "writer" });
  }
  async execute(e2, t2) {
    let s4 = await this.client.request({ path: `/v1/collections/${this.collectionID}/tools/run`, body: e2, method: "POST", init: t2, apiKeyPosition: "query-params", target: "reader" });
    return s4.results ? { results: s4.results.map((i2) => "functionResult" in i2 ? { functionResult: { tool_id: i2.functionResult.tool_id, result: JSON.parse(i2.functionResult.result) } } : "functionParameters" in i2 ? { functionParameters: { tool_id: i2.functionParameters.tool_id, result: JSON.parse(i2.functionParameters.result) } } : i2) } : { results: null };
  }
};
var M5 = class {
  static {
    __name(this, "M");
  }
  profile;
  constructor(e2) {
    this.profile = e2;
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
  async identify(e2) {
    if (!this.profile) throw new Error("Profile is not defined");
    await this.profile.identify(e2);
  }
  async alias(e2) {
    if (!this.profile) throw new Error("Profile is not defined");
    await this.profile.alias(e2);
  }
  reset() {
    if (!this.profile) throw new Error("Profile is not defined");
    this.profile.reset();
  }
};
var J7 = class {
  static {
    __name(this, "J");
  }
  client;
  collectionID;
  constructor(e2, t2) {
    this.client = e2, this.collectionID = t2;
  }
  async get(e2, t2) {
    let s4 = await this.client.request({ path: `/v1/collections/${this.collectionID}/training_sets/${e2}/get`, method: "GET", init: t2, apiKeyPosition: "query-params", target: "reader" });
    return { training_sets: s4.training_sets && JSON.parse(s4.training_sets) };
  }
  generate(e2, t2, s4) {
    return this.client.request({ path: `/v1/collections/${this.collectionID}/training_sets/${e2}/generate`, method: "POST", body: { llm_config: t2 ? { ...t2 } : void 0 }, init: s4, apiKeyPosition: "query-params", target: "reader" });
  }
  insert(e2, t2, s4) {
    return this.client.request({ path: `/v1/collections/${this.collectionID}/training_sets/${e2}/insert`, method: "POST", body: { training_set: t2 }, init: s4, apiKeyPosition: "header", target: "writer" });
  }
  delete(e2, t2) {
    return this.client.request({ path: `/v1/collections/${this.collectionID}/training_sets/${e2}/delete`, method: "POST", init: t2, apiKeyPosition: "header", target: "writer" });
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
  constructor(e2, t2, s4) {
    this.indexID = s4, this.collectionID = t2, this.oramaInterface = e2, this.transaction = new G7(e2, t2, s4);
  }
  async reindex(e2) {
    await this.oramaInterface.request({ path: `/v1/collections/${this.collectionID}/indexes/${this.indexID}/reindex`, method: "POST", init: e2, apiKeyPosition: "header", target: "writer" });
  }
  async insertDocuments(e2, t2) {
    await this.oramaInterface.request({ path: `/v1/collections/${this.collectionID}/indexes/${this.indexID}/insert`, body: Array.isArray(e2) ? e2 : [e2], method: "POST", init: t2, apiKeyPosition: "header", target: "writer" });
  }
  async deleteDocuments(e2, t2) {
    await this.oramaInterface.request({ path: `/v1/collections/${this.collectionID}/indexes/${this.indexID}/delete`, body: Array.isArray(e2) ? e2 : [e2], method: "POST", init: t2, apiKeyPosition: "header", target: "writer" });
  }
  async upsertDocuments(e2, t2) {
    await this.oramaInterface.request({ path: `/v1/collections/${this.collectionID}/indexes/${this.indexID}/upsert`, body: e2, method: "POST", init: t2, apiKeyPosition: "header", target: "writer" });
  }
};
var G7 = class {
  static {
    __name(this, "G");
  }
  indexID;
  collectionID;
  tempIndexID;
  oramaInterface;
  constructor(e2, t2, s4, i2 = w8(16)) {
    this.oramaInterface = e2, this.collectionID = t2, this.indexID = s4, this.tempIndexID = i2;
  }
  open(e2) {
    return this.oramaInterface.request({ path: `/v1/collections/${this.collectionID}/indexes/${this.indexID}/create-temporary-index`, method: "POST", body: { id: this.tempIndexID }, init: e2, apiKeyPosition: "header", target: "writer" });
  }
  insertDocuments(e2, t2) {
    return this.oramaInterface.request({ path: `/v1/collections/${this.collectionID}/indexes/${this.tempIndexID}/insert`, body: Array.isArray(e2) ? e2 : [e2], method: "POST", init: t2, apiKeyPosition: "header", target: "writer" });
  }
  commit(e2) {
    return this.oramaInterface.request({ path: `/v1/collections/${this.collectionID}/replace-index`, method: "POST", body: { target_index_id: this.indexID, temp_index_id: this.tempIndexID }, init: e2, apiKeyPosition: "header", target: "writer" });
  }
  rollback(e2) {
    return this.oramaInterface.request({ path: `/v1/collections/${this.collectionID}/indexes/${this.tempIndexID}/delete`, method: "POST", init: e2, apiKeyPosition: "header", target: "writer" });
  }
};
var H6 = class {
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
  constructor(e2) {
    this.client = new q8({ ...e2, collectionID: e2.projectId }), this.identity = this.client.identity, this.ai = this.client.ai, this.collections = this.client.collections, this.index = this.client.index, this.hooks = this.client.hooks, this.logs = this.client.logs, this.systemPrompts = this.client.systemPrompts, this.tools = this.client.tools;
  }
  search(e2) {
    let { datasources: t2, ...s4 } = e2;
    return this.client.search({ ...s4, indexes: t2 });
  }
  dataSource(e2) {
    let t2 = this.client.index.set(e2);
    return new N8(t2);
  }
};
var N8 = class {
  static {
    __name(this, "N");
  }
  index;
  constructor(e2) {
    this.index = e2;
  }
  reindex() {
    return this.index.reindex();
  }
  insertDocuments(e2) {
    return this.index.insertDocuments(e2);
  }
  deleteDocuments(e2) {
    return this.index.deleteDocuments(e2);
  }
  upsertDocuments(e2) {
    return this.index.upsertDocuments(e2);
  }
};
var y8 = /* @__PURE__ */ (() => {
  let o6 = /* @__PURE__ */ new Set();
  return function(e2) {
    return !e2 || o6.has(e2) ? "" : (o6.add(e2), e2);
  };
})();
export {
  S9 as AnswerSession,
  q8 as CollectionManager,
  j7 as Index,
  H6 as OramaCloud,
  W8 as OramaCoreManager,
  G7 as Transaction,
  w3 as answerSessionSteps,
  w8 as createRandomString,
  y8 as dedupe
};
/*! Bundled license information:

@noble/hashes/esm/utils.js:
  (*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) *)
*/
