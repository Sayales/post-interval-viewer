// ==UserScript==
// @name time-shower
// @description User script for color timeplates
// @author Opokin Pavel
// @license MIT
// @version 0.1
// @include https://2ch.hk/*
// ==/UserScript==
(function () {
    main();
    var prevHeight;

    function main() {
        //Below is the userscript code itself
        var domReady = function (callback) {
            document.readyState === "interactive" || document.readyState === "complete" ? callback() : document.addEventListener("DOMContentLoaded", callback);
        };
        domReady(function () {
            //main logic
            var threads = document.getElementsByClassName('thread');
            for (var k = 0; k < threads.length; k++) {
                var posts = threads[k].getElementsByClassName('post-wrapper');
                for (var i = 0; i < posts.length - 1; i++) {
                    var currPost = posts[i];
                    var nextPost = posts[i + 1];
                    var elem = elemCreate(currPost.getElementsByClassName('posttime')[0].innerText,
                        nextPost.getElementsByClassName('posttime')[0].innerText);
                    if (currPost.getElementsByClassName("time-shower-div").length < 1) // чтобы не множились при обновлении страницы
                        currPost.appendChild(elem);
                }
            }
        });
        prevHeight = document.body.offsetHeight;
    }

    window.onscroll = function (ev) { //лютый костыль для бесконечной прокрутки
        if (document.body.offsetHeight > prevHeight) {
            main();
        }
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
            prevHeight = document.body.offsetHeight
        }
    };
    function elemCreate(dateCurr, dateNext) { //Создаём плашку между постами
        var dateDifference = dateDiff(dateCurr, dateNext);
        var getElemColor = function (interval) {
            if (interval < 60000)
                return "#4CC417";
            if (interval >= 60000 && interval < 300000)
                return "#B1FB17";
            if (interval >= 300000 && interval < 600000)
                return "#FFFF00";
            if (interval >= 600000 && interval < 1800000)
                return "#F88017";
            if (interval > 1800000)
                return "#FF0000";
        };
        var getElemLength = function (interval) {
            if (interval < 60000)
                return interval / 500; //120
            if (interval >= 60000 && interval < 300000)
                return interval / 3000 + 100; //200
            if (interval >= 300000 && interval < 600000)
                return interval / 8000 + 162.5; //  237.5
            if (interval >= 600000 && interval < 1800000)
                return interval / 15000 + 197.5; //317.5
            if (interval > 1800000)
                return (interval / 20000 + 227.5) <= 600 ? interval / 20000 + 227.5 : 600;
        };
        var elem = document.createElement("div");
        elem.style.backgroundColor = getElemColor(dateDifference);
        elem.style.height = "5px";
        elem.style.width = getElemLength(dateDifference) + "px";//"300px";;
        elem.style.borderRadius = "10px 10px 10px 10px";
        elem.setAttribute('class', 'time-shower-div');
        return elem;
    }

    function dateParse(dateDvachFormat) {
        var tokens = dateDvachFormat.split(" ");
        var tokensDay = tokens[0].split("/");
        var tokensTime = tokens[2].trim().split(":");
        var year = "20" + tokensDay[2];
        return new Date(year, tokensDay[1] - 1, tokensDay[0], tokensTime[0], tokensTime[1], tokensTime[2]);
    }

    function dateDiff(currDate, nextDate) {
        var currDateParsed = dateParse(currDate);
        var nextDateParsed = dateParse(nextDate);
        return nextDateParsed - currDateParsed;
    }

    function getBaseLog(x, y) {
        return Math.log(y) / Math.log(x);
    }
}).call(this);
