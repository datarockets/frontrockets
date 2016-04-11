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
