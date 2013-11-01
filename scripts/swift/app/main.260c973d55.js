define("flight/lib/utils", [], function() {
    var e = [],
        t = 100,
        i = {
            isDomObj: function(e) {
                return !!e.nodeType || e === window
            },
            toArray: function(t, i) {
                return e.slice.call(t, i)
            },
            merge: function() {
                for (var e = arguments.length, t = 0, i = Array(e + 1); e > t; t++) i[t + 1] = arguments[t];
                return 0 === e ? {} : (i[0] = {}, i[i.length - 1] === !0 && (i.pop(), i.unshift(!0)), $.extend.apply(void 0, i))
            },
            push: function(e, t, i) {
                return e && Object.keys(t || {}).forEach(function(s) {
                    if (e[s] && i) throw Error("utils.push attempted to overwrite '" + s + "' while running in protected mode");
                    "object" == typeof e[s] && "object" == typeof t[s] ? this.push(e[s], t[s]) : e[s] = t[s]
                }, this), e
            },
            isEnumerable: function(e, t) {
                return Object.keys(e).indexOf(t) > -1
            },
            compose: function() {
                var e = arguments;
                return function() {
                    for (var t = arguments, i = e.length - 1; i >= 0; i--) t = [e[i].apply(this, t)];
                    return t[0]
                }
            },
            uniqueArray: function(e) {
                for (var t = {}, i = [], s = 0, n = e.length; n > s; ++s) t.hasOwnProperty(e[s]) || (i.push(e[s]), t[e[s]] = 1);
                return i
            },
            debounce: function(e, i, s) {
                "number" != typeof i && (i = t);
                var n, r;
                return function() {
                    var t = this,
                        o = arguments,
                        a = function() {
                            n = null, s || (r = e.apply(t, o))
                        }, c = s && !n;
                    return clearTimeout(n), n = setTimeout(a, i), c && (r = e.apply(t, o)), r
                }
            },
            throttle: function(e, i) {
                "number" != typeof i && (i = t);
                var s, n, r, o, a, c, l = this.debounce(function() {
                        a = o = !1
                    }, i);
                return function() {
                    s = this, n = arguments;
                    var t = function() {
                        r = null, a && (c = e.apply(s, n)), l()
                    };
                    return r || (r = setTimeout(t, i)), o ? a = !0 : (o = !0, c = e.apply(s, n)), l(), c
                }
            },
            countThen: function(e, t) {
                return function() {
                    return --e ? void 0 : t.apply(this, arguments)
                }
            },
            delegate: function(e) {
                return function(t, i) {
                    var s, n = $(t.target);
                    Object.keys(e).forEach(function(r) {
                        return (s = n.closest(r)).length ? (i = i || {}, i.el = s[0], e[r].apply(this, [t, i])) : void 0
                    }, this)
                }
            }
        };
    return i
}), define("flight/lib/registry", ["./utils"], function() {
    function e(e, t) {
        var i, s, n, r = t.length;
        return "function" == typeof t[r - 1] && (r -= 1, n = t[r]), "object" == typeof t[r - 1] && (r -= 1), 2 == r ? (i = t[0], s = t[1]) : (i = e.node, s = t[0]), {
            element: i,
            type: s,
            callback: n
        }
    }

    function t(e, t) {
        return e.element == t.element && e.type == t.type && (null == t.callback || e.callback == t.callback)
    }

    function i() {
        function i(e) {
            this.component = e, this.attachedTo = [], this.instances = {}, this.addInstance = function(e) {
                var t = new s(e);
                return this.instances[e.identity] = t, this.attachedTo.push(e.node), t
            }, this.removeInstance = function(e) {
                delete this.instances[e.identity];
                var t = this.attachedTo.indexOf(e.node);
                t > -1 && this.attachedTo.splice(t, 1), Object.keys(this.instances).length || n.removeComponentInfo(this)
            }, this.isAttachedTo = function(e) {
                return this.attachedTo.indexOf(e) > -1
            }
        }

        function s(e) {
            this.instance = e, this.events = [], this.addBind = function(e) {
                this.events.push(e), n.events.push(e)
            }, this.removeBind = function(e) {
                for (var i, s = 0; i = this.events[s]; s++) t(i, e) && this.events.splice(s, 1)
            }
        }
        var n = this;
        (this.reset = function() {
            this.components = [], this.allInstances = {}, this.events = []
        }).call(this), this.addInstance = function(e) {
            var t = this.findComponentInfo(e);
            t || (t = new i(e.constructor), this.components.push(t));
            var s = t.addInstance(e);
            return this.allInstances[e.identity] = s, t
        }, this.removeInstance = function(e) {
            var t = (this.findInstanceInfo(e), this.findComponentInfo(e));
            t && t.removeInstance(e), delete this.allInstances[e.identity]
        }, this.removeComponentInfo = function(e) {
            var t = this.components.indexOf(e);
            t > -1 && this.components.splice(t, 1)
        }, this.findComponentInfo = function(e) {
            for (var t, i = e.attachTo ? e : e.constructor, s = 0; t = this.components[s]; s++)
                if (t.component === i) return t;
            return null
        }, this.findInstanceInfo = function(e) {
            return this.allInstances[e.identity] || null
        }, this.findInstanceInfoByNode = function(e) {
            var t = [];
            return Object.keys(this.allInstances).forEach(function(i) {
                var s = this.allInstances[i];
                s.instance.node === e && t.push(s)
            }, this), t
        }, this.on = function(t) {
            for (var i, s = n.findInstanceInfo(this), r = arguments.length, o = 1, a = Array(r - 1); r > o; o++) a[o - 1] = arguments[o];
            if (s) {
                i = t.apply(null, a), i && (a[a.length - 1] = i);
                var c = e(this, a);
                s.addBind(c)
            }
        }, this.off = function() {
            var i = e(this, arguments),
                s = n.findInstanceInfo(this);
            s && s.removeBind(i);
            for (var r, o = 0; r = n.events[o]; o++) t(r, i) && n.events.splice(o, 1)
        }, n.trigger = Function(), this.teardown = function() {
            n.removeInstance(this)
        }, this.withRegistration = function() {
            this.before("initialize", function() {
                n.addInstance(this)
            }), this.around("on", n.on), this.after("off", n.off), window.DEBUG && DEBUG.enabled && this.after("trigger", n.trigger), this.after("teardown", {
                obj: n,
                fnName: "teardown"
            })
        }
    }
    return new i
}), define("flight/tools/debug/debug", ["../../lib/registry", "../../lib/utils"], function() {
    function e(t, i, s) {
        var s = s || {}, n = s.obj || window,
            r = s.path || (n == window ? "window" : ""),
            o = Object.keys(n);
        o.forEach(function(s) {
            (f[t] || t)(i, n, s) && console.log([r, ".", s].join(""), "->", ["(", typeof n[s], ")"].join(""), n[s]), "[object Object]" == Object.prototype.toString.call(n[s]) && n[s] != n && -1 == r.split(".").indexOf(s) && e(t, i, {
                obj: n[s],
                path: [r, s].join(".")
            })
        })
    }

    function t(t, i, s, n) {
        i && typeof s != i ? console.error([s, "must be", i].join(" ")) : e(t, s, n)
    }

    function i(e, i) {
        t("name", "string", e, i)
    }

    function s(e, i) {
        t("nameContains", "string", e, i)
    }

    function n(e, i) {
        t("type", "function", e, i)
    }

    function r(e, i) {
        t("value", null, e, i)
    }

    function o(e, i) {
        t("valueCoerced", null, e, i)
    }

    function a(t, i) {
        e(t, null, i)
    }

    function c() {
        var e = [].slice.call(arguments);
        m.eventNames.length || (m.eventNames = g), m.actions = e.length ? e : g, d()
    }

    function l() {
        var e = [].slice.call(arguments);
        m.actions.length || (m.actions = g), m.eventNames = e.length ? e : g, d()
    }

    function u() {
        m.actions = [], m.eventNames = [], d()
    }

    function h() {
        m.actions = g, m.eventNames = g, d()
    }

    function d() {
        window.localStorage && (localStorage.setItem("logFilter_eventNames", m.eventNames), localStorage.setItem("logFilter_actions", m.actions))
    }

    function p() {
        var e = {
            eventNames: window.localStorage && localStorage.getItem("logFilter_eventNames") || T,
            actions: window.localStorage && localStorage.getItem("logFilter_actions") || v
        };
        return Object.keys(e).forEach(function(t) {
            var i = e[t];
            "string" == typeof i && i !== g && (e[t] = i.split(","))
        }), e
    }
    var m, f = {
            name: function(e, t, i) {
                return e == i
            },
            nameContains: function(e, t, i) {
                return i.indexOf(e) > -1
            },
            type: function(e, t, i) {
                return t[i] instanceof e
            },
            value: function(e, t, i) {
                return t[i] === e
            },
            valueCoerced: function(e, t, i) {
                return t[i] == e
            }
        }, g = "all",
        T = [],
        v = [],
        m = p();
    return {
        enable: function(e) {
            this.enabled = !! e, e && window.console && (console.info("Booting in DEBUG mode"), console.info("You can configure event logging with DEBUG.events.logAll()/logNone()/logByName()/logByAction()")), window.DEBUG = this
        },
        find: {
            byName: i,
            byNameContains: s,
            byType: n,
            byValue: r,
            byValueCoerced: o,
            custom: a
        },
        events: {
            logFilter: m,
            logByAction: c,
            logByName: l,
            logAll: h,
            logNone: u
        }
    }
}), define("flight/lib/compose", ["./utils", "../tools/debug/debug"], function(e, t) {
    function i(e, t) {
        if (r) {
            var i = Object.create(null);
            Object.keys(e).forEach(function(s) {
                if (0 > o.indexOf(s)) {
                    var n = Object.getOwnPropertyDescriptor(e, s);
                    n.writable = t, i[s] = n
                }
            }), Object.defineProperties(e, i)
        }
    }

    function s(e, t, i) {
        var s;
        return r && e.hasOwnProperty(t) ? (s = Object.getOwnPropertyDescriptor(e, t).writable, Object.defineProperty(e, t, {
            writable: !0
        }), i.call(e), Object.defineProperty(e, t, {
            writable: s
        }), void 0) : (i.call(e), void 0)
    }

    function n(e, t) {
        e.mixedIn = e.hasOwnProperty("mixedIn") ? e.mixedIn : [], t.forEach(function(t) {
            -1 == e.mixedIn.indexOf(t) && (i(e, !1), t.call(e), e.mixedIn.push(t))
        }), i(e, !0)
    }
    var r = t.enabled && !e.isEnumerable(Object, "getOwnPropertyDescriptor"),
        o = ["mixedIn"];
    if (r) try {
        Object.getOwnPropertyDescriptor(Object, "keys")
    } catch (a) {
        r = !1
    }
    return {
        mixin: n,
        unlockProperty: s
    }
}), define("flight/lib/advice", ["./utils", "./compose"], function(e, t) {
    var i = {
        around: function(e, t) {
            return function() {
                var i = 0,
                    s = arguments.length,
                    n = Array(s + 1);
                for (n[0] = e.bind(this); s > i; i++) n[i + 1] = arguments[i];
                return t.apply(this, n)
            }
        },
        before: function(e, t) {
            var i = "function" == typeof t ? t : t.obj[t.fnName];
            return function() {
                return i.apply(this, arguments), e.apply(this, arguments)
            }
        },
        after: function(e, t) {
            var i = "function" == typeof t ? t : t.obj[t.fnName];
            return function() {
                var t = (e.unbound || e).apply(this, arguments);
                return i.apply(this, arguments), t
            }
        },
        withAdvice: function() {
            ["before", "after", "around"].forEach(function(e) {
                this[e] = function(s, n) {
                    t.unlockProperty(this, s, function() {
                        return this[s] = "function" == typeof this[s] ? i[e](this[s], n) : n
                    })
                }
            }, this)
        }
    };
    return i
}), define("flight/lib/logger", ["./compose", "./utils"], function(e, t) {
    function i(e) {
        var t = e.tagName ? e.tagName.toLowerCase() : "" + e,
            i = e.className ? "." + e.className : "",
            s = t + i;
        return e.tagName ? ["'", "'"].join(s) : s
    }

    function s(e, t, s) {
        var n, o, a, c, l, u, h;
        "function" == typeof s[s.length - 1] && (a = s.pop(), a = a.unbound || a), "object" == typeof s[s.length - 1] && s.pop(), 2 == s.length ? (o = s[0], n = s[1]) : (o = t.$node[0], n = s[0]), window.DEBUG && window.DEBUG.enabled && (c = DEBUG.events.logFilter, u = "all" == c.actions || c.actions.indexOf(e) > -1, l = function(e) {
            return e.test ? e : RegExp("^" + e.replace(/\*/g, ".*") + "$")
        }, h = "all" == c.eventNames || c.eventNames.some(function(e) {
            return l(e).test(n)
        }), u && h && console.info(r[e], e, "[" + n + "]", i(o), t.constructor.describe.split(" ").slice(0, 3).join(" ")))
    }

    function n() {
        this.before("trigger", function() {
            s("trigger", this, t.toArray(arguments))
        }), this.before("on", function() {
            s("on", this, t.toArray(arguments))
        }), this.before("off", function() {
            s("off", this, t.toArray(arguments))
        })
    }
    var r = {
        on: "<-",
        trigger: "->",
        off: "x "
    };
    return n
}), define("flight/lib/component", ["./advice", "./utils", "./compose", "./registry", "./logger", "../tools/debug/debug"], function(e, t, i, s, n, r) {
    function o(e) {
        e.events.slice().forEach(function(e) {
            var t = [e.type];
            e.element && t.unshift(e.element), "function" == typeof e.callback && t.push(e.callback), this.off.apply(this, t)
        }, e.instance)
    }

    function a() {
        o(s.findInstanceInfo(this))
    }

    function c() {
        var e = s.findComponentInfo(this);
        e && Object.keys(e.instances).forEach(function(t) {
            var i = e.instances[t];
            i.instance.teardown()
        })
    }

    function l(e, t) {
        try {
            window.postMessage(t, "*")
        } catch (i) {
            throw console.log("unserializable data for event", e, ":", t), Error(["The event", e, "on component", "" + this, "was triggered with non-serializable data"].join(" "))
        }
    }

    function u() {
        this.trigger = function() {
            var e, t, i, s, n, o = arguments.length - 1,
                a = arguments[o];
            return "string" != typeof a && (!a || !a.defaultBehavior) && (o--, i = a), 1 == o ? (e = $(arguments[0]), s = arguments[1]) : (e = this.$node, s = arguments[0]), s.defaultBehavior && (n = s.defaultBehavior, s = $.Event(s.type)), t = s.type || s, r.enabled && window.postMessage && l.call(this, t, i), "object" == typeof this.attr.eventData && (i = $.extend(!0, {}, this.attr.eventData, i)), e.trigger(s || t, i), n && !s.isDefaultPrevented() && (this[n] || n).call(this), e
        }, this.on = function() {
            var e, i, s, n, r = arguments.length - 1,
                o = arguments[r];
            if (n = "object" == typeof o ? t.delegate(this.resolveDelegateRules(o)) : o, 2 == r ? (e = $(arguments[0]), i = arguments[1]) : (e = this.$node, i = arguments[0]), "function" != typeof n && "object" != typeof n) throw Error("Unable to bind to '" + i + "' because the given callback is not a function or an object");
            return s = n.bind(this), s.target = n, n.guid && (s.guid = n.guid), e.on(i, s), n.guid = s.guid, s
        }, this.off = function() {
            var e, t, i, s = arguments.length - 1;
            return "function" == typeof arguments[s] && (i = arguments[s], s -= 1), 1 == s ? (e = $(arguments[0]), t = arguments[1]) : (e = this.$node, t = arguments[0]), e.off(t, i)
        }, this.resolveDelegateRules = function(e) {
            var t = {};
            return Object.keys(e).forEach(function(i) {
                if (!i in this.attr) throw Error('Component "' + ("" + this) + '" wants to listen on "' + i + '" but no such attribute was defined.');
                t[this.attr[i]] = e[i]
            }, this), t
        }, this.defaultAttrs = function(e) {
            t.push(this.defaults, e, !0) || (this.defaults = e)
        }, this.select = function(e) {
            return this.$node.find(this.attr[e])
        }, this.initialize = $.noop, this.teardown = a
    }

    function h(e) {
        for (var i = arguments.length, n = Array(i - 1), r = 1; i > r; r++) n[r - 1] = arguments[r];
        if (!e) throw Error("Component needs to be attachTo'd a jQuery object, native node or selector string");
        var o = t.merge.apply(t, n);
        $(e).each(function(e, t) {
            var i = t.jQuery ? t[0] : t,
                n = s.findComponentInfo(this);
            n && n.isAttachedTo(i) || new this(t, o)
        }.bind(this))
    }

    function d() {
        function t(e, i) {
            if (i = i || {}, this.identity = m++, !e) throw Error("Component needs a node");
            e.jquery ? (this.node = e[0], this.$node = e) : (this.node = e, this.$node = $(e)), this.toString = t.toString, r.enabled && (this.describe = "" + this);
            var s = Object.create(i);
            for (var n in this.defaults) i.hasOwnProperty(n) || (s[n] = this.defaults[n]);
            this.attr = s, Object.keys(this.defaults || {}).forEach(function(e) {
                if (null === this.defaults[e] && null === this.attr[e]) throw Error('Required attribute "' + e + '" not specified in attachTo for component "' + ("" + this) + '".')
            }, this), this.initialize.call(this, i)
        }
        for (var o = arguments.length, a = Array(o + 3), l = 0; o > l; l++) a[l] = arguments[l];
        return t.toString = function() {
            var e = a.map(function(e) {
                if (null == e.name) {
                    var t = ("" + e).match(p);
                    return t && t[1] ? t[1] : ""
                }
                return "withBaseComponent" != e.name ? e.name : ""
            }).filter(Boolean).join(", ");
            return e
        }, r.enabled && (t.describe = "" + t), t.attachTo = h, t.teardownAll = c, r.enabled && a.unshift(n), a.unshift(u, e.withAdvice, s.withRegistration), i.mixin(t.prototype, a), t
    }
    var p = /function (.*?)\s?\(/,
        m = 0;
    return d.teardownAll = function() {
        s.components.slice().forEach(function(e) {
            e.component.teardownAll()
        }), s.reset()
    }, d
}), define("data/with_client", [], function() {
    function e() {
        this.getClientByAccountKey = function(e) {
            var t;
            return t = e ? TD.controller.clients.getClient(e) : this.getTwitterClient("twitter")
        }, this.getClientByAccount = function(e) {
            return this.getClientByAccountKey(e.getKey())
        }, this.getPreferredClient = function(e) {
            return TD.controller.clients.getPreferredClient(e)
        }, this.getTwitterClient = function() {
            return this.getPreferredClient("twitter")
        }, this.getTweetDeckClient = function() {
            return this.getClientsByService("tweetdeck")[0]
        }, this.getClientsByService = function(e) {
            return TD.controller.clients.getClientsByService(e)
        }, this.getAccountData = function(e) {
            var t = this.getClientByAccountKey(e);
            if (!t) return null;
            var i = t.oauth.account;
            return {
                accountKey: e,
                id: i.getUserID(),
                screenName: i.getUsername(),
                profileImageUrl: i.getProfileImageURL()
            }
        }
    }
    return e
}), define("data/accounts", ["flight/lib/component", "data/with_client"], function(e, t) {
    function i() {
        this.sendAccounts = function() {
            this.trigger(document, "dataAccounts", {
                accounts: this.accounts
            })
        }, this.processAccountObjects = function(e) {
            return e.map(function(e) {
                return {
                    accountKey: e.getKey(),
                    profileImageUrl: e.getProfileImageURL(),
                    screenName: e.getUsername()
                }
            })
        }, this.sortAccounts = function(e) {
            var t = TD.storage.accountController.getDefault(),
                i = e;
            !i && t && (i = t.getKey()), 1 === this.accounts.length ? (this.defaultAccountKey = this.accounts[0].accountKey, this.accounts[0].isDefault = !0) : this.accounts.forEach(function(e) {
                e.accountKey === i ? (e.isDefault = !0, this.defaultAccountKey = e.accountKey) : e.isDefault = !1
            }, this), this.accounts.sort(function(e, t) {
                var i, s;
                return e.isDefault ? -1 : t.isDefault ? 1 : (i = e.screenName.toLowerCase(), s = t.screenName.toLowerCase(), s > i ? -1 : i > s ? 1 : 0)
            })
        }, this.getAccounts = function() {
            var e = TD.storage.accountController.getAccountsForService("twitter");
            this.accounts = this.processAccountObjects(e), this.sortAccounts(), this.sendAccounts()
        }, this.handleDefaultAccount = function(e, t) {
            this.defaultAccountKey !== t.accountKey && (this.defaultAccountKey = t.accountKey, this.sortAccounts(t.accountKey), this.sendAccounts(), this.trigger("dataTwitterClientChanged", {
                client: this.getTwitterClient()
            }))
        }, this.handleUiNeedsAccounts = function() {
            this.getAccounts()
        }, this.handleAccountWhitelist = function() {
            this.getAccounts()
        }, this.handleNeedsDefaultAccount = function() {
            var e = TD.storage.accountController.getDefault();
            e && this.trigger("dataDefaultAccount", {
                accountKey: e.getKey()
            })
        }, this.after("initialize", function() {
            this.accounts = [], this.defaultAccountKey = null, this.on(document, "uiNeedsAccounts", this.handleUiNeedsAccounts), this.on(document, "uiNeedsDefaultAccount", this.handleNeedsDefaultAccount), this.on(document, "dataDefaultAccount", this.handleDefaultAccount), this.on(document, "dataAccountWhitelist", this.handleAccountWhitelist)
        })
    }
    return e(i, t)
}), define("data/column_manager", ["flight/lib/component"], function(e) {
    var t = function() {
        this.deleteColumn = function(e, t) {
            var i = t.columnId;
            i && TD.controller.columnManager.deleteColumn(i)
        }, this.moveColumn = function(e, t) {
            var i = t.columnId,
                s = t.action;
            i && s && TD.controller.columnManager.move(i, s)
        }, this.handleUiNeedsColumnOrder = function() {
            var e = TD.controller.columnManager.getAllOrdered();
            this.trigger("dataColumnOrder", {
                columns: e
            })
        }, this.after("initialize", function() {
            this.on(document, "uiDeleteColumnAction", this.deleteColumn), this.on(document, "uiMoveColumnAction", this.moveColumn), this.on(document, "uiNeedsColumnOrder", this.handleUiNeedsColumnOrder)
        })
    };
    return e(t)
}), define("data/embed_timeline", ["flight/lib/component", "data/with_client"], function(e, t) {
    function i() {
        this.checkListSubscription = function(e, t, i) {
            var s = _.uniqueId(),
                n = {
                    id: s,
                    title: TD.i("Subscribe to this list?"),
                    message: TD.i("To share this list, we need to subscribe you to it. Subscribe and share?"),
                    okLabel: TD.i("OK"),
                    cancelLabel: TD.i("Cancel")
                }, r = function() {
                    TD.util.openURL(t, i)
                }, o = function(t, i) {
                    var n;
                    i.id === s && (this.off(document, "uiConfirmationAction", o), i.result && (n = this.getTwitterClient(), n.subscribeToList(e, r)))
                }, a = this.getTwitterClient().oauth.account.getKey(),
                c = TD.cache.lists.find(e, null, null, !1, a);
            c ? r() : (this.on(document, "uiConfirmationAction", o.bind(this)), this.trigger("uiShowConfirmationDialog", n))
        }, this.openEmbedTimeline = function(e, t) {
            var i, s, n, r = "https://twitter.com/settings/widgets/new/",
                o = {};
            if (t && t.column && t.column.isEmbeddable()) {
                switch (i = t.column.getFeeds()[0], s = i.getMetadata(), t.column.getColumnType()) {
                    case TD.util.columnUtils.columnMetaTypes.USERTWEETS:
                        r += "user", o.user_id = s.id ? s.id : TD.storage.accountController.get(i.getAccountKey()).getUserID();
                        break;
                    case TD.util.columnUtils.columnMetaTypes.FAVORITES:
                        r += "favorites", o.user_id = s.id ? s.id : TD.storage.accountController.get(i.getAccountKey()).getUserID();
                        break;
                    case TD.util.columnUtils.columnMetaTypes.LIST:
                        return r += "list", o.list_id = s.listId, this.checkListSubscription(s.listId, r, o), void 0;
                    case TD.util.columnUtils.columnMetaTypes.SEARCH:
                        r += "search", s.baseQuery && s.searchFilterData ? (n = new TD.vo.SearchFilter(s.searchFilterData), o.query = [s.baseQuery, n.getQueryString()].join(" ").trim()) : o.query = s.term
                }
                TD.util.openURL(r, o)
            }
        }, this.after("initialize", function() {
            this.on(document, "uiEmbedTimelineAction", this.openEmbedTimeline)
        })
    }
    return e(i, t)
}), define("data/embed_tweet", ["flight/lib/component", "data/with_client"], function(e, t) {
    function i() {
        this.handleEmbeddedTweetFactory = function(e) {
            return function(t) {
                t.request = e, this.trigger(document, "dataEmbeddedTweet", t)
            }
        }, this.handleErrorFactory = function(e) {
            return function() {
                var t = {
                    request: e
                };
                this.trigger(document, "dataEmbeddedTweetError", t)
            }
        }, this.getEmbeddedTweet = function(e, t) {
            if (t && t.tweetID) {
                var i = this.getTwitterClient();
                i.getEmbeddedTweet(t.tweetID, t.hideThread, t.hideMedia, t.maxWidth, this.handleEmbeddedTweetFactory(t).bind(this), this.handleErrorFactory(t).bind(this))
            }
        }, this.after("initialize", function() {
            this.on(document, "uiNeedsEmbeddedTweet", this.getEmbeddedTweet)
        })
    }
    return e(i, t)
}), define("util/with_version_comparator", [], function() {
    var e = function() {
        this.appSatisfiesVersionRequirements = function(e) {
            var t = TD.version,
                i = e.split(" ");
            return _.all(i, function(e) {
                var i, s = e.match(/[<=>]*/)[0],
                    n = e.substr(s.length),
                    r = [];
                return _.contains(s, ">") ? r.push(1) : _.contains(s, "<") && r.push(-1), (_.contains(s, "=") || 0 === s.length) && r.push(0), i = TD.util.versionComparator(t, n), _.contains(r, i)
            })
        }
    };
    return e
}), define("data/message_banner", ["flight/lib/component", "util/with_version_comparator"], function(e, t) {
    var i = function() {
        this.dismissMessage = function(e, t) {
            var i = TD.settings.getIdsForSeenMessages();
            i.push(t.id), TD.settings.setIdsForSeenMessages(i)
        }, this.satisfiesPlatformRequirements = function(e) {
            if (e.target && e.target.platform) {
                var t = TD.util.getAppEnv();
                return _.include(e.target.platform, t)
            }
            return !0
        }, this.satisfiesVersionRequirements = function(e) {
            return e.target && e.target.version ? this.appSatisfiesVersionRequirements(e.target.version) : !0
        }, this.hasNotBeenDismissed = function(e) {
            if (e.message) {
                var t = TD.settings.getIdsForSeenMessages(),
                    i = t.every(function(t) {
                        return e.message.id !== t
                    });
                return i
            }
            return !1
        }, this.handleMessages = function(e, t) {
            var i = t.messages;
            i && (i = i.filter(this.satisfiesPlatformRequirements, this), i = i.filter(this.satisfiesVersionRequirements, this), i = i.filter(this.hasNotBeenDismissed, this), i.length && this.trigger("dataMessage", i[0]))
        }, this.after("initialize", function() {
            this.on(document, "uiHidingMessageBanner", this.dismissMessage), this.on(document, "dataMessages", this.handleMessages)
        })
    };
    return e(i, t)
}), define("data/preferred_account", ["flight/lib/component"], function(e) {
    function t() {
        this.send = function(e) {
            this.trigger(document, "dataPreferredAccount", {
                account: e
            })
        }, this.getPreferredTwitterAccount = function() {
            this.ready && this.send(TD.storage.accountController.getPreferredAccount("twitter"))
        }, this.tdReady = function() {
            this.ready = !0, this.getPreferredTwitterAccount(), this.off(document, "TD.ready", this.tdReady)
        }, this.after("initialize", function() {
            this.on(document, "uiNeedsPreferredAccount", this.getPreferredTwitterAccount), this.on(document, "TD.ready", this.tdReady), $.subscribe("/storage/account/new", this.getPreferredTwitterAccount.bind(this)), $.subscribe("/storage/client/default_account_changed", this.getPreferredTwitterAccount.bind(this))
        })
    }
    return e(t)
}), define("data/relationship", ["flight/lib/component", "data/with_client"], function(e, t) {
    function i() {
        this.handleRelationship = function(e) {
            this.trigger(document, "dataRelationship", e)
        }, this.handleError = function(e) {
            return function() {
                this.trigger(document, "dataRelationshipError", e)
            }
        }, this.getRelationship = function(e, t) {
            if (t && t.account && t.screenName) {
                var i = this.getClientByAccount(t.account);
                i.showFriendship(t.account.getUserID(), null, t.screenName, this.handleRelationship.bind(this), this.handleError(t).bind(this))
            }
        }, this.after("initialize", function() {
            this.on(document, "uiNeedsRelationship", this.getRelationship)
        })
    }
    return e(i, t)
}), define("data/twitter_user", ["flight/lib/component"], function(e) {
    function t() {
        this.getTwitterUser = function(e, t) {
            var i;
            t && (i = t.id ? TD.cache.twitterUsers.getById(t.id) : TD.cache.twitterUsers.getByScreenName(t.screenName), i.addCallbacks(this.handleTwitterUser, this.errorHandlerFactory(t.screenName), null, null, this, this))
        }, this.errorHandlerFactory = function(e) {
            var t = function(t) {
                var i = t.req.errors,
                    s = TD.i("Sorry, we couldn't retrieve user @{{1}}", {
                        1: e
                    }),
                    n = !1;
                i && i.forEach(function(e) {
                    63 === e.twitterErrorCode ? n = !0 : e.message && (s += " - " + e.message)
                }), n || TD.controller.progressIndicator.addMessage(s), this.trigger("dataTwitterUserError", {
                    screenName: e
                })
            };
            return t.bind(this)
        }, this.handleTwitterUser = function(e) {
            e && e.account && this.trigger(document, "dataTwitterUser", e)
        }, this.after("initialize", function() {
            this.on(document, "uiNeedsTwitterUser", this.getTwitterUser)
        })
    }
    return e(t)
}), define("data/user_actions", ["flight/lib/component", "data/with_client"], function(e, t) {
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
        }), this.error = function(e, t) {
            return function(i) {
                var s;
                s = {
                    request: t,
                    response: i
                }, this.trigger(document, e.errorEvent, s)
            }
        }, this.success = function(e, t) {
            return function(i) {
                this.trigger("dataFollowStateChange", {
                    action: e,
                    request: t,
                    response: i
                })
            }
        }, this.takeAction = function(e, t, i) {
            var s = !1,
                n = this.success(e, i).bind(this),
                r = this.error(e, i).bind(this),
                o = e.userAction;
            try {
                switch (o) {
                    case "block":
                        i.twitterUser.block(i.account, !1, n, r, s);
                        break;
                    case "reportSpam":
                        i.twitterUser.block(i.account, !0, n, r, s);
                        break;
                    case "unblock":
                        i.twitterUser.unblock(i.account, n, r);
                        break;
                    case "follow":
                        i.twitterUser.follow(i.account, n, r, s);
                        break;
                    case "unfollow":
                        i.twitterUser.unfollow(i.account, n, r, s)
                }
            } catch (a) {
                this.error()
            }
        }, this.bindAction = function(e) {
            return this.takeAction.bind(this, e)
        }, this.after("initialize", function() {
            this.on(document, "uiFollowAction", this.bindAction(this.attr.actions.follow)), this.on(document, "uiUnfollowAction", this.bindAction(this.attr.actions.unfollow)), this.on(document, "uiBlockAction", this.bindAction(this.attr.actions.block)), this.on(document, "uiUnblockAction", this.bindAction(this.attr.actions.unblock)), this.on(document, "uiReportSpamAction", this.bindAction(this.attr.actions.reportSpam)), this.on(document, "uiReportCompromisedAction", this.bindAction(this.attr.actions.reportCompromised))
        })
    };
    return e(i, t)
}), define("data/settings", ["flight/lib/component"], function(e) {
    function t() {
        this.after("initialize", function() {
            this.on(document, "uiNeedsSettings", this.handleUiNeedsSettings), this.on(document, "uiNeedsSettingsValues", this.handleUiNeedsSettingsValues), this.on(document, "uiSetSettingsValues", this.handleUiSetSettingsValues), this.on(document, "uiToggleTheme", this.toggleTheme), this.on(document, "uiNavbarWidthChangeAction", this.handleNavbarWidthChange), this.on(document, "uiChangeComposeStayOpen", this.handleComposeStayOpen)
        }), this.handleUiNeedsSettings = function() {
            this.settings = {
                theme: TD.settings.getTheme(),
                navbarWidth: TD.settings.getNavbarWidth(),
                composeStayOpen: TD.settings.getComposeStayOpen()
            }, this.trigger(document, "dataSettings", this.settings)
        }, this.handleUiNeedsSettingsValues = function(e, t) {
            var i = {};
            t.keys.forEach(function(e) {
                switch (e) {
                    case "link_shortener":
                        i[e] = TD.settings.getLinkShortener()
                }
            }), this.trigger(document, "dataSettingsValues", i)
        }, this.handleUiSetSettingsValues = function(e, t) {
            t.keys.forEach(function(e) {
                switch (e) {
                    case "link_shortener":
                        TD.settings.setLinkShortener(t.values[e])
                }
            })
        }, this.toggleTheme = function() {
            var e = this.settings.theme;
            e = "light" === e ? "dark" : "light", TD.settings.setTheme(e), this.settings.theme = e, this.trigger(document, "dataSettings", this.settings)
        }, this.handleNavbarWidthChange = function(e, t) {
            TD.settings.setNavbarWidth(t.navbarWidth), this.settings.navbarWidth = t.navbarWidth, this.trigger(document, "dataSettings", this.settings)
        }, this.handleComposeStayOpen = function(e, t) {
            TD.settings.setComposeStayOpen(t.composeStayOpen), this.settings.composeStayOpen = t.composeStayOpen, this.trigger(document, "dataSettings", this.settings)
        }
    }
    return e(t)
}), define("data/stream_counter", ["flight/lib/component"], function(e) {
    var t = function() {
        this.defaultAttrs({
            updatePeriod: 500,
            aggregationPeriod: 1e4
        }), this.updateStreamCount = function(e, t) {
            this.streamCounter.incrementCounter(t.numStreamItems)
        }, this.after("initialize", function() {
            this.on(document, "dataReceivedStreamData", this.updateStreamCount), this.streamCounter = new TD.util.TpmCounter(this.attr.updatePeriod, this.attr.aggregationPeriod, "dataStreamRate")
        })
    };
    return e(t)
}), define("data/user_search", ["flight/lib/component", "data/with_client"], function(e, t) {
    function i() {
        this.handleResponseFactory = function(e, t) {
            return function(i) {
                this.trigger(document, e, {
                    request: t,
                    result: i
                })
            }.bind(this)
        }, this.doUserSearch = function(e, t) {
            var i = this.getPreferredClient("twitter"),
                s = t.query;
            i ? i.userSearch(s, this.handleResponseFactory("dataUserSearch", t), this.handleResponseFactory("dataUserSearchError", t)) : this.handleResponseFactory("dataUserSearchError", t)()
        }, this.doUserLookup = function(e, t) {
            var i = this.getPreferredClient("twitter");
            i ? i.showUser(t.id, t.screenName, this.handleResponseFactory("dataUserLookup", t), this.handleResponseFactory("dataUserLookupError", t)) : this.handleResponseFactory("dataUserLookupError", t)()
        }, this.after("initialize", function() {
            this.on(document, "uiNeedsUserSearch", this.doUserSearch), this.on(document, "uiNeedsUserLookup", this.doUserLookup)
        })
    }
    return e(i, t)
}), define("data/storage", ["flight/lib/component"], function(e) {
    var t = function() {
        this.get = function(e, t) {
            t.names ? t.names.forEach(function(e) {
                this.trigger(document, "dataStorageItem", {
                    name: e,
                    value: TD.storage.store.get(e)
                })
            }, this) : t.name && this.trigger(document, "dataStorageItem", {
                name: t.name,
                value: TD.storage.store.get(name)
            })
        }, this.set = function(e, t) {
            for (var i in t)
                if (t.hasOwnProperty(i)) try {
                    TD.storage.store.nonCriticalSet(i, t[i])
                } catch (s) {
                    s.code === DOMException.QUOTA_EXCEEDED_ERR ? this.trigger(document, "dataStorageFull", {
                        name: i,
                        value: t[i]
                    }) : this.trigger(document, "dataStorageSetError", {
                        name: i,
                        value: t[i]
                    })
                }
        }, this.after("initialize", function() {
            this.on("dataStorageSet", this.set), this.on("dataStorageGet", this.get)
        })
    };
    return e(t)
}), define("data/recent_searches", ["flight/lib/component"], function(e) {
    var t = function() {
        this.saveRecentSearch = function(e, t) {
            TD.storage.clientController.client.addRecentSearch(t.query)
        }, this.getRecentSearches = function() {
            var e = {
                recentSearches: TD.storage.clientController.client.getRecentSearches()
            };
            this.trigger("dataRecentSearches", e)
        }, this.clearRecentSearches = function() {
            TD.storage.clientController.client.clearRecentSearches()
        }, this.after("initialize", function() {
            this.on(document, "uiSearch", this.saveRecentSearch), this.on(document, "uiRecentSearchClearAction", this.clearRecentSearches), this.on(document, "uiNeedsRecentSearches", this.getRecentSearches)
        })
    };
    return e(t)
}), define("data/typeahead/with_users_datasource", [], function() {
    function e() {
        this.defaultAttrs({
            usersStorageLimit: 2500,
            storageUserHash: "typeaheadUserHash",
            storageUserLastPrefetch: "typeaheadUserLastPrefetch"
        }), this.tokenize = function(e) {
            return e.trim().toLowerCase().split(TD.constants.regexps.tokenSeparator)
        }, this.overwriteUserdata = function(e) {
            this.userHash = {}, this.userAdjacencyList = {}, this.processUserData(e)
        }, this.processUserData = function(e) {
            _.each(e, function(e) {
                e.tokens = e.tokens.map(function(e) {
                    return e = "string" == typeof e ? e : e.token, e.toLowerCase()
                }), delete e.location, delete e.connecting_user_ids, this.userHash[e.id] = e, e.tokens.forEach(function(t) {
                    var i = t.charAt(0);
                    void 0 === this.userAdjacencyList[i] && (this.userAdjacencyList[i] = []), -1 === this.userAdjacencyList[i].indexOf(e.id) && this.userAdjacencyList[i].push(e.id)
                }, this)
            }, this);
            var t = {};
            t[this.attr.storageUserHash] = this.userHash, this.trigger("dataStorageSet", t)
        }, this.processPrefetchUserData = function(e) {
            this.processUserData(e.users);
            var t = {};
            t[this.attr.storageUserLastPrefetch] = Date.now(), this.trigger("dataStorageSet", t)
        }, this.prefetchUserSuggestions = function() {
            var e = this.getTwitterClient();
            e && e.typeaheadSearch({
                prefetch: !0,
                count: this.attr.usersStorageLimit
            }, this.processPrefetchUserData.bind(this), this.handleGetSuggestionsError.bind(this))
        }, this.pruneUsers = function() {
            var e = _.values(this.userHash);
            e.sort(this.userSortComparator), e = e.slice(0, Math.floor(e.length / 2)), this.overwriteUserdata(e)
        }, this.getUserSuggestions = function(e, t) {
            var i, s, n, r = [];
            return i = this.tokenize(e.query), s = this.getPotentiallyMatchingUserIds(i), n = this.getUsersFromIds(s), r = n.filter(this.matchUsers(i)), r.sort(this.userSortComparator), r = r.slice(0, t)
        }, this.getPotentiallyMatchingUserIds = function(e) {
            var t = [];
            return e.map(function(e) {
                var i = this.userAdjacencyList[e.charAt(0)];
                i && (t = t.concat(i))
            }, this), t = _.uniq(t)
        }, this.getUsersFromIds = function(e) {
            var t = [];
            return e.forEach(function(e) {
                var i = this.userHash[e];
                i && !this.isUserBlocked(e) && t.push(i)
            }, this), t
        }, this.matchUsers = function(e) {
            return function(t) {
                var i = t.tokens,
                    s = e.every(function(e) {
                        var t = i.filter(function(t) {
                            return 0 === t.indexOf(e)
                        });
                        return t.length
                    });
                return s ? t : void 0
            }
        }, this.userSortComparator = function(e, t) {
            var i = 0 !== e.rounded_graph_weight,
                s = 0 !== t.rounded_graph_weight;
            return i && !s ? -1 : s && !i ? 1 : i && s ? t.rounded_graph_weight - e.rounded_graph_weight : t.rounded_score - e.rounded_score
        }, this.isUserBlocked = function(e) {
            return this.blockedUserIds[e] ? !0 : !1
        }, this.processUserStorageItem = function(e, t) {
            switch (t.name) {
                case this.attr.storageUserHash:
                    this.processUserData(t.value);
                    break;
                case this.attr.storageUserLastPrefetch:
                    ("number" != typeof t.value || Date.now() - t.value > TD.constants.time.oneDay) && this.prefetchUserSuggestions();
                    break;
                default:
            }
        }, this.loadUserData = function() {
            this.trigger("dataStorageGet", {
                names: [this.attr.storageUserHash, this.attr.storageUserLastPrefetch]
            });
            var e = this.getTwitterClient();
            e && (this.blockedUserIds = e.blocks)
        }, this.resetUserData = function(e, t) {
            t.client && (this.overwriteUserdata([]), this.blockedUserIds = t.client.blocks, this.prefetchUserSuggestions())
        }, this.after("initialize", function() {
            this.userAdjacencyList = {}, this.userHash = {}, this.blockedUserIds = {}, this.datasources = this.datasources || {}, this.datasources.users = {
                processData: this.processUserData.bind(this),
                getSuggestions: this.getUserSuggestions.bind(this)
            }, this.on(document, "dataStorageItem", this.processUserStorageItem), this.on(document, "TD.ready", this.loadUserData), this.on(document, "dataTwitterClientChanged", this.resetUserData), this.on(document, "dataStorageFull", this.pruneUsers)
        })
    }
    return e
}), define("data/typeahead/with_topics_datasource", [], function() {
    var e = function() {
        this.defaultAttrs({
            storageTopicsHash: "typeaheadTopicsHash",
            storageTopicsLastPrefetch: "typeaheadTopicsLastPrefetch"
        }), this.topicSortComparator = function(e, t) {
            return t.rounded_score - e.rounded_score
        }, this.overwriteTopics = function(e) {
            this.topicsHash = {}, this.topicsAdjacencyList = {}, this.processTopicData(e)
        }, this.processTopicData = function(e) {
            _.each(e, function(e) {
                var t = e.topic;
                this.topicsHash[t] = e, e.tokens.forEach(function(e) {
                    var i = e.token.charAt(0).toLowerCase(),
                        s = this.topicsAdjacencyList[i] || []; - 1 === s.indexOf(t) && s.push(t), this.topicsAdjacencyList[i] = s
                }, this)
            }, this);
            var t = {};
            t[this.attr.storageTopicsHash] = this.topicsHash, this.trigger("dataStorageSet", t)
        }, this.processPrefetchTopicData = function(e) {
            this.processTopicData(e.topics), this.topicsLastPrefetch = Date.now();
            var t = {};
            t[this.attr.storageTopicsLastPrefetch] = this.topicsLastPrefetch, this.trigger("dataStorageSet", t)
        }, this.pruneTopics = function() {
            var e = _.values(this.topicsHash);
            e.sort(this.topicSortComparator), e = e.slice(0, Math.floor(e.length / 2)), this.overwriteTopics(e)
        }, this.getTopicSuggestions = function(e, t) {
            var i = e.query.toLowerCase(),
                s = this.topicsAdjacencyList[i.charAt(0)] || [],
                n = s.filter(function(e) {
                    return 0 === e.toLowerCase().indexOf(i)
                }, this);
            return n = this.getTopicObjectsFromStrings(n), n.sort(this.topicSortComparator), n = n.slice(0, t)
        }, this.getTopicObjectsFromStrings = function(e) {
            var t = [];
            return e.forEach(function(e) {
                var i = this.topicsHash[e];
                i && t.push(i)
            }, this), t
        }, this.prefetchTopicsSuggestions = function() {
            var e = this.getTwitterClient();
            e.typeaheadSearch({
                query: "",
                prefetch: !0,
                limit: 200,
                datasources: ["topics"]
            }, this.processPrefetchTopicData.bind(this), this.handleGetSuggestionsError.bind(this))
        }, this.processTopicStorageItem = function(e, t) {
            switch (t.name) {
                case this.attr.storageTopicsHash:
                    this.processTopicData(t.value);
                    break;
                case this.attr.storageTopicsLastPrefetch:
                    this.topicsLastPrefetch = t.value, (!this.topicsLastPrefetch || Date.now() - this.topicsLastPrefetch > TD.constants.time.oneDay) && this.prefetchTopicsSuggestions();
                    break;
                default:
            }
        }, this.loadTopicsData = function() {
            this.trigger("dataStorageGet", {
                names: [this.attr.storageTopicsHash, this.attr.storageTopicsLastPrefetch]
            })
        }, this.resetTopicData = function(e, t) {
            t.client && (this.overwriteTopics([]), this.prefetchTopicsSuggestions())
        }, this.after("initialize", function() {
            this.topicsHash = {}, this.topicsAdjacencyList = {}, this.datasources = this.datasources || {}, this.datasources.topics = {
                getSuggestions: this.getTopicSuggestions.bind(this),
                processData: this.processTopicData.bind(this)
            }, this.on(document, "dataStorageItem", this.processTopicStorageItem), this.on(document, "TD.ready", this.loadTopicsData), this.on(document, "dataTwitterClientChanged", this.resetTopicData), this.on(document, "dataStorageFull", this.pruneTopics)
        })
    };
    return e
}), define("data/typeahead/with_recent_searches_datasource", [], function() {
    var e = function() {
        this.tokenize = function(e) {
            return e.trim().toLowerCase().split(TD.constants.regexps.tokenSeparator)
        }, this.getRecentSearchSuggestions = function(e, t) {
            if (this.trigger("uiNeedsRecentSearches"), !this.recentSearches) return [];
            var i = this.recentSearches,
                s = this.tokenize(e.query),
                n = i.filter(function(e) {
                    var t = this.tokenize(e),
                        i = this.recentSearchMatchesQuery(t, s);
                    return i
                }, this);
            return n.slice(0, t)
        }, this.recentSearchMatchesQuery = function(e, t) {
            var i = t.every(function(t) {
                return e.some(function(e) {
                    return 0 === e.indexOf(t)
                })
            });
            return i
        }, this.handleRecentSearches = function(e, t) {
            t && t.recentSearches && (this.recentSearches = t.recentSearches)
        }, this.processRecentSearchData = function() {}, this.after("initialize", function() {
            this.datasources = this.datasources || {}, this.datasources.recentSearches = {
                getSuggestions: this.getRecentSearchSuggestions.bind(this),
                processData: this.processRecentSearchData.bind(this)
            }, this.on(document, "dataRecentSearches", this.handleRecentSearches)
        })
    };
    return e
}), define("data/typeahead/with_saved_searches_datasource", [], function() {
    var e = function() {
        this.tokenize = function(e) {
            return e.trim().toLowerCase().split(TD.constants.regexps.tokenSeparator)
        }, this.savedSearchesComparator = function(e, t) {
            var i = e.query.toLowerCase(),
                s = t.query.toLowerCase();
            return (i > s) - (s > i)
        }, this.updateSavedSearches = function() {
            var e = Date.now() - TD.constants.time.oneHour;
            if (!this.savedSearchesLastFetch || e > this.savedSearchesLastFetch) {
                var t = this.getClientsByService("twitter");
                this.savedSearches = [], t.forEach(function(e) {
                    this.savedSearches = this.savedSearches.concat(e.searches)
                }, this), this.savedSearchesLastFetch = Date.now()
            }
        }, this.getSavedSearchSuggestions = function(e) {
            if ("" === e.query.trim()) return [];
            var t = e.datasources && e.datasources.some(function(e) {
                return "savedSearches" === e
            });
            if (!t) return [];
            var i = [],
                s = this.tokenize(e.query);
            return this.updateSavedSearches(), this.savedSearches.forEach(function(e) {
                var t = this.tokenize(e.query),
                    n = this.savedSearchMatchesQuery(t, s);
                n && i.push(e)
            }, this), i.sort(this.savedSearchesComparator), i.splice(this.attr.limit), i
        }, this.savedSearchMatchesQuery = function(e, t) {
            return t.every(function(t) {
                return e.some(function(e) {
                    return 0 === e.indexOf(t)
                })
            })
        }, this.processSavedSearchData = function() {}, this.after("initialize", function() {
            this.savedSearches = [], this.savedSearchesLastFetch = !1, this.datasources = this.datasources || {}, this.datasources.savedSearches = {
                getSuggestions: this.getSavedSearchSuggestions.bind(this),
                processData: this.processSavedSearchData.bind(this)
            }
        })
    };
    return e
}), define("data/typeahead/with_lists_datasource", [], function() {
    var e = function() {
        this.getListSuggestions = function(e, t) {
            var i = e.query.trim().toLowerCase();
            if (this.trigger("uiNeedsSubscribedLists"), !this.lists) return [];
            var s = this.lists.filter(function(e) {
                var t = -1 !== e.user.screenName.toLowerCase().indexOf(i) || -1 !== e.name.toLowerCase().indexOf(i);
                return t
            }, this);
            return s.slice(0, t)
        }, this.handleSubscribedLists = function(e, t) {
            t && t.lists && (this.lists = t.lists)
        }, this.processListData = function() {}, this.after("initialize", function() {
            this.datasources = this.datasources || {}, this.datasources.lists = {
                getSuggestions: this.getListSuggestions.bind(this),
                processData: this.processListData.bind(this)
            }, this.on(document, "dataSubscribedLists", this.handleSubscribedLists)
        })
    };
    return e
}), define("data/typeahead", ["flight/lib/component", "data/with_client", "data/typeahead/with_users_datasource", "data/typeahead/with_topics_datasource", "data/typeahead/with_recent_searches_datasource", "data/typeahead/with_saved_searches_datasource", "data/typeahead/with_lists_datasource"], function(e, t, i, s, n, r, o) {
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
        }), this.getLimit = function(e, t) {
            if (!e) throw Error("Please provide datasource limits.");
            return t = t || "default", e[t] || (t = "default"), e[t]
        }, this.sendSuggestions = function() {
            this.trigger("dataTypeaheadSuggestions", {
                query: this.currentRequest.query,
                suggestions: this.dedupeSuggestions(this.suggestions),
                datasources: this.currentRequest.datasources,
                dropdownId: this.currentRequest.dropdownId
            })
        }, this.dedupeSuggestions = function(e) {
            var t = {};
            return e = _.clone(e), e.recentSearches = this.dedupeArray(e.recentSearches, null, t), e.savedSearches = this.dedupeArray(e.savedSearches, "query", t), e.topics = this.dedupeArray(e.topics, "topic", t), e
        }, this.dedupeArray = function(e, t, i) {
            return e && 0 !== e.length ? _.filter(e, function(e) {
                var s = t ? e[t] : e,
                    n = s.toLowerCase(),
                    r = !i[n];
                return i[n] = !0, r
            }) : e
        }, this.processTypeaheadData = function(e, t) {
            t.query === this.currentRequest.query && (t.datasources.forEach(function(t) {
                var i = this.datasources[t],
                    s = e[t],
                    n = this.getLimit(this.attr.limits, t);
                i && s && (i.processData(s), this.suggestions[t] = i.getSuggestions(this.currentRequest, n))
            }, this), this.sendSuggestions())
        }, this.updateSuggestions = function() {
            this.currentRequest && this.currentRequest.datasources && (this.currentRequest.datasources.forEach(function(e) {
                var t = this.datasources[e],
                    i = this.getLimit(this.attr.limits, e);
                if (t) {
                    var s = t.getSuggestions(this.currentRequest, i);
                    s && s.length > 0 && (this.suggestions[e] = s)
                }
            }, this), this.sendSuggestions())
        }, this.handleGetSuggestionsError = function() {
            this.trigger("dataTypeaheadSuggestionsError")
        }, this._getRemoteSuggestions = function() {
            var e = this.getTwitterClient();
            this.currentRequest.query && "" !== this.currentRequest.query.trim() && void 0 !== e && e.typeaheadSearch(this.currentRequest, this.processTypeaheadData.bind(this), this.handleGetSuggestionsError.bind(this))
        }, this.getSuggestions = function(e, t) {
            t.query !== this.currentRequest.query && (this.currentRequest = {
                query: t.query,
                datasources: t.datasources,
                count: this.attr.count,
                dropdownId: t.dropdownId,
                limits: t.limits || {}
            }, this.suggestions = {}, this.updateSuggestions(), t.onlyLocalData || this.getRemoteSuggestions(t.type))
        }, this.queryReset = function() {
            this.currentRequest = {}
        }, this.getRemoteSuggestions = function(e) {
            e = e || "default", this.attr.timing[e] || (e = "default");
            var t = this.getRemoteSuggestionsByType[e];
            if (!t) throw Error("No matching remote suggestion debounce type.");
            return t()
        }, this.after("initialize", function() {
            this.currentRequest = {}, this.datasources = {}, this.suggestions = {}, this.getRemoteSuggestionsByType = _.reduce(this.attr.timing, function(e, t, i) {
                return e[i] = _.throttle(this._getRemoteSuggestions.bind(this), t, {
                    leading: !1
                }), e
            }, {}, this), this.on("uiNeedsTypeaheadSuggestions", this.getSuggestions), this.on("uiRecentSearchClearAction", this.updateSuggestions), this.on("dataTypeaheadQueryReset", this.queryReset)
        })
    };
    return e(a, t, i, s, n, r, o)
}), define("data/user_profile_social_proof", ["flight/lib/component", "data/with_client"], function(e, t) {
    function i() {
        this.handleUserProfileSocialProofFactory = function(e) {
            return function(t) {
                t.request = e, this.trigger(document, "dataUserProfileSocialProof", t)
            }
        }, this.handleErrorFactory = function(e) {
            return function() {
                var t = {
                    request: e
                };
                this.trigger(document, "dataUserProfileSocialProofError", t)
            }
        }, this.getUserProfileSocialProofData = function(e, t) {
            if (t && t.screenName) {
                var i = this.getTwitterClient();
                i.getFollowingFollowersOf(t.screenName, this.handleUserProfileSocialProofFactory(t).bind(this), this.handleErrorFactory(t).bind(this))
            }
        }, this.after("initialize", function() {
            this.on(document, "uiNeedsUserProfileSocialProof", this.getUserProfileSocialProofData)
        })
    }
    return e(i, t)
}), define("data/twitter_users", ["flight/lib/component", "data/with_client"], function(e, t) {
    var i = function() {
        this.handleTwitterUsersFactory = function(e) {
            var t = function(t) {
                this.trigger("dataTwitterUsers", {
                    requestId: e,
                    users: t
                })
            };
            return t.bind(this)
        }, this.handleTwitterUsersErrorFactory = function(e) {
            var t = function() {
                this.trigger("dataTwitterUsersError", {
                    requestId: e
                })
            };
            return t.bind(this)
        }, this.getTwitterUsers = function(e, t) {
            this.twitterClient = this.twitterClient || this.getTwitterClient(), this.twitterClient.getUsersByIds(t.userIds, this.handleTwitterUsersFactory(t.requestId), this.handleTwitterUsersErrorFactory(t.requestId))
        }, this.after("initialize", function() {
            this.on("uiNeedsTwitterUsers", this.getTwitterUsers)
        })
    };
    return e(i, t)
}), define("data/lists", ["flight/lib/component"], function(e) {
    var t = function() {
        this.getLists = function() {
            var e = TD.cache.lists.getAll();
            this.trigger(document, "dataSubscribedLists", {
                lists: e
            })
        }, this.after("initialize", function() {
            this.on(document, "uiNeedsSubscribedLists", this.getLists)
        })
    };
    return e(t)
}), define("data/account", ["flight/lib/component"], function(e) {
    var t = function() {
        this.handleReauthorizeTwitterAccount = function(e, t) {
            TD.controller.clients.addClient("twitter", t.account, !0)
        }, this.handleRemoveTwitterAccount = function(e, t) {
            TD.controller.clients.removeClient(t.key)
        }, this.after("initialize", function() {
            this.on(document, "uiRemoveTwitterAccount", this.handleRemoveTwitterAccount), this.on(document, "uiReauthorizeTwitterAccount", this.handleReauthorizeTwitterAccount)
        })
    };
    return e(t)
}), define("data/with_twitter_api", ["flight/lib/compose", "data/with_client"], function(e, t) {
    return function() {
        e.mixin(this, [t]), this.defaultAttrs({
            defaultBaseUrl: "https://api.twitter.com",
            defaultApiVersion: "1.1"
        }), this.wrapTwitterApiErrback = function(e) {
            return function(t) {
                var i = {
                    request: e.request,
                    response: t
                };
                "function" == typeof e.error ? e.error(i) : "string" == typeof e.error ? this.trigger(e.error, i) : this.trigger("dataTwitterApiError", {
                    error: "Unknown error"
                })
            }.bind(this)
        }, this.wrapTwitterApiCallback = function(e, t) {
            return function(i) {
                var s = {
                    request: e.request,
                    response: i
                };
                "function" == typeof e.success ? e.success(s) : "string" == typeof e.success ? this.trigger(e.success, s) : this.trigger("dataTwitterApiSuccess", s), e.processAsStreamData && t.processStreamData(i)
            }.bind(this)
        }, this.makeTwitterApiCall = function(e) {
            e = e || {};
            var t, i, s = [],
                n = this.getClientByAccountKey(e.request.accountKey),
                r = this.wrapTwitterApiErrback(e, n),
                o = this.wrapTwitterApiCallback(e, n);
            s.push(e.baseUrl || this.attr.defaultBaseUrl), s.push(e.apiVersion || this.attr.defaultApiVersion), s.push(e.resource), t = s.join("/"), i = e.method || "GET";
            try {
                n.makeTwitterCall(t, e.params, i, e.dataProcessor, o, r, e.feedType)
            } catch (a) {
                r()
            }
        }
    }
}), define("data/tweet", ["flight/lib/component", "data/with_twitter_api"], function(e, t) {
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
        }), this.sendTweet = function(e) {
            var t, i, s;
            try {
                switch (t = this.attr.resources[e.type], e.type) {
                    case "message":
                        i = {
                            text: e.text,
                            user_id: e.messageRecipient.userId,
                            screen_name: e.messageRecipient.screenName
                        }, s = function(e) {
                            return {
                                direct_message: e
                            }
                        };
                        break;
                    case "reply":
                        i = {
                            status: e.text,
                            in_reply_to_status_id: e.inReplyToStatusId
                        };
                        break;
                    case "tweet":
                        i = {
                            status: e.text
                        }
                }
                this.makeTwitterApiCall({
                    request: e,
                    resource: t.url,
                    method: t.method,
                    params: i,
                    success: "dataTweetSent",
                    error: "dataTweetError",
                    dataProcessor: s,
                    processAsStreamData: !0
                })
            } catch (n) {
                this.trigger("dataTweetError", {
                    request: e
                })
            }
        }, this.handleSendTweet = function(e, t) {
            t.file || this.sendTweet(t)
        }
    }
    return e(i, t)
}), define("data/tweetdeck_api", ["flight/lib/component", "data/with_client"], function(e, t) {
    function i() {
        this.defaultAttrs({
            apiRoot: null,
            mediaUploadUrl: "/oauth/media/twitter"
        }), this.after("initialize", function() {
            this.on(document, "uiSendTweet", this.handleSendTweet), this.on(document, "uiSendScheduledTweets", this.handleSendScheduledUpdates), this.on(document, "uiLoginRequest", this.handleLoginRequest)
        }), this.responseFactory = function(e, t) {
            return function(i) {
                this.trigger(e, {
                    response: i,
                    request: t
                })
            }.bind(this)
        }, this.handleSendTweet = function(e, t) {
            if (t.file) {
                var i, s = this.getClientByAccountKey(t.accountKey),
                    n = s.oauth.account,
                    r = new FormData;
                switch (t.type) {
                    case "reply":
                        r.append("status", t.text), r.append("in_reply_to_status_id", t.inReplyToStatusId);
                        break;
                    case "tweet":
                        r.append("status", t.text)
                }
                r.append("media[]", t.file), i = TD.net.ajax.upload(this.attr.apiRoot + this.attr.mediaUploadUrl, r, n), i.addCallbacks(this.responseFactory("dataTweetSent", t), this.responseFactory("dataTweetError", t))
            }
        }, this.handleSendScheduledUpdates = function(e, t) {
            var i = this.getTweetDeckClient(),
                s = t.requests.map(function(e) {
                    var t = this.getAccountData(e.accountKey),
                        i = {
                            body: e.text
                        };
                    switch (e.type) {
                        case "tweet":
                            i.type = "tweet";
                            break;
                        case "reply":
                            i.type = "tweet", i.in_reply_to_status_id = e.inReplyToStatusId;
                            break;
                        case "message":
                            i.type = "direct_message", i.screen_name = e.messageRecipient.screenName
                    }
                    return {
                        service: "twitter",
                        user: {
                            id: t.id
                        },
                        update: i,
                        meta: {
                            user: {
                                name: t.screenName,
                                avatar_url: t.profileImageUrl
                            }
                        }
                    }
                }.bind(this)),
                n = i.scheduleGroup(s, t.scheduledDate, t.tokenToDelete);
            n.addCallbacks(this.responseFactory("dataScheduledTweetsSent", t), this.responseFactory("dataScheduledTweetsError", t))
        }, this.handleLoginRequest = function(e, t) {
            var i = TD.storage.accountController.loginTwitter(t.username, t.password);
            return i.addCallback(function(e, t) {
                e.stay_signed_in = t, $(document).trigger("dataLoginAuthSuccess", e)
            }), i
        }
    }
    return e(i, t)
}), define("data/touch_controller", ["flight/lib/component"], function(e) {
    var t = function() {
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
            this.on(document, "dataDeciderUpdated", this.handleUpdateCompose), this.on(document, "dataDeciderUpdated", this.handleUpdateFontSize), this.on(document, "dataDeciderUpdated", this.handleUpdateSearch), this.on(document, "dataDeciderUpdated", this.handleUpdateSidebar), this.on(document, "dataDeciderUpdated", this.handleUpdateTweetControls)
        })
    };
    return e(t)
}), define("ui/with_key_handler", [], function() {
    function e() {
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
        }), this.getShortcutForEvent = function(e) {
            var t, i = e.which;
            return this.eventHasModifier(e) && (t = this.combos[i]), !t && !this.eventHasFunctionModifier(e) && (t = this.activeSequences[i] || this.singleKeys[i] || this.sequenceStarters[i]), t
        }, this.clearActiveSequences = function() {
            this.activeSequences = {}
        }, this.eventHasModifier = function(e) {
            return e.ctrlKey || e.altKey || e.metaKey || e.shiftKey
        }, this.eventHasFunctionModifier = function(e) {
            return e.ctrlKey || e.metaKey
        }, this.eventHasTextModifier = function(e) {
            return e.altKey || e.shiftKey
        }, this.getModifiedKeyEvent = function(e, t) {
            var i;
            return this.eventHasModifier(e) && t.modifiers && _.each(t.modifiers, function(t, s) {
                e[s] && (i = t)
            }, this), i
        }, this.handleKeyPress = function(e) {
            var t, i = [],
                s = ":not(input):not(textarea)";
            e.which >= 65 && 90 >= e.which && (e.which += 32), t = this.getShortcutForEvent(e), t ? t.sequences ? (_.each(t.sequences, function(e, t) {
                this.addSequenceEnd(t, e)
            }, this), setTimeout(function() {
                this.clearActiveSequences()
            }.bind(this), this.attr.keySequenceTimeoutDelay)) : (i = t.shortcuts || [t], i = i.map(function(t) {
                return t.modifiers && (t = this.getModifiedKeyEvent(e, t)), t
            }, this), i = i.filter(function(e) {
                return void 0 !== e
            }), i.forEach(function(t) {
                var i = t.selector || s;
                $(e.target).is(i) && t.callback(e, t.data)
            }), this.clearActiveSequences()) : this.clearActiveSequences()
        }, this.getCharCodeForKey = function(e) {
            var t, i = !1,
                s = [
                    [32, 64],
                    [91, 126]
                ];
            if ("string" != typeof e) throw "Key must be a string";
            return e = e.toLowerCase(), 1 === e.length ? (t = e.charCodeAt(0), s.forEach(function(e) {
                return t >= e[0] && e[1] >= t ? (i = !0, !1) : void 0
            }), i || (t = void 0)) : t = this.attr.charCodes[e], t
        }, this.addSingleKey = function(e, t, i, s) {
            var n;
            if ("function" != typeof t) throw "addSingleKey: no callback";
            if (n = this.getCharCodeForKey(e), void 0 === n) throw "addSingleKey: invalid key string";
            if (this.singleKeys[n]) {
                var r = this.singleKeys[n].shortcuts.every(function(e) {
                    return t !== e.callback || i !== e.selector
                }, this);
                if (!r) throw "addSingleKey: attempted to add identical shortcut"
            } else this.singleKeys[n] = {
                shortcuts: []
            };
            this.singleKeys[n].shortcuts.push({
                shortcut: e,
                callback: t,
                selector: i,
                data: s
            })
        }, this.addSequence = function(e, t, i, s) {
            var n, r, o;
            if ("function" != typeof t) throw "addSequence: no callback";
            if ("string" != typeof e) throw "addSequence: sequence must be a string";
            if (n = e.split(" "), 2 !== n.length) throw 'addSequence: sequence should be in format "g a"';
            if (r = this.getCharCodeForKey(n[0]), void 0 === r) throw 'addSequence: sequence should be in format "g a"';
            if (o = this.getCharCodeForKey(n[1]), void 0 === o) throw 'addSequence: sequence should be in format "g a"';
            this.sequenceStarters[r] || (this.sequenceStarters[r] = {
                sequences: {}
            }), this.sequenceStarters[r].sequences[n[1]] = {
                shortcut: e,
                callback: t,
                selector: i,
                data: s
            }
        }, this.addSequenceEnd = function(e, t) {
            var i;
            if ("function" != typeof t.callback) throw "addSequenceEnd: no callback";
            if ("string" != typeof e) throw "addSequenceEnd: invalid shortcut key";
            if (i = this.getCharCodeForKey(e), void 0 === i) throw "addSequenceEnd: invalid shortcut key";
            this.activeSequences[i] = {
                shortcut: t.shortcut,
                callback: t.callback,
                selector: t.selector,
                data: t.data
            }
        }, this.addCombo = function(e, t, i, s) {
            var n, r, o;
            if ("function" != typeof t) throw "addCombo: no callback";
            if ("string" != typeof e) throw "addCombo: invalid combo string";
            if (n = e.split("+"), 2 !== n.length) throw "addCombo: invalid combo";
            if (r = this.attr.modifiers[n[0].toLowerCase()], void 0 === r) throw "addCombo: invalid modifier";
            if (o = this.getCharCodeForKey(n[1]), void 0 === o) throw "addCombo: invalid shortcut key";
            var a = {
                modifiers: {}
            };
            a.modifiers[r] = {
                shortcut: e,
                callback: t,
                selector: i,
                data: s
            }, this.combos[o] || (this.combos[o] = {
                shortcuts: []
            }), this.combos[o].shortcuts.push(a)
        }, this.isSequence = function(e) {
            return "string" == typeof e && e.indexOf(" ") > 0
        }, this.isCombo = function(e) {
            return "string" == typeof e && e.indexOf("+") > 0
        }, this.addShortcut = function(e, t, i, s) {
            3 === arguments.length && "string" != typeof i && (s = i, i = void 0), this.isCombo(e) ? this.addCombo(e, t, i, s) : this.isSequence(e) ? this.addSequence(e, t, i, s) : this.addSingleKey(e, t, i, s)
        }, this.removeSingleKey = function(e) {
            var t = this.getCharCodeForKey(e);
            this.singleKeys[t] && delete this.singleKeys[t]
        }, this.removeCombo = function(e) {
            var t = this.getCharCodeForKey(e.split("+")[1]);
            this.combos[t] && delete this.combos[t]
        }, this.removeSequence = function(e) {
            var t = this.getCharCodeForKey(e.split(" ")[0]);
            this.sequenceStarters[t] && delete this.sequenceStarters[t]
        }, this.removeShortcut = function(e) {
            this.isCombo(e) ? this.removeCombo(e) : this.isSequence(e) ? this.removeSequence(e) : this.removeSingleKey(e)
        }, this.handleKeyDown = function(e) {
            var t = [this.attr.charCodes.del, this.attr.charCodes.bksp, this.attr.charCodes.esc, this.attr.charCodes.ret, this.attr.charCodes.left, this.attr.charCodes.right, this.attr.charCodes.up, this.attr.charCodes.down, this.attr.charCodes.pagedown, this.attr.charCodes.pageup, this.attr.charCodes.home, this.attr.charCodes.end],
                i = t.some(function(t) {
                    return t === e.which
                });
            i && this.handleKeyPress(e)
        }, this.after("initialize", function() {
            this.on(window, "keypress", this.handleKeyPress), this.on(window, "keydown", this.handleKeyDown)
        })
    }
    return e
}), define("ui/keyboard_shortcuts", ["flight/lib/component", "ui/with_key_handler"], function(e, t) {
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
                }],
                n: [{
                    event: "uiShowCompose"
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
        }), this.blurInput = function(e) {
            $(e.target).blur()
        }, this.shortcutEventHandlerFactory = function(e) {
            var t, i, s = function(t) {
                    t.preventDefault(), t.stopPropagation(), this.trigger(t.target, e.event, {
                        keyboardShortcut: !0
                    })
                }.bind(this);
            return e.throttle ? t = _.throttle(s, 100) : i = _.debounce(s, 200, !0)
        }, this.columnFocusFactory = function(e) {
            return function(t) {
                t.preventDefault(), t.stopPropagation(), 0 === e ? this.trigger("uiColumnFocus", {
                    last: !0
                }) : this.trigger("uiColumnFocus", {
                    index: e - 1
                })
            }.bind(this)
        }, this.after("initialize", function() {
            this.on(document, "uiInputBlur", this.blurInput);
            for (var e = 0; 10 > e; e++) this.addShortcut(e + "", this.columnFocusFactory(e));
            _.each(this.attr.shortcuts, function(e, t) {
                e.forEach(function(e) {
                    var i = this.shortcutEventHandlerFactory(e);
                    this.addShortcut(t, i, e.selector)
                }, this)
            }, this)
        })
    };
    return e(i, t)
}), define("ui/with_template", [], function() {
    function e() {
        this.render = function(e, t) {
            this.$node.html(this.toHtml(e, t))
        }, this.renderTemplate = function(e, t) {
            return $(TD.ui.template.render(e, t))
        }, this.toHtml = function(e, t) {
            return TD.ui.template.render(e, t)
        }, this.toHtmlFromRaw = function(e, t) {
            var i = Hogan.compile(e);
            return i.render(t)
        }
    }
    return e
}), define("ui/message_banner", ["flight/lib/component", "ui/with_template"], function(e, t) {
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
        }), this.eventHandlerFactory = function(e) {
            return function() {
                switch (e.action) {
                    case "trigger-event":
                        this.trigger(e.event.type, e.event.data);
                        break;
                    case "url-ext":
                    case "dismiss":
                }
                this.trigger("uiClickMessageButtonAction", {
                    messageId: this.message.id,
                    actionId: e.id
                }), this.hide()
            }.bind(this)
        }, this.dismiss = function() {
            this.trigger("uiDismissMessageAction", this.message), this.hide()
        }, this.hide = function() {
            window.clearInterval(this.resizeBannerCheckInterval), this.trigger("uiHidingMessageBanner", this.message), this.message = null
        }, this.handleMessageData = function(e, t) {
            this.message && this.message.id == t.message.id || (this.message = t.message, this.showMessage())
        }, this.handleMessageContainerHidden = function() {
            this.$node.addClass("is-hidden")
        }, this.showMessage = function() {
            this.trigger("uiShowMessageBanner", this.message);
            var e, t, i, s = {
                    text: this.message.text,
                    actions: []
                };
            for (t = 0; this.message.actions && this.message.actions.length > t; t++) switch (e = this.message.actions[t], i = e.class, e.action) {
                case this.attr.actions.openUrl:
                    s.actions.push({
                        label: e.label,
                        action: e.action,
                        actionId: e.id,
                        url: e.url,
                        isExternalUrl: !0,
                        boundEventHandler: this.eventHandlerFactory(e),
                        buttonClass: i || this.attr.buttonClasses[e.action]
                    });
                    break;
                case this.attr.actions.triggerEvent:
                    s.actions.push({
                        label: e.label,
                        action: e.action,
                        actionId: e.id,
                        boundEventHandler: this.eventHandlerFactory(e),
                        buttonClass: i || this.attr.buttonClasses[e.action]
                    });
                    break;
                case this.attr.actions.dismiss:
                    s.actions.push({
                        label: e.label,
                        action: e.action,
                        actionId: e.id,
                        boundEventHandler: this.eventHandlerFactory(e),
                        buttonClass: i || this.attr.buttonClasses[e.action]
                    });
                    break;
                default:
            }
            this.render("topbar/message_banner", s), this.message.colors && this.$node.css({
                "background-color": this.message.colors.background,
                color: this.message.colors.foreground
            }), this.on(this.select("dismissButton"), "click", this.dismiss), s.actions.forEach(function(e) {
                this.on('[data-action-id="' + e.actionId + '"]', "click", e.boundEventHandler)
            }.bind(this)), this.resizeBannerCheckInterval = window.setInterval(function() {
                this.currentBannerHeight && this.currentBannerHeight !== this.$node.outerHeight() && this.trigger("uiMessageBannerResized"), this.currentBannerHeight = this.$node.outerHeight()
            }.bind(this), 200), this.$node.removeClass("is-hidden"), this.trigger("uiMessageBannerShown", this.message)
        }, this.after("initialize", function() {
            this.on(document, "dataMessage", this.handleMessageData), this.on(document, "uiMessageBannerContainerHidden", this.handleMessageContainerHidden)
        })
    };
    return e(i, t)
}), define("ui/search_input", ["flight/lib/component"], function(e) {
    var t = function() {
        this.defaultAttrs({
            clearButtonSelector: ".js-clear-search",
            textInputSelector: 'input[type="text"]',
            hasValueClass: "has-value",
            isWaitingForResponseClass: "is-waiting-for-response"
        }), this.handleClearAction = function() {
            this.$textInput.val(""), this.$node.removeClass(this.attr.hasValueClass), this.$textInput.trigger("change")
        }, this.handleAsyncFormReceivedResponse = function() {
            var e = this.$textInput.val();
            this.$node.removeClass(this.attr.isWaitingForResponseClass), "" !== e ? this.$node.addClass(this.attr.hasValueClass) : this.$node.removeClass(this.attr.hasValueClass), this.value = e
        }, this.handleAsyncFormWaitingForResponse = function() {
            var e = this.$textInput.val();
            void 0 !== this.value && this.value !== e && this.$node.addClass(this.attr.isWaitingForResponseClass), this.value = e
        }, this.after("initialize", function() {
            this.$textInput = this.select("textInputSelector"), this.value = this.$textInput.val().trim(), "" !== this.value && this.$node.addClass(this.attr.hasValueClass), this.on("click", {
                clearButtonSelector: this.handleClearAction
            }), this.on("uiAsyncFormWaitingForResponse", this.handleAsyncFormWaitingForResponse), this.on("uiAsyncFormReceivedResponse", this.handleAsyncFormReceivedResponse), this.on("uiSearchInputDestroy", this.teardown)
        })
    };
    return e(t)
}), define("ui/asynchronous_form", ["flight/lib/component", "ui/search_input"], function(e, t) {
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
            this.on("uiReceivedAsyncResponse", this.receivedAsyncResponse), this.on("uiWaitingForAsyncResponse", this.waitingForAsyncResponse), this.on("uiDestroyAsynchronousForm", this.destroy), this.on("uiSearchInputCleared", this.handleSearchInputCleared), this.$searchControls = this.select("searchControlSelector"), t.attachTo(this.$searchControls)
        })
    };
    return e(i)
}), define("ui/app_search", ["flight/lib/component", "ui/asynchronous_form"], function(e, t) {
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
            t.attachTo(this.$node, {
                source: "appSearch"
            }), this.$input = this.select("appSearchInputSelector"), this.on(this.$input, "keyup keydown keypress paste", this.modifierKeyPressed), this.on(this.$input, "focus", this.handleFocus), this.on(this.$input, "uiInputBlur", function() {
                this.$input.blur()
            }), this.on(this.$input, "click", function(e) {
                e.stopPropagation()
            }), this.on(this.select("searchButtonSelector"), "click", function() {
                this.trigger(this.$input, "uiSearchInputSubmit", {
                    query: this.$input.val()
                })
            }), this.on(this.select("clearButtonSelector"), "click", this.handleClearSearchAction), this.on("uiAppSearchSetPreventDefault", this.setPreventKeyDefault), this.on("uiAppSearchItemComplete", this.completeInput), this.on("uiAppSearchSubmit", this.handleAppSearchSubmit), this.on(document, "uiNewSearchQuery uiSearchInputChanged", this.handleSearchInputChanged)
        }), this.handleSearchInputChanged = function(e, t) {
            t.source !== this.attr.sourceId && (this.$input.val(t.query), this.currentQuery = t.query)
        }, this.handleAppSearchSubmit = function(e, t) {
            this.completeInput(e, t), this.trigger(this.$input, "uiSearchInputSubmit", {
                query: this.$input.val()
            })
        }, this.around("trigger", function() {
            var e, t = [].slice.call(arguments),
                i = t.shift();
            "string" != typeof t[t.length - 1] && (e = t.pop()), void 0 === e ? e = {
                source: this.attr.sourceId
            } : e.source = this.attr.sourceId, t.push(e), i.apply(this, t)
        }), this.setPreventKeyDefault = function(e, t) {
            this.attr.KEY_CODE_MAP[t.key].preventDefault = t.preventDefault
        }, this.handleFocus = function() {
            _.defer(this.$input.select.bind(this.$input)), this.trigger(this.$input, "uiSearchInputFocus", {
                query: this.$input.val()
            })
        }, this.modifierKeyPressed = function(e) {
            var t = this.$input.val();
            t = "" === t.trim() ? "" : t;
            var i = this.attr.KEY_CODE_MAP[e.which || e.keyCode];
            if (i) {
                if (e.type !== i.on) return;
                i.preventDefault && e.preventDefault(), this.trigger(this.$input, i.event, {
                    query: t
                })
            } else this.setQueryAndTriggerUpdateEvent(t)
        }, this.completeInput = function(e, t) {
            "user" === t.searchType && (t.query = "@" + t.query), this.trigger("uiAppSearchSetQuery", {
                data: t.query
            }), this.$input.val(t.query), this.setQueryAndTriggerUpdateEvent(t.query), this.focusInput(), this.$input[0].selectionStart = t.query.length, this.$input[0].selectionEnd = t.query.length
        }, this.setQueryAndTriggerUpdateEvent = function(e) {
            this.currentQuery && this.currentQuery === e || (this.currentQuery = e, this.trigger(this.$input, "uiSearchInputChanged", {
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
    return e(i)
}), define("ui/with_column_selectors", [], function() {
    var e = function() {
        this.defaultAttrs({
            columnStateDetailViewClass: "js-column-state-detail-view",
            columnStateSocialProofClass: "js-column-state-social-proof",
            columnSelector: ".js-app-columns .js-column",
            columnUpdateGlow: ".js-column-update-glow",
            scrollContainerSelector: ".js-column-scroller",
            columnDetailScrollerSelector: ".js-detail-container",
            columnOptionsSelector: ".js-column-options",
            columnHeaderSelector: ".js-column-header"
        }), this.getColumnScrollContainerByKey = function(e) {
            var t = this.getColumnElementByKey(e),
                i = t.find(this.attr.columnDetailScrollerSelector);
            return i.length > 0 ? i : t.find(this.attr.scrollContainerSelector)
        }, this.getColumnElementByKey = function(e) {
            return this.select("columnSelector").filter('[data-column="' + e + '"]')
        }, this.getKeyForColumnAtIndex = function(e) {
            return this.select("columnSelector").eq(e).attr("data-column")
        }, this.getKeyForLastColumn = function() {
            return this.select("columnSelector").last().attr("data-column")
        }
    };
    return e
}), define("ui/with_transitions", [], function() {
    var e = function() {
        this.animateHeight = function(e, t, i, s) {
            var n, r, o = e.height(),
                a = function() {
                    e.trigger("uiTransitionExpandEnd"), "function" == typeof i && i(), e.removeClass(t), "collapse" === s && e.css("height", "")
                };
            "expand" === s ? (e.height(0), n = o) : n = 0, r = 0 === n ? -1 * o : n, e.addClass(t), _.defer(function() {
                e.height(n), e.trigger("uiTransitionExpandStart", {
                    delta: r
                }), TD.ui.main.TRANSITION_END_EVENTS ? e.one(TD.ui.main.TRANSITION_END_EVENTS, a) : a()
            }.bind(this))
        }, this.transitionExpand = function(e, t, i) {
            this.animateHeight(e, t, i, "expand")
        }, this.transitionCollapse = function(e, t, i) {
            this.animateHeight(e, t, i, "collapse")
        }, this.transitionTop = function(e, t, i, s) {
            var n = function() {
                e.removeClass(t), "function" == typeof s && s()
            };
            e.addClass(t), e.css("top", i), TD.ui.main.TRANSITION_END_EVENTS ? e.one(TD.ui.main.TRANSITION_END_EVENTS, n) : n()
        }
    };
    return e
}), define("ui/with_text_utils", ["flight/lib/compose", "ui/with_template"], function(e, t) {
    function i() {
        e.mixin(this, [t]), this.highlightSubstring = function(e, t) {
            var i, s, n = -1;
            return t && (n = e.toLowerCase().indexOf(t.toLowerCase())), -1 !== n ? (s = {
                before: e.substr(0, n),
                highlight: e.substr(n, t.length),
                after: e.substr(n + t.length)
            }, i = this.toHtmlFromRaw("{{before}}<b>{{highlight}}</b>{{after}}", s)) : i = this.toHtmlFromRaw("{{text}}", {
                text: e
            }), i
        }, this.prettyNumber = function(e) {
            return TD.util.prettyNumber(e)
        }
    }
    return i
}), define("ui/with_user_menu", [], function() {
    var e = function() {
        this.defaultAttrs({
            userMenuButtonSelector: ".js-profile-menu"
        }), this.showUserMenu = function(e, t, i) {
            var s = !0;
            return this.userMenu && (s = i.id !== this.userMenu.user.id, this.userMenu.destroy()), s && (this.userMenu = new TD.components.ProfileMenu(t, TD.components.DropDown.POSITION_LEFT, i), e.stopPropagation()), s
        }, this.handleUserMenuButtonClick = function(e) {
            for (var t, i = $(e.target).closest(this.attr.userMenuButtonSelector), s = "" + i.data("user-id"), n = 0; this.users.length > n; n++)
                if (this.users[n].id === s) {
                    t = this.users[n];
                    break
                }
            this.showUserMenu(e, i, t)
        }, this.destroyMenuReference = function(e, t) {
            t.target === this.userMenu && (this.userMenu = null)
        }, this.hideUserMenu = function() {
            this.userMenu && this.userMeny.destroy()
        }, this.before("teardown", function() {
            this.userMenu && this.userMenu.destroy()
        }), this.after("initialize", function() {
            this.userMenu = null, this.on("td-dropdown-close", this.destroyMenuReference), this.on("click", {
                userMenuButtonSelector: this.handleUserMenuButtonClick
            })
        })
    };
    return e
}), define("ui/social_proof_for_tweet", ["flight/lib/component", "ui/with_template", "ui/with_text_utils", "ui/with_user_menu"], function(e, t, i, s) {
    var n = function() {
        this.defaultAttrs({
            columnBackSelector: ".js-tweet-social-proof-back",
            headerLinkClass: "js-tweet-social-proof-back",
            templateName: "status/social_proof_for_tweet"
        }), this.handleTwitterUsers = function(e, t) {
            t.requestId === this.requestId && (this.renderParams.users = t.users, this.users = t.users, this.render(this.attr.templateName, this.renderParams))
        }, this.close = function() {
            this.trigger("uiSocialProofForTweetClosed"), this.teardown()
        }, this.after("initialize", function() {
            var e, t, i;
            this.on("uiSocialProofForTweetClose", this.close), this.on("click", {
                columnBackSelector: this.close
            }), this.on(document, "dataTwitterUsers", this.handleTwitterUsers), this.userIds = this.attr.tweetSummary[this.attr.type], "retweeters" === this.attr.type ? (t = "Retweeted", i = this.attr.tweetSummary.retweeters_count) : (t = "Favorited", i = this.attr.tweetSummary.favoriters_count), e = parseInt(i, 10) > 1 ? TD.i("{{action}} {{n}} times", {
                n: this.prettyNumber(i),
                action: t
            }) : TD.i("{{action}} once", {
                action: t
            }), this.renderParams = {
                title: e,
                columntitle: TD.i("Tweet"),
                headerLinkClass: this.attr.headerLinkClass,
                withUserMenu: !0
            }, this.render(this.attr.templateName, this.renderParams), this.requestId = _.uniqueId("twitterUsers"), this.trigger("uiNeedsTwitterUsers", {
                requestId: this.requestId,
                userIds: this.userIds
            })
        })
    };
    return e(n, t, i, s)
}), define("ui/column", ["flight/lib/component", "ui/social_proof_for_tweet", "ui/with_column_selectors", "ui/with_template", "ui/with_transitions", "ui/asynchronous_form"], function(e, t, i, s, n, r) {
    var o = function() {
        this.defaultAttrs({
            columnMessageSelector: ".js-column-message",
            columnMessageTemplate: "column/column_message",
            filterErrorTemplate: "column/column_filter_error",
            filterErrorClass: "filter-error",
            hasFiltersClass: "has-filters",
            showDetailViewClass: "is-shifted-1",
            showSocialProofClass: "is-shifted-2",
            socialProofSelector: ".js-column-social-proof",
            columnStateDefault: "default",
            columnStateDetailView: "detailView",
            columnStateSocialProof: "socialProof",
            columnScrollerIsAnimatingClass: "is-column-scroller-animating",
            isNewClass: "is-new",
            chirpSelector: ".js-stream-item",
            animatingClass: "is-animating",
            focusId: null,
            tweetImpressionTrackingPeriod: 100
        }), this.setColumnState = function(e) {
            switch (this.$node.removeClass([this.attr.showDetailViewClass, this.attr.columnStateDetailViewClass, this.attr.showSocialProofClass, this.attr.columnStateSocialProofClass].join(" ")), e) {
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
        }, this.handleShowSocialProof = function(e, i) {
            t.attachTo(this.$socialProofContainer, {
                type: i.type,
                tweetSummary: i.tweetSummary
            }), this.setColumnState(this.attr.columnStateSocialProof)
        }, this.handleSocialProofClosed = function() {
            this.setColumnState(this.attr.columnStateDetailView)
        }, this.handleCloseSocialProof = function() {
            this.trigger(this.$socialProofContainer, "uiSocialProofForTweetClose")
        }, this.handleColumnOptionsShown = function() {
            this.select("columnMessageSelector").html(""), r.attachTo(this.$columnOptions)
        }, this.handleColumnOptionsHidden = function() {
            this.column.hasActiveSearchFilters() && this.$node.find(this.attr.columnMessageSelector).animate({
                opacity: 1
            }, 150, "easeInOutQuad")
        }, this.handleHidingColumnOptions = function() {
            var e, t;
            this.trigger(this.$columnOptions, "uiDestroyAsynchronousForm"), this.column.hasActiveSearchFilters() ? (t = this.select("columnMessageSelector"), this.column.hasFilterError() ? (e = this.renderTemplate(this.attr.filterErrorTemplate), t.addClass(this.attr.filterErrorClass)) : (e = this.renderTemplate(this.attr.columnMessageTemplate, {
                action: this.column.hasActiveActionFilters() && !this.column.isSingleActionTypeColumn(),
                content: this.column.hasActiveContentFilters(),
                user: this.column.hasActiveUserFilters(),
                engagement: this.column.hasActiveEngagementFilters()
            }), t.removeClass(this.attr.filterErrorClass)), t.removeClass("is-hidden").css({
                opacity: 0
            }).html(e), this.$node.addClass(this.attr.hasFiltersClass), this.handleColumnOptionsTransitionStart(null, {
                delta: t.outerHeight()
            })) : this.$node.removeClass(this.attr.hasFiltersClass)
        }, this.handleShowingColumnOptions = function() {
            var e = this.$node,
                t = this.select("columnMessageSelector");
            e.hasClass(this.attr.hasFiltersClass) && this.handleColumnOptionsTransitionStart(null, {
                delta: -1 * t.outerHeight(),
                $column: e
            }), t.addClass("is-hidden")
        }, this.handleColumnOptionsTransitionStart = function(e, t) {
            var i = this.select("scrollContainerSelector"),
                s = this.select("columnUpdateGlow"),
                n = parseInt(i.css("top"), 10),
                r = function() {
                    i.data("isAnimating", !1)
                };
            i.data("isAnimating") === !0 ? this.targetTopPosition = this.targetTopPosition + t.delta : (i.data("isAnimating", !0), this.targetTopPosition = n + t.delta), this.transitionTop(i, this.attr.columnScrollerIsAnimatingClass, this.targetTopPosition, r), this.transitionTop(s, this.attr.columnScrollerIsAnimatingClass, this.targetTopPosition, r)
        }, this.handleShowDetailView = function(e, t) {
            var i, s;
            t.columnKey === this.columnKey && t.chirpId && (i = this.column.findChirp(t.chirpId), s = this.column.findMostInterestingChirp(t.chirpId), this.trigger("uiColumnFocus", {
                columnKey: t.columnKey
            }), s instanceof TD.services.TwitterAction || $.publish("chirp/action", ["viewDetails", s, i, this.column]))
        }, this.handleShowUserFilter = function() {
            this.trigger(this.$columnOptions, "uiShowUserFilter")
        }, this.handleShowContentFilter = function() {
            this.trigger(this.$columnOptions, "uiShowContentFilter")
        }, this.handleUpdateSearchFilter = function(e, t) {
            this.column.updateSearchFilter(t)
        }, this.handleUpdateMediaPreview = function(e, t) {
            this.column.setMediaPreviewSize(t.value)
        }, this.handleColumnUpdating = function() {
            this.trigger(this.$columnOptions, "uiWaitingForAsyncResponse")
        }, this.handleColumnUpdated = function() {
            this.trigger(this.$columnOptions, "uiReceivedAsyncResponse")
        }, this.handleMarkAllRead = function() {
            this.column.markAllMessagesAsRead()
        }, this.handleReadStateChange = function(e, t) {
            var i = this.select("columnHeaderSelector");
            t.columnKey = this.columnKey, this.column.isMessageColumn() ? t.read = !this.column.hasUnreadMessages() : this.$node.toggleClass(this.attr.isNewClass, !t.read), i.toggleClass(this.attr.isNewClass, !t.read)
        }, this.handleColumnVisibilities = function(e, t) {
            var i, s, n = this.column.visibility,
                r = t[this.columnKey];
            r && (this.column.visibility = r, i = 0 === n.visibleFraction, s = r.visibleFraction > 0, (i && s || n.visibleHeight !== r.visibleHeight) && this.scribeTweetImpressions())
        }, this.scribeTweetImpressions = function() {
            var e = this.column.temporary || this.hasFocus && this.column.visibility.visibleFraction > 0,
                t = this.$node.hasClass(this.attr.columnStateDetailViewClass) || this.$node.hasClass(this.attr.columnStateSocialProofClass);
            if (e && !t) {
                var i = [],
                    s = [],
                    n = this.$scrollContainer.height(),
                    r = this.attr.animatingClass;
                this.select("chirpSelector").each(function(e, t) {
                    var s = $(t),
                        o = s.position().top,
                        a = s.height();
                    if (!(0 > o + a)) {
                        if (!(n > o)) return !1;
                        s.hasClass(r) || i.push(s.attr("data-key"))
                    }
                }), i.forEach(function(e) {
                    var t;
                    this.column.scribedImpressionIDs.get(e) || (t = this.column.findMostInterestingChirp(e), t instanceof TD.services.TwitterStatus && s.push(t.getScribeItemData())), this.column.scribedImpressionIDs.enqueue(e, !0)
                }.bind(this)), TD.controller.stats.tweetStreamImpression(this.column.getColumnType(), s)
            }
        }, this.after("initialize", function() {
            this.columnKey = this.$node.data("column"), this.column = TD.controller.columnManager.get(this.columnKey), this.$socialProofContainer = this.select("socialProofSelector"), this.$columnOptions = this.select("columnOptionsSelector"), this.$scrollContainer = this.select("scrollContainerSelector"), this.attr.tweetImpressionTrackingPeriod > 0 && (this.scribeTweetImpressions = _.throttle(this.scribeTweetImpressions.bind(this), this.attr.tweetImpressionTrackingPeriod)),
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
            this.on("uiReadStateChange", this.handleReadStateChange),
            this.on("uiTransitionExpandStart", {
                columnOptionsSelector: this.handleColumnOptionsTransitionStart
            }),
            this.on("uiColumnUpdateSearchFilter", this.handleUpdateSearchFilter),
            this.on("uiColumnUpdateMediaPreview", this.handleUpdateMediaPreview),
            this.on("dataColumnUpdatingFilters dataColumnUpdatingFeed", this.handleColumnUpdating),
            this.on("dataColumnFiltersUpdated dataColumnFeedUpdated", this.handleColumnUpdated),
            this.on("uiRemoveColumn", this.teardown),
            this.on(document, "uiFocus", function(e, t) {
                this.hasFocus = t.id === this.attr.focusId, this.hasFocus && this.scribeTweetImpressions()
            }),
            this.on(this.$scrollContainer, "scroll", this.scribeTweetImpressions),
            this.on(document, "uiColumnVisibilities", this.handleColumnVisibilities),
            this.on(document, "uiColumnChirpsChanged", function(e, t) {
                t.id === this.columnKey && this.scribeTweetImpressions()
            }), this.on("uiDetailViewClosed", this.scribeTweetImpressions)
        })
    };
    return e(o, i, s, n)
}), define("ui/alerts_form", ["flight/lib/component", "ui/with_template"], function(e, t) {
    var i = function() {
        this.defaultAttrs({
            template: "column/alerts_form",
            actionButton: "[data-action]",
            summarySelector: ".js-alerts-summary",
            summaryClass: "js-alerts-summary"
        }), this.updateSummary = function() {
            var e, t = this.column.model,
                i = t.getHasNotification(),
                s = t.getHasSound();
            e = i && s ? TD.i("sounds and popups") : i ? TD.i("popups") : s ? TD.i("sounds") : TD.i("none"), this.select("summarySelector").text(e)
        }, this.toggleColumnSetting = function(e) {
            var t, i = $(e.target).closest(this.attr.actionButton),
                s = i.data("action"),
                n = this.column.model;
            switch (s) {
                case "popups":
                    t = !n.getHasNotification(), n.setHasNotification(t);
                    break;
                case "sound":
                    t = !n.getHasSound(), n.setHasSound(t)
            }
            this.updateSummary()
        }, this.after("initialize", function() {
            var e = {
                summaryText: "",
                iconClass: "icon-alerts",
                title: TD.i("Alerts"),
                jsClass: this.attr.summaryClass,
                options: [{
                    action: "sound",
                    option: TD.i("Sounds"),
                    on: this.attr.column.model.getHasSound()
                }]
            };
            return this.column = this.attr.column, this.column.getColumnType() === TD.util.columnUtils.columnMetaTypes.SCHEDULED ? (this.teardown(), void 0) : (TD.controller.notifications.hasNotifications() && e.options.push({
                action: "popups",
                option: TD.i("Popups"),
                on: this.column.model.getHasNotification()
            }), this.$alertsForm = this.renderTemplate(this.attr.template, e), this.$node.append(this.$alertsForm), this.updateSummary(), this.on(this.$alertsForm, "click", {
                actionButton: this.toggleColumnSetting
            }), void 0)
        })
    };
    return e(i, t)
}), define("ui/with_accordion", ["flight/lib/compose", "ui/with_transitions"], function(e, t) {
    var i = function() {
        e.mixin(this, [t]), this.defaultAttrs({
            accordionItemSelector: ".js-accordion-item",
            accordionIsExpandedClass: "is-expanded",
            accordionIsActiveClass: "is-active",
            accordionToggleSelector: ".js-accordion-toggle-view",
            accordionPanelSelector: ".js-accordion-panel",
            isAccordionPanelAnimatingClass: "is-accordion-panel-animating"
        }), this.expandAccordionItem = function(e) {
            var t = e.find(this.attr.accordionPanelSelector);
            e.addClass(this.attr.accordionIsExpandedClass), e.addClass(this.attr.accordionIsActiveClass), this.transitionExpand(t, this.attr.isAccordionPanelAnimatingClass), this.trigger(e, "uiAccordionExpandAction")
        }, this.collapseAccordionItem = function(e) {
            var t = e.find(this.attr.accordionPanelSelector);
            e.removeClass(this.attr.accordionIsActiveClass), this.transitionCollapse(t, this.attr.isAccordionPanelAnimatingClass, function() {
                e.removeClass(this.attr.accordionIsExpandedClass)
            }.bind(this)), this.trigger(e, "uiAccordionCollapseAction")
        }, this.getOpenAccordionItem = function() {
            return this.select("accordionItemSelector").filter(function(e, t) {
                return $(t).hasClass(this.attr.accordionIsExpandedClass)
            }.bind(this))
        }, this.accordionToggle = function(e) {
            var t = $(e.target).closest(this.attr.accordionItemSelector),
                i = this.getOpenAccordionItem();
            i.length > 0 && this.collapseAccordionItem(i), t.is(i) || this.expandAccordionItem(t)
        }, this.showAccordionPanel = function(e) {
            var t = e.closest(this.attr.accordionItemSelector),
                i = this.getOpenAccordionItem();
            t.is(i) || (this.collapseAccordionItem(i), this.expandAccordionItem(t))
        }, this.handleUpdatePanelHeights = function() {
            this.select("accordionPanelSelector").filter(":visible").each(function(e, t) {
                var i = $(t);
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
    function e() {
        this.before("initialize", function() {
            this.languages = TD.languages.getAllLanguages()
        })
    }
    return e
}), define("ui/search/content_filter_form", ["flight/lib/component", "ui/with_template", "data/with_languages"], function(e, t, i) {
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
        }, this.handleChange = function(e) {
            var t = this.$containing.val(),
                i = this.$matching.val(),
                s = this.$excluding.val(),
                n = this.$writtenIn.val(),
                r = this.$retweets.val(),
                o = this.retweetOptions.filter(function(e) {
                    return e.value === r
                })[0],
                a = new TD.vo.ContentFilter({
                    type: t,
                    matching: i,
                    excluding: s,
                    lang: n,
                    includeRTs: o.isIncluded
                });
            this.trigger("uiSearchFilterUpdateAction", {
                type: "content",
                filter: a,
                filterName: $(e.target).data("title"),
                value: e.target.value
            })
        }, this.after("initialize", function() {
            this.containingOptions = this.getContainingOptions(), this.retweetOptions = this.getRetweetOptions();
            var e = {
                containingOptions: this.containingOptions,
                retweetOptions: this.retweetOptions
            }, t = TD.languages.getSystemLanguageCode(!0),
                i = TD.languages.getLanguageFromISOCode(t);
            e.userLanguage = i, e.allLanguages = _.sortBy(this.languages, function(e) {
                return e.localized_name
            }), $.extend(e, this.attr.renderOptions), this.render(this.attr.template, e), this.$matching = this.select("matchingSelector"), this.$excluding = this.select("excludingSelector"), this.$containing = this.select("containingSelector"), this.$writtenIn = this.select("writtenInSelector"), this.$retweets = this.select("retweetsSelector"), this.attr.searchFilter && this.attr.searchFilter.content && (this.$containing.val(this.attr.searchFilter.content.type), this.attr.searchFilter.content.includeRTs ? this.$retweets.val("included") : this.$retweets.val("excluded"), this.$writtenIn.val(this.attr.searchFilter.content.lang)), this.on("change", this.handleChange), this.on("uiDestroyContentFilterForm", this.teardown)
        })
    };
    return e(s, t, i)
}), define("ui/search/user_filter_form", ["flight/lib/component", "ui/with_template", "data/with_languages"], function(e, t, i) {
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
        }), this.getTweetsFromOptions = function(e) {
            var t = [{
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
            return e && t.push({
                value: TD.vo.UserFilter.FROM_LIST,
                title: TD.i("members of list…")
            }), t
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
            var e = TD.storage.accountController.getPreferredAccount("twitter"),
                t = TD.storage.accountController.getAccountsForService("twitter");
            return t = t.map(function(t) {
                return {
                    value: t.getUsername().toLowerCase(),
                    title: "@" + t.getUsername(),
                    isDefault: t === e
                }
            }), t = t.sort(function(e, t) {
                return e.value.toLowerCase().localeCompare(t.value.toLowerCase())
            })
        }, this.updateFormState = function(e, t) {
            switch (e) {
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
            switch (t) {
                case this.attr.MENTIONING_USER:
                    this.$mentioningUser.removeClass(this.attr.isHiddenClass), this.$mentioningMe.addClass(this.attr.isHiddenClass);
                    break;
                case this.attr.MENTIONING_ME:
                    this.$mentioningMe.removeClass(this.attr.isHiddenClass), this.$mentioningUser.addClass(this.attr.isHiddenClass), this.$mentioningUserInput.val("");
                    break;
                default:
                    this.$mentioningMe.addClass(this.attr.isHiddenClass), this.$mentioningUser.addClass(this.attr.isHiddenClass), this.$mentioningUserInput.val("")
            }
        }, this.handleChange = function(e) {
            var t = "",
                i = "",
                s = this.$tweetsFrom.val(),
                n = this.$mentioning.val(),
                r = $(e.target).data("title");
            switch (this.updateFormState(s, n), s) {
                case this.attr.FROM_ME:
                    t = this.$tweetsFromMe.val(), s = TD.vo.UserFilter.FROM_USER;
                    break;
                case TD.vo.UserFilter.FROM_USER:
                    t = this.$tweetsFromUserInput.val();
                    break;
                case TD.vo.UserFilter.FROM_LIST:
                    t = this.$tweetsFromListInput.val()
            }
            i = n === this.attr.MENTIONING_ME ? this.$mentioningMe.val() : this.$mentioningUserInput.val(), !t && (s === TD.vo.UserFilter.FROM_USER || s === TD.vo.UserFilter.FROM_LIST) && (s = TD.vo.UserFilter.FROM_ALL);
            var o = new TD.vo.UserFilter({
                from_type: s,
                from_name: t,
                mention_name: i
            });
            this.trigger("uiSearchFilterUpdateAction", {
                type: "user",
                filter: o,
                filterName: r,
                value: e.target.value
            })
        }, this.after("initialize", function() {
            var e, t, i;
            this.tweetsFromOptions = this.getTweetsFromOptions(this.attr.renderOptions.withFromList), this.mentioningOptions = this.getMentioningOptions(), this.myAccounts = this.getMyAccounts();
            var s = this.attr.searchFilter,
                n = s.user && null !== s.user.from_type ? s.user.from_name : "",
                r = s.user ? s.user.mention_name : "";
            if (e = {
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
                    searchInputValue: r
                },
                mentioningOptions: this.mentioningOptions,
                myAccounts: this.myAccounts
            }, this.render(this.attr.template, e), this.$tweetsFrom = this.select("tweetsFromSelector"), this.$tweetsFromUser = this.select("tweetsFromUserSelector"), this.$tweetsFromUserInput = this.select("tweetsFromUserInputSelector"), this.$tweetsFromList = this.select("tweetsFromListSelector"), this.$tweetsFromListInput = this.select("tweetsFromListInputSelector"), this.$tweetsFromMe = this.select("tweetsFromMeSelector"), this.$mentioning = this.select("mentioningSelector"), this.$mentioningUser = this.select("mentioningUserSelector"), this.$mentioningUserInput = this.select("mentioningUserInputSelector"), this.$mentioningMe = this.select("mentioningMeSelector"), this.attr.searchFilter && this.attr.searchFilter.user) {
                if (t = this.attr.searchFilter.user.from_name && TD.storage.accountController.getAccountFromUsername(this.attr.searchFilter.user.from_name).length > 0, i = this.attr.searchFilter.user.mention_name && TD.storage.accountController.getAccountFromUsername(this.attr.searchFilter.user.mention_name).length > 0, t) this.$tweetsFrom.val(this.attr.FROM_ME), this.$tweetsFromMe.val(this.attr.searchFilter.user.from_name);
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
    return e(s, t, i)
}), define("ui/search/action_filter_form", ["flight/lib/component", "ui/with_template"], function(e, t) {
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
        }, this.hasFilterError = function(e) {
            var t = e.getFilters().length,
                i = !1;
            return this.isInActivityColumn() ? t === TD.vo.ActionFilter.MAX_ACTIVITY_FILTERS && (i = !0) : t === TD.vo.ActionFilter.MAX_INTERACTION_FILTERS && (i = !0), i
        }, this.handleChange = function(e) {
            var t, i = {
                    showFollowers: this.$showFollowers.prop("checked"),
                    showLists: this.$showLists.prop("checked"),
                    showMentions: this.$showMentions.prop("checked"),
                    showRetweets: this.$showRetweets.prop("checked"),
                    showFavorites: this.$showFavorites.prop("checked")
                };
            0 === this.$showRetweets.length && (i.showRetweets = !0), 0 === this.$showMentions.length && (i.showMentions = !0), t = new TD.vo.ActionFilter(i), this.select("errorMessageSelector").toggleClass(this.attr.isHiddenClass, !this.hasFilterError(t)), this.trigger("uiAccordionUpdatePanelHeights"), this.trigger("uiSearchFilterUpdateAction", {
                type: this.attr.filterType,
                filter: t,
                filterName: $(e.target).data("title"),
                value: [e.target.value, e.target.checked ? "show" : "hide"].join(":")
            }), this.hasFilterError(t) && this.trigger("uiActionFilterError")
        }, this.after("initialize", function() {
            var e = this.attr.searchFilter.action.toJSONObject();
            e.showError = this.hasFilterError(this.attr.searchFilter.action), e.isInActivityColumn = this.isInActivityColumn(), this.render(this.attr.template, e), this.$showRetweets = this.select("showRetweetsSelector"), this.$showFavorites = this.select("showFavoritesSelector"), this.$showFollowers = this.select("showFollowersSelector"), this.$showLists = this.select("showListsSelector"), this.$showMentions = this.select("showMentionsSelector"), this.on("change", this.handleChange)
        })
    }
    return e(i, t)
}), define("ui/search/engagement_filter_form", ["flight/lib/component", "ui/with_template"], function(e, t) {
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
            var e = this.attr.searchFilter.engagement;
            this.render(this.attr.template, e), this.$minFavorites = this.select("minFavoritesSelector"), this.$minRetweets = this.select("minRetweetsSelector"), this.$minReplies = this.select("minRepliesSelector"), this.on("change blur", this.handleChange), this.validateInput(this.attr.searchFilter.engagement)
        }), this.validateInput = function() {
            var e = parseInt(this.$minFavorites.val(), 10),
                t = parseInt(this.$minRetweets.val(), 10),
                i = parseInt(this.$minReplies.val(), 10);
            e = isNaN(e) ? 0 : e, t = isNaN(t) ? 0 : t, i = isNaN(i) ? 0 : i, this.$minFavorites.val(e).toggleClass(this.attr.zeroClass, 0 === e), this.$minRetweets.val(t).toggleClass(this.attr.zeroClass, 0 === t), this.$minReplies.val(i).toggleClass(this.attr.zeroClass, 0 === i)
        }, this.handleChange = function(e) {
            var t, i = $(e.target).data("title"),
                s = $(e.target).val();
            this.validateInput(), t = new TD.vo.EngagementFilter({
                minFavorites: this.$minFavorites.val(),
                minRetweets: this.$minRetweets.val(),
                minReplies: this.$minReplies.val()
            }), this.trigger("uiSearchFilterUpdateAction", {
                type: this.attr.filterType,
                filter: t,
                filterName: i,
                value: s
            })
        }
    }
    return e(i, t)
}), define("ui/with_search_filter", ["flight/lib/compose", "ui/with_template", "ui/search/content_filter_form", "ui/search/user_filter_form", "ui/search/action_filter_form", "ui/search/engagement_filter_form"], function(e, t, i, s, n, r) {
    var o = function() {
        e.mixin(this, [t]), this.defaultAttrs({
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
        }), this.isValidFilterType = function(e) {
            return this.attr.filterTypes.some(function(t) {
                return e === t
            })
        }, this.handleSearchFilterUpdate = function(e, t) {
            if (t.filter && this.isValidFilterType(t.type)) {
                this.searchFilter[t.type] = t.filter;
                var i = t.filter.getSummaryText(this.attr.columnType),
                    s = this.select(t.type + "SummarySelector");
                s.text(i), TD.controller.stats.advancedSearchSettings(this.attr.scribeSection, t.type, t.filterName, t.value), this.trigger(this.$accordion, "uiAccordionUpdatePanelHeights"), this.trigger("uiColumnUpdateSearchFilter", this.searchFilter)
            }
        }, this.renderSearchFilters = function(e, t) {
            this.searchFilter = e, this.$accordion = this.select("accordionSelector");
            var o = this.renderTemplate(this.attr.searchAccordionTemplate, {
                content: {
                    summaryText: this.searchFilter.content.getSummaryText(),
                    iconClass: "icon-content",
                    title: TD.i("Content"),
                    jsClass: this.attr.contentSummaryClass,
                    isExpanded: t.expandContentFilter
                },
                user: {
                    summaryText: this.searchFilter.user.getSummaryText(),
                    iconClass: "icon-user",
                    title: TD.i("Users"),
                    jsClass: this.attr.userSummaryClass,
                    isExpanded: t.expandUserFilter
                },
                action: t.withActionFilter ? {
                    summaryText: this.searchFilter.action.getSummaryText(this.attr.columnType),
                    iconClass: "icon-check",
                    title: TD.i("Showing"),
                    jsClass: this.attr.actionSummaryClass,
                    isExpanded: t.expandActionFilter
                } : !1,
                engagement: t.withEngagementFilter ? {
                    summaryText: this.searchFilter.engagement.getSummaryText(),
                    iconClass: "icon-retweet",
                    title: TD.i("Engagement"),
                    jsClass: this.attr.engagementSummaryClass,
                    isExpanded: t.expandEngagementFilter
                } : !1
            });
            this.$accordion.append(o), this.trigger(this.select("contentFilterSelector"), "uiDestroyContentFilterForm"), this.trigger(this.select("userFilterSelector"), "uiDestroyUserFilterForm"), i.attachTo(this.select("contentFilterSelector"), {
                searchFilter: e,
                renderOptions: t
            }), s.attachTo(this.select("userFilterSelector"), {
                searchFilter: e,
                renderOptions: t
            }), t.withActionFilter && n.attachTo(this.select("actionFilterSelector"), {
                searchFilter: e,
                renderOptions: t,
                columnType: this.attr.columnType
            }), t.withEngagementFilter && r.attachTo(this.select("engagementFilterSelector"), {
                searchFilter: e,
                renderOptions: t
            })
        }, this.after("initialize", function() {
            this.searchFilter = this.searchFilter || new TD.vo.SearchFilter, this.$searchFilter = this.select("searchFilterSelector"), this.on("uiSearchFilterUpdateAction", this.handleSearchFilterUpdate)
        })
    };
    return o
}), define("ui/with_thumb_size_select", ["flight/lib/compose", "ui/with_template"], function(e, t) {
    function i() {
        e.mixin(this, [t]), this.defaultAttrs({
            thumbSizeSelectSelector: ".js-thumb-size",
            thumbSizeSelectTemplate: "column/thumb_size_select",
            selectItemSelector: ".js-toggle-item",
            selectedClass: "is-selected"
        }), this.after("initialize", function() {
            this.on(this.$node, "click", {
                selectItemSelector: this.handleThumbSizeSelectClick
            }), this.on("uiColumnUpdateSearchFilter", this.renderThumbSizeSelector)
        }), this.renderThumbSizeSelector = function() {
            var e = this.toHtml(this.attr.thumbSizeSelectTemplate);
            this.$thumbSizeSelect = this.select("thumbSizeSelectSelector"), this.$thumbSizeSelect.html(e), this.$thumbSizeSelectOptions = this.select("selectItemSelector");
            var t = this.attr.column.getMediaPreviewSize(),
                i = '[data-value="' + t + '"]';
            this.$thumbSizeSelectOptions.filter(i).addClass(this.attr.selectedClass)
        }, this.handleThumbSizeSelectClick = function(e, t) {
            var i = $(t.el),
                s = i.data("value");
            s && (this.trigger("uiColumnUpdateMediaPreview", {
                value: s
            }), this.$thumbSizeSelectOptions.removeClass(this.attr.selectedClass), i.addClass(this.attr.selectedClass))
        }
    }
    return i
}), define("ui/column_options", ["flight/lib/component", "ui/alerts_form", "ui/with_accordion", "ui/with_template", "ui/with_search_filter", "ui/with_thumb_size_select", "ui/with_transitions"], function(e, t, i, s, n, r, o) {
    var a = function() {
        this.defaultAttrs({
            actionButton: "[data-action]",
            searchInputForm: ".js-column-options-search-form",
            searchInput: ".js-search-input",
            scribeSection: "column_options",
            isAnimatingClass: "is-column-options-animating",
            accordionSelector: ".js-accordion",
            columnType: null,
            isTouchColumnOptionsClass: "is-touch-column-options"
        }), this.updateHeight = function() {
            this.$node.css("height", ""), this.$node.height(this.$node.height()), this.trigger("uiAccordionTotalHeightChanged")
        }, this.handleChildTransitionExpandStart = function() {
            this.$node.css("height", "")
        }, this.handleChildTransitionExpandEnd = function() {
            this.$node.height(this.$node.height())
        }, this.handleUpdateSearchFilter = function(e, t) {
            this.updateHeight(), this.column.updateSearchFilter(t)
        }, this.handleShowUserFilter = function(e) {
            e.stopPropagation(), this.showAccordionPanel(this.select("userFilterSelector"))
        }, this.handleShowContentFilter = function(e) {
            e.stopPropagation(), this.showAccordionPanel(this.select("contentFilterSelector"))
        }, this.hide = function() {
            this.$node.hasClass(this.attr.isAnimatingClass) || (this.trigger("uiHidingColumnOptions", this.column), this.transitionCollapse(this.$node, this.attr.isAnimatingClass, this.afterHideTransition.bind(this)), this.teardown())
        }, this.afterHideTransition = function() {
            this.$node.css("height", ""), this.$node.empty(), this.trigger("uiColumnOptionsHidden", this.column)
        }, this.showColumnOptions = function() {
            var e = this.$node.outerHeight(),
                t = function() {
                    this.trigger("uiColumnOptionsShown", {
                        column: this.column
                    })
                }.bind(this);
            this.trigger("uiShowingColumnOptions", {
                columnOptionsHeight: e,
                column: this.column
            }), this.transitionExpand(this.$node, this.attr.isAnimatingClass, t.bind(this))
        }, this.handleClickEvents = function(e) {
            var t = $(e.target).closest(this.attr.actionButton),
                i = t.data("action"),
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
                case "embed":
                    this.trigger("uiEmbedTimelineAction", {
                        column: this.column
                    })
            }
        }, this.after("initialize", function() {
            this.column = this.attr.column;
            var e, i = this.column.getSearchFilter(),
                s = this.column.isSearchColumn(),
                n = -1 !== TD.util.columnUtils.mediaPreviewableColumnTypes.indexOf(this.column.getColumnType());
            this.on("uiShowUserFilter", this.handleShowUserFilter), this.on("uiShowContentFilter", this.handleShowContentFilter), this.on("uiColumnOptionsCloseAction", this.hide), this.on("uiColumnUpdateSearchFilter", this.handleUpdateSearchFilter), this.on("uiAccordionExpandAction", this.updateHeight), this.on("uiAccordionCollapseAction", this.updateHeight), this.on("uiTransitionExpandStart", {
                searchFilterSelector: this.handleChildTransitionExpandStart
            }), this.on("uiTransitionExpandEnd", {
                searchFilterSelector: this.handleChildTransitionExpandEnd
            }), this.on("click", {
                actionButton: this.handleClickEvents
            });
            var r = Boolean(TD.util.isTouchDevice() && TD.decider.get(TD.decider.TOUCHDECK_COLUMN_OPTIONS));
            r ? this.$node.addClass(this.attr.isTouchColumnOptionsClass) : this.$node.removeClass(this.attr.isTouchColumnOptionsClass), e = {
                searchTerm: this.column.getBaseQuery(),
                isOwnList: Boolean(this.column.isOwnList()),
                isEmbeddable: this.column.isEmbeddable(),
                isClearable: this.column.isClearable(),
                isTouchColumnOptions: r
            }, this.render("column/column_options", e), this.column.isFilterable() && this.renderSearchFilters(i, {
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
            }), t.attachTo(this.select("accordionSelector"), {
                column: this.column
            }), n && this.renderThumbSizeSelector(), this.showColumnOptions()
        })
    };
    return e(a, i, s, n, r, o)
}), define("td/UI/columns", ["ui/column_options"], function(e) {
    var t = window.TD || {};
    t.ui = t.ui || {}, window.TD = t, t.ui.columns = function() {
        var i, s, n = 10,
            r = 20,
            o = 350,
            a = 500,
            c = 200,
            l = 20,
            u = {}, h = {}, d = {}, p = {}, m = {}, f = {}, g = 150,
            T = 15,
            v = "is-options-open",
            y = "is-moving",
            w = "is-focused",
            b = ".is-focused",
            D = "is-actionable",
            C = "#container",
            S = ".js-app-columns",
            E = ".js-column-options",
            k = ".js-column-scroller",
            A = ".js-column-update-glow",
            I = ".js-column",
            x = ".js-column-header",
            R = ".js-column-message",
            M = ".js-detail-header",
            F = ".js-chirp-container",
            L = ".js-action-header-button",
            N = ".is-minimalist",
            O = "is-touch-tweet-container",
            U = 150,
            P = function(e) {
                return Y.getColumnElementByKey(e).find(x)
            }, j = function(e) {
                var t = $(e.target).closest("[data-action]"),
                    i = t.data("action"),
                    s = t.parents(I),
                    n = s.attr("data-column");
                switch (i) {
                    case "options":
                        e.preventDefault(), s.hasClass(v) ? Y.exitEditMode(n) : Y.enterEditMode(n), e.stopPropagation();
                        break;
                    case "mark-all-read":
                        s.trigger("uiMarkAllMessagesRead", {
                            columnKey: n
                        });
                        break;
                    case "user-filter":
                    case "content-filter":
                    case "action-filter":
                    case "engagement-filter":
                        Y.enterEditMode(n, i);
                        break;
                    case "edit-list":
                        e.preventDefault(), e.stopPropagation()
                }
            }, B = function(e) {
                var i = $(e.currentTarget),
                    s = (i.data("action"), i.parents(I)),
                    n = s.data("column");
                t.ui.columns.setColumnToTop(n)
            }, H = function() {
                var e = $(this);
                return e.offset().top + this.offsetHeight > 0 && e.offset().top < i.innerHeight()
            }, W = function() {
                var e = t.ui.updates.findParentArticle($(this)),
                    i = t.controller.columnManager.get(e.column),
                    s = i.updateIndex[e.statusKey];
                e.element.replaceWith(s.render({
                    isTemporary: i.temporary
                }))
            }, K = _.debounce(function(e) {
                e.find(N).filter(H).each(W)
            }, U),
            z = function(e, i) {
                var s, n, r = 0;
                return function(o) {
                    t.util.isTouchDevice() && t.util.cancelFastClick();
                    var a, c, l = o.timeStamp || (new Date).getTime(),
                        u = i.scrollTop();
                    p[e] = u, K(i), l - r > 200 && (r = l, n = o.currentTarget.scrollHeight, s = i.height()), c = (s + u) / n, c > .999 ? (r = 0, a = t.controller.columnManager.get(e), a.fetchUpdatesFromPoller()) : 0 === u && i.trigger("uiReadStateChange", {
                        read: !0
                    })
                }
            }, q = function(e, t) {
                var i = t.closest(".scroll-h");
                return function(n) {
                    var r, o, a, c = $(n.currentTarget);
                    (n.originalEvent.wheelDeltaY || n.originalEvent.wheelDeltaX) && (n.preventDefault(), Math.abs(n.originalEvent.wheelDeltaY) > Math.abs(n.originalEvent.wheelDeltaX) ? c.is(k) ? (r = n.currentTarget.scrollHeight, o = t.height(), a = p[e], a = Math.max(0, a - n.originalEvent.wheelDeltaY), a = Math.min(a, r - o), t.scrollTop(a), p[e] = a) : c.scrollTop(c.scrollTop() - n.originalEvent.wheelDeltaY) : i.length && i.scrollLeft(s.scrollLeft() - n.originalEvent.wheelDeltaX))
                }
            }, V = function(e, s) {
                var n, r = function(i) {
                        var s = i.model,
                            r = i.isMessageColumn() && (t.config.internal_build || t.decider.get(t.decider.DM_READ_STATE)),
                            o = i.hasActiveSearchFilters(),
                            a = null;
                        o && (a = {
                            content: i.hasActiveContentFilters(),
                            user: i.hasActiveUserFilters(),
                            action: i.hasActiveActionFilters() && !i.isSingleActionTypeColumn(),
                            engagement: i.hasActiveEngagementFilters(),
                            filterError: i.hasFilterError()
                        });
                        var c = {
                            columnkey: s.getKey(),
                            columntitle: e[n].getTitleHTML(),
                            columnclass: e[n].getClass(),
                            columniconclass: e[n].getIconClass(),
                            columnfilter: a,
                            filterError: i.hasFilterError(),
                            withMarkAllRead: r,
                            isTouchColumnOptions: Boolean(t.util.isTouchDevice() && t.decider.get(t.decider.TOUCHDECK_COLUMN_OPTIONS))
                        };
                        return t.ui.template.render("column", c)
                    };
                if (s = Boolean(s))
                    for (n = e.length - 1; n >= 0; n--) i.prepend(r(e[n])), Y.setupColumn(e[n]);
                else
                    for (n = 0; e.length > n; n++) i.append(r(e[n])), Y.setupColumn(e[n])
            }, G = function() {
                var e = $(this);
                Y.setColumnScrollerPosition(e)
            }, Y = {
                COLUMN_GLOW_DURATION: 500,
                init: function() {
                    i = $(S), s = $(C);
                    var e = _.throttle(j, 300);
                    i.on("click", L + ", " + R, e), i.on("click", x, B), i.on("uiColumnWidthChange", this.handleColumnWidthChange.bind(this)), i.on("uiAccordionTotalHeightChanged", I, G)
                },
                setupColumn: function(e) {
                    var i = e.model.getKey(),
                        s = $(F + '[data-column="' + i + '"]').closest(k),
                        n = $(I + '[data-column="' + i + '"]'),
                        r = s.scrollTop(),
                        o = z(i, s),
                        a = q(i, s);
                    $(document).trigger("uiColumnRendered", {
                        column: e,
                        $column: n
                    }), t.util.isTouchDevice() && t.decider.get(t.decider.TOUCHDECK_TWEETCONTROLS) && s.addClass(O), p[i] = r, h[i] = s, s.scroll(o), n.on("mousewheel onmousewheel", ".scroll-v", a), n.on("mouseover", x, function() {
                        var e = p[i];
                        $(this).toggleClass(D, e > 0)
                    }), t.util.isTouchDevice() && window.navigator.standalone && n.on("touchmove", ".scroll-v", function(e) {
                        e.stopPropagation()
                    })
                },
                refreshTitle: function(e) {
                    var i, s, n = e.getIconClass(),
                        r = e.model.getKey(),
                        o = e.getTitleHTML(),
                        a = Y.getColumnElementByKey(r),
                        c = e.isMessageColumn() && (t.config.internal_build || t.decider.get(t.decider.DM_READ_STATE));
                    s = e.temporary && e.getColumnType() === t.util.columnUtils.columnMetaTypes.SEARCH ? t.i("results") : e.getDetailTitleHTML(), i = t.ui.template.render("column/column_header", {
                        columntitle: o,
                        columniconclass: n,
                        isTemporary: e.temporary,
                        withMarkAllRead: c
                    }), P(e.model.getKey()).replaceWith(i), i = t.ui.template.render("column/column_header_detail", {
                        headerClass: "js-detail-header",
                        headerAction: "resetToTopColumn",
                        headerLinkClass: "js-column-back",
                        columntitle: s
                    }), a.find(M).replaceWith(i), $(document).trigger("uiColumnTitleRefreshed", {
                        title: o,
                        columnKey: r
                    })
                },
                setColumnToTop: function(e) {
                    var t, i = h[e],
                        s = 10,
                        n = p[e],
                        r = 250,
                        a = function() {
                            var o = Math.max(n - r, 0);
                            n -= r, i.scrollTop(o), p[e] = o, o > 0 ? setTimeout(a, s) : (i.trigger("uiReadStateChange", {
                                read: !0
                            }), t = P(e), t.toggleClass(D, i.scrollTop > 0))
                        };
                    n * s / r > o && (r = n * s / o), a()
                },
                setColumnScrollerPosition: function(e, i) {
                    var s = $(E, e),
                        n = e.attr("data-column"),
                        o = t.controller.columnManager.get(n);
                    if (o) {
                        var a = i ? 0 : s.height();
                        o.hasActiveSearchFilters() && i && (a += r), $(k, e).css("top", a), $(A, e).css("top", a)
                    }
                },
                handleColumnWidthChange: function() {
                    var e = this.setColumnScrollerPosition;
                    i.find("." + v).each(function() {
                        e($(this), !1)
                    })
                },
                enterEditMode: function(i, s) {
                    var n, r = t.controller.columnManager.get(i),
                        o = Y.getColumnElementByKey(i);
                    o.length && !o.hasClass(v) && (o.addClass(v), n = $(E, o), e.attachTo(n, {
                        column: r,
                        expandContentFilter: "content-filter" === s,
                        expandUserFilter: "user-filter" === s,
                        expandActionFilter: "action-filter" === s,
                        expandEngagementFilter: "engagement-filter" === s,
                        columnType: r.getColumnType()
                    }))
                },
                exitEditMode: function(e) {
                    var t = Y.getColumnElementByKey(e),
                        i = $(E, t);
                    t.hasClass(v) && (t.removeClass(v), i.trigger("uiColumnOptionsCloseAction"))
                },
                isFrozen: function(e) {
                    var t = h[e];
                    return t ? 0 !== p[e] : !1
                },
                freezeScroll: function(e) {
                    var t = h[e],
                        i = m[e];
                    if (!t) return !1;
                    var s = p[e];
                    return f[e] || (u[e] = t[0].scrollHeight - s), 0 !== s || i
                },
                unfreezeScroll: function(e, t) {
                    var i, s = h[e],
                        n = m[e],
                        r = u[e],
                        o = d[e],
                        a = p[e];
                    f[e] || s && (r && (a > 0 || n) ? (i = s[0].scrollHeight - r, s.scrollTop(i), p[e] = i, t && t()) : K(s), o && o.resizeScroller())
                },
                lockColumnScrolling: function(e) {
                    m[e] = !0
                },
                unlockColumnScrolling: function(e) {
                    delete m[e]
                },
                addColumnsToView: function(e) {
                    V(e), $(F).show()
                },
                removeColumn: function(e) {
                    var t = Y.getColumnElementByKey(e);
                    t.trigger("uiRemoveColumn"), t.remove(), delete p[e], delete h[e], delete d[e]
                },
                _moveColumnInstantly: function(e, t, s, n, r, o) {
                    s.length > 0 && s.attr("data-column") !== r[n + 1] && (o[s.attr("data-column")] = s.detach()), e ? t.insertAfter(e) : t.prependTo(i)
                },
                _getOriginalWidth: function(e) {
                    return e.data("originalWidth") || parseInt(e.css("width"), 10)
                },
                _storeOriginalWidth: function(e) {
                    var t = e.data("originalWidth");
                    void 0 === t && (t = parseInt(e.css("width"), 10)), e.data("originalWidth", t)
                },
                _isColumnOffScreen: function(e) {
                    return 0 > e.position().left + this._getOriginalWidth(e) || e.position().left + this._getOriginalWidth(e) > s.width()
                },
                _moveColumnToNewIndex: function(e, t, s, n, r) {
                    var o, a, c, l = t[e],
                        u = s[l] || i.children('[data-column="' + l + '"]'),
                        h = u.index(),
                        d = function() {
                            u.removeClass(y), n = u, delete s[l]
                        };
                    t.length >= e ? (o = i.children(I).filter('[data-column="' + t[e + 1] + '"]'), a = o.index()) : (o = !1, a = -1), t.length > e && h !== a && (u.hasClass(y) ? (this._storeOriginalWidth(u), this._moveColumnInstantly(n, u, o, e, t, s), this._isColumnOffScreen(u) ? (c = this.scrollColumnToCenter(u.attr("data-column")), c.addCallback(function() {
                        d(), Y._moveColumnToNewIndex(e + 1, t, s, n, r)
                    })) : (Y.focusColumn(u.attr("data-column"), Y.COLUMN_GLOW_DURATION), d(), Y._moveColumnToNewIndex(e + 1, t, s, n, r))) : (n = u, this._moveColumnToNewIndex(e + 1, t, s, n, r)))
                },
                reorderColumns: function(e) {
                    var t = {}, s = null,
                        n = i.children("." + y);
                    n.length > 0 ? this._moveColumnToNewIndex(0, e, t, s, n) : _.each(e, function(n, r) {
                        var o = t[n] || Y.getColumnElementByKey(n),
                            a = i.children(I).eq(r);
                        a[0] !== o[0] && (e.length > r + 1 && a.length > 0 && a.attr("data-column") !== e[r + 1] && (t[a.attr("data-column")] = a.detach()), 0 === r ? o.prependTo(i) : o.insertAfter(s), delete t[n]), s = o
                    })
                },
                calculateScrollDuration: function(e, t, i) {
                    i = i || a, t = t || l;
                    var s = c + e / 100 * t;
                    return s = Math.min(s, i)
                },
                scrollColumnToCenter: function(e) {
                    var r, o, u, h, d, p, m, f, g, T = Y.getColumnElementByKey(e),
                        v = s.innerWidth() / T.outerWidth(!0),
                        y = s.scrollLeft(),
                        w = !0;
                    return 3.05 >= v ? (g = parseInt(i.css("padding-left"), 10), h = y + T.position().left - g) : (d = T.outerWidth(), p = s.get(0).scrollWidth - n, m = i.width(), f = T.offset().left, h = y + f - (m - d) / 2, h = Math.min(h, p - m), h = Math.max(h, 0)), 2 > v && (w = !1), h !== y ? (s.stop(), r = Math.abs(h - y), o = c + r / 100 * l, o = Math.min(o, a), u = new t.core.defer.Deferred, s.animate({
                        scrollLeft: h
                    }, o, "easeInOutQuad", function() {
                        w && t.ui.columns.focusColumn(e, Y.COLUMN_GLOW_DURATION), u.callback()
                    })) : (w && t.ui.columns.focusColumn(e, Y.COLUMN_GLOW_DURATION), u = t.core.defer.succeed()), u
                },
                getLeftmostColumn: function() {
                    var e = null;
                    return i.children(I).each(function() {
                        e || (10 > $(this).position().left && $(this).position().left >= 0 ? e = this : $(this).position().left > 10 && (e = $(this).prev()))
                    }), $(e)
                },
                scrollColumn: function(e) {
                    $.fn.reverse = [].reverse;
                    var t, r, o, a = s[0].scrollWidth - s.outerWidth(),
                        c = !1,
                        l = !1,
                        u = 0;
                    t = "right" === e ? this.getLeftmostColumn().next() : this.getLeftmostColumn().prev(), t.length ? (r = s.scrollLeft() + t.position().left, r > a ? (c = !0, o = s[0].scrollWidth - (s.scrollLeft() + s.outerWidth()), o > 0 && s.stop().animate({
                        scrollLeft: a
                    }, 350)) : s.stop().animate({
                        scrollLeft: r - n
                    }, 350)) : l = !0, c && 0 === o && i.find(I).last().animate({
                        marginRight: 20
                    }, {
                        duration: 150,
                        complete: function() {
                            $(this).animate({
                                marginRight: 0
                            }, 150), s.scrollLeft(s[0].scrollWidth)
                        },
                        step: function(e) {
                            s.not(":animated").scrollLeft(s.scrollLeft() + e - u), u = e
                        }
                    }), l && this.bounceLeft()
                },
                bounceLeft: function() {
                    i.animate({
                        marginLeft: T
                    }, g, function() {
                        i.animate({
                            marginLeft: 0
                        }, g)
                    })
                },
                bounceRight: function() {
                    var e = i.find(I).last(),
                        t = parseInt(e.css("marginRight"), 10);
                    e.animate({
                        marginRight: t + T
                    }, {
                        duration: g,
                        complete: function() {
                            $(this).animate({
                                marginRight: t
                            }, g)
                        },
                        step: function() {
                            s.scrollLeft(s[0].scrollWidth)
                        }
                    })
                },
                scrollPage: function(e) {
                    $.fn.reverse = [].reverse;
                    var t, r, o, a, c, l = "left" === e ? -1 : 1,
                        u = s.innerWidth(),
                        h = i.children(I).outerWidth() + n,
                        d = Math.floor(u / h),
                        p = s.scrollLeft() + d * h * l;
                    if ("left" === e && p > 0) {
                        o = d * h * l;
                        for (var m = 0; i.children(I).length > m; m++) {
                            var f = i.children(I).eq(m),
                                g = f.position().left;
                            o > g && (r = f.next())
                        }
                        r && (p = s.scrollLeft() - -1 * r.position().left)
                    }
                    0 > p ? p = 0 : p + u > s[0].scrollWidth && (p = s[0].scrollWidth - u), p === s.scrollLeft() && "left" === e ? this.bounceLeft() : p === s.scrollLeft() && "right" === e ? this.bounceRight() : (c = Math.abs(p - s.scrollLeft()), t = this.calculateScrollDuration(c, 50, 1e3), a = 700 > t ? s.is(":animated") ? "easeOutQuad" : "easeInOutQuad" : s.is(":animated") ? "easeOutQuart" : "easeInOutQuart", s.stop().animate({
                        scrollLeft: p
                    }, {
                        duration: t,
                        easing: a
                    }))
                },
                focusColumn: function(e, s) {
                    $(b, i).removeClass(w), Y.getColumnElementByKey(e).addClass(w), _.isNumber(s) && _.delay(function() {
                        t.ui.columns.unfocusColumn(e)
                    }, s)
                },
                unfocusColumn: function(e) {
                    Y.getColumnElementByKey(e).removeClass(w)
                },
                setMovingColumn: function(e) {
                    Y.getColumnElementByKey(e).addClass(y)
                },
                getColumnElementByKey: function(e) {
                    return $(I + '[data-column="' + e + '"]')
                }
            };
        return Y
    }()
}), define("ui/column_controller", ["flight/lib/component", "ui/with_column_selectors", "ui/with_template", "ui/with_transitions", "ui/column", "td/UI/columns"], function(e, t, i, s, n) {
    var r = function() {
        this.defaultAttrs({
            columnsContainerSelector: ".js-app-columns",
            containerSelector: "#container",
            columnDragHandleSelector: ".js-column-drag-handle",
            appColumnsContainerSelector: ".js-app-columns-container",
            columnsLeftMargin: 10,
            slideMinDuration: 200,
            slideMaxDuration: 500,
            extraSlideTimePer100Px: 20,
            scrollChirpToTopDuration: 750,
            scrollChirpToTopOffset: 50,
            focusId: null
        }), this.handleColumnFocus = function(e, t) {
            var i;
            void 0 !== t.index ? i = this.getKeyForColumnAtIndex(t.index) : t.last ? i = this.getKeyForLastColumn() : t.columnKey && (i = t.columnKey), i && TD.ui.columns.scrollColumnToCenter(i)
        }, this.handleScrollToColumn = function(e, t) {
            var i, s, n, r = this.getColumnElementByKey(t.column.model.getKey()),
                o = this.select("containerSelector"),
                a = this.select("columnsContainerSelector"),
                c = r.outerWidth(),
                l = a.width(),
                u = o.scrollLeft(),
                h = r.position().left,
                d = h + c;
            h >= 0 && l >= d || (n = "left" === t.direction ? u + h - t.offset : u + d + t.offset - l, n !== u && (o.stop(), i = Math.abs(n - u), s = this.attr.slideMinDuration + i / 100 * this.attr.extraSlideTimePer100Px, s = Math.min(s, this.attr.slideMaxDuration), o.animate({
                scrollLeft: n
            }, s, "easeInOutQuad")))
        }, this.handleScrollToChirp = function(e, t) {
            if (t.$chirp && t.columnKey && 0 !== t.$chirp.length) {
                var i, s, n = this.getColumnScrollContainerByKey(t.columnKey),
                    r = n.scrollTop(),
                    o = t.$chirp.position().top + r,
                    a = n.innerHeight();
                "up" === t.direction ? (i = o - t.offset, r > i && n.stop().animate({
                    scrollTop: i
                }, 100)) : (s = o + t.$chirp.outerHeight() + t.offset, s > r + a && (i = s - a, n.stop().animate({
                    scrollTop: i
                }, 100)))
            }
        }, this.handleColumnRendered = function(e, t) {
            t.$column.trigger("itemadded.dragdroplist", {
                itemId: t.column
            }), n.attachTo(t.$column, {
                column: t.column,
                focusId: this.attr.focusId
            })
        }, this.calculateColumnVisibilities = function() {
            var e = this.select("columnSelector"),
                t = this.$scrollContainer.width(),
                i = {};
            e.each(function() {
                var e, s = $(this),
                    n = s.position(),
                    r = s.width();
                n.right = n.left + r, n.left = Math.max(0, n.left), n.right = Math.max(0, n.right), n.left = Math.min(t, n.left), n.right = Math.min(t, n.right), e = {
                    columnWidth: r,
                    visibleWidth: n.right - n.left,
                    visibleHeight: s.height()
                }, e.visibleFraction = e.visibleWidth / e.columnWidth, i[s.data("column")] = e
            }), this.trigger("uiColumnVisibilities", i)
        }, this.after("initialize", function() {
            this.$scrollContainer = this.select("containerSelector"), this.on(document, "uiColumnFocus", this.handleColumnFocus), this.on(document, "uiColumnsScrollToColumn", this.handleScrollToColumn), this.on(document, "uiColumnsScrollToChirp", this.handleScrollToChirp), this.on(document, "uiColumnRendered", this.handleColumnRendered), this.select("columnSelector").each(function(e, t) {
                var i = $(t);
                n.attachTo(i, {
                    focusId: this.attr.focusId
                })
            }.bind(this)), this.select("columnsContainerSelector").dragdroplist({
                selector: this.attr.columnSelector,
                contentSelector: this.attr.columnSelector,
                handle: this.attr.columnDragHandleSelector,
                $boundary: this.select("appColumnsContainerSelector"),
                orientation: "horizontal",
                tagName: "section",
                scroll_speed: 24
            }).on("dropped.dragdroplist", function() {
                var e = [];
                $(".js-column").each(function() {
                    e.push($(this).attr("data-column"))
                }), TD.storage.clientController.client.setColumnOrder(e)
            }), this.on(document, "dataColumnOrder", this.calculateColumnVisibilities), this.on(this.$scrollContainer, "scroll", this.calculateColumnVisibilities), this.on(window, "resize", this.calculateColumnVisibilities), TD.util.isTouchDevice() && this.on(this.$scrollContainer, "scroll", function() {
                TD.util.cancelFastClick()
            })
        })
    };
    return e(r, t, i, s)
}), define("ui/with_focus", [], function() {
    var e = function() {
        this.focusRequest = function() {
            this.trigger("uiFocusRequest", {
                id: this.focusId
            })
        }, this.focusRelease = function() {
            this.trigger("uiFocusRelease", {
                id: this.focusId
            })
        }, this.handleFocus = function(e, t) {
            this.hasFocus = t.id === this.focusId ? !0 : !1
        }, this.after("teardown", function() {
            this.trigger("uiFocusRelease", {
                id: this.focusId
            })
        }), this.after("initialize", function() {
            this.focusId = this.attr.focusId || _.uniqueId("focus"), this.hasFocus = !1, this.on(document, "uiFocus", this.handleFocus), this.attr.autoFocus === !0 && this.focusRequest()
        })
    };
    return e
}), define("ui/grid", ["flight/lib/component", "ui/with_focus", "ui/with_column_selectors"], function(e, t, i) {
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
        }), this.setSelectedColumn = function(e) {
            var t = this.columns.length;
            0 > e ? e = 0 : e >= t && (e = t - 1), this.columns[e] !== this.selectedColumn && (clearTimeout(this.chirpCenterTimeout), this.chirpCenter = this.calculateChirpCenterRelativeToColumn(this.selectedColumn, this.$selectedChirp), this.chirpCenterTimeout = setTimeout(function() {
                this.chirpCenter = null
            }.bind(this), 1e3), this.selectedColumn = this.columns[e], this.columnIndex = e, null === this.chirpCenter ? this.selectFirstChirpInSelectedColumn() : this.selectClosestChirpToOffsetCenter(this.selectedColumn, this.chirpCenter, !0))
        }, this.selectClosestChirpToOffsetCenter = function(e, t, i) {
            var s = this.selectedColumn.model.getKey(),
                n = this.getColumnScrollContainerByKey(s),
                r = n.innerHeight(),
                o = n.find(this.attr.chirpSelector),
                a = $(),
                c = null,
                l = Number.MAX_VALUE;
            o.each(function() {
                var e = $(this),
                    i = e.position().top,
                    s = i + e.outerHeight();
                s >= 0 && r >= i && t >= i && s >= t && (a = $().add(e))
            }), 0 === a.length ? c = o.last() : 1 === a.length ? c = a : a.each(function(i, s) {
                var n = this.calculateChirpCenterRelativeToColumn(e, $(s)),
                    r = Math.abs(t - n);
                l = Math.min(r, l), r === l && (c = $(s))
            }.bind(this)), this.setSelectedChirp(c, i)
        }, this.calculateChirpCenterRelativeToColumn = function(e, t) {
            if (0 === t.length || null !== this.chirpCenter) return this.chirpCenter;
            var i, s, n, r = e.model.getKey(),
                o = this.getColumnScrollContainerByKey(r).innerHeight();
            return i = t.position().top, s = t.outerHeight(), n = i + s / 2, n > o ? n = o : 0 > n && (n = 0), n
        }, this.selectFirstChirpInSelectedColumn = function() {
            var e;
            if (this.isInDetailView()) this.$selectedChirp = this.selectedColumn.detailViewComponent.getMostInteresting$Chirp();
            else if (!this.isInDetailViewLevel2()) {
                e = this.selectedColumn.model.getKey();
                var t = this.getColumnElementByKey(e).find(this.attr.chirpSelector);
                this.$selectedChirp.removeClass(this.attr.isSelectedClass), this.$selectedChirp = $(), t.each(function(e, t) {
                    var i = $(t);
                    return i.position().top + i.outerHeight() / 2 > 0 ? (this.$selectedChirp = i, !1) : void 0
                }.bind(this)), 0 === this.$selectedChirp.length && (this.$selectedChirp = t.first())
            }
            this.$selectedChirp.addClass(this.attr.isSelectedClass), this.scrollToChirp("up")
        }, this.setSelectedChirp = function(e, t) {
            this.$selectedChirp.length > 0 && this.$selectedChirp.removeClass(this.attr.isSelectedClass), this.$selectedChirp = e, this.$selectedChirp.addClass(this.attr.isSelectedClass), t && this.$selectedChirp.length > 0 && this.scrollToChirp(this.scrollDirection)
        }, this.selectPrevChirp = function() {
            var e, t, i;
            this.chirpCenter = null, this.isInDetailView() ? (t = this.selectedColumn.detailViewComponent.$find(this.attr.chirpSelector), i = t.index(this.$selectedChirp), e = t.eq(Math.max(0, i - 1))) : e = this.$selectedChirp.prev(this.attr.chirpSelector), 0 === e.length ? this.selectFirstChirpInSelectedColumn() : this.setSelectedChirp(e, !0)
        }, this.selectNextChirp = function() {
            var e, t, i;
            this.chirpCenter = null, this.isInDetailView() ? (t = this.selectedColumn.detailViewComponent.$find(this.attr.chirpSelector), i = t.index(this.$selectedChirp), e = t.eq(Math.min(t.length - 1, i + 1))) : e = this.$selectedChirp.next(this.attr.chirpSelector).length > 0 ? this.$selectedChirp.next(this.attr.chirpSelector) : this.$selectedChirp, 0 === e.length ? this.selectFirstChirpInSelectedColumn() : this.setSelectedChirp(e, !0)
        }, this.moveSelection = function(e) {
            var t = function() {
                var t;
                if (this.hasFocus)
                    if (null === this.selectedColumn) this.setSelectedColumn(0);
                    else {
                        switch (this.scrollDirection = e, e) {
                            case "left":
                                t = null === this.columnIndex ? 0 : this.columnIndex - 1, this.setSelectedColumn(t);
                                break;
                            case "right":
                                t = null === this.columnIndex ? 0 : this.columnIndex + 1, this.setSelectedColumn(t);
                                break;
                            case "up":
                                this.selectPrevChirp();
                                break;
                            case "down":
                                this.selectNextChirp();
                                break;
                            default:
                        }
                        this.trigger("uiColumnsScrollToColumn", {
                            column: this.selectedColumn,
                            source: this.attr.id,
                            offset: this.attr.columnScrollOffset,
                            direction: this.scrollDirection
                        })
                    }
            }, i = _.throttle(t.bind(this), 100);
            return i
        }, this.handleColumnOrderData = function(e, t) {
            t.columns && (this.columns = t.columns, this.columnIndex = null, this.selectedColumn && this.columns.forEach(function(e, t) {
                this.selectedColumn === e && (this.columnIndex = t)
            }.bind(this)), null === this.columnIndex && (this.selectedColumn = null, this.$selectedChirp = $(), this.offset = null))
        }, this.selectColumnByKey = function(e) {
            if (this.selectedColumn && this.selectedColumn.model.getKey() === e) return !1;
            for (var t = 0; this.columns.length > t; t++)
                if (this.columns[t].model.getKey() === e) return this.columnIndex = t, this.selectedColumn = this.columns[t], !0;
            return !1
        }, this.selectColumnByIndex = function(e) {
            return this.selectedColumn !== this.columns[e] ? (this.columnIndex = e, this.selectedColumn = this.columns[e], !0) : !1
        }, this.selectLastColumn = function() {
            return this.selectColumnByIndex(this.columns.length - 1)
        }, this.handleColumnFocus = function(e, t) {
            if (this.hasFocus) {
                var i = !1;
                this.$selectedChirp.removeClass(this.attr.isSelectedClass), void 0 !== t.columnKey ? i = this.selectColumnByKey(t.columnKey) : void 0 !== t.index ? i = this.selectColumnByIndex(t.index) : t.last === !0 && (i = this.selectLastColumn()), i ? (this.$selectedChirp = $(), this.chirpIndex = null, this.offset = null) : (this.$selectedChirp.addClass(this.attr.isSelectedClass), 1 === this.selectedColumn.visibility.visibleFraction && this.trigger("uiGridHome"))
            }
        }, this.clearSelection = function() {
            this.$selectedChirp.removeClass(this.attr.isSelectedClass), this.$selectedChirp = $(), this.selectedColumn = null, this.chirpIndex = null, this.columnIndex = null, this.offset = null
        }, this.scrollToChirp = function(e) {
            this.trigger("uiColumnsScrollToChirp", {
                columnKey: this.selectedColumn.model.getKey(),
                $chirp: this.$selectedChirp,
                direction: e,
                offset: this.attr.chirpScrollOffset
            })
        }, this.handleBack = function() {
            var e, t, i, s;
            this.hasFocus && (s = this.getColumnElementByKey(this.selectedColumn.model.getKey()), this.isInDetailView() ? (e = this.selectedColumn.detailViewComponent.parentChirp, i = this.selectedColumn.getChirpContainer(), t = i.find('[data-key="' + e.id + '"]'), s.trigger("uiCloseDetailView"), t.addClass(this.attr.isSelectedClass), this.$selectedChirp = t, this.scrollToChirp("down")) : this.isInDetailViewLevel2() && s.trigger("uiCloseSocialProof"))
        }, this.handleClearSelection = function() {
            this.hasFocus && this.clearSelection()
        }, this.isInDetailView = function() {
            var e = this.getColumnElementByKey(this.selectedColumn.model.getKey());
            return e.hasClass(this.attr.columnStateDetailViewClass)
        }, this.isInDetailViewLevel2 = function() {
            var e = this.getColumnElementByKey(this.selectedColumn.model.getKey());
            return e.hasClass(this.attr.columnStateSocialProofClass)
        }, this.tweetActionFactory = function(e) {
            return function() {
                var t, i, s, n;
                if (this.hasFocus && this.$selectedChirp.length > 0 && !this.isInDetailViewLevel2()) {
                    if (i = this.$selectedChirp.attr("data-key"), t = this.selectedColumn.findMostInterestingChirp(i), !t) return;
                    switch (e) {
                        case "profile":
                            t.getMainUser ? s = t.getMainUser() : t.getRelatedUser && (s = t.getRelatedUser()), s && this.trigger("uiShowProfile", {
                                id: s.screenName
                            });
                            break;
                        case "viewDetails":
                            if (t instanceof TD.services.TwitterDirectMessage) return;
                        default:
                            if (t instanceof TD.services.TwitterAction) return;
                            n = "reply" === e && (t instanceof TD.services.TwitterDirectMessage || t instanceof TD.services.TwitterMessageThread) ? "dm" : e, this.parentChirp = this.selectedColumn.findChirp(i), $.publish("chirp/action", [n, t, this.parentChirp, this.selectedColumn, {
                                element: this.$selectedChirp
                            }])
                    }
                } else switch (e) {
                    case "dm":
                        this.trigger("uiShowMessageCompose")
                }
            }.bind(this)
        }, this.handleDetailViewActive = function(e, t) {
            var i = t.$chirp.closest(this.attr.columnSelector);
            this.selectColumnByKey(i.attr("data-column")), this.$selectedChirp.removeClass(this.attr.isSelectedClass), this.$selectedChirp = t.$chirp, this.parentChirp === t.parentChirp && this.$selectedChirp.addClass(this.attr.isSelectedClass)
        }, this.handleDetailClosed = function(e, t) {
            var i;
            t && t.column && (i = t.column.model.getKey(), this.$selectedChirp.removeClass(this.attr.isSelectedClass), this.selectColumnByKey(i), this.$selectedChirp = $())
        }, this.handlePagingFactory = function(e) {
            var t = function() {
                if (this.hasFocus && this.selectedColumn) {
                    var t, i, s, n, r, o, a, c = this.selectedColumn.model.getKey(),
                        l = this.getColumnScrollContainerByKey(c),
                        u = l.scrollTop(),
                        h = l.innerHeight();
                    if (0 === this.$selectedChirp.length && this.selectFirstChirpInSelectedColumn(), null !== this.chirpOffsetTop ? t = this.chirpOffsetTop : (t = this.$selectedChirp.position().top, this.targetChirpOffsetTop = null), this.chirpOffsetTop = t, this.$selectedChirp.removeClass(this.attr.isSelectedClass), "down" === e) {
                        this.targetChirpOffsetTop = null === this.targetChirpOffsetTop ? t + h : this.targetChirpOffsetTop + h;
                        do o = this.$selectedChirp.next(this.attr.chirpSelector), o.length > 0 && (this.$selectedChirp = o); while (o.length > 0 && o.position().top < this.targetChirpOffsetTop);
                        i = u + (this.$selectedChirp.position().top - t), i + h + 50 > l.get(0).scrollHeight && (i += 50), s = i - u
                    } else {
                        this.targetChirpOffsetTop = null === this.targetChirpOffsetTop ? t - h : this.targetChirpOffsetTop - h;
                        do r = this.$selectedChirp.prev(this.attr.chirpSelector), r.length > 0 && (this.$selectedChirp = r); while (r.length > 0 && r.position().top > this.targetChirpOffsetTop);
                        i = u - (t + Math.abs(this.$selectedChirp.position().top)), s = u - i
                    }
                    this.$selectedChirp.addClass(this.attr.isSelectedClass), a = function() {
                        this.chirpOffsetTop = null, this.targetChirpOffsetTop = null
                    }.bind(this), n = TD.ui.columns.calculateScrollDuration(s, 50, 750), l.stop().animate({
                        scrollTop: i
                    }, n, this.attr.pagingEasingFunction, a)
                }
            };
            return t.bind(this)
        }, this.handleGridHome = function() {
            if (this.hasFocus && this.selectedColumn) {
                this.chirpOffsetTop = null, this.targetChirpOffsetTop = null;
                var e = this.selectedColumn.model.getKey(),
                    t = this.getColumnScrollContainerByKey(e),
                    i = t.scrollTop(),
                    s = TD.ui.columns.calculateScrollDuration(i, 20, 300);
                this.$selectedChirp.removeClass(this.attr.isSelectedClass), this.$selectedChirp = this.$selectedChirp.parent().find(".js-stream-item:first"), this.$selectedChirp.addClass(this.attr.isSelectedClass), t.stop().animate({
                    scrollTop: 0
                }, s, this.attr.pagingEasingFunction)
            }
        }, this.handleGridEnd = function() {
            if (this.hasFocus && this.selectedColumn) {
                this.chirpOffsetTop = null, this.targetChirpOffsetTop = null;
                var e = this.selectedColumn.model.getKey(),
                    t = this.getColumnScrollContainerByKey(e),
                    i = t.scrollTop(),
                    s = t.get(0).scrollHeight - t.innerHeight() + 50,
                    n = s - i,
                    r = TD.ui.columns.calculateScrollDuration(n, 20, 300);
                this.$selectedChirp.removeClass(this.attr.isSelectedClass), this.$selectedChirp = this.$selectedChirp.parent().find(".js-stream-item:last"), this.$selectedChirp.addClass(this.attr.isSelectedClass), t.stop().animate({
                    scrollTop: s
                }, r, this.attr.pagingEasingFunction)
            }
        }, this.after("initialize", function() {
            this.selectedColumn = null, this.$selectedChirp = $(), this.columnIndex = null, this.chirpCenter = null, this.scrollDirection = this.attr.down, this.chirpOffsetTop = null, this.on(document, "uiGridLeft", this.moveSelection("left")), this.on(document, "uiGridUp", this.moveSelection("up")), this.on(document, "uiGridRight", this.moveSelection("right")), this.on(document, "uiGridDown", this.moveSelection("down")), this.on(document, "uiGridBack", this.handleBack), this.on(document, "uiGridClearSelection", this.handleClearSelection), this.on(document, "uiColumnFocus", this.handleColumnFocus), this.on(document, "uiGridPageDown", this.handlePagingFactory("down")), this.on(document, "uiGridPageUp", this.handlePagingFactory("up")), this.on(document, "uiGridHome", this.handleGridHome), this.on(document, "uiGridEnd", this.handleGridEnd), this.on(document, "uiGridShowDetail", this.tweetActionFactory("viewDetails")), this.on(document, "uiGridReply", this.tweetActionFactory("reply")), this.on(document, "uiGridFavorite", this.tweetActionFactory("favorite")), this.on(document, "uiGridRetweet", this.tweetActionFactory("retweet")), this.on(document, "uiGridDirectMessage", this.tweetActionFactory("dm")), this.on(document, "uiGridProfile", this.tweetActionFactory("profile")), this.on(document, "uiDetailViewActive", this.handleDetailViewActive), this.on(document, "uiShowSocialProof", this.handleDetailViewActive), this.on(document, "uiDetailViewClosed", this.handleDetailClosed), this.on(document, "dataColumnOrder", this.handleColumnOrderData), this.trigger("uiNeedsColumnOrder", {
                source: this.attr.id
            })
        })
    };
    return e(s, t, i)
}), define("ui/focus_controller", ["flight/lib/component"], function(e) {
    var t = function() {
        this.handleFocusRequest = function(e, t) {
            t && void 0 !== t.id && this.focusHistory[this.focusHistory.length - 1] !== t.id && (this.focusHistory.push(t.id), this.trigger("uiFocus", {
                id: t.id
            }))
        }, this.handleFocusRelease = function(e, t) {
            t && void 0 !== t.id && (this.focusHistory[this.focusHistory.length - 1] === t.id ? (this.focusHistory = this.focusHistory.filter(function(e) {
                return e !== t.id
            }), this.focusHistory.length > 0 && _.defer(function() {
                this.trigger("uiFocus", {
                    id: this.focusHistory[this.focusHistory.length - 1]
                })
            }.bind(this))) : this.focusHistory = this.focusHistory.filter(function(e) {
                return e !== t.id
            }))
        }, this.after("initialize", function() {
            this.focusHistory = [], this.on(document, "uiFocusRequest", this.handleFocusRequest), this.on(document, "uiFocusRelease", this.handleFocusRelease)
        })
    };
    return e(t)
}), define("ui/confirmation_dialog_controller", ["flight/lib/component"], function(e) {
    var t = function() {
        this.showConfirmationDialog = function(e, t) {
            this.trigger(document, "uiConfirmationAction", {
                id: t.id,
                result: confirm(t.message) ? !0 : !1
            })
        }, this.after("initialize", function() {
            this.on(document, "uiShowConfirmationDialog", this.showConfirmationDialog)
        })
    };
    return e(t)
}), define("util/notifications", [], function() {
    var e = {};
    return e.publishToQueue = function(e, t) {
        TD.storage.notification.notify(e, t)
    }, e.publish = function(e, t) {
        $.publish(e, t)
    }, e.subscribe = function(e, t) {
        return $.subscribe(e, t)
    }, e.unsubscribe = function(e) {
        $.unsubscribe(e)
    }, e
}), define("ui/with_modal", ["util/notifications", "flight/lib/compose", "ui/with_focus"], function(e, t, i) {
    function s() {
        t.mixin(this, [i]), this.defaultAttrs({
            dismissButton: ".js-dismiss",
            modal: ".js-modal",
            modalPanel: ".js-modal-panel",
            modalDragHandle: ".mdl-drag-handle",
            isDraggingClass: "is-dragging",
            isTouchModalClass: "is-touch-modal",
            openModalID: "#open-modal",
            autoFocus: !0
        }), this.handleDragStart = function() {
            var e = this.select("modalPanel");
            e.css({
                position: "absolute",
                top: e.offset().top,
                left: e.offset().left
            }), this.$node.addClass(this.attr.isDraggingClass)
        }, this.getDragDropBoundary = function() {
            return this.$node
        }, this.dismiss = function() {
            this.attr.closeEvent && this.trigger(this.attr.closeEvent)
        }, this.handleClickOnOverlay = function(e) {
            e.target === this.$node.get(0) && this.dismiss()
        }, this.after("teardown", function() {
            this.$node.hide()
        }), this.after("initialize", function() {
            this.trigger("uiCloseModal"), this.on(this.$node, "click", this.handleClickOnOverlay), this.on("click", {
                dismissButton: this.dismiss
            }), this.on(document, "uiCloseModal", this.dismiss)
        }), this.after("render", function() {
            this.select("modalPanel").draggable({
                boundary: this.getDragDropBoundary.bind(this),
                handle: this.select("modalDragHandle")
            }), this.on("start.draggable", this.handleDragStart), this.focusRequest();
            var e = this.select("modalPanel").parent(this.attr.modal),
                t = $(this.attr.openModalID);
            TD.util.isTouchDevice() && TD.decider.get(TD.decider.TOUCHDECK_MODALS) ? (e.addClass(this.attr.isTouchModalClass), t.addClass(this.attr.isTouchModalClass)) : (e.removeClass(this.attr.isTouchModalClass), t.removeClass(this.attr.isTouchModalClass))
        }), this.before("teardown", function() {
            this.$node.removeClass(this.attr.isDraggingClass)
        })
    }
    return s
}), define("ui/embed_tweet", ["flight/lib/component", "ui/with_template", "ui/with_modal"], function(e, t, i) {
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
        }), this.handleEmbeddedTweet = function(e, t) {
            var i, s, n, r, o, a, c, l;
            if (t && t.html && t.request && t.request.tweetID === this.attr.tweet.id && t.request.hideThread !== this.includeParentTweet && t.request.hideMedia !== this.includeMedia)
                if (this.putEmbedDataInCache(t), l = function(e) {
                    var l;
                    this.render("embed_tweet", {
                        html: t.html,
                        isReply: !! e.inReplyToID,
                        includeParentTweet: this.includeParentTweet,
                        hasMedia: !! e.cards,
                        includeMedia: this.includeMedia
                    }), this.select("modalTitle").text(TD.i("Embed this Tweet")), this.on(this.select("embedTextArea"), "focus", this.handleInputBoxFocus), s = this.select("embedIframe"), n = this.select("embedIframeContainer"), r = this.select("embedModalPanel"), o = this.select("embedModalHeader"), a = this.select("embedModalContent"), c = this.select("embedLoading"), l = function() {
                        n.css("height", "auto"), s.height(Math.max($("html", i).outerHeight(), $("body", i).outerHeight(), s.height())), r.height(a.height() + o.outerHeight()), $("a", i).attr("target", "_blank")
                    }.bind(this), s.load(function() {
                        c.addClass("is-hidden"), l(), this.resizeIframeIntervalId = setInterval(l, 500)
                    }.bind(this)), s[0] && (i = s[0].contentWindow.document, i.open(), i.write('<!DOCTYPE html><head><base href="https://api.tweetdeck.com"></head><body>' + t.html + "</body>" + "</html>"), i.close()), a.removeClass("horizontal-flow-container")
                }, !this.attr.tweet.cards && this.attr.tweet.hasLink()) {
                    var u = TD.controller.clients.getClient(this.attr.tweet.account.getKey());
                    u.show(this.attr.tweet.id, l.bind(this), function() {
                        this.trigger(document, this.attr.dataEmbeddedTweetErrorEvent, t)
                    }.bind(this))
                } else l.call(this, this.attr.tweet)
        }, this.handleEmbeddedTweetError = function(e, t) {
            t && t.request && t.request.tweetID === this.attr.tweet.id && (this.teardown(e), TD.controller.progressIndicator.addMessage(TD.i("Sorry, couldn't retrieve embedded Tweet. Please try again later.")))
        }, this.handleInputBoxFocus = function() {
            var e = this.select("embedTextArea");
            _.defer(function() {
                e.select()
            })
        }, this.handleEmbeddedTweetOptionsChange = function() {
            var e;
            this.includeParentTweet = $(this.attr.embedIncludeParentCheckBox).prop("checked"), this.includeMedia = $(this.attr.embedIncludeMediaCheckBox).prop("checked"), this.render("embed_tweet", {
                loading: !0
            }), e = this.getEmbedDataFromCache(), e ? this.trigger(document, "dataEmbeddedTweet", e) : this.trigger(document, "uiNeedsEmbeddedTweet", {
                tweetID: this.attr.tweet.id,
                hideThread: !this.includeParentTweet,
                hideMedia: !this.includeMedia
            })
        }, this.getEmbedDataFromCache = function() {
            var e = !! this.includeParentTweet,
                t = !! this.includeMedia,
                i = this.attr.embedDataCache[e + ":" + t];
            return i && i.request.tweetID === this.attr.tweet.id ? i : void 0
        }, this.putEmbedDataInCache = function(e) {
            var t = !! this.includeParentTweet,
                i = !! this.includeMedia;
            this.attr.embedDataCache[t + ":" + i] = e
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
    return e(s, t, i)
}), define("ui/keyboard_shortcut_list", ["flight/lib/component", "ui/with_template", "ui/with_modal"], function(e, t, i) {
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
    return e(s, t, i)
}), define("ui/with_column_config", [], function() {
    var e = function() {
        this.before("initialize", function() {
            this.columnConfig = {
                DISPLAY_ORDER_PROFILE: TD.controller.columnManager.DISPLAY_ORDER_PROFILE,
                OPEN_COLUMN_URL_BASE: TD.components.OpenColumnHome.URL_BASE,
                GO_EVENT: TD.components.OpenColumn.GO_EVENT
            }
        })
    };
    return e
}), define("ui/relationship", ["flight/lib/component"], function(e) {
    var t = function() {
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
        }, this.setState = function(e, t) {
            this.state = e.following ? this.attr.states.following : this.attr.states.notFollowing, e.id === t.id && (this.state = this.attr.states.me), e.blocking && (this.state = this.attr.states.blocking)
        }, this.handleMenuButtonClick = function(e) {
            this.menu ? this.menu.destroy() : (this.menu = new TD.components.ProfileMenu(this.select("menuButton"), TD.components.DropDown.POSITION_LEFT, this.twitterUser), e.stopPropagation())
        }, this.handleFollowButtonClick = function(e) {
            var t = {
                account: this.account,
                twitterUser: this.twitterUser
            };
            switch (this.state) {
                case this.attr.states.following:
                    this.trigger("uiUnfollowAction", t);
                    break;
                case this.attr.states.notFollowing:
                    this.trigger("uiFollowAction", t);
                    break;
                case this.attr.states.blocking:
                    this.trigger("uiUnblockAction", t);
                    break;
                case this.attr.states.me:
                    TD.util.openURL("https://twitter.com/settings/profile");
                    break;
                case this.attr.states.unknown:
                    break;
                default:
            }
            e.stopPropagation()
        }, this.enableButton = function() {
            this.select("followButton").prop("disabled", !1)
        }, this.setTargetElementState = function() {
            this.$node.addClass(this.attr.classNamesForStates[this.state])
        }, this.isRelevantRelationship = function(e) {
            return this.account.isSameUser(e.source.screen_name) && this.twitterUser.isSameUser(e.target.screen_name)
        }, this.handleRelationshipData = function(e, t) {
            t && t.relationship && this.isRelevantRelationship(t.relationship) && (this.resetState(), this.setState(t.relationship.source, t.relationship.target), this.state !== this.attr.states.unknown && this.enableButton(), this.setTargetElementState())
        }, this.isRelevantAction = function(e) {
            return e && e.twitterUser && e.twitterUser.isSameUser(this.twitterUser) && e.account === this.account
        }, this.handleActionFactory = function(e) {
            var t = function(t, i) {
                this.isRelevantAction(i) && (this.resetState(), this.state = this.attr.states[e], this.setTargetElementState())
            };
            return t.bind(this)
        }, this.handlePubSubEvent = function(e) {
            var t = function(t, i) {
                i.getAccountKey() === this.account.getAccountKey() && (this.resetState(), this.state = this.attr.states[e], this.setTargetElementState())
            };
            return t.bind(this)
        }, this.destroy = function(e) {
            e.stopPropagation(), this.teardown()
        }, this.destroyMenuReference = function() {
            this.menu = null
        }, this.after("initialize", function() {
            this.account = this.attr.account, this.twitterUser = this.attr.twitterUser, this.state = this.attr.states.unknown, this.on(document, "dataRelationship", this.handleRelationshipData), this.on("click", {
                followButton: this.handleFollowButtonClick,
                menuButton: this.handleMenuButtonClick
            }), this.on("td-dropdown-close", this.destroyMenuReference), this.on(document, "uiFollowAction dataUnfollowActionError", this.handleActionFactory("following")), this.on(document, "uiUnfollowAction dataFollowActionError", this.handleActionFactory("notFollowing")), this.on(document, "uiBlockAction dataUnblockActionError", this.handleActionFactory("blocking")), this.on(document, "uiUnblockAction dataBlockActionError dataReportActionError", this.handleActionFactory("notFollowing")), $.subscribe("/user/" + this.screenName + "/block", this.handlePubSubEvent("blocking")), $.subscribe("/user/" + this.screenName + "/unblock", this.handlePubSubEvent("notFollowing")), this.attr.closeEvent && this.on(this.attr.closeEvent, this.destroy), this.trigger("uiNeedsRelationship", {
                account: this.account,
                screenName: this.twitterUser.screenName
            })
        })
    };
    return e(t)
}), define("ui/follow_state", ["flight/lib/component"], function(e) {
    var t = function() {
        this.defaultAttrs({
            follows: "s-follows"
        }), this.handleRelationshipData = function(e, t) {
            t && t.relationship && this.account.isSameUser(t.relationship.source.screen_name) && this.twitterUser.isSameUser(t.relationship.target.screen_name) && this.$node.toggleClass(this.attr.follows, t.relationship.target.following)
        }, this.destroy = function(e) {
            e.stopPropagation(), this.teardown()
        }, this.after("initialize", function() {
            if (this.account = this.attr.account, this.twitterUser = this.attr.twitterUser, !(this.account instanceof TD.storage.Account)) throw "source must be instance of TD.storage.Account";
            if (!(this.twitterUser instanceof TD.services.TwitterUser)) throw "target must be instance of TD.services.TwitterUser";
            this.on(document, "dataRelationship", this.handleRelationshipData), this.attr.closeEvent && this.on(this.attr.closeEvent, this.destroy), this.trigger("uiNeedsRelationship", {
                account: this.account,
                screenName: this.twitterUser.screenName
            })
        })
    };
    return e(t)
}), define("ui/twitter_profile", ["flight/lib/component", "ui/with_template", "ui/with_modal", "ui/with_column_config", "ui/relationship", "util/notifications", "ui/follow_state", "ui/with_transitions"], function(e, t, i, s, n, r, o, a) {
    function c() {
        this.defaultAttrs({
            dataAction: "[data-action]",
            socialProofSelector: ".js-social-proof",
            followFromSelector: ".js-action-follow",
            followStateSelector: ".prf-follow-status",
            closeEvent: "uiCloseTwitterProfile",
            numUsersInSocialProof: 3,
            isSocialProofAnimatingClass: "social-proof-animating"
        }), this.handleTwitterAccount = function(e, t) {
            if (t && t.account && t.screenName && t.screenName.toLowerCase() === this.screenName.toLowerCase()) {
                this.twitterUser = t, this.render("twitter_profile", {
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
                n.attachTo(this.select("followFromSelector"), i), o.attachTo(this.select("followStateSelector"), i)
            }
        }, this.handleTwitterUserError = function(e, t) {
            t.screenName.toLowerCase() === this.screenName.toLowerCase() && this.teardown()
        }, this.handleSocialProofData = function(e, t) {
            var i, s, n, r, o = this.select("socialProofSelector"),
                a = this.select("modalPanel"),
                c = [],
                l = 0,
                u = [];
            if (t.users && t.users.length) {
                if (t.users.length > this.attr.numUsersInSocialProof)
                    for (l = t.users.length - this.attr.numUsersInSocialProof; c.length < this.attr.numUsersInSocialProof;) r = Math.floor(Math.random() * t.users.length), c.push(t.users.splice(r, 1)[0]);
                else c = t.users;
                c.forEach(function(e) {
                    u.push(TD.ui.template.render("text/social_proof_link", e))
                }), l > 0 && u.push(TD.ui.template.render("text/followers_you_follow_link", {
                    screenName: this.screenName
                })), u.length > 1 && (s = u.splice(u.length - 1, 1)), i = u.join(", "), n = a.position(), a.css("position", "absolute").css("left", n.left).css("top", n.top), o.removeClass("is-hidden"), o.html(TD.ui.template.render("twitter_profile_social_proof", {
                    followedByString: i,
                    others: s
                })), this.transitionExpand(o, this.attr.isSocialProofAnimatingClass)
            }
        }, this.handleActionClick = function(e) {
            var t = $(e.currentTarget),
                i = (t.data("action"), t.data("type")),
                s = this.columnConfig.OPEN_COLUMN_URL_BASE + "/" + i,
                n = TD.util.maybeOpenClickExternally(e);
            n || (this.screenName && (s += "?screenName=" + this.screenName), r.publishToQueue(this.columnConfig.GO_EVENT, {
                data: s,
                history: {
                    type: "uiShowProfile",
                    target: document,
                    data: {
                        id: this.screenName
                    }
                }
            }), e.preventDefault(), e.stopPropagation())
        }, this.destroy = function(e) {
            e.stopPropagation(), this.teardown()
        }, this.before("teardown", function() {
            this.trigger(this.select("followStateSelector"), this.attr.closeEvent), this.trigger(this.select("followFromSelector"), this.attr.closeEvent)
        }), this.after("teardown", function() {
            this.$node.html("")
        }), this.handleAccounts = function(e, t) {
            this.isSingleAccount = 1 === t.accounts.length
        }, this.after("initialize", function() {
            this.screenName = "" + this.attr.screenName, this.account = this.attr.account, 0 === this.screenName.indexOf("@") && (this.screenName = this.screenName.substring(1)), this.on(document, "dataAccounts", this.handleAccounts), this.trigger(document, "uiNeedsAccounts"), this.on(document, "dataTwitterUser", this.handleTwitterAccount), this.on(document, "dataTwitterUserError", this.handleTwitterUserError), this.on(document, "dataUserProfileSocialProof", this.handleSocialProofData), this.render("twitter_profile", {
                loading: !0
            }), this.trigger(document, "uiNeedsTwitterUser", {
                screenName: this.screenName
            }), this.on(this.attr.closeEvent, this.destroy)
        })
    }
    return e(c, t, i, s, a)
}), define("ui/report_tweet_options", ["flight/lib/component", "ui/with_template", "ui/with_modal"], function(e, t, i) {
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
            }), this.on(this.$node, "click", this.handleOffNodeDismiss), this.on(this.attr.closeEvent, this.teardown)
        }), this.handleInputClick = function(e) {
            var t = $(e.target).val();
            "block" === t ? n = $(e.target).prop("checked") : this.setBlockCheckbox(t), "abusive" === t ? this.select("submitButton").text(TD.i("Next")) : this.select("submitButton").text(TD.i("Submit")), this.select("submitButton").prop("disabled", !Boolean(this.select("inputs").filter(":checked").length))
        }, this.handleSubmitclick = function() {
            var e = this.select("optionRadios").filter(":checked").val(),
                t = $("input[name=report-block]").is(":checked");
            "spam" === e ? this.trigger("uiReportSpamAction", {
                account: this.attr.account,
                twitterUser: this.attr.twitterUser,
                block: t
            }) : "compromised" === e ? this.trigger("uiReportCompromisedAction", {
                account: this.attr.account,
                twitterUser: this.attr.twitterUser,
                block: t
            }) : "abusive" === e && (this.renderAbusiveModal(), this.trigger("uiReportAbusiveAction", {
                block: t
            })), "spam" !== e && t && this.trigger("uiBlockAction", {
                account: this.attr.account,
                twitterUser: this.attr.twitterUser
            }), "abusive" !== e && this.dismiss()
        }, this.setBlockCheckbox = function(e) {
            "spam" === e ? this.select("blockCheckbox").prop({
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
        }, this.handleAbuseLinkClick = function(e) {
            this.trigger("uiReportAbusiveOption", {
                option: $(e.target).attr("data-scribe")
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
    return e(s, t, i)
}), define("ui/with_dialog_manager", ["ui/embed_tweet", "ui/keyboard_shortcut_list", "ui/twitter_profile", "ui/report_tweet_options"], function(e, t, i, s) {
    var n = function() {
        this.showProfile = function(e, t) {
            this.trigger("uiCloseModal"), i.attachTo(this.select("modal"), {
                screenName: t.id,
                account: this.preferredAccount
            }), this.select("modal").show()
        }, this.showCompose = function() {
            $(document).trigger("uiComposeTweet")
        }, this.showMessageCompose = function() {
            $(document).trigger("uiComposeTweet", {
                type: "message"
            })
        }, this.showAddColumn = function() {
            TD.ui.openColumn.showOpenColumn()
        }, this.showEmbedTweet = function(t, i) {
            e.attachTo(this.select("modal"), {
                tweet: i.tweet
            }), this.select("modal").show()
        }, this.showKeyboardShortcutList = function() {
            t.attachTo(this.select("modal")), this.select("modal").show()
        }, this.showReportTweetOptions = function(e, t) {
            s.attachTo(this.select("modal"), {
                account: t.account,
                twitterUser: t.twitterUser,
                tweetId: t.tweetId
            }), this.select("modal").show()
        }, this.after("initialize", function() {
            this.on("uiShowProfile", this.showProfile), this.on("uiShowCompose", this.showCompose), this.on("uiShowMessageCompose", this.showMessageCompose), this.on("uiShowAddColumn", this.showAddColumn), this.on("uiShowEmbedTweet", this.showEmbedTweet), this.on("uiShowKeyboardShortcutList", this.showKeyboardShortcutList), this.on("uiShowReportTweetOptions", this.showReportTweetOptions)
        })
    };
    return n
}), define("ui/message_banner/with_access_denied_message_banner", [], function() {
    var e = function() {
        this.getReauthorizeAccountMessageData = function(e) {
            return {
                id: "expired-token-error",
                text: TD.i("TweetDeck no longer has permission to access account @{{1}}.", {
                    1: e.account.getUsername()
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
                            account: e.account
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
                            key: e.account.getKey()
                        }
                    }
                }]
            }
        }
    };
    return e
}), define("ui/message_banner/with_account_suspended_message_banner", [], function() {
    var e = function() {
        this.getAccountSuspendedMessageData = function(e) {
            return {
                id: "expired-token-error",
                text: TD.i("Your account @{{1}} is currently suspended.", {
                    1: e.account.getUsername()
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
    return e
}), define("ui/message_banner/with_facebook_removed_message_banner", [], function() {
    var e = function() {
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
    return e
}), define("ui/message_banner_container", ["flight/lib/component", "ui/with_transitions", "ui/message_banner/with_access_denied_message_banner", "ui/message_banner/with_account_suspended_message_banner", "ui/message_banner/with_facebook_removed_message_banner"], function(e, t, i, s, n) {
    var r = function() {
        this.defaultAttrs({
            messageSelector: ".js-message-banner",
            applicationSelector: ".js-app",
            isAnimatingClass: "is-application-animating"
        }), this._onHidden = function() {
            this.trigger("uiMessageBannerContainerHidden")
        }, this.showAccessDeniedMessage = function(e, t) {
            var i = this.getReauthorizeAccountMessageData(t);
            $(document).trigger("dataMessage", {
                message: i
            })
        }, this.showAccountSuspendedMessage = function(e, t) {
            var i = this.getAccountSuspendedMessageData(t);
            $(document).trigger("dataMessage", {
                message: i
            })
        }, this.showFacebookRemovedMessage = function(e, t) {
            var i = this.getFacebookRemovedMessageData(t);
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
    return e(r, t, i, s, n)
}), define("ui/image_upload", ["flight/lib/component"], function(e) {
    var t = function() {
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
        }), this.validateFile = function(e) {
            var t = e.type.split("/")[1],
                i = e.size,
                s = {
                    success: !0
                };
            return this.files.length >= this.attr.MAX_ALLOWED_FILES ? s.error = this.attr.errors.MAX_FILES_ALREADY_ADDED_ERROR : _.include(this.attr.ALLOWED_IMAGE_TYPES, t) ? i > this.attr.MAX_ALLOWED_SIZE && (s.error = this.attr.errors.INVALID_FILESIZE_ERROR) : s.error = this.attr.errors.INCORRECT_FILETYPE_ERROR, s.error && (s.success = !1), s
        }, this.validateFiles = function(e) {
            var t = this.validateFileCount(e.length);
            if (!t.success) return t;
            for (var i = 0; e.length > i; i++)
                if (validateResult = this.validateFile(e[i]), !validateResult.success) return validateResult;
            return validateResult
        }, this.validateFileCount = function(e) {
            var t = {
                success: !0
            };
            return e > this.attr.MAX_ALLOWED_FILES ? t.error = this.attr.errors.TOO_MANY_FILES_ERROR : this.files.length > 0 && this.files.length + e > this.attr.MAX_ALLOWED_FILES && (t.error = this.attr.errors.MAX_FILES_ALREADY_ADDED_ERROR), t.error && (t.success = !1), t
        }, this.handleResetImageUpload = function() {
            this.files = []
        }, this.addFilesToUpload = function(e) {
            var t;
            if (e) {
                if (t = this.validateFiles(e), !t.success) switch (t.error) {
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
                    files: e
                }), this.files = _.zip(this.files, e)
            }
        }, this.handleDragEnterEvent = function(e) {
            if (this.currentDragElement) return this.currentDragElement = e.target, void 0;
            if (this.currentDragElement = e.target, this.state = this.attr.states.DRAG_OK, e.originalEvent.dataTransfer.items) {
                e.preventDefault();
                var t, i, s = e.originalEvent.dataTransfer.items,
                    n = this.validateFileCount(s.length);
                if (n.success) {
                    for (var r = 0; s.length > r; r++)
                        if (t = s[r], "file" === t.kind && (i = this.validateFile(t), !i.success)) return this.state = this.attr.states.DRAG_ERROR, this.trigger("uiShowDropMessage", {
                            errorCondition: i.error
                        }), void 0;
                    this.trigger("uiShowDropMessage")
                } else this.state = this.attr.states.DRAG_ERROR, this.trigger("uiShowDropMessage", {
                    errorCondition: n.error
                })
            }
        }, this.handleDragLeaveEvent = function(e) {
            this.currentDragElement === e.target && (this.currentDragElement = null, this.state = this.attr.states.WAITING, this.trigger("uiHideDropMessage"))
        }, this.handleDropEvent = function(e) {
            if (e.preventDefault(), this.state === this.attr.states.DRAG_OK) {
                var t = e.originalEvent.dataTransfer.files;
                this.addFilesToUpload(t)
            }
            this.trigger("uiHideDropMessage"), this.state = this.attr.states.WAITING, this.currentDragElement = null
        }, this.cancel = function(e) {
            return e.preventDefault(), !1
        }, this.handleComposeAddImageClick = function() {
            $(this.attr.uploadInputSelector).click()
        }, this.handleFileUploadChange = function(e) {
            this.addFilesToUpload(e.target.files), $(this.attr.uploadInputSelector).remove(), $("body").append(this.attr.uploadInputTemplate)
        }, this.whenEnabled = function(e) {
            return function() {
                return this.attr.disabled ? void 0 : e.apply(this, [].slice.call(arguments))
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
    return e(t)
}), define("ui/login/login_form", ["require", "flight/lib/component", "ui/with_template"], function(e) {
    function t() {
        this.defaultAttrs({
            returnTweetDeckSelector: ".js-return-tweeteck-login",
            formSelector: ".js-twogin-login-form"
        }), this.after("initialize", function() {
            this.on(document, "uiLoginShowLoginForm", this.handleShowLoginForm), this.on(document, "dataLogin2FAChallenge", this.handleShow2FAChallenge), this.on(document, "dataLogin2FAWaiting", this.handleShow2FAWaiting), this.on(document, "dataLoginAuthFailed", this.handleloginAuthFailed), this.on(document, "dataLoginAuthSuccess", this.handleloginAuthSuccess), this.on("click", {
                returnTweetDeckSelector: this.handleReturnTweetDeck
            }), this.on("submit", {
                formSelector: this.handleFormSubmit
            })
        }), this.handleShowLoginForm = function() {
            this.render("login/login_form")
        }, this.handleFormSubmit = function(e) {
            e.preventDefault();
            var t = $(e.target),
                i = t.find(".js-twogin-username").val(),
                s = t.find(".js-twogin-password").val();
            i && s ? (this.hideErrorMessage(), this.trigger("uiLoginRequest", {
                username: i,
                password: s
            })) : this.showErrorMessage(TD.i("username and password must be filled in"))
        }, this.handleReturnTweetDeck = function(e) {
            TD.storage.storeUtils.setCurrentAuthType("tweetdeck"), window.location.reload(), e.preventDefault()
        }, this.handleShow2FAChallenge = function() {
            var e = this.renderTemplate("login/login_form");
            this.$node.html(e)
        }, this.handleShow2FAWaiting = function() {
            this.$node.html(TD.i("Waiting for login request to be accepted"))
        }, this.showErrorMessage = function(e) {
            this.$node.find(".js-twogin-error-message").html(e).show()
        }, this.hideErrorMessage = function() {
            this.$node.find(".js-twogin-error-message").hide()
        }, this.handleloginAuthSuccess = function() {
            console.log("handleloginAuthSuccess")
        }, this.handleloginAuthFailed = function() {
            console.log("handleloginAuthFailed")
        }
    }
    var i = e("flight/lib/component"),
        s = e("ui/with_template");
    return i(t, s)
}), define("ui/with_nav_flyover", ["flight/lib/compose", "ui/with_template"], function(e, t) {
    function i() {
        e.mixin(this, [t]), this.after("initialize", function() {
            this.mouseDown = !1, this.on(document, "mousedown", function() {
                this.mouseDown = !0
            }), this.on(document, "mouseup", function() {
                this.mouseDown = !1
            })
        }), this.renderFlyover = function(e, t) {
            if (!this.mouseDown) {
                var i;
                i = t && t.content ? t.content : e.data("title"), i && (this.$flyover = this.renderTemplate("column_nav_flyout", {
                    content: i
                }), $("body").append(this.$flyover), this.repositionFlyover(e))
            }
        }, this.destroyFlyover = function() {
            this.$flyover && (this.$flyover.remove(), this.$flyover = null)
        }, this.repositionFlyover = function(e) {
            var t;
            this.$flyover && (t = e.offset().top - (this.$flyover.height() - e.height()) / 2, this.$flyover.css("top", t))
        }
    }
    return i
}), define("ui/column_navigation", ["flight/lib/component", "ui/with_template", "ui/with_nav_flyover"], function(e, t, i) {
    function s() {
        var e = !1,
            t = null,
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
            this.renderColumnNavigation(), this.on(document, "dataColumnsLoaded", this.handleDataColumnsLoaded), this.on(document, "uiMainWindowResized", this.handleUiMainWindowResized), $.subscribe("/storage/client/column_order_changed", this.handleColumnsChanged.bind(this)), $.subscribe("/storage/client/change", this.handleColumnsChanged.bind(this)), this.on(document, "uiReadStateChange", this.handleReadStateChange), this.on(document, "dataSettings", this.handleDataSettings), this.on(document, "uiColumnTitleRefreshed", this.handleColumnTitleRefreshed), this.trigger("uiNeedsSettings"), this.$columnNavScroller = $(".js-column-nav-scroller"), TD.util.isTouchDevice() && this.on(this.$columnNavScroller, this.attr.touchEvents, this.handleTouch), this.initScrollbars()
        }), this.handleDataColumnsLoaded = function() {
            this.renderColumnNavigation()
        }, this.handleColumnsChanged = function() {
            this.initScrollbars()
        }, this.renderColumnNavigation = function() {
            var e, t, i = TD.controller.columnManager.getAllOrdered(),
                s = [];
            this.select("listItemSelector").each(function() {
                s.push($(this).attr("data-column"))
            }), e = s.length !== i.length, t = _.map(i, function(t, i) {
                var n = t.model.getKey(),
                    r = TD.ui.columns.getColumnElementByKey(n);
                return s[i] !== n && (e = !0), {
                    key: n,
                    title: t.getTitleHTML(),
                    iconclass: t.getIconClass(),
                    isNew: r.hasClass(this.attr.isNewClass)
                }
            }.bind(this)), e && (this.render(this.attr.templateName, {
                columns: t
            }), this.$content = this.select("contentSelector"), this.$addColumnButton = this.select("addColumnButtonSelector"), this.on("click", {
                headerActionSelector: this.handleClick.bind(this)
            }), this.select("headerActionSelector").on("mouseover", this.handleListItemMouseover.bind(this)).on("mouseout", this.handleListItemMouseout.bind(this)), this.resizeColumnNavigation(), this.initialiseDragDrop());
            var n = $(".js-column-nav-list a").find(":hover");
            n.length || this.destroyFlyover()
        }, this.resizeColumnNavigation = function() {
            var e = this.$node.height();
            this.$node && e && (this.$content.height() > e ? ($(document).trigger("uiColumnNavSizeOverflow"), this.$addColumnButton.hide()) : ($(document).trigger("uiColumnNavSizeNormal"), this.$addColumnButton.show()))
        }, this.handleUiMainWindowResized = function() {
            this.resizeColumnNavigation(), this.initScrollbars()
        }, this.handleClick = function(t) {
            if (!TD.util.isTouchDevice() || !e) {
                var i = $(t.target).closest("a[data-action]"),
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
        }, this.handleDrop = function(e) {
            var t = [],
                i = $(e.target).attr("data-column");
            TD.ui.columns.setMovingColumn(i), this.select("listItemSelector").each(function() {
                t.push($(this).attr("data-column"))
            }), TD.storage.clientController.client.setColumnOrder(t), TD.controller.stats.navbarReorderColumns()
        }, this.handleDrag = function(e) {
            this.repositionFlyover($(e.target))
        }, this.handleDropped = function(e) {
            this.repositionFlyover($(e.target))
        }, this.initialiseDragDrop = function() {
            this.select("dragAndDropContainerSelector").dragdroplist({
                handle: this.attr.dragHandleSelector,
                orientation: this.attr.listOrientation,
                selector: this.attr.listItemSelector,
                $boundary: this.$node
            }).on("drop.dragdroplist", this.handleDrop.bind(this)).on("drag.draggable", this.handleDrag.bind(this)).on("dropped.dragdroplist", this.handleDropped.bind(this))
        }, this.handleReadStateChange = function(e, t) {
            var i = this.$node.find(".js-column-nav-menu-item[data-column=" + t.columnKey + "]");
            i.toggleClass(this.attr.isNewClass, !t.read)
        }, this.handleListItemMouseover = function(e) {
            if (this.isNavbarCollapsed && !TD.util.isTouchDevice()) {
                var t, i, s = $(e.currentTarget),
                    n = s.data("column");
                n && (t = TD.controller.columnManager.get(n), i = {
                    content: t.getTitleHTML()
                }), this.isDragging() || this.renderFlyover(s, i)
            }
        }, this.handleListItemMouseout = function() {
            this.isDragging() || this.destroyFlyover()
        }, this.isDragging = function() {
            return this.$node.find(".draggable-dragging").length > 0
        }, this.handleDataSettings = function(e, t) {
            this.isNavbarCollapsed = Boolean("condensed" === t.navbarWidth), this.destroyFlyover()
        }, this.handleDataColumnStateUpdated = function(e, t) {
            var i = this.$node.find(".js-column-nav-menu-item[data-column=" + t.columnKey + "]");
            t.unread ? i.addClass(this.attr.isNewClass) : i.removeClass(this.attr.isNewClass)
        }, this.handleColumnTitleRefreshed = function(e, t) {
            var i = this.$node.find(".js-column-nav-menu-item[data-column=" + t.columnKey + "] .js-column-title");
            i.html(t.title)
        }, this.initScrollbars = function() {
            this.$columnNavScroller.antiscroll({
                position: "left"
            })
        }, this.handleTouch = function(n) {
            var r = $(n.target);
            if (0 !== r.closest(".js-drag-handle").length) {
                var o = null,
                    a = n.originalEvent,
                    c = a.changedTouches[0],
                    l = {
                        x: c.pageX,
                        y: c.pageY
                    }, u = (new Date).getTime();
                switch (a.type) {
                    case "touchstart":
                        e = !1, t = u, i = l, s = 0;
                        break;
                    case "touchmove":
                        var h = this.countDistance(l, i);
                        if (h > s && (s = h), t + 300 > u) break;
                        !e && 50 > s ? (e = !0, o = "mousedown") : e && (o = "mousemove");
                        break;
                    case "touchend":
                        e && (o = "mouseup")
                }
                o && this.simulateMouseEvent(o, a)
            }
        }, this.simulateMouseEvent = function(e, t) {
            var i = t.changedTouches[0],
                s = document.createEvent("MouseEvent");
            s.initMouseEvent(e, !0, !0, window, 1, i.screenX, i.screenY, i.clientX, i.clientY, !1, !1, !1, !1, 0, null), i.target.dispatchEvent(s), t.preventDefault()
        }, this.countDistance = function(e, t) {
            if (!e || !t) return 0;
            var i = Math.abs(e.x - t.x),
                s = Math.abs(e.y - t.y);
            return Math.sqrt(i * i + s * s)
        }
    }
    return e(s, t, i)
}), define("ui/with_popover", ["flight/lib/compose", "ui/with_template"], function(e, t) {
    function i() {
        e.mixin(this, [t]), this.defaultAttrs({
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
        }), this.handleCloseModal = function(e) {
            e.target !== this.node && this.hidePopover()
        }, this.popoverClickTrap = function(e) {
            e !== this.lastSeenEvent && (this.lastSeenEvent = e, this.$node && 0 === this.$node.find(e.currentTarget).length && this.hidePopover())
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
            var e = this.$node.offset().top,
                t = $(window).height();
            this.maxHeight = t - e - this.attr.bottomPadding, this.$popover.css({
                height: this.maxHeight,
                "max-height": this.maxHeight
            }), "auto" === this.defaultHeight && (this.height = this.$popoverContent.outerHeight(), this.$popover.css({
                height: this.height,
                "max-height": this.height
            }))
        }, this.setPopoverSize = function(e) {
            this.width = e.width, this.height = e.height, this.$popover.css({
                width: this.width,
                height: this.height
            })
        }, this.getPopoverPositionClass = function() {
            return this.attr.positionalClasses[this.attr.popoverPosition]
        }, this.renderInPopover = function(e, t, i) {
            i && (this.defaultHeight = i.defaultHeight || this.attr.defaultHeight, this.withOverlay = i.withOverlay || this.attr.withOverlay, this.withClickTrap = i.withClickTrap || this.attr.withClickTrap), this.$overlay = this.renderTemplate("overlay"), this.$overlayControlNode = this.$node.closest(".js-overlay"), this.$overlay.insertBefore(this.$overlayControlNode), this.render("popover"), this.$popover = this.select("popoverSelector"), this.$popover.addClass(this.getPopoverPositionClass()), this.setPopoverSize({
                width: this.attr.defaultWidth
            }), this.$popoverContent = this.select("popoverContentSelector");
            var s = this.renderTemplate(e, t);
            this.$popoverContent.append(s)
        }
    }
    return i
}), define("ui/search/search_in_popover", ["flight/lib/component", "ui/with_popover"], function(e, t) {
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
            var e = this.searchInputHandlerFactory.bind(this);
            this.on(document, "uiSearchInputSubmit", this.handleSearchInputSubmit), this.on(document, "uiSearchInputEscaped", this.handleSearchInputEscaped), this.on(document, "uiSearchInputFocus", this.handleSearchInputFocus), this.on(document, "uiSearchInputChanged", this.handleSearchInputChanged), this.on(document, "uiSearchInputTab", e("uiTypeaheadInputTab")), this.on(document, "uiSearchInputLeft", e("uiTypeaheadInputLeft")), this.on(document, "uiSearchInputRight", e("uiTypeaheadInputRight")), this.on(document, "uiSearchInputMoveUp", e("uiTypeaheadInputMoveUp")), this.on(document, "uiSearchInputMoveDown", e("uiTypeaheadInputMoveDown")), this.on("uiPopoverShown", this.handlePopoverShown), this.on("uiPopoverHiding", this.handlePopoverHiding), this.on("uiPopoverHidden", this.handlePopoverHidden), this.hasTypeaheadResults = !0, this.around("hidePopover", function(e, t) {
                t !== !1 && this.$input && this.$input.blur(), this.trigger("uiSearchResultsHidden"), e.apply(this)
            })
        }), this.handlePopoverShown = function() {
            this.$input.addClass("is-focused")
        }, this.handlePopoverHiding = function() {
            this.defaultHeight = "auto", this.$searchResultsContainer.addClass("is-hidden"), this.$typeaheadContainer.removeClass("is-hidden")
        }, this.handlePopoverHidden = function() {
            this.$input.removeClass("is-focused")
        }, this.handleSearchResultsColumnAdded = function() {
            this.hidePopover()
        }, this.handleSearchInputFocus = function(e, t) {
            this.isCorrectSource(t.source) && (this.$input = $(e.target), this.isPopoverVisible() || TD.controller.stats.searchboxFocus(), this.isPopoverEmpty() || this.showPopover(), this.trigger("uiFixedHeaderChangedPosition"), this.$typeaheadContainer.hasClass(this.attr.isHiddenClass) ? this.showPopoverOverlay() : (this.trigger("uiTypeaheadInputFocus", t), this.hidePopoverOverlay(), this.defaultHeight = "auto"))
        }, this.searchInputHandlerFactory = function(e) {
            return function(t, i) {
                this.isCorrectSource(i.source) && !this.$typeaheadContainer.hasClass(this.attr.isHiddenClass) && this.trigger(e, i)
            }.bind(this)
        }, this.handleSearchInputChanged = function(e, t) {
            this.isCorrectSource(t.source) && (this.$input = $(e.target), this.isPopoverVisible() || this.showPopover(), this.hidePopoverOverlay(), this.defaultHeight = "auto", this.$searchResultsContainer.addClass("is-hidden"), this.$typeaheadContainer.removeClass("is-hidden"), this.trigger("uiTypeaheadInputChanged", t))
        }, this.isCorrectSource = function(e) {
            return e === this.attr.appSearchSourceId || e === this.attr.searchPopoverSourceId
        }, this.handleSearchInputEscaped = function(e, t) {
            this.isCorrectSource(t.source) && (this.trigger("uiTypeaheadInputBlur"), this.hidePopover())
        }, this.handleSearchInputSubmit = function(e, t) {
            var i;
            this.isCorrectSource(t.source) && (this.searchData = t, twttr.txt.isValidList(t.query) ? (i = t.query.split("/"), TD.ui.openColumn.showList(i[0].substr(1), i[1]), this.hidePopover()) : (this.trigger("uiTypeaheadInputSubmit", t), TD.controller.stats.searchboxPerformSearch(t.query.length)))
        }, this.handleTypeaheadNoItemSelected = function() {
            this.searchData && this.performSearch(this.searchData)
        }, this.handleTypeaheadSubmitQuery = function(e, t) {
            var i;
            return twttr.txt.isValidList(t.query) ? (i = t.query.split("/"), TD.ui.openColumn.showList(i[0].substr(1), i[1]), this.hidePopover(), void 0) : void 0
        }, this.performSearch = function(e) {
            e.query && (this.trigger("uiNewSearchQuery", {
                query: e.query
            }), this.defaultHeight = "max", this.$typeaheadContainer.addClass("is-hidden"), this.$searchResultsContainer.removeClass("is-hidden"), this.trigger("uiSearch", e), this.showPopover(), this.showPopoverOverlay(), this.searchData = null)
        }, this.handleTypeaheadItemSelect = function(e, t) {
            var i;
            switch (t.searchType) {
                case "user":
                    this.hidePopover(), this.trigger("uiShowProfile", {
                        id: t.query
                    });
                    break;
                case "topic":
                case "saved-search":
                case "recent-search":
                    this.performSearch(t);
                    break;
                case "recent-search-clear":
                    this.trigger("uiRecentSearchClearAction");
                    break;
                case "list":
                    i = t.query.split("/"), TD.ui.openColumn.showList(i[0], i[1]);
                    break;
                default:
            }
            this.searchData = null
        }, this.handleTypeaheadItemComplete = function(e, t) {
            this.$input.trigger("uiAppSearchItemComplete", t)
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
    return e(i, t)
}), define("ui/typeahead/with_users", [], function() {
    return function() {
        this.defaultAttrs({
            usersListSelector: ".js-typeahead-user-list",
            usersItemSelector: ".js-typeahead-user-item",
            usersTemplate: "typeahead/typeahead_users"
        }), this.renderUsers = function(e, t) {
            this.$usersList.find(this.attr.usersItemSelector).remove();
            var i = t.suggestions.users || [];
            if (!i.length) return this.clearUsers(), void 0;
            var s, n = [];
            i.forEach(function(e) {
                n.push({
                    screen_name: e.screen_name,
                    name: e.name,
                    profile_image_url: this.getAvatar(e),
                    verified: e.verified
                })
            }, this), s = this.toHtml(this.attr.usersTemplate, {
                users: n
            }), this.$usersList.toggleClass("has-results", i.length > 0).toggleClass("is-hidden", 0 === i.length).html(s)
        }, this.getAvatar = function(e) {
            return e.profile_image_url_https.replace(/_normal(\..*)?$/i, "_mini$1")
        }, this.clearUsers = function() {
            this.$usersList.removeClass("has-results"), this.$usersList.addClass("is-hidden")
        }, this.after("initialize", function() {
            this.$usersList = this.select("usersListSelector"), this.on("uiTypeaheadRenderResults", this.renderUsers)
        })
    }
}), define("ui/typeahead/with_saved_searches", ["flight/lib/compose", "ui/with_text_utils"], function(e, t) {
    return function() {
        e.mixin(this, [t]), this.defaultAttrs({
            savedSearchesListSelector: ".js-typeahead-saved-search-list",
            savedSearchesItemSelector: ".js-typeahead-saved-search-item",
            savedSearchesTemplate: "typeahead/typeahead_saved_searches"
        }), this.renderSavedSearches = function(e, t) {
            var i, s = [];
            this.$savedSearchesList.empty(), t.suggestions && t.suggestions.savedSearches && (t.suggestions.savedSearches.forEach(function(e) {
                s.push({
                    query: e.query,
                    name: this.highlightSubstring(e.name, t.query)
                })
            }, this), i = this.toHtml(this.attr.savedSearchesTemplate, {
                savedSearches: s
            }), this.$savedSearchesList.toggleClass("has-results", s.length > 0).toggleClass("is-hidden", 0 === s.length).html(i))
        }, this.after("initialize", function() {
            this.$savedSearchesList = this.select("savedSearchesListSelector"), this.on("uiTypeaheadRenderResults", this.renderSavedSearches)
        })
    }
}), define("ui/typeahead/with_recent_searches", ["flight/lib/compose", "ui/with_text_utils"], function(e, t) {
    var i = function() {
        e.mixin(this, [t]), this.defaultAttrs({
            recentSearchesListSelector: ".js-typeahead-recent-search-list",
            recentSearchesItemSelector: ".js-typeahead-recent-search-item",
            recentSearchesClearSelector: ".js-typeahead-recent-search-clear",
            recentSearchesTemplate: "typeahead/typeahead_recent_searches",
            recentSearchesPlaceholderTemplate: "typeahead/recent_searches_placeholder",
            recentSearchesFixedClass: "recent-searches-fixed-list"
        }), this.renderRecentSearches = function(e, t) {
            this.currentData = t;
            var i = t.datasources && t.datasources.some(function(e) {
                return "recentSearches" === e
            });
            if (!i) return this.$recentSearchesList.removeClass("has-results").addClass("is-hidden").empty(), this.$clearRecentSearches.addClass("is-hidden").removeClass("is-invisible"), void 0;
            var s, n = i && 1 === t.datasources.length,
                r = t.suggestions && t.suggestions.recentSearches && t.suggestions.recentSearches.length,
                o = r || n,
                a = n && !r;
            if (r) {
                var c = [];
                t.suggestions.recentSearches.forEach(function(e) {
                    c.push({
                        query: e,
                        name: this.highlightSubstring(e, t.query)
                    })
                }, this), s = this.toHtml(this.attr.recentSearchesTemplate, {
                    recentSearches: c
                })
            } else s = n ? this.toHtml(this.attr.recentSearchesPlaceholderTemplate) : "";
            this.$recentSearchesList.toggleClass(this.attr.recentSearchesFixedClass, n), this.$recentSearchesList.toggleClass("has-results", r).toggleClass("is-hidden", !o).html(s), this.$clearRecentSearches.toggleClass("is-hidden", !n).toggleClass("is-invisible", a)
        }, this.clearRecentSearches = function() {
            delete this.currentData.suggestions.recentSearches, this.renderRecentSearches(null, this.currentData)
        }, this.after("initialize", function() {
            this.$recentSearchesList = this.select("recentSearchesListSelector"), this.$clearRecentSearches = this.select("recentSearchesClearSelector"), this.on("uiRecentSearchClearAction", this.clearRecentSearches), this.on("uiTypeaheadRenderResults", this.renderRecentSearches)
        })
    };
    return i
}), define("ui/typeahead/with_topics", ["flight/lib/compose", "ui/with_text_utils"], function(e, t) {
    return function() {
        e.mixin(this, [t]), this.defaultAttrs({
            topicsListSelector: ".js-typeahead-topic-list",
            topicsItemSelector: ".js-typeahead-topic-item",
            topicsTemplate: "typeahead/typeahead_topics"
        }), this.renderTopics = function(e, t) {
            this.$topicsList.empty();
            var i = t.suggestions.topics || [];
            if (!i.length) return this.clearTopics(), void 0;
            var s = i.map(function(e) {
                return {
                    topic: e.topic,
                    name: this.highlightSubstring(e.topic, t.query)
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
}), define("ui/typeahead/with_lists", ["flight/lib/compose", "ui/with_text_utils"], function(e, t) {
    var i = function() {
        e.mixin(this, [t]), this.defaultAttrs({
            listsListSelector: ".js-typeahead-lists-list",
            listItemSelector: ".js-typeahead-list-item",
            listTemplate: "typeahead/typeahead_lists"
        }), this.renderLists = function(e, t) {
            this.currentData = t;
            var i = t.datasources && t.datasources.some(function(e) {
                return "lists" === e
            });
            if (!i) return this.$listsList.removeClass("has-results").addClass("is-hidden").empty(), void 0;
            var s, n = t.suggestions && t.suggestions.lists && t.suggestions.lists.length;
            if (n) {
                var r = [];
                t.suggestions.lists.forEach(function(e) {
                    r.push({
                        query: e.fullName,
                        fullName: this.highlightSubstring(e.fullName, t.query),
                        name: e.name,
                        screenName: e.user.screenName
                    })
                }, this), s = this.toHtml(this.attr.listTemplate, {
                    lists: r
                })
            } else s = "";
            this.$listsList.toggleClass("has-results", n).toggleClass("is-hidden", !n).html(s)
        }, this.after("initialize", function() {
            this.$listsList = this.select("listsListSelector"), this.on("uiTypeaheadRenderResults", this.renderLists)
        })
    };
    return i
}), define("ui/typeahead/typeahead_dropdown", ["flight/lib/component", "ui/typeahead/with_users", "ui/typeahead/with_saved_searches", "ui/typeahead/with_recent_searches", "ui/typeahead/with_topics", "ui/typeahead/with_lists", "ui/with_template"], function(e, t, i, s, n, r, o) {
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
        }), this.handleTypeaheadInputFocus = function(e, t) {
            this.hasFocus = !0, t.query !== this.query && this.handleTypeaheadInputChanged(e, t)
        }, this.handleTypeaheadInputBlur = function() {
            this.hasFocus = !1, this.trigger("dataTypeaheadQueryReset")
        }, this.handleItemMouseover = function(e, t) {
            this.select("itemsSelector").removeClass(this.attr.itemSelectedClass), $(t.el).addClass(this.attr.itemSelectedClass)
        }, this.moveSelection = function(e) {
            var t, i = this.select("itemsSelector").filter(":visible"),
                s = i.filter(this.attr.itemSelectedSelector);
            s.removeClass(this.attr.itemSelectedClass), t = s.length ? i.index(s) + e : -1 + e, 0 > t ? t = i.length - 1 : t >= i.length && (t = 0), i.eq(t).addClass(this.attr.itemSelectedClass)
        }, this.getSelectedItemIndex = function() {
            var e = this.select("itemsSelector").filter(":visible"),
                t = e.filter(this.attr.itemSelectedSelector);
            return e.index(t)
        }, this.handleTypeaheadInputMoveUp = function() {
            this.moveSelection(-1)
        }, this.handleTypeaheadInputMoveDown = function() {
            this.moveSelection(1)
        }, this.handleTypeaheadInputMoveRight = function(e, t) {
            -1 === this.getSelectedItemIndex() ? this.moveSelection(1) : this.completeSelection(e, t)
        }, this.handleTypeaheadInputChanged = function(e, t) {
            var i = t.query,
                s = this.attr.datasources;
            0 === i.trim().length && (s = this.attr.datasourcesRecentOnly), this.query = i, this.select("itemsSelector").removeClass(this.attr.itemSelectedClass), this.trigger("uiNeedsTypeaheadSuggestions", {
                query: i,
                datasources: s,
                dropdownId: this.getDropdownId(),
                type: "search",
                limits: this.attr.limits
            })
        }, this.getDropdownId = function() {
            return this.dropdownId || (this.dropdownId = "swift_typeahead_dropdown_" + +new Date), this.dropdownId
        }, this.triggerSelectionEvent = function(e) {
            var t = this.select("itemsSelector"),
                i = t.index(e),
                s = this.query,
                n = e.data("search-query");
            (s || n) && this.trigger("uiTypeaheadItemSelected", {
                    index: i,
                    searchType: e.data("search-type"),
                    query: n,
                    input: s
                })
        }, this.handleItemClick = function(e, t) {
            var i = $(t.el);
            this.triggerSelectionEvent(i)
        }, this.handleTypeaheadInputSubmit = function() {
            var e = this.select("itemsSelector").filter(this.attr.itemSelectedSelector).filter(":visible").first();
            e.length ? this.triggerSelectionEvent(e) : this.trigger("uiTypeaheadNoItemSelected")
        }, this.completeSelection = function(e, t) {
            var i = t && "rtl" === t.dir ? "rtl" : "ltr";
            if (!("rtl" === i && "uiTypeaheadInputRight" === e.type || -1 !== ["ltr", void 0, ""].indexOf(i) && "uiTypeaheadInputLeft" === e.type)) {
                var s = this.select("itemsSelector").filter(this.attr.itemSelectedSelector).first();
                if (!s.length) {
                    s = this.select("itemsSelector").first();
                    var n = s.data("search-query") !== this.query;
                    if (!n) return "uiTypeaheadInputTab" === e.type && (this.hasFocus = !1), void 0
                }
                var r = s.data("search-type"),
                    o = this.attr.queryTypes.some(function(e) {
                        return e === r
                    });
                if (!o) return "uiTypeaheadInputTab" === e.type && (this.hasFocus = !1), void 0;
                var a = s.data("search-query"),
                    c = this.select("itemsSelector"),
                    l = c.index(s);
                this.trigger("uiTypeaheadItemComplete", {
                    value: a,
                    searchType: s.data("search-type"),
                    index: l,
                    query: a
                })
            }
        }, this.handleDataTypeaheadSuggestions = function(e, t) {
            var i = this.select("itemsSelector").filter(this.attr.itemSelectedSelector);
            if (t.dropdownId == this.getDropdownId() && t.query === this.query && this.hasFocus && !i.length) {
                this.trigger("uiTypeaheadRenderResults", t);
                var s = this.attr.datasources.some(function(e) {
                    return t.suggestions[e] && t.suggestions[e].length
                });
                s = s || !t.query, s ? (this.trigger("uiTypeaheadSuggestions"), this.select("itemsSelector").removeClass("list-item-first").removeClass("list-item-last").filter(":visible").first().addClass("list-item-first").end().last().addClass("list-item-last")) : this.trigger("uiTypeaheadNoSuggestions")
            }
        }
    }
    return e(a, o, i, t, n, r, s)
}), define("ui/toggle_button", ["flight/lib/component", "ui/with_template"], function(e, t) {
    var i = function() {
        this.defaultAttrs({
            template: "menus/toggle_button",
            buttonSelector: ".js-toggle-button"
        }), this.handleButtonClick = function(e) {
            var t = $(e.currentTarget),
                i = t.data("clickevent");
            i && (this.trigger(i), this.$buttons.removeClass("is-selected"), t.addClass("is-selected"))
        }, this.handleSelectItem = function(e, t) {
            this.$node.find("." + t.class).click()
        }, this.after("initialize", function() {
            this.buttons = this.attr.buttons;
            var e = {
                buttons: [this.buttons.left, this.buttons.right]
            };
            this.render(this.attr.template, e), this.$buttons = this.select("buttonSelector"), this.on(this.$buttons, "click", this.handleButtonClick), this.on("uiToggleSelectItem", this.handleSelectItem), this.on("uiToggleButtonDestroy", this.teardown)
        })
    };
    return e(i, t)
}), define("ui/user_search_results", ["flight/lib/component", "ui/with_template", "ui/with_user_menu"], function(e, t, i) {
    var s = function() {
        this.query = null, this.handleSearch = function(e, t) {
            this.query = t.query, this.hideUserMenu(), this.$node.empty(), this.trigger(document, "uiNeedsUserSearch", {
                query: this.query
            })
        }, this.handleResults = function(e, t) {
            t.request.query === this.query && (this.users = t.result, 0 === this.users.length ? this.render("search_no_users_placeholder") : this.render("menus/user_results", {
                users: this.users,
                withUserMenu: !0
            }))
        }, this.after("initialize", function() {
            this.on(document, "uiSearch", this.handleSearch), this.on(document, "dataUserSearch", this.handleResults), this.on("uiUserResultsDestroy", this.teardown)
        })
    };
    return e(s, t, i)
}), define("ui/with_fixed_header_and_footer", ["flight/lib/compose", "ui/with_template"], function(e, t) {
    var i = function() {
        e.mixin(this, [t]), this.defaultAttrs({
            headerSelector: ".js-fhf-header",
            bodySelector: ".js-fhf-body",
            footerSelector: ".js-fhf-footer"
        }), this.after("initialize", function() {
            this.$headerContainer = this.select("headerSelector"), this.$bodyContainer = this.select("bodySelector"), this.$footerContainer = this.select("footerSelector"), this.on("uiFixedHeaderChangedPosition", this.resizeBody)
        }), this.resizeBody = function() {
            var e = 0,
                t = 0,
                i = 0;
            this.$headerContainer.hasClass("is-hidden") ? (this.$headerContainer.removeClass("is-hidden"), i = this.$headerContainer.position().top, this.$headerContainer.addClass("is-hidden")) : (e = this.$headerContainer.outerHeight(), i = this.$headerContainer.position().top), this.$footerContainer.hasClass("is-hidden") || (t = this.$footerContainer.outerHeight()), this.$bodyContainer.css({
                top: e + i,
                bottom: t
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
}), define("ui/search/search_results", ["flight/lib/component", "ui/toggle_button", "ui/user_search_results", "ui/with_accordion", "ui/with_template", "ui/with_search_filter", "ui/with_focus", "ui/asynchronous_form", "ui/with_fixed_header_and_footer", "ui/with_transitions"], function(e, t, i, s, n, r, o, a, c, l) {
    function u() {
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
            this.on(document, "uiSearch", this.handleSearch), this.on("uiColumnUpdateSearchFilter", this.handleUpdateSearchFilter), TD.util.isTouchDevice() && TD.decider.get(TD.decider.TOUCHDECK_COLUMN_OPTIONS) ? this.select("searchResultsHeaderSelector").addClass(this.attr.isTouchColumnOptionsClass) : this.select("searchResultsHeaderSelector").removeClass(this.attr.isTouchColumnOptionsClass), this.$tweetResults = this.select("tweetResultsSelector"), this.$userResults = this.select("userResultsSelector"), this.$header = this.select("searchResultsHeaderSelector"), this.$footer = this.select("searchResultsFooterSelector"), this.$accordion = this.select("accordionSelector"), i.attachTo(this.$userResults), this.$toggle = this.select("toggleSelector"), t.attachTo(this.$toggle, {
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
            }), this.on(this.$header, "uiToggleTweetsClick", this.showTweets), this.on(this.$header, "uiToggleUsersClick", this.showUsers), this.on(this.$footer.find(".js-add-column"), "click", this.handleAddColumnClick), TD.util.isTouchDevice() && window.navigator.standalone && this.on(this.$userResults, "touchmove", function(e) {
                e.stopPropagation()
            }), this.on("uiTransitionExpandStart", this.handleColumnOptionsTransitionStart), this.on("uiAccordionTotalHeightChanged", this.resizeBody), this.on("uiSearchResultsHidden", this.handleSearchResultsHidden)
        }), this.handleUpdateSearchFilter = function(e, t) {
            this.temporaryColumn && (this.temporaryColumn.column.updateSearchFilter(t), this.temporaryColumn.populate())
        }, this.handleSearchResultsHidden = function() {
            this.focusRelease(), this.temporaryColumn && (this.temporaryColumn.destroy(), this.temporaryColumn = null)
        }, this.handleSearch = function(e, t) {
            var i = TD.storage.accountController.getPreferredAccount("twitter"),
                s = new TD.vo.SearchFilter;
            this.query = t.query, this.temporaryColumn && (this.temporaryColumn.destroy(), this.temporaryColumn = null), this.temporaryColumn = new TD.components.TemporaryColumn, this.temporaryColumn.search(this.query, i.getKey()), this.$tweetResults.empty(), this.$tweetResults.append(this.temporaryColumn.$node), this.trigger(this.$toggle, "uiToggleSelectItem", {
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
        }, this.handleColumnOptionsTransitionStart = function(e, t) {
            var i = this.$bodyContainer,
                s = parseInt(i.css("top"), 10),
                n = function() {
                    i.data("isAnimating", !1)
                };
            i.data("isAnimating") === !0 ? this.columnScrollerTargetTop = this.columnScrollerTargetTop + t.delta : (i.data("isAnimating", !0), this.columnScrollerTargetTop = s + t.delta), this.transitionTop(i, this.attr.columnScrollerIsAnimatingClass, this.columnScrollerTargetTop, n)
        }, this.before("teardown", function() {
            this.trigger(this.$searchFilter, "uiDestroyAsynchronousForm"), this.trigger(this.$userResults, "uiUserResultsDestroy"), this.trigger(this.$header, "uiToggleButtonDestroy")
        })
    }
    return e(u, s, n, o, r, c, l)
}), define("ui/search/search_router", ["flight/lib/component"], function(e) {
    var t = function() {
        this.defaultAttrs({
            appSearchSelector: ".js-search",
            appSearchInputSelector: ".js-search-form .js-app-search-input",
            isTouchSearchClass: "is-touch-search",
            searchPopoverInputSelector: ".js-search-in-popover .js-app-search-input"
        }), this.after("initialize", function() {
            TD.util.isTouchDevice() && TD.decider.get(TD.decider.TOUCHDECK_SEARCH) ? this.select("appSearchSelector").addClass(this.attr.isTouchSearchClass) : this.select("appSearchSelector").removeClass(this.attr.isTouchSearchClass), this.on(document, "uiPerformSearch", this.handlePerformSearch), this.on(document, "uiAppSearchFocus uiShowSearchButtonClick", this.focusSearchInput), this.on(document, "dataSettings", this.handleDataSettings), this.trigger("uiNeedsSettings")
        }), this.handleDataSettings = function(e, t) {
            this.$input = "condensed" === t.navbarWidth ? this.select("searchPopoverInputSelector") : this.select("appSearchInputSelector")
        }, this.focusSearchInput = function() {
            this.$input.triggerHandler("focus"), this.$input.is(":focus") || this.$input.focus()
        }, this.handlePerformSearch = function(e, t) {
            e.target === document && _.defer(function() {
                this.trigger(this.$input, "uiAppSearchSubmit", t)
            }.bind(this))
        }
    };
    return e(t)
}), define("ui/with_compose_button", [], function() {
    return function() {
        this.defaultAttrs({
            showComposeButtonSelector: ".js-show-compose",
            hideComposeButtonSelector: ".js-hide-compose"
        }), this.after("initialize", function() {
            this.on("click", {
                showComposeButtonSelector: this.handleShowCompose,
                hideComposeButtonSelector: this.handleHideCompose
            }), this.on(document, "uiToggleDockedCompose", this.handleToggleDockedCompose)
        }), this.handleShowCompose = function() {
            this.trigger("uiComposeTweet"), TD.controller.stats.navbarComposeClick()
        }, this.handleHideCompose = function() {
            this.trigger("uiComposeClose")
        }, this.handleToggleDockedCompose = function(e, t) {
            t.opening ? (this.select("showComposeButtonSelector").addClass("is-hidden"), this.select("hideComposeButtonSelector").removeClass("is-hidden")) : (this.select("showComposeButtonSelector").removeClass("is-hidden"), this.select("hideComposeButtonSelector").addClass("is-hidden"))
        }
    }
}), define("ui/app_header", ["flight/lib/component", "ui/with_compose_button", "ui/with_nav_flyover"], function(e, t, i) {
    function s() {
        this.defaultAttrs({
            headerActionSelector: ".js-header-action"
        }), this.after("initialize", function() {
            this.on("click", this.handleClick), $(document).on("uiToggleNavbarWidth", this.toggleNavbarWidth.bind(this)), $(document).on("dataSettings", this.handleDataSettings.bind(this)), this.select("headerActionSelector").on("mouseover", this.handleListItemMouseover.bind(this)).on("mouseout", this.handleListItemMouseout.bind(this)), this.trigger("uiNeedsSettings")
        }), this.handleClick = function(e) {
            var t = $(e.target).closest(".js-header-action");
            switch (t.data("action") && e.preventDefault(), t.data("action")) {
                case "add-column":
                    TD.ui.openColumn.showOpenColumn(), TD.controller.stats.navbarAddColumnClick();
                    break;
                case "settings-menu":
                    e.stopPropagation(), new TD.components.TopbarMenu(t), TD.controller.stats.navbarSettingsClick();
                    break;
                case "show-lists":
                    TD.ui.openColumn.showLists(), TD.controller.stats.navbarListsClick();
                    break;
                case "change-sidebar-width":
                    this.toggleNavbarWidth();
                    break;
                case "show-search":
                    this.trigger("uiShowSearchButtonClick"), t.tooltip("hide")
            }
            this.destroyFlyover()
        }, this.toggleNavbarWidth = function() {
            var e;
            e = this.isCollapsed ? "full-size" : "condensed", this.trigger("uiNavbarWidthChangeAction", {
                navbarWidth: e
            })
        }, this.handleDataSettings = function(e, t) {
            this.isCollapsed = Boolean("condensed" === t.navbarWidth)
        }, this.handleListItemMouseover = function(e) {
            if (this.isCollapsed && !TD.util.isTouchDevice()) {
                var t = $(e.currentTarget);
                this.renderFlyover(t)
            }
        }, this.handleListItemMouseout = function() {
            this.destroyFlyover()
        }
    }
    return e(s, t, i)
}), define("ui/default_page_layout", ["flight/lib/component"], function(e) {
    function t() {
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
        var e, t, i = !1;
        this.setTheme = function(e) {
            var t = $("link");
            _.each(t, function(t) {
                var i = _.contains(t.getAttribute("rel"), "stylesheet"),
                    s = t.getAttribute("title");
                i && s && (t.disabled = !0, s === e && (t.disabled = !1))
            }), $("meta[http-equiv=Default-Style]")[0].content = e
        }, this.setNavbarWidth = function(i) {
            var s, n = this.select("jsAppHeaderInnerSelector"),
                r = this.select("jsAppHeaderSelector"),
                o = "condensed" === i,
                a = TD.storage.clientController.client.getColumnOrder().length,
                c = function() {
                    o && r.removeClass(this.attr.isCondensingClass), e.toggleClass(this.attr.isCondensedClass, o), r.toggleClass(this.attr.isCondensedClass, o)
                }.bind(this);
            if (!this.isNavbarWidthSet || a > this.attr.maxColumnsForAnimation) c(), this.isNavbarWidthSet = !0;
            else {
                if (!o && !e.hasClass(this.attr.isCondensedClass) || o && e.hasClass(this.attr.isCondensedClass)) return;
                o ? (s = parseInt(n.css("min-width"), 10), r.addClass(this.attr.isCondensingClass)) : (r.removeClass(this.attr.isCondensedClass), s = n.outerWidth()), r.addClass(this.attr.scrollNoneClass), r.animate({
                    width: s
                }, {
                    duration: this.attr.navbarWidthChangeDuration,
                    complete: function() {
                        c(), r.removeClass(this.attr.scrollNoneClass)
                    }.bind(this),
                    step: function(e) {
                        t.css("left", e)
                    },
                    easing: "easeOutQuad"
                })
            }
        }, this.handleAnimateCompose = function(e, s) {
            s.noAnimate && t.css({
                "transition-duration": "0"
            }), t.one(TD.ui.main.TRANSITION_END_EVENTS, function() {
                i && t.css({
                    "margin-right": 245
                }), s.noAnimate && t.css({
                    "transition-duration": "0.2s"
                })
            }), s.opening && !i ? (i = !0, t.css({
                transform: "translateX(245px)"
            })) : s.opening || (t.css({
                transform: "translateX(0)",
                "margin-right": 0
            }), i = !1)
        }, this.handleDataSettings = function(e, t) {
            this.setTheme(t.theme), this.setNavbarWidth(t.navbarWidth)
        }, this.after("initialize", function() {
            e = this.select("jsAppSelector"), t = this.select("jsAppContentSelector"), this.isNavbarWidthSet = !1, this.on(document, "dataSettings", this.handleDataSettings), this.on(document, "uiToggleDockedCompose", this.handleAnimateCompose)
        })
    }
    return e(t)
}), define("util/keypress", [], function() {
    var e = {};
    return e.eventIsKey = function(e) {
        return e.which > 3
    }, e.isEnter = function(e) {
        return e.which === TD.constants.keyCodes.enter
    }, e.isSpacebar = function(e) {
        return e.which === TD.constants.keyCodes.spacebar
    }, e
}), define("ui/compose/with_account_selector", ["flight/lib/compose", "ui/with_template", "util/keypress"], function(e, t, i) {
    function s() {
        e.mixin(this, [t]), this.defaultAttrs({
            accountListSelector: ".js-account-list",
            accountItemSelector: ".js-account-item",
            isSelectedClass: "is-selected",
            selectedItemSelector: ".js-account-item.is-selected"
        }), this.after("initialize", function() {
            this.on(document, "dataAccounts", this.handleAccountsDataForAccountSelector), this.on(document, "dataDefaultAccount", this.handleDefaultAccountForAccountSelector), this.trigger("uiNeedsAccounts"), this.trigger("uiNeedsDefaultAccount")
        }), this.after("setupDOM", function() {
            this.on("click keypress", {
                accountItemSelector: this.accountSelectorHandleClick
            }), (!TD.util.isTouchDevice() || !TD.decider.get(TD.decider.TOUCHDECK_COMPOSE)) && this.select("accountListSelector").tooltip({
                selector: ".js-show-tip",
                container: "body",
                placement: "bottom",
                suppressFadeOut: !0
            })
        }), this.handleAccountsDataForAccountSelector = function(e, t) {
            var i, s;
            if (t.accounts) {
                i = this.getSelectedAccounts(), s = t.accounts.map(function(e) {
                    var s = i.indexOf(e.accountKey) > -1 || 1 === t.accounts.length;
                    return {
                        accountKey: e.accountKey,
                        screenName: e.screenName,
                        profileImageUrl: e.profileImageUrl,
                        isSelected: s
                    }
                });
                var n = this.renderTemplate("new_compose/account_selector", {
                    accounts: s
                });
                this.select("accountListSelector").replaceWith(n), this.trigger("uiSelectedAccounts", {
                    accounts: this.getSelectedAccounts()
                })
            }
        }, this.handleDefaultAccountForAccountSelector = function(e, t) {
            var i = this.getSelectedAccounts(),
                s = 1 === i.length && i[0] === this.defaultAccountKey;
            (0 === i.length || s) && this.setSelectedAccounts([t.accountKey]), this.defaultAccountKey = t.accountKey
        }, this.accountSelectorHandleClick = function(e) {
            if (i.eventIsKey(e) && !i.isSpacebar(e)) return !1;
            var t = $(e.target).closest(this.attr.accountItemSelector);
            e.shiftKey && this.select("accountItemSelector").removeClass(this.attr.isSelectedClass), t.toggleClass(this.attr.isSelectedClass), TD.util.isTouchDevice() && TD.decider.get(TD.decider.TOUCHDECK_COMPOSE) && (this.select("accountItemSelector").tooltip("destroy"), t.tooltip({
                trigger: "manual",
                selector: ".js-show-tip",
                container: "body",
                placement: "bottom",
                suppressFadeOut: !0
            }), t.tooltip("show"), setTimeout(function() {
                t.tooltip("destroy")
            }, 1e3)), this.trigger("uiSelectedAccounts", {
                accounts: this.getSelectedAccounts()
            })
        }, this.setSelectedAccounts = function(e) {
            this.select("accountItemSelector").each(function(t, i) {
                var s = $(i),
                    n = e.indexOf(s.data("account-key")) > -1;
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
}), define("ui/compose/with_character_limit", [], function() {
    function e() {
        this.defaultAttrs({
            maxCharCount: 140
        }), this.getRemainingCharCount = function(e) {
            return this.attr.maxCharCount - e
        }, this.isWithinCharLimit = function(e) {
            return this.attr.maxCharCount >= e && e > 0
        }, this.isOverCharLimit = function(e) {
            return e > this.attr.maxCharCount
        }
    }
    return e
}), define("ui/compose/with_character_count", ["ui/compose/with_character_limit", "flight/lib/compose"], function(e, t) {
    function i() {
        t.mixin(this, [e]);
        var i = null,
            s = 0;
        this.defaultAttrs({
            charCountSelector: ".js-character-count",
            charCountInvalidClass: "invalid-char-count"
        }), this.after("initialize", function() {
            this.on("uiComposeCharCount", this.charCountHandleCharCount)
        }), this.after("setupDOM", function() {
            this.$charCountInput = this.select("charCountSelector")
        }), this.charCountHandleCharCount = function(e, t) {
            e.stopPropagation(), s = t.charCount, this.$charCountInput.val(this.getRemainingCharCount(s)), this.charCountUpdateValidCountState(s)
        }, this.charCountUpdateValidCountState = function(e) {
            var t = this.isOverCharLimit(e);
            i !== t && (this.$charCountInput.toggleClass(this.attr.charCountInvalidClass, t), i = t)
        }
    }
    return i
}), define("util/tweet_utils", [], function() {
    var e = {};
    return e.atMentionify = function(e) {
        return TD.util.atMentionify(e)
    }, e.deMentionify = function(e) {
        return TD.util.deMentionify(e)
    }, e.getTweetLength = function(e) {
        return twttr.txt.getTweetLength(e)
    }, e.extractMentions = function(e) {
        return twttr.txt.extractMentions(e)
    }, e.removeFirstMention = function(e) {
        var t, i = twttr.txt.extractMentionsWithIndices(e);
        return i.length && (t = i[0].indices, e = e.substring(0, t[0]).trim() + e.substring(t[1])), e
    }, e
}), define("ui/with_focusable_field", [], function() {
    var e = function() {
        this.defaultAttrs({
            focusableSelector: "textarea, input"
        }), this.after("initialize", function() {
            var e = this.select("focusableSelector");
            this.on(e, "focus", function() {
                TD.decider.get(TD.decider.TOUCHDECK_COMPOSE) && (window.scrollTo(0, 0), document.body.scrollTop = 0)
            })
        })
    };
    return e
}), define("ui/compose/with_compose_text", ["flight/lib/compose", "util/tweet_utils", "ui/with_focusable_field"], function(e, t, i) {
    return function() {
        e.mixin(this, [i]);
        var s, n = "",
            r = !1,
            o = [],
            a = [],
            c = function(e) {
                var t = {};
                return e.map(function(e) {
                    return e.filter(function(e) {
                        var i = e.toLowerCase(),
                            s = t[i];
                        return t[i] = !0, !s
                    })
                })
            };
        this.defaultAttrs({
            composeTextSelector: ".js-compose-text"
        }), this.after("initialize", function() {
            this.on("uiRemoveInReplyTo", this.removeReplyStack), this.on("uiMessageRecipientSet", function(e) {
                e.stopPropagation(), this.composeTextSetFocus()
            })
        }), this.after("setupDOM", function() {
            s = this.select("composeTextSelector"), this.on(s, "input propertychange change", this.composeTextHandleChange), this.textAutoComplete = new TD.components.Autocomplete(s)
        }), this.composeTextGetText = function() {
            return s.val()
        }, this.composeTextSetFocus = function() {
            s.focus()
        }, this.composeTextBlur = function() {
            s.blur()
        }, this.composeTextSetText = function(e) {
            s.val() !== e && (s.val(e), this.composeTextHandleChange())
        }, this.composeTextAppendText = function(e) {
            var t = s.val();
            this.composeTextSetText((t && t.trim() + " ") + e)
        }, this.composeTextPrependText = function(e) {
            this.composeTextSetText(e + " " + this.composeTextGetText())
        }, this.composeTextSetDisabled = function(e) {
            s.prop("disabled", e)
        }, this.composeTextIsEmpty = function() {
            return "" === s.val()
        }, this.composeTextSetCaret = function(e) {
            s[0].selectionStart = s[0].selectionEnd = e
        }, this.composeTextSetCaretToEnd = function() {
            this.composeTextSetCaret(s.val().length)
        }, this.composeTextSetSelection = function(e, t) {
            var i = s[0];
            i.selectionStart = e, i.selectionEnd = t, setTimeout(function() {
                i.selectionStart = e, i.selectionEnd = t
            }, 70), s.focus()
        }, this.removeReplyStack = function(e) {
            e.stopPropagation();
            var t = this.composeTextGetReplyText();
            this.composeTextSetText(t.trim()), o = [], a = [], r = !1, n = ""
        }, this.composeTextReset = function() {
            this.composeTextSetText(""), o = [], a = [], r = !1, n = ""
        }, this.composeTextSetRepliesAndMentions = function(e, t, i) {
            var s = this.composeTextCalculateRepliesAndMentions(e, t, i);
            this.composeTextSetText(s.totalString), this.composeTextSetSelection(s.startIndex, s.endIndex)
        }, this.composeTextCalculateRepliesAndMentions = function(e, i, c) {
            return e = e.map(t.atMentionify), i = i.map(t.atMentionify), c = c && t.atMentionify(c), c && (i = i.filter(function(e) {
                return e.toLowerCase() !== c.toLowerCase()
            }), c === e[0] && i.length > 0 && (e = [i.shift()])), e = e.map(t.atMentionify), i = i.map(t.atMentionify), r === !1 && (r = s.val()), this.composeTextIsStacking() && this.composeTextHasLostStackingState() && (o = [], a = [], n = s.val(), r = ""), this.composeTextGetReplyStack(e, i)
        }, this.composeTextHandleChange = function() {
            var e = t.getTweetLength(s.val());
            this.trigger("uiComposeCharCount", {
                charCount: e
            })
        }, this.composeTextIsStacking = function() {
            return o.length + a.length > 0
        }, this.composeTextGenerateReplyStack = function(e, t, i) {
            var s, n, o, a = e.join(" "),
                c = t.join(" "),
                l = [];
            return i && (i = i.replace(/ $/, ""), l.push(i)), a && l.push(a), r && l.push(r), c && l.push(c), s = l.join(" ").trim() + " ", n = c ? s.length - c.length - 1 : s.length, o = s.length, {
                totalString: s,
                startIndex: n,
                endIndex: o
            }
        }, this.composeTextGetReplyText = function() {
            var e = a.concat(o);
            return s.val().split(" ").filter(function(t) {
                return 0 > e.indexOf(t)
            }).join(" ")
        }, this.composeTextHasLostStackingState = function() {
            var e = this.composeTextGenerateReplyStack(o, a, n);
            return e.totalString !== s.val() || e.startIndex !== s[0].selectionStart || e.endIndex !== s[0].selectionEnd
        }, this.composeTextGetReplyStack = function(e, t) {
            var i;
            return this.composeTextIsStacking() && this.trigger("uiComposeStackReply"), o = o.concat(e), a = a.concat(t), i = c([o, a]), o = i[0], a = i[1], this.composeTextGenerateReplyStack(o, a, n)
        }
    }
}), define("ui/compose/with_send_button", ["ui/compose/with_character_limit", "flight/lib/compose", "util/keypress"], function(e, t, i) {
    function s() {
        t.mixin(this, [e]);
        var s, n = 1,
            r = 0;
        this.defaultAttrs({
            sendButtonSelector: ".js-send-tweet-button",
            composeSpinner: ".js-compose-sending-spinner",
            composeSuccess: ".js-compose-sending-success"
        }), this.before("initialize", function() {
            this.sendButtonTranslatedText = {
                tweet: TD.i("Tweet"),
                reply: TD.i("Tweet"),
                message: TD.i("Send message")
            }
        }), this.after("initialize", function() {
            this.on("uiComposeCharCount", this.sendButtonHandleCharCount), this.on("uiSelectedAccounts", this.handleUiSelectedAccounts)
        }), this.after("setupDOM", function() {
            this.$sendButton = this.select("sendButtonSelector"), this.$sendButton.prop("disabled", !0), this.$sendButton.on("click keydown", this.sendButtonHandleClick.bind(this)), s = void 0
        }), this.sendButtonShowSending = function() {
            this.sendButtonSending = !0, this.select("composeSuccess").addClass("is-hidden"), this.$sendButton.addClass("text-hidden"), this.select("composeSpinner").removeClass("is-hidden"), this.$sendButton.tooltip("hide")
        }, this.sendButtonShowSuccess = function() {
            this.select("composeSpinner").addClass("is-hidden"), this.$sendButton.addClass("text-hidden"), this.select("composeSuccess").removeClass("is-hidden")
        }, this.sendButtonShowText = function() {
            this.select("composeSpinner").addClass("is-hidden"), this.select("composeSuccess").addClass("is-hidden"), this.$sendButton.removeClass("text-hidden"), this.sendButtonSending = !1
        }, this.sendButtonSetText = function(e, t) {
            var i, s, n, r = new Date;
            if (t) switch (s = r.toDateString() === t.toDateString(), n = s ? TD.util.prettyTimeOfDayString(t) : TD.util.prettyDateString(t), e) {
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
            } else i = this.sendButtonTranslatedText[e];
            this.$sendButton.text(i)
        }, this.sendButtonHandleCharCount = function(e, t) {
            e.stopPropagation(), r = t.charCount, this.sendButtonEnabledIfValid()
        }, this.handleUiSelectedAccounts = function(e, t) {
            e.stopPropagation(), n = t.accounts.length, this.sendButtonEnabledIfValid()
        }, this.sendButtonHandleClick = function(e) {
            (!i.eventIsKey(e) || i.isEnter(e) || i.isSpacebar(e)) && (this.$sendButton.is(":disabled") || this.trigger("uiComposeSendTweet", {}))
        }, this.sendButtonEnabledIfValid = function() {
            var e = n > 0 && this.isWithinCharLimit(r) && !this.sendButtonSending;
            s !== e && (this.$sendButton.prop("disabled", !e), s = e)
        }, this.sendButtonSetDisabled = function() {
            this.$sendButton.prop("disabled", !0), s = !1
        }
    }
    return s
}), define("data/with_bitly", [], function() {
    return function() {
        var e;
        this.after("initialize", function() {
            this.on(document, "dataSettingsValues", function(t, i) {
                i.link_shortener && (e = i.link_shortener)
            }.bind(this)), this.trigger("uiNeedsSettingsValues", {
                keys: ["link_shortener"]
            })
        }), this.maybeShortenTextLinks = function(t, i) {
            "bitly" === e ? this.bitlyShortenTextLinks(t, i) : i(t)
        }, this.bitlyShortenTextLinks = function(e, t) {
            var i = TD.services.bitly.shortenTextLinks(e);
            i.addCallback(t)
        }
    }
}), define("ui/compose/with_send_tweet", ["flight/lib/compose", "data/with_bitly", "data/with_client"], function(e, t, i) {
    return function() {
        e.mixin(this, [t, i]);
        var s = [],
            n = null;
        this.after("initialize", function() {
            this.on(document, "dataTweetSent", this.handleDataTweetSent), this.on(document, "dataTweetError", this.handleDataTweetError), this.on(document, "dataScheduledTweetsSent", this.handleDataScheduledTweetsSent), this.on(document, "dataScheduledTweetsError", this.handleDataScheduledTweetsError)
        }), this.resetSendTweet = function() {
            s = [], n = null
        }, this.sendTweet = function(e) {
            this.resetSendTweet(), n = e, this.maybeShortenTextLinks(e.text, function(t) {
                e.text = t, this.actuallySendTweet(e)
            }.bind(this)), this.trigger("uiComposeTweetSending")
        }, this.actuallySendTweet = function(e) {
            var t = e.from.map(function(t) {
                return $.extend({}, e, {
                    accountKey: t
                })
            });
            e.scheduledDate ? this.trigger("uiSendScheduledTweets", {
                requestId: e.requestId,
                requests: t,
                scheduledDate: e.scheduledDate,
                tokenToDelete: e.scheduledId
            }) : t.forEach(function(e) {
                this.trigger("uiSendTweet", e)
            }, this)
        }, this.handleDataTweetSent = function(e, t) {
            var i;
            n && t.request.requestId === n.requestId && (i = n.from.indexOf(t.request.accountKey), i > -1 && n.from.splice(i, 1), 0 === n.from.length && (0 === s.length ? this.triggerTweetSuccess() : this.triggerTweetError()))
        }, this.handleDataScheduledTweetsSent = function(e, t) {
            n && t.request.requestId === n.requestId && this.triggerTweetSuccess()
        }, this.handleDataTweetError = function(e, t) {
            var i;
            n && t.request.requestId === n.requestId && (i = n.from.indexOf(t.request.accountKey), i > -1 && n.from.splice(i, 1), s.push(t), 0 === n.from.length && this.triggerTweetError())
        }, this.handleDataScheduledTweetsError = function(e, t) {
            var i, s, r;
            if (n && t.request.requestId === n.requestId) {
                if (t.response.humanReadableMessage) i = t.response.humanReadableMessage;
                else {
                    try {
                        s = JSON.parse(t.response.req.responseText)
                    } catch (o) {}
                    r = s && s.error ? s.error : t.response.req.status, i = TD.i("Scheduling failed. Please try again. ({{message}})", {
                        message: r
                    })
                }
                TD.controller.progressIndicator.addMessage(i), this.triggerTweetError()
            }
        }, this.showTweetErrors = function(e) {
            if (0 !== e.length) {
                var t = e.map(function(e) {
                    var t, i, s;
                    try {
                        t = JSON.parse(e.response.responseText).errors[0].message
                    } catch (n) {
                        t = TD.i("Unknown error")
                    }
                    switch (i = this.getAccountData(e.request.accountKey), s = i ? i.screenName : "unknown account", this.tweetType) {
                        case "message":
                            return TD.i("Message from @{{screenName}} failed: {{message}}", {
                                screenName: s,
                                message: t
                            });
                        default:
                            return TD.i("Tweet from @{{screenName}} failed: {{message}}", {
                                screenName: s,
                                message: t
                            })
                    }
                }, this);
                TD.controller.progressIndicator.addMessage(t.join("\n"))
            }
        }, this.triggerTweetSuccess = function() {
            this.trigger("uiComposeTweetSent")
        }, this.triggerTweetError = function() {
            this.showTweetErrors(s), this.trigger("uiComposeTweetError", {
                errors: n.scheduledDate ? null : s
            })
        }
    }
}), define("ui/compose/inline_compose", ["require", "flight/lib/component", "ui/compose/with_account_selector", "ui/compose/with_character_count", "data/with_client", "ui/with_column_selectors", "ui/compose/with_compose_text", "ui/with_focus", "ui/compose/with_send_button", "ui/compose/with_send_tweet", "ui/with_template"], function(e) {
    function t() {
        var e, t, i;
        this.defaultAttrs({
            panelCloseDelay: 500,
            inlineReplySelector: ".js-inline-reply",
            closeSelector: ".js-inline-compose-close",
            popSelector: ".js-inline-compose-pop",
            accountSelector: ".js-inline-reply .js-account-item",
            tweetSelector: ".js-tweet",
            tweetActionsSelector: ".js-tweet-actions",
            replyActionSelector: ".js-reply-action",
            detailViewInlineSelector: ".js-detail-view-inline",
            draftAttribute: "data-draft-text",
            pagingEasingFunction: "easeOutQuad"
        }), this.after("initialize", function() {
            this.on(document, "uiInlineComposeTweet", this.handleUiInlineComposeTweet), this.on(document, "uiDockedComposeTweet", this.closeInlineCompose), this.on(document, "uiComposeClose", this.closeInlineCompose), this.on(document, "uiReadStateChange", this.handleReadStateChange), this.on("uiComposeSendTweet", this.handleUiComposeSendTweet), this.on("uiComposeTweetSending", this.enterSendingState), this.on("uiComposeTweetSent", this.enterSuccessState), this.on("uiComposeTweetError", this.enterErrorState), this.on(TD.ui.main.TRANSITION_END_EVENTS, {
                inlineReplySelector: this.handleAnimationEnd
            }), this.setupDOM()
        }), this.setupDOM = function() {
            this.select("closeSelector").on("click", this.handleCloseClick.bind(this)), this.select("popSelector").on("click", this.handlePopClick.bind(this)), this.select("accountSelector").on("click", this.handlePopClick.bind(this))
        }, this.handleUiInlineComposeTweet = function(i, s) {
            return e = s || {}, e.singleFrom = [s.from[0]], $(s.element).find(this.attr.inlineReplySelector).length > 0 ? (this.closeInlineCompose(), void 0) : (t && this.closeInlineCompose(), this.focusRequest(), this.setupInlineCompose(e), void 0)
        }, this.setupInlineCompose = function(e) {
            t = e.element, t.find(".js-tweet-actions").addClass("is-visible"), t.find(".js-detail-view-inline").addClass("is-hidden"), t.find(".js-reply-action").addClass("is-selected");
            var s = this.getAccountData(e.from);
            i = this.renderTemplate("compose/compose_inline_reply", {
                account: s
            }), t.find(this.attr.tweetSelector).after(i), this.setupDOM(), this.setSelectedAccounts(e.from);
            var n = this.composeTextCalculateRepliesAndMentions([e.inReplyTo.user.screenName], e.mentions, s.screenName),
                r = this.getDraftText();
            r && r !== n.totalString ? (this.composeTextSetText(r), this.composeTextSetCaretToEnd()) : (this.composeTextSetText(n.totalString), this.composeTextSetSelection(n.startIndex, n.endIndex)), _.defer(function() {
                i.removeClass("is-inline-inactive"), Modernizr.csstransitions || this.handleAnimationEnd({
                    target: i.get(0)
                })
            }.bind(this)), i.on("click", function(e) {
                e.stopPropagation()
            });
            var o = i.parents(".js-column");
            o.hasClass("js-column-state-detail-view") || TD.ui.columns.lockColumnScrolling(o.attr("data-column"))
        }, this.closeInlineCompose = function() {
            t && (this.saveDraftText(this.composeTextGetText()), this.closeAndRemovePanels(), this.focusRelease(), Modernizr.csstransitions || this.handleAnimationEnd({
                target: i.get(0)
            }))
        }, this.closeAndRemovePanels = function() {
            i && this.select("inlineReplySelector").removeClass("is-inline-active").css({
                overflow: "hidden"
            }).addClass("is-inline-inactive")
        }, this.tearDownInlineCompose = function() {
            this.closeAndRemovePanels(), this.deleteDraftText(), this.sendButtonShowText(), this.focusRelease(), t = null
        }, this.handleAnimationEnd = function(e) {
            var t = $(e.target);
            if (t.hasClass("is-inline-inactive")) {
                var s = t.parents(".js-column").attr("data-column"),
                    n = t.parent(".js-stream-item-content");
                TD.ui.columns.unlockColumnScrolling(s), n.find(this.attr.tweetActionsSelector).removeClass("is-visible"), n.find(this.attr.replyActionSelector).removeClass("is-selected"), n.find(this.attr.detailViewInlineSelector).removeClass("is-hidden"), t.remove()
            } else this.scrollColumnIfRequired(), i.css({
                overflow: "visible"
            })
        }, this.scrollColumnIfRequired = function() {
            var e, t = i.parents(".js-column").attr("data-column"),
                s = this.getColumnScrollContainerByKey(t),
                n = i.offset().top + 300 - s.height();
            if (n > 0) {
                e = s.scrollTop();
                var r = TD.ui.columns.calculateScrollDuration(n, 50, 750);
                s.stop().animate({
                    scrollTop: e + n
                }, r, this.attr.pagingEasingFunction)
            }
        }, this.handleUiComposeSendTweet = function(t) {
            if (t.stopPropagation(), !t.keyboardShortcut || this.hasFocus) {
                var i = {
                    requestId: _.uniqueId("sendTweet"),
                    text: this.composeTextGetText(),
                    inReplyToStatusId: e.inReplyTo.id,
                    from: this.getSelectedAccounts(),
                    type: "reply",
                    inline: !0
                };
                this.sendTweet(i)
            }
        }, this.enterSendingState = function(e) {
            e.stopPropagation(), this.disablePanelInputs(), this.sendButtonShowSending()
        }, this.enterSuccessState = function(e) {
            e.stopPropagation(), this.sendButtonShowSuccess(), this.deleteDraftText(), setTimeout(this.tearDownInlineCompose.bind(this), this.attr.panelCloseDelay)
        }, this.enterErrorState = function(e) {
            e.stopPropagation(), this.sendButtonShowText(), this.enablePanelInputs()
        }, this.enablePanelInputs = function() {
            this.sendButtonEnabledIfValid(), this.composeTextSetDisabled(!1)
        }, this.disablePanelInputs = function() {
            this.sendButtonSetDisabled(), this.composeTextSetDisabled(!0)
        }, this.getDraftText = function() {
            return t.attr(this.attr.draftAttribute)
        }, this.saveDraftText = function(e) {
            t.attr(this.attr.draftAttribute, e)
        }, this.deleteDraftText = function() {
            t.removeAttr(this.attr.draftAttribute)
        }, this.handleCloseClick = function() {
            this.closeInlineCompose()
        }, this.handlePopClick = function() {
            var t = this.composeTextGetText();
            this.deleteDraftText(), this.trigger("uiDockedComposeTweet", {
                type: "reply",
                text: t,
                from: e.from,
                mentions: e.mentions,
                inReplyTo: e.inReplyTo,
                popFromInline: !0
            })
        }, this.handleReadStateChange = function(e, i) {
            if (t) {
                var s = t.parents(".js-column").attr("data-column");
                i.read && i.columnKey === s && TD.ui.columns.unlockColumnScrolling(s)
            }
        }
    }
    var i = e("flight/lib/component"),
        s = e("ui/compose/with_account_selector"),
        n = e("ui/compose/with_character_count"),
        r = e("data/with_client"),
        o = e("ui/with_column_selectors"),
        a = e("ui/compose/with_compose_text"),
        c = e("ui/with_focus"),
        l = e("ui/compose/with_send_button"),
        u = e("ui/compose/with_send_tweet"),
        h = e("ui/with_template");
    return i(t, s, n, r, o, a, c, l, u, h)
}), define("ui/compose/compose_controller", ["require", "flight/lib/component", "ui/compose/inline_compose"], function(e) {
    function t() {
        var e, t, i;
        this.after("initialize", function() {
            this.on(document, "uiToggleDockedCompose", this.handleAnimateDockedCompose), this.on(document, "uiComposeTweet", this.handleUiComposeTweet), this.on(document, "uiToggleDockedCompose", this.handleToggleDocked), this.on(document, "uiToggleInlineCompose", this.handleToggleInline), this.on("uiInlineComposeState", function(e, t) {
                this.trigger("uiDockedComposeTweet", t)
            })
        }), this.handleUiComposeTweet = function(n, r) {
            r = r || {};
            var o = function(e) {
                return t && "tweet" === e.type && !e.text && !e.replyTo
            };
            return TD.decider.get(TD.decider.DISABLE_INLINE_COMPOSE) ? (this.trigger("uiDockedComposeTweet", r), void 0) : (e ? this.trigger("uiDockedComposeTweet", r) : "reply" === r.type && r.element && r.element.closest(".js-column").length > 0 ? (i || (s.attachTo(this.$node, {
                composeTextSelector: ".is-inline-active .js-compose-text",
                accountListSelector: ".is-inline-active .js-account-list",
                accountItemSelector: ".is-inline-active .js-account-item",
                selectedItemSelector: ".is-inline-active .js-account-item.is-selected",
                sendButtonSelector: ".is-inline-active .js-send-tweet-button",
                composeSpinner: ".is-inline-active .js-compose-sending-spinner",
                composeSuccess: ".is-inline-active .js-compose-sending-success",
                charCountSelector: ".is-inline-active .js-character-count"
            }), i = !0), this.trigger("uiInlineComposeTweet", r)) : o(r) ? this.trigger("uiNeedsInlineComposeState") : this.trigger("uiDockedComposeTweet", r), void 0)
        }, this.handleAnimateDockedCompose = function(e, t) {
            this.$node.toggleClass("hide-detail-view-inline", t.opening)
        }, this.handleToggleDocked = function(t, i) {
            e = i.opening
        }, this.handleToggleInline = function(e, i) {
            t = i.opening
        }
    }
    var i = e("flight/lib/component"),
        s = e("ui/compose/inline_compose");
    return i(t)
}), define("ui/compose/with_add_image", [], function() {
    return function() {
        var e = null;
        this.defaultAttrs({
            addImageButtonSelector: ".js-add-image-button"
        }), this.after("initialize", function() {
            this.$addImageButton = this.select("addImageButtonSelector"), TD.util.hasFeature("fileapi") || this.hideAddImageButton()
        }), this.addImageButtonAddTooltip = function(e) {
            this.$addImageButton.attr("data-original-title", e)
        }, this.addImageButtonRemoveTooltip = function() {
            this.$addImageButton.removeAttr("data-original-title")
        }, this.disableAddImageButton = function() {
            e !== !0 && (this.$addImageButton.addClass("is-disabled").attr("tabindex", "-1"), this.off(this.$addImageButton, "click"), e = !0)
        }, this.enableAddImageButton = function() {
            e !== !1 && (this.$addImageButton.removeClass("is-disabled").attr("tabindex", "0"), this.on(this.$addImageButton, "click", this.handleAddImageButtonClick), e = !1)
        }, this.hideAddImageButton = function() {
            this.$addImageButton.addClass("is-hidden")
        }, this.handleAddImageButtonClick = function() {
            this.trigger(document, "uiComposeAddImageClick")
        }
    }
}), define("ui/with_click_trap", [], function() {
    var e = function() {
        var e = [],
            t = [],
            i = !1;
        this.onReceiveClick = function(t) {
            e.push(t)
        }, this.onLoseClick = function(e) {
            t.push(e)
        }, this.runReceiveHandlers = function() {
            e.forEach(function(e) {
                e.bind(this)()
            }.bind(this))
        }, this.runLoseHandlers = function(e) {
            this.targetWithinComponent(e.target) || t.forEach(function(e) {
                e.bind(this)()
            }.bind(this))
        }, this.targetWithinComponent = function(e) {
            return $(e).closest(this.$node).length > 0
        }, this.enableClickTrap = function() {
            i || (_.defer(function() {
                $("body").on("click.clicktrap", "*", this.runLoseHandlers.bind(this)), this.$node.on("click.clicktrap", "*", this.runReceiveHandlers.bind(this))
            }.bind(this)), i = !0)
        }, this.disableClickTrap = function() {
            i && ($("body").off("click.clicktrap"), this.$node.off("click.clicktrap"), i = !1)
        }
    };
    return e
}), define("ui/compose/with_direct_message_button", [], function() {
    return function() {
        this.defaultAttrs({
            messageButtonSelector: ".js-dm-button",
            tweetButtonSelector: ".js-tweet-button"
        }), this.after("initialize", function() {
            this.$messageButton = this.select("messageButtonSelector"), this.$tweetButton = this.select("tweetButtonSelector"), this.on(this.$messageButton, "click", function() {
                this.trigger(document, "uiComposeTweet", {
                    type: "message"
                })
            }), this.on(this.$tweetButton, "click", function() {
                this.trigger(document, "uiComposeTweet", {
                    type: "tweet"
                })
            })
        }), this.setMessageToggleButton = function(e) {
            "message" === e ? (this.$messageButton.addClass("is-hidden"), this.$tweetButton.removeClass("is-hidden")) : (this.$messageButton.removeClass("is-hidden"), this.$tweetButton.addClass("is-hidden"))
        }
    }
}), define("ui/compose/with_in_reply_to", ["flight/lib/compose", "ui/with_template"], function(e, t) {
    return function() {
        e.mixin(this, [t]), this.defaultAttrs({
            inReplyToHolderSelector: ".js-in-reply-to",
            inReplyToRemoveSelector: ".js-in-reply-to-remove"
        }), this.after("initialize", function() {
            this.$inReplyToHolder = this.select("inReplyToHolderSelector"), this.$inReplyToHolder.on("click", this.attr.inReplyToRemoveSelector, function() {
                this.removeInReplyTo()
            }.bind(this))
        }), this.addInReplyTo = function(e) {
            this.inReplyTo = e, this.$inReplyToHolder.html(this.toHtml("compose/in_reply_to", this.inReplyTo)), this.$inReplyToHolder.removeClass("is-hidden")
        }, this.removeInReplyTo = function() {
            this.inReplyTo = null, this.$inReplyToHolder.addClass("is-hidden"), this.trigger("uiRemoveInReplyTo")
        }, this.getInReplyToId = function() {
            return this.inReplyTo ? this.inReplyTo.id : null
        }
    }
}), define("ui/compose/with_media_bar", [], function() {
    function e() {
        this.defaultAttrs({
            mediaBarContainerSelector: ".js-media-added",
            mediaBarRemoveSelector: ".js-media-bar-remove",
            mediaBarThumbSelector: ".js-media-bar-thumb",
            mediaBarSelector: ".compose-media-bar",
            maxImageHeight: 310
        }), this.after("initialize", function() {
            this.$mediaBarContainer = this.select("mediaBarContainerSelector"), this.$mediaBarRemove = this.select("mediaBarRemoveSelector"), this.$mediaBar = this.select("mediaBarSelector"), this.$thumb = this.select("mediaBarThumbSelector"), this.on(this.$mediaBarRemove, "click", this.removeFile), this.file = null
        }), this.addFile = function(e) {
            this.$mediaBarContainer.removeClass("is-hidden"), this.file = e, this.loadFileData(e)
        }, this.loadFileData = function(e) {
            var t = new FileReader;
            t.onload = function(e) {
                this.$thumb.remove(), this.$thumb = this.renderTemplate("new_compose/media_bar_image", {
                    src: e.target.result
                }), this.$mediaBar.append(this.$thumb), this.$thumb[0].complete ? this.setImageHeight() : this.$thumb.load(this.setImageHeight.bind(this))
            }.bind(this), t.readAsDataURL(e)
        }, this.setImageHeight = function() {
            this.$thumb.height() > this.attr.maxImageHeight ? (this.$thumb.height(this.attr.maxImageHeight), this.$mediaBar.addClass("compose-media-compressed")) : (this.$thumb.height("auto"), this.$mediaBar.removeClass("compose-media-compressed")), this.trigger("uiComposeImageAdded")
        }, this.removeFile = function() {
            this.$mediaBarContainer.addClass("is-hidden"), this.file = null, this.trigger("uiResetImageUpload"), this.$thumb.remove()
        }, this.getFile = function() {
            return this.file
        }
    }
    return e
}), define("ui/with_clear_input", [], function() {
    var e = function() {
        this.defaultAttrs({
            clearButtonSelector: ".js-clear-input",
            textInputSelector: ".js-clearable-input",
            hasValueClass: "has-value"
        }), this.handleClearAction = function(e, t) {
            var i = $(t.el).siblings(this.attr.textInputSelector);
            i.val(""), i.parent().removeClass(this.attr.hasValueClass), i.focus()
        }, this.handleKeyPressReceived = function(e, t) {
            this.checkInputValueState($(t.el))
        }, this.checkInputValueState = function(e) {
            var t = e.val();
            "" !== t ? e.parent().addClass(this.attr.hasValueClass) : e.parent().removeClass(this.attr.hasValueClass), this.value = t
        }, this.after("initialize", function() {
            this.select("textInputSelector").each(function(e, t) {
                this.checkInputValueState($(t))
            }.bind(this)), this.on("click", {
                clearButtonSelector: this.handleClearAction
            }), this.on("change", {
                textInputSelector: this.handleKeyPressReceived
            })
        })
    };
    return e
}), define("ui/compose/with_message_recipient", ["flight/lib/compose", "ui/with_clear_input", "ui/with_focusable_field"], function(e, t, i) {
    function s() {
        e.mixin(this, [i, t]), this.defaultAttrs({
            composeMessageRecipientSelector: ".js-compose-message-recipient",
            composeMessageRecipientInputSelector: ".js-compose-message-account",
            composeMessageRecipientAvatarSelector: ".js-compose-message-avatar",
            messageRecipientCheckPeriod: 100
        }), this.after("initialize", function() {
            this.messageRecipientChangeInterval = null, this.$messageRecipient = this.select("composeMessageRecipientSelector"), this.$messageRecipientInput = this.select("composeMessageRecipientInputSelector"), this.$messageRecipientAvatar = this.select("composeMessageRecipientAvatarSelector"), this.messageAutoComplete = new TD.components.Autocomplete(this.$messageRecipientInput, {
                dmMode: !0
            }), this.on(this.messageAutoComplete.$node, "td-autocomplete-select", function(e, t, i) {
                this.setMessageRecipient({
                    screenName: t,
                    avatar: i
                })
            }), this.on(this.$messageRecipientInput, "focus", this.handleMessageRecipientFocus), this.on(this.$messageRecipientInput, "blur", this.handleMessageRecipientBlur), this.on(document, "dataUserLookup", this.handleMessageRecipientUserLookup)
        }), this.after("teardown", function() {
            this.messageAutoComplete.destroy()
        }), this.setMessageRecipient = function(e) {
            this.$messageRecipient.removeClass("is-hidden"), e && e.screenName ? (this.$messageRecipientInput.val(e.screenName), this.$messageRecipientAvatar.attr("src", e.avatar), this.$messageRecipientAvatar.data("screenName", e.screenName), this.checkMessageRecipientAvatarState(), this.trigger("uiMessageRecipientSet"), e.avatar || this.trigger("uiNeedsUserLookup", {
                screenName: e.screenName
            })) : (this.resetMessageRecipient(), (!TD.util.isTouchDevice() || !TD.decider.get(TD.decider.TOUCHDECK_COMPOSE)) && this.messageRecipientSetFocus())
        }, this.hideMessageRecipient = function() {
            this.$messageRecipient.addClass("is-hidden"), this.resetMessageRecipient(), this.messageRecipientChangeInterval = null
        }, this.resetMessageRecipient = function() {
            this.$messageRecipientInput.val(""), this.$messageRecipientAvatar.removeAttr("src"), this.$messageRecipientAvatar.data("screenName", ""), this.$messageRecipientAvatar.addClass("is-hidden")
        }, this.getMessageRecipient = function() {
            var e = this.$messageRecipientInput.val().trim();
            return e ? {
                screenName: e
            } : null
        }, this.messageRecipientSetFocus = function() {
            this.$messageRecipientInput.select()
        }, this.messageRecipientBlur = function() {
            this.$messageRecipientInput.blur()
        }, this.checkMessageRecipientAvatarState = function() {
            var e = this.getMessageRecipient(),
                t = e ? e.screenName : "",
                i = "" + (this.$messageRecipientAvatar.data("screenName") || ""),
                s = t && t.toLowerCase() === i.toLowerCase();
            this.$messageRecipientAvatar.toggleClass("is-hidden", !s), this.checkInputValueState(this.$messageRecipientInput)
        }, this.handleMessageRecipientFocus = function() {
            this.messageRecipientChangeInterval || (this.messageRecipientChangeInterval = setInterval(this.checkMessageRecipientAvatarState.bind(this), this.attr.messageRecipientCheckPeriod))
        }, this.handleMessageRecipientBlur = function() {
            clearInterval(this.messageRecipientChangeInterval), this.messageRecipientChangeInterval = null;
            var e = this.getMessageRecipient(),
                t = e ? e.screenName : "",
                i = "" + (this.$messageRecipientAvatar.data("screenName") || "");
            t && t.toLowerCase() !== i.toLowerCase() && this.trigger("uiNeedsUserLookup", {
                screenName: t
            }), this.trigger(this.$messageRecipient, "uiTextfieldInputBlur")
        }, this.handleMessageRecipientUserLookup = function(e, t) {
            var i = this.getMessageRecipient(),
                s = i ? i.screenName : "";
            t.request.screenName.toLowerCase() === s.toLocaleLowerCase() && (this.$messageRecipientInput.val(t.result.screenName), this.$messageRecipientAvatar.attr("src", t.result.miniProfileImageURL()), this.$messageRecipientAvatar.data("screenName", t.result.screenName), this.checkMessageRecipientAvatarState())
        }
    }
    return s
}), define("ui/compose/with_scheduler", [], function() {
    return function() {
        var e = null,
            t = !1;
        this.defaultAttrs({
            scheduleButtonSelector: ".js-schedule-button",
            scheduleButtonLabelSelector: ".js-schedule-button-label",
            scheduleDatePickerHolderSelector: ".js-schedule-datepicker-holder"
        }), this.after("initialize", function() {
            this.$scheduleButton = this.select("scheduleButtonSelector"), this.$scheduleButtonLabel = this.select("scheduleButtonLabelSelector"), this.$scheduleDatePickerHolder = this.select("scheduleDatePickerHolderSelector"), this.scheduleButtonTitleTweet = TD.i("Schedule Tweet"), this.scheduleButtonTitleMessage = TD.i("Schedule Message")
        }), this.after("teardown", function() {
            this.scheduleDatePicker && ($.unsubscribe(this.dateChangedSubscription), $.unsubscribe(this.dateRemovedSubscription))
        }), this.disableScheduleButton = function() {
            e !== !0 && (this.$scheduleButton.addClass("is-disabled").attr("tabindex", "-1").attr("data-original-title", TD.i("Tweets with images cannot be scheduled")), this.off(this.$scheduleButton, "click"), e = !0)
        }, this.enableScheduleButton = function() {
            e !== !1 && (this.$scheduleButton.removeClass("is-disabled").attr("tabindex", "0").removeAttr("data-original-title"), this.on(this.$scheduleButton, "click", this.handleScheduleButtonClick), e = !1)
        }, this.handleScheduleButtonClick = function() {
            this.initScheduleDatePicker()
        }, this.resetScheduler = function() {
            this.scheduleDatePicker && this.closeScheduleDatePicker(), this.scheduledDate = null
        }, this.openScheduleDatePicker = function() {
            t || ($("body").on("click.scheduleclicktrap", function(e) {
                var t = $(e.target);
                0 === t.closest(this.$scheduleDatePickerHolder).length && 0 === t.closest(this.$scheduleButton).length && this.closeScheduleDatePicker()
            }.bind(this)), this.scheduleDatePicker.$node.show(), t = !0)
        }, this.closeScheduleDatePicker = function() {
            t && ($("body").off("click.scheduleclicktrap"), this.scheduleDatePicker.$node.hide(), t = !1)
        }, this.initScheduleDatePicker = function() {
            var e = function() {
                this.closeScheduleDatePicker(), this.scheduledDate = null, this.trigger("uiComposeScheduleDate", {
                    date: null
                })
            };
            this.scheduleDatePicker ? (this.scheduleDatePicker.$node.is(":hidden") ? this.openScheduleDatePicker() : this.closeScheduleDatePicker(), this.scheduledDate || this.scheduleDatePicker.setDate(new Date)) : (this.dateChangedSubscription = $.subscribe("/change/date", this.setScheduledDate.bind(this)), this.dateRemovedSubscription = $.subscribe("/removed/date", e.bind(this)), this.scheduleDatePicker = new TD.components.ScheduledDatePicker(this.$scheduleDatePickerHolder), this.openScheduleDatePicker())
        }, this.setScheduledDate = function(e) {
            var t;
            e ? (t = TD.util.prettyTimeString(e), this.$scheduleButtonLabel.text(t)) : this.closeScheduleDatePicker(), this.scheduledDate = e, this.trigger("uiComposeScheduleDate", {
                date: e
            })
        }, this.getScheduledDate = function() {
            return this.scheduledDate
        }, this.setScheduledId = function(e) {
            this.scheduledId = e
        }, this.getScheduledId = function() {
            return this.scheduledId
        }, this.setScheduleButtonTitle = function(e) {
            if (!this.scheduledDate) switch (e) {
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
        var e, t;
        this.defaultAttrs({
            checkboxSelector: ".js-compose-stay-open"
        }), this.after("initialize", function() {
            e = this.select("checkboxSelector"), this.on(e, "change", function() {
                e.prop("checked") ? this.trigger("uiChangeComposeStayOpen", {
                    composeStayOpen: !0
                }) : this.trigger("uiChangeComposeStayOpen", {
                    composeStayOpen: !1
                })
            }), this.on(document, "dataSettings", this.handleSettings)
        }), this.handleSettings = function(i, s) {
            s.composeStayOpen ? (e.prop("checked", !0), this.composeStayOpen = !0, void 0 === t && this.trigger(document, "uiDockedComposeTweet", {
                noAnimate: !0
            })) : (e.prop("checked", !1), this.composeStayOpen = !1), t = !0
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
        }), this.setTitle = function(e, t) {
            var i, s;
            "message" === e ? (s = !0, i = t ? TD.i("Edit scheduled message") : TD.i("New direct message")) : (s = !1, i = t ? TD.i("Edit scheduled Tweet") : TD.i("New Tweet")), this.$title.text(i), this.$header.toggleClass("with-dm-icon", s)
        }
    }
}), define("ui/compose/docked_compose", ["require", "flight/lib/component", "util/tweet_utils", "ui/compose/with_account_selector", "ui/compose/with_add_image", "ui/compose/with_character_count", "ui/with_click_trap", "data/with_client", "ui/compose/with_compose_text", "ui/compose/with_direct_message_button", "ui/with_focus", "ui/compose/with_in_reply_to", "ui/compose/with_media_bar", "ui/compose/with_message_recipient", "ui/compose/with_scheduler", "ui/compose/with_send_button", "ui/compose/with_send_tweet", "ui/compose/with_stay_open", "ui/compose/with_title"], function(e) {
    function t() {
        this.defaultAttrs({
            stayOpenInputSelector: ".js-compose-stay-open",
            mediaAddedSelector: ".js-media-added",
            composeScrollerSelector: ".js-compose-scroller",
            withTouchComposeClass: "is-touch-compose",
            tcoLength: 22,
            panelCloseDelay: 500
        }), this.after("initialize", function() {
            this.setupDOM(), this.tweetType = "tweet", this.panelWasClosed = !0, this.on(document, "uiDockedComposeTweet", this.handleUiComposeTweet), this.on(document, "uiComposeClose", this.handleUiComposeClose), this.on(document, "uiFilesAdded", this.handleUiFilesAdded), this.on("uiComposeSendTweet", this.handleUiComposeSendTweet), this.on("uiComposeTweetSending", this.enterSendingState), this.on("uiComposeTweetSent", this.enterSuccessState), this.on("uiComposeTweetError", this.enterErrorState), this.on("uiComposeScheduleDate", this.handleUiComposeScheduleDate), this.before("charCountHandleCharCount", function(e, t) {
                var i = this.getFile();
                i && (t.charCount = t.charCount + this.attr.tcoLength + 1)
            }), this.after("addFile", function() {
                this.composeTextHandleChange(), this.disableScheduleButton(), this.inferAddImageButtonState(), this.handleComposeResize()
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
            }), this.on("uiRemoveInReplyTo", function() {
                (!TD.util.isiOSDevice() || !TD.decider.get(TD.decider.TOUCHDECK_COMPOSE)) && this.composeTextSetFocus()
            }), this.onReceiveClick(function() {
                this.hasFocus || this.focusRequest()
            }), this.onLoseClick(function() {
                this.hasFocus && this.focusRelease()
            }), this.on(document, "uiMainWindowResized", this.handleComposeResize), this.on("uiComposeImageAdded", this.handleComposeResize), this.handleComposeResize()
        }), this.setupDOM = function() {
            this.$composeScroller = this.select("composeScrollerSelector"), TD.util.isTouchDevice() && TD.decider.get(TD.decider.TOUCHDECK_COMPOSE) && this.$node.addClass(this.attr.withTouchComposeClass)
        }, this.handleUiComposeTweet = function(e, t) {
            t = t || {}, this.tweetType = t.type || "tweet", this.resetComposePanelState(t), $(document).trigger("uiCloseModal"), this.focusRequest(), this.enableClickTrap(), this.trigger("uiToggleDockedCompose", {
                opening: !0,
                noAnimate: t.noAnimate
            }), this.panelWasClosed = !1
        }, this.handleUiComposeClose = function(e, t) {
            t = t || {}, t.keyboardShortcut ? this.hasFocus && (this.composeStayOpen ? this.focusRelease() : this.hideComposePanel()) : this.hideComposePanel()
        }, this.handleUiComposeSendTweet = function(e, t) {
            if (e.stopPropagation(), !e.keyboardShortcut || this.hasFocus) {
                var i = _.uniqueId("sendTweet"),
                    s = $.extend({}, t);
                s.requestId = i, s.text = this.composeTextGetText(), s.inReplyToStatusId = this.getInReplyToId(), s.file = this.getFile(), s.messageRecipient = this.getMessageRecipient(), s.scheduledDate = this.getScheduledDate(), s.scheduledId = this.getScheduledId(), s.from = this.getSelectedAccounts(), s.type = this.tweetType, this.sendTweet(s)
            }
        }, this.enterSendingState = function(e) {
            e.stopPropagation(), this.disablePanelInputs(), this.sendButtonShowSending()
        }, this.enterSuccessState = function(e) {
            e.stopPropagation(), this.sendButtonShowSuccess(), setTimeout(this.resetAfterSend.bind(this), this.attr.panelCloseDelay)
        }, this.enterErrorState = function(e, t) {
            e.stopPropagation(), t.errors && this.setSelectedAccounts(t.errors.map(function(e) {
                return e.request.accountKey
            })), this.sendButtonShowText(), this.enablePanelInputs()
        }, this.resetAfterSend = function() {
            "reply" === this.tweetType && (this.tweetType = "tweet"), this.sendButtonShowText(), this.composeStayOpen ? this.resetComposePanelState({
                text: "",
                from: this.getSelectedAccounts()
            }) : this.hideComposePanel()
        }, this.hideComposePanel = function() {
            this.destructivePanelReset(), this.setSelectedAccounts([this.defaultAccountKey]), this.composeTextBlur(), this.messageRecipientBlur(), this.hideMessageRecipient(), this.sendButtonShowText(), this.enablePanelInputs(), this.focusRelease(), this.disableClickTrap(), this.resetSendTweet(), this.trigger("uiToggleDockedCompose", {
                opening: !1
            }), this.panelWasClosed = !0
        }, this.destructivePanelReset = function() {
            this.composeTextSetText(""), this.removeFile(), this.resetScheduler(), this.setScheduledId(null)
        }, this.resetComposePanelState = function(e) {
            var t, i, n, r, o = {};
            e = e || {};
            var a = void 0 !== e.text;
            switch (a && this.destructivePanelReset(), this.enablePanelInputs(), this.getFile() || this.enableScheduleButton(), e.schedule && (this.setScheduledDate(e.schedule.time), this.setScheduledId(e.schedule.id), this.setSelectedAccounts(e.from)), this.setTitle(this.tweetType, this.getScheduledId()), this.sendButtonSetText(this.tweetType, this.getScheduledDate()), this.setScheduleButtonTitle(this.tweetType), this.setMessageToggleButton(this.tweetType), this.inferAddImageButtonState(), this.tweetType) {
                case "tweet":
                    this.removeInReplyTo(), void 0 !== e.text ? this.composeTextSetText(e.text) : (t = this.getMessageRecipient(), t && this.composeTextPrependText(s.atMentionify(t.screenName))), void 0 !== e.appendText && this.composeTextAppendText(e.appendText), this.hideMessageRecipient(), (e.from && e.from.length > 0 && this.panelWasClosed || e.isEditAndRetweet) && this.setSelectedAccounts(e.from), (!TD.util.isiOSDevice() || !TD.decider.get(TD.decider.TOUCHDECK_COMPOSE)) && this.composeTextSetCaretToEnd();
                    break;
                case "reply":
                    (!this.getInReplyToId() || this.composeTextIsEmpty()) && (this.addInReplyTo(e.inReplyTo), this.panelWasClosed && this.setSelectedAccounts(e.from)), n = this.getSelectedAccounts(), 1 === n.length && (r = this.getAccountData(n[0]).screenName), void 0 !== e.text ? (this.composeTextSetText(e.text), this.composeTextSetCaretToEnd()) : this.composeTextSetRepliesAndMentions([e.inReplyTo.user.screenName], e.mentions, r), this.hideMessageRecipient();
                    break;
                case "message":
                    if (void 0 !== e.text ? this.composeTextSetText(e.text) : i = s.extractMentions(this.composeTextGetText()), e.messageRecipient) o = e.messageRecipient;
                    else if (e.to && e.to.screenName) o = {
                        screenName: e.to.screenName
                    };
                    else if (i && i.length) {
                        o = {
                            screenName: i[0]
                        };
                        var c = s.removeFirstMention(this.composeTextGetText());
                        this.composeTextSetText(c)
                    }
                    this.setMessageRecipient(o), this.removeInReplyTo(), this.removeFile(), e.from && e.from.length > 0 && this.setSelectedAccounts(e.from), TD.util.isiOSDevice() && TD.decider.get(TD.decider.TOUCHDECK_COMPOSE) || (o.screenName ? this.composeTextSetCaretToEnd() : this.messageRecipientSetFocus())
            }
            this.handleComposeResize()
        }, this.handleUiFilesAdded = function(e, t) {
            for (var i = 0; t.files.length > i; i++) this.addFile(t.files[i]);
            this.trigger("uiToggleDockedCompose", {
                opening: !0
            })
        }, this.handleUiComposeScheduleDate = function() {
            this.sendButtonSetText(this.tweetType, this.getScheduledDate()), this.setScheduleButtonTitle(this.tweetType), this.inferAddImageButtonState()
        }, this.inferAddImageButtonState = function() {
            var e, t = "message" !== this.tweetType && !this.getScheduledDate() && !this.getFile();
            t ? (this.enableAddImageButton(), this.addImageButtonRemoveTooltip()) : ("message" === this.tweetType ? e = TD.i("Direct messages cannot contain images") : this.getScheduledDate() ? e = TD.i("Scheduled Tweets cannot contain images") : this.getFile() && (e = TD.i("You cannot add more than one image")), this.disableAddImageButton(), this.addImageButtonAddTooltip(e))
        }, this.handleComposeResize = function() {
            this.$composeScroller.antiscroll()
        }, this.disablePanelInputs = function() {
            this.sendButtonSetDisabled(), this.composeTextSetDisabled(!0)
        }, this.enablePanelInputs = function() {
            this.sendButtonEnabledIfValid(), this.composeTextSetDisabled(!1)
        }
    }
    var i = e("flight/lib/component"),
        s = e("util/tweet_utils"),
        n = e("ui/compose/with_account_selector"),
        r = e("ui/compose/with_add_image"),
        o = e("ui/compose/with_character_count"),
        a = e("ui/with_click_trap"),
        c = e("data/with_client"),
        l = e("ui/compose/with_compose_text"),
        u = e("ui/compose/with_direct_message_button"),
        h = e("ui/with_focus"),
        d = e("ui/compose/with_in_reply_to"),
        p = e("ui/compose/with_media_bar"),
        m = e("ui/compose/with_message_recipient"),
        f = e("ui/compose/with_scheduler"),
        g = e("ui/compose/with_send_button"),
        T = e("ui/compose/with_send_tweet"),
        v = e("ui/compose/with_stay_open"),
        y = e("ui/compose/with_title");
    return i(t, n, r, o, a, c, l, u, h, d, p, m, f, g, T, v, y)
}), define("tracking/column_options_scribe", ["flight/lib/component"], function(e) {
    var t = function() {
        this.trackClear = function() {
            TD.controller.stats.columnActionClick("clear")
        }, this.trackMoveColumn = function(e, t) {
            TD.controller.stats.columnActionClick(t.action)
        }, this.trackEmbedTimeline = function(e, t) {
            TD.controller.stats.columnActionClick("embed", {
                type: t.column.getColumnType()
            })
        }, this.trackActionFilterError = function() {
            TD.controller.stats.actionFilterError()
        }, this.after("initialize", function() {
            this.on(document, "uiClearColumnAction", this.trackClear), this.on(document, "uiMoveColumnAction", this.trackMoveColumn), this.on(document, "uiEmbedTimelineAction", this.trackEmbedTimeline), this.on(document, "uiActionFilterError", this.trackActionFilterError)
        })
    };
    return e(t)
}), define("tracking/compose_scribe", ["flight/lib/component", "data/with_client"], function(e, t) {
    function i() {
        this.after("initialize", function() {
            this.on(document, "dataTweetSent", this.handleTweetSent), this.on(document, "uiRemoveInReplyTo", this.handleClearReply), this.on(document, "uiComposeStackReply", this.handleStackReply), this.on(document, "uiDockedComposeTweet", this.handleDockedTweet)
        }), this.handleTweetSent = function(e, t) {
            var i = this.getAccountData(t.request.accountKey),
                s = i ? i.id : null,
                n = Boolean(t.request.file),
                r = Boolean(t.request.scheduledDate),
                o = t.request.inline || !1;
            switch (t.request.type) {
                case "tweet":
                    TD.controller.stats.postTweet(s, n, r);
                    break;
                case "reply":
                    TD.controller.stats.postReply(s, n, r, o);
                    break;
                case "message":
                    TD.controller.stats.postMessage(s, n, r)
            }
        }, this.handleClearReply = function() {
            TD.controller.stats.composeClearReply()
        }, this.handleStackReply = function() {
            TD.controller.stats.composeStackReply()
        }, this.handleDockedTweet = function(e, t) {
            t.popFromInline && TD.controller.stats.composePopFromInline()
        }
    }
    return e(i, t)
}), define("tracking/message_banner_scribe", ["flight/lib/component"], function(e) {
    var t = function() {
        this.trackImpression = function(e, t) {
            TD.controller.stats.messageBannerImpression(t.id)
        }, this.trackDismiss = function(e, t) {
            TD.controller.stats.messageBannerDismiss(t.id)
        }, this.trackAction = function(e, t) {
            TD.controller.stats.messageBannerClick(t.messageId, t.actionId)
        }, this.after("initialize", function() {
            this.on(document, "uiShowMessageBanner", this.trackImpression), this.on(document, "uiDismissMessageAction", this.trackDismiss), this.on(document, "uiClickMessageButtonAction", this.trackAction)
        })
    };
    return e(t)
}), define("tracking/embed_tweet_dialog_scribe", ["flight/lib/component"], function(e) {
    var t = function() {
        this.trackOpen = function(e, t) {
            TD.controller.stats.embedTweetDialogOpen(t.tweet.id)
        }, this.after("initialize", function() {
            this.on(document, "uiShowEmbedTweet", this.trackOpen)
        })
    };
    return e(t)
}), define("tracking/typeahead_scribe", ["flight/lib/component"], function(e) {
    var t = function() {
        this.trackInvocation = function() {
            TD.controller.stats.typeaheadInvoked()
        }, this.trackSelection = function(e, t) {
            var i = t.input.length;
            "recent-search" === t.searchType ? TD.controller.stats.typeaheadRecentItemSelected(i, t.searchType, t.index) : TD.controller.stats.typeaheadItemSelected(i, t.searchType, t.index)
        }, this.after("initialize", function() {
            this.on(document, "uiTypeaheadDropdownInvoked", this.trackInvocation), this.on(document, "uiTypeaheadItemSelected", this.trackSelection)
        })
    };
    return e(t)
}), define("tracking/social_proof_for_tweet_scribe", ["flight/lib/component"], function(e) {
    var t = function() {
        this.trackViews = function(e, t) {
            TD.controller.stats.viewedTweetSocialProof(t.type)
        }, this.after("initialize", function() {
            this.on(document, "uiShowSocialProof", this.trackViews)
        })
    };
    return e(t)
}), define("tracking/report_tweet_scribe", ["flight/lib/component", "data/with_client"], function(e, t) {
    function i() {
        this.after("initialize", function() {
            this.on(document, "uiShowReportTweetOptions", function() {
                TD.controller.stats.reportUser("impression")
            }), this.on(document, "uiShowReportTweetCancel", function() {
                TD.controller.stats.reportUser("cancel")
            }), this.on(document, "uiReportSpamAction", function() {
                TD.controller.stats.reportUser("report_as_spam", "spam")
            }), this.on(document, "uiReportCompromisedAction", function(e, t) {
                t && t.block ? TD.controller.stats.reportUser("block", "compromised") : TD.controller.stats.reportUser("report_as_spam", "compromised")
            }), this.on(document, "uiReportAbusiveAction", function(e, t) {
                TD.controller.stats.reportUserAbusive("impression"), t && t.block ? TD.controller.stats.reportUser("block", "abusive") : TD.controller.stats.reportUser("report_as_spam", "abusive")
            }), this.on(document, "uiReportAbusiveOption", function(e, t) {
                TD.controller.stats.reportUserAbusive("click", t.option)
            })
        })
    }
    return e(i, t)
}), define("page/default", ["flight/lib/component", "data/accounts", "data/column_manager", "data/embed_timeline", "data/embed_tweet", "data/message_banner", "data/preferred_account", "data/relationship", "data/twitter_user", "data/user_actions", "data/settings", "data/stream_counter", "data/user_search", "data/storage", "data/recent_searches", "data/typeahead", "data/user_profile_social_proof", "data/twitter_users", "data/lists", "data/account", "data/tweet", "data/tweetdeck_api", "data/touch_controller", "ui/keyboard_shortcuts", "ui/message_banner", "ui/app_search", "ui/search_input", "ui/column_controller", "ui/grid", "ui/focus_controller", "ui/confirmation_dialog_controller", "ui/with_dialog_manager", "ui/message_banner_container", "ui/image_upload", "ui/login/login_form", "ui/column_navigation", "ui/search/search_in_popover", "ui/typeahead/typeahead_dropdown", "ui/search/search_results", "ui/search/search_router", "ui/app_header", "ui/default_page_layout", "ui/compose/compose_controller", "ui/compose/docked_compose", "tracking/column_options_scribe", "tracking/compose_scribe", "tracking/message_banner_scribe", "tracking/embed_tweet_dialog_scribe", "tracking/typeahead_scribe", "tracking/social_proof_for_tweet_scribe", "tracking/report_tweet_scribe"], function(e, t, i, s, n, r, o, a, c, l, u, h, d, p, m, f, g, T, v, y, w, _, b, D, C, S, E, k, A, I, x, R, M, F, $, L, N, O, U, P, j, B, H, W, K, z, q, V, G, Y, Q) {
    function X() {
        this.defaultAttrs({
            modal: "#open-modal",
            appHeader: ".js-app-header",
            searchResults: ".js-search-form",
            message: ".js-message-banner",
            appSearchSourceId: "appSearch",
            searchPopoverSourceId: "searchPopover",
            isHiddenClass: "is-hidden",
            gridFocusId: "grid_focus"
        }), this.handlePreferredAccount = function(e, t) {
            t && t.account && (this.preferredAccount = t.account)
        }, this.initSearchInPopover = function() {
            N.attachTo(".js-search-in-popover", {
                popoverPosition: "rt",
                closeModals: !0,
                appSearchSourceId: this.attr.appSearchSourceId,
                searchPopoverSourceId: this.attr.searchPopoverSourceId,
                isHiddenClass: this.attr.isHiddenClass
            }), S.attachTo(".js-search-in-popover", {
                sourceId: this.attr.searchPopoverSourceId
            }), O.attachTo(".js-search-in-popover"), U.attachTo(".js-search-in-popover")
        }, this.initUI = function() {
            B.attachTo(this.$node), I.attachTo(this.$node), C.attachTo(this.select("message")), k.attachTo(this.$node, {
                focusId: this.attr.gridFocusId
            }), A.attachTo(this.$node, {
                focusId: this.attr.gridFocusId
            }), F.attachTo("#compose-modal"), j.attachTo(".js-app-header"), H.attachTo(".js-app"), W.attachTo(".js-new-compose"), L.attachTo("#column-navigator"), S.attachTo(".js-search-form", {
                sourceId: this.attr.appSearchSourceId
            }), this.initSearchInPopover(), P.attachTo(this.$node), D.attachTo(this.$node)
        }, this.after("initialize", function() {
            p.attachTo(this.$node), m.attachTo(this.$node), u.attachTo(this.$node), t.attachTo(this.$node), i.attachTo(this.$node), $.attachTo(".js-signin-ui"), r.attachTo(this.$node), o.attachTo(this.$node), a.attachTo(this.$node), c.attachTo(this.$node), l.attachTo(this.$node), h.attachTo(this.$node), n.attachTo(this.$node), s.attachTo(this.$node), d.attachTo(this.$node), f.attachTo(this.$node), g.attachTo(this.$node), T.attachTo(this.$node), x.attachTo(this.$node), v.attachTo(this.$node), M.attachTo(this.$node), y.attachTo(this.$node), w.attachTo(this.$node), _.attachTo(this.$node, {
                apiRoot: TD.config.api_root
            }), b.attachTo(this.$node), K.attachTo(this.$node), z.attachTo(this.$node), q.attachTo(this.$node), V.attachTo(this.$node), G.attachTo(this.$node), Y.attachTo(this.$node), Q.attachTo(this.$node), this.on(document, "TD.ready", this.initUI), this.trigger(document, "uiNeedsPreferredAccount"), this.on(document, "dataPreferredAccount", this.handlePreferredAccount)
        })
    }
    return e(X, R)
}), define("td/lib/require-domready", [], function() {
    function e(e) {
        var t;
        for (t = 0; e.length > t; t += 1) e[t](l)
    }

    function t() {
        var t = u;
        c && t.length && (u = [], e(t))
    }

    function i() {
        c || (c = !0, o && clearInterval(o), t())
    }

    function s(e) {
        return c ? e(l) : u.push(e), s
    }
    var n, r, o, a = "undefined" != typeof window && window.document,
        c = !a,
        l = a ? document : null,
        u = [];
    if (a) {
        if (document.addEventListener) document.addEventListener("DOMContentLoaded", i, !1), window.addEventListener("load", i, !1);
        else if (window.attachEvent) {
            window.attachEvent("onload", i), r = document.createElement("div");
            try {
                n = null === window.frameElement
            } catch (h) {}
            r.doScroll && n && window.external && (o = setInterval(function() {
                try {
                    r.doScroll(), i()
                } catch (e) {}
            }, 30))
        }
        "complete" === document.readyState && i()
    }
    return s.version = "2.0.1", s.load = function(e, t, i, n) {
        n.isBuild ? i(null) : s(i)
    }, s
}), require(["page/default", "td/lib/require-domready!"], function(e, t) {
    TD.util.checkAPIRoot(), e.attachTo(t), TD.controller.init.start()
}), $(document).ready(function() {
    TD.controller.init.preload()
}), define("scripts/swift/app/main", function() {});
