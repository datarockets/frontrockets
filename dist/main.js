(function(window, $) {

    var jqXHR = $.ajaxSettings.xhr;

    // If onprogress not supported by browser, do nothing
    if (!("onprogress" in jqXHR())) {
        return;
    }

    $.ajaxSettings.xhr = function() {
        var xhr = jqXHR();

        if (xhr instanceof window.XMLHttpRequest) {
            xhr.addEventListener('progress', this.progress, false);
        }

        if (xhr.upload) {
            xhr.upload.addEventListener('progress', this.progress, false);
        }

        return xhr;
    };

})(window, jQuery);

(function(window, $) {

    // Cache window and document jquery wrapers
    $.window = $(window);
    $.document = $(document);

})(window, jQuery);

(function(window) {

    window.app = {};

    // Utilities
    app.utils = {};

    // Store for some data
    app.storage = {};

    app.storage.Utils = {};

})(window);

(function(window) {

    var app = window.app;

    // Body

    var Module = function(root, middlewareConnections) {
        var module = root.constructor;

        module.prototype = {};

        for (var key in root) {
            if (key != 'constructor') {
                module.prototype[key] = root[key];
            }
        }

        var instance = new module();

        instance.ID = new Date().getTime();

        instance.MIDDLEWARE = new app.Middleware(instance, middlewareConnections);
    };

    Module.prototype = {};

    // Export

    app.Module = Module;

})(window);

(function(window) {

    var app = window.app;

    // Body

    var Modules = function() {
        this.store = [];
    };

    Modules.prototype = {};

    Modules.prototype.create = function(moduleObject) {
        var that = this;
        var moduleBody = moduleObject.body(app, $);

        if (moduleObject.onDocumentReady) {
            $(function() {
                that._initModule(moduleBody, moduleObject.export);
            });
        }
        else {
            that._initModule(moduleBody, moduleObject.export);
        }
    };

    Modules.prototype._initModule = function(moduleBody, moduleObjectExport) {
        var module = new app.Module(moduleBody, moduleObjectExport);

        this.store.push(module);
    };

    // Export

    app.Modules = new Modules();

})(window);

(function(window) {

    var app = window.app;

    // Body

    var Middleware = function(module, connections) {
        var that = this;

        that.addListeners = function() {
            for (var key in connections) {
                var listener = that._getMethod(module, connections[key]);

                if (listener) {
                    app.world.listen(key + '.' + module.ID, listener.bind(module));
                }
            }
        };

        that.init();
    };

    Middleware.prototype = {};

    Middleware.prototype.init = function() {
        this.addListeners();
    };

    Middleware.prototype._getMethod = function(module, methodPath) {
        var method;

        if (~methodPath.indexOf('.')) {
            var methodPathArray = methodPath.split('.');

            var potentialMethod = module[methodPathArray[0]];

            for (var i = 1, l = methodPathArray.length; i < l; i++) {
                potentialMethod = potentialMethod[methodPathArray[i]];
            }

            method = potentialMethod;
        }
        else {
            method = module[methodPath];
        }

        return method;
    };

    // Export

    app.Middleware = Middleware;

})(window);

(function(window, $) {

    var app = window.app;

    app.world = {};

    app.world.say = function(name, obj) {
        $.window.trigger(name, obj);
    };

    app.world.listen = function(nameWithNamespace, listener) {
        $.window.on(nameWithNamespace, function(e, obj) {
            listener(obj);
        });
    };

})(window, jQuery);

(function(window, $) {

    var app = window.app;

    var csrf_param, csrf_token;

    $(function() {
        csrf_param = $('meta[name=csrf-param]').attr('content');
        csrf_token = $('meta[name=csrf-token]').attr('content');
    });

    app.utils.ajax_plain = function(url, data) {
        data.url = url;

        data.dataType = data.dataType || 'html';

        // Don't send ajax if ajax method is GET or if jquery-ujs has been
        // included
        if (data.type !== 'get' && !$.rails.CSRFProtection) {
            data['data'][csrf_param] = csrf_token;
        }

        return $.ajax(data);
    };

    app.utils.ajax = function(route, route_obj, data) {
        var customMethod,
            routeParsed = app.utils.router.parse(route, route_obj),
            method = routeParsed[1],
            url = routeParsed[0];

        if (!data['data']) {
            data['data'] = {};
        }

        data['type'] = method;

        return app.utils.ajax_plain(url, data);
    };

})(window, jQuery);

