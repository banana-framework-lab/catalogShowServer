var createFFmpegCore = (function () {
  var _scriptDir =
    typeof document !== 'undefined' && document.currentScript
      ? document.currentScript.src
      : undefined
  if (typeof __filename !== 'undefined') _scriptDir = _scriptDir || __filename
  return function (createFFmpegCore) {
    createFFmpegCore = createFFmpegCore || {}

    var e
    e || (e = typeof createFFmpegCore !== 'undefined' ? createFFmpegCore : {})
    var ba, ca
    e.ready = new Promise(function (a, b) {
      ba = a
      ca = b
    })
    e.quit = function (a) {
      if (e.onExit) e.onExit(a)
      throw new da(a)
    }
    e.exit = ea
    fa = k = function () {}
    var ia = {},
      ja
    for (ja in e) e.hasOwnProperty(ja) && (ia[ja] = e[ja])
    var ka = [],
      la = './this.program'

    function ma(a, b) {
      throw b
    }
    var na = !1,
      pa = !1,
      qa = !1,
      ra = !1
    na = 'object' === typeof window
    pa = 'function' === typeof importScripts
    qa =
      'object' === typeof process &&
      'object' === typeof process.versions &&
      'string' === typeof process.versions.node
    ra = !na && !qa && !pa
    var l = '',
      sa,
      ta,
      ua,
      va
    if (qa)
      (l = pa ? require('path').dirname(l) + '/' : __dirname + '/'),
        (sa = function (a, b) {
          ua || (ua = require('fs'))
          va || (va = require('path'))
          a = va.normalize(a)
          return ua.readFileSync(a, b ? null : 'utf8')
        }),
        (ta = function (a) {
          a = sa(a, !0)
          a.buffer || (a = new Uint8Array(a))
          assert(a.buffer)
          return a
        }),
        1 < process.argv.length && (la = process.argv[1].replace(/\\/g, '/')),
        (ka = process.argv.slice(2)),
        process.on('uncaughtException', function (a) {
          if (!(a instanceof da)) throw a
        }),
        process.on('unhandledRejection', n),
        (ma = function (a) {
          process.exit(a)
        }),
        (e.inspect = function () {
          return '[Emscripten Module object]'
        })
    else if (ra)
      'undefined' != typeof read &&
        (sa = function (a) {
          return read(a)
        }),
        (ta = function (a) {
          if ('function' === typeof readbuffer)
            return new Uint8Array(readbuffer(a))
          a = read(a, 'binary')
          assert('object' === typeof a)
          return a
        }),
        'undefined' != typeof scriptArgs
          ? (ka = scriptArgs)
          : 'undefined' != typeof arguments && (ka = arguments),
        'function' === typeof quit &&
          (ma = function (a) {
            quit(a)
          }),
        'undefined' !== typeof print &&
          ('undefined' === typeof console && (console = {}),
          (console.log = print),
          (console.warn = console.error =
            'undefined' !== typeof printErr ? printErr : print))
    else if (na || pa)
      pa
        ? (l = self.location.href)
        : 'undefined' !== typeof document &&
          document.currentScript &&
          (l = document.currentScript.src),
        _scriptDir && (l = _scriptDir),
        0 !== l.indexOf('blob:')
          ? (l = l.substr(0, l.lastIndexOf('/') + 1))
          : (l = ''),
        (sa = function (a) {
          var b = new XMLHttpRequest()
          b.open('GET', a, !1)
          b.send(null)
          return b.responseText
        }),
        pa &&
          (ta = function (a) {
            var b = new XMLHttpRequest()
            b.open('GET', a, !1)
            b.responseType = 'arraybuffer'
            b.send(null)
            return new Uint8Array(b.response)
          })
    var fa = e.print || console.log.bind(console),
      k = e.printErr || console.warn.bind(console)
    for (ja in ia) ia.hasOwnProperty(ja) && (e[ja] = ia[ja])
    ia = null
    e.arguments && (ka = e.arguments)
    e.thisProgram && (la = e.thisProgram)
    e.quit && (ma = e.quit)
    var wa = 0,
      xa
    e.wasmBinary && (xa = e.wasmBinary)
    var noExitRuntime
    e.noExitRuntime && (noExitRuntime = e.noExitRuntime)
    'object' !== typeof WebAssembly && n('no native wasm support detected')
    var ya,
      za = !1

    function assert(a, b) {
      a || n('Assertion failed: ' + b)
    }

    function Aa(a) {
      var b = e['_' + a]
      assert(
        b,
        'Cannot call unknown function ' + a + ', make sure it is exported'
      )
      return b
    }

    function Ba(a, b, c, d) {
      var f = {
          string: function (q) {
            var t = 0
            if (null !== q && void 0 !== q && 0 !== q) {
              var v = (q.length << 2) + 1
              t = Ca(v)
              Da(q, t, v)
            }
            return t
          },
          array: function (q) {
            var t = Ca(q.length)
            x.set(q, t)
            return t
          },
        },
        g = Aa(a),
        h = []
      a = 0
      if (d)
        for (var m = 0; m < d.length; m++) {
          var r = f[c[m]]
          r ? (0 === a && (a = y()), (h[m] = r(d[m]))) : (h[m] = d[m])
        }
      c = g.apply(null, h)
      c = (function (q) {
        return 'string' === b ? z(q) : 'boolean' === b ? !!q : q
      })(c)
      0 !== a && A(a)
      return c
    }
    var Ea =
      'undefined' !== typeof TextDecoder ? new TextDecoder('utf8') : void 0

    function Fa(a, b, c) {
      var d = b + c
      for (c = b; a[c] && !(c >= d); ) ++c
      if (16 < c - b && a.subarray && Ea) return Ea.decode(a.subarray(b, c))
      for (d = ''; b < c; ) {
        var f = a[b++]
        if (f & 128) {
          var g = a[b++] & 63
          if (192 == (f & 224)) d += String.fromCharCode(((f & 31) << 6) | g)
          else {
            var h = a[b++] & 63
            f =
              224 == (f & 240)
                ? ((f & 15) << 12) | (g << 6) | h
                : ((f & 7) << 18) | (g << 12) | (h << 6) | (a[b++] & 63)
            65536 > f
              ? (d += String.fromCharCode(f))
              : ((f -= 65536),
                (d += String.fromCharCode(
                  55296 | (f >> 10),
                  56320 | (f & 1023)
                )))
          }
        } else d += String.fromCharCode(f)
      }
      return d
    }

    function z(a, b) {
      return a ? Fa(B, a, b) : ''
    }

    function Ga(a, b, c, d) {
      if (!(0 < d)) return 0
      var f = c
      d = c + d - 1
      for (var g = 0; g < a.length; ++g) {
        var h = a.charCodeAt(g)
        if (55296 <= h && 57343 >= h) {
          var m = a.charCodeAt(++g)
          h = (65536 + ((h & 1023) << 10)) | (m & 1023)
        }
        if (127 >= h) {
          if (c >= d) break
          b[c++] = h
        } else {
          if (2047 >= h) {
            if (c + 1 >= d) break
            b[c++] = 192 | (h >> 6)
          } else {
            if (65535 >= h) {
              if (c + 2 >= d) break
              b[c++] = 224 | (h >> 12)
            } else {
              if (c + 3 >= d) break
              b[c++] = 240 | (h >> 18)
              b[c++] = 128 | ((h >> 12) & 63)
            }
            b[c++] = 128 | ((h >> 6) & 63)
          }
          b[c++] = 128 | (h & 63)
        }
      }
      b[c] = 0
      return c - f
    }

    function Da(a, b, c) {
      return Ga(a, B, b, c)
    }

    function Ha(a) {
      for (var b = 0, c = 0; c < a.length; ++c) {
        var d = a.charCodeAt(c)
        55296 <= d &&
          57343 >= d &&
          (d = (65536 + ((d & 1023) << 10)) | (a.charCodeAt(++c) & 1023))
        127 >= d ? ++b : (b = 2047 >= d ? b + 2 : 65535 >= d ? b + 3 : b + 4)
      }
      return b
    }

    function Ja(a) {
      var b = Ha(a) + 1,
        c = Ka(b)
      c && Ga(a, x, c, b)
      return c
    }

    function La(a) {
      var b = Ha(a) + 1,
        c = Ca(b)
      Ga(a, x, c, b)
      return c
    }

    function Ma(a, b, c) {
      for (var d = 0; d < a.length; ++d) x[b++ >> 0] = a.charCodeAt(d)
      c || (x[b >> 0] = 0)
    }
    var Na, x, B, Oa, Pa, E, Qa, G, Ra

    function Sa(a) {
      Na = a
      e.HEAP8 = x = new Int8Array(a)
      e.HEAP16 = Oa = new Int16Array(a)
      e.HEAP32 = E = new Int32Array(a)
      e.HEAPU8 = B = new Uint8Array(a)
      e.HEAPU16 = Pa = new Uint16Array(a)
      e.HEAPU32 = Qa = new Uint32Array(a)
      e.HEAPF32 = G = new Float32Array(a)
      e.HEAPF64 = Ra = new Float64Array(a)
    }
    var Ta = e.INITIAL_MEMORY || 33554432
    e.wasmMemory
      ? (ya = e.wasmMemory)
      : (ya = new WebAssembly.Memory({
          initial: Ta / 65536,
          maximum: 16384,
        }))
    ya && (Na = ya.buffer)
    Ta = Na.byteLength
    Sa(Na)
    var H,
      Ua = [],
      Wa = [],
      Xa = [],
      Ya = [],
      Za = []

    function $a() {
      var a = e.preRun.shift()
      Ua.unshift(a)
    }
    var ab = 0,
      bb = null,
      cb = null

    function db() {
      ab++
      e.monitorRunDependencies && e.monitorRunDependencies(ab)
    }

    function eb() {
      ab--
      e.monitorRunDependencies && e.monitorRunDependencies(ab)
      if (0 == ab && (null !== bb && (clearInterval(bb), (bb = null)), cb)) {
        var a = cb
        cb = null
        a()
      }
    }
    e.preloadedImages = {}
    e.preloadedAudios = {}

    function n(a) {
      if (e.onAbort) e.onAbort(a)
      k(a)
      za = !0
      a = new WebAssembly.RuntimeError(
        'abort(' + a + '). Build with -s ASSERTIONS=1 for more info.'
      )
      ca(a)
      throw a
    }

    function fb(a) {
      var b = gb
      return String.prototype.startsWith ? b.startsWith(a) : 0 === b.indexOf(a)
    }

    function hb() {
      return fb('data:application/octet-stream;base64,')
    }
    var gb = 'ffmpeg-core.wasm'
    if (!hb()) {
      var ib = gb
      gb = e.locateFile ? e.locateFile(ib, l) : l + ib
    }

    function jb() {
      try {
        if (xa) return new Uint8Array(xa)
        if (ta) return ta(gb)
        throw 'both async and sync fetching of the wasm failed'
      } catch (a) {
        n(a)
      }
    }

    function kb() {
      return xa || (!na && !pa) || 'function' !== typeof fetch || fb('file://')
        ? Promise.resolve().then(jb)
        : fetch(gb, {
            credentials: 'same-origin',
          })
            .then(function (a) {
              if (!a.ok) throw "failed to load wasm binary file at '" + gb + "'"
              return a.arrayBuffer()
            })
            .catch(function () {
              return jb()
            })
    }
    var I, J

    function lb(a) {
      for (; 0 < a.length; ) {
        var b = a.shift()
        if ('function' == typeof b) b(e)
        else {
          var c = b.Tf
          'number' === typeof c
            ? void 0 === b.We
              ? H.get(c)()
              : H.get(c)(b.We)
            : c(void 0 === b.We ? null : b.We)
        }
      }
    }

    function mb(a) {
      return a.replace(/\b_Z[\w\d_]+/g, function (b) {
        return b === b ? b : b + ' [' + b + ']'
      })
    }
    var nb
    qa
      ? (nb = function () {
          var a = process.hrtime()
          return 1e3 * a[0] + a[1] / 1e6
        })
      : 'undefined' !== typeof dateNow
      ? (nb = dateNow)
      : (nb = function () {
          return performance.now()
        })

    function ob(a) {
      return (E[pb() >> 2] = a)
    }

    function qb(a, b) {
      if (0 === a) a = Date.now()
      else if (1 === a || 4 === a) a = nb()
      else return ob(28), -1
      E[b >> 2] = (a / 1e3) | 0
      E[(b + 4) >> 2] = ((a % 1e3) * 1e6) | 0
      return 0
    }

    function rb(a, b) {
      a = new Date(1e3 * E[a >> 2])
      E[b >> 2] = a.getUTCSeconds()
      E[(b + 4) >> 2] = a.getUTCMinutes()
      E[(b + 8) >> 2] = a.getUTCHours()
      E[(b + 12) >> 2] = a.getUTCDate()
      E[(b + 16) >> 2] = a.getUTCMonth()
      E[(b + 20) >> 2] = a.getUTCFullYear() - 1900
      E[(b + 24) >> 2] = a.getUTCDay()
      E[(b + 36) >> 2] = 0
      E[(b + 32) >> 2] = 0
      E[(b + 28) >> 2] =
        ((a.getTime() - Date.UTC(a.getUTCFullYear(), 0, 1, 0, 0, 0, 0)) /
          864e5) |
        0
      rb.Hf || (rb.Hf = Ja('GMT'))
      E[(b + 40) >> 2] = rb.Hf
      return b
    }

    function sb() {
      function a(h) {
        return (h = h.toTimeString().match(/\(([A-Za-z ]+)\)$/)) ? h[1] : 'GMT'
      }
      if (!tb) {
        tb = !0
        var b = new Date().getFullYear(),
          c = new Date(b, 0, 1),
          d = new Date(b, 6, 1)
        b = c.getTimezoneOffset()
        var f = d.getTimezoneOffset(),
          g = Math.max(b, f)
        E[ub() >> 2] = 60 * g
        E[vb() >> 2] = Number(b != f)
        c = a(c)
        d = a(d)
        c = Ja(c)
        d = Ja(d)
        f < b
          ? ((E[wb() >> 2] = c), (E[(wb() + 4) >> 2] = d))
          : ((E[wb() >> 2] = d), (E[(wb() + 4) >> 2] = c))
      }
    }
    var tb

    function xb(a, b) {
      sb()
      a = new Date(1e3 * E[a >> 2])
      E[b >> 2] = a.getSeconds()
      E[(b + 4) >> 2] = a.getMinutes()
      E[(b + 8) >> 2] = a.getHours()
      E[(b + 12) >> 2] = a.getDate()
      E[(b + 16) >> 2] = a.getMonth()
      E[(b + 20) >> 2] = a.getFullYear() - 1900
      E[(b + 24) >> 2] = a.getDay()
      var c = new Date(a.getFullYear(), 0, 1)
      E[(b + 28) >> 2] = ((a.getTime() - c.getTime()) / 864e5) | 0
      E[(b + 36) >> 2] = -(60 * a.getTimezoneOffset())
      var d = new Date(a.getFullYear(), 6, 1).getTimezoneOffset()
      c = c.getTimezoneOffset()
      a = (d != c && a.getTimezoneOffset() == Math.min(c, d)) | 0
      E[(b + 32) >> 2] = a
      a = E[(wb() + (a ? 4 : 0)) >> 2]
      E[(b + 40) >> 2] = a
      return b
    }

    function yb(a, b) {
      for (var c = 0, d = a.length - 1; 0 <= d; d--) {
        var f = a[d]
        '.' === f
          ? a.splice(d, 1)
          : '..' === f
          ? (a.splice(d, 1), c++)
          : c && (a.splice(d, 1), c--)
      }
      if (b) for (; c; c--) a.unshift('..')
      return a
    }

    function zb(a) {
      var b = '/' === a.charAt(0),
        c = '/' === a.substr(-1)
      ;(a = yb(
        a.split('/').filter(function (d) {
          return !!d
        }),
        !b
      ).join('/')) ||
        b ||
        (a = '.')
      a && c && (a += '/')
      return (b ? '/' : '') + a
    }

    function Ab(a) {
      var b = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/
        .exec(a)
        .slice(1)
      a = b[0]
      b = b[1]
      if (!a && !b) return '.'
      b && (b = b.substr(0, b.length - 1))
      return a + b
    }

    function Bb(a) {
      if ('/' === a) return '/'
      a = zb(a)
      a = a.replace(/\/$/, '')
      var b = a.lastIndexOf('/')
      return -1 === b ? a : a.substr(b + 1)
    }

    function Cb(a, b) {
      return zb(a + '/' + b)
    }

    function Db() {
      if (
        'object' === typeof crypto &&
        'function' === typeof crypto.getRandomValues
      ) {
        var a = new Uint8Array(1)
        return function () {
          crypto.getRandomValues(a)
          return a[0]
        }
      }
      if (qa)
        try {
          var b = require('crypto')
          return function () {
            return b.randomBytes(1)[0]
          }
        } catch (c) {}
      return function () {
        n('randomDevice')
      }
    }

    function Eb() {
      for (var a = '', b = !1, c = arguments.length - 1; -1 <= c && !b; c--) {
        b = 0 <= c ? arguments[c] : K.cwd()
        if ('string' !== typeof b)
          throw new TypeError('Arguments to path.resolve must be strings')
        if (!b) return ''
        a = b + '/' + a
        b = '/' === b.charAt(0)
      }
      a = yb(
        a.split('/').filter(function (d) {
          return !!d
        }),
        !b
      ).join('/')
      return (b ? '/' : '') + a || '.'
    }

    function Fb(a, b) {
      function c(h) {
        for (var m = 0; m < h.length && '' === h[m]; m++);
        for (var r = h.length - 1; 0 <= r && '' === h[r]; r--);
        return m > r ? [] : h.slice(m, r - m + 1)
      }
      a = Eb(a).substr(1)
      b = Eb(b).substr(1)
      a = c(a.split('/'))
      b = c(b.split('/'))
      for (var d = Math.min(a.length, b.length), f = d, g = 0; g < d; g++)
        if (a[g] !== b[g]) {
          f = g
          break
        }
      d = []
      for (g = f; g < a.length; g++) d.push('..')
      d = d.concat(b.slice(f))
      return d.join('/')
    }
    var Gb = []

    function Hb(a, b) {
      Gb[a] = {
        input: [],
        output: [],
        Ge: b,
      }
      K.Df(a, Ib)
    }
    var Ib = {
        open: function (a) {
          var b = Gb[a.node.rdev]
          if (!b) throw new K.Td(43)
          a.tty = b
          a.seekable = !1
        },
        close: function (a) {
          a.tty.Ge.flush(a.tty)
        },
        flush: function (a) {
          a.tty.Ge.flush(a.tty)
        },
        read: function (a, b, c, d) {
          if (!a.tty || !a.tty.Ge.Vf) throw new K.Td(60)
          for (var f = 0, g = 0; g < d; g++) {
            try {
              var h = a.tty.Ge.Vf(a.tty)
            } catch (m) {
              throw new K.Td(29)
            }
            if (void 0 === h && 0 === f) throw new K.Td(6)
            if (null === h || void 0 === h) break
            f++
            b[c + g] = h
          }
          f && (a.node.timestamp = Date.now())
          return f
        },
        write: function (a, b, c, d) {
          if (!a.tty || !a.tty.Ge.zf) throw new K.Td(60)
          try {
            for (var f = 0; f < d; f++) a.tty.Ge.zf(a.tty, b[c + f])
          } catch (g) {
            throw new K.Td(29)
          }
          d && (a.node.timestamp = Date.now())
          return f
        },
      },
      Kb = {
        Vf: function (a) {
          if (!a.input.length) {
            var b = null
            if (qa) {
              var c = Buffer.Ce ? Buffer.Ce(256) : new Buffer(256),
                d = 0
              try {
                d = ua.readSync(process.stdin.fd, c, 0, 256, null)
              } catch (f) {
                if (-1 != f.toString().indexOf('EOF')) d = 0
                else throw f
              }
              0 < d ? (b = c.slice(0, d).toString('utf-8')) : (b = null)
            } else
              'undefined' != typeof window && 'function' == typeof window.prompt
                ? ((b = window.prompt('Input: ')), null !== b && (b += '\n'))
                : 'function' == typeof readline &&
                  ((b = readline()), null !== b && (b += '\n'))
            if (!b) return null
            a.input = Jb(b, !0)
          }
          return a.input.shift()
        },
        zf: function (a, b) {
          null === b || 10 === b
            ? (fa(Fa(a.output, 0)), (a.output = []))
            : 0 != b && a.output.push(b)
        },
        flush: function (a) {
          a.output &&
            0 < a.output.length &&
            (fa(Fa(a.output, 0)), (a.output = []))
        },
      },
      Lb = {
        zf: function (a, b) {
          null === b || 10 === b
            ? (k(Fa(a.output, 0)), (a.output = []))
            : 0 != b && a.output.push(b)
        },
        flush: function (a) {
          a.output &&
            0 < a.output.length &&
            (k(Fa(a.output, 0)), (a.output = []))
        },
      },
      L = {
        re: null,
        ae: function () {
          return L.createNode(null, '/', 16895, 0)
        },
        createNode: function (a, b, c, d) {
          if (K.Cg(c) || K.isFIFO(c)) throw new K.Td(63)
          L.re ||
            (L.re = {
              dir: {
                node: {
                  oe: L.Vd.oe,
                  ee: L.Vd.ee,
                  lookup: L.Vd.lookup,
                  se: L.Vd.se,
                  rename: L.Vd.rename,
                  unlink: L.Vd.unlink,
                  rmdir: L.Vd.rmdir,
                  readdir: L.Vd.readdir,
                  symlink: L.Vd.symlink,
                },
                stream: {
                  je: L.Wd.je,
                },
              },
              file: {
                node: {
                  oe: L.Vd.oe,
                  ee: L.Vd.ee,
                },
                stream: {
                  je: L.Wd.je,
                  read: L.Wd.read,
                  write: L.Wd.write,
                  Me: L.Wd.Me,
                  Ee: L.Wd.Ee,
                  Fe: L.Wd.Fe,
                },
              },
              link: {
                node: {
                  oe: L.Vd.oe,
                  ee: L.Vd.ee,
                  readlink: L.Vd.readlink,
                },
                stream: {},
              },
              Kf: {
                node: {
                  oe: L.Vd.oe,
                  ee: L.Vd.ee,
                },
                stream: K.pg,
              },
            })
          c = K.createNode(a, b, c, d)
          K.be(c.mode)
            ? ((c.Vd = L.re.dir.node), (c.Wd = L.re.dir.stream), (c.Ud = {}))
            : K.isFile(c.mode)
            ? ((c.Vd = L.re.file.node),
              (c.Wd = L.re.file.stream),
              (c.Zd = 0),
              (c.Ud = null))
            : K.xe(c.mode)
            ? ((c.Vd = L.re.link.node), (c.Wd = L.re.link.stream))
            : K.Oe(c.mode) && ((c.Vd = L.re.Kf.node), (c.Wd = L.re.Kf.stream))
          c.timestamp = Date.now()
          a && (a.Ud[b] = c)
          return c
        },
        eh: function (a) {
          if (a.Ud && a.Ud.subarray) {
            for (var b = [], c = 0; c < a.Zd; ++c) b.push(a.Ud[c])
            return b
          }
          return a.Ud
        },
        fh: function (a) {
          return a.Ud
            ? a.Ud.subarray
              ? a.Ud.subarray(0, a.Zd)
              : new Uint8Array(a.Ud)
            : new Uint8Array(0)
        },
        Qf: function (a, b) {
          var c = a.Ud ? a.Ud.length : 0
          c >= b ||
            ((b = Math.max(b, (c * (1048576 > c ? 2 : 1.125)) >>> 0)),
            0 != c && (b = Math.max(b, 256)),
            (c = a.Ud),
            (a.Ud = new Uint8Array(b)),
            0 < a.Zd && a.Ud.set(c.subarray(0, a.Zd), 0))
        },
        Pg: function (a, b) {
          if (a.Zd != b)
            if (0 == b) (a.Ud = null), (a.Zd = 0)
            else {
              if (!a.Ud || a.Ud.subarray) {
                var c = a.Ud
                a.Ud = new Uint8Array(b)
                c && a.Ud.set(c.subarray(0, Math.min(b, a.Zd)))
              } else if ((a.Ud || (a.Ud = []), a.Ud.length > b)) a.Ud.length = b
              else for (; a.Ud.length < b; ) a.Ud.push(0)
              a.Zd = b
            }
        },
        Vd: {
          oe: function (a) {
            var b = {}
            b.dev = K.Oe(a.mode) ? a.id : 1
            b.ino = a.id
            b.mode = a.mode
            b.nlink = 1
            b.uid = 0
            b.gid = 0
            b.rdev = a.rdev
            K.be(a.mode)
              ? (b.size = 4096)
              : K.isFile(a.mode)
              ? (b.size = a.Zd)
              : K.xe(a.mode)
              ? (b.size = a.link.length)
              : (b.size = 0)
            b.atime = new Date(a.timestamp)
            b.mtime = new Date(a.timestamp)
            b.ctime = new Date(a.timestamp)
            b.ng = 4096
            b.blocks = Math.ceil(b.size / b.ng)
            return b
          },
          ee: function (a, b) {
            void 0 !== b.mode && (a.mode = b.mode)
            void 0 !== b.timestamp && (a.timestamp = b.timestamp)
            void 0 !== b.size && L.Pg(a, b.size)
          },
          lookup: function () {
            throw K.qf[44]
          },
          se: function (a, b, c, d) {
            return L.createNode(a, b, c, d)
          },
          rename: function (a, b, c) {
            if (K.be(a.mode)) {
              try {
                var d = K.pe(b, c)
              } catch (g) {}
              if (d) for (var f in d.Ud) throw new K.Td(55)
            }
            delete a.parent.Ud[a.name]
            a.name = c
            b.Ud[c] = a
            a.parent = b
          },
          unlink: function (a, b) {
            delete a.Ud[b]
          },
          rmdir: function (a, b) {
            var c = K.pe(a, b),
              d
            for (d in c.Ud) throw new K.Td(55)
            delete a.Ud[b]
          },
          readdir: function (a) {
            var b = ['.', '..'],
              c
            for (c in a.Ud) a.Ud.hasOwnProperty(c) && b.push(c)
            return b
          },
          symlink: function (a, b, c) {
            a = L.createNode(a, b, 41471, 0)
            a.link = c
            return a
          },
          readlink: function (a) {
            if (!K.xe(a.mode)) throw new K.Td(28)
            return a.link
          },
        },
        Wd: {
          read: function (a, b, c, d, f) {
            var g = a.node.Ud
            if (f >= a.node.Zd) return 0
            a = Math.min(a.node.Zd - f, d)
            if (8 < a && g.subarray) b.set(g.subarray(f, f + a), c)
            else for (d = 0; d < a; d++) b[c + d] = g[f + d]
            return a
          },
          write: function (a, b, c, d, f, g) {
            b.buffer === x.buffer && (g = !1)
            if (!d) return 0
            a = a.node
            a.timestamp = Date.now()
            if (b.subarray && (!a.Ud || a.Ud.subarray)) {
              if (g) return (a.Ud = b.subarray(c, c + d)), (a.Zd = d)
              if (0 === a.Zd && 0 === f)
                return (a.Ud = b.slice(c, c + d)), (a.Zd = d)
              if (f + d <= a.Zd) return a.Ud.set(b.subarray(c, c + d), f), d
            }
            L.Qf(a, f + d)
            if (a.Ud.subarray && b.subarray) a.Ud.set(b.subarray(c, c + d), f)
            else for (g = 0; g < d; g++) a.Ud[f + g] = b[c + g]
            a.Zd = Math.max(a.Zd, f + d)
            return d
          },
          je: function (a, b, c) {
            1 === c
              ? (b += a.position)
              : 2 === c && K.isFile(a.node.mode) && (b += a.node.Zd)
            if (0 > b) throw new K.Td(28)
            return b
          },
          Me: function (a, b, c) {
            L.Qf(a.node, b + c)
            a.node.Zd = Math.max(a.node.Zd, b + c)
          },
          Ee: function (a, b, c, d, f, g) {
            assert(0 === b)
            if (!K.isFile(a.node.mode)) throw new K.Td(43)
            a = a.node.Ud
            if (g & 2 || a.buffer !== Na) {
              if (0 < d || d + c < a.length)
                a.subarray
                  ? (a = a.subarray(d, d + c))
                  : (a = Array.prototype.slice.call(a, d, d + c))
              d = !0
              g = 16384 * Math.ceil(c / 16384)
              for (b = Ka(g); c < g; ) x[b + c++] = 0
              c = b
              if (!c) throw new K.Td(48)
              x.set(a, c)
            } else (d = !1), (c = a.byteOffset)
            return {
              Og: c,
              lf: d,
            }
          },
          Fe: function (a, b, c, d, f) {
            if (!K.isFile(a.node.mode)) throw new K.Td(43)
            if (f & 2) return 0
            L.Wd.write(a, b, 0, d, c, !1)
            return 0
          },
        },
      },
      K = {
        root: null,
        Te: [],
        Of: {},
        streams: [],
        Ig: 1,
        qe: null,
        Nf: '/',
        tf: !1,
        Zf: !0,
        de: {},
        eg: {
          bg: {
            ig: 1,
            kg: 2,
          },
        },
        Td: null,
        qf: {},
        xg: null,
        ef: 0,
        hh: function (a) {
          if (!(a instanceof K.Td)) {
            a: {
              var b = Error()
              if (!b.stack) {
                try {
                  throw Error()
                } catch (c) {
                  b = c
                }
                if (!b.stack) {
                  b = '(no stack trace available)'
                  break a
                }
              }
              b = b.stack.toString()
            }
            e.extraStackTrace && (b += '\n' + e.extraStackTrace())
            b = mb(b)
            throw a + ' : ' + b
          }
          return ob(a.Xd)
        },
        Yd: function (a, b) {
          a = Eb(K.cwd(), a)
          b = b || {}
          if (!a)
            return {
              path: '',
              node: null,
            }
          var c = {
              pf: !0,
              Bf: 0,
            },
            d
          for (d in c) void 0 === b[d] && (b[d] = c[d])
          if (8 < b.Bf) throw new K.Td(32)
          a = yb(
            a.split('/').filter(function (h) {
              return !!h
            }),
            !1
          )
          var f = K.root
          c = '/'
          for (d = 0; d < a.length; d++) {
            var g = d === a.length - 1
            if (g && b.parent) break
            f = K.pe(f, a[d])
            c = Cb(c, a[d])
            K.ye(f) && (!g || (g && b.pf)) && (f = f.Se.root)
            if (!g || b.le)
              for (g = 0; K.xe(f.mode); )
                if (
                  ((f = K.readlink(c)),
                  (c = Eb(Ab(c), f)),
                  (f = K.Yd(c, {
                    Bf: b.Bf,
                  }).node),
                  40 < g++)
                )
                  throw new K.Td(32)
          }
          return {
            path: c,
            node: f,
          }
        },
        ue: function (a) {
          for (var b; ; ) {
            if (K.$e(a))
              return (
                (a = a.ae.ag),
                b ? ('/' !== a[a.length - 1] ? a + '/' + b : a + b) : a
              )
            b = b ? a.name + '/' + b : a.name
            a = a.parent
          }
        },
        sf: function (a, b) {
          for (var c = 0, d = 0; d < b.length; d++)
            c = ((c << 5) - c + b.charCodeAt(d)) | 0
          return ((a + c) >>> 0) % K.qe.length
        },
        Xf: function (a) {
          var b = K.sf(a.parent.id, a.name)
          a.Ae = K.qe[b]
          K.qe[b] = a
        },
        Yf: function (a) {
          var b = K.sf(a.parent.id, a.name)
          if (K.qe[b] === a) K.qe[b] = a.Ae
          else
            for (b = K.qe[b]; b; ) {
              if (b.Ae === a) {
                b.Ae = a.Ae
                break
              }
              b = b.Ae
            }
        },
        pe: function (a, b) {
          var c = K.Gg(a)
          if (c) throw new K.Td(c, a)
          for (c = K.qe[K.sf(a.id, b)]; c; c = c.Ae) {
            var d = c.name
            if (c.parent.id === a.id && d === b) return c
          }
          return K.lookup(a, b)
        },
        createNode: function (a, b, c, d) {
          a = new K.gg(a, b, c, d)
          K.Xf(a)
          return a
        },
        nf: function (a) {
          K.Yf(a)
        },
        $e: function (a) {
          return a === a.parent
        },
        ye: function (a) {
          return !!a.Se
        },
        isFile: function (a) {
          return 32768 === (a & 61440)
        },
        be: function (a) {
          return 16384 === (a & 61440)
        },
        xe: function (a) {
          return 40960 === (a & 61440)
        },
        Oe: function (a) {
          return 8192 === (a & 61440)
        },
        Cg: function (a) {
          return 24576 === (a & 61440)
        },
        isFIFO: function (a) {
          return 4096 === (a & 61440)
        },
        isSocket: function (a) {
          return 49152 === (a & 49152)
        },
        yg: {
          r: 0,
          rs: 1052672,
          'r+': 2,
          w: 577,
          wx: 705,
          xw: 705,
          'w+': 578,
          'wx+': 706,
          'xw+': 706,
          a: 1089,
          ax: 1217,
          xa: 1217,
          'a+': 1090,
          'ax+': 1218,
          'xa+': 1218,
        },
        $f: function (a) {
          var b = K.yg[a]
          if ('undefined' === typeof b)
            throw Error('Unknown file open mode: ' + a)
          return b
        },
        Rf: function (a) {
          var b = ['r', 'w', 'rw'][a & 3]
          a & 512 && (b += 'w')
          return b
        },
        ve: function (a, b) {
          if (K.Zf) return 0
          if (-1 === b.indexOf('r') || a.mode & 292) {
            if (
              (-1 !== b.indexOf('w') && !(a.mode & 146)) ||
              (-1 !== b.indexOf('x') && !(a.mode & 73))
            )
              return 2
          } else return 2
          return 0
        },
        Gg: function (a) {
          var b = K.ve(a, 'x')
          return b ? b : a.Vd.lookup ? 0 : 2
        },
        yf: function (a, b) {
          try {
            return K.pe(a, b), 20
          } catch (c) {}
          return K.ve(a, 'wx')
        },
        af: function (a, b, c) {
          try {
            var d = K.pe(a, b)
          } catch (f) {
            return f.Xd
          }
          if ((a = K.ve(a, 'wx'))) return a
          if (c) {
            if (!K.be(d.mode)) return 54
            if (K.$e(d) || K.ue(d) === K.cwd()) return 10
          } else if (K.be(d.mode)) return 31
          return 0
        },
        Hg: function (a, b) {
          return a
            ? K.xe(a.mode)
              ? 32
              : K.be(a.mode) && ('r' !== K.Rf(b) || b & 512)
              ? 31
              : K.ve(a, K.Rf(b))
            : 44
        },
        hg: 4096,
        Jg: function (a, b) {
          b = b || K.hg
          for (a = a || 0; a <= b; a++) if (!K.streams[a]) return a
          throw new K.Td(33)
        },
        ne: function (a) {
          return K.streams[a]
        },
        Mf: function (a, b, c) {
          K.jf ||
            ((K.jf = function () {}),
            (K.jf.prototype = {
              object: {
                get: function () {
                  return this.node
                },
                set: function (g) {
                  this.node = g
                },
              },
            }))
          var d = new K.jf(),
            f
          for (f in a) d[f] = a[f]
          a = d
          b = K.Jg(b, c)
          a.fd = b
          return (K.streams[b] = a)
        },
        qg: function (a) {
          K.streams[a] = null
        },
        pg: {
          open: function (a) {
            a.Wd = K.zg(a.node.rdev).Wd
            a.Wd.open && a.Wd.open(a)
          },
          je: function () {
            throw new K.Td(70)
          },
        },
        wf: function (a) {
          return a >> 8
        },
        jh: function (a) {
          return a & 255
        },
        ze: function (a, b) {
          return (a << 8) | b
        },
        Df: function (a, b) {
          K.Of[a] = {
            Wd: b,
          }
        },
        zg: function (a) {
          return K.Of[a]
        },
        Uf: function (a) {
          var b = []
          for (a = [a]; a.length; ) {
            var c = a.pop()
            b.push(c)
            a.push.apply(a, c.Te)
          }
          return b
        },
        dg: function (a, b) {
          function c(h) {
            K.ef--
            return b(h)
          }

          function d(h) {
            if (h) {
              if (!d.wg) return (d.wg = !0), c(h)
            } else ++g >= f.length && c(null)
          }
          'function' === typeof a && ((b = a), (a = !1))
          K.ef++
          1 < K.ef &&
            k(
              'warning: ' +
                K.ef +
                ' FS.syncfs operations in flight at once, probably just doing extra work'
            )
          var f = K.Uf(K.root.ae),
            g = 0
          f.forEach(function (h) {
            if (!h.type.dg) return d(null)
            h.type.dg(h, a, d)
          })
        },
        ae: function (a, b, c) {
          var d = '/' === c,
            f = !c
          if (d && K.root) throw new K.Td(10)
          if (!d && !f) {
            var g = K.Yd(c, {
              pf: !1,
            })
            c = g.path
            g = g.node
            if (K.ye(g)) throw new K.Td(10)
            if (!K.be(g.mode)) throw new K.Td(54)
          }
          b = {
            type: a,
            mh: b,
            ag: c,
            Te: [],
          }
          a = a.ae(b)
          a.ae = b
          b.root = a
          d ? (K.root = a) : g && ((g.Se = b), g.ae && g.ae.Te.push(b))
          return a
        },
        ph: function (a) {
          a = K.Yd(a, {
            pf: !1,
          })
          if (!K.ye(a.node)) throw new K.Td(28)
          a = a.node
          var b = a.Se,
            c = K.Uf(b)
          Object.keys(K.qe).forEach(function (d) {
            for (d = K.qe[d]; d; ) {
              var f = d.Ae
              ;-1 !== c.indexOf(d.ae) && K.nf(d)
              d = f
            }
          })
          a.Se = null
          a.ae.Te.splice(a.ae.Te.indexOf(b), 1)
        },
        lookup: function (a, b) {
          return a.Vd.lookup(a, b)
        },
        se: function (a, b, c) {
          var d = K.Yd(a, {
            parent: !0,
          }).node
          a = Bb(a)
          if (!a || '.' === a || '..' === a) throw new K.Td(28)
          var f = K.yf(d, a)
          if (f) throw new K.Td(f)
          if (!d.Vd.se) throw new K.Td(63)
          return d.Vd.se(d, a, b, c)
        },
        create: function (a, b) {
          return K.se(a, ((void 0 !== b ? b : 438) & 4095) | 32768, 0)
        },
        mkdir: function (a, b) {
          return K.se(a, ((void 0 !== b ? b : 511) & 1023) | 16384, 0)
        },
        kh: function (a, b) {
          a = a.split('/')
          for (var c = '', d = 0; d < a.length; ++d)
            if (a[d]) {
              c += '/' + a[d]
              try {
                K.mkdir(c, b)
              } catch (f) {
                if (20 != f.Xd) throw f
              }
            }
        },
        bf: function (a, b, c) {
          'undefined' === typeof c && ((c = b), (b = 438))
          return K.se(a, b | 8192, c)
        },
        symlink: function (a, b) {
          if (!Eb(a)) throw new K.Td(44)
          var c = K.Yd(b, {
            parent: !0,
          }).node
          if (!c) throw new K.Td(44)
          b = Bb(b)
          var d = K.yf(c, b)
          if (d) throw new K.Td(d)
          if (!c.Vd.symlink) throw new K.Td(63)
          return c.Vd.symlink(c, b, a)
        },
        rename: function (a, b) {
          var c = Ab(a),
            d = Ab(b),
            f = Bb(a),
            g = Bb(b)
          var h = K.Yd(a, {
            parent: !0,
          })
          var m = h.node
          h = K.Yd(b, {
            parent: !0,
          })
          h = h.node
          if (!m || !h) throw new K.Td(44)
          if (m.ae !== h.ae) throw new K.Td(75)
          var r = K.pe(m, f)
          d = Fb(a, d)
          if ('.' !== d.charAt(0)) throw new K.Td(28)
          d = Fb(b, c)
          if ('.' !== d.charAt(0)) throw new K.Td(55)
          try {
            var q = K.pe(h, g)
          } catch (t) {}
          if (r !== q) {
            c = K.be(r.mode)
            if ((f = K.af(m, f, c))) throw new K.Td(f)
            if ((f = q ? K.af(h, g, c) : K.yf(h, g))) throw new K.Td(f)
            if (!m.Vd.rename) throw new K.Td(63)
            if (K.ye(r) || (q && K.ye(q))) throw new K.Td(10)
            if (h !== m && (f = K.ve(m, 'w'))) throw new K.Td(f)
            try {
              K.de.willMovePath && K.de.willMovePath(a, b)
            } catch (t) {
              k(
                "FS.trackingDelegate['willMovePath']('" +
                  a +
                  "', '" +
                  b +
                  "') threw an exception: " +
                  t.message
              )
            }
            K.Yf(r)
            try {
              m.Vd.rename(r, h, g)
            } catch (t) {
              throw t
            } finally {
              K.Xf(r)
            }
            try {
              if (K.de.onMovePath) K.de.onMovePath(a, b)
            } catch (t) {
              k(
                "FS.trackingDelegate['onMovePath']('" +
                  a +
                  "', '" +
                  b +
                  "') threw an exception: " +
                  t.message
              )
            }
          }
        },
        rmdir: function (a) {
          var b = K.Yd(a, {
              parent: !0,
            }).node,
            c = Bb(a),
            d = K.pe(b, c),
            f = K.af(b, c, !0)
          if (f) throw new K.Td(f)
          if (!b.Vd.rmdir) throw new K.Td(63)
          if (K.ye(d)) throw new K.Td(10)
          try {
            K.de.willDeletePath && K.de.willDeletePath(a)
          } catch (g) {
            k(
              "FS.trackingDelegate['willDeletePath']('" +
                a +
                "') threw an exception: " +
                g.message
            )
          }
          b.Vd.rmdir(b, c)
          K.nf(d)
          try {
            if (K.de.onDeletePath) K.de.onDeletePath(a)
          } catch (g) {
            k(
              "FS.trackingDelegate['onDeletePath']('" +
                a +
                "') threw an exception: " +
                g.message
            )
          }
        },
        readdir: function (a) {
          a = K.Yd(a, {
            le: !0,
          }).node
          if (!a.Vd.readdir) throw new K.Td(54)
          return a.Vd.readdir(a)
        },
        unlink: function (a) {
          var b = K.Yd(a, {
              parent: !0,
            }).node,
            c = Bb(a),
            d = K.pe(b, c),
            f = K.af(b, c, !1)
          if (f) throw new K.Td(f)
          if (!b.Vd.unlink) throw new K.Td(63)
          if (K.ye(d)) throw new K.Td(10)
          try {
            K.de.willDeletePath && K.de.willDeletePath(a)
          } catch (g) {
            k(
              "FS.trackingDelegate['willDeletePath']('" +
                a +
                "') threw an exception: " +
                g.message
            )
          }
          b.Vd.unlink(b, c)
          K.nf(d)
          try {
            if (K.de.onDeletePath) K.de.onDeletePath(a)
          } catch (g) {
            k(
              "FS.trackingDelegate['onDeletePath']('" +
                a +
                "') threw an exception: " +
                g.message
            )
          }
        },
        readlink: function (a) {
          a = K.Yd(a).node
          if (!a) throw new K.Td(44)
          if (!a.Vd.readlink) throw new K.Td(28)
          return Eb(K.ue(a.parent), a.Vd.readlink(a))
        },
        stat: function (a, b) {
          a = K.Yd(a, {
            le: !b,
          }).node
          if (!a) throw new K.Td(44)
          if (!a.Vd.oe) throw new K.Td(63)
          return a.Vd.oe(a)
        },
        lstat: function (a) {
          return K.stat(a, !0)
        },
        chmod: function (a, b, c) {
          var d
          'string' === typeof a
            ? (d = K.Yd(a, {
                le: !c,
              }).node)
            : (d = a)
          if (!d.Vd.ee) throw new K.Td(63)
          d.Vd.ee(d, {
            mode: (b & 4095) | (d.mode & -4096),
            timestamp: Date.now(),
          })
        },
        lchmod: function (a, b) {
          K.chmod(a, b, !0)
        },
        fchmod: function (a, b) {
          a = K.ne(a)
          if (!a) throw new K.Td(8)
          K.chmod(a.node, b)
        },
        chown: function (a, b, c, d) {
          var f
          'string' === typeof a
            ? (f = K.Yd(a, {
                le: !d,
              }).node)
            : (f = a)
          if (!f.Vd.ee) throw new K.Td(63)
          f.Vd.ee(f, {
            timestamp: Date.now(),
          })
        },
        lchown: function (a, b, c) {
          K.chown(a, b, c, !0)
        },
        fchown: function (a, b, c) {
          a = K.ne(a)
          if (!a) throw new K.Td(8)
          K.chown(a.node, b, c)
        },
        truncate: function (a, b) {
          if (0 > b) throw new K.Td(28)
          var c
          'string' === typeof a
            ? (c = K.Yd(a, {
                le: !0,
              }).node)
            : (c = a)
          if (!c.Vd.ee) throw new K.Td(63)
          if (K.be(c.mode)) throw new K.Td(31)
          if (!K.isFile(c.mode)) throw new K.Td(28)
          if ((a = K.ve(c, 'w'))) throw new K.Td(a)
          c.Vd.ee(c, {
            size: b,
            timestamp: Date.now(),
          })
        },
        dh: function (a, b) {
          a = K.ne(a)
          if (!a) throw new K.Td(8)
          if (0 === (a.flags & 2097155)) throw new K.Td(28)
          K.truncate(a.node, b)
        },
        qh: function (a, b, c) {
          a = K.Yd(a, {
            le: !0,
          }).node
          a.Vd.ee(a, {
            timestamp: Math.max(b, c),
          })
        },
        open: function (a, b, c, d, f) {
          if ('' === a) throw new K.Td(44)
          b = 'string' === typeof b ? K.$f(b) : b
          c = b & 64 ? (('undefined' === typeof c ? 438 : c) & 4095) | 32768 : 0
          if ('object' === typeof a) var g = a
          else {
            a = zb(a)
            try {
              g = K.Yd(a, {
                le: !(b & 131072),
              }).node
            } catch (m) {}
          }
          var h = !1
          if (b & 64)
            if (g) {
              if (b & 128) throw new K.Td(20)
            } else (g = K.se(a, c, 0)), (h = !0)
          if (!g) throw new K.Td(44)
          K.Oe(g.mode) && (b &= -513)
          if (b & 65536 && !K.be(g.mode)) throw new K.Td(54)
          if (!h && (c = K.Hg(g, b))) throw new K.Td(c)
          b & 512 && K.truncate(g, 0)
          b &= -131713
          d = K.Mf(
            {
              node: g,
              path: K.ue(g),
              flags: b,
              seekable: !0,
              position: 0,
              Wd: g.Wd,
              Wg: [],
              error: !1,
            },
            d,
            f
          )
          d.Wd.open && d.Wd.open(d)
          !e.logReadFiles ||
            b & 1 ||
            (K.Af || (K.Af = {}),
            a in K.Af ||
              ((K.Af[a] = 1),
              k('FS.trackingDelegate error on read file: ' + a)))
          try {
            K.de.onOpenFile &&
              ((f = 0),
              1 !== (b & 2097155) && (f |= K.eg.bg.ig),
              0 !== (b & 2097155) && (f |= K.eg.bg.kg),
              K.de.onOpenFile(a, f))
          } catch (m) {
            k(
              "FS.trackingDelegate['onOpenFile']('" +
                a +
                "', flags) threw an exception: " +
                m.message
            )
          }
          return d
        },
        close: function (a) {
          if (K.Pe(a)) throw new K.Td(8)
          a.we && (a.we = null)
          try {
            a.Wd.close && a.Wd.close(a)
          } catch (b) {
            throw b
          } finally {
            K.qg(a.fd)
          }
          a.fd = null
        },
        Pe: function (a) {
          return null === a.fd
        },
        je: function (a, b, c) {
          if (K.Pe(a)) throw new K.Td(8)
          if (!a.seekable || !a.Wd.je) throw new K.Td(70)
          if (0 != c && 1 != c && 2 != c) throw new K.Td(28)
          a.position = a.Wd.je(a, b, c)
          a.Wg = []
          return a.position
        },
        read: function (a, b, c, d, f) {
          if (0 > d || 0 > f) throw new K.Td(28)
          if (K.Pe(a)) throw new K.Td(8)
          if (1 === (a.flags & 2097155)) throw new K.Td(8)
          if (K.be(a.node.mode)) throw new K.Td(31)
          if (!a.Wd.read) throw new K.Td(28)
          var g = 'undefined' !== typeof f
          if (!g) f = a.position
          else if (!a.seekable) throw new K.Td(70)
          b = a.Wd.read(a, b, c, d, f)
          g || (a.position += b)
          return b
        },
        write: function (a, b, c, d, f, g) {
          if (0 > d || 0 > f) throw new K.Td(28)
          if (K.Pe(a)) throw new K.Td(8)
          if (0 === (a.flags & 2097155)) throw new K.Td(8)
          if (K.be(a.node.mode)) throw new K.Td(31)
          if (!a.Wd.write) throw new K.Td(28)
          a.seekable && a.flags & 1024 && K.je(a, 0, 2)
          var h = 'undefined' !== typeof f
          if (!h) f = a.position
          else if (!a.seekable) throw new K.Td(70)
          b = a.Wd.write(a, b, c, d, f, g)
          h || (a.position += b)
          try {
            if (a.path && K.de.onWriteToFile) K.de.onWriteToFile(a.path)
          } catch (m) {
            k(
              "FS.trackingDelegate['onWriteToFile']('" +
                a.path +
                "') threw an exception: " +
                m.message
            )
          }
          return b
        },
        Me: function (a, b, c) {
          if (K.Pe(a)) throw new K.Td(8)
          if (0 > b || 0 >= c) throw new K.Td(28)
          if (0 === (a.flags & 2097155)) throw new K.Td(8)
          if (!K.isFile(a.node.mode) && !K.be(a.node.mode)) throw new K.Td(43)
          if (!a.Wd.Me) throw new K.Td(138)
          a.Wd.Me(a, b, c)
        },
        Ee: function (a, b, c, d, f, g) {
          if (0 !== (f & 2) && 0 === (g & 2) && 2 !== (a.flags & 2097155))
            throw new K.Td(2)
          if (1 === (a.flags & 2097155)) throw new K.Td(2)
          if (!a.Wd.Ee) throw new K.Td(43)
          return a.Wd.Ee(a, b, c, d, f, g)
        },
        Fe: function (a, b, c, d, f) {
          return a && a.Wd.Fe ? a.Wd.Fe(a, b, c, d, f) : 0
        },
        lh: function () {
          return 0
        },
        De: function (a, b, c) {
          if (!a.Wd.De) throw new K.Td(59)
          return a.Wd.De(a, b, c)
        },
        readFile: function (a, b) {
          b = b || {}
          b.flags = b.flags || 'r'
          b.encoding = b.encoding || 'binary'
          if ('utf8' !== b.encoding && 'binary' !== b.encoding)
            throw Error('Invalid encoding type "' + b.encoding + '"')
          var c,
            d = K.open(a, b.flags)
          a = K.stat(a).size
          var f = new Uint8Array(a)
          K.read(d, f, 0, a, 0)
          'utf8' === b.encoding
            ? (c = Fa(f, 0))
            : 'binary' === b.encoding && (c = f)
          K.close(d)
          return c
        },
        writeFile: function (a, b, c) {
          c = c || {}
          c.flags = c.flags || 'w'
          a = K.open(a, c.flags, c.mode)
          if ('string' === typeof b) {
            var d = new Uint8Array(Ha(b) + 1)
            b = Ga(b, d, 0, d.length)
            K.write(a, d, 0, b, void 0, c.og)
          } else if (ArrayBuffer.isView(b))
            K.write(a, b, 0, b.byteLength, void 0, c.og)
          else throw Error('Unsupported data type')
          K.close(a)
        },
        cwd: function () {
          return K.Nf
        },
        chdir: function (a) {
          a = K.Yd(a, {
            le: !0,
          })
          if (null === a.node) throw new K.Td(44)
          if (!K.be(a.node.mode)) throw new K.Td(54)
          var b = K.ve(a.node, 'x')
          if (b) throw new K.Td(b)
          K.Nf = a.path
        },
        sg: function () {
          K.mkdir('/tmp')
          K.mkdir('/home')
          K.mkdir('/home/web_user')
        },
        rg: function () {
          K.mkdir('/dev')
          K.Df(K.ze(1, 3), {
            read: function () {
              return 0
            },
            write: function (b, c, d, f) {
              return f
            },
          })
          K.bf('/dev/null', K.ze(1, 3))
          Hb(K.ze(5, 0), Kb)
          Hb(K.ze(6, 0), Lb)
          K.bf('/dev/tty', K.ze(5, 0))
          K.bf('/dev/tty1', K.ze(6, 0))
          var a = Db()
          K.te('/dev', 'random', a)
          K.te('/dev', 'urandom', a)
          K.mkdir('/dev/shm')
          K.mkdir('/dev/shm/tmp')
        },
        ug: function () {
          K.mkdir('/proc')
          K.mkdir('/proc/self')
          K.mkdir('/proc/self/fd')
          K.ae(
            {
              ae: function () {
                var a = K.createNode('/proc/self', 'fd', 16895, 73)
                a.Vd = {
                  lookup: function (b, c) {
                    var d = K.ne(+c)
                    if (!d) throw new K.Td(8)
                    b = {
                      parent: null,
                      ae: {
                        ag: 'fake',
                      },
                      Vd: {
                        readlink: function () {
                          return d.path
                        },
                      },
                    }
                    return (b.parent = b)
                  },
                }
                return a
              },
            },
            {},
            '/proc/self/fd'
          )
        },
        vg: function () {
          e.stdin
            ? K.te('/dev', 'stdin', e.stdin)
            : K.symlink('/dev/tty', '/dev/stdin')
          e.stdout
            ? K.te('/dev', 'stdout', null, e.stdout)
            : K.symlink('/dev/tty', '/dev/stdout')
          e.stderr
            ? K.te('/dev', 'stderr', null, e.stderr)
            : K.symlink('/dev/tty1', '/dev/stderr')
          K.open('/dev/stdin', 'r')
          K.open('/dev/stdout', 'w')
          K.open('/dev/stderr', 'w')
        },
        Pf: function () {
          K.Td ||
            ((K.Td = function (a, b) {
              this.node = b
              this.Qg = function (c) {
                this.Xd = c
              }
              this.Qg(a)
              this.message = 'FS error'
            }),
            (K.Td.prototype = Error()),
            (K.Td.prototype.constructor = K.Td),
            [44].forEach(function (a) {
              K.qf[a] = new K.Td(a)
              K.qf[a].stack = '<generic error, no stack>'
            }))
        },
        Rg: function () {
          K.Pf()
          K.qe = Array(4096)
          K.ae(L, {}, '/')
          K.sg()
          K.rg()
          K.ug()
          K.xg = {
            MEMFS: L,
          }
        },
        Ne: function (a, b, c) {
          K.Ne.tf = !0
          K.Pf()
          e.stdin = a || e.stdin
          e.stdout = b || e.stdout
          e.stderr = c || e.stderr
          K.vg()
        },
        quit: function () {
          K.Ne.tf = !1
          var a = e._fflush
          a && a(0)
          for (a = 0; a < K.streams.length; a++) {
            var b = K.streams[a]
            b && K.close(b)
          }
        },
        rf: function (a, b) {
          var c = 0
          a && (c |= 365)
          b && (c |= 146)
          return c
        },
        bh: function (a, b) {
          a = K.mf(a, b)
          if (a.exists) return a.object
          ob(a.error)
          return null
        },
        mf: function (a, b) {
          try {
            var c = K.Yd(a, {
              le: !b,
            })
            a = c.path
          } catch (f) {}
          var d = {
            $e: !1,
            exists: !1,
            error: 0,
            name: null,
            path: null,
            object: null,
            Kg: !1,
            Mg: null,
            Lg: null,
          }
          try {
            ;(c = K.Yd(a, {
              parent: !0,
            })),
              (d.Kg = !0),
              (d.Mg = c.path),
              (d.Lg = c.node),
              (d.name = Bb(a)),
              (c = K.Yd(a, {
                le: !b,
              })),
              (d.exists = !0),
              (d.path = c.path),
              (d.object = c.node),
              (d.name = c.node.name),
              (d.$e = '/' === c.path)
          } catch (f) {
            d.error = f.Xd
          }
          return d
        },
        $g: function (a, b) {
          a = 'string' === typeof a ? a : K.ue(a)
          for (b = b.split('/').reverse(); b.length; ) {
            var c = b.pop()
            if (c) {
              var d = Cb(a, c)
              try {
                K.mkdir(d)
              } catch (f) {}
              a = d
            }
          }
          return d
        },
        tg: function (a, b, c, d, f) {
          a = Cb('string' === typeof a ? a : K.ue(a), b)
          return K.create(a, K.rf(d, f))
        },
        Lf: function (a, b, c, d, f, g) {
          a = b ? Cb('string' === typeof a ? a : K.ue(a), b) : a
          d = K.rf(d, f)
          f = K.create(a, d)
          if (c) {
            if ('string' === typeof c) {
              a = Array(c.length)
              b = 0
              for (var h = c.length; b < h; ++b) a[b] = c.charCodeAt(b)
              c = a
            }
            K.chmod(f, d | 146)
            a = K.open(f, 'w')
            K.write(a, c, 0, c.length, 0, g)
            K.close(a)
            K.chmod(f, d)
          }
          return f
        },
        te: function (a, b, c, d) {
          a = Cb('string' === typeof a ? a : K.ue(a), b)
          b = K.rf(!!c, !!d)
          K.te.wf || (K.te.wf = 64)
          var f = K.ze(K.te.wf++, 0)
          K.Df(f, {
            open: function (g) {
              g.seekable = !1
            },
            close: function () {
              d && d.buffer && d.buffer.length && d(10)
            },
            read: function (g, h, m, r) {
              for (var q = 0, t = 0; t < r; t++) {
                try {
                  var v = c()
                } catch (C) {
                  throw new K.Td(29)
                }
                if (void 0 === v && 0 === q) throw new K.Td(6)
                if (null === v || void 0 === v) break
                q++
                h[m + t] = v
              }
              q && (g.node.timestamp = Date.now())
              return q
            },
            write: function (g, h, m, r) {
              for (var q = 0; q < r; q++)
                try {
                  d(h[m + q])
                } catch (t) {
                  throw new K.Td(29)
                }
              r && (g.node.timestamp = Date.now())
              return q
            },
          })
          return K.bf(a, b, f)
        },
        Sf: function (a) {
          if (a.uf || a.Dg || a.link || a.Ud) return !0
          var b = !0
          if ('undefined' !== typeof XMLHttpRequest)
            throw Error(
              'Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.'
            )
          if (sa)
            try {
              ;(a.Ud = Jb(sa(a.url), !0)), (a.Zd = a.Ud.length)
            } catch (c) {
              b = !1
            }
          else throw Error('Cannot load without read() or XMLHttpRequest.')
          b || ob(29)
          return b
        },
        Zg: function (a, b, c, d, f) {
          function g() {
            this.vf = !1
            this.Ce = []
          }
          g.prototype.get = function (q) {
            if (!(q > this.length - 1 || 0 > q)) {
              var t = q % this.chunkSize
              return this.Wf((q / this.chunkSize) | 0)[t]
            }
          }
          g.prototype.jg = function (q) {
            this.Wf = q
          }
          g.prototype.Jf = function () {
            var q = new XMLHttpRequest()
            q.open('HEAD', c, !1)
            q.send(null)
            if (!((200 <= q.status && 300 > q.status) || 304 === q.status))
              throw Error("Couldn't load " + c + '. Status: ' + q.status)
            var t = Number(q.getResponseHeader('Content-length')),
              v,
              C = (v = q.getResponseHeader('Accept-Ranges')) && 'bytes' === v
            q = (v = q.getResponseHeader('Content-Encoding')) && 'gzip' === v
            var p = 1048576
            C || (p = t)
            var u = this
            u.jg(function (w) {
              var D = w * p,
                N = (w + 1) * p - 1
              N = Math.min(N, t - 1)
              if ('undefined' === typeof u.Ce[w]) {
                var Va = u.Ce
                if (D > N)
                  throw Error(
                    'invalid range (' +
                      D +
                      ', ' +
                      N +
                      ') or no bytes requested!'
                  )
                if (N > t - 1)
                  throw Error(
                    'only ' + t + ' bytes available! programmer error!'
                  )
                var F = new XMLHttpRequest()
                F.open('GET', c, !1)
                t !== p && F.setRequestHeader('Range', 'bytes=' + D + '-' + N)
                'undefined' != typeof Uint8Array &&
                  (F.responseType = 'arraybuffer')
                F.overrideMimeType &&
                  F.overrideMimeType('text/plain; charset=x-user-defined')
                F.send(null)
                if (!((200 <= F.status && 300 > F.status) || 304 === F.status))
                  throw Error("Couldn't load " + c + '. Status: ' + F.status)
                D =
                  void 0 !== F.response
                    ? new Uint8Array(F.response || [])
                    : Jb(F.responseText || '', !0)
                Va[w] = D
              }
              if ('undefined' === typeof u.Ce[w]) throw Error('doXHR failed!')
              return u.Ce[w]
            })
            if (q || !t)
              (p = t = 1),
                (p = t = this.Wf(0).length),
                fa(
                  'LazyFiles on gzip forces download of the whole file when length is accessed'
                )
            this.mg = t
            this.lg = p
            this.vf = !0
          }
          if ('undefined' !== typeof XMLHttpRequest) {
            if (!pa)
              throw 'Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc'
            var h = new g()
            Object.defineProperties(h, {
              length: {
                get: function () {
                  this.vf || this.Jf()
                  return this.mg
                },
              },
              chunkSize: {
                get: function () {
                  this.vf || this.Jf()
                  return this.lg
                },
              },
            })
            h = {
              uf: !1,
              Ud: h,
            }
          } else
            h = {
              uf: !1,
              url: c,
            }
          var m = K.tg(a, b, h, d, f)
          h.Ud ? (m.Ud = h.Ud) : h.url && ((m.Ud = null), (m.url = h.url))
          Object.defineProperties(m, {
            Zd: {
              get: function () {
                return this.Ud.length
              },
            },
          })
          var r = {}
          Object.keys(m.Wd).forEach(function (q) {
            var t = m.Wd[q]
            r[q] = function () {
              if (!K.Sf(m)) throw new K.Td(29)
              return t.apply(null, arguments)
            }
          })
          r.read = function (q, t, v, C, p) {
            if (!K.Sf(m)) throw new K.Td(29)
            q = q.node.Ud
            if (p >= q.length) return 0
            C = Math.min(q.length - p, C)
            if (q.slice) for (var u = 0; u < C; u++) t[v + u] = q[p + u]
            else for (u = 0; u < C; u++) t[v + u] = q.get(p + u)
            return C
          }
          m.Wd = r
          return m
        },
        ah: function (a, b, c, d, f, g, h, m, r, q) {
          function t(C) {
            function p(w) {
              q && q()
              m || K.Lf(a, b, w, d, f, r)
              g && g()
              eb()
            }
            var u = !1
            e.preloadPlugins.forEach(function (w) {
              !u &&
                w.canHandle(v) &&
                (w.handle(C, v, p, function () {
                  h && h()
                  eb()
                }),
                (u = !0))
            })
            u || p(C)
          }
          Mb.Ne()
          var v = b ? Eb(Cb(a, b)) : a
          db()
          'string' == typeof c
            ? Mb.Xg(
                c,
                function (C) {
                  t(C)
                },
                h
              )
            : t(c)
        },
        indexedDB: function () {
          return (
            window.indexedDB ||
            window.mozIndexedDB ||
            window.webkitIndexedDB ||
            window.msIndexedDB
          )
        },
        Ff: function () {
          return 'EM_FS_' + window.location.pathname
        },
        Gf: 20,
        Le: 'FILE_DATA',
        nh: function (a, b, c) {
          b = b || function () {}
          c = c || function () {}
          var d = K.indexedDB()
          try {
            var f = d.open(K.Ff(), K.Gf)
          } catch (g) {
            return c(g)
          }
          f.onupgradeneeded = function () {
            fa('creating db')
            f.result.createObjectStore(K.Le)
          }
          f.onsuccess = function () {
            var g = f.result.transaction([K.Le], 'readwrite'),
              h = g.objectStore(K.Le),
              m = 0,
              r = 0,
              q = a.length
            a.forEach(function (t) {
              t = h.put(K.mf(t).object.Ud, t)
              t.onsuccess = function () {
                m++
                m + r == q && (0 == r ? b() : c())
              }
              t.onerror = function () {
                r++
                m + r == q && (0 == r ? b() : c())
              }
            })
            g.onerror = c
          }
          f.onerror = c
        },
        ih: function (a, b, c) {
          b = b || function () {}
          c = c || function () {}
          var d = K.indexedDB()
          try {
            var f = d.open(K.Ff(), K.Gf)
          } catch (g) {
            return c(g)
          }
          f.onupgradeneeded = c
          f.onsuccess = function () {
            var g = f.result
            try {
              var h = g.transaction([K.Le], 'readonly')
            } catch (v) {
              c(v)
              return
            }
            var m = h.objectStore(K.Le),
              r = 0,
              q = 0,
              t = a.length
            a.forEach(function (v) {
              var C = m.get(v)
              C.onsuccess = function () {
                K.mf(v).exists && K.unlink(v)
                K.Lf(Ab(v), Bb(v), C.result, !0, !0, !0)
                r++
                r + q == t && (0 == q ? b() : c())
              }
              C.onerror = function () {
                q++
                r + q == t && (0 == q ? b() : c())
              }
            })
            h.onerror = c
          }
          f.onerror = c
        },
      },
      Nb = {}

    function Ob(a, b, c) {
      try {
        var d = a(b)
      } catch (f) {
        if (f && f.node && zb(b) !== zb(K.ue(f.node))) return -54
        throw f
      }
      E[c >> 2] = d.dev
      E[(c + 4) >> 2] = 0
      E[(c + 8) >> 2] = d.ino
      E[(c + 12) >> 2] = d.mode
      E[(c + 16) >> 2] = d.nlink
      E[(c + 20) >> 2] = d.uid
      E[(c + 24) >> 2] = d.gid
      E[(c + 28) >> 2] = d.rdev
      E[(c + 32) >> 2] = 0
      J = [
        d.size >>> 0,
        ((I = d.size),
        1 <= +Math.abs(I)
          ? 0 < I
            ? (Math.min(+Math.floor(I / 4294967296), 4294967295) | 0) >>> 0
            : ~~+Math.ceil((I - +(~~I >>> 0)) / 4294967296) >>> 0
          : 0),
      ]
      E[(c + 40) >> 2] = J[0]
      E[(c + 44) >> 2] = J[1]
      E[(c + 48) >> 2] = 4096
      E[(c + 52) >> 2] = d.blocks
      E[(c + 56) >> 2] = (d.atime.getTime() / 1e3) | 0
      E[(c + 60) >> 2] = 0
      E[(c + 64) >> 2] = (d.mtime.getTime() / 1e3) | 0
      E[(c + 68) >> 2] = 0
      E[(c + 72) >> 2] = (d.ctime.getTime() / 1e3) | 0
      E[(c + 76) >> 2] = 0
      J = [
        d.ino >>> 0,
        ((I = d.ino),
        1 <= +Math.abs(I)
          ? 0 < I
            ? (Math.min(+Math.floor(I / 4294967296), 4294967295) | 0) >>> 0
            : ~~+Math.ceil((I - +(~~I >>> 0)) / 4294967296) >>> 0
          : 0),
      ]
      E[(c + 80) >> 2] = J[0]
      E[(c + 84) >> 2] = J[1]
      return 0
    }
    var Pb = void 0

    function M() {
      Pb += 4
      return E[(Pb - 4) >> 2]
    }

    function Qb(a) {
      a = K.ne(a)
      if (!a) throw new K.Td(8)
      return a
    }
    var O = {
      ae: function () {
        e.websocket =
          e.websocket && 'object' === typeof e.websocket ? e.websocket : {}
        e.websocket.kf = {}
        e.websocket.on = function (a, b) {
          'function' === typeof b && (this.kf[a] = b)
          return this
        }
        e.websocket.emit = function (a, b) {
          'function' === typeof this.kf[a] && this.kf[a].call(this, b)
        }
        return K.createNode(null, '/', 16895, 0)
      },
      createSocket: function (a, b, c) {
        b &= -526337
        c && assert((1 == b) == (6 == c))
        a = {
          family: a,
          type: b,
          protocol: c,
          ce: null,
          error: null,
          Ue: {},
          pending: [],
          Ie: [],
          fe: O.ge,
        }
        b = O.cf()
        c = K.createNode(O.root, b, 49152, 0)
        c.Je = a
        b = K.Mf({
          path: b,
          node: c,
          flags: K.$f('r+'),
          seekable: !1,
          Wd: O.Wd,
        })
        a.stream = b
        return a
      },
      Ag: function (a) {
        return (a = K.ne(a)) && K.isSocket(a.node.mode) ? a.node.Je : null
      },
      Wd: {
        He: function (a) {
          a = a.node.Je
          return a.fe.He(a)
        },
        De: function (a, b, c) {
          a = a.node.Je
          return a.fe.De(a, b, c)
        },
        read: function (a, b, c, d) {
          a = a.node.Je
          d = a.fe.Cf(a, d)
          if (!d) return 0
          b.set(d.buffer, c)
          return d.buffer.length
        },
        write: function (a, b, c, d) {
          a = a.node.Je
          return a.fe.Ef(a, b, c, d)
        },
        close: function (a) {
          a = a.node.Je
          a.fe.close(a)
        },
      },
      cf: function () {
        O.cf.current || (O.cf.current = 0)
        return 'socket[' + O.cf.current++ + ']'
      },
      ge: {
        Xe: function (a, b, c) {
          if ('object' === typeof b) {
            var d = b
            c = b = null
          }
          if (d)
            if (d._socket)
              (b = d._socket.remoteAddress), (c = d._socket.remotePort)
            else {
              c = /ws[s]?:\/\/([^:]+):(\d+)/.exec(d.url)
              if (!c)
                throw Error(
                  'WebSocket URL must be in the format ws(s)://address:port'
                )
              b = c[1]
              c = parseInt(c[2], 10)
            }
          else
            try {
              var f = e.websocket && 'object' === typeof e.websocket,
                g = 'ws:#'.replace('#', '//')
              f && 'string' === typeof e.websocket.url && (g = e.websocket.url)
              if ('ws://' === g || 'wss://' === g) {
                var h = b.split('/')
                g = g + h[0] + ':' + c + '/' + h.slice(1).join('/')
              }
              h = 'binary'
              f &&
                'string' === typeof e.websocket.subprotocol &&
                (h = e.websocket.subprotocol)
              var m = void 0
              'null' !== h &&
                ((h = h.replace(/^ +| +$/g, '').split(/ *, */)),
                (m = qa
                  ? {
                      protocol: h.toString(),
                    }
                  : h))
              f && null === e.websocket.subprotocol && (m = void 0)
              d = new (qa ? require('ws') : WebSocket)(g, m)
              d.binaryType = 'arraybuffer'
            } catch (r) {
              throw new K.Td(23)
            }
          b = {
            $d: b,
            port: c,
            socket: d,
            Ye: [],
          }
          O.ge.If(a, b)
          O.ge.Bg(a, b)
          2 === a.type &&
            'undefined' !== typeof a.Be &&
            b.Ye.push(
              new Uint8Array([
                255,
                255,
                255,
                255,
                112,
                111,
                114,
                116,
                (a.Be & 65280) >> 8,
                a.Be & 255,
              ])
            )
          return b
        },
        Ze: function (a, b, c) {
          return a.Ue[b + ':' + c]
        },
        If: function (a, b) {
          a.Ue[b.$d + ':' + b.port] = b
        },
        cg: function (a, b) {
          delete a.Ue[b.$d + ':' + b.port]
        },
        Bg: function (a, b) {
          function c() {
            e.websocket.emit('open', a.stream.fd)
            try {
              for (var g = b.Ye.shift(); g; )
                b.socket.send(g), (g = b.Ye.shift())
            } catch (h) {
              b.socket.close()
            }
          }

          function d(g) {
            if ('string' === typeof g) g = new TextEncoder().encode(g)
            else {
              assert(void 0 !== g.byteLength)
              if (0 == g.byteLength) return
              g = new Uint8Array(g)
            }
            var h = f
            f = !1
            h &&
            10 === g.length &&
            255 === g[0] &&
            255 === g[1] &&
            255 === g[2] &&
            255 === g[3] &&
            112 === g[4] &&
            111 === g[5] &&
            114 === g[6] &&
            116 === g[7]
              ? ((g = (g[8] << 8) | g[9]),
                O.ge.cg(a, b),
                (b.port = g),
                O.ge.If(a, b))
              : (a.Ie.push({
                  $d: b.$d,
                  port: b.port,
                  data: g,
                }),
                e.websocket.emit('message', a.stream.fd))
          }
          var f = !0
          qa
            ? (b.socket.on('open', c),
              b.socket.on('message', function (g, h) {
                h.Yg && d(new Uint8Array(g).buffer)
              }),
              b.socket.on('close', function () {
                e.websocket.emit('close', a.stream.fd)
              }),
              b.socket.on('error', function () {
                a.error = 14
                e.websocket.emit('error', [
                  a.stream.fd,
                  a.error,
                  'ECONNREFUSED: Connection refused',
                ])
              }))
            : ((b.socket.onopen = c),
              (b.socket.onclose = function () {
                e.websocket.emit('close', a.stream.fd)
              }),
              (b.socket.onmessage = function (g) {
                d(g.data)
              }),
              (b.socket.onerror = function () {
                a.error = 14
                e.websocket.emit('error', [
                  a.stream.fd,
                  a.error,
                  'ECONNREFUSED: Connection refused',
                ])
              }))
        },
        He: function (a) {
          if (1 === a.type && a.ce) return a.pending.length ? 65 : 0
          var b = 0,
            c = 1 === a.type ? O.ge.Ze(a, a.ie, a.ke) : null
          if (
            a.Ie.length ||
            !c ||
            (c && c.socket.readyState === c.socket.CLOSING) ||
            (c && c.socket.readyState === c.socket.CLOSED)
          )
            b |= 65
          if (!c || (c && c.socket.readyState === c.socket.OPEN)) b |= 4
          if (
            (c && c.socket.readyState === c.socket.CLOSING) ||
            (c && c.socket.readyState === c.socket.CLOSED)
          )
            b |= 16
          return b
        },
        De: function (a, b, c) {
          switch (b) {
            case 21531:
              return (
                (b = 0),
                a.Ie.length && (b = a.Ie[0].data.length),
                (E[c >> 2] = b),
                0
              )
            default:
              return 28
          }
        },
        close: function (a) {
          if (a.ce) {
            try {
              a.ce.close()
            } catch (f) {}
            a.ce = null
          }
          for (var b = Object.keys(a.Ue), c = 0; c < b.length; c++) {
            var d = a.Ue[b[c]]
            try {
              d.socket.close()
            } catch (f) {}
            O.ge.cg(a, d)
          }
          return 0
        },
        bind: function (a, b, c) {
          if ('undefined' !== typeof a.df || 'undefined' !== typeof a.Be)
            throw new K.Td(28)
          a.df = b
          a.Be = c
          if (2 === a.type) {
            a.ce && (a.ce.close(), (a.ce = null))
            try {
              a.fe.listen(a, 0)
            } catch (d) {
              if (!(d instanceof K.Td)) throw d
              if (138 !== d.Xd) throw d
            }
          }
        },
        connect: function (a, b, c) {
          if (a.ce) throw new K.Td(138)
          if ('undefined' !== typeof a.ie && 'undefined' !== typeof a.ke) {
            var d = O.ge.Ze(a, a.ie, a.ke)
            if (d) {
              if (d.socket.readyState === d.socket.CONNECTING) throw new K.Td(7)
              throw new K.Td(30)
            }
          }
          b = O.ge.Xe(a, b, c)
          a.ie = b.$d
          a.ke = b.port
          throw new K.Td(26)
        },
        listen: function (a) {
          if (!qa) throw new K.Td(138)
          if (a.ce) throw new K.Td(28)
          var b = require('ws').Server
          a.ce = new b({
            host: a.df,
            port: a.Be,
          })
          e.websocket.emit('listen', a.stream.fd)
          a.ce.on('connection', function (c) {
            if (1 === a.type) {
              var d = O.createSocket(a.family, a.type, a.protocol)
              c = O.ge.Xe(d, c)
              d.ie = c.$d
              d.ke = c.port
              a.pending.push(d)
              e.websocket.emit('connection', d.stream.fd)
            } else O.ge.Xe(a, c), e.websocket.emit('connection', a.stream.fd)
          })
          a.ce.on('closed', function () {
            e.websocket.emit('close', a.stream.fd)
            a.ce = null
          })
          a.ce.on('error', function () {
            a.error = 23
            e.websocket.emit('error', [
              a.stream.fd,
              a.error,
              'EHOSTUNREACH: Host is unreachable',
            ])
          })
        },
        accept: function (a) {
          if (!a.ce) throw new K.Td(28)
          var b = a.pending.shift()
          b.stream.flags = a.stream.flags
          return b
        },
        gh: function (a, b) {
          if (b) {
            if (void 0 === a.ie || void 0 === a.ke) throw new K.Td(53)
            b = a.ie
            a = a.ke
          } else (b = a.df || 0), (a = a.Be || 0)
          return {
            $d: b,
            port: a,
          }
        },
        Ef: function (a, b, c, d, f, g) {
          if (2 === a.type) {
            if (void 0 === f || void 0 === g) (f = a.ie), (g = a.ke)
            if (void 0 === f || void 0 === g) throw new K.Td(17)
          } else (f = a.ie), (g = a.ke)
          var h = O.ge.Ze(a, f, g)
          if (1 === a.type) {
            if (
              !h ||
              h.socket.readyState === h.socket.CLOSING ||
              h.socket.readyState === h.socket.CLOSED
            )
              throw new K.Td(53)
            if (h.socket.readyState === h.socket.CONNECTING) throw new K.Td(6)
          }
          ArrayBuffer.isView(b) && ((c += b.byteOffset), (b = b.buffer))
          b = b.slice(c, c + d)
          if (2 === a.type && (!h || h.socket.readyState !== h.socket.OPEN))
            return (
              (h &&
                h.socket.readyState !== h.socket.CLOSING &&
                h.socket.readyState !== h.socket.CLOSED) ||
                (h = O.ge.Xe(a, f, g)),
              h.Ye.push(b),
              d
            )
          try {
            return h.socket.send(b), d
          } catch (m) {
            throw new K.Td(28)
          }
        },
        Cf: function (a, b) {
          if (1 === a.type && a.ce) throw new K.Td(53)
          var c = a.Ie.shift()
          if (!c) {
            if (1 === a.type) {
              if ((a = O.ge.Ze(a, a.ie, a.ke))) {
                if (
                  a.socket.readyState === a.socket.CLOSING ||
                  a.socket.readyState === a.socket.CLOSED
                )
                  return null
                throw new K.Td(6)
              }
              throw new K.Td(53)
            }
            throw new K.Td(6)
          }
          var d = c.data.byteLength || c.data.length,
            f = c.data.byteOffset || 0,
            g = c.data.buffer || c.data
          b = Math.min(b, d)
          var h = {
            buffer: new Uint8Array(g, f, b),
            $d: c.$d,
            port: c.port,
          }
          1 === a.type &&
            b < d &&
            ((c.data = new Uint8Array(g, f + b, d - b)), a.Ie.unshift(c))
          return h
        },
      },
    }

    function Rb(a) {
      a = a.split('.')
      for (var b = 0; 4 > b; b++) {
        var c = Number(a[b])
        if (isNaN(c)) return null
        a[b] = c
      }
      return (a[0] | (a[1] << 8) | (a[2] << 16) | (a[3] << 24)) >>> 0
    }

    function Sb(a) {
      var b,
        c,
        d = []
      if (
        !/^((?=.*::)(?!.*::.+::)(::)?([\dA-F]{1,4}:(:|\b)|){5}|([\dA-F]{1,4}:){6})((([\dA-F]{1,4}((?!\3)::|:\b|$))|(?!\2\3)){2}|(((2[0-4]|1\d|[1-9])?\d|25[0-5])\.?\b){4})$/i.test(
          a
        )
      )
        return null
      if ('::' === a) return [0, 0, 0, 0, 0, 0, 0, 0]
      a = 0 === a.indexOf('::') ? a.replace('::', 'Z:') : a.replace('::', ':Z:')
      0 < a.indexOf('.')
        ? ((a = a.replace(/[.]/g, ':')),
          (a = a.split(':')),
          (a[a.length - 4] =
            parseInt(a[a.length - 4]) + 256 * parseInt(a[a.length - 3])),
          (a[a.length - 3] =
            parseInt(a[a.length - 2]) + 256 * parseInt(a[a.length - 1])),
          (a = a.slice(0, a.length - 2)))
        : (a = a.split(':'))
      for (b = c = 0; b < a.length; b++)
        if ('string' === typeof a[b])
          if ('Z' === a[b]) {
            for (c = 0; c < 8 - a.length + 1; c++) d[b + c] = 0
            --c
          } else d[b + c] = Wb(parseInt(a[b], 16))
        else d[b + c] = a[b]
      return [
        (d[1] << 16) | d[0],
        (d[3] << 16) | d[2],
        (d[5] << 16) | d[4],
        (d[7] << 16) | d[6],
      ]
    }
    var Xb = 1,
      Yb = {},
      Zb = {}

    function $b(a) {
      var b = Rb(a)
      if (null !== b) return a
      b = Sb(a)
      if (null !== b) return a
      Yb[a]
        ? (b = Yb[a])
        : ((b = Xb++),
          assert(65535 > b, 'exceeded max address mappings of 65535'),
          (b = '172.29.' + (b & 255) + '.' + (b & 65280)),
          (Zb[b] = a),
          (Yb[a] = b))
      return b
    }

    function ac(a) {
      return Zb[a] ? Zb[a] : null
    }

    function bc(a) {
      return (
        (a & 255) +
        '.' +
        ((a >> 8) & 255) +
        '.' +
        ((a >> 16) & 255) +
        '.' +
        ((a >> 24) & 255)
      )
    }

    function cc(a) {
      var b = '',
        c,
        d = 0,
        f = 0,
        g = 0,
        h = 0
      a = [
        a[0] & 65535,
        a[0] >> 16,
        a[1] & 65535,
        a[1] >> 16,
        a[2] & 65535,
        a[2] >> 16,
        a[3] & 65535,
        a[3] >> 16,
      ]
      var m = !0
      for (c = 0; 5 > c; c++)
        if (0 !== a[c]) {
          m = !1
          break
        }
      if (m) {
        c = bc(a[6] | (a[7] << 16))
        if (-1 === a[5]) return '::ffff:' + c
        if (0 === a[5])
          return (
            '0.0.0.0' === c && (c = ''), '0.0.0.1' === c && (c = '1'), '::' + c
          )
      }
      for (c = 0; 8 > c; c++)
        0 === a[c] && (1 < c - f && (h = 0), (f = c), h++),
          h > d && ((d = h), (g = c - d + 1))
      for (c = 0; 8 > c; c++)
        1 < d && 0 === a[c] && c >= g && c < g + d
          ? c === g && ((b += ':'), 0 === g && (b += ':'))
          : ((b += Number(dc(a[c] & 65535)).toString(16)),
            (b += 7 > c ? ':' : ''))
      return b
    }

    function ec(a, b) {
      var c = Oa[a >> 1],
        d = dc(Pa[(a + 2) >> 1])
      switch (c) {
        case 2:
          if (16 !== b)
            return {
              Xd: 28,
            }
          a = E[(a + 4) >> 2]
          a = bc(a)
          break
        case 10:
          if (28 !== b)
            return {
              Xd: 28,
            }
          a = [
            E[(a + 8) >> 2],
            E[(a + 12) >> 2],
            E[(a + 16) >> 2],
            E[(a + 20) >> 2],
          ]
          a = cc(a)
          break
        default:
          return {
            Xd: 5,
          }
      }
      return {
        family: c,
        $d: a,
        port: d,
      }
    }

    function fc(a, b, c, d) {
      switch (b) {
        case 2:
          c = Rb(c)
          Oa[a >> 1] = b
          E[(a + 4) >> 2] = c
          Oa[(a + 2) >> 1] = Wb(d)
          break
        case 10:
          c = Sb(c)
          E[a >> 2] = b
          E[(a + 8) >> 2] = c[0]
          E[(a + 12) >> 2] = c[1]
          E[(a + 16) >> 2] = c[2]
          E[(a + 20) >> 2] = c[3]
          Oa[(a + 2) >> 1] = Wb(d)
          E[(a + 4) >> 2] = 0
          E[(a + 24) >> 2] = 0
          break
        default:
          return {
            Xd: 5,
          }
      }
      return {}
    }

    function hc() {
      void 0 === hc.start && (hc.start = Date.now())
      return (1e3 * (Date.now() - hc.start)) | 0
    }
    var ic = 1,
      jc = [],
      P = [],
      kc = [],
      lc = [],
      mc = [],
      R = [],
      T = [],
      nc = [],
      oc = [],
      pc = {},
      qc = {},
      rc = 4

    function U(a) {
      sc || (sc = a)
    }

    function tc(a) {
      for (var b = ic++, c = a.length; c < b; c++) a[c] = null
      return b
    }
    var sc,
      uc = []

    function vc(a, b, c, d) {
      for (var f = 0; f < a; f++) {
        var g = W[c](),
          h = g && tc(d)
        g ? ((g.name = h), (d[h] = g)) : U(1282)
        E[(b + 4 * f) >> 2] = h
      }
    }

    function wc(a, b, c, d, f, g, h, m) {
      b = P[b]
      if ((a = W[a](b, c)))
        (d = m && Da(a.name, m, d)),
          f && (E[f >> 2] = d),
          g && (E[g >> 2] = a.size),
          h && (E[h >> 2] = a.type)
    }

    function xc(a, b) {
      Qa[a >> 2] = b
      Qa[(a + 4) >> 2] = (b - Qa[a >> 2]) / 4294967296
    }

    function yc(a, b, c) {
      if (b) {
        var d = void 0
        switch (a) {
          case 36346:
            d = 1
            break
          case 36344:
            0 != c && 1 != c && U(1280)
            return
          case 36345:
            d = 0
            break
          case 34466:
            var f = W.getParameter(34467)
            d = f ? f.length : 0
        }
        if (void 0 === d)
          switch (((f = W.getParameter(a)), typeof f)) {
            case 'number':
              d = f
              break
            case 'boolean':
              d = f ? 1 : 0
              break
            case 'string':
              U(1280)
              return
            case 'object':
              if (null === f)
                switch (a) {
                  case 34964:
                  case 35725:
                  case 34965:
                  case 36006:
                  case 36007:
                  case 32873:
                  case 34229:
                  case 34068:
                    d = 0
                    break
                  default:
                    U(1280)
                    return
                }
              else {
                if (
                  f instanceof Float32Array ||
                  f instanceof Uint32Array ||
                  f instanceof Int32Array ||
                  f instanceof Array
                ) {
                  for (a = 0; a < f.length; ++a)
                    switch (c) {
                      case 0:
                        E[(b + 4 * a) >> 2] = f[a]
                        break
                      case 2:
                        G[(b + 4 * a) >> 2] = f[a]
                        break
                      case 4:
                        x[(b + a) >> 0] = f[a] ? 1 : 0
                    }
                  return
                }
                try {
                  d = f.name | 0
                } catch (g) {
                  U(1280)
                  k(
                    'GL_INVALID_ENUM in glGet' +
                      c +
                      'v: Unknown object returned from WebGL getParameter(' +
                      a +
                      ')! (error: ' +
                      g +
                      ')'
                  )
                  return
                }
              }
              break
            default:
              U(1280)
              k(
                'GL_INVALID_ENUM in glGet' +
                  c +
                  'v: Native code calling glGet' +
                  c +
                  'v(' +
                  a +
                  ') and it returns ' +
                  f +
                  ' of type ' +
                  typeof f +
                  '!'
              )
              return
          }
        switch (c) {
          case 1:
            xc(b, d)
            break
          case 0:
            E[b >> 2] = d
            break
          case 2:
            G[b >> 2] = d
            break
          case 4:
            x[b >> 0] = d ? 1 : 0
        }
      } else U(1281)
    }

    function zc(a) {
      var b = Ha(a) + 1,
        c = Ka(b)
      Da(a, c, b)
      return c
    }

    function Ac(a, b, c, d) {
      if (c)
        if (
          ((a = W.getUniform(P[a], R[b])),
          'number' == typeof a || 'boolean' == typeof a)
        )
          switch (d) {
            case 0:
              E[c >> 2] = a
              break
            case 2:
              G[c >> 2] = a
          }
        else
          for (b = 0; b < a.length; b++)
            switch (d) {
              case 0:
                E[(c + 4 * b) >> 2] = a[b]
                break
              case 2:
                G[(c + 4 * b) >> 2] = a[b]
            }
      else U(1281)
    }

    function Bc(a, b, c, d) {
      if (c)
        if (((a = W.getVertexAttrib(a, b)), 34975 == b)) E[c >> 2] = a && a.name
        else if ('number' == typeof a || 'boolean' == typeof a)
          switch (d) {
            case 0:
              E[c >> 2] = a
              break
            case 2:
              G[c >> 2] = a
              break
            case 5:
              E[c >> 2] = Math.fround(a)
          }
        else
          for (b = 0; b < a.length; b++)
            switch (d) {
              case 0:
                E[(c + 4 * b) >> 2] = a[b]
                break
              case 2:
                G[(c + 4 * b) >> 2] = a[b]
                break
              case 5:
                E[(c + 4 * b) >> 2] = Math.fround(a[b])
            }
      else U(1281)
    }

    function Cc(a, b, c, d, f) {
      a -= 5120
      a = 1 == a ? B : 4 == a ? E : 6 == a ? G : 5 == a || 28922 == a ? Qa : Pa
      var g = 31 - Math.clz32(a.BYTES_PER_ELEMENT),
        h = rc
      return a.subarray(
        f >> g,
        (f +
          d *
            ((c *
              ({
                5: 3,
                6: 4,
                8: 2,
                29502: 3,
                29504: 4,
              }[b - 6402] || 1) *
              (1 << g) +
              h -
              1) &
              -h)) >>
          g
      )
    }
    var Dc = [],
      Ec = [],
      Fc = {}

    function Gc() {
      if (!Hc) {
        var a = {
            USER: 'web_user',
            LOGNAME: 'web_user',
            PATH: '/',
            PWD: '/',
            HOME: '/home/web_user',
            LANG:
              (
                ('object' === typeof navigator &&
                  navigator.languages &&
                  navigator.languages[0]) ||
                'C'
              ).replace('-', '_') + '.UTF-8',
            _: la || './this.program',
          },
          b
        for (b in Fc) a[b] = Fc[b]
        var c = []
        for (b in a) c.push(b + '=' + a[b])
        Hc = c
      }
      return Hc
    }
    var Hc,
      X = {}

    function Ic(a) {
      Ic.buffer ||
        ((Ic.buffer = Ka(256)),
        (X['0'] = 'Success'),
        (X['-1'] = "Invalid value for 'ai_flags' field"),
        (X['-2'] = 'NAME or SERVICE is unknown'),
        (X['-3'] = 'Temporary failure in name resolution'),
        (X['-4'] = 'Non-recoverable failure in name res'),
        (X['-6'] = "'ai_family' not supported"),
        (X['-7'] = "'ai_socktype' not supported"),
        (X['-8'] = "SERVICE not supported for 'ai_socktype'"),
        (X['-10'] = 'Memory allocation failure'),
        (X['-11'] = "System error returned in 'errno'"),
        (X['-12'] = 'Argument buffer overflow'))
      var b = 'Unknown error'
      a in X && (255 < X[a].length ? (b = 'Message too long') : (b = X[a]))
      Ma(b, Ic.buffer)
      return Ic.buffer
    }

    function Jc(a) {
      for (var b = nb(); nb() - b < a / 1e3; );
    }

    function Kc(a) {
      return 0 === a % 4 && (0 !== a % 100 || 0 === a % 400)
    }

    function Lc(a, b) {
      for (var c = 0, d = 0; d <= b; c += a[d++]);
      return c
    }
    var Mc = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
      Nc = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

    function Qc(a, b) {
      for (a = new Date(a.getTime()); 0 < b; ) {
        var c = a.getMonth(),
          d = (Kc(a.getFullYear()) ? Mc : Nc)[c]
        if (b > d - a.getDate())
          (b -= d - a.getDate() + 1),
            a.setDate(1),
            11 > c
              ? a.setMonth(c + 1)
              : (a.setMonth(0), a.setFullYear(a.getFullYear() + 1))
        else {
          a.setDate(a.getDate() + b)
          break
        }
      }
      return a
    }

    function Rc(a, b, c, d) {
      a || (a = this)
      this.parent = a
      this.ae = a.ae
      this.Se = null
      this.id = K.Ig++
      this.name = b
      this.mode = c
      this.Vd = {}
      this.Wd = {}
      this.rdev = d
    }
    Object.defineProperties(Rc.prototype, {
      read: {
        get: function () {
          return 365 === (this.mode & 365)
        },
        set: function (a) {
          a ? (this.mode |= 365) : (this.mode &= -366)
        },
      },
      write: {
        get: function () {
          return 146 === (this.mode & 146)
        },
        set: function (a) {
          a ? (this.mode |= 146) : (this.mode &= -147)
        },
      },
      Dg: {
        get: function () {
          return K.be(this.mode)
        },
      },
      uf: {
        get: function () {
          return K.Oe(this.mode)
        },
      },
    })
    K.gg = Rc
    K.Rg()
    for (var Mb, W, Y = 0; 32 > Y; ++Y) uc.push(Array(Y))
    var Sc = new Float32Array(288)
    for (Y = 0; 288 > Y; ++Y) Dc[Y] = Sc.subarray(0, Y + 1)
    var Tc = new Int32Array(288)
    for (Y = 0; 288 > Y; ++Y) Ec[Y] = Tc.subarray(0, Y + 1)

    function Jb(a, b) {
      var c = Array(Ha(a) + 1)
      a = Ga(a, c, 0, c.length)
      b && (c.length = a)
      return c
    }
    Wa.push({
      Tf: function () {
        Uc()
      },
    })
    var qd = {
      c: function (a, b, c, d) {
        n(
          'Assertion failed: ' +
            z(a) +
            ', at: ' +
            [b ? z(b) : 'unknown filename', c, d ? z(d) : 'unknown function']
        )
      },
      La: function (a, b) {
        return qb(a, b)
      },
      M: function (a, b) {
        Ya.unshift({
          Tf: a,
          We: b,
        })
      },
      sa: function (a, b) {
        return rb(a, b)
      },
      ra: function (a, b) {
        return xb(a, b)
      },
      Ka: function (a, b, c, d) {
        try {
          for (
            var f = 0,
              g = b ? E[b >> 2] : 0,
              h = b ? E[(b + 4) >> 2] : 0,
              m = c ? E[c >> 2] : 0,
              r = c ? E[(c + 4) >> 2] : 0,
              q = d ? E[d >> 2] : 0,
              t = d ? E[(d + 4) >> 2] : 0,
              v = 0,
              C = 0,
              p = 0,
              u = 0,
              w = 0,
              D = 0,
              N =
                (b ? E[b >> 2] : 0) | (c ? E[c >> 2] : 0) | (d ? E[d >> 2] : 0),
              Va =
                (b ? E[(b + 4) >> 2] : 0) |
                (c ? E[(c + 4) >> 2] : 0) |
                (d ? E[(d + 4) >> 2] : 0),
              F = 0;
            F < a;
            F++
          ) {
            var S = 1 << F % 32
            if (32 > F ? N & S : Va & S) {
              var aa = K.ne(F)
              if (!aa) throw new K.Td(8)
              var ha = 5
              aa.Wd.He && (ha = aa.Wd.He(aa))
              ha & 1 &&
                (32 > F ? g & S : h & S) &&
                (32 > F ? (v |= S) : (C |= S), f++)
              ha & 4 &&
                (32 > F ? m & S : r & S) &&
                (32 > F ? (p |= S) : (u |= S), f++)
              ha & 2 &&
                (32 > F ? q & S : t & S) &&
                (32 > F ? (w |= S) : (D |= S), f++)
            }
          }
          b && ((E[b >> 2] = v), (E[(b + 4) >> 2] = C))
          c && ((E[c >> 2] = p), (E[(c + 4) >> 2] = u))
          d && ((E[d >> 2] = w), (E[(d + 4) >> 2] = D))
          return f
        } catch (oa) {
          return (
            ('undefined' !== typeof K && oa instanceof K.Td) || n(oa), -oa.Xd
          )
        }
      },
      Ba: function (a, b) {
        try {
          a = z(a)
          if (b & -8) var c = -28
          else {
            var d
            ;(d = K.Yd(a, {
              le: !0,
            }).node)
              ? ((a = ''),
                b & 4 && (a += 'r'),
                b & 2 && (a += 'w'),
                b & 1 && (a += 'x'),
                (c = a && K.ve(d, a) ? -2 : 0))
              : (c = -44)
          }
          return c
        } catch (f) {
          return ('undefined' !== typeof K && f instanceof K.Td) || n(f), -f.Xd
        }
      },
      o: function (a, b, c) {
        Pb = c
        try {
          var d = Qb(a)
          switch (b) {
            case 0:
              var f = M()
              return 0 > f ? -28 : K.open(d.path, d.flags, 0, f).fd
            case 1:
            case 2:
              return 0
            case 3:
              return d.flags
            case 4:
              return (f = M()), (d.flags |= f), 0
            case 12:
              return (f = M()), (Oa[(f + 0) >> 1] = 2), 0
            case 13:
            case 14:
              return 0
            case 16:
            case 8:
              return -28
            case 9:
              return ob(28), -1
            default:
              return -28
          }
        } catch (g) {
          return ('undefined' !== typeof K && g instanceof K.Td) || n(g), -g.Xd
        }
      },
      Ma: function (a, b) {
        try {
          var c = Qb(a)
          return Ob(K.stat, c.path, b)
        } catch (d) {
          return ('undefined' !== typeof K && d instanceof K.Td) || n(d), -d.Xd
        }
      },
      Ia: function (a, b, c) {
        try {
          var d = Qb(a)
          d.we || (d.we = K.readdir(d.path))
          a = 0
          for (
            var f = K.je(d, 0, 1), g = Math.floor(f / 280);
            g < d.we.length && a + 280 <= c;

          ) {
            var h = d.we[g]
            if ('.' === h[0]) {
              var m = 1
              var r = 4
            } else {
              var q = K.pe(d.node, h)
              m = q.id
              r = K.Oe(q.mode) ? 2 : K.be(q.mode) ? 4 : K.xe(q.mode) ? 10 : 8
            }
            J = [
              m >>> 0,
              ((I = m),
              1 <= +Math.abs(I)
                ? 0 < I
                  ? (Math.min(+Math.floor(I / 4294967296), 4294967295) | 0) >>>
                    0
                  : ~~+Math.ceil((I - +(~~I >>> 0)) / 4294967296) >>> 0
                : 0),
            ]
            E[(b + a) >> 2] = J[0]
            E[(b + a + 4) >> 2] = J[1]
            J = [
              (280 * (g + 1)) >>> 0,
              ((I = 280 * (g + 1)),
              1 <= +Math.abs(I)
                ? 0 < I
                  ? (Math.min(+Math.floor(I / 4294967296), 4294967295) | 0) >>>
                    0
                  : ~~+Math.ceil((I - +(~~I >>> 0)) / 4294967296) >>> 0
                : 0),
            ]
            E[(b + a + 8) >> 2] = J[0]
            E[(b + a + 12) >> 2] = J[1]
            Oa[(b + a + 16) >> 1] = 280
            x[(b + a + 18) >> 0] = r
            Da(h, b + a + 19, 256)
            a += 280
            g += 1
          }
          K.je(d, 280 * g, 0)
          return a
        } catch (t) {
          return ('undefined' !== typeof K && t instanceof K.Td) || n(t), -t.Xd
        }
      },
      Ea: function (a, b) {
        try {
          return (
            Vc(b, 0, 136),
            (E[b >> 2] = 1),
            (E[(b + 4) >> 2] = 2),
            (E[(b + 8) >> 2] = 3),
            (E[(b + 12) >> 2] = 4),
            0
          )
        } catch (c) {
          return ('undefined' !== typeof K && c instanceof K.Td) || n(c), -c.Xd
        }
      },
      G: function (a, b, c) {
        Pb = c
        try {
          var d = Qb(a)
          switch (b) {
            case 21509:
            case 21505:
              return d.tty ? 0 : -59
            case 21510:
            case 21511:
            case 21512:
            case 21506:
            case 21507:
            case 21508:
              return d.tty ? 0 : -59
            case 21519:
              if (!d.tty) return -59
              var f = M()
              return (E[f >> 2] = 0)
            case 21520:
              return d.tty ? -28 : -59
            case 21531:
              return (f = M()), K.De(d, b, f)
            case 21523:
              return d.tty ? 0 : -59
            case 21524:
              return d.tty ? 0 : -59
            default:
              n('bad ioctl syscall ' + b)
          }
        } catch (g) {
          return ('undefined' !== typeof K && g instanceof K.Td) || n(g), -g.Xd
        }
      },
      Na: function (a, b) {
        try {
          return (a = z(a)), Ob(K.lstat, a, b)
        } catch (c) {
          return ('undefined' !== typeof K && c instanceof K.Td) || n(c), -c.Xd
        }
      },
      Oa: function (a, b) {
        try {
          return (
            (a = z(a)),
            (a = zb(a)),
            '/' === a[a.length - 1] && (a = a.substr(0, a.length - 1)),
            K.mkdir(a, b, 0),
            0
          )
        } catch (c) {
          return ('undefined' !== typeof K && c instanceof K.Td) || n(c), -c.Xd
        }
      },
      va: function (a, b, c, d, f, g) {
        try {
          a: {
            g <<= 12
            var h = !1
            if (0 !== (d & 16) && 0 !== a % 16384) var m = -28
            else {
              if (0 !== (d & 32)) {
                var r = Wc(16384, b)
                if (!r) {
                  m = -48
                  break a
                }
                Vc(r, 0, b)
                h = !0
              } else {
                var q = K.ne(f)
                if (!q) {
                  m = -8
                  break a
                }
                var t = K.Ee(q, a, b, g, c, d)
                r = t.Og
                h = t.lf
              }
              Nb[r] = {
                Fg: r,
                Eg: b,
                lf: h,
                fd: f,
                Ng: c,
                flags: d,
                offset: g,
              }
              m = r
            }
          }
          return m
        } catch (v) {
          return ('undefined' !== typeof K && v instanceof K.Td) || n(v), -v.Xd
        }
      },
      xa: function () {
        return 0
      },
      wa: function (a, b) {
        try {
          if (-1 === (a | 0) || 0 === b) var c = -28
          else {
            var d = Nb[a]
            if (d && b === d.Eg) {
              var f = K.ne(d.fd)
              if (d.Ng & 2) {
                var g = d.flags,
                  h = d.offset,
                  m = B.slice(a, a + b)
                K.Fe(f, m, h, b, g)
              }
              Nb[a] = null
              d.lf && Xc(d.Fg)
            }
            c = 0
          }
          return c
        } catch (r) {
          return ('undefined' !== typeof K && r instanceof K.Td) || n(r), -r.Xd
        }
      },
      Aa: function () {
        return -63
      },
      I: function (a, b, c) {
        Pb = c
        try {
          var d = z(a),
            f = M()
          return K.open(d, b, f).fd
        } catch (g) {
          return ('undefined' !== typeof K && g instanceof K.Td) || n(g), -g.Xd
        }
      },
      Ja: function (a, b) {
        try {
          for (var c = 0, d = 0; d < b; d++) {
            var f = a + 8 * d,
              g = Oa[(f + 4) >> 1],
              h = 32,
              m = K.ne(E[f >> 2])
            m && ((h = 5), m.Wd.He && (h = m.Wd.He(m)))
            ;(h &= g | 24) && c++
            Oa[(f + 6) >> 1] = h
          }
          return c
        } catch (r) {
          return ('undefined' !== typeof K && r instanceof K.Td) || n(r), -r.Xd
        }
      },
      Ga: function (a, b, c, d) {
        try {
          return (
            d &&
              ((E[d >> 2] = -1),
              (E[(d + 4) >> 2] = -1),
              (E[(d + 8) >> 2] = -1),
              (E[(d + 12) >> 2] = -1)),
            0
          )
        } catch (f) {
          return ('undefined' !== typeof K && f instanceof K.Td) || n(f), -f.Xd
        }
      },
      za: function (a, b, c) {
        try {
          var d = Qb(a)
          return K.read(d, x, b, c)
        } catch (f) {
          return ('undefined' !== typeof K && f instanceof K.Td) || n(f), -f.Xd
        }
      },
      ta: function (a, b) {
        try {
          return (a = z(a)), (b = z(b)), K.rename(a, b), 0
        } catch (c) {
          return ('undefined' !== typeof K && c instanceof K.Td) || n(c), -c.Xd
        }
      },
      Da: function (a) {
        try {
          return (a = z(a)), K.rmdir(a), 0
        } catch (b) {
          return ('undefined' !== typeof K && b instanceof K.Td) || n(b), -b.Xd
        }
      },
      Fa: function () {
        return 0
      },
      n: function (a, b) {
        try {
          Pb = b
          b = function () {
            var V = O.Ag(M())
            if (!V) throw new K.Td(8)
            return V
          }
          var c = function (V) {
            var Oc = M(),
              ed = M()
            if (V && 0 === Oc) return null
            V = ec(Oc, ed)
            if (V.Xd) throw new K.Td(V.Xd)
            V.$d = ac(V.$d) || V.$d
            return V
          }
          switch (a) {
            case 1:
              var d = M(),
                f = M(),
                g = M(),
                h = O.createSocket(d, f, g)
              return h.stream.fd
            case 2:
              h = b()
              var m = c()
              h.fe.bind(h, m.$d, m.port)
              return 0
            case 3:
              return (h = b()), (m = c()), h.fe.connect(h, m.$d, m.port), 0
            case 4:
              h = b()
              var r = M()
              h.fe.listen(h, r)
              return 0
            case 5:
              h = b()
              var q = M()
              M()
              var t = h.fe.accept(h)
              q && fc(q, t.family, $b(t.ie), t.ke)
              return t.stream.fd
            case 6:
              return (
                (h = b()),
                (q = M()),
                M(),
                fc(q, h.family, $b(h.df || '0.0.0.0'), h.Be),
                0
              )
            case 7:
              h = b()
              q = M()
              M()
              if (!h.ie) return -53
              fc(q, h.family, $b(h.ie), h.ke)
              return 0
            case 11:
              h = b()
              var v = M(),
                C = M()
              M()
              var p = c(!0)
              return p
                ? h.fe.Ef(h, x, v, C, p.$d, p.port)
                : K.write(h.stream, x, v, C)
            case 12:
              h = b()
              var u = M(),
                w = M()
              M()
              q = M()
              M()
              var D = h.fe.Cf(h, w)
              if (!D) return 0
              q && fc(q, h.family, $b(D.$d), D.port)
              B.set(D.buffer, u)
              return D.buffer.byteLength
            case 14:
              return -50
            case 15:
              h = b()
              var N = M(),
                Va = M(),
                F = M(),
                S = M()
              return 1 === N && 4 === Va
                ? ((E[F >> 2] = h.error), (E[S >> 2] = 4), (h.error = null), 0)
                : -50
            case 16:
              h = b()
              v = M()
              M()
              var aa = E[(v + 8) >> 2],
                ha = E[(v + 12) >> 2],
                oa = E[v >> 2],
                fd = E[(v + 4) >> 2]
              if (oa) {
                m = ec(oa, fd)
                if (m.Xd) return -m.Xd
                var gd = m.port
                q = ac(m.$d) || m.$d
              }
              for (var Ia = 0, Q = 0; Q < ha; Q++)
                Ia += E[(aa + (8 * Q + 4)) >> 2]
              var Pc = new Uint8Array(Ia)
              for (Q = C = 0; Q < ha; Q++) {
                var Tb = E[(aa + 8 * Q) >> 2],
                  Ub = E[(aa + (8 * Q + 4)) >> 2]
                for (u = 0; u < Ub; u++) Pc[C++] = x[(Tb + u) >> 0]
              }
              return h.fe.Ef(h, Pc, 0, Ia, q, gd)
            case 17:
              h = b()
              v = M()
              M()
              aa = E[(v + 8) >> 2]
              ha = E[(v + 12) >> 2]
              for (Q = Ia = 0; Q < ha; Q++) Ia += E[(aa + (8 * Q + 4)) >> 2]
              D = h.fe.Cf(h, Ia)
              if (!D) return 0
              ;(oa = E[v >> 2]) && fc(oa, h.family, $b(D.$d), D.port)
              h = 0
              var Vb = D.buffer.byteLength
              for (Q = 0; 0 < Vb && Q < ha; Q++)
                if (
                  ((Tb = E[(aa + 8 * Q) >> 2]),
                  (Ub = E[(aa + (8 * Q + 4)) >> 2]))
                )
                  (C = Math.min(Ub, Vb)),
                    (u = D.buffer.subarray(h, h + C)),
                    B.set(u, Tb + h),
                    (h += C),
                    (Vb -= C)
              return h
            default:
              return -52
          }
        } catch (V) {
          return ('undefined' !== typeof K && V instanceof K.Td) || n(V), -V.Xd
        }
      },
      H: function (a, b) {
        try {
          return (a = z(a)), Ob(K.stat, a, b)
        } catch (c) {
          return ('undefined' !== typeof K && c instanceof K.Td) || n(c), -c.Xd
        }
      },
      Ca: function (a) {
        try {
          if (!a) return -21
          var b = {
            __size__: 390,
            sysname: 0,
            nodename: 65,
            release: 130,
            version: 195,
            machine: 260,
            domainname: 325,
          }
          Ma('Emscripten', a + b.sysname)
          Ma('emscripten', a + b.nodename)
          Ma('1.0', a + b.release)
          Ma('#1', a + b.version)
          Ma('x86-JS', a + b.machine)
          return 0
        } catch (c) {
          return ('undefined' !== typeof K && c instanceof K.Td) || n(c), -c.Xd
        }
      },
      ya: function (a) {
        try {
          return (a = z(a)), K.unlink(a), 0
        } catch (b) {
          return ('undefined' !== typeof K && b instanceof K.Td) || n(b), -b.Xd
        }
      },
      b: function () {
        n()
      },
      Ha: hc,
      Ra: qb,
      L: function () {
        n(
          "To use dlopen, you need to use Emscripten's linking support, see https://github.com/emscripten-core/emscripten/wiki/Linking"
        )
      },
      Sa: function () {
        n(
          "To use dlopen, you need to use Emscripten's linking support, see https://github.com/emscripten-core/emscripten/wiki/Linking"
        )
      },
      V: function (a) {
        W.activeTexture(a)
      },
      U: function (a, b) {
        W.attachShader(P[a], T[b])
      },
      ja: function (a, b) {
        W.me.beginQueryEXT(a, oc[b])
      },
      T: function (a, b, c) {
        W.bindAttribLocation(P[a], b, z(c))
      },
      S: function (a, b) {
        W.bindBuffer(a, jc[b])
      },
      R: function (a, b) {
        W.bindFramebuffer(a, kc[b])
      },
      Q: function (a, b) {
        W.bindRenderbuffer(a, lc[b])
      },
      P: function (a, b) {
        W.bindTexture(a, mc[b])
      },
      ba: function (a) {
        W.bindVertexArray(nc[a])
      },
      O: function (a, b, c, d) {
        W.blendColor(a, b, c, d)
      },
      wd: function (a) {
        W.blendEquation(a)
      },
      vd: function (a, b) {
        W.blendEquationSeparate(a, b)
      },
      ud: function (a, b) {
        W.blendFunc(a, b)
      },
      td: function (a, b, c, d) {
        W.blendFuncSeparate(a, b, c, d)
      },
      sd: function (a, b, c, d) {
        W.bufferData(a, c ? B.subarray(c, c + b) : b, d)
      },
      rd: function (a, b, c, d) {
        W.bufferSubData(a, b, B.subarray(d, d + c))
      },
      qd: function (a) {
        return W.checkFramebufferStatus(a)
      },
      pd: function (a) {
        W.clear(a)
      },
      od: function (a, b, c, d) {
        W.clearColor(a, b, c, d)
      },
      nd: function (a) {
        W.clearDepth(a)
      },
      md: function (a) {
        W.clearStencil(a)
      },
      ld: function (a, b, c, d) {
        W.colorMask(!!a, !!b, !!c, !!d)
      },
      kd: function (a) {
        W.compileShader(T[a])
      },
      jd: function (a, b, c, d, f, g, h, m) {
        W.compressedTexImage2D(
          a,
          b,
          c,
          d,
          f,
          g,
          m ? B.subarray(m, m + h) : null
        )
      },
      id: function (a, b, c, d, f, g, h, m, r) {
        W.compressedTexSubImage2D(
          a,
          b,
          c,
          d,
          f,
          g,
          h,
          r ? B.subarray(r, r + m) : null
        )
      },
      hd: function (a, b, c, d, f, g, h, m) {
        W.copyTexImage2D(a, b, c, d, f, g, h, m)
      },
      gd: function (a, b, c, d, f, g, h, m) {
        W.copyTexSubImage2D(a, b, c, d, f, g, h, m)
      },
      fd: function () {
        var a = tc(P),
          b = W.createProgram()
        b.name = a
        P[a] = b
        return a
      },
      ed: function (a) {
        var b = tc(T)
        T[b] = W.createShader(a)
        return b
      },
      dd: function (a) {
        W.cullFace(a)
      },
      cd: function (a, b) {
        for (var c = 0; c < a; c++) {
          var d = E[(b + 4 * c) >> 2],
            f = jc[d]
          f && (W.deleteBuffer(f), (f.name = 0), (jc[d] = null))
        }
      },
      bd: function (a, b) {
        for (var c = 0; c < a; ++c) {
          var d = E[(b + 4 * c) >> 2],
            f = kc[d]
          f && (W.deleteFramebuffer(f), (f.name = 0), (kc[d] = null))
        }
      },
      ad: function (a) {
        if (a) {
          var b = P[a]
          b
            ? (W.deleteProgram(b), (b.name = 0), (P[a] = null), (pc[a] = null))
            : U(1281)
        }
      },
      la: function (a, b) {
        for (var c = 0; c < a; c++) {
          var d = E[(b + 4 * c) >> 2],
            f = oc[d]
          f && (W.me.deleteQueryEXT(f), (oc[d] = null))
        }
      },
      $c: function (a, b) {
        for (var c = 0; c < a; c++) {
          var d = E[(b + 4 * c) >> 2],
            f = lc[d]
          f && (W.deleteRenderbuffer(f), (f.name = 0), (lc[d] = null))
        }
      },
      _c: function (a) {
        if (a) {
          var b = T[a]
          b ? (W.deleteShader(b), (T[a] = null)) : U(1281)
        }
      },
      Zc: function (a, b) {
        for (var c = 0; c < a; c++) {
          var d = E[(b + 4 * c) >> 2],
            f = mc[d]
          f && (W.deleteTexture(f), (f.name = 0), (mc[d] = null))
        }
      },
      aa: function (a, b) {
        for (var c = 0; c < a; c++) {
          var d = E[(b + 4 * c) >> 2]
          W.deleteVertexArray(nc[d])
          nc[d] = null
        }
      },
      Yc: function (a) {
        W.depthFunc(a)
      },
      Xc: function (a) {
        W.depthMask(!!a)
      },
      Wc: function (a, b) {
        W.depthRange(a, b)
      },
      Vc: function (a, b) {
        W.detachShader(P[a], T[b])
      },
      Uc: function (a) {
        W.disable(a)
      },
      Tc: function (a) {
        W.disableVertexAttribArray(a)
      },
      Sc: function (a, b, c) {
        W.drawArrays(a, b, c)
      },
      Y: function (a, b, c, d) {
        W.drawArraysInstanced(a, b, c, d)
      },
      Z: function (a, b) {
        for (var c = uc[a], d = 0; d < a; d++) c[d] = E[(b + 4 * d) >> 2]
        W.drawBuffers(c)
      },
      Rc: function (a, b, c, d) {
        W.drawElements(a, b, c, d)
      },
      X: function (a, b, c, d, f) {
        W.drawElementsInstanced(a, b, c, d, f)
      },
      Qc: function (a) {
        W.enable(a)
      },
      Pc: function (a) {
        W.enableVertexAttribArray(a)
      },
      ia: function (a) {
        W.me.endQueryEXT(a)
      },
      Oc: function () {
        W.finish()
      },
      Nc: function () {
        W.flush()
      },
      Mc: function (a, b, c, d) {
        W.framebufferRenderbuffer(a, b, c, lc[d])
      },
      Lc: function (a, b, c, d, f) {
        W.framebufferTexture2D(a, b, c, mc[d], f)
      },
      Kc: function (a) {
        W.frontFace(a)
      },
      Jc: function (a, b) {
        vc(a, b, 'createBuffer', jc)
      },
      Hc: function (a, b) {
        vc(a, b, 'createFramebuffer', kc)
      },
      ma: function (a, b) {
        for (var c = 0; c < a; c++) {
          var d = W.me.createQueryEXT()
          if (!d) {
            for (U(1282); c < a; ) E[(b + 4 * c++) >> 2] = 0
            break
          }
          var f = tc(oc)
          d.name = f
          oc[f] = d
          E[(b + 4 * c) >> 2] = f
        }
      },
      Gc: function (a, b) {
        vc(a, b, 'createRenderbuffer', lc)
      },
      Fc: function (a, b) {
        vc(a, b, 'createTexture', mc)
      },
      $: function (a, b) {
        vc(a, b, 'createVertexArray', nc)
      },
      Ic: function (a) {
        W.generateMipmap(a)
      },
      Ec: function (a, b, c, d, f, g, h) {
        wc('getActiveAttrib', a, b, c, d, f, g, h)
      },
      Dc: function (a, b, c, d, f, g, h) {
        wc('getActiveUniform', a, b, c, d, f, g, h)
      },
      Cc: function (a, b, c, d) {
        a = W.getAttachedShaders(P[a])
        var f = a.length
        f > b && (f = b)
        E[c >> 2] = f
        for (b = 0; b < f; ++b) E[(d + 4 * b) >> 2] = T.indexOf(a[b])
      },
      Bc: function (a, b) {
        return W.getAttribLocation(P[a], z(b))
      },
      Ac: function (a, b) {
        yc(a, b, 4)
      },
      zc: function (a, b, c) {
        c ? (E[c >> 2] = W.getBufferParameter(a, b)) : U(1281)
      },
      yc: function () {
        var a = W.getError() || sc
        sc = 0
        return a
      },
      xc: function (a, b) {
        yc(a, b, 2)
      },
      wc: function (a, b, c, d) {
        a = W.getFramebufferAttachmentParameter(a, b, c)
        if (a instanceof WebGLRenderbuffer || a instanceof WebGLTexture)
          a = a.name | 0
        E[d >> 2] = a
      },
      vc: function (a, b) {
        yc(a, b, 0)
      },
      tc: function (a, b, c, d) {
        a = W.getProgramInfoLog(P[a])
        null === a && (a = '(unknown error)')
        b = 0 < b && d ? Da(a, d, b) : 0
        c && (E[c >> 2] = b)
      },
      uc: function (a, b, c) {
        if (c)
          if (a >= ic) U(1281)
          else {
            var d = pc[a]
            if (d)
              if (35716 == b)
                (a = W.getProgramInfoLog(P[a])),
                  null === a && (a = '(unknown error)'),
                  (E[c >> 2] = a.length + 1)
              else if (35719 == b) E[c >> 2] = d.xf
              else if (35722 == b) {
                if (-1 == d.Qe) {
                  a = P[a]
                  var f = W.getProgramParameter(a, 35721)
                  for (b = d.Qe = 0; b < f; ++b)
                    d.Qe = Math.max(
                      d.Qe,
                      W.getActiveAttrib(a, b).name.length + 1
                    )
                }
                E[c >> 2] = d.Qe
              } else if (35381 == b) {
                if (-1 == d.Re)
                  for (
                    a = P[a], f = W.getProgramParameter(a, 35382), b = d.Re = 0;
                    b < f;
                    ++b
                  )
                    d.Re = Math.max(
                      d.Re,
                      W.getActiveUniformBlockName(a, b).length + 1
                    )
                E[c >> 2] = d.Re
              } else E[c >> 2] = W.getProgramParameter(P[a], b)
            else U(1282)
          }
        else U(1281)
      },
      da: function (a, b, c) {
        if (c) {
          a = W.me.getQueryObjectEXT(oc[a], b)
          var d
          'boolean' == typeof a ? (d = a ? 1 : 0) : (d = a)
          xc(c, d)
        } else U(1281)
      },
      fa: function (a, b, c) {
        if (c) {
          a = W.me.getQueryObjectEXT(oc[a], b)
          var d
          'boolean' == typeof a ? (d = a ? 1 : 0) : (d = a)
          E[c >> 2] = d
        } else U(1281)
      },
      ca: function (a, b, c) {
        if (c) {
          a = W.me.getQueryObjectEXT(oc[a], b)
          var d
          'boolean' == typeof a ? (d = a ? 1 : 0) : (d = a)
          xc(c, d)
        } else U(1281)
      },
      ea: function (a, b, c) {
        if (c) {
          a = W.me.getQueryObjectEXT(oc[a], b)
          var d
          'boolean' == typeof a ? (d = a ? 1 : 0) : (d = a)
          E[c >> 2] = d
        } else U(1281)
      },
      ga: function (a, b, c) {
        c ? (E[c >> 2] = W.me.getQueryEXT(a, b)) : U(1281)
      },
      sc: function (a, b, c) {
        c ? (E[c >> 2] = W.getRenderbufferParameter(a, b)) : U(1281)
      },
      qc: function (a, b, c, d) {
        a = W.getShaderInfoLog(T[a])
        null === a && (a = '(unknown error)')
        b = 0 < b && d ? Da(a, d, b) : 0
        c && (E[c >> 2] = b)
      },
      pc: function (a, b, c, d) {
        a = W.getShaderPrecisionFormat(a, b)
        E[c >> 2] = a.rangeMin
        E[(c + 4) >> 2] = a.rangeMax
        E[d >> 2] = a.precision
      },
      oc: function (a, b, c, d) {
        if ((a = W.getShaderSource(T[a])))
          (b = 0 < b && d ? Da(a, d, b) : 0), c && (E[c >> 2] = b)
      },
      rc: function (a, b, c) {
        c
          ? 35716 == b
            ? ((a = W.getShaderInfoLog(T[a])),
              null === a && (a = '(unknown error)'),
              (E[c >> 2] = a ? a.length + 1 : 0))
            : 35720 == b
            ? ((a = W.getShaderSource(T[a])),
              (E[c >> 2] = a ? a.length + 1 : 0))
            : (E[c >> 2] = W.getShaderParameter(T[a], b))
          : U(1281)
      },
      nc: function (a) {
        if (qc[a]) return qc[a]
        switch (a) {
          case 7939:
            var b = W.getSupportedExtensions() || []
            b = b.concat(
              b.map(function (d) {
                return 'GL_' + d
              })
            )
            b = zc(b.join(' '))
            break
          case 7936:
          case 7937:
          case 37445:
          case 37446:
            ;(b = W.getParameter(a)) || U(1280)
            b = zc(b)
            break
          case 7938:
            b = zc('OpenGL ES 2.0 (' + W.getParameter(7938) + ')')
            break
          case 35724:
            b = W.getParameter(35724)
            var c = b.match(/^WebGL GLSL ES ([0-9]\.[0-9][0-9]?)(?:$| .*)/)
            null !== c &&
              (3 == c[1].length && (c[1] += '0'),
              (b = 'OpenGL ES GLSL ES ' + c[1] + ' (' + b + ')'))
            b = zc(b)
            break
          default:
            return U(1280), 0
        }
        return (qc[a] = b)
      },
      mc: function (a, b, c) {
        c ? (G[c >> 2] = W.getTexParameter(a, b)) : U(1281)
      },
      lc: function (a, b, c) {
        c ? (E[c >> 2] = W.getTexParameter(a, b)) : U(1281)
      },
      ic: function (a, b) {
        b = z(b)
        var c = 0
        if (']' == b[b.length - 1]) {
          var d = b.lastIndexOf('[')
          c = ']' != b[d + 1] ? parseInt(b.slice(d + 1)) : 0
          b = b.slice(0, d)
        }
        return (a = pc[a] && pc[a].fg[b]) && 0 <= c && c < a[0] ? a[1] + c : -1
      },
      kc: function (a, b, c) {
        Ac(a, b, c, 2)
      },
      jc: function (a, b, c) {
        Ac(a, b, c, 0)
      },
      fc: function (a, b, c) {
        c ? (E[c >> 2] = W.getVertexAttribOffset(a, b)) : U(1281)
      },
      hc: function (a, b, c) {
        Bc(a, b, c, 2)
      },
      gc: function (a, b, c) {
        Bc(a, b, c, 5)
      },
      ec: function (a, b) {
        W.hint(a, b)
      },
      dc: function (a) {
        return (a = jc[a]) ? W.isBuffer(a) : 0
      },
      cc: function (a) {
        return W.isEnabled(a)
      },
      bc: function (a) {
        return (a = kc[a]) ? W.isFramebuffer(a) : 0
      },
      ac: function (a) {
        return (a = P[a]) ? W.isProgram(a) : 0
      },
      ka: function (a) {
        return (a = oc[a]) ? W.me.isQueryEXT(a) : 0
      },
      $b: function (a) {
        return (a = lc[a]) ? W.isRenderbuffer(a) : 0
      },
      _b: function (a) {
        return (a = T[a]) ? W.isShader(a) : 0
      },
      Zb: function (a) {
        return (a = mc[a]) ? W.isTexture(a) : 0
      },
      _: function (a) {
        return (a = nc[a]) ? W.isVertexArray(a) : 0
      },
      Yb: function (a) {
        W.lineWidth(a)
      },
      Xb: function (a) {
        W.linkProgram(P[a])
        var b = P[a]
        a = pc[a] = {
          fg: {},
          xf: 0,
          Qe: -1,
          Re: -1,
        }
        for (
          var c = a.fg, d = W.getProgramParameter(b, 35718), f = 0;
          f < d;
          ++f
        ) {
          var g = W.getActiveUniform(b, f),
            h = g.name
          a.xf = Math.max(a.xf, h.length + 1)
          ']' == h.slice(-1) && (h = h.slice(0, h.lastIndexOf('[')))
          var m = W.getUniformLocation(b, h)
          if (m) {
            var r = tc(R)
            c[h] = [g.size, r]
            R[r] = m
            for (var q = 1; q < g.size; ++q)
              (m = W.getUniformLocation(b, h + '[' + q + ']')),
                (r = tc(R)),
                (R[r] = m)
          }
        }
      },
      Wb: function (a, b) {
        3317 == a && (rc = b)
        W.pixelStorei(a, b)
      },
      Vb: function (a, b) {
        W.polygonOffset(a, b)
      },
      ha: function (a, b) {
        W.me.queryCounterEXT(oc[a], b)
      },
      Ub: function (a, b, c, d, f, g, h) {
        ;(h = Cc(g, f, c, d, h)) ? W.readPixels(a, b, c, d, f, g, h) : U(1280)
      },
      Tb: function () {},
      Sb: function (a, b, c, d) {
        W.renderbufferStorage(a, b, c, d)
      },
      Rb: function (a, b) {
        W.sampleCoverage(a, !!b)
      },
      Qb: function (a, b, c, d) {
        W.scissor(a, b, c, d)
      },
      Pb: function () {
        U(1280)
      },
      Ob: function (a, b, c, d) {
        for (var f = '', g = 0; g < b; ++g) {
          var h = d ? E[(d + 4 * g) >> 2] : -1
          f += z(E[(c + 4 * g) >> 2], 0 > h ? void 0 : h)
        }
        W.shaderSource(T[a], f)
      },
      Nb: function (a, b, c) {
        W.stencilFunc(a, b, c)
      },
      Mb: function (a, b, c, d) {
        W.stencilFuncSeparate(a, b, c, d)
      },
      Lb: function (a) {
        W.stencilMask(a)
      },
      Kb: function (a, b) {
        W.stencilMaskSeparate(a, b)
      },
      Jb: function (a, b, c) {
        W.stencilOp(a, b, c)
      },
      Ib: function (a, b, c, d) {
        W.stencilOpSeparate(a, b, c, d)
      },
      Hb: function (a, b, c, d, f, g, h, m, r) {
        W.texImage2D(a, b, c, d, f, g, h, m, r ? Cc(m, h, d, f, r) : null)
      },
      Gb: function (a, b, c) {
        W.texParameterf(a, b, c)
      },
      Fb: function (a, b, c) {
        W.texParameterf(a, b, G[c >> 2])
      },
      Eb: function (a, b, c) {
        W.texParameteri(a, b, c)
      },
      Db: function (a, b, c) {
        W.texParameteri(a, b, E[c >> 2])
      },
      Cb: function (a, b, c, d, f, g, h, m, r) {
        var q = null
        r && (q = Cc(m, h, f, g, r))
        W.texSubImage2D(a, b, c, d, f, g, h, m, q)
      },
      Bb: function (a, b) {
        W.uniform1f(R[a], b)
      },
      Ab: function (a, b, c) {
        if (288 >= b)
          for (var d = Dc[b - 1], f = 0; f < b; ++f) d[f] = G[(c + 4 * f) >> 2]
        else d = G.subarray(c >> 2, (c + 4 * b) >> 2)
        W.uniform1fv(R[a], d)
      },
      zb: function (a, b) {
        W.uniform1i(R[a], b)
      },
      yb: function (a, b, c) {
        if (288 >= b)
          for (var d = Ec[b - 1], f = 0; f < b; ++f) d[f] = E[(c + 4 * f) >> 2]
        else d = E.subarray(c >> 2, (c + 4 * b) >> 2)
        W.uniform1iv(R[a], d)
      },
      xb: function (a, b, c) {
        W.uniform2f(R[a], b, c)
      },
      wb: function (a, b, c) {
        if (144 >= b)
          for (var d = Dc[2 * b - 1], f = 0; f < 2 * b; f += 2)
            (d[f] = G[(c + 4 * f) >> 2]), (d[f + 1] = G[(c + (4 * f + 4)) >> 2])
        else d = G.subarray(c >> 2, (c + 8 * b) >> 2)
        W.uniform2fv(R[a], d)
      },
      vb: function (a, b, c) {
        W.uniform2i(R[a], b, c)
      },
      tb: function (a, b, c) {
        if (144 >= b)
          for (var d = Ec[2 * b - 1], f = 0; f < 2 * b; f += 2)
            (d[f] = E[(c + 4 * f) >> 2]), (d[f + 1] = E[(c + (4 * f + 4)) >> 2])
        else d = E.subarray(c >> 2, (c + 8 * b) >> 2)
        W.uniform2iv(R[a], d)
      },
      sb: function (a, b, c, d) {
        W.uniform3f(R[a], b, c, d)
      },
      rb: function (a, b, c) {
        if (96 >= b)
          for (var d = Dc[3 * b - 1], f = 0; f < 3 * b; f += 3)
            (d[f] = G[(c + 4 * f) >> 2]),
              (d[f + 1] = G[(c + (4 * f + 4)) >> 2]),
              (d[f + 2] = G[(c + (4 * f + 8)) >> 2])
        else d = G.subarray(c >> 2, (c + 12 * b) >> 2)
        W.uniform3fv(R[a], d)
      },
      qb: function (a, b, c, d) {
        W.uniform3i(R[a], b, c, d)
      },
      pb: function (a, b, c) {
        if (96 >= b)
          for (var d = Ec[3 * b - 1], f = 0; f < 3 * b; f += 3)
            (d[f] = E[(c + 4 * f) >> 2]),
              (d[f + 1] = E[(c + (4 * f + 4)) >> 2]),
              (d[f + 2] = E[(c + (4 * f + 8)) >> 2])
        else d = E.subarray(c >> 2, (c + 12 * b) >> 2)
        W.uniform3iv(R[a], d)
      },
      ob: function (a, b, c, d, f) {
        W.uniform4f(R[a], b, c, d, f)
      },
      nb: function (a, b, c) {
        if (72 >= b) {
          var d = Dc[4 * b - 1],
            f = G
          c >>= 2
          for (var g = 0; g < 4 * b; g += 4) {
            var h = c + g
            d[g] = f[h]
            d[g + 1] = f[h + 1]
            d[g + 2] = f[h + 2]
            d[g + 3] = f[h + 3]
          }
        } else d = G.subarray(c >> 2, (c + 16 * b) >> 2)
        W.uniform4fv(R[a], d)
      },
      mb: function (a, b, c, d, f) {
        W.uniform4i(R[a], b, c, d, f)
      },
      lb: function (a, b, c) {
        if (72 >= b)
          for (var d = Ec[4 * b - 1], f = 0; f < 4 * b; f += 4)
            (d[f] = E[(c + 4 * f) >> 2]),
              (d[f + 1] = E[(c + (4 * f + 4)) >> 2]),
              (d[f + 2] = E[(c + (4 * f + 8)) >> 2]),
              (d[f + 3] = E[(c + (4 * f + 12)) >> 2])
        else d = E.subarray(c >> 2, (c + 16 * b) >> 2)
        W.uniform4iv(R[a], d)
      },
      kb: function (a, b, c, d) {
        if (72 >= b)
          for (var f = Dc[4 * b - 1], g = 0; g < 4 * b; g += 4)
            (f[g] = G[(d + 4 * g) >> 2]),
              (f[g + 1] = G[(d + (4 * g + 4)) >> 2]),
              (f[g + 2] = G[(d + (4 * g + 8)) >> 2]),
              (f[g + 3] = G[(d + (4 * g + 12)) >> 2])
        else f = G.subarray(d >> 2, (d + 16 * b) >> 2)
        W.uniformMatrix2fv(R[a], !!c, f)
      },
      ib: function (a, b, c, d) {
        if (32 >= b)
          for (var f = Dc[9 * b - 1], g = 0; g < 9 * b; g += 9)
            (f[g] = G[(d + 4 * g) >> 2]),
              (f[g + 1] = G[(d + (4 * g + 4)) >> 2]),
              (f[g + 2] = G[(d + (4 * g + 8)) >> 2]),
              (f[g + 3] = G[(d + (4 * g + 12)) >> 2]),
              (f[g + 4] = G[(d + (4 * g + 16)) >> 2]),
              (f[g + 5] = G[(d + (4 * g + 20)) >> 2]),
              (f[g + 6] = G[(d + (4 * g + 24)) >> 2]),
              (f[g + 7] = G[(d + (4 * g + 28)) >> 2]),
              (f[g + 8] = G[(d + (4 * g + 32)) >> 2])
        else f = G.subarray(d >> 2, (d + 36 * b) >> 2)
        W.uniformMatrix3fv(R[a], !!c, f)
      },
      hb: function (a, b, c, d) {
        if (18 >= b) {
          var f = Dc[16 * b - 1],
            g = G
          d >>= 2
          for (var h = 0; h < 16 * b; h += 16) {
            var m = d + h
            f[h] = g[m]
            f[h + 1] = g[m + 1]
            f[h + 2] = g[m + 2]
            f[h + 3] = g[m + 3]
            f[h + 4] = g[m + 4]
            f[h + 5] = g[m + 5]
            f[h + 6] = g[m + 6]
            f[h + 7] = g[m + 7]
            f[h + 8] = g[m + 8]
            f[h + 9] = g[m + 9]
            f[h + 10] = g[m + 10]
            f[h + 11] = g[m + 11]
            f[h + 12] = g[m + 12]
            f[h + 13] = g[m + 13]
            f[h + 14] = g[m + 14]
            f[h + 15] = g[m + 15]
          }
        } else f = G.subarray(d >> 2, (d + 64 * b) >> 2)
        W.uniformMatrix4fv(R[a], !!c, f)
      },
      gb: function (a) {
        W.useProgram(P[a])
      },
      fb: function (a) {
        W.validateProgram(P[a])
      },
      eb: function (a, b) {
        W.vertexAttrib1f(a, b)
      },
      db: function (a, b) {
        W.vertexAttrib1f(a, G[b >> 2])
      },
      cb: function (a, b, c) {
        W.vertexAttrib2f(a, b, c)
      },
      bb: function (a, b) {
        W.vertexAttrib2f(a, G[b >> 2], G[(b + 4) >> 2])
      },
      ab: function (a, b, c, d) {
        W.vertexAttrib3f(a, b, c, d)
      },
      $a: function (a, b) {
        W.vertexAttrib3f(a, G[b >> 2], G[(b + 4) >> 2], G[(b + 8) >> 2])
      },
      _a: function (a, b, c, d, f) {
        W.vertexAttrib4f(a, b, c, d, f)
      },
      Za: function (a, b) {
        W.vertexAttrib4f(
          a,
          G[b >> 2],
          G[(b + 4) >> 2],
          G[(b + 8) >> 2],
          G[(b + 12) >> 2]
        )
      },
      W: function (a, b) {
        W.vertexAttribDivisor(a, b)
      },
      Ya: function (a, b, c, d, f, g) {
        W.vertexAttribPointer(a, b, c, !!d, f, g)
      },
      Xa: function (a, b, c, d) {
        W.viewport(a, b, c, d)
      },
      f: function (a, b) {
        Z(a, b || 1)
        throw 'longjmp'
      },
      na: function (a, b, c) {
        B.copyWithin(a, b, b + c)
      },
      oa: function (a) {
        a >>>= 0
        var b = B.length
        if (1073741824 < a) return !1
        for (var c = 1; 4 >= c; c *= 2) {
          var d = b * (1 + 0.2 / c)
          d = Math.min(d, a + 100663296)
          d = Math.max(16777216, a, d)
          0 < d % 65536 && (d += 65536 - (d % 65536))
          a: {
            try {
              ya.grow((Math.min(1073741824, d) - Na.byteLength + 65535) >>> 16)
              Sa(ya.buffer)
              var f = 1
              break a
            } catch (g) {}
            f = void 0
          }
          if (f) return !0
        }
        return !1
      },
      pa: function (a, b) {
        var c = 0
        Gc().forEach(function (d, f) {
          var g = b + c
          E[(a + 4 * f) >> 2] = g
          Ma(d, g)
          c += d.length + 1
        })
        return 0
      },
      qa: function (a, b) {
        var c = Gc()
        E[a >> 2] = c.length
        var d = 0
        c.forEach(function (f) {
          d += f.length + 1
        })
        E[b >> 2] = d
        return 0
      },
      v: function (a) {
        ea(a)
      },
      x: function (a) {
        try {
          var b = Qb(a)
          K.close(b)
          return 0
        } catch (c) {
          return ('undefined' !== typeof K && c instanceof K.Td) || n(c), c.Xd
        }
      },
      F: function (a, b) {
        try {
          var c = Qb(a)
          x[b >> 0] = c.tty ? 2 : K.be(c.mode) ? 3 : K.xe(c.mode) ? 7 : 4
          return 0
        } catch (d) {
          return ('undefined' !== typeof K && d instanceof K.Td) || n(d), d.Xd
        }
      },
      ua: function (a, b, c, d) {
        try {
          a: {
            for (var f = Qb(a), g = (a = 0); g < c; g++) {
              var h = E[(b + (8 * g + 4)) >> 2],
                m = K.read(f, x, E[(b + 8 * g) >> 2], h, void 0)
              if (0 > m) {
                var r = -1
                break a
              }
              a += m
              if (m < h) break
            }
            r = a
          }
          E[d >> 2] = r
          return 0
        } catch (q) {
          return ('undefined' !== typeof K && q instanceof K.Td) || n(q), q.Xd
        }
      },
      Ta: function (a, b, c, d, f) {
        try {
          var g = Qb(a)
          a = 4294967296 * c + (b >>> 0)
          if (-9007199254740992 >= a || 9007199254740992 <= a) return -61
          K.je(g, a, d)
          J = [
            g.position >>> 0,
            ((I = g.position),
            1 <= +Math.abs(I)
              ? 0 < I
                ? (Math.min(+Math.floor(I / 4294967296), 4294967295) | 0) >>> 0
                : ~~+Math.ceil((I - +(~~I >>> 0)) / 4294967296) >>> 0
              : 0),
          ]
          E[f >> 2] = J[0]
          E[(f + 4) >> 2] = J[1]
          g.we && 0 === a && 0 === d && (g.we = null)
          return 0
        } catch (h) {
          return ('undefined' !== typeof K && h instanceof K.Td) || n(h), h.Xd
        }
      },
      A: function (a, b, c, d) {
        try {
          a: {
            for (var f = Qb(a), g = (a = 0); g < c; g++) {
              var h = K.write(
                f,
                x,
                E[(b + 8 * g) >> 2],
                E[(b + (8 * g + 4)) >> 2],
                void 0
              )
              if (0 > h) {
                var m = -1
                break a
              }
              a += h
            }
            m = a
          }
          E[d >> 2] = m
          return 0
        } catch (r) {
          return ('undefined' !== typeof K && r instanceof K.Td) || n(r), r.Xd
        }
      },
      u: Ic,
      d: function () {
        return wa | 0
      },
      r: function (a, b, c, d) {
        function f(v, C, p, u, w, D) {
          var N = 10 === v ? 28 : 16
          w = 10 === v ? cc(w) : bc(w)
          N = Ka(N)
          w = fc(N, v, w, D)
          assert(!w.Xd)
          w = Ka(32)
          E[(w + 4) >> 2] = v
          E[(w + 8) >> 2] = C
          E[(w + 12) >> 2] = p
          E[(w + 24) >> 2] = u
          E[(w + 20) >> 2] = N
          E[(w + 16) >> 2] = 10 === v ? 28 : 16
          E[(w + 28) >> 2] = 0
          return w
        }
        var g = 0,
          h = 0,
          m = 0,
          r = 0,
          q = 0,
          t = 0
        c &&
          ((m = E[c >> 2]),
          (r = E[(c + 4) >> 2]),
          (q = E[(c + 8) >> 2]),
          (t = E[(c + 12) >> 2]))
        q && !t && (t = 2 === q ? 17 : 6)
        !q && t && (q = 17 === t ? 2 : 1)
        0 === t && (t = 6)
        0 === q && (q = 1)
        if (!a && !b) return -2
        if (m & -1088 || (0 !== c && E[c >> 2] & 2 && !a)) return -1
        if (m & 32) return -2
        if (0 !== q && 1 !== q && 2 !== q) return -7
        if (0 !== r && 2 !== r && 10 !== r) return -6
        if (b && ((b = z(b)), (h = parseInt(b, 10)), isNaN(h)))
          return m & 1024 ? -2 : -8
        if (!a)
          return (
            0 === r && (r = 2),
            0 === (m & 1) &&
              (2 === r ? (g = Yc(2130706433)) : (g = [0, 0, 0, 1])),
            (a = f(r, q, t, null, g, h)),
            (E[d >> 2] = a),
            0
          )
        a = z(a)
        g = Rb(a)
        if (null !== g)
          if (0 === r || 2 === r) r = 2
          else if (10 === r && m & 8) (g = [0, 0, Yc(65535), g]), (r = 10)
          else return -2
        else if (((g = Sb(a)), null !== g))
          if (0 === r || 10 === r) r = 10
          else return -2
        if (null != g) return (a = f(r, q, t, a, g, h)), (E[d >> 2] = a), 0
        if (m & 4) return -2
        a = $b(a)
        g = Rb(a)
        0 === r ? (r = 2) : 10 === r && (g = [0, 0, Yc(65535), g])
        a = f(r, q, t, null, g, h)
        E[d >> 2] = a
        return 0
      },
      q: function (a, b, c, d, f, g, h) {
        b = ec(a, b)
        if (b.Xd) return -6
        a = b.port
        var m = b.$d
        b = !1
        if (c && d) {
          var r
          if (h & 1 || !(r = ac(m))) {
            if (h & 8) return -2
          } else m = r
          c = Da(m, c, d)
          c + 1 >= d && (b = !0)
        }
        f && g && ((c = Da('' + a, f, g)), c + 1 >= g && (b = !0))
        return b ? -12 : 0
      },
      i: function (a) {
        var b = Date.now()
        E[a >> 2] = (b / 1e3) | 0
        E[(a + 4) >> 2] = ((b % 1e3) * 1e3) | 0
        return 0
      },
      l: rb,
      ub: Zc,
      jb: $c,
      g: ad,
      y: bd,
      D: cd,
      J: dd,
      C: hd,
      Va: id,
      Ua: jd,
      p: kd,
      t: ld,
      h: md,
      Qa: nd,
      K: od,
      Wa: pd,
      k: xb,
      a: ya,
      E: function (a) {
        sb()
        var b = new Date(
            E[(a + 20) >> 2] + 1900,
            E[(a + 16) >> 2],
            E[(a + 12) >> 2],
            E[(a + 8) >> 2],
            E[(a + 4) >> 2],
            E[a >> 2],
            0
          ),
          c = E[(a + 32) >> 2],
          d = b.getTimezoneOffset(),
          f = new Date(b.getFullYear(), 0, 1),
          g = new Date(b.getFullYear(), 6, 1).getTimezoneOffset(),
          h = f.getTimezoneOffset(),
          m = Math.min(h, g)
        0 > c
          ? (E[(a + 32) >> 2] = Number(g != h && m == d))
          : 0 < c != (m == d) &&
            ((g = Math.max(h, g)),
            b.setTime(b.getTime() + 6e4 * ((0 < c ? m : g) - d)))
        E[(a + 24) >> 2] = b.getDay()
        E[(a + 28) >> 2] = ((b.getTime() - f.getTime()) / 864e5) | 0
        return (b.getTime() / 1e3) | 0
      },
      Pa: function (a, b) {
        if (0 === a) return ob(28), -1
        var c = E[a >> 2]
        a = E[(a + 4) >> 2]
        if (0 > a || 999999999 < a || 0 > c) return ob(28), -1
        0 !== b && ((E[b >> 2] = 0), (E[(b + 4) >> 2] = 0))
        return Jc(1e6 * c + a / 1e3)
      },
      B: function () {
        return 6
      },
      N: function () {},
      e: function (a) {
        wa = a | 0
      },
      w: function () {
        return 0
      },
      j: function (a, b, c, d) {
        function f(p, u, w) {
          for (
            p = 'number' === typeof p ? p.toString() : p || '';
            p.length < u;

          )
            p = w[0] + p
          return p
        }

        function g(p, u) {
          return f(p, u, '0')
        }

        function h(p, u) {
          function w(N) {
            return 0 > N ? -1 : 0 < N ? 1 : 0
          }
          var D
          0 === (D = w(p.getFullYear() - u.getFullYear())) &&
            0 === (D = w(p.getMonth() - u.getMonth())) &&
            (D = w(p.getDate() - u.getDate()))
          return D
        }

        function m(p) {
          switch (p.getDay()) {
            case 0:
              return new Date(p.getFullYear() - 1, 11, 29)
            case 1:
              return p
            case 2:
              return new Date(p.getFullYear(), 0, 3)
            case 3:
              return new Date(p.getFullYear(), 0, 2)
            case 4:
              return new Date(p.getFullYear(), 0, 1)
            case 5:
              return new Date(p.getFullYear() - 1, 11, 31)
            case 6:
              return new Date(p.getFullYear() - 1, 11, 30)
          }
        }

        function r(p) {
          p = Qc(new Date(p.he + 1900, 0, 1), p.hf)
          var u = new Date(p.getFullYear() + 1, 0, 4),
            w = m(new Date(p.getFullYear(), 0, 4))
          u = m(u)
          return 0 >= h(w, p)
            ? 0 >= h(u, p)
              ? p.getFullYear() + 1
              : p.getFullYear()
            : p.getFullYear() - 1
        }
        var q = E[(d + 40) >> 2]
        d = {
          Ug: E[d >> 2],
          Tg: E[(d + 4) >> 2],
          ff: E[(d + 8) >> 2],
          Ve: E[(d + 12) >> 2],
          Ke: E[(d + 16) >> 2],
          he: E[(d + 20) >> 2],
          gf: E[(d + 24) >> 2],
          hf: E[(d + 28) >> 2],
          oh: E[(d + 32) >> 2],
          Sg: E[(d + 36) >> 2],
          Vg: q ? z(q) : '',
        }
        c = z(c)
        q = {
          '%c': '%a %b %d %H:%M:%S %Y',
          '%D': '%m/%d/%y',
          '%F': '%Y-%m-%d',
          '%h': '%b',
          '%r': '%I:%M:%S %p',
          '%R': '%H:%M',
          '%T': '%H:%M:%S',
          '%x': '%m/%d/%y',
          '%X': '%H:%M:%S',
          '%Ec': '%c',
          '%EC': '%C',
          '%Ex': '%m/%d/%y',
          '%EX': '%H:%M:%S',
          '%Ey': '%y',
          '%EY': '%Y',
          '%Od': '%d',
          '%Oe': '%e',
          '%OH': '%H',
          '%OI': '%I',
          '%Om': '%m',
          '%OM': '%M',
          '%OS': '%S',
          '%Ou': '%u',
          '%OU': '%U',
          '%OV': '%V',
          '%Ow': '%w',
          '%OW': '%W',
          '%Oy': '%y',
        }
        for (var t in q) c = c.replace(new RegExp(t, 'g'), q[t])
        var v =
            'Sunday Monday Tuesday Wednesday Thursday Friday Saturday'.split(
              ' '
            ),
          C =
            'January February March April May June July August September October November December'.split(
              ' '
            )
        q = {
          '%a': function (p) {
            return v[p.gf].substring(0, 3)
          },
          '%A': function (p) {
            return v[p.gf]
          },
          '%b': function (p) {
            return C[p.Ke].substring(0, 3)
          },
          '%B': function (p) {
            return C[p.Ke]
          },
          '%C': function (p) {
            return g(((p.he + 1900) / 100) | 0, 2)
          },
          '%d': function (p) {
            return g(p.Ve, 2)
          },
          '%e': function (p) {
            return f(p.Ve, 2, ' ')
          },
          '%g': function (p) {
            return r(p).toString().substring(2)
          },
          '%G': function (p) {
            return r(p)
          },
          '%H': function (p) {
            return g(p.ff, 2)
          },
          '%I': function (p) {
            p = p.ff
            0 == p ? (p = 12) : 12 < p && (p -= 12)
            return g(p, 2)
          },
          '%j': function (p) {
            return g(p.Ve + Lc(Kc(p.he + 1900) ? Mc : Nc, p.Ke - 1), 3)
          },
          '%m': function (p) {
            return g(p.Ke + 1, 2)
          },
          '%M': function (p) {
            return g(p.Tg, 2)
          },
          '%n': function () {
            return '\n'
          },
          '%p': function (p) {
            return 0 <= p.ff && 12 > p.ff ? 'AM' : 'PM'
          },
          '%S': function (p) {
            return g(p.Ug, 2)
          },
          '%t': function () {
            return '\t'
          },
          '%u': function (p) {
            return p.gf || 7
          },
          '%U': function (p) {
            var u = new Date(p.he + 1900, 0, 1),
              w = 0 === u.getDay() ? u : Qc(u, 7 - u.getDay())
            p = new Date(p.he + 1900, p.Ke, p.Ve)
            return 0 > h(w, p)
              ? g(
                  Math.ceil(
                    (31 -
                      w.getDate() +
                      (Lc(Kc(p.getFullYear()) ? Mc : Nc, p.getMonth() - 1) -
                        31) +
                      p.getDate()) /
                      7
                  ),
                  2
                )
              : 0 === h(w, u)
              ? '01'
              : '00'
          },
          '%V': function (p) {
            var u = new Date(p.he + 1901, 0, 4),
              w = m(new Date(p.he + 1900, 0, 4))
            u = m(u)
            var D = Qc(new Date(p.he + 1900, 0, 1), p.hf)
            return 0 > h(D, w)
              ? '53'
              : 0 >= h(u, D)
              ? '01'
              : g(
                  Math.ceil(
                    (w.getFullYear() < p.he + 1900
                      ? p.hf + 32 - w.getDate()
                      : p.hf + 1 - w.getDate()) / 7
                  ),
                  2
                )
          },
          '%w': function (p) {
            return p.gf
          },
          '%W': function (p) {
            var u = new Date(p.he, 0, 1),
              w =
                1 === u.getDay()
                  ? u
                  : Qc(u, 0 === u.getDay() ? 1 : 7 - u.getDay() + 1)
            p = new Date(p.he + 1900, p.Ke, p.Ve)
            return 0 > h(w, p)
              ? g(
                  Math.ceil(
                    (31 -
                      w.getDate() +
                      (Lc(Kc(p.getFullYear()) ? Mc : Nc, p.getMonth() - 1) -
                        31) +
                      p.getDate()) /
                      7
                  ),
                  2
                )
              : 0 === h(w, u)
              ? '01'
              : '00'
          },
          '%y': function (p) {
            return (p.he + 1900).toString().substring(2)
          },
          '%Y': function (p) {
            return p.he + 1900
          },
          '%z': function (p) {
            p = p.Sg
            var u = 0 <= p
            p = Math.abs(p) / 60
            return (
              (u ? '+' : '-') +
              String('0000' + ((p / 60) * 100 + (p % 60))).slice(-4)
            )
          },
          '%Z': function (p) {
            return p.Vg
          },
          '%%': function () {
            return '%'
          },
        }
        for (t in q)
          0 <= c.indexOf(t) && (c = c.replace(new RegExp(t, 'g'), q[t](d)))
        t = Jb(c, !1)
        if (t.length > b) return 0
        x.set(t, a)
        return t.length - 1
      },
      s: function (a) {
        switch (a) {
          case 30:
            return 16384
          case 85:
            return 65536
          case 132:
          case 133:
          case 12:
          case 137:
          case 138:
          case 15:
          case 235:
          case 16:
          case 17:
          case 18:
          case 19:
          case 20:
          case 149:
          case 13:
          case 10:
          case 236:
          case 153:
          case 9:
          case 21:
          case 22:
          case 159:
          case 154:
          case 14:
          case 77:
          case 78:
          case 139:
          case 80:
          case 81:
          case 82:
          case 68:
          case 67:
          case 164:
          case 11:
          case 29:
          case 47:
          case 48:
          case 95:
          case 52:
          case 51:
          case 46:
          case 79:
            return 200809
          case 27:
          case 246:
          case 127:
          case 128:
          case 23:
          case 24:
          case 160:
          case 161:
          case 181:
          case 182:
          case 242:
          case 183:
          case 184:
          case 243:
          case 244:
          case 245:
          case 165:
          case 178:
          case 179:
          case 49:
          case 50:
          case 168:
          case 169:
          case 175:
          case 170:
          case 171:
          case 172:
          case 97:
          case 76:
          case 32:
          case 173:
          case 35:
            return -1
          case 176:
          case 177:
          case 7:
          case 155:
          case 8:
          case 157:
          case 125:
          case 126:
          case 92:
          case 93:
          case 129:
          case 130:
          case 131:
          case 94:
          case 91:
            return 1
          case 74:
          case 60:
          case 69:
          case 70:
          case 4:
            return 1024
          case 31:
          case 42:
          case 72:
            return 32
          case 87:
          case 26:
          case 33:
            return 2147483647
          case 34:
          case 1:
            return 47839
          case 38:
          case 36:
            return 99
          case 43:
          case 37:
            return 2048
          case 0:
            return 2097152
          case 3:
            return 65536
          case 28:
            return 32768
          case 44:
            return 32767
          case 75:
            return 16384
          case 39:
            return 1e3
          case 89:
            return 700
          case 71:
            return 256
          case 40:
            return 255
          case 2:
            return 100
          case 180:
            return 64
          case 25:
            return 20
          case 5:
            return 16
          case 6:
            return 6
          case 73:
            return 4
          case 84:
            return 'object' === typeof navigator
              ? navigator.hardwareConcurrency || 1
              : 1
        }
        ob(28)
        return -1
      },
      m: function (a) {
        var b = (Date.now() / 1e3) | 0
        a && (E[a >> 2] = b)
        return b
      },
      z: Jc,
    }
    ;(function () {
      function a(f) {
        e.asm = f.exports
        H = e.asm.xd
        eb()
      }

      function b(f) {
        a(f.instance)
      }

      function c(f) {
        return kb()
          .then(function (g) {
            return WebAssembly.instantiate(g, d)
          })
          .then(f, function (g) {
            k('failed to asynchronously prepare wasm: ' + g)
            n(g)
          })
      }
      var d = {
        a: qd,
      }
      db()
      if (e.instantiateWasm)
        try {
          return e.instantiateWasm(d, a)
        } catch (f) {
          return (
            k('Module.instantiateWasm callback failed with error: ' + f), !1
          )
        }
      ;(function () {
        return xa ||
          'function' !== typeof WebAssembly.instantiateStreaming ||
          hb() ||
          fb('file://') ||
          'function' !== typeof fetch
          ? c(b)
          : fetch(gb, {
              credentials: 'same-origin',
            }).then(function (f) {
              return WebAssembly.instantiateStreaming(f, d).then(
                b,
                function (g) {
                  k('wasm streaming compile failed: ' + g)
                  k('falling back to ArrayBuffer instantiation')
                  return c(b)
                }
              )
            })
      })().catch(ca)
      return {}
    })()
    var Uc = (e.___wasm_call_ctors = function () {
        return (Uc = e.___wasm_call_ctors = e.asm.yd).apply(null, arguments)
      }),
      Xc = (e._free = function () {
        return (Xc = e._free = e.asm.zd).apply(null, arguments)
      }),
      Vc = (e._memset = function () {
        return (Vc = e._memset = e.asm.Ad).apply(null, arguments)
      }),
      Ka = (e._malloc = function () {
        return (Ka = e._malloc = e.asm.Bd).apply(null, arguments)
      }),
      pb = (e.___errno_location = function () {
        return (pb = e.___errno_location = e.asm.Cd).apply(null, arguments)
      })
    e._fflush = function () {
      return (e._fflush = e.asm.Dd).apply(null, arguments)
    }
    var Wc = (e._memalign = function () {
        return (Wc = e._memalign = e.asm.Ed).apply(null, arguments)
      }),
      dc = (e._ntohs = function () {
        return (dc = e._ntohs = e.asm.Fd).apply(null, arguments)
      }),
      Wb = (e._htons = function () {
        return (Wb = e._htons = e.asm.Gd).apply(null, arguments)
      })
    e._main = function () {
      return (e._main = e.asm.Hd).apply(null, arguments)
    }
    var Yc = (e._htonl = function () {
        return (Yc = e._htonl = e.asm.Id).apply(null, arguments)
      }),
      wb = (e.__get_tzname = function () {
        return (wb = e.__get_tzname = e.asm.Jd).apply(null, arguments)
      }),
      vb = (e.__get_daylight = function () {
        return (vb = e.__get_daylight = e.asm.Kd).apply(null, arguments)
      }),
      ub = (e.__get_timezone = function () {
        return (ub = e.__get_timezone = e.asm.Ld).apply(null, arguments)
      }),
      y = (e.stackSave = function () {
        return (y = e.stackSave = e.asm.Md).apply(null, arguments)
      }),
      A = (e.stackRestore = function () {
        return (A = e.stackRestore = e.asm.Nd).apply(null, arguments)
      }),
      Ca = (e.stackAlloc = function () {
        return (Ca = e.stackAlloc = e.asm.Od).apply(null, arguments)
      }),
      Z = (e._setThrew = function () {
        return (Z = e._setThrew = e.asm.Pd).apply(null, arguments)
      }),
      rd = (e.dynCall_vijjjid = function () {
        return (rd = e.dynCall_vijjjid = e.asm.Qd).apply(null, arguments)
      }),
      sd = (e.dynCall_iiiijj = function () {
        return (sd = e.dynCall_iiiijj = e.asm.Rd).apply(null, arguments)
      }),
      td = (e.dynCall_iij = function () {
        return (td = e.dynCall_iij = e.asm.Sd).apply(null, arguments)
      })
    e._ff_h264_cabac_tables = 2113942

    function ad(a, b, c) {
      var d = y()
      try {
        return H.get(a)(b, c)
      } catch (f) {
        A(d)
        if (f !== f + 0 && 'longjmp' !== f) throw f
        Z(1, 0)
      }
    }

    function kd(a, b) {
      var c = y()
      try {
        H.get(a)(b)
      } catch (d) {
        A(c)
        if (d !== d + 0 && 'longjmp' !== d) throw d
        Z(1, 0)
      }
    }

    function md(a, b, c, d, f) {
      var g = y()
      try {
        H.get(a)(b, c, d, f)
      } catch (h) {
        A(g)
        if (h !== h + 0 && 'longjmp' !== h) throw h
        Z(1, 0)
      }
    }

    function ld(a, b, c) {
      var d = y()
      try {
        H.get(a)(b, c)
      } catch (f) {
        A(d)
        if (f !== f + 0 && 'longjmp' !== f) throw f
        Z(1, 0)
      }
    }

    function cd(a, b, c, d, f) {
      var g = y()
      try {
        return H.get(a)(b, c, d, f)
      } catch (h) {
        A(g)
        if (h !== h + 0 && 'longjmp' !== h) throw h
        Z(1, 0)
      }
    }

    function hd(a, b, c, d, f, g, h, m, r) {
      var q = y()
      try {
        return H.get(a)(b, c, d, f, g, h, m, r)
      } catch (t) {
        A(q)
        if (t !== t + 0 && 'longjmp' !== t) throw t
        Z(1, 0)
      }
    }

    function Zc(a) {
      var b = y()
      try {
        return H.get(a)()
      } catch (c) {
        A(b)
        if (c !== c + 0 && 'longjmp' !== c) throw c
        Z(1, 0)
      }
    }

    function $c(a, b) {
      var c = y()
      try {
        return H.get(a)(b)
      } catch (d) {
        A(c)
        if (d !== d + 0 && 'longjmp' !== d) throw d
        Z(1, 0)
      }
    }

    function bd(a, b, c, d) {
      var f = y()
      try {
        return H.get(a)(b, c, d)
      } catch (g) {
        A(f)
        if (g !== g + 0 && 'longjmp' !== g) throw g
        Z(1, 0)
      }
    }

    function od(a, b, c, d, f, g, h, m, r) {
      var q = y()
      try {
        H.get(a)(b, c, d, f, g, h, m, r)
      } catch (t) {
        A(q)
        if (t !== t + 0 && 'longjmp' !== t) throw t
        Z(1, 0)
      }
    }

    function dd(a, b, c, d, f, g) {
      var h = y()
      try {
        return H.get(a)(b, c, d, f, g)
      } catch (m) {
        A(h)
        if (m !== m + 0 && 'longjmp' !== m) throw m
        Z(1, 0)
      }
    }

    function nd(a, b, c, d, f, g, h) {
      var m = y()
      try {
        H.get(a)(b, c, d, f, g, h)
      } catch (r) {
        A(m)
        if (r !== r + 0 && 'longjmp' !== r) throw r
        Z(1, 0)
      }
    }

    function pd(a, b, c, d, f, g, h, m, r, q) {
      var t = y()
      try {
        rd(a, b, c, d, f, g, h, m, r, q)
      } catch (v) {
        A(t)
        if (v !== v + 0 && 'longjmp' !== v) throw v
        Z(1, 0)
      }
    }

    function id(a, b, c, d, f, g, h, m) {
      var r = y()
      try {
        return sd(a, b, c, d, f, g, h, m)
      } catch (q) {
        A(r)
        if (q !== q + 0 && 'longjmp' !== q) throw q
        Z(1, 0)
      }
    }

    function jd(a, b, c, d) {
      var f = y()
      try {
        return td(a, b, c, d)
      } catch (g) {
        A(f)
        if (g !== g + 0 && 'longjmp' !== g) throw g
        Z(1, 0)
      }
    }
    e.ccall = Ba
    e.cwrap = function (a, b, c, d) {
      c = c || []
      var f = c.every(function (g) {
        return 'number' === g
      })
      return 'string' !== b && f && !d
        ? Aa(a)
        : function () {
            return Ba(a, b, c, arguments, d)
          }
    }
    e.setValue = function (a, b, c) {
      c = c || 'i8'
      '*' === c.charAt(c.length - 1) && (c = 'i32')
      switch (c) {
        case 'i1':
          x[a >> 0] = b
          break
        case 'i8':
          x[a >> 0] = b
          break
        case 'i16':
          Oa[a >> 1] = b
          break
        case 'i32':
          E[a >> 2] = b
          break
        case 'i64':
          J = [
            b >>> 0,
            ((I = b),
            1 <= +Math.abs(I)
              ? 0 < I
                ? (Math.min(+Math.floor(I / 4294967296), 4294967295) | 0) >>> 0
                : ~~+Math.ceil((I - +(~~I >>> 0)) / 4294967296) >>> 0
              : 0),
          ]
          E[a >> 2] = J[0]
          E[(a + 4) >> 2] = J[1]
          break
        case 'float':
          G[a >> 2] = b
          break
        case 'double':
          Ra[a >> 3] = b
          break
        default:
          n('invalid type for setValue: ' + c)
      }
    }
    e.UTF8ToString = z
    e.stringToUTF8 = Da
    e.lengthBytesUTF8 = Ha
    e.writeAsciiToMemory = Ma
    e.FS = K
    var ud

    function da(a) {
      this.name = 'ExitStatus'
      this.message = 'Program terminated with exit(' + a + ')'
      this.status = a
    }
    cb = function vd() {
      ud || wd()
      ud || (cb = vd)
    }

    function wd(a) {
      function b() {
        if (!ud && ((ud = !0), (e.calledRun = !0), !za)) {
          e.noFSInit || K.Ne.tf || K.Ne()
          O.root = K.ae(O, {}, null)
          lb(Wa)
          K.Zf = !1
          lb(Xa)
          ba(e)
          if (e.onRuntimeInitialized) e.onRuntimeInitialized()
          if (xd) {
            var c = a,
              d = e._main
            c = c || []
            var f = c.length + 1,
              g = Ca(4 * (f + 1))
            E[g >> 2] = La(la)
            for (var h = 1; h < f; h++) E[(g >> 2) + h] = La(c[h - 1])
            E[(g >> 2) + f] = 0
            try {
              var m = d(f, g)
              ea(m, !0)
            } catch (r) {
              r instanceof da ||
                ('unwind' == r
                  ? (noExitRuntime = !0)
                  : ((c = r) &&
                      'object' === typeof r &&
                      r.stack &&
                      (c = [r, r.stack]),
                    k('exception thrown: ' + c),
                    ma(1, r)))
            } finally {
            }
          }
          if (e.postRun)
            for (
              'function' == typeof e.postRun && (e.postRun = [e.postRun]);
              e.postRun.length;

            )
              (c = e.postRun.shift()), Za.unshift(c)
          lb(Za)
        }
      }
      a = a || ka
      if (!(0 < ab)) {
        if (e.preRun)
          for (
            'function' == typeof e.preRun && (e.preRun = [e.preRun]);
            e.preRun.length;

          )
            $a()
        lb(Ua)
        0 < ab ||
          (e.setStatus
            ? (e.setStatus('Running...'),
              setTimeout(function () {
                setTimeout(function () {
                  e.setStatus('')
                }, 1)
                b()
              }, 1))
            : b())
      }
    }
    e.run = wd

    function ea(a, b) {
      if (!b || !noExitRuntime || 0 !== a) {
        if (!noExitRuntime) {
          lb(Ya)
          K.quit()
          if (e.onExit) e.onExit(a)
          za = !0
        }
        ma(a, new da(a))
      }
    }
    if (e.preInit)
      for (
        'function' == typeof e.preInit && (e.preInit = [e.preInit]);
        0 < e.preInit.length;

      )
        e.preInit.pop()()
    var xd = !1
    e.noInitialRun && (xd = !1)
    wd()

    return createFFmpegCore.ready
  }
})()
if (typeof exports === 'object' && typeof module === 'object')
  module.exports = createFFmpegCore
else if (typeof define === 'function' && define['amd'])
  define([], function () {
    return createFFmpegCore
  })
else if (typeof exports === 'object')
  exports['createFFmpegCore'] = createFFmpegCore
