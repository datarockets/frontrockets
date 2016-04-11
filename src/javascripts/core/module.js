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
