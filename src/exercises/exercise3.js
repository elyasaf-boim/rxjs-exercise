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
    .pipe(
        mergeAll(),
        filter(director => director.name.toLowerCase()[0] === director.name.toLowerCase()[director.name.length - 1])
    )
    .subscribe(console.log);

