const { fromHttpRequest } = require('../utils/http');
const {
    take,
    mergeAll,
    filter,
    map,
    mergeMap,
    count,
    toArray,
    groupBy
} = require("rxjs/operators");
const { from, concat, pipe, zip, of } = require("rxjs");

fromHttpRequest('https://orels-moviedb.herokuapp.com/directors')
    .pipe(
        mergeAll(),
        take(2),
        mergeMap(director => fromHttpRequest(`https://orels-moviedb.herokuapp.com/genres`
        ).pipe(
            mergeAll(),
            mergeMap(genre => fromHttpRequest(`https://orels-moviedb.herokuapp.com/movies`
            ).
                pipe(
                    mergeAll(),
                    filter(movie => movie.directors.includes(director.id) && movie.genres.includes(genre.id)),
                    count(),
                    map(cnt => { return { director: director.id, genre: genre.id, count: cnt } }))
            )
        )
        ),
        mergeMap(obj =>
            fromHttpRequest(`https://orels-moviedb.herokuapp.com/genres/${obj.genre}`
            ).pipe(
                mergeMap(genre => fromHttpRequest(`https://orels-moviedb.herokuapp.com/directors/${obj.director}`
                ).pipe(map(director => { return { director: director.name, genre: genre.name, count: obj.count } }))
                )
            )
        ),
        groupBy(obj => obj.director, obj => { return { genre: obj.genre, count: obj.count } }),
        mergeMap(group => zip(of(group.key), group.pipe(toArray())))
    ).subscribe(console.log);


