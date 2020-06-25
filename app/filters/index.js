import Vue from "nativescript-vue";

import moment from 'moment';
moment.locale('fr');

Vue.filter('date', function (value) {
    return moment(value).format('ddd D MMMM')
})

Vue.filter('datetime', function (value, format) {
    if( format === undefined ) format = 'YYYY-MM-DD HH:mm'
    return moment(value).format(format)
})

Vue.filter('time', function (value) {
    return moment(value).format('HH[h]mm')
})

Vue.filter('position', function(pos) {
    if(isNaN(pos) || !pos) return '-'

    if(pos==1) return '1er';
    return pos + 'ème';
})

Vue.filter('price', function (amount, decimalCount = 2, decimal = ".", thousands = ",") {
    if (isNaN(amount) || amount === null) return '-';

    try {
        decimalCount = Math.abs(decimalCount);
        decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

        const negativeSign = amount < 0 ? "-" : "";

        let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
        let j = (i.length > 3) ? i.length % 3 : 0;

        return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "") + ' €';
    } catch (e) {
        console.log(e)
    }
})

Vue.filter('odds', function(odds, prefix) {
    if (isNaN(odds) || odds === null) return '-';
    return (prefix ? prefix : '') + odds.toFixed(1);
})

Vue.filter('distance', function (value) {
    if (isNaN(value) || value === null) return '-';
    return value.toFixed(0) + ' m';
})