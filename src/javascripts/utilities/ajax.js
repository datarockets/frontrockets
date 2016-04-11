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
