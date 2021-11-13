// ==/UserScript==
 
(function() {
    'use strict';
 
var ceilings = ""
var func = {
    webpack_inject: (w, e, get) => {
        ceilings = get("03f4982a")
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
Object.keys(ceilings).forEach(function(key) {
    if(ceilings[key].type === "building") {
    if (ceilings[key].imgs.length > 1) {
    if(ceilings[key].type == "container_05") return
    ceilings[key].imgs.forEach(img => {
     if (img.isCeiling) {
            img.sprite= "https://raw.githubusercontent.com/iBLiSSIN/archive/main/lock/2CD6754F-AE61-4C37-BF0D-131C8841060A.png"
         }
      })
   }
}
})
})();
