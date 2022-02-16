const {fromHttpRequest} = require('../utils/http');
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
const {from, concat, pipe, zip , of} = require("rxjs");


 fromHttpRequest('https://orels-moviedb.herokuapp.com/movies')
     .pipe(
         mergeAll(),
         filter(movie => movie.year < 1990),
         filter(movie => movie.directors.length > 1),
         map(movie => movie.title)
     )
     .subscribe(console.log);






















