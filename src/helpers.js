define(['Chance'], function (Chance) {

    'use strict';

    return {

        chance: new Chance(),

        clamp: function (n, min, max) {
            n = n > max ? max : n;
            return n < min ? min : n;
        },

        random: function (min, max) {
            return Math.floor((Math.random() * max) + min);
        },

        splitEvery: function (str, n) {
            return str.match(new RegExp('.{1,' + 2 + '}', 'g'));
        },

        flatten: function (arr) {
            return arr.reduce(function (p, c) {
                return p.concat(c);
            });
        },

        shuffle: function (a) {
            var j, x, i;
            for (i = a.length; i; i--) {
                j = Math.floor(Math.random() * i);
                x = a[i - 1];
                a[i - 1] = a[j];
                a[j] = x;
            }
        },

        setInterval: function (callback, delay) {
            var dateNow = Date.now,
                requestAnimation = window.requestAnimationFrame,
                start = dateNow(),
                stop,
                intervalFunc = function () {
                    dateNow() - start < delay || (start += delay, callback());
                    stop || requestAnimation(intervalFunc)
                }
            requestAnimation(intervalFunc);
            return {
                clear: function () { stop = 1 }
            }
        }

    }

});