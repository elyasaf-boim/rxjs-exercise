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
        take(7),
        mergeMap(movie => fromHttpRequest(`https://orels-moviedb.herokuapp.com/ratings`).pipe(
            mergeAll(),
            filter(rating => rating.movie == movie.id),
            map(rating => {
                return { title: movie.title, score: rating.score }
            })
        )
        ),
        groupBy(movie => movie.title),
        mergeMap(group => zip(of(group.key), group.pipe(count()), group.pipe(reduce((acc, val) => acc + val.score, 0)))),
        map(movie => { return { title: movie[0], review: movie[2] / movie[1] } }),
        toArray(),
        map(movie => movie.sort((x, y) => x.review > y.review ? 1 : -1))
        //        map(movie => movie[0])
    ).subscribe(console.log);