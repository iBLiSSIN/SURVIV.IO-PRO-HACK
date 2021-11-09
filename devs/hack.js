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
// New Cursor
document.getElementById("game-area-wrapper").style.cursor = 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAQAAADZc7J/AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JQAAgIMAAPn/AACA6QAAdTAAAOpgAAA6mAAAF2+SX8VGAAAAAmJLR0QA/4ePzL8AAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfiDBAFFDub31YtAAACvUlEQVRIx7WVz0tUURTHP3d6poI2j3CpaYsWQVPRIk2KWg24iGAEw3JWbZtFIP4P/QdiroNcTO2CFJwoxH4wuKtF4JhhqUOvcHDmvXPfOy0kG803Y1Rn9bj3nO/lne/3fA80jkkmGyc4DW8NxwGDxqcciS11OcUFrnOMNdoJ8OMSf48WLpDhmtPX0VlthXa/smVLFMhTRGgap5lq2TwbjstjKQZpSUsxeCzjcjZs2WSK042LE2R4fyac9jetRqpRNGyHbRSparRpp/0zIe/JkIgvv+OUs0FJVFUlWpHZoN/229lgxUqoqlqSbOCUuRMHMeyU7/kVqyphoXZbeqXNM1VTbfN6ZUwKNQlVK/ae75QZPvjf32WDLavq2YlaskqBuwzwlKcMcJdCsjpR86zqls0GvPu9Fw5TKbssqp7NBonP5EgChkc8wgBJconP2cCzqsuSskztV9CAs/HAV7XhRM2scWP3fJTR3e8bZm2iZkPVB76zwcBegPvnwg2rOl9zt8nFspRzq/O+6oY9F3K//sJlcVw0suGYMI8bC+AyPyY21GhcWNzJ2yGkxzk5COZT9ALyfNstMHTRVafWb+Rf8inCDOKcpGcHwADdHZ19Ch90vcKbuhdHmGOOkbqTt18qHxT66OikGzCGSVx6WvuvRkk+mteiBSo84SHQxbOR8zCzRJoyMEqGDnP14tETfNfnCf8Vq3ixsjx8GGDI3S4GqnNBm7eHnpssscTNupNLbd5coFoUd5shdqc55aznRbUkvbKHxP1NhFyflKxqXpx1Ur9YWLXLC6DdiSuQqaNRKVOu8yOXzGW6DbqAXWb1HwopXsq3Divlvx6mpuPsNhlnaGYofjND2W9p4Yr9U0v7a1P92Ytfti5pSUtRGtn6f1gsP4FdUgyxwAJDpHAPfOoQMDPMNC5tvJ2Vr9BoN8MPZ/EGbt3AhqYAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTgtMTItMTZUMDU6MjA6NTktMDU6MDB/YrSVAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE4LTEyLTE2VDA1OjIwOjU5LTA1OjAwDj8MKQAAAABJRU5ErkJggg==) 16 16, auto';