(function( window, $ ) {

    var app = window.app;

    // Sandbox

    var location = window.location;

    // Body

    var Hash = function(name, options) {
        this.name = name;
        this.options = options;
        this.regExp = new RegExp('\\&' + name + '\\[([\\d,]+)\\]');
        this.regExp_full = new RegExp('^(.*\\&' + name + '\\[)([\\d,]*)(\\].*)$');
    };

    Hash.prototype.remove = function(value) {
        var arr = this.getArray();

        var i = arr.indexOf(value);
        if (i != -1) {
            arr.splice(i, 1);
        }

        this.setArray(arr);
    };

    Hash.prototype.add = function(value) {
        var arr = this.getArray();

        var i = arr.indexOf(value);
        if (i == -1) {
            arr.push(value);
        }

        this.setArray(arr);
    };

    Hash.prototype.setArray = function(array) {
        var parsed;
        var ids = array.join(this.options.array_separator);

        if (location.hash.indexOf('&' + this.name) == -1) {
            parsed = location.hash + '&' + this.name + '[' + ids + ']';
        }
        else {
            parsed = location.hash.replace(this.regExp_full, '$1' + ids + '$3');
        }

        location.hash = parsed;
    };

    Hash.prototype.getArray = function() {
        var hash = location.hash;
        var matchedHash = hash.match(this.regExp);
        var out;

        if (matchedHash) {
            out = matchedHash[1].split(this.options.array_separator);
            out = out.map(function(item) {
                return parseInt(item);
            });
        }
        else {
            out = [];
        }

        return out;
    };

    Hash.defaultOptions = {
        array_separator: ','
    };

    // Export

    app.utils.hash = function(name, userOptions) {
        var options = $.extend({}, Hash.defaultOptions, userOptions || {});

        return new Hash(name, options);
    };

})( window, jQuery );

(function( window, $ ) {

    var app = window.app;

    app.utils.key = {
        Enter: 13,
        Esc: 27,

        ArrowLeft: 37,
        ArrowTop: 38,
        ArrowRight: 39,
        ArrowDown: 40,

        Space: 32
    };

})( window, jQuery );

(function(window, $) {

    var app = window.app;

    var router = app.utils.router = {};

    router.parse = function(name, obj) {
        var route = app.routes[name];
        var isDefaultMethod = (typeof route === 'string');
        var out = (isDefaultMethod) ? route : route[0];

        for (var key in obj) {
            var value = obj[key];
            var regexp = new RegExp(':' + key + '(\\/?)', 'g');

            out = out.replace(regexp, value + '$1');
        }

        return [out, (isDefaultMethod) ? app.routes['method'] : route[1]];
    };

    router.url = function(name, obj) {
        var route = app.routes[name];

        if (typeof route !== 'string') {
            route = route[0];
        }

        for (var key in obj) {
            var value = obj[key];
            var regexp = new RegExp(':' + key + '(\\/?)', 'g');

            route = route.replace(regexp, value + '$1');
        }

        return route;
    };

})(window, jQuery);

(function( window, $ ) {

    var app = window.app;

    // Body

    var Url = function(route, routeObj) {
        this.href = app.utils.router.url(route, routeObj);
    };

    Url.prototype.open = function(target) {
        if (target == '_blank') {
            window.open(this.href, target);
        }
        else {
            window.location.href = this.href;
        }
    };

    // Export

    app.utils.url = function(route, routeObj) {
        return new Url(route, routeObj);
    };

})( window, jQuery );
