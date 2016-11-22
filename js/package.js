var $ = function (elem) {
    return document.querySelector(elem);
};
var $$ = function (elem) {
    return document.querySelectorAll(elem);
};


var EventUtil = {

    addEvent : function (elem, event, fn) {
        if (elem.addEventListener) {
            elem.addEventListener(event, fn, false);
        } else if (elem.attachEvent) {
            elem.attachEvent('on' +　event, fn);
        } else {
            elem['on' + event] = fn;
        }
    },

    removeEvent : function (elem, event, fn) {
        if (elem.removeEventListener) {
            elem.removeEventListener(event, fn, false);
        } else if (elem.detachEvent) {
            elem.detachEvent('on' + event ,fn);
        } else {
            elem['on' + event] = fn
        }
    },

    getEvent : function (event) {
        return event ? event : window.event;
    },

    preventDefault : function (event) {
        if (event.preventDefault) {
            event.preventDefault();
        } else {
            event.returnValue = false; 
        }
    }
}


var ajax = function (conf) {
    var method = conf.method;
    var url = conf.url;
    var success = conf.success;

    var xhr = new XMLHttpRequest();

    xhr.open(method, url, true);

    if (method == 'GET' || method == 'get') {
        xhr.send(null);
    } else if (method == 'POST' || method == 'post') {
        xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
        xhr.send(data);
    }

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            success(JSON.parse(xhr.responseText));
        }
    };
    
};
//事件委托
var delegateEvent = function (target, event, fn) {
    addEvent(document, event, function (elem) {
        if (elem.target.nodeName == target.toUpperCase()) {
            fn.call(elem.target);
        }
    })
};

function changeClassName(elem) {
    for (var i = elem.length - 1; i >= 0; i--) {
        elem[i].className = 'pc pages';
    }
}

function backToTop() {
    document.documentElement.scrollTop = document.body.scrollTop = 0;
}
