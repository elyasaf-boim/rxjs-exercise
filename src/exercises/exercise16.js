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
                    mergeMap(rating => from(movie.directors).pipe(
                            map(director => {
                                return {title: movie.title, score: rating.score, director: director}
                            }
                            )

                        )


                    )
                 )
        ),
         groupBy(movie => movie.director),
        mergeMap(group => zip(of(group.key) , group.pipe(count()) ,group.pipe(reduce((acc, val) => acc + val.score,0)))),
        map(tuple => { return {director: tuple[0] , review: tuple[2] / tuple[1] }}),
        mergeMap( director_review =>
            fromHttpRequest(`https://orels-moviedb.herokuapp.com/directors/${director_review.director}`).
            pipe(map(director => {return {director: director.name , avgReview: director_review.review}})) ),
        max( (x,y) => x[1] > y[1] ? 1 : -1)
                 ).subscribe(console.log);