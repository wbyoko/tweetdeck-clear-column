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
                        }, h = s && !n;
                    return clearTimeout(n), n = setTimeout(a, i), h && (o = t.apply(e, r)), o
                }
            },
            throttle: function(t, i) {
                "number" != typeof i && (i = e);
                var s, n, o, r, a, h, c = this.debounce(function() {
                        a = r = !1
                    }, i);
                return function() {
                    s = this, n = arguments;
                    var e = function() {
                        o = null, a && (h = t.apply(s, n)), c()
                    };
                    return o || (o = setTimeout(e, i)), r ? a = !0 : (r = !0, h = t.apply(s, n)), c(), h
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
                        return (s = n.closest(o)).length ? (i = i || {}, i.el = s[0], t[o].apply(this, [e, i])) : void 0
                    }, this)
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
            (p[e] || e)(i, n, s) && console.log([o, ".", s].join(""), "->", ["(", typeof n[s], ")"].join(""), n[s]), "[object Object]" == Object.prototype.toString.call(n[s]) && n[s] != n && -1 == o.split(".").indexOf(s) && t(e, i, {
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

    function h() {
        var t = [].slice.call(arguments);
        T.eventNames.length || (T.eventNames = g), T.actions = t.length ? t : g, d()
    }

    function c() {
        var t = [].slice.call(arguments);
        T.actions.length || (T.actions = g), T.eventNames = t.length ? t : g, d()
    }

    function l() {
        T.actions = [], T.eventNames = [], d()
    }

    function u() {
        T.actions = g, T.eventNames = g, d()
    }

    function d() {
        window.localStorage && (localStorage.setItem("logFilter_eventNames", T.eventNames), localStorage.setItem("logFilter_actions", T.actions))
    }

    function m() {
        var t = {
            eventNames: window.localStorage && localStorage.getItem("logFilter_eventNames") || f,
            actions: window.localStorage && localStorage.getItem("logFilter_actions") || C
        };
        return Object.keys(t).forEach(function(e) {
            var i = t[e];
            "string" == typeof i && i !== g && (t[e] = i.split(","))
        }), t
    }
    var p = {
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
    }, g = "all",
        f = [],
        C = [],
        T = m();
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
            logFilter: T,
            logByAction: h,
            logByName: c,
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
        },
        this.on = function(e) {
            for (var i, s = n.findInstanceInfo(this), o = arguments.length, r = 1, a = new Array(o - 1); o > r; r++) a[r - 1] = arguments[r];
            if (s) {
                i = e.apply(null, a), i && (a[a.length - 1] = i);
                var h = t(this, a);
                s.addBind(h)
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
                h = arguments[a];
            return "string" != typeof h && (!h || !h.defaultBehavior) && (a--, s = h), 1 == a ? (t = $(arguments[0]), o = arguments[1]) : (t = this.$node, o = arguments[0]), o.defaultBehavior && (r = o.defaultBehavior, o = $.Event(o.type)), e = o.type || o, i.enabled && window.postMessage && n.call(this, e, s), "object" == typeof this.attr.eventData && (s = $.extend(!0, {}, this.attr.eventData, s)), t.trigger(o || e, s), r && !o.isDefaultPrevented() && (this[r] || r).call(this), t
        },
        this.on = function() {
            var e, i, s, n, o = arguments.length - 1,
                r = arguments[o];
            if (n = "object" == typeof r ? t.delegate(this.resolveDelegateRules(r)) : r, 2 == o ? (e = $(arguments[0]), i = arguments[1]) : (e = this.$node, i = arguments[0]), "function" != typeof n && "object" != typeof n) throw new Error('Unable to bind to "' + i + '" because the given callback is not a function or an object');
            return s = n.bind(this), s.target = n, n.guid && (s.guid = n.guid), e.on(i, s), n.guid = s.guid, s
        }, this.off = function() {
            var t, e, i, s = arguments.length - 1;
            return "function" == typeof arguments[s] && (i = arguments[s], s -= 1), 1 == s ? (t = $(arguments[0]), e = arguments[1]) : (t = this.$node, e = arguments[0]), t.off(e, i)
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
        var o, r, a, h, c, l, u;
        "function" == typeof s[s.length - 1] && (a = s.pop(), a = a.unbound || a), "object" == typeof s[s.length - 1] && s.pop(), 2 == s.length ? (r = s[0], o = s[1]) : (r = i.$node[0], o = s[0]), window.DEBUG && window.DEBUG.enabled && (h = DEBUG.events.logFilter, l = "all" == h.actions || h.actions.indexOf(t) > -1, c = function(t) {
            return t.test ? t : new RegExp("^" + t.replace(/\*/g, ".*") + "$")
        }, u = "all" == h.eventNames || h.eventNames.some(function(t) {
            return c(t).test(o)
        }), l && u && console.info(n[t], t, "[" + o + "]", e(r), i.constructor.describe.split(" ").slice(0, 3).join(" ")))
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
            i.instance.teardown()
        })
    }

    function h(t) {
        for (var i = arguments.length, s = new Array(i - 1), o = 1; i > o; o++) s[o - 1] = arguments[o];
        if (!t) throw new Error("Component needs to be attachTo'd a jQuery object, native node or selector string");
        var r = e.merge.apply(e, s),
            a = n.findComponentInfo(this);
        $(t).each(function(t, e) {
            a && a.isAttachedTo(e) || (new this).initialize(e, r)
        }.bind(this))
    }

    function c() {
        for (var e = arguments.length, c = new Array(e + 3), u = 0; e > u; u++) c[u] = arguments[u];
        var d = function() {};
        return d.toString = d.prototype.toString = function() {
            var t = c.map(function(t) {
                if (null == t.name) {
                    var e = t.toString().match(l);
                    return e && e[1] ? e[1] : ""
                }
                return "withBase" != t.name ? t.name : ""
            }).filter(Boolean).join(", ");
            return t
        }, r.enabled && (d.describe = d.prototype.describe = d.toString()), d.attachTo = h, d.teardownAll = a, r.enabled && c.unshift(o), c.unshift(s, t.withAdvice, n.withRegistration), i.mixin(d.prototype, c), d
    }
    var l = /function (.*?)\s?\(/;
    return c.teardownAll = function() {
        n.components.slice().forEach(function(t) {
            t.component.teardownAll()
        }), n.reset()
    }, c
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
                profileImageUrl: i.getProfileImageURL()
            }
        }
    }
    return t
}), define("data/accounts", ["flight/lib/component", "data/with_client"], function(t, e) {
    function i() {
        this.sendAccounts = function() {
            this.trigger(document, "dataAccounts", {
                accounts: this.accounts
            })
        }, this.processAccountObjects = function(t) {
            return t.map(function(t) {
                return {
                    accountKey: t.getKey(),
                    profileImageUrl: t.getProfileImageURL(),
                    screenName: t.getUsername()
                }
            })
        }, this.sortAccounts = function(t) {
            var e = TD.storage.accountController.getDefault(),
                i = t;
            !i && e && (i = e.getKey()), 1 === this.accounts.length ? (this.defaultAccountKey = this.accounts[0].accountKey, this.accounts[0].isDefault = !0) : this.accounts.forEach(function(t) {
                t.accountKey === i ? (t.isDefault = !0, this.defaultAccountKey = t.accountKey) : t.isDefault = !1
            }, this), this.accounts.sort(function(t, e) {
                var i, s;
                return t.isDefault ? -1 : e.isDefault ? 1 : (i = t.screenName.toLowerCase(), s = e.screenName.toLowerCase(), s > i ? -1 : i > s ? 1 : 0)
            })
        }, this.getAccounts = function() {
            var t = TD.storage.accountController.getAccountsForService("twitter");
            this.accounts = this.processAccountObjects(t), this.sortAccounts(), this.sendAccounts()
        }, this.handleDefaultAccount = function(t, e) {
            this.defaultAccountKey !== e.accountKey && (this.defaultAccountKey = e.accountKey, this.sortAccounts(e.accountKey), this.sendAccounts(), this.trigger("dataTwitterClientChanged", {
                client: this.getTwitterClient()
            }))
        }, this.handleUiNeedsAccounts = function() {
            this.getAccounts()
        }, this.handleAccountWhitelist = function() {
            this.getAccounts()
        }, this.handleNeedsDefaultAccount = function() {
            var t = TD.storage.accountController.getDefault();
            t && this.trigger("dataDefaultAccount", {
                accountKey: t.getKey()
            })
        }, this.after("initialize", function() {
            this.accounts = [], this.defaultAccountKey = null,
            this.on(document, "uiNeedsAccounts", this.handleUiNeedsAccounts),
            this.on(document, "uiNeedsDefaultAccount", this.handleNeedsDefaultAccount),
            this.on(document, "dataDefaultAccount", this.handleDefaultAccount),
            this.on(document, "dataAccountWhitelist", this.handleAccountWhitelist)
        })
    }
    return t(i, e)
}), define("data/column_manager", ["flight/lib/component"], function(t) {
    var e = function() {
        this.deleteColumn = function(t, e) {
            var i = e.columnId;
            i && TD.controller.columnManager.deleteColumn(i)
        }, this.moveColumn = function(t, e) {
            var i = e.columnId,
                s = e.action;
            i && s && TD.controller.columnManager.move(i, s)
        }, this.handleUiNeedsColumnOrder = function() {
            var t = TD.controller.columnManager.getAllOrdered();
            this.trigger("dataColumnOrder", {
                columns: t
            })
        }, this.after("initialize", function() {
            this.on(document, "uiDeleteColumnAction", this.deleteColumn),
            this.on(document, "uiMoveColumnAction", this.moveColumn),
            this.on(document, "uiNeedsColumnOrder", this.handleUiNeedsColumnOrder)
        })
    };
    return t(e)
}), define("data/embed_timeline", ["flight/lib/component", "data/with_client"], function(t, e) {
    function i() {
        this.checkListSubscription = function(t, e, i) {
            var s = _.uniqueId(),
                n = {
                    id: s,
                    title: TD.i("Subscribe to this list?"),
                    message: TD.i("To share this list, we need to subscribe you to it. Subscribe and share?"),
                    okLabel: TD.i("OK"),
                    cancelLabel: TD.i("Cancel")
                }, o = function() {
                    TD.util.openURL(e, i)
                }, r = function(e, i) {
                    var n;
                    i.id === s && (this.off(document, "uiConfirmationAction", r), i.result && (n = this.getTwitterClient(), n.subscribeToList(t, o)))
                }, a = this.getTwitterClient().oauth.account.getKey(),
                h = TD.cache.lists.find(t, null, null, !1, a);
            h ? o() : (this.on(document, "uiConfirmationAction", r.bind(this)), this.trigger("uiShowConfirmationDialog", n))
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
            var i = TD.settings.getIdsForSeenMessages();
            i.push(e.id), TD.settings.setIdsForSeenMessages(i)
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
                var e = TD.settings.getIdsForSeenMessages(),
                    i = e.every(function(e) {
                        return t.message.id !== e
                    });
                return i
            }
            return !1
        }, this.handleMessages = function(t, e) {
            var i = e.messages;
            i && (i = i.filter(this.satisfiesPlatformRequirements, this), i = i.filter(this.satisfiesVersionRequirements, this), i = i.filter(this.hasNotBeenDismissed, this), i.length && this.trigger("dataMessage", i[0]))
        }, this.after("initialize", function() {
            this.on(document, "uiHidingMessageBanner", this.dismissMessage),
            this.on(document, "dataMessages", this.handleMessages)
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
            this.on(document, "uiNeedsPreferredAccount", this.getPreferredTwitterAccount),
            this.on(document, "TD.ready", this.tdReady), $.subscribe("/storage/account/new", this.getPreferredTwitterAccount.bind(this)), $.subscribe("/storage/client/default_account_changed", this.getPreferredTwitterAccount.bind(this))
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
            this.on(document, "uiFollowAction", this.bindAction(this.attr.actions.follow)),
            this.on(document, "uiUnfollowAction", this.bindAction(this.attr.actions.unfollow)),
            this.on(document, "uiBlockAction", this.bindAction(this.attr.actions.block)),
            this.on(document, "uiUnblockAction", this.bindAction(this.attr.actions.unblock)),
            this.on(document, "uiReportSpamAction", this.bindAction(this.attr.actions.reportSpam)),
            this.on(document, "uiReportCompromisedAction", this.bindAction(this.attr.actions.reportCompromised))
        })
    };
    return t(i, e)
}), define("data/settings", ["flight/lib/component"], function(t) {
    function e() {
        this.after("initialize", function() {
            this.on(document, "uiNeedsSettings", this.handleUiNeedsSettings),
            this.on(document, "uiNeedsSettingsValues", this.handleUiNeedsSettingsValues),
            this.on(document, "uiSetSettingsValues", this.handleUiSetSettingsValues),
            this.on(document, "uiToggleTheme", this.toggleTheme),
            this.on(document, "uiNavbarWidthChangeAction", this.handleNavbarWidthChange),
            this.on(document, "uiChangeComposeStayOpen", this.handleComposeStayOpen)
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
            this.on(document, "uiNeedsUserSearch", this.doUserSearch),
            this.on(document, "uiNeedsUserLookup", this.doUserLookup)
        })
    }
    return t(i, e)
}), define("data/storage", ["flight/lib/component"], function(t) {
    var e = function() {
        this.get = function(t, e) {
            e.names ? e.names.forEach(function(t) {
                this.trigger(document, "dataStorageItem", {
                    name: t,
                    value: TD.storage.store.get(t)
                })
            }, this) : e.name && this.trigger(document, "dataStorageItem", {
                name: e.name,
                value: TD.storage.store.get(name)
            })
        }, this.set = function(t, e) {
            for (var i in e)
                if (e.hasOwnProperty(i)) try {
                    TD.storage.store.nonCriticalSet(i, e[i])
                } catch (s) {
                    s.code === DOMException.QUOTA_EXCEEDED_ERR ? this.trigger(document, "dataStorageFull", {
                        name: i,
                        value: e[i]
                    }) : this.trigger(document, "dataStorageSetError", {
                        name: i,
                        value: e[i]
                    })
                }
        }, this.after("initialize", function() {
            this.on("dataStorageSet", this.set),
            this.on("dataStorageGet", this.get)
        })
    };
    return t(e)
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
            this.on(document, "uiSearch", this.saveRecentSearch),
            this.on(document, "uiRecentSearchClearAction", this.clearRecentSearches),
            this.on(document, "uiNeedsRecentSearches", this.getRecentSearches)
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
                }), delete t.location, delete t.connecting_user_ids, this.userHash[t.id] = t, t.tokens.forEach(function(e) {
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
            },
            this.on(document, "dataStorageItem", this.processUserStorageItem),
            this.on(document, "TD.ready", this.loadUserData),
            this.on(document, "dataTwitterClientChanged", this.resetUserData),
            this.on(document, "dataStorageFull", this.pruneUsers)
        })
    }
    return t
}), define("data/typeahead/with_topics_datasource", [], function() {
    var t = function() {
        this.defaultAttrs({
            storageTopicsHash: "typeaheadTopicsHash",
            storageTopicsLastPrefetch: "typeaheadTopicsLastPrefetch"
        }), this.topicSortComparator = function(t, e) {
            return e.rounded_score - t.rounded_score
        }, this.overwriteTopics = function(t) {
            this.topicsHash = {}, this.topicsAdjacencyList = {}, this.processTopicData(t)
        }, this.processTopicData = function(t) {
            _.each(t, function(t) {
                var e = t.topic;
                this.topicsHash[e] = t, t.tokens.forEach(function(t) {
                    var i = t.token.charAt(0).toLowerCase(),
                        s = this.topicsAdjacencyList[i] || []; - 1 === s.indexOf(e) && s.push(e), this.topicsAdjacencyList[i] = s
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
            },
            this.on(document, "dataStorageItem", this.processTopicStorageItem),
            this.on(document, "TD.ready", this.loadTopicsData),
            this.on(document, "dataTwitterClientChanged", this.resetTopicData),
            this.on(document, "dataStorageFull", this.pruneTopics)
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
            },
            this.on(document, "dataRecentSearches", this.handleRecentSearches)
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
            },
            this.on(document, "dataSubscribedLists", this.handleSubscribedLists)
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
            }, {}, this),
            this.on("uiNeedsTypeaheadSuggestions", this.getSuggestions),
            this.on("uiRecentSearchClearAction", this.updateSuggestions),
            this.on("dataTypeaheadQueryReset", this.queryReset)
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
}), define("data/account", ["flight/lib/component"], function(t) {
    var e = function() {
        this.handleReauthorizeTwitterAccount = function(t, e) {
            TD.controller.clients.addClient("twitter", e.account, !0)
        }, this.handleRemoveTwitterAccount = function(t, e) {
            TD.controller.clients.removeClient(e.key)
        }, this.after("initialize", function() {
            this.on(document, "uiRemoveTwitterAccount", this.handleRemoveTwitterAccount),
            this.on(document, "uiReauthorizeTwitterAccount", this.handleReauthorizeTwitterAccount)
        })
    };
    return t(e)
}), define("data/with_twitter_api", ["flight/lib/compose", "data/with_client"], function(t, e) {
    return function() {
        t.mixin(this, [e]), this.defaultAttrs({
            defaultBaseUrl: "https://api.twitter.com",
            defaultApiVersion: "1.1"
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
            var e, i, s = [],
                n = this.getClientByAccountKey(t.request.accountKey),
                o = this.wrapTwitterApiErrback(t, n),
                r = this.wrapTwitterApiCallback(t, n);
            s.push(t.baseUrl || this.attr.defaultBaseUrl), s.push(t.apiVersion || this.attr.defaultApiVersion), s.push(t.resource), e = s.join("/"), i = t.method || "GET";
            try {
                n.makeTwitterCall(e, t.params, i, t.dataProcessor, r, o, t.feedType)
            } catch (a) {
                o()
            }
        }
    }
}), define("data/tweet", ["flight/lib/component", "data/with_twitter_api"], function(t, e) {
    function i() {
        this.defaultAttrs({
            resources: {
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
                }
            }
        }), this.after("initialize", function() {
            this.on(document, "uiSendTweet", this.handleSendTweet)
        }), this.sendTweet = function(t) {
            var e, i, s;
            try {
                switch (e = this.attr.resources[t.type], t.type) {
                    case "message":
                        i = {
                            text: t.text,
                            user_id: t.messageRecipient.userId,
                            screen_name: t.messageRecipient.screenName,
                            media_id: t.mediaId
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
                this.makeTwitterApiCall({
                    request: t,
                    resource: e.url,
                    method: e.method,
                    params: i,
                    success: "dataTweetSent",
                    error: "dataTweetError",
                    dataProcessor: s,
                    processAsStreamData: !0
                })
            } catch (n) {
                this.trigger("dataTweetError", {
                    request: t
                })
            }
        }, this.handleSendTweet = function(t, e) {
            e.file || this.sendTweet(e)
        }
    }
    return t(i, e)
}), define("data/tweetdeck_api", ["flight/lib/component", "data/with_client"], function(t, e) {
    function i() {
        var t = 1,
            e = 2,
            i = 32;
        this.defaultAttrs({
            apiRoot: null,
            proxyMediaUploadUrl: "/oauth/media/twitter",
            twoStageUploadUrl: "/oauth/upload",
            mobileAuthRequestLimit: 60,
            mobile2FAPollInterval: 2e3
        }), this.mobileAuthRequestCount = 0, this.after("initialize", function() {
            this.on(document, "uiSendTweet", this.handleSendTweet),
            this.on(document, "uiSendScheduledTweets", this.handleSendScheduledUpdates),
            this.on(document, "uiLoginRequest", this.handleLoginRequest),
            this.on(document, "uiTweetDeckLoginRequest", this.handleTweetDeckLoginRequest),
            this.on(document, "uiTweetDeckForgotPasswordRequest", this.handleForgotPasswordRequest),
            this.on(document, "uiLogin2FARequest", this.handleLogin2FARequest)
        }), this.responseFactory = function(t, e) {
            return function(i) {
                this.trigger(t, {
                    response: i,
                    request: e
                })
            }.bind(this)
        }, this.handleSendTweet = function(t, e) {
            if (e.file) {
                var i, s = this.getClientByAccountKey(e.accountKey),
                    n = this.attr.proxyMediaUploadUrl,
                    o = this.responseFactory("dataTweetSent", e),
                    r = "media[]",
                    a = s.oauth.account,
                    h = new FormData;
                switch (e.type) {
                    case "reply":
                        h.append("status", e.text), h.append("in_reply_to_status_id", e.inReplyToStatusId);
                        break;
                    case "tweet":
                        h.append("status", e.text);
                        break;
                    case "message":
                        n = this.attr.twoStageUploadUrl, r = "media", o = function(i) {
                            delete e.file, e.mediaId = i.data.media_id_string, this.trigger(document, t, e)
                        }.bind(this)
                }
                h.append(r, e.file), i = TD.net.ajax.upload(this.attr.apiRoot + n, h, a), i.addCallbacks(o, this.responseFactory("dataTweetError", e))
            }
        }, this.handleSendScheduledUpdates = function(t, e) {
            var i = this.getTweetDeckClient(),
                s = e.requests.map(function(t) {
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
                                avatar_url: e.profileImageUrl
                            }
                        }
                    }
                }.bind(this)),
                n = i.scheduleGroup(s, e.scheduledDate, e.tokenToDelete);
            n.addCallbacks(this.responseFactory("dataScheduledTweetsSent", e), this.responseFactory("dataScheduledTweetsError", e))
        }, this.handleTweetDeckLoginRequest = function(t, e) {
            var i = TD.storage.accountController.loginTweetdeck(e.email, e.password);
            return i.addCallback(function(t) {
                this.handleTweetDeckLoginResponse(e, t, e.staySignedIn)
            }.bind(this)), i
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
        }, this.handleLoginRequest = function(t, e) {
            var i = TD.storage.accountController.loginTwitter(e.username, e.password);
            return i.addCallback(function(t) {
                this.handleLoginResponse(e, t, e.staySignedIn)
            }.bind(this)), i
        }, this.handleLogin2FARequest = function(t, e) {
            var i, s;
            return e.requestId ? (s = {
                requestId: e.requestId,
                userId: e.userId
            }, e.code && (s.code = e.code), i = TD.storage.accountController.loginTwitterWith2FACode(e.username, e.password, s), i.addCallback(function(t) {
                this.handleLoginResponse(e, t, e.staySignedIn)
            }.bind(this)), i) : (TD.util.errmark("Undefined 2FA login request."), void 0)
        }, this.handleLoginResponse = function(s, n, o) {
            200 === n.httpStatus ? n.account.uid ? (n.staySignedIn = o, this.trigger("dataLoginAuthSuccess", n)) : n.xAuth.login_verification_request_type === t ? (TD.sync.util.verboseLog("Twogin: Awaiting 2FA code from SMS"), n.staySignedIn = o, this.trigger("dataLoginTwoFactorCodeRequired", n)) : n.xAuth.login_verification_request_type === e ? (TD.sync.util.verboseLog("Twogin: Awaiting 2FA auth from mobile app"), this.schedule2FARequest({
                username: s.username,
                password: s.password,
                requestId: n.xAuth.login_verification_request_id,
                userId: n.xAuth.login_verification_user_id,
                staySignedIn: o
            }), this.trigger("dataLoginTwoFactorAwaitingConfirmation")) : this.trigger("dataLoginError", {}) : 401 === n.httpStatus && n.xAuth.errors && n.xAuth.errors.length > 0 ? n.xAuth.errors[0].code === i && s.requestId ? (s.staySignedIn = o, this.schedule2FARequest(s)) : this.trigger("dataLoginError", {
                code: n.xAuth.errors[0].code
            }) : 500 === n.httpStatus ? this.trigger("dataLoginServerError") : this.trigger("dataLoginError", {
                code: n.httpStatus
            })
        }, this.schedule2FARequest = function(t) {
            this.mobileAuthRequestCount < this.attr.mobileAuthRequestLimit ? (TD.sync.util.verboseLog("Twogin: Scheduling mobile 2FA check"), setTimeout(function() {
                this.mobileAuthRequestCount = this.mobileAuthRequestCount + 1, this.trigger("uiLogin2FARequest", t)
            }.bind(this), this.attr.mobile2FAPollInterval)) : this.trigger("dataLogin2FATimeout", t)
        }
    }
    return t(i, e)
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
            TD.util.isTouchDevice() && TD.decider.get(TD.decider.TOUCHDECK_COMPOSE) ? $(".js-new-compose").addClass(this.attr.isTouchComposeClass) : $(".js-new-compose").removeClass(this.attr.isTouchComposeClass)
        }, this.handleUpdateFontSize = function() {
            TD.util.isTouchDevice() && TD.decider.get(TD.decider.TOUCHDECK_FONTSIZE) ? $("html").addClass(this.attr.withTouchFontSizeClass) : $("html").removeClass(this.attr.withTouchFontSizeClass)
        }, this.handleUpdateSearch = function() {
            TD.util.isTouchDevice() && TD.decider.get(TD.decider.TOUCHDECK_SEARCH) ? $(".js-search").addClass(this.attr.isTouchSearchClass) : $(".js-search").removeClass(this.attr.isTouchSearchClass)
        }, this.handleUpdateSidebar = function() {
            TD.util.isTouchDevice() && TD.decider.get(TD.decider.TOUCHDECK_SIDEBAR) ? ($(".js-app").addClass(this.attr.withTouchSidebarClass), $(".js-app-header").addClass(this.attr.isTouchSidebarClass)) : ($(".js-app").removeClass(this.attr.withTouchSidebarClass), $(".js-app-header").removeClass(this.attr.isTouchSidebarClass))
        }, this.handleUpdateTweetControls = function() {
            TD.util.isTouchDevice() && TD.decider.get(TD.decider.TOUCHDECK_TWEETCONTROLS) ? $(".js-chirp-container").addClass(this.attr.isTouchTweetContainer) : $(".js-chirp-container").removeClass(this.attr.isTouchTweetContainer)
        }, this.after("initialize", function() {
            this.on(document, "dataDeciderUpdated", this.handleUpdateCompose),
            this.on(document, "dataDeciderUpdated", this.handleUpdateFontSize),
            this.on(document, "dataDeciderUpdated", this.handleUpdateSearch),
            this.on(document, "dataDeciderUpdated", this.handleUpdateSidebar),
            this.on(document, "dataDeciderUpdated", this.handleUpdateTweetControls)
        })
    };
    return t(e)
}), define("data/custom_timelines", ["flight/lib/component", "data/with_client"], function(t, e) {
    function i() {
        this.after("initialize", function() {
            this.on(document, "uiAddTweetToCustomTimeline", this.checkData(this.addTweetToCustomTimeline)),
            this.on(document, "uiRemoveTweetFromCustomTimeline", this.checkData(this.removeTweetFromCustomTimeline)),
            this.on(document, "uiNeedsCustomTimeline", this.fetchCustomTimeline),
            this.on(document, "uiUpdateCustomTimeline", this.updateCustomTimeline),
            this.on(document, "dataAddTweetToCustomTimelineError", function() {
                TD.controller.progressIndicator.addMessage(TD.i("Problem adding Tweet: please try again"))
            }),
            this.on(document, "dataRemoveTweetToCustomTimelineError", function() {
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
}), define("ui/with_key_handler", [], function() {
    function t() {
        this.activeSequences = {}, this.sequenceStarters = {}, this.singleKeys = {}, this.combos = {}, this.defaultAttrs({
            charCodes: {
                esc: 27,
                ret: 13,
                del: 46,
                left: 37,
                up: 38,
                right: 39,
                down: 40,
                bksp: 8,
                pageup: 33,
                pagedown: 34,
                home: 36,
                end: 35
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
            if (n = t.split("+"), 2 !== n.length) throw "addCombo: invalid combo";
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
            this.on(window, "keypress", this.handleKeyPress),
            this.on(window, "keydown", this.handleKeyDown)
        })
    }
    return t
}), define("ui/keyboard_shortcuts", ["flight/lib/component", "ui/with_key_handler"], function(t, e) {
    var i = function() {
        this.defaultAttrs({
            shortcuts: {
                esc: [{
                    event: "uiInputBlur",
                    selector: "input, textarea"
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
                    event: "uiGridShowDetail"
                }, {
                    event: "uiInputSubmit",
                    selector: ".js-submittable-input"
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
                    event: "uiGridLeft",
                    throttle: !0
                }],
                h: [{
                    event: "uiGridLeft",
                    throttle: !0
                }],
                right: [{
                    event: "uiGridRight",
                    throttle: !0
                }],
                l: [{
                    event: "uiGridRight",
                    throttle: !0
                }],
                up: [{
                    event: "uiGridUp",
                    throttle: !0
                }],
                k: [{
                    event: "uiGridUp",
                    throttle: !0
                }],
                down: [{
                    event: "uiGridDown",
                    throttle: !0
                }],
                j: [{
                    event: "uiGridDown",
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
                " ": [{
                    event: "uiGridPageDown",
                    throttle: !0
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
            this.message && this.message.id == e.message.id || (this.message = e.message, this.showMessage())
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
            }),
            this.on(this.select("dismissButton"), "click", this.dismiss), s.actions.forEach(function(t) {
                this.on('[data-action-id="' + t.actionId + '"]', "click", t.boundEventHandler)
            }.bind(this)), this.resizeBannerCheckInterval = window.setInterval(function() {
                this.currentBannerHeight && this.currentBannerHeight !== this.$node.outerHeight() && this.trigger("uiMessageBannerResized"), this.currentBannerHeight = this.$node.outerHeight()
            }.bind(this), 200), this.$node.removeClass("is-hidden"), this.trigger("uiMessageBannerShown", this.message)
        }, this.after("initialize", function() {
            this.on(document, "dataMessage", this.handleMessageData),
            this.on(document, "uiMessageBannerContainerHidden", this.handleMessageContainerHidden)
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
            this.$textInput = this.select("textInputSelector"), this.value = this.$textInput.val().trim(), "" !== this.value && this.$node.addClass(this.attr.hasValueClass),
            this.on("click", {
                clearButtonSelector: this.handleClearAction
            }),
            this.on("uiAsyncFormWaitingForResponse", this.handleAsyncFormWaitingForResponse),
            this.on("uiAsyncFormReceivedResponse", this.handleAsyncFormReceivedResponse),
            this.on("uiSearchInputDestroy", this.teardown)
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
            this.on("uiReceivedAsyncResponse", this.receivedAsyncResponse),
            this.on("uiWaitingForAsyncResponse", this.waitingForAsyncResponse),
            this.on("uiDestroyAsynchronousForm", this.destroy),
            this.on("uiSearchInputCleared", this.handleSearchInputCleared), this.$searchControls = this.select("searchControlSelector"), e.attachTo(this.$searchControls)
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
            }), this.$input = this.select("appSearchInputSelector"),
            this.on(this.$input, "keyup keydown keypress paste", this.modifierKeyPressed),
            this.on(this.$input, "focus", this.handleFocus),
            this.on(this.$input, "uiInputBlur", function() {
                this.$input.blur()
            }),
            this.on(this.$input, "click", function(t) {
                t.stopPropagation()
            }),
            this.on(this.select("searchButtonSelector"), "click", function() {
                this.trigger(this.$input, "uiSearchInputSubmit", {
                    query: this.$input.val()
                })
            }),
            this.on(this.select("clearButtonSelector"), "click", this.handleClearSearchAction),
            this.on("uiAppSearchSetPreventDefault", this.setPreventKeyDefault),
            this.on("uiAppSearchItemComplete", this.completeInput),
            this.on("uiAppSearchSubmit", this.handleAppSearchSubmit),
            this.on(document, "uiNewSearchQuery uiSearchInputChanged", this.handleSearchInputChanged)
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
        }, this.before("teardown", function() {
            this.trigger("uiDestroyAsynchronousForm")
        })
    }
    return t(i)
}), define("ui/with_column_selectors", [], function() {
    var t = function() {
        this.defaultAttrs({
            columnStateDetailViewClass: "js-column-state-detail-view",
            columnStateSocialProofClass: "js-column-state-social-proof",
            columnSelector: ".js-app-columns .js-column",
            columnUpdateGlow: ".js-column-update-glow",
            scrollContainerSelector: ".js-column-scroller",
            columnDetailScrollerSelector: ".js-detail-container",
            columnOptionsSelector: ".js-column-options",
            columnOptionsContainerSelector: ".js-column-options-container",
            columnHeaderSelector: ".js-column-header",
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
            var n, o = this.measureElementHeight(t, i);
            t.css({
                height: ""
            }), t.html(e), n = this.measureElementHeight(t), this.animateHeightFromTo(t, o, n, i, s)
        }, this.transitionExpand = function(t, e, i) {
            this.animateHeight(t, e, i, "expand")
        }, this.transitionCollapse = function(t, e, i) {
            this.animateHeight(t, e, i, "collapse")
        }, this.transitionTop = function(t, e, i, s) {
            var n = function() {
                t.removeClass(e), "function" == typeof s && s()
            };
            t.addClass(e), t.css("top", i), TD.ui.main.TRANSITION_END_EVENTS ? t.one(TD.ui.main.TRANSITION_END_EVENTS, n) : n()
        }
    }
    return t
}), define("ui/with_easing", ["require"], function() {
    function t() {
        this.easeFn = function(t) {
            var e = i[t];
            if (!e) throw "No such method";
            return function(t, i, s) {
                return i + s * e(t)
            }
        }, this.before("initialize", function() {
            this.runningInterpolations = {}, this.easingGuid = 1
        }), this.ease = function(t, i) {
            if (t = t || {}, [typeof t.from, typeof t.time, typeof t.applicator].indexOf("undefined") > -1) throw new Error("animate requires from, time and applicator.");
            var s = parseFloat(t.from);
            if (!_.isNumber(s)) throw new Error("A numeric from value is required.");
            if ("undefined" == typeof t.to && "undefined" == typeof t.delta) throw new Error("animate either a to amount or a delta.");
            var n = parseFloat(t.to);
            if ("undefined" != typeof t.delta && (n = s + parseFloat(t.delta)), !_.isNumber(n)) throw new Error("A numeric to value is required.");
            var o = t.time;
            _.isNumber(o) || (o = parseFloat(o));
            var r = t.easing;
            "function" != typeof r && (r = this.easeFn("linear"));
            var a = t.applicator;
            if ("function" != typeof a) throw new Error("applicator must be a function.");
            var h = t.name;
            i = i || function() {};
            var c = Date.now(),
                l = n - s;
            0 !== l && (h && (this.runningInterpolations[h] = this.easingGuid), e(function u(t) {
                var n = Date.now() - c,
                    d = n / o;
                return n >= o ? (a(r(1, s, l)), i(n)) : h && this.runningInterpolations[h] !== t ? i(n) : (e(u.bind(this, t)), a(r(d, s, l), s, d), void 0)
            }.bind(this, this.easingGuid)), this.easingGuid += 1)
        }
    }
    var e = function() {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(t) {
            window.setTimeout(t, 1e3 / 60)
        }
    }(),
        i = {
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
    return t
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
            this.animateScrollLeft = this.animateScroll.bind(this, "scrollLeft"), this.animateScrollTop = this.animateScroll.bind(this, "scrollTop")
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
            s[t] = _.throttle(this.handleDrag.bind(this, e, i), e.throttlePeriod),
            this.on("dragover", s),
            this.on("drop", function() {
                this.justDropped = !0
            })
        }, this.percToDelta = function(t, e) {
            var i = t / e.regionSize;
            return e.maxSpeed - e.maxSpeed * i
        }, this.animateScroll = function(t, e, i, s, n, o) {
            var r = $(e);
            if (!r[t]) throw new Error("$elem has no method " + t);
            o.over || (o.over = !0, o.startTime = Date.now()), clearTimeout(o.timeout), o.timeout = setTimeout(function() {
                o.over = !1
            }, 1.1 * n.throttlePeriod);
            var a = Date.now() - o.startTime,
                h = n.deltaFn.call(this, s, i, c, a),
                c = r[t]();
            this.ease({
                name: "drag-scroll",
                from: c,
                delta: h,
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
}), define("ui/compose/with_character_limit", [], function() {
    function t() {
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
    return t
}), define("ui/compose/with_character_count", ["ui/compose/with_character_limit", "flight/lib/compose"], function(t, e) {
    function i() {
        e.mixin(this, [t]), this.defaultAttrs({
            charCountSelector: ".js-character-count",
            charCountInvalidClass: "invalid-char-count"
        }), this.after("initialize", function() {
            this.charCount = 0,
            this.on("uiComposeCharCount", this.charCountHandleCharCount)
        }), this.after("setupDOM", function() {
            this.$charCountInput = this.select("charCountSelector")
        }), this.charCountHandleCharCount = function(t, e) {
            t.stopPropagation(), this.charCount = e.charCount, this.$charCountInput.val(this.getRemainingCharCount(this.charCount)), this.charCountUpdateValidCountState(this.charCount)
        }, this.charCountUpdateValidCountState = function(t) {
            var e = this.isOverCharLimit(t);
            this.$charCountInput.toggleClass(this.attr.charCountInvalidClass, e)
        }
    }
    return i
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
}), define("ui/compose/with_compose_text", ["flight/lib/compose", "util/tweet_utils", "ui/with_focusable_field"], function(t, e, i) {
    return function() {
        t.mixin(this, [i]);
        var s = "",
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
            this.on("uiRemoveInReplyTo", this.removeReplyStack),
            this.on("uiMessageRecipientSet", function(t) {
                t.stopPropagation(), this.composeTextSetFocus()
            }), this.before("setupDOM", this.destroyAutoComplete), this.before("teardown", this.destroyAutoComplete)
        }), this.after("setupDOM", function() {
            this.$composeTextInput = this.select("composeTextSelector"),
            this.on(this.$composeTextInput, "input propertychange change", this.composeTextHandleChange),
            this.on(this.$composeTextInput, "blur", this.handleTextInputBlur),
            this.on("uiRequestComposeTextFocus", function() {
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
            this.$composeTextInput[0].selectionStart = this.$composeTextInput[0].selectionEnd = t, this.$composeTextInput.focus()
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
        }, this.removeReplyStack = function(t) {
            t.stopPropagation();
            var e = this.composeTextGetReplyText();
            this.composeTextSetText(e.trim()), o = [], r = [], n = !1, s = ""
        }, this.composeTextReset = function() {
            this.composeTextSetText(""), o = [], r = [], n = !1, s = ""
        }, this.composeTextSetRepliesAndMentions = function(t, e, i) {
            var s = this.composeTextCalculateRepliesAndMentions(t, e, i);
            this.composeTextSetText(s.totalString), this.composeTextSetSelection(s.startIndex, s.endIndex)
        }, this.composeTextCalculateRepliesAndMentions = function(t, i, a) {
            return t = t.map(e.atMentionify), i = i.map(e.atMentionify), a = a && e.atMentionify(a), a && (i = i.filter(function(t) {
                return t.toLowerCase() !== a.toLowerCase()
            }), a === t[0] && i.length > 0 && (t = [i.shift()])), t = t.map(e.atMentionify), i = i.map(e.atMentionify), n === !1 && (n = this.$composeTextInput.val()), this.composeTextIsStacking() && this.composeTextHasLostStackingState() && (o = [], r = [], s = this.$composeTextInput.val(), n = ""), this.composeTextGetReplyStack(t, i)
        }, this.composeTextHandleChange = function() {
            var t = this.$composeTextInput.val();
            this.trigger("uiComposeCharCount", {
                charCount: e.getTweetLength(t),
                stringLength: t.length
            })
        }, this.handleTextInputBlur = function() {
            this.trigger("uiComposeTextBlur")
        }, this.composeTextIsStacking = function() {
            return o.length + r.length > 0
        }, this.composeTextGenerateReplyStack = function(t, e, i) {
            var s, o, r, a = t.join(" "),
                h = e.join(" "),
                c = [];
            return i && (i = i.replace(/ $/, ""), c.push(i)), a && c.push(a), n && c.push(n), h && c.push(h), s = c.join(" ").trim() + " ", o = h ? s.length - h.length - 1 : s.length, r = s.length, {
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
            var t = this.composeTextGenerateReplyStack(o, r, s);
            return t.totalString !== this.$composeTextInput.val() || t.startIndex !== this.$composeTextInput[0].selectionStart || t.endIndex !== this.$composeTextInput[0].selectionEnd
        }, this.composeTextGetReplyStack = function(t, e) {
            var i;
            return this.composeTextIsStacking() && this.trigger("uiComposeStackReply"), o = o.concat(t), r = r.concat(e), i = a([o, r]), o = i[0], r = i[1], this.composeTextGenerateReplyStack(o, r, s)
        }, this.destroyAutoComplete = function() {
            this.textAutoComplete && (this.textAutoComplete.destroy(), this.textAutoComplete = null)
        }
    }
}), define("util/with_teardown", ["require"], function() {
    function t() {
        this.before("initialize", function() {
            this.childTeardownEvent = t.nextTeardownEvent()
        }), this.before("teardown", function() {
            this.trigger(document, this.childTeardownEvent)
        }), this.after("initialize", function() {
            if (this.attr.teardownOn) {
                if (this.attr.teardownOn === this.childTeardownEvent) throw new Error("Component initialized to listen for its own teardown event.");
                this.on(document, this.attr.teardownOn, this.teardown.bind(this))
            }
        })
    }
    return t.nextTeardownEvent = function() {
        var t = 0;
        return function() {
            return "_teardownEvent" + ++t
        }
    }(), t
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
            this.customTimeline = null, this.newDescription = null,
            this.on(document, "dataCustomTimelineSuccess", this.handleCustomTimeline.bind(this)),
            this.on(document, "dataCustomTimelineUpdateError", this.handleUpdateError.bind(this)),
            this.on("uiComposeCharCount", this.handleCharCount),
            this.on("click", {
                editSelector: this.edit,
                saveSelector: this.save,
                cancelSelector: this.cancel
            }),
            this.on("uiInputSubmit", {
                inputSelector: this.save
            }),
            this.on("uiInputBlur", {
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
        h = t("ui/with_transitions");
    return i(e, s, n, o, r, a, h)
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
}), define("ui/with_user_menu", [], function() {
    var t = function() {
        this.defaultAttrs({
            userMenuButtonSelector: ".js-profile-menu"
        }), this.showUserMenu = function(t, e, i) {
            var s = !0;
            return this.userMenu && (s = i.id !== this.userMenu.user.id, this.userMenu.destroy()), s && (this.userMenu = new TD.components.ProfileMenu(e, TD.components.DropDown.POSITION_LEFT, i), t.stopPropagation()), s
        }, this.handleUserMenuButtonClick = function(t) {
            for (var e, i = $(t.target).closest(this.attr.userMenuButtonSelector), s = i.data("user-id").toString(), n = 0; n < this.users.length; n++)
                if (this.users[n].id === s) {
                    e = this.users[n];
                    break
                }
            this.showUserMenu(t, i, e)
        }, this.destroyMenuReference = function(t, e) {
            e.target === this.userMenu && (this.userMenu = null)
        }, this.hideUserMenu = function() {
            this.userMenu && this.userMeny.destroy()
        }, this.before("teardown", function() {
            this.userMenu && this.userMenu.destroy()
        }), this.after("initialize", function() {
            this.userMenu = null,
            this.on("td-dropdown-close", this.destroyMenuReference),
            this.on("click", {
                userMenuButtonSelector: this.handleUserMenuButtonClick
            })
        })
    };
    return t
}), define("ui/social_proof_for_tweet", ["flight/lib/component", "ui/with_template", "ui/with_text_utils", "ui/with_user_menu"], function(t, e, i, s) {
    var n = function() {
        this.defaultAttrs({
            columnBackSelector: ".js-tweet-social-proof-back",
            headerLinkClass: "js-tweet-social-proof-back",
            templateName: "status/social_proof_for_tweet"
        }), this.handleTwitterUsers = function(t, e) {
            e.requestId === this.requestId && (this.renderParams.users = e.users, this.users = e.users, this.render(this.attr.templateName, this.renderParams))
        }, this.close = function() {
            this.trigger("uiSocialProofForTweetClosed"), this.teardown()
        }, this.after("initialize", function() {
            var t, e, i;
            this.on("uiSocialProofForTweetClose", this.close),
            this.on("click", {
                columnBackSelector: this.close
            }),
            this.on(document, "dataTwitterUsers", this.handleTwitterUsers), this.userIds = this.attr.tweetSummary[this.attr.type], "retweeters" === this.attr.type ? (e = "Retweeted", i = this.attr.tweetSummary.retweeters_count) : (e = "Favorited", i = this.attr.tweetSummary.favoriters_count), t = parseInt(i, 10) > 1 ? TD.i("{{action}} {{n}} times", {
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
        })
    };
    return t(n, e, i, s)
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
            this.on(document, "uiDragStart", this.whenSetup(this.saveDragState(this.notifyListeners))),
            this.on(document, "uiDragEnd", this.whenSetup(function() {
                this.dragDepth = 0, this.clearDragState(this.notifyListeners).apply(this, arguments)
            })),
            this.on("drop", this.whenSetupAndActive(function(t) {
                t.preventDefault(), this.dragDepth = 0, this.retrieveAndNotify().apply(this, arguments)
            })),
            this.on("dragenter", this.whenSetupAndActive(function() {
                this.dragDepth += 1, 1 === this.dragDepth && this.retrieveAndNotify().apply(this, [].slice.call(arguments))
            })),
            this.on("dragleave", this.whenSetupAndActive(function() {
                this.dragDepth -= 1, this.dragDepth <= 0 && (this.dragDepth = 0, this.retrieveAndNotify().apply(this, [].slice.call(arguments)))
            })),
            this.on("dragover", this.whenSetupAndActive(function(t) {
                this.indicateDrop === !0 && t.preventDefault(), this.retrieveAndNotify().apply(this, [].slice.call(arguments))
            })),
            this.on("mousedown", {
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
            this.select("addToCustomTimelineSelector").html(i).removeClass("is-hidden"),
            this.on("uiInputSubmit", {
                addToCustomTimelineInputSelector: this.addTweetToCustomTimeline
            }),
            this.on("click", {
                addToCustomTimelineButtonSelector: this.addTweetToCustomTimeline
            }),
            this.on(document, "dataAddTweetToCustomTimelineSuccess", function(t, e) {
                this.eventIsForCustomTimeline(t, e) && (this.spinnerButtonDisable(), e.result.response.errors && e.result.response.errors.length ? TD.controller.progressIndicator.addMessage(TD.i("Unable to add that Tweet")) : this.select("addToCustomTimelineInputSelector").val(""))
            }),
            this.on("dataAddTweetToCustomTimelineError", function(t, e) {
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
                    }),
                    this.on(document, "dataCustomTimelineSuccess", function() {
                        var t;
                        this.off(document, "dataCustomTimelineSuccess"), s && n ? t = TD.i("Custom timeline updated") : s ? t = TD.i("Title updated") : n && (t = TD.i("Description updated")), t && TD.controller.progressIndicator.addMessage(t)
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
}), define("ui/column", ["flight/lib/component", "ui/custom_timeline_description", "ui/social_proof_for_tweet", "ui/with_column_selectors", "ui/with_template", "ui/with_transitions", "ui/asynchronous_form", "ui/drag_drop/with_drag_drop", "ui/with_add_to_customtimeline", "ui/with_edit_customtimeline", "util/with_rebroadcast", "util/with_teardown"], function(t, e, i, s, n, o, r, a, h, c, l, u) {
    function d() {
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
            animatingClass: "is-animating",
            tweetActionsVisibleClass: "is-visible",
            customTimelineDescriptionSelector: ".js-customtimeline-description",
            shareColumnSelector: ".js-share-column",
            focusId: null,
            tweetImpressionTrackingPeriod: 100
        }), this.setColumnState = function(t) {
            switch (this.$node.removeClass([this.attr.showDetailViewClass, this.attr.columnStateDetailViewClass, this.attr.showSocialProofClass, this.attr.columnStateSocialProofClass].join(" ")), t) {
                case this.attr.columnStateDetailView:
                    this.$node.addClass(this.attr.showDetailViewClass), this.$node.addClass(this.attr.columnStateDetailViewClass);
                    break;
                case this.attr.columnStateSocialProof:
                    this.$node.addClass(this.attr.showSocialProofClass), this.$node.addClass(this.attr.columnStateSocialProofClass)
            }
        }, this.handleDetailViewActive = function() {
            this.setColumnState(this.attr.columnStateDetailView)
        }, this.handleDetailViewClosed = function() {
            this.setColumnState(this.attr.columnStateDefault), this.column.detailViewComponent = null
        }, this.handleCloseDetailView = function() {
            this.column.detailViewComponent.destroy()
        }, this.handleShowSocialProof = function(t, e) {
            i.attachTo(this.$socialProofContainer, {
                type: e.type,
                tweetSummary: e.tweetSummary
            }), this.setColumnState(this.attr.columnStateSocialProof)
        }, this.handleSocialProofClosed = function() {
            this.setColumnState(this.attr.columnStateDetailView)
        }, this.handleCloseSocialProof = function() {
            this.trigger(this.$socialProofContainer, "uiSocialProofForTweetClose")
        }, this.handleShareColumnButtonClick = function(t, e) {
            var i = $(e.el);
            this.showShareMenu(t, i)
        }, this.showShareMenu = function(t, e) {
            t.preventDefault(), t.stopPropagation(), new TD.components.ColumnShareMenu(e, {
                isEmbeddable: this.column.isEmbeddable(),
                isShareable: this.column.isShareable()
            })
        }, this.getCustomTimelinePermalinkURL = function() {
            var t = this.column.getCustomTimelineFeed(),
                e = t.getMetadata(),
                i = TD.util.deMentionify(TD.cache.names.getScreenName(e.ownerId));
            if (!i) throw new Error("Could not get username from name cache.");
            var s = e.id.replace(/[^\d]*/, ""),
                n = this.toHtmlFromRaw("https://twitter.com/{{username}}/timelines/{{id}}", {
                    username: i,
                    id: s
                });
            return n
        }, this.handleViewTimeline = function() {
            var t = this.getCustomTimelinePermalinkURL();
            TD.util.openURL(t)
        }, this.handleReferenceTimeline = function() {
            this.trigger("uiComposeTweet", {
                appendText: this.getCustomTimelinePermalinkURL()
            })
        }, this.handleShowingColumnOptions = function() {
            var t = this.select("columnMessageSelector");
            t.css({
                opacity: 0
            }), this.transitionCollapse(t)
        }, this.handleColumnOptionsShown = function() {
            r.attachTo(this.$columnOptions)
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
        }, this.handleReadStateChange = function(t, e) {
            var i = this.select("columnHeaderSelector");
            e.columnKey = this.columnKey, this.column.isMessageColumn() ? e.read = !this.column.hasUnreadMessages() : this.$node.toggleClass(this.attr.isNewClass, !e.read), i.toggleClass(this.attr.isNewClass, !e.read)
        }, this.handleColumnVisibilities = function(t, e) {
            var i, s, n = this.column.visibility,
                o = e[this.columnKey];
            o && (this.column.visibility = o, i = 0 === n.visibleFraction, s = o.visibleFraction > 0, (i && s || n.visibleHeight !== o.visibleHeight) && this.scribeTweetImpressions())
        }, this.scribeTweetImpressions = function() {
            var t = this.column.temporary || this.hasFocus && this.column.visibility.visibleFraction > 0,
                e = this.$node.hasClass(this.attr.columnStateDetailViewClass) || this.$node.hasClass(this.attr.columnStateSocialProofClass);
            if (t && !e) {
                var i = [],
                    s = [],
                    n = this.$scrollContainer.height(),
                    o = this.attr.animatingClass;
                this.select("chirpSelector").each(function(t, e) {
                    var s = $(e),
                        r = s.position().top,
                        a = s.height();
                    if (!(0 > r + a)) {
                        if (!(n > r)) return !1;
                        s.hasClass(o) || i.push(s.attr("data-key"))
                    }
                }), i.forEach(function(t) {
                    var e;
                    this.column.scribedImpressionIDs.get(t) || (e = this.column.findMostInterestingChirp(t), e instanceof TD.services.TwitterStatus && s.push(e.getScribeItemData())), this.column.scribedImpressionIDs.enqueue(t, !0)
                }.bind(this)), TD.controller.stats.tweetStreamImpression(this.column.getColumnType(), s)
            }
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
                i.poller.refresh(!0, !0)
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
        }, this.after("initialize", function() {
            this.columnKey = this.$node.data("column"), this.column = TD.controller.columnManager.get(this.columnKey);
            var t, i, s, n = this.column.getCustomTimelineFeed(),
                o = this.column.isOwnCustomTimeline();
            o && (t = n.getMetadata(), i = t.id, s = TD.storage.Account.generateKeyFor("twitter", t.ownerId)), this.targetTopPosition = 0, this.$socialProofContainer = this.select("socialProofSelector"), this.$columnOptions = this.select("columnOptionsSelector"), this.$scrollContainer = this.select("scrollContainerSelector"), this.renderColumnMessage(), this.attr.tweetImpressionTrackingPeriod > 0 && (this.scribeTweetImpressions = _.throttle(this.scribeTweetImpressions.bind(this), this.attr.tweetImpressionTrackingPeriod)), this.setupDragDrop({
                type: "tweet",
                indicateDrop: !1,
                predrag: function(t, e) {
                    $(e.el).closest(this.attr.tweetActionsSelector).addClass(this.attr.tweetActionsVisibleClass)
                },
                dragend: function(t, e) {
                    $(e.el).closest(this.attr.tweetActionsSelector).removeClass(this.attr.tweetActionsVisibleClass)
                }
            }),
            this.on("click", {
                shareColumnSelector: this.handleShareColumnButtonClick
            }),
            this.on("uiViewTimeline", this.handleViewTimeline),
            this.on("uiReferenceTimeline", this.handleReferenceTimeline),
            this.on(document, "uiShowDetailView", this.handleShowDetailView),
            this.on("uiDetailViewActive", this.handleDetailViewActive),
            this.on("uiDetailViewClosed", this.handleDetailViewClosed),
            this.on("uiCloseDetailView", this.handleCloseDetailView),
            this.on("uiSocialProofForTweetClosed", this.handleSocialProofClosed),
            this.on("uiShowSocialProof", this.handleShowSocialProof),
            this.on("uiCloseSocialProof", this.handleCloseSocialProof),
            this.on("uiColumnOptionsShown", this.handleColumnOptionsShown),
            this.on("uiHidingColumnOptions", this.handleHidingColumnOptions),
            this.on("uiShowingColumnOptions", this.handleShowingColumnOptions),
            this.on("uiColumnOptionsHidden", this.handleColumnOptionsHidden),
            this.on("uiMarkAllMessagesRead", this.handleMarkAllRead),
            this.on("uiColumnClearAction", this.handleColumnClear),
            this.on("uiReadStateChange", this.handleReadStateChange),
            this.on("uiTransitionExpandStart", {
                columnOptionsContainerSelector: function(t, e) {
                    this.fixColumnTop(), this.moveColumnTop(e.delta)
                }.bind(this)
            }),
            this.on("uiAccordionTotalHeightChanged", {
                columnOptionsContainerSelector: this.fixColumnTop
            }),
            this.on("uiColumnUpdateSearchFilter", this.handleUpdateSearchFilter),
            this.on("uiColumnUpdateMediaPreview", this.handleUpdateMediaPreview),
            this.on("dataColumnUpdatingFilters dataColumnUpdatingFeed", this.handleColumnUpdating),
            this.on("dataColumnFiltersUpdated dataColumnFeedUpdated", this.handleColumnUpdated),
            this.on("uiRemoveColumn", this.teardown),
            this.on(document, "uiFocus", function(t, e) {
                this.hasFocus = e.id === this.attr.focusId, this.hasFocus && this.scribeTweetImpressions()
            }),
            this.on(this.$scrollContainer, "scroll", this.scribeTweetImpressions),
            this.on(document, "uiColumnVisibilities", this.handleColumnVisibilities.bind(this)),
            this.on(document, "uiColumnChirpsChanged", function(t, e) {
                e.id === this.columnKey && this.scribeTweetImpressions()
            }),
            this.on("uiDetailViewClosed", this.scribeTweetImpressions), o && (this.setupDragDrop({
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
                }), this.renderAddToCustomTimeline(s, i), this.select("columnContentSelector").addClass("with-add-by-url"),
                this.on(document, "dataAddTweetToCustomTimelineSuccess", this.refreshCustomTimelineFeed.bind(this)),
                this.on(document, "dataRemoveTweetFromCustomTimelineSuccess", this.removeChripFromCustomTimelineFeed.bind(this)),
                this.on("uiRemoveTweetFromCustomTimeline", this.rebroadcast(this.transformRemoveTweetFromCustomTimeline))), n && e.attachTo(this.select("customTimelineDescriptionSelector"), {
                maxCharCount: 160,
                withAutoComplete: !1,
                customTimelineId: n.getMetadata().id,
                isOwnCustomTimeline: this.column.isOwnCustomTimeline(),
                readOnly: this.column.temporary,
                accountKey: n.getAccountKey(),
                teardownOn: this.childTeardownEvent
            })
        })
    }
    return t(d, s, n, o, a, h, c, l, u)
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
            var e, i = $(t.target).closest(this.attr.actionButton),
                s = i.data("action"),
                n = this.column.model;
            switch (s) {
                case "popups":
                    e = !n.getHasNotification(), n.setHasNotification(e);
                    break;
                case "sound":
                    e = !n.getHasSound(), n.setHasSound(e)
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
                }), this.$alertsForm = this.renderTemplate(this.attr.template, t), this.$node.append(this.$alertsForm), this.updateSummary(),
                this.on(this.$alertsForm, "click", {
                    actionButton: this.toggleColumnSetting
                }), void 0)
        })
    };
    return t(i, e)
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
            }),
            this.on("uiAccordionUpdatePanelHeights", this.handleUpdatePanelHeights)
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
            }), $.extend(t, this.attr.renderOptions), this.render(this.attr.template, t), this.$matching = this.select("matchingSelector"), this.$excluding = this.select("excludingSelector"), this.$containing = this.select("containingSelector"), this.$writtenIn = this.select("writtenInSelector"), this.$retweets = this.select("retweetsSelector"), this.attr.searchFilter && this.attr.searchFilter.content && (this.$containing.val(this.attr.searchFilter.content.type), this.attr.searchFilter.content.includeRTs ? this.$retweets.val("included") : this.$retweets.val("excluded"), this.$writtenIn.val(this.attr.searchFilter.content.lang)),
            this.on("change", this.handleChange),
            this.on("uiDestroyContentFilterForm", this.teardown)
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
            this.updateFormState(this.$tweetsFrom.val(), this.$mentioning.val()),
            this.on("change", this.handleChange),
            this.on("uiDestroyUserFilterForm", this.teardown)
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
            t.showError = this.hasFilterError(this.attr.searchFilter.action), t.isInActivityColumn = this.isInActivityColumn(), this.render(this.attr.template, t), this.$showRetweets = this.select("showRetweetsSelector"), this.$showFavorites = this.select("showFavoritesSelector"), this.$showFollowers = this.select("showFollowersSelector"), this.$showLists = this.select("showListsSelector"), this.$showMentions = this.select("showMentionsSelector"),
            this.on("change", this.handleChange)
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
            this.render(this.attr.template, t), this.$minFavorites = this.select("minFavoritesSelector"), this.$minRetweets = this.select("minRetweetsSelector"), this.$minReplies = this.select("minRepliesSelector"),
            this.on("change blur", this.handleChange), this.validateInput(this.attr.searchFilter.engagement)
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
            this.searchFilter = this.searchFilter || new TD.vo.SearchFilter, this.$searchFilter = this.select("searchFilterSelector"),
            this.on("uiSearchFilterUpdateAction", this.handleSearchFilterUpdate)
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
            }),
            this.on("uiColumnUpdateSearchFilter", this.renderThumbSizeSelector)
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
            this.$node.hasClass(this.attr.isAnimatingClass) || (this.trigger("uiHidingColumnOptions", this.column), this.$node.addClass(this.attr.hideContentClass), this.transitionCollapse(this.$node, this.attr.isAnimatingClass, this.afterHideTransition.bind(this)), this.teardown())
        }, this.afterHideTransition = function() {
            this.$node.css("height", ""), this.$node.empty(), this.trigger("uiColumnOptionsHidden", this.column)
        }, this.showColumnOptions = function() {
            var t = this.$node.outerHeight(),
                e = function() {
                    this.$node.removeClass(this.attr.hideContentClass), this.trigger("uiColumnOptionsShown", {
                        column: this.column
                    })
                }.bind(this);
            this.trigger("uiShowingColumnOptions", {
                columnOptionsHeight: t,
                column: this.column
            }), this.$node.addClass(this.attr.hideContentClass), this.transitionExpand(this.$node, this.attr.isAnimatingClass, e.bind(this))
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
                            message: TD.i("Are you sure you want to delete this custom timeline?"),
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
            this.on("uiShowUserFilter", this.handleShowUserFilter),
            this.on("uiShowContentFilter", this.handleShowContentFilter),
            this.on("uiColumnOptionsCloseAction", this.hide),
            this.on("uiColumnUpdateSearchFilter", this.handleUpdateSearchFilter),
            this.on("uiAccordionExpandAction", this.updateHeight),
            this.on("uiAccordionCollapseAction", this.updateHeight),
            this.on(document, "uiColumnWidthChange", this.updateHeight),
            this.on("uiTransitionExpandStart", {
                searchFilterSelector: this.handleChildTransitionExpandStart
            }),
            this.on("uiTransitionExpandEnd", {
                searchFilterSelector: this.handleChildTransitionExpandEnd
            }),
            this.on("click", {
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
        var i, s, n = 10,
            o = 350,
            r = 500,
            a = 200,
            h = 20,
            c = {}, l = {}, u = {}, d = {}, m = {}, p = {}, g = 150,
            f = 15,
            C = "is-options-open",
            T = "is-moving",
            S = "is-focused",
            w = ".is-focused",
            v = "is-actionable",
            y = "#container",
            b = ".js-app-columns",
            D = ".js-column-options",
            I = ".js-column-scroller",
            A = ".js-column",
            F = ".js-column-header",
            R = ".js-column-message",
            E = ".js-detail-header",
            k = ".js-chirp-container",
            x = ".js-action-header-button",
            M = ".is-minimalist",
            U = "is-touch-tweet-container",
            P = 150,
            O = function(t) {
                return W.getColumnElementByKey(t).find(F)
            }, L = function(t) {
                var e = $(t.target).closest("[data-action]"),
                    i = e.data("action"),
                    s = e.parents(A),
                    n = s.attr("data-column");
                switch (i) {
                    case "options":
                        t.preventDefault(), s.hasClass(C) ? W.exitEditMode(n) : W.enterEditMode(n), t.stopPropagation();
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
                    case "user-filter":
                    case "content-filter":
                    case "action-filter":
                    case "engagement-filter":
                        W.enterEditMode(n, i);
                        break;
                    case "edit-list":
                        t.preventDefault(), t.stopPropagation()
                }
            }, B = function(t) {
                var i = $(t.currentTarget),
                    s = (i.data("action"), i.parents(A)),
                    n = s.data("column");
                e.ui.columns.setColumnToTop(n)
            }, N = function() {
                var t = $(this);
                return t.offset().top + this.offsetHeight > 0 && t.offset().top < i.innerHeight()
            }, j = function() {
                var t = e.ui.updates.findParentArticle($(this)),
                    i = e.controller.columnManager.get(t.column),
                    s = i.updateIndex[t.statusKey];
                t.element.replaceWith(s.render({
                    isTemporary: i.temporary
                }))
            }, H = _.debounce(function(t) {
                t.find(M).filter(N).each(j)
            }, P),
            q = function(t, i) {
                var s, n, o = 0;
                return function(r) {
                    e.util.isTouchDevice() && e.util.cancelFastClick();
                    var a, h, c = r.timeStamp || (new Date).getTime(),
                        l = i.scrollTop();
                    d[t] = l, H(i), c - o > 200 && (o = c, n = r.currentTarget.scrollHeight, s = i.height()), h = (s + l) / n, h > .999 ? (o = 0, a = e.controller.columnManager.get(t), a.fetchUpdatesFromPoller()) : 0 === l && i.trigger("uiReadStateChange", {
                        read: !0
                    })
                }
            }, z = function(t, e) {
                var i = e.closest(".scroll-h");
                return function(n) {
                    var o, r, a, h = $(n.currentTarget);
                    (n.originalEvent.wheelDeltaY || n.originalEvent.wheelDeltaX) && (n.preventDefault(), Math.abs(n.originalEvent.wheelDeltaY) > Math.abs(n.originalEvent.wheelDeltaX) ? h.is(I) ? (o = n.currentTarget.scrollHeight, r = e.height(), a = d[t], a = Math.max(0, a - n.originalEvent.wheelDeltaY), a = Math.min(a, o - r), e.scrollTop(a), d[t] = a) : h.scrollTop(h.scrollTop() - n.originalEvent.wheelDeltaY) : i.length && i.scrollLeft(s.scrollLeft() - n.originalEvent.wheelDeltaX))
                }
            }, K = function(t, s) {
                var n, o = function(i) {
                        var s = i.model,
                            o = i.isMessageColumn() && (e.config.internal_build || e.decider.get(e.decider.DM_READ_STATE)),
                            r = i.hasActiveSearchFilters(),
                            a = null;
                        r && (a = {
                            content: i.hasActiveContentFilters(),
                            user: i.hasActiveUserFilters(),
                            action: i.hasActiveActionFilters() && !i.isSingleActionTypeColumn(),
                            engagement: i.hasActiveEngagementFilters(),
                            filterError: i.hasFilterError()
                        });
                        var h = !i.temporary && i.isOwnCustomTimeline(),
                            c = {
                                columnkey: s.getKey(),
                                columntitle: t[n].getTitleHTML({
                                    editable: h
                                }),
                                columnclass: t[n].getClass(),
                                columniconclass: t[n].getIconClass(),
                                columnfilter: a,
                                filterError: i.hasFilterError(),
                                withEditableTitle: h,
                                withMarkAllRead: o,
                                isTouchColumnOptions: Boolean(e.util.isTouchDevice() && e.decider.get(e.decider.TOUCHDECK_COLUMN_OPTIONS))
                            };
                        return e.ui.template.render("column", c)
                    };
                if (s = Boolean(s))
                    for (n = t.length - 1; n >= 0; n--) i.prepend(o(t[n])), W.setupColumn(t[n]);
                else
                    for (n = 0; n < t.length; n++) i.append(o(t[n])), W.setupColumn(t[n])
            }, W = {
                COLUMN_GLOW_DURATION: 500,
                init: function() {
                    i = $(b), s = $(y);
                    var t = _.throttle(L, 300);
                    i.on("click", x + ", " + R, t), i.on("click", F, B)
                },
                setupColumn: function(t) {
                    var i = t.model.getKey(),
                        s = $(k + '[data-column="' + i + '"]').closest(I),
                        n = $(A + '[data-column="' + i + '"]'),
                        o = s.scrollTop(),
                        r = q(i, s),
                        a = z(i, s);
                    $(document).trigger("uiColumnRendered", {
                        column: t,
                        $column: n
                    }), e.util.isTouchDevice() && e.decider.get(e.decider.TOUCHDECK_TWEETCONTROLS) && s.addClass(U), d[i] = o, l[i] = s, s.scroll(r), n.on("mousewheel onmousewheel", ".scroll-v", a), n.on("mouseover", F, function() {
                        var t = d[i];
                        $(this).toggleClass(v, t > 0)
                    }), e.util.isTouchDevice() && window.navigator.standalone && n.on("touchmove", ".scroll-v", function(t) {
                        t.stopPropagation()
                    })
                },
                refreshTitle: function(t) {
                    var i, s, n = t.getIconClass(),
                        o = t.model.getKey(),
                        r = !t.temporary && t.isOwnCustomTimeline(),
                        a = t.getTitleHTML({
                            editable: r
                        }),
                        h = W.getColumnElementByKey(o),
                        iC = t.isClearable(),
                        c = t.isMessageColumn() && !iC && (e.config.internal_build || e.decider.get(e.decider.DM_READ_STATE)),
                        hA = c || iC;
                    s = t.temporary && t.getColumnType() === e.util.columnUtils.columnMetaTypes.SEARCH ? e.i("results") : t.getDetailTitleHTML(), i = e.ui.template.render("column/column_header", {
                        columntitle: a,
                        columniconclass: n,
                        isTemporary: t.temporary,
                        withEditableTitle: r,
                        withImageAttribution: !0,
                        withMarkAllRead: c,
                        hasHeaderAction: hA,
                        isClearable: iC
                    }), O(t.model.getKey()).replaceWith(i), i = e.ui.template.render("column/column_header_detail", {
                        headerClass: "js-detail-header",
                        headerAction: "resetToTopColumn",
                        headerLinkClass: "js-column-back",
                        columntitle: s
                    }), h.find(E).replaceWith(i), $(document).trigger("uiColumnTitleRefreshed", {
                        columnKey: o
                    })
                },
                setColumnToTop: function(t) {
                    var e, i = l[t],
                        s = 10,
                        n = d[t],
                        r = 250,
                        a = function() {
                            var o = Math.max(n - r, 0);
                            n -= r, i.scrollTop(o), d[t] = o, o > 0 ? setTimeout(a, s) : (i.trigger("uiReadStateChange", {
                                read: !0
                            }), e = O(t), e.toggleClass(v, i.scrollTop > 0))
                        };
                    n * s / r > o && (r = n * s / o), a()
                },
                enterEditMode: function(i, s) {
                    var n, o = e.controller.columnManager.get(i),
                        r = W.getColumnElementByKey(i);
                    r.length && !r.hasClass(C) && (r.addClass(C), n = $(D, r), t.attachTo(n, {
                        column: o,
                        expandContentFilter: "content-filter" === s,
                        expandUserFilter: "user-filter" === s,
                        expandActionFilter: "action-filter" === s,
                        expandEngagementFilter: "engagement-filter" === s,
                        columnType: o.getColumnType()
                    }))
                },
                exitEditMode: function(t) {
                    var e = W.getColumnElementByKey(t),
                        i = $(D, e);
                    e.hasClass(C) && (e.removeClass(C), i.trigger("uiColumnOptionsCloseAction"))
                },
                isFrozen: function(t) {
                    var e = l[t];
                    return e ? 0 !== d[t] : !1
                },
                freezeScroll: function(t) {
                    var e = l[t],
                        i = m[t];
                    if (!e) return !1;
                    var s = d[t];
                    return p[t] || (c[t] = e[0].scrollHeight - s), 0 !== s || i
                },
                unfreezeScroll: function(t, e) {
                    var i, s = l[t],
                        n = m[t],
                        o = c[t],
                        r = u[t],
                        a = d[t];
                    p[t] || s && (o && (a > 0 || n) ? (i = s[0].scrollHeight - o, s.scrollTop(i), d[t] = i, e && e()) : H(s), r && r.resizeScroller())
                },
                lockColumnScrolling: function(t) {
                    m[t] = !0
                },
                unlockColumnScrolling: function(t) {
                    delete m[t]
                },
                addColumnsToView: function(t) {
                    K(t), $(k).show()
                },
                removeColumn: function(t) {
                    var e = W.getColumnElementByKey(t);
                    e.trigger("uiRemoveColumn"), e.remove(), delete d[t], delete l[t], delete u[t]
                },
                _moveColumnInstantly: function(t, e, s, n, o, r) {
                    s.length > 0 && s.attr("data-column") !== o[n + 1] && (r[s.attr("data-column")] = s.detach()), t ? e.insertAfter(t) : e.prependTo(i)
                },
                _getOriginalWidth: function(t) {
                    return t.data("originalWidth") || parseInt(t.css("width"), 10)
                },
                _storeOriginalWidth: function(t) {
                    var e = t.data("originalWidth");
                    void 0 === e && (e = parseInt(t.css("width"), 10)), t.data("originalWidth", e)
                },
                _isColumnOffScreen: function(t) {
                    return t.position().left + this._getOriginalWidth(t) < 0 || t.position().left + this._getOriginalWidth(t) > s.width()
                },
                _moveColumnToNewIndex: function(t, e, s, n, o) {
                    var r, a, h, c = e[t],
                        l = s[c] || i.children('[data-column="' + c + '"]'),
                        u = l.index(),
                        d = function() {
                            l.removeClass(T), n = l, delete s[c]
                        };
                    e.length >= t ? (r = i.children(A).filter('[data-column="' + e[t + 1] + '"]'), a = r.index()) : (r = !1, a = -1), t < e.length && u !== a && (l.hasClass(T) ? (this._storeOriginalWidth(l), this._moveColumnInstantly(n, l, r, t, e, s), this._isColumnOffScreen(l) ? (h = this.scrollColumnToCenter(l.attr("data-column")), h.addCallback(function() {
                        d(), W._moveColumnToNewIndex(t + 1, e, s, n, o)
                    })) : (W.focusColumn(l.attr("data-column"), W.COLUMN_GLOW_DURATION), d(), W._moveColumnToNewIndex(t + 1, e, s, n, o))) : (n = l, this._moveColumnToNewIndex(t + 1, e, s, n, o)))
                },
                reorderColumns: function(t) {
                    var e = {}, s = null,
                        n = i.children("." + T);
                    n.length > 0 ? this._moveColumnToNewIndex(0, t, e, s, n) : _.each(t, function(n, o) {
                        var r = e[n] || W.getColumnElementByKey(n),
                            a = i.children(A).eq(o);
                        a[0] !== r[0] && (t.length > o + 1 && a.length > 0 && a.attr("data-column") !== t[o + 1] && (e[a.attr("data-column")] = a.detach()), 0 === o ? r.prependTo(i) : r.insertAfter(s), delete e[n]), s = r
                    })
                },
                calculateScrollDuration: function(t, e, i) {
                    i = i || r, e = e || h;
                    var s = a + t / 100 * e;
                    return s = Math.min(s, i)
                },
                scrollColumnToCenter: function(t) {
                    var o, c, l, u, d, m, p, g, f, C = W.getColumnElementByKey(t),
                        T = s.innerWidth() / C.outerWidth(!0),
                        S = s.scrollLeft(),
                        w = !0;
                    return 3.05 >= T ? (f = parseInt(i.css("padding-left"), 10), u = S + C.position().left - f) : (d = C.outerWidth(), m = s.get(0).scrollWidth - n, p = i.width(), g = C.offset().left, u = S + g - (p - d) / 2, u = Math.min(u, m - p), u = Math.max(u, 0)), 2 > T && (w = !1), u !== S ? (s.stop(), o = Math.abs(u - S), c = a + o / 100 * h, c = Math.min(c, r), l = new e.core.defer.Deferred, s.animate({
                        scrollLeft: u
                    }, c, "easeInOutQuad", function() {
                        w && e.ui.columns.focusColumn(t, W.COLUMN_GLOW_DURATION), l.callback()
                    })) : (w && e.ui.columns.focusColumn(t, W.COLUMN_GLOW_DURATION), l = e.core.defer.succeed()), l
                },
                getLeftmostColumn: function() {
                    var t = null;
                    return i.children(A).each(function() {
                        t || ($(this).position().left < 10 && $(this).position().left >= 0 ? t = this : $(this).position().left > 10 && (t = $(this).prev()))
                    }), $(t)
                },
                scrollColumn: function(t) {
                    $.fn.reverse = [].reverse;
                    var e, o, r, a = s[0].scrollWidth - s.outerWidth(),
                        h = !1,
                        c = !1,
                        l = 0;
                    e = "right" === t ? this.getLeftmostColumn().next() : this.getLeftmostColumn().prev(), e.length ? (o = s.scrollLeft() + e.position().left, o > a ? (h = !0, r = s[0].scrollWidth - (s.scrollLeft() + s.outerWidth()), r > 0 && s.stop().animate({
                        scrollLeft: a
                    }, 350)) : s.stop().animate({
                        scrollLeft: o - n
                    }, 350)) : c = !0, h && 0 === r && i.find(A).last().animate({
                        marginRight: 20
                    }, {
                        duration: 150,
                        complete: function() {
                            $(this).animate({
                                marginRight: 0
                            }, 150), s.scrollLeft(s[0].scrollWidth)
                        },
                        step: function(t) {
                            s.not(":animated").scrollLeft(s.scrollLeft() + t - l), l = t
                        }
                    }), c && this.bounceLeft()
                },
                bounceLeft: function() {
                    i.animate({
                        marginLeft: f
                    }, g, function() {
                        i.animate({
                            marginLeft: 0
                        }, g)
                    })
                },
                bounceRight: function() {
                    var t = i.find(A).last(),
                        e = parseInt(t.css("marginRight"), 10);
                    t.animate({
                        marginRight: e + f
                    }, {
                        duration: g,
                        complete: function() {
                            $(this).animate({
                                marginRight: e
                            }, g)
                        },
                        step: function() {
                            s.scrollLeft(s[0].scrollWidth)
                        }
                    })
                },
                scrollPage: function(t) {
                    $.fn.reverse = [].reverse;
                    var e, o, r, a, h, c = "left" === t ? -1 : 1,
                        l = s.innerWidth(),
                        u = i.children(A).outerWidth() + n,
                        d = Math.floor(l / u),
                        m = s.scrollLeft() + d * u * c;
                    if ("left" === t && m > 0) {
                        r = d * u * c;
                        for (var p = 0; p < i.children(A).length; p++) {
                            var g = i.children(A).eq(p),
                                f = g.position().left;
                            r > f && (o = g.next())
                        }
                        o && (m = s.scrollLeft() - -1 * o.position().left)
                    }
                    0 > m ? m = 0 : m + l > s[0].scrollWidth && (m = s[0].scrollWidth - l), m === s.scrollLeft() && "left" === t ? this.bounceLeft() : m === s.scrollLeft() && "right" === t ? this.bounceRight() : (h = Math.abs(m - s.scrollLeft()), e = this.calculateScrollDuration(h, 50, 1e3), a = 700 > e ? s.is(":animated") ? "easeOutQuad" : "easeInOutQuad" : s.is(":animated") ? "easeOutQuart" : "easeInOutQuart", s.stop().animate({
                        scrollLeft: m
                    }, {
                        duration: e,
                        easing: a
                    }))
                },
                focusColumn: function(t, s) {
                    $(w, i).removeClass(S), W.getColumnElementByKey(t).addClass(S), _.isNumber(s) && _.delay(function() {
                        e.ui.columns.unfocusColumn(t)
                    }, s)
                },
                unfocusColumn: function(t) {
                    W.getColumnElementByKey(t).removeClass(S)
                },
                setMovingColumn: function(t) {
                    W.getColumnElementByKey(t).addClass(T)
                },
                getColumnElementByKey: function(t) {
                    return $(A + '[data-column="' + t + '"]')
                }
            };
        return W
    }()
}), define("ui/column_controller", ["flight/lib/component", "ui/with_column_selectors", "ui/with_template", "ui/with_transitions", "ui/drag_drop/with_drag_scroll", "ui/column", "td/UI/columns"], function(t, e, i, s, n, o) {
    function r() {
        this.defaultAttrs({
            columnsContainerSelector: ".js-app-columns",
            containerSelector: "#container",
            columnDragHandleSelector: ".js-column-drag-handle",
            appColumnsContainerSelector: ".js-app-columns-container",
            hideTweetDragHandlesClass: "without-tweet-drag-handles",
            columnsLeftMargin: 10,
            slideMinDuration: 200,
            slideMaxDuration: 500,
            extraSlideTimePer100Px: 20,
            scrollChirpToTopDuration: 750,
            scrollChirpToTopOffset: 50,
            focusId: null,
            dragScrollActivationOffset: {
                left: 500,
                right: 800
            },
            dragScrollActivationResponseDamping: 10
        }), this.handleColumnFocus = function(t, e) {
            var i;
            void 0 !== e.index ? i = this.getKeyForColumnAtIndex(e.index) : e.last ? i = this.getKeyForLastColumn() : e.columnKey && (i = e.columnKey), i && TD.ui.columns.scrollColumnToCenter(i)
        }, this.handleScrollToColumn = function(t, e) {
            var i, s, n, o = this.getColumnElementByKey(e.column.model.getKey()),
                r = this.select("containerSelector"),
                a = this.select("columnsContainerSelector"),
                h = o.outerWidth(),
                c = a.width(),
                l = r.scrollLeft(),
                u = o.position().left,
                d = u + h;
            u >= 0 && c >= d || (n = "left" === e.direction ? l + u - e.offset : l + d + e.offset - c, n !== l && (r.stop(), i = Math.abs(n - l), s = this.attr.slideMinDuration + i / 100 * this.attr.extraSlideTimePer100Px, s = Math.min(s, this.attr.slideMaxDuration), r.animate({
                scrollLeft: n
            }, s, "easeInOutQuad")))
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
        }, this.handleColumnRendered = function(t, e) {
            e.$column.trigger("itemadded.dragdroplist", {
                itemId: e.column
            }), o.attachTo(e.$column, {
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
            var i = e.columns.some(function(t) {
                return t.isOwnCustomTimeline()
            }),
                s = !i;
            this.select("columnsContainerSelector").toggleClass(this.attr.hideTweetDragHandlesClass, s)
        }, this.after("initialize", function() {
            this.$scrollContainer = this.select("containerSelector"),
            this.on(document, "uiColumnFocus", this.handleColumnFocus),
            this.on(document, "uiColumnsScrollToColumn", this.handleScrollToColumn),
            this.on(document, "uiColumnsScrollToChirp", this.handleScrollToChirp),
            this.on(document, "dataColumnOrder", this.setTweetDragHandleState),
            this.on(document, "uiColumnRendered", this.handleColumnRendered), this.select("columnSelector").each(function(t, e) {
                var i = $(e);
                o.attachTo(i, {
                    focusId: this.attr.focusId
                })
            }.bind(this)), this.setupDragScroll("appColumnsContainerSelector", {
                deltaFn: function(t, e, i, s) {
                    if (!this.attr.dragScrollActivationOffset[e]) return t;
                    var n = this.attr.dragScrollActivationOffset[e] / 10,
                        o = this.attr.dragScrollActivationResponseDamping,
                        r = 1 / (1 + Math.pow(Math.E, n - s / o));
                    return (t * r).toFixed(4)
                }
            }), this.select("columnsContainerSelector").dragdroplist({
                selector: this.attr.columnSelector,
                contentSelector: this.attr.columnSelector,
                handle: this.attr.columnDragHandleSelector,
                $boundary: this.select("appColumnsContainerSelector"),
                orientation: "horizontal",
                tagName: "section",
                scroll_speed: 24
            }).on("dropped.dragdroplist", function() {
                var t = [];
                $(".js-column").each(function() {
                    t.push($(this).attr("data-column"))
                }), TD.storage.clientController.client.setColumnOrder(t)
            }),
            this.on(document, "dataColumnOrder", this.calculateColumnVisibilities),
            this.on(this.$scrollContainer, "scroll", this.calculateColumnVisibilities),
            this.on(window, "resize", this.calculateColumnVisibilities), TD.util.isTouchDevice() && this.on(this.$scrollContainer, "scroll", function() {
                TD.util.cancelFastClick()
            })
        })
    }
    return t(r, e, i, s, n)
}), define("ui/with_focus", [], function() {
    var t = function() {
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
        }, this.after("teardown", function() {
            this.trigger("uiFocusRelease", {
                id: this.focusId
            })
        }), this.after("initialize", function() {
            this.focusId = this.attr.focusId || _.uniqueId("focus"), this.hasFocus = !1,
            this.on(document, "uiFocus", this.handleFocus), this.attr.autoFocus === !0 && this.focusRequest()
        })
    };
    return t
}), define("ui/grid", ["flight/lib/component", "ui/with_focus", "ui/with_column_selectors"], function(t, e, i) {
    var s = function() {
        this.defaultAttrs({
            id: "grid",
            focusId: null,
            chirpScrollOffset: 20,
            columnScrollOffset: 20,
            isSelectedClass: "is-selected-tweet",
            chirpSelector: ".js-stream-item",
            autoFocus: !0,
            pagingEasingFunction: "easeOutQuad"
        }), this.setSelectedColumn = function(t) {
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
                h = null,
                c = Number.MAX_VALUE;
            r.each(function() {
                var t = $(this),
                    i = t.position().top,
                    s = i + t.outerHeight();
                s >= 0 && o >= i && e >= i && s >= e && (a = $().add(t))
            }), 0 === a.length ? h = r.last() : 1 === a.length ? h = a : a.each(function(i, s) {
                var n = this.calculateChirpCenterRelativeToColumn(t, $(s)),
                    o = Math.abs(e - n);
                c = Math.min(o, c), o === c && (h = $(s))
            }.bind(this)), this.setSelectedChirp(h, i)
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
                            column: this.selectedColumn,
                            source: this.attr.id,
                            offset: this.attr.columnScrollOffset,
                            direction: this.scrollDirection
                        })
                    }
            }, i = _.throttle(e.bind(this), 100);
            return i
        }, this.handleColumnOrderData = function(t, e) {
            e.columns && (this.columns = e.columns, this.columnIndex = null, this.selectedColumn && this.columns.forEach(function(t, e) {
                this.selectedColumn === t && (this.columnIndex = e)
            }.bind(this)), null === this.columnIndex && (this.selectedColumn = null, this.$selectedChirp = $(), this.offset = null))
        }, this.selectColumnByKey = function(t) {
            if (this.selectedColumn && this.selectedColumn.model.getKey() === t) return !1;
            for (var e = 0; e < this.columns.length; e++)
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
            this.hasFocus && (s = this.getColumnElementByKey(this.selectedColumn.model.getKey()), this.isInDetailView() ? (t = this.selectedColumn.detailViewComponent.parentChirp, i = this.selectedColumn.getChirpContainer(), e = i.find('[data-key="' + t.id + '"]'), s.trigger("uiCloseDetailView"), e.addClass(this.attr.isSelectedClass), this.$selectedChirp = e, this.scrollToChirp("down")) : this.isInDetailViewLevel2() && s.trigger("uiCloseSocialProof"))
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
                    var e, i, s, n, o, r, a, h = this.selectedColumn.model.getKey(),
                        c = this.getColumnScrollContainerByKey(h),
                        l = c.scrollTop(),
                        u = c.innerHeight();
                    if (0 === this.$selectedChirp.length && this.selectFirstChirpInSelectedColumn(), null !== this.chirpOffsetTop ? e = this.chirpOffsetTop : (e = this.$selectedChirp.position().top, this.targetChirpOffsetTop = null), this.chirpOffsetTop = e, this.$selectedChirp.removeClass(this.attr.isSelectedClass), "down" === t) {
                        this.targetChirpOffsetTop = null === this.targetChirpOffsetTop ? e + u : this.targetChirpOffsetTop + u;
                        do r = this.$selectedChirp.next(this.attr.chirpSelector), r.length > 0 && (this.$selectedChirp = r); while (r.length > 0 && r.position().top < this.targetChirpOffsetTop);
                        i = l + (this.$selectedChirp.position().top - e), i + u + 50 > c.get(0).scrollHeight && (i += 50), s = i - l
                    } else {
                        this.targetChirpOffsetTop = null === this.targetChirpOffsetTop ? e - u : this.targetChirpOffsetTop - u;
                        do o = this.$selectedChirp.prev(this.attr.chirpSelector), o.length > 0 && (this.$selectedChirp = o); while (o.length > 0 && o.position().top > this.targetChirpOffsetTop);
                        i = l - (e + Math.abs(this.$selectedChirp.position().top)), s = l - i
                    }
                    this.$selectedChirp.addClass(this.attr.isSelectedClass), a = function() {
                        this.chirpOffsetTop = null, this.targetChirpOffsetTop = null
                    }.bind(this), n = TD.ui.columns.calculateScrollDuration(s, 50, 750), c.stop().animate({
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
        }, this.after("initialize", function() {
            this.selectedColumn = null, this.$selectedChirp = $(), this.columnIndex = null, this.chirpCenter = null, this.scrollDirection = this.attr.down, this.chirpOffsetTop = null,
            this.on(document, "uiGridLeft", this.moveSelection("left")),
            this.on(document, "uiGridUp", this.moveSelection("up")),
            this.on(document, "uiGridRight", this.moveSelection("right")),
            this.on(document, "uiGridDown", this.moveSelection("down")),
            this.on(document, "uiGridBack", this.handleBack),
            this.on(document, "uiGridClearSelection", this.handleClearSelection),
            this.on(document, "uiColumnFocus", this.handleColumnFocus),
            this.on(document, "uiGridPageDown", this.handlePagingFactory("down")),
            this.on(document, "uiGridPageUp", this.handlePagingFactory("up")),
            this.on(document, "uiGridHome", this.handleGridHome),
            this.on(document, "uiGridEnd", this.handleGridEnd),
            this.on(document, "uiGridShowDetail", this.tweetActionFactory("viewDetails")),
            this.on(document, "uiGridReply", this.tweetActionFactory("reply")),
            this.on(document, "uiGridFavorite", this.tweetActionFactory("favorite")),
            this.on(document, "uiGridRetweet", this.tweetActionFactory("retweet")),
            this.on(document, "uiGridDirectMessage", this.tweetActionFactory("dm")),
            this.on(document, "uiGridProfile", this.tweetActionFactory("profile")),
            this.on(document, "uiGridCustomTimeline", this.tweetActionFactory("customTimeline")),
            this.on(document, "uiDetailViewActive", this.handleDetailViewActive),
            this.on(document, "uiShowSocialProof", this.handleDetailViewActive),
            this.on(document, "uiDetailViewClosed", this.handleDetailClosed),
            this.on(document, "dataColumnOrder", this.handleColumnOrderData), this.trigger("uiNeedsColumnOrder", {
                source: this.attr.id
            })
        })
    };
    return t(s, e, i)
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
            this.focusHistory = [],
            this.on(document, "uiFocusRequest", this.handleFocusRequest),
            this.on(document, "uiFocusRelease", this.handleFocusRelease)
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
}), define("ui/with_modal", ["util/notifications", "flight/lib/compose", "ui/with_focus"], function(t, e, i) {
    function s() {
        e.mixin(this, [i]), this.defaultAttrs({
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
        }, this.dismiss = function() {
            this.attr.closeEvent && this.trigger(this.attr.closeEvent)
        }, this.handleClickOnOverlay = function(t) {
            t.target === this.$node.get(0) && this.dismiss()
        }, this.after("teardown", function() {
            this.$node.hide()
        }), this.after("initialize", function() {
            this.trigger("uiCloseModal"),
            this.on(this.$node, "click", this.handleClickOnOverlay),
            this.on("click", {
                dismissButton: this.dismiss
            }),
            this.on(document, "uiCloseModal", this.dismiss)
        }), this.after("render", function() {
            this.select("modalPanel").draggable({
                boundary: this.getDragDropBoundary.bind(this),
                handle: this.select("modalDragHandle")
            }),
            this.on("start.draggable", this.handleDragStart), this.focusRequest();
            var t = this.select("modalPanel").parent(this.attr.modal),
                e = $(this.attr.openModalID);
            TD.util.isTouchDevice() && TD.decider.get(TD.decider.TOUCHDECK_MODALS) ? (t.addClass(this.attr.isTouchModalClass), e.addClass(this.attr.isTouchModalClass)) : (t.removeClass(this.attr.isTouchModalClass), e.removeClass(this.attr.isTouchModalClass))
        }), this.before("teardown", function() {
            this.$node.removeClass(this.attr.isDraggingClass)
        })
    }
    return s
}), define("ui/embed_tweet", ["flight/lib/component", "ui/with_template", "ui/with_modal"], function(t, e, i) {
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
            var i, s, n, o, r, a, h, c;
            if (e && e.html && e.request && e.request.tweetID === this.attr.tweet.id && e.request.hideThread !== this.includeParentTweet && e.request.hideMedia !== this.includeMedia)
                if (this.putEmbedDataInCache(e), c = function(t) {
                    var c;
                    this.render("embed_tweet", {
                        html: e.html,
                        isReply: !! t.inReplyToID,
                        includeParentTweet: this.includeParentTweet,
                        hasMedia: !! t.cards,
                        includeMedia: this.includeMedia
                    }), this.select("modalTitle").text(TD.i("Embed this Tweet")),
                    this.on(this.select("embedTextArea"), "focus", this.handleInputBoxFocus), s = this.select("embedIframe"), n = this.select("embedIframeContainer"), o = this.select("embedModalPanel"), r = this.select("embedModalHeader"), a = this.select("embedModalContent"), h = this.select("embedLoading"), c = function() {
                        n.css("height", "auto"), s.height(Math.max($("html", i).outerHeight(), $("body", i).outerHeight(), s.height())), o.height(a.height() + r.outerHeight()), $("a", i).attr("target", "_blank")
                    }.bind(this), s.load(function() {
                        h.addClass("is-hidden"), c(), this.resizeIframeIntervalId = setInterval(c, 500)
                    }.bind(this)), s[0] && (i = s[0].contentWindow.document, i.open(), i.write('<!DOCTYPE html><head><base href="https://tweetdeck.twitter.com"></head><body>' + e.html + "</body></html>"), i.close()), a.removeClass("horizontal-flow-container")
                }, !this.attr.tweet.cards && this.attr.tweet.hasLink()) {
                    var l = TD.controller.clients.getClient(this.attr.tweet.account.getKey());
                    l.show(this.attr.tweet.id, c.bind(this), function() {
                        this.trigger(document, this.attr.dataEmbeddedTweetErrorEvent, e)
                    }.bind(this))
                } else c.call(this, this.attr.tweet)
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
            }),
            this.on(this.attr.closeEvent, this.teardown),
            this.on("change", {
                embedIncludeParentCheckBox: this.handleEmbeddedTweetOptionsChange,
                embedIncludeMediaCheckBox: this.handleEmbeddedTweetOptionsChange
            }),
            this.on(document, this.attr.dataEmbeddedTweetEvent, this.handleEmbeddedTweet),
            this.on(document, this.attr.dataEmbeddedTweetErrorEvent, this.handleEmbeddedTweetError)
        })
    }
    return t(s, e, i)
}), define("ui/keyboard_shortcut_list", ["flight/lib/component", "ui/with_template", "ui/with_modal"], function(t, e, i) {
    function s() {
        this.defaultAttrs({
            closeEvent: "uiCloseKeyboardShortcutsList",
            modalTitle: ".js-header-title"
        }), this.after("teardown", function() {
            this.$node.html("")
        }), this.after("initialize", function() {
            this.render("keyboard_shortcut_list", {
                isMac: "osx" === TD.util.getOSName()
            }), this.select("modalTitle").text(TD.i("Keyboard shortcuts")),
            this.on(this.attr.closeEvent, this.teardown)
        })
    }
    return t(s, e, i)
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
}), define("ui/relationship", ["flight/lib/component"], function(t) {
    var e = function() {
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
            followButton: ".js-follow-button",
            menuButton: ".js-profile-menu"
        }), this.resetState = function() {
            this.$node.removeClass(this.attr.classNamesForStates[this.state])
        }, this.setState = function(t, e) {
            this.state = t.following ? this.attr.states.following : this.attr.states.notFollowing, t.id === e.id && (this.state = this.attr.states.me), t.blocking && (this.state = this.attr.states.blocking)
        }, this.handleMenuButtonClick = function(t) {
            this.menu ? this.menu.destroy() : (this.menu = new TD.components.ProfileMenu(this.select("menuButton"), TD.components.DropDown.POSITION_LEFT, this.twitterUser), t.stopPropagation())
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
                    TD.util.openURL("https://twitter.com/settings/profile");
                    break;
                case this.attr.states.unknown:
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
        }, this.destroyMenuReference = function() {
            this.menu = null
        }, this.after("initialize", function() {
            this.account = this.attr.account, this.twitterUser = this.attr.twitterUser, this.state = this.attr.states.unknown,
            this.on(document, "dataRelationship", this.handleRelationshipData),
            this.on("click", {
                followButton: this.handleFollowButtonClick,
                menuButton: this.handleMenuButtonClick
            }),
            this.on("td-dropdown-close", this.destroyMenuReference),
            this.on(document, "uiFollowAction dataUnfollowActionError", this.handleActionFactory("following")),
            this.on(document, "uiUnfollowAction dataFollowActionError", this.handleActionFactory("notFollowing")),
            this.on(document, "uiBlockAction dataUnblockActionError", this.handleActionFactory("blocking")),
            this.on(document, "uiUnblockAction dataBlockActionError dataReportActionError", this.handleActionFactory("notFollowing")), $.subscribe("/user/" + this.screenName + "/block", this.handlePubSubEvent("blocking")), $.subscribe("/user/" + this.screenName + "/unblock", this.handlePubSubEvent("notFollowing")), this.attr.closeEvent && this.on(this.attr.closeEvent, this.destroy), this.trigger("uiNeedsRelationship", {
                account: this.account,
                screenName: this.twitterUser.screenName
            })
        })
    };
    return t(e)
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
}), define("ui/twitter_profile", ["flight/lib/component", "ui/with_template", "ui/with_modal", "ui/with_column_config", "ui/relationship", "util/notifications", "ui/follow_state", "ui/with_transitions"], function(t, e, i, s, n, o, r, a) {
    function h() {
        this.defaultAttrs({
            dataAction: "[data-action]",
            socialProofSelector: ".js-social-proof",
            followFromSelector: ".js-action-follow",
            followStateSelector: ".prf-follow-status",
            closeEvent: "uiCloseTwitterProfile",
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
                }),
                this.on(this.attr.dataAction, "click", this.handleActionClick), this.twitterUser.isMe() || this.trigger(document, "uiNeedsUserProfileSocialProof", {
                    screenName: this.screenName
                });
                var i = {
                    account: this.account,
                    twitterUser: this.twitterUser,
                    closeEvent: this.attr.closeEvent
                };
                n.attachTo(this.select("followFromSelector"), i), r.attachTo(this.select("followStateSelector"), i)
            }
        }, this.handleTwitterUserError = function(t, e) {
            e.screenName.toLowerCase() === this.screenName.toLowerCase() && this.teardown()
        }, this.handleSocialProofData = function(t, e) {
            var i, s, n, o, r = this.select("socialProofSelector"),
                a = this.select("modalPanel"),
                h = [],
                c = 0,
                l = [];
            if (e.users && e.users.length) {
                if (e.users.length > this.attr.numUsersInSocialProof)
                    for (c = e.users.length - this.attr.numUsersInSocialProof; h.length < this.attr.numUsersInSocialProof;) o = Math.floor(Math.random() * e.users.length), h.push(e.users.splice(o, 1)[0]);
                else h = e.users;
                h.forEach(function(t) {
                    l.push(TD.ui.template.render("text/social_proof_link", t))
                }), c > 0 && l.push(TD.ui.template.render("text/followers_you_follow_link", {
                    screenName: this.screenName
                })), l.length > 1 && (s = l.splice(l.length - 1, 1)), i = l.join(", "), n = a.position(), a.css("position", "absolute").css("left", n.left).css("top", n.top), r.removeClass("is-hidden"), r.html(TD.ui.template.render("twitter_profile_social_proof", {
                    followedByString: i,
                    others: s
                })), this.transitionExpand(r, this.attr.isSocialProofAnimatingClass)
            }
        }, this.handleActionClick = function(t) {
            var e = $(t.currentTarget),
                i = (e.data("action"), e.data("type")),
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
        }, this.after("initialize", function() {
            this.screenName = "" + this.attr.screenName, this.account = this.attr.account, 0 === this.screenName.indexOf("@") && (this.screenName = this.screenName.substring(1)),
            this.on(document, "dataAccounts", this.handleAccounts), this.trigger(document, "uiNeedsAccounts"),
            this.on(document, "dataTwitterUser", this.handleTwitterAccount),
            this.on(document, "dataTwitterUserError", this.handleTwitterUserError),
            this.on(document, "dataUserProfileSocialProof", this.handleSocialProofData), this.render("twitter_profile", {
                loading: !0
            }), this.trigger(document, "uiNeedsTwitterUser", {
                screenName: this.screenName
            }),
            this.on(this.attr.closeEvent, this.destroy)
        })
    }
    return t(h, e, i, s, a)
}), define("ui/report_message_options", ["flight/lib/component", "ui/with_template", "ui/with_modal"], function(t, e, i) {
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
            s(this),
            this.on(this.attr.closeEvent, this.teardown),
            this.on("click", {
                spamButtonSelector: this.handleActionFactory("spam"),
                abuseButtonSelector: this.handleActionFactory("abuse"),
                dismissButton: this.handleManualDismiss
            }),
            this.on(document, "dataDMReport", this.handleReportData)
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
}), define("ui/report_tweet_options", ["flight/lib/component", "ui/with_template", "ui/with_modal"], function(t, e, i) {
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
            }), this.select("modalTitle").text(TD.i("Report Tweet")),
            this.on("change", {
                inputs: this.handleInputClick
            }),
            this.on("click", {
                submitButton: this.handleSubmitclick,
                abuseLinks: this.handleAbuseLinkClick,
                dismissButton: this.handleManualDismiss
            }),
            this.on(this.$node, "click", this.handleOffNodeDismiss),
            this.on(this.attr.closeEvent, this.teardown)
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
}), define("ui/account_shared_warning", ["flight/lib/component", "ui/with_template", "ui/with_modal"], function(t, e, i) {
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
            }), TD.controller.stats.sharedAccountWarning("impression"), this.select("modalTitle").text(TD.i("Multi-account security")),
            this.on("click", {
                continueSelector: this.handleContinue,
                abortSelector: this.handleAbort,
                dismissButton: this.handleExplicitDismiss
            }),
            this.on(this.attr.closeEvent, this.teardown)
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
}), define("ui/with_dialog_manager", ["ui/embed_tweet", "ui/keyboard_shortcut_list", "ui/twitter_profile", "ui/report_message_options", "ui/report_tweet_options", "ui/account_shared_warning"], function(t, e, i, s, n, o) {
    var r = function() {
        this.showProfile = function(t, e) {
            this.trigger("uiCloseModal"), i.attachTo(this.select("modal"), {
                screenName: e.id,
                account: this.preferredAccount
            }), this.select("modal").show()
        }, this.showAddColumn = function() {
            TD.ui.openColumn.showOpenColumn()
        }, this.showEmbedTweet = function(e, i) {
            t.attachTo(this.select("modal"), {
                tweet: i.tweet
            }), this.select("modal").show()
        }, this.showKeyboardShortcutList = function() {
            e.attachTo(this.select("modal")), this.select("modal").show()
        }, this.showReportTweetOptions = function(t, e) {
            e.isMessage ? s.attachTo(this.select("modal"), {
                account: e.account,
                twitterUser: e.twitterUser,
                tweetId: e.tweetId
            }) : n.attachTo(this.select("modal"), {
                account: e.account,
                twitterUser: e.twitterUser,
                tweetId: e.tweetId
            }), this.select("modal").show()
        }, this.showAccountSharedWarning = function() {
            var t = this.select("modal");
            o.attachTo(t), t.show()
        }, this.after("initialize", function() {
            this.on("uiShowProfile", this.showProfile),
            this.on("uiShowAddColumn", this.showAddColumn),
            this.on("uiShowEmbedTweet", this.showEmbedTweet),
            this.on("uiShowKeyboardShortcutList", this.showKeyboardShortcutList),
            this.on("uiShowReportTweetOptions", this.showReportTweetOptions),
            this.on("uiShowAccountSharedWarning", this.showAccountSharedWarning)
        })
    };
    return r
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
                        type: "uiReauthorizeTwitterAccount",
                        data: {
                            account: t.account
                        }
                    }
                }, {
                    id: "no-button",
                    action: "trigger-event",
                    label: TD.i("It's fine "),
                    "class": "btn-alt",
                    event: {
                        type: "uiRemoveTwitterAccount",
                        data: {
                            key: t.account.getKey()
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
                text: TD.i("TweetDeck no longer has permission to access your main login account @{{1}}.", {
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
            this.$application = this.select("applicationSelector"), this.$message = this.select("messageSelector"), this._boundOnHiddenFn = this._onHidden.bind(this),
            this.on(document, "uiHidingMessageBanner", this.handleHideMessageBannerContainer),
            this.on(document, "uiMessageBannerShown", this.handleMessageBannerResize),
            this.on(document, "uiMessageBannerResized", this.handleMessageBannerResize),
            this.on(document, "dataTwitterAccountAccessDenied", this.showAccessDeniedMessage),
            this.on(document, "dataTwitterAccountSuspended", this.showAccountSuspendedMessage),
            this.on(document, "dataFacebookAccountRemoved", this.showFacebookRemovedMessage)
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
            var e = this.validateFileCount(t.length);
            if (!e.success) return e;
            for (var i = 0; i < t.length; i++)
                if (validateResult = this.validateFile(t[i]), !validateResult.success) return validateResult;
            return validateResult
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
            this.files = [], $("body").append(this.attr.uploadInputTemplate),
            this.on(document, "uiResetImageUpload", this.handleResetImageUpload),
            this.on(document, "uiComposeAddImageClick", this.handleComposeAddImageClick),
            this.on(document, "dragstart", this.disable),
            this.on(document, "dragend", this.enable),
            this.on(document, "dragenter", this.whenEnabled(this.handleDragEnterEvent)),
            this.on(document, "dragleave", this.whenEnabled(this.handleDragLeaveEvent)),
            this.on(document, "drop", this.whenEnabled(this.handleDropEvent)),
            this.on(document, "dragover", this.whenEnabled(this.cancel)),
            this.on(document, "change", {
                uploadInputSelector: this.handleFileUploadChange
            })
        })
    };
    return t(e)
}), define("ui/login/with_login_form", ["require"], function() {
    return function() {
        this.defaultAttrs({
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
            signUpLinkSelector: ".js-twitter-signup"
        }), this.after("initialize", function() {
            this.on(document, "uiLoginShowLoginForm", this.loginFormHandleShowLoginForm),
            this.on(document, "dataLoginError", this.loginFormComposeFormResponse(this.loginFormHandleLoginError)),
            this.on(document, "dataLoginServerError", this.loginFormComposeFormResponse(this.loginFormHandleLoginServerError)),
            this.on("click", {
                toggleLoginTypeSelector: this.loginFormHandleToggleLoginType,
                externalLinkSelector: this.openExternalLink,
                signUpLinkSelector: this.handleTwitterSignUpClick
            }),
            this.on("submit", {
                userFormSelector: this.loginFormHandleFormSubmit
            })
        }), this.loginFormComposeFormResponse = _.partial(_.compose, function() {
            this.loginFormToggleFormDisabled(!1)
        }), this.loginFormHandleShowLoginForm = function(t, e) {
            this.render(this.attr.templateName, {
                version: TD.version,
                staySignedIn: e && e.staySignedIn,
                resolution: TD.util.isRetina() ? "2x" : "1x"
            })
        }, this.loginFormHandleToggleLoginType = function(t) {
            t.preventDefault();
            var e = TD.storage.storeUtils.getCurrentAuthType();
            "tweetdeck" === e ? TD.storage.storeUtils.setCurrentAuthType("twitter") : TD.storage.storeUtils.setCurrentAuthType("tweetdeck"), window.location.reload()
        }, this.loginFormToggleFormDisabled = function(t) {
            this.select("userFormSelector").find("input").attr("disabled", t), t ? this.spinnerButtonEnable() : this.spinnerButtonDisable()
        }, this.getStaySignedIn = function() {
            return this.select("staySignedInSelector").prop("checked")
        }, this.loginFormShowErrorMessage = function(t) {
            this.select("successSelector").addClass("is-hidden"), this.select("errorMessageSelector").html(t), this.select("errorSelector").removeClass("is-hidden")
        }, this.loginFormShowSuccessMessage = function(t) {
            this.select("errorSelector").addClass("is-hidden"), this.select("successMessageSelector").html(t), this.select("successSelector").removeClass("is-hidden")
        }, this.loginFormHideMessages = function() {
            this.select("errorSelector").addClass("is-hidden"), this.select("successSelector").addClass("is-hidden")
        }, this.openExternalLink = function(t) {
            t.preventDefault(), window.open(t.target.href)
        }, this.handleTwitterSignUpClick = function() {
            TD.storage.storeUtils.setCurrentAuthType("twitter"), window.location.reload()
        }
    }
}), define("ui/login/with_xauth_errors", [], function() {
    return function() {
        var t = "unknown";
        this.after("initialize", function() {
            this.xAuthErrors = {
                32: [TD.i("Invalid username or password"), !1],
                231: [TD.i("You need to generate a temporary password on twitter.com to sign in."), !1],
                235: [TD.i("Your login verification request has expired. Please sign in again."), !0],
                236: [TD.i("That&rsquo;s not the correct code. Please re-enter the code sent to your phone."), !1],
                241: [TD.i("The login verification request sent to your phone was rejected."), !0],
                242: [TD.i("Your account is deactivated. Please sign in on twitter.com to reactivate."), !0],
                243: [TD.i("You have too many failed sign in attempts. Please try again in an hour."), !0],
                244: [TD.i("You must reset the password on this account. Please sign in on twitter.com to do this."), !0],
                245: [TD.i("You have initiated too many login requests. Please try sigining in again in an hour."), !0],
                246: [TD.i("You have entered too many incorrect codes. Please try signing in again."), !0],
                429: [TD.i("You have initiated too many login requests. Please try sigining in again later."), !0],
                unknown: [TD.i("Unknown sign in error. Please try again."), !0]
            }
        }), this._getXAuthError = function(e) {
            return e = e ? e.toString() : t, this.xAuthErrors[e] || this.xAuthErrors[t]
        }, this.getXAuthErrorMessage = function(t) {
            return this._getXAuthError(t)[0]
        }, this.getXAuthErrorIsFatal = function(t) {
            return this._getXAuthError(t)[1]
        }
    }
}), define("ui/login/twitter_account_login_form", ["require", "flight/lib/component", "ui/login/with_login_form", "ui/with_template", "ui/with_spinner_button", "ui/login/with_xauth_errors"], function(t) {
    function e() {
        this.username = null, this.password = null, this.verificationRequestId = null, this.verificationUserId = null, this.defaultAttrs({
            codeFormSelector: ".js-twogin-2fa-code-form",
            codeSelector: ".js-twogin-2fa-code",
            resetPasswordSelector: ".js-reset-twitter-password",
            templateName: "login/twitter_account_login_form"
        }), this.after("initialize", function() {
            this.on(document, "dataLoginTwoFactorCodeRequired", this.loginFormComposeFormResponse(this.handleLoginTwoFactorCode)),
            this.on(document, "dataLoginTwoFactorAwaitingConfirmation", this.loginFormComposeFormResponse(this.handleLoginTwoFactorAwaiting)),
            this.on(document, "dataLogin2FATimeout", this.loginFormComposeFormResponse(this.handleLogin2FATimeout)),
            this.on("submit", {
                codeFormSelector: this.handle2FACodeForm
            }),
            this.on("click", {
                resetPasswordSelector: this.handleResetPassword
            })
        }), this.loginFormHandleFormSubmit = function(t) {
            t.preventDefault();
            $(t.target);
            this.loginFormToggleFormDisabled(!0), this.username = this.select("usernameSelector").val(), this.password = this.select("passwordSelector").val(), this.username && this.password ? (this.loginFormHideMessages(), this.trigger("uiLoginRequest", {
                username: this.username,
                password: this.password,
                staySignedIn: this.getStaySignedIn()
            })) : (this.loginFormShowErrorMessage(TD.i("username and password must be filled in")), this.loginFormToggleFormDisabled(!1))
        }, this.handleLoginTwoFactorCode = function(t, e) {
            this.verificationRequestId = e.xAuth.login_verification_request_id, this.verificationUserId = e.xAuth.login_verification_user_id, this.staySignedIn = e.staySignedIn, this.render("login/2fa_verification_code")
        }, this.handle2FACodeForm = function(t) {
            t.preventDefault();
            var e = ($(t.target), this.select("codeSelector").val());
            e ? (this.loginFormToggleFormDisabled(!0), this.trigger("uiLogin2FARequest", {
                username: this.username,
                password: this.password,
                code: e,
                requestId: this.verificationRequestId,
                userId: this.verificationUserId,
                staySignedIn: this.staySignedIn
            })) : this.loginFormShowErrorMessage(TD.i("Fill the code in"))
        }, this.handleLoginTwoFactorAwaiting = function() {
            this.render("login/2fa_verification")
        }, this.loginFormHandleLoginError = function(t, e) {
            this.getXAuthErrorIsFatal(e.code) && this.loginFormHandleShowLoginForm(null, {
                staySignedIn: this.getStaySignedIn()
            }), this.loginFormShowErrorMessage(this.getXAuthErrorMessage(e.code))
        }, this.loginFormHandleLoginServerError = function() {
            this.loginFormHandleShowLoginForm(null, {
                staySignedIn: this.getStaySignedIn()
            }), this.loginFormShowErrorMessage(this.getXAuthErrorMessage())
        }, this.handleLogin2FATimeout = function() {
            this.loginFormHandleShowLoginForm(), this.loginFormShowErrorMessage(TD.i("The login verification request sent to your phone went unanswered."))
        }, this.handleResetPassword = function(t) {
            t.preventDefault(), window.open($(t.target).attr("href"), null, "width=320,height=500")
        }
    }
    var i = t("flight/lib/component"),
        s = t("ui/login/with_login_form"),
        n = t("ui/with_template"),
        o = t("ui/with_spinner_button"),
        r = t("ui/login/with_xauth_errors");
    return i(e, s, n, o, r)
}), define("ui/login/tweetdeck_account_login_form", ["require", "flight/lib/component", "ui/login/with_login_form", "ui/with_template", "ui/with_spinner_button"], function(t) {
    function e() {
        this.defaultAttrs({
            forgotPasswordSelector: ".js-login-forgot-password",
            templateName: "login/tweetdeck_account_login_form"
        }), this.after("initialize", function() {
            this.on(document, "dataForgotPasswordSuccess", this.handleForgotPasswordSuccess),
            this.on(document, "dataForgotPasswordError", this.handleForgotPasswordError),
            this.on("click", {
                forgotPasswordSelector: this.handleForgotPasswordClick
            })
        }), this.loginFormHandleFormSubmit = function(t) {
            t.preventDefault(), this.loginFormToggleFormDisabled(!0);
            var e = this.select("usernameSelector").val(),
                i = this.select("passwordSelector").val();
            e && i ? (this.loginFormHideMessages(), this.trigger("uiTweetDeckLoginRequest", {
                email: e,
                password: i,
                staySignedIn: this.getStaySignedIn()
            })) : (this.loginFormShowErrorMessage(TD.i("Username and password must be filled in.")), this.loginFormToggleFormDisabled(!1))
        }, this.handleForgotPasswordClick = function(t) {
            t.preventDefault();
            var e = this.select("usernameSelector").val();
            e ? this.trigger("uiTweetDeckForgotPasswordRequest", {
                email: e
            }) : this.loginFormShowErrorMessage(TD.i("Please enter your email address."))
        }, this.handleForgotPasswordSuccess = function(t, e) {
            this.loginFormShowSuccessMessage(TD.i("We have sent an email to {{email}} with instructions to reset your password.", e))
        }, this.handleForgotPasswordError = function(t, e) {
            this.loginFormShowErrorMessage(TD.i("We could not find a TweetDeck account associated with {{email}}.", e))
        }, this.loginFormHandleLoginError = function() {
            this.loginFormShowErrorMessage(TD.i("We could not log you in with this username and password."))
        }, this.loginFormHandleLoginServerError = function() {
            this.loginFormShowErrorMessage(TD.i("Handle login server error"))
        }
    }
    var i = t("flight/lib/component"),
        s = t("ui/login/with_login_form"),
        n = t("ui/with_template"),
        o = t("ui/with_spinner_button");
    return i(e, s, n, o)
}), define("ui/login/sole_user_dialog", ["require", "flight/lib/component", "ui/with_template"], function(t) {
    function e() {
        this.defaultAttrs({
            questionYesButtonSelector: ".js-twogin-question-yes-btn",
            questionNoButtonSelector: ".js-twogin-question-no-btn",
            warningAccessAnywayButtonSelector: ".js-twogin-warning-login-anyway-btn",
            warningLogoutButtonSelector: ".js-twogin-warning-logout-btn",
            soleUserDialogSelector: ".js-twogin-sole-user-dialog",
            questionFormSelector: ".js-twogin-question-form",
            signUpPromptSelector: ".js-twogin-show-signup-prompt"
        }), this.after("initialize", function() {
            this.on(document, "uiLoginShowSoleUserDialog", this.handleShowQuestion),
            this.on("click", {
                questionYesButtonSelector: this.handleQuestionYes,
                questionNoButtonSelector: this.handleQuestionNo,
                warningAccessAnywayButtonSelector: this.handleWarningAccessAnyway,
                warningLogoutButtonSelector: this.handleWarningLogout,
                signUpPromptSelector: this.handleSignUpPrompt
            })
        }), this.handleShowQuestion = function(t, e) {
            t.preventDefault(), this.accountUsername = e.accountUsername, this.render("login/sole_user_question", {
                username: this.accountUsername
            })
        }, this.handleQuestionYes = function(t) {
            t.preventDefault(), this.render("login/sole_user_warning", {
                username: this.accountUsername
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
            t.preventDefault(), this.render("login/sole_user_signup_prompt")
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
            }),
            this.on(document, "mousedown", this.mouseDownOn),
            this.on(document, "mouseup", this.mouseDownOff)
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
}), define("ui/column_navigation", ["flight/lib/component", "ui/drag_drop/with_drag_drop", "ui/with_template", "ui/with_nav_flyover"], function(t, e, i, s) {
    function n() {
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
            touchEvents: "touchstart touchmove touchend touchcancel",
            listOrientation: "vertical",
            isNewClass: "is-new"
        }), this.after("initialize", function() {
            this.renderColumnNavigation(),
            this.on(document, "dataColumnsLoaded", this.handleDataColumnsLoaded),
            this.on(document, "uiMainWindowResized", this.handleUiMainWindowResized), $.subscribe("/storage/client/column_order_changed", this.handleColumnsChanged.bind(this)), $.subscribe("/storage/client/change", this.handleColumnsChanged.bind(this)),
            this.on(document, "uiReadStateChange", this.handleReadStateChange),
            this.on(document, "dataSettings", this.handleDataSettings),
            this.on(document, "uiColumnTitleRefreshed", this.handleColumnTitleRefreshed), this.trigger("uiNeedsSettings"), this.$columnNavScroller = $(".js-column-nav-scroller"), TD.util.isTouchDevice() && this.on(this.$columnNavScroller, this.attr.touchEvents, this.handleTouch), this.initScrollbars(), this.setupDragDrop({
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
            this.initScrollbars()
        }, this.renderColumnNavigation = function() {
            var t, e, i = TD.controller.columnManager.getAllOrdered(),
                s = [];
            this.select("listItemSelector").each(function() {
                s.push($(this).attr("data-column"))
            }), t = s.length !== i.length, e = _.map(i, function(e, i) {
                var n, o, r, a, h = e.model.getKey(),
                    c = TD.ui.columns.getColumnElementByKey(h);
                return s[i] !== h && (t = !0), e.isOwnCustomTimeline() && (n = e.getCustomTimelineFeed(), o = n && n.getMetadata(), r = o && o.id, a = n && n.getAccountKey()), {
                    key: h,
                    title: e.getTitleHTML(),
                    iconclass: e.getIconClass(),
                    isNew: c.hasClass(this.attr.isNewClass),
                    customTimelineId: r,
                    customTimelineAccount: a
                }
            }.bind(this)), t && (this.render(this.attr.templateName, {
                    columns: e
                }), this.$content = this.select("contentSelector"), this.$addColumnButton = this.select("addColumnButtonSelector"),
                this.on("click", {
                    headerActionSelector: this.handleClick.bind(this)
                }), this.select("headerActionSelector").on("mouseover", this.handleListItemMouseover.bind(this)).on("mouseout", this.handleListItemMouseout.bind(this)), this.resizeColumnNavigation(), this.initialiseDragDrop());
            var n = $(".js-column-nav-list a").find(":hover");
            n.length || this.destroyFlyover()
        }, this.resizeColumnNavigation = function() {
            var t = this.$node.height();
            this.$node && t && (this.$content.height() > t ? ($(document).trigger("uiColumnNavSizeOverflow"), this.$addColumnButton.hide()) : ($(document).trigger("uiColumnNavSizeNormal"), this.$addColumnButton.show()))
        }, this.handleUiMainWindowResized = function() {
            this.resizeColumnNavigation(), this.initScrollbars()
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
            TD.ui.columns.setMovingColumn(i), this.select("listItemSelector").each(function() {
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
        }, this.handleReadStateChange = function(t, e) {
            var i = this.$node.find(".js-column-nav-menu-item[data-column=" + e.columnKey + "]");
            i.toggleClass(this.attr.isNewClass, !e.read)
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
            this.$columnNavScroller.antiscroll({
                position: "left"
            })
        }, this.handleTouch = function(n) {
            var o = $(n.target);
            if (0 !== o.closest(".js-drag-handle").length) {
                var r = null,
                    a = n.originalEvent,
                    h = a.changedTouches[0],
                    c = {
                        x: h.pageX,
                        y: h.pageY
                    }, l = (new Date).getTime();
                switch (a.type) {
                    case "touchstart":
                        t = !1, e = l, i = c, s = 0;
                        break;
                    case "touchmove":
                        var u = this.countDistance(c, i);
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
    return t(n, e, i, s)
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
            }),
            this.on(document, "uiCloseModal", this.handleCloseModal), this.boundClickTrap = this.popoverClickTrap.bind(this)
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
            }), this.$searchResultsContainer = this.select("searchResultsContainer"), this.$typeaheadContainer = this.select("typeaheadContainer"), this.searchData = null,
            this.on("uiTypeaheadItemSelected", this.handleTypeaheadItemSelect),
            this.on("uiTypeaheadNoItemSelected", this.handleTypeaheadNoItemSelected),
            this.on("uiTypeaheadSubmitQuery", this.handleTypeaheadSubmitQuery),
            this.on("uiTypeaheadItemComplete", this.handleTypeaheadItemComplete),
            this.on("uiTypeaheadSuggestions", this.handleTypeaheadSuggestions),
            this.on("uiTypeaheadNoSuggestions", this.handleTypeaheadNoSuggestions),
            this.on("uiTypeaheadRenderResults", this.handleTypeaheadRenderResults),
            this.on("uiSearchResultsColumnAdded", this.handleSearchResultsColumnAdded);
            var t = this.searchInputHandlerFactory.bind(this);
            this.on(document, "uiSearchInputSubmit", this.handleSearchInputSubmit),
            this.on(document, "uiSearchInputEscaped", this.handleSearchInputEscaped),
            this.on(document, "uiSearchInputFocus", this.handleSearchInputFocus),
            this.on(document, "uiSearchInputChanged", this.handleSearchInputChanged),
            this.on(document, "uiSearchInputTab", t("uiTypeaheadInputTab")),
            this.on(document, "uiSearchInputLeft", t("uiTypeaheadInputLeft")),
            this.on(document, "uiSearchInputRight", t("uiTypeaheadInputRight")),
            this.on(document, "uiSearchInputMoveUp", t("uiTypeaheadInputMoveUp")),
            this.on(document, "uiSearchInputMoveDown", t("uiTypeaheadInputMoveDown")),
            this.on("uiPopoverShown", this.handlePopoverShown),
            this.on("uiPopoverHiding", this.handlePopoverHiding),
            this.on("uiPopoverHidden", this.handlePopoverHidden), this.hasTypeaheadResults = !0, this.around("hidePopover", function(t, e) {
                e !== !1 && this.$input && this.$input.blur(), this.trigger("uiSearchResultsHidden"), t.apply(this)
            })
        }), this.handlePopoverShown = function() {
            this.$input.addClass("is-focused")
        }, this.handlePopoverHiding = function() {
            this.defaultHeight = "auto", this.$searchResultsContainer.addClass("is-hidden"), this.$typeaheadContainer.removeClass("is-hidden")
        }, this.handlePopoverHidden = function() {
            this.$input.removeClass("is-focused")
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
            this.isCorrectSource(e.source) && (this.searchData = e, twttr.txt.isValidList(e.query) ? (i = e.query.split("/"), TD.ui.openColumn.showList(i[0].substr(1), i[1]), this.hidePopover()) : (this.trigger("uiTypeaheadInputSubmit", e), TD.controller.stats.searchboxPerformSearch(e.query.length)))
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
            this.$usersList = this.select("usersListSelector"),
            this.on("uiTypeaheadRenderResults", this.renderUsers)
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
            this.$savedSearchesList = this.select("savedSearchesListSelector"),
            this.on("uiTypeaheadRenderResults", this.renderSavedSearches)
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
                var h = [];
                e.suggestions.recentSearches.forEach(function(t) {
                    h.push({
                        query: t,
                        name: this.highlightSubstring(t, e.query)
                    })
                }, this), s = this.toHtml(this.attr.recentSearchesTemplate, {
                    recentSearches: h
                })
            } else s = n ? this.toHtml(this.attr.recentSearchesPlaceholderTemplate) : "";
            this.$recentSearchesList.toggleClass(this.attr.recentSearchesFixedClass, n), this.$recentSearchesList.toggleClass("has-results", o).toggleClass("is-hidden", !r).html(s), this.$clearRecentSearches.toggleClass("is-hidden", !n).toggleClass("is-invisible", a)
        }, this.clearRecentSearches = function() {
            delete this.currentData.suggestions.recentSearches, this.renderRecentSearches(null, this.currentData)
        }, this.after("initialize", function() {
            this.$recentSearchesList = this.select("recentSearchesListSelector"), this.$clearRecentSearches = this.select("recentSearchesClearSelector"),
            this.on("uiRecentSearchClearAction", this.clearRecentSearches),
            this.on("uiTypeaheadRenderResults", this.renderRecentSearches)
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
            this.$topicsList = this.select("topicsListSelector"),
            this.on("uiTypeaheadRenderResults", this.renderTopics)
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
            this.$listsList = this.select("listsListSelector"),
            this.on("uiTypeaheadRenderResults", this.renderLists)
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
            this.query = null,
            this.on(document, "dataTypeaheadSuggestions", this.handleDataTypeaheadSuggestions),
            this.on("uiTypeaheadInputFocus", this.handleTypeaheadInputFocus),
            this.on("uiTypeaheadInputBlur", this.handleTypeaheadInputBlur),
            this.on("uiTypeaheadInputSubmit", this.handleTypeaheadInputSubmit),
            this.on("uiTypeaheadInputChanged", this.handleTypeaheadInputChanged),
            this.on("uiTypeaheadInputMoveUp", this.handleTypeaheadInputMoveUp),
            this.on("uiTypeaheadInputMoveDown", this.handleTypeaheadInputMoveDown),
            this.on("uiTypeaheadInputRight", this.handleTypeaheadInputMoveRight),
            this.on("uiTypeaheadInputTab uiTypeaheadInputLeft", this.completeSelection),
            this.on("mouseover", {
                itemsSelector: this.handleItemMouseover
            }),
            this.on("click", {
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
                    h = this.select("itemsSelector"),
                    c = h.index(s);
                this.trigger("uiTypeaheadItemComplete", {
                    value: a,
                    searchType: s.data("search-type"),
                    index: c,
                    query: a
                })
            }
        }, this.handleDataTypeaheadSuggestions = function(t, e) {
            var i = this.select("itemsSelector").filter(this.attr.itemSelectedSelector);
            if (e.dropdownId == this.getDropdownId() && e.query === this.query && this.hasFocus && !i.length) {
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
            this.render(this.attr.template, t), this.$buttons = this.select("buttonSelector"),
            this.on(this.$buttons, "click", this.handleButtonClick),
            this.on("uiToggleSelectItem", this.handleSelectItem),
            this.on("uiToggleButtonDestroy", this.teardown)
        })
    };
    return t(i, e)
}), define("ui/user_search_results", ["flight/lib/component", "ui/with_template", "ui/with_user_menu"], function(t, e, i) {
    var s = function() {
        this.query = null, this.handleSearch = function(t, e) {
            this.query = e.query, this.hideUserMenu(), this.$node.empty(), this.trigger(document, "uiNeedsUserSearch", {
                query: this.query
            })
        }, this.handleResults = function(t, e) {
            e.request.query === this.query && (this.users = e.result, 0 === this.users.length ? this.render("search_no_users_placeholder") : this.render("menus/user_results", {
                users: this.users,
                withUserMenu: !0
            }))
        }, this.after("initialize", function() {
            this.on(document, "uiSearch", this.handleSearch),
            this.on(document, "dataUserSearch", this.handleResults),
            this.on("uiUserResultsDestroy", this.teardown)
        })
    };
    return t(s, e, i)
}), define("ui/with_fixed_header_and_footer", ["flight/lib/compose", "ui/with_template"], function(t, e) {
    var i = function() {
        t.mixin(this, [e]), this.defaultAttrs({
            headerSelector: ".js-fhf-header",
            bodySelector: ".js-fhf-body",
            footerSelector: ".js-fhf-footer"
        }), this.after("initialize", function() {
            this.$headerContainer = this.select("headerSelector"), this.$bodyContainer = this.select("bodySelector"), this.$footerContainer = this.select("footerSelector"),
            this.on("uiFixedHeaderChangedPosition", this.resizeBody)
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
}), define("ui/search/search_results", ["flight/lib/component", "ui/toggle_button", "ui/user_search_results", "ui/with_accordion", "ui/with_template", "ui/with_search_filter", "ui/with_focus", "ui/asynchronous_form", "ui/with_fixed_header_and_footer", "ui/with_transitions"], function(t, e, i, s, n, o, r, a, h, c) {
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
            this.on(document, "uiSearch", this.handleSearch),
            this.on("uiColumnUpdateSearchFilter", this.handleUpdateSearchFilter), TD.util.isTouchDevice() && TD.decider.get(TD.decider.TOUCHDECK_COLUMN_OPTIONS) ? this.select("searchResultsHeaderSelector").addClass(this.attr.isTouchColumnOptionsClass) : this.select("searchResultsHeaderSelector").removeClass(this.attr.isTouchColumnOptionsClass), this.$tweetResults = this.select("tweetResultsSelector"), this.$userResults = this.select("userResultsSelector"), this.$header = this.select("searchResultsHeaderSelector"), this.$footer = this.select("searchResultsFooterSelector"), this.$accordion = this.select("accordionSelector"), i.attachTo(this.$userResults), this.$toggle = this.select("toggleSelector"), e.attachTo(this.$toggle, {
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
            }),
            this.on(this.$header, "uiToggleTweetsClick", this.showTweets),
            this.on(this.$header, "uiToggleUsersClick", this.showUsers),
            this.on(this.$footer.find(".js-add-column"), "click", this.handleAddColumnClick), TD.util.isTouchDevice() && window.navigator.standalone && this.on(this.$userResults, "touchmove", function(t) {
                t.stopPropagation()
            }),
            this.on("uiTransitionExpandStart", this.handleColumnOptionsTransitionStart),
            this.on("uiAccordionTotalHeightChanged", this.resizeBody),
            this.on("uiSearchResultsHidden", this.handleSearchResultsHidden)
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
    return t(l, s, n, r, o, h, c)
}), define("ui/search/search_router", ["flight/lib/component"], function(t) {
    var e = function() {
        this.defaultAttrs({
            appSearchSelector: ".js-search",
            appSearchInputSelector: ".js-search-form .js-app-search-input",
            isTouchSearchClass: "is-touch-search",
            searchPopoverInputSelector: ".js-search-in-popover .js-app-search-input"
        }), this.after("initialize", function() {
            TD.util.isTouchDevice() && TD.decider.get(TD.decider.TOUCHDECK_SEARCH) ? this.select("appSearchSelector").addClass(this.attr.isTouchSearchClass) : this.select("appSearchSelector").removeClass(this.attr.isTouchSearchClass),
            this.on(document, "uiPerformSearch", this.handlePerformSearch),
            this.on(document, "uiAppSearchFocus uiShowSearchButtonClick", this.focusSearchInput),
            this.on(document, "dataSettings", this.handleDataSettings), this.trigger("uiNeedsSettings")
        }), this.handleDataSettings = function(t, e) {
            this.$input = "condensed" === e.navbarWidth ? this.select("searchPopoverInputSelector") : this.select("appSearchInputSelector")
        }, this.focusSearchInput = function() {
            this.$input.triggerHandler("focus"), this.$input.is(":focus") || this.$input.focus()
        }, this.handlePerformSearch = function(t, e) {
            t.target === document && _.defer(function() {
                this.trigger(this.$input, "uiAppSearchSubmit", e)
            }.bind(this))
        }
    };
    return t(e)
}), define("ui/with_compose_button", [], function() {
    return function() {
        this.defaultAttrs({
            showComposeButtonSelector: ".js-show-compose",
            hideComposeButtonSelector: ".js-hide-compose"
        }), this.after("initialize", function() {
            this.on("click", {
                showComposeButtonSelector: this.handleShowCompose,
                hideComposeButtonSelector: this.handleHideCompose
            }),
            this.on(document, "uiToggleDockedCompose", this.handleToggleDockedCompose)
        }), this.handleShowCompose = function() {
            this.trigger("uiComposeTweet"), TD.controller.stats.navbarComposeClick()
        }, this.handleHideCompose = function() {
            this.trigger("uiComposeClose")
        }, this.handleToggleDockedCompose = function(t, e) {
            e.opening ? (this.select("showComposeButtonSelector").addClass("is-hidden"), this.select("hideComposeButtonSelector").removeClass("is-hidden")) : (this.select("showComposeButtonSelector").removeClass("is-hidden"), this.select("hideComposeButtonSelector").addClass("is-hidden"))
        }
    }
}), define("ui/app_header", ["flight/lib/component", "ui/with_compose_button", "ui/with_nav_flyover"], function(t, e, i) {
    function s() {
        this.defaultAttrs({
            headerActionSelector: ".js-header-action"
        }), this.after("initialize", function() {
            this.on("click", this.handleClick), $(document).on("uiToggleNavbarWidth", this.toggleNavbarWidth.bind(this)), $(document).on("dataSettings", this.handleDataSettings.bind(this)), this.select("headerActionSelector").on("mouseover", this.handleListItemMouseover.bind(this)).on("mouseout", this.handleListItemMouseout.bind(this)), this.trigger("uiNeedsSettings")
        }), this.handleClick = function(t) {
            var e = $(t.target).closest(".js-header-action");
            switch (e.data("action") && t.preventDefault(), e.data("action")) {
                case "add-column":
                    TD.ui.openColumn.showOpenColumn(), TD.controller.stats.navbarAddColumnClick();
                    break;
                case "settings-menu":
                    t.stopPropagation(), new TD.components.TopbarMenu(e), TD.controller.stats.navbarSettingsClick();
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
                    this.trigger("uiShowSearchButtonClick"), e.tooltip("hide")
            }
            this.destroyFlyover()
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
        }
    }
    return t(s, e, i)
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
        var t, e, i = !1;
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
                h = function() {
                    r && o.removeClass(this.attr.isCondensingClass), t.toggleClass(this.attr.isCondensedClass, r), o.toggleClass(this.attr.isCondensedClass, r)
                }.bind(this);
            if (!this.isNavbarWidthSet || a > this.attr.maxColumnsForAnimation) h(), this.isNavbarWidthSet = !0;
            else {
                if (!r && !t.hasClass(this.attr.isCondensedClass) || r && t.hasClass(this.attr.isCondensedClass)) return;
                r ? (s = parseInt(n.css("min-width"), 10), o.addClass(this.attr.isCondensingClass)) : (o.removeClass(this.attr.isCondensedClass), s = n.outerWidth()), o.addClass(this.attr.scrollNoneClass), o.animate({
                    width: s
                }, {
                    duration: this.attr.navbarWidthChangeDuration,
                    complete: function() {
                        h(), o.removeClass(this.attr.scrollNoneClass)
                    }.bind(this),
                    step: function(t) {
                        e.css("left", t)
                    },
                    easing: "easeOutQuad"
                })
            }
        }, this.handleAnimateCompose = function(t, s) {
            s.noAnimate && e.css({
                "transition-duration": "0"
            }), e.one(TD.ui.main.TRANSITION_END_EVENTS, function() {
                i && e.css({
                    "margin-right": 245
                }), s.noAnimate && e.css({
                    "transition-duration": "0.2s"
                })
            }), s.opening && !i ? (i = !0, e.css({
                transform: "translateX(245px)"
            })) : s.opening || (e.css({
                transform: "translateX(0)",
                "margin-right": 0
            }), i = !1)
        }, this.handleDataSettings = function(t, e) {
            this.setTheme(e.theme), this.setNavbarWidth(e.navbarWidth)
        }, this.after("initialize", function() {
            t = this.select("jsAppSelector"), e = this.select("jsAppContentSelector"), this.isNavbarWidthSet = !1,
            this.on(document, "dataSettings", this.handleDataSettings),
            this.on(document, "uiToggleDockedCompose", this.handleAnimateCompose)
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
}), define("ui/compose/with_account_selector", ["flight/lib/compose", "ui/with_template", "util/keypress"], function(t, e, i) {
    function s() {
        t.mixin(this, [e]), this.defaultAttrs({
            accountListSelector: ".js-account-list",
            accountItemSelector: ".js-account-item",
            isSelectedClass: "is-selected",
            selectedItemSelector: ".js-account-item.is-selected"
        }), this.after("initialize", function() {
            this.on(document, "dataAccounts", this.handleAccountsDataForAccountSelector),
            this.on(document, "dataDefaultAccount", this.handleDefaultAccountForAccountSelector), this.trigger("uiNeedsAccounts"), this.trigger("uiNeedsDefaultAccount")
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
                        profileImageUrl: t.profileImageUrl,
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
            if (i.eventIsKey(t) && !i.isSpacebar(t)) return !1;
            var e = $(t.target).closest(this.attr.accountItemSelector);
            t.shiftKey && this.select("accountItemSelector").removeClass(this.attr.isSelectedClass), e.toggleClass(this.attr.isSelectedClass), TD.util.isTouchDevice() && TD.decider.get(TD.decider.TOUCHDECK_COMPOSE) && (this.select("accountItemSelector").tooltip("destroy"), e.tooltip({
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
    return s
}), define("ui/compose/with_send_button", ["ui/compose/with_character_limit", "ui/with_spinner_button", "flight/lib/compose", "util/keypress"], function(t, e, i, s) {
    function n() {
        i.mixin(this, [t, e]);
        var n = 1,
            o = 0;
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
            this.on("uiComposeCharCount", this.sendButtonHandleCharCount),
            this.on("uiSelectedAccounts", this.handleUiSelectedAccounts), this.attr.buttonErrorMessages = _.defaults({}, this.attr.buttonErrorMessages, {
                tooLong: TD.i("Your Tweet is too long"),
                noAccount: TD.i("You have to select at least one account to tweet from")
            })
        }), this.after("setupDOM", function() {
            this.$sendButton = this.select("sendButtonSelector"), this.$sendButton.addClass("is-disabled"), this.$sendButton.on("click keydown", this.sendButtonHandleClick.bind(this)), this.origTitle = this.$sendButton.attr("title"), this.$sendButton.removeAttr("title")
        }), this.sendButtonShowSending = function() {
            this.sendButtonSending = !0, this.select("composeSuccess").addClass("is-hidden"), this.$sendButton.addClass("text-hidden is-disabled"), this.spinnerButtonEnable(), this.$sendButton.tooltip("hide")
        }, this.sendButtonShowSuccess = function() {
            this.spinnerButtonDisable(), this.$sendButton.addClass("text-hidden is-disabled"), this.select("composeSuccess").removeClass("is-hidden")
        }, this.sendButtonShowText = function() {
            this.spinnerButtonDisable(), this.select("composeSuccess").addClass("is-hidden"), this.$sendButton.removeClass("text-hidden is-disabled"), this.sendButtonSending = !1
        }, this.sendButtonSetText = function(t, e) {
            var i, s, n, o = new Date;
            if (e) switch (s = o.toDateString() === e.toDateString(), n = s ? TD.util.prettyTimeOfDayString(e) : TD.util.prettyDateString(e), t) {
                case "tweet":
                case "reply":
                    i = s ? TD.i("Tweet at {{time}}", {
                        time: n
                    }) : TD.i("Tweet on {{date}}", {
                        date: n
                    });
                    break;
                case "message":
                    i = s ? TD.i("Send at {{time}}", {
                        time: n
                    }) : TD.i("Send on {{date}}", {
                        date: n
                    })
            } else i = this.sendButtonTranslatedText[t];
            this.$sendButton.text(i)
        }, this.sendButtonHandleCharCount = function(t, e) {
            t.stopPropagation(), o = e.charCount, this.sendButtonEnabledIfValid()
        }, this.handleUiSelectedAccounts = function(t, e) {
            t.stopPropagation(), n = e.accounts.length, this.sendButtonEnabledIfValid()
        }, this.sendButtonHandleClick = function(t) {
            (!s.eventIsKey(t) || s.isEnter(t) || s.isSpacebar(t)) && this.trigger("uiComposeSendTweet", {})
        }, this.sendButtonIsEnabled = function() {
            return !this.$sendButton.is(":disabled,.is-disabled")
        }, this.setButtonErrorTooltip = function() {
            var t = this.origTitle;
            0 === n ? t = this.attr.buttonErrorMessages.noAccount : this.isOverCharLimit(o) && (t = this.attr.buttonErrorMessages.tooLong), this.$sendButton.attr("data-original-title", t)
        }, this.hideButtonErrorTooltip = function() {}, this.sendButtonEnabledIfValid = function() {
            var t = n > 0 && this.isWithinCharLimit(o) && !this.sendButtonSending;
            this.setButtonErrorTooltip(), this.$sendButton.toggleClass("is-disabled", !t)
        }, this.sendButtonSetDisabled = function() {
            this.$sendButton.addClass("is-disabled")
        }
    }
    return n
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
}), define("ui/compose/with_send_tweet", ["flight/lib/compose", "data/with_bitly", "data/with_client"], function(t, e, i) {
    return function() {
        t.mixin(this, [e, i]);
        var s = [],
            n = null;
        this.after("initialize", function() {
            this.on(document, "dataTweetSent", this.handleDataTweetSent),
            this.on(document, "dataTweetError", this.handleDataTweetError),
            this.on(document, "dataScheduledTweetsSent", this.handleDataScheduledTweetsSent),
            this.on(document, "dataScheduledTweetsError", this.handleDataScheduledTweetsError)
        }), this.resetSendTweet = function() {
            s = [], n = null
        }, this.sendTweet = function(t) {
            this.trigger("uiComposeTweetSending"), this.resetSendTweet(), n = t, this.maybeShortenTextLinks(t.text, function(e) {
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
                tokenToDelete: t.scheduledId
            }) : e.forEach(function(t) {
                this.trigger("uiSendTweet", t)
            }, this)
        }, this.handleDataTweetSent = function(t, e) {
            var i;
            n && e.request.requestId === n.requestId && (i = n.from.indexOf(e.request.accountKey), i > -1 && n.from.splice(i, 1), 0 === n.from.length && (0 === s.length ? this.triggerTweetSuccess() : this.triggerTweetError()))
        }, this.handleDataScheduledTweetsSent = function(t, e) {
            n && e.request.requestId === n.requestId && this.triggerTweetSuccess()
        }, this.handleDataTweetError = function(t, e) {
            var i;
            n && e.request.requestId === n.requestId && (i = n.from.indexOf(e.request.accountKey), i > -1 && n.from.splice(i, 1), s.push(e), 0 === n.from.length && this.triggerTweetError())
        }, this.handleDataScheduledTweetsError = function(t, e) {
            var i, s, o;
            if (n && e.request.requestId === n.requestId) {
                if (e.response.humanReadableMessage) i = e.response.humanReadableMessage;
                else {
                    try {
                        s = JSON.parse(e.response.req.responseText)
                    } catch (r) {}
                    o = s && s.error ? s.error : e.response.req.status, i = TD.i("Scheduling failed. Please try again. ({{message}})", {
                        message: o
                    })
                }
                TD.controller.progressIndicator.addMessage(i), this.triggerTweetError()
            }
        }, this.showTweetErrors = function(t) {
            if (0 !== t.length) {
                var e = t.map(function(t) {
                    var e, i, s;
                    try {
                        e = JSON.parse(t.response.responseText).errors[0].message
                    } catch (n) {
                        e = TD.i("Unknown error")
                    }
                    switch (i = this.getAccountData(t.request.accountKey), s = i ? i.screenName : "unknown account", this.tweetType) {
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
            this.showTweetErrors(s), this.trigger("uiComposeTweetError", {
                errors: n.scheduledDate ? null : s
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
            this.on(document, "uiInlineComposeTweet", this.handleUiInlineComposeTweet),
            this.on(document, "uiDockedComposeTweet", this.closeInlineCompose),
            this.on(document, "uiComposeClose", this.closeInlineCompose),
            this.on(document, "uiReadStateChange", this.handleReadStateChange),
            this.on("uiComposeSendTweet", this.handleUiComposeSendTweet),
            this.on("uiComposeTweetSending", this.enterSendingState),
            this.on("uiComposeTweetSent", this.enterSuccessState),
            this.on("uiComposeTweetError", this.enterErrorState),
            this.on("uiComposeCharCount", _.throttle(this.handleTextChange, 1e3)),
            this.on(TD.ui.main.TRANSITION_END_EVENTS, {
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
            var n = this.composeTextCalculateRepliesAndMentions([t.inReplyTo.user.screenName], t.mentions, s.screenName),
                o = this.getDraftText();
            o && o !== n.totalString ? (this.composeTextSetText(o), this.composeTextSetCaretToEnd()) : (this.composeTextSetText(n.totalString), this.composeTextSetSelection(n.startIndex, n.endIndex)), _.defer(function() {
                i.removeClass("is-inline-inactive"), Modernizr.csstransitions || this.handleAnimationEnd({
                    target: i.get(0)
                })
            }.bind(this)), i.on("click", function(t) {
                t.stopPropagation()
            });
            var r = i.parents(".js-column");
            r.hasClass("js-column-state-detail-view") || TD.ui.columns.lockColumnScrolling(r.attr("data-column"))
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
                    n = e.parent(".js-stream-item-content");
                TD.ui.columns.unlockColumnScrolling(s), n.find(this.attr.tweetActionsSelector).removeClass("is-visible"), n.find(this.attr.replyActionSelector).removeClass("is-selected"), n.find(this.attr.detailViewInlineSelector).removeClass("is-hidden"), e.remove()
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
        }, this.handleReadStateChange = function(t, i) {
            if (e) {
                var s = e.parents(".js-column").attr("data-column");
                i.read && i.columnKey === s && TD.ui.columns.unlockColumnScrolling(s)
            }
        }
    }
    var i = t("flight/lib/component"),
        s = t("ui/compose/with_account_selector"),
        n = t("ui/compose/with_character_count"),
        o = t("data/with_client"),
        r = t("ui/with_column_selectors"),
        a = t("ui/compose/with_compose_text"),
        h = t("ui/with_focus"),
        c = t("ui/compose/with_send_button"),
        l = t("ui/compose/with_send_tweet"),
        u = t("ui/with_template");
    return i(e, s, n, o, r, a, h, c, l, u)
}), define("ui/compose/compose_controller", ["require", "flight/lib/component", "ui/compose/inline_compose"], function(t) {
    function e() {
        var t, e, i;
        this.after("initialize", function() {
            this.on(document, "uiToggleDockedCompose", this.handleAnimateDockedCompose),
            this.on(document, "uiComposeTweet", this.handleUiComposeTweet),
            this.on(document, "uiToggleDockedCompose", this.handleToggleDocked),
            this.on(document, "uiToggleInlineCompose", this.handleToggleInline),
            this.on("uiInlineComposeState", function(t, e) {
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
            t !== !1 && (this.$addImageButton.removeClass("is-disabled").attr("tabindex", "0"),
                this.on(this.$addImageButton, "click", this.handleAddImageButtonClick), t = !1)
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
        },
        this.onLoseClick = function(t) {
            e.push(t)
        }, this.runReceiveHandlers = function() {
            t.forEach(function(t) {
                t.bind(this)()
            }.bind(this))
        }, this.runLoseHandlers = function(t) {
            this.targetWithinComponent(t.target) || e.forEach(function(t) {
                t.bind(this)()
            }.bind(this))
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
            this.$messageButton = this.select("messageButtonSelector"), this.$tweetButton = this.select("tweetButtonSelector"),
            this.on(this.$messageButton, "click", function() {
                this.trigger(document, "uiComposeTweet", {
                    type: "message"
                })
            }),
            this.on(this.$tweetButton, "click", function() {
                this.trigger(document, "uiComposeTweet", {
                    type: "tweet"
                })
            })
        }), this.setMessageToggleButton = function(t) {
            "message" === t ? (this.$messageButton.addClass("is-hidden"), this.$tweetButton.removeClass("is-hidden")) : (this.$messageButton.removeClass("is-hidden"), this.$tweetButton.addClass("is-hidden"))
        }
    }
}), define("ui/compose/with_in_reply_to", ["flight/lib/compose", "ui/with_template"], function(t, e) {
    return function() {
        t.mixin(this, [e]), this.defaultAttrs({
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
    function t() {
        this.defaultAttrs({
            mediaBarContainerSelector: ".js-media-added",
            mediaBarRemoveSelector: ".js-media-bar-remove",
            mediaBarSelector: ".compose-media-bar",
            maxImageHeight: 310
        }), this.after("initialize", function() {
            this.$mediaBarContainer = this.select("mediaBarContainerSelector"), this.file = null,
            this.on("click", {
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
            this.$mediaBarContainer.html(e), e[0].complete ? this.setImageHeight(e) : e.load(function() {
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
    return t
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
            }.bind(this)),
            this.on("click", {
                clearButtonSelector: this.handleClearAction
            }),
            this.on("change", {
                textInputSelector: this.handleKeyPressReceived
            })
        })
    };
    return t
}), define("ui/compose/with_message_recipient", ["flight/lib/compose", "ui/with_clear_input", "ui/with_focusable_field"], function(t, e, i) {
    function s() {
        t.mixin(this, [i, e]), this.defaultAttrs({
            composeMessageRecipientSelector: ".js-compose-message-recipient",
            composeMessageRecipientInputSelector: ".js-compose-message-account",
            composeMessageRecipientAvatarSelector: ".js-compose-message-avatar",
            messageRecipientCheckPeriod: 100
        }), this.after("initialize", function() {
            this.messageRecipientChangeInterval = null, this.$messageRecipient = this.select("composeMessageRecipientSelector"), this.$messageRecipientInput = this.select("composeMessageRecipientInputSelector"), this.$messageRecipientAvatar = this.select("composeMessageRecipientAvatarSelector"), this.messageAutoComplete = new TD.components.Autocomplete(this.$messageRecipientInput, {
                dmMode: !0
            }),
            this.on(this.messageAutoComplete.$node, "td-autocomplete-select", function(t, e, i) {
                this.setMessageRecipient({
                    screenName: e,
                    avatar: i
                })
            }),
            this.on(this.$messageRecipientInput, "focus", this.handleMessageRecipientFocus),
            this.on(this.$messageRecipientInput, "blur", this.handleMessageRecipientBlur),
            this.on(document, "dataUserLookup", this.handleMessageRecipientUserLookup)
        }), this.after("teardown", function() {
            this.messageAutoComplete.destroy()
        }), this.setMessageRecipient = function(t) {
            this.$messageRecipient.removeClass("is-hidden"), t && t.screenName ? (this.$messageRecipientInput.val(t.screenName), this.$messageRecipientAvatar.attr("src", t.avatar), this.$messageRecipientAvatar.data("screenName", t.screenName), this.checkMessageRecipientAvatarState(), this.trigger("uiMessageRecipientSet"), t.avatar || this.trigger("uiNeedsUserLookup", {
                screenName: t.screenName
            })) : (this.resetMessageRecipient(), (!TD.util.isTouchDevice() || !TD.decider.get(TD.decider.TOUCHDECK_COMPOSE)) && this.messageRecipientSetFocus())
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
            e && e.toLowerCase() !== i.toLowerCase() && this.trigger("uiNeedsUserLookup", {
                screenName: e
            }), this.trigger(this.$messageRecipient, "uiTextfieldInputBlur")
        }, this.handleMessageRecipientUserLookup = function(t, e) {
            var i = this.getMessageRecipient(),
                s = i ? i.screenName : "";
            e.request.screenName.toLowerCase() === s.toLocaleLowerCase() && (this.$messageRecipientInput.val(e.result.screenName), this.$messageRecipientAvatar.attr("src", e.result.miniProfileImageURL()), this.$messageRecipientAvatar.data("screenName", e.result.screenName), this.checkMessageRecipientAvatarState())
        }
    }
    return s
}), define("ui/compose/with_scheduler", [], function() {
    return function() {
        var t = null,
            e = !1;
        this.defaultAttrs({
            scheduleButtonSelector: ".js-schedule-button",
            scheduleButtonLabelSelector: ".js-schedule-button-label",
            scheduleDatePickerHolderSelector: ".js-schedule-datepicker-holder"
        }), this.after("initialize", function() {
            this.$scheduleButton = this.select("scheduleButtonSelector"), this.$scheduleButtonLabel = this.select("scheduleButtonLabelSelector"), this.$scheduleDatePickerHolder = this.select("scheduleDatePickerHolderSelector"), this.scheduleButtonTitleTweet = TD.i("Schedule Tweet"), this.scheduleButtonTitleMessage = TD.i("Schedule Message")
        }), this.after("teardown", function() {
            this.scheduleDatePicker && ($.unsubscribe(this.dateChangedSubscription), $.unsubscribe(this.dateRemovedSubscription))
        }), this.disableScheduleButton = function() {
            t !== !0 && (this.$scheduleButton.addClass("is-disabled").attr("tabindex", "-1").attr("data-original-title", TD.i("Tweets with images cannot be scheduled")), this.off(this.$scheduleButton, "click"), t = !0)
        }, this.enableScheduleButton = function() {
            t !== !1 && (this.$scheduleButton.removeClass("is-disabled").attr("tabindex", "0").removeAttr("data-original-title"),
                this.on(this.$scheduleButton, "click", this.handleScheduleButtonClick), t = !1)
        }, this.handleScheduleButtonClick = function() {
            this.initScheduleDatePicker()
        }, this.resetScheduler = function() {
            this.scheduleDatePicker && this.closeScheduleDatePicker(), this.scheduledDate = null
        }, this.openScheduleDatePicker = function() {
            e || ($("body").on("click.scheduleclicktrap", function(t) {
                var e = $(t.target);
                0 === e.closest(this.$scheduleDatePickerHolder).length && 0 === e.closest(this.$scheduleButton).length && this.closeScheduleDatePicker()
            }.bind(this)), this.scheduleDatePicker.$node.show(), e = !0)
        }, this.closeScheduleDatePicker = function() {
            e && ($("body").off("click.scheduleclicktrap"), this.scheduleDatePicker.$node.hide(), e = !1)
        }, this.initScheduleDatePicker = function() {
            var t = function() {
                this.closeScheduleDatePicker(), this.scheduledDate = null, this.trigger("uiComposeScheduleDate", {
                    date: null
                })
            };
            this.scheduleDatePicker ? (this.scheduleDatePicker.$node.is(":hidden") ? this.openScheduleDatePicker() : this.closeScheduleDatePicker(), this.scheduledDate || this.scheduleDatePicker.setDate(new Date)) : (this.dateChangedSubscription = $.subscribe("/change/date", this.setScheduledDate.bind(this)), this.dateRemovedSubscription = $.subscribe("/removed/date", t.bind(this)), this.scheduleDatePicker = new TD.components.ScheduledDatePicker(this.$scheduleDatePickerHolder), this.openScheduleDatePicker())
        }, this.setScheduledDate = function(t) {
            var e;
            t ? (e = TD.util.prettyTimeString(t), this.$scheduleButtonLabel.text(e)) : this.closeScheduleDatePicker(), this.scheduledDate = t, this.trigger("uiComposeScheduleDate", {
                date: t
            })
        }, this.getScheduledDate = function() {
            return this.scheduledDate
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
            t = this.select("checkboxSelector"),
            this.on(t, "change", function() {
                t.prop("checked") ? this.trigger("uiChangeComposeStayOpen", {
                    composeStayOpen: !0
                }) : this.trigger("uiChangeComposeStayOpen", {
                    composeStayOpen: !1
                })
            }),
            this.on(document, "dataSettings", this.handleSettings)
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
}), define("ui/compose/docked_compose", ["require", "flight/lib/component", "util/tweet_utils", "ui/compose/with_account_selector", "ui/compose/with_add_image", "ui/compose/with_character_count", "ui/with_click_trap", "data/with_client", "ui/compose/with_compose_text", "ui/compose/with_direct_message_button", "ui/with_focus", "ui/compose/with_in_reply_to", "ui/compose/with_media_bar", "ui/compose/with_message_recipient", "ui/compose/with_scheduler", "ui/compose/with_send_button", "ui/compose/with_send_tweet", "ui/compose/with_stay_open", "ui/compose/with_title"], function(t) {
    function e() {
        this.defaultAttrs({
            stayOpenInputSelector: ".js-compose-stay-open",
            composeScrollerSelector: ".js-compose-scroller",
            withTouchComposeClass: "is-touch-compose",
            tcoLength: 22,
            panelCloseDelay: 500,
            releaseFocusDelay: 3e3,
            defaultTextComposeHeight: 130,
            increasedTextComposeHeight: 160,
            minimumComposeHeight: 180
        }), this.after("initialize", function() {
            this.setupDOM(), this.tweetType = "tweet", this.panelWasClosed = !0, this.releaseFocusTimer = null, this.composeTextIsExpanded = !1,
            this.on(document, "uiDockedComposeTweet", this.handleUiComposeTweet),
            this.on(document, "uiComposeClose", this.handleUiComposeClose),
            this.on(document, "uiFilesAdded", this.handleUiFilesAdded),
            this.on("uiComposeSendTweet", this.handleUiComposeSendTweet),
            this.on("uiComposeTweetSending", this.enterSendingState),
            this.on("uiComposeTweetSent", this.enterSuccessState),
            this.on("uiComposeTweetError", this.enterErrorState),
            this.on("uiComposeScheduleDate", this.handleUiComposeScheduleDate), this.before("charCountHandleCharCount", function(t, e) {
                var i = this.getFile();
                i && (e.charCount = e.charCount + this.attr.tcoLength + 1)
            }), this.after("addFile", function() {
                this.composeTextHandleChange(), this.disableScheduleButton(), this.inferAddImageButtonState(), this.handleComposeResize(), this.composeTextSetCaretToEnd()
            }), this.after("removeFile", function() {
                this.composeTextHandleChange(), this.enableScheduleButton(), this.inferAddImageButtonState(), this.handleComposeResize()
            }), this.after("addInReplyTo", function() {
                this.handleComposeResize()
            }), this.after("handleAccountsDataForAccountSelector", function() {
                this.handleComposeResize()
            }), this.after("openScheduleDatePicker", function() {
                this.handleComposeResize()
            }), this.after("closeScheduleDatePicker", function() {
                this.handleComposeResize()
            }),
            this.onReceiveClick(function() {
                this.hasFocus || this.focusRequest()
            }),
            this.onLoseClick(function() {
                this.hasFocus && this.focusRelease()
            }),
            this.on(document, "uiMainWindowResized", this.handleComposeResize),
            this.on("uiComposeImageAdded", this.handleComposeResize),
            this.on("uiComposeTextBlur", this.handleComposeTextBlur),
            this.on("uiComposeCharCount", this.handleComposeCharCount), this.handleComposeResize()
        }), this.setupDOM = function() {
            this.$composeScroller = this.select("composeScrollerSelector"), TD.util.isTouchDevice() && TD.decider.get(TD.decider.TOUCHDECK_COMPOSE) && this.$node.addClass(this.attr.withTouchComposeClass)
        }, this.handleUiComposeTweet = function(t, e) {
            e = e || {}, this.tweetType = e.type || "tweet", this.resetComposePanelState(e), $(document).trigger("uiCloseModal"), e.noFocus || this.focusRequest(), this.enableClickTrap(), this.trigger("uiToggleDockedCompose", {
                opening: !0,
                noAnimate: e.noAnimate
            }), this.panelWasClosed = !1
        }, this.handleUiComposeClose = function(t, e) {
            e = e || {}, e.keyboardShortcut ? this.hasFocus && (this.composeStayOpen ? this.focusRelease() : this.hideComposePanel()) : this.hideComposePanel(), clearTimeout(this.releaseFocusTimer), this.releaseFocusTimer = null
        }, this.handleUiComposeSendTweet = function(t, e) {
            if (t.stopPropagation(), (!t.keyboardShortcut || this.hasFocus) && this.sendButtonIsEnabled()) {
                var i = _.uniqueId("sendTweet"),
                    s = $.extend({}, e);
                s.requestId = i, s.text = this.composeTextGetText(), s.inReplyToStatusId = this.getInReplyToId(), s.file = this.getFile(), s.messageRecipient = this.getMessageRecipient(), s.scheduledDate = this.getScheduledDate(), s.scheduledId = this.getScheduledId(), s.from = this.getSelectedAccounts(), s.type = this.tweetType, this.sendTweet(s)
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
            this.composeTextSetText(""), this.removeFile(), this.resetScheduler(), this.setScheduledId(null)
        }, this.resetComposePanelState = function(t) {
            var e, i, n, o, r = {}, a = TD.config.force_dm_photos || TD.decider.get(TD.decider.DM_PHOTO_SENDING);
            t = t || {};
            var h = void 0 !== t.text;
            switch (h && this.destructivePanelReset(), this.enablePanelInputs(), this.getFile() || this.enableScheduleButton(), t.schedule && (this.setScheduledDate(t.schedule.time), this.setScheduledId(t.schedule.id), this.setSelectedAccounts(t.from)), this.setTitle(this.tweetType, this.getScheduledId()), this.sendButtonSetText(this.tweetType, this.getScheduledDate()), this.setScheduleButtonTitle(this.tweetType), this.setMessageToggleButton(this.tweetType), this.inferAddImageButtonState(), this.tweetType) {
                case "tweet":
                    this.removeInReplyTo(), void 0 !== t.text ? this.composeTextSetText(t.text) : (e = this.getMessageRecipient(), e && this.composeTextPrependText(s.atMentionify(e.screenName))), void 0 !== t.appendText && this.composeTextAppendText(t.appendText), this.hideMessageRecipient(), (t.from && t.from.length > 0 && this.panelWasClosed || t.isEditAndRetweet) && this.setSelectedAccounts(t.from), t.noFocus || (!TD.util.isiOSDevice() || !TD.decider.get(TD.decider.TOUCHDECK_COMPOSE)) && this.composeTextSetCaretToEnd();
                    break;
                case "reply":
                    (!this.getInReplyToId() || this.composeTextIsEmpty()) && (this.addInReplyTo(t.inReplyTo), this.panelWasClosed && this.setSelectedAccounts(t.from)), n = this.getSelectedAccounts(), 1 === n.length && (o = this.getAccountData(n[0]).screenName), void 0 !== t.text ? (this.composeTextSetText(t.text), this.composeTextSetCaretToEnd()) : this.composeTextSetRepliesAndMentions([t.inReplyTo.user.screenName], t.mentions, o), this.hideMessageRecipient();
                    break;
                case "message":
                    if (void 0 !== t.text ? this.composeTextSetText(t.text) : i = s.extractMentions(this.composeTextGetText()), t.messageRecipient) r = t.messageRecipient;
                    else if (t.to && t.to.screenName) r = {
                        screenName: t.to.screenName
                    };
                    else if (i && i.length) {
                        r = {
                            screenName: i[0]
                        };
                        var c = s.removeFirstMention(this.composeTextGetText());
                        this.composeTextSetText(c)
                    } else r = this.getMessageRecipient();
                    this.setMessageRecipient(r), this.removeInReplyTo(), a || this.removeFile(), t.from && t.from.length > 0 && this.setSelectedAccounts(t.from), TD.util.isiOSDevice() && TD.decider.get(TD.decider.TOUCHDECK_COMPOSE) || (r && r.screenName ? this.composeTextSetCaretToEnd() : this.messageRecipientSetFocus())
            }
            this.handleComposeResize()
        }, this.handleUiFilesAdded = function(t, e) {
            for (var i = 0; i < e.files.length; i++) this.addFile(e.files[i]);
            this.trigger("uiDockedComposeTweet", {
                type: this.tweetType
            })
        }, this.handleUiComposeScheduleDate = function() {
            this.sendButtonSetText(this.tweetType, this.getScheduledDate()), this.setScheduleButtonTitle(this.tweetType), this.inferAddImageButtonState()
        }, this.inferAddImageButtonState = function() {
            var t, e = TD.config.force_dm_photos || TD.decider.get(TD.decider.DM_PHOTO_SENDING),
                i = (e || "message" !== this.tweetType) && !this.getScheduledDate() && !this.getFile();
            i ? (this.enableAddImageButton(), this.addImageButtonRemoveTooltip()) : (this.getScheduledDate() ? t = TD.i("Scheduled Tweets cannot contain images") : this.getFile() ? t = TD.i("You cannot add more than one image") : "message" === this.tweetType && (t = TD.i("Direct messages cannot contain images")), this.disableAddImageButton(), this.addImageButtonAddTooltip(t))
        }, this.handleComposeResize = function() {
            this.$composeScroller.antiscroll()
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
        }
    }
    var i = t("flight/lib/component"),
        s = t("util/tweet_utils"),
        n = t("ui/compose/with_account_selector"),
        o = t("ui/compose/with_add_image"),
        r = t("ui/compose/with_character_count"),
        a = t("ui/with_click_trap"),
        h = t("data/with_client"),
        c = t("ui/compose/with_compose_text"),
        l = t("ui/compose/with_direct_message_button"),
        u = t("ui/with_focus"),
        d = t("ui/compose/with_in_reply_to"),
        m = t("ui/compose/with_media_bar"),
        p = t("ui/compose/with_message_recipient"),
        g = t("ui/compose/with_scheduler"),
        f = t("ui/compose/with_send_button"),
        C = t("ui/compose/with_send_tweet"),
        T = t("ui/compose/with_stay_open"),
        S = t("ui/compose/with_title");
    return i(e, n, o, r, a, h, c, l, u, d, m, p, g, f, C, T, S)
}), define("ui/drag_drop/drag_drop_controller", ["require", "flight/lib/component", "ui/drag_drop/with_drag_drop"], function(t) {
    function e() {
        this.after("initialize", function() {
            this.on("dragstart", function(t) {
                this.trigger(document, "uiDragStart", this.extractDataFromEvent(t))
            }),
            this.on("dragend", function(t) {
                this.trigger(document, "uiDragEnd", this.extractDataFromEvent(t))
            })
        })
    }
    var i = t("flight/lib/component"),
        s = t("ui/drag_drop/with_drag_drop");
    return i(e, s)
}), define("ui/features/custom_timelines", ["flight/lib/component"], function(t) {
    function e() {
        this.defaultAttrs({
            disabledCSS: '<style type="text/css">.feature-customtimelines { display: none !important; }.prf .lst-profile li { width: 20% !important; }</style> '
        }), this.after("initialize", function() {
            this.enabled = void 0, this.defaultAccount = null, this.whitelist = {}, this.$disabledCSS = $(this.attr.disabledCSS),
            this.on(document, "uiNeedsFeatureCustomTimelines", this.triggerState),
            this.on(document, "dataDefaultAccount", this.handleDefaultAccount),
            this.on(document, "dataCustomTimelineWhitelistItem", this.handleWhitelistValue),
            this.on(document, "dataDeciderUpdated", this.updateState), this.trigger("uiNeedsDefaultAccount"),
            this.on(document, "uiFeatureCustomTimelines",
                this.onFeatureChange)
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
        },
        this.onFeatureChange = function(t, e) {
            TD.sync.util.stateLog("Custom timelines state changed to " + (e.enabled ? "enabled" : "disabled"))
        }
    }
    return t(e)
}), define("tracking/column_options_scribe", ["flight/lib/component"], function(t) {
    var e = function() {
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
            this.on(document, "uiClearColumnAction", this.trackClear),
            this.on(document, "uiMoveColumnAction", this.trackMoveColumn),
            this.on(document, "uiEmbedTimelineAction", this.trackEmbedTimeline),
            this.on(document, "uiActionFilterError", this.trackActionFilterError)
        })
    };
    return t(e)
}), define("tracking/compose_scribe", ["flight/lib/component", "data/with_client"], function(t, e) {
    function i() {
        this.after("initialize", function() {
            this.on(document, "dataTweetSent", this.handleTweetSent),
            this.on(document, "uiRemoveInReplyTo", this.handleClearReply),
            this.on(document, "uiComposeStackReply", this.handleStackReply),
            this.on(document, "uiDockedComposeTweet", this.handleDockedTweet)
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
        }, this.handleClearReply = function() {
            TD.controller.stats.composeClearReply()
        }, this.handleStackReply = function() {
            TD.controller.stats.composeStackReply()
        }, this.handleDockedTweet = function(t, e) {
            e.popFromInline && TD.controller.stats.composePopFromInline()
        }
    }
    return t(i, e)
}), define("tracking/custom_timeline_scribe", ["flight/lib/component"], function(t) {
    function e() {
        this.after("initialize", function() {
            this.on(document, "dataCustomTimelineCreateSuccess", this.handleTimelineCreated),
            this.on(document, "dataCustomTimelineUpdateSuccess", this.handleTimelineUpdated),
            this.on(document, "dataCustomTimelineDeleteSuccess", this.handleTimelineDeleted),
            this.on(document, "dataAddTweetToCustomTimelineSuccess", this.handleTweetAdded),
            this.on(document, "dataRemoveTweetFromCustomTimelineSuccess", this.handleTweetRemoved)
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
}), define("tracking/message_banner_scribe", ["flight/lib/component"], function(t) {
    var e = function() {
        this.trackImpression = function(t, e) {
            TD.controller.stats.messageBannerImpression(e.id)
        }, this.trackDismiss = function(t, e) {
            TD.controller.stats.messageBannerDismiss(e.id)
        }, this.trackAction = function(t, e) {
            TD.controller.stats.messageBannerClick(e.messageId, e.actionId)
        }, this.after("initialize", function() {
            this.on(document, "uiShowMessageBanner", this.trackImpression),
            this.on(document, "uiDismissMessageAction", this.trackDismiss),
            this.on(document, "uiClickMessageButtonAction", this.trackAction)
        })
    };
    return t(e)
}), define("tracking/embed_tweet_dialog_scribe", ["flight/lib/component"], function(t) {
    var e = function() {
        this.trackOpen = function(t, e) {
            TD.controller.stats.embedTweetDialogOpen(e.tweet.id)
        }, this.after("initialize", function() {
            this.on(document, "uiShowEmbedTweet", this.trackOpen)
        })
    };
    return t(e)
}), define("tracking/typeahead_scribe", ["flight/lib/component"], function(t) {
    var e = function() {
        this.trackInvocation = function() {
            TD.controller.stats.typeaheadInvoked()
        }, this.trackSelection = function(t, e) {
            var i = e.input.length;
            "recent-search" === e.searchType ? TD.controller.stats.typeaheadRecentItemSelected(i, e.searchType, e.index) : TD.controller.stats.typeaheadItemSelected(i, e.searchType, e.index)
        }, this.after("initialize", function() {
            this.on(document, "uiTypeaheadDropdownInvoked", this.trackInvocation),
            this.on(document, "uiTypeaheadItemSelected", this.trackSelection)
        })
    };
    return t(e)
}), define("tracking/social_proof_for_tweet_scribe", ["flight/lib/component"], function(t) {
    var e = function() {
        this.trackViews = function(t, e) {
            TD.controller.stats.viewedTweetSocialProof(e.type)
        }, this.after("initialize", function() {
            this.on(document, "uiShowSocialProof", this.trackViews)
        })
    };
    return t(e)
}), define("tracking/report_tweet_scribe", ["flight/lib/component"], function(t) {
    function e() {
        this.after("initialize", function() {
            this.on(document, "uiShowReportTweetOptions", function(t, e) {
                e.isMessage || TD.controller.stats.reportUser("impression")
            }),
            this.on(document, "uiShowReportTweetCancel", function() {
                TD.controller.stats.reportUser("cancel")
            }),
            this.on(document, "uiReportSpamAction", function() {
                TD.controller.stats.reportUser("report_as_spam", "spam")
            }),
            this.on(document, "uiReportCompromisedAction", function(t, e) {
                e && e.block ? TD.controller.stats.reportUser("block", "compromised") : TD.controller.stats.reportUser("report_as_spam", "compromised")
            }),
            this.on(document, "uiReportAbusiveAction", function(t, e) {
                TD.controller.stats.reportUserAbusive("impression"), e && e.block ? TD.controller.stats.reportUser("block", "abusive") : TD.controller.stats.reportUser("report_as_spam", "abusive")
            }),
            this.on(document, "uiReportAbusiveOption", function(t, e) {
                TD.controller.stats.reportUserAbusive("click", e.option)
            })
        })
    }
    return t(e)
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
}), define("page/default", ["flight/lib/component", "data/accounts", "data/column_manager", "data/embed_timeline", "data/embed_tweet", "data/message_banner", "data/preferred_account", "data/relationship", "data/twitter_user", "data/user_actions", "data/settings", "data/stream_counter", "data/user_search", "data/storage", "data/recent_searches", "data/typeahead", "data/user_profile_social_proof", "data/twitter_users", "data/lists", "data/account", "data/tweet", "data/tweetdeck_api", "data/touch_controller", "data/custom_timelines", "data/secure_image", "data/dm_report", "ui/keyboard_shortcuts", "ui/message_banner", "ui/app_search", "ui/search_input", "ui/column_controller", "ui/grid", "ui/focus_controller", "ui/confirmation_dialog_controller", "ui/with_dialog_manager", "ui/message_banner_container", "ui/image_upload", "ui/login/twitter_account_login_form", "ui/login/tweetdeck_account_login_form", "ui/login/sole_user_dialog", "ui/column_navigation", "ui/search/search_in_popover", "ui/typeahead/typeahead_dropdown", "ui/search/search_results", "ui/search/search_router", "ui/app_header", "ui/default_page_layout", "ui/compose/compose_controller", "ui/compose/docked_compose", "ui/drag_drop/drag_drop_controller", "ui/features/custom_timelines", "tracking/column_options_scribe", "tracking/compose_scribe", "tracking/custom_timeline_scribe", "tracking/message_banner_scribe", "tracking/embed_tweet_dialog_scribe", "tracking/typeahead_scribe", "tracking/social_proof_for_tweet_scribe", "tracking/report_tweet_scribe", "tracking/report_message_scribe"], function(t, e, i, s, n, o, r, a, h, c, l, u, d, m, p, g, f, C, T, S, w, v, y, b, D, _, I, A, F, R, E, k, x, M, U, P, O, L, B, N, j, H, q, z, K, W, V, G, Q, Y, X, Z, J, te, ee, ie, se, ne, oe, re) {
    function ae() {
        this.defaultAttrs({
            modal: "#open-modal",
            appHeader: ".js-app-header",
            searchResults: ".js-search-form",
            message: ".js-message-banner",
            appSearchSourceId: "appSearch",
            searchPopoverSourceId: "searchPopover",
            isHiddenClass: "is-hidden",
            gridFocusId: "grid_focus"
        }), this.handlePreferredAccount = function(t, e) {
            e && e.account && (this.preferredAccount = e.account)
        }, this.initSearchInPopover = function() {
            H.attachTo(".js-search-in-popover", {
                popoverPosition: "rt",
                closeModals: !0,
                appSearchSourceId: this.attr.appSearchSourceId,
                searchPopoverSourceId: this.attr.searchPopoverSourceId,
                isHiddenClass: this.attr.isHiddenClass
            }), F.attachTo(".js-search-in-popover", {
                sourceId: this.attr.searchPopoverSourceId
            }), q.attachTo(".js-search-in-popover"), z.attachTo(".js-search-in-popover")
        }, this.initUI = function() {
            this.$node.find(".js-app").removeClass(this.attr.isHiddenClass), $("body", "html").removeClass("scroll-v"), X.attachTo(this.$node), V.attachTo(this.$node), x.attachTo(this.$node), Y.attachTo(this.$node), A.attachTo(this.select("message")), E.attachTo(this.$node, {
                focusId: this.attr.gridFocusId
            }), k.attachTo(this.$node, {
                focusId: this.attr.gridFocusId
            }), O.attachTo("#compose-modal"), W.attachTo(".js-app-header"), G.attachTo(".js-app"), Q.attachTo(".js-new-compose"), j.attachTo("#column-navigator"), F.attachTo(".js-search-form", {
                sourceId: this.attr.appSearchSourceId
            }), this.initSearchInPopover(), K.attachTo(this.$node), I.attachTo(this.$node)
        }, this.after("initialize", function() {
            var t = TD.config.twogin && "tweetdeck" !== TD.storage.storeUtils.getCurrentAuthType();
            m.attachTo(this.$node), p.attachTo(this.$node), l.attachTo(this.$node), e.attachTo(this.$node), i.attachTo(this.$node), t ? (L.attachTo(".js-app-loading"), N.attachTo(".js-app-loading")) : B.attachTo(".js-app-loading"), o.attachTo(this.$node), r.attachTo(this.$node), a.attachTo(this.$node), h.attachTo(this.$node), c.attachTo(this.$node), u.attachTo(this.$node), n.attachTo(this.$node), s.attachTo(this.$node), d.attachTo(this.$node), g.attachTo(this.$node), f.attachTo(this.$node), C.attachTo(this.$node), M.attachTo(this.$node), T.attachTo(this.$node), P.attachTo(this.$node), S.attachTo(this.$node), w.attachTo(this.$node), v.attachTo(this.$node, {
                apiRoot: TD.config.api_root
            }), y.attachTo(this.$node), b.attachTo(this.$node), D.attachTo(this.$node), _.attachTo(this.$node), Z.attachTo(this.$node), J.attachTo(this.$node), te.attachTo(this.$node), ee.attachTo(this.$node), ie.attachTo(this.$node), se.attachTo(this.$node), ne.attachTo(this.$node), oe.attachTo(this.$node), re.attachTo(this.$node),
            this.on(document, "TD.ready", this.initUI), this.trigger(document, "uiNeedsPreferredAccount"),
            this.on(document, "dataPreferredAccount", this.handlePreferredAccount)
        })
    }
    return t(ae, U)
}), define("td/lib/require-domready", [], function() {
    function t(t) {
        var e;
        for (e = 0; e < t.length; e += 1) t[e](c)
    }

    function e() {
        var e = l;
        h && e.length && (l = [], t(e))
    }

    function i() {
        h || (h = !0, r && clearInterval(r), e())
    }

    function s(t) {
        return h ? t(c) : l.push(t), s
    }
    var n, o, r, a = "undefined" != typeof window && window.document,
        h = !a,
        c = a ? document : null,
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