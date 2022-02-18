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
        mergeMap(movie =>
            from(movie.genres).
                pipe(map(genre => {
                    return { genre: genre, title: movie.title, directors: movie.directors }
                }
                )
                )
        ),
        mergeMap(movie =>
            fromHttpRequest(`https://orels-moviedb.herokuapp.com/genres/${movie.genre}`
            ).
                pipe(map(genre => { return { directors: movie.directors, genre: genre.name, title: movie.title } }))
        ),
        filter(movie => movie.genre == "action"),

        mergeMap(movie => from(movie.directors).pipe(map(director => { return { director: director, title: movie.title } }))),
        groupBy(movie => movie.director),
        mergeMap(group => group.pipe(count(), map(cnt => [group.key, cnt]))),

        max((x, y) => x[1] > y[1] ? 1 : -1),
        mergeMap(([directorId, movieCnt]) =>
            fromHttpRequest(`https://orels-moviedb.herokuapp.com/directors/${directorId}`).
                pipe(map(director => { return { director: director.name, count: movieCnt } }))
        )).subscribe(console.log);

