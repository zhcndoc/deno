import {
  __export,
  __name
} from "./chunk-JKJYCBCI.js";

// deno:https://esm.sh/@noble/hashes@^1.1.5/sha3?target=esnext
var sha3_target_esnext_exports = {};
__export(sha3_target_esnext_exports, {
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

// deno:https://esm.sh/@noble/hashes@1.8.0/esnext/crypto.mjs
var o = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;

// deno:https://esm.sh/@noble/hashes@1.8.0/esnext/utils.mjs
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
  let e = /* @__PURE__ */ __name((r32) => t().update(p(r32)).digest(), "e"), n2 = t();
  return e.outputLen = n2.outputLen, e.blockLen = n2.blockLen, e.create = () => t(), e;
}
__name(B, "B");
function O(t) {
  let e = /* @__PURE__ */ __name((r32, o6) => t(o6).update(p(r32)).digest(), "e"), n2 = t({});
  return e.outputLen = n2.outputLen, e.blockLen = n2.blockLen, e.create = (r32) => t(r32), e;
}
__name(O, "O");

// deno:https://esm.sh/@noble/hashes@1.8.0/esnext/sha3.mjs
var d2 = BigInt(4294967295);
var k = BigInt(32);
function M(n2, t = false) {
  return t ? { h: Number(n2 & d2), l: Number(n2 >> k & d2) } : { h: Number(n2 >> k & d2) | 0, l: Number(n2 & d2) | 0 };
}
__name(M, "M");
function _2(n2, t = false) {
  let s3 = n2.length, o6 = new Uint32Array(s3), r32 = new Uint32Array(s3);
  for (let i2 = 0; i2 < s3; i2++) {
    let { h: e, l: c4 } = M(n2[i2], t);
    [o6[i2], r32[i2]] = [e, c4];
  }
  return [o6, r32];
}
__name(_2, "_");
var I2 = /* @__PURE__ */ __name((n2, t, s3) => n2 << s3 | t >>> 32 - s3, "I");
var B2 = /* @__PURE__ */ __name((n2, t, s3) => t << s3 | n2 >>> 32 - s3, "B");
var L2 = /* @__PURE__ */ __name((n2, t, s3) => t << s3 - 32 | n2 >>> 64 - s3, "L");
var g2 = /* @__PURE__ */ __name((n2, t, s3) => n2 << s3 - 32 | t >>> 64 - s3, "g");
var C = BigInt(0);
var l = BigInt(1);
var D = BigInt(2);
var G = BigInt(7);
var J = BigInt(256);
var K = BigInt(113);
var m2 = [];
var T = [];
var F = [];
for (let n2 = 0, t = l, s3 = 1, o6 = 0; n2 < 24; n2++) {
  [s3, o6] = [o6, (2 * s3 + 3 * o6) % 5], m2.push(2 * (5 * o6 + s3)), T.push((n2 + 1) * (n2 + 2) / 2 % 64);
  let r32 = C;
  for (let i2 = 0; i2 < 7; i2++) t = (t << l ^ (t >> G) * K) % J, t & D && (r32 ^= l << (l << BigInt(i2)) - l);
  F.push(r32);
}
var U = _2(F, true);
var Q = U[0];
var V = U[1];
var A = /* @__PURE__ */ __name((n2, t, s3) => s3 > 32 ? L2(n2, t, s3) : I2(n2, t, s3), "A");
var b = /* @__PURE__ */ __name((n2, t, s3) => s3 > 32 ? g2(n2, t, s3) : B2(n2, t, s3), "b");
function W2(n2, t = 24) {
  let s3 = new Uint32Array(10);
  for (let o6 = 24 - t; o6 < 24; o6++) {
    for (let e = 0; e < 10; e++) s3[e] = n2[e] ^ n2[e + 10] ^ n2[e + 20] ^ n2[e + 30] ^ n2[e + 40];
    for (let e = 0; e < 10; e += 2) {
      let c4 = (e + 8) % 10, f4 = (e + 2) % 10, u6 = s3[f4], a3 = s3[f4 + 1], E8 = A(u6, a3, 1) ^ s3[c4], N7 = b(u6, a3, 1) ^ s3[c4 + 1];
      for (let p3 = 0; p3 < 50; p3 += 10) n2[e + p3] ^= E8, n2[e + p3 + 1] ^= N7;
    }
    let r32 = n2[2], i2 = n2[3];
    for (let e = 0; e < 24; e++) {
      let c4 = T[e], f4 = A(r32, i2, c4), u6 = b(r32, i2, c4), a3 = m2[e];
      r32 = n2[a3], i2 = n2[a3 + 1], n2[a3] = f4, n2[a3 + 1] = u6;
    }
    for (let e = 0; e < 50; e += 10) {
      for (let c4 = 0; c4 < 10; c4++) s3[c4] = n2[e + c4];
      for (let c4 = 0; c4 < 10; c4++) n2[e + c4] ^= ~s3[(c4 + 2) % 10] & s3[(c4 + 4) % 10];
    }
    n2[0] ^= Q[o6], n2[1] ^= V[o6];
  }
  j(s3);
}
__name(W2, "W");
var x2 = class n extends y {
  static {
    __name(this, "n");
  }
  constructor(t, s3, o6, r32 = false, i2 = 24) {
    if (super(), this.pos = 0, this.posOut = 0, this.finished = false, this.destroyed = false, this.enableXOF = false, this.blockLen = t, this.suffix = s3, this.outputLen = o6, this.enableXOF = r32, this.rounds = i2, x(o6), !(0 < t && t < 200)) throw new Error("only keccak-f1600 function is supported");
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
    let { blockLen: s3, state: o6 } = this, r32 = t.length;
    for (let i2 = 0; i2 < r32; ) {
      let e = Math.min(s3 - this.pos, r32 - i2);
      for (let c4 = 0; c4 < e; c4++) o6[this.pos++] ^= t[i2++];
      this.pos === s3 && this.keccak();
    }
    return this;
  }
  finish() {
    if (this.finished) return;
    this.finished = true;
    let { state: t, suffix: s3, pos: o6, blockLen: r32 } = this;
    t[o6] ^= s3, (s3 & 128) !== 0 && o6 === r32 - 1 && this.keccak(), t[r32 - 1] ^= 128, this.keccak();
  }
  writeInto(t) {
    S(this, false), u(t), this.finish();
    let s3 = this.state, { blockLen: o6 } = this;
    for (let r32 = 0, i2 = t.length; r32 < i2; ) {
      this.posOut >= o6 && this.keccak();
      let e = Math.min(o6 - this.posOut, i2 - r32);
      t.set(s3.subarray(this.posOut, this.posOut + e), r32), this.posOut += e, r32 += e;
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
    let { blockLen: s3, suffix: o6, outputLen: r32, rounds: i2, enableXOF: e } = this;
    return t || (t = new n(s3, o6, r32, e, i2)), t.state32.set(this.state32), t.pos = this.pos, t.posOut = this.posOut, t.finished = this.finished, t.rounds = i2, t.suffix = o6, t.outputLen = r32, t.enableXOF = e, t.destroyed = this.destroyed, t;
  }
};
var h2 = /* @__PURE__ */ __name((n2, t, s3) => B(() => new x2(t, n2, s3)), "h");
var tt = h2(6, 144, 224 / 8);
var st = h2(6, 136, 256 / 8);
var nt = h2(6, 104, 384 / 8);
var et = h2(6, 72, 512 / 8);
var ot = h2(1, 144, 224 / 8);
var rt = h2(1, 136, 256 / 8);
var it = h2(1, 104, 384 / 8);
var ct = h2(1, 72, 512 / 8);
var X = /* @__PURE__ */ __name((n2, t, s3) => O((o6 = {}) => new x2(t, n2, o6.dkLen === void 0 ? s3 : o6.dkLen, true)), "X");
var ht = X(31, 168, 128 / 8);
var at = X(31, 136, 256 / 8);

// deno:https://esm.sh/@orama/cuid2@2.2.3/esnext/cuid2.mjs
var require2 = /* @__PURE__ */ __name((n2) => {
  const e = /* @__PURE__ */ __name((m7) => typeof m7.default < "u" ? m7.default : m7, "e"), c4 = /* @__PURE__ */ __name((m7) => Object.assign({ __esModule: true }, m7), "c");
  switch (n2) {
    case "@noble/hashes/sha3":
      return e(sha3_target_esnext_exports);
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
var F2 = /* @__PURE__ */ __name((t, e, n2, o6) => {
  if (e && typeof e == "object" || typeof e == "function") for (let r32 of $(e)) !v.call(t, r32) && r32 !== n2 && g3(t, r32, { get: /* @__PURE__ */ __name(() => e[r32], "get"), enumerable: !(o6 = j2(e, r32)) || o6.enumerable });
  return t;
}, "F");
var T2 = /* @__PURE__ */ __name((t, e, n2) => (n2 = t != null ? L3(q(t)) : {}, F2(e || !t || !t.__esModule ? g3(n2, "default", { value: t, enumerable: true }) : n2, t)), "T");
var I3 = l2((N7, s3) => {
  var { sha3_512: k7 } = z("@noble/hashes/sha3"), p3 = 24, i2 = 32, u6 = /* @__PURE__ */ __name((t = 4, e = Math.random) => {
    let n2 = "";
    for (; n2.length < t; ) n2 = n2 + Math.floor(e() * 36).toString(36);
    return n2;
  }, "u");
  function h8(t) {
    let e = BigInt(8), n2 = BigInt(0);
    for (let o6 of t.values()) {
      let r32 = BigInt(o6);
      n2 = (n2 << e) + r32;
    }
    return n2;
  }
  __name(h8, "h");
  var d7 = /* @__PURE__ */ __name((t = "") => h8(k7(t)).toString(36).slice(1), "d"), f4 = Array.from({ length: 26 }, (t, e) => String.fromCharCode(e + 97)), A8 = /* @__PURE__ */ __name((t) => f4[Math.floor(t() * f4.length)], "A"), x9 = /* @__PURE__ */ __name(({ globalObj: t = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : {}, random: e = Math.random } = {}) => {
    let n2 = Object.keys(t).toString(), o6 = n2.length ? n2 + u6(i2, e) : u6(i2, e);
    return d7(o6).substring(0, i2);
  }, "x"), C7 = /* @__PURE__ */ __name((t) => () => t++, "C"), D7 = 476782367, b7 = /* @__PURE__ */ __name(({ random: t = Math.random, counter: e = C7(Math.floor(t() * D7)), length: n2 = p3, fingerprint: o6 = x9({ random: t }) } = {}) => function() {
    let m7 = A8(t), M7 = Date.now().toString(36), S10 = e().toString(36), w9 = u6(n2, t), B9 = `${M7 + w9 + S10 + o6}`;
    return `${m7 + d7(B9).substring(1, n2)}`;
  }, "b"), E8 = b7(), O8 = /* @__PURE__ */ __name((t, { minLength: e = 2, maxLength: n2 = i2 } = {}) => {
    let o6 = t.length, r32 = /^[a-z][0-9a-z]+$/;
    try {
      if (typeof t == "string" && o6 >= e && o6 <= n2 && r32.test(t)) return true;
    } finally {
    }
    return false;
  }, "O");
  s3.exports.getConstants = () => ({ defaultLength: p3, bigLength: i2 });
  s3.exports.init = b7;
  s3.exports.createId = E8;
  s3.exports.bufToBigInt = h8;
  s3.exports.createCounter = C7;
  s3.exports.createFingerprint = x9;
  s3.exports.isCuid = O8;
});
var y2 = l2((P6, a3) => {
  var { createId: _10, init: G8, getConstants: H7, isCuid: J8 } = I3();
  a3.exports.createId = _10;
  a3.exports.init = G8;
  a3.exports.getConstants = H7;
  a3.exports.isCuid = J8;
});
var c = T2(y2());
var { createId: Q2, init: R, getConstants: U2, isCuid: V2 } = c;
var W3 = c.default ?? c;

// deno:https://esm.sh/@orama/oramacore-events-parser@0.0.5/esnext/oramacore-events-parser.mjs
var w2 = ["initializing", "handle_gpu_overload", "get_llm_config", "determine_query_strategy", "simple_rag", "advanced_autoquery", "handle_system_prompt", "optimize_query", "execute_search", "execute_before_answer_hook", "generate_answer", "generate_related_queries", "completed", "error", "advanced_autoquery_initializing", "advanced_autoquery_analyzing_input", "advanced_autoquery_query_optimized", "advanced_autoquery_select_properties", "advanced_autoquery_properties_selected", "advanced_autoquery_combine_queries", "advanced_autoquery_queries_combined", "advanced_autoquery_generate_tracked_queries", "advanced_autoquery_tracked_queries_generated", "advanced_autoquery_execute_before_retrieval_hook", "advanced_autoquery_hooks_executed", "advanced_autoquery_execute_searches", "advanced_autoquery_search_results", "advanced_autoquery_completed"];
var l3 = class extends TransformStream {
  static {
    __name(this, "l");
  }
  constructor() {
    let e = new TextDecoder("utf-8", { ignoreBOM: false }), r32 = "";
    super({ start() {
      r32 = "";
    }, transform(o6, n2) {
      let i2 = e.decode(o6);
      r32 += i2;
      let a3 = r32.indexOf(`

`);
      for (; a3 === -1 && r32.indexOf(`\r
\r
`) !== -1; ) a3 = r32.indexOf(`\r
\r
`);
      for (; a3 !== -1; ) {
        let h8 = 2;
        r32.slice(a3, a3 + 4) === `\r
\r
` && (h8 = 4);
        let f4 = r32.slice(0, a3);
        r32 = r32.slice(a3 + h8);
        let m7 = f4.split(/\r?\n/).filter((p3) => p3.startsWith("data:"));
        for (let p3 of m7) {
          let u6 = p3.replace(/^data:\s*/, "");
          try {
            if (u6.startsWith('"') && u6.endsWith('"')) {
              let d7 = JSON.parse(u6);
              n2.enqueue({ type: d7 });
              continue;
            }
            let s3 = JSON.parse(u6);
            if (typeof s3 == "object" && s3 !== null && !("type" in s3)) {
              let d7 = Object.keys(s3);
              if (d7.length === 1) {
                let [y8] = d7, c4 = s3[y8];
                typeof c4 == "object" && c4 !== null ? s3 = { type: y8, ...c4 } : s3 = { type: y8, data: c4 };
              }
            }
            n2.enqueue(s3);
          } catch {
            n2.enqueue({ type: "error", error: "Invalid JSON in SSE data", state: "parse_error" });
          }
        }
        a3 = r32.indexOf(`

`), a3 === -1 && r32.indexOf(`\r
\r
`) !== -1 && (a3 = r32.indexOf(`\r
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
  on(e, r32) {
    return this.handlers[e] || (this.handlers[e] = []), this.handlers[e].push(r32), this;
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
    let r32 = this.handlers[e.type];
    if (r32) for (let n2 of r32) n2(e);
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
  let e = new _3(), r32 = new l3();
  return (async () => {
    let o6 = t.pipeThrough(r32).getReader();
    for (; ; ) {
      let { value: n2, done: i2 } = await o6.read();
      if (i2) break;
      g4(n2) && e.emit(n2);
    }
    await new Promise((n2) => setTimeout(n2, 0)), e._markDone();
  })(), e;
}
__name(x3, "x");
function S2(t) {
  let e = new _3(), r32 = new l3();
  return (async () => {
    let o6 = t.pipeThrough(r32).getReader();
    for (; ; ) {
      let { value: n2, done: i2 } = await o6.read();
      if (i2) break;
      q2(n2) && e.emit(n2);
    }
    await new Promise((n2) => setTimeout(n2, 0)), e._markDone();
  })(), e;
}
__name(S2, "S");

// deno:https://esm.sh/node/async_hooks.mjs
var c2 = class {
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
  enterWith(e) {
    this._enterStore = e;
  }
  run(e, r32, ...t) {
    this._currentStore = e;
    let n2 = r32(...t);
    return this._currentStore = void 0, n2;
  }
  exit(e, ...r32) {
    let t = this._currentStore;
    this._currentStore = void 0;
    let n2 = e(...r32);
    return this._currentStore = t, n2;
  }
  static snapshot() {
    throw new Error("[unenv] `AsyncLocalStorage.snapshot` is not implemented!");
  }
};
var S3 = globalThis.AsyncLocalStorage || c2;
var R2 = Symbol("init");
var a = Symbol("before");
var o2 = Symbol("after");
var i = Symbol("destroy");
var A2 = Symbol("promiseResolve");
var T3 = class {
  static {
    __name(this, "T");
  }
  __unenv__ = true;
  _enabled = false;
  _callbacks = {};
  constructor(e = {}) {
    this._callbacks = e;
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
  get [a]() {
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
var s = /* @__PURE__ */ __name(function() {
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
  constructor(e, r32 = s()) {
    this.type = e, this._asyncId = -1 * _4++, this._triggerAsyncId = typeof r32 == "number" ? r32 : r32?.triggerAsyncId;
  }
  static bind(e, r32, t) {
    return new E2(r32 ?? "anonymous").bind(e);
  }
  bind(e, r32) {
    let t = /* @__PURE__ */ __name((...n2) => this.runInAsyncScope(e, r32, ...n2), "t");
    return t.asyncResource = this, t;
  }
  runInAsyncScope(e, r32, ...t) {
    return e.apply(r32, t);
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
function te(e) {
  return new Error(`[unenv] ${e} is not implemented yet!`);
}
__name(te, "te");
function w3(e) {
  return Object.assign(() => {
    throw te(e);
  }, { __unenv__: true });
}
__name(w3, "w");
var y4 = 10;
var ne = Object.getPrototypeOf(Object.getPrototypeOf(async function* () {
}).prototype);
var G2 = /* @__PURE__ */ __name((e, t) => e, "G");
var _5 = Error;
var ie = Error;
var v2 = Error;
var b2 = Error;
var se = Error;
var C2 = Symbol.for("nodejs.rejection");
var f = Symbol.for("kCapture");
var M2 = Symbol.for("events.errorMonitor");
var d3 = Symbol.for("shapeMode");
var x4 = Symbol.for("events.maxEventTargetListeners");
var oe = Symbol.for("kEnhanceStackBeforeInspector");
var ue = Symbol.for("nodejs.watermarkData");
var S4 = Symbol.for("kEventEmitter");
var h3 = Symbol.for("kAsyncResource");
var le = Symbol.for("kFirstEventParam");
var P = Symbol.for("kResistStopPropagation");
var W4 = Symbol.for("events.maxEventTargetListenersWarned");
var U3 = class E3 {
  static {
    __name(this, "E");
  }
  _events = void 0;
  _eventsCount = 0;
  _maxListeners = y4;
  [f] = false;
  [d3] = false;
  static captureRejectionSymbol = C2;
  static errorMonitor = M2;
  static kMaxEventTargetListeners = x4;
  static kMaxEventTargetListenersWarned = W4;
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
    return X2;
  }
  static get EventEmitterAsyncResource() {
    return ae;
  }
  static get EventEmitter() {
    return E3;
  }
  static setMaxListeners(t = y4, ...r32) {
    if (r32.length === 0) y4 = t;
    else for (let n2 of r32) if (J2(n2)) n2[x4] = t, n2[W4] = false;
    else if (typeof n2.setMaxListeners == "function") n2.setMaxListeners(t);
    else throw new v2("eventTargets", ["EventEmitter", "EventTarget"], n2);
  }
  static listenerCount(t, r32) {
    if (typeof t.listenerCount == "function") return t.listenerCount(r32);
    E3.prototype.listenerCount.call(t, r32);
  }
  static init() {
    throw new Error("EventEmitter.init() is not implemented.");
  }
  static get captureRejections() {
    return this[f];
  }
  static set captureRejections(t) {
    this[f] = t;
  }
  static get defaultMaxListeners() {
    return y4;
  }
  static set defaultMaxListeners(t) {
    y4 = t;
  }
  constructor(t) {
    this._events === void 0 || this._events === Object.getPrototypeOf(this)._events ? (this._events = { __proto__: null }, this._eventsCount = 0, this[d3] = false) : this[d3] = true, this._maxListeners = this._maxListeners || void 0, t?.captureRejections ? this[f] = !!t.captureRejections : this[f] = E3.prototype[f];
  }
  setMaxListeners(t) {
    return this._maxListeners = t, this;
  }
  getMaxListeners() {
    return T4(this);
  }
  emit(t, ...r32) {
    let n2 = t === "error", i2 = this._events;
    if (i2 !== void 0) n2 && i2[M2] !== void 0 && this.emit(M2, ...r32), n2 = n2 && i2.error === void 0;
    else if (!n2) return false;
    if (n2) {
      let s3;
      if (r32.length > 0 && (s3 = r32[0]), s3 instanceof Error) {
        try {
          let c4 = {};
          Error.captureStackTrace?.(c4, E3.prototype.emit), Object.defineProperty(s3, oe, { __proto__: null, value: Function.prototype.bind(de, this, s3, c4), configurable: true });
        } catch {
        }
        throw s3;
      }
      let l5;
      try {
        l5 = G2(s3);
      } catch {
        l5 = s3;
      }
      let a3 = new ie(l5);
      throw a3.context = s3, a3;
    }
    let o6 = i2[t];
    if (o6 === void 0) return false;
    if (typeof o6 == "function") {
      let s3 = o6.apply(this, r32);
      s3 != null && K2(this, s3, t, r32);
    } else {
      let s3 = o6.length, l5 = I5(o6);
      for (let a3 = 0; a3 < s3; ++a3) {
        let c4 = l5[a3].apply(this, r32);
        c4 != null && K2(this, c4, t, r32);
      }
    }
    return true;
  }
  addListener(t, r32) {
    return q3(this, t, r32, false), this;
  }
  on(t, r32) {
    return this.addListener(t, r32);
  }
  prependListener(t, r32) {
    return q3(this, t, r32, true), this;
  }
  once(t, r32) {
    return this.on(t, z2(this, t, r32)), this;
  }
  prependOnceListener(t, r32) {
    return this.prependListener(t, z2(this, t, r32)), this;
  }
  removeListener(t, r32) {
    let n2 = this._events;
    if (n2 === void 0) return this;
    let i2 = n2[t];
    if (i2 === void 0) return this;
    if (i2 === r32 || i2.listener === r32) this._eventsCount -= 1, this[d3] ? n2[t] = void 0 : this._eventsCount === 0 ? this._events = { __proto__: null } : (delete n2[t], n2.removeListener && this.emit("removeListener", t, i2.listener || r32));
    else if (typeof i2 != "function") {
      let o6 = -1;
      for (let s3 = i2.length - 1; s3 >= 0; s3--) if (i2[s3] === r32 || i2[s3].listener === r32) {
        o6 = s3;
        break;
      }
      if (o6 < 0) return this;
      o6 === 0 ? i2.shift() : ge(i2, o6), i2.length === 1 && (n2[t] = i2[0]), n2.removeListener !== void 0 && this.emit("removeListener", t, r32);
    }
    return this;
  }
  off(t, r32) {
    return this.removeListener(t, r32);
  }
  removeAllListeners(t) {
    let r32 = this._events;
    if (r32 === void 0) return this;
    if (r32.removeListener === void 0) return arguments.length === 0 ? (this._events = { __proto__: null }, this._eventsCount = 0) : r32[t] !== void 0 && (--this._eventsCount === 0 ? this._events = { __proto__: null } : delete r32[t]), this[d3] = false, this;
    if (arguments.length === 0) {
      for (let i2 of Reflect.ownKeys(r32)) i2 !== "removeListener" && this.removeAllListeners(i2);
      return this.removeAllListeners("removeListener"), this._events = { __proto__: null }, this._eventsCount = 0, this[d3] = false, this;
    }
    let n2 = r32[t];
    if (typeof n2 == "function") this.removeListener(t, n2);
    else if (n2 !== void 0) for (let i2 = n2.length - 1; i2 >= 0; i2--) this.removeListener(t, n2[i2]);
    return this;
  }
  listeners(t) {
    return B3(this, t, true);
  }
  rawListeners(t) {
    return B3(this, t, false);
  }
  eventNames() {
    return this._eventsCount > 0 ? Reflect.ownKeys(this._events) : [];
  }
  listenerCount(t, r32) {
    let n2 = this._events;
    if (n2 !== void 0) {
      let i2 = n2[t];
      if (typeof i2 == "function") return r32 != null ? r32 === i2 || r32 === i2.listener ? 1 : 0 : 1;
      if (i2 !== void 0) {
        if (r32 != null) {
          let o6 = 0;
          for (let s3 = 0, l5 = i2.length; s3 < l5; s3++) (i2[s3] === r32 || i2[s3].listener === r32) && o6++;
          return o6;
        }
        return i2.length;
      }
    }
    return 0;
  }
};
var ae = class extends U3 {
  static {
    __name(this, "ae");
  }
  constructor(e) {
    let t;
    typeof e == "string" ? (t = e, e = void 0) : t = e?.name || new.target.name, super(e), this[h3] = new ce(this, t, e);
  }
  emit(e, ...t) {
    if (this[h3] === void 0) throw new _5("EventEmitterAsyncResource");
    let { asyncResource: r32 } = this;
    return Array.prototype.unshift(t, super.emit, this, e), Reflect.apply(r32.runInAsyncScope, r32, t);
  }
  emitDestroy() {
    if (this[h3] === void 0) throw new _5("EventEmitterAsyncResource");
    this.asyncResource.emitDestroy();
  }
  get asyncId() {
    if (this[h3] === void 0) throw new _5("EventEmitterAsyncResource");
    return this.asyncResource.asyncId();
  }
  get triggerAsyncId() {
    if (this[h3] === void 0) throw new _5("EventEmitterAsyncResource");
    return this.asyncResource.triggerAsyncId();
  }
  get asyncResource() {
    if (this[h3] === void 0) throw new _5("EventEmitterAsyncResource");
    return this[h3];
  }
};
var ce = class extends E2 {
  static {
    __name(this, "ce");
  }
  constructor(e, t, r32) {
    super(t, r32), this[S4] = e;
  }
  get eventEmitter() {
    if (this[S4] === void 0) throw new _5("EventEmitterReferencingAsyncResource");
    return this[S4];
  }
};
var fe = /* @__PURE__ */ __name(function(e, t, r32 = {}) {
  let n2 = r32.signal;
  if (n2?.aborted) throw new b2(void 0, { cause: n2?.reason });
  let i2 = r32.highWaterMark ?? r32.highWatermark ?? Number.MAX_SAFE_INTEGER, o6 = r32.lowWaterMark ?? r32.lowWatermark ?? 1, s3 = new N(), l5 = new N(), a3 = false, c4 = null, m7 = false, p3 = 0, Q8 = Object.setPrototypeOf({ next() {
    if (p3) {
      let u6 = s3.shift();
      return p3--, a3 && p3 < o6 && (e.resume?.(), a3 = false), Promise.resolve(k2(u6, false));
    }
    if (c4) {
      let u6 = Promise.reject(c4);
      return c4 = null, u6;
    }
    return m7 ? L8() : new Promise(function(u6, ee5) {
      l5.push({ resolve: u6, reject: ee5 });
    });
  }, return() {
    return L8();
  }, throw(u6) {
    if (!u6 || !(u6 instanceof Error)) throw new v2("EventEmitter.AsyncIterator", "Error", u6);
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
    return a3;
  } } }, ne), { addEventListener: A8, removeAll: V8 } = Ee();
  A8(e, t, r32[le] ? $7 : function(...u6) {
    return $7(u6);
  }), t !== "error" && typeof e.on == "function" && A8(e, "error", R7);
  let F8 = r32?.close;
  if (F8?.length) for (let u6 of F8) A8(e, u6, L8);
  let Y6 = n2 ? X2(n2, Z6) : null;
  return Q8;
  function Z6() {
    R7(new b2(void 0, { cause: n2?.reason }));
  }
  __name(Z6, "Z");
  function $7(u6) {
    l5.isEmpty() ? (p3++, !a3 && p3 > i2 && (a3 = true, e.pause?.()), s3.push(u6)) : l5.shift().resolve(k2(u6, false));
  }
  __name($7, "$");
  function R7(u6) {
    l5.isEmpty() ? c4 = u6 : l5.shift().reject(u6), L8();
  }
  __name(R7, "R");
  function L8() {
    Y6?.[Symbol.dispose](), V8(), m7 = true;
    let u6 = k2(void 0, true);
    for (; !l5.isEmpty(); ) l5.shift().resolve(u6);
    return Promise.resolve(u6);
  }
  __name(L8, "L");
}, "fe");
var he = /* @__PURE__ */ __name(async function(e, t, r32 = {}) {
  let n2 = r32?.signal;
  if (n2?.aborted) throw new b2(void 0, { cause: n2?.reason });
  return new Promise((i2, o6) => {
    let s3 = /* @__PURE__ */ __name((m7) => {
      typeof e.removeListener == "function" && e.removeListener(t, l5), n2 != null && g5(n2, "abort", c4), o6(m7);
    }, "s"), l5 = /* @__PURE__ */ __name((...m7) => {
      typeof e.removeListener == "function" && e.removeListener("error", s3), n2 != null && g5(n2, "abort", c4), i2(m7);
    }, "l"), a3 = { __proto__: null, once: true, [P]: true };
    O2(e, t, l5, a3), t !== "error" && typeof e.once == "function" && e.once("error", s3);
    function c4() {
      g5(e, t, l5), g5(e, "error", s3), o6(new b2(void 0, { cause: n2?.reason }));
    }
    __name(c4, "c");
    n2 != null && O2(n2, "abort", c4, { __proto__: null, once: true, [P]: true });
  });
}, "he");
var X2 = /* @__PURE__ */ __name(function(e, t) {
  if (e === void 0) throw new v2("signal", "AbortSignal", e);
  let r32;
  return e.aborted ? queueMicrotask(() => t()) : (e.addEventListener("abort", t, { __proto__: null, once: true, [P]: true }), r32 = /* @__PURE__ */ __name(() => {
    e.removeEventListener("abort", t);
  }, "r")), { __proto__: null, [Symbol.dispose]() {
    r32?.();
  } };
}, "X");
var ve = /* @__PURE__ */ __name(function(e, t) {
  if (typeof e.listeners == "function") return e.listeners(t);
  if (J2(e)) {
    let r32 = e[kEvents].get(t), n2 = [], i2 = r32?.next;
    for (; i2?.listener !== void 0; ) {
      let o6 = i2.listener?.deref ? i2.listener.deref() : i2.listener;
      n2.push(o6), i2 = i2.next;
    }
    return n2;
  }
  throw new v2("emitter", ["EventEmitter", "EventTarget"], e);
}, "ve");
var me = /* @__PURE__ */ __name(function(e) {
  if (typeof e?.getMaxListeners == "function") return T4(e);
  if (e?.[x4]) return e[x4];
  throw new v2("emitter", ["EventEmitter", "EventTarget"], e);
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
  push(e) {
    this.list[this.top] = e, this.top = this.top + 1 & j3;
  }
  shift() {
    let e = this.list[this.bottom];
    return e === void 0 ? null : (this.list[this.bottom] = void 0, this.bottom = this.bottom + 1 & j3, e);
  }
};
var N = class {
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
  push(e) {
    this.head.isFull() && (this.head = this.head.next = new D2()), this.head.push(e);
  }
  shift() {
    let e = this.tail, t = e.shift();
    return e.isEmpty() && e.next !== null && (this.tail = e.next, e.next = null), t;
  }
};
function J2(e) {
  return typeof e?.addEventListener == "function";
}
__name(J2, "J");
function K2(e, t, r32, n2) {
  if (e[f]) try {
    let i2 = t.then;
    typeof i2 == "function" && i2.call(t, void 0, function(o6) {
      setTimeout(pe, 0, e, o6, r32, n2);
    });
  } catch (i2) {
    e.emit("error", i2);
  }
}
__name(K2, "K");
function pe(e, t, r32, n2) {
  if (typeof e[C2] == "function") e[C2](t, r32, ...n2);
  else {
    let i2 = e[f];
    try {
      e[f] = false, e.emit("error", t);
    } finally {
      e[f] = i2;
    }
  }
}
__name(pe, "pe");
function T4(e) {
  return e._maxListeners === void 0 ? y4 : e._maxListeners;
}
__name(T4, "T");
function de(e, t) {
  let r32 = "";
  try {
    let { name: o6 } = this.constructor;
    o6 !== "EventEmitter" && (r32 = ` on ${o6} instance`);
  } catch {
  }
  let n2 = `
Emitted 'error' event${r32} at:
`, i2 = (t.stack || "").split(`
`).slice(1);
  return e.stack + n2 + i2.join(`
`);
}
__name(de, "de");
function q3(e, t, r32, n2) {
  let i2, o6, s3;
  if (o6 = e._events, o6 === void 0 ? (o6 = e._events = { __proto__: null }, e._eventsCount = 0) : (o6.newListener !== void 0 && (e.emit("newListener", t, r32.listener ?? r32), o6 = e._events), s3 = o6[t]), s3 === void 0) o6[t] = r32, ++e._eventsCount;
  else if (typeof s3 == "function" ? s3 = o6[t] = n2 ? [r32, s3] : [s3, r32] : n2 ? s3.unshift(r32) : s3.push(r32), i2 = T4(e), i2 > 0 && s3.length > i2 && !s3.warned) {
    s3.warned = true;
    let l5 = new se(`Possible EventEmitter memory leak detected. ${s3.length} ${String(t)} listeners added to ${G2(e, { depth: -1 })}. MaxListeners is ${i2}. Use emitter.setMaxListeners() to increase limit`, { name: "MaxListenersExceededWarning", emitter: e, type: t, count: s3.length });
    console.warn(l5);
  }
  return e;
}
__name(q3, "q");
function ye() {
  if (!this.fired) return this.target.removeListener(this.type, this.wrapFn), this.fired = true, arguments.length === 0 ? this.listener.call(this.target) : this.listener.apply(this.target, arguments);
}
__name(ye, "ye");
function z2(e, t, r32) {
  let n2 = { fired: false, wrapFn: void 0, target: e, type: t, listener: r32 }, i2 = ye.bind(n2);
  return i2.listener = r32, n2.wrapFn = i2, i2;
}
__name(z2, "z");
function B3(e, t, r32) {
  let n2 = e._events;
  if (n2 === void 0) return [];
  let i2 = n2[t];
  return i2 === void 0 ? [] : typeof i2 == "function" ? r32 ? [i2.listener || i2] : [i2] : r32 ? _e(i2) : I5(i2);
}
__name(B3, "B");
function I5(e) {
  switch (e.length) {
    case 2:
      return [e[0], e[1]];
    case 3:
      return [e[0], e[1], e[2]];
    case 4:
      return [e[0], e[1], e[2], e[3]];
    case 5:
      return [e[0], e[1], e[2], e[3], e[4]];
    case 6:
      return [e[0], e[1], e[2], e[3], e[4], e[5]];
  }
  return Array.prototype.slice.call(e);
}
__name(I5, "I");
function _e(e) {
  let t = I5(e);
  for (let r32 = 0; r32 < t.length; ++r32) {
    let n2 = t[r32].listener;
    typeof n2 == "function" && (t[r32] = n2);
  }
  return t;
}
__name(_e, "_e");
function k2(e, t) {
  return { value: e, done: t };
}
__name(k2, "k");
function g5(e, t, r32, n2) {
  if (typeof e.removeListener == "function") e.removeListener(t, r32);
  else if (typeof e.removeEventListener == "function") e.removeEventListener(t, r32, n2);
  else throw new v2("emitter", "EventEmitter", e);
}
__name(g5, "g");
function O2(e, t, r32, n2) {
  if (typeof e.on == "function") n2?.once ? e.once(t, r32) : e.on(t, r32);
  else if (typeof e.addEventListener == "function") e.addEventListener(t, r32, n2);
  else throw new v2("emitter", "EventEmitter", e);
}
__name(O2, "O");
function Ee() {
  let e = [];
  return { addEventListener(t, r32, n2, i2) {
    O2(t, r32, n2, i2), Array.prototype.push(e, [t, r32, n2, i2]);
  }, removeAll() {
    for (; e.length > 0; ) Reflect.apply(g5, void 0, e.pop());
  } };
}
__name(Ee, "Ee");
function ge(e, t) {
  for (; t + 1 < e.length; t++) e[t] = e[t + 1];
  e.pop();
}
__name(ge, "ge");
var Me = Symbol.for("nodejs.rejection");
var je = Symbol.for("events.errorMonitor");
var Ce = w3("node:events.setMaxListeners");
var Pe = w3("node:events.listenerCount");
var Oe = w3("node:events.init");

// deno:https://esm.sh/node/tty.mjs
var o3 = class {
  static {
    __name(this, "o");
  }
  fd;
  isRaw = false;
  isTTY = false;
  constructor(t) {
    this.fd = t;
  }
  setRawMode(t) {
    return this.isRaw = t, this;
  }
};
var s2 = class {
  static {
    __name(this, "s");
  }
  fd;
  columns = 80;
  rows = 24;
  isTTY = false;
  constructor(t) {
    this.fd = t;
  }
  clearLine(t, r32) {
    return r32 && r32(), false;
  }
  clearScreenDown(t) {
    return t && t(), false;
  }
  cursorTo(t, r32, e) {
    return e && typeof e == "function" && e(), false;
  }
  moveCursor(t, r32, e) {
    return e && e(), false;
  }
  getColorDepth(t) {
    return 1;
  }
  hasColors(t, r32) {
    return false;
  }
  getWindowSize() {
    return [this.columns, this.rows];
  }
  write(t, r32, e) {
    t instanceof Uint8Array && (t = new TextDecoder().decode(t));
    try {
      console.log(t);
    } catch {
    }
    return e && typeof e == "function" && e(), false;
  }
};

// deno:https://esm.sh/node/process.mjs
function r(t) {
  return new Error(`[unenv] ${t} is not implemented yet!`);
}
__name(r, "r");
function a2(t) {
  return Object.assign(() => {
    throw r(t);
  }, { __unenv__: true });
}
__name(a2, "a");
var v3 = "22.14.0";
var _6 = class m3 extends U3 {
  static {
    __name(this, "m");
  }
  env;
  hrtime;
  nextTick;
  constructor(e) {
    super(), this.env = e.env, this.hrtime = e.hrtime, this.nextTick = e.nextTick;
    for (let s3 of [...Object.getOwnPropertyNames(m3.prototype), ...Object.getOwnPropertyNames(U3.prototype)]) {
      let i2 = this[s3];
      typeof i2 == "function" && (this[s3] = i2.bind(this));
    }
  }
  emitWarning(e, s3, i2) {
    console.warn(`${i2 ? `[${i2}] ` : ""}${s3 ? `${s3}: ` : ""}${e}`);
  }
  emit(...e) {
    return super.emit(...e);
  }
  listeners(e) {
    return super.listeners(e);
  }
  #t;
  #s;
  #r;
  get stdin() {
    return this.#t ??= new o3(0);
  }
  get stdout() {
    return this.#s ??= new s2(1);
  }
  get stderr() {
    return this.#r ??= new s2(2);
  }
  #e = "/";
  chdir(e) {
    this.#e = e;
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
    return `v${v3}`;
  }
  get versions() {
    return { node: v3 };
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
  permission = { has: a2("process.permission.has") };
  report = { directory: "", filename: "", signal: "SIGUSR2", compact: false, reportOnFatalError: false, reportOnSignal: false, reportOnUncaughtException: false, getReport: a2("process.report.getReport"), writeReport: a2("process.report.writeReport") };
  finalization = { register: a2("process.finalization.register"), unregister: a2("process.finalization.unregister"), registerBeforeExit: a2("process.finalization.registerBeforeExit") };
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
var b3 = globalThis.process;
var o4 = /* @__PURE__ */ __name((t) => globalThis.__env__ || b3?.env || (t ? u2 : globalThis), "o");
var x5 = new Proxy(u2, { get(t, e) {
  return o4()[e] ?? u2[e];
}, has(t, e) {
  let s3 = o4();
  return e in s3 || e in u2;
}, set(t, e, s3) {
  let i2 = o4(true);
  return i2[e] = s3, true;
}, deleteProperty(t, e) {
  let s3 = o4(true);
  return delete s3[e], true;
}, ownKeys() {
  let t = o4();
  return Object.keys(t);
}, getOwnPropertyDescriptor(t, e) {
  let s3 = o4();
  if (e in s3) return { value: s3[e], writable: true, enumerable: true, configurable: true };
} });
var w4 = Object.assign(function(t) {
  let e = Date.now(), s3 = Math.trunc(e / 1e3), i2 = e % 1e3 * 1e6;
  if (t) {
    let d7 = s3 - t[0], n2 = i2 - t[0];
    return n2 < 0 && (d7 = d7 - 1, n2 = 1e9 + n2), [d7, n2];
  }
  return [s3, i2];
}, { bigint: /* @__PURE__ */ __name(function() {
  return BigInt(Date.now() * 1e6);
}, "bigint") });
var E4 = globalThis.queueMicrotask ? (t, ...e) => {
  globalThis.queueMicrotask(t.bind(void 0, ...e));
} : k3();
function k3() {
  let t = [], e = false, s3, i2 = -1;
  function d7() {
    !e || !s3 || (e = false, s3.length > 0 ? t = [...s3, ...t] : i2 = -1, t.length > 0 && n2());
  }
  __name(d7, "d");
  function n2() {
    if (e) return;
    let c4 = setTimeout(d7);
    e = true;
    let l5 = t.length;
    for (; l5; ) {
      for (s3 = t, t = []; ++i2 < l5; ) s3 && s3[i2]();
      i2 = -1, l5 = t.length;
    }
    s3 = void 0, e = false, clearTimeout(c4);
  }
  __name(n2, "n");
  return (c4, ...l5) => {
    t.push(c4.bind(void 0, ...l5)), t.length === 1 && !e && setTimeout(n2);
  };
}
__name(k3, "k");
var h4 = new _6({ env: x5, hrtime: w4, nextTick: E4 });
var A3 = h4;
var { abort: O3, addListener: T5, allowedNodeEnvironmentFlags: S5, hasUncaughtExceptionCaptureCallback: N2, setUncaughtExceptionCaptureCallback: R3, loadEnvFile: I6, sourceMapsEnabled: B4, arch: j4, argv: D3, argv0: F3, chdir: $2, config: z3, connected: q4, constrainedMemory: W5, availableMemory: H2, cpuUsage: Q3, cwd: G3, debugPort: K3, dlopen: J3, disconnect: V3, emit: X3, emitWarning: Y, env: Z, eventNames: ee, execArgv: te2, execPath: se2, exit: re, finalization: ie2, features: ne2, getBuiltinModule: ae2, getActiveResourcesInfo: oe2, getMaxListeners: de2, hrtime: le2, kill: ue2, listeners: ce2, listenerCount: ge2, memoryUsage: pe2, nextTick: ve2, on: me2, off: he2, once: fe2, pid: _e2, platform: be, ppid: xe, prependListener: we, prependOnceListener: Ee2, rawListeners: ke, release: ye2, removeAllListeners: Me2, removeListener: Ce2, report: Le, resourceUsage: Pe2, setMaxListeners: Ue, setSourceMapsEnabled: Ae, stderr: Oe2, stdin: Te, stdout: Se, title: Ne, umask: Re, uptime: Ie, version: Be, versions: je2, domain: De, initgroups: Fe, moduleLoadList: $e, reallyExit: ze, openStdin: qe, assert: We, binding: He, send: Qe, exitCode: Ge, channel: Ke, getegid: Je, geteuid: Ve, getgid: Xe, getgroups: Ye, getuid: Ze, setegid: et2, seteuid: tt2, setgid: st2, setgroups: rt2, setuid: it2, permission: nt2, mainModule: at2, ref: ot2, unref: dt, _events: lt, _eventsCount: ut, _exiting: ct2, _maxListeners: gt, _debugEnd: pt, _debugProcess: vt, _fatalException: mt, _getActiveHandles: ht2, _getActiveRequests: ft, _kill: _t, _preload_modules: bt, _rawDebug: xt, _startProfilerIdleNotifier: wt, _stopProfilerIdleNotifier: Et, _tickCallback: kt, _disconnect: yt, _handleQueue: Mt, _pendingMessage: Ct, _channel: Lt, _send: Pt, _linkedBinding: Ut } = h4;

// deno:https://esm.sh/zod@3.25.76/esnext/zod.mjs
var $e2 = Object.defineProperty;
var Me3 = /* @__PURE__ */ __name((r32, e) => {
  for (var t in e) $e2(r32, t, { get: e[t], enumerable: true });
}, "Me");
var be2 = {};
Me3(be2, { BRAND: /* @__PURE__ */ __name(() => ct3, "BRAND"), DIRTY: /* @__PURE__ */ __name(() => D4, "DIRTY"), EMPTY_PATH: /* @__PURE__ */ __name(() => De2, "EMPTY_PATH"), INVALID: /* @__PURE__ */ __name(() => p2, "INVALID"), NEVER: /* @__PURE__ */ __name(() => qt, "NEVER"), OK: /* @__PURE__ */ __name(() => k4, "OK"), ParseStatus: /* @__PURE__ */ __name(() => x6, "ParseStatus"), Schema: /* @__PURE__ */ __name(() => _7, "Schema"), ZodAny: /* @__PURE__ */ __name(() => P2, "ZodAny"), ZodArray: /* @__PURE__ */ __name(() => $3, "ZodArray"), ZodBigInt: /* @__PURE__ */ __name(() => U4, "ZodBigInt"), ZodBoolean: /* @__PURE__ */ __name(() => F4, "ZodBoolean"), ZodBranded: /* @__PURE__ */ __name(() => le3, "ZodBranded"), ZodCatch: /* @__PURE__ */ __name(() => ee2, "ZodCatch"), ZodDate: /* @__PURE__ */ __name(() => B5, "ZodDate"), ZodDefault: /* @__PURE__ */ __name(() => K4, "ZodDefault"), ZodDiscriminatedUnion: /* @__PURE__ */ __name(() => me3, "ZodDiscriminatedUnion"), ZodEffects: /* @__PURE__ */ __name(() => S6, "ZodEffects"), ZodEnum: /* @__PURE__ */ __name(() => Q4, "ZodEnum"), ZodError: /* @__PURE__ */ __name(() => b4, "ZodError"), ZodFirstPartyTypeKind: /* @__PURE__ */ __name(() => m4, "ZodFirstPartyTypeKind"), ZodFunction: /* @__PURE__ */ __name(() => _e3, "ZodFunction"), ZodIntersection: /* @__PURE__ */ __name(() => Y2, "ZodIntersection"), ZodIssueCode: /* @__PURE__ */ __name(() => c3, "ZodIssueCode"), ZodLazy: /* @__PURE__ */ __name(() => H3, "ZodLazy"), ZodLiteral: /* @__PURE__ */ __name(() => G4, "ZodLiteral"), ZodMap: /* @__PURE__ */ __name(() => oe3, "ZodMap"), ZodNaN: /* @__PURE__ */ __name(() => de3, "ZodNaN"), ZodNativeEnum: /* @__PURE__ */ __name(() => X4, "ZodNativeEnum"), ZodNever: /* @__PURE__ */ __name(() => A4, "ZodNever"), ZodNull: /* @__PURE__ */ __name(() => q5, "ZodNull"), ZodNullable: /* @__PURE__ */ __name(() => j5, "ZodNullable"), ZodNumber: /* @__PURE__ */ __name(() => L4, "ZodNumber"), ZodObject: /* @__PURE__ */ __name(() => w5, "ZodObject"), ZodOptional: /* @__PURE__ */ __name(() => C3, "ZodOptional"), ZodParsedType: /* @__PURE__ */ __name(() => u3, "ZodParsedType"), ZodPipeline: /* @__PURE__ */ __name(() => fe3, "ZodPipeline"), ZodPromise: /* @__PURE__ */ __name(() => z4, "ZodPromise"), ZodReadonly: /* @__PURE__ */ __name(() => te3, "ZodReadonly"), ZodRecord: /* @__PURE__ */ __name(() => ye3, "ZodRecord"), ZodSchema: /* @__PURE__ */ __name(() => _7, "ZodSchema"), ZodSet: /* @__PURE__ */ __name(() => ce3, "ZodSet"), ZodString: /* @__PURE__ */ __name(() => V4, "ZodString"), ZodSymbol: /* @__PURE__ */ __name(() => ne3, "ZodSymbol"), ZodTransformer: /* @__PURE__ */ __name(() => S6, "ZodTransformer"), ZodTuple: /* @__PURE__ */ __name(() => N3, "ZodTuple"), ZodType: /* @__PURE__ */ __name(() => _7, "ZodType"), ZodUndefined: /* @__PURE__ */ __name(() => W6, "ZodUndefined"), ZodUnion: /* @__PURE__ */ __name(() => J4, "ZodUnion"), ZodUnknown: /* @__PURE__ */ __name(() => Z2, "ZodUnknown"), ZodVoid: /* @__PURE__ */ __name(() => ie3, "ZodVoid"), addIssueToContext: /* @__PURE__ */ __name(() => d4, "addIssueToContext"), any: /* @__PURE__ */ __name(() => _t2, "any"), array: /* @__PURE__ */ __name(() => kt2, "array"), bigint: /* @__PURE__ */ __name(() => ft2, "bigint"), boolean: /* @__PURE__ */ __name(() => Ze2, "boolean"), coerce: /* @__PURE__ */ __name(() => Wt, "coerce"), custom: /* @__PURE__ */ __name(() => je3, "custom"), date: /* @__PURE__ */ __name(() => ht3, "date"), datetimeRegex: /* @__PURE__ */ __name(() => Re2, "datetimeRegex"), defaultErrorMap: /* @__PURE__ */ __name(() => I7, "defaultErrorMap"), discriminatedUnion: /* @__PURE__ */ __name(() => Ct2, "discriminatedUnion"), effect: /* @__PURE__ */ __name(() => Vt, "effect"), enum: /* @__PURE__ */ __name(() => Zt, "enum"), function: /* @__PURE__ */ __name(() => jt, "function"), getErrorMap: /* @__PURE__ */ __name(() => re2, "getErrorMap"), getParsedType: /* @__PURE__ */ __name(() => R4, "getParsedType"), instanceof: /* @__PURE__ */ __name(() => ut2, "instanceof"), intersection: /* @__PURE__ */ __name(() => Ot, "intersection"), isAborted: /* @__PURE__ */ __name(() => he3, "isAborted"), isAsync: /* @__PURE__ */ __name(() => se3, "isAsync"), isDirty: /* @__PURE__ */ __name(() => pe3, "isDirty"), isValid: /* @__PURE__ */ __name(() => M3, "isValid"), late: /* @__PURE__ */ __name(() => dt2, "late"), lazy: /* @__PURE__ */ __name(() => It, "lazy"), literal: /* @__PURE__ */ __name(() => Et2, "literal"), makeIssue: /* @__PURE__ */ __name(() => ue3, "makeIssue"), map: /* @__PURE__ */ __name(() => Rt, "map"), nan: /* @__PURE__ */ __name(() => lt2, "nan"), nativeEnum: /* @__PURE__ */ __name(() => $t, "nativeEnum"), never: /* @__PURE__ */ __name(() => vt2, "never"), null: /* @__PURE__ */ __name(() => yt2, "null"), nullable: /* @__PURE__ */ __name(() => zt, "nullable"), number: /* @__PURE__ */ __name(() => Ee3, "number"), object: /* @__PURE__ */ __name(() => bt2, "object"), objectUtil: /* @__PURE__ */ __name(() => ve3, "objectUtil"), oboolean: /* @__PURE__ */ __name(() => Bt, "oboolean"), onumber: /* @__PURE__ */ __name(() => Ft, "onumber"), optional: /* @__PURE__ */ __name(() => Pt2, "optional"), ostring: /* @__PURE__ */ __name(() => Ut2, "ostring"), pipeline: /* @__PURE__ */ __name(() => Lt2, "pipeline"), preprocess: /* @__PURE__ */ __name(() => Dt, "preprocess"), promise: /* @__PURE__ */ __name(() => Mt2, "promise"), quotelessJson: /* @__PURE__ */ __name(() => Ve2, "quotelessJson"), record: /* @__PURE__ */ __name(() => At, "record"), set: /* @__PURE__ */ __name(() => Nt, "set"), setErrorMap: /* @__PURE__ */ __name(() => ze2, "setErrorMap"), strictObject: /* @__PURE__ */ __name(() => wt2, "strictObject"), string: /* @__PURE__ */ __name(() => Ie2, "string"), symbol: /* @__PURE__ */ __name(() => pt2, "symbol"), transformer: /* @__PURE__ */ __name(() => Vt, "transformer"), tuple: /* @__PURE__ */ __name(() => St, "tuple"), undefined: /* @__PURE__ */ __name(() => mt2, "undefined"), union: /* @__PURE__ */ __name(() => Tt, "union"), unknown: /* @__PURE__ */ __name(() => gt2, "unknown"), util: /* @__PURE__ */ __name(() => g6, "util"), void: /* @__PURE__ */ __name(() => xt2, "void") });
var g6;
(function(r32) {
  r32.assertEqual = (a3) => {
  };
  function e(a3) {
  }
  __name(e, "e");
  r32.assertIs = e;
  function t(a3) {
    throw new Error();
  }
  __name(t, "t");
  r32.assertNever = t, r32.arrayToEnum = (a3) => {
    let n2 = {};
    for (let i2 of a3) n2[i2] = i2;
    return n2;
  }, r32.getValidEnumValues = (a3) => {
    let n2 = r32.objectKeys(a3).filter((o6) => typeof a3[a3[o6]] != "number"), i2 = {};
    for (let o6 of n2) i2[o6] = a3[o6];
    return r32.objectValues(i2);
  }, r32.objectValues = (a3) => r32.objectKeys(a3).map(function(n2) {
    return a3[n2];
  }), r32.objectKeys = typeof Object.keys == "function" ? (a3) => Object.keys(a3) : (a3) => {
    let n2 = [];
    for (let i2 in a3) Object.prototype.hasOwnProperty.call(a3, i2) && n2.push(i2);
    return n2;
  }, r32.find = (a3, n2) => {
    for (let i2 of a3) if (n2(i2)) return i2;
  }, r32.isInteger = typeof Number.isInteger == "function" ? (a3) => Number.isInteger(a3) : (a3) => typeof a3 == "number" && Number.isFinite(a3) && Math.floor(a3) === a3;
  function s3(a3, n2 = " | ") {
    return a3.map((i2) => typeof i2 == "string" ? `'${i2}'` : i2).join(n2);
  }
  __name(s3, "s");
  r32.joinValues = s3, r32.jsonStringifyReplacer = (a3, n2) => typeof n2 == "bigint" ? n2.toString() : n2;
})(g6 || (g6 = {}));
var ve3;
(function(r32) {
  r32.mergeShapes = (e, t) => ({ ...e, ...t });
})(ve3 || (ve3 = {}));
var u3 = g6.arrayToEnum(["string", "nan", "number", "integer", "float", "boolean", "date", "bigint", "symbol", "function", "undefined", "null", "array", "object", "unknown", "promise", "void", "never", "map", "set"]);
var R4 = /* @__PURE__ */ __name((r32) => {
  switch (typeof r32) {
    case "undefined":
      return u3.undefined;
    case "string":
      return u3.string;
    case "number":
      return Number.isNaN(r32) ? u3.nan : u3.number;
    case "boolean":
      return u3.boolean;
    case "function":
      return u3.function;
    case "bigint":
      return u3.bigint;
    case "symbol":
      return u3.symbol;
    case "object":
      return Array.isArray(r32) ? u3.array : r32 === null ? u3.null : r32.then && typeof r32.then == "function" && r32.catch && typeof r32.catch == "function" ? u3.promise : typeof Map < "u" && r32 instanceof Map ? u3.map : typeof Set < "u" && r32 instanceof Set ? u3.set : typeof Date < "u" && r32 instanceof Date ? u3.date : u3.object;
    default:
      return u3.unknown;
  }
}, "R");
var c3 = g6.arrayToEnum(["invalid_type", "invalid_literal", "custom", "invalid_union", "invalid_union_discriminator", "invalid_enum_value", "unrecognized_keys", "invalid_arguments", "invalid_return_type", "invalid_date", "invalid_string", "too_small", "too_big", "invalid_intersection_types", "not_multiple_of", "not_finite"]);
var Ve2 = /* @__PURE__ */ __name((r32) => JSON.stringify(r32, null, 2).replace(/"([^"]+)":/g, "$1:"), "Ve");
var b4 = class r2 extends Error {
  static {
    __name(this, "r");
  }
  get errors() {
    return this.issues;
  }
  constructor(e) {
    super(), this.issues = [], this.addIssue = (s3) => {
      this.issues = [...this.issues, s3];
    }, this.addIssues = (s3 = []) => {
      this.issues = [...this.issues, ...s3];
    };
    let t = new.target.prototype;
    Object.setPrototypeOf ? Object.setPrototypeOf(this, t) : this.__proto__ = t, this.name = "ZodError", this.issues = e;
  }
  format(e) {
    let t = e || function(n2) {
      return n2.message;
    }, s3 = { _errors: [] }, a3 = /* @__PURE__ */ __name((n2) => {
      for (let i2 of n2.issues) if (i2.code === "invalid_union") i2.unionErrors.map(a3);
      else if (i2.code === "invalid_return_type") a3(i2.returnTypeError);
      else if (i2.code === "invalid_arguments") a3(i2.argumentsError);
      else if (i2.path.length === 0) s3._errors.push(t(i2));
      else {
        let o6 = s3, f4 = 0;
        for (; f4 < i2.path.length; ) {
          let l5 = i2.path[f4];
          f4 === i2.path.length - 1 ? (o6[l5] = o6[l5] || { _errors: [] }, o6[l5]._errors.push(t(i2))) : o6[l5] = o6[l5] || { _errors: [] }, o6 = o6[l5], f4++;
        }
      }
    }, "a");
    return a3(this), s3;
  }
  static assert(e) {
    if (!(e instanceof r2)) throw new Error(`Not a ZodError: ${e}`);
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
    let t = {}, s3 = [];
    for (let a3 of this.issues) if (a3.path.length > 0) {
      let n2 = a3.path[0];
      t[n2] = t[n2] || [], t[n2].push(e(a3));
    } else s3.push(e(a3));
    return { formErrors: s3, fieldErrors: t };
  }
  get formErrors() {
    return this.flatten();
  }
};
b4.create = (r32) => new b4(r32);
var Pe3 = /* @__PURE__ */ __name((r32, e) => {
  let t;
  switch (r32.code) {
    case c3.invalid_type:
      r32.received === u3.undefined ? t = "Required" : t = `Expected ${r32.expected}, received ${r32.received}`;
      break;
    case c3.invalid_literal:
      t = `Invalid literal value, expected ${JSON.stringify(r32.expected, g6.jsonStringifyReplacer)}`;
      break;
    case c3.unrecognized_keys:
      t = `Unrecognized key(s) in object: ${g6.joinValues(r32.keys, ", ")}`;
      break;
    case c3.invalid_union:
      t = "Invalid input";
      break;
    case c3.invalid_union_discriminator:
      t = `Invalid discriminator value. Expected ${g6.joinValues(r32.options)}`;
      break;
    case c3.invalid_enum_value:
      t = `Invalid enum value. Expected ${g6.joinValues(r32.options)}, received '${r32.received}'`;
      break;
    case c3.invalid_arguments:
      t = "Invalid function arguments";
      break;
    case c3.invalid_return_type:
      t = "Invalid function return type";
      break;
    case c3.invalid_date:
      t = "Invalid date";
      break;
    case c3.invalid_string:
      typeof r32.validation == "object" ? "includes" in r32.validation ? (t = `Invalid input: must include "${r32.validation.includes}"`, typeof r32.validation.position == "number" && (t = `${t} at one or more positions greater than or equal to ${r32.validation.position}`)) : "startsWith" in r32.validation ? t = `Invalid input: must start with "${r32.validation.startsWith}"` : "endsWith" in r32.validation ? t = `Invalid input: must end with "${r32.validation.endsWith}"` : g6.assertNever(r32.validation) : r32.validation !== "regex" ? t = `Invalid ${r32.validation}` : t = "Invalid";
      break;
    case c3.too_small:
      r32.type === "array" ? t = `Array must contain ${r32.exact ? "exactly" : r32.inclusive ? "at least" : "more than"} ${r32.minimum} element(s)` : r32.type === "string" ? t = `String must contain ${r32.exact ? "exactly" : r32.inclusive ? "at least" : "over"} ${r32.minimum} character(s)` : r32.type === "number" ? t = `Number must be ${r32.exact ? "exactly equal to " : r32.inclusive ? "greater than or equal to " : "greater than "}${r32.minimum}` : r32.type === "bigint" ? t = `Number must be ${r32.exact ? "exactly equal to " : r32.inclusive ? "greater than or equal to " : "greater than "}${r32.minimum}` : r32.type === "date" ? t = `Date must be ${r32.exact ? "exactly equal to " : r32.inclusive ? "greater than or equal to " : "greater than "}${new Date(Number(r32.minimum))}` : t = "Invalid input";
      break;
    case c3.too_big:
      r32.type === "array" ? t = `Array must contain ${r32.exact ? "exactly" : r32.inclusive ? "at most" : "less than"} ${r32.maximum} element(s)` : r32.type === "string" ? t = `String must contain ${r32.exact ? "exactly" : r32.inclusive ? "at most" : "under"} ${r32.maximum} character(s)` : r32.type === "number" ? t = `Number must be ${r32.exact ? "exactly" : r32.inclusive ? "less than or equal to" : "less than"} ${r32.maximum}` : r32.type === "bigint" ? t = `BigInt must be ${r32.exact ? "exactly" : r32.inclusive ? "less than or equal to" : "less than"} ${r32.maximum}` : r32.type === "date" ? t = `Date must be ${r32.exact ? "exactly" : r32.inclusive ? "smaller than or equal to" : "smaller than"} ${new Date(Number(r32.maximum))}` : t = "Invalid input";
      break;
    case c3.custom:
      t = "Invalid input";
      break;
    case c3.invalid_intersection_types:
      t = "Intersection results could not be merged";
      break;
    case c3.not_multiple_of:
      t = `Number must be a multiple of ${r32.multipleOf}`;
      break;
    case c3.not_finite:
      t = "Number must be finite";
      break;
    default:
      t = e.defaultError, g6.assertNever(r32);
  }
  return { message: t };
}, "Pe");
var I7 = Pe3;
var Te2 = I7;
function ze2(r32) {
  Te2 = r32;
}
__name(ze2, "ze");
function re2() {
  return Te2;
}
__name(re2, "re");
var ue3 = /* @__PURE__ */ __name((r32) => {
  let { data: e, path: t, errorMaps: s3, issueData: a3 } = r32, n2 = [...t, ...a3.path || []], i2 = { ...a3, path: n2 };
  if (a3.message !== void 0) return { ...a3, path: n2, message: a3.message };
  let o6 = "", f4 = s3.filter((l5) => !!l5).slice().reverse();
  for (let l5 of f4) o6 = l5(i2, { data: e, defaultError: o6 }).message;
  return { ...a3, path: n2, message: o6 };
}, "ue");
var De2 = [];
function d4(r32, e) {
  let t = re2(), s3 = ue3({ issueData: e, data: r32.data, path: r32.path, errorMaps: [r32.common.contextualErrorMap, r32.schemaErrorMap, t, t === I7 ? void 0 : I7].filter((a3) => !!a3) });
  r32.common.issues.push(s3);
}
__name(d4, "d");
var x6 = class r3 {
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
    let s3 = [];
    for (let a3 of t) {
      if (a3.status === "aborted") return p2;
      a3.status === "dirty" && e.dirty(), s3.push(a3.value);
    }
    return { status: e.value, value: s3 };
  }
  static async mergeObjectAsync(e, t) {
    let s3 = [];
    for (let a3 of t) {
      let n2 = await a3.key, i2 = await a3.value;
      s3.push({ key: n2, value: i2 });
    }
    return r3.mergeObjectSync(e, s3);
  }
  static mergeObjectSync(e, t) {
    let s3 = {};
    for (let a3 of t) {
      let { key: n2, value: i2 } = a3;
      if (n2.status === "aborted" || i2.status === "aborted") return p2;
      n2.status === "dirty" && e.dirty(), i2.status === "dirty" && e.dirty(), n2.value !== "__proto__" && (typeof i2.value < "u" || a3.alwaysSet) && (s3[n2.value] = i2.value);
    }
    return { status: e.value, value: s3 };
  }
};
var p2 = Object.freeze({ status: "aborted" });
var D4 = /* @__PURE__ */ __name((r32) => ({ status: "dirty", value: r32 }), "D");
var k4 = /* @__PURE__ */ __name((r32) => ({ status: "valid", value: r32 }), "k");
var he3 = /* @__PURE__ */ __name((r32) => r32.status === "aborted", "he");
var pe3 = /* @__PURE__ */ __name((r32) => r32.status === "dirty", "pe");
var M3 = /* @__PURE__ */ __name((r32) => r32.status === "valid", "M");
var se3 = /* @__PURE__ */ __name((r32) => typeof Promise < "u" && r32 instanceof Promise, "se");
var h5;
(function(r32) {
  r32.errToObj = (e) => typeof e == "string" ? { message: e } : e || {}, r32.toString = (e) => typeof e == "string" ? e : e?.message;
})(h5 || (h5 = {}));
var O4 = class {
  static {
    __name(this, "O");
  }
  constructor(e, t, s3, a3) {
    this._cachedPath = [], this.parent = e, this.data = t, this._path = s3, this._key = a3;
  }
  get path() {
    return this._cachedPath.length || (Array.isArray(this._key) ? this._cachedPath.push(...this._path, ...this._key) : this._cachedPath.push(...this._path, this._key)), this._cachedPath;
  }
};
var Ce3 = /* @__PURE__ */ __name((r32, e) => {
  if (M3(e)) return { success: true, data: e.value };
  if (!r32.common.issues.length) throw new Error("Validation failed but no issues detected.");
  return { success: false, get error() {
    if (this._error) return this._error;
    let t = new b4(r32.common.issues);
    return this._error = t, this._error;
  } };
}, "Ce");
function y5(r32) {
  if (!r32) return {};
  let { errorMap: e, invalid_type_error: t, required_error: s3, description: a3 } = r32;
  if (e && (t || s3)) throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
  return e ? { errorMap: e, description: a3 } : { errorMap: /* @__PURE__ */ __name((i2, o6) => {
    let { message: f4 } = r32;
    return i2.code === "invalid_enum_value" ? { message: f4 ?? o6.defaultError } : typeof o6.data > "u" ? { message: f4 ?? s3 ?? o6.defaultError } : i2.code !== "invalid_type" ? { message: o6.defaultError } : { message: f4 ?? t ?? o6.defaultError };
  }, "errorMap"), description: a3 };
}
__name(y5, "y");
var _7 = class {
  static {
    __name(this, "_");
  }
  get description() {
    return this._def.description;
  }
  _getType(e) {
    return R4(e.data);
  }
  _getOrReturnCtx(e, t) {
    return t || { common: e.parent.common, data: e.data, parsedType: R4(e.data), schemaErrorMap: this._def.errorMap, path: e.path, parent: e.parent };
  }
  _processInputParams(e) {
    return { status: new x6(), ctx: { common: e.parent.common, data: e.data, parsedType: R4(e.data), schemaErrorMap: this._def.errorMap, path: e.path, parent: e.parent } };
  }
  _parseSync(e) {
    let t = this._parse(e);
    if (se3(t)) throw new Error("Synchronous parse encountered promise.");
    return t;
  }
  _parseAsync(e) {
    let t = this._parse(e);
    return Promise.resolve(t);
  }
  parse(e, t) {
    let s3 = this.safeParse(e, t);
    if (s3.success) return s3.data;
    throw s3.error;
  }
  safeParse(e, t) {
    let s3 = { common: { issues: [], async: t?.async ?? false, contextualErrorMap: t?.errorMap }, path: t?.path || [], schemaErrorMap: this._def.errorMap, parent: null, data: e, parsedType: R4(e) }, a3 = this._parseSync({ data: e, path: s3.path, parent: s3 });
    return Ce3(s3, a3);
  }
  "~validate"(e) {
    let t = { common: { issues: [], async: !!this["~standard"].async }, path: [], schemaErrorMap: this._def.errorMap, parent: null, data: e, parsedType: R4(e) };
    if (!this["~standard"].async) try {
      let s3 = this._parseSync({ data: e, path: [], parent: t });
      return M3(s3) ? { value: s3.value } : { issues: t.common.issues };
    } catch (s3) {
      s3?.message?.toLowerCase()?.includes("encountered") && (this["~standard"].async = true), t.common = { issues: [], async: true };
    }
    return this._parseAsync({ data: e, path: [], parent: t }).then((s3) => M3(s3) ? { value: s3.value } : { issues: t.common.issues });
  }
  async parseAsync(e, t) {
    let s3 = await this.safeParseAsync(e, t);
    if (s3.success) return s3.data;
    throw s3.error;
  }
  async safeParseAsync(e, t) {
    let s3 = { common: { issues: [], contextualErrorMap: t?.errorMap, async: true }, path: t?.path || [], schemaErrorMap: this._def.errorMap, parent: null, data: e, parsedType: R4(e) }, a3 = this._parse({ data: e, path: s3.path, parent: s3 }), n2 = await (se3(a3) ? a3 : Promise.resolve(a3));
    return Ce3(s3, n2);
  }
  refine(e, t) {
    let s3 = /* @__PURE__ */ __name((a3) => typeof t == "string" || typeof t > "u" ? { message: t } : typeof t == "function" ? t(a3) : t, "s");
    return this._refinement((a3, n2) => {
      let i2 = e(a3), o6 = /* @__PURE__ */ __name(() => n2.addIssue({ code: c3.custom, ...s3(a3) }), "o");
      return typeof Promise < "u" && i2 instanceof Promise ? i2.then((f4) => f4 ? true : (o6(), false)) : i2 ? true : (o6(), false);
    });
  }
  refinement(e, t) {
    return this._refinement((s3, a3) => e(s3) ? true : (a3.addIssue(typeof t == "function" ? t(s3, a3) : t), false));
  }
  _refinement(e) {
    return new S6({ schema: this, typeName: m4.ZodEffects, effect: { type: "refinement", refinement: e } });
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
    return j5.create(this, this._def);
  }
  nullish() {
    return this.nullable().optional();
  }
  array() {
    return $3.create(this);
  }
  promise() {
    return z4.create(this, this._def);
  }
  or(e) {
    return J4.create([this, e], this._def);
  }
  and(e) {
    return Y2.create(this, e, this._def);
  }
  transform(e) {
    return new S6({ ...y5(this._def), schema: this, typeName: m4.ZodEffects, effect: { type: "transform", transform: e } });
  }
  default(e) {
    let t = typeof e == "function" ? e : () => e;
    return new K4({ ...y5(this._def), innerType: this, defaultValue: t, typeName: m4.ZodDefault });
  }
  brand() {
    return new le3({ typeName: m4.ZodBranded, type: this, ...y5(this._def) });
  }
  catch(e) {
    let t = typeof e == "function" ? e : () => e;
    return new ee2({ ...y5(this._def), innerType: this, catchValue: t, typeName: m4.ZodCatch });
  }
  describe(e) {
    let t = this.constructor;
    return new t({ ...this._def, description: e });
  }
  pipe(e) {
    return fe3.create(this, e);
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
var et3 = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
var tt3 = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/;
var Se2 = "((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))";
var rt3 = new RegExp(`^${Se2}$`);
function Ae2(r32) {
  let e = "[0-5]\\d";
  r32.precision ? e = `${e}\\.\\d{${r32.precision}}` : r32.precision == null && (e = `${e}(\\.\\d+)?`);
  let t = r32.precision ? "+" : "?";
  return `([01]\\d|2[0-3]):[0-5]\\d(:${e})${t}`;
}
__name(Ae2, "Ae");
function st3(r32) {
  return new RegExp(`^${Ae2(r32)}$`);
}
__name(st3, "st");
function Re2(r32) {
  let e = `${Se2}T${Ae2(r32)}`, t = [];
  return t.push(r32.local ? "Z?" : "Z"), r32.offset && t.push("([+-]\\d{2}:?\\d{2})"), e = `${e}(${t.join("|")})`, new RegExp(`^${e}$`);
}
__name(Re2, "Re");
function at3(r32, e) {
  return !!((e === "v4" || !e) && Ge2.test(r32) || (e === "v6" || !e) && Xe2.test(r32));
}
__name(at3, "at");
function nt3(r32, e) {
  if (!qe2.test(r32)) return false;
  try {
    let [t] = r32.split(".");
    if (!t) return false;
    let s3 = t.replace(/-/g, "+").replace(/_/g, "/").padEnd(t.length + (4 - t.length % 4) % 4, "="), a3 = JSON.parse(atob(s3));
    return !(typeof a3 != "object" || a3 === null || "typ" in a3 && a3?.typ !== "JWT" || !a3.alg || e && a3.alg !== e);
  } catch {
    return false;
  }
}
__name(nt3, "nt");
function it3(r32, e) {
  return !!((e === "v4" || !e) && Qe2.test(r32) || (e === "v6" || !e) && Ke2.test(r32));
}
__name(it3, "it");
var V4 = class r4 extends _7 {
  static {
    __name(this, "r");
  }
  _parse(e) {
    if (this._def.coerce && (e.data = String(e.data)), this._getType(e) !== u3.string) {
      let n2 = this._getOrReturnCtx(e);
      return d4(n2, { code: c3.invalid_type, expected: u3.string, received: n2.parsedType }), p2;
    }
    let s3 = new x6(), a3;
    for (let n2 of this._def.checks) if (n2.kind === "min") e.data.length < n2.value && (a3 = this._getOrReturnCtx(e, a3), d4(a3, { code: c3.too_small, minimum: n2.value, type: "string", inclusive: true, exact: false, message: n2.message }), s3.dirty());
    else if (n2.kind === "max") e.data.length > n2.value && (a3 = this._getOrReturnCtx(e, a3), d4(a3, { code: c3.too_big, maximum: n2.value, type: "string", inclusive: true, exact: false, message: n2.message }), s3.dirty());
    else if (n2.kind === "length") {
      let i2 = e.data.length > n2.value, o6 = e.data.length < n2.value;
      (i2 || o6) && (a3 = this._getOrReturnCtx(e, a3), i2 ? d4(a3, { code: c3.too_big, maximum: n2.value, type: "string", inclusive: true, exact: true, message: n2.message }) : o6 && d4(a3, { code: c3.too_small, minimum: n2.value, type: "string", inclusive: true, exact: true, message: n2.message }), s3.dirty());
    } else if (n2.kind === "email") Ye2.test(e.data) || (a3 = this._getOrReturnCtx(e, a3), d4(a3, { validation: "email", code: c3.invalid_string, message: n2.message }), s3.dirty());
    else if (n2.kind === "emoji") xe2 || (xe2 = new RegExp(He2, "u")), xe2.test(e.data) || (a3 = this._getOrReturnCtx(e, a3), d4(a3, { validation: "emoji", code: c3.invalid_string, message: n2.message }), s3.dirty());
    else if (n2.kind === "uuid") Be2.test(e.data) || (a3 = this._getOrReturnCtx(e, a3), d4(a3, { validation: "uuid", code: c3.invalid_string, message: n2.message }), s3.dirty());
    else if (n2.kind === "nanoid") We2.test(e.data) || (a3 = this._getOrReturnCtx(e, a3), d4(a3, { validation: "nanoid", code: c3.invalid_string, message: n2.message }), s3.dirty());
    else if (n2.kind === "cuid") Le2.test(e.data) || (a3 = this._getOrReturnCtx(e, a3), d4(a3, { validation: "cuid", code: c3.invalid_string, message: n2.message }), s3.dirty());
    else if (n2.kind === "cuid2") Ue2.test(e.data) || (a3 = this._getOrReturnCtx(e, a3), d4(a3, { validation: "cuid2", code: c3.invalid_string, message: n2.message }), s3.dirty());
    else if (n2.kind === "ulid") Fe2.test(e.data) || (a3 = this._getOrReturnCtx(e, a3), d4(a3, { validation: "ulid", code: c3.invalid_string, message: n2.message }), s3.dirty());
    else if (n2.kind === "url") try {
      new URL(e.data);
    } catch {
      a3 = this._getOrReturnCtx(e, a3), d4(a3, { validation: "url", code: c3.invalid_string, message: n2.message }), s3.dirty();
    }
    else n2.kind === "regex" ? (n2.regex.lastIndex = 0, n2.regex.test(e.data) || (a3 = this._getOrReturnCtx(e, a3), d4(a3, { validation: "regex", code: c3.invalid_string, message: n2.message }), s3.dirty())) : n2.kind === "trim" ? e.data = e.data.trim() : n2.kind === "includes" ? e.data.includes(n2.value, n2.position) || (a3 = this._getOrReturnCtx(e, a3), d4(a3, { code: c3.invalid_string, validation: { includes: n2.value, position: n2.position }, message: n2.message }), s3.dirty()) : n2.kind === "toLowerCase" ? e.data = e.data.toLowerCase() : n2.kind === "toUpperCase" ? e.data = e.data.toUpperCase() : n2.kind === "startsWith" ? e.data.startsWith(n2.value) || (a3 = this._getOrReturnCtx(e, a3), d4(a3, { code: c3.invalid_string, validation: { startsWith: n2.value }, message: n2.message }), s3.dirty()) : n2.kind === "endsWith" ? e.data.endsWith(n2.value) || (a3 = this._getOrReturnCtx(e, a3), d4(a3, { code: c3.invalid_string, validation: { endsWith: n2.value }, message: n2.message }), s3.dirty()) : n2.kind === "datetime" ? Re2(n2).test(e.data) || (a3 = this._getOrReturnCtx(e, a3), d4(a3, { code: c3.invalid_string, validation: "datetime", message: n2.message }), s3.dirty()) : n2.kind === "date" ? rt3.test(e.data) || (a3 = this._getOrReturnCtx(e, a3), d4(a3, { code: c3.invalid_string, validation: "date", message: n2.message }), s3.dirty()) : n2.kind === "time" ? st3(n2).test(e.data) || (a3 = this._getOrReturnCtx(e, a3), d4(a3, { code: c3.invalid_string, validation: "time", message: n2.message }), s3.dirty()) : n2.kind === "duration" ? Je2.test(e.data) || (a3 = this._getOrReturnCtx(e, a3), d4(a3, { validation: "duration", code: c3.invalid_string, message: n2.message }), s3.dirty()) : n2.kind === "ip" ? at3(e.data, n2.version) || (a3 = this._getOrReturnCtx(e, a3), d4(a3, { validation: "ip", code: c3.invalid_string, message: n2.message }), s3.dirty()) : n2.kind === "jwt" ? nt3(e.data, n2.alg) || (a3 = this._getOrReturnCtx(e, a3), d4(a3, { validation: "jwt", code: c3.invalid_string, message: n2.message }), s3.dirty()) : n2.kind === "cidr" ? it3(e.data, n2.version) || (a3 = this._getOrReturnCtx(e, a3), d4(a3, { validation: "cidr", code: c3.invalid_string, message: n2.message }), s3.dirty()) : n2.kind === "base64" ? et3.test(e.data) || (a3 = this._getOrReturnCtx(e, a3), d4(a3, { validation: "base64", code: c3.invalid_string, message: n2.message }), s3.dirty()) : n2.kind === "base64url" ? tt3.test(e.data) || (a3 = this._getOrReturnCtx(e, a3), d4(a3, { validation: "base64url", code: c3.invalid_string, message: n2.message }), s3.dirty()) : g6.assertNever(n2);
    return { status: s3.value, value: e.data };
  }
  _regex(e, t, s3) {
    return this.refinement((a3) => e.test(a3), { validation: t, code: c3.invalid_string, ...h5.errToObj(s3) });
  }
  _addCheck(e) {
    return new r4({ ...this._def, checks: [...this._def.checks, e] });
  }
  email(e) {
    return this._addCheck({ kind: "email", ...h5.errToObj(e) });
  }
  url(e) {
    return this._addCheck({ kind: "url", ...h5.errToObj(e) });
  }
  emoji(e) {
    return this._addCheck({ kind: "emoji", ...h5.errToObj(e) });
  }
  uuid(e) {
    return this._addCheck({ kind: "uuid", ...h5.errToObj(e) });
  }
  nanoid(e) {
    return this._addCheck({ kind: "nanoid", ...h5.errToObj(e) });
  }
  cuid(e) {
    return this._addCheck({ kind: "cuid", ...h5.errToObj(e) });
  }
  cuid2(e) {
    return this._addCheck({ kind: "cuid2", ...h5.errToObj(e) });
  }
  ulid(e) {
    return this._addCheck({ kind: "ulid", ...h5.errToObj(e) });
  }
  base64(e) {
    return this._addCheck({ kind: "base64", ...h5.errToObj(e) });
  }
  base64url(e) {
    return this._addCheck({ kind: "base64url", ...h5.errToObj(e) });
  }
  jwt(e) {
    return this._addCheck({ kind: "jwt", ...h5.errToObj(e) });
  }
  ip(e) {
    return this._addCheck({ kind: "ip", ...h5.errToObj(e) });
  }
  cidr(e) {
    return this._addCheck({ kind: "cidr", ...h5.errToObj(e) });
  }
  datetime(e) {
    return typeof e == "string" ? this._addCheck({ kind: "datetime", precision: null, offset: false, local: false, message: e }) : this._addCheck({ kind: "datetime", precision: typeof e?.precision > "u" ? null : e?.precision, offset: e?.offset ?? false, local: e?.local ?? false, ...h5.errToObj(e?.message) });
  }
  date(e) {
    return this._addCheck({ kind: "date", message: e });
  }
  time(e) {
    return typeof e == "string" ? this._addCheck({ kind: "time", precision: null, message: e }) : this._addCheck({ kind: "time", precision: typeof e?.precision > "u" ? null : e?.precision, ...h5.errToObj(e?.message) });
  }
  duration(e) {
    return this._addCheck({ kind: "duration", ...h5.errToObj(e) });
  }
  regex(e, t) {
    return this._addCheck({ kind: "regex", regex: e, ...h5.errToObj(t) });
  }
  includes(e, t) {
    return this._addCheck({ kind: "includes", value: e, position: t?.position, ...h5.errToObj(t?.message) });
  }
  startsWith(e, t) {
    return this._addCheck({ kind: "startsWith", value: e, ...h5.errToObj(t) });
  }
  endsWith(e, t) {
    return this._addCheck({ kind: "endsWith", value: e, ...h5.errToObj(t) });
  }
  min(e, t) {
    return this._addCheck({ kind: "min", value: e, ...h5.errToObj(t) });
  }
  max(e, t) {
    return this._addCheck({ kind: "max", value: e, ...h5.errToObj(t) });
  }
  length(e, t) {
    return this._addCheck({ kind: "length", value: e, ...h5.errToObj(t) });
  }
  nonempty(e) {
    return this.min(1, h5.errToObj(e));
  }
  trim() {
    return new r4({ ...this._def, checks: [...this._def.checks, { kind: "trim" }] });
  }
  toLowerCase() {
    return new r4({ ...this._def, checks: [...this._def.checks, { kind: "toLowerCase" }] });
  }
  toUpperCase() {
    return new r4({ ...this._def, checks: [...this._def.checks, { kind: "toUpperCase" }] });
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
V4.create = (r32) => new V4({ checks: [], typeName: m4.ZodString, coerce: r32?.coerce ?? false, ...y5(r32) });
function ot3(r32, e) {
  let t = (r32.toString().split(".")[1] || "").length, s3 = (e.toString().split(".")[1] || "").length, a3 = t > s3 ? t : s3, n2 = Number.parseInt(r32.toFixed(a3).replace(".", "")), i2 = Number.parseInt(e.toFixed(a3).replace(".", ""));
  return n2 % i2 / 10 ** a3;
}
__name(ot3, "ot");
var L4 = class r5 extends _7 {
  static {
    __name(this, "r");
  }
  constructor() {
    super(...arguments), this.min = this.gte, this.max = this.lte, this.step = this.multipleOf;
  }
  _parse(e) {
    if (this._def.coerce && (e.data = Number(e.data)), this._getType(e) !== u3.number) {
      let n2 = this._getOrReturnCtx(e);
      return d4(n2, { code: c3.invalid_type, expected: u3.number, received: n2.parsedType }), p2;
    }
    let s3, a3 = new x6();
    for (let n2 of this._def.checks) n2.kind === "int" ? g6.isInteger(e.data) || (s3 = this._getOrReturnCtx(e, s3), d4(s3, { code: c3.invalid_type, expected: "integer", received: "float", message: n2.message }), a3.dirty()) : n2.kind === "min" ? (n2.inclusive ? e.data < n2.value : e.data <= n2.value) && (s3 = this._getOrReturnCtx(e, s3), d4(s3, { code: c3.too_small, minimum: n2.value, type: "number", inclusive: n2.inclusive, exact: false, message: n2.message }), a3.dirty()) : n2.kind === "max" ? (n2.inclusive ? e.data > n2.value : e.data >= n2.value) && (s3 = this._getOrReturnCtx(e, s3), d4(s3, { code: c3.too_big, maximum: n2.value, type: "number", inclusive: n2.inclusive, exact: false, message: n2.message }), a3.dirty()) : n2.kind === "multipleOf" ? ot3(e.data, n2.value) !== 0 && (s3 = this._getOrReturnCtx(e, s3), d4(s3, { code: c3.not_multiple_of, multipleOf: n2.value, message: n2.message }), a3.dirty()) : n2.kind === "finite" ? Number.isFinite(e.data) || (s3 = this._getOrReturnCtx(e, s3), d4(s3, { code: c3.not_finite, message: n2.message }), a3.dirty()) : g6.assertNever(n2);
    return { status: a3.value, value: e.data };
  }
  gte(e, t) {
    return this.setLimit("min", e, true, h5.toString(t));
  }
  gt(e, t) {
    return this.setLimit("min", e, false, h5.toString(t));
  }
  lte(e, t) {
    return this.setLimit("max", e, true, h5.toString(t));
  }
  lt(e, t) {
    return this.setLimit("max", e, false, h5.toString(t));
  }
  setLimit(e, t, s3, a3) {
    return new r5({ ...this._def, checks: [...this._def.checks, { kind: e, value: t, inclusive: s3, message: h5.toString(a3) }] });
  }
  _addCheck(e) {
    return new r5({ ...this._def, checks: [...this._def.checks, e] });
  }
  int(e) {
    return this._addCheck({ kind: "int", message: h5.toString(e) });
  }
  positive(e) {
    return this._addCheck({ kind: "min", value: 0, inclusive: false, message: h5.toString(e) });
  }
  negative(e) {
    return this._addCheck({ kind: "max", value: 0, inclusive: false, message: h5.toString(e) });
  }
  nonpositive(e) {
    return this._addCheck({ kind: "max", value: 0, inclusive: true, message: h5.toString(e) });
  }
  nonnegative(e) {
    return this._addCheck({ kind: "min", value: 0, inclusive: true, message: h5.toString(e) });
  }
  multipleOf(e, t) {
    return this._addCheck({ kind: "multipleOf", value: e, message: h5.toString(t) });
  }
  finite(e) {
    return this._addCheck({ kind: "finite", message: h5.toString(e) });
  }
  safe(e) {
    return this._addCheck({ kind: "min", inclusive: true, value: Number.MIN_SAFE_INTEGER, message: h5.toString(e) })._addCheck({ kind: "max", inclusive: true, value: Number.MAX_SAFE_INTEGER, message: h5.toString(e) });
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
    for (let s3 of this._def.checks) {
      if (s3.kind === "finite" || s3.kind === "int" || s3.kind === "multipleOf") return true;
      s3.kind === "min" ? (t === null || s3.value > t) && (t = s3.value) : s3.kind === "max" && (e === null || s3.value < e) && (e = s3.value);
    }
    return Number.isFinite(t) && Number.isFinite(e);
  }
};
L4.create = (r32) => new L4({ checks: [], typeName: m4.ZodNumber, coerce: r32?.coerce || false, ...y5(r32) });
var U4 = class r6 extends _7 {
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
    let s3, a3 = new x6();
    for (let n2 of this._def.checks) n2.kind === "min" ? (n2.inclusive ? e.data < n2.value : e.data <= n2.value) && (s3 = this._getOrReturnCtx(e, s3), d4(s3, { code: c3.too_small, type: "bigint", minimum: n2.value, inclusive: n2.inclusive, message: n2.message }), a3.dirty()) : n2.kind === "max" ? (n2.inclusive ? e.data > n2.value : e.data >= n2.value) && (s3 = this._getOrReturnCtx(e, s3), d4(s3, { code: c3.too_big, type: "bigint", maximum: n2.value, inclusive: n2.inclusive, message: n2.message }), a3.dirty()) : n2.kind === "multipleOf" ? e.data % n2.value !== BigInt(0) && (s3 = this._getOrReturnCtx(e, s3), d4(s3, { code: c3.not_multiple_of, multipleOf: n2.value, message: n2.message }), a3.dirty()) : g6.assertNever(n2);
    return { status: a3.value, value: e.data };
  }
  _getInvalidInput(e) {
    let t = this._getOrReturnCtx(e);
    return d4(t, { code: c3.invalid_type, expected: u3.bigint, received: t.parsedType }), p2;
  }
  gte(e, t) {
    return this.setLimit("min", e, true, h5.toString(t));
  }
  gt(e, t) {
    return this.setLimit("min", e, false, h5.toString(t));
  }
  lte(e, t) {
    return this.setLimit("max", e, true, h5.toString(t));
  }
  lt(e, t) {
    return this.setLimit("max", e, false, h5.toString(t));
  }
  setLimit(e, t, s3, a3) {
    return new r6({ ...this._def, checks: [...this._def.checks, { kind: e, value: t, inclusive: s3, message: h5.toString(a3) }] });
  }
  _addCheck(e) {
    return new r6({ ...this._def, checks: [...this._def.checks, e] });
  }
  positive(e) {
    return this._addCheck({ kind: "min", value: BigInt(0), inclusive: false, message: h5.toString(e) });
  }
  negative(e) {
    return this._addCheck({ kind: "max", value: BigInt(0), inclusive: false, message: h5.toString(e) });
  }
  nonpositive(e) {
    return this._addCheck({ kind: "max", value: BigInt(0), inclusive: true, message: h5.toString(e) });
  }
  nonnegative(e) {
    return this._addCheck({ kind: "min", value: BigInt(0), inclusive: true, message: h5.toString(e) });
  }
  multipleOf(e, t) {
    return this._addCheck({ kind: "multipleOf", value: e, message: h5.toString(t) });
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
U4.create = (r32) => new U4({ checks: [], typeName: m4.ZodBigInt, coerce: r32?.coerce ?? false, ...y5(r32) });
var F4 = class extends _7 {
  static {
    __name(this, "F");
  }
  _parse(e) {
    if (this._def.coerce && (e.data = !!e.data), this._getType(e) !== u3.boolean) {
      let s3 = this._getOrReturnCtx(e);
      return d4(s3, { code: c3.invalid_type, expected: u3.boolean, received: s3.parsedType }), p2;
    }
    return k4(e.data);
  }
};
F4.create = (r32) => new F4({ typeName: m4.ZodBoolean, coerce: r32?.coerce || false, ...y5(r32) });
var B5 = class r7 extends _7 {
  static {
    __name(this, "r");
  }
  _parse(e) {
    if (this._def.coerce && (e.data = new Date(e.data)), this._getType(e) !== u3.date) {
      let n2 = this._getOrReturnCtx(e);
      return d4(n2, { code: c3.invalid_type, expected: u3.date, received: n2.parsedType }), p2;
    }
    if (Number.isNaN(e.data.getTime())) {
      let n2 = this._getOrReturnCtx(e);
      return d4(n2, { code: c3.invalid_date }), p2;
    }
    let s3 = new x6(), a3;
    for (let n2 of this._def.checks) n2.kind === "min" ? e.data.getTime() < n2.value && (a3 = this._getOrReturnCtx(e, a3), d4(a3, { code: c3.too_small, message: n2.message, inclusive: true, exact: false, minimum: n2.value, type: "date" }), s3.dirty()) : n2.kind === "max" ? e.data.getTime() > n2.value && (a3 = this._getOrReturnCtx(e, a3), d4(a3, { code: c3.too_big, message: n2.message, inclusive: true, exact: false, maximum: n2.value, type: "date" }), s3.dirty()) : g6.assertNever(n2);
    return { status: s3.value, value: new Date(e.data.getTime()) };
  }
  _addCheck(e) {
    return new r7({ ...this._def, checks: [...this._def.checks, e] });
  }
  min(e, t) {
    return this._addCheck({ kind: "min", value: e.getTime(), message: h5.toString(t) });
  }
  max(e, t) {
    return this._addCheck({ kind: "max", value: e.getTime(), message: h5.toString(t) });
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
B5.create = (r32) => new B5({ checks: [], coerce: r32?.coerce || false, typeName: m4.ZodDate, ...y5(r32) });
var ne3 = class extends _7 {
  static {
    __name(this, "ne");
  }
  _parse(e) {
    if (this._getType(e) !== u3.symbol) {
      let s3 = this._getOrReturnCtx(e);
      return d4(s3, { code: c3.invalid_type, expected: u3.symbol, received: s3.parsedType }), p2;
    }
    return k4(e.data);
  }
};
ne3.create = (r32) => new ne3({ typeName: m4.ZodSymbol, ...y5(r32) });
var W6 = class extends _7 {
  static {
    __name(this, "W");
  }
  _parse(e) {
    if (this._getType(e) !== u3.undefined) {
      let s3 = this._getOrReturnCtx(e);
      return d4(s3, { code: c3.invalid_type, expected: u3.undefined, received: s3.parsedType }), p2;
    }
    return k4(e.data);
  }
};
W6.create = (r32) => new W6({ typeName: m4.ZodUndefined, ...y5(r32) });
var q5 = class extends _7 {
  static {
    __name(this, "q");
  }
  _parse(e) {
    if (this._getType(e) !== u3.null) {
      let s3 = this._getOrReturnCtx(e);
      return d4(s3, { code: c3.invalid_type, expected: u3.null, received: s3.parsedType }), p2;
    }
    return k4(e.data);
  }
};
q5.create = (r32) => new q5({ typeName: m4.ZodNull, ...y5(r32) });
var P2 = class extends _7 {
  static {
    __name(this, "P");
  }
  constructor() {
    super(...arguments), this._any = true;
  }
  _parse(e) {
    return k4(e.data);
  }
};
P2.create = (r32) => new P2({ typeName: m4.ZodAny, ...y5(r32) });
var Z2 = class extends _7 {
  static {
    __name(this, "Z");
  }
  constructor() {
    super(...arguments), this._unknown = true;
  }
  _parse(e) {
    return k4(e.data);
  }
};
Z2.create = (r32) => new Z2({ typeName: m4.ZodUnknown, ...y5(r32) });
var A4 = class extends _7 {
  static {
    __name(this, "A");
  }
  _parse(e) {
    let t = this._getOrReturnCtx(e);
    return d4(t, { code: c3.invalid_type, expected: u3.never, received: t.parsedType }), p2;
  }
};
A4.create = (r32) => new A4({ typeName: m4.ZodNever, ...y5(r32) });
var ie3 = class extends _7 {
  static {
    __name(this, "ie");
  }
  _parse(e) {
    if (this._getType(e) !== u3.undefined) {
      let s3 = this._getOrReturnCtx(e);
      return d4(s3, { code: c3.invalid_type, expected: u3.void, received: s3.parsedType }), p2;
    }
    return k4(e.data);
  }
};
ie3.create = (r32) => new ie3({ typeName: m4.ZodVoid, ...y5(r32) });
var $3 = class r8 extends _7 {
  static {
    __name(this, "r");
  }
  _parse(e) {
    let { ctx: t, status: s3 } = this._processInputParams(e), a3 = this._def;
    if (t.parsedType !== u3.array) return d4(t, { code: c3.invalid_type, expected: u3.array, received: t.parsedType }), p2;
    if (a3.exactLength !== null) {
      let i2 = t.data.length > a3.exactLength.value, o6 = t.data.length < a3.exactLength.value;
      (i2 || o6) && (d4(t, { code: i2 ? c3.too_big : c3.too_small, minimum: o6 ? a3.exactLength.value : void 0, maximum: i2 ? a3.exactLength.value : void 0, type: "array", inclusive: true, exact: true, message: a3.exactLength.message }), s3.dirty());
    }
    if (a3.minLength !== null && t.data.length < a3.minLength.value && (d4(t, { code: c3.too_small, minimum: a3.minLength.value, type: "array", inclusive: true, exact: false, message: a3.minLength.message }), s3.dirty()), a3.maxLength !== null && t.data.length > a3.maxLength.value && (d4(t, { code: c3.too_big, maximum: a3.maxLength.value, type: "array", inclusive: true, exact: false, message: a3.maxLength.message }), s3.dirty()), t.common.async) return Promise.all([...t.data].map((i2, o6) => a3.type._parseAsync(new O4(t, i2, t.path, o6)))).then((i2) => x6.mergeArray(s3, i2));
    let n2 = [...t.data].map((i2, o6) => a3.type._parseSync(new O4(t, i2, t.path, o6)));
    return x6.mergeArray(s3, n2);
  }
  get element() {
    return this._def.type;
  }
  min(e, t) {
    return new r8({ ...this._def, minLength: { value: e, message: h5.toString(t) } });
  }
  max(e, t) {
    return new r8({ ...this._def, maxLength: { value: e, message: h5.toString(t) } });
  }
  length(e, t) {
    return new r8({ ...this._def, exactLength: { value: e, message: h5.toString(t) } });
  }
  nonempty(e) {
    return this.min(1, e);
  }
};
$3.create = (r32, e) => new $3({ type: r32, minLength: null, maxLength: null, exactLength: null, typeName: m4.ZodArray, ...y5(e) });
function ae3(r32) {
  if (r32 instanceof w5) {
    let e = {};
    for (let t in r32.shape) {
      let s3 = r32.shape[t];
      e[t] = C3.create(ae3(s3));
    }
    return new w5({ ...r32._def, shape: /* @__PURE__ */ __name(() => e, "shape") });
  } else return r32 instanceof $3 ? new $3({ ...r32._def, type: ae3(r32.element) }) : r32 instanceof C3 ? C3.create(ae3(r32.unwrap())) : r32 instanceof j5 ? j5.create(ae3(r32.unwrap())) : r32 instanceof N3 ? N3.create(r32.items.map((e) => ae3(e))) : r32;
}
__name(ae3, "ae");
var w5 = class r9 extends _7 {
  static {
    __name(this, "r");
  }
  constructor() {
    super(...arguments), this._cached = null, this.nonstrict = this.passthrough, this.augment = this.extend;
  }
  _getCached() {
    if (this._cached !== null) return this._cached;
    let e = this._def.shape(), t = g6.objectKeys(e);
    return this._cached = { shape: e, keys: t }, this._cached;
  }
  _parse(e) {
    if (this._getType(e) !== u3.object) {
      let l5 = this._getOrReturnCtx(e);
      return d4(l5, { code: c3.invalid_type, expected: u3.object, received: l5.parsedType }), p2;
    }
    let { status: s3, ctx: a3 } = this._processInputParams(e), { shape: n2, keys: i2 } = this._getCached(), o6 = [];
    if (!(this._def.catchall instanceof A4 && this._def.unknownKeys === "strip")) for (let l5 in a3.data) i2.includes(l5) || o6.push(l5);
    let f4 = [];
    for (let l5 of i2) {
      let v6 = n2[l5], T9 = a3.data[l5];
      f4.push({ key: { status: "valid", value: l5 }, value: v6._parse(new O4(a3, T9, a3.path, l5)), alwaysSet: l5 in a3.data });
    }
    if (this._def.catchall instanceof A4) {
      let l5 = this._def.unknownKeys;
      if (l5 === "passthrough") for (let v6 of o6) f4.push({ key: { status: "valid", value: v6 }, value: { status: "valid", value: a3.data[v6] } });
      else if (l5 === "strict") o6.length > 0 && (d4(a3, { code: c3.unrecognized_keys, keys: o6 }), s3.dirty());
      else if (l5 !== "strip") throw new Error("Internal ZodObject error: invalid unknownKeys value.");
    } else {
      let l5 = this._def.catchall;
      for (let v6 of o6) {
        let T9 = a3.data[v6];
        f4.push({ key: { status: "valid", value: v6 }, value: l5._parse(new O4(a3, T9, a3.path, v6)), alwaysSet: v6 in a3.data });
      }
    }
    return a3.common.async ? Promise.resolve().then(async () => {
      let l5 = [];
      for (let v6 of f4) {
        let T9 = await v6.key, we3 = await v6.value;
        l5.push({ key: T9, value: we3, alwaysSet: v6.alwaysSet });
      }
      return l5;
    }).then((l5) => x6.mergeObjectSync(s3, l5)) : x6.mergeObjectSync(s3, f4);
  }
  get shape() {
    return this._def.shape();
  }
  strict(e) {
    return h5.errToObj, new r9({ ...this._def, unknownKeys: "strict", ...e !== void 0 ? { errorMap: /* @__PURE__ */ __name((t, s3) => {
      let a3 = this._def.errorMap?.(t, s3).message ?? s3.defaultError;
      return t.code === "unrecognized_keys" ? { message: h5.errToObj(e).message ?? a3 } : { message: a3 };
    }, "errorMap") } : {} });
  }
  strip() {
    return new r9({ ...this._def, unknownKeys: "strip" });
  }
  passthrough() {
    return new r9({ ...this._def, unknownKeys: "passthrough" });
  }
  extend(e) {
    return new r9({ ...this._def, shape: /* @__PURE__ */ __name(() => ({ ...this._def.shape(), ...e }), "shape") });
  }
  merge(e) {
    return new r9({ unknownKeys: e._def.unknownKeys, catchall: e._def.catchall, shape: /* @__PURE__ */ __name(() => ({ ...this._def.shape(), ...e._def.shape() }), "shape"), typeName: m4.ZodObject });
  }
  setKey(e, t) {
    return this.augment({ [e]: t });
  }
  catchall(e) {
    return new r9({ ...this._def, catchall: e });
  }
  pick(e) {
    let t = {};
    for (let s3 of g6.objectKeys(e)) e[s3] && this.shape[s3] && (t[s3] = this.shape[s3]);
    return new r9({ ...this._def, shape: /* @__PURE__ */ __name(() => t, "shape") });
  }
  omit(e) {
    let t = {};
    for (let s3 of g6.objectKeys(this.shape)) e[s3] || (t[s3] = this.shape[s3]);
    return new r9({ ...this._def, shape: /* @__PURE__ */ __name(() => t, "shape") });
  }
  deepPartial() {
    return ae3(this);
  }
  partial(e) {
    let t = {};
    for (let s3 of g6.objectKeys(this.shape)) {
      let a3 = this.shape[s3];
      e && !e[s3] ? t[s3] = a3 : t[s3] = a3.optional();
    }
    return new r9({ ...this._def, shape: /* @__PURE__ */ __name(() => t, "shape") });
  }
  required(e) {
    let t = {};
    for (let s3 of g6.objectKeys(this.shape)) if (e && !e[s3]) t[s3] = this.shape[s3];
    else {
      let n2 = this.shape[s3];
      for (; n2 instanceof C3; ) n2 = n2._def.innerType;
      t[s3] = n2;
    }
    return new r9({ ...this._def, shape: /* @__PURE__ */ __name(() => t, "shape") });
  }
  keyof() {
    return Ne2(g6.objectKeys(this.shape));
  }
};
w5.create = (r32, e) => new w5({ shape: /* @__PURE__ */ __name(() => r32, "shape"), unknownKeys: "strip", catchall: A4.create(), typeName: m4.ZodObject, ...y5(e) });
w5.strictCreate = (r32, e) => new w5({ shape: /* @__PURE__ */ __name(() => r32, "shape"), unknownKeys: "strict", catchall: A4.create(), typeName: m4.ZodObject, ...y5(e) });
w5.lazycreate = (r32, e) => new w5({ shape: r32, unknownKeys: "strip", catchall: A4.create(), typeName: m4.ZodObject, ...y5(e) });
var J4 = class extends _7 {
  static {
    __name(this, "J");
  }
  _parse(e) {
    let { ctx: t } = this._processInputParams(e), s3 = this._def.options;
    function a3(n2) {
      for (let o6 of n2) if (o6.result.status === "valid") return o6.result;
      for (let o6 of n2) if (o6.result.status === "dirty") return t.common.issues.push(...o6.ctx.common.issues), o6.result;
      let i2 = n2.map((o6) => new b4(o6.ctx.common.issues));
      return d4(t, { code: c3.invalid_union, unionErrors: i2 }), p2;
    }
    __name(a3, "a");
    if (t.common.async) return Promise.all(s3.map(async (n2) => {
      let i2 = { ...t, common: { ...t.common, issues: [] }, parent: null };
      return { result: await n2._parseAsync({ data: t.data, path: t.path, parent: i2 }), ctx: i2 };
    })).then(a3);
    {
      let n2, i2 = [];
      for (let f4 of s3) {
        let l5 = { ...t, common: { ...t.common, issues: [] }, parent: null }, v6 = f4._parseSync({ data: t.data, path: t.path, parent: l5 });
        if (v6.status === "valid") return v6;
        v6.status === "dirty" && !n2 && (n2 = { result: v6, ctx: l5 }), l5.common.issues.length && i2.push(l5.common.issues);
      }
      if (n2) return t.common.issues.push(...n2.ctx.common.issues), n2.result;
      let o6 = i2.map((f4) => new b4(f4));
      return d4(t, { code: c3.invalid_union, unionErrors: o6 }), p2;
    }
  }
  get options() {
    return this._def.options;
  }
};
J4.create = (r32, e) => new J4({ options: r32, typeName: m4.ZodUnion, ...y5(e) });
var E5 = /* @__PURE__ */ __name((r32) => r32 instanceof H3 ? E5(r32.schema) : r32 instanceof S6 ? E5(r32.innerType()) : r32 instanceof G4 ? [r32.value] : r32 instanceof Q4 ? r32.options : r32 instanceof X4 ? g6.objectValues(r32.enum) : r32 instanceof K4 ? E5(r32._def.innerType) : r32 instanceof W6 ? [void 0] : r32 instanceof q5 ? [null] : r32 instanceof C3 ? [void 0, ...E5(r32.unwrap())] : r32 instanceof j5 ? [null, ...E5(r32.unwrap())] : r32 instanceof le3 || r32 instanceof te3 ? E5(r32.unwrap()) : r32 instanceof ee2 ? E5(r32._def.innerType) : [], "E");
var me3 = class r10 extends _7 {
  static {
    __name(this, "r");
  }
  _parse(e) {
    let { ctx: t } = this._processInputParams(e);
    if (t.parsedType !== u3.object) return d4(t, { code: c3.invalid_type, expected: u3.object, received: t.parsedType }), p2;
    let s3 = this.discriminator, a3 = t.data[s3], n2 = this.optionsMap.get(a3);
    return n2 ? t.common.async ? n2._parseAsync({ data: t.data, path: t.path, parent: t }) : n2._parseSync({ data: t.data, path: t.path, parent: t }) : (d4(t, { code: c3.invalid_union_discriminator, options: Array.from(this.optionsMap.keys()), path: [s3] }), p2);
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
  static create(e, t, s3) {
    let a3 = /* @__PURE__ */ new Map();
    for (let n2 of t) {
      let i2 = E5(n2.shape[e]);
      if (!i2.length) throw new Error(`A discriminator value for key \`${e}\` could not be extracted from all schema options`);
      for (let o6 of i2) {
        if (a3.has(o6)) throw new Error(`Discriminator property ${String(e)} has duplicate value ${String(o6)}`);
        a3.set(o6, n2);
      }
    }
    return new r10({ typeName: m4.ZodDiscriminatedUnion, discriminator: e, options: t, optionsMap: a3, ...y5(s3) });
  }
};
function ke2(r32, e) {
  let t = R4(r32), s3 = R4(e);
  if (r32 === e) return { valid: true, data: r32 };
  if (t === u3.object && s3 === u3.object) {
    let a3 = g6.objectKeys(e), n2 = g6.objectKeys(r32).filter((o6) => a3.indexOf(o6) !== -1), i2 = { ...r32, ...e };
    for (let o6 of n2) {
      let f4 = ke2(r32[o6], e[o6]);
      if (!f4.valid) return { valid: false };
      i2[o6] = f4.data;
    }
    return { valid: true, data: i2 };
  } else if (t === u3.array && s3 === u3.array) {
    if (r32.length !== e.length) return { valid: false };
    let a3 = [];
    for (let n2 = 0; n2 < r32.length; n2++) {
      let i2 = r32[n2], o6 = e[n2], f4 = ke2(i2, o6);
      if (!f4.valid) return { valid: false };
      a3.push(f4.data);
    }
    return { valid: true, data: a3 };
  } else return t === u3.date && s3 === u3.date && +r32 == +e ? { valid: true, data: r32 } : { valid: false };
}
__name(ke2, "ke");
var Y2 = class extends _7 {
  static {
    __name(this, "Y");
  }
  _parse(e) {
    let { status: t, ctx: s3 } = this._processInputParams(e), a3 = /* @__PURE__ */ __name((n2, i2) => {
      if (he3(n2) || he3(i2)) return p2;
      let o6 = ke2(n2.value, i2.value);
      return o6.valid ? ((pe3(n2) || pe3(i2)) && t.dirty(), { status: t.value, value: o6.data }) : (d4(s3, { code: c3.invalid_intersection_types }), p2);
    }, "a");
    return s3.common.async ? Promise.all([this._def.left._parseAsync({ data: s3.data, path: s3.path, parent: s3 }), this._def.right._parseAsync({ data: s3.data, path: s3.path, parent: s3 })]).then(([n2, i2]) => a3(n2, i2)) : a3(this._def.left._parseSync({ data: s3.data, path: s3.path, parent: s3 }), this._def.right._parseSync({ data: s3.data, path: s3.path, parent: s3 }));
  }
};
Y2.create = (r32, e, t) => new Y2({ left: r32, right: e, typeName: m4.ZodIntersection, ...y5(t) });
var N3 = class r11 extends _7 {
  static {
    __name(this, "r");
  }
  _parse(e) {
    let { status: t, ctx: s3 } = this._processInputParams(e);
    if (s3.parsedType !== u3.array) return d4(s3, { code: c3.invalid_type, expected: u3.array, received: s3.parsedType }), p2;
    if (s3.data.length < this._def.items.length) return d4(s3, { code: c3.too_small, minimum: this._def.items.length, inclusive: true, exact: false, type: "array" }), p2;
    !this._def.rest && s3.data.length > this._def.items.length && (d4(s3, { code: c3.too_big, maximum: this._def.items.length, inclusive: true, exact: false, type: "array" }), t.dirty());
    let n2 = [...s3.data].map((i2, o6) => {
      let f4 = this._def.items[o6] || this._def.rest;
      return f4 ? f4._parse(new O4(s3, i2, s3.path, o6)) : null;
    }).filter((i2) => !!i2);
    return s3.common.async ? Promise.all(n2).then((i2) => x6.mergeArray(t, i2)) : x6.mergeArray(t, n2);
  }
  get items() {
    return this._def.items;
  }
  rest(e) {
    return new r11({ ...this._def, rest: e });
  }
};
N3.create = (r32, e) => {
  if (!Array.isArray(r32)) throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
  return new N3({ items: r32, typeName: m4.ZodTuple, rest: null, ...y5(e) });
};
var ye3 = class r12 extends _7 {
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
    let { status: t, ctx: s3 } = this._processInputParams(e);
    if (s3.parsedType !== u3.object) return d4(s3, { code: c3.invalid_type, expected: u3.object, received: s3.parsedType }), p2;
    let a3 = [], n2 = this._def.keyType, i2 = this._def.valueType;
    for (let o6 in s3.data) a3.push({ key: n2._parse(new O4(s3, o6, s3.path, o6)), value: i2._parse(new O4(s3, s3.data[o6], s3.path, o6)), alwaysSet: o6 in s3.data });
    return s3.common.async ? x6.mergeObjectAsync(t, a3) : x6.mergeObjectSync(t, a3);
  }
  get element() {
    return this._def.valueType;
  }
  static create(e, t, s3) {
    return t instanceof _7 ? new r12({ keyType: e, valueType: t, typeName: m4.ZodRecord, ...y5(s3) }) : new r12({ keyType: V4.create(), valueType: e, typeName: m4.ZodRecord, ...y5(t) });
  }
};
var oe3 = class extends _7 {
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
    let { status: t, ctx: s3 } = this._processInputParams(e);
    if (s3.parsedType !== u3.map) return d4(s3, { code: c3.invalid_type, expected: u3.map, received: s3.parsedType }), p2;
    let a3 = this._def.keyType, n2 = this._def.valueType, i2 = [...s3.data.entries()].map(([o6, f4], l5) => ({ key: a3._parse(new O4(s3, o6, s3.path, [l5, "key"])), value: n2._parse(new O4(s3, f4, s3.path, [l5, "value"])) }));
    if (s3.common.async) {
      let o6 = /* @__PURE__ */ new Map();
      return Promise.resolve().then(async () => {
        for (let f4 of i2) {
          let l5 = await f4.key, v6 = await f4.value;
          if (l5.status === "aborted" || v6.status === "aborted") return p2;
          (l5.status === "dirty" || v6.status === "dirty") && t.dirty(), o6.set(l5.value, v6.value);
        }
        return { status: t.value, value: o6 };
      });
    } else {
      let o6 = /* @__PURE__ */ new Map();
      for (let f4 of i2) {
        let l5 = f4.key, v6 = f4.value;
        if (l5.status === "aborted" || v6.status === "aborted") return p2;
        (l5.status === "dirty" || v6.status === "dirty") && t.dirty(), o6.set(l5.value, v6.value);
      }
      return { status: t.value, value: o6 };
    }
  }
};
oe3.create = (r32, e, t) => new oe3({ valueType: e, keyType: r32, typeName: m4.ZodMap, ...y5(t) });
var ce3 = class r13 extends _7 {
  static {
    __name(this, "r");
  }
  _parse(e) {
    let { status: t, ctx: s3 } = this._processInputParams(e);
    if (s3.parsedType !== u3.set) return d4(s3, { code: c3.invalid_type, expected: u3.set, received: s3.parsedType }), p2;
    let a3 = this._def;
    a3.minSize !== null && s3.data.size < a3.minSize.value && (d4(s3, { code: c3.too_small, minimum: a3.minSize.value, type: "set", inclusive: true, exact: false, message: a3.minSize.message }), t.dirty()), a3.maxSize !== null && s3.data.size > a3.maxSize.value && (d4(s3, { code: c3.too_big, maximum: a3.maxSize.value, type: "set", inclusive: true, exact: false, message: a3.maxSize.message }), t.dirty());
    let n2 = this._def.valueType;
    function i2(f4) {
      let l5 = /* @__PURE__ */ new Set();
      for (let v6 of f4) {
        if (v6.status === "aborted") return p2;
        v6.status === "dirty" && t.dirty(), l5.add(v6.value);
      }
      return { status: t.value, value: l5 };
    }
    __name(i2, "i");
    let o6 = [...s3.data.values()].map((f4, l5) => n2._parse(new O4(s3, f4, s3.path, l5)));
    return s3.common.async ? Promise.all(o6).then((f4) => i2(f4)) : i2(o6);
  }
  min(e, t) {
    return new r13({ ...this._def, minSize: { value: e, message: h5.toString(t) } });
  }
  max(e, t) {
    return new r13({ ...this._def, maxSize: { value: e, message: h5.toString(t) } });
  }
  size(e, t) {
    return this.min(e, t).max(e, t);
  }
  nonempty(e) {
    return this.min(1, e);
  }
};
ce3.create = (r32, e) => new ce3({ valueType: r32, minSize: null, maxSize: null, typeName: m4.ZodSet, ...y5(e) });
var _e3 = class r14 extends _7 {
  static {
    __name(this, "r");
  }
  constructor() {
    super(...arguments), this.validate = this.implement;
  }
  _parse(e) {
    let { ctx: t } = this._processInputParams(e);
    if (t.parsedType !== u3.function) return d4(t, { code: c3.invalid_type, expected: u3.function, received: t.parsedType }), p2;
    function s3(o6, f4) {
      return ue3({ data: o6, path: t.path, errorMaps: [t.common.contextualErrorMap, t.schemaErrorMap, re2(), I7].filter((l5) => !!l5), issueData: { code: c3.invalid_arguments, argumentsError: f4 } });
    }
    __name(s3, "s");
    function a3(o6, f4) {
      return ue3({ data: o6, path: t.path, errorMaps: [t.common.contextualErrorMap, t.schemaErrorMap, re2(), I7].filter((l5) => !!l5), issueData: { code: c3.invalid_return_type, returnTypeError: f4 } });
    }
    __name(a3, "a");
    let n2 = { errorMap: t.common.contextualErrorMap }, i2 = t.data;
    if (this._def.returns instanceof z4) {
      let o6 = this;
      return k4(async function(...f4) {
        let l5 = new b4([]), v6 = await o6._def.args.parseAsync(f4, n2).catch((ge5) => {
          throw l5.addIssue(s3(f4, ge5)), l5;
        }), T9 = await Reflect.apply(i2, this, v6);
        return await o6._def.returns._def.type.parseAsync(T9, n2).catch((ge5) => {
          throw l5.addIssue(a3(T9, ge5)), l5;
        });
      });
    } else {
      let o6 = this;
      return k4(function(...f4) {
        let l5 = o6._def.args.safeParse(f4, n2);
        if (!l5.success) throw new b4([s3(f4, l5.error)]);
        let v6 = Reflect.apply(i2, this, l5.data), T9 = o6._def.returns.safeParse(v6, n2);
        if (!T9.success) throw new b4([a3(v6, T9.error)]);
        return T9.data;
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
    return new r14({ ...this._def, args: N3.create(e).rest(Z2.create()) });
  }
  returns(e) {
    return new r14({ ...this._def, returns: e });
  }
  implement(e) {
    return this.parse(e);
  }
  strictImplement(e) {
    return this.parse(e);
  }
  static create(e, t, s3) {
    return new r14({ args: e || N3.create([]).rest(Z2.create()), returns: t || Z2.create(), typeName: m4.ZodFunction, ...y5(s3) });
  }
};
var H3 = class extends _7 {
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
H3.create = (r32, e) => new H3({ getter: r32, typeName: m4.ZodLazy, ...y5(e) });
var G4 = class extends _7 {
  static {
    __name(this, "G");
  }
  _parse(e) {
    if (e.data !== this._def.value) {
      let t = this._getOrReturnCtx(e);
      return d4(t, { received: t.data, code: c3.invalid_literal, expected: this._def.value }), p2;
    }
    return { status: "valid", value: e.data };
  }
  get value() {
    return this._def.value;
  }
};
G4.create = (r32, e) => new G4({ value: r32, typeName: m4.ZodLiteral, ...y5(e) });
function Ne2(r32, e) {
  return new Q4({ values: r32, typeName: m4.ZodEnum, ...y5(e) });
}
__name(Ne2, "Ne");
var Q4 = class r15 extends _7 {
  static {
    __name(this, "r");
  }
  _parse(e) {
    if (typeof e.data != "string") {
      let t = this._getOrReturnCtx(e), s3 = this._def.values;
      return d4(t, { expected: g6.joinValues(s3), received: t.parsedType, code: c3.invalid_type }), p2;
    }
    if (this._cache || (this._cache = new Set(this._def.values)), !this._cache.has(e.data)) {
      let t = this._getOrReturnCtx(e), s3 = this._def.values;
      return d4(t, { received: t.data, code: c3.invalid_enum_value, options: s3 }), p2;
    }
    return k4(e.data);
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
    return r15.create(e, { ...this._def, ...t });
  }
  exclude(e, t = this._def) {
    return r15.create(this.options.filter((s3) => !e.includes(s3)), { ...this._def, ...t });
  }
};
Q4.create = Ne2;
var X4 = class extends _7 {
  static {
    __name(this, "X");
  }
  _parse(e) {
    let t = g6.getValidEnumValues(this._def.values), s3 = this._getOrReturnCtx(e);
    if (s3.parsedType !== u3.string && s3.parsedType !== u3.number) {
      let a3 = g6.objectValues(t);
      return d4(s3, { expected: g6.joinValues(a3), received: s3.parsedType, code: c3.invalid_type }), p2;
    }
    if (this._cache || (this._cache = new Set(g6.getValidEnumValues(this._def.values))), !this._cache.has(e.data)) {
      let a3 = g6.objectValues(t);
      return d4(s3, { received: s3.data, code: c3.invalid_enum_value, options: a3 }), p2;
    }
    return k4(e.data);
  }
  get enum() {
    return this._def.values;
  }
};
X4.create = (r32, e) => new X4({ values: r32, typeName: m4.ZodNativeEnum, ...y5(e) });
var z4 = class extends _7 {
  static {
    __name(this, "z");
  }
  unwrap() {
    return this._def.type;
  }
  _parse(e) {
    let { ctx: t } = this._processInputParams(e);
    if (t.parsedType !== u3.promise && t.common.async === false) return d4(t, { code: c3.invalid_type, expected: u3.promise, received: t.parsedType }), p2;
    let s3 = t.parsedType === u3.promise ? t.data : Promise.resolve(t.data);
    return k4(s3.then((a3) => this._def.type.parseAsync(a3, { path: t.path, errorMap: t.common.contextualErrorMap })));
  }
};
z4.create = (r32, e) => new z4({ type: r32, typeName: m4.ZodPromise, ...y5(e) });
var S6 = class extends _7 {
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
    let { status: t, ctx: s3 } = this._processInputParams(e), a3 = this._def.effect || null, n2 = { addIssue: /* @__PURE__ */ __name((i2) => {
      d4(s3, i2), i2.fatal ? t.abort() : t.dirty();
    }, "addIssue"), get path() {
      return s3.path;
    } };
    if (n2.addIssue = n2.addIssue.bind(n2), a3.type === "preprocess") {
      let i2 = a3.transform(s3.data, n2);
      if (s3.common.async) return Promise.resolve(i2).then(async (o6) => {
        if (t.value === "aborted") return p2;
        let f4 = await this._def.schema._parseAsync({ data: o6, path: s3.path, parent: s3 });
        return f4.status === "aborted" ? p2 : f4.status === "dirty" ? D4(f4.value) : t.value === "dirty" ? D4(f4.value) : f4;
      });
      {
        if (t.value === "aborted") return p2;
        let o6 = this._def.schema._parseSync({ data: i2, path: s3.path, parent: s3 });
        return o6.status === "aborted" ? p2 : o6.status === "dirty" ? D4(o6.value) : t.value === "dirty" ? D4(o6.value) : o6;
      }
    }
    if (a3.type === "refinement") {
      let i2 = /* @__PURE__ */ __name((o6) => {
        let f4 = a3.refinement(o6, n2);
        if (s3.common.async) return Promise.resolve(f4);
        if (f4 instanceof Promise) throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
        return o6;
      }, "i");
      if (s3.common.async === false) {
        let o6 = this._def.schema._parseSync({ data: s3.data, path: s3.path, parent: s3 });
        return o6.status === "aborted" ? p2 : (o6.status === "dirty" && t.dirty(), i2(o6.value), { status: t.value, value: o6.value });
      } else return this._def.schema._parseAsync({ data: s3.data, path: s3.path, parent: s3 }).then((o6) => o6.status === "aborted" ? p2 : (o6.status === "dirty" && t.dirty(), i2(o6.value).then(() => ({ status: t.value, value: o6.value }))));
    }
    if (a3.type === "transform") if (s3.common.async === false) {
      let i2 = this._def.schema._parseSync({ data: s3.data, path: s3.path, parent: s3 });
      if (!M3(i2)) return p2;
      let o6 = a3.transform(i2.value, n2);
      if (o6 instanceof Promise) throw new Error("Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.");
      return { status: t.value, value: o6 };
    } else return this._def.schema._parseAsync({ data: s3.data, path: s3.path, parent: s3 }).then((i2) => M3(i2) ? Promise.resolve(a3.transform(i2.value, n2)).then((o6) => ({ status: t.value, value: o6 })) : p2);
    g6.assertNever(a3);
  }
};
S6.create = (r32, e, t) => new S6({ schema: r32, typeName: m4.ZodEffects, effect: e, ...y5(t) });
S6.createWithPreprocess = (r32, e, t) => new S6({ schema: e, effect: { type: "preprocess", transform: r32 }, typeName: m4.ZodEffects, ...y5(t) });
var C3 = class extends _7 {
  static {
    __name(this, "C");
  }
  _parse(e) {
    return this._getType(e) === u3.undefined ? k4(void 0) : this._def.innerType._parse(e);
  }
  unwrap() {
    return this._def.innerType;
  }
};
C3.create = (r32, e) => new C3({ innerType: r32, typeName: m4.ZodOptional, ...y5(e) });
var j5 = class extends _7 {
  static {
    __name(this, "j");
  }
  _parse(e) {
    return this._getType(e) === u3.null ? k4(null) : this._def.innerType._parse(e);
  }
  unwrap() {
    return this._def.innerType;
  }
};
j5.create = (r32, e) => new j5({ innerType: r32, typeName: m4.ZodNullable, ...y5(e) });
var K4 = class extends _7 {
  static {
    __name(this, "K");
  }
  _parse(e) {
    let { ctx: t } = this._processInputParams(e), s3 = t.data;
    return t.parsedType === u3.undefined && (s3 = this._def.defaultValue()), this._def.innerType._parse({ data: s3, path: t.path, parent: t });
  }
  removeDefault() {
    return this._def.innerType;
  }
};
K4.create = (r32, e) => new K4({ innerType: r32, typeName: m4.ZodDefault, defaultValue: typeof e.default == "function" ? e.default : () => e.default, ...y5(e) });
var ee2 = class extends _7 {
  static {
    __name(this, "ee");
  }
  _parse(e) {
    let { ctx: t } = this._processInputParams(e), s3 = { ...t, common: { ...t.common, issues: [] } }, a3 = this._def.innerType._parse({ data: s3.data, path: s3.path, parent: { ...s3 } });
    return se3(a3) ? a3.then((n2) => ({ status: "valid", value: n2.status === "valid" ? n2.value : this._def.catchValue({ get error() {
      return new b4(s3.common.issues);
    }, input: s3.data }) })) : { status: "valid", value: a3.status === "valid" ? a3.value : this._def.catchValue({ get error() {
      return new b4(s3.common.issues);
    }, input: s3.data }) };
  }
  removeCatch() {
    return this._def.innerType;
  }
};
ee2.create = (r32, e) => new ee2({ innerType: r32, typeName: m4.ZodCatch, catchValue: typeof e.catch == "function" ? e.catch : () => e.catch, ...y5(e) });
var de3 = class extends _7 {
  static {
    __name(this, "de");
  }
  _parse(e) {
    if (this._getType(e) !== u3.nan) {
      let s3 = this._getOrReturnCtx(e);
      return d4(s3, { code: c3.invalid_type, expected: u3.nan, received: s3.parsedType }), p2;
    }
    return { status: "valid", value: e.data };
  }
};
de3.create = (r32) => new de3({ typeName: m4.ZodNaN, ...y5(r32) });
var ct3 = Symbol("zod_brand");
var le3 = class extends _7 {
  static {
    __name(this, "le");
  }
  _parse(e) {
    let { ctx: t } = this._processInputParams(e), s3 = t.data;
    return this._def.type._parse({ data: s3, path: t.path, parent: t });
  }
  unwrap() {
    return this._def.type;
  }
};
var fe3 = class r16 extends _7 {
  static {
    __name(this, "r");
  }
  _parse(e) {
    let { status: t, ctx: s3 } = this._processInputParams(e);
    if (s3.common.async) return (async () => {
      let n2 = await this._def.in._parseAsync({ data: s3.data, path: s3.path, parent: s3 });
      return n2.status === "aborted" ? p2 : n2.status === "dirty" ? (t.dirty(), D4(n2.value)) : this._def.out._parseAsync({ data: n2.value, path: s3.path, parent: s3 });
    })();
    {
      let a3 = this._def.in._parseSync({ data: s3.data, path: s3.path, parent: s3 });
      return a3.status === "aborted" ? p2 : a3.status === "dirty" ? (t.dirty(), { status: "dirty", value: a3.value }) : this._def.out._parseSync({ data: a3.value, path: s3.path, parent: s3 });
    }
  }
  static create(e, t) {
    return new r16({ in: e, out: t, typeName: m4.ZodPipeline });
  }
};
var te3 = class extends _7 {
  static {
    __name(this, "te");
  }
  _parse(e) {
    let t = this._def.innerType._parse(e), s3 = /* @__PURE__ */ __name((a3) => (M3(a3) && (a3.value = Object.freeze(a3.value)), a3), "s");
    return se3(t) ? t.then((a3) => s3(a3)) : s3(t);
  }
  unwrap() {
    return this._def.innerType;
  }
};
te3.create = (r32, e) => new te3({ innerType: r32, typeName: m4.ZodReadonly, ...y5(e) });
function Oe3(r32, e) {
  let t = typeof r32 == "function" ? r32(e) : typeof r32 == "string" ? { message: r32 } : r32;
  return typeof t == "string" ? { message: t } : t;
}
__name(Oe3, "Oe");
function je3(r32, e = {}, t) {
  return r32 ? P2.create().superRefine((s3, a3) => {
    let n2 = r32(s3);
    if (n2 instanceof Promise) return n2.then((i2) => {
      if (!i2) {
        let o6 = Oe3(e, s3), f4 = o6.fatal ?? t ?? true;
        a3.addIssue({ code: "custom", ...o6, fatal: f4 });
      }
    });
    if (!n2) {
      let i2 = Oe3(e, s3), o6 = i2.fatal ?? t ?? true;
      a3.addIssue({ code: "custom", ...i2, fatal: o6 });
    }
  }) : P2.create();
}
__name(je3, "je");
var dt2 = { object: w5.lazycreate };
var m4;
(function(r32) {
  r32.ZodString = "ZodString", r32.ZodNumber = "ZodNumber", r32.ZodNaN = "ZodNaN", r32.ZodBigInt = "ZodBigInt", r32.ZodBoolean = "ZodBoolean", r32.ZodDate = "ZodDate", r32.ZodSymbol = "ZodSymbol", r32.ZodUndefined = "ZodUndefined", r32.ZodNull = "ZodNull", r32.ZodAny = "ZodAny", r32.ZodUnknown = "ZodUnknown", r32.ZodNever = "ZodNever", r32.ZodVoid = "ZodVoid", r32.ZodArray = "ZodArray", r32.ZodObject = "ZodObject", r32.ZodUnion = "ZodUnion", r32.ZodDiscriminatedUnion = "ZodDiscriminatedUnion", r32.ZodIntersection = "ZodIntersection", r32.ZodTuple = "ZodTuple", r32.ZodRecord = "ZodRecord", r32.ZodMap = "ZodMap", r32.ZodSet = "ZodSet", r32.ZodFunction = "ZodFunction", r32.ZodLazy = "ZodLazy", r32.ZodLiteral = "ZodLiteral", r32.ZodEnum = "ZodEnum", r32.ZodEffects = "ZodEffects", r32.ZodNativeEnum = "ZodNativeEnum", r32.ZodOptional = "ZodOptional", r32.ZodNullable = "ZodNullable", r32.ZodDefault = "ZodDefault", r32.ZodCatch = "ZodCatch", r32.ZodPromise = "ZodPromise", r32.ZodBranded = "ZodBranded", r32.ZodPipeline = "ZodPipeline", r32.ZodReadonly = "ZodReadonly";
})(m4 || (m4 = {}));
var ut2 = /* @__PURE__ */ __name((r32, e = { message: `Input not instance of ${r32.name}` }) => je3((t) => t instanceof r32, e), "ut");
var Ie2 = V4.create;
var Ee3 = L4.create;
var lt2 = de3.create;
var ft2 = U4.create;
var Ze2 = F4.create;
var ht3 = B5.create;
var pt2 = ne3.create;
var mt2 = W6.create;
var yt2 = q5.create;
var _t2 = P2.create;
var gt2 = Z2.create;
var vt2 = A4.create;
var xt2 = ie3.create;
var kt2 = $3.create;
var bt2 = w5.create;
var wt2 = w5.strictCreate;
var Tt = J4.create;
var Ct2 = me3.create;
var Ot = Y2.create;
var St = N3.create;
var At = ye3.create;
var Rt = oe3.create;
var Nt = ce3.create;
var jt = _e3.create;
var It = H3.create;
var Et2 = G4.create;
var Zt = Q4.create;
var $t = X4.create;
var Mt2 = z4.create;
var Vt = S6.create;
var Pt2 = C3.create;
var zt = j5.create;
var Dt = S6.createWithPreprocess;
var Lt2 = fe3.create;
var Ut2 = /* @__PURE__ */ __name(() => Ie2().optional(), "Ut");
var Ft = /* @__PURE__ */ __name(() => Ee3().optional(), "Ft");
var Bt = /* @__PURE__ */ __name(() => Ze2().optional(), "Bt");
var Wt = { string: /* @__PURE__ */ __name((r32) => V4.create({ ...r32, coerce: true }), "string"), number: /* @__PURE__ */ __name((r32) => L4.create({ ...r32, coerce: true }), "number"), boolean: /* @__PURE__ */ __name((r32) => F4.create({ ...r32, coerce: true }), "boolean"), bigint: /* @__PURE__ */ __name((r32) => U4.create({ ...r32, coerce: true }), "bigint"), date: /* @__PURE__ */ __name((r32) => B5.create({ ...r32, coerce: true }), "date") };
var qt = p2;

// deno:https://esm.sh/zod-to-json-schema@3.24.5/esnext/zod-to-json-schema.mjs
var S7 = Symbol("Let zodToJsonSchema decide on which parser to use");
var Z3 = { name: void 0, $refStrategy: "root", basePath: ["#"], effectStrategy: "input", pipeStrategy: "all", dateStrategy: "format:date-time", mapStrategy: "entries", removeAdditionalStrategy: "passthrough", allowedAdditionalProperties: true, rejectedAdditionalProperties: false, definitionPath: "definitions", target: "jsonSchema7", strictUnions: false, definitions: {}, errorMessages: false, markdownDescription: false, patternStrategy: "escape", applyRegexFlags: false, emailStrategy: "format:email", base64Strategy: "contentEncoding:base64", nameStrategy: "ref" };
var O5 = /* @__PURE__ */ __name((t) => typeof t == "string" ? { ...Z3, name: t } : { ...Z3, ...t }, "O");
var j6 = /* @__PURE__ */ __name((t) => {
  let e = O5(t), r32 = e.name !== void 0 ? [...e.basePath, e.definitionPath, e.name] : e.basePath;
  return { ...e, currentPath: r32, propertyPath: void 0, seen: new Map(Object.entries(e.definitions).map(([n2, a3]) => [a3._def, { def: a3._def, path: [...e.basePath, e.definitionPath, n2], jsonSchema: void 0 }])) };
}, "j");
function D5(t, e, r32, n2) {
  n2?.errorMessages && r32 && (t.errorMessage = { ...t.errorMessage, [e]: r32 });
}
__name(D5, "D");
function u4(t, e, r32, n2, a3) {
  t[e] = r32, D5(t, e, n2, a3);
}
__name(u4, "u");
function M4() {
  return {};
}
__name(M4, "M");
function T6(t, e) {
  let r32 = { type: "array" };
  return t.type?._def && t.type?._def?.typeName !== m4.ZodAny && (r32.items = o5(t.type._def, { ...e, currentPath: [...e.currentPath, "items"] })), t.minLength && u4(r32, "minItems", t.minLength.value, t.minLength.message, e), t.maxLength && u4(r32, "maxItems", t.maxLength.value, t.maxLength.message, e), t.exactLength && (u4(r32, "minItems", t.exactLength.value, t.exactLength.message, e), u4(r32, "maxItems", t.exactLength.value, t.exactLength.message, e)), r32;
}
__name(T6, "T");
function N4(t, e) {
  let r32 = { type: "integer", format: "int64" };
  if (!t.checks) return r32;
  for (let n2 of t.checks) switch (n2.kind) {
    case "min":
      e.target === "jsonSchema7" ? n2.inclusive ? u4(r32, "minimum", n2.value, n2.message, e) : u4(r32, "exclusiveMinimum", n2.value, n2.message, e) : (n2.inclusive || (r32.exclusiveMinimum = true), u4(r32, "minimum", n2.value, n2.message, e));
      break;
    case "max":
      e.target === "jsonSchema7" ? n2.inclusive ? u4(r32, "maximum", n2.value, n2.message, e) : u4(r32, "exclusiveMaximum", n2.value, n2.message, e) : (n2.inclusive || (r32.exclusiveMaximum = true), u4(r32, "maximum", n2.value, n2.message, e));
      break;
    case "multipleOf":
      u4(r32, "multipleOf", n2.value, n2.message, e);
      break;
  }
  return r32;
}
__name(N4, "N");
function $4() {
  return { type: "boolean" };
}
__name($4, "$");
function x7(t, e) {
  return o5(t.type._def, e);
}
__name(x7, "x");
var w6 = /* @__PURE__ */ __name((t, e) => o5(t.innerType._def, e), "w");
function A5(t, e, r32) {
  let n2 = r32 ?? e.dateStrategy;
  if (Array.isArray(n2)) return { anyOf: n2.map((a3, i2) => A5(t, e, a3)) };
  switch (n2) {
    case "string":
    case "format:date-time":
      return { type: "string", format: "date-time" };
    case "format:date":
      return { type: "string", format: "date" };
    case "integer":
      return se4(t, e);
  }
}
__name(A5, "A");
var se4 = /* @__PURE__ */ __name((t, e) => {
  let r32 = { type: "integer", format: "unix-time" };
  if (e.target === "openApi3") return r32;
  for (let n2 of t.checks) switch (n2.kind) {
    case "min":
      u4(r32, "minimum", n2.value, n2.message, e);
      break;
    case "max":
      u4(r32, "maximum", n2.value, n2.message, e);
      break;
  }
  return r32;
}, "se");
function E6(t, e) {
  return { ...o5(t.innerType._def, e), default: t.defaultValue() };
}
__name(E6, "E");
function z5(t, e) {
  return e.effectStrategy === "input" ? o5(t.schema._def, e) : {};
}
__name(z5, "z");
function L5(t) {
  return { type: "string", enum: Array.from(t.values) };
}
__name(L5, "L");
var pe4 = /* @__PURE__ */ __name((t) => "type" in t && t.type === "string" ? false : "allOf" in t, "pe");
function F5(t, e) {
  let r32 = [o5(t.left._def, { ...e, currentPath: [...e.currentPath, "allOf", "0"] }), o5(t.right._def, { ...e, currentPath: [...e.currentPath, "allOf", "1"] })].filter((i2) => !!i2), n2 = e.target === "jsonSchema2019-09" ? { unevaluatedProperties: false } : void 0, a3 = [];
  return r32.forEach((i2) => {
    if (pe4(i2)) a3.push(...i2.allOf), i2.unevaluatedProperties === void 0 && (n2 = void 0);
    else {
      let m7 = i2;
      if ("additionalProperties" in i2 && i2.additionalProperties === false) {
        let { additionalProperties: c4, ...s3 } = i2;
        m7 = s3;
      } else n2 = void 0;
      a3.push(m7);
    }
  }), a3.length ? { allOf: a3, ...n2 } : void 0;
}
__name(F5, "F");
function R5(t, e) {
  let r32 = typeof t.value;
  return r32 !== "bigint" && r32 !== "number" && r32 !== "boolean" && r32 !== "string" ? { type: Array.isArray(t.value) ? "array" : "object" } : e.target === "openApi3" ? { type: r32 === "bigint" ? "integer" : r32, enum: [t.value] } : { type: r32 === "bigint" ? "integer" : r32, const: t.value };
}
__name(R5, "R");
var k5;
var f2 = { cuid: /^[cC][^\s-]{8,}$/, cuid2: /^[0-9a-z]+$/, ulid: /^[0-9A-HJKMNP-TV-Z]{26}$/, email: /^(?!\.)(?!.*\.\.)([a-zA-Z0-9_'+\-\.]*)[a-zA-Z0-9_+-]@([a-zA-Z0-9][a-zA-Z0-9\-]*\.)+[a-zA-Z]{2,}$/, emoji: /* @__PURE__ */ __name(() => (k5 === void 0 && (k5 = RegExp("^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$", "u")), k5), "emoji"), uuid: /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/, ipv4: /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/, ipv4Cidr: /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/, ipv6: /^(([a-f0-9]{1,4}:){7}|::([a-f0-9]{1,4}:){0,6}|([a-f0-9]{1,4}:){1}:([a-f0-9]{1,4}:){0,5}|([a-f0-9]{1,4}:){2}:([a-f0-9]{1,4}:){0,4}|([a-f0-9]{1,4}:){3}:([a-f0-9]{1,4}:){0,3}|([a-f0-9]{1,4}:){4}:([a-f0-9]{1,4}:){0,2}|([a-f0-9]{1,4}:){5}:([a-f0-9]{1,4}:){0,1})([a-f0-9]{1,4}|(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2})))$/, ipv6Cidr: /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/, base64: /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/, base64url: /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/, nanoid: /^[a-zA-Z0-9_-]{21}$/, jwt: /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/ };
function v4(t, e) {
  let r32 = { type: "string" };
  if (t.checks) for (let n2 of t.checks) switch (n2.kind) {
    case "min":
      u4(r32, "minLength", typeof r32.minLength == "number" ? Math.max(r32.minLength, n2.value) : n2.value, n2.message, e);
      break;
    case "max":
      u4(r32, "maxLength", typeof r32.maxLength == "number" ? Math.min(r32.maxLength, n2.value) : n2.value, n2.message, e);
      break;
    case "email":
      switch (e.emailStrategy) {
        case "format:email":
          d5(r32, "email", n2.message, e);
          break;
        case "format:idn-email":
          d5(r32, "idn-email", n2.message, e);
          break;
        case "pattern:zod":
          l4(r32, f2.email, n2.message, e);
          break;
      }
      break;
    case "url":
      d5(r32, "uri", n2.message, e);
      break;
    case "uuid":
      d5(r32, "uuid", n2.message, e);
      break;
    case "regex":
      l4(r32, n2.regex, n2.message, e);
      break;
    case "cuid":
      l4(r32, f2.cuid, n2.message, e);
      break;
    case "cuid2":
      l4(r32, f2.cuid2, n2.message, e);
      break;
    case "startsWith":
      l4(r32, RegExp(`^${_8(n2.value, e)}`), n2.message, e);
      break;
    case "endsWith":
      l4(r32, RegExp(`${_8(n2.value, e)}$`), n2.message, e);
      break;
    case "datetime":
      d5(r32, "date-time", n2.message, e);
      break;
    case "date":
      d5(r32, "date", n2.message, e);
      break;
    case "time":
      d5(r32, "time", n2.message, e);
      break;
    case "duration":
      d5(r32, "duration", n2.message, e);
      break;
    case "length":
      u4(r32, "minLength", typeof r32.minLength == "number" ? Math.max(r32.minLength, n2.value) : n2.value, n2.message, e), u4(r32, "maxLength", typeof r32.maxLength == "number" ? Math.min(r32.maxLength, n2.value) : n2.value, n2.message, e);
      break;
    case "includes": {
      l4(r32, RegExp(_8(n2.value, e)), n2.message, e);
      break;
    }
    case "ip": {
      n2.version !== "v6" && d5(r32, "ipv4", n2.message, e), n2.version !== "v4" && d5(r32, "ipv6", n2.message, e);
      break;
    }
    case "base64url":
      l4(r32, f2.base64url, n2.message, e);
      break;
    case "jwt":
      l4(r32, f2.jwt, n2.message, e);
      break;
    case "cidr": {
      n2.version !== "v6" && l4(r32, f2.ipv4Cidr, n2.message, e), n2.version !== "v4" && l4(r32, f2.ipv6Cidr, n2.message, e);
      break;
    }
    case "emoji":
      l4(r32, f2.emoji(), n2.message, e);
      break;
    case "ulid": {
      l4(r32, f2.ulid, n2.message, e);
      break;
    }
    case "base64": {
      switch (e.base64Strategy) {
        case "format:binary": {
          d5(r32, "binary", n2.message, e);
          break;
        }
        case "contentEncoding:base64": {
          u4(r32, "contentEncoding", "base64", n2.message, e);
          break;
        }
        case "pattern:zod": {
          l4(r32, f2.base64, n2.message, e);
          break;
        }
      }
      break;
    }
    case "nanoid":
      l4(r32, f2.nanoid, n2.message, e);
    case "toLowerCase":
    case "toUpperCase":
    case "trim":
      break;
    default:
  }
  return r32;
}
__name(v4, "v");
function _8(t, e) {
  return e.patternStrategy === "escape" ? me4(t) : t;
}
__name(_8, "_");
var ue4 = new Set("ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvxyz0123456789");
function me4(t) {
  let e = "";
  for (let r32 = 0; r32 < t.length; r32++) ue4.has(t[r32]) || (e += "\\"), e += t[r32];
  return e;
}
__name(me4, "me");
function d5(t, e, r32, n2) {
  t.format || t.anyOf?.some((a3) => a3.format) ? (t.anyOf || (t.anyOf = []), t.format && (t.anyOf.push({ format: t.format, ...t.errorMessage && n2.errorMessages && { errorMessage: { format: t.errorMessage.format } } }), delete t.format, t.errorMessage && (delete t.errorMessage.format, Object.keys(t.errorMessage).length === 0 && delete t.errorMessage)), t.anyOf.push({ format: e, ...r32 && n2.errorMessages && { errorMessage: { format: r32 } } })) : u4(t, "format", e, r32, n2);
}
__name(d5, "d");
function l4(t, e, r32, n2) {
  t.pattern || t.allOf?.some((a3) => a3.pattern) ? (t.allOf || (t.allOf = []), t.pattern && (t.allOf.push({ pattern: t.pattern, ...t.errorMessage && n2.errorMessages && { errorMessage: { pattern: t.errorMessage.pattern } } }), delete t.pattern, t.errorMessage && (delete t.errorMessage.pattern, Object.keys(t.errorMessage).length === 0 && delete t.errorMessage)), t.allOf.push({ pattern: I8(e, n2), ...r32 && n2.errorMessages && { errorMessage: { pattern: r32 } } })) : u4(t, "pattern", I8(e, n2), r32, n2);
}
__name(l4, "l");
function I8(t, e) {
  if (!e.applyRegexFlags || !t.flags) return t.source;
  let r32 = { i: t.flags.includes("i"), m: t.flags.includes("m"), s: t.flags.includes("s") }, n2 = r32.i ? t.source.toLowerCase() : t.source, a3 = "", i2 = false, m7 = false, c4 = false;
  for (let s3 = 0; s3 < n2.length; s3++) {
    if (i2) {
      a3 += n2[s3], i2 = false;
      continue;
    }
    if (r32.i) {
      if (m7) {
        if (n2[s3].match(/[a-z]/)) {
          c4 ? (a3 += n2[s3], a3 += `${n2[s3 - 2]}-${n2[s3]}`.toUpperCase(), c4 = false) : n2[s3 + 1] === "-" && n2[s3 + 2]?.match(/[a-z]/) ? (a3 += n2[s3], c4 = true) : a3 += `${n2[s3]}${n2[s3].toUpperCase()}`;
          continue;
        }
      } else if (n2[s3].match(/[a-z]/)) {
        a3 += `[${n2[s3]}${n2[s3].toUpperCase()}]`;
        continue;
      }
    }
    if (r32.m) {
      if (n2[s3] === "^") {
        a3 += `(^|(?<=[\r
]))`;
        continue;
      } else if (n2[s3] === "$") {
        a3 += `($|(?=[\r
]))`;
        continue;
      }
    }
    if (r32.s && n2[s3] === ".") {
      a3 += m7 ? `${n2[s3]}\r
` : `[${n2[s3]}\r
]`;
      continue;
    }
    a3 += n2[s3], n2[s3] === "\\" ? i2 = true : m7 && n2[s3] === "]" ? m7 = false : !m7 && n2[s3] === "[" && (m7 = true);
  }
  try {
    new RegExp(a3);
  } catch {
    return console.warn(`Could not convert regex pattern at ${e.currentPath.join("/")} to a flag-independent form! Falling back to the flag-ignorant source`), t.source;
  }
  return a3;
}
__name(I8, "I");
function P3(t, e) {
  if (e.target === "openAi" && console.warn("Warning: OpenAI may not support records in schemas! Try an array of key-value pairs instead."), e.target === "openApi3" && t.keyType?._def.typeName === m4.ZodEnum) return { type: "object", required: t.keyType._def.values, properties: t.keyType._def.values.reduce((n2, a3) => ({ ...n2, [a3]: o5(t.valueType._def, { ...e, currentPath: [...e.currentPath, "properties", a3] }) ?? {} }), {}), additionalProperties: e.rejectedAdditionalProperties };
  let r32 = { type: "object", additionalProperties: o5(t.valueType._def, { ...e, currentPath: [...e.currentPath, "additionalProperties"] }) ?? e.allowedAdditionalProperties };
  if (e.target === "openApi3") return r32;
  if (t.keyType?._def.typeName === m4.ZodString && t.keyType._def.checks?.length) {
    let { type: n2, ...a3 } = v4(t.keyType._def, e);
    return { ...r32, propertyNames: a3 };
  } else {
    if (t.keyType?._def.typeName === m4.ZodEnum) return { ...r32, propertyNames: { enum: t.keyType._def.values } };
    if (t.keyType?._def.typeName === m4.ZodBranded && t.keyType._def.type._def.typeName === m4.ZodString && t.keyType._def.type._def.checks?.length) {
      let { type: n2, ...a3 } = x7(t.keyType._def, e);
      return { ...r32, propertyNames: a3 };
    }
  }
  return r32;
}
__name(P3, "P");
function C4(t, e) {
  if (e.mapStrategy === "record") return P3(t, e);
  let r32 = o5(t.keyType._def, { ...e, currentPath: [...e.currentPath, "items", "items", "0"] }) || {}, n2 = o5(t.valueType._def, { ...e, currentPath: [...e.currentPath, "items", "items", "1"] }) || {};
  return { type: "array", maxItems: 125, items: { type: "array", items: [r32, n2], minItems: 2, maxItems: 2 } };
}
__name(C4, "C");
function U5(t) {
  let e = t.values, n2 = Object.keys(t.values).filter((i2) => typeof e[e[i2]] != "number").map((i2) => e[i2]), a3 = Array.from(new Set(n2.map((i2) => typeof i2)));
  return { type: a3.length === 1 ? a3[0] === "string" ? "string" : "number" : ["string", "number"], enum: n2 };
}
__name(U5, "U");
function B6() {
  return { not: {} };
}
__name(B6, "B");
function V5(t) {
  return t.target === "openApi3" ? { enum: ["null"], nullable: true } : { type: "null" };
}
__name(V5, "V");
var h6 = { ZodString: "string", ZodNumber: "number", ZodBigInt: "integer", ZodBoolean: "boolean", ZodNull: "null" };
function J5(t, e) {
  if (e.target === "openApi3") return K5(t, e);
  let r32 = t.options instanceof Map ? Array.from(t.options.values()) : t.options;
  if (r32.every((n2) => n2._def.typeName in h6 && (!n2._def.checks || !n2._def.checks.length))) {
    let n2 = r32.reduce((a3, i2) => {
      let m7 = h6[i2._def.typeName];
      return m7 && !a3.includes(m7) ? [...a3, m7] : a3;
    }, []);
    return { type: n2.length > 1 ? n2 : n2[0] };
  } else if (r32.every((n2) => n2._def.typeName === "ZodLiteral" && !n2.description)) {
    let n2 = r32.reduce((a3, i2) => {
      let m7 = typeof i2._def.value;
      switch (m7) {
        case "string":
        case "number":
        case "boolean":
          return [...a3, m7];
        case "bigint":
          return [...a3, "integer"];
        case "object":
          if (i2._def.value === null) return [...a3, "null"];
        case "symbol":
        case "undefined":
        case "function":
        default:
          return a3;
      }
    }, []);
    if (n2.length === r32.length) {
      let a3 = n2.filter((i2, m7, c4) => c4.indexOf(i2) === m7);
      return { type: a3.length > 1 ? a3 : a3[0], enum: r32.reduce((i2, m7) => i2.includes(m7._def.value) ? i2 : [...i2, m7._def.value], []) };
    }
  } else if (r32.every((n2) => n2._def.typeName === "ZodEnum")) return { type: "string", enum: r32.reduce((n2, a3) => [...n2, ...a3._def.values.filter((i2) => !n2.includes(i2))], []) };
  return K5(t, e);
}
__name(J5, "J");
var K5 = /* @__PURE__ */ __name((t, e) => {
  let r32 = (t.options instanceof Map ? Array.from(t.options.values()) : t.options).map((n2, a3) => o5(n2._def, { ...e, currentPath: [...e.currentPath, "anyOf", `${a3}`] })).filter((n2) => !!n2 && (!e.strictUnions || typeof n2 == "object" && Object.keys(n2).length > 0));
  return r32.length ? { anyOf: r32 } : void 0;
}, "K");
function q6(t, e) {
  if (["ZodString", "ZodNumber", "ZodBigInt", "ZodBoolean", "ZodNull"].includes(t.innerType._def.typeName) && (!t.innerType._def.checks || !t.innerType._def.checks.length)) return e.target === "openApi3" ? { type: h6[t.innerType._def.typeName], nullable: true } : { type: [h6[t.innerType._def.typeName], "null"] };
  if (e.target === "openApi3") {
    let n2 = o5(t.innerType._def, { ...e, currentPath: [...e.currentPath] });
    return n2 && "$ref" in n2 ? { allOf: [n2], nullable: true } : n2 && { ...n2, nullable: true };
  }
  let r32 = o5(t.innerType._def, { ...e, currentPath: [...e.currentPath, "anyOf", "0"] });
  return r32 && { anyOf: [r32, { type: "null" }] };
}
__name(q6, "q");
function W7(t, e) {
  let r32 = { type: "number" };
  if (!t.checks) return r32;
  for (let n2 of t.checks) switch (n2.kind) {
    case "int":
      r32.type = "integer", D5(r32, "type", n2.message, e);
      break;
    case "min":
      e.target === "jsonSchema7" ? n2.inclusive ? u4(r32, "minimum", n2.value, n2.message, e) : u4(r32, "exclusiveMinimum", n2.value, n2.message, e) : (n2.inclusive || (r32.exclusiveMinimum = true), u4(r32, "minimum", n2.value, n2.message, e));
      break;
    case "max":
      e.target === "jsonSchema7" ? n2.inclusive ? u4(r32, "maximum", n2.value, n2.message, e) : u4(r32, "exclusiveMaximum", n2.value, n2.message, e) : (n2.inclusive || (r32.exclusiveMaximum = true), u4(r32, "maximum", n2.value, n2.message, e));
      break;
    case "multipleOf":
      u4(r32, "multipleOf", n2.value, n2.message, e);
      break;
  }
  return r32;
}
__name(W7, "W");
function G5(t, e) {
  let r32 = e.target === "openAi", n2 = { type: "object", properties: {} }, a3 = [], i2 = t.shape();
  for (let c4 in i2) {
    let s3 = i2[c4];
    if (s3 === void 0 || s3._def === void 0) continue;
    let g9 = fe4(s3);
    g9 && r32 && (s3 instanceof C3 && (s3 = s3._def.innerType), s3.isNullable() || (s3 = s3.nullable()), g9 = false);
    let b7 = o5(s3._def, { ...e, currentPath: [...e.currentPath, "properties", c4], propertyPath: [...e.currentPath, "properties", c4] });
    b7 !== void 0 && (n2.properties[c4] = b7, g9 || a3.push(c4));
  }
  a3.length && (n2.required = a3);
  let m7 = le4(t, e);
  return m7 !== void 0 && (n2.additionalProperties = m7), n2;
}
__name(G5, "G");
function le4(t, e) {
  if (t.catchall._def.typeName !== "ZodNever") return o5(t.catchall._def, { ...e, currentPath: [...e.currentPath, "additionalProperties"] });
  switch (t.unknownKeys) {
    case "passthrough":
      return e.allowedAdditionalProperties;
    case "strict":
      return e.rejectedAdditionalProperties;
    case "strip":
      return e.removeAdditionalStrategy === "strict" ? e.allowedAdditionalProperties : e.rejectedAdditionalProperties;
  }
}
__name(le4, "le");
function fe4(t) {
  try {
    return t.isOptional();
  } catch {
    return true;
  }
}
__name(fe4, "fe");
var H4 = /* @__PURE__ */ __name((t, e) => {
  if (e.currentPath.toString() === e.propertyPath?.toString()) return o5(t.innerType._def, e);
  let r32 = o5(t.innerType._def, { ...e, currentPath: [...e.currentPath, "anyOf", "1"] });
  return r32 ? { anyOf: [{ not: {} }, r32] } : {};
}, "H");
var Q5 = /* @__PURE__ */ __name((t, e) => {
  if (e.pipeStrategy === "input") return o5(t.in._def, e);
  if (e.pipeStrategy === "output") return o5(t.out._def, e);
  let r32 = o5(t.in._def, { ...e, currentPath: [...e.currentPath, "allOf", "0"] }), n2 = o5(t.out._def, { ...e, currentPath: [...e.currentPath, "allOf", r32 ? "1" : "0"] });
  return { allOf: [r32, n2].filter((a3) => a3 !== void 0) };
}, "Q");
function X5(t, e) {
  return o5(t.type._def, e);
}
__name(X5, "X");
function Y3(t, e) {
  let n2 = { type: "array", uniqueItems: true, items: o5(t.valueType._def, { ...e, currentPath: [...e.currentPath, "items"] }) };
  return t.minSize && u4(n2, "minItems", t.minSize.value, t.minSize.message, e), t.maxSize && u4(n2, "maxItems", t.maxSize.value, t.maxSize.message, e), n2;
}
__name(Y3, "Y");
function ee3(t, e) {
  return t.rest ? { type: "array", minItems: t.items.length, items: t.items.map((r32, n2) => o5(r32._def, { ...e, currentPath: [...e.currentPath, "items", `${n2}`] })).reduce((r32, n2) => n2 === void 0 ? r32 : [...r32, n2], []), additionalItems: o5(t.rest._def, { ...e, currentPath: [...e.currentPath, "additionalItems"] }) } : { type: "array", minItems: t.items.length, maxItems: t.items.length, items: t.items.map((r32, n2) => o5(r32._def, { ...e, currentPath: [...e.currentPath, "items", `${n2}`] })).reduce((r32, n2) => n2 === void 0 ? r32 : [...r32, n2], []) };
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
var ne4 = /* @__PURE__ */ __name((t, e) => o5(t.innerType._def, e), "ne");
var ae4 = /* @__PURE__ */ __name((t, e, r32) => {
  switch (e) {
    case m4.ZodString:
      return v4(t, r32);
    case m4.ZodNumber:
      return W7(t, r32);
    case m4.ZodObject:
      return G5(t, r32);
    case m4.ZodBigInt:
      return N4(t, r32);
    case m4.ZodBoolean:
      return $4();
    case m4.ZodDate:
      return A5(t, r32);
    case m4.ZodUndefined:
      return te4();
    case m4.ZodNull:
      return V5(r32);
    case m4.ZodArray:
      return T6(t, r32);
    case m4.ZodUnion:
    case m4.ZodDiscriminatedUnion:
      return J5(t, r32);
    case m4.ZodIntersection:
      return F5(t, r32);
    case m4.ZodTuple:
      return ee3(t, r32);
    case m4.ZodRecord:
      return P3(t, r32);
    case m4.ZodLiteral:
      return R5(t, r32);
    case m4.ZodEnum:
      return L5(t);
    case m4.ZodNativeEnum:
      return U5(t);
    case m4.ZodNullable:
      return q6(t, r32);
    case m4.ZodOptional:
      return H4(t, r32);
    case m4.ZodMap:
      return C4(t, r32);
    case m4.ZodSet:
      return Y3(t, r32);
    case m4.ZodLazy:
      return () => t.getter()._def;
    case m4.ZodPromise:
      return X5(t, r32);
    case m4.ZodNaN:
    case m4.ZodNever:
      return B6();
    case m4.ZodEffects:
      return z5(t, r32);
    case m4.ZodAny:
      return M4();
    case m4.ZodUnknown:
      return re3();
    case m4.ZodDefault:
      return E6(t, r32);
    case m4.ZodBranded:
      return x7(t, r32);
    case m4.ZodReadonly:
      return ne4(t, r32);
    case m4.ZodCatch:
      return w6(t, r32);
    case m4.ZodPipeline:
      return Q5(t, r32);
    case m4.ZodFunction:
    case m4.ZodVoid:
    case m4.ZodSymbol:
      return;
    default:
      return /* @__PURE__ */ ((n2) => {
      })(e);
  }
}, "ae");
function o5(t, e, r32 = false) {
  let n2 = e.seen.get(t);
  if (e.override) {
    let c4 = e.override?.(t, e, n2, r32);
    if (c4 !== S7) return c4;
  }
  if (n2 && !r32) {
    let c4 = de4(n2, e);
    if (c4 !== void 0) return c4;
  }
  let a3 = { def: t, path: e.currentPath, jsonSchema: void 0 };
  e.seen.set(t, a3);
  let i2 = ae4(t, t.typeName, e), m7 = typeof i2 == "function" ? o5(i2(), e) : i2;
  if (m7 && ye4(t, e, m7), e.postProcess) {
    let c4 = e.postProcess(m7, t, e);
    return a3.jsonSchema = m7, c4;
  }
  return a3.jsonSchema = m7, m7;
}
__name(o5, "o");
var de4 = /* @__PURE__ */ __name((t, e) => {
  switch (e.$refStrategy) {
    case "root":
      return { $ref: t.path.join("/") };
    case "relative":
      return { $ref: ge3(e.currentPath, t.path) };
    case "none":
    case "seen":
      return t.path.length < e.currentPath.length && t.path.every((r32, n2) => e.currentPath[n2] === r32) ? (console.warn(`Recursive reference detected at ${e.currentPath.join("/")}! Defaulting to any`), {}) : e.$refStrategy === "seen" ? {} : void 0;
  }
}, "de");
var ge3 = /* @__PURE__ */ __name((t, e) => {
  let r32 = 0;
  for (; r32 < t.length && r32 < e.length && t[r32] === e[r32]; r32++) ;
  return [(t.length - r32).toString(), ...e.slice(r32)].join("/");
}, "ge");
var ye4 = /* @__PURE__ */ __name((t, e, r32) => (t.description && (r32.description = t.description, e.markdownDescription && (r32.markdownDescription = t.description)), r32), "ye");
var oe4 = /* @__PURE__ */ __name((t, e) => {
  let r32 = j6(e), n2 = typeof e == "object" && e.definitions ? Object.entries(e.definitions).reduce((s3, [g9, b7]) => ({ ...s3, [g9]: o5(b7._def, { ...r32, currentPath: [...r32.basePath, r32.definitionPath, g9] }, true) ?? {} }), {}) : void 0, a3 = typeof e == "string" ? e : e?.nameStrategy === "title" ? void 0 : e?.name, i2 = o5(t._def, a3 === void 0 ? r32 : { ...r32, currentPath: [...r32.basePath, r32.definitionPath, a3] }, false) ?? {}, m7 = typeof e == "object" && e.name !== void 0 && e.nameStrategy === "title" ? e.name : void 0;
  m7 !== void 0 && (i2.title = m7);
  let c4 = a3 === void 0 ? n2 ? { ...i2, [r32.definitionPath]: n2 } : i2 : { $ref: [...r32.$refStrategy === "relative" ? [] : r32.basePath, r32.definitionPath, a3].join("/"), [r32.definitionPath]: { ...n2, [a3]: i2 } };
  return r32.target === "jsonSchema7" ? c4.$schema = "http://json-schema.org/draft-07/schema#" : (r32.target === "jsonSchema2019-09" || r32.target === "openAi") && (c4.$schema = "https://json-schema.org/draft/2019-09/schema#"), r32.target === "openAi" && ("anyOf" in c4 || "oneOf" in c4 || "allOf" in c4 || "type" in c4 && Array.isArray(c4.type)) && console.warn("Warning: OpenAI may not support schemas with unions as roots! Try wrapping it in an object property."), c4;
}, "oe");

// deno:https://esm.sh/zod@3.24.3/esnext/zod.mjs
var g7;
(function(r32) {
  r32.assertEqual = (n2) => n2;
  function e(n2) {
  }
  __name(e, "e");
  r32.assertIs = e;
  function t(n2) {
    throw new Error();
  }
  __name(t, "t");
  r32.assertNever = t, r32.arrayToEnum = (n2) => {
    let a3 = {};
    for (let i2 of n2) a3[i2] = i2;
    return a3;
  }, r32.getValidEnumValues = (n2) => {
    let a3 = r32.objectKeys(n2).filter((o6) => typeof n2[n2[o6]] != "number"), i2 = {};
    for (let o6 of a3) i2[o6] = n2[o6];
    return r32.objectValues(i2);
  }, r32.objectValues = (n2) => r32.objectKeys(n2).map(function(a3) {
    return n2[a3];
  }), r32.objectKeys = typeof Object.keys == "function" ? (n2) => Object.keys(n2) : (n2) => {
    let a3 = [];
    for (let i2 in n2) Object.prototype.hasOwnProperty.call(n2, i2) && a3.push(i2);
    return a3;
  }, r32.find = (n2, a3) => {
    for (let i2 of n2) if (a3(i2)) return i2;
  }, r32.isInteger = typeof Number.isInteger == "function" ? (n2) => Number.isInteger(n2) : (n2) => typeof n2 == "number" && isFinite(n2) && Math.floor(n2) === n2;
  function s3(n2, a3 = " | ") {
    return n2.map((i2) => typeof i2 == "string" ? `'${i2}'` : i2).join(a3);
  }
  __name(s3, "s");
  r32.joinValues = s3, r32.jsonStringifyReplacer = (n2, a3) => typeof a3 == "bigint" ? a3.toString() : a3;
})(g7 || (g7 = {}));
var be3;
(function(r32) {
  r32.mergeShapes = (e, t) => ({ ...e, ...t });
})(be3 || (be3 = {}));
var f3 = g7.arrayToEnum(["string", "nan", "number", "integer", "float", "boolean", "date", "bigint", "symbol", "function", "undefined", "null", "array", "object", "unknown", "promise", "void", "never", "map", "set"]);
var R6 = /* @__PURE__ */ __name((r32) => {
  switch (typeof r32) {
    case "undefined":
      return f3.undefined;
    case "string":
      return f3.string;
    case "number":
      return isNaN(r32) ? f3.nan : f3.number;
    case "boolean":
      return f3.boolean;
    case "function":
      return f3.function;
    case "bigint":
      return f3.bigint;
    case "symbol":
      return f3.symbol;
    case "object":
      return Array.isArray(r32) ? f3.array : r32 === null ? f3.null : r32.then && typeof r32.then == "function" && r32.catch && typeof r32.catch == "function" ? f3.promise : typeof Map < "u" && r32 instanceof Map ? f3.map : typeof Set < "u" && r32 instanceof Set ? f3.set : typeof Date < "u" && r32 instanceof Date ? f3.date : f3.object;
    default:
      return f3.unknown;
  }
}, "R");
var d6 = g7.arrayToEnum(["invalid_type", "invalid_literal", "custom", "invalid_union", "invalid_union_discriminator", "invalid_enum_value", "unrecognized_keys", "invalid_arguments", "invalid_return_type", "invalid_date", "invalid_string", "too_small", "too_big", "invalid_intersection_types", "not_multiple_of", "not_finite"]);
var ze3 = /* @__PURE__ */ __name((r32) => JSON.stringify(r32, null, 2).replace(/"([^"]+)":/g, "$1:"), "ze");
var T7 = class r17 extends Error {
  static {
    __name(this, "r");
  }
  get errors() {
    return this.issues;
  }
  constructor(e) {
    super(), this.issues = [], this.addIssue = (s3) => {
      this.issues = [...this.issues, s3];
    }, this.addIssues = (s3 = []) => {
      this.issues = [...this.issues, ...s3];
    };
    let t = new.target.prototype;
    Object.setPrototypeOf ? Object.setPrototypeOf(this, t) : this.__proto__ = t, this.name = "ZodError", this.issues = e;
  }
  format(e) {
    let t = e || function(a3) {
      return a3.message;
    }, s3 = { _errors: [] }, n2 = /* @__PURE__ */ __name((a3) => {
      for (let i2 of a3.issues) if (i2.code === "invalid_union") i2.unionErrors.map(n2);
      else if (i2.code === "invalid_return_type") n2(i2.returnTypeError);
      else if (i2.code === "invalid_arguments") n2(i2.argumentsError);
      else if (i2.path.length === 0) s3._errors.push(t(i2));
      else {
        let o6 = s3, l5 = 0;
        for (; l5 < i2.path.length; ) {
          let c4 = i2.path[l5];
          l5 === i2.path.length - 1 ? (o6[c4] = o6[c4] || { _errors: [] }, o6[c4]._errors.push(t(i2))) : o6[c4] = o6[c4] || { _errors: [] }, o6 = o6[c4], l5++;
        }
      }
    }, "n");
    return n2(this), s3;
  }
  static assert(e) {
    if (!(e instanceof r17)) throw new Error(`Not a ZodError: ${e}`);
  }
  toString() {
    return this.message;
  }
  get message() {
    return JSON.stringify(this.issues, g7.jsonStringifyReplacer, 2);
  }
  get isEmpty() {
    return this.issues.length === 0;
  }
  flatten(e = (t) => t.message) {
    let t = {}, s3 = [];
    for (let n2 of this.issues) n2.path.length > 0 ? (t[n2.path[0]] = t[n2.path[0]] || [], t[n2.path[0]].push(e(n2))) : s3.push(e(n2));
    return { formErrors: s3, fieldErrors: t };
  }
  get formErrors() {
    return this.flatten();
  }
};
T7.create = (r32) => new T7(r32);
var re4 = /* @__PURE__ */ __name((r32, e) => {
  let t;
  switch (r32.code) {
    case d6.invalid_type:
      r32.received === f3.undefined ? t = "Required" : t = `Expected ${r32.expected}, received ${r32.received}`;
      break;
    case d6.invalid_literal:
      t = `Invalid literal value, expected ${JSON.stringify(r32.expected, g7.jsonStringifyReplacer)}`;
      break;
    case d6.unrecognized_keys:
      t = `Unrecognized key(s) in object: ${g7.joinValues(r32.keys, ", ")}`;
      break;
    case d6.invalid_union:
      t = "Invalid input";
      break;
    case d6.invalid_union_discriminator:
      t = `Invalid discriminator value. Expected ${g7.joinValues(r32.options)}`;
      break;
    case d6.invalid_enum_value:
      t = `Invalid enum value. Expected ${g7.joinValues(r32.options)}, received '${r32.received}'`;
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
      typeof r32.validation == "object" ? "includes" in r32.validation ? (t = `Invalid input: must include "${r32.validation.includes}"`, typeof r32.validation.position == "number" && (t = `${t} at one or more positions greater than or equal to ${r32.validation.position}`)) : "startsWith" in r32.validation ? t = `Invalid input: must start with "${r32.validation.startsWith}"` : "endsWith" in r32.validation ? t = `Invalid input: must end with "${r32.validation.endsWith}"` : g7.assertNever(r32.validation) : r32.validation !== "regex" ? t = `Invalid ${r32.validation}` : t = "Invalid";
      break;
    case d6.too_small:
      r32.type === "array" ? t = `Array must contain ${r32.exact ? "exactly" : r32.inclusive ? "at least" : "more than"} ${r32.minimum} element(s)` : r32.type === "string" ? t = `String must contain ${r32.exact ? "exactly" : r32.inclusive ? "at least" : "over"} ${r32.minimum} character(s)` : r32.type === "number" ? t = `Number must be ${r32.exact ? "exactly equal to " : r32.inclusive ? "greater than or equal to " : "greater than "}${r32.minimum}` : r32.type === "date" ? t = `Date must be ${r32.exact ? "exactly equal to " : r32.inclusive ? "greater than or equal to " : "greater than "}${new Date(Number(r32.minimum))}` : t = "Invalid input";
      break;
    case d6.too_big:
      r32.type === "array" ? t = `Array must contain ${r32.exact ? "exactly" : r32.inclusive ? "at most" : "less than"} ${r32.maximum} element(s)` : r32.type === "string" ? t = `String must contain ${r32.exact ? "exactly" : r32.inclusive ? "at most" : "under"} ${r32.maximum} character(s)` : r32.type === "number" ? t = `Number must be ${r32.exact ? "exactly" : r32.inclusive ? "less than or equal to" : "less than"} ${r32.maximum}` : r32.type === "bigint" ? t = `BigInt must be ${r32.exact ? "exactly" : r32.inclusive ? "less than or equal to" : "less than"} ${r32.maximum}` : r32.type === "date" ? t = `Date must be ${r32.exact ? "exactly" : r32.inclusive ? "smaller than or equal to" : "smaller than"} ${new Date(Number(r32.maximum))}` : t = "Invalid input";
      break;
    case d6.custom:
      t = "Invalid input";
      break;
    case d6.invalid_intersection_types:
      t = "Intersection results could not be merged";
      break;
    case d6.not_multiple_of:
      t = `Number must be a multiple of ${r32.multipleOf}`;
      break;
    case d6.not_finite:
      t = "Number must be finite";
      break;
    default:
      t = e.defaultError, g7.assertNever(r32);
  }
  return { message: t };
}, "re");
var Ee4 = re4;
function De3(r32) {
  Ee4 = r32;
}
__name(De3, "De");
function pe5() {
  return Ee4;
}
__name(pe5, "pe");
var me5 = /* @__PURE__ */ __name((r32) => {
  let { data: e, path: t, errorMaps: s3, issueData: n2 } = r32, a3 = [...t, ...n2.path || []], i2 = { ...n2, path: a3 };
  if (n2.message !== void 0) return { ...n2, path: a3, message: n2.message };
  let o6 = "", l5 = s3.filter((c4) => !!c4).slice().reverse();
  for (let c4 of l5) o6 = c4(i2, { data: e, defaultError: o6 }).message;
  return { ...n2, path: a3, message: o6 };
}, "me");
var Le3 = [];
function u5(r32, e) {
  let t = pe5(), s3 = me5({ issueData: e, data: r32.data, path: r32.path, errorMaps: [r32.common.contextualErrorMap, r32.schemaErrorMap, t, t === re4 ? void 0 : re4].filter((n2) => !!n2) });
  r32.common.issues.push(s3);
}
__name(u5, "u");
var x8 = class r18 {
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
    let s3 = [];
    for (let n2 of t) {
      if (n2.status === "aborted") return v5;
      n2.status === "dirty" && e.dirty(), s3.push(n2.value);
    }
    return { status: e.value, value: s3 };
  }
  static async mergeObjectAsync(e, t) {
    let s3 = [];
    for (let n2 of t) {
      let a3 = await n2.key, i2 = await n2.value;
      s3.push({ key: a3, value: i2 });
    }
    return r18.mergeObjectSync(e, s3);
  }
  static mergeObjectSync(e, t) {
    let s3 = {};
    for (let n2 of t) {
      let { key: a3, value: i2 } = n2;
      if (a3.status === "aborted" || i2.status === "aborted") return v5;
      a3.status === "dirty" && e.dirty(), i2.status === "dirty" && e.dirty(), a3.value !== "__proto__" && (typeof i2.value < "u" || n2.alwaysSet) && (s3[a3.value] = i2.value);
    }
    return { status: e.value, value: s3 };
  }
};
var v5 = Object.freeze({ status: "aborted" });
var te5 = /* @__PURE__ */ __name((r32) => ({ status: "dirty", value: r32 }), "te");
var b5 = /* @__PURE__ */ __name((r32) => ({ status: "valid", value: r32 }), "b");
var we2 = /* @__PURE__ */ __name((r32) => r32.status === "aborted", "we");
var Te3 = /* @__PURE__ */ __name((r32) => r32.status === "dirty", "Te");
var P4 = /* @__PURE__ */ __name((r32) => r32.status === "valid", "P");
var ue5 = /* @__PURE__ */ __name((r32) => typeof Promise < "u" && r32 instanceof Promise, "ue");
function ve4(r32, e, t, s3) {
  if (t === "a" && !s3) throw new TypeError("Private accessor was defined without a getter");
  if (typeof e == "function" ? r32 !== e || !s3 : !e.has(r32)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return t === "m" ? s3 : t === "a" ? s3.call(r32) : s3 ? s3.value : e.get(r32);
}
__name(ve4, "ve");
function Ze3(r32, e, t, s3, n2) {
  if (s3 === "m") throw new TypeError("Private method is not writable");
  if (s3 === "a" && !n2) throw new TypeError("Private accessor was defined without a setter");
  if (typeof e == "function" ? r32 !== e || !n2 : !e.has(r32)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return s3 === "a" ? n2.call(r32, t) : n2 ? n2.value = t : e.set(r32, t), t;
}
__name(Ze3, "Ze");
var h7;
(function(r32) {
  r32.errToObj = (e) => typeof e == "string" ? { message: e } : e || {}, r32.toString = (e) => typeof e == "string" ? e : e?.message;
})(h7 || (h7 = {}));
var de5;
var ce4;
var S8 = class {
  static {
    __name(this, "S");
  }
  constructor(e, t, s3, n2) {
    this._cachedPath = [], this.parent = e, this.data = t, this._path = s3, this._key = n2;
  }
  get path() {
    return this._cachedPath.length || (this._key instanceof Array ? this._cachedPath.push(...this._path, ...this._key) : this._cachedPath.push(...this._path, this._key)), this._cachedPath;
  }
};
var Oe4 = /* @__PURE__ */ __name((r32, e) => {
  if (P4(e)) return { success: true, data: e.value };
  if (!r32.common.issues.length) throw new Error("Validation failed but no issues detected.");
  return { success: false, get error() {
    if (this._error) return this._error;
    let t = new T7(r32.common.issues);
    return this._error = t, this._error;
  } };
}, "Oe");
function _9(r32) {
  if (!r32) return {};
  let { errorMap: e, invalid_type_error: t, required_error: s3, description: n2 } = r32;
  if (e && (t || s3)) throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
  return e ? { errorMap: e, description: n2 } : { errorMap: /* @__PURE__ */ __name((i2, o6) => {
    var l5, c4;
    let { message: p3 } = r32;
    return i2.code === "invalid_enum_value" ? { message: p3 ?? o6.defaultError } : typeof o6.data > "u" ? { message: (l5 = p3 ?? s3) !== null && l5 !== void 0 ? l5 : o6.defaultError } : i2.code !== "invalid_type" ? { message: o6.defaultError } : { message: (c4 = p3 ?? t) !== null && c4 !== void 0 ? c4 : o6.defaultError };
  }, "errorMap"), description: n2 };
}
__name(_9, "_");
var y6 = class {
  static {
    __name(this, "y");
  }
  get description() {
    return this._def.description;
  }
  _getType(e) {
    return R6(e.data);
  }
  _getOrReturnCtx(e, t) {
    return t || { common: e.parent.common, data: e.data, parsedType: R6(e.data), schemaErrorMap: this._def.errorMap, path: e.path, parent: e.parent };
  }
  _processInputParams(e) {
    return { status: new x8(), ctx: { common: e.parent.common, data: e.data, parsedType: R6(e.data), schemaErrorMap: this._def.errorMap, path: e.path, parent: e.parent } };
  }
  _parseSync(e) {
    let t = this._parse(e);
    if (ue5(t)) throw new Error("Synchronous parse encountered promise.");
    return t;
  }
  _parseAsync(e) {
    let t = this._parse(e);
    return Promise.resolve(t);
  }
  parse(e, t) {
    let s3 = this.safeParse(e, t);
    if (s3.success) return s3.data;
    throw s3.error;
  }
  safeParse(e, t) {
    var s3;
    let n2 = { common: { issues: [], async: (s3 = t?.async) !== null && s3 !== void 0 ? s3 : false, contextualErrorMap: t?.errorMap }, path: t?.path || [], schemaErrorMap: this._def.errorMap, parent: null, data: e, parsedType: R6(e) }, a3 = this._parseSync({ data: e, path: n2.path, parent: n2 });
    return Oe4(n2, a3);
  }
  "~validate"(e) {
    var t, s3;
    let n2 = { common: { issues: [], async: !!this["~standard"].async }, path: [], schemaErrorMap: this._def.errorMap, parent: null, data: e, parsedType: R6(e) };
    if (!this["~standard"].async) try {
      let a3 = this._parseSync({ data: e, path: [], parent: n2 });
      return P4(a3) ? { value: a3.value } : { issues: n2.common.issues };
    } catch (a3) {
      !((s3 = (t = a3?.message) === null || t === void 0 ? void 0 : t.toLowerCase()) === null || s3 === void 0) && s3.includes("encountered") && (this["~standard"].async = true), n2.common = { issues: [], async: true };
    }
    return this._parseAsync({ data: e, path: [], parent: n2 }).then((a3) => P4(a3) ? { value: a3.value } : { issues: n2.common.issues });
  }
  async parseAsync(e, t) {
    let s3 = await this.safeParseAsync(e, t);
    if (s3.success) return s3.data;
    throw s3.error;
  }
  async safeParseAsync(e, t) {
    let s3 = { common: { issues: [], contextualErrorMap: t?.errorMap, async: true }, path: t?.path || [], schemaErrorMap: this._def.errorMap, parent: null, data: e, parsedType: R6(e) }, n2 = this._parse({ data: e, path: s3.path, parent: s3 }), a3 = await (ue5(n2) ? n2 : Promise.resolve(n2));
    return Oe4(s3, a3);
  }
  refine(e, t) {
    let s3 = /* @__PURE__ */ __name((n2) => typeof t == "string" || typeof t > "u" ? { message: t } : typeof t == "function" ? t(n2) : t, "s");
    return this._refinement((n2, a3) => {
      let i2 = e(n2), o6 = /* @__PURE__ */ __name(() => a3.addIssue({ code: d6.custom, ...s3(n2) }), "o");
      return typeof Promise < "u" && i2 instanceof Promise ? i2.then((l5) => l5 ? true : (o6(), false)) : i2 ? true : (o6(), false);
    });
  }
  refinement(e, t) {
    return this._refinement((s3, n2) => e(s3) ? true : (n2.addIssue(typeof t == "function" ? t(s3, n2) : t), false));
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
    return O6.create(this, this._def);
  }
  nullable() {
    return Z4.create(this, this._def);
  }
  nullish() {
    return this.nullable().optional();
  }
  array() {
    return I9.create(this);
  }
  promise() {
    return V6.create(this, this._def);
  }
  or(e) {
    return W8.create([this, e], this._def);
  }
  and(e) {
    return q7.create(this, e, this._def);
  }
  transform(e) {
    return new C5({ ..._9(this._def), schema: this, typeName: m5.ZodEffects, effect: { type: "transform", transform: e } });
  }
  default(e) {
    let t = typeof e == "function" ? e : () => e;
    return new X6({ ..._9(this._def), innerType: this, defaultValue: t, typeName: m5.ZodDefault });
  }
  brand() {
    return new le5({ typeName: m5.ZodBranded, type: this, ..._9(this._def) });
  }
  catch(e) {
    let t = typeof e == "function" ? e : () => e;
    return new Q6({ ..._9(this._def), innerType: this, catchValue: t, typeName: m5.ZodCatch });
  }
  describe(e) {
    let t = this.constructor;
    return new t({ ...this._def, description: e });
  }
  pipe(e) {
    return fe5.create(this, e);
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
var ke3;
var Xe3 = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
var Qe3 = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/;
var Ke3 = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
var et4 = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
var tt4 = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
var rt4 = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/;
var je4 = "((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))";
var st4 = new RegExp(`^${je4}$`);
function Re3(r32) {
  let e = "([01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d";
  return r32.precision ? e = `${e}\\.\\d{${r32.precision}}` : r32.precision == null && (e = `${e}(\\.\\d+)?`), e;
}
__name(Re3, "Re");
function nt4(r32) {
  return new RegExp(`^${Re3(r32)}$`);
}
__name(nt4, "nt");
function Ne3(r32) {
  let e = `${je4}T${Re3(r32)}`, t = [];
  return t.push(r32.local ? "Z?" : "Z"), r32.offset && t.push("([+-]\\d{2}:?\\d{2})"), e = `${e}(${t.join("|")})`, new RegExp(`^${e}$`);
}
__name(Ne3, "Ne");
function at4(r32, e) {
  return !!((e === "v4" || !e) && Xe3.test(r32) || (e === "v6" || !e) && Ke3.test(r32));
}
__name(at4, "at");
function it4(r32, e) {
  if (!Je3.test(r32)) return false;
  try {
    let [t] = r32.split("."), s3 = t.replace(/-/g, "+").replace(/_/g, "/").padEnd(t.length + (4 - t.length % 4) % 4, "="), n2 = JSON.parse(atob(s3));
    return !(typeof n2 != "object" || n2 === null || !n2.typ || !n2.alg || e && n2.alg !== e);
  } catch {
    return false;
  }
}
__name(it4, "it");
function ot4(r32, e) {
  return !!((e === "v4" || !e) && Qe3.test(r32) || (e === "v6" || !e) && et4.test(r32));
}
__name(ot4, "ot");
var $5 = class r19 extends y6 {
  static {
    __name(this, "r");
  }
  _parse(e) {
    if (this._def.coerce && (e.data = String(e.data)), this._getType(e) !== f3.string) {
      let a3 = this._getOrReturnCtx(e);
      return u5(a3, { code: d6.invalid_type, expected: f3.string, received: a3.parsedType }), v5;
    }
    let s3 = new x8(), n2;
    for (let a3 of this._def.checks) if (a3.kind === "min") e.data.length < a3.value && (n2 = this._getOrReturnCtx(e, n2), u5(n2, { code: d6.too_small, minimum: a3.value, type: "string", inclusive: true, exact: false, message: a3.message }), s3.dirty());
    else if (a3.kind === "max") e.data.length > a3.value && (n2 = this._getOrReturnCtx(e, n2), u5(n2, { code: d6.too_big, maximum: a3.value, type: "string", inclusive: true, exact: false, message: a3.message }), s3.dirty());
    else if (a3.kind === "length") {
      let i2 = e.data.length > a3.value, o6 = e.data.length < a3.value;
      (i2 || o6) && (n2 = this._getOrReturnCtx(e, n2), i2 ? u5(n2, { code: d6.too_big, maximum: a3.value, type: "string", inclusive: true, exact: true, message: a3.message }) : o6 && u5(n2, { code: d6.too_small, minimum: a3.value, type: "string", inclusive: true, exact: true, message: a3.message }), s3.dirty());
    } else if (a3.kind === "email") He3.test(e.data) || (n2 = this._getOrReturnCtx(e, n2), u5(n2, { validation: "email", code: d6.invalid_string, message: a3.message }), s3.dirty());
    else if (a3.kind === "emoji") ke3 || (ke3 = new RegExp(Ge3, "u")), ke3.test(e.data) || (n2 = this._getOrReturnCtx(e, n2), u5(n2, { validation: "emoji", code: d6.invalid_string, message: a3.message }), s3.dirty());
    else if (a3.kind === "uuid") We3.test(e.data) || (n2 = this._getOrReturnCtx(e, n2), u5(n2, { validation: "uuid", code: d6.invalid_string, message: a3.message }), s3.dirty());
    else if (a3.kind === "nanoid") qe3.test(e.data) || (n2 = this._getOrReturnCtx(e, n2), u5(n2, { validation: "nanoid", code: d6.invalid_string, message: a3.message }), s3.dirty());
    else if (a3.kind === "cuid") Ue3.test(e.data) || (n2 = this._getOrReturnCtx(e, n2), u5(n2, { validation: "cuid", code: d6.invalid_string, message: a3.message }), s3.dirty());
    else if (a3.kind === "cuid2") Fe3.test(e.data) || (n2 = this._getOrReturnCtx(e, n2), u5(n2, { validation: "cuid2", code: d6.invalid_string, message: a3.message }), s3.dirty());
    else if (a3.kind === "ulid") Be3.test(e.data) || (n2 = this._getOrReturnCtx(e, n2), u5(n2, { validation: "ulid", code: d6.invalid_string, message: a3.message }), s3.dirty());
    else if (a3.kind === "url") try {
      new URL(e.data);
    } catch {
      n2 = this._getOrReturnCtx(e, n2), u5(n2, { validation: "url", code: d6.invalid_string, message: a3.message }), s3.dirty();
    }
    else a3.kind === "regex" ? (a3.regex.lastIndex = 0, a3.regex.test(e.data) || (n2 = this._getOrReturnCtx(e, n2), u5(n2, { validation: "regex", code: d6.invalid_string, message: a3.message }), s3.dirty())) : a3.kind === "trim" ? e.data = e.data.trim() : a3.kind === "includes" ? e.data.includes(a3.value, a3.position) || (n2 = this._getOrReturnCtx(e, n2), u5(n2, { code: d6.invalid_string, validation: { includes: a3.value, position: a3.position }, message: a3.message }), s3.dirty()) : a3.kind === "toLowerCase" ? e.data = e.data.toLowerCase() : a3.kind === "toUpperCase" ? e.data = e.data.toUpperCase() : a3.kind === "startsWith" ? e.data.startsWith(a3.value) || (n2 = this._getOrReturnCtx(e, n2), u5(n2, { code: d6.invalid_string, validation: { startsWith: a3.value }, message: a3.message }), s3.dirty()) : a3.kind === "endsWith" ? e.data.endsWith(a3.value) || (n2 = this._getOrReturnCtx(e, n2), u5(n2, { code: d6.invalid_string, validation: { endsWith: a3.value }, message: a3.message }), s3.dirty()) : a3.kind === "datetime" ? Ne3(a3).test(e.data) || (n2 = this._getOrReturnCtx(e, n2), u5(n2, { code: d6.invalid_string, validation: "datetime", message: a3.message }), s3.dirty()) : a3.kind === "date" ? st4.test(e.data) || (n2 = this._getOrReturnCtx(e, n2), u5(n2, { code: d6.invalid_string, validation: "date", message: a3.message }), s3.dirty()) : a3.kind === "time" ? nt4(a3).test(e.data) || (n2 = this._getOrReturnCtx(e, n2), u5(n2, { code: d6.invalid_string, validation: "time", message: a3.message }), s3.dirty()) : a3.kind === "duration" ? Ye3.test(e.data) || (n2 = this._getOrReturnCtx(e, n2), u5(n2, { validation: "duration", code: d6.invalid_string, message: a3.message }), s3.dirty()) : a3.kind === "ip" ? at4(e.data, a3.version) || (n2 = this._getOrReturnCtx(e, n2), u5(n2, { validation: "ip", code: d6.invalid_string, message: a3.message }), s3.dirty()) : a3.kind === "jwt" ? it4(e.data, a3.alg) || (n2 = this._getOrReturnCtx(e, n2), u5(n2, { validation: "jwt", code: d6.invalid_string, message: a3.message }), s3.dirty()) : a3.kind === "cidr" ? ot4(e.data, a3.version) || (n2 = this._getOrReturnCtx(e, n2), u5(n2, { validation: "cidr", code: d6.invalid_string, message: a3.message }), s3.dirty()) : a3.kind === "base64" ? tt4.test(e.data) || (n2 = this._getOrReturnCtx(e, n2), u5(n2, { validation: "base64", code: d6.invalid_string, message: a3.message }), s3.dirty()) : a3.kind === "base64url" ? rt4.test(e.data) || (n2 = this._getOrReturnCtx(e, n2), u5(n2, { validation: "base64url", code: d6.invalid_string, message: a3.message }), s3.dirty()) : g7.assertNever(a3);
    return { status: s3.value, value: e.data };
  }
  _regex(e, t, s3) {
    return this.refinement((n2) => e.test(n2), { validation: t, code: d6.invalid_string, ...h7.errToObj(s3) });
  }
  _addCheck(e) {
    return new r19({ ...this._def, checks: [...this._def.checks, e] });
  }
  email(e) {
    return this._addCheck({ kind: "email", ...h7.errToObj(e) });
  }
  url(e) {
    return this._addCheck({ kind: "url", ...h7.errToObj(e) });
  }
  emoji(e) {
    return this._addCheck({ kind: "emoji", ...h7.errToObj(e) });
  }
  uuid(e) {
    return this._addCheck({ kind: "uuid", ...h7.errToObj(e) });
  }
  nanoid(e) {
    return this._addCheck({ kind: "nanoid", ...h7.errToObj(e) });
  }
  cuid(e) {
    return this._addCheck({ kind: "cuid", ...h7.errToObj(e) });
  }
  cuid2(e) {
    return this._addCheck({ kind: "cuid2", ...h7.errToObj(e) });
  }
  ulid(e) {
    return this._addCheck({ kind: "ulid", ...h7.errToObj(e) });
  }
  base64(e) {
    return this._addCheck({ kind: "base64", ...h7.errToObj(e) });
  }
  base64url(e) {
    return this._addCheck({ kind: "base64url", ...h7.errToObj(e) });
  }
  jwt(e) {
    return this._addCheck({ kind: "jwt", ...h7.errToObj(e) });
  }
  ip(e) {
    return this._addCheck({ kind: "ip", ...h7.errToObj(e) });
  }
  cidr(e) {
    return this._addCheck({ kind: "cidr", ...h7.errToObj(e) });
  }
  datetime(e) {
    var t, s3;
    return typeof e == "string" ? this._addCheck({ kind: "datetime", precision: null, offset: false, local: false, message: e }) : this._addCheck({ kind: "datetime", precision: typeof e?.precision > "u" ? null : e?.precision, offset: (t = e?.offset) !== null && t !== void 0 ? t : false, local: (s3 = e?.local) !== null && s3 !== void 0 ? s3 : false, ...h7.errToObj(e?.message) });
  }
  date(e) {
    return this._addCheck({ kind: "date", message: e });
  }
  time(e) {
    return typeof e == "string" ? this._addCheck({ kind: "time", precision: null, message: e }) : this._addCheck({ kind: "time", precision: typeof e?.precision > "u" ? null : e?.precision, ...h7.errToObj(e?.message) });
  }
  duration(e) {
    return this._addCheck({ kind: "duration", ...h7.errToObj(e) });
  }
  regex(e, t) {
    return this._addCheck({ kind: "regex", regex: e, ...h7.errToObj(t) });
  }
  includes(e, t) {
    return this._addCheck({ kind: "includes", value: e, position: t?.position, ...h7.errToObj(t?.message) });
  }
  startsWith(e, t) {
    return this._addCheck({ kind: "startsWith", value: e, ...h7.errToObj(t) });
  }
  endsWith(e, t) {
    return this._addCheck({ kind: "endsWith", value: e, ...h7.errToObj(t) });
  }
  min(e, t) {
    return this._addCheck({ kind: "min", value: e, ...h7.errToObj(t) });
  }
  max(e, t) {
    return this._addCheck({ kind: "max", value: e, ...h7.errToObj(t) });
  }
  length(e, t) {
    return this._addCheck({ kind: "length", value: e, ...h7.errToObj(t) });
  }
  nonempty(e) {
    return this.min(1, h7.errToObj(e));
  }
  trim() {
    return new r19({ ...this._def, checks: [...this._def.checks, { kind: "trim" }] });
  }
  toLowerCase() {
    return new r19({ ...this._def, checks: [...this._def.checks, { kind: "toLowerCase" }] });
  }
  toUpperCase() {
    return new r19({ ...this._def, checks: [...this._def.checks, { kind: "toUpperCase" }] });
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
$5.create = (r32) => {
  var e;
  return new $5({ checks: [], typeName: m5.ZodString, coerce: (e = r32?.coerce) !== null && e !== void 0 ? e : false, ..._9(r32) });
};
function dt3(r32, e) {
  let t = (r32.toString().split(".")[1] || "").length, s3 = (e.toString().split(".")[1] || "").length, n2 = t > s3 ? t : s3, a3 = parseInt(r32.toFixed(n2).replace(".", "")), i2 = parseInt(e.toFixed(n2).replace(".", ""));
  return a3 % i2 / Math.pow(10, n2);
}
__name(dt3, "dt");
var z6 = class r20 extends y6 {
  static {
    __name(this, "r");
  }
  constructor() {
    super(...arguments), this.min = this.gte, this.max = this.lte, this.step = this.multipleOf;
  }
  _parse(e) {
    if (this._def.coerce && (e.data = Number(e.data)), this._getType(e) !== f3.number) {
      let a3 = this._getOrReturnCtx(e);
      return u5(a3, { code: d6.invalid_type, expected: f3.number, received: a3.parsedType }), v5;
    }
    let s3, n2 = new x8();
    for (let a3 of this._def.checks) a3.kind === "int" ? g7.isInteger(e.data) || (s3 = this._getOrReturnCtx(e, s3), u5(s3, { code: d6.invalid_type, expected: "integer", received: "float", message: a3.message }), n2.dirty()) : a3.kind === "min" ? (a3.inclusive ? e.data < a3.value : e.data <= a3.value) && (s3 = this._getOrReturnCtx(e, s3), u5(s3, { code: d6.too_small, minimum: a3.value, type: "number", inclusive: a3.inclusive, exact: false, message: a3.message }), n2.dirty()) : a3.kind === "max" ? (a3.inclusive ? e.data > a3.value : e.data >= a3.value) && (s3 = this._getOrReturnCtx(e, s3), u5(s3, { code: d6.too_big, maximum: a3.value, type: "number", inclusive: a3.inclusive, exact: false, message: a3.message }), n2.dirty()) : a3.kind === "multipleOf" ? dt3(e.data, a3.value) !== 0 && (s3 = this._getOrReturnCtx(e, s3), u5(s3, { code: d6.not_multiple_of, multipleOf: a3.value, message: a3.message }), n2.dirty()) : a3.kind === "finite" ? Number.isFinite(e.data) || (s3 = this._getOrReturnCtx(e, s3), u5(s3, { code: d6.not_finite, message: a3.message }), n2.dirty()) : g7.assertNever(a3);
    return { status: n2.value, value: e.data };
  }
  gte(e, t) {
    return this.setLimit("min", e, true, h7.toString(t));
  }
  gt(e, t) {
    return this.setLimit("min", e, false, h7.toString(t));
  }
  lte(e, t) {
    return this.setLimit("max", e, true, h7.toString(t));
  }
  lt(e, t) {
    return this.setLimit("max", e, false, h7.toString(t));
  }
  setLimit(e, t, s3, n2) {
    return new r20({ ...this._def, checks: [...this._def.checks, { kind: e, value: t, inclusive: s3, message: h7.toString(n2) }] });
  }
  _addCheck(e) {
    return new r20({ ...this._def, checks: [...this._def.checks, e] });
  }
  int(e) {
    return this._addCheck({ kind: "int", message: h7.toString(e) });
  }
  positive(e) {
    return this._addCheck({ kind: "min", value: 0, inclusive: false, message: h7.toString(e) });
  }
  negative(e) {
    return this._addCheck({ kind: "max", value: 0, inclusive: false, message: h7.toString(e) });
  }
  nonpositive(e) {
    return this._addCheck({ kind: "max", value: 0, inclusive: true, message: h7.toString(e) });
  }
  nonnegative(e) {
    return this._addCheck({ kind: "min", value: 0, inclusive: true, message: h7.toString(e) });
  }
  multipleOf(e, t) {
    return this._addCheck({ kind: "multipleOf", value: e, message: h7.toString(t) });
  }
  finite(e) {
    return this._addCheck({ kind: "finite", message: h7.toString(e) });
  }
  safe(e) {
    return this._addCheck({ kind: "min", inclusive: true, value: Number.MIN_SAFE_INTEGER, message: h7.toString(e) })._addCheck({ kind: "max", inclusive: true, value: Number.MAX_SAFE_INTEGER, message: h7.toString(e) });
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
    return !!this._def.checks.find((e) => e.kind === "int" || e.kind === "multipleOf" && g7.isInteger(e.value));
  }
  get isFinite() {
    let e = null, t = null;
    for (let s3 of this._def.checks) {
      if (s3.kind === "finite" || s3.kind === "int" || s3.kind === "multipleOf") return true;
      s3.kind === "min" ? (t === null || s3.value > t) && (t = s3.value) : s3.kind === "max" && (e === null || s3.value < e) && (e = s3.value);
    }
    return Number.isFinite(t) && Number.isFinite(e);
  }
};
z6.create = (r32) => new z6({ checks: [], typeName: m5.ZodNumber, coerce: r32?.coerce || false, ..._9(r32) });
var D6 = class r21 extends y6 {
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
    let s3, n2 = new x8();
    for (let a3 of this._def.checks) a3.kind === "min" ? (a3.inclusive ? e.data < a3.value : e.data <= a3.value) && (s3 = this._getOrReturnCtx(e, s3), u5(s3, { code: d6.too_small, type: "bigint", minimum: a3.value, inclusive: a3.inclusive, message: a3.message }), n2.dirty()) : a3.kind === "max" ? (a3.inclusive ? e.data > a3.value : e.data >= a3.value) && (s3 = this._getOrReturnCtx(e, s3), u5(s3, { code: d6.too_big, type: "bigint", maximum: a3.value, inclusive: a3.inclusive, message: a3.message }), n2.dirty()) : a3.kind === "multipleOf" ? e.data % a3.value !== BigInt(0) && (s3 = this._getOrReturnCtx(e, s3), u5(s3, { code: d6.not_multiple_of, multipleOf: a3.value, message: a3.message }), n2.dirty()) : g7.assertNever(a3);
    return { status: n2.value, value: e.data };
  }
  _getInvalidInput(e) {
    let t = this._getOrReturnCtx(e);
    return u5(t, { code: d6.invalid_type, expected: f3.bigint, received: t.parsedType }), v5;
  }
  gte(e, t) {
    return this.setLimit("min", e, true, h7.toString(t));
  }
  gt(e, t) {
    return this.setLimit("min", e, false, h7.toString(t));
  }
  lte(e, t) {
    return this.setLimit("max", e, true, h7.toString(t));
  }
  lt(e, t) {
    return this.setLimit("max", e, false, h7.toString(t));
  }
  setLimit(e, t, s3, n2) {
    return new r21({ ...this._def, checks: [...this._def.checks, { kind: e, value: t, inclusive: s3, message: h7.toString(n2) }] });
  }
  _addCheck(e) {
    return new r21({ ...this._def, checks: [...this._def.checks, e] });
  }
  positive(e) {
    return this._addCheck({ kind: "min", value: BigInt(0), inclusive: false, message: h7.toString(e) });
  }
  negative(e) {
    return this._addCheck({ kind: "max", value: BigInt(0), inclusive: false, message: h7.toString(e) });
  }
  nonpositive(e) {
    return this._addCheck({ kind: "max", value: BigInt(0), inclusive: true, message: h7.toString(e) });
  }
  nonnegative(e) {
    return this._addCheck({ kind: "min", value: BigInt(0), inclusive: true, message: h7.toString(e) });
  }
  multipleOf(e, t) {
    return this._addCheck({ kind: "multipleOf", value: e, message: h7.toString(t) });
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
D6.create = (r32) => {
  var e;
  return new D6({ checks: [], typeName: m5.ZodBigInt, coerce: (e = r32?.coerce) !== null && e !== void 0 ? e : false, ..._9(r32) });
};
var L6 = class extends y6 {
  static {
    __name(this, "L");
  }
  _parse(e) {
    if (this._def.coerce && (e.data = !!e.data), this._getType(e) !== f3.boolean) {
      let s3 = this._getOrReturnCtx(e);
      return u5(s3, { code: d6.invalid_type, expected: f3.boolean, received: s3.parsedType }), v5;
    }
    return b5(e.data);
  }
};
L6.create = (r32) => new L6({ typeName: m5.ZodBoolean, coerce: r32?.coerce || false, ..._9(r32) });
var U6 = class r22 extends y6 {
  static {
    __name(this, "r");
  }
  _parse(e) {
    if (this._def.coerce && (e.data = new Date(e.data)), this._getType(e) !== f3.date) {
      let a3 = this._getOrReturnCtx(e);
      return u5(a3, { code: d6.invalid_type, expected: f3.date, received: a3.parsedType }), v5;
    }
    if (isNaN(e.data.getTime())) {
      let a3 = this._getOrReturnCtx(e);
      return u5(a3, { code: d6.invalid_date }), v5;
    }
    let s3 = new x8(), n2;
    for (let a3 of this._def.checks) a3.kind === "min" ? e.data.getTime() < a3.value && (n2 = this._getOrReturnCtx(e, n2), u5(n2, { code: d6.too_small, message: a3.message, inclusive: true, exact: false, minimum: a3.value, type: "date" }), s3.dirty()) : a3.kind === "max" ? e.data.getTime() > a3.value && (n2 = this._getOrReturnCtx(e, n2), u5(n2, { code: d6.too_big, message: a3.message, inclusive: true, exact: false, maximum: a3.value, type: "date" }), s3.dirty()) : g7.assertNever(a3);
    return { status: s3.value, value: new Date(e.data.getTime()) };
  }
  _addCheck(e) {
    return new r22({ ...this._def, checks: [...this._def.checks, e] });
  }
  min(e, t) {
    return this._addCheck({ kind: "min", value: e.getTime(), message: h7.toString(t) });
  }
  max(e, t) {
    return this._addCheck({ kind: "max", value: e.getTime(), message: h7.toString(t) });
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
U6.create = (r32) => new U6({ checks: [], coerce: r32?.coerce || false, typeName: m5.ZodDate, ..._9(r32) });
var se5 = class extends y6 {
  static {
    __name(this, "se");
  }
  _parse(e) {
    if (this._getType(e) !== f3.symbol) {
      let s3 = this._getOrReturnCtx(e);
      return u5(s3, { code: d6.invalid_type, expected: f3.symbol, received: s3.parsedType }), v5;
    }
    return b5(e.data);
  }
};
se5.create = (r32) => new se5({ typeName: m5.ZodSymbol, ..._9(r32) });
var F6 = class extends y6 {
  static {
    __name(this, "F");
  }
  _parse(e) {
    if (this._getType(e) !== f3.undefined) {
      let s3 = this._getOrReturnCtx(e);
      return u5(s3, { code: d6.invalid_type, expected: f3.undefined, received: s3.parsedType }), v5;
    }
    return b5(e.data);
  }
};
F6.create = (r32) => new F6({ typeName: m5.ZodUndefined, ..._9(r32) });
var B7 = class extends y6 {
  static {
    __name(this, "B");
  }
  _parse(e) {
    if (this._getType(e) !== f3.null) {
      let s3 = this._getOrReturnCtx(e);
      return u5(s3, { code: d6.invalid_type, expected: f3.null, received: s3.parsedType }), v5;
    }
    return b5(e.data);
  }
};
B7.create = (r32) => new B7({ typeName: m5.ZodNull, ..._9(r32) });
var M5 = class extends y6 {
  static {
    __name(this, "M");
  }
  constructor() {
    super(...arguments), this._any = true;
  }
  _parse(e) {
    return b5(e.data);
  }
};
M5.create = (r32) => new M5({ typeName: m5.ZodAny, ..._9(r32) });
var N5 = class extends y6 {
  static {
    __name(this, "N");
  }
  constructor() {
    super(...arguments), this._unknown = true;
  }
  _parse(e) {
    return b5(e.data);
  }
};
N5.create = (r32) => new N5({ typeName: m5.ZodUnknown, ..._9(r32) });
var A6 = class extends y6 {
  static {
    __name(this, "A");
  }
  _parse(e) {
    let t = this._getOrReturnCtx(e);
    return u5(t, { code: d6.invalid_type, expected: f3.never, received: t.parsedType }), v5;
  }
};
A6.create = (r32) => new A6({ typeName: m5.ZodNever, ..._9(r32) });
var ne5 = class extends y6 {
  static {
    __name(this, "ne");
  }
  _parse(e) {
    if (this._getType(e) !== f3.undefined) {
      let s3 = this._getOrReturnCtx(e);
      return u5(s3, { code: d6.invalid_type, expected: f3.void, received: s3.parsedType }), v5;
    }
    return b5(e.data);
  }
};
ne5.create = (r32) => new ne5({ typeName: m5.ZodVoid, ..._9(r32) });
var I9 = class r23 extends y6 {
  static {
    __name(this, "r");
  }
  _parse(e) {
    let { ctx: t, status: s3 } = this._processInputParams(e), n2 = this._def;
    if (t.parsedType !== f3.array) return u5(t, { code: d6.invalid_type, expected: f3.array, received: t.parsedType }), v5;
    if (n2.exactLength !== null) {
      let i2 = t.data.length > n2.exactLength.value, o6 = t.data.length < n2.exactLength.value;
      (i2 || o6) && (u5(t, { code: i2 ? d6.too_big : d6.too_small, minimum: o6 ? n2.exactLength.value : void 0, maximum: i2 ? n2.exactLength.value : void 0, type: "array", inclusive: true, exact: true, message: n2.exactLength.message }), s3.dirty());
    }
    if (n2.minLength !== null && t.data.length < n2.minLength.value && (u5(t, { code: d6.too_small, minimum: n2.minLength.value, type: "array", inclusive: true, exact: false, message: n2.minLength.message }), s3.dirty()), n2.maxLength !== null && t.data.length > n2.maxLength.value && (u5(t, { code: d6.too_big, maximum: n2.maxLength.value, type: "array", inclusive: true, exact: false, message: n2.maxLength.message }), s3.dirty()), t.common.async) return Promise.all([...t.data].map((i2, o6) => n2.type._parseAsync(new S8(t, i2, t.path, o6)))).then((i2) => x8.mergeArray(s3, i2));
    let a3 = [...t.data].map((i2, o6) => n2.type._parseSync(new S8(t, i2, t.path, o6)));
    return x8.mergeArray(s3, a3);
  }
  get element() {
    return this._def.type;
  }
  min(e, t) {
    return new r23({ ...this._def, minLength: { value: e, message: h7.toString(t) } });
  }
  max(e, t) {
    return new r23({ ...this._def, maxLength: { value: e, message: h7.toString(t) } });
  }
  length(e, t) {
    return new r23({ ...this._def, exactLength: { value: e, message: h7.toString(t) } });
  }
  nonempty(e) {
    return this.min(1, e);
  }
};
I9.create = (r32, e) => new I9({ type: r32, minLength: null, maxLength: null, exactLength: null, typeName: m5.ZodArray, ..._9(e) });
function ee4(r32) {
  if (r32 instanceof w7) {
    let e = {};
    for (let t in r32.shape) {
      let s3 = r32.shape[t];
      e[t] = O6.create(ee4(s3));
    }
    return new w7({ ...r32._def, shape: /* @__PURE__ */ __name(() => e, "shape") });
  } else return r32 instanceof I9 ? new I9({ ...r32._def, type: ee4(r32.element) }) : r32 instanceof O6 ? O6.create(ee4(r32.unwrap())) : r32 instanceof Z4 ? Z4.create(ee4(r32.unwrap())) : r32 instanceof E7 ? E7.create(r32.items.map((e) => ee4(e))) : r32;
}
__name(ee4, "ee");
var w7 = class r24 extends y6 {
  static {
    __name(this, "r");
  }
  constructor() {
    super(...arguments), this._cached = null, this.nonstrict = this.passthrough, this.augment = this.extend;
  }
  _getCached() {
    if (this._cached !== null) return this._cached;
    let e = this._def.shape(), t = g7.objectKeys(e);
    return this._cached = { shape: e, keys: t };
  }
  _parse(e) {
    if (this._getType(e) !== f3.object) {
      let c4 = this._getOrReturnCtx(e);
      return u5(c4, { code: d6.invalid_type, expected: f3.object, received: c4.parsedType }), v5;
    }
    let { status: s3, ctx: n2 } = this._processInputParams(e), { shape: a3, keys: i2 } = this._getCached(), o6 = [];
    if (!(this._def.catchall instanceof A6 && this._def.unknownKeys === "strip")) for (let c4 in n2.data) i2.includes(c4) || o6.push(c4);
    let l5 = [];
    for (let c4 of i2) {
      let p3 = a3[c4], k7 = n2.data[c4];
      l5.push({ key: { status: "valid", value: c4 }, value: p3._parse(new S8(n2, k7, n2.path, c4)), alwaysSet: c4 in n2.data });
    }
    if (this._def.catchall instanceof A6) {
      let c4 = this._def.unknownKeys;
      if (c4 === "passthrough") for (let p3 of o6) l5.push({ key: { status: "valid", value: p3 }, value: { status: "valid", value: n2.data[p3] } });
      else if (c4 === "strict") o6.length > 0 && (u5(n2, { code: d6.unrecognized_keys, keys: o6 }), s3.dirty());
      else if (c4 !== "strip") throw new Error("Internal ZodObject error: invalid unknownKeys value.");
    } else {
      let c4 = this._def.catchall;
      for (let p3 of o6) {
        let k7 = n2.data[p3];
        l5.push({ key: { status: "valid", value: p3 }, value: c4._parse(new S8(n2, k7, n2.path, p3)), alwaysSet: p3 in n2.data });
      }
    }
    return n2.common.async ? Promise.resolve().then(async () => {
      let c4 = [];
      for (let p3 of l5) {
        let k7 = await p3.key, he4 = await p3.value;
        c4.push({ key: k7, value: he4, alwaysSet: p3.alwaysSet });
      }
      return c4;
    }).then((c4) => x8.mergeObjectSync(s3, c4)) : x8.mergeObjectSync(s3, l5);
  }
  get shape() {
    return this._def.shape();
  }
  strict(e) {
    return h7.errToObj, new r24({ ...this._def, unknownKeys: "strict", ...e !== void 0 ? { errorMap: /* @__PURE__ */ __name((t, s3) => {
      var n2, a3, i2, o6;
      let l5 = (i2 = (a3 = (n2 = this._def).errorMap) === null || a3 === void 0 ? void 0 : a3.call(n2, t, s3).message) !== null && i2 !== void 0 ? i2 : s3.defaultError;
      return t.code === "unrecognized_keys" ? { message: (o6 = h7.errToObj(e).message) !== null && o6 !== void 0 ? o6 : l5 } : { message: l5 };
    }, "errorMap") } : {} });
  }
  strip() {
    return new r24({ ...this._def, unknownKeys: "strip" });
  }
  passthrough() {
    return new r24({ ...this._def, unknownKeys: "passthrough" });
  }
  extend(e) {
    return new r24({ ...this._def, shape: /* @__PURE__ */ __name(() => ({ ...this._def.shape(), ...e }), "shape") });
  }
  merge(e) {
    return new r24({ unknownKeys: e._def.unknownKeys, catchall: e._def.catchall, shape: /* @__PURE__ */ __name(() => ({ ...this._def.shape(), ...e._def.shape() }), "shape"), typeName: m5.ZodObject });
  }
  setKey(e, t) {
    return this.augment({ [e]: t });
  }
  catchall(e) {
    return new r24({ ...this._def, catchall: e });
  }
  pick(e) {
    let t = {};
    return g7.objectKeys(e).forEach((s3) => {
      e[s3] && this.shape[s3] && (t[s3] = this.shape[s3]);
    }), new r24({ ...this._def, shape: /* @__PURE__ */ __name(() => t, "shape") });
  }
  omit(e) {
    let t = {};
    return g7.objectKeys(this.shape).forEach((s3) => {
      e[s3] || (t[s3] = this.shape[s3]);
    }), new r24({ ...this._def, shape: /* @__PURE__ */ __name(() => t, "shape") });
  }
  deepPartial() {
    return ee4(this);
  }
  partial(e) {
    let t = {};
    return g7.objectKeys(this.shape).forEach((s3) => {
      let n2 = this.shape[s3];
      e && !e[s3] ? t[s3] = n2 : t[s3] = n2.optional();
    }), new r24({ ...this._def, shape: /* @__PURE__ */ __name(() => t, "shape") });
  }
  required(e) {
    let t = {};
    return g7.objectKeys(this.shape).forEach((s3) => {
      if (e && !e[s3]) t[s3] = this.shape[s3];
      else {
        let a3 = this.shape[s3];
        for (; a3 instanceof O6; ) a3 = a3._def.innerType;
        t[s3] = a3;
      }
    }), new r24({ ...this._def, shape: /* @__PURE__ */ __name(() => t, "shape") });
  }
  keyof() {
    return Ie3(g7.objectKeys(this.shape));
  }
};
w7.create = (r32, e) => new w7({ shape: /* @__PURE__ */ __name(() => r32, "shape"), unknownKeys: "strip", catchall: A6.create(), typeName: m5.ZodObject, ..._9(e) });
w7.strictCreate = (r32, e) => new w7({ shape: /* @__PURE__ */ __name(() => r32, "shape"), unknownKeys: "strict", catchall: A6.create(), typeName: m5.ZodObject, ..._9(e) });
w7.lazycreate = (r32, e) => new w7({ shape: r32, unknownKeys: "strip", catchall: A6.create(), typeName: m5.ZodObject, ..._9(e) });
var W8 = class extends y6 {
  static {
    __name(this, "W");
  }
  _parse(e) {
    let { ctx: t } = this._processInputParams(e), s3 = this._def.options;
    function n2(a3) {
      for (let o6 of a3) if (o6.result.status === "valid") return o6.result;
      for (let o6 of a3) if (o6.result.status === "dirty") return t.common.issues.push(...o6.ctx.common.issues), o6.result;
      let i2 = a3.map((o6) => new T7(o6.ctx.common.issues));
      return u5(t, { code: d6.invalid_union, unionErrors: i2 }), v5;
    }
    __name(n2, "n");
    if (t.common.async) return Promise.all(s3.map(async (a3) => {
      let i2 = { ...t, common: { ...t.common, issues: [] }, parent: null };
      return { result: await a3._parseAsync({ data: t.data, path: t.path, parent: i2 }), ctx: i2 };
    })).then(n2);
    {
      let a3, i2 = [];
      for (let l5 of s3) {
        let c4 = { ...t, common: { ...t.common, issues: [] }, parent: null }, p3 = l5._parseSync({ data: t.data, path: t.path, parent: c4 });
        if (p3.status === "valid") return p3;
        p3.status === "dirty" && !a3 && (a3 = { result: p3, ctx: c4 }), c4.common.issues.length && i2.push(c4.common.issues);
      }
      if (a3) return t.common.issues.push(...a3.ctx.common.issues), a3.result;
      let o6 = i2.map((l5) => new T7(l5));
      return u5(t, { code: d6.invalid_union, unionErrors: o6 }), v5;
    }
  }
  get options() {
    return this._def.options;
  }
};
W8.create = (r32, e) => new W8({ options: r32, typeName: m5.ZodUnion, ..._9(e) });
var j7 = /* @__PURE__ */ __name((r32) => r32 instanceof J6 ? j7(r32.schema) : r32 instanceof C5 ? j7(r32.innerType()) : r32 instanceof Y4 ? [r32.value] : r32 instanceof H5 ? r32.options : r32 instanceof G6 ? g7.objectValues(r32.enum) : r32 instanceof X6 ? j7(r32._def.innerType) : r32 instanceof F6 ? [void 0] : r32 instanceof B7 ? [null] : r32 instanceof O6 ? [void 0, ...j7(r32.unwrap())] : r32 instanceof Z4 ? [null, ...j7(r32.unwrap())] : r32 instanceof le5 || r32 instanceof K6 ? j7(r32.unwrap()) : r32 instanceof Q6 ? j7(r32._def.innerType) : [], "j");
var _e4 = class r25 extends y6 {
  static {
    __name(this, "r");
  }
  _parse(e) {
    let { ctx: t } = this._processInputParams(e);
    if (t.parsedType !== f3.object) return u5(t, { code: d6.invalid_type, expected: f3.object, received: t.parsedType }), v5;
    let s3 = this.discriminator, n2 = t.data[s3], a3 = this.optionsMap.get(n2);
    return a3 ? t.common.async ? a3._parseAsync({ data: t.data, path: t.path, parent: t }) : a3._parseSync({ data: t.data, path: t.path, parent: t }) : (u5(t, { code: d6.invalid_union_discriminator, options: Array.from(this.optionsMap.keys()), path: [s3] }), v5);
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
  static create(e, t, s3) {
    let n2 = /* @__PURE__ */ new Map();
    for (let a3 of t) {
      let i2 = j7(a3.shape[e]);
      if (!i2.length) throw new Error(`A discriminator value for key \`${e}\` could not be extracted from all schema options`);
      for (let o6 of i2) {
        if (n2.has(o6)) throw new Error(`Discriminator property ${String(e)} has duplicate value ${String(o6)}`);
        n2.set(o6, a3);
      }
    }
    return new r25({ typeName: m5.ZodDiscriminatedUnion, discriminator: e, options: t, optionsMap: n2, ..._9(s3) });
  }
};
function Ce4(r32, e) {
  let t = R6(r32), s3 = R6(e);
  if (r32 === e) return { valid: true, data: r32 };
  if (t === f3.object && s3 === f3.object) {
    let n2 = g7.objectKeys(e), a3 = g7.objectKeys(r32).filter((o6) => n2.indexOf(o6) !== -1), i2 = { ...r32, ...e };
    for (let o6 of a3) {
      let l5 = Ce4(r32[o6], e[o6]);
      if (!l5.valid) return { valid: false };
      i2[o6] = l5.data;
    }
    return { valid: true, data: i2 };
  } else if (t === f3.array && s3 === f3.array) {
    if (r32.length !== e.length) return { valid: false };
    let n2 = [];
    for (let a3 = 0; a3 < r32.length; a3++) {
      let i2 = r32[a3], o6 = e[a3], l5 = Ce4(i2, o6);
      if (!l5.valid) return { valid: false };
      n2.push(l5.data);
    }
    return { valid: true, data: n2 };
  } else return t === f3.date && s3 === f3.date && +r32 == +e ? { valid: true, data: r32 } : { valid: false };
}
__name(Ce4, "Ce");
var q7 = class extends y6 {
  static {
    __name(this, "q");
  }
  _parse(e) {
    let { status: t, ctx: s3 } = this._processInputParams(e), n2 = /* @__PURE__ */ __name((a3, i2) => {
      if (we2(a3) || we2(i2)) return v5;
      let o6 = Ce4(a3.value, i2.value);
      return o6.valid ? ((Te3(a3) || Te3(i2)) && t.dirty(), { status: t.value, value: o6.data }) : (u5(s3, { code: d6.invalid_intersection_types }), v5);
    }, "n");
    return s3.common.async ? Promise.all([this._def.left._parseAsync({ data: s3.data, path: s3.path, parent: s3 }), this._def.right._parseAsync({ data: s3.data, path: s3.path, parent: s3 })]).then(([a3, i2]) => n2(a3, i2)) : n2(this._def.left._parseSync({ data: s3.data, path: s3.path, parent: s3 }), this._def.right._parseSync({ data: s3.data, path: s3.path, parent: s3 }));
  }
};
q7.create = (r32, e, t) => new q7({ left: r32, right: e, typeName: m5.ZodIntersection, ..._9(t) });
var E7 = class r26 extends y6 {
  static {
    __name(this, "r");
  }
  _parse(e) {
    let { status: t, ctx: s3 } = this._processInputParams(e);
    if (s3.parsedType !== f3.array) return u5(s3, { code: d6.invalid_type, expected: f3.array, received: s3.parsedType }), v5;
    if (s3.data.length < this._def.items.length) return u5(s3, { code: d6.too_small, minimum: this._def.items.length, inclusive: true, exact: false, type: "array" }), v5;
    !this._def.rest && s3.data.length > this._def.items.length && (u5(s3, { code: d6.too_big, maximum: this._def.items.length, inclusive: true, exact: false, type: "array" }), t.dirty());
    let a3 = [...s3.data].map((i2, o6) => {
      let l5 = this._def.items[o6] || this._def.rest;
      return l5 ? l5._parse(new S8(s3, i2, s3.path, o6)) : null;
    }).filter((i2) => !!i2);
    return s3.common.async ? Promise.all(a3).then((i2) => x8.mergeArray(t, i2)) : x8.mergeArray(t, a3);
  }
  get items() {
    return this._def.items;
  }
  rest(e) {
    return new r26({ ...this._def, rest: e });
  }
};
E7.create = (r32, e) => {
  if (!Array.isArray(r32)) throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
  return new E7({ items: r32, typeName: m5.ZodTuple, rest: null, ..._9(e) });
};
var ye5 = class r27 extends y6 {
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
    let { status: t, ctx: s3 } = this._processInputParams(e);
    if (s3.parsedType !== f3.object) return u5(s3, { code: d6.invalid_type, expected: f3.object, received: s3.parsedType }), v5;
    let n2 = [], a3 = this._def.keyType, i2 = this._def.valueType;
    for (let o6 in s3.data) n2.push({ key: a3._parse(new S8(s3, o6, s3.path, o6)), value: i2._parse(new S8(s3, s3.data[o6], s3.path, o6)), alwaysSet: o6 in s3.data });
    return s3.common.async ? x8.mergeObjectAsync(t, n2) : x8.mergeObjectSync(t, n2);
  }
  get element() {
    return this._def.valueType;
  }
  static create(e, t, s3) {
    return t instanceof y6 ? new r27({ keyType: e, valueType: t, typeName: m5.ZodRecord, ..._9(s3) }) : new r27({ keyType: $5.create(), valueType: e, typeName: m5.ZodRecord, ..._9(t) });
  }
};
var ae5 = class extends y6 {
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
    let { status: t, ctx: s3 } = this._processInputParams(e);
    if (s3.parsedType !== f3.map) return u5(s3, { code: d6.invalid_type, expected: f3.map, received: s3.parsedType }), v5;
    let n2 = this._def.keyType, a3 = this._def.valueType, i2 = [...s3.data.entries()].map(([o6, l5], c4) => ({ key: n2._parse(new S8(s3, o6, s3.path, [c4, "key"])), value: a3._parse(new S8(s3, l5, s3.path, [c4, "value"])) }));
    if (s3.common.async) {
      let o6 = /* @__PURE__ */ new Map();
      return Promise.resolve().then(async () => {
        for (let l5 of i2) {
          let c4 = await l5.key, p3 = await l5.value;
          if (c4.status === "aborted" || p3.status === "aborted") return v5;
          (c4.status === "dirty" || p3.status === "dirty") && t.dirty(), o6.set(c4.value, p3.value);
        }
        return { status: t.value, value: o6 };
      });
    } else {
      let o6 = /* @__PURE__ */ new Map();
      for (let l5 of i2) {
        let c4 = l5.key, p3 = l5.value;
        if (c4.status === "aborted" || p3.status === "aborted") return v5;
        (c4.status === "dirty" || p3.status === "dirty") && t.dirty(), o6.set(c4.value, p3.value);
      }
      return { status: t.value, value: o6 };
    }
  }
};
ae5.create = (r32, e, t) => new ae5({ valueType: e, keyType: r32, typeName: m5.ZodMap, ..._9(t) });
var ie4 = class r28 extends y6 {
  static {
    __name(this, "r");
  }
  _parse(e) {
    let { status: t, ctx: s3 } = this._processInputParams(e);
    if (s3.parsedType !== f3.set) return u5(s3, { code: d6.invalid_type, expected: f3.set, received: s3.parsedType }), v5;
    let n2 = this._def;
    n2.minSize !== null && s3.data.size < n2.minSize.value && (u5(s3, { code: d6.too_small, minimum: n2.minSize.value, type: "set", inclusive: true, exact: false, message: n2.minSize.message }), t.dirty()), n2.maxSize !== null && s3.data.size > n2.maxSize.value && (u5(s3, { code: d6.too_big, maximum: n2.maxSize.value, type: "set", inclusive: true, exact: false, message: n2.maxSize.message }), t.dirty());
    let a3 = this._def.valueType;
    function i2(l5) {
      let c4 = /* @__PURE__ */ new Set();
      for (let p3 of l5) {
        if (p3.status === "aborted") return v5;
        p3.status === "dirty" && t.dirty(), c4.add(p3.value);
      }
      return { status: t.value, value: c4 };
    }
    __name(i2, "i");
    let o6 = [...s3.data.values()].map((l5, c4) => a3._parse(new S8(s3, l5, s3.path, c4)));
    return s3.common.async ? Promise.all(o6).then((l5) => i2(l5)) : i2(o6);
  }
  min(e, t) {
    return new r28({ ...this._def, minSize: { value: e, message: h7.toString(t) } });
  }
  max(e, t) {
    return new r28({ ...this._def, maxSize: { value: e, message: h7.toString(t) } });
  }
  size(e, t) {
    return this.min(e, t).max(e, t);
  }
  nonempty(e) {
    return this.min(1, e);
  }
};
ie4.create = (r32, e) => new ie4({ valueType: r32, minSize: null, maxSize: null, typeName: m5.ZodSet, ..._9(e) });
var ge4 = class r29 extends y6 {
  static {
    __name(this, "r");
  }
  constructor() {
    super(...arguments), this.validate = this.implement;
  }
  _parse(e) {
    let { ctx: t } = this._processInputParams(e);
    if (t.parsedType !== f3.function) return u5(t, { code: d6.invalid_type, expected: f3.function, received: t.parsedType }), v5;
    function s3(o6, l5) {
      return me5({ data: o6, path: t.path, errorMaps: [t.common.contextualErrorMap, t.schemaErrorMap, pe5(), re4].filter((c4) => !!c4), issueData: { code: d6.invalid_arguments, argumentsError: l5 } });
    }
    __name(s3, "s");
    function n2(o6, l5) {
      return me5({ data: o6, path: t.path, errorMaps: [t.common.contextualErrorMap, t.schemaErrorMap, pe5(), re4].filter((c4) => !!c4), issueData: { code: d6.invalid_return_type, returnTypeError: l5 } });
    }
    __name(n2, "n");
    let a3 = { errorMap: t.common.contextualErrorMap }, i2 = t.data;
    if (this._def.returns instanceof V6) {
      let o6 = this;
      return b5(async function(...l5) {
        let c4 = new T7([]), p3 = await o6._def.args.parseAsync(l5, a3).catch((xe3) => {
          throw c4.addIssue(s3(l5, xe3)), c4;
        }), k7 = await Reflect.apply(i2, this, p3);
        return await o6._def.returns._def.type.parseAsync(k7, a3).catch((xe3) => {
          throw c4.addIssue(n2(k7, xe3)), c4;
        });
      });
    } else {
      let o6 = this;
      return b5(function(...l5) {
        let c4 = o6._def.args.safeParse(l5, a3);
        if (!c4.success) throw new T7([s3(l5, c4.error)]);
        let p3 = Reflect.apply(i2, this, c4.data), k7 = o6._def.returns.safeParse(p3, a3);
        if (!k7.success) throw new T7([n2(p3, k7.error)]);
        return k7.data;
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
    return new r29({ ...this._def, args: E7.create(e).rest(N5.create()) });
  }
  returns(e) {
    return new r29({ ...this._def, returns: e });
  }
  implement(e) {
    return this.parse(e);
  }
  strictImplement(e) {
    return this.parse(e);
  }
  static create(e, t, s3) {
    return new r29({ args: e || E7.create([]).rest(N5.create()), returns: t || N5.create(), typeName: m5.ZodFunction, ..._9(s3) });
  }
};
var J6 = class extends y6 {
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
J6.create = (r32, e) => new J6({ getter: r32, typeName: m5.ZodLazy, ..._9(e) });
var Y4 = class extends y6 {
  static {
    __name(this, "Y");
  }
  _parse(e) {
    if (e.data !== this._def.value) {
      let t = this._getOrReturnCtx(e);
      return u5(t, { received: t.data, code: d6.invalid_literal, expected: this._def.value }), v5;
    }
    return { status: "valid", value: e.data };
  }
  get value() {
    return this._def.value;
  }
};
Y4.create = (r32, e) => new Y4({ value: r32, typeName: m5.ZodLiteral, ..._9(e) });
function Ie3(r32, e) {
  return new H5({ values: r32, typeName: m5.ZodEnum, ..._9(e) });
}
__name(Ie3, "Ie");
var H5 = class r30 extends y6 {
  static {
    __name(this, "r");
  }
  constructor() {
    super(...arguments), de5.set(this, void 0);
  }
  _parse(e) {
    if (typeof e.data != "string") {
      let t = this._getOrReturnCtx(e), s3 = this._def.values;
      return u5(t, { expected: g7.joinValues(s3), received: t.parsedType, code: d6.invalid_type }), v5;
    }
    if (ve4(this, de5, "f") || Ze3(this, de5, new Set(this._def.values), "f"), !ve4(this, de5, "f").has(e.data)) {
      let t = this._getOrReturnCtx(e), s3 = this._def.values;
      return u5(t, { received: t.data, code: d6.invalid_enum_value, options: s3 }), v5;
    }
    return b5(e.data);
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
    return r30.create(e, { ...this._def, ...t });
  }
  exclude(e, t = this._def) {
    return r30.create(this.options.filter((s3) => !e.includes(s3)), { ...this._def, ...t });
  }
};
de5 = /* @__PURE__ */ new WeakMap();
H5.create = Ie3;
var G6 = class extends y6 {
  static {
    __name(this, "G");
  }
  constructor() {
    super(...arguments), ce4.set(this, void 0);
  }
  _parse(e) {
    let t = g7.getValidEnumValues(this._def.values), s3 = this._getOrReturnCtx(e);
    if (s3.parsedType !== f3.string && s3.parsedType !== f3.number) {
      let n2 = g7.objectValues(t);
      return u5(s3, { expected: g7.joinValues(n2), received: s3.parsedType, code: d6.invalid_type }), v5;
    }
    if (ve4(this, ce4, "f") || Ze3(this, ce4, new Set(g7.getValidEnumValues(this._def.values)), "f"), !ve4(this, ce4, "f").has(e.data)) {
      let n2 = g7.objectValues(t);
      return u5(s3, { received: s3.data, code: d6.invalid_enum_value, options: n2 }), v5;
    }
    return b5(e.data);
  }
  get enum() {
    return this._def.values;
  }
};
ce4 = /* @__PURE__ */ new WeakMap();
G6.create = (r32, e) => new G6({ values: r32, typeName: m5.ZodNativeEnum, ..._9(e) });
var V6 = class extends y6 {
  static {
    __name(this, "V");
  }
  unwrap() {
    return this._def.type;
  }
  _parse(e) {
    let { ctx: t } = this._processInputParams(e);
    if (t.parsedType !== f3.promise && t.common.async === false) return u5(t, { code: d6.invalid_type, expected: f3.promise, received: t.parsedType }), v5;
    let s3 = t.parsedType === f3.promise ? t.data : Promise.resolve(t.data);
    return b5(s3.then((n2) => this._def.type.parseAsync(n2, { path: t.path, errorMap: t.common.contextualErrorMap })));
  }
};
V6.create = (r32, e) => new V6({ type: r32, typeName: m5.ZodPromise, ..._9(e) });
var C5 = class extends y6 {
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
    let { status: t, ctx: s3 } = this._processInputParams(e), n2 = this._def.effect || null, a3 = { addIssue: /* @__PURE__ */ __name((i2) => {
      u5(s3, i2), i2.fatal ? t.abort() : t.dirty();
    }, "addIssue"), get path() {
      return s3.path;
    } };
    if (a3.addIssue = a3.addIssue.bind(a3), n2.type === "preprocess") {
      let i2 = n2.transform(s3.data, a3);
      if (s3.common.async) return Promise.resolve(i2).then(async (o6) => {
        if (t.value === "aborted") return v5;
        let l5 = await this._def.schema._parseAsync({ data: o6, path: s3.path, parent: s3 });
        return l5.status === "aborted" ? v5 : l5.status === "dirty" || t.value === "dirty" ? te5(l5.value) : l5;
      });
      {
        if (t.value === "aborted") return v5;
        let o6 = this._def.schema._parseSync({ data: i2, path: s3.path, parent: s3 });
        return o6.status === "aborted" ? v5 : o6.status === "dirty" || t.value === "dirty" ? te5(o6.value) : o6;
      }
    }
    if (n2.type === "refinement") {
      let i2 = /* @__PURE__ */ __name((o6) => {
        let l5 = n2.refinement(o6, a3);
        if (s3.common.async) return Promise.resolve(l5);
        if (l5 instanceof Promise) throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
        return o6;
      }, "i");
      if (s3.common.async === false) {
        let o6 = this._def.schema._parseSync({ data: s3.data, path: s3.path, parent: s3 });
        return o6.status === "aborted" ? v5 : (o6.status === "dirty" && t.dirty(), i2(o6.value), { status: t.value, value: o6.value });
      } else return this._def.schema._parseAsync({ data: s3.data, path: s3.path, parent: s3 }).then((o6) => o6.status === "aborted" ? v5 : (o6.status === "dirty" && t.dirty(), i2(o6.value).then(() => ({ status: t.value, value: o6.value }))));
    }
    if (n2.type === "transform") if (s3.common.async === false) {
      let i2 = this._def.schema._parseSync({ data: s3.data, path: s3.path, parent: s3 });
      if (!P4(i2)) return i2;
      let o6 = n2.transform(i2.value, a3);
      if (o6 instanceof Promise) throw new Error("Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.");
      return { status: t.value, value: o6 };
    } else return this._def.schema._parseAsync({ data: s3.data, path: s3.path, parent: s3 }).then((i2) => P4(i2) ? Promise.resolve(n2.transform(i2.value, a3)).then((o6) => ({ status: t.value, value: o6 })) : i2);
    g7.assertNever(n2);
  }
};
C5.create = (r32, e, t) => new C5({ schema: r32, typeName: m5.ZodEffects, effect: e, ..._9(t) });
C5.createWithPreprocess = (r32, e, t) => new C5({ schema: e, effect: { type: "preprocess", transform: r32 }, typeName: m5.ZodEffects, ..._9(t) });
var O6 = class extends y6 {
  static {
    __name(this, "O");
  }
  _parse(e) {
    return this._getType(e) === f3.undefined ? b5(void 0) : this._def.innerType._parse(e);
  }
  unwrap() {
    return this._def.innerType;
  }
};
O6.create = (r32, e) => new O6({ innerType: r32, typeName: m5.ZodOptional, ..._9(e) });
var Z4 = class extends y6 {
  static {
    __name(this, "Z");
  }
  _parse(e) {
    return this._getType(e) === f3.null ? b5(null) : this._def.innerType._parse(e);
  }
  unwrap() {
    return this._def.innerType;
  }
};
Z4.create = (r32, e) => new Z4({ innerType: r32, typeName: m5.ZodNullable, ..._9(e) });
var X6 = class extends y6 {
  static {
    __name(this, "X");
  }
  _parse(e) {
    let { ctx: t } = this._processInputParams(e), s3 = t.data;
    return t.parsedType === f3.undefined && (s3 = this._def.defaultValue()), this._def.innerType._parse({ data: s3, path: t.path, parent: t });
  }
  removeDefault() {
    return this._def.innerType;
  }
};
X6.create = (r32, e) => new X6({ innerType: r32, typeName: m5.ZodDefault, defaultValue: typeof e.default == "function" ? e.default : () => e.default, ..._9(e) });
var Q6 = class extends y6 {
  static {
    __name(this, "Q");
  }
  _parse(e) {
    let { ctx: t } = this._processInputParams(e), s3 = { ...t, common: { ...t.common, issues: [] } }, n2 = this._def.innerType._parse({ data: s3.data, path: s3.path, parent: { ...s3 } });
    return ue5(n2) ? n2.then((a3) => ({ status: "valid", value: a3.status === "valid" ? a3.value : this._def.catchValue({ get error() {
      return new T7(s3.common.issues);
    }, input: s3.data }) })) : { status: "valid", value: n2.status === "valid" ? n2.value : this._def.catchValue({ get error() {
      return new T7(s3.common.issues);
    }, input: s3.data }) };
  }
  removeCatch() {
    return this._def.innerType;
  }
};
Q6.create = (r32, e) => new Q6({ innerType: r32, typeName: m5.ZodCatch, catchValue: typeof e.catch == "function" ? e.catch : () => e.catch, ..._9(e) });
var oe5 = class extends y6 {
  static {
    __name(this, "oe");
  }
  _parse(e) {
    if (this._getType(e) !== f3.nan) {
      let s3 = this._getOrReturnCtx(e);
      return u5(s3, { code: d6.invalid_type, expected: f3.nan, received: s3.parsedType }), v5;
    }
    return { status: "valid", value: e.data };
  }
};
oe5.create = (r32) => new oe5({ typeName: m5.ZodNaN, ..._9(r32) });
var ct4 = Symbol("zod_brand");
var le5 = class extends y6 {
  static {
    __name(this, "le");
  }
  _parse(e) {
    let { ctx: t } = this._processInputParams(e), s3 = t.data;
    return this._def.type._parse({ data: s3, path: t.path, parent: t });
  }
  unwrap() {
    return this._def.type;
  }
};
var fe5 = class r31 extends y6 {
  static {
    __name(this, "r");
  }
  _parse(e) {
    let { status: t, ctx: s3 } = this._processInputParams(e);
    if (s3.common.async) return (async () => {
      let a3 = await this._def.in._parseAsync({ data: s3.data, path: s3.path, parent: s3 });
      return a3.status === "aborted" ? v5 : a3.status === "dirty" ? (t.dirty(), te5(a3.value)) : this._def.out._parseAsync({ data: a3.value, path: s3.path, parent: s3 });
    })();
    {
      let n2 = this._def.in._parseSync({ data: s3.data, path: s3.path, parent: s3 });
      return n2.status === "aborted" ? v5 : n2.status === "dirty" ? (t.dirty(), { status: "dirty", value: n2.value }) : this._def.out._parseSync({ data: n2.value, path: s3.path, parent: s3 });
    }
  }
  static create(e, t) {
    return new r31({ in: e, out: t, typeName: m5.ZodPipeline });
  }
};
var K6 = class extends y6 {
  static {
    __name(this, "K");
  }
  _parse(e) {
    let t = this._def.innerType._parse(e), s3 = /* @__PURE__ */ __name((n2) => (P4(n2) && (n2.value = Object.freeze(n2.value)), n2), "s");
    return ue5(t) ? t.then((n2) => s3(n2)) : s3(t);
  }
  unwrap() {
    return this._def.innerType;
  }
};
K6.create = (r32, e) => new K6({ innerType: r32, typeName: m5.ZodReadonly, ..._9(e) });
function Se3(r32, e) {
  let t = typeof r32 == "function" ? r32(e) : typeof r32 == "string" ? { message: r32 } : r32;
  return typeof t == "string" ? { message: t } : t;
}
__name(Se3, "Se");
function $e3(r32, e = {}, t) {
  return r32 ? M5.create().superRefine((s3, n2) => {
    var a3, i2;
    let o6 = r32(s3);
    if (o6 instanceof Promise) return o6.then((l5) => {
      var c4, p3;
      if (!l5) {
        let k7 = Se3(e, s3), he4 = (p3 = (c4 = k7.fatal) !== null && c4 !== void 0 ? c4 : t) !== null && p3 !== void 0 ? p3 : true;
        n2.addIssue({ code: "custom", ...k7, fatal: he4 });
      }
    });
    if (!o6) {
      let l5 = Se3(e, s3), c4 = (i2 = (a3 = l5.fatal) !== null && a3 !== void 0 ? a3 : t) !== null && i2 !== void 0 ? i2 : true;
      n2.addIssue({ code: "custom", ...l5, fatal: c4 });
    }
  }) : M5.create();
}
__name($e3, "$e");
var ut3 = { object: w7.lazycreate };
var m5;
(function(r32) {
  r32.ZodString = "ZodString", r32.ZodNumber = "ZodNumber", r32.ZodNaN = "ZodNaN", r32.ZodBigInt = "ZodBigInt", r32.ZodBoolean = "ZodBoolean", r32.ZodDate = "ZodDate", r32.ZodSymbol = "ZodSymbol", r32.ZodUndefined = "ZodUndefined", r32.ZodNull = "ZodNull", r32.ZodAny = "ZodAny", r32.ZodUnknown = "ZodUnknown", r32.ZodNever = "ZodNever", r32.ZodVoid = "ZodVoid", r32.ZodArray = "ZodArray", r32.ZodObject = "ZodObject", r32.ZodUnion = "ZodUnion", r32.ZodDiscriminatedUnion = "ZodDiscriminatedUnion", r32.ZodIntersection = "ZodIntersection", r32.ZodTuple = "ZodTuple", r32.ZodRecord = "ZodRecord", r32.ZodMap = "ZodMap", r32.ZodSet = "ZodSet", r32.ZodFunction = "ZodFunction", r32.ZodLazy = "ZodLazy", r32.ZodLiteral = "ZodLiteral", r32.ZodEnum = "ZodEnum", r32.ZodEffects = "ZodEffects", r32.ZodNativeEnum = "ZodNativeEnum", r32.ZodOptional = "ZodOptional", r32.ZodNullable = "ZodNullable", r32.ZodDefault = "ZodDefault", r32.ZodCatch = "ZodCatch", r32.ZodPromise = "ZodPromise", r32.ZodBranded = "ZodBranded", r32.ZodPipeline = "ZodPipeline", r32.ZodReadonly = "ZodReadonly";
})(m5 || (m5 = {}));
var lt3 = /* @__PURE__ */ __name((r32, e = { message: `Input not instance of ${r32.name}` }) => $e3((t) => t instanceof r32, e), "lt");
var Me4 = $5.create;
var Ve3 = z6.create;
var ft3 = oe5.create;
var ht4 = D6.create;
var Pe4 = L6.create;
var pt3 = U6.create;
var mt3 = se5.create;
var vt3 = F6.create;
var _t3 = B7.create;
var yt3 = M5.create;
var gt3 = N5.create;
var xt3 = A6.create;
var kt3 = ne5.create;
var bt3 = I9.create;
var wt3 = w7.create;
var Tt2 = w7.strictCreate;
var Ct3 = W8.create;
var Ot2 = _e4.create;
var St2 = q7.create;
var At2 = E7.create;
var Et3 = ye5.create;
var Zt2 = ae5.create;
var jt2 = ie4.create;
var Rt2 = ge4.create;
var Nt2 = J6.create;
var It2 = Y4.create;
var $t2 = H5.create;
var Mt3 = G6.create;
var Vt2 = V6.create;
var Ae3 = C5.create;
var Pt3 = O6.create;
var zt2 = Z4.create;
var Dt2 = C5.createWithPreprocess;
var Lt3 = fe5.create;
var Ut3 = /* @__PURE__ */ __name(() => Me4().optional(), "Ut");
var Ft2 = /* @__PURE__ */ __name(() => Ve3().optional(), "Ft");
var Bt2 = /* @__PURE__ */ __name(() => Pe4().optional(), "Bt");
var Wt2 = { string: /* @__PURE__ */ __name((r32) => $5.create({ ...r32, coerce: true }), "string"), number: /* @__PURE__ */ __name((r32) => z6.create({ ...r32, coerce: true }), "number"), boolean: /* @__PURE__ */ __name((r32) => L6.create({ ...r32, coerce: true }), "boolean"), bigint: /* @__PURE__ */ __name((r32) => D6.create({ ...r32, coerce: true }), "bigint"), date: /* @__PURE__ */ __name((r32) => U6.create({ ...r32, coerce: true }), "date") };
var qt2 = v5;
var Jt = Object.freeze({ __proto__: null, defaultErrorMap: re4, setErrorMap: De3, getErrorMap: pe5, makeIssue: me5, EMPTY_PATH: Le3, addIssueToContext: u5, ParseStatus: x8, INVALID: v5, DIRTY: te5, OK: b5, isAborted: we2, isDirty: Te3, isValid: P4, isAsync: ue5, get util() {
  return g7;
}, get objectUtil() {
  return be3;
}, ZodParsedType: f3, getParsedType: R6, ZodType: y6, datetimeRegex: Ne3, ZodString: $5, ZodNumber: z6, ZodBigInt: D6, ZodBoolean: L6, ZodDate: U6, ZodSymbol: se5, ZodUndefined: F6, ZodNull: B7, ZodAny: M5, ZodUnknown: N5, ZodNever: A6, ZodVoid: ne5, ZodArray: I9, ZodObject: w7, ZodUnion: W8, ZodDiscriminatedUnion: _e4, ZodIntersection: q7, ZodTuple: E7, ZodRecord: ye5, ZodMap: ae5, ZodSet: ie4, ZodFunction: ge4, ZodLazy: J6, ZodLiteral: Y4, ZodEnum: H5, ZodNativeEnum: G6, ZodPromise: V6, ZodEffects: C5, ZodTransformer: C5, ZodOptional: O6, ZodNullable: Z4, ZodDefault: X6, ZodCatch: Q6, ZodNaN: oe5, BRAND: ct4, ZodBranded: le5, ZodPipeline: fe5, ZodReadonly: K6, custom: $e3, Schema: y6, ZodSchema: y6, late: ut3, get ZodFirstPartyTypeKind() {
  return m5;
}, coerce: Wt2, any: yt3, array: bt3, bigint: ht4, boolean: Pe4, date: pt3, discriminatedUnion: Ot2, effect: Ae3, enum: $t2, function: Rt2, instanceof: lt3, intersection: St2, lazy: Nt2, literal: It2, map: Zt2, nan: ft3, nativeEnum: Mt3, never: xt3, null: _t3, nullable: zt2, number: Ve3, object: wt3, oboolean: Bt2, onumber: Ft2, optional: Pt3, ostring: Ut3, pipeline: Lt3, preprocess: Dt2, promise: Vt2, record: Et3, set: jt2, strictObject: Tt2, string: Me4, symbol: mt3, transformer: Ae3, tuple: At2, undefined: vt3, union: Ct3, unknown: gt3, void: kt3, NEVER: qt2, ZodIssueCode: d6, quotelessJson: ze3, ZodError: T7 });

// deno:https://esm.sh/@jsr/orama__core@1.2.4/esnext/orama__core.mjs
function w8(o6) {
  let e = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-$", t = "";
  for (let s3 = 0; s3 < o6; s3++) t += e.charAt(Math.floor(Math.random() * e.length));
  return t;
}
__name(w8, "w");
function z7(o6) {
  if (o6 < 1e3) return `${o6}ms`;
  {
    let e = o6 / 1e3;
    return Number.isInteger(e) ? `${e}s` : `${e.toFixed(1)}s`;
  }
}
__name(z7, "z");
var B8 = typeof localStorage < "u";
function F7() {
  return typeof window < "u" || typeof document < "u" ? false : !!(typeof A3 < "u" && A3.versions?.node || typeof Deno < "u" && typeof Deno.version < "u" || typeof Bun < "u" && typeof Bun.version < "u" || typeof globalThis < "u" && typeof globalThis.Response == "function" && typeof globalThis.fetch == "function" && typeof globalThis.navigator > "u" || typeof A3 < "u" && A3?.env.AWS_LAMBDA_FUNCTION_NAME);
}
__name(F7, "F");
function V7(o6) {
  let e = oe4(o6, "Tool");
  if (e.$ref && e.definitions) {
    let t = e.$ref.replace("#/definitions/", ""), s3 = e.definitions[t];
    if (!s3) throw new Error(`Could not resolve definition: ${t}`);
    return s3;
  }
  return e;
}
__name(V7, "V");
var I10 = "___$orama_user_id$___";
var Q7 = "ssid";
var P5 = class extends TransformStream {
  static {
    __name(this, "P");
  }
  constructor() {
    let e = new TextDecoder("utf-8", { ignoreBOM: false }), t, s3;
    super({ start() {
      t = "", s3 = { data: "" };
    }, transform(i2, r32) {
      let c4 = e.decode(i2);
      t += c4;
      let l5;
      for (; (l5 = /\r\n|\n|\r/.exec(t)) !== null; ) {
        let a3 = t.substring(0, l5.index);
        if (t = t.substring(l5.index + l5[0].length), a3.length === 0) r32.enqueue(s3), s3 = { data: "" };
        else if (!a3.startsWith(":")) {
          let d7 = /:/.exec(a3);
          if (!d7) {
            s3[a3] = "";
            continue;
          }
          let u6 = a3.substring(0, d7.index), p3 = a3.substring(d7.index + 1);
          s3[u6] = p3?.replace(/^\u0020/, "");
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
    let s3, i2;
    switch (this.config.type) {
      case "apiKey": {
        if (s3 = this.config.apiKey, e == "writer" && !this.config.writerURL) throw new Error("Cannot perform a request to a writer without the writerURL. Use `cluster.writerURL` to configure it");
        if (e == "reader" && !this.config.readerURL) throw new Error("Cannot perform a request to a writer without the writerURL. Use `cluster.readerURL` to configure it");
        i2 = e == "writer" ? this.config.writerURL : this.config.readerURL;
        break;
      }
      case "jwt": {
        let r32 = await te6(this.config.authJwtURL, this.config.collectionID, this.config.privateApiKey, "write", t);
        e == "reader" ? (i2 = this.config.readerURL ?? r32.readerURL, s3 = r32.readerApiKey) : (s3 = r32.jwt, i2 = this.config.writerURL ?? r32.writerURL);
        break;
      }
    }
    return { bearer: s3, baseURL: i2 };
  }
};
var g8 = class {
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
      let s3;
      try {
        s3 = await t.text();
      } catch (i2) {
        s3 = `Unable to got response body ${i2}`;
      }
      throw new Error(`Request to "${e.path}?${new URLSearchParams(e.params ?? {}).toString()}" failed with status ${t.status}: ${s3}`);
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
    let { baseURL: t, bearer: s3 } = await this.config.auth.getRef(e.target, e.init), i2 = new URL(e.path, t);
    return e.params = e.params ?? {}, e.params["api-key"] = s3, e.params && (i2.search = new URLSearchParams(e.params).toString()), new EventSource(i2);
  }
  async getResponse({ method: e, path: t, body: s3, params: i2, apiKeyPosition: r32, init: c4, target: l5 }) {
    let { baseURL: a3, bearer: d7 } = await this.config.auth.getRef(l5, c4), u6 = new URL(t, a3), p3 = new Headers();
    p3.append("Content-Type", "application/json"), r32 === "header" && p3.append("Authorization", `Bearer ${d7}`), r32 === "query-params" && (i2 = i2 ?? {}, i2["api-key"] = d7);
    let n2 = { method: e, headers: p3, ...c4 };
    s3 && e === "POST" && (n2.body = JSON.stringify(s3)), i2 && (u6.search = new URLSearchParams(i2).toString());
    let h8 = await fetch(u6, n2);
    if (h8.status === 401) throw new Error("Unauthorized: are you using the correct Api Key?");
    if (h8.status === 400) {
      let f4 = await h8.text();
      throw new Error(`Bad Request: ${f4} (path: ${u6.toString()})`);
    }
    return h8;
  }
};
async function te6(o6, e, t, s3, i2) {
  let c4 = await fetch(o6, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ collectionId: e, privateApiKey: t, scope: s3 }), ...i2 });
  if (!c4.ok) throw new Error(`JWT request to ${c4.url} failed with status ${c4.status}: ${await c4.text()}`);
  return c4.json();
}
__name(te6, "te");
function Y5(o6, e = true) {
  try {
    return JSON.parse(o6);
  } catch (t) {
    return e || console.warn("Recovered from failed JSON parsing with error:", t), o6;
  }
}
__name(Y5, "Y");
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
  constructor(e) {
    this.collectionID = e.collectionID, this.oramaInterface = e.common, this.LLMConfig = e.LLMConfig, this.messages = e.initialMessages || [], this.events = e.events, this.sessionID = e.sessionID || Q2();
  }
  async answer(e, t) {
    let s3 = this.answerStream(e, t), i2 = "";
    for await (let r32 of s3) i2 = r32;
    return i2;
  }
  async *answerStream(e, t) {
    this.lastInteractionParams = { ...e }, e = this._enrichConfig(e), this.abortController = new AbortController();
    let s3 = t ?? {};
    s3.signal = this.abortController.signal, this.messages.push({ role: "user", content: e.query }), this.messages.push({ role: "assistant", content: "" });
    let i2 = e.interactionID || Q2();
    this.state.push({ id: i2, query: e.query, optimizedQuery: null, response: "", sources: null, loading: true, error: false, aborted: false, errorMessage: null, related: e.related?.enabled ? "" : null, currentStep: "starting", currentStepVerbose: null, selectedLLM: null, advancedAutoquery: null }), this._pushState();
    let r32 = this.state.length - 1, c4 = this.messages.length - 1;
    try {
      let l5 = { interaction_id: i2, query: e.query, visitor_id: e.visitorID, conversation_id: e.sessionID, messages: this.messages.slice(0, -1), llm_config: null, related: e.related, min_similarity: e.min_similarity, max_documents: e.max_documents, ragat_notation: e.ragat_notation };
      this.LLMConfig && (l5.llm_config = this.LLMConfig);
      let a3 = await this.oramaInterface.getResponse({ method: "POST", path: `/v1/collections/${this.collectionID}/generate/answer`, body: l5, init: s3, apiKeyPosition: "query-params", target: "reader" });
      if (!a3.body) throw new Error("No response body");
      let d7 = x3(a3.body), u6 = false, p3 = "";
      for (d7.on("answer_token", (n2) => {
        this.state[r32].response += n2.token, this.messages[c4].content = this.state[r32].response, this._pushState();
      }), d7.on("selected_llm", (n2) => {
        this.state[r32].selectedLLM = { provider: n2.provider, model: n2.model }, this._pushState();
      }), d7.on("optimizing_query", (n2) => {
        this.state[r32].optimizedQuery = Y5(n2.optimized_query), this._pushState();
      }), d7.on("search_results", (n2) => {
        this.state[r32].sources = n2.results, this._pushState();
      }), d7.on("related_queries", (n2) => {
        this.state[r32].related = n2.queries, this._pushState();
      }), d7.onStateChange((n2) => {
        this.state[r32].currentStep = n2.state, this._pushState();
      }), d7.on("state_changed", (n2) => {
        this.events?.onIncomingEvent?.(n2);
        let h8 = n2.data;
        if (n2.state === "advanced_autoquery_query_optimized" && h8?.optimized_queries) {
          this.state[r32].advancedAutoquery || (this.state[r32].advancedAutoquery = {}), this.state[r32].advancedAutoquery.optimizedQueries = h8.optimized_queries;
          let f4 = this.state[r32].advancedAutoquery.optimizedQueries?.join(`
Also, `);
          y7(f4) && (this.state[r32].currentStepVerbose = f4, this._pushState());
        }
        if (n2.state === "advanced_autoquery_properties_selected" && h8?.selected_properties) {
          this.state[r32].advancedAutoquery || (this.state[r32].advancedAutoquery = {}), this.state[r32].advancedAutoquery.selectedProperties = h8.selected_properties;
          let _10 = `Filtering by ${this.state[r32].advancedAutoquery.selectedProperties?.map(Object.values).flat().map((D7) => D7.selected_properties).flat().map((D7) => `${D7.property}`).join(", ")}`;
          y7(_10) && (this.state[r32].currentStepVerbose = _10, this._pushState());
        }
        if (n2.state === "advanced_autoquery_combine_queries" && h8?.queries_and_properties && (this.state[r32].advancedAutoquery || (this.state[r32].advancedAutoquery = {}), this.state[r32].advancedAutoquery.queriesAndProperties = h8.queries_and_properties, this._pushState()), n2.state === "advanced_autoquery_tracked_queries_generated" && h8?.tracked_queries && (this.state[r32].advancedAutoquery || (this.state[r32].advancedAutoquery = {}), this.state[r32].advancedAutoquery.trackedQueries = h8.tracked_queries, this._pushState()), n2.state === "advanced_autoquery_search_results" && h8?.search_results) {
          this.state[r32].advancedAutoquery || (this.state[r32].advancedAutoquery = {}), this.state[r32].advancedAutoquery.searchResults = h8.search_results;
          let f4 = h8.search_results.reduce((E8, X7) => E8 + X7.results[0].count, 0), _10 = h8.search_results.map((E8) => JSON.parse(E8.generated_query).term).join(", "), x9 = `Found ${f4} result${f4 === 1 ? "" : "s"} for "${_10}"`;
          y7(x9) && (this.state[r32].currentStepVerbose = x9, this._pushState());
        }
        n2.state === "advanced_autoquery_completed" && h8?.results && (this.state[r32].advancedAutoquery || (this.state[r32].advancedAutoquery = {}), this.state[r32].advancedAutoquery.results = h8.results, this.state[r32].currentStepVerbose = null, this._pushState()), n2.state === "completed" && (u6 = true, this.state[r32].loading = false, this._pushState()), this.events?.onEnd && this.events.onEnd(this.state);
      }); !u6; ) {
        let n2 = this.state[r32].response;
        n2 !== p3 ? (p3 = n2, yield n2) : u6 || await new Promise((h8) => setTimeout(h8, 0));
      }
    } catch (l5) {
      if (l5 instanceof Error && l5.name === "AbortError") {
        this.state[r32].loading = false, this.state[r32].aborted = true, this._pushState();
        return;
      }
      throw this.state[r32].loading = false, this.state[r32].error = true, this.state[r32].errorMessage = l5 instanceof Error ? l5.message : "Unknown error", this._pushState(), l5;
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
  if (B8) {
    let o6 = localStorage.getItem(I10);
    if (o6) return o6;
  }
  return Q2();
}
__name(re5, "re");
var W9 = class {
  static {
    __name(this, "W");
  }
  collection;
  constructor(e) {
    let t = new g8({ auth: new m6({ type: "apiKey", apiKey: e.masterAPIKey, writerURL: e.url, readerURL: void 0 }) });
    this.collection = new T8(t);
  }
};
var T8 = class {
  static {
    __name(this, "T");
  }
  client;
  constructor(e) {
    this.client = e;
  }
  async create(e, t) {
    let s3 = { id: e.id, description: e.description, write_api_key: e.writeAPIKey ?? w8(32), read_api_key: e.readAPIKey ?? w8(32) };
    return e.embeddingsModel && (s3.embeddings_model = e.embeddingsModel), await this.client.request({ path: "/v1/collections/create", body: s3, method: "POST", init: t, apiKeyPosition: "header", target: "writer" }), { id: s3.id, description: s3.description, writeAPIKey: s3.write_api_key, readonlyAPIKey: s3.read_api_key };
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
function Z5(o6, e) {
  if (typeof navigator < "u") {
    typeof navigator.sendBeacon < "u" && navigator.sendBeacon(o6, e);
    return;
  }
  fetch(o6, { method: "POST", body: e, headers: { "Content-Type": "application/json" } }).then(() => {
  }, (t) => console.log(t));
}
__name(Z5, "Z");
var b6 = class {
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
      let s3 = localStorage.getItem(I10);
      s3 ? this.userId = s3 : (this.userId = Q2(), localStorage.setItem(I10, this.userId));
    } else this.userId = Q2();
    this.endpoint = e, this.apiKey = t;
  }
  setParams(e) {
    let { protocol: t, host: s3 } = new URL(e.identifyUrl), i2 = `${t}//${s3}/identify`;
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
  constructor(e) {
    let t;
    e.apiKey.startsWith("p_") ? t = new m6({ type: "jwt", authJwtURL: e.authJwtURL ?? ne6, collectionID: e.collectionID, privateApiKey: e.apiKey, readerURL: e.cluster?.readURL ?? A7, writerURL: e.cluster?.writerURL }) : (t = new m6({ type: "apiKey", readerURL: e.cluster?.readURL ?? A7, writerURL: e.cluster?.writerURL, apiKey: e.apiKey }), this.profile = new b6({ endpoint: e.cluster?.readURL ?? A7, apiKey: e.apiKey }));
    let s3 = { auth: t };
    this.collectionID = e.collectionID, this.client = new g8(s3), this.apiKey = e.apiKey, this.ai = new L7(this.client, this.collectionID, this.profile), this.collections = new $6(this.client, this.collectionID), this.index = new K7(this.client, this.collectionID), this.hooks = new U7(this.client, this.collectionID), this.logs = new O7(this.client, this.collectionID), this.systemPrompts = new k6(this.client, this.collectionID), this.tools = new C6(this.client, this.collectionID), this.identity = new M6(this.profile), this.trainingSets = new J7(this.client, this.collectionID);
  }
  async search(e, t) {
    let s3 = Date.now(), { datasourceIDs: i2, indexes: r32, ...c4 } = e, l5 = await this.client.request({ path: `/v1/collections/${this.collectionID}/search`, body: { userID: this.profile?.getUserId() || void 0, ...c4, indexes: i2 || r32 }, method: "POST", params: void 0, init: t, apiKeyPosition: "query-params", target: "reader" }), a3 = Date.now() - s3;
    return { ...l5, elapsed: { raw: a3, formatted: z7(a3) } };
  }
};
var L7 = class {
  static {
    __name(this, "L");
  }
  client;
  collectionID;
  profile;
  constructor(e, t, s3) {
    this.client = e, this.collectionID = t, this.profile = s3;
  }
  NLPSearch(e, t) {
    return this.client.request({ method: "POST", path: `/v1/collections/${this.collectionID}/nlp_search`, body: { userID: this.profile?.getUserId() || void 0, ...e }, init: t, apiKeyPosition: "query-params", target: "reader" });
  }
  async *NLPSearchStream(e, t) {
    let s3 = { llm_config: e.LLMConfig ? { ...e.LLMConfig } : void 0, userID: this.profile?.getUserId() || void 0, messages: [{ role: "user", content: e.query }] }, i2 = await this.client.getResponse({ method: "POST", path: `/v1/collections/${this.collectionID}/generate/nlp_query`, body: s3, init: t, apiKeyPosition: "query-params", target: "reader" });
    if (!i2.body) throw new Error("No response body");
    let r32 = false, c4 = null, l5 = S2(i2.body);
    for (l5.on("error", (a3) => {
      throw a3.is_terminal && (r32 = true), new Error(a3.error);
    }), l5.on("state_changed", (a3) => {
      c4 = { status: a3.state, data: a3.data || [] };
    }), l5.on("search_results", (a3) => {
      c4 = { status: "SEARCH_RESULTS", data: a3.results }, r32 = true;
    }); !r32; ) c4 !== null && y7(c4.status) && (yield c4), await new Promise((a3) => setTimeout(a3, 10));
    c4 !== null && y7(c4.status) && (yield c4);
  }
  createAISession(e) {
    return new S9({ collectionID: this.collectionID, common: this.client, ...e });
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
var K7 = class {
  static {
    __name(this, "K");
  }
  client;
  collectionID;
  constructor(e, t) {
    this.client = e, this.collectionID = t;
  }
  async create(e, t) {
    let s3 = { id: e.id, embedding: e.embeddings };
    await this.client.request({ path: `/v1/collections/${this.collectionID}/indexes/create`, body: s3, method: "POST", init: t, apiKeyPosition: "header", target: "writer" });
  }
  async delete(e, t) {
    await this.client.request({ path: `/v1/collections/${this.collectionID}/indexes/delete`, body: { index_id_to_delete: e }, method: "POST", init: t, apiKeyPosition: "header", target: "writer" });
  }
  set(e) {
    return new j8(this.client, this.collectionID, e);
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
    let s3 = { name: e.name, code: e.code };
    return await this.client.request({ path: `/v1/collections/${this.collectionID}/hooks/set`, body: s3, method: "POST", init: t, apiKeyPosition: "header", target: "writer" }), { hookID: s3.name, code: s3.code };
  }
  async list(e) {
    return (await this.client.request({ path: `/v1/collections/${this.collectionID}/hooks/list`, method: "GET", init: e, apiKeyPosition: "header", target: "writer" })).hooks || {};
  }
  async delete(e, t) {
    let s3 = { name_to_delete: e };
    await this.client.request({ path: `/v1/collections/${this.collectionID}/hooks/delete`, body: s3, method: "POST", init: t, apiKeyPosition: "header", target: "writer" });
  }
};
var O7 = class {
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
var k6 = class {
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
    let s3;
    switch (true) {
      case typeof e.parameters == "string": {
        s3 = e.parameters;
        break;
      }
      case e.parameters instanceof y6: {
        let i2 = V7(e.parameters);
        s3 = JSON.stringify(i2);
        break;
      }
      case typeof e.parameters == "object": {
        s3 = JSON.stringify(e.parameters);
        break;
      }
      default:
        throw new Error("Invalid parameters type. Must be string, object or ZodType");
    }
    return this.client.request({ path: `/v1/collections/${this.collectionID}/tools/insert`, body: { ...e, parameters: s3 }, method: "POST", init: t, apiKeyPosition: "header", target: "writer" });
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
    let s3 = await this.client.request({ path: `/v1/collections/${this.collectionID}/tools/run`, body: e, method: "POST", init: t, apiKeyPosition: "query-params", target: "reader" });
    return s3.results ? { results: s3.results.map((i2) => "functionResult" in i2 ? { functionResult: { tool_id: i2.functionResult.tool_id, result: JSON.parse(i2.functionResult.result) } } : "functionParameters" in i2 ? { functionParameters: { tool_id: i2.functionParameters.tool_id, result: JSON.parse(i2.functionParameters.result) } } : i2) } : { results: null };
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
var J7 = class {
  static {
    __name(this, "J");
  }
  client;
  collectionID;
  constructor(e, t) {
    this.client = e, this.collectionID = t;
  }
  async get(e, t) {
    let s3 = await this.client.request({ path: `/v1/collections/${this.collectionID}/training_sets/${e}/get`, method: "GET", init: t, apiKeyPosition: "query-params", target: "reader" });
    return { training_sets: s3.training_sets && JSON.parse(s3.training_sets) };
  }
  generate(e, t, s3) {
    return this.client.request({ path: `/v1/collections/${this.collectionID}/training_sets/${e}/generate`, method: "POST", body: { llm_config: t ? { ...t } : void 0 }, init: s3, apiKeyPosition: "query-params", target: "reader" });
  }
  insert(e, t, s3) {
    return this.client.request({ path: `/v1/collections/${this.collectionID}/training_sets/${e}/insert`, method: "POST", body: { training_set: t }, init: s3, apiKeyPosition: "header", target: "writer" });
  }
  delete(e, t) {
    return this.client.request({ path: `/v1/collections/${this.collectionID}/training_sets/${e}/delete`, method: "POST", init: t, apiKeyPosition: "header", target: "writer" });
  }
};
var j8 = class {
  static {
    __name(this, "j");
  }
  indexID;
  collectionID;
  oramaInterface;
  transaction;
  constructor(e, t, s3) {
    this.indexID = s3, this.collectionID = t, this.oramaInterface = e, this.transaction = new G7(e, t, s3);
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
var G7 = class {
  static {
    __name(this, "G");
  }
  indexID;
  collectionID;
  tempIndexID;
  oramaInterface;
  constructor(e, t, s3, i2 = w8(16)) {
    this.oramaInterface = e, this.collectionID = t, this.indexID = s3, this.tempIndexID = i2;
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
  constructor(e) {
    this.client = new q8({ ...e, collectionID: e.projectId }), this.identity = this.client.identity, this.ai = this.client.ai, this.collections = this.client.collections, this.index = this.client.index, this.hooks = this.client.hooks, this.logs = this.client.logs, this.systemPrompts = this.client.systemPrompts, this.tools = this.client.tools;
  }
  search(e) {
    let { datasources: t, ...s3 } = e;
    return this.client.search({ ...s3, indexes: t });
  }
  dataSource(e) {
    let t = this.client.index.set(e);
    return new N6(t);
  }
};
var N6 = class {
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
var y7 = /* @__PURE__ */ (() => {
  let o6 = /* @__PURE__ */ new Set();
  return function(e) {
    return !e || o6.has(e) ? "" : (o6.add(e), e);
  };
})();
export {
  S9 as AnswerSession,
  q8 as CollectionManager,
  j8 as Index,
  H6 as OramaCloud,
  W9 as OramaCoreManager,
  G7 as Transaction,
  w2 as answerSessionSteps,
  w8 as createRandomString,
  y7 as dedupe
};
/*! Bundled license information:

@noble/hashes/esm/utils.js:
  (*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) *)
*/
