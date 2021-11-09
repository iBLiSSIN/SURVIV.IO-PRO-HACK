// ==/UserScript==
 
(function() {
    'use strict';
 
var ceilings = ""
 
// Some important shit for this whole thing to work
 
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
 
// do the magic
 
Object.keys(ceilings).forEach(function(key) {
    if(ceilings[key].type === "building") {
        for(var ceilImg in ceilings[key].ceiling.imgs) {
            ceilings[key].ceiling.imgs[ceilImg].sprite = ""
        }
    }
})
})();
