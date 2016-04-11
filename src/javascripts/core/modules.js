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
