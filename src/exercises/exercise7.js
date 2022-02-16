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
         take(200),
         mergeMap(movie => from(movie.genres).pipe(
                 mergeMap(genre => {
                     return fromHttpRequest(`https://orels-moviedb.herokuapp.com/genres/${genre}`)
                         .pipe(map(genre => genre.name))
                 }),

                 toArray(),
                 map(genres => {
                         return {"year": movie.year, "genres": genres}
                     }
                 )
             )
         ),
         filter(movie => movie.genres.includes('thriller')),
         groupBy(movie => movie.year),
         mergeMap(group => group.pipe(count(), map(movieCount => {
             return [group.key, movieCount]
         }))),
         max((x, y) => x[1] > y[1] ? 1 : -1)
     )
     .subscribe(console.log);
