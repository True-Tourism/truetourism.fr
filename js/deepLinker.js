
function DeepLinker(options) {
    if (!options) {
        throw new Error('no options')
    }

    let hasFocus = true;
    let didHide = false;

    // window is blurred when dialogs are shown
    function onBlur() {
        hasFocus = false;
    }

    // document is hidden when native app is shown or browser is backgrounded
    function onVisibilityChange(e) {
        if (e.target.visibilityState === 'hidden') {
            didHide = true;
        }
    }

    // window is focused when dialogs are hidden, or browser comes into view
    function onFocus() {
        if (didHide) {
            if (options.onReturn) {
                options.onReturn();
            }

            didHide = false; // reset
        } else {
            // ignore duplicate focus event when returning from native app on
            // iOS Safari 13.3+
            if (!hasFocus && options.onCancel) {
                // wait for app switch transition to fully complete - only then is
                // 'visibilitychange' fired
                setTimeout(function() {
                    // if browser was not hidden, the deep link failed
                    if (!didHide) {
                        options.onCancel();
                    }
                }, 500);
            }
        }

        hasFocus = true;
    }

    // add/remove event listeners
    // `mode` can be "add" or "remove"
    function bindEvents(mode) {
        [
            [window, 'blur', onBlur],
            [document, 'visibilitychange', onVisibilityChange],
            [window, 'focus', onFocus],
        ].forEach(function(conf) {
            conf[0][mode + 'EventListener'](conf[1], conf[2]);
        });
    }

    // add event listeners
    bindEvents('add');

    // expose public API
    this.destroy = bindEvents.bind(null, 'remove');
    this.openURL = function(url) {
        setTimeout(function() {
            if(!hasFocus && options.onFail) {
                options.onFail();
            }
        }, 1000);

        window.location = url;

        setTimeout(function() {
            if(!window.location.href.includes(url) && options.onFail) {
                options.onFail();
            }
        }, 1000);
    };
}

/* usage */
/**
var url = 'fb://profile/240995729348595';
var badURL = 'lksadjgajsdhfaskd://slkdfs';

var linker = new DeepLinker({
    onFail: function() {
        console.log('browser failed to respond to the deep link');
    },
    onCancel: function() {
        console.log('dialog hidden or user returned to tab');
    },
    onReturn: function() {
        console.log('user returned to the page from the native app');
    },
});

linker.openURL(url);
**/
