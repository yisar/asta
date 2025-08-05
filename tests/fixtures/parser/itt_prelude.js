'use strict'

function id(x) {return x}
function is(xs) {return typeof xs[Symbol.iterator] === 'function' || typeof xs.next === 'function'}
function generator(gen) {return (...args) => new Iter(gen(...args))}
const G = generator
function toRaw(iter) {return iter[Symbol.iterator] ? iter[Symbol.iterator]() : iter}
function from(iter) {return new Iter(toRaw(iter))}
const empty = G(function*() {})

const range = G(function*(start, end, skip = 1) {
  if (end === undefined) {end = start; start = 0}
  if (skip > 0) for (let i = start; i < end; i += skip) yield i
  else for (let i = start; i > end; i += skip) yield i
})
const irange = G(function*(start = 0, skip = 1) {
  for (let i = start; ; i += skip) yield i
})
const replicate = G(function*(n, x) {for (let i = 0; i < n; ++i) yield x})
const forever = G(function*(x) {for (;;) yield x})
const iterate = G(function*(x, fn) {for (;;) {yield x; x = fn(x)}})

const toString = Object.prototype.toString
const split = G(function*(s, sep, limit) {
  const re = toString.call(sep) === '[object RegExp]'
  if (sep != null && !re) {
    const splitter = sep[Symbol.split]
    if (splitter != null) {
      yield* splitter.call(sep, s, limit)
      return
    }
  }
  if (limit === undefined) limit = Infinity
  if (limit <= 0) return
  s = String(s)
  if (sep === undefined) {yield s; return}
  if (!re) sep = String(sep)
  if (!sep) { // || re && sep.test('')
    const stop = Math.min(limit, s.length)
    for (let i = 0; i < stop; ++i) yield s.charAt(i)
    return
  }
  if (!s) {
    if (!re || !sep.test('')) yield ''
    return
  }
  let n = 0
  const len = s.length
  if (re) {
    let empty = null
    let first = true
    // const r = new RegExp(sep.source, sep.flags.replace(/[yg]/, '') + 'g')
    for (;;) {
      const i = r.lastIndex
      const m = r.exec(s)
      if (m && empty != null) {
        yield s.slice(empty, m.index)
        if (++n >= limit) return
      }
      if (m && r.lastIndex === i) {
        ++r.lastIndex
        if (i === len) {
          if (empty == null) yield ''
          return
        }
        empty = first ? i : m.index
        if (first) {
          first = false
          continue
        }
      } else {
        const j = m ? m.index : len
        if (empty == null) {
          yield s.slice(i, j)
          if (++n >= limit) return
        }
        first = true
        empty = null
      }
      if (!m) return
      for (let i = 1, mlen = m.length; i < mlen; ++i) {
        yield m[i]
        if (++n >= limit) return
      }
    }
  } else {
    let i = 0
    const slen = sep.length
    for (;;) {
      if (n >= limit) return
      const j = s.indexOf(sep, i)
      yield s.slice(i, j === -1 ? len : j)
      if (j === -1) return
      i = j + slen;
      ++n
    }
  }
})
function exec(re, s) {return new Iter(re[Symbol.matchAll](s))}
