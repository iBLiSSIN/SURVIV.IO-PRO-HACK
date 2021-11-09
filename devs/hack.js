// ==UserScript==
// @name         Survivio Ceulings Remover by VNBPM
// @namespace    https://github.com/iBLiSSIN
// @version      1.1
// @icon         https://raw.githubusercontent.com/iBLiSSIN/SurvivMods/main/icons/icon-v1.png
// @description  Testing
// @author       VNBPM on YT
// @match        *://surviv.io/*
// @match        *://surviv2.io/*
// @match        *://2dbattleroyale.com/*
// @match        *://2dbattleroyale.org/*
// @match        *://piearesquared.info/*
// @match        *://thecircleisclosing.com/*
// @match        *://archimedesofsyracuse.info/*
// @match        *://secantsecant.com/*
// @match        *://parmainitiative.com/*
// @match        *://nevelskoygroup.com/*
// @match        *://kugahi.com/*
// @match        *://chandlertallowmd.com/*
// @match        *://ot38.club/*
// @match        *://kugaheavyindustry.com/*
// @match        *://drchandlertallow.com/*
// @match        *://rarepotato.com/*
// @grant        none
// Make buildings roofs transparent
Object.keys(get("03f4982a")).forEach(function(key) {

  if( get("03f4982a")[key].ceiling ) {
  if( get("03f4982a")[key].type == "container_05" ) return

    if( get("03f4982a")[key].ceiling.imgs ) {
      Object.keys(get("03f4982a")[key].ceiling.imgs).forEach( function(item) {
        get("03f4982a")[key].ceiling.imgs[item].alpha = 0.5;
      });
    }
  }
});
