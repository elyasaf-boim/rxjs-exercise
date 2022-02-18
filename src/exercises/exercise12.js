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

fromHttpRequest('https://orels-moviedb.herokuapp.com/movies')
    .pipe(
        mergeAll(),
        mergeMap(movie => from(movie.genres).pipe(map(genre => { return { genre: genre, title: movie.title } }))),
        groupBy(movie => movie.genre),
        mergeMap(group => group.pipe(count(), map(cnt => [group.key, cnt]))),
        min((x, y) => x[1] > y[1] ? 1 : -1),
        mergeMap(([genreId, movieCnt]) =>
            fromHttpRequest(`https://orels-moviedb.herokuapp.com/genres/${genreId}`).
                pipe(map(genre => { return { genre: genre.name, count: movieCnt } }))
        )

    ).subscribe(console.log);
