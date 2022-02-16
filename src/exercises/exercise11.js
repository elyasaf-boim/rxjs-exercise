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
        take(100),
        mergeMap(movie =>  fromHttpRequest(`https://orels-moviedb.herokuapp.com/ratings`).pipe(
                    mergeAll(),
                    filter(rating => rating.movie == movie.id),
                    map(rating => {
                        return {title: movie.title, score: rating.score}
                    } )
                 )
        ),
        groupBy(movie => movie.title),
        mergeMap(group => zip(of(group.key)  , group.pipe(count(movie => movie.score > 2))  , group.pipe(count()))),
        filter(movie => movie[1] / movie[2] > 0.7),
        map(movie => movie[0])
    ).subscribe(console.log);
