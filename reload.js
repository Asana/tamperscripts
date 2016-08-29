// ==UserScript==
// @name         Reload when codez rebuilds
// @namespace    http://asana.com
// @version      0.1
// @description  Reload this page whenever codez goes from building to success.
// @author       Greg Sabo
// @match        https://localhost.asana.com:8180/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    var isBuilding = false;
    var interval;
    var notice;

    if (window.self !== window.top) {
        return;
    }

    function checkBuild() {
        var request = new XMLHttpRequest();
        request.open('GET', 'https://localhost:4443/codez', true);
        request.onload = function() {
            var wasBuilding = isBuilding;
            if (isBuilding && this.response === "Success") {
                console.log('refreshing');
                notice.textContent = "Reloading...";
                window.location.reload();
                clearInterval(interval);
            } else if (!isBuilding) {
                isBuilding = this.response !== "Success";
            }
            if (isBuilding && !wasBuilding) {
                notice = document.createElement('div');
                notice.classList.add('tampermonkey-reload-notice');
                notice.style = "position: absolute; background: yellow; color: black; top: 0; left: 0; padding: 20px; font-family: 'Input Mono'";
                notice.textContent = "Will reload soon...";
                document.body.appendChild(notice);
            }
        };
        request.send();
    }
    interval = setInterval(checkBuild, 1000);
})();
