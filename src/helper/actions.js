var iOS = {
    goBack: function(params) {
        return window.webkit.messageHandlers.goBack.postMessage(params);
    },
    openVideoRoom: function(params) {
        return window.webkit.messageHandlers.openVideoRoom.postMessage(params);
    }
};

var Android = {
    goBack: function(params) {
        return window.__fyndKit.goBack(JSON.stringify(params));
    },
    openVideoRoom: function(params) {
        return window.__fyndKit.openVideoRoom(JSON.stringify(params));
    }
};

function executeFunction(fnName, params = {}) {
    if (window.webkit) {
        // iOS
        return iOS[fnName](params);
    } else if (window.__fyndKit) {
        // Android
        return Android[fnName](params);
    }
}

function openVideoRoom(uniqueName) {
    executeFunction('openVideoRoom', {
        room_id: uniqueName
    });
}

function goBack() {
    executeFunction('goBack');
}

export { openVideoRoom, goBack };
