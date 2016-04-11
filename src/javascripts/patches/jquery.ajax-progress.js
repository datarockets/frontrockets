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
