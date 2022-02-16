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
        // take(10),
        mergeMap(movie =>
            from(movie.directors).pipe(
                mergeMap(director => fromHttpRequest(`https://orels-moviedb.herokuapp.com/directors/${director}`).pipe(
                        map(director => director.name),
                        toArray(),
                        map(directors => {
                            return {year: movie.year, directors: directors, movie: movie.title}
                        })
                    )
                )
            )
        ),
        filter(movie => movie.directors.includes("Quentin Tarantino")),
        toArray(),
        map(movies => movies.sort((x,y) => x.year > y.year ? 1:-1)),
        flatMap(movie => movie),
        takeLast(5)
    ).subscribe(console.log);
