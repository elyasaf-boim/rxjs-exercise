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

 concat(
     fromHttpRequest('https://orels-moviedb.herokuapp.com/movies')
         .pipe(
             mergeAll(),
             map(movie => movie.title)
         ),
     fromHttpRequest('https://orels-moviedb.herokuapp.com/directors')
         .pipe(
             mergeAll(),
             map(director => director.name)
         ),

     fromHttpRequest('https://orels-moviedb.herokuapp.com/genres')
         .pipe(
             mergeAll(),
             map(genres => genres.name)
         ),
 ).subscribe(console.log);

