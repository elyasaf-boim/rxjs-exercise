const { fromHttpRequest } = require('../utils/http');
const {
    take,
    mergeAll,
    takeLast,
    filter,
    map,
    flatMap,
    mergeMap,
    count,
    toArray,
    groupBy,
    max,
    min,
    reduce
} = require("rxjs/operators");
const { from, concat, pipe, zip, of } = require("rxjs");

fromHttpRequest('https://orels-moviedb.herokuapp.com/directors')
    .pipe(mergeAll(), take(1))
    .subscribe(console.log);
