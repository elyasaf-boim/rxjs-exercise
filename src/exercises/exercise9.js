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
         take(5),
         groupBy(movie => movie.year),
         mergeMap(group => group.pipe(count() , map(movieCount => [group.key , movieCount])))
     )
     .subscribe(console.log);
