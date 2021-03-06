define("flight/lib/utils", [], function() {
    var t = [],
        e = 100,
        i = {
            isDomObj: function(t) {
                return !!t.nodeType || t === window
            },
            toArray: function(e, i) {
                return t.slice.call(e, i)
            },
            merge: function() {
                for (var t = arguments.length, e = 0, i = new Array(t + 1); t > e; e++) i[e + 1] = arguments[e];
                return 0 === t ? {} : (i[0] = {}, i[i.length - 1] === !0 && (i.pop(), i.unshift(!0)), $.extend.apply(void 0, i))
            },
            push: function(t, e, i) {
                return t && Object.keys(e || {}).forEach(function(s) {
                    if (t[s] && i) throw new Error('utils.push attempted to overwrite "' + s + '" while running in protected mode');
                    "object" == typeof t[s] && "object" == typeof e[s] ? this.push(t[s], e[s]) : t[s] = e[s]
                }, this), t
            },
            isEnumerable: function(t, e) {
                return Object.keys(t).indexOf(e) > -1
            },
            compose: function() {
                var t = arguments;
                return function() {
                    for (var e = arguments, i = t.length - 1; i >= 0; i--) e = [t[i].apply(this, e)];
                    return e[0]
                }
            },
            uniqueArray: function(t) {
                for (var e = {}, i = [], s = 0, n = t.length; n > s; ++s) e.hasOwnProperty(t[s]) || (i.push(t[s]), e[t[s]] = 1);
                return i
            },
            debounce: function(t, i, s) {
                "number" != typeof i && (i = e);
                var n, o;
                return function() {
                    var e = this,
                        r = arguments,
                        a = function() {
                            n = null, s || (o = t.apply(e, r))
                        }, c = s && !n;
                    return clearTimeout(n), n = setTimeout(a, i), c && (o = t.apply(e, r)), o
                }
            },
            throttle: function(t, i) {
                "number" != typeof i && (i = e);
                var s, n, o, r, a, c, h = this.debounce(function() {
                        a = r = !1
                    }, i);
                return function() {
                    s = this, n = arguments;
                    var e = function() {
                        o = null, a && (c = t.apply(s, n)), h()
                    };
                    return o || (o = setTimeout(e, i)), r ? a = !0 : (r = !0, c = t.apply(s, n)), h(), c
                }
            },
            countThen: function(t, e) {
                return function() {
                    return --t ? void 0 : e.apply(this, arguments)
                }
            },
            delegate: function(t) {
                return function(e, i) {
                    var s, n = $(e.target);
                    Object.keys(t).forEach(function(o) {
                        return !e.isPropagationStopped() && (s = n.closest(o)).length ? (i = i || {}, i.el = s[0], t[o].apply(this, [e, i])) : void 0
                    }, this)
                }
            },
            once: function(t) {
                var e, i;
                return function() {
                    return e ? i : (i = t.apply(this, arguments), e = !0, i)
                }
            }
        };
    return i
}), define("flight/lib/debug", [], function() {
    function t(e, i, s) {
        s = s || {};
        var n = s.obj || window,
            o = s.path || (n == window ? "window" : ""),
            r = Object.keys(n);
        r.forEach(function(s) {
            (g[e] || e)(i, n, s) && console.log([o, ".", s].join(""), "->", ["(", typeof n[s], ")"].join(""), n[s]), "[object Object]" == Object.prototype.toString.call(n[s]) && n[s] != n && -1 == o.split(".").indexOf(s) && t(e, i, {
                obj: n[s],
                path: [o, s].join(".")
            })
        })
    }

    function e(e, i, s, n) {
        i && typeof s != i ? console.error([s, "must be", i].join(" ")) : t(e, s, n)
    }

    function i(t, i) {
        e("name", "string", t, i)
    }

    function s(t, i) {
        e("nameContains", "string", t, i)
    }

    function n(t, i) {
        e("type", "function", t, i)
    }

    function o(t, i) {
        e("value", null, t, i)
    }

    function r(t, i) {
        e("valueCoerced", null, t, i)
    }

    function a(e, i) {
        t(e, null, i)
    }

    function c() {
        var t = [].slice.call(arguments);
        C.eventNames.length || (C.eventNames = p), C.actions = t.length ? t : p, d()
    }

    function h() {
        var t = [].slice.call(arguments);
        C.actions.length || (C.actions = p), C.eventNames = t.length ? t : p, d()
    }

    function l() {
        C.actions = [], C.eventNames = [], d()
    }

    function u() {
        C.actions = p, C.eventNames = p, d()
    }

    function d() {
        window.localStorage && (localStorage.setItem("logFilter_eventNames", C.eventNames), localStorage.setItem("logFilter_actions", C.actions))
    }

    function m() {
        var t = {
            eventNames: window.localStorage && localStorage.getItem("logFilter_eventNames") || f,
            actions: window.localStorage && localStorage.getItem("logFilter_actions") || w
        };
        return Object.keys(t).forEach(function(e) {
            var i = t[e];
            "string" == typeof i && i !== p && (t[e] = i.split(","))
        }), t
    }
    var g = {
        name: function(t, e, i) {
            return t == i
        },
        nameContains: function(t, e, i) {
            return i.indexOf(t) > -1
        },
        type: function(t, e, i) {
            return e[i] instanceof t
        },
        value: function(t, e, i) {
            return e[i] === t
        },
        valueCoerced: function(t, e, i) {
            return e[i] == t
        }
    }, p = "all",
        f = [],
        w = [],
        C = m();
    return {
        enable: function(t) {
            this.enabled = !! t, t && window.console && (console.info("Booting in DEBUG mode"), console.info("You can configure event logging with DEBUG.events.logAll()/logNone()/logByName()/logByAction()")), window.DEBUG = this
        },
        find: {
            byName: i,
            byNameContains: s,
            byType: n,
            byValue: o,
            byValueCoerced: r,
            custom: a
        },
        events: {
            logFilter: C,
            logByAction: c,
            logByName: h,
            logAll: u,
            logNone: l
        }
    }
}), define("flight/lib/compose", ["./utils", "./debug"], function(t, e) {
    function i(t, e) {
        if (o) {
            var i = Object.create(null);
            Object.keys(t).forEach(function(s) {
                if (r.indexOf(s) < 0) {
                    var n = Object.getOwnPropertyDescriptor(t, s);
                    n.writable = e, i[s] = n
                }
            }), Object.defineProperties(t, i)
        }
    }

    function s(t, e, i) {
        var s;
        return o && t.hasOwnProperty(e) ? (s = Object.getOwnPropertyDescriptor(t, e).writable, Object.defineProperty(t, e, {
            writable: !0
        }), i.call(t), Object.defineProperty(t, e, {
            writable: s
        }), void 0) : (i.call(t), void 0)
    }

    function n(t, e) {
        t.mixedIn = t.hasOwnProperty("mixedIn") ? t.mixedIn : [], e.forEach(function(e) {
            -1 == t.mixedIn.indexOf(e) && (i(t, !1), e.call(t), t.mixedIn.push(e))
        }), i(t, !0)
    }
    var o = e.enabled && !t.isEnumerable(Object, "getOwnPropertyDescriptor"),
        r = ["mixedIn"];
    if (o) try {
        Object.getOwnPropertyDescriptor(Object, "keys")
    } catch (a) {
        o = !1
    }
    return {
        mixin: n,
        unlockProperty: s
    }
}), define("flight/lib/advice", ["./compose"], function(t) {
    var e = {
        around: function(t, e) {
            return function() {
                var i = 0,
                    s = arguments.length,
                    n = new Array(s + 1);
                for (n[0] = t.bind(this); s > i; i++) n[i + 1] = arguments[i];
                return e.apply(this, n)
            }
        },
        before: function(t, e) {
            var i = "function" == typeof e ? e : e.obj[e.fnName];
            return function() {
                return i.apply(this, arguments), t.apply(this, arguments)
            }
        },
        after: function(t, e) {
            var i = "function" == typeof e ? e : e.obj[e.fnName];
            return function() {
                var e = (t.unbound || t).apply(this, arguments);
                return i.apply(this, arguments), e
            }
        },
        withAdvice: function() {
            ["before", "after", "around"].forEach(function(i) {
                this[i] = function(s, n) {
                    t.unlockProperty(this, s, function() {
                        return this[s] = "function" == typeof this[s] ? e[i](this[s], n) : n, this[s]
                    })
                }
            }, this)
        }
    };
    return e
}), define("flight/lib/registry", [], function() {
    function t(t, e) {
        var i, s, n, o = e.length;
        return "function" == typeof e[o - 1] && (o -= 1, n = e[o]), "object" == typeof e[o - 1] && (o -= 1), 2 == o ? (i = e[0], s = e[1]) : (i = t.node, s = e[0]), {
            element: i,
            type: s,
            callback: n
        }
    }

    function e(t, e) {
        return t.element == e.element && t.type == e.type && (null == e.callback || t.callback == e.callback)
    }

    function i() {
        function i(t) {
            this.component = t, this.attachedTo = [], this.instances = {}, this.addInstance = function(t) {
                var e = new s(t);
                return this.instances[t.identity] = e, this.attachedTo.push(t.node), e
            }, this.removeInstance = function(t) {
                delete this.instances[t.identity];
                var e = this.attachedTo.indexOf(t.node);
                e > -1 && this.attachedTo.splice(e, 1), Object.keys(this.instances).length || n.removeComponentInfo(this)
            }, this.isAttachedTo = function(t) {
                return this.attachedTo.indexOf(t) > -1
            }
        }

        function s(t) {
            this.instance = t, this.events = [], this.addBind = function(t) {
                this.events.push(t), n.events.push(t)
            }, this.removeBind = function(t) {
                for (var i, s = 0; i = this.events[s]; s++) e(i, t) && this.events.splice(s, 1)
            }
        }
        var n = this;
        (this.reset = function() {
            this.components = [], this.allInstances = {}, this.events = []
        }).call(this), this.addInstance = function(t) {
            var e = this.findComponentInfo(t);
            e || (e = new i(t.constructor), this.components.push(e));
            var s = e.addInstance(t);
            return this.allInstances[t.identity] = s, e
        }, this.removeInstance = function(t) {
            var e = (this.findInstanceInfo(t), this.findComponentInfo(t));
            e && e.removeInstance(t), delete this.allInstances[t.identity]
        }, this.removeComponentInfo = function(t) {
            var e = this.components.indexOf(t);
            e > -1 && this.components.splice(e, 1)
        }, this.findComponentInfo = function(t) {
            for (var e, i = t.attachTo ? t : t.constructor, s = 0; e = this.components[s]; s++)
                if (e.component === i) return e;
            return null
        }, this.findInstanceInfo = function(t) {
            return this.allInstances[t.identity] || null
        }, this.findInstanceInfoByNode = function(t) {
            var e = [];
            return Object.keys(this.allInstances).forEach(function(i) {
                var s = this.allInstances[i];
                s.instance.node === t && e.push(s)
            }, this), e
        }, this.on = function(e) {
            for (var i, s = n.findInstanceInfo(this), o = arguments.length, r = 1, a = new Array(o - 1); o > r; r++) a[r - 1] = arguments[r];
            if (s) {
                i = e.apply(null, a), i && (a[a.length - 1] = i);
                var c = t(this, a);
                s.addBind(c)
            }
        }, this.off = function() {
            var i = t(this, arguments),
                s = n.findInstanceInfo(this);
            s && s.removeBind(i);
            for (var o, r = 0; o = n.events[r]; r++) e(o, i) && n.events.splice(r, 1)
        }, n.trigger = function() {}, this.teardown = function() {
            n.removeInstance(this)
        }, this.withRegistration = function() {
            this.after("initialize", function() {
                n.addInstance(this)
            }), this.around("on", n.on), this.after("off", n.off), window.DEBUG && DEBUG.enabled && this.after("trigger", n.trigger), this.after("teardown", {
                obj: n,
                fnName: "teardown"
            })
        }
    }
    return new i
}), define("flight/lib/base", ["./utils", "./registry", "./debug"], function(t, e, i) {
    function s(t) {
        t.events.slice().forEach(function(t) {
            var e = [t.type];
            t.element && e.unshift(t.element), "function" == typeof t.callback && e.push(t.callback), this.off.apply(this, e)
        }, t.instance)
    }

    function n(t, e) {
        try {
            window.postMessage(e, "*")
        } catch (i) {
            throw console.log("unserializable data for event", t, ":", e), new Error(["The event", t, "on component", this.toString(), "was triggered with non-serializable data"].join(" "))
        }
    }

    function o() {
        this.trigger = function() {
            var t, e, s, o, r, a = arguments.length - 1,
                c = arguments[a];
            return "string" != typeof c && (!c || !c.defaultBehavior) && (a--, s = c), 1 == a ? (t = $(arguments[0]), o = arguments[1]) : (t = this.$node, o = arguments[0]), o.defaultBehavior && (r = o.defaultBehavior, o = $.Event(o.type)), e = o.type || o, i.enabled && window.postMessage && n.call(this, e, s), "object" == typeof this.attr.eventData && (s = $.extend(!0, {}, this.attr.eventData, s)), t.trigger(o || e, s), r && !o.isDefaultPrevented() && (this[r] || r).call(this), t
        }, this.on = function() {
            var e, i, s, n, o = arguments.length - 1,
                r = arguments[o];
            if (n = "object" == typeof r ? t.delegate(this.resolveDelegateRules(r)) : r, 2 == o ? (e = $(arguments[0]), i = arguments[1]) : (e = this.$node, i = arguments[0]), "function" != typeof n && "object" != typeof n) throw new Error('Unable to bind to "' + i + '" because the given callback is not a function or an object');
            return s = n.bind(this), s.target = n, s.context = this, e.on(i, s), n.bound || (n.bound = []), n.bound.push(s), s
        }, this.off = function() {
            var t, e, i, s = arguments.length - 1;
            return "function" == typeof arguments[s] && (i = arguments[s], s -= 1), 1 == s ? (t = $(arguments[0]), e = arguments[1]) : (t = this.$node, e = arguments[0]), i && i.bound && i.bound.some(function(t, e, s) {
                return t.context && this.identity == t.context.identity ? (s.splice(e, 1), i = t, !0) : void 0
            }, this), t.off(e, i)
        }, this.resolveDelegateRules = function(t) {
            var e = {};
            return Object.keys(t).forEach(function(i) {
                if (!(i in this.attr)) throw new Error('Component "' + this.toString() + '" wants to listen on "' + i + '" but no such attribute was defined.');
                e[this.attr[i]] = t[i]
            }, this), e
        }, this.defaultAttrs = function(e) {
            t.push(this.defaults, e, !0) || (this.defaults = e)
        }, this.select = function(t) {
            return this.$node.find(this.attr[t])
        }, this.initialize = function(t, e) {
            if (e || (e = {}), this.identity || (this.identity = r++), !t) throw new Error("Component needs a node");
            t.jquery ? (this.node = t[0], this.$node = t) : (this.node = t, this.$node = $(t));
            var i = Object.create(e);
            for (var s in this.defaults) e.hasOwnProperty(s) || (i[s] = this.defaults[s]);
            return this.attr = i, Object.keys(this.defaults || {}).forEach(function(t) {
                if (null === this.defaults[t] && null === this.attr[t]) throw new Error('Required attribute "' + t + '" not specified in attachTo for component "' + this.toString() + '".')
            }, this), this
        }, this.teardown = function() {
            s(e.findInstanceInfo(this))
        }
    }
    var r = 0;
    return o
}), define("flight/lib/logger", ["./utils"], function(t) {
    function e(t) {
        var e = t.tagName ? t.tagName.toLowerCase() : t.toString(),
            i = t.className ? "." + t.className : "",
            s = e + i;
        return t.tagName ? ["'", "'"].join(s) : s
    }

    function i(t, i, s) {
        if (window.DEBUG && window.DEBUG.enabled) {
            var o, r, a, c, h, l, u, d;
            "function" == typeof s[s.length - 1] && (c = s.pop(), c = c.unbound || c), 1 == s.length ? (a = i.$node[0], r = s[0]) : 2 == s.length ? "object" != typeof s[1] || s[1].type ? (a = s[0], r = s[1]) : (a = i.$node[0], r = s[0]) : (a = s[0], r = s[1]), o = "object" == typeof r ? r.type : r, h = DEBUG.events.logFilter, u = "all" == h.actions || h.actions.indexOf(t) > -1, l = function(t) {
                return t.test ? t : new RegExp("^" + t.replace(/\*/g, ".*") + "$")
            }, d = "all" == h.eventNames || h.eventNames.some(function(t) {
                return l(t).test(o)
            }), u && d && console.info(n[t], t, "[" + o + "]", e(a), i.constructor.describe.split(" ").slice(0, 3).join(" "))
        }
    }

    function s() {
        this.before("trigger", function() {
            i("trigger", this, t.toArray(arguments))
        }), this.before("on", function() {
            i("on", this, t.toArray(arguments))
        }), this.before("off", function() {
            i("off", this, t.toArray(arguments))
        })
    }
    var n = {
        on: "<-",
        trigger: "->",
        off: "x "
    };
    return s
}), define("flight/lib/component", ["./advice", "./utils", "./compose", "./base", "./registry", "./logger", "./debug"], function(t, e, i, s, n, o, r) {
    function a() {
        var t = n.findComponentInfo(this);
        t && Object.keys(t.instances).forEach(function(e) {
            var i = t.instances[e];
            i && i.instance && i.instance.teardown()
        })
    }

    function c(t) {
        for (var i = arguments.length, s = new Array(i - 1), o = 1; i > o; o++) s[o - 1] = arguments[o];
        if (!t) throw new Error("Component needs to be attachTo'd a jQuery object, native node or selector string");
        var r = e.merge.apply(e, s),
            a = n.findComponentInfo(this);
        $(t).each(function(t, e) {
            a && a.isAttachedTo(e) || (new this).initialize(e, r)
        }.bind(this))
    }

    function h() {
        for (var e = arguments.length, h = new Array(e + 3), u = 0; e > u; u++) h[u] = arguments[u];
        var d = function() {};
        return d.toString = d.prototype.toString = function() {
            var t = h.map(function(t) {
                if (null == t.name) {
                    var e = t.toString().match(l);
                    return e && e[1] ? e[1] : ""
                }
                return "withBase" != t.name ? t.name : ""
            }).filter(Boolean).join(", ");
            return t
        }, r.enabled && (d.describe = d.prototype.describe = d.toString()), d.attachTo = c, d.teardownAll = a, r.enabled && h.unshift(o), h.unshift(s, t.withAdvice, n.withRegistration), i.mixin(d.prototype, h), d
    }
    var l = /function (.*?)\s?\(/;
    return h.teardownAll = function() {
        n.components.slice().forEach(function(t) {
            t.component.teardownAll()
        }), n.reset()
    }, h
}),
function(t, e) {
    "function" == typeof define && define.amd ? define("scripts/storage/memory_storage", [], e) : t.TD.storage.MemoryStorage = e()
}(this, function() {
    function t() {
        this.data = {}, this.length = 0
    }
    return t.prototype.clear = function() {
        this.data = {}, this.length = 0
    }, t.prototype.getItem = function(t) {
        var e = this.data[t];
        return void 0 !== e ? e : null
    }, t.prototype.key = function() {
        throw new Error("MemoryStore.key not implemented.")
    }, t.prototype.removeItem = function(t) {
        null !== this.getItem(t) && (delete this.data[t], this.length--)
    }, t.prototype.setItem = function(t, e) {
        null === this.getItem(t) && this.length++, this.data[t] = "" + e
    }, t
}),
function(t, e) {
    "function" == typeof define && define.amd ? define("scripts/sync/util", [], e) : t.TD.sync.util = e()
}(this, function() {
    var t = {}, e = 0,
        i = 2,
        s = 4,
        n = 8;
    t.maybe_log = function(t, e) {
        var i = _.isUndefined(e) ? 1 : e;
        TD.config.debug_level >= i && console.log(t)
    }, t.NotJsonable = function(t) {
        _.extend(this, t), this.___ = t.toString()
    }, t.NotJsonable.prototype = {};
    var o = function(e) {
        console.log.apply(console, _.map(e, function(e) {
            if (!_.isUndefined(e)) try {
                return JSON.parse(JSON.stringify(e))
            } catch (i) {
                return new t.NotJsonable(e)
            }
        }))
    };
    return t.stateLog = function() {
        TD.config.debug_level >= i && o(arguments)
    }, t.verboseLog = function() {
        TD.config.debug_level >= s && o(_.toArray(arguments))
    }, t.warn = function() {
        TD.config.debug_level >= e && console.log.apply(console, _.toArray(arguments))
    }, t.trace = function(e, i) {
        t.maybe_log("TRACE: " + e + ": " + (i || ""), 1)
    }, t.printStacktrace = function() {
        if (TD.config.debug_menu) try {
            throw new Error("stack trace or gtfo")
        } catch (t) {
            console.log(t.stack)
        }
    }, t.getStack = function() {
        try {
            throw new Error("stack trace or gtfo")
        } catch (t) {
            return TD.util.isChromeApp() ? t.stack.split("\n").slice(2).join("\n") : ""
        }
    }, t.errmark = function(e, i) {
        return e || (e = i, i = "missing message"), console.log("---ERROR--->>>>>->>>>->>>->>->--" + i + "--<-<<--"), t.maybe_log(e), console.log(e.stack), e
    }, t.assert = function(e, i, s) {
        if (!e) throw console.log("------------------------------------------"), console.log(["ASSERT FAILURE", i, s]), t.printStacktrace(), console.log("------------------------------------------"), TD.sync.trace && TD.sync.trace.assert(i, s), "AssertionError"
    }, t.precondition = function(e, i, s) {
        if (!e) throw console.log("------------------------------------------"), console.log(["PRECONDITION FAILURE", i, s]), t.printStacktrace(), console.log("------------------------------------------"), TD.sync.trace && TD.sync.trace.assert("PRECONDITION " + i, s), "PreconditionAssertionError"
    }, t._break = function() {
        console.log("you might want to set a breakpoint here ;-)")
    }, t.warning = function(e) {
        data = _.toArray(arguments).slice(1), console.log(["WARNING", e, t.pformat(data)])
    }, t.error = function(e) {
        data = _.toArray(arguments).slice(1), console.log(["ERROR", e, t.pformat(data)])
    }, t.list_to_set = function(t) {
        var e = {};
        return _.each(t, function(t) {
            e[t] = !0
        }), e
    }, t.pprint = function(e) {
        return t.maybe_log(JSON.stringify(e, null, "  "), i), e
    }, t.pformat = function(t) {
        return JSON.stringify(t, null, "  ")
    }, t.repr = function(t) {
        return JSON.stringify(t)
    }, t.clone = function(e) {
        if (null === e || _.isUndefined(e)) return e;
        try {
            return JSON.parse(JSON.stringify(e))
        } catch (i) {
            return t.stateLog("util.clone couldn't parse object", e, i), ["<not jsonable>", e]
        }
    }, t.dictMap = function(t, e, i) {
        var s = {};
        return _.each(_.map(t, e, i), function(t) {
            s[t[0]] = t[1]
        }), s
    }, t.stall = function(t, e) {
        _.isUndefined(e) && (e = 0);
        var i = new TD.core.defer.Deferred;
        return _.delay(_.bind(i.callback, i), 1e3 * e, t), i
    }, t.autoRetry = function(t, e, i) {
        var s = t();
        return e.forEach(function(e) {
            s.addErrback(function(s) {
                if (!i || i(s)) {
                    var n = new TD.core.defer.Deferred;
                    return n.addCallback(t), setTimeout(function() {
                        n.callback()
                    }, e), n
                }
                return s
            })
        }), s
    }, t.makeThingScheduler = function(e, i, s, o, r) {
        var a = !1,
            c = !1;
        o = o || function() {
            return !0
        }, r = _.isUndefined(r) ? 1 : r;
        var h = [],
            l = function() {
                if (t.maybe_log(["_maybe_do_stuff", s, "want stuff done:", a, "am doing stuff:", c], n), !a) return t.maybe_log("not doing stuff; someone else did stuff before us", n), void 0;
                if (c) return t.maybe_log("am already doing stuff", n), void 0;
                c = !0, a = !1;
                var o = TD.controller.progressIndicator;
                if (i) var r = o.addTask(i);
                var u = TD.core.defer.maybeDeferred(e);
                u.addCallback(function(t) {
                    if (c = !1, i && o.deleteTask(r), a) l();
                    else {
                        var e = h;
                        h = [];
                        for (var s = 0; s < e.length; s++) try {
                            e[s].callback(t)
                        } catch (n) {
                            _.defer(_.bind(e[s].errback, e[s]), n)
                        }
                    }
                }), u.addErrback(function(n) {
                    t.errmark(n, 'do_stuff for "' + s + '" yielded error when calling; ' + e), c = !1, i && o.taskFailed(r);
                    var a = h;
                    h = [];
                    for (var l = 0; l < a.length; l++) try {
                        a[l].errback(n)
                    } catch (u) {
                        _.defer(_.bind(a[l].errback, a[l]), u)
                    }
                })
            };
        return function(e) {
            if (!o()) return t.maybe_log("not triggering (guarded): " + s, n), TD.core.defer.succeed();
            e = _.isUndefined(e) ? r : e, t.maybe_log('trigger func called "' + s + '"', n), a = !0;
            var i = new TD.core.defer.Deferred;
            return h.push(i), setTimeout(l, 1e3 * e), i
        }
    }, t
}),
function(t, e) {
    "function" == typeof define && define.amd ? define("scripts/storage/store", ["scripts/storage/memory_storage", "scripts/sync/util"], e) : _.extend(t.TD.storage, e(t.TD.storage.MemoryStorage, t.TD.sync.util))
}(this, function(t, e) {
    function i(e) {
        e ? this._initBackend(e) : this._backend = new t
    }
    var s = "tweetdeckAccount",
        n = "currentAuthType",
        o = "staySignedIn",
        r = "__hasAlreadyReloaded",
        a = "_session",
        c = "migrate",
        h = "accountsLastVerified",
        l = "__version__",
        u = "ScribeTransport",
        d = [u],
        m = d.concat([l, "previousMultiUserAccount", o, n, c, u]),
        g = {
            local: localStorage,
            session: sessionStorage
        };
    return i.getPreviousStorage = function() {
        var t = _.pairs(g),
            e = _.find(t, function(t) {
                return t[1].getItem(s) || t[1].getItem(n) || t[1].getItem(o)
            });
        return e ? e[0] : null
    }, i._testStore = function(t, s) {
        e.stateLog("_testStore()");
        for (var n = !1, o = !1, r = "__test__", a = "test", c = 1024; a.length < c;) a += a;
        try {
            t.setItem(r, a), n = t.getItem(r) === a, t.removeItem(r)
        } catch (h) {
            n = !1, o = h.code === window.DOMException.QUOTA_EXCEEDED_ERR, o && 0 === t.length && TD.sync.util.warn(h, "In Safari private browsing mode")
        }
        if (s && o) try {
            i.flushDataFromStore(t), n = i._testStore(t, !1)
        } catch (h) {
            n = !1
        }
        return n
    }, i.flushDataFromStore = function(t, e) {
        e = (e || []).concat(m), i.wipe(t, e)
    }, i.flushBackend = function(t, e) {
        return i.flushDataFromStore(g[t], e)
    }, i.wipeAll = function() {
        [localStorage, sessionStorage].forEach(i.wipe)
    }, i.wipe = function(t, e) {
        var i = {};
        e = _.uniq((e || []).concat(d)), e.forEach(function(e) {
            var s = t.getItem(e);
            s && (i[e] = s)
        });
        try {
            t.clear()
        } catch (s) {
            console.warn("Clearing", t, "failed:", s)
        }
        _.each(i, function(e, i) {
            t.setItem(i, e)
        })
    }, i.shouldTryReload = function() {
        var t;
        try {
            t = !! sessionStorage.getItem(r), sessionStorage.setItem(r, !0)
        } catch (e) {
            t = !0
        }
        return !t
    }, i.removeReloadedFlag = function() {
        sessionStorage.removeItem(r)
    }, i.flushWebstorage = function(t) {
        TD.sync.util.trace("clearing web storage");
        try {
            Object.keys(g).forEach(function(e) {
                i.flushDataFromStore(g[e], t)
            })
        } catch (e) {
            console.error("Unable to clear webstorage.", e)
        }
    }, i.clearOtherBackends = function(t) {
        Object.keys(g).forEach(function(e) {
            e !== t && i.wipe(g[e])
        })
    }, i.prototype.init = function(t, s) {
        this._initBackend(t), s && s.uid !== this.getTweetdeckAccount() && (e.stateLog("New login. Clearing previous webstorage."), i.flushBackend(t), i.clearOtherBackends(t))
    }, i.prototype._initBackend = function(s) {
        this._backendType = "unknown", e.stateLog("Initializing backend with", s), _.isFunction(s.getItem) && i._testStore(s) ? this._backend = s : "local" === s && i._testStore(window.localStorage, !0) ? (this._migrateBackend(window.localStorage), this._backend = window.localStorage, this._backendType = "local") : "session" === s && i._testStore(window.sessionStorage, !0) ? (this._migrateBackend(window.sessionStorage), this._backend = window.sessionStorage, this._backendType = "session") : (e.stateLog("store._initBackend(): Falling back to MemoryStorage."), this._backend = new t, this._backendType = "memory"), this._tryUpgrade()
    }, i.prototype._migrateBackend = function(t, e) {
        if (e = e || this._getPersistentBackend(), e !== t)
            for (var i in e)
                if (e.hasOwnProperty(i)) {
                    try {
                        t.setItem(i, e.getItem(i))
                    } catch (s) {
                        if (s.code === window.DOMException.QUOTA_EXCEEDED_ERR) return TD.sync.util.warn("Migration failed due to quota limits.", s), void 0;
                        throw s
                    }
                    e.removeItem(i)
                }
    }, i.prototype._getPersistentBackend = function() {
        return this._backend instanceof t ? localStorage : this._backend
    }, i.prototype._tryUpgrade = function() {
        try {
            TD.storage.upgrade.doUpgrade(this._backend)
        } catch (t) {
            TD.sync.util.warn("Error during store upgrade:", t), i.flushWebstorage()
        }
    }, i.prototype._upgradeTweetdeckAccountSession = function() {
        var t = this._backend.getItem("tweetdeck_account");
        if (t && (this._backend.setItem("tweetdeckAccount", t), this._backend.removeItem("tweetdeck_account")), t = this._backend.getItem("tweetdeckAccount"), t && "{" === t.charAt(0)) try {
            t = JSON.parse(t).email, this._backend.setItem("tweetdeckAccount", t)
        } catch (e) {
            console.warn("Upgrading TweetDeck account session failed.", e)
        }
    }, i.prototype.getTweetdeckAccount = function() {
        var t = this._backend.getItem(s);
        return t ? t : (e.stateLog("store.getTweetdeckAccount(): tdacct invalid", t), void 0)
    }, i.prototype.setTweetdeckAccount = function(t) {
        TD.sync.util.assert(t, "user identifer must be given to set tweetdeck account"), this._backend.setItem(s, t)
    }, i.prototype.getTwitterLoginAccount = function() {
        var t, e;
        return "twitter" === this.getCurrentAuthType() ? (t = this.getTweetdeckAccount(), e = TD.storage.accountController.getAccountFromId(t)) : void 0
    }, i.prototype.getCurrentAuthType = function() {
        var t = this._getPersistentBackend().getItem(n) || "twitter";
        return "{" === t.charAt(0) && (t = "tweetdeck"), e.stateLog("getCurrentAuthType(): ", t), t
    }, i.prototype.setCurrentAuthType = function(t) {
        this._getPersistentBackend().setItem(n, t)
    }, i.prototype.setStaySignedIn = function(t) {
        this._getPersistentBackend().setItem(o, t)
    }, i.prototype._getLastVerifiedTimestamps = function() {
        var t = {};
        try {
            t = this.getJSON(h)
        } catch (i) {
            e.stateLog("_getLastVerifiedTimestamps(): failed", i)
        }
        return t
    }, i.prototype.getMigrateData = function() {
        var t;
        try {
            t = JSON.parse(sessionStorage.getItem(c))
        } catch (e) {}
        return t || {}
    }, i.prototype.getLastVerifiedTimestamp = function(t) {
        var e, i, s = this._getLastVerifiedTimestamps();
        return e = s[t.getKey()] || 0, i = t.getUpdated() || 0, Math.max(e, i)
    }, i.prototype.setLastVerifiedTimestamp = function(t) {
        var e = this._getLastVerifiedTimestamps(),
            i = e[t.getKey()] || 0,
            s = t.getUpdated() || 0,
            n = Math.max(i, s);
        n !== i && (e[t.getKey()] = n, this.setJSON(h, e))
    }, i.prototype.removeLastVerifiedTimestamp = function(t) {
        var e = this._getLastVerifiedTimestamps();
        delete e[t.getKey()], this.setJSON(h, e)
    }, i.prototype.getSessionData = function() {
        this._upgradeTweetdeckAccountSession();
        var t = {
            authType: this.getCurrentAuthType(),
            uid: this._backend.getItem(s),
            migrate: this.getMigrateData(),
            session: null,
            sessionExists: !1,
            staySignedIn: !! this.getJSON(o)
        };
        return t.uid && (t.session = this._backend.getItem(a), TD.sync.tdapi.setSession(t.session), t.sessionExists = TD.sync.tdapi.isLoggedIn()), t
    }, i.prototype.setSessionData = function(t) {
        this._backend.setItem(a, JSON.stringify(t))
    }, i.prototype.checkVersion = function(t) {
        var e = this._backend.getItem(l);
        if (null !== e && ~e !== ~t) throw new Error("Wrong version number in store. (saved) %s != (given) %s", e, t)
    }, i.prototype.setVersion = function(t) {
        this._backend.setItem(l, t)
    }, i.prototype.getJSON = function(t) {
        return JSON.parse(this._backend.getItem(t) || "{}")
    }, i.prototype.setJSON = function(t, e) {
        this._backend.setItem(t, JSON.stringify(e))
    }, i.prototype.setJSONCritical = function(t, e, i) {
        try {
            this._backend.setItem(t, JSON.stringify(e))
        } catch (s) {
            if (s.code !== window.DOMException.QUOTA_EXCEEDED_ERR || i) throw s;
            $(document).trigger("dataStorageFull"), this.setJSONCritical(t, e, !0)
        }
    }, {
        Store: i,
        store: new i
    }
}), define("data/storage", ["flight/lib/component", "scripts/storage/store"], function(t, e) {
    var i = e.store,
        s = function() {
            function t(t) {
                var e;
                try {
                    e = i.getJSON(name)
                } catch (s) {
                    return TD.sync.util.stateLog("Error parsing JSON for storage key", t), void 0
                }
                this.trigger(document, "dataStorageItem", {
                    name: t,
                    value: e
                })
            }
            this.get = function(e, i) {
                i.names && i.names.forEach(t.bind(this)), i.name && t.call(this, i.name)
            }, this.set = function(t, e) {
                for (var s in e)
                    if (e.hasOwnProperty(s)) try {
                        i.setJSON(s, e[s])
                    } catch (n) {
                        n.code === DOMException.QUOTA_EXCEEDED_ERR ? this.trigger(document, "dataStorageFull", {
                            name: s,
                            value: e[s]
                        }) : this.trigger(document, "dataStorageSetError", {
                            name: s,
                            value: e[s]
                        })
                    }
            }, this.after("initialize", function() {
                this.on("dataStorageSet", this.set), this.on("dataStorageGet", this.get)
            })
        };
    return t(s)
}), define("data/with_client", [], function() {
    function t() {
        this.getClientByAccountKey = function(t) {
            var e;
            return e = t ? TD.controller.clients.getClient(t) : this.getTwitterClient("twitter")
        }, this.getClientByAccount = function(t) {
            return this.getClientByAccountKey(t.getKey())
        }, this.getPreferredClient = function(t) {
            return TD.controller.clients.getPreferredClient(t)
        }, this.getTwitterClient = function() {
            return this.getPreferredClient("twitter")
        }, this.getTweetDeckClient = function() {
            return this.getClientsByService("tweetdeck")[0]
        }, this.getClientsByService = function(t) {
            return TD.controller.clients.getClientsByService(t)
        }, this.getAccountData = function(t) {
            var e = this.getClientByAccountKey(t);
            if (!e) return null;
            var i = e.oauth.account;
            return {
                accountKey: t,
                id: i.getUserID(),
                screenName: i.getUsername(),
                profileImageURL: i.getProfileImageURL()
            }
        }
    }
    return t
}), define("data/with_accounts", [], function() {
    function t() {
        this.defaultAttrs({
            service: "twitter"
        }), this.getCurrentAuthType = function() {
            return TD.storage.store.getCurrentAuthType()
        }, this.getTwitterLoginAccount = function() {
            var t = TD.storage.store.getTwitterLoginAccount();
            return t && this.serializeAccount(t)
        }, this.getTweetdeckLoginEmail = function() {
            return TD.storage.store.getTweetdeckAccount()
        }, this.getDefaultAccount = function() {
            var t = TD.storage.accountController.getDefault();
            return null === t ? null : this.serializeAccount(t)
        }, this.setDefaultAccount = function(t) {
            TD.storage.accountController.setDefault(t)
        }, this.getAccount = function(t) {
            return this.serializeAccount(TD.storage.accountController.get(t))
        }, this.removeAccount = function(t) {
            TD.controller.clients.removeClient(t)
        }, this.getAccountsForService = function(t) {
            var e = TD.storage.accountController.getAccountsForService(t);
            return this.serializeAccounts(e).sort(this.sortAccounts)
        }, this.serializeAccount = function(t) {
            var e = TD.storage.accountController.getDefault(),
                i = TD.storage.store.getTwitterLoginAccount();
            return {
                name: t.getName(),
                accountKey: t.getKey(),
                profileImageURL: t.getProfileImageURL(),
                userId: t.getUserID(),
                screenName: t.getUsername(),
                isProtected: t.getIsPrivate(),
                isDefault: t === e,
                isTwoginAccount: t === i,
                isAdmin: t.getIsAdmin()
            }
        }, this.serializeAccounts = function(t) {
            return t.map(this.serializeAccount.bind(this))
        }, this.sortAccounts = function(t, e) {
            var i, s;
            if (TD.storage.store.getTwitterLoginAccount()) {
                if (t.isTwoginAccount) return -1;
                if (e.isTwoginAccount) return 1
            } else {
                if (t.isDefault) return -1;
                if (e.isDefault) return 1
            }
            return i = t.screenName.toLowerCase(), s = e.screenName.toLowerCase(), s > i ? -1 : i > s ? 1 : 0
        }, this.reauthorizeAccount = function(t) {
            var e = TD.storage.accountController.get(t);
            TD.controller.clients.addClient(this.attr.service, e, !0)
        }, this.addAccount = function() {
            TD.controller.clients.addClient(this.attr.service)
        }, this.resetTweetdeckPassword = function() {
            var t = TD.storage.store.getTweetdeckAccount();
            return TD.controller.clients.getTDClient().forgotPassword(t)
        }, this.setIsAdmin = function(t, e) {
            var i = TD.storage.accountController.get(t);
            i.setIsAdmin(e)
        }
    }
    return t
}), define("data/accounts", ["require", "flight/lib/component", "data/with_client", "data/with_accounts"], function(t) {
    function e() {
        this.after("initialize", function() {
            this.on(document, "uiNeedsAccounts", this.handleUiNeedsAccounts), this.on(document, "uiNeedsAccount", this.handleUiNeedsAccount), this.on(document, "uiNeedsDefaultAccount", this.handleNeedsDefaultAccount), this.subscription = $.subscribe("/storage/client/default_account_changed", this.handleDefaultAccountChanged.bind(this)), this.subscriptionToAccountChange = $.subscribe("/storage/account/change", this.getAndSendAccounts.bind(this)), this.on(document, "dataAccountWhitelist", this.handleAccountWhitelist), this.on(document, "uiAccountAction", this.handleAccountAction), this.on(document, "dataContributorActionSuccess", this.handleContributorActionSuccess)
        }), this.before("teardown", function() {
            $.unsubscribe(this.subscription), $.unsubscribe(this.subscriptionToAccountChange)
        }), this.sendAccounts = function(t) {
            this.trigger(document, "dataAccounts", {
                accounts: t
            })
        }, this.sendAccount = function(t) {
            this.trigger(document, "dataAccount", {
                account: t
            })
        }, this.getAndSendAccounts = function() {
            var t = this.getAccountsForService("twitter");
            this.sendAccounts(t)
        }, this.getAndSendAccount = function(t) {
            var e = this.getAccount(t);
            this.sendAccount(e)
        }, this.handleDefaultAccountChanged = function() {
            this.trigger("dataDefaultAccount", {
                accountKey: this.getDefaultAccount().accountKey
            }), this.getAndSendAccounts(), this.trigger("dataTwitterClientChanged", {
                client: this.getTwitterClient()
            })
        }, this.handleUiNeedsAccounts = function() {
            this.getAndSendAccounts()
        }, this.handleUiNeedsAccount = function(t, e) {
            this.getAndSendAccount(e.accountKey)
        }, this.handleAccountWhitelist = function() {
            this.getAndSendAccounts()
        }, this.handleNeedsDefaultAccount = function() {
            var t = this.getDefaultAccount();
            t && this.trigger("dataDefaultAccount", t)
        }, this.handleAccountAction = function(t, e) {
            switch (e.action) {
                case "reauthorize":
                    this.reauthorizeAccount(e.accountKey);
                    break;
                case "remove":
                    this.removeAccount(e.accountKey);
                    break;
                case "setDefault":
                    this.setDefaultAccount(e.accountKey);
                    break;
                case "add":
                    this.addAccount();
                    break;
                case "passwordReset":
                    var i = this.resetTweetdeckPassword();
                    i.addCallbacks(function(t) {
                        this.trigger("dataAccountActionSuccess", {
                            request: e,
                            response: t
                        })
                    }.bind(this), function(t) {
                        this.trigger("dataAccountActionError", {
                            request: e,
                            response: t
                        })
                    }.bind(this))
            }
        }, this.handleContributorActionSuccess = function(t, e) {
            var i = this.getTwitterLoginAccount();
            if (i) switch (e.request.action) {
                case "remove":
                    e.request.userId === i.userId && this.removeAccount(e.request.accountKey);
                    break;
                case "update":
                    e.request.userId === i.userId && this.setIsAdmin(e.request.accountKey, e.request.isAdmin)
            }
        }
    }
    var i = t("flight/lib/component"),
        s = t("data/with_client"),
        n = t("data/with_accounts");
    return i(e, s, n)
}), define("data/column_manager", ["require", "flight/lib/component"], function(t) {
    var e = t("flight/lib/component"),
        i = function() {
            this.deleteColumn = function(t, e) {
                var i = e.columnId;
                i && TD.controller.columnManager.deleteColumn(i)
            }, this.moveColumn = function(t, e) {
                var i = e.columnId,
                    s = e.action;
                i && s && TD.controller.columnManager.move(i, s)
            }, this.handleUiNeedsSerializedColumn = function(t, e) {
                var i = TD.controller.columnManager.get(e.columnId),
                    s = {
                        feeds: _.map(i.getFeeds(), function(t) {
                            return t.state
                        }),
                        filters: i.getSearchFilter().toJSONObject()
                    };
                this.trigger("dataSerializedColumn", {
                    columnId: e.columnId,
                    column: s,
                    url: "https://tweetdeck.twitter.com/#column=" + TD.core.base64.encode(JSON.stringify(s))
                })
            }, this.after("initialize", function() {
                this.on(document, "uiDeleteColumnAction", this.deleteColumn), this.on(document, "uiMoveColumnAction", this.moveColumn), this.on(document, "uiNeedsSerializedColumn", this.handleUiNeedsSerializedColumn)
            })
        };
    return e(i)
}), define("data/with_twitter_api", ["flight/lib/compose", "data/with_client"], function(t, e) {
    return function() {
        t.mixin(this, [e]), this.after("initialize", function() {
            this.attr.baseUrl = this.attr.baseUrl || TD.config.twitter_api_base, this.attr.apiVersion = this.attr.apiVersion || TD.config.twitter_api_version
        }), this.wrapTwitterApiErrback = function(t) {
            return function(e) {
                var i = {
                    request: t.request,
                    response: e
                };
                "function" == typeof t.error ? t.error(i) : "string" == typeof t.error ? this.trigger(t.error, i) : this.trigger("dataTwitterApiError", {
                    error: "Unknown error"
                })
            }.bind(this)
        }, this.wrapTwitterApiCallback = function(t, e) {
            return function(i) {
                var s = {
                    request: t.request,
                    response: i
                };
                "function" == typeof t.success ? t.success(s) : "string" == typeof t.success ? this.trigger(t.success, s) : this.trigger("dataTwitterApiSuccess", s), t.processAsStreamData && e.processStreamData(i)
            }.bind(this)
        }, this.makeTwitterApiCall = function(t) {
            t = t || {};
            var e, i, s = this.getClientByAccountKey(t.request.accountKey),
                n = this.wrapTwitterApiErrback(t, s),
                o = this.wrapTwitterApiCallback(t, s);
            e = this.withTwitterApiUrl(t), i = t.method || "GET";
            try {
                return s.makeTwitterCall(e, t.params, i, t.dataProcessor, o, n, t.feedType)
            } catch (r) {
                n()
            }
        }, this.makeTwitterRequest = function(t, e, i) {
            var s = this.getClientByAccountKey(t),
                n = this.withTwitterApiUrl({
                    resource: e
                });
            return s.request(n, i)
        }, this.withTwitterApiUrl = function(t) {
            var e = [];
            return e.push(t.baseUrl || this.attr.baseUrl), e.push(t.apiVersion || this.attr.apiVersion), e.push(t.resource), e.join("/")
        }
    }
}), define("data/contributors", ["require", "flight/lib/component", "data/with_accounts", "data/with_twitter_api"], function(t) {
    function e() {
        this.defaultAttrs({
            baseUrl: "https://api-staging132.smf1.twitter.com"
        }), this.after("initialize", function() {
            this.on(document, "uiNeedsContributees", this.handleUiNeedsContributees), this.on(document, "uiRemoveContributee", this.handleUiRemoveContributee), this.on(document, "uiNeedsContributors", this.handleUiNeedsContributors), this.on(document, "uiContributorAction", this.handleUiContributorAction)
        }), this.triggerResult = function(t, e, i) {
            this.trigger(t, {
                request: e,
                response: i
            })
        }, this.handleUiNeedsContributees = function(t, e) {
            var i = this.makeTwitterRequest(e.accountKey, "users/contributees.json", {});
            i.addCallback(function(t) {
                var i = t.data.map(function(t) {
                    return {
                        id: t.user.id_str,
                        isAdmin: !! t.admin
                    }
                });
                this.trigger("dataContributees", {
                    accountKey: e.accountKey,
                    contributees: i
                })
            }.bind(this))
        }, this.handleUiRemoveContributee = function(t, e) {
            var i = this.makeTwitterRequest(e.accountKey, "users/contributees/destroy.json", {
                method: "POST",
                params: {
                    user_id: e.userId
                }
            });
            i.addCallbacks(this.triggerResult.bind(this, "dataContributeeRemoveSuccess", e), this.triggerResult.bind(this, "dataContributeeRemoveError", e))
        }, this.handleUiNeedsContributors = function(t, e) {
            var i = this.makeTwitterRequest(e.accountKey, "users/contributors.json", {});
            i.addCallback(function(t) {
                var i = this.processContributorsData(t.data, e.accountKey);
                this.trigger("dataContributors", {
                    accountKey: e.accountKey,
                    contributors: i
                })
            }.bind(this)), i.addErrback(this.triggerResult.bind(this, "dataContributorsError", e))
        }, this.processContributorsData = function(t, e) {
            var i = this.getAccount(e);
            return t.map(function(t) {
                return {
                    user: new TD.services.TwitterUser(i).fromJSONObject(t.user),
                    isAdmin: t.admin
                }
            })
        }, this.handleUiContributorAction = function(t, e) {
            var i;
            e.userId ? i = TD.core.defer.succeed() : (i = TD.cache.twitterUsers.getByScreenName(e.screenName), i.addCallback(function(t) {
                e.userId = t.id
            })), i.addCallback(this.performContributorAction.bind(this, e)), i.addCallbacks(this.triggerResult.bind(this, "dataContributorActionSuccess", e), this.triggerResult.bind(this, "dataContributorActionError", e))
        }, this.updateContributor = function(t) {
            var e = this.makeTwitterRequest(t.accountKey, "users/contributors/update.json", {
                method: "POST",
                params: {
                    user_id: t.userId,
                    admin: !! t.isAdmin
                }
            });
            return e.addCallback(function(e) {
                var i = this.processContributorsData(e.data, t.accountKey);
                return this.trigger("dataContributor", {
                    accountKey: t.accountKey,
                    contributor: i[0]
                }), e
            }.bind(this)), e
        }, this.removeContributor = function(t) {
            return this.makeTwitterRequest(t.accountKey, "users/contributors/destroy.json", {
                method: "POST",
                params: {
                    user_id: t.userId
                }
            })
        }, this.performContributorAction = function(t) {
            var e;
            switch (t.action) {
                case "add":
                case "update":
                    e = this.updateContributor(t);
                    break;
                case "remove":
                    e = this.removeContributor(t);
                    break;
                default:
                    e = TD.core.defer.fail()
            }
            return e
        }
    }
    var i = t("flight/lib/component"),
        s = t("data/with_accounts"),
        n = t("data/with_twitter_api");
    return i(e, s, n)
}), define("data/embed_timeline", ["flight/lib/component", "data/with_client"], function(t, e) {
    function i() {
        this.checkListSubscription = function(t, e, i) {
            var s = _.uniqueId(),
                n = {
                    id: s,
                    title: TD.i("Subscribe to this list?"),
                    message: [TD.i("To share this list, we need to subscribe you to it."), TD.i("Subscribe and share?")].join("\n"),
                    okLabel: TD.i("OK"),
                    cancelLabel: TD.i("Cancel")
                }, o = function() {
                    TD.util.openURL(e, i)
                }, r = function(e, i) {
                    var n;
                    i.id === s && (this.off(document, "uiConfirmationAction", r), i.result && (n = this.getTwitterClient(), n.subscribeToList(t, o)))
                }, a = this.getTwitterClient().oauth.account.getKey(),
                c = TD.cache.lists.find(t, null, null, !1, a);
            c ? o() : (this.on(document, "uiConfirmationAction", r.bind(this)), this.trigger("uiShowConfirmationDialog", n))
        }, this.openEmbedTimeline = function(t, e) {
            var i, s, n, o = "https://twitter.com/settings/widgets/new/",
                r = {};
            if (e && e.column && e.column.isEmbeddable()) {
                switch (i = e.column.getFeeds()[0], s = i.getMetadata(), e.column.getColumnType()) {
                    case TD.util.columnUtils.columnMetaTypes.USERTWEETS:
                        o += "user", r.user_id = s.id ? s.id : TD.storage.accountController.get(i.getAccountKey()).getUserID();
                        break;
                    case TD.util.columnUtils.columnMetaTypes.FAVORITES:
                        o += "favorites", r.user_id = s.id ? s.id : TD.storage.accountController.get(i.getAccountKey()).getUserID();
                        break;
                    case TD.util.columnUtils.columnMetaTypes.LIST:
                        return o += "list", r.list_id = s.listId, this.checkListSubscription(s.listId, o, r), void 0;
                    case TD.util.columnUtils.columnMetaTypes.SEARCH:
                        o += "search", s.baseQuery && s.searchFilterData ? (n = new TD.vo.SearchFilter(s.searchFilterData), r.query = [s.baseQuery, n.getQueryString()].join(" ").trim()) : r.query = s.term;
                        break;
                    case TD.util.columnUtils.columnMetaTypes.CUSTOMTIMELINE:
                        o += "custom", r.timeline_id = s.id.replace(/[^\d]*/, "")
                }
                TD.util.openURL(o, r)
            }
        }, this.after("initialize", function() {
            this.on(document, "uiEmbedTimelineAction", this.openEmbedTimeline)
        })
    }
    return t(i, e)
}), define("data/embed_tweet", ["flight/lib/component", "data/with_client"], function(t, e) {
    function i() {
        this.handleEmbeddedTweetFactory = function(t) {
            return function(e) {
                e.request = t, this.trigger(document, "dataEmbeddedTweet", e)
            }
        }, this.handleErrorFactory = function(t) {
            return function() {
                var e = {
                    request: t
                };
                this.trigger(document, "dataEmbeddedTweetError", e)
            }
        }, this.getEmbeddedTweet = function(t, e) {
            if (e && e.tweetID) {
                var i = this.getTwitterClient();
                i.getEmbeddedTweet(e.tweetID, e.hideThread, e.hideMedia, e.maxWidth, this.handleEmbeddedTweetFactory(e).bind(this), this.handleErrorFactory(e).bind(this))
            }
        }, this.after("initialize", function() {
            this.on(document, "uiNeedsEmbeddedTweet", this.getEmbeddedTweet)
        })
    }
    return t(i, e)
}), define("util/with_version_comparator", [], function() {
    var t = function() {
        this.appSatisfiesVersionRequirements = function(t) {
            var e = TD.version,
                i = t.split(" ");
            return _.all(i, function(t) {
                var i, s = t.match(/[<=>]*/)[0],
                    n = t.substr(s.length),
                    o = [];
                return _.contains(s, ">") ? o.push(1) : _.contains(s, "<") && o.push(-1), (_.contains(s, "=") || 0 === s.length) && o.push(0), i = TD.util.versionComparator(e, n), _.contains(o, i)
            })
        }
    };
    return t
}), define("data/message_banner", ["flight/lib/component", "util/with_version_comparator"], function(t, e) {
    var i = function() {
        this.dismissMessage = function(t, e) {
            this.updateIdsForSeenMessages(), this.idsForSeenMessages.push(e.id), TD.settings.setIdsForSeenMessages(this.idsForSeenMessages)
        }, this.satisfiesPlatformRequirements = function(t) {
            if (t.target && t.target.platform) {
                var e = TD.util.getAppEnv();
                return _.include(t.target.platform, e)
            }
            return !0
        }, this.satisfiesVersionRequirements = function(t) {
            return t.target && t.target.version ? this.appSatisfiesVersionRequirements(t.target.version) : !0
        }, this.hasNotBeenDismissed = function(t) {
            if (t.message) {
                this.updateIdsForSeenMessages();
                var e = this.idsForSeenMessages.every(function(e) {
                    return t.message.id !== e
                });
                return e
            }
            return !1
        }, this.updateIdsForSeenMessages = function() {
            var t = TD.settings.getIdsForSeenMessages();
            this.idsForSeenMessages = _.union(this.idsForSeenMessages, t)
        }, this.handleMessages = function(t, e) {
            var i = e.messages;
            i && (i = i.filter(this.satisfiesPlatformRequirements, this), i = i.filter(this.satisfiesVersionRequirements, this), i = i.filter(this.hasNotBeenDismissed, this), i.length && this.trigger("dataMessage", i[0]))
        }, this.after("initialize", function() {
            this.on(document, "uiHidingMessageBanner", this.dismissMessage), this.on(document, "dataMessages", this.handleMessages)
        })
    };
    return t(i, e)
}), define("data/preferred_account", ["flight/lib/component"], function(t) {
    function e() {
        this.send = function(t) {
            this.trigger(document, "dataPreferredAccount", {
                account: t
            })
        }, this.getPreferredTwitterAccount = function() {
            this.ready && this.send(TD.storage.accountController.getPreferredAccount("twitter"))
        }, this.tdReady = function() {
            this.ready = !0, this.getPreferredTwitterAccount(), this.off(document, "TD.ready", this.tdReady)
        }, this.after("initialize", function() {
            this.on(document, "uiNeedsPreferredAccount", this.getPreferredTwitterAccount), this.on(document, "TD.ready", this.tdReady), $.subscribe("/storage/account/new", this.getPreferredTwitterAccount.bind(this)), $.subscribe("/storage/client/default_account_changed", this.getPreferredTwitterAccount.bind(this))
        })
    }
    return t(e)
}), define("data/relationship", ["flight/lib/component", "data/with_client"], function(t, e) {
    function i() {
        this.handleRelationship = function(t) {
            this.trigger(document, "dataRelationship", t)
        }, this.handleError = function(t) {
            return function() {
                this.trigger(document, "dataRelationshipError", t)
            }
        }, this.getRelationship = function(t, e) {
            if (e && e.account && e.screenName) {
                var i = this.getClientByAccount(e.account);
                i.showFriendship(e.account.getUserID(), null, e.screenName, this.handleRelationship.bind(this), this.handleError(e).bind(this))
            }
        }, this.after("initialize", function() {
            this.on(document, "uiNeedsRelationship", this.getRelationship)
        })
    }
    return t(i, e)
}), define("data/favorite", ["require", "flight/lib/component", "data/with_client"], function(t) {
    function e() {
        this.after("initialize", function() {
            this.on("uiNeedsFavoriteState", this.getFavoriteState), this.on("uiFavoriteTweet", this.handleFavoriteTweet), this.on("uiUnfavoriteTweet", this.handleUnfavoriteTweet)
        }), this.handleErrorFactory = function(t, e) {
            return function(i) {
                this.trigger(document, e, {
                    request: t,
                    error: i
                })
            }.bind(this)
        }, this.handleFavoriteState = function(t) {
            this.trigger("dataFavoriteState", {
                tweetId: t.id,
                isFavorite: t.isFavorite,
                accountKey: t.account.getKey()
            })
        }, this.handleFavoriteTweet = function(t, e) {
            var i = this.getClientByAccountKey(e.accountKey);
            i.favorite(e.tweetId, this.handleFavoriteSuccessFactory(e, !0), this.handleErrorFactory(e, "dataFavoriteError"))
        }, this.handleUnfavoriteTweet = function(t, e) {
            var i = this.getClientByAccountKey(e.accountKey);
            i.unfavorite(e.tweetId, this.handleFavoriteSuccessFactory(e, !1), this.handleErrorFactory(e, "dataFavoriteError"))
        }, this.handleFavoriteSuccessFactory = function(t, e) {
            return function() {
                this.trigger("dataFavoriteState", {
                    tweetId: t.tweetId,
                    accountKey: t.accountKey,
                    isFavorite: e
                })
            }.bind(this)
        }, this.getFavoriteState = function(t, e) {
            var i = this.getClientByAccountKey(e.accountKey);
            i.show(e.tweetId, this.handleFavoriteState.bind(this), this.handleErrorFactory(e, "dataFavoriteStateError").bind(this))
        }
    }
    var i = t("flight/lib/component"),
        s = t("data/with_client");
    return i(e, s)
}), define("data/twitter_user", ["flight/lib/component"], function(t) {
    function e() {
        this.getTwitterUser = function(t, e) {
            var i;
            e && (i = e.id ? TD.cache.twitterUsers.getById(e.id) : TD.cache.twitterUsers.getByScreenName(e.screenName), i.addCallbacks(this.handleTwitterUser, this.errorHandlerFactory(e.screenName), null, null, this, this))
        }, this.errorHandlerFactory = function(t) {
            var e = function(e) {
                var i = e.req.errors,
                    s = TD.i("Sorry, we couldn't retrieve user @{{1}}", {
                        1: t
                    }),
                    n = !1;
                i && i.forEach(function(t) {
                    63 === t.twitterErrorCode ? n = !0 : t.message && (s += " - " + t.message)
                }), n || TD.controller.progressIndicator.addMessage(s), this.trigger("dataTwitterUserError", {
                    screenName: t
                })
            };
            return e.bind(this)
        }, this.handleTwitterUser = function(t) {
            t && t.account && this.trigger(document, "dataTwitterUser", t)
        }, this.after("initialize", function() {
            this.on(document, "uiNeedsTwitterUser", this.getTwitterUser)
        })
    }
    return t(e)
}), define("data/user_actions", ["flight/lib/component", "data/with_client"], function(t, e) {
    var i = function() {
        this.defaultAttrs({
            actions: {
                follow: {
                    userAction: "follow",
                    errorEvent: "dataFollowActionError"
                },
                unfollow: {
                    userAction: "unfollow",
                    errorEvent: "dataUnfollowActionError"
                },
                block: {
                    userAction: "block",
                    errorEvent: "dataBlockActionError"
                },
                unblock: {
                    userAction: "unblock",
                    errorEvent: "dataUnblockActionError"
                },
                report: {
                    userAction: "report",
                    errorEvent: "dataReportActionError"
                },
                reportSpam: {
                    userAction: "reportSpam",
                    errorEvent: "dataReportSpamActionError"
                },
                reportCompromised: {
                    userAction: "reportCompromised",
                    errorEvent: "dataReportCompromisedActionError"
                }
            }
        }), this.error = function(t, e) {
            return function(i) {
                var s;
                s = {
                    request: e,
                    response: i
                }, this.trigger(document, t.errorEvent, s)
            }
        }, this.success = function(t, e) {
            return function(i) {
                this.trigger("dataFollowStateChange", {
                    action: t,
                    request: e,
                    response: i
                })
            }
        }, this.takeAction = function(t, e, i) {
            var s = !1,
                n = this.success(t, i).bind(this),
                o = this.error(t, i).bind(this),
                r = t.userAction;
            try {
                switch (r) {
                    case "block":
                        i.twitterUser.block(i.account, !1, n, o, s);
                        break;
                    case "reportSpam":
                        i.twitterUser.block(i.account, !0, n, o, s);
                        break;
                    case "unblock":
                        i.twitterUser.unblock(i.account, n, o);
                        break;
                    case "follow":
                        i.twitterUser.follow(i.account, n, o, s);
                        break;
                    case "unfollow":
                        i.twitterUser.unfollow(i.account, n, o, s)
                }
            } catch (a) {
                this.error()
            }
        }, this.bindAction = function(t) {
            return this.takeAction.bind(this, t)
        }, this.after("initialize", function() {
            this.on(document, "uiFollowAction", this.bindAction(this.attr.actions.follow)), this.on(document, "uiUnfollowAction", this.bindAction(this.attr.actions.unfollow)), this.on(document, "uiBlockAction", this.bindAction(this.attr.actions.block)), this.on(document, "uiUnblockAction", this.bindAction(this.attr.actions.unblock)), this.on(document, "uiReportSpamAction", this.bindAction(this.attr.actions.reportSpam)), this.on(document, "uiReportCompromisedAction", this.bindAction(this.attr.actions.reportCompromised))
        })
    };
    return t(i, e)
}), define("data/settings", ["flight/lib/component"], function(t) {
    function e() {
        this.after("initialize", function() {
            this.on(document, "uiNeedsSettings", this.handleUiNeedsSettings), this.on(document, "uiNeedsSettingsValues", this.handleUiNeedsSettingsValues), this.on(document, "uiSetSettingsValues", this.handleUiSetSettingsValues), this.on(document, "uiToggleTheme", this.toggleTheme), this.on(document, "uiNavbarWidthChangeAction", this.handleNavbarWidthChange), this.on(document, "uiChangeComposeStayOpen", this.handleComposeStayOpen)
        }), this.handleUiNeedsSettings = function() {
            this.settings = {
                theme: TD.settings.getTheme(),
                navbarWidth: TD.settings.getNavbarWidth(),
                composeStayOpen: TD.settings.getComposeStayOpen()
            }, this.trigger(document, "dataSettings", this.settings)
        }, this.handleUiNeedsSettingsValues = function(t, e) {
            var i = {};
            e.keys.forEach(function(t) {
                switch (t) {
                    case "link_shortener":
                        i[t] = TD.settings.getLinkShortener()
                }
            }), this.trigger(document, "dataSettingsValues", i)
        }, this.handleUiSetSettingsValues = function(t, e) {
            e.keys.forEach(function(t) {
                switch (t) {
                    case "link_shortener":
                        TD.settings.setLinkShortener(e.values[t])
                }
            })
        }, this.toggleTheme = function() {
            var t = this.settings.theme;
            t = "light" === t ? "dark" : "light", TD.settings.setTheme(t), this.settings.theme = t, this.trigger(document, "dataSettings", this.settings)
        }, this.handleNavbarWidthChange = function(t, e) {
            TD.settings.setNavbarWidth(e.navbarWidth), this.settings.navbarWidth = e.navbarWidth, this.trigger(document, "dataSettings", this.settings)
        }, this.handleComposeStayOpen = function(t, e) {
            TD.settings.setComposeStayOpen(e.composeStayOpen), this.settings.composeStayOpen = e.composeStayOpen, this.trigger(document, "dataSettings", this.settings)
        }
    }
    return t(e)
}), define("data/stream_counter", ["flight/lib/component"], function(t) {
    var e = function() {
        this.defaultAttrs({
            updatePeriod: 500,
            aggregationPeriod: 1e4
        }), this.updateStreamCount = function(t, e) {
            this.streamCounter.incrementCounter(e.numStreamItems)
        }, this.after("initialize", function() {
            this.on(document, "dataReceivedStreamData", this.updateStreamCount), this.streamCounter = new TD.util.TpmCounter(this.attr.updatePeriod, this.attr.aggregationPeriod, "dataStreamRate")
        })
    };
    return t(e)
}), define("data/user_search", ["flight/lib/component", "data/with_client"], function(t, e) {
    function i() {
        this.handleResponseFactory = function(t, e) {
            return function(i) {
                this.trigger(document, t, {
                    request: e,
                    result: i
                })
            }.bind(this)
        }, this.doUserSearch = function(t, e) {
            var i = this.getPreferredClient("twitter"),
                s = e.query;
            i ? i.userSearch(s, this.handleResponseFactory("dataUserSearch", e), this.handleResponseFactory("dataUserSearchError", e)) : this.handleResponseFactory("dataUserSearchError", e)()
        }, this.doUserLookup = function(t, e) {
            var i = this.getPreferredClient("twitter");
            i ? i.showUser(e.id, e.screenName, this.handleResponseFactory("dataUserLookup", e), this.handleResponseFactory("dataUserLookupError", e)) : this.handleResponseFactory("dataUserLookupError", e)()
        }, this.after("initialize", function() {
            this.on(document, "uiNeedsUserSearch", this.doUserSearch), this.on(document, "uiNeedsUserLookup", this.doUserLookup)
        })
    }
    return t(i, e)
}), define("data/recent_searches", ["flight/lib/component"], function(t) {
    var e = function() {
        this.saveRecentSearch = function(t, e) {
            TD.storage.clientController.client.addRecentSearch(e.query)
        }, this.getRecentSearches = function() {
            var t = {
                recentSearches: TD.storage.clientController.client.getRecentSearches()
            };
            this.trigger("dataRecentSearches", t)
        }, this.clearRecentSearches = function() {
            TD.storage.clientController.client.clearRecentSearches()
        }, this.after("initialize", function() {
            this.on(document, "uiSearch", this.saveRecentSearch), this.on(document, "uiRecentSearchClearAction", this.clearRecentSearches), this.on(document, "uiNeedsRecentSearches", this.getRecentSearches)
        })
    };
    return t(e)
}), define("data/typeahead/with_users_datasource", [], function() {
    function t() {
        this.defaultAttrs({
            usersStorageLimit: 2500,
            storageUserHash: "typeaheadUserHash",
            storageUserLastPrefetch: "typeaheadUserLastPrefetch"
        }), this.tokenize = function(t) {
            return t.trim().toLowerCase().split(TD.constants.regexps.tokenSeparator)
        }, this.overwriteUserdata = function(t) {
            this.userHash = {}, this.userAdjacencyList = {}, this.processUserData(t)
        }, this.processUserData = function(t) {
            _.each(t, function(t) {
                t.tokens = t.tokens.map(function(t) {
                    return t = "string" == typeof t ? t : t.token, t.toLowerCase()
                }), 0 === t.tokens.length && (t.tokens = this.tokenize(t.name), t.tokens.push(t.screen_name), t.tokens.push(TD.util.atMentionify(t.screen_name)), t.tokens = t.tokens.map(function(t) {
                    return t.toLowerCase()
                })), delete t.location, delete t.connecting_user_ids, this.userHash[t.id] = t, t.tokens.forEach(function(e) {
                    var i = e.charAt(0);
                    void 0 === this.userAdjacencyList[i] && (this.userAdjacencyList[i] = []), -1 === this.userAdjacencyList[i].indexOf(t.id) && this.userAdjacencyList[i].push(t.id)
                }, this)
            }, this);
            var e = {};
            e[this.attr.storageUserHash] = this.userHash, this.trigger("dataStorageSet", e)
        }, this.processPrefetchUserData = function(t) {
            this.processUserData(t.users);
            var e = {};
            e[this.attr.storageUserLastPrefetch] = Date.now(), this.trigger("dataStorageSet", e)
        }, this.prefetchUserSuggestions = function() {
            var t = this.getTwitterClient();
            t && t.typeaheadSearch({
                prefetch: !0,
                count: this.attr.usersStorageLimit
            }, this.processPrefetchUserData.bind(this), this.handleGetSuggestionsError.bind(this))
        }, this.pruneUsers = function() {
            var t = _.values(this.userHash);
            t.sort(this.userSortComparator), t = t.slice(0, Math.floor(t.length / 2)), this.overwriteUserdata(t)
        }, this.getUserSuggestions = function(t, e) {
            var i, s, n, o = [];
            return i = this.tokenize(t.query), s = this.getPotentiallyMatchingUserIds(i), n = this.getUsersFromIds(s), o = n.filter(this.matchUsers(i)), o.sort(this.userSortComparator), o = o.slice(0, e)
        }, this.getPotentiallyMatchingUserIds = function(t) {
            var e = [];
            return t.map(function(t) {
                var i = this.userAdjacencyList[t.charAt(0)];
                i && (e = e.concat(i))
            }, this), e = _.uniq(e)
        }, this.getUsersFromIds = function(t) {
            var e = [];
            return t.forEach(function(t) {
                var i = this.userHash[t];
                i && !this.isUserBlocked(t) && e.push(i)
            }, this), e
        }, this.matchUsers = function(t) {
            return function(e) {
                var i = e.tokens,
                    s = t.every(function(t) {
                        var e = i.filter(function(e) {
                            return 0 === e.indexOf(t)
                        });
                        return e.length
                    });
                return s ? e : void 0
            }
        }, this.userSortComparator = function(t, e) {
            var i = 0 !== t.rounded_graph_weight,
                s = 0 !== e.rounded_graph_weight;
            return i && !s ? -1 : s && !i ? 1 : i && s ? e.rounded_graph_weight - t.rounded_graph_weight : e.rounded_score - t.rounded_score
        }, this.isUserBlocked = function(t) {
            return this.blockedUserIds[t] ? !0 : !1
        }, this.processUserStorageItem = function(t, e) {
            switch (e.name) {
                case this.attr.storageUserHash:
                    this.processUserData(e.value);
                    break;
                case this.attr.storageUserLastPrefetch:
                    ("number" != typeof e.value || Date.now() - e.value > TD.constants.time.oneDay) && this.prefetchUserSuggestions()
            }
        }, this.loadUserData = function() {
            this.trigger("dataStorageGet", {
                names: [this.attr.storageUserHash, this.attr.storageUserLastPrefetch]
            });
            var t = this.getTwitterClient();
            t && (this.blockedUserIds = t.blocks)
        }, this.resetUserData = function(t, e) {
            e.client && (this.overwriteUserdata([]), this.blockedUserIds = e.client.blocks, this.prefetchUserSuggestions())
        }, this.after("initialize", function() {
            this.userAdjacencyList = {}, this.userHash = {}, this.blockedUserIds = {}, this.datasources = this.datasources || {}, this.datasources.users = {
                processData: this.processUserData.bind(this),
                getSuggestions: this.getUserSuggestions.bind(this)
            }, this.on(document, "dataStorageItem", this.processUserStorageItem), this.on(document, "TD.ready", this.loadUserData), this.on(document, "dataTwitterClientChanged", this.resetUserData), this.on(document, "dataStorageFull", this.pruneUsers)
        })
    }
    return t
}), define("data/typeahead/with_topics_datasource", [], function() {
    var t = function() {
        this.defaultAttrs({
            storageTopicsHash: "typeaheadTopicsHash",
            storageTopicsLastPrefetch: "typeaheadTopicsLastPrefetch"
        }), this.tokenize = function(t) {
            return t.trim().toLowerCase().split(TD.constants.regexps.tokenSeparator)
        }, this.topicSortComparator = function(t, e) {
            return e.rounded_score - t.rounded_score
        }, this.overwriteTopics = function(t) {
            this.topicsHash = {}, this.topicsAdjacencyList = {}, this.processTopicData(t)
        }, this.processTopicData = function(t) {
            _.each(t, function(t) {
                var e, i = t.topic;
                this.topicsHash[i] = t, 0 === t.tokens.length && (e = this.tokenize(t.topic), t.tokens = e.map(function(t) {
                    return {
                        token: t.toLowerCase()
                    }
                })), t.tokens.forEach(function(t) {
                    var e = t.token.charAt(0).toLowerCase(),
                        s = this.topicsAdjacencyList[e] || []; - 1 === s.indexOf(i) && s.push(i), this.topicsAdjacencyList[e] = s
                }, this)
            }, this);
            var e = {};
            e[this.attr.storageTopicsHash] = this.topicsHash, this.trigger("dataStorageSet", e)
        }, this.processPrefetchTopicData = function(t) {
            this.processTopicData(t.topics), this.topicsLastPrefetch = Date.now();
            var e = {};
            e[this.attr.storageTopicsLastPrefetch] = this.topicsLastPrefetch, this.trigger("dataStorageSet", e)
        }, this.pruneTopics = function() {
            var t = _.values(this.topicsHash);
            t.sort(this.topicSortComparator), t = t.slice(0, Math.floor(t.length / 2)), this.overwriteTopics(t)
        }, this.getTopicSuggestions = function(t, e) {
            var i = t.query.toLowerCase(),
                s = this.topicsAdjacencyList[i.charAt(0)] || [],
                n = s.filter(function(t) {
                    return 0 === t.toLowerCase().indexOf(i)
                }, this);
            return n = this.getTopicObjectsFromStrings(n), n.sort(this.topicSortComparator), n = n.slice(0, e)
        }, this.getTopicObjectsFromStrings = function(t) {
            var e = [];
            return t.forEach(function(t) {
                var i = this.topicsHash[t];
                i && e.push(i)
            }, this), e
        }, this.prefetchTopicsSuggestions = function() {
            var t = this.getTwitterClient();
            t.typeaheadSearch({
                query: "",
                prefetch: !0,
                limit: 200,
                datasources: ["topics"]
            }, this.processPrefetchTopicData.bind(this), this.handleGetSuggestionsError.bind(this))
        }, this.processTopicStorageItem = function(t, e) {
            switch (e.name) {
                case this.attr.storageTopicsHash:
                    this.processTopicData(e.value);
                    break;
                case this.attr.storageTopicsLastPrefetch:
                    this.topicsLastPrefetch = e.value, (!this.topicsLastPrefetch || Date.now() - this.topicsLastPrefetch > TD.constants.time.oneDay) && this.prefetchTopicsSuggestions()
            }
        }, this.loadTopicsData = function() {
            this.trigger("dataStorageGet", {
                names: [this.attr.storageTopicsHash, this.attr.storageTopicsLastPrefetch]
            })
        }, this.resetTopicData = function(t, e) {
            e.client && (this.overwriteTopics([]), this.prefetchTopicsSuggestions())
        }, this.after("initialize", function() {
            this.topicsHash = {}, this.topicsAdjacencyList = {}, this.datasources = this.datasources || {}, this.datasources.topics = {
                getSuggestions: this.getTopicSuggestions.bind(this),
                processData: this.processTopicData.bind(this)
            }, this.on(document, "dataStorageItem", this.processTopicStorageItem), this.on(document, "TD.ready", this.loadTopicsData), this.on(document, "dataTwitterClientChanged", this.resetTopicData), this.on(document, "dataStorageFull", this.pruneTopics)
        })
    };
    return t
}), define("data/typeahead/with_recent_searches_datasource", [], function() {
    var t = function() {
        this.tokenize = function(t) {
            return t.trim().toLowerCase().split(TD.constants.regexps.tokenSeparator)
        }, this.getRecentSearchSuggestions = function(t, e) {
            if (this.trigger("uiNeedsRecentSearches"), !this.recentSearches) return [];
            var i = this.recentSearches,
                s = this.tokenize(t.query),
                n = i.filter(function(t) {
                    var e = this.tokenize(t),
                        i = this.recentSearchMatchesQuery(e, s);
                    return i
                }, this);
            return n.slice(0, e)
        }, this.recentSearchMatchesQuery = function(t, e) {
            var i = e.every(function(e) {
                return t.some(function(t) {
                    return 0 === t.indexOf(e)
                })
            });
            return i
        }, this.handleRecentSearches = function(t, e) {
            e && e.recentSearches && (this.recentSearches = e.recentSearches)
        }, this.processRecentSearchData = function() {}, this.after("initialize", function() {
            this.datasources = this.datasources || {}, this.datasources.recentSearches = {
                getSuggestions: this.getRecentSearchSuggestions.bind(this),
                processData: this.processRecentSearchData.bind(this)
            }, this.on(document, "dataRecentSearches", this.handleRecentSearches)
        })
    };
    return t
}), define("data/typeahead/with_saved_searches_datasource", [], function() {
    var t = function() {
        this.tokenize = function(t) {
            return t.trim().toLowerCase().split(TD.constants.regexps.tokenSeparator)
        }, this.savedSearchesComparator = function(t, e) {
            var i = t.query.toLowerCase(),
                s = e.query.toLowerCase();
            return (i > s) - (s > i)
        }, this.updateSavedSearches = function() {
            var t = Date.now() - TD.constants.time.oneHour;
            if (!this.savedSearchesLastFetch || this.savedSearchesLastFetch < t) {
                var e = this.getClientsByService("twitter");
                this.savedSearches = [], e.forEach(function(t) {
                    this.savedSearches = this.savedSearches.concat(t.searches)
                }, this), this.savedSearchesLastFetch = Date.now()
            }
        }, this.getSavedSearchSuggestions = function(t) {
            if ("" === t.query.trim()) return [];
            var e = t.datasources && t.datasources.some(function(t) {
                return "savedSearches" === t
            });
            if (!e) return [];
            var i = [],
                s = this.tokenize(t.query);
            return this.updateSavedSearches(), this.savedSearches.forEach(function(t) {
                var e = this.tokenize(t.query),
                    n = this.savedSearchMatchesQuery(e, s);
                n && i.push(t)
            }, this), i.sort(this.savedSearchesComparator), i.splice(this.attr.limit), i
        }, this.savedSearchMatchesQuery = function(t, e) {
            return e.every(function(e) {
                return t.some(function(t) {
                    return 0 === t.indexOf(e)
                })
            })
        }, this.processSavedSearchData = function() {}, this.after("initialize", function() {
            this.savedSearches = [], this.savedSearchesLastFetch = !1, this.datasources = this.datasources || {}, this.datasources.savedSearches = {
                getSuggestions: this.getSavedSearchSuggestions.bind(this),
                processData: this.processSavedSearchData.bind(this)
            }
        })
    };
    return t
}), define("data/typeahead/with_lists_datasource", [], function() {
    var t = function() {
        this.getListSuggestions = function(t, e) {
            var i = t.query.trim().toLowerCase();
            if (this.trigger("uiNeedsSubscribedLists"), !this.lists) return [];
            var s = this.lists.filter(function(t) {
                var e = -1 !== t.user.screenName.toLowerCase().indexOf(i) || -1 !== t.name.toLowerCase().indexOf(i);
                return e
            }, this);
            return s.slice(0, e)
        }, this.handleSubscribedLists = function(t, e) {
            e && e.lists && (this.lists = e.lists)
        }, this.processListData = function() {}, this.after("initialize", function() {
            this.datasources = this.datasources || {}, this.datasources.lists = {
                getSuggestions: this.getListSuggestions.bind(this),
                processData: this.processListData.bind(this)
            }, this.on(document, "dataSubscribedLists", this.handleSubscribedLists)
        })
    };
    return t
}), define("data/typeahead", ["flight/lib/component", "data/with_client", "data/typeahead/with_users_datasource", "data/typeahead/with_topics_datasource", "data/typeahead/with_recent_searches_datasource", "data/typeahead/with_saved_searches_datasource", "data/typeahead/with_lists_datasource"], function(t, e, i, s, n, o, r) {
    var a = function() {
        this.defaultAttrs({
            count: 5,
            limits: {
                "default": 5,
                lists: 2
            },
            recentSearchOnlyLimit: 10,
            timing: {
                "default": 150,
                search: 150,
                compose: 300
            }
        }), this.getLimit = function(t, e) {
            if (!t) throw new Error("Please provide datasource limits.");
            return e = e || "default", t[e] || (e = "default"), t[e]
        }, this.sendSuggestions = function() {
            this.trigger("dataTypeaheadSuggestions", {
                query: this.currentRequest.query,
                suggestions: this.dedupeSuggestions(this.suggestions),
                datasources: this.currentRequest.datasources,
                dropdownId: this.currentRequest.dropdownId
            })
        }, this.dedupeSuggestions = function(t) {
            var e = {};
            return t = _.clone(t), t.recentSearches = this.dedupeArray(t.recentSearches, null, e), t.savedSearches = this.dedupeArray(t.savedSearches, "query", e), t.topics = this.dedupeArray(t.topics, "topic", e), t
        }, this.dedupeArray = function(t, e, i) {
            return t && 0 !== t.length ? _.filter(t, function(t) {
                var s = e ? t[e] : t,
                    n = s.toLowerCase(),
                    o = !i[n];
                return i[n] = !0, o
            }) : t
        }, this.processTypeaheadData = function(t, e) {
            e.query === this.currentRequest.query && (e.datasources.forEach(function(e) {
                var i = this.datasources[e],
                    s = t[e],
                    n = this.getLimit(this.attr.limits, e);
                i && s && (i.processData(s), this.suggestions[e] = i.getSuggestions(this.currentRequest, n))
            }, this), this.sendSuggestions())
        }, this.updateSuggestions = function() {
            this.currentRequest && this.currentRequest.datasources && (this.currentRequest.datasources.forEach(function(t) {
                var e = this.datasources[t],
                    i = this.getLimit(this.attr.limits, t);
                if (e) {
                    var s = e.getSuggestions(this.currentRequest, i);
                    s && s.length > 0 && (this.suggestions[t] = s)
                }
            }, this), this.sendSuggestions())
        }, this.handleGetSuggestionsError = function() {
            this.trigger("dataTypeaheadSuggestionsError")
        }, this._getRemoteSuggestions = function() {
            var t = this.getTwitterClient();
            this.currentRequest.query && "" !== this.currentRequest.query.trim() && void 0 !== t && t.typeaheadSearch(this.currentRequest, this.processTypeaheadData.bind(this), this.handleGetSuggestionsError.bind(this))
        }, this.getSuggestions = function(t, e) {
            e.query !== this.currentRequest.query && (this.currentRequest = {
                query: e.query,
                datasources: e.datasources,
                count: this.attr.count,
                dropdownId: e.dropdownId,
                limits: e.limits || {}
            }, this.suggestions = {}, this.updateSuggestions(), e.onlyLocalData || this.getRemoteSuggestions(e.type))
        }, this.queryReset = function() {
            this.currentRequest = {}
        }, this.getRemoteSuggestions = function(t) {
            t = t || "default", this.attr.timing[t] || (t = "default");
            var e = this.getRemoteSuggestionsByType[t];
            if (!e) throw new Error("No matching remote suggestion debounce type.");
            return e()
        }, this.after("initialize", function() {
            this.currentRequest = {}, this.datasources = {}, this.suggestions = {}, this.getRemoteSuggestionsByType = _.reduce(this.attr.timing, function(t, e, i) {
                return t[i] = _.throttle(this._getRemoteSuggestions.bind(this), e, {
                    leading: !1
                }), t
            }, {}, this), this.on("uiNeedsTypeaheadSuggestions", this.getSuggestions), this.on("uiRecentSearchClearAction", this.updateSuggestions), this.on("dataTypeaheadQueryReset", this.queryReset)
        })
    };
    return t(a, e, i, s, n, o, r)
}), define("data/user_profile_social_proof", ["flight/lib/component", "data/with_client"], function(t, e) {
    function i() {
        this.handleUserProfileSocialProofFactory = function(t) {
            return function(e) {
                e.request = t, this.trigger(document, "dataUserProfileSocialProof", e)
            }
        }, this.handleErrorFactory = function(t) {
            return function() {
                var e = {
                    request: t
                };
                this.trigger(document, "dataUserProfileSocialProofError", e)
            }
        }, this.getUserProfileSocialProofData = function(t, e) {
            if (e && e.screenName) {
                var i = this.getTwitterClient();
                i.getFollowingFollowersOf(e.screenName, this.handleUserProfileSocialProofFactory(e).bind(this), this.handleErrorFactory(e).bind(this))
            }
        }, this.after("initialize", function() {
            this.on(document, "uiNeedsUserProfileSocialProof", this.getUserProfileSocialProofData)
        })
    }
    return t(i, e)
}), define("data/twitter_users", ["flight/lib/component", "data/with_client"], function(t, e) {
    var i = function() {
        this.handleTwitterUsersFactory = function(t) {
            var e = function(e) {
                this.trigger("dataTwitterUsers", {
                    requestId: t,
                    users: e
                })
            };
            return e.bind(this)
        }, this.handleTwitterUsersErrorFactory = function(t) {
            var e = function() {
                this.trigger("dataTwitterUsersError", {
                    requestId: t
                })
            };
            return e.bind(this)
        }, this.getTwitterUsers = function(t, e) {
            this.twitterClient = this.twitterClient || this.getTwitterClient(), this.twitterClient.getUsersByIds(e.userIds, this.handleTwitterUsersFactory(e.requestId), this.handleTwitterUsersErrorFactory(e.requestId))
        }, this.after("initialize", function() {
            this.on("uiNeedsTwitterUsers", this.getTwitterUsers)
        })
    };
    return t(i, e)
}), define("data/lists", ["flight/lib/component"], function(t) {
    var e = function() {
        this.getLists = function() {
            var t = TD.cache.lists.getAll();
            this.trigger(document, "dataSubscribedLists", {
                lists: t
            })
        }, this.after("initialize", function() {
            this.on(document, "uiNeedsSubscribedLists", this.getLists)
        })
    };
    return t(e)
}), define("data/tweet", ["require", "flight/lib/component", "data/with_twitter_api"], function(t) {
    function e() {
        this.defaultAttrs({
            resources: {
                show: {
                    method: "GET",
                    url: "statuses/show/:id.json"
                },
                destroy: {
                    method: "POST",
                    url: "statuses/destroy/:id.json"
                },
                message: {
                    method: "POST",
                    url: "direct_messages/new.json"
                },
                reply: {
                    method: "POST",
                    url: "statuses/update.json"
                },
                tweet: {
                    method: "POST",
                    url: "statuses/update.json"
                },
                retweet: {
                    method: "POST",
                    url: "statuses/retweet/:id.json"
                }
            }
        }), this.after("initialize", function() {
            this.on(document, "uiSendTweet", this.handleSendTweet), this.on(document, "uiRetweet", this.handleRetweet), this.on(document, "uiUndoRetweet", this.handleUndoRetweet)
        }), this.getTweet = function(t) {
            var e, i = new TD.core.defer.Deferred;
            try {
                e = this.attr.resources.show, this.makeTwitterApiCall({
                    request: {
                        accountKey: t.accountKey
                    },
                    params: t.params,
                    resource: e.url.replace(":id", t.id),
                    method: e.method,
                    success: function(t) {
                        i.callback(t)
                    },
                    error: function(t) {
                        i.errback(t)
                    }
                })
            } catch (s) {
                i.errback({
                    request: t
                })
            }
            return i
        }, this.sendTweet = function(t) {
            var e, i, s;
            try {
                switch (e = this.attr.resources[t.type], t.type) {
                    case "message":
                        i = {
                            text: t.text,
                            user_id: t.messageRecipient.userId,
                            screen_name: t.messageRecipient.screenName
                        }, s = function(t) {
                            return {
                                direct_message: t
                            }
                        };
                        break;
                    case "reply":
                        i = {
                            status: t.text,
                            in_reply_to_status_id: t.inReplyToStatusId
                        };
                        break;
                    case "tweet":
                        i = {
                            status: t.text
                        }
                }
                var n = "message" === t.type ? "media_id" : "media_ids";
                t.mediaId && (i[n] = t.mediaId), this.makeTwitterApiCall({
                    request: t,
                    resource: e.url,
                    method: e.method,
                    params: i,
                    success: "dataTweetSent",
                    error: "dataTweetError",
                    dataProcessor: s,
                    processAsStreamData: !0
                })
            } catch (o) {
                this.trigger("dataTweetError", {
                    request: t
                })
            }
        }, this.sendRetweet = function(t, e) {
            var i;
            try {
                i = this.attr.resources.retweet, this.makeTwitterApiCall({
                    request: {
                        accountKey: t
                    },
                    resource: i.url.replace(":id", e.id),
                    method: i.method,
                    success: "dataRetweetSuccess",
                    error: "dataRetweetError",
                    processAsStreamData: !0
                })
            } catch (s) {
                this.trigger("dataRetweetError", {
                    request: e
                })
            }
        }, this.handleRetweet = function(t, e) {
            e.from.forEach(function(t) {
                this.sendRetweet(t, e)
            }.bind(this))
        }, this.handleUndoRetweet = function(t, e) {
            var i = e.tweetId,
                s = e.from,
                n = this.getTweet({
                    id: i,
                    accountKey: s,
                    params: {
                        include_my_retweet: !0
                    }
                });
            n.addCallback(function(t) {
                var e;
                return e = t.response.current_user_retweet ? this.destroyTweet({
                    accountKey: s,
                    tweetId: t.response.current_user_retweet.id_str
                }) : TD.core.defer.succeed()
            }.bind(this)), n.addCallbacks(function() {
                $(document).trigger("dataUndoRetweetSuccess", {
                    tweetId: i,
                    from: s
                })
            }, function() {
                $(document).trigger("dataUndoRetweetError", {
                    tweetId: i,
                    from: s
                })
            })
        }, this.destroyTweet = function(t) {
            var e, i = new TD.core.defer.Deferred;
            try {
                e = this.attr.resources.destroy, this.makeTwitterApiCall({
                    request: {
                        accountKey: t.accountKey
                    },
                    resource: e.url.replace(":id", t.tweetId),
                    method: e.method,
                    success: function(t) {
                        i.callback(t)
                    },
                    error: function(t) {
                        i.errback(t)
                    }
                })
            } catch (s) {
                i.errback({
                    request: t
                })
            }
            return i
        }, this.handleSendTweet = function(t, e) {
            e.file || this.sendTweet(e)
        }
    }
    var i = t("flight/lib/component"),
        s = t("data/with_twitter_api");
    return i(e, s)
}), define("data/with_media_uploader", ["require", "flight/lib/compose", "data/with_twitter_api"], function(t) {
    function e() {
        i.mixin(this, [s]), this.defaultAttrs({
            apiRoot: TD.config.api_root,
            uploadUrl: "/oauth/upload"
        }), this.withMediaUploaderUpload = function(t, e) {
            if (t = t || {}, !t.file) throw new Error("Missing file to upload.");
            if (!t.accountKey) throw new Error("Missing account key to upload with.");
            e = _.defaults(e || {}, {
                ttl: "ephemeral"
            });
            var i = this.getClientByAccountKey(t.accountKey),
                s = i.oauth.account,
                n = new FormData;
            n.append("media", t.file), n.append("ttl", e.ttl);
            var o = TD.net.ajax.upload(this.attr.apiRoot + this.attr.uploadUrl, n, s);
            return o.addCallback(function(t) {
                if (t = t || {}, t.data = t.data || {}, "string" != typeof t.data.media_id_string) throw new Error("Upload response missing media_id_string.");
                return t.data.media_id_string
            }), o
        }
    }
    var i = t("flight/lib/compose"),
        s = t("data/with_twitter_api");
    return e
}), define("ui/with_template", [], function() {
    function t() {
        this.render = function(t, e) {
            this.$node.html(this.toHtml(t, e))
        }, this.renderTemplate = function(t, e) {
            return $(TD.ui.template.render(t, e))
        }, this.toHtml = function(t, e) {
            return TD.ui.template.render(t, e)
        }, this.toHtmlFromRaw = function(t, e) {
            var i = Hogan.compile(t);
            return i.render(e)
        }
    }
    return t
}), define("util/with_watch_decider", [], function() {
    function t() {
        this.before("initialize", function() {
            this.watchedDeciders = {}
        }), this.after("initialize", function() {
            this.on(document, "dataDeciderUpdated", this.handleDecidersChanged)
        }), this.watchDecider = function(t, e) {
            if ("string" != typeof t) throw new TypeError("watchDecider decider key list must be a string");
            if ("function" != typeof e) throw new TypeError("watchDecider callback must be a function");
            t.split(" ").forEach(function(t) {
                this.watchedDeciders[t] = this.watchedDeciders[t] || {
                    value: this.getDecider(t)
                }, this.watchedDeciders[t].callback = e
            }.bind(this))
        }, this.handleDecidersChanged = function() {
            Object.keys(this.watchedDeciders).forEach(function(t) {
                var e = this.watchedDeciders[t],
                    i = e.value,
                    s = this.getDecider(t);
                i !== s && (e.value = s, e.callback.call(this, s, i, t))
            }.bind(this))
        }, this.getDecider = function(t) {
            return TD.decider.get(TD.decider[t])
        }
    }
    return t
}), define("data/schedule_tweet", ["require", "flight/lib/component", "data/with_twitter_api", "data/with_media_uploader", "ui/with_template", "util/with_watch_decider"], function(t) {
    function e() {
        this.defaultAttrs({
            resources: {
                tweet: {
                    method: "POST",
                    url: "schedule/status/tweet.json",
                    metricsKey: "status:tweet"
                },
                "delete": {
                    method: "DELETE",
                    url: "schedule/status/{{id}}.json",
                    metricsKey: "status:delete"
                },
                dismiss: {
                    method: "POST",
                    url: "schedule/status/dismiss/{{id}}.json",
                    metricsKey: "status:dismiss"
                },
                edit: {
                    method: "PUT",
                    url: "schedule/status/{{id}}.json",
                    metricsKey: "status:edit"
                }
            }
        }), this.after("initialize", function() {
            this.on(document, "uiSendScheduledTweets", this.handleSendScheduleTweets), this.on(document, "uiDeleteScheduledTweetGroup", this.handleDeleteScheduledTweets), this.on(document, "uiEditScheduledTweetGroup", this.handleEditScheduleTweets), this.watchDecider("SCHEDULER_READ_BACKGROUND SCHEDULER_READ_VISIBLE", this.refreshScheduledColumn)
        }), this.handleSendScheduleTweets = function(t, e) {
            e.metadata = e.metadata || {};
            var i = e.requests.filter(function(t) {
                return this.shouldSchedule(t.type)
            }.bind(this)),
                s = [],
                n = [],
                o = e.metadata.originalUpdates || [];
            if (i.length || o.length) {
                this.trigger("metricRealtime", {
                    action: "scheduler:ui:send"
                });
                var r = i.map(function(t) {
                    return t.accountKey
                });
                e.tokenToDelete && (o = []), o.forEach(function(t) {
                    var e = r.indexOf(t.account.getKey());
                    if (0 > e) return n.push(t);
                    var o = i.splice(e, 1)[0];
                    o.id = t.id, s.push(o), TD.controller.feedManager.deleteChirp(o.id)
                });
                var a = new TD.core.defer.DeferredList(i.map(this.uploadImageIfPresent.bind(this)));
                a.addCallback(function(t) {
                    var e = [].concat(t.map(function(t) {
                        return t[1]
                    }).map(this.makeApiCallToResource.bind(this, this.attr.resources.tweet)), s.map(this.makeApiCallToResource.bind(this, this.attr.resources.edit)), n.map(function(t) {
                        return this.deleteScheduledTweet({
                            id: t.id,
                            accountKey: t.account.getKey()
                        })
                    }, this));
                    return new TD.core.defer.DeferredList(e)
                }.bind(this)), a.addBoth(this.addOrRefreshScheduledColumn.bind(this))
            }
        }, this.handleDeleteScheduledTweets = function(t, e) {
            if (!this.isVisibilityOff()) {
                this.trigger("metricRealtime", {
                    action: "scheduler:ui:delete"
                });
                var i = new TD.core.defer.DeferredList(e.scheduledTweetGroup.updates.map(function(t) {
                    return this.deleteScheduledTweet({
                        id: t.id,
                        state: t.state,
                        accountKey: t.account.getKey()
                    })
                }.bind(this)));
                i.addBoth(this.refreshScheduledColumn.bind(this))
            }
        }, this.handleEditScheduleTweets = function(t, e) {
            if (this.isWriteOff()) return alert(TD.i("Sorry – editing scheduled tweets is currently unavailable."));
            this.trigger("metricRealtime", {
                action: "scheduler:ui:edit"
            });
            var i = e.scheduledTweetGroup;
            this.trigger("uiComposeTweet", {
                type: "tweet",
                schedule: {
                    time: i.time
                },
                text: i.text,
                from: i.updates.map(function(t) {
                    return t.account.getKey()
                }),
                inReplyTo: {
                    tweetId: status.inReplyToStatusId
                },
                metadata: {
                    originalUpdates: i.updates
                }
            })
        }, this.makeApiCallToResource = function(t, e) {
            this.trigger("metricRealtime", {
                action: "scheduler:data:" + t.metricsKey
            });
            var i = {
                status: e.text,
                execute_at: Math.round(e.scheduledDate.getTime() / 1e3)
            };
            return e.inReplyToStatusId && (i.in_reply_to_status_id = e.inReplyToStatusId), e.mediaId && (i.media_ids = e.mediaId), this.makeTwitterApiCall({
                resource: this.toHtmlFromRaw(t.url, e),
                method: t.method,
                request: e,
                params: i,
                success: "dataTweetSent",
                error: "dataTweetError"
            })
        }, this.deleteScheduledTweet = function(t) {
            var e = this.attr.resources["failed" === t.state ? "dismiss" : "delete"];
            return this.trigger("metricRealtime", {
                action: "scheduler:data:" + e.metricsKey
            }), this.makeTwitterApiCall({
                resource: this.toHtmlFromRaw(e.url, {
                    id: t.id
                }),
                request: t,
                method: e.method
            })
        }, this.uploadImageIfPresent = function(t) {
            if (!t.file) return TD.core.defer.succeed(t);
            this.trigger("metricRealtime", {
                action: "scheduler:data:upload"
            });
            var e = this.withMediaUploaderUpload(t, {
                ttl: "infinity"
            });
            return e.addCallback(function(e) {
                return delete t.file, t.mediaId = e, t
            }), e
        }, this.refreshScheduledColumn = function() {
            this.trigger("uiNeedsScheduledColumnVisible", {})
        }, this.addOrRefreshScheduledColumn = function() {
            this.trigger("uiNeedsScheduledColumnVisible", {
                allowAdd: !0
            })
        }, this.isWriteOff = function() {
            var t = !TD.decider.hasAccessLevel("scheduler", "WRITE");
            return t
        }, this.isVisibilityOff = function() {
            var t = !TD.decider.hasAccessLevel("scheduler", "READ_VISIBLE");
            return t
        }, this.shouldSchedule = function(t) {
            var e = !this.isWriteOff(),
                i = {
                    message: !1,
                    tweet: e,
                    reply: e
                };
            return i[t]
        }
    }
    var i = t("flight/lib/component"),
        s = t("data/with_twitter_api"),
        n = t("data/with_media_uploader"),
        o = t("ui/with_template"),
        r = t("util/with_watch_decider");
    return i(e, s, n, o, r)
}), define("ui/with_api_errors", [], function() {
    return function() {
        var t = "unknown",
            e = "unknown_xauth";
        this.after("initialize", function() {
            this.apiErrors = {
                32: TD.i("Invalid username or password"),
                231: TD.i("You need to generate a temporary password on twitter.com to sign in."),
                235: TD.i("Your login verification request has expired. Please sign in again."),
                236: TD.i("That is not the correct code. Please re-enter the code sent to your phone."),
                241: TD.i("The login verification request sent to your phone was rejected."),
                242: TD.i("Your account is deactivated. Please sign in on twitter.com to reactivate."),
                243: TD.i("You have too many failed sign in attempts. Please try again in an hour."),
                244: TD.i("You must reset the password on this account. Please sign in on twitter.com to do this."),
                245: TD.i("You have initiated too many login requests. Please try sigining in again in an hour."),
                246: TD.i("You have entered too many incorrect codes. Please try signing in again."),
                276: TD.i("Scheduled tweet was rejected. Please try again."),
                429: TD.i("You have initiated too many login requests. Please try sigining in again later."),
                unknown_xauth: TD.i("Unknown sign in error. Please try again."),
                unknown: TD.i("Unknown error. Please try again.")
            }
        }), this.getXAuthErrorMessage = function(t) {
            return t = t ? t.toString() : e, this.apiErrors[t] || this.apiErrors[e]
        }, this.getApiErrorMessage = function(e) {
            return e = e || {}, this.apiErrors[e.code] || e.message || this.apiErrors[t]
        }, this.getXAuthErrorIs2FACodeError = function(t) {
            return 236 === t
        }
    }
}), define("data/tweetdeck_api", ["require", "flight/lib/component", "data/with_client", "data/with_media_uploader", "ui/with_api_errors"], function(t) {
    function e() {
        var t = 1,
            e = 2,
            i = 32,
            s = 253;
        this.defaultAttrs({
            mobileAuthRequestLimit: 60,
            mobile2FAPollInterval: 2e3
        }), this.mobileAuthRequestCount = 0, this.after("initialize", function() {
            this.on(document, "uiSendTweet", this.handleSendTweet), this.on(document, "uiSendScheduledTweets", this.handleSendScheduledUpdates), this.on(document, "uiNeedsMigrateLockStatus", this.handleMigrateLockStatusRequest), this.on(document, "uiLoginRequest", function(t, e) {
                "twitter" === e.authType ? this.handleTwitterLoginRequest(t, e) : this.handleTweetDeckLoginRequest(t, e)
            }), this.on(document, "uiTweetDeckForgotPasswordRequest", this.handleForgotPasswordRequest), this.on(document, "uiLogin2FARequest", this.handleLogin2FARequest), this.on(document, "uiLogin2FACancel", this.handleLogin2FACancel)
        }), this.responseFactory = function(t, e) {
            return function(i) {
                this.trigger(t, {
                    response: i,
                    request: e
                })
            }.bind(this)
        }, this.handleSendTweet = function(t, e) {
            if (e.file) {
                var i = this.withMediaUploaderUpload(e);
                i.addCallbacks(function(i) {
                    delete e.file, e.mediaId = i, this.trigger(document, t, e)
                }.bind(this), this.responseFactory("dataTweetError", e))
            }
        }, this.handleSendScheduledUpdates = function(t, e) {
            var i = e.requests.filter(function(t) {
                return this.shouldSchedule(t.type)
            }, this).map(function(t) {
                var e = this.getAccountData(t.accountKey),
                    i = {
                        body: t.text
                    };
                switch (t.type) {
                    case "tweet":
                        i.type = "tweet";
                        break;
                    case "reply":
                        i.type = "tweet", i.in_reply_to_status_id = t.inReplyToStatusId;
                        break;
                    case "message":
                        i.type = "direct_message", i.screen_name = t.messageRecipient.screenName
                }
                return {
                    service: "twitter",
                    user: {
                        id: e.id
                    },
                    update: i,
                    meta: {
                        user: {
                            name: e.screenName,
                            avatar_url: e.profileImageURL
                        }
                    }
                }
            }, this),
                s = this.getTweetDeckClient(),
                n = TD.core.defer.succeed();
            e.tokenToDelete && ($(document).trigger("metricRealtime", {
                action: "scheduler:data:susurrus:delete"
            }), n.addCallback(function() {
                return s.removeScheduleGroup(e.tokenToDelete)
            })), i.length && ($(document).trigger("metricRealtime", {
                action: "scheduler:data:susurrus:create"
            }), n.addCallback(function() {
                return s.scheduleGroup(i, e.scheduledDate)
            }), n.addCallbacks(this.responseFactory("dataScheduledTweetsSent", e), this.responseFactory("dataScheduledTweetsError", e))), n.addBoth(function() {
                $(document).trigger("uiNeedsScheduledColumnVisible", {
                    allowAdd: !! i.length
                })
            })
        }, this.handleTwitterLoginRequest = function(t, e) {
            var i = TD.storage.accountController.loginTwitter(e.username, e.password);
            return i.addCallback(function(t) {
                this.handleLoginResponse(e, t)
            }.bind(this)), i
        }, this.handleTweetDeckLoginRequest = function(t, e) {
            var i = TD.storage.accountController.loginTweetdeck(e.username, e.password);
            return i.addCallback(function(t) {
                this.handleTweetDeckLoginResponse(e, t, e.staySignedIn)
            }.bind(this)), i
        }, this.handleMigrateLockStatusRequest = function(t, e) {
            var i = TD.storage.accountController.loginTweetdeck(e.email, "");
            i.addBoth(this.triggerMigrateLockStatus.bind(this, e.email))
        }, this.handleTweetDeckLoginResponse = function(t, e, i) {
            switch (e.httpStatus) {
                case 200:
                    e.account.uid ? (e.staySignedIn = i, this.trigger("dataLoginAuthSuccess", e)) : this.trigger("dataLoginError");
                    break;
                case 401:
                    this.trigger("dataLoginError", {
                        code: e.message
                    });
                    break;
                case 500:
                    this.trigger("dataLoginServerError");
                    break;
                default:
                    this.trigger("dataLoginError")
            }
            this.triggerMigrateLockStatus(t.username, e)
        }, this.triggerMigrateLockStatus = function(t, e) {
            var i = e && 401 === e.httpStatus && e.data && "AccountLocked" === e.data.error;
            this.trigger("dataMigrateAccountLockStatus", {
                email: t,
                isLocked: i
            })
        }, this.handleForgotPasswordRequest = function(t, e) {
            var i = new TD.services.TweetDeckClient,
                s = i.forgotPassword(e.email);
            s.addCallback(function(t) {
                this.handleForgotPasswordResponse(t)
            }.bind(this)), s.addErrback(function(t) {
                this.handleForgotPasswordResponse(t)
            }.bind(this))
        }, this.handleForgotPasswordResponse = function(t) {
            switch (t.httpStatus) {
                case 200:
                    this.trigger("dataForgotPasswordSuccess", t);
                    break;
                case 403:
                    this.trigger("dataForgotPasswordError", t);
                    break;
                case 500:
                    this.trigger("dataLoginServerError");
                    break;
                default:
                    this.trigger("dataLoginError", {})
            }
        }, this.handleLogin2FARequest = function(t, e) {
            var i, s;
            return e.requestId ? (s = {
                requestId: e.requestId,
                userId: e.userId
            }, e.code && (s.code = e.code), i = TD.storage.accountController.loginTwitterWith2FACode(e.username, e.password, s), i.addCallback(function(t) {
                this.handleLoginResponse(e, t)
            }.bind(this)), i) : (TD.sync.util.errmark("Undefined 2FA login request."), void 0)
        }, this.handleLoginResponse = function(n, o) {
            n = n || {}, o.staySignedIn = n.staySignedIn, o.username = n.username, o.password = n.password, 200 === o.httpStatus ? o.account.uid ? this.trigger("dataLoginAuthSuccess", o) : o.xAuth.login_verification_request_type === t ? (TD.sync.util.verboseLog("Twogin: Awaiting 2FA code from SMS"), this.trigger("dataLoginTwoFactorCodeRequired", o)) : o.xAuth.login_verification_request_type === e ? (TD.sync.util.verboseLog("Twogin: Awaiting 2FA auth from mobile app"), this.schedule2FARequest({
                username: o.username,
                password: o.password,
                requestId: o.xAuth.login_verification_request_id,
                userId: o.xAuth.login_verification_user_id,
                staySignedIn: o.staySignedIn
            }), this.trigger("dataLoginTwoFactorAwaitingConfirmation")) : this.trigger("dataLoginError", {
                isXAuth: !0
            }) : 401 === o.httpStatus && o.xAuth.errors && o.xAuth.errors.length > 0 ? [i, s].indexOf(o.xAuth.errors[0].code) > -1 && n.requestId ? this.schedule2FARequest(n) : this.getXAuthErrorIs2FACodeError(o.xAuth.errors[0].code) ? this.trigger("dataLogin2FAError", {
                isXAuth: !0,
                code: o.xAuth.errors[0].code
            }) : this.trigger("dataLoginError", {
                isXAuth: !0,
                code: o.xAuth.errors[0].code
            }) : 500 === o.httpStatus ? this.trigger("dataLoginServerError") : this.trigger("dataLoginError", {
                isXAuth: !0,
                httpStatus: o.httpStatus
            })
        }, this.schedule2FARequest = function(t) {
            this.mobileAuthRequestCount < this.attr.mobileAuthRequestLimit ? (TD.sync.util.verboseLog("Twogin: Scheduling mobile 2FA check"), this.mobileAuthRequestTimeout = setTimeout(function() {
                this.mobileAuthRequestCount = this.mobileAuthRequestCount + 1, this.trigger("uiLogin2FARequest", t)
            }.bind(this), this.attr.mobile2FAPollInterval)) : this.trigger("dataLogin2FATimeout", t)
        }, this.handleLogin2FACancel = function() {
            clearTimeout(this.mobileAuthRequestTimeout)
        }, this.isTweetSchedulerOn = function() {
            return TD.decider.hasAccessLevel("scheduler", "WRITE")
        }, this.shouldSchedule = function(t) {
            var e = this.isTweetSchedulerOn(),
                i = {
                    message: !0,
                    tweet: !e,
                    reply: !e
                };
            return i[t]
        }
    }
    var i = t("flight/lib/component"),
        s = t("data/with_client"),
        n = t("data/with_media_uploader"),
        o = t("ui/with_api_errors");
    return i(e, s, n, o)
}), define("data/touch_controller", ["flight/lib/component"], function(t) {
    var e = function() {
        this.defaultAttrs({
            isTouchComposeClass: "is-touch-compose",
            isTouchSearchClass: "is-touch-search",
            isTouchSidebarClass: "is-touch-sidebar",
            isTouchTweetContainer: "is-touch-tweet-container",
            withTouchSidebarClass: "with-touch-sidebar",
            withTouchFontSizeClass: "with-touch-font-size"
        }), this.handleUpdateCompose = function() {
            TD.util.isTouchDevice() && TD.decider.get(TD.decider.TOUCHDECK_COMPOSE) ? $(".js-docked-compose").addClass(this.attr.isTouchComposeClass) : $(".js-docked-compose").removeClass(this.attr.isTouchComposeClass)
        }, this.handleUpdateFontSize = function() {
            TD.util.isTouchDevice() && TD.decider.get(TD.decider.TOUCHDECK_FONTSIZE) ? $("html").addClass(this.attr.withTouchFontSizeClass) : $("html").removeClass(this.attr.withTouchFontSizeClass)
        }, this.handleUpdateSearch = function() {
            TD.util.isTouchDevice() && TD.decider.get(TD.decider.TOUCHDECK_SEARCH) ? $(".js-search").addClass(this.attr.isTouchSearchClass) : $(".js-search").removeClass(this.attr.isTouchSearchClass)
        }, this.handleUpdateSidebar = function() {
            TD.util.isTouchDevice() && TD.decider.get(TD.decider.TOUCHDECK_SIDEBAR) ? ($(".js-app").addClass(this.attr.withTouchSidebarClass), $(".js-app-header").addClass(this.attr.isTouchSidebarClass)) : ($(".js-app").removeClass(this.attr.withTouchSidebarClass), $(".js-app-header").removeClass(this.attr.isTouchSidebarClass))
        }, this.handleUpdateTweetControls = function() {
            TD.util.isTouchDevice() && TD.decider.get(TD.decider.TOUCHDECK_TWEETCONTROLS) ? $(".js-chirp-container").addClass(this.attr.isTouchTweetContainer) : $(".js-chirp-container").removeClass(this.attr.isTouchTweetContainer)
        }, this.after("initialize", function() {
            this.on(document, "dataDeciderUpdated", this.handleUpdateCompose), this.on(document, "dataDeciderUpdated", this.handleUpdateFontSize), this.on(document, "dataDeciderUpdated", this.handleUpdateSearch), this.on(document, "dataDeciderUpdated", this.handleUpdateSidebar), this.on(document, "dataDeciderUpdated", this.handleUpdateTweetControls)
        })
    };
    return t(e)
}), define("data/custom_timelines", ["flight/lib/component", "data/with_client"], function(t, e) {
    function i() {
        this.after("initialize", function() {
            this.on(document, "uiAddTweetToCustomTimeline", this.checkData(this.addTweetToCustomTimeline)), this.on(document, "uiRemoveTweetFromCustomTimeline", this.checkData(this.removeTweetFromCustomTimeline)), this.on(document, "uiNeedsCustomTimeline", this.fetchCustomTimeline), this.on(document, "uiUpdateCustomTimeline", this.updateCustomTimeline), this.on(document, "dataAddTweetToCustomTimelineError", function() {
                TD.controller.progressIndicator.addMessage(TD.i("Problem adding Tweet: please try again"))
            }), this.on(document, "dataRemoveTweetToCustomTimelineError", function() {
                TD.controller.progressIndicator.addMessage(TD.i("Problem removing Tweet: please try again"))
            })
        }), this.addTweetToCustomTimeline = function(t, e) {
            var i = this.getClientByAccountKey(e.account);
            i.addTweetToCustomTimeline(e.id, e.tweetId, this.callbackFactory("dataAddTweetToCustomTimelineSuccess", e), this.callbackFactory("dataAddTweetToCustomTimelineError", e))
        }, this.removeTweetFromCustomTimeline = function(t, e) {
            var i = this.getClientByAccountKey(e.account);
            i.removeTweetFromCustomTimeline(e.id, e.tweetId, this.callbackFactory("dataRemoveTweetFromCustomTimelineSuccess", e), this.callbackFactory("dataRemoveTweetFromCustomTimelineError", e))
        }, this.fetchCustomTimeline = function(t, e) {
            var i = this.getClientByAccountKey(e.account);
            i.getCustomTimeline(e.id, this.callbackFactory("dataCustomTimelineSuccess", e), this.callbackFactory("dataCustomTimelineError", e))
        }, this.updateCustomTimeline = function(t, e) {
            function i(t) {
                var i = {
                    name: void 0 !== e.name ? e.name : t.name,
                    description: void 0 !== e.description ? e.description : t.description,
                    url: void 0 !== e.url ? e.url : t.url
                };
                s.updateCustomTimeline(e.id, i, this.callbackFactory("dataCustomTimelineSuccess", e), this.callbackFactory("dataCustomTimelineUpdateError", e))
            }
            var s = this.getClientByAccountKey(e.account);
            s.getCustomTimeline(e.id, i.bind(this), this.callbackFactory("dataCustomTimelineUpdateError", e))
        }, this.callbackFactory = function(t, e) {
            return function(i) {
                this.trigger(document, t, {
                    action: e,
                    result: i
                })
            }.bind(this)
        }, this.checkData = function(t) {
            return function(e, i) {
                if (!i.id || !i.tweetId || !i.account) throw "data needs id, tweetId, and account";
                t.apply(this, [].slice.call(arguments))
            }
        }
    }
    return t(i, e)
}), define("data/secure_image", ["require", "flight/lib/component"], function(t) {
    function e() {
        this.defaultAttrs({
            needsSecureUrlSelector: ".js-needs-secure-url",
            needsSecureUrlClass: "js-needs-secure-url",
            orignalUrlAttribute: "data-original-url",
            cacheSize: 200,
            cacheExpiryMinutes: 15
        }), this.after("initialize", function() {
            this.on(document, "uiNeedsSecureImageUrl", this.queueSignedImage), this.signedUrlCache = new TD.cache.LRUQueue(this.attr.cacheSize), this.imageQueue = [], this.debouncedProcessQueue = _.debounce(this.processQueue, 100)
        }), this.queueSignedImage = function(t, e) {
            this.imageQueue.push({
                event: t,
                data: e
            }), this.debouncedProcessQueue()
        }, this.processQueue = function() {
            var t = this.$node.find(this.attr.needsSecureUrlSelector);
            this.imageQueue.forEach(function(e) {
                this.findAndSignImage(t, e.event, e.data)
            }.bind(this)), this.imageQueue = []
        }, this.findAndSignImage = function(t, e, i) {
            var s = TD.storage.accountController.get(i.accountKey),
                n = this.getSignedImage(s, i.url);
            n.addCallbackWith(this, function(e) {
                var s = this.attr.orignalUrlAttribute,
                    n = this.attr.needsSecureUrlClass;
                t.each(function() {
                    var t = $(this);
                    if (t.attr(s) === i.url) {
                        var o = t.find("img");
                        o.length ? o.attr("src", e.data.url) : t.css({
                            "background-image": "url(" + e.data.url + ")"
                        }), t.removeClass(n).attr(s, "")
                    }
                })
            })
        }, this.getSignedImage = function(t, e) {
            var i = t.getKey() + ":" + e,
                s = this.signedUrlCache.get(i);
            if (s && s.expires > Date.now()) return this.signedUrlCache.enqueue(i, s), TD.core.defer.succeed(s.data);
            var n = TD.net.ajax.getSignedUrl(t, e);
            return n.addCallbackWith(this, function(t) {
                return this.signedUrlCache.enqueue(i, {
                    expires: Date.now() + 6e4 * this.attr.cacheExpiryMinutes,
                    data: t
                }), t
            }), n
        }
    }
    var i = t("flight/lib/component");
    return i(e)
}), define("data/dm_report", ["require", "flight/lib/component", "data/with_client"], function(t) {
    function e() {
        this.after("initialize", function() {
            this.on(document, "uiNeedsDMReport", this.handleDMReport)
        }), this.handleDMReport = function(t, e) {
            TD.sync.util.assert(e.account, "Source account for report must be specified."), TD.sync.util.assert(e.dmId, "dmId must be specified"), TD.sync.util.assert(_.contains(["spam", "abuse"], e.reportType), "reportType must be one of {spam, abuse}");
            var i = this.getClientByAccount(e.account);
            i.reportDMSpam(e.dmId, e.reportType, !! e.blockUser, this.handleSuccessFactory(e).bind(this), this.handleErrorFactory(e))
        }, this.handleSuccessFactory = function(t) {
            return function() {
                var e = this.getClientByAccount(t.account);
                e.destroyDM(t.dmId), e.deleteMessage(t.dmId), this.trigger("dataDMReport", {
                    error: null
                })
            }
        }, this.handleErrorFactory = function(t) {
            return function(e) {
                this.trigger("dataDMReport", {
                    error: e || {},
                    request: t
                })
            }.bind(this)
        }
    }
    var i = t("flight/lib/component"),
        s = t("data/with_client");
    return i(e, s)
}), define("data/migrate", ["require", "flight/lib/component"], function(t) {
    function e() {
        this.after("initialize", function() {
            this.on(document, "uiMigrateActive", this.handleUiMigrateActive), this.on(document, "uiNeedsMigrateData", this.handleUiNeedsMigrateData), this.on(document, "uiNeedsMigratePreviewData", this.handleUiNeedsMigratePreviewData), this.on(document, "uiMigrateTweetDeckData", this.handleMigrateTweetDeckData), this.on(document, "uiMigrateTwitterData", this.handleMigrateTwitterData), this.on(document, "uiMigrateSuccess", this.handleMigrateSuccess), this.on(document, "uiMigrateCancel", this.handleMigrateCancel);
            var t = this.getMigrateData();
            t && t.active && t.email && TD.controller.stats.setUid(t.email)
        }), this.handleUiMigrateActive = function(t, e) {
            this.setMigrateData({
                active: !0,
                email: TD.storage.store.getTweetdeckAccount(),
                accountType: e.accountType,
                userHasAccountAuthority: e.userHasAccountAuthority
            })
        }, this.handleUiNeedsMigrateData = function() {
            this.trigger("dataMigrateData", this.getMigrateData())
        }, this.handleUiNeedsMigratePreviewData = function(t, e) {
            var i = TD.sync.tdapi.importPreview(e.email, e.passhash);
            i.addCallbacks(this.trigger.bind(this, "dataMigrateTweetDeckAccountPreviewSuccess"), this.trigger.bind(this, "dataMigrateTweetDeckAccountPreviewError"))
        }, this.handleMigrateTwitterData = function(t, e) {
            var i = this.getMigrateData();
            i = _.extend({}, i, {
                uid: e.user_id,
                screenName: e.screen_name
            }), this.setMigrateData(i)
        }, this.handleMigrateTweetDeckData = function(t, e) {
            var i = this.getMigrateData();
            i = _.defaults({}, {
                email: e.email,
                passhash: e.passhash
            }, i), this.setMigrateData(i)
        }, this.handleMigrateSuccess = function() {
            this.clearMigrateData(), TD.sync.controller.ueberpull()
        }, this.handleMigrateCancel = function(t, e) {
            e.clearMigrateData && this.clearMigrateData();
            try {
                TD.controller.init.signOut()
            } catch (i) {
                this.reloadPage()
            }
        }, this.reloadPage = function() {
            window.location.reload()
        }, this.getMigrateData = function() {
            try {
                return JSON.parse(sessionStorage.getItem("migrate"))
            } catch (t) {
                return this.clearMigrateData(), {}
            }
        }, this.setMigrateData = function(t) {
            return sessionStorage.setItem("migrate", JSON.stringify(t))
        }, this.clearMigrateData = function() {
            try {
                sessionStorage.removeItem("migrate")
            } catch (t) {}
            TD.controller.stats.setUid(null)
        }
    }
    var i = t("flight/lib/component");
    return i(e)
}), define("text", ["module"], function(t) {
    var e, i, s, n, o, r = ["Msxml2.XMLHTTP", "Microsoft.XMLHTTP", "Msxml2.XMLHTTP.4.0"],
        a = /^\s*<\?xml(\s)+version=[\'\"](\d)*.(\d)*[\'\"](\s)*\?>/im,
        c = /<body[^>]*>\s*([\s\S]+)\s*<\/body>/im,
        h = "undefined" != typeof location && location.href,
        l = h && location.protocol && location.protocol.replace(/\:/, ""),
        u = h && location.hostname,
        d = h && (location.port || void 0),
        m = {}, g = t.config && t.config() || {};
    return e = {
        version: "2.0.10",
        strip: function(t) {
            if (t) {
                t = t.replace(a, "");
                var e = t.match(c);
                e && (t = e[1])
            } else t = "";
            return t
        },
        jsEscape: function(t) {
            return t.replace(/(['\\])/g, "\\$1").replace(/[\f]/g, "\\f").replace(/[\b]/g, "\\b").replace(/[\n]/g, "\\n").replace(/[\t]/g, "\\t").replace(/[\r]/g, "\\r").replace(/[\u2028]/g, "\\u2028").replace(/[\u2029]/g, "\\u2029")
        },
        createXhr: g.createXhr || function() {
            var t, e, i;
            if ("undefined" != typeof XMLHttpRequest) return new XMLHttpRequest;
            if ("undefined" != typeof ActiveXObject)
                for (e = 0; 3 > e; e += 1) {
                    i = r[e];
                    try {
                        t = new ActiveXObject(i)
                    } catch (s) {}
                    if (t) {
                        r = [i];
                        break
                    }
                }
            return t
        },
        parseName: function(t) {
            var e, i, s, n = !1,
                o = t.indexOf("."),
                r = 0 === t.indexOf("./") || 0 === t.indexOf("../");
            return -1 !== o && (!r || o > 1) ? (e = t.substring(0, o), i = t.substring(o + 1, t.length)) : e = t, s = i || e, o = s.indexOf("!"), -1 !== o && (n = "strip" === s.substring(o + 1), s = s.substring(0, o), i ? i = s : e = s), {
                moduleName: e,
                ext: i,
                strip: n
            }
        },
        xdRegExp: /^((\w+)\:)?\/\/([^\/\\]+)/,
        useXhr: function(t, i, s, n) {
            var o, r, a, c = e.xdRegExp.exec(t);
            return c ? (o = c[2], r = c[3], r = r.split(":"), a = r[1], r = r[0], !(o && o !== i || r && r.toLowerCase() !== s.toLowerCase() || (a || r) && a !== n)) : !0
        },
        finishLoad: function(t, i, s, n) {
            s = i ? e.strip(s) : s, g.isBuild && (m[t] = s), n(s)
        },
        load: function(t, i, s, n) {
            if (n.isBuild && !n.inlineText) return s(), void 0;
            g.isBuild = n.isBuild;
            var o = e.parseName(t),
                r = o.moduleName + (o.ext ? "." + o.ext : ""),
                a = i.toUrl(r),
                c = g.useXhr || e.useXhr;
            return 0 === a.indexOf("empty:") ? (s(), void 0) : (!h || c(a, l, u, d) ? e.get(a, function(i) {
                e.finishLoad(t, o.strip, i, s)
            }, function(t) {
                s.error && s.error(t)
            }) : i([r], function(t) {
                e.finishLoad(o.moduleName + "." + o.ext, o.strip, t, s)
            }), void 0)
        },
        write: function(t, i, s) {
            if (m.hasOwnProperty(i)) {
                var n = e.jsEscape(m[i]);
                s.asModule(t + "!" + i, "define(function () { return '" + n + "';});\n")
            }
        },
        writeFile: function(t, i, s, n, o) {
            var r = e.parseName(i),
                a = r.ext ? "." + r.ext : "",
                c = r.moduleName + a,
                h = s.toUrl(r.moduleName + a) + ".js";
            e.load(c, s, function() {
                var i = function(t) {
                    return n(h, t)
                };
                i.asModule = function(t, e) {
                    return n.asModule(t, h, e)
                }, e.write(t, c, i, o)
            }, o)
        }
    }, "node" === g.env || !g.env && "undefined" != typeof process && process.versions && process.versions.node && !process.versions["node-webkit"] ? (i = require.nodeRequire("fs"), e.get = function(t, e, s) {
        try {
            var n = i.readFileSync(t, "utf8");
            0 === n.indexOf("") && (n = n.substring(1)), e(n)
        } catch (o) {
            s(o)
        }
    }) : "xhr" === g.env || !g.env && e.createXhr() ? e.get = function(t, i, s, n) {
        var o, r = e.createXhr();
        if (r.open("GET", t, !0), n)
            for (o in n) n.hasOwnProperty(o) && r.setRequestHeader(o.toLowerCase(), n[o]);
        g.onXhr && g.onXhr(r, t), r.onreadystatechange = function() {
            var e, n;
            4 === r.readyState && (e = r.status, e > 399 && 600 > e ? (n = new Error(t + " HTTP status: " + e), n.xhr = r, s(n)) : i(r.responseText), g.onXhrComplete && g.onXhrComplete(r, t))
        }, r.send(null)
    } : "rhino" === g.env || !g.env && "undefined" != typeof Packages && "undefined" != typeof java ? e.get = function(t, e) {
        var i, s, n = "utf-8",
            o = new java.io.File(t),
            r = java.lang.System.getProperty("line.separator"),
            a = new java.io.BufferedReader(new java.io.InputStreamReader(new java.io.FileInputStream(o), n)),
            c = "";
        try {
            for (i = new java.lang.StringBuffer, s = a.readLine(), s && s.length() && 65279 === s.charAt(0) && (s = s.substring(1)), null !== s && i.append(s); null !== (s = a.readLine());) i.append(r), i.append(s);
            c = String(i.toString())
        } finally {
            a.close()
        }
        e(c)
    } : ("xpconnect" === g.env || !g.env && "undefined" != typeof Components && Components.classes && Components.interfaces) && (s = Components.classes, n = Components.interfaces, Components.utils["import"]("resource://gre/modules/FileUtils.jsm"), o = "@mozilla.org/windows-registry-key;1" in s, e.get = function(t, e) {
        var i, r, a, c = {};
        o && (t = t.replace(/\//g, "\\")), a = new FileUtils.File(t);
        try {
            i = s["@mozilla.org/network/file-input-stream;1"].createInstance(n.nsIFileInputStream), i.init(a, 1, 0, !1), r = s["@mozilla.org/intl/converter-input-stream;1"].createInstance(n.nsIConverterInputStream), r.init(i, "utf-8", i.available(), n.nsIConverterInputStream.DEFAULT_REPLACEMENT_CHARACTER), r.readString(i.available(), c), r.close(), i.close(), e(c.value)
        } catch (h) {
            throw new Error((a && a.path || "") + ": " + h)
        }
    }), e
}), define("text!scripts/schema/shared_column.json", [], function() {
    return '{\n    "properties": {\n        "feeds": {\n            "items": {\n                "required": ["accountkey", "metadata", "mtime", "service", "type"],\n                "properties": {\n                    "accountkey": {\n                        "type": "string"\n                    },\n                    "metadata": {\n                        "required": ["baseQuery", "searchFilterData", "term"],\n                        "properties": {\n                            "baseQuery": {\n                                "type": "string"\n                            },\n                            "searchFilterData": {\n                                "required": ["action", "content", "engagement", "user"],\n                                "properties": {\n                                    "action": {\n                                        "properties": {\n                                            "showFavorites": {\n                                                "type": "boolean"\n                                            },\n                                            "showFollowers": {\n                                                "type": "boolean"\n                                            },\n                                            "showLists": {\n                                                "type": "boolean"\n                                            },\n                                            "showMentions": {\n                                                "type": "boolean"\n                                            },\n                                            "showRetweets": {\n                                                "type": "boolean"\n                                            }\n                                        },\n                                        "type": "object"\n                                    },\n                                    "content": {\n                                        "properties": {\n                                            "excluding": {\n                                                "type": "string"\n                                            },\n                                            "includeRTs": {\n                                                "type": "boolean"\n                                            },\n                                            "lang": {\n                                                "type": "string"\n                                            },\n                                            "matching": {\n                                                "type": "string"\n                                            },\n                                            "type": {\n                                                "type": "string"\n                                            }\n                                        },\n                                        "type": "object"\n                                    },\n                                    "engagement": {\n                                        "properties": {\n                                            "minFavorites": {\n                                                "type": "number"\n                                            },\n                                            "minReplies": {\n                                                "type": "number"\n                                            },\n                                            "minRetweets": {\n                                                "type": "number"\n                                            }\n                                        },\n                                        "type": "object"\n                                    },\n                                    "user": {\n                                        "properties": {\n                                            "from_name": {\n                                                "type": ["string", "null"]\n                                            },\n                                            "from_type": {\n                                                "type": ["string", "null"]\n                                            },\n                                            "mention_name": {\n                                                "type": ["string", "null"]\n                                            }\n                                        },\n                                        "type": "object"\n                                    }\n                                },\n                                "type": "object"\n                            },\n                            "term": {\n                                "type": "string"\n                            }\n                        },\n                        "type": "object"\n                    },\n                    "mtime": {\n                        "type": "string"\n                    },\n                    "service": {\n                        "type": "string"\n                    },\n                    "type": {\n                        "type": "string"\n                    }\n                },\n                "type": "object"\n            },\n            "type": "array"\n        },\n        "filters": {\n            "properties": {\n                "action": {\n                    "properties": {\n                        "showFavorites": {\n                            "type": "boolean"\n                        },\n                        "showFollowers": {\n                            "type": "boolean"\n                        },\n                        "showLists": {\n                            "type": "boolean"\n                        },\n                        "showMentions": {\n                            "type": "boolean"\n                        },\n                        "showRetweets": {\n                            "type": "boolean"\n                        }\n                    },\n                    "type": "object"\n                },\n                "content": {\n                    "properties": {\n                        "excluding": {\n                            "type": "string"\n                        },\n                        "includeRTs": {\n                            "type": "boolean"\n                        },\n                        "lang": {\n                            "type": "string"\n                        },\n                        "matching": {\n                            "type": "string"\n                        },\n                        "type": {\n                            "type": "string"\n                        }\n                    },\n                    "type": "object"\n                },\n                "engagement": {\n                    "properties": {\n                        "minFavorites": {\n                            "type": "number"\n                        },\n                        "minReplies": {\n                            "type": "number"\n                        },\n                        "minRetweets": {\n                            "type": "number"\n                        }\n                    },\n                    "type": "object"\n                },\n                "user": {\n                    "properties": {\n                        "from_name": {\n                            "type": ["string", "null"]\n                        },\n                        "from_type": {\n                            "type": ["string", "null"]\n                        }\n                    },\n                    "type": "object"\n                }\n            },\n            "type": "object"\n        }\n    },\n    "required": ["feeds", "filters"],\n    "type": "object"\n}\n'
}), define("data/with_validation_schemata", ["require", "text!scripts/schema/shared_column.json"], function(t) {
    var e = {
        sharedColumn: t("text!scripts/schema/shared_column.json")
    };
    return function() {
        this.getValidationSchema = function(t) {
            return e[t] ? JSON.parse(e[t]) : null
        }
    }
}),
function() {
    function t() {
        return this instanceof t ? (this.coerceType = {}, this.fieldType = e(o), this.fieldValidate = e(a), this.fieldFormat = e(r), this.defaultOptions = e(d), this.schema = {}, void 0) : new t
    }
    var e = function(t) {
        if (null === t || "object" != typeof t) return t;
        var i;
        if (t instanceof Date) return i = new Date, i.setTime(t.getTime()), i;
        if (t instanceof RegExp) return i = new RegExp(t);
        if (t instanceof Array) {
            i = [];
            for (var s = 0, n = t.length; n > s; s++) i[s] = e(t[s]);
            return i
        }
        if (t instanceof Object) {
            i = {};
            for (var o in t) t.hasOwnProperty(o) && (i[o] = e(t[o]));
            return i
        }
        throw new Error("Unable to clone object!")
    }, i = function(t) {
            var i = t.length - 1,
                s = t[i].key,
                n = t.slice(0);
            return n[i].object[s] = e(n[i].object[s]), n
        }, s = function(t, e) {
            var i = t.length - 1,
                s = t[i].key;
            e[i].object[s] = t[i].object[s]
        }, n = {
            type: !0,
            not: !0,
            anyOf: !0,
            allOf: !0,
            oneOf: !0,
            $ref: !0,
            $schema: !0,
            id: !0,
            exclusiveMaximum: !0,
            exclusiveMininum: !0,
            properties: !0,
            patternProperties: !0,
            additionalProperties: !0,
            items: !0,
            additionalItems: !0,
            required: !0,
            "default": !0,
            title: !0,
            description: !0,
            definitions: !0,
            dependencies: !0
        }, o = {
            "null": function(t) {
                return null === t
            },
            string: function(t) {
                return "string" == typeof t
            },
            "boolean": function(t) {
                return "boolean" == typeof t
            },
            number: function(t) {
                return "number" == typeof t && !isNaN(t)
            },
            integer: function(t) {
                return "number" == typeof t && t % 1 === 0
            },
            object: function(t) {
                return t && "object" == typeof t && !Array.isArray(t)
            },
            array: function(t) {
                return Array.isArray(t)
            },
            date: function(t) {
                return t instanceof Date
            }
        }, r = {
            alpha: function(t) {
                return /^[a-zA-Z]+$/.test(t)
            },
            alphanumeric: function(t) {
                return /^[a-zA-Z0-9]+$/.test(t)
            },
            identifier: function(t) {
                return /^[-_a-zA-Z0-9]+$/.test(t)
            },
            hexadecimal: function(t) {
                return /^[a-fA-F0-9]+$/.test(t)
            },
            numeric: function(t) {
                return /^[0-9]+$/.test(t)
            },
            "date-time": function(t) {
                return !isNaN(Date.parse(t)) && -1 === t.indexOf("/")
            },
            uppercase: function(t) {
                return t === t.toUpperCase()
            },
            lowercase: function(t) {
                return t === t.toLowerCase()
            },
            hostname: function(t) {
                return t.length < 256 && /^([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])(\.([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]{0,61}[a-zA-Z0-9]))*$/.test(t)
            },
            uri: function(t) {
                return /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/.test(t)
            },
            email: function(t) {
                return /^(?:[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+\.)*[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+@(?:(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!\.)){0,61}[a-zA-Z0-9]?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!$)){0,61}[a-zA-Z0-9]?)|(?:\[(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\]))$/.test(t)
            },
            ipv4: function(t) {
                if (/^(\d?\d?\d)\.(\d?\d?\d)\.(\d?\d?\d)\.(\d?\d?\d)$/.test(t)) {
                    var e = t.split(".").sort();
                    if (e[3] <= 255) return !0
                }
                return !1
            },
            ipv6: function(t) {
                return /^((?=.*::)(?!.*::.+::)(::)?([\dA-F]{1,4}:(:|\b)|){5}|([\dA-F]{1,4}:){6})((([\dA-F]{1,4}((?!\3)::|:\b|$))|(?!\2\3)){2}|(((2[0-4]|1\d|[1-9])?\d|25[0-5])\.?\b){4})$/.test(t)
            }
        }, a = {
            readOnly: function() {
                return !1
            },
            minimum: function(t, e, i) {
                return !(e > t || i.exclusiveMinimum && e >= t)
            },
            maximum: function(t, e, i) {
                return !(t > e || i.exclusiveMaximum && t >= e)
            },
            multipleOf: function(t, e) {
                return t / e % 1 === 0 || "number" != typeof t
            },
            pattern: function(t, e) {
                if ("string" != typeof t) return !0;
                var i, s;
                "string" == typeof e ? i = e : (i = e[0], s = e[1]);
                var n = new RegExp(i, s);
                return n.test(t)
            },
            minLength: function(t, e) {
                return t.length >= e || "string" != typeof t
            },
            maxLength: function(t, e) {
                return t.length <= e || "string" != typeof t
            },
            minItems: function(t, e) {
                return t.length >= e || !Array.isArray(t)
            },
            maxItems: function(t, e) {
                return t.length <= e || !Array.isArray(t)
            },
            uniqueItems: function(t) {
                for (var e, i = {}, s = 0, n = t.length; n > s; s++) {
                    if (e = JSON.stringify(t[s]), i.hasOwnProperty(e)) return !1;
                    i[e] = !0
                }
                return !0
            },
            minProperties: function(t, e) {
                if ("object" != typeof t) return !0;
                var i = 0;
                for (var s in t) t.hasOwnProperty(s) && (i += 1);
                return i >= e
            },
            maxProperties: function(t, e) {
                if ("object" != typeof t) return !0;
                var i = 0;
                for (var s in t) t.hasOwnProperty(s) && (i += 1);
                return e >= i
            },
            "enum": function(t, e) {
                var i, s, n;
                if ("object" == typeof t) {
                    for (n = JSON.stringify(t), i = 0, s = e.length; s > i; i++)
                        if (n === JSON.stringify(e[i])) return !0
                } else
                    for (i = 0, s = e.length; s > i; i++)
                        if (t === e[i]) return !0; return !1
            }
        }, c = function(t) {
            return -1 === t.indexOf("://") ? t : t.split("#")[0]
        }, h = function(t, e, i) {
            var s, n, o, r;
            if (o = i.indexOf("#"), -1 === o) return t.schema.hasOwnProperty(i) ? [t.schema[i]] : null;
            if (o > 0)
                if (r = i.substr(0, o), i = i.substr(o + 1), t.schema.hasOwnProperty(r)) e = [t.schema[r]];
                else {
                    if (!e || e[0].id !== r) return null;
                    e = [e[0]]
                } else {
                    if (!e) return null;
                    i = i.substr(1)
                }
            if ("" === i) return [e[0]];
            if ("/" === i.charAt(0)) {
                for (i = i.substr(1), s = e[0], n = i.split("/"); n.length > 0;) {
                    if (!s.hasOwnProperty(n[0])) return null;
                    s = s[n[0]], e.push(s), n.shift()
                }
                return e
            }
            return null
        }, l = function(t, e) {
            var i, s, n, o, r = t.length - 1,
                a = /^(\d+)/.exec(e);
            if (a) {
                if (e = e.substr(a[0].length), n = parseInt(a[1], 10), 0 > n || n > r) return;
                if (o = t[r - n], "#" === e) return o.key
            } else o = t[0]; if (s = o.object[o.key], "" === e) return s;
            if ("/" === e.charAt(0)) {
                for (e = e.substr(1), i = e.split("/"); i.length > 0;) {
                    if (i[0] = i[0].replace(/~1/g, "/").replace(/~0/g, "~"), !s.hasOwnProperty(i[0])) return;
                    s = s[i[0]], i.shift()
                }
                return s
            }
        }, u = function(t, e, o, r) {
            var a, c, d, m, g, p, f, w, C, T, S = !1,
                v = {}, b = e.length - 1,
                y = e[b],
                D = o.length - 1,
                _ = o[D].object,
                A = o[D].key,
                I = _[A];
            if (y.hasOwnProperty("$ref")) return e = h(t, e, y.$ref), e ? u(t, e, o, r) : {
                $ref: y.$ref
            };
            if (y.hasOwnProperty("type"))
                if ("string" == typeof y.type) {
                    if (r.useCoerce && t.coerceType.hasOwnProperty(y.type) && (I = _[A] = t.coerceType[y.type](I)), !t.fieldType[y.type](I)) return {
                        type: y.type
                    }
                } else {
                    for (S = !0, a = 0, c = y.type.length; c > a && S; a++) t.fieldType[y.type[a]](I) && (S = !1);
                    if (S) return {
                        type: y.type
                    }
                }
            if (y.hasOwnProperty("allOf"))
                for (a = 0, c = y.allOf.length; c > a; a++)
                    if (w = u(t, e.concat(y.allOf[a]), o, r)) return w;
            if (r.useCoerce || r.useDefault || r.removeAdditional) {
                if (y.hasOwnProperty("oneOf")) {
                    for (a = 0, c = y.oneOf.length, d = 0; c > a; a++)
                        if (new_stack = i(o), w = u(t, e.concat(y.oneOf[a]), new_stack, r)) v = w;
                        else {
                            if (d += 1, d > 1) break;
                            s(new_stack, o)
                        }
                    if (d > 1) return {
                        oneOf: !0
                    };
                    if (1 > d) return v;
                    v = {}
                }
                if (y.hasOwnProperty("anyOf")) {
                    for (a = 0, c = y.anyOf.length; c > a; a++)
                        if (new_stack = i(o), w = u(t, e.concat(y.anyOf[a]), new_stack, r), !w) {
                            s(new_stack, o);
                            break
                        }
                    if (w) return w
                }
                if (y.hasOwnProperty("not") && (w = u(t, e.concat(y.not), i(o), r), !w)) return {
                    not: !0
                }
            } else {
                if (y.hasOwnProperty("oneOf")) {
                    for (a = 0, c = y.oneOf.length, d = 0; c > a; a++)
                        if (w = u(t, e.concat(y.oneOf[a]), o, r)) v = w;
                        else if (d += 1, d > 1) break;
                    if (d > 1) return {
                        oneOf: !0
                    };
                    if (1 > d) return v;
                    v = {}
                }
                if (y.hasOwnProperty("anyOf")) {
                    for (a = 0, c = y.anyOf.length; c > a && (w = u(t, e.concat(y.anyOf[a]), o, r), w); a++);
                    if (w) return w
                }
                if (y.hasOwnProperty("not") && (w = u(t, e.concat(y.not), o, r), !w)) return {
                    not: !0
                }
            } if (y.hasOwnProperty("dependencies"))
                for (p in y.dependencies)
                    if (y.dependencies.hasOwnProperty(p) && I.hasOwnProperty(p))
                        if (Array.isArray(y.dependencies[p])) {
                            for (a = 0, c = y.dependencies[p].length; c > a; a++)
                                if (!I.hasOwnProperty(y.dependencies[p][a])) return {
                                    dependencies: !0
                                }
                        } else if (w = u(t, e.concat(y.dependencies[p]), o, r)) return w;
            if (Array.isArray(I)) {
                if (y.hasOwnProperty("items"))
                    if (Array.isArray(y.items)) {
                        for (a = 0, c = y.items.length; c > a; a++) w = u(t, e.concat(y.items[a]), o.concat({
                            object: I,
                            key: a
                        }), r), null !== w && (v[a] = w, S = !0);
                        if (I.length > c && y.hasOwnProperty("additionalItems"))
                            if ("boolean" == typeof y.additionalItems) {
                                if (!y.additionalItems) return {
                                    additionalItems: !0
                                }
                            } else
                                for (a = c, c = I.length; c > a; a++) w = u(t, e.concat(y.additionalItems), o.concat({
                                    object: I,
                                    key: a
                                }), r), null !== w && (v[a] = w, S = !0)
                    } else
                        for (a = 0, c = I.length; c > a; a++) w = u(t, e.concat(y.items), o.concat({
                            object: I,
                            key: a
                        }), r), null !== w && (v[a] = w, S = !0);
                    else if (y.hasOwnProperty("additionalItems") && "boolean" != typeof y.additionalItems)
                    for (a = 0, c = I.length; c > a; a++) w = u(t, e.concat(y.additionalItems), o.concat({
                        object: I,
                        key: a
                    }), r), null !== w && (v[a] = w, S = !0);
                if (S) return {
                    schema: v
                }
            } else {
                C = [], v = {};
                for (p in I) I.hasOwnProperty(p) && C.push(p);
                if (r.checkRequired && y.required)
                    for (a = 0, c = y.required.length; c > a; a++) I.hasOwnProperty(y.required[a]) || (v[y.required[a]] = {
                        required: !0
                    }, S = !0);
                if (m = y.hasOwnProperty("properties"), g = y.hasOwnProperty("patternProperties"), m || g)
                    for (a = C.length; a--;) {
                        if (T = !1, m && y.properties.hasOwnProperty(C[a]) && (T = !0, w = u(t, e.concat(y.properties[C[a]]), o.concat({
                            object: I,
                            key: C[a]
                        }), r), null !== w && (v[C[a]] = w, S = !0)), g)
                            for (p in y.patternProperties) y.patternProperties.hasOwnProperty(p) && C[a].match(p) && (T = !0, w = u(t, e.concat(y.patternProperties[p]), o.concat({
                                object: I,
                                key: C[a]
                            }), r), null !== w && (v[C[a]] = w, S = !0));
                        T && C.splice(a, 1)
                    }
                if (r.useDefault && m && !S)
                    for (p in y.properties) y.properties.hasOwnProperty(p) && !I.hasOwnProperty(p) && y.properties[p].hasOwnProperty("default") && (I[p] = y.properties[p]["default"]);
                if (r.removeAdditional && m && y.additionalProperties !== !0 && "object" != typeof y.additionalProperties)
                    for (a = 0, c = C.length; c > a; a++) delete I[C[a]];
                else if (y.hasOwnProperty("additionalProperties"))
                    if ("boolean" == typeof y.additionalProperties) {
                        if (!y.additionalProperties)
                            for (a = 0, c = C.length; c > a; a++) v[C[a]] = {
                                additional: !0
                            }, S = !0
                    } else
                        for (a = 0, c = C.length; c > a; a++) w = u(t, e.concat(y.additionalProperties), o.concat({
                            object: I,
                            key: C[a]
                        }), r), null !== w && (v[C[a]] = w, S = !0);
                if (S) return {
                    schema: v
                }
            }
            for (f in y) y.hasOwnProperty(f) && !n.hasOwnProperty(f) && ("format" === f ? t.fieldFormat.hasOwnProperty(y[f]) && !t.fieldFormat[y[f]](I, y, o, r) && (v[f] = !0, S = !0) : t.fieldValidate.hasOwnProperty(f) && !t.fieldValidate[f](I, y[f].hasOwnProperty("$data") ? l(o, y[f].$data) : y[f], y, o, r) && (v[f] = !0, S = !0));
            return S ? v : null
        }, d = {
            useDefault: !1,
            useCoerce: !1,
            checkRequired: !0,
            removeAdditional: !1
        };
    t.prototype = {
        validate: function(t, e, i) {
            var s = [t],
                n = null,
                o = [{
                    object: {
                        __root__: e
                    },
                    key: "__root__"
                }];
            if ("string" == typeof t && (s = h(this, null, t), !s)) throw new Error("jjv: could not find schema '" + t + "'.");
            if (i)
                for (var r in this.defaultOptions) this.defaultOptions.hasOwnProperty(r) && !i.hasOwnProperty(r) && (i[r] = this.defaultOptions[r]);
            else i = this.defaultOptions;
            return n = u(this, s, o, i), n ? {
                validation: n.hasOwnProperty("schema") ? n.schema : n
            } : null
        },
        resolveRef: function(t, e) {
            return h(this, t, e)
        },
        addType: function(t, e) {
            this.fieldType[t] = e
        },
        addTypeCoercion: function(t, e) {
            this.coerceType[t] = e
        },
        addCheck: function(t, e) {
            this.fieldValidate[t] = e
        },
        addFormat: function(t, e) {
            this.fieldFormat[t] = e
        },
        addSchema: function(t, e) {
            if (!e && t && (e = t, t = void 0), e.hasOwnProperty("id") && "string" == typeof e.id && e.id !== t) {
                if ("/" === e.id.charAt(0)) throw new Error("jjv: schema id's starting with / are invalid.");
                this.schema[c(e.id)] = e
            } else if (!t) throw new Error("jjv: schema needs either a name or id attribute.");
            t && (this.schema[c(t)] = e)
        }
    }, "undefined" != typeof module && "undefined" != typeof module.exports ? module.exports = t : "function" == typeof define && define.amd ? define("jjv", [], function() {
        return t
    }) : window.jjv = t
}(), define("data/schema_validator", ["require", "flight/lib/component", "data/with_validation_schemata", "jjv"], function(t) {
    function e() {
        this.after("initialize", function() {
            this.on(document, "uiNeedsSchemaValidation", function(t, e) {
                if (e.schemaName && (e.schema = this.getValidationSchema(e.schemaName)), !e.schema) throw new Error("Missing validation schema", e);
                this.validate(e)
            }), this.validate = function(t) {
                var e = n.validate(t.schema, t.data, {
                    checkRequired: !0,
                    useDefault: !0,
                    removeAdditional: !0
                });
                this.trigger("dataSchemaValidation", {
                    schema: t.schema,
                    data: t.data,
                    isValid: !e,
                    validationError: e
                })
            }
        })
    }
    var i = t("flight/lib/component"),
        s = t("data/with_validation_schemata"),
        n = t("jjv")();
    return i(e, s)
}), define("data/router", ["require", "flight/lib/component"], function(t) {
    function e() {
        this.after("initialize", function() {
            this.initialUrlHash = window.location.hash, this.on(document, "TD.ready", this.handleTDReady)
        }), this.handleTDReady = function() {
            this.processUrlHash(this.initialUrlHash), this.cleanUrl()
        }, this.cleanUrl = function() {
            window.history && "function" == typeof window.history.replaceState ? history.replaceState({}, "", window.location.pathname) : window.location.hash = ""
        }, this.processUrlHash = function(t) {
            if (t) {
                var e = TD.util.extractTweetDeckSharedColumnFromFragment(t);
                e && this.trigger("uiShowImportColumnDialog", {
                    columnState: e
                })
            }
        }
    }
    var i = t("flight/lib/component");
    return i(e)
}), define("tracking/account_scribe", ["flight/lib/component"], function(t) {
    function e() {
        this.trackSelectDefaultAccount = function() {
            TD.controller.stats.defaultAccountSelected()
        }, this.after("initialize", function() {
            this.on(document, "uiSelectDefaultAccount", this.trackSelectDefaultAccount)
        })
    }
    return t(e)
}), define("tracking/column_options_scribe", ["require", "flight/lib/component"], function(t) {
    function e() {
        this.trackClear = function() {
            TD.controller.stats.columnActionClick("clear")
        }, this.trackMoveColumn = function(t, e) {
            TD.controller.stats.columnActionClick(e.action)
        }, this.trackEmbedTimeline = function(t, e) {
            TD.controller.stats.columnActionClick("embed", {
                type: e.column.getColumnType()
            })
        }, this.trackActionFilterError = function() {
            TD.controller.stats.actionFilterError()
        }, this.after("initialize", function() {
            this.on(document, "uiClearColumnAction", this.trackClear), this.on(document, "uiMoveColumnAction", this.trackMoveColumn), this.on(document, "uiEmbedTimelineAction", this.trackEmbedTimeline), this.on(document, "uiActionFilterError", this.trackActionFilterError)
        })
    }
    var i = t("flight/lib/component");
    return i(e)
}), define("tracking/compose_scribe", ["require", "flight/lib/component", "data/with_client"], function(t) {
    function e() {
        this.after("initialize", function() {
            this.on(document, "dataTweetSent", this.handleTweetSent), this.on(document, "dataScheduledTweetsSent", this.handleScheduledTweetSent), this.on(document, "uiRemoveInReplyTo", this.handleClearReply), this.on(document, "uiComposeStackReply", this.handleStackReply), this.on(document, "uiDockedComposeTweet", this.handleDockedTweet)
        }), this.handleTweetSent = function(t, e) {
            var i = this.getAccountData(e.request.accountKey),
                s = i ? i.id : null,
                n = Boolean(e.request.file),
                o = Boolean(e.request.scheduledDate),
                r = e.request.inline || !1;
            switch (e.request.type) {
                case "tweet":
                    TD.controller.stats.postTweet(s, n, o);
                    break;
                case "reply":
                    TD.controller.stats.postReply(s, n, o, r);
                    break;
                case "message":
                    TD.controller.stats.postMessage(s, n, o)
            }
        }, this.handleScheduledTweetSent = function(t, e) {
            e = e || {}, e.request = e.request || {}, e.request.requests = e.request.requests || [], e.request.requests.forEach(function(e) {
                this.handleTweetSent(t, {
                    request: e
                })
            }.bind(this))
        }, this.handleClearReply = function() {
            TD.controller.stats.composeClearReply()
        }, this.handleStackReply = function() {
            TD.controller.stats.composeStackReply()
        }, this.handleDockedTweet = function(t, e) {
            e.popFromInline && TD.controller.stats.composePopFromInline()
        }
    }
    var i = t("flight/lib/component"),
        s = t("data/with_client");
    return i(e, s)
}), define("tracking/custom_timeline_scribe", ["flight/lib/component"], function(t) {
    function e() {
        this.after("initialize", function() {
            this.on(document, "dataCustomTimelineCreateSuccess", this.handleTimelineCreated), this.on(document, "dataCustomTimelineUpdateSuccess", this.handleTimelineUpdated), this.on(document, "dataCustomTimelineDeleteSuccess", this.handleTimelineDeleted), this.on(document, "dataAddTweetToCustomTimelineSuccess", this.handleTweetAdded), this.on(document, "dataRemoveTweetFromCustomTimelineSuccess", this.handleTweetRemoved)
        }), this.handleTimelineCreated = function() {
            TD.controller.stats.customTimelineCreated()
        }, this.handleTimelineUpdated = function() {
            TD.controller.stats.customTimelineUpdated()
        }, this.handleTimelineDeleted = function() {
            TD.controller.stats.customTimelineDeleted()
        }, this.handleTweetAdded = function() {
            TD.controller.stats.tweetAddedToCustomTimeline()
        }, this.handleTweetRemoved = function() {
            TD.controller.stats.tweetRemovedFromCustomTimeline()
        }
    }
    return t(e)
}), define("tracking/message_banner_scribe", ["require", "flight/lib/component"], function(t) {
    function e() {
        this.trackImpression = function(t, e) {
            TD.controller.stats.messageBannerImpression(e.id)
        }, this.trackDismiss = function(t, e) {
            TD.controller.stats.messageBannerDismiss(e.id)
        }, this.trackAction = function(t, e) {
            TD.controller.stats.messageBannerClick(e.messageId, e.actionId)
        }, this.after("initialize", function() {
            this.on(document, "uiShowMessageBanner", this.trackImpression), this.on(document, "uiDismissMessageAction", this.trackDismiss), this.on(document, "uiClickMessageButtonAction", this.trackAction)
        })
    }
    var i = t("flight/lib/component");
    return i(e)
}), define("tracking/embed_tweet_dialog_scribe", ["require", "flight/lib/component"], function(t) {
    function e() {
        this.trackOpen = function(t, e) {
            TD.controller.stats.embedTweetDialogOpen(e.tweet.id)
        }, this.after("initialize", function() {
            this.on(document, "uiShowEmbedTweet", this.trackOpen)
        })
    }
    var i = t("flight/lib/component");
    return i(e)
}), define("tracking/typeahead_scribe", ["require", "flight/lib/component"], function(t) {
    function e() {
        this.trackInvocation = function() {
            TD.controller.stats.typeaheadInvoked()
        }, this.trackSelection = function(t, e) {
            var i = e.query || e.input;
            "recent-search" === e.searchType ? TD.controller.stats.typeaheadRecentItemSelected(i, e.searchType, e.index) : TD.controller.stats.typeaheadItemSelected(i, e.searchType, e.index)
        }, this.after("initialize", function() {
            this.on(document, "uiTypeaheadDropdownInvoked", this.trackInvocation), this.on(document, "uiTypeaheadItemSelected", this.trackSelection)
        })
    }
    var i = t("flight/lib/component");
    return i(e)
}), define("tracking/social_proof_for_tweet_scribe", ["require", "flight/lib/component"], function(t) {
    function e() {
        this.trackViews = function(t, e) {
            TD.controller.stats.viewedTweetSocialProof(e.type)
        }, this.after("initialize", function() {
            this.on(document, "uiShowSocialProof", this.trackViews)
        })
    }
    var i = t("flight/lib/component");
    return i(e)
}), define("tracking/report_tweet_scribe", ["require", "flight/lib/component"], function(t) {
    function e() {
        this.after("initialize", function() {
            this.on(document, "uiShowReportTweetOptions", function(t, e) {
                e.isMessage || TD.controller.stats.reportUser("impression")
            }), this.on(document, "uiShowReportTweetCancel", function() {
                TD.controller.stats.reportUser("cancel")
            }), this.on(document, "uiReportSpamAction", function() {
                TD.controller.stats.reportUser("report_as_spam", "spam")
            }), this.on(document, "uiReportCompromisedAction", function(t, e) {
                e && e.block ? TD.controller.stats.reportUser("block", "compromised") : TD.controller.stats.reportUser("report_as_spam", "compromised")
            }), this.on(document, "uiReportAbusiveAction", function(t, e) {
                TD.controller.stats.reportUserAbusive("impression"), e && e.block ? TD.controller.stats.reportUser("block", "abusive") : TD.controller.stats.reportUser("report_as_spam", "abusive")
            }), this.on(document, "uiReportAbusiveOption", function(t, e) {
                TD.controller.stats.reportUserAbusive("click", e.option)
            })
        })
    }
    var i = t("flight/lib/component");
    return i(e)
}), define("tracking/report_message_scribe", ["require", "flight/lib/component"], function(t) {
    function e() {
        this.after("initialize", function() {
            this.on(document, "uiShowReportTweetOptions", function(t, e) {
                e.isMessage && TD.controller.stats.reportDM("impression")
            });
            var t = {
                uiShowReportMessageCancel: "cancel",
                uiShowReportMessageError: "error",
                uiNeedsDMReport: function(t) {
                    return "report_as_" + t.reportType
                }
            };
            _.each(t, function(t, e) {
                this.on(document, e, function(e, i) {
                    TD.controller.stats.reportDM(_.isFunction(t) ? t(i) : t)
                })
            }.bind(this))
        })
    }
    var i = t("flight/lib/component");
    return i(e)
}), define("util/data_setup", ["flight/lib/component", "data/storage", "data/accounts", "data/column_manager", "data/contributors", "data/embed_timeline", "data/embed_tweet", "data/message_banner", "data/preferred_account", "data/relationship", "data/favorite", "data/twitter_user", "data/user_actions", "data/settings", "data/stream_counter", "data/user_search", "data/recent_searches", "data/typeahead", "data/user_profile_social_proof", "data/twitter_users", "data/lists", "data/tweet", "data/schedule_tweet", "data/tweetdeck_api", "data/touch_controller", "data/custom_timelines", "data/secure_image", "data/dm_report", "data/migrate", "data/schema_validator", "data/router", "tracking/account_scribe", "tracking/column_options_scribe", "tracking/compose_scribe", "tracking/custom_timeline_scribe", "tracking/message_banner_scribe", "tracking/embed_tweet_dialog_scribe", "tracking/typeahead_scribe", "tracking/social_proof_for_tweet_scribe", "tracking/report_tweet_scribe", "tracking/report_message_scribe"], function(t) {
    var e = Array.prototype.slice.call(arguments, 1);
    return t(function() {
        this.after("initialize", function() {
            _.invoke(e, "attachTo", this.$node)
        })
    })
}), define("ui/with_key_handler", [], function() {
    function t() {
        this.activeSequences = {}, this.sequenceStarters = {}, this.singleKeys = {}, this.combos = {}, this.defaultAttrs({
            charCodes: {
                bksp: 8,
                ret: 13,
                esc: 27,
                space: 32,
                pageup: 33,
                pagedown: 34,
                end: 35,
                home: 36,
                left: 37,
                up: 38,
                right: 39,
                down: 40,
                del: 46
            },
            defaultKeyEvent: "keypress",
            keySequenceTimeoutDelay: 1e3,
            modifiers: {
                ctrl: "ctrlKey",
                alt: "altKey",
                cmd: "metaKey",
                shift: "shiftKey"
            }
        }), this.getShortcutForEvent = function(t) {
            var e, i = t.which;
            return this.eventHasModifier(t) && (e = this.combos[i]), !e && !this.eventHasFunctionModifier(t) && (e = this.activeSequences[i] || this.singleKeys[i] || this.sequenceStarters[i]), e
        }, this.clearActiveSequences = function() {
            this.activeSequences = {}
        }, this.eventHasModifier = function(t) {
            return t.ctrlKey || t.altKey || t.metaKey || t.shiftKey
        }, this.eventHasFunctionModifier = function(t) {
            return t.ctrlKey || t.metaKey
        }, this.eventHasTextModifier = function(t) {
            return t.altKey || t.shiftKey
        }, this.getModifiedKeyEvent = function(t, e) {
            var i;
            return this.eventHasModifier(t) && e.modifiers && _.each(e.modifiers, function(e, s) {
                t[s] && (i = e)
            }, this), i
        }, this.handleKeyPress = function(t) {
            var e, i = [],
                s = ":not(input):not(textarea):not(select)",
                n = ":radio,:checkbox";
            t.which >= 65 && t.which <= 90 && (t.which += 32), e = this.getShortcutForEvent(t), e ? e.sequences ? (_.each(e.sequences, function(t, e) {
                this.addSequenceEnd(e, t)
            }, this), setTimeout(function() {
                this.clearActiveSequences()
            }.bind(this), this.attr.keySequenceTimeoutDelay)) : (i = e.shortcuts || [e], i = i.map(function(e) {
                return e.modifiers && (e = this.getModifiedKeyEvent(t, e)), e
            }, this), i = i.filter(function(t) {
                return void 0 !== t
            }), i.forEach(function(e) {
                var i = e.selector || s,
                    o = $(t.target);
                (o.is(i) || o.is(n)) && e.callback(t, e.data)
            }), this.clearActiveSequences()) : this.clearActiveSequences()
        }, this.getCharCodeForKey = function(t) {
            var e, i = !1,
                s = [
                    [32, 64],
                    [91, 126]
                ];
            if ("string" != typeof t) throw "Key must be a string";
            return t = t.toLowerCase(), 1 === t.length ? (e = t.charCodeAt(0), s.forEach(function(t) {
                return e >= t[0] && e <= t[1] ? (i = !0, !1) : void 0
            }), i || (e = void 0)) : e = this.attr.charCodes[t], e
        }, this.addSingleKey = function(t, e, i, s) {
            var n;
            if ("function" != typeof e) throw "addSingleKey: no callback";
            if (n = this.getCharCodeForKey(t), void 0 === n) throw "addSingleKey: invalid key string";
            if (this.singleKeys[n]) {
                var o = this.singleKeys[n].shortcuts.every(function(t) {
                    return e !== t.callback || i !== t.selector
                }, this);
                if (!o) throw "addSingleKey: attempted to add identical shortcut"
            } else this.singleKeys[n] = {
                shortcuts: []
            };
            this.singleKeys[n].shortcuts.push({
                shortcut: t,
                callback: e,
                selector: i,
                data: s
            })
        }, this.addSequence = function(t, e, i, s) {
            var n, o, r;
            if ("function" != typeof e) throw "addSequence: no callback";
            if ("string" != typeof t) throw "addSequence: sequence must be a string";
            if (n = t.split(" "), 2 !== n.length) throw 'addSequence: sequence should be in format "g a"';
            if (o = this.getCharCodeForKey(n[0]), void 0 === o) throw 'addSequence: sequence should be in format "g a"';
            if (r = this.getCharCodeForKey(n[1]), void 0 === r) throw 'addSequence: sequence should be in format "g a"';
            this.sequenceStarters[o] || (this.sequenceStarters[o] = {
                sequences: {}
            }), this.sequenceStarters[o].sequences[n[1]] = {
                shortcut: t,
                callback: e,
                selector: i,
                data: s
            }
        }, this.addSequenceEnd = function(t, e) {
            var i;
            if ("function" != typeof e.callback) throw "addSequenceEnd: no callback";
            if ("string" != typeof t) throw "addSequenceEnd: invalid shortcut key";
            if (i = this.getCharCodeForKey(t), void 0 === i) throw "addSequenceEnd: invalid shortcut key";
            this.activeSequences[i] = {
                shortcut: e.shortcut,
                callback: e.callback,
                selector: e.selector,
                data: e.data
            }
        }, this.addCombo = function(t, e, i, s) {
            var n, o, r;
            if ("function" != typeof e) throw "addCombo: no callback";
            if ("string" != typeof t) throw "addCombo: invalid combo string";
            if (n = t.split("+"), 2 !== n.length) throw 'addCombo: invalid combo "' + t + '"';
            if (o = this.attr.modifiers[n[0].toLowerCase()], void 0 === o) throw "addCombo: invalid modifier";
            if (r = this.getCharCodeForKey(n[1]), void 0 === r) throw "addCombo: invalid shortcut key";
            var a = {
                modifiers: {}
            };
            a.modifiers[o] = {
                shortcut: t,
                callback: e,
                selector: i,
                data: s
            }, this.combos[r] || (this.combos[r] = {
                shortcuts: []
            }), this.combos[r].shortcuts.push(a)
        }, this.isSequence = function(t) {
            return "string" == typeof t && t.indexOf(" ") > 0
        }, this.isCombo = function(t) {
            return "string" == typeof t && t.indexOf("+") > 0
        }, this.addShortcut = function(t, e, i, s) {
            3 === arguments.length && "string" != typeof i && (s = i, i = void 0), this.isCombo(t) ? this.addCombo(t, e, i, s) : this.isSequence(t) ? this.addSequence(t, e, i, s) : this.addSingleKey(t, e, i, s)
        }, this.removeSingleKey = function(t) {
            var e = this.getCharCodeForKey(t);
            this.singleKeys[e] && delete this.singleKeys[e]
        }, this.removeCombo = function(t) {
            var e = this.getCharCodeForKey(t.split("+")[1]);
            this.combos[e] && delete this.combos[e]
        }, this.removeSequence = function(t) {
            var e = this.getCharCodeForKey(t.split(" ")[0]);
            this.sequenceStarters[e] && delete this.sequenceStarters[e]
        }, this.removeShortcut = function(t) {
            this.isCombo(t) ? this.removeCombo(t) : this.isSequence(t) ? this.removeSequence(t) : this.removeSingleKey(t)
        }, this.handleKeyDown = function(t) {
            var e = [this.attr.charCodes.del, this.attr.charCodes.bksp, this.attr.charCodes.esc, this.attr.charCodes.ret, this.attr.charCodes.left, this.attr.charCodes.right, this.attr.charCodes.up, this.attr.charCodes.down, this.attr.charCodes.pagedown, this.attr.charCodes.pageup, this.attr.charCodes.home, this.attr.charCodes.end],
                i = e.some(function(e) {
                    return e === t.which
                });
            i && this.handleKeyPress(t)
        }, this.after("initialize", function() {
            this.on(window, "keypress", this.handleKeyPress), this.on(window, "keydown", this.handleKeyDown)
        })
    }
    return t
}), define("ui/keyboard_shortcuts", ["flight/lib/component", "ui/with_key_handler"], function(t, e) {
    var i = function() {
        this.defaultAttrs({
            shortcuts: {
                esc: [{
                    event: "uiKeyEscape"
                }, {
                    event: "uiInputBlur",
                    selector: "input, textarea, select"
                }, {
                    event: "uiCloseModal"
                }, {
                    event: "uiCloseDropdown"
                }, {
                    event: "uiGridClearSelection"
                }, {
                    event: "uiComposeClose"
                }],
                "CMD+ret": [{
                    event: "uiSendRetweetAction"
                }, {
                    event: "uiComposeSendTweet",
                    selector: ".js-compose-text"
                }],
                "CTRL+ret": [{
                    event: "uiSendRetweetAction"
                }, {
                    event: "uiComposeSendTweet",
                    selector: ".js-compose-text"
                }],
                del: [{
                    event: "uiGridBack"
                }],
                bksp: [{
                    event: "uiGridBack"
                }],
                ret: [{
                    event: "uiKeyEnter"
                }, {
                    event: "uiInputSubmit",
                    selector: ".js-submittable-input"
                }],
                space: [{
                    event: "uiKeySpace",
                    throttle: !0
                }, {
                    event: "uiGridPageDown",
                    throttle: !0
                }],
                n: [{
                    event: "uiComposeTweet"
                }],
                "/": [{
                    event: "uiAppSearchFocus"
                }],
                s: [{
                    event: "uiAppSearchFocus"
                }],
                a: [{
                    event: "uiShowAddColumn"
                }],
                x: [{
                    event: "uiToggleNavbarWidth"
                }],
                "?": [{
                    event: "uiShowKeyboardShortcutList"
                }],
                left: [{
                    event: "uiKeyLeft",
                    throttle: !0
                }],
                h: [{
                    event: "uiKeyLeft",
                    throttle: !0
                }],
                right: [{
                    event: "uiKeyRight",
                    throttle: !0
                }],
                l: [{
                    event: "uiKeyRight",
                    throttle: !0
                }],
                up: [{
                    event: "uiKeyUp",
                    throttle: !0
                }],
                k: [{
                    event: "uiKeyUp",
                    throttle: !0
                }],
                down: [{
                    event: "uiKeyDown",
                    throttle: !0
                }],
                j: [{
                    event: "uiKeyDown",
                    throttle: !0
                }],
                r: [{
                    event: "uiGridReply"
                }],
                f: [{
                    event: "uiGridFavorite"
                }],
                t: [{
                    event: "uiGridRetweet"
                }],
                d: [{
                    event: "uiGridDirectMessage"
                }],
                m: [{
                    event: "uiGridDirectMessage"
                }],
                p: [{
                    event: "uiGridProfile"
                }],
                c: [{
                    event: "uiGridCustomTimeline"
                }],
                "SHIFT+ ": [{
                    event: "uiGridPageUp",
                    throttle: !0
                }],
                pageup: [{
                    event: "uiGridPageUp",
                    throttle: !0
                }],
                pagedown: [{
                    event: "uiGridPageDown",
                    throttle: !0
                }],
                home: [{
                    event: "uiGridHome",
                    throttle: !0
                }],
                end: [{
                    event: "uiGridEnd",
                    throttle: !0
                }],
                ",": [{
                    event: "uiShowGlobalSettings"
                }]
            }
        }), this.blurInput = function(t) {
            $(t.target).blur()
        }, this.shortcutEventHandlerFactory = function(t) {
            var e, i, s = function(e) {
                    e.preventDefault(), e.stopPropagation(), this.trigger(e.target, t.event, {
                        keyboardShortcut: !0
                    })
                }.bind(this);
            return t.throttle ? e = _.throttle(s, 100) : i = _.debounce(s, 200, !0)
        }, this.columnFocusFactory = function(t) {
            return function(e) {
                e.preventDefault(), e.stopPropagation(), 0 === t ? this.trigger("uiColumnFocus", {
                    last: !0
                }) : this.trigger("uiColumnFocus", {
                    index: t - 1
                })
            }.bind(this)
        }, this.after("initialize", function() {
            this.on(document, "uiInputBlur", this.blurInput);
            for (var t = 0; 10 > t; t++) this.addShortcut(t + "", this.columnFocusFactory(t));
            _.each(this.attr.shortcuts, function(t, e) {
                t.forEach(function(t) {
                    var i = this.shortcutEventHandlerFactory(t);
                    this.addShortcut(e, i, t.selector)
                }, this)
            }, this)
        })
    };
    return t(i, e)
}), define("ui/message_banner", ["flight/lib/component", "ui/with_template"], function(t, e) {
    var i = function() {
        this.defaultAttrs({
            dismissButton: ".js-dismiss",
            actions: {
                triggerEvent: "trigger-event",
                dismiss: "dismiss",
                openUrl: "url-ext"
            },
            buttonClasses: {
                "trigger-event": "btn-positive",
                "url-ext": "btn-positive",
                dismiss: "btn-alt"
            }
        }), this.eventHandlerFactory = function(t) {
            return function() {
                switch (t.action) {
                    case "trigger-event":
                        this.trigger(t.event.type, t.event.data);
                        break;
                    case "url-ext":
                    case "dismiss":
                }
                this.trigger("uiClickMessageButtonAction", {
                    messageId: this.message.id,
                    actionId: t.id
                }), this.hide()
            }.bind(this)
        }, this.dismiss = function() {
            this.trigger("uiDismissMessageAction", this.message), this.hide()
        }, this.hide = function() {
            window.clearInterval(this.resizeBannerCheckInterval), this.trigger("uiHidingMessageBanner", this.message), this.message = null
        }, this.handleMessageData = function(t, e) {
            this.message && this.message.id === e.message.id || (this.message = e.message, this.showMessage())
        }, this.handleMessageContainerHidden = function() {
            this.$node.addClass("is-hidden")
        }, this.showMessage = function() {
            this.trigger("uiShowMessageBanner", this.message);
            var t, e, i, s = {
                    text: this.message.text,
                    actions: []
                };
            for (e = 0; this.message.actions && e < this.message.actions.length; e++) switch (t = this.message.actions[e], i = t.class, t.action) {
                case this.attr.actions.openUrl:
                    s.actions.push({
                        label: t.label,
                        action: t.action,
                        actionId: t.id,
                        url: t.url,
                        isExternalUrl: !0,
                        boundEventHandler: this.eventHandlerFactory(t),
                        buttonClass: i || this.attr.buttonClasses[t.action]
                    });
                    break;
                case this.attr.actions.triggerEvent:
                    s.actions.push({
                        label: t.label,
                        action: t.action,
                        actionId: t.id,
                        boundEventHandler: this.eventHandlerFactory(t),
                        buttonClass: i || this.attr.buttonClasses[t.action]
                    });
                    break;
                case this.attr.actions.dismiss:
                    s.actions.push({
                        label: t.label,
                        action: t.action,
                        actionId: t.id,
                        boundEventHandler: this.eventHandlerFactory(t),
                        buttonClass: i || this.attr.buttonClasses[t.action]
                    })
            }
            this.render("topbar/message_banner", s), this.message.colors && this.$node.css({
                "background-color": this.message.colors.background,
                color: this.message.colors.foreground
            }), this.on(this.select("dismissButton"), "click", this.dismiss), s.actions.forEach(function(t) {
                this.on('[data-action-id="' + t.actionId + '"]', "click", t.boundEventHandler)
            }.bind(this)), this.resizeBannerCheckInterval = window.setInterval(function() {
                this.currentBannerHeight && this.currentBannerHeight !== this.$node.outerHeight() && this.trigger("uiMessageBannerResized"), this.currentBannerHeight = this.$node.outerHeight()
            }.bind(this), 200), this.$node.removeClass("is-hidden"), this.trigger("uiMessageBannerShown", this.message)
        }, this.after("initialize", function() {
            this.on(document, "dataMessage", this.handleMessageData), this.on(document, "uiMessageBannerContainerHidden", this.handleMessageContainerHidden)
        })
    };
    return t(i, e)
}), define("ui/search_input", ["flight/lib/component"], function(t) {
    var e = function() {
        this.defaultAttrs({
            clearButtonSelector: ".js-clear-search",
            textInputSelector: 'input[type="text"]',
            hasValueClass: "has-value",
            isWaitingForResponseClass: "is-waiting-for-response"
        }), this.handleClearAction = function() {
            this.$textInput.val(""), this.$node.removeClass(this.attr.hasValueClass), this.$textInput.trigger("change")
        }, this.handleAsyncFormReceivedResponse = function() {
            var t = this.$textInput.val();
            this.$node.removeClass(this.attr.isWaitingForResponseClass), "" !== t ? this.$node.addClass(this.attr.hasValueClass) : this.$node.removeClass(this.attr.hasValueClass), this.value = t
        }, this.handleAsyncFormWaitingForResponse = function() {
            var t = this.$textInput.val();
            void 0 !== this.value && this.value !== t && this.$node.addClass(this.attr.isWaitingForResponseClass), this.value = t
        }, this.after("initialize", function() {
            this.$textInput = this.select("textInputSelector"), this.value = this.$textInput.val().trim(), "" !== this.value && this.$node.addClass(this.attr.hasValueClass), this.on("click", {
                clearButtonSelector: this.handleClearAction
            }), this.on("uiAsyncFormWaitingForResponse", this.handleAsyncFormWaitingForResponse), this.on("uiAsyncFormReceivedResponse", this.handleAsyncFormReceivedResponse), this.on("uiSearchInputDestroy", this.teardown)
        })
    };
    return t(e)
}), define("ui/asynchronous_form", ["flight/lib/component", "ui/search_input"], function(t, e) {
    var i = function() {
        this.defaultAttrs({
            searchControlSelector: ".js-search-input-control"
        }), this.waitingForAsyncResponse = function() {
            this.trigger(this.$searchControls, "uiAsyncFormWaitingForResponse")
        }, this.receivedAsyncResponse = function() {
            this.trigger(this.$searchControls, "uiAsyncFormReceivedResponse")
        }, this.handleSearchInputCleared = function() {
            this.$node.closest("form").submit()
        }, this.destroy = function() {
            this.teardown()
        }, this.before("teardown", function() {
            this.trigger(this.$searchControls, "uiSearchInputDestroy")
        }), this.after("initialize", function() {
            this.on("uiReceivedAsyncResponse", this.receivedAsyncResponse), this.on("uiWaitingForAsyncResponse", this.waitingForAsyncResponse), this.on("uiDestroyAsynchronousForm", this.destroy), this.on("uiSearchInputCleared", this.handleSearchInputCleared), this.$searchControls = this.select("searchControlSelector"), e.attachTo(this.$searchControls)
        })
    };
    return t(i)
}), define("ui/app_search", ["flight/lib/component", "ui/asynchronous_form"], function(t, e) {
    function i() {
        this.defaultAttrs({
            sourceId: "appSearch",
            appSearchInputSelector: ".js-app-search-input",
            searchButtonSelector: ".js-perform-search",
            clearButtonSelector: ".js-clear-search",
            KEY_CODE_MAP: {
                13: {
                    name: "ENTER",
                    event: "uiSearchInputSubmit",
                    on: "keypress",
                    preventDefault: !0
                },
                27: {
                    name: "ESC",
                    event: "uiSearchInputEscaped",
                    on: "keydown"
                },
                9: {
                    name: "TAB",
                    event: "uiSearchInputTab",
                    on: "keydown",
                    preventDefault: !0
                },
                37: {
                    name: "LEFT",
                    event: "uiSearchInputLeft",
                    on: "keydown"
                },
                39: {
                    name: "RIGHT",
                    event: "uiSearchInputRight",
                    on: "keydown"
                },
                38: {
                    name: "UP",
                    event: "uiSearchInputMoveUp",
                    on: "keydown",
                    preventDefault: !0
                },
                40: {
                    name: "DOWN",
                    event: "uiSearchInputMoveDown",
                    on: "keydown",
                    preventDefault: !0
                }
            }
        }), this.after("initialize", function() {
            e.attachTo(this.$node, {
                source: "appSearch"
            }), this.$input = this.select("appSearchInputSelector"), this.on(this.$input, "keyup keydown keypress paste", this.modifierKeyPressed), this.on(this.$input, "focus", this.handleFocus), this.on(this.$input, "uiInputBlur", function() {
                this.$input.blur()
            }), this.on(this.$input, "click", function(t) {
                t.stopPropagation()
            }), this.on(this.select("searchButtonSelector"), "click", function() {
                this.trigger(this.$input, "uiSearchInputSubmit", {
                    query: this.$input.val()
                })
            }), this.on(this.select("clearButtonSelector"), "click", this.handleClearSearchAction), this.on("uiAppSearchSetPreventDefault", this.setPreventKeyDefault), this.on("uiAppSearchItemComplete", this.completeInput), this.on("uiAppSearchSubmit", this.handleAppSearchSubmit), this.on(document, "uiNewSearchQuery uiSearchInputChanged", this.handleSearchInputChanged), this.on("uiSearchInPopoverHidden", this.handleResetState)
        }), this.handleSearchInputChanged = function(t, e) {
            e.source !== this.attr.sourceId && (this.$input.val(e.query), this.currentQuery = e.query)
        }, this.handleAppSearchSubmit = function(t, e) {
            this.completeInput(t, e), this.trigger(this.$input, "uiSearchInputSubmit", {
                query: this.$input.val()
            })
        }, this.around("trigger", function() {
            var t, e = [].slice.call(arguments),
                i = e.shift();
            "string" != typeof e[e.length - 1] && (t = e.pop()), void 0 === t ? t = {
                source: this.attr.sourceId
            } : t.source = this.attr.sourceId, e.push(t), i.apply(this, e)
        }), this.setPreventKeyDefault = function(t, e) {
            this.attr.KEY_CODE_MAP[e.key].preventDefault = e.preventDefault
        }, this.handleFocus = function() {
            _.defer(this.$input.select.bind(this.$input)), this.trigger(this.$input, "uiSearchInputFocus", {
                query: this.$input.val()
            })
        }, this.modifierKeyPressed = function(t) {
            var e = this.$input.val();
            e = "" === e.trim() ? "" : e;
            var i = this.attr.KEY_CODE_MAP[t.which || t.keyCode];
            if (i) {
                if (t.type !== i.on) return;
                i.preventDefault && t.preventDefault(), this.trigger(this.$input, i.event, {
                    query: e
                })
            } else this.setQueryAndTriggerUpdateEvent(e)
        }, this.completeInput = function(t, e) {
            "user" === e.searchType && (e.query = "@" + e.query), this.trigger("uiAppSearchSetQuery", {
                data: e.query
            }), this.$input.val(e.query), this.setQueryAndTriggerUpdateEvent(e.query), this.focusInput(), this.$input[0].selectionStart = e.query.length, this.$input[0].selectionEnd = e.query.length
        }, this.setQueryAndTriggerUpdateEvent = function(t) {
            this.currentQuery && this.currentQuery === t || (this.currentQuery = t, this.trigger(this.$input, "uiSearchInputChanged", {
                query: this.currentQuery
            }))
        }, this.focusInput = function() {
            this.$input.focus()
        }, this.handleClearSearchAction = function() {
            this.focusInput()
        }, this.handleResetState = function() {
            this.currentQuery = null, this.$input.val("")
        }, this.before("teardown", function() {
            this.trigger("uiDestroyAsynchronousForm")
        })
    }
    return t(i)
}), define("ui/alerts_form", ["flight/lib/component", "ui/with_template"], function(t, e) {
    var i = function() {
        this.defaultAttrs({
            template: "column/alerts_form",
            actionButton: "[data-action]",
            summarySelector: ".js-alerts-summary",
            summaryClass: "js-alerts-summary"
        }), this.updateSummary = function() {
            var t, e = this.column.model,
                i = e.getHasNotification(),
                s = e.getHasSound();
            t = i && s ? TD.i("sounds and popups") : i ? TD.i("popups") : s ? TD.i("sounds") : TD.i("none"), this.select("summarySelector").text(t)
        }, this.toggleColumnSetting = function(t) {
            var e, i = TD.controller.notifications,
                s = $(t.target).closest(this.attr.actionButton),
                n = s.data("action"),
                o = this.column.model,
                r = function(t) {
                    "granted" === t && o.setHasNotification(e)
                };
            switch (n) {
                case "popups":
                    e = !o.getHasNotification(), i.isPermissionGranted() ? r("granted") : i.getPermission(r);
                    break;
                case "sound":
                    e = !o.getHasSound(), o.setHasSound(e)
            }
            this.updateSummary()
        }, this.after("initialize", function() {
            var t = {
                summaryText: "",
                iconClass: "icon-info",
                title: TD.i("Alerts"),
                jsClass: this.attr.summaryClass,
                options: [{
                    action: "sound",
                    option: TD.i("Sounds"),
                    on: this.attr.column.model.getHasSound()
                }]
            };
            return this.column = this.attr.column, this.column.getColumnType() === TD.util.columnUtils.columnMetaTypes.SCHEDULED ? (this.teardown(), void 0) : (TD.controller.notifications.hasNotifications() && t.options.push({
                action: "popups",
                option: TD.i("Popups"),
                on: this.column.model.getHasNotification()
            }), this.$alertsForm = this.renderTemplate(this.attr.template, t), this.$node.append(this.$alertsForm), this.updateSummary(), this.on(this.$alertsForm, "click", {
                actionButton: this.toggleColumnSetting
            }), void 0)
        })
    };
    return t(i, e)
}), define("ui/with_transitions", [], function() {
    function t() {
        this.measureElementHeight = function(t, e) {
            var i = $(t);
            return i.removeClass(e), i.height()
        }, this.animateHeight = function(t, e, i, s) {
            var n, o, r = this.measureElementHeight(t, e),
                a = function() {
                    "function" == typeof i && i(), "collapse" === s && t.css("height", "")
                };
            "expand" === s ? (n = 0, o = r) : (n = r, o = 0), this.animateHeightFromTo(t, n, o, e, a)
        }, this.animateHeightFromTo = function(t, e, i, s, n) {
            var o = function() {
                t.removeClass(s), t.trigger("uiTransitionExpandEnd"), "function" == typeof n && n()
            };
            return e === i ? (n && n(), void 0) : (t.css({
                height: e
            }), _.defer(function() {
                t.addClass(s), t.trigger("uiTransitionExpandStart", {
                    delta: i - e
                }), TD.ui.main.TRANSITION_END_EVENTS ? t.one(TD.ui.main.TRANSITION_END_EVENTS, o) : o(), t.height(i)
            }.bind(this)), void 0)
        }, this.animateElementContentHeight = function(t, e, i, s) {
            var n = function() {
                t.html(e)
            };
            this.animateElementHeightChange(t, n, i, s)
        }, this.animateElementHeightChange = function(t, e, i, s) {
            var n, o = this.measureElementHeight(t, i);
            t.css({
                height: ""
            }), e(), n = this.measureElementHeight(t), this.animateHeightFromTo(t, o, n, i, s)
        }, this.transitionExpand = function(t, e, i) {
            this.animateHeight(t, e, i, "expand")
        }, this.transitionCollapse = function(t, e, i) {
            this.animateHeight(t, e, i, "collapse")
        }, this.transitionTop = function(t, e, i, s) {
            var n = function() {
                t.removeClass(e), "function" == typeof s && s()
            };
            t.addClass(e), t.css("top", i), TD.ui.main.TRANSITION_END_EVENTS ? t.one(TD.ui.main.TRANSITION_END_EVENTS, n) : n()
        }, this.addAnimateClass = function(t, e, i) {
            return i = i || function() {}, TD.ui.main.ANIMATION_END_EVENTS ? (t.one(TD.ui.main.ANIMATION_END_EVENTS, function() {
                t.removeClass(e), i()
            }), t.addClass(e), void 0) : (i(), void 0)
        }, this.stopAnimation = function(t, e) {
            t.off(TD.ui.main.ANIMATION_END_EVENTS), t.removeClass(e)
        }
    }
    return t
}), define("ui/with_accordion", ["flight/lib/compose", "ui/with_transitions"], function(t, e) {
    var i = function() {
        t.mixin(this, [e]), this.defaultAttrs({
            accordionItemSelector: ".js-accordion-item",
            accordionIsExpandedClass: "is-expanded",
            accordionIsActiveClass: "is-active",
            accordionToggleSelector: ".js-accordion-toggle-view",
            accordionPanelSelector: ".js-accordion-panel",
            isAccordionPanelAnimatingClass: "is-accordion-panel-animating"
        }), this.expandAccordionItem = function(t) {
            var e = t.find(this.attr.accordionPanelSelector);
            t.addClass(this.attr.accordionIsExpandedClass), t.addClass(this.attr.accordionIsActiveClass), this.transitionExpand(e, this.attr.isAccordionPanelAnimatingClass), this.trigger(t, "uiAccordionExpandAction")
        }, this.collapseAccordionItem = function(t) {
            var e = t.find(this.attr.accordionPanelSelector);
            t.removeClass(this.attr.accordionIsActiveClass), this.transitionCollapse(e, this.attr.isAccordionPanelAnimatingClass, function() {
                t.removeClass(this.attr.accordionIsExpandedClass)
            }.bind(this)), this.trigger(t, "uiAccordionCollapseAction")
        }, this.getOpenAccordionItem = function() {
            return this.select("accordionItemSelector").filter(function(t, e) {
                return $(e).hasClass(this.attr.accordionIsExpandedClass)
            }.bind(this))
        }, this.accordionToggle = function(t) {
            var e = $(t.target).closest(this.attr.accordionItemSelector),
                i = this.getOpenAccordionItem();
            i.length > 0 && this.collapseAccordionItem(i), e.is(i) || this.expandAccordionItem(e)
        }, this.showAccordionPanel = function(t) {
            var e = t.closest(this.attr.accordionItemSelector),
                i = this.getOpenAccordionItem();
            e.is(i) || (this.collapseAccordionItem(i), this.expandAccordionItem(e))
        }, this.handleUpdatePanelHeights = function() {
            this.select("accordionPanelSelector").filter(":visible").each(function(t, e) {
                var i = $(e);
                i.css("height", ""), i.height(i.height()), this.trigger("uiAccordionTotalHeightChanged")
            }.bind(this))
        }, this.after("initialize", function() {
            this.on("click", {
                accordionToggleSelector: _.throttle(this.accordionToggle, 300).bind(this)
            }), this.on("uiAccordionUpdatePanelHeights", this.handleUpdatePanelHeights)
        })
    };
    return i
}), define("data/with_languages", [], function() {
    function t() {
        this.before("initialize", function() {
            this.languages = TD.languages.getAllLanguages()
        })
    }
    return t
}), define("ui/search/content_filter_form", ["flight/lib/component", "ui/with_template", "data/with_languages"], function(t, e, i) {
    var s = function() {
        this.defaultAttrs({
            filterType: "content",
            template: "menus/search_content_form",
            matchingSelector: ".js-matching",
            excludingSelector: ".js-excluding",
            containingSelector: ".js-containing",
            writtenInSelector: ".js-written-in",
            retweetsSelector: ".js-retweets",
            searchFilter: null,
            renderOptions: {
                withContentType: !0,
                withMatching: !0,
                withExcluding: !0,
                withLanguage: !0,
                withRetweetsToggle: !0
            }
        }), this.getContainingOptions = function() {
            return [{
                value: TD.vo.ContentFilter.TYPE_ANYTHING,
                title: TD.i("all Tweets")
            }, {
                value: TD.vo.ContentFilter.TYPE_IMG,
                title: TD.i("Tweets with images")
            }, {
                value: TD.vo.ContentFilter.TYPE_VID,
                title: TD.i("Tweets with videos")
            }, {
                value: TD.vo.ContentFilter.TYPE_IMG_AND_VID,
                title: TD.i("Tweets with any media")
            }, {
                value: TD.vo.ContentFilter.TYPE_LINKS,
                title: TD.i("Tweets with links")
            }]
        }, this.getRetweetOptions = function() {
            return [{
                value: "included",
                title: TD.i("included"),
                isIncluded: !0
            }, {
                value: "excluded",
                title: TD.i("excluded"),
                isIncluded: !1
            }]
        }, this.handleChange = function(t) {
            var e = this.$containing.val(),
                i = this.$matching.val(),
                s = this.$excluding.val(),
                n = this.$writtenIn.val(),
                o = this.$retweets.val(),
                r = this.retweetOptions.filter(function(t) {
                    return t.value === o
                })[0],
                a = new TD.vo.ContentFilter({
                    type: e,
                    matching: i,
                    excluding: s,
                    lang: n,
                    includeRTs: r.isIncluded
                });
            this.trigger("uiSearchFilterUpdateAction", {
                type: "content",
                filter: a,
                filterName: $(t.target).data("title"),
                value: t.target.value
            })
        }, this.after("initialize", function() {
            this.containingOptions = this.getContainingOptions(), this.retweetOptions = this.getRetweetOptions();
            var t = {
                containingOptions: this.containingOptions,
                retweetOptions: this.retweetOptions
            }, e = TD.languages.getSystemLanguageCode(!0),
                i = TD.languages.getLanguageFromISOCode(e);
            t.userLanguage = i, t.allLanguages = _.sortBy(this.languages, function(t) {
                return t.localized_name
            }), $.extend(t, this.attr.renderOptions), this.render(this.attr.template, t), this.$matching = this.select("matchingSelector"), this.$excluding = this.select("excludingSelector"), this.$containing = this.select("containingSelector"), this.$writtenIn = this.select("writtenInSelector"), this.$retweets = this.select("retweetsSelector"), this.attr.searchFilter && this.attr.searchFilter.content && (this.$containing.val(this.attr.searchFilter.content.type), this.attr.searchFilter.content.includeRTs ? this.$retweets.val("included") : this.$retweets.val("excluded"), this.$writtenIn.val(this.attr.searchFilter.content.lang)), this.on("change", this.handleChange), this.on("uiDestroyContentFilterForm", this.teardown)
        })
    };
    return t(s, e, i)
}), define("ui/search/user_filter_form", ["flight/lib/component", "ui/with_template", "data/with_languages"], function(t, e, i) {
    var s = function() {
        this.defaultAttrs({
            FROM_ME: "from_me",
            MENTIONING_USER: "mentioning_user",
            MENTIONING_ME: "mentioning_me",
            filterType: "user",
            template: "menus/search_user_form",
            tweetsFromSelector: ".js-tweets-from",
            tweetsFromUserSelector: ".js-tweets-from-user",
            tweetsFromUserClass: "js-tweets-from-user",
            tweetsFromUserInputSelector: '.js-tweets-from-user input[type="text"]',
            tweetsFromListSelector: ".js-tweets-from-list",
            tweetsFromListClass: "js-tweets-from-list",
            tweetsFromListInputSelector: '.js-tweets-from-list input[type="text"]',
            tweetsFromMeSelector: ".js-tweets-from-me",
            mentioningSelector: ".js-mentioning",
            mentioningUserSelector: ".js-mentioning-user",
            mentioningUserInputSelector: '.js-mentioning-user input[type="text"]',
            mentioningUserClass: "js-mentioning-user",
            mentioningMeSelector: ".js-mentioning-me",
            isHiddenClass: "is-hidden",
            renderOptions: {
                withFromList: !1
            }
        }), this.getTweetsFromOptions = function(t) {
            var e = [{
                value: TD.vo.UserFilter.FROM_ALL,
                title: TD.i("all users")
            }, {
                value: TD.vo.UserFilter.FROM_USER,
                title: TD.i("specific user…")
            }, {
                value: this.attr.FROM_ME,
                title: TD.i("me…")
            }, {
                value: TD.vo.UserFilter.FROM_VERIFIED,
                title: TD.i("verified users")
            }];
            return t && e.push({
                value: TD.vo.UserFilter.FROM_LIST,
                title: TD.i("members of list…")
            }), e
        }, this.getMentioningOptions = function() {
            return [{
                value: "",
                title: TD.i("-")
            }, {
                value: this.attr.MENTIONING_USER,
                title: TD.i("specific user…")
            }, {
                value: this.attr.MENTIONING_ME,
                title: TD.i("me…")
            }]
        }, this.getMyAccounts = function() {
            var t = TD.storage.accountController.getPreferredAccount("twitter"),
                e = TD.storage.accountController.getAccountsForService("twitter");
            return e = e.map(function(e) {
                return {
                    value: e.getUsername().toLowerCase(),
                    title: "@" + e.getUsername(),
                    isDefault: e === t
                }
            }), e = e.sort(function(t, e) {
                return t.value.toLowerCase().localeCompare(e.value.toLowerCase())
            })
        }, this.updateFormState = function(t, e) {
            switch (t) {
                case TD.vo.UserFilter.FROM_USER:
                    this.$tweetsFromUser.removeClass(this.attr.isHiddenClass), this.$tweetsFromList.addClass(this.attr.isHiddenClass), this.$tweetsFromMe.addClass(this.attr.isHiddenClass);
                    break;
                case TD.vo.UserFilter.FROM_LIST:
                    this.$tweetsFromList.removeClass(this.attr.isHiddenClass), this.$tweetsFromUser.addClass(this.attr.isHiddenClass), this.$tweetsFromMe.addClass(this.attr.isHiddenClass);
                    break;
                case this.attr.FROM_ME:
                    this.$tweetsFromMe.removeClass(this.attr.isHiddenClass), this.$tweetsFromUser.addClass(this.attr.isHiddenClass), this.$tweetsFromList.addClass(this.attr.isHiddenClass), this.$tweetsFromUserInput.val("");
                    break;
                default:
                    this.$tweetsFromMe.addClass(this.attr.isHiddenClass), this.$tweetsFromUser.addClass(this.attr.isHiddenClass), this.$tweetsFromList.addClass(this.attr.isHiddenClass), this.$tweetsFromUserInput.val("")
            }
            switch (e) {
                case this.attr.MENTIONING_USER:
                    this.$mentioningUser.removeClass(this.attr.isHiddenClass), this.$mentioningMe.addClass(this.attr.isHiddenClass);
                    break;
                case this.attr.MENTIONING_ME:
                    this.$mentioningMe.removeClass(this.attr.isHiddenClass), this.$mentioningUser.addClass(this.attr.isHiddenClass), this.$mentioningUserInput.val("");
                    break;
                default:
                    this.$mentioningMe.addClass(this.attr.isHiddenClass), this.$mentioningUser.addClass(this.attr.isHiddenClass), this.$mentioningUserInput.val("")
            }
        }, this.handleChange = function(t) {
            var e = "",
                i = "",
                s = this.$tweetsFrom.val(),
                n = this.$mentioning.val(),
                o = $(t.target).data("title");
            switch (this.updateFormState(s, n), s) {
                case this.attr.FROM_ME:
                    e = this.$tweetsFromMe.val(), s = TD.vo.UserFilter.FROM_USER;
                    break;
                case TD.vo.UserFilter.FROM_USER:
                    e = this.$tweetsFromUserInput.val();
                    break;
                case TD.vo.UserFilter.FROM_LIST:
                    e = this.$tweetsFromListInput.val()
            }
            i = n === this.attr.MENTIONING_ME ? this.$mentioningMe.val() : this.$mentioningUserInput.val(), !e && (s === TD.vo.UserFilter.FROM_USER || s === TD.vo.UserFilter.FROM_LIST) && (s = TD.vo.UserFilter.FROM_ALL);
            var r = new TD.vo.UserFilter({
                from_type: s,
                from_name: e,
                mention_name: i
            });
            this.trigger("uiSearchFilterUpdateAction", {
                type: "user",
                filter: r,
                filterName: o,
                value: t.target.value
            })
        }, this.after("initialize", function() {
            var t, e, i;
            this.tweetsFromOptions = this.getTweetsFromOptions(this.attr.renderOptions.withFromList), this.mentioningOptions = this.getMentioningOptions(), this.myAccounts = this.getMyAccounts();
            var s = this.attr.searchFilter,
                n = s.user && null !== s.user.from_type ? s.user.from_name : "",
                o = s.user ? s.user.mention_name : "";
            if (t = {
                tweetsFromOptions: this.tweetsFromOptions,
                tweetsFromUser: {
                    searchInputControlClass: this.attr.tweetsFromUserClass + " margin-txs",
                    searchInputPlaceholder: TD.i("user name"),
                    searchInputTitle: "from_user_or_list",
                    searchInputValue: n
                },
                tweetsFromList: {
                    searchInputControlClass: this.attr.tweetsFromListClass + " margin-txs",
                    searchInputPlaceholder: TD.i("@username/list-name"),
                    searchInputTitle: "from_user_or_list",
                    searchInputValue: n
                },
                mentioningUser: {
                    searchInputControlClass: this.attr.mentioningUserClass + " margin-txs",
                    searchInputPlaceholder: TD.i("user name"),
                    searchInputTitle: "mentioning_user",
                    searchInputValue: o
                },
                mentioningOptions: this.mentioningOptions,
                myAccounts: this.myAccounts
            }, this.render(this.attr.template, t), this.$tweetsFrom = this.select("tweetsFromSelector"), this.$tweetsFromUser = this.select("tweetsFromUserSelector"), this.$tweetsFromUserInput = this.select("tweetsFromUserInputSelector"), this.$tweetsFromList = this.select("tweetsFromListSelector"), this.$tweetsFromListInput = this.select("tweetsFromListInputSelector"), this.$tweetsFromMe = this.select("tweetsFromMeSelector"), this.$mentioning = this.select("mentioningSelector"), this.$mentioningUser = this.select("mentioningUserSelector"), this.$mentioningUserInput = this.select("mentioningUserInputSelector"), this.$mentioningMe = this.select("mentioningMeSelector"), this.attr.searchFilter && this.attr.searchFilter.user) {
                if (e = this.attr.searchFilter.user.from_name && TD.storage.accountController.getAccountFromUsername(this.attr.searchFilter.user.from_name).length > 0, i = this.attr.searchFilter.user.mention_name && TD.storage.accountController.getAccountFromUsername(this.attr.searchFilter.user.mention_name).length > 0, e) this.$tweetsFrom.val(this.attr.FROM_ME), this.$tweetsFromMe.val(this.attr.searchFilter.user.from_name);
                else switch (this.$tweetsFrom.val(this.attr.searchFilter.user.from_type), this.attr.searchFilter.user.from_type) {
                    case TD.vo.UserFilter.FROM_USER:
                        this.$tweetsFromUserInput.val(this.attr.searchFilter.user.from_name);
                        break;
                    case TD.vo.UserFilter.FROM_LIST:
                        this.$tweetsFromListInput.val(this.attr.searchFilter.user.from_name)
                }
                i ? (this.$mentioning.val(this.attr.MENTIONING_ME), this.$mentioningMe.val(this.attr.searchFilter.user.mention_name)) : this.attr.searchFilter.user.mention_name && (this.$mentioning.val(this.attr.MENTIONING_USER), this.$mentioningUserInput.val(this.attr.searchFilter.user.mention_name))
            }
            this.updateFormState(this.$tweetsFrom.val(), this.$mentioning.val()), this.on("change", this.handleChange), this.on("uiDestroyUserFilterForm", this.teardown)
        })
    };
    return t(s, e, i)
}), define("ui/search/action_filter_form", ["flight/lib/component", "ui/with_template"], function(t, e) {
    function i() {
        this.defaultAttrs({
            filterType: "action",
            columnType: null,
            template: "menus/search_action_form",
            searchFilter: null,
            showFavoritesSelector: ".js-show-favorites",
            showRetweetsSelector: ".js-show-retweets",
            showListsSelector: ".js-show-lists",
            showFollowersSelector: ".js-show-followers",
            showMentionsSelector: ".js-show-mentions",
            errorMessageSelector: ".js-action-filter-error",
            isHiddenClass: "is-hidden"
        }), this.isInActivityColumn = function() {
            return this.attr.columnType === TD.util.columnUtils.columnMetaTypes.ACTIVITY
        }, this.hasFilterError = function(t) {
            var e = t.getFilters().length,
                i = !1;
            return this.isInActivityColumn() ? e === TD.vo.ActionFilter.MAX_ACTIVITY_FILTERS && (i = !0) : e === TD.vo.ActionFilter.MAX_INTERACTION_FILTERS && (i = !0), i
        }, this.handleChange = function(t) {
            var e, i = {
                    showFollowers: this.$showFollowers.prop("checked"),
                    showLists: this.$showLists.prop("checked"),
                    showMentions: this.$showMentions.prop("checked"),
                    showRetweets: this.$showRetweets.prop("checked"),
                    showFavorites: this.$showFavorites.prop("checked")
                };
            0 === this.$showRetweets.length && (i.showRetweets = !0), 0 === this.$showMentions.length && (i.showMentions = !0), e = new TD.vo.ActionFilter(i), this.select("errorMessageSelector").toggleClass(this.attr.isHiddenClass, !this.hasFilterError(e)), this.trigger("uiAccordionUpdatePanelHeights"), this.trigger("uiSearchFilterUpdateAction", {
                type: this.attr.filterType,
                filter: e,
                filterName: $(t.target).data("title"),
                value: [t.target.value, t.target.checked ? "show" : "hide"].join(":")
            }), this.hasFilterError(e) && this.trigger("uiActionFilterError")
        }, this.after("initialize", function() {
            var t = this.attr.searchFilter.action.toJSONObject();
            t.showError = this.hasFilterError(this.attr.searchFilter.action), t.isInActivityColumn = this.isInActivityColumn(), this.render(this.attr.template, t), this.$showRetweets = this.select("showRetweetsSelector"), this.$showFavorites = this.select("showFavoritesSelector"), this.$showFollowers = this.select("showFollowersSelector"), this.$showLists = this.select("showListsSelector"), this.$showMentions = this.select("showMentionsSelector"), this.on("change", this.handleChange)
        })
    }
    return t(i, e)
}), define("ui/search/engagement_filter_form", ["flight/lib/component", "ui/with_template"], function(t, e) {
    function i() {
        this.defaultAttrs({
            filterType: "engagement",
            template: "menus/search_engagement_form",
            searchFilter: null,
            minRetweetsSelector: ".js-min-retweets",
            minRepliesSelector: ".js-min-replies",
            minFavoritesSelector: ".js-min-favorites",
            zeroClass: "txt-mute"
        }), this.after("initialize", function() {
            var t = this.attr.searchFilter.engagement;
            this.render(this.attr.template, t), this.$minFavorites = this.select("minFavoritesSelector"), this.$minRetweets = this.select("minRetweetsSelector"), this.$minReplies = this.select("minRepliesSelector"), this.on("change blur", this.handleChange), this.validateInput(this.attr.searchFilter.engagement)
        }), this.validateInput = function() {
            var t = parseInt(this.$minFavorites.val(), 10),
                e = parseInt(this.$minRetweets.val(), 10),
                i = parseInt(this.$minReplies.val(), 10);
            t = isNaN(t) ? 0 : t, e = isNaN(e) ? 0 : e, i = isNaN(i) ? 0 : i, this.$minFavorites.val(t).toggleClass(this.attr.zeroClass, 0 === t), this.$minRetweets.val(e).toggleClass(this.attr.zeroClass, 0 === e), this.$minReplies.val(i).toggleClass(this.attr.zeroClass, 0 === i)
        }, this.handleChange = function(t) {
            var e, i = $(t.target).data("title"),
                s = $(t.target).val();
            this.validateInput(), e = new TD.vo.EngagementFilter({
                minFavorites: this.$minFavorites.val(),
                minRetweets: this.$minRetweets.val(),
                minReplies: this.$minReplies.val()
            }), this.trigger("uiSearchFilterUpdateAction", {
                type: this.attr.filterType,
                filter: e,
                filterName: i,
                value: s
            })
        }
    }
    return t(i, e)
}), define("ui/with_search_filter", ["flight/lib/compose", "ui/with_template", "ui/search/content_filter_form", "ui/search/user_filter_form", "ui/search/action_filter_form", "ui/search/engagement_filter_form"], function(t, e, i, s, n, o) {
    var r = function() {
        t.mixin(this, [e]), this.defaultAttrs({
            searchAccordionTemplate: "menus/search_accordion",
            contentFilterSelector: ".js-content-filter",
            userFilterSelector: ".js-user-filter",
            actionFilterSelector: ".js-action-filter",
            engagementFilterSelector: ".js-engagement-filter",
            searchFilterSelector: ".js-search-filter",
            contentSummaryClass: "js-content-filter-summary",
            userSummaryClass: "js-user-filter-summary",
            actionSummaryClass: "js-action-filter-summary",
            engagementSummaryClass: "js-engagement-filter-summary",
            contentSummarySelector: ".js-content-filter-summary",
            userSummarySelector: ".js-user-filter-summary",
            actionSummarySelector: ".js-action-filter-summary",
            engagementSummarySelector: ".js-engagement-filter-summary",
            excludingClass: "js-excluding",
            matchingClass: "js-matching",
            filterTypes: ["content", "user", "action", "engagement"]
        }), this.isValidFilterType = function(t) {
            return this.attr.filterTypes.some(function(e) {
                return t === e
            })
        }, this.handleSearchFilterUpdate = function(t, e) {
            if (e.filter && this.isValidFilterType(e.type)) {
                this.searchFilter[e.type] = e.filter;
                var i = e.filter.getSummaryText(this.attr.columnType),
                    s = this.select(e.type + "SummarySelector");
                s.text(i), TD.controller.stats.advancedSearchSettings(this.attr.scribeSection, e.type, e.filterName, e.value), this.trigger(this.$accordion, "uiAccordionUpdatePanelHeights"), this.trigger("uiColumnUpdateSearchFilter", this.searchFilter)
            }
        }, this.renderSearchFilters = function(t, e) {
            this.searchFilter = t, this.$accordion = this.select("accordionSelector");
            var r = this.renderTemplate(this.attr.searchAccordionTemplate, {
                content: {
                    summaryText: this.searchFilter.content.getSummaryText(),
                    iconClass: "icon-content",
                    title: TD.i("Content"),
                    jsClass: this.attr.contentSummaryClass,
                    isExpanded: e.expandContentFilter
                },
                user: {
                    summaryText: this.searchFilter.user.getSummaryText(),
                    iconClass: "icon-user",
                    title: TD.i("Users"),
                    jsClass: this.attr.userSummaryClass,
                    isExpanded: e.expandUserFilter
                },
                action: e.withActionFilter ? {
                    summaryText: this.searchFilter.action.getSummaryText(this.attr.columnType),
                    iconClass: "icon-check",
                    title: TD.i("Showing"),
                    jsClass: this.attr.actionSummaryClass,
                    isExpanded: e.expandActionFilter
                } : !1,
                engagement: e.withEngagementFilter ? {
                    summaryText: this.searchFilter.engagement.getSummaryText(),
                    iconClass: "icon-retweet",
                    title: TD.i("Engagement"),
                    jsClass: this.attr.engagementSummaryClass,
                    isExpanded: e.expandEngagementFilter
                } : !1
            });
            this.$accordion.append(r), this.trigger(this.select("contentFilterSelector"), "uiDestroyContentFilterForm"), this.trigger(this.select("userFilterSelector"), "uiDestroyUserFilterForm"), i.attachTo(this.select("contentFilterSelector"), {
                searchFilter: t,
                renderOptions: e
            }), s.attachTo(this.select("userFilterSelector"), {
                searchFilter: t,
                renderOptions: e
            }), e.withActionFilter && n.attachTo(this.select("actionFilterSelector"), {
                searchFilter: t,
                renderOptions: e,
                columnType: this.attr.columnType
            }), e.withEngagementFilter && o.attachTo(this.select("engagementFilterSelector"), {
                searchFilter: t,
                renderOptions: e
            })
        }, this.after("initialize", function() {
            this.searchFilter = this.searchFilter || new TD.vo.SearchFilter, this.$searchFilter = this.select("searchFilterSelector"), this.on("uiSearchFilterUpdateAction", this.handleSearchFilterUpdate)
        })
    };
    return r
}), define("ui/with_thumb_size_select", ["flight/lib/compose", "ui/with_template"], function(t, e) {
    function i() {
        t.mixin(this, [e]), this.defaultAttrs({
            thumbSizeSelectSelector: ".js-thumb-size",
            thumbSizeSelectTemplate: "column/thumb_size_select",
            selectItemSelector: ".js-toggle-item",
            selectedClass: "is-selected"
        }), this.after("initialize", function() {
            this.on(this.$node, "click", {
                selectItemSelector: this.handleThumbSizeSelectClick
            }), this.on("uiColumnUpdateSearchFilter", this.renderThumbSizeSelector)
        }), this.renderThumbSizeSelector = function() {
            var t = this.toHtml(this.attr.thumbSizeSelectTemplate);
            this.$thumbSizeSelect = this.select("thumbSizeSelectSelector"), this.$thumbSizeSelect.html(t), this.$thumbSizeSelectOptions = this.select("selectItemSelector");
            var e = this.attr.column.getMediaPreviewSize(),
                i = '[data-value="' + e + '"]';
            this.$thumbSizeSelectOptions.filter(i).addClass(this.attr.selectedClass)
        }, this.handleThumbSizeSelectClick = function(t, e) {
            var i = $(e.el),
                s = i.data("value");
            s && (this.trigger("uiColumnUpdateMediaPreview", {
                value: s
            }), this.$thumbSizeSelectOptions.removeClass(this.attr.selectedClass), i.addClass(this.attr.selectedClass))
        }
    }
    return i
}), define("ui/column_options", ["flight/lib/component", "ui/alerts_form", "ui/with_accordion", "ui/with_template", "ui/with_search_filter", "ui/with_thumb_size_select", "ui/with_transitions"], function(t, e, i, s, n, o, r) {
    var a = function() {
        this.defaultAttrs({
            actionButton: "[data-action]",
            searchInputForm: ".js-column-options-search-form",
            searchInput: ".js-search-input",
            scribeSection: "column_options",
            isAnimatingClass: "is-column-options-animating",
            accordionSelector: ".js-accordion",
            columnType: null,
            isTouchColumnOptionsClass: "is-touch-column-options",
            hideContentClass: "scroll-none"
        }), this.updateHeight = function() {
            this.$node.css("height", ""), this.$node.height(this.$node.height()), this.trigger("uiAccordionTotalHeightChanged")
        }, this.handleChildTransitionExpandStart = function() {
            this.$node.css("height", "")
        }, this.handleChildTransitionExpandEnd = function() {
            this.$node.height(this.$node.height())
        }, this.handleUpdateSearchFilter = function(t, e) {
            this.updateHeight(), this.column.updateSearchFilter(e)
        }, this.handleShowUserFilter = function(t) {
            t.stopPropagation(), this.showAccordionPanel(this.select("userFilterSelector"))
        }, this.handleShowContentFilter = function(t) {
            t.stopPropagation(), this.showAccordionPanel(this.select("contentFilterSelector"))
        }, this.hide = function() {
            this.$node.hasClass(this.attr.isAnimatingClass) || (this.trigger("uiHidingColumnOptions"), this.$node.addClass(this.attr.hideContentClass), this.transitionCollapse(this.$node, this.attr.isAnimatingClass, this.afterHideTransition.bind(this)), this.teardown())
        }, this.afterHideTransition = function() {
            this.$node.css("height", ""), this.$node.empty(), this.trigger("uiColumnOptionsHidden")
        }, this.showColumnOptions = function() {
            var t = function() {
                this.$node.removeClass(this.attr.hideContentClass), this.trigger("uiColumnOptionsShown")
            }.bind(this);
            this.trigger("uiShowingColumnOptions"), this.$node.addClass(this.attr.hideContentClass), this.transitionExpand(this.$node, this.attr.isAnimatingClass, t.bind(this))
        }, this.handleClickEvents = function(t) {
            var e = $(t.target).closest(this.attr.actionButton),
                i = e.data("action"),
                s = this.column.model.getKey();
            switch (i) {
                case "remove":
                    this.trigger("uiDeleteColumnAction", {
                        columnId: s
                    });
                    break;
                case "clear":
                    this.column.clear(), this.trigger("uiClearColumnAction", {
                        columnId: s
                    });
                    break;
                case "left":
                case "right":
                    this.trigger("uiMoveColumnAction", {
                        columnId: s,
                        action: i
                    });
                    break;
                case "edit-list":
                    new TD.components.ListMembers(this.column.isOwnList());
                    break;
                case "delete-customtimeline":
                    var n = _.uniqueId(),
                        o = {
                            id: n,
                            title: TD.i("Delete"),
                            message: TD.i("Are you sure you want to delete this collection?"),
                            okLabel: TD.i("Delete"),
                            cancelLabel: TD.i("Cancel")
                        };
                    this.on(document, "uiConfirmationAction", function(t, e) {
                        e.id === n && (this.off(document, "uiConfirmationAction"), e.result && this.column.deleteCustomTimeline())
                    }), this.trigger("uiShowConfirmationDialog", o);
                    break;
                case "embed":
                    this.trigger("uiEmbedTimelineAction", {
                        column: this.column
                    });
                    break;
                case "view-on-web":
                    this.trigger("uiViewTimeline");
                    break;
                case "reference-to":
                    this.trigger("uiReferenceTimeline")
            }
        }, this.after("initialize", function() {
            this.column = this.attr.column;
            var t, i = this.column.getSearchFilter(),
                s = this.column.isSearchColumn(),
                n = -1 !== TD.util.columnUtils.mediaPreviewableColumnTypes.indexOf(this.column.getColumnType());
            this.on("uiShowUserFilter", this.handleShowUserFilter), this.on("uiShowContentFilter", this.handleShowContentFilter), this.on("uiColumnOptionsCloseAction", this.hide), this.on("uiColumnUpdateSearchFilter", this.handleUpdateSearchFilter), this.on("uiAccordionExpandAction", this.updateHeight), this.on("uiAccordionCollapseAction", this.updateHeight), this.on(document, "uiColumnWidthChange", this.updateHeight), this.on("uiTransitionExpandStart", {
                searchFilterSelector: this.handleChildTransitionExpandStart
            }), this.on("uiTransitionExpandEnd", {
                searchFilterSelector: this.handleChildTransitionExpandEnd
            }), this.on("click", {
                actionButton: this.handleClickEvents
            });
            var o = Boolean(TD.util.isTouchDevice() && TD.decider.get(TD.decider.TOUCHDECK_COLUMN_OPTIONS));
            o ? this.$node.addClass(this.attr.isTouchColumnOptionsClass) : this.$node.removeClass(this.attr.isTouchColumnOptionsClass), t = {
                searchTerm: this.column.getBaseQuery(),
                isOwnList: Boolean(this.column.isOwnList()),
                isOwnCustomTimeline: this.column.isOwnCustomTimeline(),
                isShareableOrEmbeddable: this.column.isShareable() || this.column.isEmbeddable(),
                isClearable: this.column.isClearable(),
                isTouchColumnOptions: o
            }, this.render("column/column_options", t), this.column.isFilterable() && this.renderSearchFilters(i, {
                withContentType: !0,
                withMatching: {
                    isControl: !0,
                    searchInputClassName: this.attr.matchingClass,
                    searchInputPlaceholder: TD.i("Enter words to match"),
                    searchInputTitle: "matching",
                    searchInputValue: i.content ? i.content.matching : ""
                },
                withExcluding: {
                    isControl: !0,
                    searchInputClassName: this.attr.excludingClass,
                    searchInputPlaceholder: TD.i("Enter words to exclude"),
                    searchInputTitle: "excluding",
                    searchInputValue: i.content ? i.content.excluding : ""
                },
                withLanguage: s,
                withRetweetsToggle: !0,
                withFromList: s,
                withActionFilter: this.column.isActionsColumn(),
                withEngagementFilter: this.column.isSearchColumn() && TD.decider.get(TD.decider.ENGAGEMENT_FILTER),
                expandContentFilter: this.attr.expandContentFilter,
                expandUserFilter: this.attr.expandUserFilter,
                expandActionFilter: this.attr.expandActionFilter,
                expandEngagementFilter: this.attr.expandEngagementFilter
            }), e.attachTo(this.select("accordionSelector"), {
                column: this.column
            }), n && this.renderThumbSizeSelector(), this.showColumnOptions()
        })
    };
    return t(a, i, s, n, o, r)
}), define("td/UI/columns", ["ui/column_options"], function(t) {
    var e = window.TD || {};
    e.ui = e.ui || {}, window.TD = e, e.ui.columns = function() {
        var i, s, n = 350,
            o = 500,
            r = 200,
            a = 20,
            c = {}, h = {}, l = {}, u = "is-options-open",
            d = "is-moving",
            m = "is-focused",
            g = ".is-focused",
            p = "is-actionable",
            f = "#container",
            w = ".js-app-columns",
            C = ".js-column-options",
            T = ".js-column-scroller",
            S = ".js-column",
            v = ".js-column-header",
            b = ".js-column-message",
            y = ".js-detail-header",
            D = ".js-chirp-container",
            A = ".js-action-header-button",
            I = ".is-minimalist",
            k = "is-touch-tweet-container",
            F = 150,
            E = function(t) {
                return j.getColumnElementByKey(t).find(v)
            }, M = function(t) {
                var e = $(t.target).closest("[data-action]"),
                    i = e.data("action"),
                    s = e.parents(S),
                    n = s.attr("data-column");
                switch (i) {
                    case "options":
                        t.preventDefault(), s.hasClass(u) ? j.exitEditMode(n) : j.enterEditMode(n), t.stopPropagation();
                        break;
                    case "mark-all-read":
                        s.trigger("uiMarkAllMessagesRead", {
                            columnKey: n
                        });
                        break;
                    case "clear":
                        s.trigger("uiColumnClearAction", {
                            columnKey: n
                        });
                        break;
                    case "compose-dm":
                        s.trigger("uiComposeTweet", {
                            type: "message",
                            columnKey: n
                        });
                        break;
                    case "user-filter":
                    case "content-filter":
                    case "action-filter":
                    case "engagement-filter":
                        j.enterEditMode(n, i);
                        break;
                    case "edit-list":
                        t.preventDefault(), t.stopPropagation()
                }
            }, R = function(t) {
                var i = $(t.currentTarget),
                    s = (i.data("action"), i.parents(S)),
                    n = s.data("column");
                e.ui.columns.setColumnToTop(n)
            }, x = function() {
                var t = $(this);
                return t.offset().top + this.offsetHeight > 0 && t.offset().top < i.innerHeight()
            }, O = function() {
                var t = e.ui.updates.findParentArticle($(this)),
                    i = e.controller.columnManager.get(t.column),
                    s = i.updateIndex[t.statusKey];
                t.element.replaceWith(s.render({
                    isTemporary: i.temporary
                }))
            }, P = _.debounce(function(t) {
                t.find(I).filter(x).each(O)
            }, F),
            U = function(t, i) {
                var s, n, o = 0;
                return function(r) {
                    e.util.isTouchDevice() && e.util.cancelFastClick();
                    var a, c, l = r.timeStamp || (new Date).getTime(),
                        u = i.scrollTop();
                    h[t] = u, P(i), l - o > 200 && (o = l, n = r.currentTarget.scrollHeight, s = i.height()), c = (s + u) / n, c > .999 ? (o = 0, a = e.controller.columnManager.get(t), a.fetchUpdatesFromPoller()) : 0 === u && (e.ui.columns.unlockColumnFromElement(t), i.trigger("uiReadStateChange", {
                        read: !0
                    }))
                }
            }, L = function(t, e) {
                var i = e.closest(".scroll-h"),
                    n = 100,
                    o = {
                        direction: "",
                        time: 0
                    };
                return function(r) {
                    var a, c = Math.abs(r.originalEvent.wheelDeltaX),
                        l = Math.abs(r.originalEvent.wheelDeltaY),
                        u = $(r.currentTarget);
                    if (r.originalEvent.wheelDeltaY || r.originalEvent.wheelDeltaX) {
                        r.preventDefault();
                        var d = "";
                        c > l ? d = "h" : l > c && (d = "v"), d !== o.direction && Date.now() < o.time + n || (o.direction = d, o.time = Date.now(), "v" === d ? u.is(T) ? (a = h[t] - r.originalEvent.wheelDeltaY, e.scrollTop(a), h[t] = e.scrollTop()) : u.scrollTop(u.scrollTop() - r.originalEvent.wheelDeltaY) : "h" === d && i.scrollLeft(s.scrollLeft() - r.originalEvent.wheelDeltaX))
                    }
                }
            }, N = function(t, s) {
                var n, o = function(i) {
                        var s = i.model,
                            o = i.isMessageColumn(),
                            r = i.hasActiveSearchFilters(),
                            a = null;
                        r && (a = {
                            content: i.hasActiveContentFilters(),
                            user: i.hasActiveUserFilters(),
                            action: i.hasActiveActionFilters() && !i.isSingleActionTypeColumn(),
                            engagement: i.hasActiveEngagementFilters(),
                            filterError: i.hasFilterError()
                        });
                        var c = !i.temporary && i.isOwnCustomTimeline(),
                            h = {
                                columnkey: s.getKey(),
                                columntitle: t[n].getTitleHTML({
                                    editable: c
                                }),
                                columnclass: t[n].getClass(),
                                columniconclass: t[n].getIconClass(),
                                columnfilter: a,
                                filterError: i.hasFilterError(),
                                withEditableTitle: c,
                                withMarkAllRead: o,
                                withDMComposeButton: o,
                                isTouchColumnOptions: Boolean(e.util.isTouchDevice() && e.decider.get(e.decider.TOUCHDECK_COLUMN_OPTIONS))
                            };
                        return e.ui.template.render("column", h)
                    };
                if (s = Boolean(s))
                    for (n = t.length - 1; n >= 0; n--) i.prepend(o(t[n])), j.setupColumn(t[n]);
                else
                    for (n = 0; n < t.length; n++) i.append(o(t[n])), j.setupColumn(t[n])
            }, j = {
                COLUMN_GLOW_DURATION: 500,
                init: function() {
                    i = $(w), s = $(f);
                    var t = _.throttle(M, 300);
                    i.on("click", A + ", " + b, t), i.on("click", v, R)
                },
                setupColumn: function(t) {
                    var i = t.model.getKey(),
                        s = $(D + '[data-column="' + i + '"]').closest(T),
                        n = $(S + '[data-column="' + i + '"]'),
                        o = s.scrollTop(),
                        r = U(i, s),
                        a = L(i, s);
                    $(document).trigger("uiColumnRendered", {
                        column: t,
                        $column: n
                    }), e.util.isTouchDevice() && e.decider.get(e.decider.TOUCHDECK_TWEETCONTROLS) && s.addClass(k), h[i] = o, c[i] = s, s.scroll(r), n.on("mousewheel onmousewheel", ".scroll-v", a), n.on("mouseover", v, function() {
                        var t = h[i];
                        $(this).toggleClass(p, t > 0)
                    }), e.util.isTouchDevice() && window.navigator.standalone && n.on("touchmove", ".scroll-v", function(t) {
                        t.stopPropagation()
                    })
                },
                refreshTitle: function(t) {
                    var i, s, n, o = t.getIconClass(),
                        r = t.model.getKey(),
                        a = !t.temporary && t.isOwnCustomTimeline(),
                        c = t.getTitleHTML({
                            editable: a
                        }),
                        h = j.getColumnElementByKey(r),
                        l = t.isMessageColumn();

                    var mCol = t,
                        cMes = mCol.isMessageColumn(), 
                        iC = !cMes && mCol.isClearable(),
                        hA = cMes || iC;

                    s = t.temporary && t.getColumnType() === e.util.columnUtils.columnMetaTypes.SEARCH ? e.i("results") : t.getDetailTitleHTML(), t.isMessageColumn() && (n = t.unreadMessageCount()), i = e.ui.template.render("column/column_header", {
                        columntitle: c,
                        columniconclass: o,
                        isTemporary: t.temporary,
                        withEditableTitle: a,
                        withImageAttribution: !0,
                        withMarkAllRead: l,

                        hasHeaderAction: hA,
                        isClearable: iC,

                        withDMComposeButton: l,
                        unreadCount: "0" === n ? null : n
                    }), E(t.model.getKey()).replaceWith(i), i = e.ui.template.render("column/column_header_detail", {
                        headerClass: "js-detail-header",
                        headerAction: "resetToTopColumn",
                        headerLinkClass: "js-column-back",
                        columntitle: s
                    }), h.find(y).replaceWith(i), h.trigger("uiColumnTitleRefreshed", {
                        columnKey: r
                    })
                },
                setColumnToTop: function(t) {
                    var e, i = c[t],
                        s = 10,
                        o = h[t],
                        r = 250,
                        a = function() {
                            var n = Math.max(o - r, 0);
                            o -= r, i.scrollTop(n), h[t] = n, n > 0 ? setTimeout(a, s) : (i.trigger("uiReadStateChange", {
                                read: !0
                            }), e = E(t), e.toggleClass(p, i.scrollTop > 0))
                        };
                    o * s / r > n && (r = o * s / n), a()
                },
                enterEditMode: function(i, s) {
                    var n, o = e.controller.columnManager.get(i),
                        r = j.getColumnElementByKey(i);
                    r.length && !r.hasClass(u) && (r.addClass(u), n = $(C, r), t.attachTo(n, {
                        column: o,
                        expandContentFilter: "content-filter" === s,
                        expandUserFilter: "user-filter" === s,
                        expandActionFilter: "action-filter" === s,
                        expandEngagementFilter: "engagement-filter" === s,
                        columnType: o.getColumnType()
                    }))
                },
                exitEditMode: function(t) {
                    var e = j.getColumnElementByKey(t),
                        i = $(C, e);
                    e.hasClass(u) && (e.removeClass(u), i.trigger("uiColumnOptionsCloseAction"))
                },
                isScrolledToTop: function(t) {
                    var e = c[t];
                    return e ? 0 === h[t] : !0
                },
                alterColumnContents: function(t, e, i, s) {
                    if (s = s || {}, e && 0 !== e.length) {
                        var n, o, r = l[t],
                            a = 0;
                        if ("boolean" == typeof s.willBreakScrollPosition) n = s.willBreakScrollPosition;
                        else {
                            var c = r ? r.position().top : a;
                            n = e.position().top < c
                        }
                        n && (o = this.cacheColumnScrollPosition(t));
                        var h = i(e);
                        return n && o(), h
                    }
                },
                cacheColumnScrollPosition: function(t) {
                    var e = c[t];
                    if (!e) return function() {};
                    var i = h[t],
                        s = e[0].scrollHeight - i;
                    return function() {
                        var i;
                        i = e[0].scrollHeight - s, e.scrollTop(i), h[t] = i, 0 === i && P(e)
                    }
                },
                lockColumnToElement: function(t, e) {
                    l[t] = e
                },
                unlockColumnFromElement: function(t) {
                    delete l[t]
                },
                addColumnsToView: function(t) {
                    N(t), $(D).show()
                },
                removeColumn: function(t) {
                    var e = j.getColumnElementByKey(t);
                    e.trigger("uiRemoveColumn"), e.remove(), delete h[t], delete c[t]
                },
                calculateScrollDuration: function(t, e, i) {
                    i = i || o, e = e || a;
                    var s = r + t / 100 * e;
                    return s = Math.min(s, i)
                },
                getLeftmostColumn: function() {
                    var t = null;
                    return i.children(S).each(function() {
                        t || ($(this).position().left < 10 && $(this).position().left >= 0 ? t = this : $(this).position().left > 10 && (t = $(this).prev()))
                    }), $(t)
                },
                focusColumn: function(t, s) {
                    $(g, i).removeClass(m), j.getColumnElementByKey(t).addClass(m), _.isNumber(s) && _.delay(function() {
                        e.ui.columns.unfocusColumn(t)
                    }, s)
                },
                unfocusColumn: function(t) {
                    j.getColumnElementByKey(t).removeClass(m)
                },
                setMovingColumn: function(t) {
                    j.getColumnElementByKey(t).addClass(d)
                },
                getColumnElementByKey: function(t) {
                    return $(S + '[data-column="' + t + '"]')
                }
            };
        return j
    }()
}), define("ui/compose/with_character_limit", [], function() {
    return function() {
        this.defaultAttrs({
            maxCharCount: 140
        }), this.getRemainingCharCount = function(t) {
            return this.attr.maxCharCount - t
        }, this.isWithinCharLimit = function(t) {
            return t <= this.attr.maxCharCount && t > 0
        }, this.isOverCharLimit = function(t) {
            return t > this.attr.maxCharCount
        }
    }
}), define("ui/compose/with_character_count", ["require", "flight/lib/compose", "ui/compose/with_character_limit"], function(t) {
    var e = t("flight/lib/compose"),
        i = t("ui/compose/with_character_limit");
    return function() {
        e.mixin(this, [i]), this.defaultAttrs({
            charCountSelector: ".js-character-count",
            charCountInvalidClass: "invalid-char-count"
        }), this.after("initialize", function() {
            this.charCount = 0, this.on("uiComposeCharCount", this.charCountHandleCharCount)
        }), this.after("setupDOM", function() {
            this.$charCountInput = this.select("charCountSelector")
        }), this.charCountHandleCharCount = function(t, e) {
            t.stopPropagation(), this.charCount = e.charCount, this.$charCountInput.val(this.getRemainingCharCount(this.charCount)), this.charCountUpdateValidCountState(this.charCount)
        }, this.charCountUpdateValidCountState = function(t) {
            var e = this.isOverCharLimit(t);
            this.$charCountInput.toggleClass(this.attr.charCountInvalidClass, e)
        }
    }
}), define("util/tweet_utils", [], function() {
    var t = {};
    return t.atMentionify = function(t) {
        return TD.util.atMentionify(t)
    }, t.deMentionify = function(t) {
        return TD.util.deMentionify(t)
    }, t.getTweetLength = function(t) {
        return twttr.txt.getTweetLength(t)
    }, t.extractMentions = function(t) {
        return twttr.txt.extractMentions(t)
    }, t.removeFirstMention = function(t) {
        var e, i = twttr.txt.extractMentionsWithIndices(t);
        return i.length && (e = i[0].indices, t = t.substring(0, e[0]).trim() + t.substring(e[1])), t
    }, t
}), define("ui/with_focusable_field", [], function() {
    var t = function() {
        this.defaultAttrs({
            focusableSelector: "textarea, input"
        }), this.after("initialize", function() {
            var t = this.select("focusableSelector");
            this.on(t, "focus", function() {
                TD.decider.get(TD.decider.TOUCHDECK_COMPOSE) && (window.scrollTo(0, 0), document.body.scrollTop = 0)
            })
        })
    };
    return t
}), define("ui/compose/with_compose_text", ["require", "flight/lib/compose", "util/tweet_utils", "ui/with_focusable_field"], function(t) {
    var e = t("flight/lib/compose"),
        i = t("util/tweet_utils"),
        s = t("ui/with_focusable_field");
    return function() {
        e.mixin(this, [s]);
        var t = "",
            n = !1,
            o = [],
            r = [],
            a = function(t) {
                var e = {};
                return t.map(function(t) {
                    return t.filter(function(t) {
                        var i = t.toLowerCase(),
                            s = e[i];
                        return e[i] = !0, !s
                    })
                })
            };
        this.defaultAttrs({
            composeTextSelector: ".js-compose-text",
            withAutoComplete: !0
        }), this.after("initialize", function() {
            this.on("uiRemoveInReplyTo", this.removeReplyStack), this.on("uiMessageRecipientSet", function(t) {
                t.stopPropagation(), this.composeTextSetFocus()
            }), this.before("setupDOM", this.destroyAutoComplete), this.before("teardown", this.destroyAutoComplete)
        }), this.after("setupDOM", function() {
            this.$composeTextInput = this.select("composeTextSelector"), this.on(this.$composeTextInput, "input propertychange change", this.composeTextHandleChange), this.on(this.$composeTextInput, "blur", this.handleTextInputBlur), this.on("uiRequestComposeTextFocus", function() {
                (!TD.util.isiOSDevice() || !TD.decider.get(TD.decider.TOUCHDECK_COMPOSE)) && this.composeTextSetFocus()
            }), this.attr.withAutoComplete && (this.textAutoComplete = new TD.components.Autocomplete(this.$composeTextInput))
        }), this.composeTextGetText = function() {
            return this.$composeTextInput.val()
        }, this.composeTextSetFocus = function() {
            this.$composeTextInput.focus()
        }, this.composeTextBlur = function() {
            this.$composeTextInput.blur()
        }, this.composeTextSetText = function(t) {
            this.$composeTextInput.val() !== t && (this.$composeTextInput.val(t), this.composeTextHandleChange())
        }, this.composeTextAppendText = function(t) {
            var e = this.$composeTextInput.val();
            this.composeTextSetText((e && e.trim() + " ") + t)
        }, this.composeTextPrependText = function(t) {
            this.composeTextSetText(t + " " + this.composeTextGetText())
        }, this.composeTextSetDisabled = function(t) {
            this.$composeTextInput.prop("disabled", t)
        }, this.composeTextIsEmpty = function() {
            return "" === this.$composeTextInput.val()
        }, this.composeTextSetCaret = function(t) {
            var e = this.$composeTextInput;
            e[0].selectionStart = e[0].selectionEnd = t, e.focus()
        }, this.composeTextSetCaretToEnd = function() {
            this.composeTextSetCaret(this.$composeTextInput.val().length)
        }, this.composeTextSetSelection = function(t, e) {
            var i = this.$composeTextInput[0];
            i.selectionStart = t, i.selectionEnd = e, setTimeout(function() {
                i.selectionStart = t, i.selectionEnd = e
            }, 70), this.$composeTextInput.focus()
        }, this.composeTextSetHeight = function(t) {
            this.$composeTextInput.css({
                height: t
            })
        }, this.removeReplyStack = function(e) {
            e.stopPropagation();
            var i = this.composeTextGetReplyText();
            this.composeTextSetText(i.trim()), o = [], r = [], n = !1, t = ""
        }, this.composeTextReset = function() {
            this.composeTextSetText(""), o = [], r = [], n = !1, t = ""
        }, this.composeTextSetRepliesAndMentions = function(t, e, i) {
            var s = this.composeTextComputeRepliesAndMentions(t, e, i);
            this.composeTextSetText(s.totalString), this.composeTextSetSelection(s.startIndex, s.endIndex)
        }, this.composeTextComputeRepliesAndMentions = function(e, s, a) {
            return e = e.map(i.atMentionify), s = s.map(i.atMentionify), a = a && i.atMentionify(a), a && (s = s.filter(function(t) {
                return t.toLowerCase() !== a.toLowerCase()
            }), a === e[0] && s.length > 0 && (e = [s.shift()])), e = e.map(i.atMentionify), s = s.map(i.atMentionify), n === !1 && (n = this.$composeTextInput.val()), this.composeTextIsStacking() && this.composeTextHasLostStackingState() && (o = [], r = [], t = this.$composeTextInput.val(), n = ""), this.composeTextGetReplyStack(e, s)
        }, this.composeTextHandleChange = function() {
            var t = this.$composeTextInput.val();
            this.trigger("uiComposeCharCount", {
                charCount: i.getTweetLength(t),
                stringLength: t.length
            })
        }, this.handleTextInputBlur = function() {
            this.trigger("uiComposeTextBlur")
        }, this.composeTextIsStacking = function() {
            return o.length + r.length > 0
        }, this.composeTextGenerateReplyStack = function(t, e, i) {
            var s, o, r, a = t.join(" "),
                c = e.join(" "),
                h = [];
            return i && (i = i.replace(/ $/, ""), h.push(i)), a && h.push(a), n && h.push(n), c && h.push(c), s = h.join(" ").trim() + " ", o = c ? s.length - c.length - 1 : s.length, r = s.length, {
                totalString: s,
                startIndex: o,
                endIndex: r
            }
        }, this.composeTextGetReplyText = function() {
            var t = r.concat(o);
            return this.$composeTextInput.val().split(" ").filter(function(e) {
                return t.indexOf(e) < 0
            }).join(" ")
        }, this.composeTextHasLostStackingState = function() {
            var e = this.composeTextGenerateReplyStack(o, r, t);
            return e.totalString !== this.$composeTextInput.val() || e.startIndex !== this.$composeTextInput[0].selectionStart || e.endIndex !== this.$composeTextInput[0].selectionEnd
        }, this.composeTextGetReplyStack = function(e, i) {
            var s;
            return this.composeTextIsStacking() && this.trigger("uiComposeStackReply"), o = o.concat(e), r = r.concat(i), s = a([o, r]), o = s[0], r = s[1], this.composeTextGenerateReplyStack(o, r, t)
        }, this.destroyAutoComplete = function() {
            this.textAutoComplete && (this.textAutoComplete.destroy(), this.textAutoComplete = null)
        }
    }
}), define("util/with_teardown", [], function() {
    function t() {
        this.before("initialize", function() {
            this.childTeardownEvent = this.childTeardownEvent || this.nextTeardownEvent()
        }), this.before("teardown", function() {
            this.trigger(document, this.childTeardownEvent)
        }), this.after("initialize", function() {
            if (this.attr.teardownOn) {
                if (this.attr.teardownOn === this.childTeardownEvent) throw new Error("Component initialized to listen for its own teardown event.");
                this.on(document, this.attr.teardownOn, this.teardown)
            }
        }), this.nextTeardownEvent = function() {
            return _.uniqueId("_teardownEvent")
        }, this.attachChild = function(t, e, i) {
            i = i || {}, i.teardownOn || (i.teardownOn = this.childTeardownEvent), t.attachTo(e, i)
        }
    }
    return t
}), define("ui/custom_timeline_description", ["require", "flight/lib/component", "ui/compose/with_character_count", "ui/compose/with_character_limit", "ui/compose/with_compose_text", "util/with_teardown", "ui/with_template", "ui/with_transitions"], function(t) {
    function e() {
        this.defaultAttrs({
            accountKey: null,
            customTimelineId: null,
            isOwnCustomTimeline: !1,
            readOnly: !1,
            reloadPeriod: 900,
            animatingClass: "is-column-options-animating",
            inputSelector: ".js-input",
            editSelector: ".js-edit",
            saveSelector: ".js-save",
            cancelSelector: ".js-cancel"
        }), this.after("initialize", function() {
            this.customTimeline = null, this.newDescription = null, this.on(document, "dataCustomTimelineSuccess", this.handleCustomTimeline.bind(this)), this.on(document, "dataCustomTimelineUpdateError", this.handleUpdateError.bind(this)), this.on("uiComposeCharCount", this.handleCharCount), this.on("click", {
                editSelector: this.edit,
                saveSelector: this.save,
                cancelSelector: this.cancel
            }), this.on("uiInputSubmit", {
                inputSelector: this.save
            }), this.on("uiInputBlur", {
                inputSelector: this.cancel
            }), this.reloadTaskId = TD.controller.scheduler.schedulePeriodicTask(this.attr.reloadPeriod, this.requestData.bind(this), !0)
        }), this.before("teardown", function() {
            TD.controller.scheduler.removePeriodicTask(this.reloadTaskId)
        }), this.requestData = function() {
            this.trigger(document, "uiNeedsCustomTimeline", {
                id: this.attr.customTimelineId,
                account: this.attr.accountKey
            })
        }, this.handleCustomTimeline = function(t, e) {
            var i = !0;
            e.action.id === this.attr.customTimelineId && (i = !this.customTimeline || this.customTimeline.description !== e.result.description, this.customTimeline = e.result, this.customTimeline.description === this.newDescription && (this.newDescription = null), i && this.showDescription(this.customTimeline.description))
        }, this.showDescription = function(t) {
            var e = this.renderTemplate("column/custom_timeline_description", {
                description: t,
                editable: this.attr.isOwnCustomTimeline && !this.attr.readOnly
            });
            this.animateElementContentHeight(this.$node, e, this.attr.animatingClass)
        }, this.edit = function() {
            var t = null !== this.newDescription ? this.newDescription : this.customTimeline.description,
                e = this.renderTemplate("column/custom_timeline_edit_description");
            this.animateElementContentHeight(this.$node, e, this.attr.animatingClass), this.select("inputSelector").focus(), this.setupDOM(), this.composeTextSetText(t), this.composeTextSetCaretToEnd(), this.composeTextHandleChange()
        }, this.setupDOM = function() {}, this.save = function() {
            var t = this.select("inputSelector").val(),
                e = this.customTimeline ? this.customTimeline.description : null;
            this.select("saveSelector").prop("disabled") || (this.showDescription(t), t !== e && (this.newDescription = t, this.trigger(document, "uiUpdateCustomTimeline", {
                account: this.attr.accountKey,
                id: this.attr.customTimelineId,
                description: t
            })))
        }, this.cancel = function() {
            this.showDescription(this.customTimeline.description)
        }, this.handleUpdateError = function(t, e) {
            e.action.id === this.attr.customTimelineId && this.newDescription && (this.edit(), TD.controller.progressIndicator.addMessage(TD.i("Error: unable to save description")))
        }, this.handleCharCount = function(t, e) {
            var i = this.isOverCharLimit(e.charCount);
            this.select("saveSelector").prop("disabled", i)
        }
    }
    var i = t("flight/lib/component"),
        s = t("ui/compose/with_character_count"),
        n = t("ui/compose/with_character_limit"),
        o = t("ui/compose/with_compose_text"),
        r = t("util/with_teardown"),
        a = t("ui/with_template"),
        c = t("ui/with_transitions");
    return i(e, s, n, o, r, a, c)
}), define("ui/with_text_utils", ["flight/lib/compose", "ui/with_template"], function(t, e) {
    function i() {
        t.mixin(this, [e]), this.highlightSubstring = function(t, e) {
            var i, s, n = -1;
            return e && (n = t.toLowerCase().indexOf(e.toLowerCase())), -1 !== n ? (s = {
                before: t.substr(0, n),
                highlight: t.substr(n, e.length),
                after: t.substr(n + e.length)
            }, i = this.toHtmlFromRaw("{{before}}<b>{{highlight}}</b>{{after}}", s)) : i = this.toHtmlFromRaw("{{text}}", {
                text: t
            }), i
        }, this.prettyNumber = function(t) {
            return TD.util.prettyNumber(t)
        }
    }
    return i
}), define("ui/social_proof_for_tweet", ["require", "flight/lib/component", "ui/with_template", "ui/with_text_utils"], function(t) {
    function e() {
        this.defaultAttrs({
            columnBackSelector: ".js-tweet-social-proof-back",
            headerLinkClass: "js-tweet-social-proof-back",
            templateName: "status/social_proof_for_tweet"
        }), this.after("initialize", function() {
            var t, e, i;
            this.on("uiSocialProofForTweetClose", this.close), this.on("click", {
                columnBackSelector: this.close
            }), this.on(document, "dataTwitterUsers", this.handleTwitterUsers), this.userIds = this.attr.tweetSummary[this.attr.type], "retweeters" === this.attr.type ? (e = "Retweeted", i = this.attr.tweetSummary.retweeters_count) : (e = "Favorited", i = this.attr.tweetSummary.favoriters_count), t = parseInt(i, 10) > 1 ? TD.i("{{action}} {{n}} times", {
                n: this.prettyNumber(i),
                action: e
            }) : TD.i("{{action}} once", {
                action: e
            }), this.renderParams = {
                title: t,
                columntitle: TD.i("Tweet"),
                headerLinkClass: this.attr.headerLinkClass,
                withUserMenu: !0
            }, this.render(this.attr.templateName, this.renderParams), this.requestId = _.uniqueId("twitterUsers"), this.trigger("uiNeedsTwitterUsers", {
                requestId: this.requestId,
                userIds: this.userIds
            })
        }), this.handleTwitterUsers = function(t, e) {
            e.requestId === this.requestId && (this.renderParams.users = e.users, this.render(this.attr.templateName, this.renderParams))
        }, this.close = function() {
            this.trigger("uiSocialProofForTweetClosed"), this.teardown()
        }
    }
    var i = t("flight/lib/component"),
        s = t("ui/with_template"),
        n = t("ui/with_text_utils");
    return i(e, s, n)
}), define("ui/with_column_selectors", [], function() {
    var t = function() {
        this.defaultAttrs({
            appColumnsContainerSelector: ".js-app-columns-container",
            columnsContainerSelector: ".js-app-columns",
            columnStateDetailViewClass: "js-column-state-detail-view",
            columnStateSocialProofClass: "js-column-state-social-proof",
            columnSelector: ".js-app-columns .js-column",
            columnUpdateGlow: ".js-column-update-glow",
            scrollContainerSelector: ".js-column-scroller",
            columnDetailScrollerSelector: ".js-detail-container",
            columnOptionsSelector: ".js-column-options",
            columnOptionsContainerSelector: ".js-column-options-container",
            columnHeaderSelector: ".js-column-header",
            columnUnreadCountSelector: ".js-column-header .js-unread-count",
            columnContentSelector: ".js-column-content"
        }), this.getColumnScrollContainerByKey = function(t) {
            var e = this.getColumnElementByKey(t),
                i = e.find(this.attr.columnDetailScrollerSelector);
            return i.length > 0 ? i : e.find(this.attr.scrollContainerSelector)
        }, this.getColumnElementByKey = function(t) {
            return this.select("columnSelector").filter('[data-column="' + t + '"]')
        }, this.getKeyForColumnAtIndex = function(t) {
            return this.select("columnSelector").eq(t).attr("data-column")
        }, this.getKeyForLastColumn = function() {
            return this.select("columnSelector").last().attr("data-column")
        }
    };
    return t
}), define("ui/with_focus", [], function() {
    function t() {
        this.focusRequest = function() {
            this.trigger("uiFocusRequest", {
                id: this.focusId
            })
        }, this.focusRelease = function() {
            this.trigger("uiFocusRelease", {
                id: this.focusId
            })
        }, this.handleFocus = function(t, e) {
            this.hasFocus = e.id === this.focusId ? !0 : !1
        }, this.whenHasFocus = function(t) {
            return function() {
                return this.hasFocus ? t.apply(this, arguments) : void 0
            }.bind(this)
        }, this.getNewFocusId = function() {
            return _.uniqueId("focus")
        }, this.after("teardown", function() {
            this.hasFocus && this.trigger("uiFocusRelease", {
                id: this.focusId
            })
        }), this.after("initialize", function() {
            this.focusId = this.attr.focusId || this.getNewFocusId(), this.hasFocus = !1, this.on(document, "uiFocus", this.handleFocus), this.attr.autoFocus === !0 && this.focusRequest()
        })
    }
    return t
}), define("ui/with_dropdown", ["require", "flight/lib/compose", "ui/with_template", "ui/with_focus"], function(t) {
    function e() {
        i.mixin(this, [s, n]), this.defaultAttrs({
            dropdownContainerSelector: ".js-dropdown-container",
            dropdownContentSelector: ".js-dropdown-content",
            isSelectableClass: "is-selectable",
            isSelectableSelector: ".is-selectable",
            isSelectedClass: "is-selected",
            isSelectedSelector: ".is-selected",
            dropdownOptions: {
                position: [],
                toggle: !1
            },
            dropdownPositions: {
                offsetLeft: "pos-l",
                offsetRight: "pos-r",
                underLeftIcon: "pos-r-under-icon",
                verticalRight: "pos-br",
                above: "pos-t"
            }
        }), this.after("initialize", function() {
            this.on(document, "uiDropdownShowing uiDetailViewOpening uiKeyEscape", this.teardownCurrentDropdown.bind(this)), this.dropdownFocusId = this.getNewFocusId(), this.on(document, "uiKeyEnter uiKeySpace", this.whenHasDropdownFocus(this.clickSelectedActionable)), this.on(document, "uiKeyUp", this.whenHasDropdownFocus(this.makeHandleChangeSelectionIndexBy(-1))), this.on(document, "uiKeyDown", this.whenHasDropdownFocus(this.makeHandleChangeSelectionIndexBy(1))), this.on(document, "uiKeyRight uiKeyLeft", this.whenHasDropdownFocus(this.jumpIntoDropdown))
        }), this.before("teardown", function() {
            this.teardownCurrentDropdown()
        }), this.renderDropdown = function(t, e, i, s) {
            if (!t || !t.length) throw new Error("Please supply a node to render dropdown with.");
            if (!e) throw new Error("Please supply a template.");
            i = i || {}, s = _.defaults(s || {}, this.attr.dropdownOptions);
            var n = _.uniqueId("dropdown");
            if (this.dropdownIsOpen()) {
                if (this.$dropdownSourceNode && t.get(0) === this.$dropdownSourceNode.get(0)) return s.toggle ? (this.trigger("uiDropdownToggling", {
                    id: n
                }), this.teardownCurrentDropdown()) : this.trigger("uiDropdownAlreadyOpen", {
                    id: n
                });
                this.teardownCurrentDropdown()
            }
            this.$dropdownSourceNode = t, this.trigger("uiDropdownShowing", {
                id: n
            });
            var o = e;
            "string" == typeof e && (o = this.renderTemplate(e, i));
            var r = this.renderTemplate("menus/dropdown", s);
            return r.find(this.attr.dropdownContentSelector).append(o), t.after(r), this.currentDropdown = {
                $el: r,
                id: n
            }, this.maybeRepositionDropdown(), this.attachDropdownInteractions(r, s), this.parentFocusId = this.focusId, this.focusId = this.dropdownFocusId, this.focusRequest(), this.on(document, "click", this.handleDocumentClick), this.trigger("uiDropdownShown", {
                id: n
            }), r
        }, this.handleDocumentClick = function() {
            this.teardownCurrentDropdown()
        }, this.attachDropdownInteractions = function(t) {
            this.on(t, "mouseleave", this.removeCurrentSelection), this.on(t, "mouseover", {
                isSelectableSelector: this.handleChangeSelectionToTarget
            }), this.on(t, "click", this.cancelEventIfNotFromSelectable);
            var e = t.find(this.attr.isSelectableSelector),
                i = e.filter(this.attr.isSelectedSelector),
                s = e.index(i);
            this.currentDropdown.$selectables = e, this.currentDropdown.selectedIndex = s, s > -1 && this.changeSelectionToIndex(s)
        }, this.teardownCurrentDropdown = function(t, e) {
            if (t = t || {}, e = e || {}, this.dropdownIsOpen()) {
                if (e.id === this.currentDropdown.id) return;
                this.$dropdownSourceNode = null, this.trigger("uiDropdownHiding", {
                    id: this.currentDropdown.id
                }), this.focusRelease(), this.focusId = this.parentFocusId;
                var i = this.currentDropdown.$el;
                this.off(document, "click", this.handleDocumentClick), this.off(i, "mouseleave", this.removeCurrentSelection), this.off(i, "mouseover"), this.off(i, "click", this.cancelEventIfNotFromSelectable), this.currentDropdown.$el.remove();
                var s = this.currentDropdown.id;
                this.currentDropdown = null, this.trigger("uiDropdownHidden", {
                    id: s
                })
            }
        }, this.clickSelectedActionable = function() {
            this.currentDropdown.selectedIndex > -1 && this.currentDropdown.$selectables.eq(this.currentDropdown.selectedIndex).find("[data-action]").first().click()
        }, this.changeSelection = function(t) {
            var e = $(t),
                i = this.currentDropdown.$selectables.index(e.get(0));
            this.removeCurrentSelection(), i > -1 && (this.currentDropdown.$selectables.eq(i).addClass(this.attr.isSelectedClass), this.currentDropdown.selectedIndex = i)
        }, this.changeSelectionToIndex = function(t) {
            if (0 > t) return this.removeCurrentSelection();
            var e = this.currentDropdown.$selectables.eq(t);
            this.changeSelection(e)
        }, this.handleChangeSelectionToTarget = function(t, e) {
            this.changeSelection(e.el)
        }, this.makeHandleChangeSelectionIndexBy = function(t) {
            return function(e) {
                e.stopPropagation();
                var i = this.getNewSelectedIndex(t);
                this.changeSelectionToIndex(i)
            }
        }, this.removeCurrentSelection = function() {
            this.currentDropdown.$selectables.eq(this.currentDropdown.selectedIndex).removeClass(this.attr.isSelectedClass), this.currentDropdown.selectedIndex = -1
        }, this.getNewSelectedIndex = function(t) {
            "undefined" == typeof t && (t = 1);
            var e = this.currentDropdown.selectedIndex;
            if (0 === t) return e;
            var i = this.currentDropdown.$selectables.length,
                s = (e + t) % i;
            return 0 > e ? t > 0 ? 0 : i - 1 : 0 > s ? i + s : s
        }, this.whenHasDropdownFocus = function(t) {
            return this.whenHasFocus(function() {
                return this.focusId === this.dropdownFocusId ? t.apply(this, arguments) : void 0
            })
        }, this.jumpIntoDropdown = function() {
            -1 === this.currentDropdown.selectedIndex && this.changeSelectionToIndex(0)
        }, this.cancelEventIfNotFromSelectable = function(t) {
            var e = this.currentDropdown.$el,
                i = $(t.target).closest(this.attr.isSelectableSelector, e);
            i.length || (event.stopPropagation(), event.preventDefault())
        }, this.dropdownIsOpen = function() {
            return !!this.currentDropdown && !! this.currentDropdown.$el
        }, this.maybeRepositionDropdown = function() {
            var t, e, i, s, n, o = this.currentDropdown.$el,
                r = o.closest(this.attr.dropdownContainerSelector);
            r.length > 0 && !o.hasClass("pos-t") && (t = o.offset().top, n = o.outerHeight(), i = t + n, e = r.offset().top, s = e + r.height(), TD.util.isTouchDevice() && TD.decider.get(TD.decider.TOUCHDECK_DROPDOWNS) && TD.decider.get(TD.decider.TOUCHDECK_TWEETCONTROLS) && (n += 25), i >= s && t - n > e && o.addClass("pos-t"))
        }
    }
    var i = t("flight/lib/compose"),
        s = t("ui/with_template"),
        n = t("ui/with_focus");
    return e
}), define("ui/drag_drop/with_drag_drop", ["require"], function() {
    function t() {
        this.defaultAttrs({
            eventMap: {
                uiDragStart: "dragstart",
                uiDragEnd: "dragend",
                mousedown: "predrag"
            },
            dropTargetClass: "with-drop-target",
            draggableSelector: ".is-draggable"
        }), this.setupDragDrop = function(t) {
            t.type || (t.type = ["*"]), "string" == typeof t.type && (t.type = [t.type]), _.contains(t.type, "*") && (t.wantsAll = !0), "undefined" != typeof t.indicateDrop && (this.indicateDrop = !! t.indicateDrop), t.drop && this.indicateDrop !== !1 && (this.indicateDrop = !0), this.listeners.push(t)
        }, this.hasSetupDragDrop = function() {
            return this.listeners.length > 0
        }, this.wantsDragType = function(t) {
            return this.listeners.some(function(e) {
                return e.wantsAll || _.contains(e.type, t)
            }.bind(this))
        }, this.notifyListeners = function(t, e) {
            this.listeners.forEach(function(i) {
                if (i.wantsAll || _.contains(i.type, e.type)) {
                    var s = i[t.type] || i[this.attr.eventMap[t.type]];
                    s && "function" == typeof s && s.call(i.context || this, t, e)
                }
            }.bind(this))
        }, this.saveDragState = function(t) {
            return function(e, i) {
                return this.dragDropState = {
                    active: !0,
                    data: i
                }, t.apply(this, [].slice.call(arguments))
            }
        }, this.clearDragState = function(t) {
            return function() {
                return this.dragDropState = this.dragDropStateInit, t.apply(this, [].slice.call(arguments))
            }
        }, this.retrieveDragState = function(t) {
            return function(e) {
                return t.call(this, e, this.dragDropState.data)
            }
        }, this.retrieveAndNotify = function() {
            return this.retrieveDragState(this.notifyListeners)
        }, this.extractDataFromEvent = function(t) {
            var e = $(t.target).attr("data-drag-type"),
                i = t.target.tagName.toLowerCase();
            return e = e || i, {
                type: e,
                el: t.target
            }
        }, this.whenActive = function(t) {
            return function() {
                var e = this.dragDropState.active && this.wantsDragType(this.dragDropState.data.type);
                return e ? t.apply(this, arguments) : void 0
            }.bind(this)
        }, this.whenSetup = function(t) {
            return function() {
                return this.hasSetupDragDrop() ? t.apply(this, arguments) : void 0
            }.bind(this)
        }, this.whenSetupAndActive = function(t) {
            return this.whenSetup(this.whenActive(t))
        }, this.before("initialize", function() {
            this.listeners = [], this.dragDropState = this.dragDropStateInit = {
                active: !1,
                data: {}
            }, this.indicateDrop = !0, this.dragDepth = 0
        }), this.after("initialize", function() {
            this.on(document, "uiDragStart", this.whenSetup(this.saveDragState(this.notifyListeners))), this.on(document, "uiDragEnd", this.whenSetup(function() {
                this.dragDepth = 0, this.clearDragState(this.notifyListeners).apply(this, arguments)
            })), this.on("drop", this.whenSetupAndActive(function(t) {
                t.preventDefault(), this.dragDepth = 0, this.retrieveAndNotify().apply(this, arguments)
            })), this.on("dragenter", this.whenSetupAndActive(function() {
                this.dragDepth += 1, 1 === this.dragDepth && this.retrieveAndNotify().apply(this, [].slice.call(arguments))
            })), this.on("dragleave", this.whenSetupAndActive(function() {
                this.dragDepth -= 1, this.dragDepth <= 0 && (this.dragDepth = 0, this.retrieveAndNotify().apply(this, [].slice.call(arguments)))
            })), this.on("dragover", this.whenSetupAndActive(function(t) {
                this.indicateDrop === !0 && t.preventDefault(), this.retrieveAndNotify().apply(this, [].slice.call(arguments))
            })), this.on("mousedown", {
                draggableSelector: this.whenSetup(function(t, e) {
                    var i = this.extractDataFromEvent({
                        target: e.el
                    });
                    this.notifyListeners(t, i)
                })
            })
        })
    }
    return t
}), define("ui/with_spinner_button", [], function() {
    var t = function() {
        this.defaultAttrs({
            spinnerButtonSelector: ".js-spinner-button",
            spinnerButtonActiveSelector: ".js-spinner-button-active",
            spinnerButtonActiveClass: "spinner-button-is-active",
            spinnerButtonDisabledClass: "is-disabled",
            spinnerButtonHiddenClass: "is-hidden"
        }), this.spinnerButtonEnable = function() {
            var t = this.select("spinnerButtonSelector"),
                e = this.select("spinnerButtonActiveSelector");
            t.addClass(this.attr.spinnerButtonDisabledClass), t.addClass(this.attr.spinnerButtonActiveClass), e.removeClass(this.attr.spinnerButtonHiddenClass)
        }, this.spinnerButtonDisable = function() {
            var t = this.select("spinnerButtonSelector"),
                e = this.select("spinnerButtonActiveSelector");
            t.removeClass(this.attr.spinnerButtonDisabledClass), t.removeClass(this.attr.spinnerButtonActiveClass), e.addClass(this.attr.spinnerButtonHiddenClass)
        }
    };
    return t
}), define("ui/with_add_to_customtimeline", ["flight/lib/compose", "ui/with_spinner_button", "ui/with_template"], function(t, e, i) {
    function s() {
        t.mixin(this, [e, i]), this.eventIsForCustomTimeline = function(t, e) {
            var i = this.select("addToCustomTimelineInputSelector"),
                s = TD.util.extractTweetIdFromPermalink(i.val());
            return e.action.tweetId === s && e.action.id === i.data(this.attr.customTimelineIdDataAttr)
        }, this.defaultAttrs({
            addToCustomTimelineSelector: ".js-add-to-customtimeline",
            addToCustomTimelineTemplate: "column/add_to_customtimeline",
            addToCustomTimelineInputSelector: ".js-add-to-customtimeline-input",
            addToCustomTimelineButtonSelector: ".js-add-to-customtimeline-button",
            customTimelineIdDataAttr: "customtimeline-id"
        }), this.renderAddToCustomTimeline = function(t, e) {
            var i = this.toHtml(this.attr.addToCustomTimelineTemplate, {
                accountKey: t,
                customTimelineId: e
            });
            this.select("addToCustomTimelineSelector").html(i).removeClass("is-hidden"), this.on("uiInputSubmit", {
                addToCustomTimelineInputSelector: this.addTweetToCustomTimeline
            }), this.on("click", {
                addToCustomTimelineButtonSelector: this.addTweetToCustomTimeline
            }), this.on(document, "dataAddTweetToCustomTimelineSuccess", function(t, e) {
                this.eventIsForCustomTimeline(t, e) && (this.spinnerButtonDisable(), e.result.response.errors && e.result.response.errors.length ? TD.controller.progressIndicator.addMessage(TD.i("Unable to add that Tweet")) : this.select("addToCustomTimelineInputSelector").val(""))
            }), this.on("dataAddTweetToCustomTimelineError", function(t, e) {
                this.eventIsForCustomTimeline(t, e) && (this.spinnerButtonDisable(), TD.controller.progressIndicator.addMessage(TD.i("Unable to add that Tweet")))
            })
        }, this.addTweetToCustomTimeline = function() {
            var t = this.select("addToCustomTimelineInputSelector"),
                e = t.data("account-key"),
                i = t.data("customtimeline-id"),
                s = t.val(),
                n = TD.util.extractTweetIdFromPermalink(s);
            n ? (this.trigger(document, "uiAddTweetToCustomTimeline", {
                account: e,
                id: i,
                tweetId: n
            }), this.spinnerButtonEnable()) : (TD.controller.progressIndicator.addMessage(TD.i("Can't recognize Tweet URL")), this.spinnerButtonDisable())
        }
    }
    return s
}), define("ui/with_edit_customtimeline", ["flight/lib/compose", "ui/with_template"], function(t, e) {
    function i() {
        t.mixin(this, [e]), this.defaultAttrs({
            editCustomTimelineSelector: ".js-edit-customtimeline",
            editCustomTimelineTemplate: "column/edit_customtimeline",
            customTimelineTitleSelector: ".js-customtimeline-title",
            customTimelineDescSelector: ".js-customtimeline-desc"
        }), this.after("initialize", function() {
            this.on(this.$node, "change uiInputSubmit", {
                customTimelineTitleSelector: this.saveCustomTimelineState,
                customTimelineDescSelector: this.saveCustomTimelineState
            })
        }), this.renderEditCustomTimeline = function(t, e) {
            var i = this.column.getCustomTimeline();
            if (i) {
                var s = this.toHtml(this.attr.editCustomTimelineTemplate, {
                    customTimelineName: i.name,
                    customTimelineDescription: i.description,
                    withTitle: t,
                    withDescription: e
                });
                this.$editCustomTimeline = this.select("editCustomTimelineSelector"), this.$editCustomTimeline.html(s)
            }
        }, this.saveCustomTimelineState = function() {
            var t = this.column.getCustomTimeline(),
                e = this.select("customTimelineTitleSelector").val(),
                i = this.select("customTimelineDescSelector").val(),
                s = void 0 !== e && e !== t.name,
                n = void 0 !== i && i !== t.description;
            (s || n) && (this.trigger(document, "uiUpdateCustomTimeline", {
                    account: t.account.getKey(),
                    id: t.id,
                    name: e,
                    description: i
                }), this.on(document, "dataCustomTimelineSuccess", function() {
                    var t;
                    this.off(document, "dataCustomTimelineSuccess"), s && n ? t = TD.i("Collection updated") : s ? t = TD.i("Title updated") : n && (t = TD.i("Description updated")), t && TD.controller.progressIndicator.addMessage(t)
                }))
        }
    }
    return i
}), define("util/with_rebroadcast", [], function() {
    function t() {
        this.rebroadcast = function(t) {
            return function(e) {
                return this._isRebroadcasting ? void 0 : (this._isRebroadcasting = !0, this.trigger(e, t.apply(this, [].slice.call(arguments))), this._isRebroadcasting = !1, e.stopPropagation(), !1)
            }.bind(this)
        }
    }
    return t
}), define("ui/with_will_animate", [], function() {
    var t = _.memoize(function() {
        var t = window.navigator.userAgent,
            e = t.match(/Chrome\/([\d]+)\./),
            i = t.match(/AppleWebKit\/([\d]+)\./);
        return e && parseInt(e[1], 10) >= 35 ? !0 : "mac" === TD.util.getAppEnv() && i && parseInt(i[1], 10) >= 537 ? !0 : !1
    });
    return function() {
        this.applyWillAnimate = function(e) {
            t() && $(e).addClass("will-animate")
        }
    }
}), define("ui/column", ["require", "flight/lib/component", "ui/asynchronous_form", "ui/custom_timeline_description", "ui/social_proof_for_tweet", "ui/with_column_selectors", "ui/with_template", "ui/with_transitions", "ui/with_dropdown", "ui/drag_drop/with_drag_drop", "ui/with_add_to_customtimeline", "ui/with_edit_customtimeline", "util/with_rebroadcast", "util/with_teardown", "ui/with_will_animate"], function(t) {
    function e() {
        this.defaultAttrs({
            columnMessageSelector: ".js-column-message",
            columnMessageTemplate: "column/column_message",
            filterErrorTemplate: "column/column_filter_error",
            filterErrorClass: "filter-error",
            showDetailViewClass: "is-shifted-1",
            showSocialProofClass: "is-shifted-2",
            socialProofSelector: ".js-column-social-proof",
            columnStateDefault: "default",
            columnStateDetailView: "detailView",
            columnStateSocialProof: "socialProof",
            columnScrollerIsAnimatingClass: "is-column-scroller-animating",
            isNewClass: "is-new",
            chirpSelector: ".js-stream-item",
            tweetActionsSelector: ".js-tweet-actions",
            tweetActionsVisibleClass: "is-visible",
            animateInClass: "anim-rotate-in",
            animateOutClass: "anim-rotate-out",
            customTimelineDescriptionSelector: ".js-customtimeline-description",
            shareColumnSelector: ".js-share-column",
            focusId: null,
            tweetImpressionTrackingPeriod: 250
        }), this.after("initialize", function() {
            this.applyWillAnimate(this.$node), this.columnKey = this.$node.data("column"), this.column = TD.controller.columnManager.get(this.columnKey), this.visibleChirpsTierTwo = {}, this.visibleChirpsTierThree = {};
            var t, e, i, s = this.column.getCustomTimelineFeed(),
                o = this.column.isOwnCustomTimeline();
            o && (t = s.getMetadata(), e = t.id, i = TD.storage.Account.generateKeyFor("twitter", t.ownerId)), this.targetTopPosition = 0, this.$socialProofContainer = this.select("socialProofSelector"), this.$columnOptions = this.select("columnOptionsSelector"), this.$scrollContainer = this.select("scrollContainerSelector"), this.createNewHeightCache(), this.renderColumnMessage(), this.attr.tweetImpressionTrackingPeriod > 0 && (this.scribeTweetImpressions = _.throttle(this.scribeTweetImpressions.bind(this), this.attr.tweetImpressionTrackingPeriod)), this.setupDragDrop({
                type: "tweet",
                indicateDrop: !1,
                predrag: function(t, e) {
                    $(e.el).closest(this.attr.tweetActionsSelector).addClass(this.attr.tweetActionsVisibleClass)
                },
                dragend: function(t, e) {
                    $(e.el).closest(this.attr.tweetActionsSelector).removeClass(this.attr.tweetActionsVisibleClass)
                }
            }), this.on("click", {
                shareColumnSelector: this.handleShareColumnButtonClick
            }), this.on("uiViewTimeline", this.handleViewTimeline), this.on("uiReferenceTimeline", this.handleReferenceTimeline), this.on(document, "uiShowDetailView", this.handleShowDetailView), this.on("uiDetailViewActive", this.handleDetailViewActive), this.on("uiDetailViewClosed", this.handleDetailViewClosed), this.on("uiCloseDetailView", this.handleCloseDetailView), this.on("uiSocialProofForTweetClosed", this.handleSocialProofClosed), this.on("uiShowSocialProof", this.handleShowSocialProof), this.on("uiCloseSocialProof", this.handleCloseSocialProof), this.on("uiColumnOptionsShown", this.handleColumnOptionsShown), this.on("uiHidingColumnOptions", this.handleHidingColumnOptions), this.on("uiShowingColumnOptions", this.handleShowingColumnOptions), this.on("uiColumnOptionsHidden", this.handleColumnOptionsHidden), this.on("uiMarkAllMessagesRead", this.handleMarkAllRead), this.on("uiColumnClearAction", this.handleColumnClear), this.on("uiReadStateChange", this.handleColumnReadStatus), this.on(document, "uiMessageThreadRead", this.handleMessageThreadRead), this.on(document, "uiMessageUnreadCount", this.handleMessageCount), this.on("uiTransitionExpandStart", {
                columnOptionsContainerSelector: function(t, e) {
                    this.fixColumnTop(), this.moveColumnTop(e.delta)
                }.bind(this)
            }), this.on("uiAccordionTotalHeightChanged", {
                columnOptionsContainerSelector: this.fixColumnTop
            }), this.on("uiColumnUpdateSearchFilter", this.handleUpdateSearchFilter), this.on("uiColumnUpdateMediaPreview", this.handleUpdateMediaPreview), this.on("dataColumnUpdatingFilters dataColumnUpdatingFeed", this.handleColumnUpdating), this.on("dataColumnFiltersUpdated dataColumnFeedUpdated", this.handleColumnUpdated), this.on("uiRemoveColumn", this.handleUiRemoveColumn), this.on(document, "dataSerializedColumn", this.handleSerializedColumn), this.on(document, "dataSettingsValues", this.handleSettingsChange), this.on(document, "uiColumnUpdateMediaPreview", this.handleMediaPreviewChange), this.on(document, "uiFocus", function(t, e) {
                this.hasFocus = e.id === this.attr.focusId, this.hasFocus && this.scribeTweetImpressions()
            }), this.on(this.$scrollContainer, "scroll", this.scribeTweetImpressions), this.on(document, "uiColumnVisibilities", this.handleColumnVisibilities), this.on(document, "uiColumnChirpsChanged", function(t, e) {
                e.id === this.columnKey && this.scribeTweetImpressions()
            }), this.on("uiDetailViewClosed uiTransitionExpandEnd", this.scribeTweetImpressions), this.on(document, TD.util.visibilityChangeEventName(), function() {
                this.scribeTweetImpressions()
            }), this.on(window, "beforeunload", this.scribeAllChirpsHidden), o && (this.setupDragDrop({
                type: "tweet",
                indicateDrop: !0,
                dragenter: this.addDropTargetClass,
                dragleave: this.removeDropTargetClass,
                dragend: this.removeDropTargetClass,
                drop: function(t, e) {
                    var i = this.getAllCustomTimelineData();
                    this.trigger("uiAddTweetToCustomTimeline", {
                        id: i.metadata.id,
                        tweetId: $(e.el).attr("data-tweet-id"),
                        account: i.account
                    })
                }
            }), this.renderAddToCustomTimeline(i, e), this.select("columnContentSelector").addClass("with-add-by-url"), this.on(document, "dataAddTweetToCustomTimelineSuccess", this.refreshCustomTimelineFeed.bind(this)), this.on(document, "dataRemoveTweetFromCustomTimelineSuccess", this.removeChripFromCustomTimelineFeed.bind(this)), this.on("uiRemoveTweetFromCustomTimeline", this.rebroadcast(this.transformRemoveTweetFromCustomTimeline))), s && n.attachTo(this.select("customTimelineDescriptionSelector"), {
                maxCharCount: 160,
                withAutoComplete: !1,
                customTimelineId: s.getMetadata().id,
                isOwnCustomTimeline: this.column.isOwnCustomTimeline(),
                readOnly: this.column.temporary,
                accountKey: s.getAccountKey(),
                teardownOn: this.childTeardownEvent
            })
        }), this.setColumnState = function(t) {
            switch (this.$node.removeClass([this.attr.showDetailViewClass, this.attr.columnStateDetailViewClass, this.attr.showSocialProofClass, this.attr.columnStateSocialProofClass].join(" ")), t) {
                case this.attr.columnStateDetailView:
                    this.$node.addClass(this.attr.showDetailViewClass), this.$node.addClass(this.attr.columnStateDetailViewClass);
                    break;
                case this.attr.columnStateSocialProof:
                    this.$node.addClass(this.attr.showSocialProofClass), this.$node.addClass(this.attr.columnStateSocialProofClass)
            }
        }, this.handleDetailViewActive = function() {
            this.setColumnState(this.attr.columnStateDetailView), this.scribeAllChirpsHidden()
        }, this.handleDetailViewClosed = function() {
            this.setColumnState(this.attr.columnStateDefault), this.column.detailViewComponent = null
        }, this.handleCloseDetailView = function() {
            this.column.detailViewComponent.destroy()
        }, this.handleShowSocialProof = function(t, e) {
            o.attachTo(this.$socialProofContainer, {
                type: e.type,
                tweetSummary: e.tweetSummary
            }), this.setColumnState(this.attr.columnStateSocialProof)
        }, this.handleSocialProofClosed = function() {
            this.setColumnState(this.attr.columnStateDetailView)
        }, this.handleCloseSocialProof = function() {
            this.trigger(this.$socialProofContainer, "uiSocialProofForTweetClose")
        }, this.handleUiRemoveColumn = function() {
            this.scribeAllChirpsHidden(), this.teardown()
        }, this.handleShareColumnButtonClick = function(t, e) {
            var i = $(e.el);
            this.toggleShareMenu(t, i)
        }, this.toggleShareMenu = function(t, e) {
            t.preventDefault(), t.stopPropagation();
            var i = this.attr.dropdownPositions;
            this.renderDropdown(e, "menus/column_share", {
                isEmbeddable: this.column.isEmbeddable(),
                isShareable: this.column.isShareable(),
                isViewable: this.column.isViewable()
            }, {
                position: [i.offsetRight, i.underLeftIcon].join(" "),
                toggle: !0
            })
        }, this.getCustomTimelineDataForPermalink = function() {
            var t = this.column.getCustomTimelineFeed(),
                e = t.getMetadata(),
                i = TD.util.deMentionify(TD.cache.names.getScreenName(e.ownerId)),
                s = TD.cache.names.getCustomTimelineName(e.id, e.ownerId);
            if (!i) throw new Error("Could not get username from name cache.");
            return {
                username: i,
                name: s,
                id: e.id.replace(/[^\d]*/, "")
            }
        }, this.getCustomTimelinePermalinkURL = function() {
            var t = this.getCustomTimelineDataForPermalink(),
                e = this.toHtmlFromRaw("https://twitter.com/{{username}}/timelines/{{id}}", {
                    username: t.username,
                    id: t.id
                });
            return e
        }, this.getCustomTimelinePermalinkURLWithDescription = function() {
            var t = this.getCustomTimelineDataForPermalink(),
                e = this.toHtmlFromRaw("“{{name}}” - @{{username}} “https://twitter.com/{{username}}/timelines/{{id}}”", {
                    name: t.name,
                    username: t.username,
                    id: t.id
                });
            return e
        }, this.handleViewTimeline = function() {
            var t = this.getCustomTimelinePermalinkURL();
            TD.util.openURL(t)
        }, this.handleReferenceTimeline = function() {
            var t = this.column.getColumnType();
            "col_customtimeline" === t ? this.trigger("uiComposeTweet", {
                appendText: this.getCustomTimelinePermalinkURLWithDescription()
            }) : this.trigger("uiNeedsSerializedColumn", {
                columnId: this.columnKey
            })
        }, this.handleShowingColumnOptions = function() {
            var t = this.select("columnMessageSelector");
            t.css({
                opacity: 0
            }), this.transitionCollapse(t)
        }, this.handleColumnOptionsShown = function() {
            s.attachTo(this.$columnOptions)
        }, this.handleHidingColumnOptions = function() {
            this.trigger(this.$columnOptions, "uiDestroyAsynchronousForm"), this.renderColumnMessage()
        }, this.handleColumnOptionsHidden = function() {
            var t = this.select("columnMessageSelector");
            t.animate({
                opacity: 1
            }, 150, "easeInOutQuad")
        }, this.renderColumnMessage = function() {
            var t, e = this.select("columnMessageSelector");
            this.column.hasActiveSearchFilters() ? (this.column.hasFilterError() ? (t = this.renderTemplate(this.attr.filterErrorTemplate), e.addClass(this.attr.filterErrorClass)) : (t = this.renderTemplate(this.attr.columnMessageTemplate, {
                action: this.column.hasActiveActionFilters() && !this.column.isSingleActionTypeColumn(),
                content: this.column.hasActiveContentFilters(),
                user: this.column.hasActiveUserFilters(),
                engagement: this.column.hasActiveEngagementFilters()
            }), e.removeClass(this.attr.filterErrorClass)), this.animateElementContentHeight(e, t)) : this.animateElementContentHeight(e, "")
        }, this.handleSettingsChange = function(t, e) {
            (e.font_size || e.column_width) && (this.createNewHeightCache(), this.scribeTweetImpressions())
        }, this.handleMediaPreviewChange = function() {
            this.createNewHeightCache(), this.scribeTweetImpressions()
        }, this.createNewHeightCache = function() {
            this.chirpHeightCache = new TD.cache.LRUQueue(200)
        }, this.moveColumnTop = function(t, e) {
            if (0 !== t) {
                var i = this.select("scrollContainerSelector"),
                    s = this.select("columnUpdateGlow");
                e = e || void 0 === e, this.targetTopPosition += t, e ? (this.transitionTop(i, this.attr.columnScrollerIsAnimatingClass, this.targetTopPosition), this.transitionTop(s, this.attr.columnScrollerIsAnimatingClass, this.targetTopPosition)) : (i.css("top", this.targetTopPosition), s.css("top", this.targetTopPosition))
            }
        }, this.getColumnTopError = function() {
            var t, e = this.select("scrollContainerSelector"),
                i = 0;
            return e.hasClass(this.attr.columnScrollerIsAnimatingClass) || (t = this.select("columnOptionsContainerSelector").height(), i = t - this.targetTopPosition), i
        }, this.fixColumnTop = function() {
            this.moveColumnTop(this.getColumnTopError(), !1)
        }, this.handleShowDetailView = function(t, e) {
            var i, s;
            e.columnKey === this.columnKey && e.chirpId && (i = this.column.findChirp(e.chirpId), s = this.column.findMostInterestingChirp(e.chirpId), this.trigger("uiColumnFocus", {
                columnKey: e.columnKey
            }), s instanceof TD.services.TwitterAction || $.publish("chirp/action", ["viewDetails", s, i, this.column]))
        }, this.handleShowUserFilter = function() {
            this.trigger(this.$columnOptions, "uiShowUserFilter")
        }, this.handleShowContentFilter = function() {
            this.trigger(this.$columnOptions, "uiShowContentFilter")
        }, this.handleUpdateSearchFilter = function(t, e) {
            this.column.updateSearchFilter(e)
        }, this.handleUpdateMediaPreview = function(t, e) {
            this.column.setMediaPreviewSize(e.value)
        }, this.handleColumnUpdating = function() {
            this.trigger(this.$columnOptions, "uiWaitingForAsyncResponse")
        }, this.handleColumnUpdated = function() {
            this.trigger(this.$columnOptions, "uiReceivedAsyncResponse")
        }, this.handleMarkAllRead = function() {
            this.column.markAllMessagesAsRead()
        }, this.handleColumnClear = function() {
            this.column.clear(), this.trigger("uiClearColumnAction", {
                columnId: this.column.model.getKey()
            });
        }, this.handleSerializedColumn = function(t, e) {
            if (e.columnId === this.columnKey) {
                var i = this.toHtmlFromRaw("Check out this TweetDeck column: “{{url}}”", {
                    name: this.column.model.getTitle(),
                    url: e.url
                });
                this.trigger("uiComposeTweet", {
                    appendText: i
                })
            }
        }, this.handleMessageCount = function(t, e) {
            if (this.columnKey === e.columnKey) {
                var i = this.select("columnUnreadCountSelector"),
                    s = i.text() || "0",
                    n = "0" === s && "0" !== e.count,
                    o = "0" !== s && "0" === e.count;
                i.text(e.count), n && (this.stopAnimation(i, this.attr.animateOutClass), i.addClass("is-visible"), this.addAnimateClass(i, this.attr.animateInClass)), o && (this.stopAnimation(i, this.attr.animateInClass), this.addAnimateClass(i, this.attr.animateOutClass, function() {
                    i.removeClass("is-visible")
                }))
            }
        }, this.handleColumnReadStatus = function(t, e) {
            this.column.isMessageColumn() || (e.columnKey = this.columnKey, this.$node.toggleClass(this.attr.isNewClass, !e.read))
        }, this.handleMessageThreadRead = function() {
            this.column.isMessageColumn() && this.trigger(document, "uiMessageUnreadCount", {
                columnKey: this.columnKey,
                count: this.column.unreadMessageCount()
            })
        }, this.handleColumnVisibilities = function(t, e) {
            var i = this.column.visibility,
                s = e[this.columnKey];
            s && (this.column.visibility = s, i.visibleFraction !== s.visibleFraction && this.scribeTweetImpressions())
        }, this.getChirpVerticalVisibileFraction = function(t, e) {
            if (0 >= e) return 0;
            var i = Math.min(this.scrollContainerHeight, Math.max(0, t)),
                s = Math.min(this.scrollContainerHeight, Math.max(0, t + e)),
                n = s - i;
            return n / e
        }, this.scribeTweetImpressions = function() {
            var t = this.column.temporary || this.column.visibility.visibleFraction > .5,
                e = this.$node.hasClass(this.attr.columnStateDetailViewClass) || this.$node.hasClass(this.attr.columnStateSocialProofClass);
            if (TD.util.documentIsHidden() || e || !t) this.setAllChirpsHidden();
            else {
                var i = Date.now();
                this.updateVisibleChirps(i), this.updateVisibleChirpsWithEndTimes(i), TD.controller.stats.tweetStreamImpression(this.column.getColumnType(), this.getChirpsToScribeTierTwo())
            }
            TD.controller.stats.tweetStreamImpression(this.column.getColumnType(), this.getChirpsToScribeTierThree(), !0), this.removeScribedChirpsFromVisibleChirps()
        }, this.scribeAllChirpsHidden = function() {
            this.setAllChirpsHidden(), TD.controller.stats.tweetStreamImpression(this.column.getColumnType(), this.getChirpsToScribeTierThree(), !0)
        }, this.updateVisibleChirps = function(t) {
            var e = !1;
            this.scrollContainerHeight = this.$scrollContainer.height();
            var i = null;
            this.select("chirpSelector").each(function(s, n) {
                var o = $(n),
                    r = o.attr("data-key"),
                    a = this.chirpHeightCache.get(r);
                if (!a) {
                    if (a = o.height(), 0 >= a) return;
                    this.chirpHeightCache.enqueue(r, a)
                }
                var c;
                c = null === i ? o.position().top : i + 1, i = c + a;
                var h = this.getChirpVerticalVisibileFraction(c, a),
                    l = h * (this.column.temporary ? 1 : this.column.visibility.visibleFraction);
                if (0 >= l && e) return !1;
                if (l > 0) {
                    e = !0;
                    var u = this.visibleChirpsTierTwo[r];
                    u || (u = {
                        scribed: !1
                    }), this.visibleChirpsTierTwo[r] = u
                }
                if (l > .5) {
                    var d = this.visibleChirpsTierThree[r];
                    d || (d = {
                        scribed: !1,
                        visibilityStart: t
                    }), d.knownVisible = !0, this.visibleChirpsTierThree[r] = d
                }
            }.bind(this))
        }, this.updateVisibleChirpsWithEndTimes = function(t) {
            Object.keys(this.visibleChirpsTierThree).forEach(function(e) {
                var i = this.visibleChirpsTierThree[e];
                i.knownVisible || (i.visibilityEnd = t), this.visibleChirpsTierThree[e] = i
            }, this)
        }, this.getChirpsToScribeTierThree = function() {
            var t = [];
            return Object.keys(this.visibleChirpsTierThree).forEach(function(e) {
                var i, s = this.visibleChirpsTierThree[e];
                s.visibilityStart && s.visibilityEnd && (s.visibilityEnd - s.visibilityStart > 500 && (i = this.column.findMostInterestingChirp(e), i instanceof TD.services.TwitterStatus && t.push(i.getScribeItemData(s))), s.scribed = !0, this.visibleChirpsTierThree[e] = s)
            }, this), t
        }, this.getChirpsToScribeTierTwo = function() {
            var t = [];
            return Object.keys(this.visibleChirpsTierTwo).forEach(function(e) {
                var i, s = this.visibleChirpsTierTwo[e];
                this.column.scribedImpressionIDs.get(e) || (i = this.column.findMostInterestingChirp(e), i instanceof TD.services.TwitterStatus && t.push(i.getScribeItemData(s)), this.column.scribedImpressionIDs.enqueue(e, !0)), s.scribed = !0, this.visibleChirpsTierTwo[e] = s
            }, this), t
        }, this.removeScribedChirpsFromVisibleChirps = function() {
            Object.keys(this.visibleChirpsTierTwo).forEach(function(t) {
                var e = this.visibleChirpsTierTwo[t];
                e.scribed && delete this.visibleChirpsTierTwo[t]
            }, this), Object.keys(this.visibleChirpsTierThree).forEach(function(t) {
                var e = this.visibleChirpsTierThree[t];
                e.scribed ? delete this.visibleChirpsTierThree[t] : (e.knownVisible = !1, this.visibleChirpsTierThree[t] = e)
            }, this)
        }, this.setAllChirpsHidden = function() {
            var t = Date.now();
            Object.keys(this.visibleChirpsTierThree).forEach(function(e) {
                this.visibleChirpsTierThree[e].visibilityEnd = t
            }, this)
        }, this.getAllCustomTimelineData = function() {
            var t = this.column.getCustomTimelineFeed(),
                e = this.column.getCustomTimeline(),
                i = t.getMetadata(),
                s = e.account.getKey(),
                n = TD.controller.feedManager.getPoller(t.getKey());
            return {
                feed: t,
                customTimeline: e,
                metadata: i,
                account: s,
                poller: n
            }
        }, this.customTimelineActionWasMe = function(t) {
            var e = this.column.getCustomTimelineFeed();
            if (e) {
                var i = e.getMetadata();
                if (i) return t.action.id === i.id
            }
        }, this.refreshCustomTimelineFeed = function(t, e) {
            if (this.customTimelineActionWasMe(e)) {
                var i = this.getAllCustomTimelineData();
                i.poller.refresh()
            }
        }, this.removeChripFromCustomTimelineFeed = function(t, e) {
            if (this.customTimelineActionWasMe(e)) {
                var i = this.getAllCustomTimelineData();
                i.poller.removeWhere(function(t) {
                    return t.id === e.action.tweetId
                })
            }
        }, this.transformRemoveTweetFromCustomTimeline = function(t, e) {
            var i = this.getAllCustomTimelineData();
            return {
                id: i.metadata.id,
                tweetId: e.tweetId,
                account: i.account
            }
        }, this.isOfMetaType = function(t) {
            if (!this.column || !this.column.getColumnType) return !1;
            var e = this.column.getColumnType();
            return e === TD.util.columnUtils.columnMetaTypes[t]
        }, this.addDropTargetClass = function() {
            this.$node.addClass(this.attr.dropTargetClass)
        }, this.removeDropTargetClass = function() {
            this.$node.removeClass(this.attr.dropTargetClass)
        }
    }
    var i = t("flight/lib/component"),
        s = t("ui/asynchronous_form"),
        n = t("ui/custom_timeline_description"),
        o = t("ui/social_proof_for_tweet"),
        r = t("ui/with_column_selectors"),
        a = t("ui/with_template"),
        c = t("ui/with_transitions"),
        h = t("ui/with_dropdown"),
        l = t("ui/drag_drop/with_drag_drop"),
        u = t("ui/with_add_to_customtimeline"),
        d = t("ui/with_edit_customtimeline"),
        m = t("util/with_rebroadcast"),
        g = t("util/with_teardown"),
        p = t("ui/with_will_animate");
    return i(e, r, a, c, h, l, u, d, m, g, p)
}),
function(t, e) {
    "function" == typeof define && define.amd ? define("util/animation_frame", [], e) : _.extend(t, e())
}(this, function() {
    var t = 0,
        e = ["ms", "moz", "webkit", "o"],
        i = {};
    i = {
        requestAnimationFrame: window.requestAnimationFrame,
        cancelAnimationFrame: window.cancelAnimationFrame
    };
    for (var s = 0; s < e.length && !i.requestAnimationFrame; s += 1) i.requestAnimationFrame = window[e[s] + "RequestAnimationFrame"], i.cancelAnimationFrame = window[e[s] + "CancelAnimationFrame"] || window[e[s] + "CancelRequestAnimationFrame"];
    return i.requestAnimationFrame || (i.requestAnimationFrame = function(e) {
        var i = (new Date).getTime(),
            s = Math.max(0, 16 - (i - t)),
            n = window.setTimeout(function() {
                e(i + s)
            }, s);
        return t = i + s, n
    }), i.cancelAnimationFrame || (i.cancelAnimationFrame = function(t) {
        clearTimeout(t)
    }), i
}), define("ui/with_easing", ["require", "util/animation_frame"], function(t) {
    function e() {
        this.easeFn = function(t) {
            var e = s[t];
            if (!e) throw "No such method";
            return function(t, i, s) {
                return i + s * e(t)
            }
        }, this.before("initialize", function() {
            this.runningInterpolations = {}, this.easingGuid = 1
        }), this.ease = function(t) {
            if (t = t || {}, [typeof t.from, typeof t.time, typeof t.applicator].indexOf("undefined") > -1) throw new Error("animate requires from, time and applicator.");
            var e = parseFloat(t.from);
            if (!_.isNumber(e)) throw new Error("A numeric from value is required.");
            if ("undefined" == typeof t.to && "undefined" == typeof t.delta) throw new Error("animate either a to amount or a delta.");
            var s = parseFloat(t.to);
            if ("undefined" != typeof t.delta && (s = e + parseFloat(t.delta)), !_.isNumber(s)) throw new Error("A numeric to value is required.");
            var n = t.time;
            _.isNumber(n) || (n = parseFloat(n));
            var o = t.easing;
            "function" != typeof o && (o = this.easeFn("linear"));
            var r = t.applicator;
            if ("function" != typeof r) throw new Error("applicator must be a function.");
            var a = t.name,
                c = t.done || function() {}, h = Date.now(),
                l = s - e;
            0 !== l && (a && (this.runningInterpolations[a] = this.easingGuid), i(function u(t) {
                var s = Date.now() - h,
                    d = s / n;
                return s >= n ? (r(o(1, e, l)), c(s)) : a && this.runningInterpolations[a] !== t ? c(s) : (i(u.bind(this, t)), r(o(d, e, l), e, d), void 0)
            }.bind(this, this.easingGuid)), this.easingGuid += 1)
        }
    }
    var i = t("util/animation_frame").requestAnimationFrame,
        s = {
            linear: function(t) {
                return t
            },
            inQuad: function(t) {
                return t * t
            },
            outQuad: function(t) {
                return t * (2 - t)
            },
            inOutQuad: function(t) {
                return .5 > t ? 2 * t * t : -1 + (4 - 2 * t) * t
            },
            inCubic: function(t) {
                return t * t * t
            },
            outCubic: function(t) {
                return --t * t * t + 1
            },
            inOutCubic: function(t) {
                return .5 > t ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
            },
            inQuart: function(t) {
                return t * t * t * t
            },
            outQuart: function(t) {
                return 1 - --t * t * t * t
            },
            inOutQuart: function(t) {
                return .5 > t ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t
            },
            inQuint: function(t) {
                return t * t * t * t * t
            },
            outQuint: function(t) {
                return 1 + --t * t * t * t * t
            },
            inOutQuint: function(t) {
                return .5 > t ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t
            }
        };
    return e
}), define("ui/drag_drop/with_drag_scroll", ["require", "flight/lib/compose", "ui/with_easing"], function(t) {
    function e() {
        i.mixin(this, [s]), this.defaultAttrs({
            defaultDragScrollConfig: {
                regionSize: 20,
                maxSpeed: 400,
                throttlePeriod: 200,
                horizontal: !0,
                vertical: !1,
                deltaFn: function(t) {
                    return t
                }
            }
        }), this.before("initialize", function() {
            this.animateScrollLeft = this.animateScroll.bind(this, "scrollLeft"), this.animateScrollTop = this.animateScroll.bind(this, "scrollTop"), this.dragScrollId = _.uniqueId("drag-scroll")
        }), this.handleDrag = function(t, e, i, s) {
            if (this.justDropped) return this.justDropped = !1, void 0;
            var n = $(s.el),
                o = this.mousePositionRelativeToElement(n, i.originalEvent),
                r = {};
            r.left = o.x / n.width() * 100, r.right = 100 - r.left, r.top = o.y / n.height() * 100, r.bottom = 100 - r.top;
            var a = {};
            a.left = -this.percToDelta(r.left, t), a.right = this.percToDelta(r.right, t), a.up = -this.percToDelta(r.top, t), a.down = this.percToDelta(r.bottom, t), t.horizontal !== !1 && (r.left < t.regionSize ? this.animateScrollLeft(n, "left", a.left, t, e.left) : r.right < t.regionSize && this.animateScrollLeft(n, "right", a.right, t, e.right)), t.vertical !== !1 && (r.top < t.regionSize ? this.animateScrollTop(n, "up", a.up, t, e.up) : r.bottom < t.regionSize && this.animateScrollTop(n, "down", a.down, t, e.down))
        }, this.setupDragScroll = function(t, e) {
            e = _.defaults(e || {}, this.attr.defaultDragScrollConfig);
            var i = {
                up: {},
                down: {},
                left: {},
                right: {}
            }, s = {};
            s[t] = _.throttle(this.handleDrag.bind(this, e, i), e.throttlePeriod), this.on("dragover", s), this.on("drop", function() {
                this.justDropped = !0
            })
        }, this.percToDelta = function(t, e) {
            var i = t / e.regionSize;
            return e.maxSpeed - e.maxSpeed * i
        }, this.animateScroll = function(t, e, i, s, n, o) {
            var r = $(e);
            if (!r[t]) throw new Error("$elem has no method " + t);
            o.startTime || (o.startTime = Date.now()), clearTimeout(o.timeout), o.timeout = setTimeout(function() {
                delete o.startTime
            }, 1.1 * n.throttlePeriod);
            var a = Date.now() - o.startTime,
                c = n.deltaFn.call(this, s, i, h, a),
                h = r[t]();
            this.ease({
                name: this.dragScrollId,
                from: h,
                delta: c,
                time: n.throttlePeriod,
                applicator: function(e) {
                    r[t](e)
                }
            })
        }, this.getMousePosition = function(t) {
            var e = 0,
                i = 0;
            return t || (t = window.event), t.pageX || t.pageY ? (e = t.pageX, i = t.pageY) : (t.clientX || t.clientY) && (e = t.clientX + document.body.scrollLeft + document.documentElement.scrollLeft, i = t.clientY + document.body.scrollTop + document.documentElement.scrollTop), {
                x: e,
                y: i
            }
        }, this.mousePositionRelativeToElement = function(t, e) {
            var i = $(t),
                s = i.offset(),
                n = this.getMousePosition(e);
            return n.x -= s.left + parseInt(i.css("paddingLeft"), 10) + parseInt(i.css("borderLeftWidth"), 10), n.y -= s.top + parseInt(i.css("paddingTop"), 10) + parseInt(i.css("borderTopWidth"), 10), n
        }
    }
    var i = t("flight/lib/compose"),
        s = t("ui/with_easing");
    return e
}), define("ui/column_controller", ["require", "td/UI/columns", "flight/lib/component", "ui/column", "ui/with_column_selectors", "ui/with_template", "ui/with_transitions", "ui/drag_drop/with_drag_scroll"], function(t) {
    function e() {
        this.defaultAttrs({
            columnDragHandleSelector: ".js-column-drag-handle",
            hideTweetDragHandlesClass: "without-tweet-drag-handles",
            scrollDebounceTime: 200,
            focusId: null,
            dragScrollActivationOffset: {
                left: 500,
                right: 800
            },
            dragScrollActivationResponseDamping: 10
        }), this.after("initialize", function() {
            this.$scrollContainer = this.select("appColumnsContainerSelector"), this.on(document, "dataColumnOrder", this.setTweetDragHandleState), this.on(document, "uiColumnRendered", this.handleColumnRendered), this.select("columnSelector").each(function(t, e) {
                var i = $(e);
                s.attachTo(i, {
                    focusId: this.attr.focusId
                })
            }.bind(this)), this.setupDragScroll("appColumnsContainerSelector", {
                deltaFn: function(t, e, i, s) {
                    if (!this.attr.dragScrollActivationOffset[e]) return t;
                    var n = this.attr.dragScrollActivationOffset[e] / 10,
                        o = this.attr.dragScrollActivationResponseDamping,
                        r = 1 / (1 + Math.pow(Math.E, n - s / o));
                    return parseFloat((t * r).toFixed(4))
                }
            });
            var t = ["dataColumnOrder", "uiToggleDockedComposeComplete", "uiToggleNavBarWidth", "uiDrawerTransitionComplete"];
            this.on(document, t.join(" "), this.calculateColumnVisibilities), this.on(this.$scrollContainer, "scroll", _.debounce(this.calculateColumnVisibilities.bind(this), this.attr.scrollDebounceTime)), this.on(window, "resize", this.calculateColumnVisibilities), TD.util.isTouchDevice() && this.on(this.$scrollContainer, "scroll", function() {
                TD.util.cancelFastClick()
            }), this.trigger("uiNeedsColumnOrder")
        }), this.handleColumnRendered = function(t, e) {
            s.attachTo(e.$column, {
                column: e.column,
                focusId: this.attr.focusId
            })
        }, this.calculateColumnVisibilities = function() {
            var t = this.select("columnSelector"),
                e = this.$scrollContainer.width(),
                i = {};
            t.each(function() {
                var t, s = $(this),
                    n = s.position(),
                    o = s.width();
                n.right = n.left + o, n.left = Math.max(0, n.left), n.right = Math.max(0, n.right), n.left = Math.min(e, n.left), n.right = Math.min(e, n.right), t = {
                    columnWidth: o,
                    visibleWidth: n.right - n.left,
                    visibleHeight: s.height()
                }, t.visibleFraction = t.visibleWidth / t.columnWidth, i[s.data("column")] = t
            }), this.trigger("uiColumnVisibilities", i)
        }, this.setTweetDragHandleState = function(t, e) {
            var i = e.columnOrder.some(function(t) {
                return TD.controller.columnManager.get(t).isOwnCustomTimeline()
            }),
                s = !i;
            this.select("columnsContainerSelector").toggleClass(this.attr.hideTweetDragHandlesClass, s)
        }
    }
    t("td/UI/columns");
    var i = t("flight/lib/component"),
        s = t("ui/column"),
        n = t("ui/with_column_selectors"),
        o = t("ui/with_template"),
        r = t("ui/with_transitions"),
        a = t("ui/drag_drop/with_drag_scroll");
    return i(e, n, o, r, a)
}), define("ui/grid", ["flight/lib/component", "ui/with_focus", "ui/with_column_selectors"], function(t, e, i) {
    function s() {
        this.defaultAttrs({
            id: "grid",
            focusId: null,
            chirpScrollOffset: 20,
            columnScrollOffset: 20,
            isSelectedClass: "is-selected-tweet",
            chirpSelector: ".js-stream-item",
            autoFocus: !0,
            pagingEasingFunction: "easeOutQuad"
        }), this.after("initialize", function() {
            this.selectedColumn = null, this.$selectedChirp = $(), this.columnIndex = null, this.chirpCenter = null, this.scrollDirection = this.attr.down, this.chirpOffsetTop = null, this.on(document, "uiKeyLeft", this.moveSelection("left")), this.on(document, "uiKeyUp", this.moveSelection("up")), this.on(document, "uiKeyRight", this.moveSelection("right")), this.on(document, "uiKeyDown", this.moveSelection("down")), this.on(document, "uiGridBack", this.handleBack), this.on(document, "uiGridClearSelection", this.handleClearSelection), this.on(document, "uiColumnFocus", this.handleColumnFocus), this.on(document, "uiGridPageDown", this.handlePagingFactory("down")), this.on(document, "uiGridPageUp", this.handlePagingFactory("up")), this.on(document, "uiGridHome", this.handleGridHome), this.on(document, "uiGridEnd", this.handleGridEnd), this.on(document, "uiKeyEnter", this.tweetActionFactory("viewDetails")), this.on(document, "uiGridReply", this.tweetActionFactory("reply")), this.on(document, "uiGridFavorite", this.tweetActionFactory("favorite")), this.on(document, "uiGridRetweet", this.tweetActionFactory("retweet")), this.on(document, "uiGridDirectMessage", this.tweetActionFactory("dm")), this.on(document, "uiGridProfile", this.tweetActionFactory("profile")), this.on(document, "uiGridCustomTimeline", this.tweetActionFactory("customTimeline")), this.on(document, "uiDetailViewActive", this.handleDetailViewActive), this.on(document, "uiShowSocialProof", this.handleDetailViewActive), this.on(document, "uiDetailViewClosed", this.handleDetailClosed), this.on(document, "dataColumns", this.handleDataColumns), this.trigger("uiNeedsColumns")
        }), this.handleDataColumns = function(t, e) {
            e.columns && (this.columns = e.columns, this.columnIndex = this.columns.indexOf(this.selectedColumn), -1 === this.columnIndex && (this.selectedColumn = null, this.$selectedChirp = $(), this.offset = null))
        }, this.setSelectedColumn = function(t) {
            var e = this.columns.length;
            0 > t ? t = 0 : t >= e && (t = e - 1), this.columns[t] !== this.selectedColumn && (clearTimeout(this.chirpCenterTimeout), this.chirpCenter = this.calculateChirpCenterRelativeToColumn(this.selectedColumn, this.$selectedChirp), this.chirpCenterTimeout = setTimeout(function() {
                this.chirpCenter = null
            }.bind(this), 1e3), this.selectedColumn = this.columns[t], this.columnIndex = t, null === this.chirpCenter ? this.selectFirstChirpInSelectedColumn() : this.selectClosestChirpToOffsetCenter(this.selectedColumn, this.chirpCenter, !0))
        }, this.selectClosestChirpToOffsetCenter = function(t, e, i) {
            var s = this.selectedColumn.model.getKey(),
                n = this.getColumnScrollContainerByKey(s),
                o = n.innerHeight(),
                r = n.find(this.attr.chirpSelector),
                a = $(),
                c = null,
                h = Number.MAX_VALUE;
            r.each(function() {
                var t = $(this),
                    i = t.position().top,
                    s = i + t.outerHeight();
                s >= 0 && o >= i && e >= i && s >= e && (a = $().add(t))
            }), 0 === a.length ? c = r.last() : 1 === a.length ? c = a : a.each(function(i, s) {
                var n = this.calculateChirpCenterRelativeToColumn(t, $(s)),
                    o = Math.abs(e - n);
                h = Math.min(o, h), o === h && (c = $(s))
            }.bind(this)), this.setSelectedChirp(c, i)
        }, this.calculateChirpCenterRelativeToColumn = function(t, e) {
            if (0 === e.length || null !== this.chirpCenter) return this.chirpCenter;
            var i, s, n, o = t.model.getKey(),
                r = this.getColumnScrollContainerByKey(o).innerHeight();
            return i = e.position().top, s = e.outerHeight(), n = i + s / 2, n > r ? n = r : 0 > n && (n = 0), n
        }, this.selectFirstChirpInSelectedColumn = function() {
            var t;
            if (this.isInDetailView()) this.$selectedChirp = this.selectedColumn.detailViewComponent.getMostInteresting$Chirp();
            else if (!this.isInDetailViewLevel2()) {
                t = this.selectedColumn.model.getKey();
                var e = this.getColumnElementByKey(t).find(this.attr.chirpSelector);
                this.$selectedChirp.removeClass(this.attr.isSelectedClass), this.$selectedChirp = $(), e.each(function(t, e) {
                    var i = $(e);
                    return i.position().top + i.outerHeight() / 2 > 0 ? (this.$selectedChirp = i, !1) : void 0
                }.bind(this)), 0 === this.$selectedChirp.length && (this.$selectedChirp = e.first())
            }
            this.$selectedChirp.addClass(this.attr.isSelectedClass), this.scrollToChirp("up")
        }, this.setSelectedChirp = function(t, e) {
            this.$selectedChirp.length > 0 && this.$selectedChirp.removeClass(this.attr.isSelectedClass), this.$selectedChirp = t, this.$selectedChirp.addClass(this.attr.isSelectedClass), e && this.$selectedChirp.length > 0 && this.scrollToChirp(this.scrollDirection)
        }, this.selectPrevChirp = function() {
            var t, e, i;
            this.chirpCenter = null, this.isInDetailView() ? (e = this.selectedColumn.detailViewComponent.$find(this.attr.chirpSelector), i = e.index(this.$selectedChirp), t = e.eq(Math.max(0, i - 1))) : t = this.$selectedChirp.prev(this.attr.chirpSelector), 0 === t.length ? this.selectFirstChirpInSelectedColumn() : this.setSelectedChirp(t, !0)
        }, this.selectNextChirp = function() {
            var t, e, i;
            this.chirpCenter = null, this.isInDetailView() ? (e = this.selectedColumn.detailViewComponent.$find(this.attr.chirpSelector), i = e.index(this.$selectedChirp), t = e.eq(Math.min(e.length - 1, i + 1))) : t = this.$selectedChirp.next(this.attr.chirpSelector).length > 0 ? this.$selectedChirp.next(this.attr.chirpSelector) : this.$selectedChirp, 0 === t.length ? this.selectFirstChirpInSelectedColumn() : this.setSelectedChirp(t, !0)
        }, this.moveSelection = function(t) {
            var e = function() {
                var e;
                if (this.hasFocus)
                    if (null === this.selectedColumn) this.setSelectedColumn(0);
                    else {
                        switch (this.scrollDirection = t, t) {
                            case "left":
                                e = null === this.columnIndex ? 0 : this.columnIndex - 1, this.setSelectedColumn(e);
                                break;
                            case "right":
                                e = null === this.columnIndex ? 0 : this.columnIndex + 1, this.setSelectedColumn(e);
                                break;
                            case "up":
                                this.selectPrevChirp();
                                break;
                            case "down":
                                this.selectNextChirp()
                        }
                        this.trigger("uiColumnsScrollToColumn", {
                            columnKey: this.selectedColumn.model.getKey(),
                            source: this.attr.id,
                            offset: this.attr.columnScrollOffset,
                            direction: this.scrollDirection
                        })
                    }
            }, i = _.throttle(e.bind(this), 100);
            return i
        }, this.selectColumnByKey = function(t) {
            if (this.selectedColumn && this.selectedColumn.model.getKey() === t) return !1;
            for (var e = 0; e < this.columns.length; e += 1)
                if (this.columns[e].model.getKey() === t) return this.columnIndex = e, this.selectedColumn = this.columns[e], !0;
            return !1
        }, this.selectColumnByIndex = function(t) {
            return this.selectedColumn !== this.columns[t] ? (this.columnIndex = t, this.selectedColumn = this.columns[t], !0) : !1
        }, this.selectLastColumn = function() {
            return this.selectColumnByIndex(this.columns.length - 1)
        }, this.handleColumnFocus = function(t, e) {
            if (this.hasFocus) {
                var i = !1;
                this.$selectedChirp.removeClass(this.attr.isSelectedClass), void 0 !== e.columnKey ? i = this.selectColumnByKey(e.columnKey) : void 0 !== e.index ? i = this.selectColumnByIndex(e.index) : e.last === !0 && (i = this.selectLastColumn()), i ? (this.$selectedChirp = $(), this.chirpIndex = null, this.offset = null) : (this.$selectedChirp.addClass(this.attr.isSelectedClass), 1 === this.selectedColumn.visibility.visibleFraction && this.trigger("uiGridHome"))
            }
        }, this.clearSelection = function() {
            this.$selectedChirp.removeClass(this.attr.isSelectedClass), this.$selectedChirp = $(), this.selectedColumn = null, this.chirpIndex = null, this.columnIndex = null, this.offset = null
        }, this.scrollToChirp = function(t) {
            this.trigger("uiColumnsScrollToChirp", {
                columnKey: this.selectedColumn.model.getKey(),
                $chirp: this.$selectedChirp,
                direction: t,
                offset: this.attr.chirpScrollOffset
            })
        }, this.handleBack = function() {
            var t, e, i, s;
            this.hasFocus && (s = this.getColumnElementByKey(this.selectedColumn.model.getKey()), this.isInDetailView() ? (t = this.selectedColumn.detailViewComponent.parentChirp, i = this.selectedColumn.ui.getChirpContainer(), e = i.find('[data-key="' + t.id + '"]'), s.trigger("uiCloseDetailView"), e.addClass(this.attr.isSelectedClass), this.$selectedChirp = e, this.scrollToChirp("down")) : this.isInDetailViewLevel2() && s.trigger("uiCloseSocialProof"))
        }, this.handleClearSelection = function() {
            this.hasFocus && this.clearSelection()
        }, this.isInDetailView = function() {
            var t = this.getColumnElementByKey(this.selectedColumn.model.getKey());
            return t.hasClass(this.attr.columnStateDetailViewClass)
        }, this.isInDetailViewLevel2 = function() {
            var t = this.getColumnElementByKey(this.selectedColumn.model.getKey());
            return t.hasClass(this.attr.columnStateSocialProofClass)
        }, this.tweetActionFactory = function(t) {
            return function() {
                var e, i, s, n;
                if (this.hasFocus && this.$selectedChirp.length > 0 && !this.isInDetailViewLevel2()) {
                    if (i = this.$selectedChirp.attr("data-key"), e = this.selectedColumn.findMostInterestingChirp(i), !e) return;
                    switch (t) {
                        case "profile":
                            e.getMainUser ? s = e.getMainUser() : e.getRelatedUser && (s = e.getRelatedUser()), s && this.trigger("uiShowProfile", {
                                id: s.screenName
                            });
                            break;
                        case "viewDetails":
                            if (e instanceof TD.services.TwitterDirectMessage) return;
                        default:
                            if (e instanceof TD.services.TwitterAction) return;
                            n = "reply" === t && (e instanceof TD.services.TwitterDirectMessage || e instanceof TD.services.TwitterMessageThread) ? "dm" : t, this.parentChirp = this.selectedColumn.findChirp(i), $.publish("chirp/action", [n, e, this.parentChirp, this.selectedColumn, {
                                element: this.$selectedChirp
                            }])
                    }
                } else switch (t) {
                    case "dm":
                        this.trigger("uiComposeTweet", {
                            type: "message"
                        })
                }
            }.bind(this)
        }, this.handleDetailViewActive = function(t, e) {
            var i = e.$chirp.closest(this.attr.columnSelector);
            this.selectColumnByKey(i.attr("data-column")), this.$selectedChirp.removeClass(this.attr.isSelectedClass), this.$selectedChirp = e.$chirp, this.parentChirp === e.parentChirp && this.$selectedChirp.addClass(this.attr.isSelectedClass)
        }, this.handleDetailClosed = function(t, e) {
            var i;
            e && e.column && (i = e.column.model.getKey(), this.$selectedChirp.removeClass(this.attr.isSelectedClass), this.selectColumnByKey(i), this.$selectedChirp = $())
        }, this.handlePagingFactory = function(t) {
            var e = function() {
                if (this.hasFocus && this.selectedColumn) {
                    var e, i, s, n, o, r, a, c = this.selectedColumn.model.getKey(),
                        h = this.getColumnScrollContainerByKey(c),
                        l = h.scrollTop(),
                        u = h.innerHeight();
                    if (0 === this.$selectedChirp.length && this.selectFirstChirpInSelectedColumn(), null !== this.chirpOffsetTop ? e = this.chirpOffsetTop : (e = this.$selectedChirp.position().top, this.targetChirpOffsetTop = null), this.chirpOffsetTop = e, this.$selectedChirp.removeClass(this.attr.isSelectedClass), "down" === t) {
                        this.targetChirpOffsetTop = null === this.targetChirpOffsetTop ? e + u : this.targetChirpOffsetTop + u;
                        do r = this.$selectedChirp.next(this.attr.chirpSelector), r.length > 0 && (this.$selectedChirp = r); while (r.length > 0 && r.position().top < this.targetChirpOffsetTop);
                        i = l + (this.$selectedChirp.position().top - e), i + u + 50 > h.get(0).scrollHeight && (i += 50), s = i - l
                    } else {
                        this.targetChirpOffsetTop = null === this.targetChirpOffsetTop ? e - u : this.targetChirpOffsetTop - u;
                        do o = this.$selectedChirp.prev(this.attr.chirpSelector), o.length > 0 && (this.$selectedChirp = o); while (o.length > 0 && o.position().top > this.targetChirpOffsetTop);
                        i = l - (e + Math.abs(this.$selectedChirp.position().top)), s = l - i
                    }
                    this.$selectedChirp.addClass(this.attr.isSelectedClass), a = function() {
                        this.chirpOffsetTop = null, this.targetChirpOffsetTop = null
                    }.bind(this), n = TD.ui.columns.calculateScrollDuration(s, 50, 750), h.stop().animate({
                        scrollTop: i
                    }, n, this.attr.pagingEasingFunction, a)
                }
            };
            return e.bind(this)
        }, this.handleGridHome = function() {
            if (this.hasFocus && this.selectedColumn) {
                this.chirpOffsetTop = null, this.targetChirpOffsetTop = null;
                var t = this.selectedColumn.model.getKey(),
                    e = this.getColumnScrollContainerByKey(t),
                    i = e.scrollTop(),
                    s = TD.ui.columns.calculateScrollDuration(i, 20, 300);
                this.$selectedChirp.removeClass(this.attr.isSelectedClass), this.$selectedChirp = this.$selectedChirp.parent().find(".js-stream-item:first"), this.$selectedChirp.addClass(this.attr.isSelectedClass), e.stop().animate({
                    scrollTop: 0
                }, s, this.attr.pagingEasingFunction)
            }
        }, this.handleGridEnd = function() {
            if (this.hasFocus && this.selectedColumn) {
                this.chirpOffsetTop = null, this.targetChirpOffsetTop = null;
                var t = this.selectedColumn.model.getKey(),
                    e = this.getColumnScrollContainerByKey(t),
                    i = e.scrollTop(),
                    s = e.get(0).scrollHeight - e.innerHeight() + 50,
                    n = s - i,
                    o = TD.ui.columns.calculateScrollDuration(n, 20, 300);
                this.$selectedChirp.removeClass(this.attr.isSelectedClass), this.$selectedChirp = this.$selectedChirp.parent().find(".js-stream-item:last"), this.$selectedChirp.addClass(this.attr.isSelectedClass), e.stop().animate({
                    scrollTop: s
                }, o, this.attr.pagingEasingFunction)
            }
        }
    }
    return t(s, e, i)
}), define("ui/grid_scroll", ["require", "flight/lib/component", "ui/with_column_selectors"], function(t) {
    function e() {
        this.defaultAttrs({
            columnsLeftMargin: 10,
            slideMinDuration: 200,
            slideMaxDuration: 500,
            extraSlideTimePer100Px: 20,
            columnGlowDuration: 500
        }), this.after("initialize", function() {
            this.on(document, "uiColumnFocus", this.handleColumnFocus), this.on(document, "uiColumnsScrollToColumn", this.handleScrollToColumn), this.on(document, "uiColumnsScrollColumnToCenter", this.handleScrollColumnToCenter), this.on(document, "uiColumnsScrollToChirp", this.handleScrollToChirp)
        }), this.handleColumnFocus = function(t, e) {
            var i;
            void 0 !== e.index ? i = this.getKeyForColumnAtIndex(e.index) : e.last ? i = this.getKeyForLastColumn() : e.columnKey && (i = e.columnKey), i && this.trigger("uiColumnsScrollColumnToCenter", {
                columnKey: i
            })
        }, this.handleScrollToColumn = function(t, e) {
            var i, s = this.getColumnElementByKey(e.columnKey),
                n = this.select("appColumnsContainerSelector"),
                o = this.select("columnsContainerSelector"),
                r = s.outerWidth(),
                a = o.width(),
                c = n.scrollLeft(),
                h = s.position().left,
                l = h + r;
            h >= 0 && a >= l || (i = "left" === e.direction ? c + h - e.offset : c + l + e.offset - a, this.scrollColumnToOffset(e.columnKey, i, !1))
        }, this.handleScrollColumnToCenter = function(t, e) {
            var i, s, n, o, r, a, c = this.getColumnElementByKey(e.columnKey),
                h = this.select("appColumnsContainerSelector"),
                l = this.select("columnsContainerSelector"),
                u = h.innerWidth() / c.outerWidth(!0),
                d = h.scrollLeft(),
                m = !0;
            3.05 >= u ? (a = parseInt(l.css("padding-left"), 10), i = d + c.position().left - a) : (s = c.outerWidth(), n = h.get(0).scrollWidth - this.attr.columnsLeftMargin, o = l.width(), r = c.offset().left, i = d + r - (o - s) / 2, i = Math.min(i, n - o), i = Math.max(i, 0)), 2 > u && (m = !1), this.scrollColumnToOffset(e.columnKey, i, m)
        }, this.scrollColumnToOffset = function(t, e, i) {
            var s, n, o = this.select("appColumnsContainerSelector"),
                r = o.scrollLeft();
            e !== r ? (o.stop(), n = Math.abs(e - r), s = this.attr.slideMinDuration + n / 100 * this.attr.extraSlideTimePer100Px, s = Math.min(s, this.attr.slideMaxDuration), o.animate({
                scrollLeft: e
            }, s, "easeInOutQuad", function() {
                i && TD.ui.columns.focusColumn(t, this.attr.columnGlowDuration), this.getColumnElementByKey(t).trigger("uiColumnScrolled", {
                    columnKey: t
                })
            }.bind(this))) : (i && TD.ui.columns.focusColumn(t, this.attr.columnGlowDuration), this.getColumnElementByKey(t).trigger("uiColumnScrolled", {
                columnKey: t
            }))
        }, this.handleScrollToChirp = function(t, e) {
            if (e.$chirp && e.columnKey && 0 !== e.$chirp.length) {
                var i, s, n = this.getColumnScrollContainerByKey(e.columnKey),
                    o = n.scrollTop(),
                    r = e.$chirp.position().top + o,
                    a = n.innerHeight();
                "up" === e.direction ? (i = r - e.offset, o > i && n.stop().animate({
                    scrollTop: i
                }, 100)) : (s = r + e.$chirp.outerHeight() + e.offset, s > o + a && (i = s - a, n.stop().animate({
                    scrollTop: i
                }, 100)))
            }
        }
    }
    var i = t("flight/lib/component"),
        s = t("ui/with_column_selectors");
    return i(e, s)
}), define("ui/focus_controller", ["flight/lib/component"], function(t) {
    var e = function() {
        this.handleFocusRequest = function(t, e) {
            e && void 0 !== e.id && this.focusHistory[this.focusHistory.length - 1] !== e.id && (this.focusHistory.push(e.id), this.trigger("uiFocus", {
                id: e.id
            }))
        }, this.handleFocusRelease = function(t, e) {
            e && void 0 !== e.id && (this.focusHistory[this.focusHistory.length - 1] === e.id ? (this.focusHistory = this.focusHistory.filter(function(t) {
                return t !== e.id
            }), this.focusHistory.length > 0 && _.defer(function() {
                this.trigger("uiFocus", {
                    id: this.focusHistory[this.focusHistory.length - 1]
                })
            }.bind(this))) : this.focusHistory = this.focusHistory.filter(function(t) {
                return t !== e.id
            }))
        }, this.after("initialize", function() {
            this.focusHistory = [], this.on(document, "uiFocusRequest", this.handleFocusRequest), this.on(document, "uiFocusRelease", this.handleFocusRelease)
        })
    };
    return t(e)
}), define("ui/confirmation_dialog_controller", ["flight/lib/component"], function(t) {
    var e = function() {
        this.showConfirmationDialog = function(t, e) {
            this.trigger(document, "uiConfirmationAction", {
                id: e.id,
                result: confirm(e.message) ? !0 : !1
            })
        }, this.after("initialize", function() {
            this.on(document, "uiShowConfirmationDialog", this.showConfirmationDialog)
        })
    };
    return t(e)
}), define("ui/modal/with_modal", ["flight/lib/compose", "ui/with_focus"], function(t, e) {
    function i() {
        t.mixin(this, [e]), this.defaultAttrs({
            dismissButton: ".js-dismiss",
            modal: ".js-modal",
            modalPanel: ".js-modal-panel",
            modalDragHandle: ".mdl-drag-handle",
            isDraggingClass: "is-dragging",
            isTouchModalClass: "is-touch-modal",
            openModalID: "#open-modal",
            autoFocus: !0
        }), this.handleDragStart = function() {
            var t = this.select("modalPanel");
            t.css({
                position: "absolute",
                top: t.offset().top,
                left: t.offset().left
            }), this.$node.addClass(this.attr.isDraggingClass)
        }, this.getDragDropBoundary = function() {
            return this.$node
        }, this.dismiss = function(t) {
            this.attr.closeEvent && (t && t.preventDefault(), this.trigger(this.attr.closeEvent))
        }, this.handleClickOnOverlay = function(t) {
            t.target === this.$node.get(0) && this.dismiss()
        }, this.before("initialize", function() {
            $(document).trigger("uiCloseModal")
        }), this.after("initialize", function() {
            this.on(this.$node, "click", this.handleClickOnOverlay), this.on("click", {
                dismissButton: this.dismiss
            }), this.on(document, "uiCloseModal", this.dismiss)
        }), this.after("render", function() {
            this.select("modalPanel").draggable({
                boundary: this.getDragDropBoundary.bind(this),
                handle: this.select("modalDragHandle")
            }), this.on("start.draggable", this.handleDragStart), this.focusRequest();
            var t = this.select("modalPanel").parent(this.attr.modal),
                e = $(this.attr.openModalID);
            TD.util.isTouchDevice() && TD.decider.get(TD.decider.TOUCHDECK_MODALS) ? (t.addClass(this.attr.isTouchModalClass), e.addClass(this.attr.isTouchModalClass)) : (t.removeClass(this.attr.isTouchModalClass), e.removeClass(this.attr.isTouchModalClass))
        }), this.before("teardown", function() {
            this.$node.removeClass(this.attr.isDraggingClass)
        }), this.after("teardown", function() {
            this.$node.hide()
        })
    }
    return i
}), define("ui/embed_tweet", ["flight/lib/component", "ui/with_template", "ui/modal/with_modal"], function(t, e, i) {
    function s() {
        this.defaultAttrs({
            embedDataCache: {},
            includeParentTweet: !0,
            includeMedia: !0,
            closeEvent: "uiCloseEmbedTweet",
            dataEmbeddedTweetEvent: "dataEmbeddedTweet",
            dataEmbeddedTweetErrorEvent: "dataEmbeddedTweetError",
            embedTextArea: ".js-embed-textarea",
            embedIncludeParentCheckBox: ".js-embed-include-parent",
            embedIncludeMediaCheckBox: ".js-embed-include-media",
            modalTitle: ".js-header-title",
            embedIframe: ".js-embed-iframe",
            embedIframeContainer: ".js-embed-iframe-container",
            embedModalPanel: ".js-modal-panel",
            embedModalHeader: ".js-mdl-header",
            embedModalContent: ".js-mdl-content",
            embedLoading: ".js-embed-loading-container"
        }), this.handleEmbeddedTweet = function(t, e) {
            var i, s, n, o, r, a, c, h;
            if (e && e.html && e.request && e.request.tweetID === this.attr.tweet.id && e.request.hideThread !== this.includeParentTweet && e.request.hideMedia !== this.includeMedia)
                if (this.putEmbedDataInCache(e), h = function(t) {
                    var h;
                    this.render("embed_tweet", {
                        html: e.html,
                        isReply: !! t.inReplyToID,
                        includeParentTweet: this.includeParentTweet,
                        hasMedia: !! t.cards,
                        includeMedia: this.includeMedia
                    }), this.select("modalTitle").text(TD.i("Embed this Tweet")), this.on(this.select("embedTextArea"), "focus", this.handleInputBoxFocus), s = this.select("embedIframe"), n = this.select("embedIframeContainer"), o = this.select("embedModalPanel"), r = this.select("embedModalHeader"), a = this.select("embedModalContent"), c = this.select("embedLoading"), h = function() {
                        n.css("height", "auto"), s.height(Math.max($("html", i).outerHeight(), $("body", i).outerHeight(), s.height())), o.height(a.height() + r.outerHeight()), $("a", i).attr("target", "_blank")
                    }.bind(this), s.load(function() {
                        c.addClass("is-hidden"), h(), this.resizeIframeIntervalId = setInterval(h, 500)
                    }.bind(this)), s[0] && (i = s[0].contentWindow.document, i.open(), i.write('<!DOCTYPE html><head><base href="https://tweetdeck.twitter.com"></head><body>' + e.html + "</body></html>"), i.close()), a.removeClass("horizontal-flow-container")
                }, !this.attr.tweet.cards && this.attr.tweet.hasLink()) {
                    var l = TD.controller.clients.getClient(this.attr.tweet.account.getKey());
                    l.show(this.attr.tweet.id, h.bind(this), function() {
                        this.trigger(document, this.attr.dataEmbeddedTweetErrorEvent, e)
                    }.bind(this))
                } else h.call(this, this.attr.tweet)
        }, this.handleEmbeddedTweetError = function(t, e) {
            e && e.request && e.request.tweetID === this.attr.tweet.id && (this.teardown(t), TD.controller.progressIndicator.addMessage(TD.i("Sorry, couldn't retrieve embedded Tweet. Please try again later.")))
        }, this.handleInputBoxFocus = function() {
            var t = this.select("embedTextArea");
            _.defer(function() {
                t.select()
            })
        }, this.handleEmbeddedTweetOptionsChange = function() {
            var t;
            this.includeParentTweet = $(this.attr.embedIncludeParentCheckBox).prop("checked"), this.includeMedia = $(this.attr.embedIncludeMediaCheckBox).prop("checked"), this.render("embed_tweet", {
                loading: !0
            }), t = this.getEmbedDataFromCache(), t ? this.trigger(document, "dataEmbeddedTweet", t) : this.trigger(document, "uiNeedsEmbeddedTweet", {
                tweetID: this.attr.tweet.id,
                hideThread: !this.includeParentTweet,
                hideMedia: !this.includeMedia
            })
        }, this.getEmbedDataFromCache = function() {
            var t = !! this.includeParentTweet,
                e = !! this.includeMedia,
                i = this.attr.embedDataCache[t + ":" + e];
            return i && i.request.tweetID === this.attr.tweet.id ? i : void 0
        }, this.putEmbedDataInCache = function(t) {
            var e = !! this.includeParentTweet,
                i = !! this.includeMedia;
            this.attr.embedDataCache[e + ":" + i] = t
        }, this.after("teardown", function() {
            clearInterval(this.resizeIframeIntervalId), this.$node.html("")
        }), this.after("initialize", function() {
            this.includeParentTweet = this.attr.includeParentTweet, this.includeMedia = this.attr.includeMedia, this.render("embed_tweet", {
                loading: !0
            }), this.trigger(document, "uiNeedsEmbeddedTweet", {
                tweetID: this.attr.tweet.id,
                hideThread: !this.includeParentTweet,
                hideMedia: !this.includeMedia
            }), this.on(this.attr.closeEvent, this.teardown), this.on("change", {
                embedIncludeParentCheckBox: this.handleEmbeddedTweetOptionsChange,
                embedIncludeMediaCheckBox: this.handleEmbeddedTweetOptionsChange
            }), this.on(document, this.attr.dataEmbeddedTweetEvent, this.handleEmbeddedTweet), this.on(document, this.attr.dataEmbeddedTweetErrorEvent, this.handleEmbeddedTweetError)
        })
    }
    return t(s, e, i)
}), define("ui/keyboard_shortcut_list", ["flight/lib/component", "ui/with_template", "ui/modal/with_modal"], function(t, e, i) {
    function s() {
        this.defaultAttrs({
            closeEvent: "uiCloseKeyboardShortcutsList",
            modalTitle: ".js-header-title"
        }), this.after("teardown", function() {
            this.$node.html("")
        }), this.after("initialize", function() {
            this.render("keyboard_shortcut_list", {
                isMac: "osx" === TD.util.getOSName()
            }), this.select("modalTitle").text(TD.i("Keyboard shortcuts")), this.on(this.attr.closeEvent, this.teardown)
        })
    }
    return t(s, e, i)
}), define("ui/follow_state", ["flight/lib/component"], function(t) {
    var e = function() {
        this.defaultAttrs({
            follows: "s-follows"
        }), this.handleRelationshipData = function(t, e) {
            e && e.relationship && this.account.isSameUser(e.relationship.source.screen_name) && this.twitterUser.isSameUser(e.relationship.target.screen_name) && this.$node.toggleClass(this.attr.follows, e.relationship.target.following)
        }, this.destroy = function(t) {
            t.stopPropagation(), this.teardown()
        }, this.after("initialize", function() {
            if (this.account = this.attr.account, this.twitterUser = this.attr.twitterUser, !(this.account instanceof TD.storage.Account)) throw "source must be instance of TD.storage.Account";
            if (!(this.twitterUser instanceof TD.services.TwitterUser)) throw "target must be instance of TD.services.TwitterUser";
            this.on(document, "dataRelationship", this.handleRelationshipData), this.attr.closeEvent && this.on(this.attr.closeEvent, this.destroy), this.trigger("uiNeedsRelationship", {
                account: this.account,
                screenName: this.twitterUser.screenName
            })
        })
    };
    return t(e)
}), define("ui/relationship", ["require", "flight/lib/component"], function(t) {
    function e() {
        this.defaultAttrs({
            states: {
                unknown: "unknown",
                following: "following",
                notFollowing: "notFollowing",
                blocking: "blocking",
                me: "me"
            },
            classNamesForStates: {
                unknown: "unknown",
                following: "s-following",
                notFollowing: "s-not-following",
                blocking: "s-blocking",
                me: "s-thats-you"
            },
            followButton: ".js-follow-button"
        }), this.after("initialize", function() {
            this.account = this.attr.account, this.twitterUser = this.attr.twitterUser, this.state = this.attr.states.unknown, this.on(document, "dataRelationship", this.handleRelationshipData), this.on("click", {
                followButton: this.handleFollowButtonClick
            }), this.on(document, "uiFollowAction dataUnfollowActionError", this.handleActionFactory("following")), this.on(document, "uiUnfollowAction dataFollowActionError", this.handleActionFactory("notFollowing")), this.on(document, "uiBlockAction dataUnblockActionError", this.handleActionFactory("blocking")), this.on(document, "uiUnblockAction dataBlockActionError dataReportActionError", this.handleActionFactory("notFollowing")), $.subscribe("/user/" + this.screenName + "/block", this.handlePubSubEvent("blocking")), $.subscribe("/user/" + this.screenName + "/unblock", this.handlePubSubEvent("notFollowing")), this.attr.closeEvent && this.on(this.attr.closeEvent, this.destroy), this.trigger("uiNeedsRelationship", {
                account: this.account,
                screenName: this.twitterUser.screenName
            })
        }), this.resetState = function() {
            this.$node.removeClass(this.attr.classNamesForStates[this.state])
        }, this.setState = function(t, e) {
            this.state = t.following ? this.attr.states.following : this.attr.states.notFollowing, t.id === e.id && (this.state = this.attr.states.me), t.blocking && (this.state = this.attr.states.blocking)
        }, this.handleFollowButtonClick = function(t) {
            var e = {
                account: this.account,
                twitterUser: this.twitterUser
            };
            switch (this.state) {
                case this.attr.states.following:
                    this.trigger("uiUnfollowAction", e);
                    break;
                case this.attr.states.notFollowing:
                    this.trigger("uiFollowAction", e);
                    break;
                case this.attr.states.blocking:
                    this.trigger("uiUnblockAction", e);
                    break;
                case this.attr.states.me:
                    TD.util.openURL("https://twitter.com/settings/profile")
            }
            t.stopPropagation()
        }, this.enableButton = function() {
            this.select("followButton").prop("disabled", !1)
        }, this.setTargetElementState = function() {
            this.$node.addClass(this.attr.classNamesForStates[this.state])
        }, this.isRelevantRelationship = function(t) {
            return this.account.isSameUser(t.source.screen_name) && this.twitterUser.isSameUser(t.target.screen_name)
        }, this.handleRelationshipData = function(t, e) {
            e && e.relationship && this.isRelevantRelationship(e.relationship) && (this.resetState(), this.setState(e.relationship.source, e.relationship.target), this.state !== this.attr.states.unknown && this.enableButton(), this.setTargetElementState())
        }, this.isRelevantAction = function(t) {
            return t && t.twitterUser && t.twitterUser.isSameUser(this.twitterUser) && t.account === this.account
        }, this.handleActionFactory = function(t) {
            var e = function(e, i) {
                this.isRelevantAction(i) && (this.resetState(), this.state = this.attr.states[t], this.setTargetElementState())
            };
            return e.bind(this)
        }, this.handlePubSubEvent = function(t) {
            var e = function(e, i) {
                i.getAccountKey() === this.account.getAccountKey() && (this.resetState(), this.state = this.attr.states[t], this.setTargetElementState())
            };
            return e.bind(this)
        }, this.destroy = function(t) {
            t.stopPropagation(), this.teardown()
        }
    }
    var i = t("flight/lib/component");
    return i(e)
}), define("util/notifications", [], function() {
    var t = {};
    return t.publishToQueue = function(t, e) {
        TD.storage.notification.notify(t, e)
    }, t.publish = function(t, e) {
        $.publish(t, e)
    }, t.subscribe = function(t, e) {
        return $.subscribe(t, e)
    }, t.unsubscribe = function(t) {
        $.unsubscribe(t)
    }, t
}), define("ui/with_column_config", [], function() {
    var t = function() {
        this.before("initialize", function() {
            this.columnConfig = {
                DISPLAY_ORDER_PROFILE: TD.controller.columnManager.DISPLAY_ORDER_PROFILE,
                OPEN_COLUMN_URL_BASE: TD.components.OpenColumnHome.URL_BASE,
                GO_EVENT: TD.components.OpenColumn.GO_EVENT
            }
        })
    };
    return t
}), define("ui/modal/with_modalable", ["require"], function() {
    function t() {
        this.defaultAttrs({
            isModal: !1
        }), this.after("initialize", function() {
            this.attr.isModal && (this.trigger("uiModalShowing"), this.trigger("uiCloseModal"), this.on(document, "uiModalShowing uiCloseModal", this.teardown))
        }), this.before("teardown", function() {
            this.attr.isModal && this.trigger("uiModalHiding")
        })
    }
    return t
}), define("ui/twitter_profile", ["require", "flight/lib/component", "ui/follow_state", "ui/relationship", "util/notifications", "ui/with_column_config", "ui/modal/with_modalable", "ui/with_template", "ui/with_transitions"], function(t) {
    function e() {
        this.defaultAttrs({
            dataAction: "[data-action]",
            socialProofSelector: ".js-social-proof",
            followFromSelector: ".js-action-follow",
            followStateSelector: ".prf-follow-status",
            closeEvent: "uiTwitterProfileClosing",
            numUsersInSocialProof: 3,
            isSocialProofAnimatingClass: "social-proof-animating"
        }), this.handleTwitterAccount = function(t, e) {
            if (e && e.account && e.screenName && e.screenName.toLowerCase() === this.screenName.toLowerCase()) {
                this.twitterUser = e, this.render("twitter_profile", {
                    twitterProfile: {
                        preferredAccount: this.account.getUsername(),
                        profile: this.twitterUser,
                        displayOrderProfile: this.columnConfig.DISPLAY_ORDER_PROFILE,
                        account: this.account,
                        showAccountMenu: !0,
                        hideFromAccountName: !0,
                        isSingleAccount: this.isSingleAccount
                    }
                }), this.on(this.attr.dataAction, "click", this.handleActionClick), this.twitterUser.isMe() || this.trigger(document, "uiNeedsUserProfileSocialProof", {
                    screenName: this.screenName
                });
                var i = {
                    account: this.account,
                    twitterUser: this.twitterUser,
                    closeEvent: this.attr.closeEvent
                };
                n.attachTo(this.select("followFromSelector"), i), s.attachTo(this.select("followStateSelector"), i)
            }
        }, this.handleTwitterUserError = function(t, e) {
            e.screenName.toLowerCase() === this.screenName.toLowerCase() && this.teardown()
        }, this.handleSocialProofData = function(t, e) {
            var i, s, n, o = this.select("socialProofSelector"),
                r = [],
                a = 0,
                c = [];
            if (e.users && e.users.length) {
                if (e.users.length > this.attr.numUsersInSocialProof)
                    for (a = e.users.length - this.attr.numUsersInSocialProof; r.length < this.attr.numUsersInSocialProof;) n = Math.floor(Math.random() * e.users.length), r.push(e.users.splice(n, 1)[0]);
                else r = e.users;
                r.forEach(function(t) {
                    c.push(TD.ui.template.render("text/social_proof_link", t))
                }), a > 0 && c.push(TD.ui.template.render("text/followers_you_follow_link", {
                    screenName: this.screenName
                })), c.length > 1 && (s = c.splice(c.length - 1, 1)), i = c.join(", "), o.removeClass("is-hidden"), o.html(TD.ui.template.render("twitter_profile_social_proof", {
                    followedByString: i,
                    others: s
                })), this.transitionExpand(o, this.attr.isSocialProofAnimatingClass)
            }
        }, this.handleActionClick = function(t) {
            var e = $(t.currentTarget),
                i = e.data("type"),
                s = this.columnConfig.OPEN_COLUMN_URL_BASE + "/" + i,
                n = TD.util.maybeOpenClickExternally(t);
            n || (this.screenName && (s += "?screenName=" + this.screenName), o.publishToQueue(this.columnConfig.GO_EVENT, {
                data: s,
                history: {
                    type: "uiShowProfile",
                    target: document,
                    data: {
                        id: this.screenName
                    }
                }
            }), t.preventDefault(), t.stopPropagation())
        }, this.destroy = function(t) {
            t.stopPropagation(), this.teardown()
        }, this.before("teardown", function() {
            this.trigger(this.select("followStateSelector"), this.attr.closeEvent), this.trigger(this.select("followFromSelector"), this.attr.closeEvent)
        }), this.after("teardown", function() {
            this.$node.html("")
        }), this.handleAccounts = function(t, e) {
            this.isSingleAccount = 1 === e.accounts.length
        }, this.handlePreferredAccount = function(t, e) {
            this.account = e.account
        }, this.after("initialize", function() {
            this.screenName = "" + this.attr.screenName, 0 === this.screenName.indexOf("@") && (this.screenName = this.screenName.substring(1)), this.on(document, "dataAccounts", this.handleAccounts), this.on(document, "dataPreferredAccount", this.handlePreferredAccount), this.trigger(document, "uiNeedsAccounts"), this.on(document, "dataTwitterUser", this.handleTwitterAccount), this.on(document, "dataTwitterUserError", this.handleTwitterUserError), this.on(document, "dataUserProfileSocialProof", this.handleSocialProofData), this.render("twitter_profile", {
                loading: !0
            }), this.trigger(document, "uiNeedsPreferredAccount"), this.trigger(document, "uiNeedsTwitterUser", {
                screenName: this.screenName
            })
        })
    }
    var i = t("flight/lib/component"),
        s = t("ui/follow_state"),
        n = t("ui/relationship"),
        o = t("util/notifications"),
        r = t("ui/with_column_config"),
        a = t("ui/modal/with_modalable"),
        c = t("ui/with_template"),
        h = t("ui/with_transitions");
    return i(e, c, a, r, h)
}), define("ui/report_message_options", ["flight/lib/component", "ui/with_template", "ui/modal/with_modal"], function(t, e, i) {
    function s(t, e) {
        var i = t.attr.twitterUser || {};
        t.render("report_message_options", {
            screenName: i.screenName,
            no_horiz_flow_container: !0,
            showResult: e
        }), t.select("modalTitle").text(TD.i("Mark + delete message"))
    }

    function n() {
        this.defaultAttrs({
            closeEvent: "uiReportMessageActionClose",
            modalTitle: ".js-header-title",
            spamButtonSelector: ".js-report-spam",
            abuseButtonSelector: ".js-mark-abusive"
        }), this.after("initialize", function() {
            s(this), this.on(this.attr.closeEvent, this.teardown), this.on("click", {
                spamButtonSelector: this.handleActionFactory("spam"),
                abuseButtonSelector: this.handleActionFactory("abuse"),
                dismissButton: this.handleManualDismiss
            }), this.on(document, "dataDMReport", this.handleReportData)
        }), this.after("teardown", function() {
            this.$node.html("")
        }), this.handleManualDismiss = function() {
            this.trigger("uiShowReportMessageCancel")
        }, this.handleActionFactory = function(t) {
            return function(e) {
                e.preventDefault(), this.trigger("uiNeedsDMReport", {
                    account: this.attr.account,
                    dmId: this.attr.tweetId,
                    reportType: t,
                    blockUser: !1
                }), s(this, !0)
            }.bind(this)
        }, this.handleReportData = function(t, e) {
            e.error ? (this.trigger("uiShowReportMessageError"), TD.controller.progressIndicator.addMessage(TD.i("Error: unable report direct message"))) : TD.controller.feedManager.deleteChirp(e.tweetId)
        }
    }
    return t(n, e, i)
}), define("ui/report_tweet_options", ["flight/lib/component", "ui/with_template", "ui/modal/with_modal"], function(t, e, i) {
    function s() {
        this.defaultAttrs({
            closeEvent: "uiReportTweetActionClose",
            modalTitle: ".js-header-title",
            blockCheckbox: ".js-report-block",
            optionRadios: ".js-report-option",
            submitButton: ".js-report-submit",
            inputs: ".js-report-block, .js-report-option",
            abuseLinks: ".abuse-link"
        }), this.after("initialize", function() {
            n = null, this.render("report_tweet_options", {
                screenName: this.attr.twitterUser.screenName,
                no_horiz_flow_container: !0
            }), this.select("modalTitle").text(TD.i("Report Tweet")), this.on("change", {
                inputs: this.handleInputClick
            }), this.on("click", {
                submitButton: this.handleSubmitclick,
                abuseLinks: this.handleAbuseLinkClick,
                dismissButton: this.handleManualDismiss
            }), this.on(this.$node, "click", this.handleOffNodeDismiss), this.on(this.attr.closeEvent, this.teardown), this.select("inputs").filter(":checked").trigger("change")
        }), this.handleInputClick = function(t) {
            var e = $(t.target).val();
            "block" === e ? n = $(t.target).prop("checked") : this.setBlockCheckbox(e), "abusive" === e ? this.select("submitButton").text(TD.i("Next")) : this.select("submitButton").text(TD.i("Submit")), this.select("submitButton").prop("disabled", !Boolean(this.select("inputs").filter(":checked").length))
        }, this.handleSubmitclick = function() {
            var t = this.select("optionRadios").filter(":checked").val(),
                e = $("input[name=report-block]").is(":checked");
            "spam" === t ? this.trigger("uiReportSpamAction", {
                account: this.attr.account,
                twitterUser: this.attr.twitterUser,
                block: e
            }) : "compromised" === t ? this.trigger("uiReportCompromisedAction", {
                account: this.attr.account,
                twitterUser: this.attr.twitterUser,
                block: e
            }) : "abusive" === t && (this.renderAbusiveModal(), this.trigger("uiReportAbusiveAction", {
                block: e
            })), "spam" !== t && e && this.trigger("uiBlockAction", {
                account: this.attr.account,
                twitterUser: this.attr.twitterUser
            }), "abusive" !== t && this.dismiss()
        }, this.setBlockCheckbox = function(t) {
            "spam" === t ? this.select("blockCheckbox").prop({
                checked: !0,
                disabled: !0
            }) : this.select("blockCheckbox").prop({
                disabled: !1,
                checked: null !== n ? n : !1
            })
        }, this.renderAbusiveModal = function() {
            this.render("report_tweet_options_abusive", {
                screenName: this.attr.twitterUser.screenName,
                tweetId: this.attr.tweetId,
                no_horiz_flow_container: !0
            }), this.select("modalTitle").text(TD.i("Select Form"))
        }, this.handleAbuseLinkClick = function(t) {
            this.trigger("uiReportAbusiveOption", {
                option: $(t.target).attr("data-scribe")
            }), this.dismiss()
        }, this.handleManualDismiss = function() {
            this.trigger("uiShowReportTweetCancel")
        }, this.handleOffNodeDismiss = function() {
            event.target === this.$node.get(0) && this.handleManualDismiss()
        }, this.after("teardown", function() {
            this.$node.html("")
        })
    }
    var n;
    return t(s, e, i)
}), define("ui/account_shared_warning", ["flight/lib/component", "ui/with_template", "ui/modal/with_modal"], function(t, e, i) {
    function s() {
        this.defaultAttrs({
            closeEvent: "uiAccountSharedWarningClose",
            modalTitle: ".js-header-title",
            continueSelector: ".js-account-shared-continue-btn",
            abortSelector: ".js-account-shared-abort-btn"
        }), this.after("initialize", function() {
            var t = TD.storage.store.getTwitterLoginAccount();
            this.render("account_shared_warning", {
                no_horiz_flow_container: !0,
                signinAccount: t.getUsername()
            }), TD.controller.stats.sharedAccountWarning("impression"), this.select("modalTitle").text(TD.i("Multi-account security")), this.on("click", {
                continueSelector: this.handleContinue,
                abortSelector: this.handleAbort,
                dismissButton: this.handleExplicitDismiss
            }), this.on(this.attr.closeEvent, this.teardown)
        }), this.handleContinue = function() {
            TD.controller.stats.sharedAccountWarning("accept"), this.trigger("uiAccountSharedWarningContinue"), this.dismiss()
        }, this.handleAbort = function() {
            TD.controller.stats.sharedAccountWarning("cancel"), this.trigger("uiAccountSharedWarningAbort"), this.dismiss()
        }, this.handleExplicitDismiss = function() {
            TD.controller.stats.sharedAccountWarning("dismiss"), this.trigger("uiAccountSharedWarningDismiss")
        }, this.after("teardown", function() {
            this.$node.html("")
        })
    }
    return t(s, e, i)
}), define("ui/follow_from_options", ["require", "flight/lib/component", "ui/with_template", "ui/modal/with_modal"], function(t) {
    function e() {
        this.defaultAttrs({
            userToFollow: null,
            closeEvent: "uiFollowFromOptionsClose",
            modalTitleSelector: ".js-header-title",
            modalContentSelector: ".js-mdl-content"
        }), this.after("initialize", function() {
            this._components = [], this._renderDialog(), this.on(this.attr.closeEvent, this.teardown)
        }), this.after("teardown", function() {
            this.$node.html(""), _.invoke(this._components, "destroy")
        }), this._renderDialog = function() {
            this.render("follow_from_options", {
                userToFollow: this.userToFollow,
                no_horiz_flow_container: !0
            }), this.select("modalTitleSelector").html(TD.i("Your relationship with {{>text/user_link_screenname}}", this.attr.userToFollow)), this._components = this._components.concat(this._renderFollowFromComponents())
        }, this._renderFollowFromComponents = function() {
            var t = TD.storage.accountController.getAccountsForService("twitter"),
                e = document.createDocumentFragment(),
                i = t.map(function(t) {
                    return t.getUserID() !== this.attr.userToFollow.id ? new TD.components.FollowFrom(this.attr.userToFollow, t) : void 0
                }.bind(this)).filter(_.identity);
            return _.pluck(i, "$node").forEach(function(t) {
                e.appendChild(t[0])
            }), this.select("modalContentSelector").append(e), i
        }
    }
    var i = t("flight/lib/component"),
        s = t("ui/with_template"),
        n = t("ui/modal/with_modal");
    return i(e, s, n)
}), define("ui/with_favorite_button", ["require", "flight/lib/compose", "ui/with_template"], function(t) {
    var e = t("flight/lib/compose"),
        i = t("ui/with_template"),
        s = {
            favorited: "s-favorited",
            unfavorited: "s-not-favorited",
            "protected": "s-protected"
        };
    return function() {
        function t(t, e, i) {
            i = i || {}, _.each(s, t.removeClass.bind(t)), t.addClass(s[e]), t.removeAttr("title"), t.removeAttr("data-orig-title"), t.toggleClass("is-disabled", i.disabled || !1), i.tooltip && (t.attr("title", i.tooltip), t.attr("data-orig-title", i.tooltip))
        }

        function n(e, i, s) {
            function n(n, o) {
                o.tweetId === i && o.accountKey === s && t(e, o.isFavorite ? "favorited" : "unfavorited")
            }

            function o(n, o) {
                if (o.request.tweetId === i && o.request.accountKey === s) {
                    var r = o.error.responseJSON;
                    return r && 179 === r.errors[0].code ? (t(e, "protected", {
                        tooltip: TD.i("You cannot favorite this protected Tweet"),
                        disabled: !0
                    }), void 0) : (TD.controller.progressIndicator.addMessage(TD.i("Cannot retrieve favorite status")), void 0)
                }
            }

            function r(t, e) {
                e.tweetId === i && e.accountKey === s && TD.controller.progressIndicator.addMessage(TD.i("Failed changing favorite status"))
            }
            this.on(document, "dataFavoriteState", n), this.before("teardown", this.off.bind(this, document, "dataFavoriteState", n)), this.on(document, "dataFavoriteStateError", o), this.before("teardown", this.off.bind(this, document, "dataFavoriteStateError", o)), this.on(document, "dataFavoriteError", r), this.before("teardown", this.off.bind(this, document, "dataFavoriteError", r)), this.trigger("uiNeedsFavoriteState", {
                tweetId: i,
                accountKey: s
            })
        }
        e.mixin(this, [i]), this.attachFavoriteButtons = function(t) {
            t = t || this.$node, t.find('[rel="favorite-button"]').each(function(t, e) {
                var i = e.dataset;
                this.renderFavoriteButton(e, i.tweetId, i.accountKey)
            }.bind(this))
        }, this.renderFavoriteButton = function(t, e, i) {
            var s = this.renderTemplate("buttons/favorite");
            return $(t).html(s), n.call(this, s, e, i), s.click(this.handleFavoriteButtonClick.bind(this, e, i)), s
        }, this.handleFavoriteButtonClick = function(t, e, i) {
            i.preventDefault();
            var n, o = i.currentTarget;
            o.classList.contains("is-disabled") || (o.classList.contains(s.favorited) ? n = "uiUnfavoriteTweet" : o.classList.contains(s.unfavorited) && (n = "uiFavoriteTweet"), n && this.trigger(n, {
                tweetId: t,
                accountKey: e
            }))
        }
    }
}), define("ui/favorite_from_options", ["require", "flight/lib/component", "ui/with_template", "ui/modal/with_modal", "ui/with_favorite_button"], function(t) {
    function e() {
        this.defaultAttrs({
            tweet: null,
            closeEvent: "uiFavoriteFromOptionsClose",
            modalTitleSelector: ".js-header-title",
            modalContentSelector: ".js-mdl-content"
        }), this.after("initialize", function() {
            this._renderDialog(), this.on(this.attr.closeEvent, this.teardown)
        }), this.after("teardown", function() {
            this.$node.html("")
        }), this._renderDialog = function() {
            var t = TD.storage.accountController.getAccountsForService("twitter");
            this.render("favorite_from_options", {
                no_horiz_flow_container: !0,
                accounts: t,
                tweet: this.attr.tweet
            }), this.attachFavoriteButtons(this.select("modalContentSelector")), this.select("modalTitleSelector").html(TD.i("Favorite this Tweet"))
        }
    }
    var i = t("flight/lib/component"),
        s = t("ui/with_template"),
        n = t("ui/modal/with_modal"),
        o = t("ui/with_favorite_button");
    return i(e, s, n, o)
}), define("ui/modal/with_show_modal", ["require"], function() {
    function t() {
        this.showModal = function(t, i, s) {
            if (!t || "function" != typeof t || "function" != typeof t.attachTo) throw new TypeError("Component must be a constructor and have an attachTo method.");
            if ("LOCAL" === TD.buildID && !e.test(t.toString())) throw new TypeError("Component passed to showModal must mixin withModalable.");
            i = i || {}, i.isModal = !0, s = _.defaults(s || {}, {
                id: _.uniqueId("modal")
            }), this.boundHandleModalContext = this.handleModalContext.bind(this, t, i, s), this.on(document, "uiModalContext", this.boundHandleModalContext), this.trigger("uiNeedsModalContext", s)
        }, this.handleModalContext = function(t, e, i, s, n) {
            n.id === i.id && (this.off(document, "uiModalContext", this.boundHandleModalContext), t.attachTo(n.$node, e))
        }
    }
    var e = /withModalable/;
    return t
}), define("ui/with_dialog_manager", ["require", "flight/lib/compose", "ui/embed_tweet", "ui/keyboard_shortcut_list", "ui/twitter_profile", "ui/report_message_options", "ui/report_tweet_options", "ui/account_shared_warning", "ui/follow_from_options", "ui/favorite_from_options", "ui/modal/with_show_modal"], function(t) {
    var e = t("flight/lib/compose"),
        i = t("ui/embed_tweet"),
        s = t("ui/keyboard_shortcut_list"),
        n = t("ui/twitter_profile"),
        o = t("ui/report_message_options"),
        r = t("ui/report_tweet_options"),
        a = t("ui/account_shared_warning"),
        c = t("ui/follow_from_options"),
        h = t("ui/favorite_from_options"),
        l = t("ui/modal/with_show_modal");
    return function() {
        e.mixin(this, [l]), this.showDialogDecorator = function(t) {
            return function(e, i) {
                var s = this.select("modal");
                t.call(this, s, i), s.show()
            }.bind(this)
        }, this.showAddColumn = function() {
            TD.ui.openColumn.showOpenColumn()
        }, this.showProfile = function(t, e) {
            this.showModal(n, {
                screenName: e.id
            }, {
                withHeader: !1,
                withFooter: !1,
                withChrome: !1,
                withDismissButton: !1,
                withClasses: ["prf", "s-tall-fixed", "s-profile", "is-inverted-dark"],
                withBorder: !1
            })
        }, this.showEmbedTweet = function(t, e) {
            i.attachTo(t, {
                tweet: e.tweet
            })
        }, this.showKeyboardShortcutList = function(t) {
            s.attachTo(t)
        }, this.showReportTweetOptions = function(t, e) {
            e.isMessage ? o.attachTo(t, {
                account: e.account,
                twitterUser: e.twitterUser,
                tweetId: e.tweetId
            }) : r.attachTo(t, {
                account: e.account,
                twitterUser: e.twitterUser,
                tweetId: e.tweetId
            })
        }, this.showFollowFromOptions = function(t, e) {
            c.attachTo(t, {
                userToFollow: e.userToFollow
            })
        }, this.showFavoriteFromOptions = function(t, e) {
            h.attachTo(t, {
                tweet: e.tweet
            })
        }, this.showAccountSharedWarning = function(t) {
            a.attachTo(t)
        }, this.showImportColumn = function(t, e) {
            var i;
            try {
                i = TD.core.base64.decode(e.columnState)
            } catch (s) {
                console.warn("Column state deserialization failed:", s)
            }
            i && TD.ui.openColumn.showImportSharedColumn(i)
        }, this.showGlobalSettings = function() {
            new TD.components.GlobalSettings
        }, this.showAccountSettings = function() {
            if (!TD.config.account_settings_drawer) {
                var t = new TD.components.GlobalSettings;
                t.switchTab("accounts")
            }
        }, this.after("initialize", function() {
            this.on(document, "uiShowProfile", this.showProfile), this.on(document, "uiShowImportColumnDialog", this.showImportColumn), this.on(document, "uiShowAddColumn", this.showAddColumn), this.on(document, "uiShowGlobalSettings", this.showGlobalSettings), this.on(document, "uiShowAccountSettings", this.showAccountSettings), this.on(document, "uiShowEmbedTweet", this.showDialogDecorator(this.showEmbedTweet)), this.on(document, "uiShowKeyboardShortcutList", this.showDialogDecorator(this.showKeyboardShortcutList)), this.on(document, "uiShowReportTweetOptions", this.showDialogDecorator(this.showReportTweetOptions)), this.on(document, "uiShowAccountSharedWarning", this.showDialogDecorator(this.showAccountSharedWarning)), this.on(document, "uiShowFollowFromOptions", this.showDialogDecorator(this.showFollowFromOptions)), this.on(document, "uiShowFavoriteFromOptions", this.showDialogDecorator(this.showFavoriteFromOptions))
        })
    }
}), define("ui/message_banner/with_access_denied_message_banner", [], function() {
    var t = function() {
        this.getReauthorizeAccountMessageData = function(t) {
            return {
                id: "expired-token-error",
                text: TD.i("TweetDeck no longer has permission to access account @{{1}}.", {
                    1: t.account.getUsername()
                }),
                colors: {
                    background: "#b2d5ed",
                    foreground: "#555"
                },
                actions: [{
                    id: "yes-button",
                    action: "trigger-event",
                    label: TD.i("Reauthorize account"),
                    event: {
                        type: "uiAccountAction",
                        data: {
                            action: "reauthorize",
                            accountKey: t.account.getKey()
                        }
                    }
                }, {
                    id: "no-button",
                    action: "trigger-event",
                    label: TD.i("It's fine "),
                    "class": "btn-alt",
                    event: {
                        type: "uiAccountAction",
                        data: {
                            action: "remove",
                            accountKey: t.account.getKey()
                        }
                    }
                }]
            }
        }
    };
    return t
}), define("ui/message_banner/with_login_account_access_denied_message_banner", [], function() {
    var t = function() {
        this.getLoginAccountAccessDeniedMessageData = function(t) {
            return {
                id: "expired-login-error",
                text: TD.i("TweetDeck no longer has permission to access yourmain login account @{{1}}.", {
                    1: t.account.getUsername()
                }) + TD.i("You will be logged out in 5 seconds to prevent unauthorized access."),
                colors: {
                    background: "#b2d5ed",
                    foreground: "#555"
                }
            }
        }
    };
    return t
}), define("ui/message_banner/with_account_suspended_message_banner", [], function() {
    var t = function() {
        this.getAccountSuspendedMessageData = function(t) {
            return {
                id: "expired-token-error",
                text: TD.i("Your account @{{1}} is currently suspended.", {
                    1: t.account.getUsername()
                }),
                colors: {
                    background: "#b2d5ed",
                    foreground: "#555"
                },
                actions: [{
                    id: "yes-button",
                    action: "url-ext",
                    label: TD.i("Visit Suspended Accounts Help page"),
                    url: "https://twitter.com/account/suspended_help"
                }]
            }
        }
    };
    return t
}), define("ui/message_banner/with_facebook_removed_message_banner", [], function() {
    var t = function() {
        this.getFacebookRemovedMessageData = function() {
            return {
                id: "facebook-account-removed2",
                text: TD.i("We've removed Facebook integration from TweetDeck"),
                colors: {
                    background: "#b2d5ed",
                    foreground: "#555"
                },
                actions: [{
                    id: "read_more-button",
                    action: "url-ext",
                    label: TD.i("Read More"),
                    url: "http://www.tweetdeck.com/an-update-on-tweetdeck"
                }]
            }
        }
    };
    return t
}), define("ui/message_banner_container", ["flight/lib/component", "ui/with_transitions", "ui/message_banner/with_access_denied_message_banner", "ui/message_banner/with_login_account_access_denied_message_banner", "ui/message_banner/with_account_suspended_message_banner", "ui/message_banner/with_facebook_removed_message_banner"], function(t, e, i, s, n, o) {
    var r = function() {
        this.defaultAttrs({
            messageSelector: ".js-message-banner",
            applicationSelector: ".js-app",
            isAnimatingClass: "is-application-animating"
        }), this._onHidden = function() {
            this.trigger("uiMessageBannerContainerHidden")
        }, this.showAccessDeniedMessage = function(t, e) {
            var i;
            i = e.isLoginAccount ? this.getLoginAccountAccessDeniedMessageData(e) : this.getReauthorizeAccountMessageData(e), $(document).trigger("dataMessage", {
                message: i
            })
        }, this.showAccountSuspendedMessage = function(t, e) {
            var i = this.getAccountSuspendedMessageData(e);
            $(document).trigger("dataMessage", {
                message: i
            })
        }, this.showFacebookRemovedMessage = function(t, e) {
            var i = this.getFacebookRemovedMessageData(e);
            $(document).trigger("dataMessage", {
                message: i
            })
        }, this.handleMessageBannerResize = function() {
            this.transitionTop(this.$application, this.attr.isAnimatingClass, this.$message.outerHeight())
        }, this.handleHideMessageBannerContainer = function() {
            this.transitionTop(this.$application, this.attr.isAnimatingClass, 0, this._boundOnHiddenFn)
        }, this.after("initialize", function() {
            this.$application = this.select("applicationSelector"), this.$message = this.select("messageSelector"), this._boundOnHiddenFn = this._onHidden.bind(this), this.on(document, "uiHidingMessageBanner", this.handleHideMessageBannerContainer), this.on(document, "uiMessageBannerShown", this.handleMessageBannerResize), this.on(document, "uiMessageBannerResized", this.handleMessageBannerResize), this.on(document, "dataTwitterAccountAccessDenied", this.showAccessDeniedMessage), this.on(document, "dataTwitterAccountSuspended", this.showAccountSuspendedMessage), this.on(document, "dataFacebookAccountRemoved", this.showFacebookRemovedMessage)
        })
    };
    return t(r, e, i, s, n, o)
}), define("ui/image_upload", ["flight/lib/component"], function(t) {
    var e = function() {
        this.defaultAttrs({
            ALLOWED_IMAGE_TYPES: ["jpg", "jpeg", "gif", "png"],
            MAX_ALLOWED_FILES: 1,
            MAX_ALLOWED_SIZE: 3145728,
            errors: {
                TOO_MANY_FILES_ERROR: "tooManyFilesError",
                MAX_FILES_ALREADY_ADDED_ERROR: "alreadyAddedFileError",
                INCORRECT_FILETYPE_ERROR: "incorrectFileTypeError",
                INVALID_FILESIZE_ERROR: "invalidFileSizeError"
            },
            states: {
                WAITING: "waiting",
                DRAG_OK: "drag_ok",
                DRAG_ERROR: "drag_error"
            },
            uploadInputTemplate: '<input id="file-upload-input" type="file" class="cmp-file-upload" multiple />',
            uploadInputSelector: "#file-upload-input",
            disabled: !1
        }), this.validateFile = function(t) {
            var e = t.type.split("/")[1],
                i = t.size,
                s = {
                    success: !0
                };
            return this.files.length >= this.attr.MAX_ALLOWED_FILES ? s.error = this.attr.errors.MAX_FILES_ALREADY_ADDED_ERROR : _.include(this.attr.ALLOWED_IMAGE_TYPES, e) ? i > this.attr.MAX_ALLOWED_SIZE && (s.error = this.attr.errors.INVALID_FILESIZE_ERROR) : s.error = this.attr.errors.INCORRECT_FILETYPE_ERROR, s.error && (s.success = !1), s
        }, this.validateFiles = function(t) {
            var e, i = this.validateFileCount(t.length);
            if (!i.success) return i;
            for (var s = 0; s < t.length; s++)
                if (e = this.validateFile(t[s]), !e.success) return e;
            return e
        }, this.validateFileCount = function(t) {
            var e = {
                success: !0
            };
            return t > this.attr.MAX_ALLOWED_FILES ? e.error = this.attr.errors.TOO_MANY_FILES_ERROR : this.files.length > 0 && this.files.length + t > this.attr.MAX_ALLOWED_FILES && (e.error = this.attr.errors.MAX_FILES_ALREADY_ADDED_ERROR), e.error && (e.success = !1), e
        }, this.handleResetImageUpload = function() {
            this.files = []
        }, this.addFilesToUpload = function(t) {
            var e;
            if (t) {
                if (e = this.validateFiles(t), !e.success) switch (e.error) {
                    case this.attr.errors.TOO_MANY_FILES_ERROR:
                        return TD.controller.progressIndicator.addMessage(TD.i("Only one file can be attached to a tweet.")), void 0;
                    case this.attr.errors.MAX_FILES_ALREADY_ADDED_ERROR:
                        return TD.controller.progressIndicator.addMessage(TD.i("You have already attached an image.")), void 0;
                    case this.attr.errors.INCORRECT_FILETYPE_ERROR:
                        return TD.controller.progressIndicator.addMessage(TD.i("You did not select an image.")), void 0;
                    case this.attr.errors.INVALID_FILESIZE_ERROR:
                        return TD.controller.progressIndicator.addMessage(TD.i("The file you selected is greater than the 3MB limit.")), void 0
                }
                this.trigger("uiFilesAdded", {
                    files: t
                }), this.files = _.zip(this.files, t)
            }
        }, this.handleDragEnterEvent = function(t) {
            if (this.currentDragElement) return this.currentDragElement = t.target, void 0;
            if (this.currentDragElement = t.target, this.state = this.attr.states.DRAG_OK, t.originalEvent.dataTransfer.items) {
                t.preventDefault();
                var e, i, s = t.originalEvent.dataTransfer.items,
                    n = this.validateFileCount(s.length);
                if (n.success) {
                    for (var o = 0; o < s.length; o++)
                        if (e = s[o], "file" === e.kind && (i = this.validateFile(e), !i.success)) return this.state = this.attr.states.DRAG_ERROR, this.trigger("uiShowDropMessage", {
                            errorCondition: i.error
                        }), void 0;
                    this.trigger("uiShowDropMessage")
                } else this.state = this.attr.states.DRAG_ERROR, this.trigger("uiShowDropMessage", {
                    errorCondition: n.error
                })
            }
        }, this.handleDragLeaveEvent = function(t) {
            this.currentDragElement === t.target && (this.currentDragElement = null, this.state = this.attr.states.WAITING, this.trigger("uiHideDropMessage"))
        }, this.handleDropEvent = function(t) {
            if (t.preventDefault(), this.state === this.attr.states.DRAG_OK) {
                var e = t.originalEvent.dataTransfer.files;
                this.addFilesToUpload(e)
            }
            this.trigger("uiHideDropMessage"), this.state = this.attr.states.WAITING, this.currentDragElement = null
        }, this.cancel = function(t) {
            return t.preventDefault(), !1
        }, this.handleComposeAddImageClick = function() {
            $(this.attr.uploadInputSelector).click()
        }, this.handleFileUploadChange = function(t) {
            this.addFilesToUpload(t.target.files), $(this.attr.uploadInputSelector).remove(), $("body").append(this.attr.uploadInputTemplate)
        }, this.whenEnabled = function(t) {
            return function() {
                return this.attr.disabled ? void 0 : t.apply(this, [].slice.call(arguments))
            }
        }, this.disable = function() {
            this.attr.disabled = !0
        }, this.enable = function() {
            this.attr.disabled = !1
        }, this.after("initialize", function() {
            this.files = [], $("body").append(this.attr.uploadInputTemplate), this.on(document, "uiResetImageUpload", this.handleResetImageUpload), this.on(document, "uiComposeAddImageClick", this.handleComposeAddImageClick), this.on(document, "dragstart", this.disable), this.on(document, "dragend", this.enable), this.on(document, "dragenter", this.whenEnabled(this.handleDragEnterEvent)), this.on(document, "dragleave", this.whenEnabled(this.handleDragLeaveEvent)), this.on(document, "drop", this.whenEnabled(this.handleDropEvent)), this.on(document, "dragover", this.whenEnabled(this.cancel)), this.on(document, "change", {
                uploadInputSelector: this.handleFileUploadChange
            })
        })
    };
    return t(e)
}), define("ui/login/two_factor", ["require", "flight/lib/component", "ui/with_template", "ui/modal/with_modalable", "ui/with_api_errors", "ui/with_spinner_button"], function(t) {
    function e() {
        this.defaultAttrs({
            withCode: !1,
            templateWithCode: "login/2fa_verification_code",
            template: "login/2fa_verification",
            codeFormSelector: ".js-twogin-2fa-code-form",
            codeSelector: ".js-twogin-2fa-code",
            errorSelector: ".js-login-error",
            errorMessageSelector: ".js-login-error-message",
            dismissSelector: ".js-dismiss"
        }), this.after("initialize", function() {
            this.on(document, "dataLoginError dataLoginAuthSuccess", this.teardown), this.on(document, "dataLogin2FAError", this.handle2FAError), this.on("click", {
                dismissSelector: this.handleCancelledTwoFactor
            }), this.trigger("uiTwoFactorShowing", {
                withCode: this.attr.withCode
            }), this.on("submit", {
                codeFormSelector: this.handle2FACodeForm
            });
            var t = this.attr.withCode ? "templateWithCode" : "template";
            this.render(this.attr[t])
        }), this.handle2FACodeForm = function(t) {
            t.preventDefault();
            var e = this.select("codeSelector").val();
            e ? (this.spinnerButtonEnable(), this.trigger("uiLogin2FACode", {
                code: e
            })) : this.showErrorMessage(TD.i("Fill the code in"))
        }, this.handle2FAError = function(t, e) {
            this.spinnerButtonDisable(), this.showErrorMessage(this.getXAuthErrorMessage(e.code))
        }, this.showErrorMessage = function(t) {
            this.select("errorMessageSelector").text(t), this.select("errorSelector").removeClass("is-hidden")
        }, this.handleCancelledTwoFactor = function() {
            this.trigger("uiLogin2FACancel"), this.teardown()
        }
    }
    var i = t("flight/lib/component"),
        s = t("ui/with_template"),
        n = t("ui/modal/with_modalable"),
        o = t("ui/with_api_errors"),
        r = t("ui/with_spinner_button");
    return i(e, s, n, o, r)
}), define("ui/login/with_login_form", ["require", "flight/lib/compose", "ui/with_spinner_button", "util/with_teardown", "ui/with_api_errors", "ui/modal/with_show_modal", "ui/login/two_factor"], function(t) {
    var e = t("flight/lib/compose"),
        i = t("ui/with_spinner_button"),
        s = t("util/with_teardown"),
        n = t("ui/with_api_errors"),
        o = t("ui/modal/with_show_modal"),
        r = t("ui/login/two_factor");
    return function() {
        e.mixin(this, [i, s, n, o]), this.defaultAttrs({
            staySignedIn: !0,
            userFormSelector: ".js-login-form",
            successSelector: ".js-login-success",
            successMessageSelector: ".js-login-success-message",
            errorSelector: ".js-login-error",
            errorMessageSelector: ".js-login-error-message",
            usernameSelector: ".js-login-username",
            passwordSelector: ".js-login-password",
            staySignedInSelector: ".js-login-stay-signed-in",
            toggleLoginTypeSelector: ".js-toggle-login-type",
            externalLinkSelector: 'a[target="_blank"]',
            forgotPasswordSelector: ".js-login-forgot-password",
            withToggleLoginType: !0,
            withForgotPassword: !0,
            withRememberMe: !0,
            twoFactorModalConfig: {
                withDismissButton: !1,
                withDraggable: !1,
                withDragHandle: !1,
                withClickTrap: !1,
                withHeader: !1,
                withFooter: !1,
                withChrome: !1,
                withBorder: !1
            }
        }), this.after("initialize", function() {
            this.trigger("uiLoginFormShowing"), this.username = null, this.password = null, this.verificationRequestId = null, this.verificationUserId = null, this.on(document, "uiLoginFormShowing", this.teardown), this.on(document, "dataLoginAuthSuccess", this.handleLoginAuthSuccess), this.on(document, "dataLoginError", this.loginFormHandleLoginError), this.on(document, "dataLoginServerError", this.loginFormHandleLoginServerError), this.on(document, "dataLoginTwoFactorCodeRequired", this.handleLoginTwoFactorCode), this.on(document, "dataLoginTwoFactorAwaitingConfirmation", this.handleLoginTwoFactorAwaiting), this.on(document, "dataLogin2FATimeout", this.handleLogin2FATimeout), this.on(document, "uiLogin2FACode", this.handleLogin2FACode), this.on(document, "uiLogin2FACancel", this.handleLogin2FACancel), this.on(document, "uiLoginRequest", this.loginFormToggleFormDisabled.bind(this, !0)), this.on(document, "dataLoginError dataLoginServerError", this.loginFormToggleFormDisabled.bind(this, !1)), this.on(document, "dataForgotPasswordSuccess", this.handleForgotPasswordSuccess), this.on(document, "dataForgotPasswordError", this.handleForgotPasswordError), this.on("click", {
                staySignedInSelector: this.handleStaySignedInClick,
                toggleLoginTypeSelector: this.loginFormHandleToggleLoginType,
                externalLinkSelector: this.openExternalLink,
                forgotPasswordSelector: function() {
                    this.trigger("uiForgotPassword")
                }.bind(this)
            }), this.on("submit", {
                userFormSelector: this.loginFormHandleFormSubmit
            }), this.setupLoginForm()
        }), this.before("teardown", function() {
            this.loginFormToggleFormDisabled(!0, {
                disableSpinner: !0
            })
        }), this.handleLoginAuthSuccess = function(t, e) {
            this.trigger("uiLoginAuthComplete", e)
        }, this.setupLoginForm = function() {
            this.select("staySignedInSelector").prop("checked", this.attr.staySignedIn), setTimeout(function() {
                this.select("usernameSelector").focus()
            }.bind(this), 0);
            var t = !1;
            this.attr.loginFormDisabled && (t = !0), this.loginFormToggleFormDisabled(t), this.attr.errorMsg && this.loginFormShowErrorMessage(this.attr.errorMsg)
        }, this.loginFormHandleToggleLoginType = function(t) {
            t.preventDefault(), this.trigger("uiLoginToggleType", {
                staySignedIn: this.getStaySignedIn()
            })
        }, this.loginFormToggleFormDisabled = function(t, e) {
            e = e || {}, this.select("userFormSelector").find("fieldset, button").prop("disabled", t), t && !e.disableSpinner ? this.spinnerButtonEnable() : this.spinnerButtonDisable()
        }, this.loginFormShowErrorMessage = function(t) {
            this.loginFormToggleFormDisabled(!1), this.select("successSelector").addClass("is-hidden"), this.select("errorMessageSelector").html(t), this.select("errorSelector").removeClass("is-hidden"), this.select("passwordSelector").select()
        }, this.loginFormShowSuccessMessage = function(t) {
            this.select("errorSelector").addClass("is-hidden"), this.select("successMessageSelector").html(t), this.select("successSelector").removeClass("is-hidden")
        }, this.loginFormHideMessages = function() {
            this.select("errorSelector").addClass("is-hidden"), this.select("successSelector").addClass("is-hidden")
        }, this.loginFormHandleLoginError = function(t, e) {
            var i;
            i = e && e.isXAuth ? this.getXAuthErrorMessage(e.code) : TD.i("We could not sign you in with this username and password."), this.loginFormShowErrorMessage(i)
        }, this.loginFormHandleLoginServerError = function() {
            this.loginFormShowErrorMessage(this.getXAuthErrorMessage())
        }, this.handleLogin2FATimeout = function() {
            this.loginFormShowErrorMessage(TD.i("The login verification request sent to your phone went unanswered."))
        }, this.handleLoginTwoFactorCode = function(t, e) {
            this.verificationRequestId = e.xAuth.login_verification_request_id, this.verificationUserId = e.xAuth.login_verification_user_id, this.staySignedIn = e.staySignedIn, this.username = e.username, this.password = e.password, this.request2FA({
                withCode: !0
            })
        }, this.handleLoginTwoFactorAwaiting = function() {
            this.request2FA()
        }, this.handleLogin2FACode = function(t, e) {
            this.trigger("uiLogin2FARequest", {
                username: this.username,
                password: this.password,
                code: e.code,
                requestId: this.verificationRequestId,
                userId: this.verificationUserId,
                staySignedIn: this.staySignedIn
            })
        }, this.handleLogin2FACancel = function() {
            this.loginFormShowErrorMessage(TD.i("You have cancelled login verification."))
        }, this.request2FA = function(t) {
            this.showModal(r, t || {}, this.attr.twoFactorModalConfig)
        }, this.handleForgotPasswordSuccess = function(t, e) {
            this.loginFormShowSuccessMessage(TD.i("We have sent an email to {{email}} with instructions to reset your password.", e))
        }, this.handleForgotPasswordError = function(t, e) {
            this.loginFormShowErrorMessage(TD.i("We could not find a TweetDeck account associated with {{email}}.", e))
        }, this.handleStaySignedInClick = function(t, e) {
            this.trigger("uiLoginToggleStaySignedIn", {
                staySignedIn: $(e.el).prop("checked")
            })
        }, this.loginFormHandleFormSubmit = function(t) {
            t.preventDefault();
            var e = this.getLoginFormData();
            e.username && e.password ? (this.loginFormHideMessages(), this.trigger("uiLoginRequest", e)) : this.loginFormShowErrorMessage(TD.i("Username and password must be filled in."))
        }, this.getLoginFormData = function() {
            return {
                authType: this.attr.authType,
                username: this.select("usernameSelector").val(),
                password: this.select("passwordSelector").val(),
                staySignedIn: this.getStaySignedIn()
            }
        }, this.getStaySignedIn = function() {
            return this.select("staySignedInSelector").prop("checked")
        }
    }
}), define("ui/login/twitter_account_login_form", ["require", "flight/lib/component", "ui/login/with_login_form"], function(t) {
    function e() {
        this.defaultAttrs({
            authType: "twitter",
            passwordResetUrl: "https://mobile.twitter.com/account/resend_password"
        }), this.after("initialize", function() {
            this.on("uiForgotPassword", this.handleForgotPassword)
        }), this.handleForgotPassword = function() {
            window.open(this.attr.passwordResetUrl, null, "width=320,height=500")
        }
    }
    var i = t("flight/lib/component"),
        s = t("ui/login/with_login_form");
    return i(e, s)
}), define("ui/login/tweetdeck_account_login_form", ["require", "flight/lib/component", "ui/login/with_login_form"], function(t) {
    function e() {
        this.defaultAttrs({
            authType: "tweetdeck"
        }), this.after("initialize", function() {
            this.on("uiForgotPassword", this.handleForgotPassword)
        }), this.handleForgotPassword = function() {
            var t = this.select("usernameSelector").val();
            t ? this.trigger("uiTweetDeckForgotPasswordRequest", {
                email: t
            }) : this.loginFormShowErrorMessage(TD.i("Please enter your email address."))
        }
    }
    var i = t("flight/lib/component"),
        s = t("ui/login/with_login_form");
    return i(e, s)
}), define("ui/login/general_login", ["require", "flight/lib/component", "util/with_teardown", "ui/with_template", "ui/login/twitter_account_login_form", "ui/login/tweetdeck_account_login_form"], function(t) {
    function e() {
        this.defaultAttrs({
            formIsRendered: !1,
            staySignedIn: !0,
            authType: "twitter",
            errorMsg: "",
            uid: "",
            withToggleLoginType: !0,
            withForgotPassword: !0,
            withRememberMe: !0,
            headerSelector: ".js-header-container",
            layoutTemplate: "login/login_form",
            loginContainerSelector: ".js-signin-ui",
            loginFormSelector: "form[data-auth-type]",
            signUpLinkSelector: ".js-twitter-signup"
        }), this.after("initialize", function() {
            this.on(document, "uiLoginToggleType", this.handleLoginToggleType), this.on(document, "uiLoginToggleStaySignedIn", this.handleLoginToggleStaySignedIn), this.on(document, "dataMigrateAccountLockStatus", this.handleAccountMigrateLockStatus), this.on("click", {
                signUpLinkSelector: this.handleTwitterSignUpClick
            }), this.renderLayout(), "tweetdeck" === this.attr.authType && this.attr.uid ? this.trigger("uiNeedsMigrateLockStatus", {
                email: this.attr.uid
            }) : this.initialRender()
        }), this.initialRender = function() {
            this.attr.formIsRendered || (this.attr.formIsRendered = !0, this.displayLoginForm())
        }, this.renderLayout = function() {
            this.render(this.attr.layoutTemplate, {
                resolution: TD.util.isRetina() ? "2x" : "1x"
            })
        }, this.handleTwitterSignUpClick = function() {
            this.trigger("uiLoginToggleType", {
                authType: "twitter"
            })
        }, this.handleAccountMigrateLockStatus = function(t, e) {
            this.initialRender(), e.isLocked && (this.attr.tweetdeckLoginUsername = "", this.trigger("uiLoginToggleType", {
                authType: "twitter"
            }), this.showLockedAccountWarning(e.email))
        }, this.showLockedAccountWarning = function(t) {
            this.select("headerSelector").html(this.toHtml("login/locked_account_warning", {
                email: t
            })).removeClass("is-hidden")
        }, this.handleLoginToggleType = function(t, e) {
            var i = this.getCurrentAuthType();
            e.authType || (e.authType = "twitter" === i ? "tweetdeck" : "twitter"), e.authType !== i && (["authType", "errorMsg", "uid"].forEach(function(t) {
                this.attr[t] = e[t]
            }.bind(this)), this.displayLoginForm())
        }, this.displayLoginForm = function() {
            this.attr.formIsRendered = !0, TD.storage.store.setCurrentAuthType(this.attr.authType);
            var t = this.select("loginContainerSelector").empty();
            this.select("headerSelector").empty().addClass("is-hidden");
            var e, i;
            "twitter" === this.attr.authType ? (e = "login/twitter_account_login_form", i = o) : (e = "login/tweetdeck_account_login_form", i = r), t.html(this.toHtml(e, {
                withToggleLoginType: this.attr.withToggleLoginType,
                withForgotPassword: this.attr.withForgotPassword,
                withRememberMe: this.attr.withRememberMe,
                tweetdeckLoginUsername: "tweetdeck" === this.attr.authType ? this.attr.uid : ""
            })), this.attachChild(i, t, {
                authType: this.attr.authType,
                staySignedIn: this.attr.staySignedIn,
                errorMsg: this.attr.errorMsg
            })
        }, this.getCurrentAuthType = function() {
            return this.select("loginFormSelector").attr("data-auth-type")
        }, this.handleLoginToggleStaySignedIn = function(t, e) {
            this.attr.staySignedIn = !! e.staySignedIn, TD.storage.store.setStaySignedIn(this.attr.staySignedIn)
        }
    }
    var i = t("flight/lib/component"),
        s = t("util/with_teardown"),
        n = t("ui/with_template"),
        o = t("ui/login/twitter_account_login_form"),
        r = t("ui/login/tweetdeck_account_login_form");
    return i(e, s, n)
}), define("util/wait_at_least", [], function() {
    function t(t, e, i, s) {
        var n = Date.now() - e;
        return setTimeout(i.bind(s), n > t ? 0 : t - n)
    }
    return t
}), define("ui/login/migrate_tweetdeck_account_preview", ["require", "flight/lib/component", "ui/with_template", "util/with_teardown", "util/wait_at_least"], function(t) {
    function e() {
        this.defaultAttrs({
            template: "login/migrate_tweetdeck_account_preview",
            errorTemplate: "login/migrate_tweetdeck_account_preview_error",
            badPasswordTemplate: "login/migrate_tweetdeck_account_preview_bad_password",
            minWaitTime: 1e3,
            withNumericData: !0
        }), this.after("initialize", function() {
            this.on(document, "dataMigrateTweetDeckAccountPreviewSuccess", this.handleMigrateTweetDeckAccountPreviewSuccess), this.on(document, "dataMigrateTweetDeckAccountPreviewError", this.handleMigrateTweetDeckAccountPreviewError), this.on(document, "dataMigrateData", _.once(this.handleMigrateData)), this.trigger("uiNeedsMigrateData")
        }), this.handleMigrateData = function(t, e) {
            this.attr.migrate = _.extend({}, this.attr.migrate, e), this.needsPreviewTimestamp = Date.now(), this.trigger("uiNeedsMigratePreviewData", this.attr.migrate)
        }, this.handleMigrateTweetDeckAccountPreviewSuccess = function(t, e) {
            this.attr.preview = _.extend({}, this.attr.preview, {
                accounts: e.accounts.map(function(t) {
                    return t.screenName = t.screen_name, t.isVerified = t.verified, t
                }),
                numAccounts: e.accounts.length,
                numColumns: e.num_columns,
                numScheduled: e.num_scheduled
            }), o(this.attr.minWaitTime, this.needsPreviewTimestamp, this.renderPreview, this)
        }, this.handleMigrateTweetDeckAccountPreviewError = function(t, e) {
            o(this.attr.minWaitTime, this.needsPreviewTimestamp, this.renderPreviewError.bind(this, e))
        }, this.renderPreview = function() {
            this.trigger("uiMigratePreviewSuccess"), this.render(this.attr.template, {
                withNumericData: this.attr.withNumericData,
                accounts: this.attr.preview.accounts,
                numAccounts: this.attr.preview.accounts.length,
                numColumns: this.attr.preview.numColumns,
                numScheduled: this.attr.preview.numScheduled
            })
        }, this.renderPreviewError = function(t) {
            var e;
            this.trigger("uiMigratePreviewError", t), e = 401 === t.req.status ? this.attr.badPasswordTemplate : this.attr.errorTemplate, this.render(e)
        }
    }
    var i = t("flight/lib/component"),
        s = t("ui/with_template"),
        n = t("util/with_teardown"),
        o = t("util/wait_at_least");
    return i(e, s, n)
}), define("ui/login/migrate_tweetdeck_account_warning", ["require", "flight/lib/component", "ui/with_template", "util/with_teardown"], function(t) {
    function e() {
        this.defaultAttrs({
            template: "login/migrate_tweetdeck_account_warning",
            errorTemplate: "login/migrate_tweetdeck_account_warning_error",
            migrateContinueSelector: ".js-migrate-continue",
            migrateCancelSelector: ".js-migrate-cancel"
        }), this.after("initialize", function() {
            this.on("click", {
                migrateContinueSelector: this.handleMigrateContinue,
                migrateCancelSelector: this.handleMigrateCancel
            }), this.on(document, "dataMigrateTweetDeckAccountPreviewSuccess", this.handleMigrateTweetDeckAccountPreviewSuccess), this.on(document, "dataMigrateTweetDeckAccountPreviewError", this.handleMigrateTweetDeckAccountPreviewError), this.on(document, "dataMigrateData", _.once(this.handleMigrateData)), this.trigger("uiNeedsMigrateData")
        }), this.handleMigrateData = function(t, e) {
            this.attr.migrate = _.extend({}, this.attr.migrate, e), this.trigger("uiNeedsMigratePreviewData", this.attr.migrate)
        }, this.handleMigrateTweetDeckAccountPreviewSuccess = function(t, e) {
            this.trigger("uiMigratePreviewSuccess");
            var i = TD.storage.accountController.getAccountFromId(this.attr.migrate.uid),
                s = TD.storage.accountController.getAccountsForService("twitter"),
                n = e.accounts,
                o = this.buildImportData(i, s, n, {
                    dedupeExisting: !1,
                    dedupeSignIn: !0
                }),
                r = o.newProfiles.length > 0,
                a = o.existingProfiles.length > 0,
                c = "single" === this.attr.migrate.accountType;
            this.render(this.attr.template, {
                twitterProfile: o.twitterProfile,
                newProfiles: o.newProfiles,
                showNewProfiles: r,
                existingProfiles: o.existingProfiles,
                showExistingProfiles: a,
                isSingleUser: c
            })
        }, this.handleMigrateTweetDeckAccountPreviewError = function(t, e) {
            this.trigger("uiMigratePreviewError", e), this.render(this.attr.errorTemplate)
        }, this.handleMigrateContinue = function() {
            this.trigger("uiMigrateContinue")
        }, this.handleMigrateCancel = function() {
            this.trigger("uiMigrateCancel", {})
        }, this.buildImportData = function(t, e, i, s) {
            var n = this.extractProfileFromStoredAccount(t),
                o = [],
                r = e.reduce(function(t, e) {
                    var i = this.extractProfileFromStoredAccount(e);
                    return i.id !== n.id && (t.push(i), o.push(i.id)), t
                }.bind(this), []),
                a = i.reduce(function(t, e) {
                    var i = o.indexOf(e.uid) > -1 && s.dedupeExisting,
                        r = e.uid === n.id && s.dedupeSignIn;
                    return !i && !r && t.push(this.extractProfileFromPreviewAccount(e)), t
                }.bind(this), []);
            return {
                twitterProfile: n,
                existingProfiles: r,
                newProfiles: a
            }
        }, this.extractProfileFromStoredAccount = function(t) {
            return {
                id: t.getUserID(),
                screenName: t.getUsername(),
                name: t.getName(),
                profileImageURL: t.getProfileImageURL(),
                isVerified: !1
            }
        }, this.extractProfileFromPreviewAccount = function(t) {
            return {
                id: t.uid,
                screenName: t.screen_name,
                name: t.name,
                profileImageURL: t.avatar,
                isVerified: t.verified
            }
        }
    }
    var i = t("flight/lib/component"),
        s = t("ui/with_template"),
        n = t("util/with_teardown");
    return i(e, s, n)
}), define("ui/login/migrate_account_login", ["require", "flight/lib/component", "ui/with_template", "util/with_teardown", "ui/login/twitter_account_login_form", "ui/login/tweetdeck_account_login_form", "ui/login/migrate_tweetdeck_account_preview", "ui/login/migrate_tweetdeck_account_warning"], function(t) {
    function e() {
        this.defaultAttrs({
            layoutTemplate: "login/migrate_account_login",
            migrateTwitterFormSelector: ".js-migrate-twitter-form",
            migrateTweetdeckFormSelector: ".js-migrate-tweetdeck-form",
            migrateTweetdeckAccountPreviewSelector: ".js-migrate-tweetdeck-account-preview",
            migrateTweetdeckAccountPreviewContentSelector: ".js-migrate-tweetdeck-account-preview-content",
            migrateTweetdeckAccountWarningSelector: ".js-migrate-tweetdeck-account-warning",
            migrateAccountLoginFormsCancelSelector: ".js-migrate-account-login-forms-cancel",
            migrateAccountLoginFormsRestartSelector: ".js-migrate-account-login-forms-restart",
            migrateAccountStepClassPrefix: "migrate-account-login-step-",
            migrateArrowSelector: ".migrate-account-login-arrow",
            migrateCancelWrapperSelector: ".migrate-account-login-forms-cancel",
            migrateTweetdeckAccountPreviewLegendSelector: ".js-migrate-tweetdeck-account-preview-legend",
            scribeNamespaceMap: {
                1: "migrate_tweetdeck_login",
                2: "migrate_twitter_login",
                3: "migrate_final_confirmation"
            }
        }), this.after("initialize", function() {
            this.on("uiLoginRequest", this.handleLoginFormSubmit), this.on("uiLoginRequest", {
                migrateTweetdeckFormSelector: this.handleTweetdeckLoginFormSubmit
            }), this.on(document, "dataNeedsMigrateLoginConfirmation", this.handleDataNeedsMigrateTwitterLoginConfirmation), this.on("uiLoginAuthComplete", {
                migrateTwitterFormSelector: this.handleMigrateTwitterLoginAuthComplete
            }), this.on("uiMigrateContinue", {
                migrateTweetdeckAccountWarningSelector: this.handleMigrateWarningContinue
            }), this.on("uiMigrateCancel", {
                migrateTweetdeckAccountWarningSelector: this.handleMigrateWarningCancel
            }), this.on("uiMigratePreviewSuccess", {
                migrateTweetdeckAccountPreviewSelector: this.handleMigratePreviewSuccess,
                migrateTweetdeckAccountWarningSelector: this.setStep.bind(this, 3)
            }), this.on("uiMigratePreviewError", {
                migrateTweetdeckAccountPreviewSelector: this.handleMigratePreviewError,
                migrateTweetdeckAccountWarningSelector: this.handleMigrateWarningPreviewError
            }), this.on("click", {
                migrateAccountLoginFormsCancelSelector: this.migrateLoginFormsCancelClick,
                migrateAccountLoginFormsRestartSelector: this.migrateLoginFormsRestartClick
            }), this.render(this.attr.layoutTemplate, {
                resolution: TD.util.isRetina() ? "2x" : "1x",
                withToggleLoginType: !1,
                withRememberMe: !1,
                withForgotPassword: !0,
                withFixedTweetdeckLoginUsername: !0,
                tweetdeck: {
                    tweetdeckLoginUsername: this.attr.migrate.email,
                    tweetdeckLoginLegend: TD.i("Enter the password for your TweetDeck account"),
                    tweetdeckLoginLegendClasses: "txt-bold padding-vl",
                    loginFormButtonContent: TD.i("Next"),
                    loginFormButtonIcon: "icon-arrow-r"
                },
                twitter: {
                    twitterLoginLegend: TD.i("Choose a Twitter username to sign in with from now on"),
                    twitterLoginLegendClasses: "txt-bold padding-vl",
                    withWarning: !0,
                    withMultiUserWarning: "multiple" === this.attr.migrate.accountType,
                    withSingleUserWarning: "single" === this.attr.migrate.accountType,
                    loginFormButtonContent: TD.i("Next"),
                    loginFormButtonIcon: "icon-arrow-r"
                }
            }), TD.storage.store.setCurrentAuthType("twitter"), o.attachTo(this.select("migrateTwitterFormSelector")), r.attachTo(this.attr.migrateTweetdeckFormSelector, {
                staySignedIn: this.attr.staySignedIn,
                teardownOn: "uiMigratePreviewSuccess"
            }), this.setStep(1), this.attr.migrate && this.attr.migrate.email && this.attr.migrate.passhash && this.tryMigratePreview(this.attr.migrate)
        }), this.handleTweetdeckLoginFormSubmit = function(t, e) {
            t.preventDefault(), t.stopPropagation(), this.tryMigratePreview({
                email: e.username,
                passhash: TD.core.sha1(e.password)
            })
        }, this.tryMigratePreview = function(t) {
            this.trigger("uiMigrateTweetDeckData", t), this.select("migrateTweetdeckFormSelector").addClass("is-hidden"), this.select("migrateTweetdeckAccountPreviewSelector").removeClass("is-hidden"), this.attachChild(a, this.select("migrateTweetdeckAccountPreviewContentSelector"), {
                withNumericData: !0,
                teardownOn: "dataNeedsMigrateLoginConfirmation"
            })
        }, this.handleMigratePreviewSuccess = function() {
            o.attachTo(this.attr.migrateTwitterFormSelector, {
                staySignedIn: this.attr.staySignedIn,
                teardownOn: "dataNeedsMigrateLoginConfirmation"
            }), this.setStep(2)
        }, this.handleMigratePreviewError = function() {
            this.scribeError(), this.select("migrateArrowSelector").addClass("is-hidden"), this.select("migrateCancelWrapperSelector").addClass("is-hidden"), this.select("migrateTweetdeckAccountPreviewLegendSelector").addClass("is-hidden")
        }, this.handleMigrateTwitterLoginAuthComplete = function(t, e) {
            this.trigger("uiMigrateTwitterData", e.data)
        }, this.handleDataNeedsMigrateTwitterLoginConfirmation = function() {
            this.attachChild(c, this.select("migrateTweetdeckAccountWarningSelector"), {
                teardownOn: "uiMigrationLoginConfirmation"
            })
        }, this.handleMigrateWarningPreviewError = function() {
            this.setStep(3), this.scribeError(), this.select("migrateCancelWrapperSelector").addClass("is-hidden")
        }, this.handleLoginFormSubmit = function() {
            this.scribeAction("next")
        }, this.handleMigrateWarningContinue = function(t) {
            t.stopPropagation(), this.trigger("uiMigrationLoginConfirmation"), this.scribeAction("next")
        }, this.handleMigrateWarningCancel = function(t, e) {
            e.clearMigrateData = !1, this.scribeAction("previous")
        }, this.migrateLoginFormsCancelClick = function() {
            TD.storage.store.setCurrentAuthType("tweetdeck"), this.scribeAction("cancel"), this.trigger("uiMigrateCancel", {
                clearMigrateData: !0
            })
        }, this.migrateLoginFormsRestartClick = function() {
            this.trigger("uiMigrateTweetDeckData", {
                passhash: null
            }), this.scribeAction("restart"), window.location.reload()
        }, this.setStep = function(t) {
            this.currentStep && this.$node.removeClass(this.attr.migrateAccountStepClassPrefix + this.currentStep), this.currentStep = t, this.$node.addClass(this.attr.migrateAccountStepClassPrefix + this.currentStep), this.scribeAction("impression")
        }, this.scribeAction = function(t, e) {
            var i = this.attr.scribeNamespaceMap[this.currentStep];
            TD.controller.stats.migrateStartflow(i, t, e)
        }, this.scribeError = function() {
            this.scribeAction("impression", !0)
        }
    }
    var i = t("flight/lib/component"),
        s = t("ui/with_template"),
        n = t("util/with_teardown"),
        o = t("ui/login/twitter_account_login_form"),
        r = t("ui/login/tweetdeck_account_login_form"),
        a = t("ui/login/migrate_tweetdeck_account_preview"),
        c = t("ui/login/migrate_tweetdeck_account_warning");
    return i(e, n, s)
}), define("ui/login/startflow", ["require", "flight/lib/component", "util/with_teardown", "ui/with_template", "ui/login/general_login", "ui/login/migrate_account_login"], function(t) {
    function e() {
        this.defaultAttrs({
            chromeTemplate: "startflow_wrapper",
            startflowContentSelector: ".js-startflow-content",
            startflowChromeSelector: ".js-startflow-chrome",
            externalLinkSelector: 'a[target="_blank"]'
        }), this.after("initialize", function() {
            this.prepareStartflowUi(), this.on(document, "uiLoginShowLoginForm", this.handleStartflow), this.on("click", {
                externalLinkSelector: this.openExternalLink
            })
        }), this.before("teardown", function() {
            this.$node.empty().hide()
        }), this.handleStartflow = function(t, e) {
            this.resetStartflowUi(), e.sessionData = e.sessionData || {};
            var i = {
                authType: e.sessionData.authType,
                errorMsg: e.errorMsg,
                staySignedIn: e.sessionData.staySignedIn,
                migrate: e.sessionData.migrate,
                uid: e.sessionData.uid
            }, s = e.sessionData.migrate && e.sessionData.migrate.email;
            s ? this.attachChild(r, this.attr.startflowContentSelector, i) : this.attachChild(o, this.attr.startflowContentSelector, i)
        }, this.prepareStartflowUi = _.once(function() {
            this.render(this.attr.chromeTemplate, {
                version: TD.util.getFullVersionString(),
                withLoading: !0
            })
        }), this.resetStartflowUi = function() {
            this.select("startflowChromeSelector").removeClass("is-hidden"), this.trigger(this.childTeardownEvent), this.select("startflowContentSelector").empty()
        }, this.openExternalLink = function(t, e) {
            t.preventDefault(), TD.util.openURL(e.el.href)
        }
    }
    var i = t("flight/lib/component"),
        s = t("util/with_teardown"),
        n = t("ui/with_template"),
        o = t("ui/login/general_login"),
        r = t("ui/login/migrate_account_login");
    return i(e, s, n)
}), define("ui/login/sole_user_dialog", ["require", "flight/lib/component", "ui/with_template"], function(t) {
    function e() {
        this.defaultAttrs({
            username: null,
            questionYesButtonSelector: ".js-twogin-question-yes-btn",
            questionNoButtonSelector: ".js-twogin-question-no-btn",
            warningAccessAnywayButtonSelector: ".js-twogin-warning-login-anyway-btn",
            warningLogoutButtonSelector: ".js-twogin-warning-logout-btn",
            soleUserDialogSelector: ".js-twogin-sole-user-dialog",
            questionFormSelector: ".js-twogin-question-form",
            signUpPromptSelector: ".js-twogin-show-signup-prompt"
        }), this.after("initialize", function() {
            this.showQuestion(), this.on("click", {
                questionYesButtonSelector: this.handleQuestionYes,
                questionNoButtonSelector: this.handleQuestionNo,
                warningAccessAnywayButtonSelector: this.handleWarningAccessAnyway,
                warningLogoutButtonSelector: this.handleWarningLogout,
                signUpPromptSelector: this.handleSignUpPrompt
            })
        }), this.showQuestion = function() {
            this.render("login/sole_user_question", {
                username: this.attr.username,
                version: TD.version
            })
        }, this.handleQuestionYes = function(t) {
            t.preventDefault(), this.render("login/sole_user_warning", {
                username: this.attr.username,
                version: TD.version
            })
        }, this.handleQuestionNo = function(t) {
            t.preventDefault(), this.trigger("uiLoginConfirmSoleUser", {
                shared: !1
            }), this.teardown()
        }, this.handleWarningAccessAnyway = function(t) {
            t.preventDefault(), this.trigger("uiLoginConfirmSoleUser", {
                shared: !0
            }), this.teardown()
        }, this.handleWarningLogout = function() {
            this.trigger(document, "uiLoginDenySoleUser"), this.teardown()
        }, this.handleSignUpPrompt = function(t) {
            t.preventDefault(), this.render("login/sole_user_signup_prompt", {
                version: TD.version
            })
        }
    }
    var i = t("flight/lib/component"),
        s = t("ui/with_template");
    return i(e, s)
}), define("ui/with_nav_flyover", ["flight/lib/compose", "ui/with_template", "ui/drag_drop/with_drag_drop"], function(t, e, i) {
    function s() {
        t.mixin(this, [e, i]), this.after("initialize", function() {
            this.mouseDown = !1, this.setupDragDrop({
                indicateDrop: !1,
                dragstart: this.mouseDownOff,
                dragend: function() {
                    this.mouseDownOff(), this.destroyFlyover()
                }
            }), this.on(document, "mousedown", this.mouseDownOn), this.on(document, "mouseup", this.mouseDownOff)
        }), this.mouseDownOn = function() {
            this.mouseDown = !0
        }, this.mouseDownOff = function() {
            this.mouseDown = !1
        }, this.renderFlyover = function(t, e) {
            if (!this.mouseDown) {
                var i;
                i = e && e.content ? e.content : t.data("title"), i && (this.$flyover = this.renderTemplate("column_nav_flyout", {
                    content: i
                }), $("body").append(this.$flyover), this.repositionFlyover(t))
            }
        }, this.destroyFlyover = function() {
            this.$flyover && (this.$flyover.remove(), this.$flyover = null)
        }, this.repositionFlyover = function(t) {
            var e;
            this.$flyover && (e = t.offset().top - (this.$flyover.height() - t.height()) / 2, this.$flyover.css("top", e))
        }
    }
    return s
}), define("ui/column_navigation", ["flight/lib/component", "ui/drag_drop/with_drag_drop", "ui/with_template", "ui/with_transitions", "ui/with_nav_flyover"], function(t, e, i, s, n) {
    function o() {
        var t = !1,
            e = null,
            i = null,
            s = null;
        this.defaultAttrs({
            templateName: "menus/column_nav_menu",
            contentSelector: ".js-column-nav-list",
            dragAndDropContainerSelector: ".js-int-scroller",
            addColumnButtonSelector: ".js-header-add-column",
            headerActionSelector: ".js-header-action",
            listItemSelector: ".js-column-nav-menu-item",
            dragHandleSelector: ".js-drag-handle",
            columnNavScrollerSelector: ".js-column-nav-scroller",
            animateInClass: "anim-rotate-in",
            animateOutClass: "anim-rotate-out",
            isNewClass: "is-new",
            touchEvents: "touchstart touchmove touchend touchcancel",
            listOrientation: "vertical",
            initScrollbarsDelay: 300,
            showScrollbarsThrottle: 100
        }), this.after("initialize", function() {
            this.renderColumnNavigation(), this.on(document, "dataColumnsLoaded", this.handleDataColumnsLoaded), this.on(document, "uiMainWindowResized", this.handleUiMainWindowResized), $.subscribe("/storage/client/column_order_changed", this.handleColumnsChanged.bind(this)), $.subscribe("/storage/client/change", this.handleColumnsChanged.bind(this)), this.on(document, "uiReadStateChange", this.handleReadStateChange), this.on(document, "uiMessageUnreadCount", this.handleMessageCount), this.on(document, "dataSettings", this.handleDataSettings), this.on(document, "uiColumnTitleRefreshed", this.handleColumnTitleRefreshed), this.trigger("uiNeedsSettings"), this.$columnNavScroller = $(".js-column-nav-scroller"), TD.util.isTouchDevice() && this.on(this.$columnNavScroller, this.attr.touchEvents, this.handleTouch), this.throttledShowScrollbars = _.throttle(this.showScrollbars.bind(this), this.attr.showScrollbarsThrottle), this.debouncedInitScrollbars = _.debounce(this.initScrollbars.bind(this), this.attr.initScrollbarsDelay), this.debouncedInitScrollbars(), this.setupDragDrop({
                type: "tweet",
                indicateDrop: !1,
                dragover: this.delegateDragOver,
                drop: function(t, e) {
                    var i = $(t.target).closest(".js-droptarget", this.$node);
                    i.length && this.trigger("uiAddTweetToCustomTimeline", {
                        id: i.data("customtimeline-id"),
                        tweetId: $(e.el).attr("data-tweet-id"),
                        account: i.data("customtimeline-account")
                    })
                }
            })
        }), this.delegateDragOver = function(t) {
            var e, i = $(t.target);
            if (e = i.is(".js-droptarget") ? i : i.closest(".js-droptarget", this.$node), e.length) {
                if (t.preventDefault(), this.$flyover) {
                    if (this.flyoverFor === e[0]) return;
                    this.destroyFlyover()
                }
                this.showFlyoverFor(e[0]), this.flyoverFor = e[0]
            } else this.destroyFlyover()
        }, this.handleDataColumnsLoaded = function() {
            this.renderColumnNavigation()
        }, this.handleColumnsChanged = function() {
            this.debouncedInitScrollbars()
        }, this.renderColumnNavigation = function() {
            var t, e, i = TD.controller.columnManager.getAllOrdered(),
                s = [];
            this.select("listItemSelector").each(function() {
                s.push($(this).attr("data-column"))
            }), t = s.length !== i.length, e = _.map(i, function(e, i) {
                var n, o, r, a, c, h = e.model.getKey(),
                    l = TD.ui.columns.getColumnElementByKey(h);
                return s[i] !== h && (t = !0), e.isOwnCustomTimeline() && (n = e.getCustomTimelineFeed(), o = n && n.getMetadata(), r = o && o.id, a = n && n.getAccountKey()), e.isMessageColumn() && (c = e.unreadMessageCount()), {
                    key: h,
                    title: e.getTitleHTML(),
                    iconclass: e.getIconClass(),
                    isNew: l.hasClass(this.attr.isNewClass),
                    customTimelineId: r,
                    customTimelineAccount: a,
                    isMessageColumn: e.isMessageColumn(),
                    unreadCount: "0" === c ? null : c
                }
            }.bind(this)), t && (this.render(this.attr.templateName, {
                columns: e
            }), this.$content = this.select("contentSelector"), this.$addColumnButton = this.select("addColumnButtonSelector"), this.on("click", {
                headerActionSelector: this.handleClick.bind(this)
            }), this.select("headerActionSelector").on("mouseover", this.handleListItemMouseover.bind(this)).on("mouseout", this.handleListItemMouseout.bind(this)), this.resizeColumnNavigation(), this.initialiseDragDrop());
            var n = $(".js-column-nav-list a").find(":hover");
            n.length || this.destroyFlyover()
        }, this.resizeColumnNavigation = function() {
            var t = this.$node.height();
            this.$node && t && (this.$content.height() > t ? ($(document).trigger("uiColumnNavSizeOverflow"), this.$addColumnButton.hide()) : ($(document).trigger("uiColumnNavSizeNormal"), this.$addColumnButton.show()))
        }, this.handleUiMainWindowResized = function() {
            this.resizeColumnNavigation(), this.throttledShowScrollbars()
        }, this.handleClick = function(e) {
            if (!TD.util.isTouchDevice() || !t) {
                var i = $(e.target).closest("a[data-action]"),
                    s = i.data("action"),
                    n = i.data("column");
                switch (s) {
                    case "jumpto":
                        TD.controller.columnManager.showColumn(n), TD.controller.stats.navbarJumpToColumn();
                        break;
                    case "add-column":
                        TD.ui.openColumn.showOpenColumn(), TD.controller.stats.navbarAddColumnClick(), this.destroyFlyover()
                }
                this.trigger(TD.components.BaseModal.CLOSE_EVENT)
            }
        }, this.handleDrop = function(t) {
            var e = [],
                i = $(t.target).attr("data-column");
            this.trigger("uiColumnMoving", {
                columnKey: i
            }), this.select("listItemSelector").each(function() {
                e.push($(this).attr("data-column"))
            }), TD.storage.clientController.client.setColumnOrder(e), TD.controller.stats.navbarReorderColumns()
        }, this.handleDrag = function(t) {
            this.repositionFlyover($(t.target))
        }, this.handleDropped = function(t) {
            this.repositionFlyover($(t.target))
        }, this.initialiseDragDrop = function() {
            this.select("dragAndDropContainerSelector").dragdroplist({
                handle: this.attr.dragHandleSelector,
                orientation: this.attr.listOrientation,
                selector: this.attr.listItemSelector,
                $boundary: this.$node
            }).on("drop.dragdroplist", this.handleDrop.bind(this)).on("drag.draggable", this.handleDrag.bind(this)).on("dropped.dragdroplist", this.handleDropped.bind(this))
        }, this.getColumnItem = function(t) {
            return this.$node.find(".js-column-nav-menu-item[data-column=" + t + "]")
        }, this.handleReadStateChange = function(t, e) {
            var i = this.getColumnItem(e.columnKey),
                s = i.find(".js-unread-count");
            0 === s.length && i.toggleClass(this.attr.isNewClass, !e.read)
        }, this.handleMessageCount = function(t, e) {
            var i = this.getColumnItem(e.columnKey),
                s = i.find(".js-unread-count"),
                n = s.text() || "0",
                o = "0" === n && "0" !== e.count,
                r = "0" !== n && "0" === e.count;
            s.text(e.count), o && (this.stopAnimation(s, this.attr.animateOutClass), s.addClass("is-visible"), this.addAnimateClass(s, this.attr.animateInClass)), r && (this.stopAnimation(s, this.attr.animateInClass), this.addAnimateClass(s, this.attr.animateOutClass, function() {
                s.removeClass("is-visible")
            }))
        }, this.showFlyoverFor = function(t) {
            var e = $(t);
            if (this.isNavbarCollapsed && !TD.util.isTouchDevice()) {
                var i, s, n = e.data("column");
                n && (i = TD.controller.columnManager.get(n), s = {
                    content: i.getTitleHTML()
                }), this.isDragging() || this.renderFlyover(e, s)
            }
        }, this.handleListItemMouseover = function(t) {
            this.showFlyoverFor(t.currentTarget)
        }, this.handleListItemMouseout = function() {
            this.isDragging() || this.destroyFlyover()
        }, this.isDragging = function() {
            return this.$node.find(".draggable-dragging").length > 0
        }, this.handleDataSettings = function(t, e) {
            this.isNavbarCollapsed = Boolean("condensed" === e.navbarWidth), this.destroyFlyover()
        }, this.handleDataColumnStateUpdated = function(t, e) {
            var i = this.$node.find(".js-column-nav-menu-item[data-column=" + e.columnKey + "]");
            e.unread ? i.addClass(this.attr.isNewClass) : i.removeClass(this.attr.isNewClass)
        }, this.handleColumnTitleRefreshed = function(t, e) {
            var i = this.$node.find(".js-column-nav-menu-item[data-column=" + e.columnKey + "] .js-column-title"),
                s = TD.controller.columnManager.get(e.columnKey),
                n = s.getTitleHTML();
            i.html(n)
        }, this.initScrollbars = function() {
            var t = this.$columnNavScroller.data("antiscroll");
            t ? t.refresh() : this.$columnNavScroller.antiscroll({
                showOnMouseOver: !1,
                position: "left"
            })
        }, this.showScrollbars = function() {
            var t = this.$columnNavScroller.data("antiscroll");
            t ? (t.refresh(), t.vertical && t.vertical.show()) : this.initScrollbars()
        }, this.handleTouch = function(n) {
            var o = $(n.target);
            if (0 !== o.closest(".js-drag-handle").length) {
                var r = null,
                    a = n.originalEvent,
                    c = a.changedTouches[0],
                    h = {
                        x: c.pageX,
                        y: c.pageY
                    }, l = (new Date).getTime();
                switch (a.type) {
                    case "touchstart":
                        t = !1, e = l, i = h, s = 0;
                        break;
                    case "touchmove":
                        var u = this.countDistance(h, i);
                        if (u > s && (s = u), e + 300 > l) break;
                        !t && 50 > s ? (t = !0, r = "mousedown") : t && (r = "mousemove");
                        break;
                    case "touchend":
                        t && (r = "mouseup")
                }
                r && this.simulateMouseEvent(r, a)
            }
        }, this.simulateMouseEvent = function(t, e) {
            var i = e.changedTouches[0],
                s = document.createEvent("MouseEvent");
            s.initMouseEvent(t, !0, !0, window, 1, i.screenX, i.screenY, i.clientX, i.clientY, !1, !1, !1, !1, 0, null), i.target.dispatchEvent(s), e.preventDefault()
        }, this.countDistance = function(t, e) {
            if (!t || !e) return 0;
            var i = Math.abs(t.x - e.x),
                s = Math.abs(t.y - e.y);
            return Math.sqrt(i * i + s * s)
        }
    }
    return t(o, e, i, s, n)
}), define("ui/columns/column_order", ["require", "flight/lib/component", "ui/with_column_selectors"], function(t) {
    function e() {
        this.defaultAttrs({
            isMovingClass: "is-moving",
            isMovingSelector: ".is-moving"
        }), this.after("initialize", function() {
            this.on(document, "uiColumnMoving", this.handleMovingColumn), this.on(document, "dataColumnOrder", this.handleColumnOrder), this.$columnsContainer = this.select("columnsContainerSelector")
        }), this.handleMovingColumn = function(t, e) {
            this.getColumnElementByKey(e.columnKey).addClass(this.attr.isMovingClass)
        }, this.isColumnOffScreen = function(t) {
            var e = t.position().left,
                i = this.getOriginalWidth(t);
            return 0 > e + i || e + i > this.$node.width()
        }, this.storeOriginalWidth = function(t) {
            var e = t.data("originalWidth");
            void 0 === e && (e = parseInt(t.css("width"), 10)), t.data("originalWidth", e)
        }, this.getOriginalWidth = function(t) {
            return t.data("originalWidth") || parseInt(t.css("width"), 10)
        }, this.moveColumnInstantly = function(t, e, i, s) {
            i.length > 0 && i.attr("data-column") !== s.newOrder[s.newIndex + 1] && (s.detached[i.attr("data-column")] = i.detach()), t ? e.insertAfter(t) : this.$columnsContainer.prepend(e)
        }, this.moveColumnToNewIndex = function(t, e) {
            var i, s, n = t.newOrder[t.newIndex],
                o = t.detached[n] || this.getColumnElementByKey(n),
                r = o.index(),
                a = function() {
                    o.removeClass(this.attr.isMovingClass), e = o, delete t.detached[n]
                }.bind(this);
            t.newOrder.length >= t.newIndex ? (i = this.getColumnElementByKey(t.newOrder[t.newIndex + 1]), s = i.index()) : (i = !1, s = -1), t.newIndex < t.newOrder.length && r !== s && (o.hasClass(this.attr.isMovingClass) ? (this.storeOriginalWidth(o), this.moveColumnInstantly(e, o, i, t), this.isColumnOffScreen(o) ? (o.one("uiColumnScrolled", function() {
                a(), t.newIndex += 1, this.moveColumnToNewIndex(t, e)
            }.bind(this)), o.trigger("uiColumnsScrollColumnToCenter", {
                columnKey: o.attr("data-column")
            })) : (TD.ui.columns.focusColumn(o.attr("data-column"), TD.ui.columns.COLUMN_GLOW_DURATION), a(), t.newIndex += 1, this.moveColumnToNewIndex(t, e))) : (e = o, t.newIndex += 1, this.moveColumnToNewIndex(t, e)))
        }, this.handleColumnOrder = function(t, e) {
            var i = {}, s = null,
                n = this.select("columnSelector").filter(this.attr.isMovingSelector);
            return n.length > 0 ? (this.moveColumnToNewIndex({
                newIndex: 0,
                newOrder: e.columnOrder,
                detached: i
            }), void 0) : (e.columnOrder.forEach(function(t, n) {
                var o = i[t] || this.getColumnElementByKey(t),
                    r = this.select("columnSelector").eq(n);
                r[0] !== o[0] && (e.columnOrder.length > n + 1 && r.length > 0 && r.attr("data-column") !== e.columnOrder[n + 1] && (i[r.attr("data-column")] = r.detach()), 0 === n ? o.prependTo(this.$columnsContainer) : o.insertAfter(s), delete i[t]), s = o
            }, this), void 0)
        }
    }
    var i = t("flight/lib/component"),
        s = t("ui/with_column_selectors");
    return i(e, s)
}), define("ui/with_popover", ["flight/lib/compose", "ui/with_template"], function(t, e) {
    function i() {
        t.mixin(this, [e]), this.defaultAttrs({
            popoverSelector: ".js-popover",
            popoverContentSelector: ".js-popover-content",
            isHiddenClass: "is-hidden",
            hasOverlayClass: "has-overlay",
            defaultHeight: 2e3,
            defaultWidth: 310,
            bottomPadding: 30,
            withClickTrap: !0,
            withOverlay: !1,
            repositionPeriod: 100,
            closeModals: !1,
            positionalClasses: {
                rt: "popover-position-rt"
            },
            popoverPosition: "rt"
        }), this.after("initialize", function() {
            this.trigger("uiPopoverCreated", {
                id: this.attr.id
            }), this.on(document, "uiCloseModal", this.handleCloseModal), this.boundClickTrap = this.popoverClickTrap.bind(this)
        }), this.handleCloseModal = function(t) {
            t.target !== this.node && this.hidePopover()
        }, this.popoverClickTrap = function(t) {
            t !== this.lastSeenEvent && (this.lastSeenEvent = t, this.$node && 0 === this.$node.find(t.currentTarget).length && this.hidePopover())
        }, this.isPopoverVisible = function() {
            return !this.$popover.hasClass(this.attr.isHiddenClass)
        }, this.showPopover = function() {
            this.$popover.hasClass(this.attr.isHiddenClass) && (this.$popover.removeClass(this.attr.isHiddenClass), this.withOverlay && (this.$overlay.removeClass(this.attr.isHiddenClass), this.$overlayControlNode.addClass(this.attr.hasOverlayClass)), this.attr.closeModals && this.trigger("uiCloseModal"), this.repositionPopover(), this.repositionInterval = this.repositionInterval || setInterval(this.repositionPopover.bind(this), this.attr.repositionPeriod), this.withClickTrap && _.defer(function() {
                $("body").on("click", "*", this.boundClickTrap)
            }.bind(this)), this.trigger("uiPopoverShown", {
                id: this.attr.id
            }))
        }, this.hidePopover = function() {
            this.$popover.hasClass(this.attr.isHiddenClass) || ($("body").off("click", "*", this.boundClickTrap), this.trigger("uiPopoverHiding", {
                id: this.attr.id
            }), this.$popover.addClass(this.attr.isHiddenClass), this.$overlay.addClass(this.attr.isHiddenClass), this.$overlayControlNode.removeClass(this.attr.hasOverlayClass), clearInterval(this.repositionInterval), this.repositionInterval = null, this.trigger("uiPopoverHidden", {
                id: this.attr.id
            }))
        }, this.showPopoverOverlay = function() {
            this.withOverlay = !0, this.$overlay.removeClass("is-hidden"), this.$overlayControlNode.addClass(this.attr.hasOverlayClass)
        }, this.hidePopoverOverlay = function() {
            this.withOverlay = !1, this.$overlay.addClass("is-hidden"), this.$overlayControlNode.removeClass(this.attr.hasOverlayClass)
        }, this.repositionPopover = function() {
            var t = this.$node.offset().top,
                e = $(window).height();
            this.maxHeight = e - t - this.attr.bottomPadding, this.$popover.css({
                height: this.maxHeight,
                "max-height": this.maxHeight
            }), "auto" === this.defaultHeight && (this.height = this.$popoverContent.outerHeight(), this.$popover.css({
                height: this.height,
                "max-height": this.height
            }))
        }, this.setPopoverSize = function(t) {
            this.width = t.width, this.height = t.height, this.$popover.css({
                width: this.width,
                height: this.height
            })
        }, this.getPopoverPositionClass = function() {
            return this.attr.positionalClasses[this.attr.popoverPosition]
        }, this.renderInPopover = function(t, e, i) {
            i && (this.defaultHeight = i.defaultHeight || this.attr.defaultHeight, this.withOverlay = i.withOverlay || this.attr.withOverlay, this.withClickTrap = i.withClickTrap || this.attr.withClickTrap), this.$overlay = this.renderTemplate("overlay"), this.$overlayControlNode = this.$node.closest(".js-overlay"), this.$overlay.insertBefore(this.$overlayControlNode), this.render("popover"), this.$popover = this.select("popoverSelector"), this.$popover.addClass(this.getPopoverPositionClass()), this.setPopoverSize({
                width: this.attr.defaultWidth
            }), this.$popoverContent = this.select("popoverContentSelector");
            var s = this.renderTemplate(t, e);
            this.$popoverContent.append(s)
        }
    }
    return i
}), define("ui/search/search_in_popover", ["flight/lib/component", "ui/with_popover"], function(t, e) {
    function i() {
        this.defaultAttrs({
            searchInputSelector: ".js-app-search-input",
            searchInputClassName: "js-app-search-input",
            searchInPopoverTemplate: "search/search_in_popover",
            isHiddenClass: null,
            appSearchSourceId: null,
            searchPopoverSourceId: null,
            typeaheadContainer: ".js-typeahead-dropdown",
            searchResultsContainer: ".js-search-results-container",
            searchFormContainer: ".js-search-form"
        }), this.after("initialize", function() {
            this.renderInPopover(this.attr.searchInPopoverTemplate, {
                searchInputClassName: this.attr.searchInputClassName,
                searchInputTitle: TD.i("Search"),
                searchInputPlaceholder: TD.i("Search"),
                isTouchColumnOptions: Boolean(TD.util.isTouchDevice() && TD.decider.get(TD.decider.TOUCHDECK_COLUMN_OPTIONS))
            }, {
                defaultHeight: "auto"
            }), this.$searchResultsContainer = this.select("searchResultsContainer"), this.$typeaheadContainer = this.select("typeaheadContainer"), this.searchData = null, this.on("uiTypeaheadItemSelected", this.handleTypeaheadItemSelect), this.on("uiTypeaheadNoItemSelected", this.handleTypeaheadNoItemSelected), this.on("uiTypeaheadSubmitQuery", this.handleTypeaheadSubmitQuery), this.on("uiTypeaheadItemComplete", this.handleTypeaheadItemComplete), this.on("uiTypeaheadSuggestions", this.handleTypeaheadSuggestions), this.on("uiTypeaheadNoSuggestions", this.handleTypeaheadNoSuggestions), this.on("uiTypeaheadRenderResults", this.handleTypeaheadRenderResults), this.on("uiSearchResultsColumnAdded", this.handleSearchResultsColumnAdded);
            var t = this.searchInputHandlerFactory.bind(this);
            this.on(document, "uiSearchInputSubmit", this.handleSearchInputSubmit), this.on(document, "uiSearchInputEscaped", this.handleSearchInputEscaped), this.on(document, "uiSearchInputFocus", this.handleSearchInputFocus), this.on(document, "uiSearchInputChanged", this.handleSearchInputChanged), this.on(document, "uiSearchInputTab", t("uiTypeaheadInputTab")), this.on(document, "uiSearchInputLeft", t("uiTypeaheadInputLeft")), this.on(document, "uiSearchInputRight", t("uiTypeaheadInputRight")), this.on(document, "uiSearchInputMoveUp", t("uiTypeaheadInputMoveUp")), this.on(document, "uiSearchInputMoveDown", t("uiTypeaheadInputMoveDown")), this.on("uiPopoverShown", this.handlePopoverShown), this.on("uiPopoverHiding", this.handlePopoverHiding), this.on("uiPopoverHidden", this.handlePopoverHidden), this.hasTypeaheadResults = !0, this.around("hidePopover", function(t, e) {
                e !== !1 && this.$input && this.$input.blur(), this.trigger("uiSearchResultsHidden"), t.apply(this)
            })
        }), this.handlePopoverShown = function() {
            this.$input.addClass("is-focused")
        }, this.handlePopoverHiding = function() {
            this.defaultHeight = "auto", this.$searchResultsContainer.addClass("is-hidden"), this.$typeaheadContainer.removeClass("is-hidden")
        }, this.handlePopoverHidden = function() {
            this.$input.removeClass("is-focused"), this.trigger("uiSearchInPopoverHidden")
        }, this.handleSearchResultsColumnAdded = function() {
            this.hidePopover()
        }, this.handleSearchInputFocus = function(t, e) {
            this.isCorrectSource(e.source) && (this.$input = $(t.target), this.isPopoverVisible() || TD.controller.stats.searchboxFocus(), this.isPopoverEmpty() || this.showPopover(), this.trigger("uiFixedHeaderChangedPosition"), this.$typeaheadContainer.hasClass(this.attr.isHiddenClass) ? this.showPopoverOverlay() : (this.trigger("uiTypeaheadInputFocus", e), this.hidePopoverOverlay(), this.defaultHeight = "auto"))
        }, this.searchInputHandlerFactory = function(t) {
            return function(e, i) {
                this.isCorrectSource(i.source) && !this.$typeaheadContainer.hasClass(this.attr.isHiddenClass) && this.trigger(t, i)
            }.bind(this)
        }, this.handleSearchInputChanged = function(t, e) {
            this.isCorrectSource(e.source) && (this.$input = $(t.target), this.isPopoverVisible() || this.showPopover(), this.hidePopoverOverlay(), this.defaultHeight = "auto", this.$searchResultsContainer.addClass("is-hidden"), this.$typeaheadContainer.removeClass("is-hidden"), this.trigger("uiTypeaheadInputChanged", e))
        }, this.isCorrectSource = function(t) {
            return t === this.attr.appSearchSourceId || t === this.attr.searchPopoverSourceId
        }, this.handleSearchInputEscaped = function(t, e) {
            this.isCorrectSource(e.source) && (this.trigger("uiTypeaheadInputBlur"), this.hidePopover())
        }, this.handleSearchInputSubmit = function(t, e) {
            var i;
            this.isCorrectSource(e.source) && (this.searchData = e, twttr.txt.isValidList(e.query) ? (i = e.query.split("/"), TD.ui.openColumn.showList(i[0].substr(1), i[1]), this.hidePopover()) : (this.trigger("uiTypeaheadInputSubmit", e), TD.controller.stats.searchboxPerformSearch(e.query)))
        }, this.handleTypeaheadNoItemSelected = function() {
            this.searchData && this.performSearch(this.searchData)
        }, this.handleTypeaheadSubmitQuery = function(t, e) {
            var i;
            return twttr.txt.isValidList(e.query) ? (i = e.query.split("/"), TD.ui.openColumn.showList(i[0].substr(1), i[1]), this.hidePopover(), void 0) : void 0
        }, this.performSearch = function(t) {
            t.query && (this.trigger("uiNewSearchQuery", {
                query: t.query
            }), this.defaultHeight = "max", this.$typeaheadContainer.addClass("is-hidden"), this.$searchResultsContainer.removeClass("is-hidden"), this.trigger("uiSearch", t), this.showPopover(), this.showPopoverOverlay(), this.searchData = null)
        }, this.handleTypeaheadItemSelect = function(t, e) {
            var i;
            switch (e.searchType) {
                case "user":
                    this.hidePopover(), this.trigger("uiShowProfile", {
                        id: e.query
                    });
                    break;
                case "topic":
                case "saved-search":
                case "recent-search":
                    this.performSearch(e);
                    break;
                case "recent-search-clear":
                    this.trigger("uiRecentSearchClearAction");
                    break;
                case "list":
                    i = e.query.split("/"), TD.ui.openColumn.showList(i[0], i[1])
            }
            this.searchData = null
        }, this.handleTypeaheadItemComplete = function(t, e) {
            this.$input.trigger("uiAppSearchItemComplete", e)
        }, this.handleTypeaheadNoSuggestions = function() {
            this.hasTypeaheadResults = !1, this.isPopoverEmpty() && this.hidePopover(!1), this.trigger("uiAppSearchSetPreventDefault", {
                preventDefault: !1,
                key: 9
            })
        }, this.handleTypeaheadSuggestions = function() {
            this.trigger("uiAppSearchSetPreventDefault", {
                preventDefault: !0,
                key: 9
            })
        }, this.handleTypeaheadRenderResults = function() {
            this.hasTypeaheadResults = !0, this.showPopover()
        }, this.isPopoverEmpty = function() {
            return !this.hasTypeaheadResults && !$.contains(this.$popover[0], this.$input[0])
        }
    }
    return t(i, e)
}), define("ui/typeahead/with_users", [], function() {
    return function() {
        this.defaultAttrs({
            usersListSelector: ".js-typeahead-user-list",
            usersItemSelector: ".js-typeahead-user-item",
            usersTemplate: "typeahead/typeahead_users"
        }), this.renderUsers = function(t, e) {
            this.$usersList.find(this.attr.usersItemSelector).remove();
            var i = e.suggestions.users || [];
            if (!i.length) return this.clearUsers(), void 0;
            var s, n = [];
            i.forEach(function(t) {
                n.push({
                    screen_name: t.screen_name,
                    name: t.name,
                    profile_image_url: this.getAvatar(t),
                    verified: t.verified
                })
            }, this), s = this.toHtml(this.attr.usersTemplate, {
                users: n
            }), this.$usersList.toggleClass("has-results", i.length > 0).toggleClass("is-hidden", 0 === i.length).html(s)
        }, this.getAvatar = function(t) {
            return t.profile_image_url_https.replace(/_normal(\..*)?$/i, "_mini$1")
        }, this.clearUsers = function() {
            this.$usersList.removeClass("has-results"), this.$usersList.addClass("is-hidden")
        }, this.after("initialize", function() {
            this.$usersList = this.select("usersListSelector"), this.on("uiTypeaheadRenderResults", this.renderUsers)
        })
    }
}), define("ui/typeahead/with_saved_searches", ["flight/lib/compose", "ui/with_text_utils"], function(t, e) {
    return function() {
        t.mixin(this, [e]), this.defaultAttrs({
            savedSearchesListSelector: ".js-typeahead-saved-search-list",
            savedSearchesItemSelector: ".js-typeahead-saved-search-item",
            savedSearchesTemplate: "typeahead/typeahead_saved_searches"
        }), this.renderSavedSearches = function(t, e) {
            var i, s = [];
            this.$savedSearchesList.empty(), e.suggestions && e.suggestions.savedSearches && (e.suggestions.savedSearches.forEach(function(t) {
                s.push({
                    query: t.query,
                    name: this.highlightSubstring(t.name, e.query)
                })
            }, this), i = this.toHtml(this.attr.savedSearchesTemplate, {
                savedSearches: s
            }), this.$savedSearchesList.toggleClass("has-results", s.length > 0).toggleClass("is-hidden", 0 === s.length).html(i))
        }, this.after("initialize", function() {
            this.$savedSearchesList = this.select("savedSearchesListSelector"), this.on("uiTypeaheadRenderResults", this.renderSavedSearches)
        })
    }
}), define("ui/typeahead/with_recent_searches", ["flight/lib/compose", "ui/with_text_utils"], function(t, e) {
    var i = function() {
        t.mixin(this, [e]), this.defaultAttrs({
            recentSearchesListSelector: ".js-typeahead-recent-search-list",
            recentSearchesItemSelector: ".js-typeahead-recent-search-item",
            recentSearchesClearSelector: ".js-typeahead-recent-search-clear",
            recentSearchesTemplate: "typeahead/typeahead_recent_searches",
            recentSearchesPlaceholderTemplate: "typeahead/recent_searches_placeholder",
            recentSearchesFixedClass: "recent-searches-fixed-list"
        }), this.renderRecentSearches = function(t, e) {
            this.currentData = e;
            var i = e.datasources && e.datasources.some(function(t) {
                return "recentSearches" === t
            });
            if (!i) return this.$recentSearchesList.removeClass("has-results").addClass("is-hidden").empty(), this.$clearRecentSearches.addClass("is-hidden").removeClass("is-invisible"), void 0;
            var s, n = i && 1 === e.datasources.length,
                o = e.suggestions && e.suggestions.recentSearches && e.suggestions.recentSearches.length,
                r = o || n,
                a = n && !o;
            if (o) {
                var c = [];
                e.suggestions.recentSearches.forEach(function(t) {
                    c.push({
                        query: t,
                        name: this.highlightSubstring(t, e.query)
                    })
                }, this), s = this.toHtml(this.attr.recentSearchesTemplate, {
                    recentSearches: c
                })
            } else s = n ? this.toHtml(this.attr.recentSearchesPlaceholderTemplate) : "";
            this.$recentSearchesList.toggleClass(this.attr.recentSearchesFixedClass, n), this.$recentSearchesList.toggleClass("has-results", o).toggleClass("is-hidden", !r).html(s), this.$clearRecentSearches.toggleClass("is-hidden", !n).toggleClass("is-invisible", a)
        }, this.clearRecentSearches = function() {
            delete this.currentData.suggestions.recentSearches, this.renderRecentSearches(null, this.currentData)
        }, this.after("initialize", function() {
            this.$recentSearchesList = this.select("recentSearchesListSelector"), this.$clearRecentSearches = this.select("recentSearchesClearSelector"), this.on("uiRecentSearchClearAction", this.clearRecentSearches), this.on("uiTypeaheadRenderResults", this.renderRecentSearches)
        })
    };
    return i
}), define("ui/typeahead/with_topics", ["flight/lib/compose", "ui/with_text_utils"], function(t, e) {
    return function() {
        t.mixin(this, [e]), this.defaultAttrs({
            topicsListSelector: ".js-typeahead-topic-list",
            topicsItemSelector: ".js-typeahead-topic-item",
            topicsTemplate: "typeahead/typeahead_topics"
        }), this.renderTopics = function(t, e) {
            this.$topicsList.empty();
            var i = e.suggestions.topics || [];
            if (!i.length) return this.clearTopics(), void 0;
            var s = i.map(function(t) {
                return {
                    topic: t.topic,
                    name: this.highlightSubstring(t.topic, e.query)
                }
            }, this),
                n = this.toHtml(this.attr.topicsTemplate, {
                    topics: s
                });
            this.$topicsList.toggleClass("has-results", i.length > 0).toggleClass("is-hidden", 0 === i.length).html(n)
        }, this.clearTopics = function() {
            this.$topicsList.removeClass("has-results"), this.$topicsList.addClass("is-hidden")
        }, this.resetTopics = function() {
            this.clearTopics(), this.$topicsList.find(this.attr.topicsItemSelector).remove()
        }, this.after("initialize", function() {
            this.$topicsList = this.select("topicsListSelector"), this.on("uiTypeaheadRenderResults", this.renderTopics)
        })
    }
}), define("ui/typeahead/with_lists", ["flight/lib/compose", "ui/with_text_utils"], function(t, e) {
    var i = function() {
        t.mixin(this, [e]), this.defaultAttrs({
            listsListSelector: ".js-typeahead-lists-list",
            listItemSelector: ".js-typeahead-list-item",
            listTemplate: "typeahead/typeahead_lists"
        }), this.renderLists = function(t, e) {
            this.currentData = e;
            var i = e.datasources && e.datasources.some(function(t) {
                return "lists" === t
            });
            if (!i) return this.$listsList.removeClass("has-results").addClass("is-hidden").empty(), void 0;
            var s, n = e.suggestions && e.suggestions.lists && e.suggestions.lists.length;
            if (n) {
                var o = [];
                e.suggestions.lists.forEach(function(t) {
                    o.push({
                        query: t.fullName,
                        fullName: this.highlightSubstring(t.fullName, e.query),
                        name: t.name,
                        screenName: t.user.screenName
                    })
                }, this), s = this.toHtml(this.attr.listTemplate, {
                    lists: o
                })
            } else s = "";
            this.$listsList.toggleClass("has-results", n).toggleClass("is-hidden", !n).html(s)
        }, this.after("initialize", function() {
            this.$listsList = this.select("listsListSelector"), this.on("uiTypeaheadRenderResults", this.renderLists)
        })
    };
    return i
}), define("ui/typeahead/typeahead_dropdown", ["flight/lib/component", "ui/typeahead/with_users", "ui/typeahead/with_saved_searches", "ui/typeahead/with_recent_searches", "ui/typeahead/with_topics", "ui/typeahead/with_lists", "ui/with_template"], function(t, e, i, s, n, o, r) {
    function a() {
        this.defaultAttrs({
            inputSelector: ".js-app-search-input",
            dropdownSelector: ".js-typeahead-dropdown",
            itemsSelector: ".js-typeahead-item",
            itemSelectedClass: "is-selected",
            itemSelectedSelector: ".is-selected",
            deciders: {
                showDebugInfo: !1
            },
            datasources: ["topics", "savedSearches", "recentSearches", "users", "lists"],
            limits: {
                users: 5,
                topics: 5,
                lists: 2
            },
            datasourcesRecentOnly: ["recentSearches"],
            queryTypes: ["topic", "saved-search", "recent-search", "user"],
            minHeight: 300
        }), this.after("initialize", function() {
            this.query = null, this.on(document, "dataTypeaheadSuggestions", this.handleDataTypeaheadSuggestions), this.on("uiTypeaheadInputFocus", this.handleTypeaheadInputFocus), this.on("uiTypeaheadInputBlur", this.handleTypeaheadInputBlur), this.on("uiTypeaheadInputSubmit", this.handleTypeaheadInputSubmit), this.on("uiTypeaheadInputChanged", this.handleTypeaheadInputChanged), this.on("uiTypeaheadInputMoveUp", this.handleTypeaheadInputMoveUp), this.on("uiTypeaheadInputMoveDown", this.handleTypeaheadInputMoveDown), this.on("uiTypeaheadInputRight", this.handleTypeaheadInputMoveRight), this.on("uiTypeaheadInputTab uiTypeaheadInputLeft", this.completeSelection), this.on("mouseover", {
                itemsSelector: this.handleItemMouseover
            }), this.on("click", {
                itemsSelector: this.handleItemClick
            })
        }), this.handleTypeaheadInputFocus = function(t, e) {
            this.hasFocus = !0, e.query !== this.query && this.handleTypeaheadInputChanged(t, e)
        }, this.handleTypeaheadInputBlur = function() {
            this.hasFocus = !1, this.trigger("dataTypeaheadQueryReset")
        }, this.handleItemMouseover = function(t, e) {
            this.select("itemsSelector").removeClass(this.attr.itemSelectedClass), $(e.el).addClass(this.attr.itemSelectedClass)
        }, this.moveSelection = function(t) {
            var e, i = this.select("itemsSelector").filter(":visible"),
                s = i.filter(this.attr.itemSelectedSelector);
            s.removeClass(this.attr.itemSelectedClass), e = s.length ? i.index(s) + t : -1 + t, 0 > e ? e = i.length - 1 : e >= i.length && (e = 0), i.eq(e).addClass(this.attr.itemSelectedClass)
        }, this.getSelectedItemIndex = function() {
            var t = this.select("itemsSelector").filter(":visible"),
                e = t.filter(this.attr.itemSelectedSelector);
            return t.index(e)
        }, this.handleTypeaheadInputMoveUp = function() {
            this.moveSelection(-1)
        }, this.handleTypeaheadInputMoveDown = function() {
            this.moveSelection(1)
        }, this.handleTypeaheadInputMoveRight = function(t, e) {
            -1 === this.getSelectedItemIndex() ? this.moveSelection(1) : this.completeSelection(t, e)
        }, this.handleTypeaheadInputChanged = function(t, e) {
            var i = e.query,
                s = this.attr.datasources;
            0 === i.trim().length && (s = this.attr.datasourcesRecentOnly), this.query = i, this.select("itemsSelector").removeClass(this.attr.itemSelectedClass), this.trigger("uiNeedsTypeaheadSuggestions", {
                query: i,
                datasources: s,
                dropdownId: this.getDropdownId(),
                type: "search",
                limits: this.attr.limits
            })
        }, this.getDropdownId = function() {
            return this.dropdownId || (this.dropdownId = "swift_typeahead_dropdown_" + Date.now()), this.dropdownId
        }, this.triggerSelectionEvent = function(t) {
            var e = this.select("itemsSelector"),
                i = e.index(t),
                s = this.query,
                n = t.data("search-query");
            (s || n) && this.trigger("uiTypeaheadItemSelected", {
                    index: i,
                    searchType: t.data("search-type"),
                    query: n,
                    input: s
                })
        }, this.handleItemClick = function(t, e) {
            var i = $(e.el);
            this.triggerSelectionEvent(i)
        }, this.handleTypeaheadInputSubmit = function() {
            var t = this.select("itemsSelector").filter(this.attr.itemSelectedSelector).filter(":visible").first();
            t.length ? this.triggerSelectionEvent(t) : this.trigger("uiTypeaheadNoItemSelected")
        }, this.completeSelection = function(t, e) {
            var i = e && "rtl" === e.dir ? "rtl" : "ltr";
            if (!("rtl" === i && "uiTypeaheadInputRight" === t.type || -1 !== ["ltr", void 0, ""].indexOf(i) && "uiTypeaheadInputLeft" === t.type)) {
                var s = this.select("itemsSelector").filter(this.attr.itemSelectedSelector).first();
                if (!s.length) {
                    s = this.select("itemsSelector").first();
                    var n = s.data("search-query") !== this.query;
                    if (!n) return "uiTypeaheadInputTab" === t.type && (this.hasFocus = !1), void 0
                }
                var o = s.data("search-type"),
                    r = this.attr.queryTypes.some(function(t) {
                        return t === o
                    });
                if (!r) return "uiTypeaheadInputTab" === t.type && (this.hasFocus = !1), void 0;
                var a = s.data("search-query"),
                    c = this.select("itemsSelector"),
                    h = c.index(s);
                this.trigger("uiTypeaheadItemComplete", {
                    value: a,
                    searchType: s.data("search-type"),
                    index: h,
                    query: a
                })
            }
        }, this.handleDataTypeaheadSuggestions = function(t, e) {
            var i = this.select("itemsSelector").filter(this.attr.itemSelectedSelector);
            if (e.dropdownId === this.getDropdownId() && e.query === this.query && this.hasFocus && !i.length) {
                this.trigger("uiTypeaheadRenderResults", e);
                var s = this.attr.datasources.some(function(t) {
                    return e.suggestions[t] && e.suggestions[t].length
                });
                s = s || !e.query, s ? (this.trigger("uiTypeaheadSuggestions"), this.select("itemsSelector").removeClass("list-item-first").removeClass("list-item-last").filter(":visible").first().addClass("list-item-first").end().last().addClass("list-item-last")) : this.trigger("uiTypeaheadNoSuggestions")
            }
        }
    }
    return t(a, r, i, e, n, o, s)
}), define("ui/toggle_button", ["flight/lib/component", "ui/with_template"], function(t, e) {
    var i = function() {
        this.defaultAttrs({
            template: "menus/toggle_button",
            buttonSelector: ".js-toggle-button"
        }), this.handleButtonClick = function(t) {
            var e = $(t.currentTarget),
                i = e.data("clickevent");
            i && (this.trigger(i), this.$buttons.removeClass("is-selected"), e.addClass("is-selected"))
        }, this.handleSelectItem = function(t, e) {
            this.$node.find("." + e.class).click()
        }, this.after("initialize", function() {
            this.buttons = this.attr.buttons;
            var t = {
                buttons: [this.buttons.left, this.buttons.right]
            };
            this.render(this.attr.template, t), this.$buttons = this.select("buttonSelector"), this.on(this.$buttons, "click", this.handleButtonClick), this.on("uiToggleSelectItem", this.handleSelectItem), this.on("uiToggleButtonDestroy", this.teardown)
        })
    };
    return t(i, e)
}), define("ui/user_search_results", ["require", "flight/lib/component", "ui/with_template"], function(t) {
    function e() {
        this.after("initialize", function() {
            this.query = null, this.on(document, "uiSearch", this.handleSearch), this.on(document, "dataUserSearch", this.handleResults), this.on("uiUserResultsDestroy", this.teardown)
        }), this.handleSearch = function(t, e) {
            this.query = e.query, this.$node.empty(), this.trigger(document, "uiNeedsUserSearch", {
                query: this.query
            })
        }, this.handleResults = function(t, e) {
            if (e.request.query === this.query) {
                var i = e.result;
                0 === i.length ? this.render("search_no_users_placeholder") : this.render("menus/user_results", {
                    users: i,
                    withUserMenu: !0,
                    userMenuPositon: "pos-r"
                })
            }
        }
    }
    var i = t("flight/lib/component"),
        s = t("ui/with_template");
    return i(e, s)
}), define("ui/with_fixed_header_and_footer", ["flight/lib/compose", "ui/with_template"], function(t, e) {
    var i = function() {
        t.mixin(this, [e]), this.defaultAttrs({
            headerSelector: ".js-fhf-header",
            bodySelector: ".js-fhf-body",
            footerSelector: ".js-fhf-footer"
        }), this.after("initialize", function() {
            this.$headerContainer = this.select("headerSelector"), this.$bodyContainer = this.select("bodySelector"), this.$footerContainer = this.select("footerSelector"), this.on("uiFixedHeaderChangedPosition", this.resizeBody)
        }), this.resizeBody = function() {
            var t = 0,
                e = 0,
                i = 0;
            this.$headerContainer.hasClass("is-hidden") ? (this.$headerContainer.removeClass("is-hidden"), i = this.$headerContainer.position().top, this.$headerContainer.addClass("is-hidden")) : (t = this.$headerContainer.outerHeight(), i = this.$headerContainer.position().top), this.$footerContainer.hasClass("is-hidden") || (e = this.$footerContainer.outerHeight()), this.$bodyContainer.css({
                top: t + i,
                bottom: e
            })
        }, this.hideHeader = function() {
            this.$headerContainer.addClass("is-hidden")
        }, this.showHeader = function() {
            this.$headerContainer.removeClass("is-hidden")
        }, this.hideFooter = function() {
            this.$footerContainer.addClass("is-hidden")
        }, this.showFooter = function() {
            this.$footerContainer.removeClass("is-hidden")
        }
    };
    return i
}), define("ui/search/search_results", ["flight/lib/component", "ui/toggle_button", "ui/user_search_results", "ui/with_accordion", "ui/with_template", "ui/with_search_filter", "ui/with_focus", "ui/asynchronous_form", "ui/with_fixed_header_and_footer", "ui/with_transitions"], function(t, e, i, s, n, o, r, a, c, h) {
    function l() {
        this.defaultAttrs({
            scribeSection: "search_results",
            accordionSelector: ".js-accordion",
            columnScrollerIsAnimatingClass: "is-column-scroller-animating",
            tweetResultsSelector: ".js-tweet-results",
            userResultsSelector: ".js-user-results",
            searchResultsHeaderSelector: ".js-search-results-header",
            searchResultsFooterSelector: ".js-search-results-footer",
            toggleSelector: ".js-toggle",
            toggleTweetsClass: "js-toggle-tweets",
            columnType: "search",
            isTouchColumnOptionsClass: "is-touch-column-options"
        }), this.after("initialize", function() {
            this.on(document, "uiSearch", this.handleSearch), this.on("uiColumnUpdateSearchFilter", this.handleUpdateSearchFilter), TD.util.isTouchDevice() && TD.decider.get(TD.decider.TOUCHDECK_COLUMN_OPTIONS) ? this.select("searchResultsHeaderSelector").addClass(this.attr.isTouchColumnOptionsClass) : this.select("searchResultsHeaderSelector").removeClass(this.attr.isTouchColumnOptionsClass), this.$tweetResults = this.select("tweetResultsSelector"), this.$userResults = this.select("userResultsSelector"), this.$header = this.select("searchResultsHeaderSelector"), this.$footer = this.select("searchResultsFooterSelector"), this.$accordion = this.select("accordionSelector"), i.attachTo(this.$userResults), this.$toggle = this.select("toggleSelector"), e.attachTo(this.$toggle, {
                buttons: {
                    left: {
                        label: TD.i("Tweets"),
                        "class": "js-toggle-tweets",
                        clickEvent: "uiToggleTweetsClick",
                        selected: !0
                    },
                    right: {
                        label: TD.i("Users"),
                        "class": "js-toggle-users",
                        clickEvent: "uiToggleUsersClick"
                    }
                }
            }), this.on(this.$header, "uiToggleTweetsClick", this.showTweets), this.on(this.$header, "uiToggleUsersClick", this.showUsers), this.on(this.$footer.find(".js-add-column"), "click", this.handleAddColumnClick), TD.util.isTouchDevice() && window.navigator.standalone && this.on(this.$userResults, "touchmove", function(t) {
                t.stopPropagation()
            }), this.on("uiTransitionExpandStart", this.handleColumnOptionsTransitionStart), this.on("uiAccordionTotalHeightChanged", this.resizeBody), this.on("uiSearchResultsHidden", this.handleSearchResultsHidden)
        }), this.handleUpdateSearchFilter = function(t, e) {
            this.temporaryColumn && (this.temporaryColumn.column.updateSearchFilter(e), this.temporaryColumn.populate())
        }, this.handleSearchResultsHidden = function() {
            this.focusRelease(), this.temporaryColumn && (this.temporaryColumn.destroy(), this.temporaryColumn = null)
        }, this.handleSearch = function(t, e) {
            var i = TD.storage.accountController.getPreferredAccount("twitter"),
                s = new TD.vo.SearchFilter;
            this.query = e.query, this.temporaryColumn && (this.temporaryColumn.destroy(), this.temporaryColumn = null), this.temporaryColumn = new TD.components.TemporaryColumn, this.temporaryColumn.search(this.query, i.getKey()), this.$tweetResults.empty(), this.$tweetResults.append(this.temporaryColumn.$node), this.trigger(this.$toggle, "uiToggleSelectItem", {
                "class": this.attr.toggleTweetsClass
            }), this.trigger(this.$header, "uiDestroyAsynchronousForm"), this.select("accordionSelector").html(""), this.renderSearchFilters(s, {
                withContentType: !0,
                withMatching: !1,
                withExcluding: {
                    isControl: !0,
                    searchInputClassName: this.attr.excludingClass,
                    searchInputPlaceholder: TD.i("Enter words to exclude"),
                    searchInputTitle: "excluding"
                },
                withLanguage: !0,
                withRetweetsToggle: !0,
                withFromList: !0,
                withActionFilter: !1,
                withEngagementFilter: TD.decider.get(TD.decider.ENGAGEMENT_FILTER)
            }), a.attachTo(this.$header), this.resizeBody(), this.temporaryColumn.populate(), this.showTweets()
        }, this.handleAddColumnClick = function() {
            this.temporaryColumn.makePermanent(), this.trigger("uiSearchResultsColumnAdded")
        }, this.showTweets = function() {
            this.focusRequest(), this.$accordion.removeClass("is-hidden"), this.$tweetResults.removeClass("is-hidden"), this.$userResults.addClass("is-hidden"), this.showHeader(), this.showFooter(), this.resizeBody(), this.trigger("uiSearchResultsFocus")
        }, this.showUsers = function() {
            this.focusRequest(), this.showHeader(), this.$accordion.addClass("is-hidden"), this.$tweetResults.addClass("is-hidden"), this.$userResults.removeClass("is-hidden"), this.hideFooter(), this.resizeBody()
        }, this.handleUpdatingColumn = function() {
            this.trigger(this.$header, "uiWaitingForAsyncResponse")
        }, this.handleColumnUpdated = function() {
            this.trigger(this.$header, "uiReceivedAsyncResponse")
        }, this.handleColumnOptionsTransitionStart = function(t, e) {
            var i = this.$bodyContainer,
                s = parseInt(i.css("top"), 10),
                n = function() {
                    i.data("isAnimating", !1)
                };
            i.data("isAnimating") === !0 ? this.columnScrollerTargetTop = this.columnScrollerTargetTop + e.delta : (i.data("isAnimating", !0), this.columnScrollerTargetTop = s + e.delta), this.transitionTop(i, this.attr.columnScrollerIsAnimatingClass, this.columnScrollerTargetTop, n)
        }, this.before("teardown", function() {
            this.trigger(this.$searchFilter, "uiDestroyAsynchronousForm"), this.trigger(this.$userResults, "uiUserResultsDestroy"), this.trigger(this.$header, "uiToggleButtonDestroy")
        })
    }
    return t(l, s, n, r, o, c, h)
}), define("ui/search/search_router", ["require", "flight/lib/component"], function(t) {
    function e() {
        this.defaultAttrs({
            appSearchSelector: ".js-search",
            appSearchInputSelector: ".js-search-form .js-app-search-input",
            isTouchSearchClass: "is-touch-search",
            searchPopoverInputSelector: ".js-search-in-popover .js-app-search-input"
        }), this.after("initialize", function() {
            TD.util.isTouchDevice() && TD.decider.get(TD.decider.TOUCHDECK_SEARCH) ? this.select("appSearchSelector").addClass(this.attr.isTouchSearchClass) : this.select("appSearchSelector").removeClass(this.attr.isTouchSearchClass), this.on(document, "uiPerformSearch", this.handlePerformSearch), this.on(document, "uiAppSearchFocus uiShowSearchButtonClick", this.focusSearchInput), this.on(document, "dataSettings", this.handleDataSettings), this.trigger("uiNeedsSettings")
        }), this.handleDataSettings = function(t, e) {
            this.$input = "condensed" === e.navbarWidth ? this.select("searchPopoverInputSelector") : this.select("appSearchInputSelector")
        }, this.focusSearchInput = function() {
            this.$input.triggerHandler("focus"), this.$input.is(":focus") || this.$input.focus()
        }, this.handlePerformSearch = function(t, e) {
            t.target === document && _.defer(function() {
                this.trigger(this.$input, "uiAppSearchSubmit", e)
            }.bind(this))
        }
    }
    var i = t("flight/lib/component");
    return i(e)
}), define("ui/with_drawer_tabs", [], function() {
    return function() {
        this.defaultAttrs({
            showDrawerButtonSelector: ".js-show-drawer",
            hideDrawerButtonSelector: ".js-hide-drawer"
        }), this.after("initialize", function() {
            this.on("click", {
                showDrawerButtonSelector: this.handleShowDrawerClick,
                hideDrawerButtonSelector: this.handleHideDrawerClick
            }), this.on(document, "uiDrawerActive", this.handleDrawerActive)
        }), this.handleShowDrawerClick = function(t, e) {
            var i = $(e.el).attr("data-drawer");
            switch (i) {
                case "compose":
                    this.trigger("uiComposeTweet"), TD.controller.stats.navbarComposeClick();
                    break;
                case "accountSettings":
                    this.trigger("uiShowAccountSettings")
            }
        }, this.handleHideDrawerClick = function(t, e) {
            var i = $(e.el).attr("data-drawer");
            switch (i) {
                case "compose":
                    this.trigger("uiComposeClose"), TD.controller.stats.navbarComposeClick();
                    break;
                default:
                    this.trigger("uiDrawerClose")
            }
        }, this.handleDrawerActive = function(t, e) {
            if (this.select("hideDrawerButtonSelector").addClass("is-hidden"), this.select("showDrawerButtonSelector").removeClass("is-hidden"), e.activeDrawer) {
                var i = function() {
                    return $(this).attr("data-drawer") === e.activeDrawer
                };
                this.select("showDrawerButtonSelector").filter(i).addClass("is-hidden"), this.select("hideDrawerButtonSelector").filter(i).removeClass("is-hidden")
            }
        }
    }
}), define("ui/app_header", ["flight/lib/component", "ui/with_drawer_tabs", "ui/with_nav_flyover", "ui/with_dropdown"], function(t, e, i, s) {
    function n() {
        this.defaultAttrs({
            headerActionSelector: ".js-header-action",
            settingsButtonSelector: '[data-action="settings-menu"]'
        }), this.after("initialize", function() {
            this.on("click", this.handleClick), $(document).on("uiToggleNavbarWidth", this.toggleNavbarWidth.bind(this)), $(document).on("dataSettings", this.handleDataSettings.bind(this)), this.select("headerActionSelector").on("mouseover", this.handleListItemMouseover.bind(this)).on("mouseout", this.handleListItemMouseout.bind(this)), this.trigger("uiNeedsSettings")
        }), this.handleClick = function(t) {
            var e = $(t.target).closest("[data-action]"),
                i = e.attr("data-action");
            if (e.length) {
                switch ("url" !== i && t.preventDefault(), i) {
                    case "account-settings":
                        this.trigger("uiShowAccountSettings");
                        break;
                    case "add-column":
                        TD.ui.openColumn.showOpenColumn(), TD.controller.stats.navbarAddColumnClick();
                        break;
                    case "settings-menu":
                        t.stopPropagation(), this.toggleSettingsDropdown(e), TD.controller.stats.navbarSettingsClick();
                        break;
                    case "show-lists":
                        TD.ui.openColumn.showLists(), TD.controller.stats.navbarListsClick();
                        break;
                    case "show-customtimelines":
                        TD.ui.openColumn.showCustomTimelines();
                        break;
                    case "change-sidebar-width":
                        this.toggleNavbarWidth();
                        break;
                    case "show-search":
                        this.trigger("uiShowSearchButtonClick"), e.tooltip("hide");
                        break;
                    case "signOut":
                        TD.controller.init.signOut();
                        break;
                    case "globalSettings":
                        $(document).trigger("uiShowGlobalSettings");
                        break;
                    case "do_debug":
                        TD.sync.ui.dispatch_ui_event(e.attr("data-type"));
                        break;
                    case "fileabug":
                        this.sendBugReport();
                        break;
                    case "keyboardShortcutList":
                        $(document).trigger("uiShowKeyboardShortcutList");
                        break;
                    case "migrate":
                        $(document).trigger("uiMigrateStart"), TD.controller.stats.navbarMigrate("click")
                }
                this.destroyFlyover()
            }
        }, this.toggleSettingsDropdown = function(t) {
            var e = "tweetdeck" === TD.storage.store.getCurrentAuthType(),
                i = TD.util.isMacApp() ? TD.decider.ACCOUNT_MIGRATION_FOR_MAC : TD.decider.ACCOUNT_MIGRATION,
                s = TD.config.force_enable_migration || TD.decider.get(i),
                n = e && s;
            this.renderDropdown(t, "menus/topbar_menu", {
                debug: Boolean(TD.config.debug_menu),
                account: TD.storage.accountController.getUserIdentifier(),
                isTwoginUser: "twitter" === TD.storage.store.getCurrentAuthType(),
                withStartMigrate: n
            }, {
                position: this.attr.dropdownPositions.verticalRight,
                toggle: !0
            }), n && this.dropdownIsOpen() && TD.controller.stats.navbarMigrate("impression")
        }, this.toggleNavbarWidth = function() {
            var t;
            t = this.isCollapsed ? "full-size" : "condensed", this.trigger("uiNavbarWidthChangeAction", {
                navbarWidth: t
            })
        }, this.handleDataSettings = function(t, e) {
            this.isCollapsed = Boolean("condensed" === e.navbarWidth)
        }, this.handleListItemMouseover = function(t) {
            if (this.isCollapsed && !TD.util.isTouchDevice()) {
                var e = $(t.currentTarget);
                this.renderFlyover(e)
            }
        }, this.handleListItemMouseout = function() {
            this.destroyFlyover()
        }, this.sendBugReport = function() {
            var t = TD.config.fileabug;
            if (t) {
                var e = {
                    tdAccount: TD.storage.store.getTweetdeckAccount(),
                    userAgent: navigator.userAgent,
                    version: TD.version,
                    buildID: TD.gitrevshort
                }, i = TD.ui.template.render("emails/fileabug", e);
                TD.util.openEmail(t, "", i)
            }
        }
    }
    return t(n, e, i, s)
}), define("ui/default_page_layout", ["flight/lib/component"], function(t) {
    function e() {
        this.defaultAttrs({
            jsAppSelector: ".js-app",
            jsAppHeaderSelector: ".js-app-header",
            jsAppHeaderInnerSelector: ".js-app-header-inner",
            jsSearchSelector: ".js-search",
            jsAppContentSelector: ".js-app-content",
            isCondensingClass: "is-condensing",
            isCondensedClass: "is-condensed",
            scrollNoneClass: "scroll-none",
            navbarWidthChangeDuration: 250,
            maxColumnsForAnimation: 5
        });
        var t, e;
        this.setTheme = function(t) {
            var e = $("link");
            _.each(e, function(e) {
                var i = _.contains(e.getAttribute("rel"), "stylesheet"),
                    s = e.getAttribute("title");
                i && s && (e.disabled = !0, s === t && (e.disabled = !1))
            }), $("meta[http-equiv=Default-Style]")[0].content = t
        }, this.setNavbarWidth = function(i) {
            var s, n = this.select("jsAppHeaderInnerSelector"),
                o = this.select("jsAppHeaderSelector"),
                r = "condensed" === i,
                a = TD.storage.clientController.client.getColumnOrder().length,
                c = function() {
                    r && o.removeClass(this.attr.isCondensingClass), t.toggleClass(this.attr.isCondensedClass, r), o.toggleClass(this.attr.isCondensedClass, r)
                }.bind(this);
            if (!this.isNavbarWidthSet || a > this.attr.maxColumnsForAnimation) c(), this.isNavbarWidthSet = !0, this.trigger("uiToggleNavBarWidth");
            else {
                if (!r && !t.hasClass(this.attr.isCondensedClass) || r && t.hasClass(this.attr.isCondensedClass)) return;
                r ? (s = parseInt(n.css("min-width"), 10), o.addClass(this.attr.isCondensingClass)) : (o.removeClass(this.attr.isCondensedClass), s = n.outerWidth()), o.addClass(this.attr.scrollNoneClass), o.animate({
                    width: s
                }, {
                    duration: this.attr.navbarWidthChangeDuration,
                    complete: function() {
                        c(), o.removeClass(this.attr.scrollNoneClass), this.trigger("uiToggleNavBarWidth")
                    }.bind(this),
                    step: function(t) {
                        e.css("left", t)
                    },
                    easing: "easeOutQuad"
                })
            }
        }, this.handleDataSettings = function(t, e) {
            this.setTheme(e.theme), this.setNavbarWidth(e.navbarWidth)
        }, this.after("initialize", function() {
            t = this.select("jsAppSelector"), e = this.select("jsAppContentSelector"), this.isNavbarWidthSet = !1, this.on(document, "dataSettings", this.handleDataSettings)
        })
    }
    return t(e)
}), define("util/keypress", [], function() {
    var t = {};
    return t.eventIsKey = function(t) {
        return t.which > 3
    }, t.isEnter = function(t) {
        return t.which === TD.constants.keyCodes.enter
    }, t.isSpacebar = function(t) {
        return t.which === TD.constants.keyCodes.spacebar
    }, t
}), define("ui/compose/with_account_selector", ["require", "flight/lib/compose", "ui/with_template", "util/keypress"], function(t) {
    var e = t("flight/lib/compose"),
        i = t("ui/with_template"),
        s = t("util/keypress");
    return function() {
        e.mixin(this, [i]), this.defaultAttrs({
            accountListSelector: ".js-account-list",
            accountItemSelector: ".js-account-item",
            isSelectedClass: "is-selected",
            selectedItemSelector: ".js-account-item.is-selected"
        }), this.after("initialize", function() {
            this.on(document, "dataAccounts", this.handleAccountsDataForAccountSelector), this.on(document, "dataDefaultAccount", this.handleDefaultAccountForAccountSelector), this.trigger("uiNeedsAccounts"), this.trigger("uiNeedsDefaultAccount"), this.alwaysSelectOneAccount = !1
        }), this.after("setupDOM", function() {
            this.on("click keypress", {
                accountItemSelector: this.accountSelectorHandleClick
            }), (!TD.util.isTouchDevice() || !TD.decider.get(TD.decider.TOUCHDECK_COMPOSE)) && this.select("accountListSelector").tooltip({
                selector: ".js-show-tip",
                container: "body",
                placement: "bottom",
                suppressFadeOut: !0
            })
        }), this.handleAccountsDataForAccountSelector = function(t, e) {
            var i, s;
            if (e.accounts) {
                i = this.getSelectedAccounts(), s = e.accounts.map(function(t) {
                    var s = i.indexOf(t.accountKey) > -1 || 1 === e.accounts.length;
                    return {
                        accountKey: t.accountKey,
                        screenName: t.screenName,
                        profileImageURL: t.profileImageURL,
                        isSelected: s
                    }
                });
                var n = this.renderTemplate("compose/account_selector", {
                    accounts: s
                });
                this.select("accountListSelector").replaceWith(n), this.trigger("uiSelectedAccounts", {
                    accounts: this.getSelectedAccounts()
                })
            }
        }, this.handleDefaultAccountForAccountSelector = function(t, e) {
            var i = this.getSelectedAccounts(),
                s = 1 === i.length && i[0] === this.defaultAccountKey;
            (0 === i.length || s) && this.setSelectedAccounts([e.accountKey]), this.defaultAccountKey = e.accountKey
        }, this.accountSelectorHandleClick = function(t) {
            if (s.eventIsKey(t) && !s.isSpacebar(t)) return !1;
            var e = $(t.target).closest(this.attr.accountItemSelector);
            (t.shiftKey || this.alwaysSelectOneAccount) && this.select("accountItemSelector").removeClass(this.attr.isSelectedClass), e.toggleClass(this.attr.isSelectedClass), TD.util.isTouchDevice() && TD.decider.get(TD.decider.TOUCHDECK_COMPOSE) && (this.select("accountItemSelector").tooltip("destroy"), e.tooltip({
                trigger: "manual",
                selector: ".js-show-tip",
                container: "body",
                placement: "bottom",
                suppressFadeOut: !0
            }), e.tooltip("show"), setTimeout(function() {
                e.tooltip("destroy")
            }, 1e3)), this.trigger("uiSelectedAccounts", {
                accounts: this.getSelectedAccounts()
            })
        }, this.setSelectedAccounts = function(t) {
            this.select("accountItemSelector").each(function(e, i) {
                var s = $(i),
                    n = t.indexOf(s.data("account-key")) > -1;
                s.toggleClass(this.attr.isSelectedClass, n)
            }.bind(this)), this.trigger("uiSelectedAccounts", {
                accounts: this.getSelectedAccounts()
            })
        }, this.getSelectedAccounts = function() {
            return this.select("selectedItemSelector").map(function() {
                return $(this).data("account-key")
            }).get()
        }
    }
}), define("ui/compose/with_send_button", ["require", "flight/lib/compose", "util/keypress", "ui/compose/with_character_limit", "ui/with_spinner_button"], function(t) {
    var e = t("flight/lib/compose"),
        i = t("util/keypress"),
        s = t("ui/compose/with_character_limit"),
        n = t("ui/with_spinner_button");
    return function() {
        e.mixin(this, [s, n]);
        var t = {
            accountCount: 1,
            messageRecipient: null,
            charCount: 0,
            tweetType: "tweet",
            scheduledDatePassed: !1
        };
        this.defaultAttrs({
            sendButtonSelector: ".js-send-tweet-button",
            composeSuccess: ".js-compose-sending-success",
            buttonErrorMessages: {}
        }), this.before("initialize", function() {
            this.sendButtonTranslatedText = {
                tweet: TD.i("Tweet"),
                reply: TD.i("Tweet"),
                message: TD.i("Send message")
            }
        }), this.after("initialize", function() {
            this.on("uiComposeCharCount", this.sendButtonHandleCharCount), this.on("uiSelectedAccounts", this.handleUiSelectedAccounts), this.on("uiMessageRecipientSet", this.handleMessageRecipientChanged), this.on("uiMessageRecipientUnset", this.handleMessageRecipientChanged), this.on("uiScheduledDatePassed", this.handleScheduledDatePassed), this.on("uiComposeScheduleDate", this.handleComposeScheduleDate), this.attr.buttonErrorMessages = _.defaults({}, this.attr.buttonErrorMessages, {
                tooLong: TD.i("Your Tweet is too long"),
                noAccount: TD.i("You have to select at least one account to tweet from"),
                noRecipient: TD.i("You have to select a recipient for your message"),
                scheduledDatePassed: TD.i("Scheduled time has passed")
            })
        }), this.after("setupDOM", function() {
            this.$sendButton = this.select("sendButtonSelector"), this.$sendButton.addClass("is-disabled"), this.$sendButton.on("click keydown", this.sendButtonHandleClick.bind(this)), this.origTitle = this.$sendButton.attr("title"), this.$sendButton.removeAttr("title")
        }), this.handleScheduledDatePassed = function() {
            t.scheduledDatePassed = !0, this.sendButtonEnabledIfValid()
        }, this.handleComposeScheduleDate = function() {
            t.scheduledDatePassed = !1, this.sendButtonEnabledIfValid()
        }, this.sendButtonShowSending = function() {
            this.sendButtonSending = !0, this.select("composeSuccess").addClass("is-hidden"), this.$sendButton.addClass("text-hidden is-disabled"), this.spinnerButtonEnable(), this.$sendButton.tooltip("hide")
        }, this.sendButtonShowSuccess = function() {
            this.spinnerButtonDisable(), this.$sendButton.addClass("text-hidden is-disabled"), this.select("composeSuccess").removeClass("is-hidden")
        }, this.sendButtonShowText = function() {
            this.spinnerButtonDisable(), this.select("composeSuccess").addClass("is-hidden"), this.$sendButton.removeClass("text-hidden is-disabled"), this.sendButtonSending = !1
        }, this.sendButtonSetText = function(e, i) {
            var s, n, o, r = new Date;
            if (t.tweetType = e, i) switch (n = r.toDateString() === i.toDateString(), o = n ? TD.util.prettyTimeOfDayString(i) : TD.util.prettyDateString(i), e) {
                case "tweet":
                case "reply":
                    s = n ? TD.i("Tweet at {{time}}", {
                        time: o
                    }) : TD.i("Tweet on {{date}}", {
                        date: o
                    });
                    break;
                case "message":
                    s = n ? TD.i("Send at {{time}}", {
                        time: o
                    }) : TD.i("Send on {{date}}", {
                        date: o
                    })
            } else s = this.sendButtonTranslatedText[e];
            this.$sendButton.text(s), this.sendButtonEnabledIfValid()
        }, this.sendButtonHandleCharCount = function(e, i) {
            e.stopPropagation(), t.charCount = i.charCount, this.sendButtonEnabledIfValid()
        }, this.handleUiSelectedAccounts = function(e, i) {
            e.stopPropagation(), t.accountCount = i.accounts.length, this.sendButtonEnabledIfValid()
        }, this.handleMessageRecipientChanged = function(e, i) {
            t.messageRecipient = (i || {}).recipient, this.sendButtonEnabledIfValid()
        }, this.sendButtonHandleClick = function(t) {
            (!i.eventIsKey(t) || i.isEnter(t) || i.isSpacebar(t)) && this.trigger("uiComposeSendTweet", {})
        }, this.sendButtonIsEnabled = function() {
            return !this.$sendButton.is(":disabled,.is-disabled")
        }, this.getButtonErrorTooltip = function() {
            var e = null;
            return 0 === t.accountCount ? e = this.attr.buttonErrorMessages.noAccount : this.isOverCharLimit(t.charCount) ? e = this.attr.buttonErrorMessages.tooLong : "message" !== t.tweetType || t.messageRecipient ? t.scheduledDatePassed && (e = this.attr.buttonErrorMessages.scheduledDatePassed) : e = this.attr.buttonErrorMessages.noRecipient, e
        }, this.sendButtonEnabledIfValid = function() {
            var e = this.getButtonErrorTooltip(),
                i = this.isWithinCharLimit(t.charCount) && !e && !this.sendButtonSending;
            this.$sendButton.attr("data-original-title", e || this.origTitle), this.$sendButton.toggleClass("is-disabled", !i)
        }, this.sendButtonSetDisabled = function() {
            this.$sendButton.addClass("is-disabled")
        }
    }
}), define("data/with_bitly", [], function() {
    return function() {
        var t;
        this.after("initialize", function() {
            this.on(document, "dataSettingsValues", function(e, i) {
                i.link_shortener && (t = i.link_shortener)
            }.bind(this)), this.trigger("uiNeedsSettingsValues", {
                keys: ["link_shortener"]
            })
        }), this.maybeShortenTextLinks = function(e, i) {
            "bitly" === t ? this.bitlyShortenTextLinks(e, i) : i(e)
        }, this.bitlyShortenTextLinks = function(t, e) {
            var i = TD.services.bitly.shortenTextLinks(t);
            i.addCallback(e)
        }
    }
}), define("ui/compose/with_send_tweet", ["require", "flight/lib/compose", "data/with_bitly", "data/with_client", "ui/with_api_errors"], function(t) {
    var e = t("flight/lib/compose"),
        i = t("data/with_bitly"),
        s = t("data/with_client"),
        n = t("ui/with_api_errors");
    return function() {
        e.mixin(this, [i, s, n]);
        var t = [],
            o = null;
        this.after("initialize", function() {
            this.on(document, "dataTweetSent", this.handleDataTweetSent), this.on(document, "dataTweetError", this.handleDataTweetError), this.on(document, "dataScheduledTweetsSent", this.handleDataScheduledTweetsSent), this.on(document, "dataScheduledTweetsError", this.handleDataScheduledTweetsError)
        }), this.resetSendTweet = function() {
            t = [], o = null
        }, this.sendTweet = function(t) {
            this.trigger("uiComposeTweetSending"), this.resetSendTweet(), o = t, this.maybeShortenTextLinks(t.text, function(e) {
                t.text = e, this.actuallySendTweet(t)
            }.bind(this))
        }, this.actuallySendTweet = function(t) {
            var e = t.from.map(function(e) {
                return $.extend({}, t, {
                    accountKey: e
                })
            });
            t.scheduledDate ? this.trigger("uiSendScheduledTweets", {
                requestId: t.requestId,
                requests: e,
                scheduledDate: t.scheduledDate,
                tokenToDelete: t.scheduledId,
                metadata: t.metadata
            }) : (e.forEach(function(t) {
                this.trigger("uiSendTweet", t)
            }, this), this.trigger("uiSendScheduledTweets", {
                requestId: t.requestId,
                requests: [],
                scheduledDate: t.scheduledDate,
                tokenToDelete: t.scheduledId,
                metadata: t.metadata
            }))
        }, this.handleDataTweetSent = function(e, i) {
            var s;
            o && i.request.requestId === o.requestId && (s = o.from.indexOf(i.request.accountKey), s > -1 && o.from.splice(s, 1), 0 === o.from.length && (0 === t.length ? this.triggerTweetSuccess() : this.triggerTweetError()))
        }, this.handleDataScheduledTweetsSent = function(t, e) {
            o && e.request.requestId === o.requestId && this.triggerTweetSuccess()
        }, this.handleDataTweetError = function(e, i) {
            var s;
            o && i.request.requestId === o.requestId && (s = o.from.indexOf(i.request.accountKey), s > -1 && o.from.splice(s, 1), t.push(i), 0 === o.from.length && this.triggerTweetError())
        }, this.handleDataScheduledTweetsError = function(t, e) {
            var i, s, n;
            if (o && e.request.requestId === o.requestId) {
                if (e.response.humanReadableMessage) i = e.response.humanReadableMessage;
                else {
                    try {
                        s = JSON.parse(e.response.req.responseText)
                    } catch (r) {}
                    n = s && s.error ? s.error : e.response.req.status, i = TD.i("Scheduling failed. Please try again. ({{message}})", {
                        message: n
                    })
                }
                TD.controller.progressIndicator.addMessage(i), this.triggerTweetError()
            }
        }, this.showTweetErrors = function(t) {
            if (0 !== t.length) {
                var e = t.map(function(t) {
                    var e, i, s, n = {};
                    try {
                        n = JSON.parse(t.response.responseText).errors[0]
                    } catch (o) {}
                    switch (e = this.getApiErrorMessage(n), i = this.getAccountData(t.request.accountKey), s = i ? i.screenName : "unknown account", this.tweetType) {
                        case "message":
                            return TD.i("Message from @{{screenName}} failed: {{message}}", {
                                screenName: s,
                                message: e
                            });
                        default:
                            return TD.i("Tweet from @{{screenName}} failed: {{message}}", {
                                screenName: s,
                                message: e
                            })
                    }
                }, this);
                TD.controller.progressIndicator.addMessage(e.join("\n"))
            }
        }, this.triggerTweetSuccess = function() {
            this.trigger("uiComposeTweetSent")
        }, this.triggerTweetError = function() {
            this.showTweetErrors(t), this.trigger("uiComposeTweetError", {
                errors: o.scheduledDate ? null : t
            })
        }
    }
}), define("ui/compose/inline_compose", ["require", "flight/lib/component", "ui/compose/with_account_selector", "ui/compose/with_character_count", "data/with_client", "ui/with_column_selectors", "ui/compose/with_compose_text", "ui/with_focus", "ui/compose/with_send_button", "ui/compose/with_send_tweet", "ui/with_template"], function(t) {
    function e() {
        var t, e, i;
        this.defaultAttrs({
            panelCloseDelay: 500,
            inlineReplySelector: ".js-inline-reply",
            closeSelector: ".js-inline-compose-close",
            popSelector: ".js-inline-compose-pop",
            addImageSelector: ".js-inline-compose-add-image",
            accountSelector: ".js-inline-reply .js-account-item",
            tweetSelector: ".js-tweet",
            tweetActionsSelector: ".js-tweet-actions",
            replyActionSelector: ".js-reply-action",
            detailViewInlineSelector: ".js-detail-view-inline",
            pagingEasingFunction: "easeOutQuad",
            draftCacheSize: 50
        }), this.after("initialize", function() {
            this.on(document, "uiInlineComposeTweet", this.handleUiInlineComposeTweet), this.on(document, "uiDockedComposeTweet", this.closeInlineCompose), this.on(document, "uiComposeClose", this.closeInlineCompose), this.on("uiComposeSendTweet", this.handleUiComposeSendTweet), this.on("uiComposeTweetSending", this.enterSendingState), this.on("uiComposeTweetSent", this.enterSuccessState), this.on("uiComposeTweetError", this.enterErrorState), this.on("uiComposeCharCount", _.throttle(this.handleTextChange, 1e3)), this.on(TD.ui.main.TRANSITION_END_EVENTS, {
                inlineReplySelector: this.handleAnimationEnd
            }), this.draftCache = new TD.cache.LRUQueue(this.attr.draftCacheSize), this.setupDOM()
        }), this.setupDOM = function() {
            this.select("closeSelector").on("click", this.handleCloseClick.bind(this)), this.select("popSelector").on("click", this.handlePopClick.bind(this)), this.select("addImageSelector").on("click", this.handleAddImageClick.bind(this)), this.select("accountSelector").on("click", this.handlePopClick.bind(this))
        }, this.handleUiInlineComposeTweet = function(i, s) {
            return t = s || {}, t.singleFrom = [s.from[0]], $(s.element).find(this.attr.inlineReplySelector).length > 0 ? (this.closeInlineCompose(), void 0) : (e && this.closeInlineCompose(), this.focusRequest(), this.setupInlineCompose(t), void 0)
        }, this.setupInlineCompose = function(t) {
            e = t.element, e.find(".js-tweet-actions").addClass("is-visible"), e.find(".js-detail-view-inline").addClass("is-hidden"), e.find(".js-reply-action").addClass("is-selected");
            var s = this.getAccountData(t.from);
            i = this.renderTemplate("compose/compose_inline_reply", {
                account: s,
                isMac: "osx" === TD.util.getOSName()
            }), e.find(this.attr.tweetSelector).after(i), this.setupDOM(), this.setSelectedAccounts(t.from);
            var n = this.composeTextComputeRepliesAndMentions([t.inReplyTo.user.screenName], t.mentions, s.screenName),
                o = this.getDraftText();
            o && o !== n.totalString ? (this.composeTextSetText(o), this.composeTextSetCaretToEnd()) : (this.composeTextSetText(n.totalString), this.composeTextSetSelection(n.startIndex, n.endIndex)), _.defer(function() {
                i.removeClass("is-inline-inactive"), Modernizr.csstransitions || this.handleAnimationEnd({
                    target: i.get(0)
                })
            }.bind(this)), i.on("click", function(t) {
                t.stopPropagation()
            });
            var r = i.parents(".js-column");
            r.hasClass("js-column-state-detail-view") || TD.ui.columns.lockColumnToElement(r.attr("data-column"), e)
        }, this.closeInlineCompose = function(t, s) {
            s && s.keyboardShortcut && !this.hasFocus || e && (this.saveDraftText(this.composeTextGetText()), this.closeAndRemovePanels(), this.focusRelease(), Modernizr.csstransitions || this.handleAnimationEnd({
                target: i.get(0)
            }))
        }, this.closeAndRemovePanels = function() {
            i && this.select("inlineReplySelector").removeClass("is-inline-active").css({
                overflow: "hidden"
            }).addClass("is-inline-inactive")
        }, this.tearDownInlineCompose = function() {
            this.closeAndRemovePanels(), this.deleteDraftText(), this.sendButtonShowText(), this.focusRelease(), e = null
        }, this.handleAnimationEnd = function(t) {
            var e = $(t.target);
            if (e.hasClass("is-inline-inactive")) {
                var s = e.parents(".js-column").attr("data-column"),
                    n = e.parents(".js-stream-item-content");
                TD.ui.columns.unlockColumnFromElement(s), n.find(this.attr.tweetActionsSelector).removeClass("is-visible"), n.find(this.attr.replyActionSelector).removeClass("is-selected"), n.find(this.attr.detailViewInlineSelector).removeClass("is-hidden"), e.remove()
            } else this.scrollColumnIfRequired(), i.css({
                overflow: "visible"
            })
        }, this.scrollColumnIfRequired = function() {
            var t, e = i.parents(".js-column").attr("data-column"),
                s = this.getColumnScrollContainerByKey(e),
                n = i.offset().top + 300 - s.height();
            if (n > 0) {
                t = s.scrollTop();
                var o = TD.ui.columns.calculateScrollDuration(n, 50, 750);
                s.stop().animate({
                    scrollTop: t + n
                }, o, this.attr.pagingEasingFunction)
            }
        }, this.handleUiComposeSendTweet = function(e) {
            if (e.stopPropagation(), (!e.keyboardShortcut || this.hasFocus) && this.sendButtonIsEnabled()) {
                var i = {
                    requestId: _.uniqueId("sendTweet"),
                    text: this.composeTextGetText(),
                    inReplyToStatusId: t.inReplyTo.id,
                    from: this.getSelectedAccounts(),
                    type: "reply",
                    inline: !0
                };
                this.sendTweet(i)
            }
        }, this.enterSendingState = function(t) {
            t.stopPropagation(), this.disablePanelInputs(), this.sendButtonShowSending()
        }, this.enterSuccessState = function(t) {
            t.stopPropagation(), this.sendButtonShowSuccess(), this.deleteDraftText(), setTimeout(this.tearDownInlineCompose.bind(this), this.attr.panelCloseDelay)
        }, this.enterErrorState = function(t) {
            t.stopPropagation(), this.sendButtonShowText(), this.enablePanelInputs()
        }, this.enablePanelInputs = function() {
            this.sendButtonEnabledIfValid(), this.composeTextSetDisabled(!1)
        }, this.disablePanelInputs = function() {
            this.sendButtonSetDisabled(), this.composeTextSetDisabled(!0)
        }, this.getDraftText = function() {
            return this.draftCache.get(e.attr("data-key"))
        }, this.saveDraftText = function(t) {
            var i = e.attr("data-key");
            i && this.draftCache.enqueue(i, t)
        }, this.deleteDraftText = function() {
            this.draftCache.dequeue(e.attr("data-key"))
        }, this.handleTextChange = function() {
            this.saveDraftText(this.composeTextGetText())
        }, this.handleCloseClick = function() {
            this.closeInlineCompose()
        }, this.handlePopClick = function() {
            var e = this.composeTextGetText();
            this.deleteDraftText(), this.trigger("uiDockedComposeTweet", {
                type: "reply",
                text: e,
                from: t.from,
                mentions: t.mentions,
                inReplyTo: t.inReplyTo,
                popFromInline: !0
            })
        }, this.handleAddImageClick = function() {
            this.handlePopClick(), this.trigger("uiComposeAddImageClick")
        }
    }
    var i = t("flight/lib/component"),
        s = t("ui/compose/with_account_selector"),
        n = t("ui/compose/with_character_count"),
        o = t("data/with_client"),
        r = t("ui/with_column_selectors"),
        a = t("ui/compose/with_compose_text"),
        c = t("ui/with_focus"),
        h = t("ui/compose/with_send_button"),
        l = t("ui/compose/with_send_tweet"),
        u = t("ui/with_template");
    return i(e, s, n, o, r, a, c, h, l, u)
}), define("ui/compose/compose_controller", ["require", "flight/lib/component", "ui/compose/inline_compose"], function(t) {
    function e() {
        var t, e, i;
        this.after("initialize", function() {
            this.on(document, "uiToggleDockedCompose", this.handleAnimateDockedCompose), this.on(document, "uiComposeTweet", this.handleUiComposeTweet), this.on(document, "uiToggleDockedCompose", this.handleToggleDocked), this.on(document, "uiToggleInlineCompose", this.handleToggleInline), this.on("uiInlineComposeState", function(t, e) {
                this.trigger("uiDockedComposeTweet", e)
            })
        }), this.handleUiComposeTweet = function(n, o) {
            o = o || {};
            var r = function(t) {
                return e && "tweet" === t.type && !t.text && !t.replyTo
            };
            t ? this.trigger("uiDockedComposeTweet", o) : "reply" === o.type && o.element && o.element.closest(".js-column").length > 0 ? (i || (s.attachTo(this.$node, {
                composeTextSelector: ".is-inline-active .js-compose-text",
                accountListSelector: ".is-inline-active .js-account-list",
                accountItemSelector: ".is-inline-active .js-account-item",
                selectedItemSelector: ".is-inline-active .js-account-item.is-selected",
                sendButtonSelector: ".is-inline-active .js-send-tweet-button",
                composeSuccess: ".is-inline-active .js-compose-sending-success",
                charCountSelector: ".is-inline-active .js-character-count"
            }), i = !0), this.trigger("uiInlineComposeTweet", o)) : r(o) ? this.trigger("uiNeedsInlineComposeState") : this.trigger("uiDockedComposeTweet", o)
        }, this.handleAnimateDockedCompose = function(t, e) {
            this.$node.toggleClass("hide-detail-view-inline", e.opening)
        }, this.handleToggleDocked = function(e, i) {
            t = i.opening
        }, this.handleToggleInline = function(t, i) {
            e = i.opening
        }
    }
    var i = t("flight/lib/component"),
        s = t("ui/compose/inline_compose");
    return i(e)
}), define("ui/drag_drop/drag_drop_controller", ["require", "flight/lib/component", "ui/drag_drop/with_drag_drop"], function(t) {
    function e() {
        this.after("initialize", function() {
            this.on("dragstart", function(t) {
                this.trigger(document, "uiDragStart", this.extractDataFromEvent(t))
            }), this.on("dragend", function(t) {
                this.trigger(document, "uiDragEnd", this.extractDataFromEvent(t))
            })
        })
    }
    var i = t("flight/lib/component"),
        s = t("ui/drag_drop/with_drag_drop");
    return i(e, s)
}), define("ui/with_drag_handle", ["require", "scripts/sync/util"], function(t) {
    function e() {
        this.setupDragHandle = function(t) {
            ["boundary", "draggable", "handle"].forEach(function(e) {
                i.assert(t[e], "Required parameter " + e + " omitted")
            }), t.draggable.draggable({
                boundary: t.boundary,
                handle: t.handle
            }).on("start.draggable", function() {
                t.draggable.css({
                    position: "absolute",
                    top: t.draggable.offset().top,
                    left: t.draggable.offset().left
                }), t.boundary.addClass("is-dragging")
            }).on("drop.draggable", function() {
                t.boundary.removeClass("is-dragging")
            })
        }
    }
    var i = t("scripts/sync/util");
    return e
}), define("ui/modal/modal_controller", ["require", "flight/lib/component", "ui/with_template", "ui/with_drag_handle"], function(t) {
    function e() {
        this.defaultAttrs({
            modalContextTemplate: "modal/modal_context",
            modalContextSelector: ".js-modal-context",
            modalInnerSelector: ".js-modal-inner",
            modalContentSelector: ".js-modal-content",
            modalClickTrapSelector: ".js-click-trap",
            modalDismissSelector: ".js-dismiss",
            modalDragHandleSelector: ".js-drag-handle",
            modalOptions: {
                withCenteredFooter: !1,
                withChrome: !0,
                withClickTrap: !0,
                withDismissButton: !0,
                withDoneButton: !1,
                withDraggable: !0,
                withDragHandle: !0,
                withFooter: !0,
                withHeader: !0,
                withBorder: !0,
                withClasses: [],
                withContentClasses: [],
                withOverlayClasses: []
            }
        }), this.after("initialize", function() {
            this.on(document, "uiNeedsModalContext", this.handleCreateModalContext), this.on("uiModalShowing", {
                modalContextSelector: this.handleModalShowing
            }), this.on("uiModalHiding", {
                modalContextSelector: this.handleModalHiding
            }), this.on("click", {
                modalDismissSelector: this.handleModalDismiss,
                modalClickTrapSelector: this.handleModalContextClick
            })
        }), this.handleCreateModalContext = function(t, e) {
            var i = _.defaults(e || {}, this.attr.modalOptions),
                s = this.createModalContext(i),
                n = s.find(this.attr.modalInnerSelector),
                o = n.find(this.attr.modalContentSelector);
            s.addClass("is-hidden").addClass(i.withOverlayClasses.join(" ")), n.addClass(i.withClasses.join(" ")), o.addClass(i.withContentClasses.join(" ")), this.$node.append(s), this.trigger("uiModalContext", {
                id: i.id,
                $node: s.find(this.attr.modalContentSelector)
            }), i.withDraggable && this.setupDragHandle({
                draggable: n,
                handle: n.find(this.attr.modalDragHandleSelector),
                boundary: s
            })
        }, this.createModalContext = function(t) {
            return this.renderTemplate(this.attr.modalContextTemplate, t)
        }, this.handleModalShowing = function(t, e) {
            this.select("modalContextSelector").addClass("is-hidden"), $(e.el).removeClass("is-hidden")
        }, this.handleModalHiding = function(t, e) {
            $(e.el).remove()
        }, this.handleModalDismiss = function() {
            this.closeModals()
        }, this.closeModals = function() {
            this.trigger("uiCloseModal")
        }, this.handleModalContextClick = function(t, e) {
            var i = $(e.el),
                s = $(t.target);
            s.closest(this.attr.modalInnerSelector, i).length || this.closeModals()
        }
    }
    var i = t("flight/lib/component"),
        s = t("ui/with_template"),
        n = t("ui/with_drag_handle");
    return i(e, s, n)
}), define("ui/migrate_education", ["require", "flight/lib/component", "ui/with_template", "ui/modal/with_modalable"], function(t) {
    function e() {
        this.defaultAttrs({
            template: "login/migrate_education",
            migrateContinueSelector: ".js-migrate-continue",
            migrateCancelSelector: ".js-migrate-cancel",
            tweetDeckAccount: null
        }), this.after("initialize", function() {
            this.on("click", {
                migrateContinueSelector: this.handleMigrateContinue,
                migrateCancelSelector: this.handleMigrateCancel
            }), this.render(this.attr.template, {
                tweetDeckAccount: this.attr.tweetDeckAccount
            })
        }), this.handleMigrateCancel = function() {
            this.trigger("uiMigrateEducationCancel"), this.teardown()
        }, this.handleMigrateContinue = function() {
            this.trigger("uiMigrateEducationContinue"), this.teardown()
        }
    }
    var i = t("flight/lib/component"),
        s = t("ui/with_template"),
        n = t("ui/modal/with_modalable");
    return i(e, s, n)
}), define("ui/migrate_risk", ["require", "flight/lib/component", "ui/with_template", "ui/modal/with_modalable"], function(t) {
    function e() {
        this.defaultAttrs({
            template: "login/migrate_risk",
            migrateContinueSelector: ".js-migrate-continue",
            migrateCancelSelector: ".js-migrate-cancel",
            migrateAccountTypeInputSelector: ".js-migrate-account-type-input",
            migrateAccountTypeInputCheckedSelector: ".js-migrate-account-type-input:checked"
        }), this.after("initialize", function() {
            this.accountType = null, this.on("click", {
                migrateContinueSelector: this.handleMigrateContinue,
                migrateCancelSelector: this.handleMigrateCancel
            }), this.on("change", {
                migrateAccountTypeInputSelector: this.handleAccountTypeChange
            }), this.render(this.attr.template)
        }), this.handleAccountTypeChange = function() {
            this.select("migrateContinueSelector").prop("disabled", !1)
        }, this.getAccountType = function() {
            return this.select("migrateAccountTypeInputCheckedSelector").val()
        }, this.handleMigrateCancel = function() {
            this.trigger("uiMigrateRiskCancel"), this.teardown()
        }, this.handleMigrateContinue = function() {
            if (!this.select("migrateContinueSelector").prop("disabled")) {
                var t = "uiMigrateRiskSingleContinue",
                    e = this.getAccountType();
                "multiple" === e && (t = "uiMigrateRiskMultipleContinue"), this.trigger(t, {
                    accountType: e
                }), this.select("migrateContinueSelector").prop("disabled", !0), this.select("migrateAccountTypeInputSelector").prop("disabled", !0)
            }
        }
    }
    var i = t("flight/lib/component"),
        s = t("ui/with_template"),
        n = t("ui/modal/with_modalable");
    return i(e, s, n)
}), define("ui/migrate_risk_agreement", ["require", "flight/lib/component", "ui/with_template", "ui/modal/with_modalable"], function(t) {
    function e() {
        this.defaultAttrs({
            template: "login/migrate_risk_agreement",
            migrateContinueSelector: ".js-migrate-continue",
            migrateCancelSelector: ".js-migrate-cancel"
        }), this.after("initialize", function() {
            this.accountType = null, this.on("click", {
                migrateContinueSelector: this.handleMigrateContinue,
                migrateCancelSelector: this.handleMigrateCancel
            }), this.render(this.attr.template)
        }), this.handleMigrateCancel = function() {
            this.trigger("uiMigrateRiskAgreementCancel"), this.teardown()
        }, this.handleMigrateContinue = function() {
            this.select("migrateContinueSelector").prop("disabled") || (this.trigger("uiMigrateRiskAgreementContinue"), this.select("migrateContinueSelector").prop("disabled", !0), this.select("migrateCancelSelector").prop("disabled", !0))
        }
    }
    var i = t("flight/lib/component"),
        s = t("ui/with_template"),
        n = t("ui/modal/with_modalable");
    return i(e, s, n)
}), define("ui/migrate_progress", ["require", "flight/lib/component", "ui/with_template", "ui/modal/with_modalable", "util/wait_at_least"], function(t) {
    function e() {
        this.defaultAttrs({
            template: "login/migrate_progress",
            transientErrorTemplate: "login/migrate_progress_transient_error",
            mergeErrorTemplate: "login/migrate_progress_merge_error",
            successTemplate: "login/migrate_progress_success",
            minWaitTime: 5e3,
            migrateProgressClass: "migrate-progress",
            migrateInProgressClass: "migrate-in-progress",
            migrateProgressSuccessClass: "migrate-progress-success",
            migrateProgressPreviewSelector: ".js-migrate-progress-preview",
            migrateProgressNextSelector: ".js-migrate-progress-next",
            migrateProgressDoneSelector: ".js-dismiss",
            migrateProgressErrorExitSelector: ".js-migrate-progress-error-exit",
            twitterAccountUsername: "",
            numAccountsAdded: 0,
            numColumnsAdded: 0,
            numScheduledAdded: 0,
            numMuteItemsAdded: 0
        }), this.after("initialize", function() {
            this.on("click", {
                migrateProgressErrorExitSelector: this.handleMigrateProgressExit,
                migrateProgressNextSelector: this.migrateProgressNext,
                migrateProgressDoneSelector: this.handleMigrateProgressDoneClick
            }), this.$node.addClass(this.attr.migrateProgressClass);
            var t = this.attr.template;
            this.attr.error ? t = "TransientError" === this.attr.error.data.error ? this.attr.transientErrorTemplate : this.attr.mergeErrorTemplate : (this.on(document, "TD.ready uiMigrateProgressAppReady", this.handleAppReady), this.initTimestamp = Date.now(), this.$node.addClass(this.attr.migrateInProgressClass)), this.render(t, {
                error: this.attr.error,
                twitterAccountUsername: this.attr.twitterAccountUsername,
                numAccountsAdded: this.attr.numAccountsAdded,
                numColumnsAdded: this.attr.numColumnsAdded,
                numScheduledAdded: this.attr.numScheduledAdded,
                numMuteItemsAdded: this.attr.numMuteItemsAdded
            })
        }), this.handleAppReady = function() {
            o(this.attr.minWaitTime, this.initTimestamp, function() {
                this.$node.removeClass(this.attr.migrateInProgressClass), this.migrateProgressNext()
            }, this)
        }, this.handleMigrateProgressExit = function() {
            this.trigger("uiMigrateProgressCancel")
        }, this.migrateProgressNext = function() {
            this.trigger("uiMigrateProgressNext");
            var t = TD.storage.accountController.getAccountFromId(TD.storage.store.getTwitterLoginAccount().getUserID()),
                e = {
                    id: t.getUserID(),
                    screenName: t.getUsername(),
                    name: t.getName(),
                    profileImageURL: t.getProfileImageURL(),
                    isVerified: !1
                }, i = TD.storage.accountController.getAccountsForService("twitter").length;
            this.$node.addClass(this.attr.migrateProgressSuccessClass), this.render(this.attr.successTemplate, {
                twitterProfile: e,
                hasMultipleAccounts: i > 1
            })
        }, this.handleMigrateProgressDoneClick = function() {
            this.trigger("uiMigrateProgressDone")
        }
    }
    var i = t("flight/lib/component"),
        s = t("ui/with_template"),
        n = t("ui/modal/with_modalable"),
        o = t("util/wait_at_least");
    return i(e, s, n)
}), define("ui/migrate_controller", ["require", "flight/lib/component", "ui/with_template", "ui/modal/with_show_modal", "util/wait_at_least", "ui/migrate_education", "ui/migrate_risk", "ui/migrate_risk_agreement", "ui/migrate_progress"], function(t) {
    function e() {
        this.defaultAttrs({
            minProgressWaitTime: 1e3,
            minCompleteWaitTime: 3e3,
            modalConfig: {
                withHeader: !1,
                withFooter: !1,
                withDraggable: !1,
                withDragHandle: !1,
                withDismissButton: !1,
                withChrome: !1,
                withBorder: !1,
                withClickTrap: !1
            },
            riskAgreementModalConfig: {
                withOverlayClasses: ["overlay-opaque"]
            }
        }), this.after("initialize", function() {
            this.on(document, "uiMigrateStart", this.handleUiMigrateStart), this.on(document, "uiMigrateEducationContinue", this.handleUiMigrateEducationContinue), this.on(document, "uiMigrateEducationCancel", this.handleUiMigrateEducationCancel), this.on(document, "uiMigrateRiskSingleContinue", this.handleUiRiskSingleContinue), this.on(document, "uiMigrateRiskMultipleContinue", this.handleUiRiskMultipleContinue), this.on(document, "uiMigrateRiskCancel", this.handleUiRiskCancel), this.on(document, "uiMigrateRiskAgreementContinue", this.handleUiRiskAgreementContinue), this.on(document, "uiMigrateRiskAgreementCancel", this.handleUiRiskAgreementCancel), this.on(document, "uiMigrateProgressNext", this.handleMigrateProgressNext), this.on(document, "uiMigrateProgressDone", this.handleMigrateProgressDone), this.on(document, "uiMigrateProgressCancel", this.handleMigrateProgressCancel), this.on(document, "dataNeedsMigrateCompleteConfirmation", this.handleDataNeedsMigrateCompleteConfirmation), this.on(document, "uiMigrateSuccess", function(t, e) {
                TD.controller.stats.migrateStartflow("migrate_progress", "impression"), this.migrateSuccessTimestamp = Date.now(), this.showModal(h, {
                    twitterAccountUsername: TD.storage.store.getTwitterLoginAccount().getUsername(),
                    numAccountsAdded: e.num_accounts_added,
                    numColumnsAdded: e.num_columns_added,
                    numScheduledAdded: e.num_scheduled_added,
                    numMuteItemsAdded: e.num_mute_items_added
                }, this.attr.modalConfig)
            }), this.on(document, "uiMigrateError", function(t, e) {
                TD.controller.stats.migrateStartflow("migrate_progress", "impression", !0), this.showModal(h, {
                    error: e
                }, this.attr.modalConfig)
            })
        }), this.handleUiMigrateStart = function() {
            this.showModal(r, {
                tweetDeckAccount: TD.storage.store.getTweetdeckAccount()
            }, this.attr.modalConfig), TD.controller.stats.migrateAppflow("migrate_education", "impression")
        }, this.handleUiMigrateEducationContinue = function() {
            this.showModal(a, {}, _.defaults(this.attr.riskAgreementModalConfig, this.attr.modalConfig)), TD.controller.stats.migrateAppflow("migrate_education", "next"), TD.controller.stats.migrateAppflow("migrate_risk", "impression")
        }, this.handleUiMigrateEducationCancel = function() {
            TD.controller.stats.migrateAppflow("migrate_education", "cancel")
        }, this.handleUiRiskSingleContinue = function() {
            this.riskAccountType = "single", TD.controller.stats.migrateAppflow("migrate_risk", "next"), this.handleUiRiskAgreementContinue()
        }, this.handleUiRiskMultipleContinue = function() {
            this.riskAccountType = "multiple", this.showModal(c, {}, _.defaults(this.attr.riskAgreementModalConfig, this.attr.modalConfig)), TD.controller.stats.migrateAppflow("migrate_risk", "next"), TD.controller.stats.migrateAppflow("migrate_risk_agreement", "impression")
        }, this.handleUiRiskCancel = function() {
            TD.controller.stats.migrateAppflow("migrate_risk", "cancel")
        }, this.handleUiRiskAgreementContinue = function() {
            this.trigger("uiMigrateActive", {
                accountType: this.riskAccountType
            }), TD.controller.stats.migrateAppflow("migrate_risk_agreement", "next"), TD.controller.init.signOut()
        }, this.handleUiRiskAgreementCancel = function() {
            TD.controller.stats.migrateAppflow("migrate_risk_agreement", "cancel")
        }, this.handleMigrateProgressNext = function() {
            TD.controller.stats.migrateStartflow("migrate_progress", "next"), TD.controller.stats.migrateStartflow("migrate_progress_success", "impression")
        }, this.handleMigrateProgressDone = function() {
            TD.controller.stats.migrateStartflow("migrate_progress_success", "next")
        }, this.handleMigrateProgressCancel = function() {
            TD.controller.stats.migrateStartflow("migrate_progress", "previous"), TD.storage.store.setCurrentAuthType("tweetdeck"), this.trigger("uiMigrateCancel", {
                clearMigrateData: !0
            })
        }, this.handleDataNeedsMigrateCompleteConfirmation = function() {
            o(this.attr.minProgressWaitTime, this.migrateSuccessTimestamp, function() {
                this.trigger("uiMigrateCompleteConfirmation")
            }, this)
        }
    }
    var i = t("flight/lib/component"),
        s = t("ui/with_template"),
        n = t("ui/modal/with_show_modal"),
        o = t("util/wait_at_least"),
        r = t("ui/migrate_education"),
        a = t("ui/migrate_risk"),
        c = t("ui/migrate_risk_agreement"),
        h = t("ui/migrate_progress");
    return i(e, s, n)
}), define("ui/actions_menu", ["require", "flight/lib/component", "ui/with_dropdown"], function(t) {
    function e() {
        this.defaultAttrs({
            isActionsMenu: !0,
            profileActionsButtonSelector: ".js-user-actions-menu",
            chirpActionsContainerSelector: ".js-tweet-actions",
            chirpActionsSelector: ".js-tweet-actions",
            profileMenuTemplate: "menus/actions",
            chirpMenuTemplate: "menus/actions",
            dmMenuTemplate: "menus/actions_directmessage",
            menuPosition: "pos-l"
        }), this.after("initialize", function() {
            this.state = {}, this.around("handleDocumentClick", this.maybeStopDocumentClick), this.after("renderDropdown", this.addActionsMenuClickHandler), this.before("teardownCurrentDropdown", this.removeActionsMenuClickHandler), this.before("teardownCurrentDropdown", this.removeForcedActionsMenuContainerVisibility), this.on("uiDetailViewClosing uiMediaGalleryClosing uiTwitterProfileClosing", this.teardownCurrentDropdown), this.on("click", {
                profileActionsButtonSelector: this.handleUserButtonClick
            }), this.on("uiShowActionsMenu", this.handleShowActionsMenu)
        }), this.addActionsMenuClickHandler = function() {
            this.currentDropdown && this.on(this.currentDropdown.$el, "click", this.handleActionsMenuClick)
        }, this.removeActionsMenuClickHandler = function() {
            this.currentDropdown && this.off(this.currentDropdown.$el, "click", this.handleActionsMenuClick)
        }, this.removeForcedActionsMenuContainerVisibility = function() {
            this.state.$actionsMenuContainer && (this.state.$actionsMenuContainer.removeClass("is-visible"), this.state.$actionsMenuContainer = null)
        }, this.maybeStopDocumentClick = function(t, e) {
            if (this.dropdownIsOpen()) {
                var i = $(e.target).closest(this.attr.profileActionsButtonSelector);
                0 === i.length && t(e)
            }
        }, this.showActionsMenu = function(t, e, i) {
            var s, n, o, r, a, c = 1 === TD.storage.accountController.getAccountsForService("twitter").length,
                h = t.data("actions-menu-position");
            i ? (i.getRelatedTweet && (i = i.getRelatedTweet() || i), s = !c, n = i.getMedia().some(function(t) {
                return t.flaggedNSFW
            }), o = i instanceof TD.services.TwitterDirectMessage, r = o ? this.attr.dmMenuTemplate : this.attr.chirpMenuTemplate, e = i.getMainUser()) : r = this.attr.profileMenuTemplate, a = TD.controller.filterManager.hasFilterApplied("sender", e.screenName), this.renderDropdown(t, r, {
                showFavorite: s,
                isFlagged: n,
                isMuted: a,
                user: e,
                chirp: i,
                isSingleAccount: c
            }, {
                toggle: !0,
                position: h || this.attr.menuPosition
            }), this.state = {
                user: e,
                chirp: i,
                $actionsMenuContainer: t.closest(this.attr.chirpActionsContainerSelector)
            }, this.state.$actionsMenuContainer.addClass("is-visible")
        }, this.handleShowActionsMenu = function(t) {
            var e = $(t.target),
                i = e.attr("data-parent-chirp-id");
            i || (i = e.attr("data-chirp-id"));
            var s = e.attr("data-account-key"),
                n = TD.controller.columnManager.findChirpByAccountKey(i, s);
            this.showActionsMenu(e, null, n)
        }, this.handleUserButtonClick = function(t) {
            var e = $(t.target).closest(this.attr.profileActionsButtonSelector),
                i = TD.cache.twitterUsers.getById(e.data("user-id"));
            t.stopPropagation(), t.preventDefault(), i.addCallback(function(t) {
                this.showActionsMenu(e, t, null)
            }.bind(this))
        }, this.handleFlagTweetSuccess = function() {
            var t = this.state.chirp.getMedia();
            t.forEach(function(t) {
                t.flaggedNSFW = !0
            }), TD.controller.progressIndicator.addMessage(TD.i("Success: Media flagged"))
        }, this.handleFlagTweetError = function() {
            TD.controller.progressIndicator.addMessage(TD.i("Error: Failed to flag media. Please try again."))
        }, this.handleActionsMenuClick = function(t) {
            var e = $(t.target);
            if (0 !== e.closest(this.attr.isSelectedSelector).length) {
                var i, s = e.data("action"),
                    n = !0,
                    o = this.state.user,
                    r = this.state.chirp,
                    a = [];
                switch (r && a.push(r.account.getKey()), r ? this.trigger("metricRealtime", {
                    action: ["chirp", "ui", r.chirpType, s].join(":")
                }) : this.trigger("metricRealtime", {
                    action: ["user", "ui", s].join(":")
                }), s) {
                    case "mention":
                        this.trigger("uiComposeTweet", {
                            text: "@" + o.screenName + " ",
                            from: a
                        });
                        break;
                    case "message":
                        this.trigger("uiComposeTweet", {
                            type: "message",
                            from: a,
                            messageRecipient: {
                                screenName: o.screenName,
                                avatar: o.profileImageURL
                            }
                        });
                        break;
                    case "lists":
                        new TD.components.AddToListsDialog(o);
                        break;
                    case "flag-media":
                        TD.controller.progressIndicator.addMessage(TD.i("Flagging media…")), i = TD.controller.clients.getClient(r.account.getKey()), i.flagTweet(r.id, this.handleFlagTweetSuccess.bind(this), this.handleFlagTweetError);
                        break;
                    case "block":
                        this.trigger("uiBlockAction", {
                            account: o.account,
                            twitterUser: o
                        });
                        break;
                    case "report-tweet":
                        this.trigger("uiShowReportTweetOptions", {
                            account: o.account,
                            tweetId: r.id,
                            twitterUser: o,
                            isMessage: r instanceof TD.services.TwitterDirectMessage
                        });
                        break;
                    case "report-spam":
                        this.trigger("uiReportSpamAction", {
                            account: o.account,
                            twitterUser: o,
                            block: !0
                        }), this.trigger("uiCloseModal");
                        break;
                    case "followOrUnfollow":
                        this.trigger("uiShowFollowFromOptions", {
                            userToFollow: o
                        });
                        break;
                    case "favoriteOrUnfavorite":
                        this.trigger("uiShowFavoriteFromOptions", {
                            tweet: r
                        });
                        break;
                    case "follow":
                        o.follow(o.account, null, null, !0);
                        break;
                    case "unfollow":
                        o.unfollow(o.account, null, null, !0);
                        break;
                    case "reference-to":
                        r.referenceTo();
                        break;
                    case "email":
                        r.email();
                        break;
                    case "mute":
                        TD.controller.filterManager.addFilter("sender", o.screenName), TD.controller.progressIndicator.addMessage(TD.i("@{{screenName}} muted. Unmute in Settings", {
                            screenName: o.screenName
                        }));
                        break;
                    case "destroy":
                        r.destroy();
                        break;
                    case "undo-retweet":
                        $(document).trigger("uiUndoRetweet", {
                            tweetId: r.getMainTweet().id,
                            from: r.account.getKey()
                        });
                        break;
                    case "customtimelines":
                        new TD.components.AddToCustomTimelineDialog(r.getMainTweet());
                        break;
                    case "embed":
                        this.trigger("uiShowEmbedTweet", {
                            tweet: r.getMainTweet()
                        });
                        break;
                    case "translate":
                        r.translate();
                        break;
                    default:
                        n = !1
                }
                n && (t.preventDefault(), t.stopPropagation()), this.teardownCurrentDropdown()
            }
        }
    }
    var i = t("flight/lib/component"),
        s = t("ui/with_dropdown");
    return i(e, s)
}), define("ui/columns/column_drag_drop", ["require", "flight/lib/component"], function(t) {
    function e() {
        this.defaultAttrs({
            columnDragHandleSelector: ".js-column-drag-handle",
            appColumnsContainerSelector: ".js-app-columns-container",
            columnsContainerSelector: ".js-app-columns",
            columnSelector: ".js-column"
        }), this.after("initialize", function() {
            this.on("uiColumnRendered", this.handleColumnRendered), this.select("columnsContainerSelector").dragdroplist({
                selector: this.attr.columnSelector,
                contentSelector: this.attr.columnSelector,
                handle: this.attr.columnDragHandleSelector,
                $boundary: this.select("appColumnsContainerSelector"),
                orientation: "horizontal",
                tagName: "section",
                scroll_speed: 24
            }).on("dropped.dragdroplist", function() {
                var t = [];
                this.select("columnSelector").each(function() {
                    t.push($(this).attr("data-column"))
                }), TD.storage.clientController.client.setColumnOrder(t)
            }.bind(this))
        }), this.handleColumnRendered = function(t, e) {
            e.$column.trigger("itemadded.dragdroplist", {
                itemId: e.column
            })
        }
    }
    var i = t("flight/lib/component");
    return i(e)
}), define("ui/compose/with_add_image", [], function() {
    return function() {
        var t = null;
        this.defaultAttrs({
            addImageButtonSelector: ".js-add-image-button"
        }), this.after("initialize", function() {
            this.$addImageButton = this.select("addImageButtonSelector"), TD.util.hasFeature("file") || this.hideAddImageButton()
        }), this.addImageButtonAddTooltip = function(t) {
            this.$addImageButton.attr("data-original-title", t)
        }, this.addImageButtonRemoveTooltip = function() {
            this.$addImageButton.removeAttr("data-original-title")
        }, this.disableAddImageButton = function() {
            t !== !0 && (this.$addImageButton.addClass("is-disabled").attr("tabindex", "-1"), this.off(this.$addImageButton, "click"), t = !0)
        }, this.enableAddImageButton = function() {
            t !== !1 && (this.$addImageButton.removeClass("is-disabled").attr("tabindex", "0"), this.on(this.$addImageButton, "click", this.handleAddImageButtonClick), t = !1)
        }, this.hideAddImageButton = function() {
            this.$addImageButton.addClass("is-hidden")
        }, this.handleAddImageButtonClick = function() {
            this.trigger(document, "uiComposeAddImageClick")
        }
    }
}), define("ui/with_click_trap", [], function() {
    var t = function() {
        var t = [],
            e = [],
            i = !1;
        this.onReceiveClick = function(e) {
            t.push(e)
        }, this.onLoseClick = function(t) {
            e.push(t)
        }, this.runReceiveHandlers = function() {
            t.forEach(function(t) {
                t.call(this)
            }, this)
        }, this.runLoseHandlers = function(t) {
            this.targetWithinComponent(t.target) || e.forEach(function(t) {
                t.call(this)
            }, this)
        }, this.targetWithinComponent = function(t) {
            return $(t).closest(this.$node).length > 0
        }, this.enableClickTrap = function() {
            i || (_.defer(function() {
                $("body").on("click.clicktrap", "*", this.runLoseHandlers.bind(this)), this.$node.on("click.clicktrap", "*", this.runReceiveHandlers.bind(this))
            }.bind(this)), i = !0)
        }, this.disableClickTrap = function() {
            i && ($("body").off("click.clicktrap"), this.$node.off("click.clicktrap"), i = !1)
        }
    };
    return t
}), define("ui/compose/with_direct_message_button", [], function() {
    return function() {
        this.defaultAttrs({
            messageButtonSelector: ".js-dm-button",
            tweetButtonSelector: ".js-tweet-button"
        }), this.after("initialize", function() {
            this.messageIsDisabled = !1, this.$messageButton = this.select("messageButtonSelector"), this.$tweetButton = this.select("tweetButtonSelector"), this.on(this.$messageButton, "click", function() {
                this.messageIsDisabled || this.trigger(document, "uiComposeTweet", {
                    type: "message"
                })
            }), this.on(this.$tweetButton, "click", function() {
                this.trigger(document, "uiComposeTweet", {
                    type: "tweet"
                })
            })
        }), this.disableMessageButton = function(t) {
            this.messageIsDisabled || (this.messageIsDisabled = !0, this.$messageButton.addClass("is-disabled").attr("tabindex", "-1").attr("data-original-title", t || ""))
        }, this.enableMessageButton = function() {
            this.messageIsDisabled && (this.messageIsDisabled = !1, this.$messageButton.removeClass("is-disabled").attr("tabindex", "0").removeAttr("data-original-title"))
        }, this.setMessageToggleButton = function(t) {
            "message" === t ? (this.$messageButton.addClass("is-hidden"), this.$tweetButton.removeClass("is-hidden")) : (this.$messageButton.removeClass("is-hidden"), this.$tweetButton.addClass("is-hidden"))
        }
    }
}), define("ui/compose/with_hint", ["require"], function() {
    return function() {
        this.showHint = function(t, e) {
            var i = e.useDangerousHTML ? "html" : "text";
            this.$node.find(e.selector)[i](t).addClass(e.animation).removeClass("is-hidden")
        }, this.hideHint = function(t) {
            this.$node.find(t.selector).html("").removeClass(t.animation).addClass("is-hidden")
        }
    }
}), define("ui/compose/with_in_reply_to", ["require", "flight/lib/compose", "ui/with_template"], function(t) {
    var e = t("flight/lib/compose"),
        i = t("ui/with_template");
    return function() {
        e.mixin(this, [i]), this.defaultAttrs({
            inReplyToHolderSelector: ".js-in-reply-to",
            inReplyToRemoveSelector: ".js-in-reply-to-remove"
        }), this.after("initialize", function() {
            this.$inReplyToHolder = this.select("inReplyToHolderSelector"), this.$inReplyToHolder.on("click", this.attr.inReplyToRemoveSelector, function() {
                this.removeInReplyTo(), this.trigger("uiRequestComposeTextFocus")
            }.bind(this))
        }), this.addInReplyTo = function(t) {
            this.inReplyTo = t, this.$inReplyToHolder.html(this.toHtml("compose/in_reply_to", this.inReplyTo)), this.$inReplyToHolder.removeClass("is-hidden")
        }, this.removeInReplyTo = function() {
            this.inReplyTo = null, this.$inReplyToHolder.addClass("is-hidden"), this.trigger("uiRemoveInReplyTo")
        }, this.getInReplyToId = function() {
            return this.inReplyTo ? this.inReplyTo.id : null
        }
    }
}), define("ui/compose/with_media_bar", [], function() {
    return function() {
        this.defaultAttrs({
            mediaBarContainerSelector: ".js-media-added",
            mediaBarRemoveSelector: ".js-media-bar-remove",
            mediaBarSelector: ".compose-media-bar",
            maxImageHeight: 310
        }), this.after("initialize", function() {
            this.$mediaBarContainer = this.select("mediaBarContainerSelector"), this.file = null, this.on("click", {
                mediaBarRemoveSelector: this.removeFile
            })
        }), this.addFile = function(t) {
            this.$mediaBarContainer.removeClass("is-hidden"), this.file = t, TD.util.hasFeature("filereader") ? this.loadFileData(t) : this.attachImageInfoBar()
        }, this.loadFileData = function(t) {
            var e = new FileReader;
            e.onload = function(t) {
                this.attachImagePreview(t.target.result)
            }.bind(this), e.readAsDataURL(t)
        }, this.attachImageInfoBar = function() {
            var t = this.renderTemplate("compose/media_bar_infobar");
            this.$mediaBarContainer.html(t)
        }, this.attachImagePreview = function(t) {
            var e = this.renderTemplate("compose/media_bar_image", {
                src: t
            });
            this.$mediaBarContainer.html(e), this.$mediaBarContainer.on("click", function() {
                $(event.target).is("img") && this.trigger("uiComposeImageClicked")
            }.bind(this)), e[0].complete ? this.setImageHeight(e) : e.load(function() {
                this.setImageHeight(e)
            }.bind(this))
        }, this.setImageHeight = function(t) {
            var e = this.select("mediaBarSelector");
            t.height() > this.attr.maxImageHeight ? (t.height(this.attr.maxImageHeight), e.addClass("compose-media-compressed")) : (t.height("auto"), e.removeClass("compose-media-compressed")), this.trigger("uiComposeImageAdded")
        }, this.removeFile = function() {
            this.$mediaBarContainer.addClass("is-hidden"), this.$mediaBarContainer.empty(), this.file = null, this.trigger("uiResetImageUpload")
        }, this.getFile = function() {
            return this.file
        }
    }
}), define("ui/with_clear_input", [], function() {
    var t = function() {
        this.defaultAttrs({
            clearButtonSelector: ".js-clear-input",
            textInputSelector: ".js-clearable-input",
            hasValueClass: "has-value"
        }), this.handleClearAction = function(t, e) {
            var i = $(e.el).siblings(this.attr.textInputSelector);
            i.val(""), i.parent().removeClass(this.attr.hasValueClass), i.focus()
        }, this.handleKeyPressReceived = function(t, e) {
            this.checkInputValueState($(e.el))
        }, this.checkInputValueState = function(t) {
            var e = t.val();
            "" !== e ? t.parent().addClass(this.attr.hasValueClass) : t.parent().removeClass(this.attr.hasValueClass), this.value = e
        }, this.after("initialize", function() {
            this.select("textInputSelector").each(function(t, e) {
                this.checkInputValueState($(e))
            }.bind(this)), this.on("click", {
                clearButtonSelector: this.handleClearAction
            }), this.on("change", {
                textInputSelector: this.handleKeyPressReceived
            })
        })
    };
    return t
}), define("ui/compose/with_message_recipient", ["require", "flight/lib/compose", "ui/with_clear_input", "ui/with_focusable_field"], function(t) {
    var e = t("flight/lib/compose"),
        i = t("ui/with_clear_input"),
        s = t("ui/with_focusable_field");
    return function() {
        e.mixin(this, [s, i]), this.defaultAttrs({
            composeMessageRecipientSelector: ".js-compose-message-recipient",
            composeMessageRecipientInputSelector: ".js-compose-message-account",
            composeMessageRecipientAvatarSelector: ".js-compose-message-avatar",
            messageRecipientCheckPeriod: 100
        }), this.after("initialize", function() {
            this.messageRecipientChangeInterval = null, this.$messageRecipient = this.select("composeMessageRecipientSelector"), this.$messageRecipientInput = this.select("composeMessageRecipientInputSelector"), this.$messageRecipientAvatar = this.select("composeMessageRecipientAvatarSelector"), this.messageAutoComplete = new TD.components.Autocomplete(this.$messageRecipientInput, {
                dmMode: !0
            }), this.on(this.messageAutoComplete.$node, "td-autocomplete-select", function(t, e, i) {
                this.setMessageRecipient({
                    screenName: e,
                    avatar: i
                })
            }), this.on(this.$messageRecipientInput, "focus", this.handleMessageRecipientFocus), this.on(this.$messageRecipientInput, "blur", this.handleMessageRecipientBlur), this.on(document, "dataUserLookup", this.handleMessageRecipientUserLookup)
        }), this.after("teardown", function() {
            clearInterval(this.messageRecipientChangeInterval), this.messageRecipientChangeInterval = null, this.messageAutoComplete.destroy()
        }), this.setMessageRecipient = function(t) {
            this.$messageRecipient.removeClass("is-hidden"), t && t.screenName ? (this.$messageRecipientInput.val(t.screenName), this.$messageRecipientAvatar.attr("src", t.avatar), this.$messageRecipientAvatar.data("screenName", t.screenName), this.checkMessageRecipientAvatarState(), this.trigger("uiMessageRecipientSet", {
                recipient: t
            }), t.avatar || this.trigger("uiNeedsUserLookup", {
                screenName: t.screenName
            })) : (this.resetMessageRecipient(), this.trigger("uiMessageRecipientUnset"), (!TD.util.isTouchDevice() || !TD.decider.get(TD.decider.TOUCHDECK_COMPOSE)) && this.messageRecipientSetFocus())
        }, this.hideMessageRecipient = function() {
            this.$messageRecipient.addClass("is-hidden"), this.resetMessageRecipient(), this.messageRecipientChangeInterval = null
        }, this.resetMessageRecipient = function() {
            this.$messageRecipientInput.val(""), this.$messageRecipientAvatar.removeAttr("src"), this.$messageRecipientAvatar.data("screenName", ""), this.$messageRecipientAvatar.addClass("is-hidden")
        }, this.getMessageRecipient = function() {
            var t = this.$messageRecipientInput.val().trim();
            return t ? {
                screenName: t
            } : null
        }, this.messageRecipientSetFocus = function() {
            this.$messageRecipientInput.select()
        }, this.messageRecipientBlur = function() {
            this.$messageRecipientInput.blur()
        }, this.checkMessageRecipientAvatarState = function() {
            var t = this.getMessageRecipient(),
                e = t ? t.screenName : "",
                i = (this.$messageRecipientAvatar.data("screenName") || "").toString(),
                s = e && e.toLowerCase() === i.toLowerCase();
            this.$messageRecipientAvatar.toggleClass("is-hidden", !s), this.checkInputValueState(this.$messageRecipientInput)
        }, this.handleMessageRecipientFocus = function() {
            this.messageRecipientChangeInterval || (this.messageRecipientChangeInterval = setInterval(this.checkMessageRecipientAvatarState.bind(this), this.attr.messageRecipientCheckPeriod))
        }, this.handleMessageRecipientBlur = function() {
            clearInterval(this.messageRecipientChangeInterval), this.messageRecipientChangeInterval = null;
            var t = this.getMessageRecipient(),
                e = t ? t.screenName : "",
                i = (this.$messageRecipientAvatar.data("screenName") || "").toString();
            t ? this.trigger("uiMessageRecipientSet", {
                recipient: t
            }) : this.trigger("uiMessageRecipientUnset"), e && e.toLowerCase() !== i.toLowerCase() && this.trigger("uiNeedsUserLookup", {
                screenName: e
            }), this.trigger(this.$messageRecipient, "uiTextfieldInputBlur")
        }, this.handleMessageRecipientUserLookup = function(t, e) {
            var i = this.getMessageRecipient(),
                s = i ? i.screenName : "";
            e.request.screenName.toLowerCase() === s.toLocaleLowerCase() && (this.$messageRecipientInput.val(e.result.screenName), this.$messageRecipientAvatar.attr("src", e.result.miniProfileImageURL()), this.$messageRecipientAvatar.data("screenName", e.result.screenName), this.checkMessageRecipientAvatarState())
        }
    }
}), define("ui/compose/with_scheduler", [], function() {
    return function() {
        this.defaultAttrs({
            scheduleButtonSelector: ".js-schedule-button",
            scheduleButtonLabelSelector: ".js-schedule-button-label",
            scheduleDatePickerHolderSelector: ".js-schedule-datepicker-holder",
            schedulerPastCheckIntervalPeriod: 1e3
        }), this.after("initialize", function() {
            this.schedulerIsDisabled = null, this.schedulerPickerOpen = !1, this.$scheduleButton = this.select("scheduleButtonSelector"), this.$scheduleButtonLabel = this.select("scheduleButtonLabelSelector"), this.$scheduleDatePickerHolder = this.select("scheduleDatePickerHolderSelector"), this.scheduleButtonTitleTweet = TD.i("Schedule Tweet"), this.scheduleButtonTitleMessage = TD.i("Schedule Message")
        }), this.after("teardown", function() {
            this.scheduleDatePicker && ($.unsubscribe(this.dateChangedSubscription), $.unsubscribe(this.dateRemovedSubscription)), clearInterval(this.schedulerPastCheckInterval)
        }), this.disableScheduleButton = function(t) {
            this.$scheduleButton.addClass("is-disabled").attr("tabindex", "-1").attr("data-original-title", t || ""), this.schedulerIsDisabled !== !0 && (this.off(this.$scheduleButton, "click"), this.schedulerIsDisabled = !0)
        }, this.enableScheduleButton = function() {
            this.$scheduleButton.removeClass("is-disabled").attr("tabindex", "0").removeAttr("data-original-title"), this.schedulerIsDisabled !== !1 && (this.on(this.$scheduleButton, "click", this.handleScheduleButtonClick), this.schedulerIsDisabled = !1)
        }, this.handleScheduleButtonClick = function() {
            this.initScheduleDatePicker()
        }, this.resetScheduler = function() {
            this.setScheduledDate(null)
        }, this.openScheduleDatePicker = function() {
            this.schedulerPickerOpen || ($("body").on("click.scheduleclicktrap", function(t) {
                var e = $(t.target);
                0 === e.closest(this.$scheduleDatePickerHolder).length && 0 === e.closest(this.$scheduleButton).length && this.closeScheduleDatePicker()
            }.bind(this)), this.scheduleDatePicker.$node.show(), this.schedulerPickerOpen = !0)
        }, this.closeScheduleDatePicker = function() {
            this.schedulerPickerOpen && ($("body").off("click.scheduleclicktrap"), this.scheduleDatePicker.$node.hide(), this.schedulerPickerOpen = !1)
        }, this.initScheduleDatePicker = function() {
            var t = function() {
                this.closeScheduleDatePicker(), this.scheduledDate = null, this.trigger("uiComposeScheduleDate", {
                    date: null
                })
            };
            this.scheduleDatePicker ? (this.scheduleDatePicker.$node.is(":hidden") ? this.openScheduleDatePicker() : this.closeScheduleDatePicker(), this.scheduledDate || this.scheduleDatePicker.setDate(new Date)) : (this.dateChangedSubscription = $.subscribe("/change/date", this.setScheduledDate.bind(this)), this.dateRemovedSubscription = $.subscribe("/removed/date", t.bind(this)), this.scheduleDatePicker = new TD.components.ScheduledDatePicker(this.$scheduleDatePickerHolder), this.openScheduleDatePicker())
        }, this.checkScheduledDatePassed = function() {
            this.scheduledDate.getTime() < Date.now() && (this.trigger("uiScheduledDatePassed"), clearInterval(this.schedulerPastCheckInterval))
        }, this.setScheduledDate = function(t) {
            var e;
            this.scheduledDate = t, t ? (t.setSeconds(0), e = TD.util.prettyTimeString(t), this.$scheduleButtonLabel.text(e), clearInterval(this.schedulerPastCheckInterval), this.schedulerPastCheckInterval = setInterval(this.checkScheduledDatePassed.bind(this), this.attr.schedulerPastCheckIntervalPeriod)) : (this.closeScheduleDatePicker(), clearInterval(this.schedulerPastCheckInterval)), this.trigger("uiComposeScheduleDate", {
                date: t
            })
        }, this.getScheduledDate = function() {
            return this.scheduledDate
        }, this.isScheduling = function() {
            return !!this.getScheduledDate()
        }, this.isScheduledImagesEnabled = function() {
            return TD.decider.hasAccessLevel("scheduler", "WRITE_MEDIA")
        }, this.setScheduledId = function(t) {
            this.scheduledId = t
        }, this.getScheduledId = function() {
            return this.scheduledId
        }, this.setScheduleButtonTitle = function(t) {
            if (!this.scheduledDate) switch (t) {
                case "tweet":
                    this.$scheduleButtonLabel.text(this.scheduleButtonTitleTweet);
                    break;
                case "message":
                    this.$scheduleButtonLabel.text(this.scheduleButtonTitleMessage)
            }
        }
    }
}), define("ui/compose/with_stay_open", [], function() {
    return function() {
        var t, e;
        this.defaultAttrs({
            checkboxSelector: ".js-compose-stay-open"
        }), this.after("initialize", function() {
            t = this.select("checkboxSelector"), this.on(t, "change", function() {
                t.prop("checked") ? this.trigger("uiChangeComposeStayOpen", {
                    composeStayOpen: !0
                }) : this.trigger("uiChangeComposeStayOpen", {
                    composeStayOpen: !1
                })
            }), this.on(document, "dataSettings", this.handleSettings)
        }), this.handleSettings = function(i, s) {
            s.composeStayOpen ? (t.prop("checked", !0), this.composeStayOpen = !0, void 0 === e && this.trigger(document, "uiDockedComposeTweet", {
                noAnimate: !0,
                noFocus: !0
            })) : (t.prop("checked", !1), this.composeStayOpen = !1), e = !0
        }
    }
}), define("ui/compose/with_title", [], function() {
    return function() {
        this.defaultAttrs({
            titleSelector: ".js-compose-title",
            headerSelector: ".js-compose-header"
        }), this.before("initialize", function() {
            this.titleTranslatedText = {
                tweet: TD.i("New Tweet"),
                reply: TD.i("New Tweet"),
                message: TD.i("New direct message")
            }
        }), this.after("initialize", function() {
            this.$title = this.select("titleSelector"), this.$header = this.select("headerSelector")
        }), this.setTitle = function(t, e) {
            var i, s;
            "message" === t ? (s = !0, i = e ? TD.i("Edit scheduled message") : TD.i("New direct message")) : (s = !1, i = e ? TD.i("Edit scheduled Tweet") : TD.i("New Tweet")), this.$title.text(i), this.$header.toggleClass("with-dm-icon", s)
        }
    }
}), define("ui/compose/docked_compose", ["require", "flight/lib/component", "util/tweet_utils", "ui/compose/with_account_selector", "ui/compose/with_add_image", "ui/compose/with_character_count", "ui/with_click_trap", "data/with_client", "ui/compose/with_compose_text", "ui/compose/with_direct_message_button", "ui/with_focus", "ui/compose/with_hint", "ui/compose/with_in_reply_to", "ui/compose/with_media_bar", "ui/compose/with_message_recipient", "ui/compose/with_scheduler", "ui/compose/with_send_button", "ui/compose/with_send_tweet", "ui/compose/with_stay_open", "ui/compose/with_title"], function(t) {
    function e() {
        this.defaultAttrs({
            stayOpenInputSelector: ".js-compose-stay-open",
            composeScrollerSelector: ".js-compose-scroller",
            withTouchComposeClass: "is-touch-compose",
            tcoLength: 22,
            panelCloseDelay: 500,
            releaseFocusDelay: 300,
            defaultTextComposeHeight: 130,
            increasedTextComposeHeight: 160,
            minimumComposeHeight: 180,
            initScrollbarsDelay: 200,
            hintOptions: {
                selector: ".js-compose-hint",
                animation: "anim anim-fade-in"
            }
        }), this.after("initialize", function() {
            this.debouncedInitScrollbars = _.debounce(this.initScrollbars.bind(this), this.attr.initScrollbarsDelay), this.setupDOM(), this.tweetType = "tweet", this.panelWasClosed = !0, this.releaseFocusTimer = null, this.composeTextIsExpanded = !1, this.on(document, "uiDockedComposeTweet", this.handleUiComposeTweet), this.on(document, "uiComposeClose", this.handleUiComposeClose), this.on(document, "uiFilesAdded", this.handleUiFilesAdded), this.on("uiComposeSendTweet", this.handleUiComposeSendTweet), this.on("uiComposeTweetSending", this.enterSendingState), this.on("uiComposeTweetSent", this.enterSuccessState), this.on("uiComposeTweetError", this.enterErrorState), this.on("uiComposeScheduleDate", this.handleUiComposeScheduleDate), this.before("charCountHandleCharCount", function(t, e) {
                var i = this.getFile();
                i && (e.charCount = e.charCount + this.attr.tcoLength + 1)
            }), this.after("addFile", function() {
                this.composeTextHandleChange(), this.inferAddImageButtonState(), this.inferScheduleButtonState(), this.debouncedInitScrollbars(), this.composeTextSetCaretToEnd()
            }), this.after("removeFile", function() {
                this.composeTextHandleChange(), this.inferAddImageButtonState(), this.inferScheduleButtonState(), this.debouncedInitScrollbars()
            }), this.after("addInReplyTo", function() {
                this.debouncedInitScrollbars()
            }), this.after("handleAccountsDataForAccountSelector", function() {
                this.debouncedInitScrollbars()
            }), this.after("openScheduleDatePicker", function() {
                this.debouncedInitScrollbars()
            }), this.after("closeScheduleDatePicker", function() {
                this.debouncedInitScrollbars()
            }), this.onReceiveClick(function() {
                this.hasFocus || this.focusRequest()
            }), this.onLoseClick(function() {
                this.hasFocus && this.focusRelease()
            }), this.on(document, "uiMainWindowResized", this.debouncedInitScrollbars), this.on("uiComposeImageAdded", this.debouncedInitScrollbars), this.on("uiComposeImageClicked", this.composeTextSetFocus), this.on("uiComposeTextBlur", this.handleComposeTextBlur), this.on("uiComposeCharCount", this.handleComposeCharCount), this.initScrollbars({
                initialDisplay: !1
            })
        }), this.setupDOM = function() {
            this.$composeScroller = this.select("composeScrollerSelector"), TD.util.isTouchDevice() && TD.decider.get(TD.decider.TOUCHDECK_COMPOSE) && this.$node.addClass(this.attr.withTouchComposeClass)
        }, this.handleUiComposeTweet = function(t, e) {
            if (e = e || {}, this.tweetType = e.type || "tweet", this.resetComposePanelState(e), e.noFocus || this.focusRequest(), this.enableClickTrap(), e.columnKey) {
                var i = TD.controller.columnManager.get(e.columnKey),
                    s = i.getFeeds(),
                    n = s.map(function(t) {
                        return t.getAccountKey()
                    });
                this.setSelectedAccounts(n)
            }
            this.trigger("uiToggleDockedCompose", {
                opening: !0,
                noAnimate: e.noAnimate,
                fromColumnKey: e.columnKey
            }), this.panelWasClosed = !1
        }, this.showScheduledHint = function() {
            this.showHint(TD.i("Your scheduled Tweet will send even if TweetDeck is not running at the time."), this.attr.hintOptions)
        }, this.handleUiComposeClose = function(t, e) {
            e = e || {}, e.keyboardShortcut ? this.hasFocus && (this.composeStayOpen ? this.focusRelease() : this.hideComposePanel()) : this.hideComposePanel(), clearTimeout(this.releaseFocusTimer), this.releaseFocusTimer = null
        }, this.handleUiComposeSendTweet = function(t, e) {
            if (t.stopPropagation(), (!t.keyboardShortcut || this.hasFocus) && this.sendButtonIsEnabled()) {
                var i = _.uniqueId("sendTweet"),
                    s = $.extend({}, e);
                s.requestId = i, s.text = this.composeTextGetText(), s.inReplyToStatusId = this.getInReplyToId(), s.file = this.getFile(), s.messageRecipient = this.getMessageRecipient(), s.scheduledDate = this.getScheduledDate(), s.scheduledId = this.getScheduledId(), s.from = this.getSelectedAccounts(), s.type = this.tweetType, s.metadata = this.getMetadata(), this.sendTweet(s)
            }
        }, this.enterSendingState = function(t) {
            t.stopPropagation(), this.disablePanelInputs(), this.sendButtonShowSending()
        }, this.enterSuccessState = function(t) {
            t.stopPropagation(), this.sendButtonShowSuccess(), setTimeout(this.resetAfterSend.bind(this), this.attr.panelCloseDelay)
        }, this.enterErrorState = function(t, e) {
            t.stopPropagation(), e.errors && this.setSelectedAccounts(e.errors.map(function(t) {
                return t.request.accountKey
            })), this.sendButtonShowText(), this.enablePanelInputs()
        }, this.resetAfterSend = function() {
            "reply" === this.tweetType && (this.tweetType = "tweet"), this.sendButtonShowText(), this.composeStayOpen ? this.resetComposePanelState({
                text: "",
                from: this.getSelectedAccounts()
            }) : this.hideComposePanel()
        }, this.hideComposePanel = function() {
            this.tweetType = "tweet", this.destructivePanelReset(), this.setSelectedAccounts([this.defaultAccountKey]), this.messageRecipientBlur(), this.hideMessageRecipient(), this.sendButtonShowText(), this.enablePanelInputs(), this.focusRelease(), this.disableClickTrap(), this.resetSendTweet(), this.trigger("uiToggleDockedCompose", {
                opening: !1
            }), this.panelWasClosed = !0
        }, this.destructivePanelReset = function() {
            this.composeTextSetText(""), this.removeFile(), this.resetScheduler(), this.setScheduledId(null), this.hideHint(this.attr.hintOptions)
        }, this.resetComposePanelState = function(t) {
            var e, i, n, o, r = {}, a = TD.config.force_dm_photos || TD.decider.get(TD.decider.DM_PHOTO_SENDING);
            t = t || {};
            var c = void 0 !== t.text;
            switch (c && this.destructivePanelReset(), this.enablePanelInputs(), t.schedule && (this.setScheduledDate(t.schedule.time), this.setScheduledId(t.schedule.id), this.setSelectedAccounts(t.from)), this.alwaysSelectOneAccount = !1, this.tweetType) {
                case "tweet":
                    this.removeInReplyTo(), void 0 !== t.text ? this.composeTextSetText(t.text) : (e = this.getMessageRecipient(), e && this.composeTextPrependText(s.atMentionify(e.screenName))), void 0 !== t.appendText && this.composeTextAppendText(t.appendText), this.hideMessageRecipient(), (t.from && t.from.length > 0 && this.panelWasClosed || t.isEditAndRetweet) && this.setSelectedAccounts(t.from), t.noFocus || (!TD.util.isiOSDevice() || !TD.decider.get(TD.decider.TOUCHDECK_COMPOSE)) && this.composeTextSetCaretToEnd();
                    break;
                case "reply":
                    (!this.getInReplyToId() || this.composeTextIsEmpty()) && (this.addInReplyTo(t.inReplyTo), this.panelWasClosed && this.setSelectedAccounts(t.from)), n = this.getSelectedAccounts(), 1 === n.length && (o = this.getAccountData(n[0]).screenName), void 0 !== t.text ? (this.composeTextSetText(t.text), this.composeTextSetCaretToEnd()) : this.composeTextSetRepliesAndMentions([t.inReplyTo.user.screenName], t.mentions, o), this.hideMessageRecipient();
                    break;
                case "message":
                    if (TD.decider.get(TD.decider.DISABLE_SCHEDULED_MESSAGES) && this.resetScheduler(), e = this.getMessageRecipient(), void 0 !== t.text ? this.composeTextSetText(t.text) : i = s.extractMentions(this.composeTextGetText()), t.messageRecipient) r = t.messageRecipient;
                    else if (t.to && t.to.screenName) r = {
                        screenName: t.to.screenName
                    };
                    else if (e) r = e;
                    else if (i && i.length) {
                        r = {
                            screenName: i[0]
                        };
                        var h = s.removeFirstMention(this.composeTextGetText());
                        this.composeTextSetText(h)
                    }
                    this.setMessageRecipient(r), this.removeInReplyTo(), a || this.removeFile(), t.from && t.from.length > 0 && this.setSelectedAccounts(t.from), TD.util.isiOSDevice() && TD.decider.get(TD.decider.TOUCHDECK_COMPOSE) || (r && r.screenName ? this.composeTextSetCaretToEnd() : this.messageRecipientSetFocus()), TD.decider.get(TD.decider.DM_SAME_FROM_MULTIPLE_ACCOUNTS) || (this.getSelectedAccounts().length > 1 && (this.setSelectedAccounts([]), TD.controller.progressIndicator.addMessage([TD.i("Messages cannot be sent from multiple accounts."), TD.i("Please choose an account.")].join(" "))), this.alwaysSelectOneAccount = !0)
            }
            this.setTitle(this.tweetType, this.getScheduledId()), this.sendButtonSetText(this.tweetType, this.getScheduledDate()), this.setScheduleButtonTitle(this.tweetType), this.setMessageToggleButton(this.tweetType), this.inferAddImageButtonState(), this.inferScheduleButtonState(), this.inferMessageButtonState(), this.setMetadata(t.metadata), this.debouncedInitScrollbars({
                initialDisplay: !1
            })
        }, this.handleUiFilesAdded = function(t, e) {
            for (var i = 0; i < e.files.length; i++) this.addFile(e.files[i]);
            this.trigger("uiDockedComposeTweet", {
                type: this.tweetType
            })
        }, this.handleUiComposeScheduleDate = function(t, e) {
            this.sendButtonSetText(this.tweetType, this.getScheduledDate()), this.setScheduleButtonTitle(this.tweetType), this.inferAddImageButtonState(), e.date ? this.showScheduledHint() : this.hideHint(this.attr.hintOptions), this.inferMessageButtonState()
        }, this.inferMessageButtonState = function() {
            var t = this.getScheduledDate();
            t && TD.decider.get(TD.decider.DISABLE_SCHEDULED_MESSAGES) ? this.disableMessageButton(TD.i("Direct messages cannot be scheduled")) : this.enableMessageButton()
        }, this.inferAddImageButtonState = function() {
            var t, e = TD.config.force_dm_photos || TD.decider.get(TD.decider.DM_PHOTO_SENDING),
                i = "message" === this.tweetType,
                s = this.isScheduling(),
                n = i && s,
                o = !! this.getFile(),
                r = !o,
                a = i ? e : !0,
                c = s ? this.isScheduledImagesEnabled() : !0,
                h = !n;
            r ? c ? a ? h || (t = TD.i("Scheduled direct messages cannot contain images")) : t = TD.i("Direct messages cannot contain images") : t = TD.i("Scheduled Tweets cannot contain images") : t = TD.i("You cannot add more than one image"), t ? (this.disableAddImageButton(), this.addImageButtonAddTooltip(t)) : (this.enableAddImageButton(), this.addImageButtonRemoveTooltip())
        }, this.inferScheduleButtonState = function() {
            var t, e = !TD.decider.get(TD.decider.DISABLE_SCHEDULED_MESSAGES),
                i = "message" === this.tweetType,
                s = !! this.getFile(),
                n = i && s,
                o = i ? e : !0,
                r = s ? this.isScheduledImagesEnabled() : !0,
                a = !n;
            o ? r ? a || (t = TD.i("Direct messages containing images cannot be scheduled")) : t = TD.i("Tweets with images cannot be scheduled") : t = TD.i("Direct messages cannot be scheduled"), t ? this.disableScheduleButton(t) : this.enableScheduleButton()
        }, this.initScrollbars = function(t) {
            2 === arguments.length && (t = {});
            var e = this.$composeScroller.data("antiscroll");
            e ? e.refresh() : this.$composeScroller.antiscroll(t)
        }, this.handleComposeCharCount = function(t, e) {
            !this.composeTextIsExpanded && e.stringLength > this.attr.minimumComposeHeight ? (this.composeTextSetHeight(this.attr.increasedTextComposeHeight), this.composeTextIsExpanded = !0) : this.composeTextIsExpanded && e.stringLength <= this.attr.minimumComposeHeight && (this.composeTextSetHeight(this.attr.defaultTextComposeHeight), this.composeTextIsExpanded = !1)
        }, this.disablePanelInputs = function() {
            this.sendButtonSetDisabled(), this.composeTextSetDisabled(!0)
        }, this.enablePanelInputs = function() {
            this.sendButtonEnabledIfValid(), this.composeTextSetDisabled(!1)
        }, this.handleComposeTextBlur = function(t) {
            t.stopPropagation();
            var e = 0;
            this.composeStayOpen || (e = this.attr.releaseFocusDelay), this.releaseFocusTimer = setTimeout(function() {
                this.releaseFocusTimer = null, this.focusRelease()
            }.bind(this), e)
        }, this.setMetadata = function(t) {
            t ? this.metadata = t : delete this.metadata
        }, this.getMetadata = function() {
            return this.metadata
        }
    }
    var i = t("flight/lib/component"),
        s = t("util/tweet_utils"),
        n = t("ui/compose/with_account_selector"),
        o = t("ui/compose/with_add_image"),
        r = t("ui/compose/with_character_count"),
        a = t("ui/with_click_trap"),
        c = t("data/with_client"),
        h = t("ui/compose/with_compose_text"),
        l = t("ui/compose/with_direct_message_button"),
        u = t("ui/with_focus"),
        d = t("ui/compose/with_hint"),
        m = t("ui/compose/with_in_reply_to"),
        g = t("ui/compose/with_media_bar"),
        p = t("ui/compose/with_message_recipient"),
        f = t("ui/compose/with_scheduler"),
        w = t("ui/compose/with_send_button"),
        C = t("ui/compose/with_send_tweet"),
        T = t("ui/compose/with_stay_open"),
        S = t("ui/compose/with_title");
    return i(e, n, o, r, a, c, h, l, u, d, m, g, p, f, w, C, T, S)
}), define("ui/user_selector", ["require", "flight/lib/component", "util/with_teardown", "ui/with_template", "ui/asynchronous_form"], function(t) {
    function e() {
        this.defaultAttrs({
            focusOnInit: !0,
            clearOnSelect: !0,
            blurOnSelect: !0,
            templateName: "user_selector",
            selectButtonIconClass: "icon-plus",
            selectButtonSelector: ".js-select-button",
            inputSelector: ".js-username-input"
        }), this.after("initialize", function() {
            this.render(this.attr.templateName, {
                searchInputControlClass: "margin-tm",
                selectButtonIconClass: this.attr.selectButtonIconClass
            }), this.attachChild(o.mixin(s), this.$node), this.on("click", {
                selectButtonSelector: this.handleInputSelection
            }), this.on("uiInputSubmit", {
                inputSelector: this.handleInputSelection
            }), this.autocomplete = new TD.components.Autocomplete(this.select("inputSelector"), {
                dmMode: !0
            }), this.on(this.autocomplete.$node, "td-autocomplete-select", function(t, e) {
                this.select("inputSelector").val(e), this.handleInputSelection()
            }.bind(this)), this.attr.focusOnInit && _.defer(function() {
                this.select("inputSelector").focus()
            }.bind(this))
        }), this.handleInputSelection = function() {
            var t = this.select("inputSelector").val();
            if (t) {
                this.trigger(this.attr.inputSelector, "uiWaitingForAsyncResponse");
                var e = TD.cache.twitterUsers.getByScreenName(t);
                e.addCallbacks(this.triggerSelection.bind(this), this.handleError.bind(this)), e.addBoth(this.trigger.bind(this, this.attr.inputSelector, "uiReceivedAsyncResponse"))
            }
        }, this.triggerSelection = function(t) {
            this.trigger("uiUserSelected", {
                user: t
            }), this.attr.clearOnSelect && this.select("inputSelector").val(""), this.attr.blurOnSelect && this.select("inputSelector").blur()
        }, this.handleError = function(t) {
            var e;
            try {
                e = t.req.errors[0].message
            } finally {
                e && TD.controller.progressIndicator.addMessage(e)
            }
        }
    }
    var i = t("flight/lib/component"),
        s = t("util/with_teardown"),
        n = t("ui/with_template"),
        o = t("ui/asynchronous_form");
    return i(e, s, n)
}), define("ui/contributor_list", ["require", "flight/lib/component", "data/with_accounts", "ui/with_template", "ui/with_transitions"], function(t) {
    function e() {
        this.defaultAttrs({
            accountKey: null,
            contributorRowSelector: ".js-contributor-row",
            contributorRowClass: "js-contributor-row",
            contributorRemoveSelector: ".js-contributor-remove",
            contributorIsAdminSelector: ".js-contributor-is-admin",
            actionConfirmSelector: ".js-contributor-action-confirm",
            actionCancelSelector: ".js-contributor-action-cancel",
            STATE_INITIAL: "initial",
            STATE_SETTINGS: "settings",
            STATE_CONFIRM_ADD: "confirmAdd",
            STATE_CONFIRM_DEADMIN: "confirmDeadmin",
            STATE_CONFIRM_REMOVE: "confirmRemove",
            STATE_REMOVING: "confirmRemove-removing",
            scrollDuration: 300,
            focusDuration: 800
        }), this.after("initialize", function() {
            this.state = {
                contributee: TD.storage.accountController.get(this.attr.accountKey),
                contributorIndex: {}
            }, this.on(document, "dataContributorsError", this.handleContributorsError), this.on(document, "dataContributors", this.handleContributors), this.on(document, "dataContributor", this.handleContributor), this.on(document, "dataContributorActionSuccess", this.handleContributorActionSuccess), this.on(document, "dataContributorActionError", this.handleContributorActionError), this.on("click", {
                contributorRemoveSelector: this.handleRemoveContributor,
                contributorIsAdminSelector: this.handleSetIsAdmin,
                actionConfirmSelector: this.handleActionConfirmClick,
                actionCancelSelector: this.handleActionCancelClick
            }), this.render("spinner_large"), this.trigger("uiNeedsContributors", {
                accountKey: this.attr.accountKey
            })
        }), this.sortByName = function(t, e) {
            var i = "string" == typeof t ? t.toLowerCase() : t.user.name.toLowerCase(),
                s = "string" == typeof e ? e.toLowerCase() : e.user.name.toLowerCase();
            return s > i ? -1 : i > s ? 1 : 0
        }, this.getElemByUserId = function(t, e) {
            return this.select(t).filter(function() {
                return $(this).attr("data-user-id") === e
            })
        }, this.handleContributorsError = function(t, e) {
            e.request.accountKey === this.attr.accountKey && this.render("contributors/contributor_list_error")
        }, this.handleContributors = function(t, e) {
            if (e.accountKey === this.attr.accountKey) {
                var i = this.state.contributorIndex;
                this.state.contributorIndex = e.contributors.reduce(function(t, e) {
                    return t[e.user.id] = e, t
                }, {}), Object.keys(i).forEach(function(t) {
                    this.state.contributorIndex[t] || this.removeContributorFromList(t)
                }.bind(this)), e.contributors.length ? e.contributors.forEach(function(t) {
                    this.setStateOrCreateContributor(t, this.attr.STATE_SETTINGS)
                }.bind(this)) : this.render("contributors/contributor_list_no_results")
            }
        }, this.handleContributor = function(t, e) {
            if (e.accountKey === this.attr.accountKey) {
                var i = this.state.contributorIndex[e.contributor.user.id];
                i && e.contributor.isUnconfirmed || (i = e.contributor, this.state.contributorIndex[e.contributor.user.id] = i);
                var s = i.isUnconfirmed ? this.attr.STATE_CONFIRM_ADD : this.attr.STATE_SETTINGS;
                this.setStateOrCreateContributor(e.contributor, s), e.contributor.isUnconfirmed && this.scrollToContributor(e.contributor.user.id)
            }
        }, this.handleRemoveContributor = function(t, e) {
            var i = $(e.el),
                s = i.attr("data-user-id"),
                n = this.state.contributorIndex[s];
            this.setStateOrCreateContributor(n, this.attr.STATE_CONFIRM_REMOVE)
        }, this.handleSetIsAdmin = function(t, e) {
            var i = $(e.el),
                s = i.attr("data-user-id"),
                n = this.state.contributorIndex[s],
                o = i.prop("checked"),
                r = this.getTwitterLoginAccount(),
                a = r && r.userId === s;
            a && !o ? this.setStateOrCreateContributor(n, this.attr.STATE_CONFIRM_DEADMIN) : this.trigger("uiContributorAction", {
                accountKey: this.attr.accountKey,
                action: "update",
                userId: s,
                isAdmin: o
            })
        }, this.handleActionConfirmClick = function(t, e) {
            var i = $(e.el).attr("data-user-id"),
                s = this.state.contributorIndex[i],
                n = this.getOrCreateContributorRow(s).attr("data-state"),
                o = {
                    accountKey: this.attr.accountKey,
                    userId: i,
                    action: null
                };
            switch (n) {
                case this.attr.STATE_CONFIRM_ADD:
                    o.action = "add", this.setStateOrCreateContributor(s, this.attr.STATE_SETTINGS);
                    break;
                case this.attr.STATE_CONFIRM_DEADMIN:
                    o.action = "update", o.isAdmin = !1, this.setStateOrCreateContributor(s, this.attr.STATE_SETTINGS);
                    break;
                case this.attr.STATE_CONFIRM_REMOVE:
                    o.action = "remove", this.setStateOrCreateContributor(s, this.attr.STATE_REMOVING)
            }
            o.action && this.trigger("uiContributorAction", o)
        }, this.handleActionCancelClick = function(t, e) {
            var i = $(e.el).attr("data-user-id"),
                s = this.state.contributorIndex[i],
                n = this.getOrCreateContributorRow(s),
                o = n.attr("data-state");
            switch (o) {
                case this.attr.STATE_CONFIRM_ADD:
                    this.removeContributorFromList(i);
                    break;
                case this.attr.STATE_CONFIRM_DEADMIN:
                    n.find(this.attr.contributorIsAdminSelector).prop("checked", !0), this.setStateOrCreateContributor(s, this.attr.STATE_SETTINGS);
                    break;
                case this.attr.STATE_CONFIRM_REMOVE:
                    this.setStateOrCreateContributor(s, this.attr.STATE_SETTINGS)
            }
        }, this.handleContributorActionSuccess = function(t, e) {
            if (e.request.accountKey === this.attr.accountKey) switch (e.request.action) {
                case "remove":
                    this.removeContributorFromList(e.request.userId)
            }
        }, this.handleContributorActionError = function(t, e) {
            if (e.request.accountKey === this.attr.accountKey) {
                var i = this.state.contributorIndex[e.request.userId];
                if (i) switch (e.request.action) {
                    case "update":
                        if (i.isUnconfirmed) this.setStateOrCreateContributor(i, this.attr.STATE_CONFIRM_ADD);
                        else {
                            var s = this.getElemByUserId("contributorIsAdminSelector", e.request.userId);
                            s.prop("checked", !e.request.isAdmin)
                        }
                        break;
                    default:
                        this.revertContributorState(i)
                }
            }
        }, this.setStateOrCreateContributor = function(t, e) {
            var i = this.getOrCreateContributorRow(t),
                s = i.attr("data-state");
            e !== s && this.animateElementHeightChange(i, function() {
                i.attr("data-previous-state", s), i.attr("data-state", e)
            }, "")
        }, this.revertContributorState = function(t) {
            var e = this.getOrCreateContributorRow(t).attr("data-previous-state");
            this.setStateOrCreateContributor(t, e)
        }, this.scrollToContributor = function(t) {
            var e = this.getElemByUserId("contributorRowSelector", t);
            setTimeout(function() {
                e.addClass("contributor-focus")
            }.bind(this), 1), setTimeout(function() {
                e.removeClass("contributor-focus")
            }, this.attr.focusDuration);
            var i = this.$node.scrollTop(),
                s = i + e.position().top;
            this.$node.animate({
                scrollTop: s + "px"
            })
        }, this.removeContributorFromList = function(t) {
            var e = this.getElemByUserId("contributorRowSelector", t);
            e.remove(), delete this.state.contributorIndex[t], 0 === this.select("contributorRowSelector").length && this.render("contributors/contributor_list_no_results")
        }, this.removeMessages = function() {
            this.$node.contents().filter(function(t, e) {
                return !$(e).hasClass(this.attr.contributorRowClass)
            }.bind(this)).remove()
        }, this.getOrCreateContributorRow = function(t) {
            this.removeMessages();
            var e = this.select("contributorRowSelector").filter(function() {
                return $(this).attr("data-user-id") === t.user.id
            });
            if (0 === e.length) {
                var i = !1;
                e = this.renderContributorRow(t), this.select("contributorRowSelector").each(function(s, n) {
                    var o = $(n);
                    !i && 1 === this.sortByName(o.attr("data-name"), t) && (e.insertBefore(o), i = !0)
                }.bind(this)), i || this.$node.append(e)
            }
            return e
        }, this.renderContributorRow = function(t) {
            var e = this.getTwitterLoginAccount(),
                i = {
                    initialState: this.attr.STATE_INITIAL,
                    contributor: t,
                    contributee: this.state.contributee,
                    isSigninAccount: e && t.user.id === e.userId
                };
            return this.renderTemplate("contributors/contributor_list_row", i)
        }
    }
    var i = t("flight/lib/component"),
        s = t("data/with_accounts"),
        n = t("ui/with_template"),
        o = t("ui/with_transitions");
    return i(e, s, n, o)
}), define("ui/contributor_manager", ["require", "flight/lib/component", "data/with_accounts", "ui/modal/with_modalable", "ui/with_template", "util/with_teardown", "ui/user_selector", "ui/contributor_list"], function(t) {
    function e() {
        this.defaultAttrs({
            accountKey: null,
            contributorAdderSelector: ".js-contributor-adder",
            contributorListSelector: ".js-contributor-list"
        }), this.after("initialize", function() {
            this.renderContributorManager(), this.attachChild(a, this.attr.contributorAdderSelector), this.attachChild(c, this.attr.contributorListSelector, {
                accountKey: this.attr.accountKey
            }), this.on("uiUserSelected", {
                contributorAdderSelector: this.handleUserSelection
            }), this.setContributorListPosition()
        }), this.renderContributorManager = function() {
            var t = this.getAccount(this.attr.accountKey);
            t.getProfileURL = "https://twitter.com/" + t.screenName, t.profileImageURL = t.profileImageURL, this.render("contributors/contributor_manager", {
                account: t,
                withUserBio: !1,
                withUserMenu: !1
            })
        }, this.setContributorListPosition = function() {
            var t = this.select("contributorListSelector");
            t.css({
                position: "absolute",
                top: t.position().top,
                bottom: 0,
                left: 0,
                right: 0
            })
        }, this.handleUserSelection = function(t, e) {
            this.trigger("dataContributor", {
                accountKey: this.attr.accountKey,
                contributor: {
                    user: e.user,
                    isAdmin: !1,
                    isUnconfirmed: !0
                }
            })
        }
    }
    var i = t("flight/lib/component"),
        s = t("data/with_accounts"),
        n = t("ui/modal/with_modalable"),
        o = t("ui/with_template"),
        r = t("util/with_teardown"),
        a = t("ui/user_selector"),
        c = t("ui/contributor_list");
    return i(e, s, n, o, r)
}), define("ui/account_settings", ["require", "flight/lib/component", "ui/with_accordion", "data/with_accounts", "util/with_teardown", "ui/with_template", "ui/contributor_manager"], function(t) {
    function e() {
        this.defaultAttrs({
            accountManagerContainerSelector: ".js-account-manager-container",
            contributorManagerContainerSelector: ".js-contributor-manager-container",
            contributorManagerSelector: ".js-contributor-manager",
            contributorManagerBackSelector: ".js-contributor-manager-back",
            actionButtonSelector: ".js-account-action",
            defaultAccountContainerSelector: ".js-account-default-account",
            defaultAccountComboSelector: ".js-account-set-default",
            accountRowSelector: ".js-account-settings-row",
            accountDetailSelector: ".js-account-settings-detail",
            accountSummarySelector: ".js-account-settings-summary",
            accountsContainerSelector: ".js-account-settings-accounts",
            passwordResetErrorSelector: ".js-password-reset-error",
            passwordResetSuccessSelector: ".js-password-reset-success",
            profileLinkSelector: 'a[rel="user"]',
            firstExpandDelay: 0
        }), this.after("initialize", function() {
            this.state = {
                accounts: [],
                isTwogin: "twitter" === this.getCurrentAuthType(),
                contributorManagerAccountKey: null
            }, this.on(document, "dataAccounts", this.handleDataAccounts), this.on(document, "dataAccountActionError", this.handleAccountActionError), this.on(document, "dataAccountActionSuccess", this.handleAccountActionSuccess), this.on(document, "uiDrawerActive", this.handleActiveDrawer), this.on("click", {
                actionButtonSelector: this.handleActionButtonClick,
                contributorManagerBackSelector: this.hideContributorManager,
                profileLinkSelector: this.handleProfileLinkClick
            }), this.on("change", {
                defaultAccountComboSelector: this.handleDefaultAccountSelected
            });
            var t = this.getAccountsForService("twitter");
            this.render("settings/account_settings", {
                withPasswordReset: !this.state.isTwogin,
                withDefaultAccountSelector: t.length > 1,
                accounts: t,
                withContributors: TD.config.contributors && this.state.isTwogin,
                tweetDeckAccountEmail: this.getTweetdeckLoginEmail()
            }), $(document).one("uiShowAccountSettings", this.showFirstAccount.bind(this)), this.on("uiAccordionExpandAction", this.handleAccordionItemExpanded)
        }), this.showFirstAccount = function() {
            setTimeout(function() {
                this.select("accordionToggleSelector").eq(0).click()
            }.bind(this), this.attr.firstExpandDelay)
        }, this.handleDataAccounts = function(t, e) {
            var i = e.accounts.length > 1,
                s = {}, n = this.select("defaultAccountContainerSelector");
            n.replaceWith(this.renderTemplate("settings/account_settings_default_selector", {
                accounts: e.accounts,
                withDefaultAccountSelector: i
            })), this.renderAccounts(e.accounts), this.state.contributorManagerAccountKey && (s[this.state.contributorManagerAccountKey] ? s[this.state.contributorManagerAccountKey].isAdmin || this.hideContributorManager() : this.hideContributorManager())
        }, this.renderAccounts = function(t) {
            var e, i = this.select("accountRowSelector"),
                s = this.select("accountsContainerSelector"),
                n = t.map(function(t) {
                    return t.accountKey
                });
            i.each(function(t, e) {
                var i = $(e),
                    s = i.attr("data-account-key"); - 1 === n.indexOf(s) && i.remove()
            }), t.forEach(function(t) {
                var n = i.filter('[data-account-key="' + t.accountKey + '"]'),
                    o = n.hasClass(this.attr.accordionIsExpandedClass),
                    r = $.extend({}, t, {
                        isExpanded: o,
                        withContributors: TD.config.contributors && this.state.isTwogin
                    }),
                    a = this.renderTemplate("settings/account_settings_row", r);
                n.length > 0 && n.replaceWith(a), e ? e.after(a) : s.prepend(a), e = a
            }, this)
        }, this.handleDefaultAccountSelected = function(t, e) {
            var i = $(e.el).val();
            this.trigger("uiAccountAction", {
                action: "setDefault",
                accountKey: i
            }), this.trigger(document, "scribeEvent", {
                terms: {
                    page: "settings",
                    section: "accounts",
                    element: "default",
                    action: "select"
                }
            })
        }, this.handleActionButtonClick = function(t, e) {
            var i = $(e.el).attr("data-action"),
                s = $(e.el).attr("data-account-key"),
                n = {
                    page: "settings",
                    section: "accounts",
                    component: {
                        remove: "account",
                        manageContributors: "account"
                    }[i],
                    element: {
                        remove: "remove",
                        add: "add_twitter_account",
                        passwordReset: "reset_password",
                        manageContributors: "show_contributor_manager"
                    }[i],
                    action: "click"
                };
            switch (i) {
                case "remove":
                    this.trigger("uiAccountAction", {
                        action: i,
                        accountKey: s
                    });
                    break;
                case "add":
                    this.trigger("uiAccountAction", {
                        action: i
                    });
                    break;
                case "passwordReset":
                    $(e.el).prop("disabled", "true"), this.trigger("uiAccountAction", {
                        action: i
                    });
                    break;
                case "manageContributors":
                    this.showContributorManager(s)
            }
            this.trigger(document, "scribeEvent", {
                terms: n
            })
        }, this.handleActiveDrawer = function(t, e) {
            e.activeDrawer || this.hideContributorManager()
        }, this.showContributorManager = function(t) {
            var e = this.select("accountManagerContainerSelector"),
                i = this.select("contributorManagerContainerSelector"),
                s = this.select("contributorManagerSelector");
            this.trigger(document, this.childTeardownEvent), s.empty(), e.addClass("is-hidden"), i.removeClass("is-hidden"), this.state.contributorManagerAccountKey = t, this.attachChild(a, s, {
                accountKey: t
            })
        }, this.hideContributorManager = function() {
            var t = this.select("accountManagerContainerSelector"),
                e = this.select("contributorManagerContainerSelector");
            this.trigger(document, this.childTeardownEvent), this.state.contributorManagerAccountKey = null, t.removeClass("is-hidden"), e.addClass("is-hidden")
        }, this.handleAccountActionSuccess = function(t, e) {
            switch (e.request.action) {
                case "passwordReset":
                    this.select("actionButtonSelector").filter('[data-action="passwordReset"]').prop("disabled", !1), this.select("passwordResetErrorSelector").addClass("is-hidden"), this.select("passwordResetSuccessSelector").removeClass("is-hidden")
            }
        }, this.handleAccountActionError = function(t, e) {
            switch (e.request.action) {
                case "passwordReset":
                    this.select("actionButtonSelector").filter('[data-action="passwordReset"]').prop("disabled", !1), this.select("passwordResetErrorSelector").removeClass("is-hidden"), this.select("passwordResetSuccessSelector").addClass("is-hidden")
            }
        }, this.handleAccordionItemExpanded = function() {
            this.trigger(document, "scribeEvent", {
                terms: {
                    page: "settings",
                    section: "accounts",
                    component: "account",
                    action: "impression"
                }
            })
        }, this.handleProfileLinkClick = function() {
            this.trigger(document, "scribeEvent", {
                terms: {
                    page: "settings",
                    section: "accounts",
                    component: "account",
                    element: "show_profile",
                    action: "click"
                }
            })
        }
    }
    var i = t("flight/lib/component"),
        s = t("ui/with_accordion"),
        n = t("data/with_accounts"),
        o = t("util/with_teardown"),
        r = t("ui/with_template"),
        a = t("ui/contributor_manager");
    return i(e, n, r, s, o)
}), define("ui/drawer", ["require", "flight/lib/component", "ui/compose/docked_compose", "ui/account_settings", "util/with_teardown"], function(t) {
    function e() {
        var t = "compose",
            e = "accountSettings",
            i = {};
        i[e] = "accounts", this.defaultAttrs({
            contentSelector: ".js-app-content",
            drawerSelector: ".js-drawer",
            closeDrawerSelector: ".js-drawer-close",
            composeSelector: ".js-drawer-compose",
            accountSettingsSelector: ".js-drawer-account-settings",
            drawerWidth: 245,
            transitionDuration: 200,
            accountSettingsExpandDelay: 200
        }), this.after("initialize", function() {
            this.state = {
                drawerOpen: !1
            }, this.$content = this.select("contentSelector"), this.on(document, "uiDrawerClose", this.handleDrawerClose), this.on(document, "uiShowAccountSettings", this.handleShowAccountSettings), this.on(document, "uiToggleDockedCompose", this.handleToggleDockedCompose), this.on("click", {
                closeDrawerSelector: this.handleCloseDrawerClick
            }), this.attachChild(s, this.getDrawerContainer(t)), this.attachChild(n, this.getDrawerContainer(e), {
                firstExpandDelay: this.attr.transitionDuration + this.attr.accountSettingsExpandDelay
            })
        }), this.getDrawerContainer = function(t) {
            return this.select("drawerSelector").filter(function() {
                return $(this).attr("data-drawer") === t
            })
        }, this.handleDrawerClose = function() {
            this.hideDrawer({
                withAnimation: !0
            })
        }, this.handleCloseDrawerClick = function() {
            this.hideDrawer({
                withAnimation: !0
            })
        }, this.handleShowAccountSettings = function() {
            TD.config.account_settings_drawer && this.showDrawer({
                drawer: e,
                withAnimation: !0
            })
        }, this.handleToggleDockedCompose = function(e, i) {
            i.opening ? this.showDrawer({
                drawer: t,
                withAnimation: !i.noAnimate
            }) : this.hideDrawer({
                withAnimation: !i.noAnimate
            })
        }, this.applyContentTransition = function(t) {
            TD.ui.main.TRANSITION_END_EVENTS && this.$content.one(TD.ui.main.TRANSITION_END_EVENTS, this.handleTransitionEnd.bind(this)), this.$content.css(t), TD.ui.main.TRANSITION_END_EVENTS || this.handleTransitionEnd()
        }, this.hideDrawer = function(t) {
            this.state.drawerOpen && (this.setTransitionDuration(t.withAnimation), this.state.drawerOpen = !1, this.applyContentTransition({
                transform: "translateX(0px)",
                "margin-right": "0"
            }), this.trigger("uiDrawerActive", {
                activeDrawer: null
            }))
        }, this.showDrawer = function(t) {
            this.setVisibleDrawer(t.drawer), this.trigger("uiDrawerActive", {
                activeDrawer: t.drawer
            }), this.state.drawerOpen || (this.setTransitionDuration(t.withAnimation), this.state.drawerOpen = !0, this.applyContentTransition({
                transform: "translateX(" + this.attr.drawerWidth + "px)"
            })), i[t.drawer] && this.trigger(document, "scribeEvent", {
                terms: {
                    page: "settings",
                    section: i[t.drawer],
                    action: "impression"
                }
            })
        }, this.handleTransitionEnd = function() {
            this.state.drawerOpen && this.$content.css({
                "margin-right": this.attr.drawerWidth
            }), this.trigger("uiDrawerTransitionComplete")
        }, this.setVisibleDrawer = function(t) {
            this.trigger("uiCloseModal"), this.select("drawerSelector").addClass("is-hidden");
            var e = this.getDrawerContainer(t);
            e.removeClass("is-hidden")
        }, this.setTransitionDuration = function(t) {
            t ? this.$content.css({
                "transition-duration": this.attr.transitionDuration + "ms"
            }) : this.$content.css({
                "transition-duration": "0"
            })
        }
    }
    var i = t("flight/lib/component"),
        s = t("ui/compose/docked_compose"),
        n = t("ui/account_settings"),
        o = t("util/with_teardown");
    return i(e, o)
}), define("ui/features/custom_timelines", ["flight/lib/component"], function(t) {
    function e() {
        this.defaultAttrs({
            disabledCSS: '<style type="text/css">.feature-customtimelines { display: none !important; }.prf .lst-profile li { width: 20% !important; }</style> '
        }), this.after("initialize", function() {
            this.enabled = void 0, this.defaultAccount = null, this.whitelist = {}, this.$disabledCSS = $(this.attr.disabledCSS), this.on(document, "uiNeedsFeatureCustomTimelines", this.triggerState), this.on(document, "dataDefaultAccount", this.handleDefaultAccount), this.on(document, "dataCustomTimelineWhitelistItem", this.handleWhitelistValue), this.on(document, "dataDeciderUpdated", this.updateState), this.trigger("uiNeedsDefaultAccount"), this.on(document, "uiFeatureCustomTimelines", this.onFeatureChange)
        }), this.after("teardown", function() {
            this.$disabledCSS.remove()
        }), this.handleDefaultAccount = function(t, e) {
            this.defaultAccount = e.accountKey, this.updateState()
        }, this.handleWhitelistValue = function(t, e) {
            this.whitelist[e.accountKey] = e.whitelisted, this.updateState()
        }, this.getEnabledState = function() {
            return Boolean(TD.config.custom_timelines && !TD.decider.get(TD.decider.DISABLE_CUSTOM_TIMELINES) && this.defaultAccount && this.whitelist[this.defaultAccount])
        }, this.updateState = function() {
            var t = this.getEnabledState();
            t !== this.enabled && (this.enabled = t, this.enabled ? this.$disabledCSS.remove() : $("body").append(this.$disabledCSS), this.triggerState())
        }, this.triggerState = function() {
            this.trigger("uiFeatureCustomTimelines", {
                enabled: this.enabled
            })
        }, this.onFeatureChange = function(t, e) {
            TD.sync.util.stateLog("Collection state changed to " + (e.enabled ? "enabled" : "disabled"))
        }
    }
    return t(e)
}), define("page/default", ["require", "flight/lib/component", "util/data_setup", "ui/keyboard_shortcuts", "ui/message_banner", "ui/app_search", "ui/column_controller", "ui/grid", "ui/grid_scroll", "ui/focus_controller", "ui/confirmation_dialog_controller", "ui/with_dialog_manager", "ui/message_banner_container", "ui/image_upload", "ui/login/startflow", "ui/login/sole_user_dialog", "ui/column_navigation", "ui/columns/column_order", "ui/search/search_in_popover", "ui/typeahead/typeahead_dropdown", "ui/search/search_results", "ui/search/search_router", "ui/app_header", "ui/default_page_layout", "ui/compose/compose_controller", "ui/drag_drop/drag_drop_controller", "ui/modal/modal_controller", "ui/migrate_controller", "ui/actions_menu", "ui/columns/column_drag_drop", "ui/drawer", "ui/features/custom_timelines"], function(t) {
    function e() {
        this.defaultAttrs({
            modal: "#open-modal",
            appHeader: ".js-app-header",
            searchResults: ".js-search-form",
            message: ".js-message-banner",
            appSearchSourceId: "appSearch",
            searchPopoverSourceId: "searchPopover",
            isHiddenClass: "is-hidden",
            gridFocusId: "grid_focus",
            modalsContainerSelector: ".js-modals-container",
            columnScrollContainerSelector: ".js-app-columns-container"
        }), this.initSearchInPopover = function() {
            T.attachTo(".js-search-in-popover", {
                popoverPosition: "rt",
                closeModals: !0,
                appSearchSourceId: this.attr.appSearchSourceId,
                searchPopoverSourceId: this.attr.searchPopoverSourceId,
                isHiddenClass: this.attr.isHiddenClass
            }), r.attachTo(".js-search-in-popover", {
                sourceId: this.attr.searchPopoverSourceId
            }), S.attachTo(".js-search-in-popover"), v.attachTo(".js-search-in-popover")
        }, this.initUI = function() {
            this.$node.find(".js-app").removeClass(this.attr.isHiddenClass), $("body", "html").removeClass("scroll-v"), R.attachTo(this.$node), D.attachTo(this.$node), l.attachTo(this.$node), A.attachTo(this.$node), m.attachTo(this.$node), o.attachTo(this.select("message")), u.attachTo(this.$node), F.attachTo(this.$node), E.attachTo(this.$node), a.attachTo(this.$node, {
                focusId: this.attr.gridFocusId
            }), C.attachTo(this.select("columnScrollContainerSelector")), c.attachTo(this.$node, {
                focusId: this.attr.gridFocusId
            }), h.attachTo(this.$node), g.attachTo("#compose-modal"), y.attachTo(".js-app-header"), _.attachTo(".js-app"), M.attachTo(this.$node), w.attachTo("#column-navigator"), r.attachTo(".js-search-form", {
                sourceId: this.attr.appSearchSourceId
            }), this.initSearchInPopover(), b.attachTo(this.$node), n.attachTo(this.$node)
        }, this.after("initialize", function() {
            function t(t, e) {
                f.attachTo(".js-app-loading", e)
            }
            s.attachTo(this.$node), I.attachTo(this.attr.modalsContainerSelector), k.attachTo(this.$node), p.attachTo(".js-app-loading", {
                teardownOn: "TD.ready"
            }), this.on(document, "TD.ready", function() {
                this.initUI(), this.off(document, "uiLoginShowSoleUserDialog", t)
            }.bind(this)), this.on(document, "uiLoginShowSoleUserDialog", t)
        })
    }
    var i = t("flight/lib/component"),
        s = t("util/data_setup"),
        n = t("ui/keyboard_shortcuts"),
        o = t("ui/message_banner"),
        r = t("ui/app_search"),
        a = t("ui/column_controller"),
        c = t("ui/grid"),
        h = t("ui/grid_scroll"),
        l = t("ui/focus_controller"),
        u = t("ui/confirmation_dialog_controller"),
        d = t("ui/with_dialog_manager"),
        m = t("ui/message_banner_container"),
        g = t("ui/image_upload"),
        p = t("ui/login/startflow"),
        f = t("ui/login/sole_user_dialog"),
        w = t("ui/column_navigation"),
        C = t("ui/columns/column_order"),
        T = t("ui/search/search_in_popover"),
        S = t("ui/typeahead/typeahead_dropdown"),
        v = t("ui/search/search_results"),
        b = t("ui/search/search_router"),
        y = t("ui/app_header"),
        D = t("ui/default_page_layout"),
        _ = t("ui/compose/compose_controller"),
        A = t("ui/drag_drop/drag_drop_controller"),
        I = t("ui/modal/modal_controller"),
        k = t("ui/migrate_controller"),
        F = t("ui/actions_menu"),
        E = t("ui/columns/column_drag_drop"),
        M = t("ui/drawer"),
        R = t("ui/features/custom_timelines");
    return i(e, d)
}), define("td/lib/require-domready", [], function() {
    function t(t) {
        var e;
        for (e = 0; e < t.length; e += 1) t[e](h)
    }

    function e() {
        var e = l;
        c && e.length && (l = [], t(e))
    }

    function i() {
        c || (c = !0, r && clearInterval(r), e())
    }

    function s(t) {
        return c ? t(h) : l.push(t), s
    }
    var n, o, r, a = "undefined" != typeof window && window.document,
        c = !a,
        h = a ? document : null,
        l = [];
    if (a) {
        if (document.addEventListener) document.addEventListener("DOMContentLoaded", i, !1), window.addEventListener("load", i, !1);
        else if (window.attachEvent) {
            window.attachEvent("onload", i), o = document.createElement("div");
            try {
                n = null === window.frameElement
            } catch (u) {}
            o.doScroll && n && window.external && (r = setInterval(function() {
                try {
                    o.doScroll(), i()
                } catch (t) {}
            }, 30))
        }
        "complete" === document.readyState && i()
    }
    return s.version = "2.0.1", s.load = function(t, e, i, n) {
        n.isBuild ? i(null) : s(i)
    }, s
}), require(["page/default", "td/lib/require-domready!"], function(t, e) {
    TD.util.checkAPIRoot(), t.attachTo(e), TD.controller.init.start()
}), $(document).ready(function() {
    TD.controller.init.preload()
}), define("scripts/swift/app/main", function() {});
