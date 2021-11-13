// ==/UserScript==
 
(function() {
    'use strict';
 
var roofs = ""
var func = {
    webpack_inject: (w, e, get) => {
        roofs = get("03f4982a")
    },
};
 
if(typeof window.webpackJsonp === 'function') {
    window.webpackJsonp([0], func, ["webpack_inject"]);
} else {
    window.webpackJsonp.push([
        ["webpack_inject"],
        func,
        [["webpack_inject"]]
    ]);
}
Object.keys(roofs).forEach(function(obj) {
    if(roofs[obj].type === "building") {
    if (roofs[obj].imgs.length > 1) {
    if(roofs[obj].type == "container_05") return
    roofs[obj].imgs.forEach(img => {
     if (img.isCeiling) {
            img.sprite= "https://raw.githubusercontent.com/iBLiSSIN/archive/main/lock/2CD6754F-AE61-4C37-BF0D-131C8841060A.png"
         }
      })
   }
}
})
})();
