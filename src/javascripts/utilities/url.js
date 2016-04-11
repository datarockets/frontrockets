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
