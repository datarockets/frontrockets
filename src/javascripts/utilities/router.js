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
