(function() {
    var utility = window.utility = {

        windowSize: function() {
            var size = {};

            if (typeof (window.innerWidth) == 'number') {
                //Non-IE
                size.width = window.innerWidth;
                size.height = window.innerHeight;
            } else if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
                //IE 6+ in 'standards compliant mode'
                size.width = document.documentElement.clientWidth;
                size.height = document.documentElement.clientHeight;
            } else if (document.body && (document.body.clientWidth || document.body.clientHeight)) {
                //IE 4 compatible
                size.width = document.body.clientWidth;
                size.height = document.body.clientHeight;
            }
            else if (jQuery) {
                size.height = jQuery(window).height();
                size.width = jQuery(window).width();
            }
            else {
                size.height = 0;
                size.width = 0;
            }

            return size;
        },
        windowWidth: function() {
            return utility.windowSize().width;
        },
        windowHeight: function() {
            return utility.windowSize().height;
        },
        lunghezza: function(oggetto) {
            var i = 0;

            for (var campo in oggetto)
                i++;

            return i;
        },
        startWith: function(stringa, parte) {
            try {
                return (stringa.substring(0, parte.length) == parte);
            } catch (ex) {
            }
            return false;
        },
        isChildOf: function(parent, child, container) {
            try {
                if (!container)
                    container = document.body;

                var test;
                if (parent == child) {
                    return true;
                }
                if (parent.contains) {
                    return parent.contains(child);
                }
                if (parent.compareDocumentPosition) {
                    return !!(parent.compareDocumentPosition(child) & 16);
                }
                var prEl = child.parentNode;
                while (prEl && prEl != container) {
                    if (prEl == parent)
                        return true;
                    prEl = prEl.parentNode;
                }
                return false;
            } catch (ex) {
            }

            return false;
        },
        trim: function(stringa) {
            var str = stringa.replace(/^\s\s*/, ''),
		        ws = /\s/,
		        i = str.length;
            
            while (ws.test(str.charAt(--i)));
            return str.slice(0, i + 1);
        }
    }

})();