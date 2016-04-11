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
