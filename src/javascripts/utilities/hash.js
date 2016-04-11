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
