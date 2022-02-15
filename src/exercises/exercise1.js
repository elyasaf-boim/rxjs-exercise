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
    min
} = require("rxjs/operators");
const {from, concat, pipe,zip , of} = require("rxjs");

// fromHttpRequest('https://orels-moviedb.herokuapp.com/directors')
//     .pipe(mergeAll(), take(1))
//     .subscribe(console.log);
//
// fromHttpRequest('https://orels-moviedb.herokuapp.com/directors')
//     .pipe(mergeAll(), takeLast(1))
//     .subscribe(console.log);
//
// fromHttpRequest('https://orels-moviedb.herokuapp.com/directors')
//     .pipe(
//         mergeAll(),
//         filter(director => director.name.toLowerCase()[0] === director.name.toLowerCase()[director.name.length-1] )
//     )
//     .subscribe(console.log);


// fromHttpRequest('https://orels-moviedb.herokuapp.com/movies')
//     .pipe(
//         mergeAll(),
//         count()
//     )
//     .subscribe(console.log);

// fromHttpRequest('https://orels-moviedb.herokuapp.com/movies')
//     .pipe(
//         mergeAll(),
//         filter(movie => movie.id % 3 === 0 )
//     )
//     .subscribe(console.log);
//
// fromHttpRequest('https://orels-moviedb.herokuapp.com/movies')
//     .pipe(
//         mergeAll(),
//         filter(movie => movie.year < 1990),
//         filter(movie => movie.directors.length > 1),
//         map(movie => movie.title)
//     )
//     .subscribe(console.log);

// ex 7
// fromHttpRequest('https://orels-moviedb.herokuapp.com/movies')
//     .pipe(
//         mergeAll(),
//         take(200),
//         mergeMap(movie => from(movie.genres).pipe(
//                 mergeMap(genre => {
//                     return fromHttpRequest(`https://orels-moviedb.herokuapp.com/genres/${genre}`)
//                         .pipe(map(genre => genre.name))
//                 }),
//
//                 toArray(),
//                 map(genres => {
//                         return {"year": movie.year, "genres": genres}
//                     }
//                 )
//             )
//         ),
//         filter(movie => movie.genres.includes('thriller')),
//         groupBy(movie => movie.year),
//         mergeMap(group => group.pipe(count(), map(movieCount => {
//             return [group.key, movieCount]
//         }))),
//         max((x, y) => x[1] > y[1] ? 1 : -1)
//     )
//     .subscribe(console.log);

// concat(
//     fromHttpRequest('https://orels-moviedb.herokuapp.com/movies')
//         .pipe(
//             mergeAll(),
//             map(movie => movie.title)
//         ),
//     fromHttpRequest('https://orels-moviedb.herokuapp.com/directors')
//         .pipe(
//             mergeAll(),
//             map(director => director.name)
//         ),
//
//     fromHttpRequest('https://orels-moviedb.herokuapp.com/genres')
//         .pipe(
//             mergeAll(),
//             map(genres => genres.name)
//         ),
// ).subscribe(console.log);

// fromHttpRequest('https://orels-moviedb.herokuapp.com/movies')
//     .pipe(
//         mergeAll(),
//         take(5),
//         groupBy(movie => movie.year),
//         mergeMap(group => group.pipe(count() , map(movieCount => [group.key , movieCount])))
//     )
//     .subscribe(console.log);

//
//fromHttpRequest('https://orels-moviedb.herokuapp.com/movies')
//    .pipe(
//        mergeAll(),
//        // take(10),
//        mergeMap(movie =>
//            from(movie.directors).pipe(
//                mergeMap(director => fromHttpRequest(`https://orels-moviedb.herokuapp.com/directors/${director}`).pipe(
//                        map(director => director.name),
//                        toArray(),
//                        map(directors => {
//                            return {year: movie.year, directors: directors, movie: movie.title}
//                        })
//                    )
//                )
//            )
//        ),
//        filter(movie => movie.directors.includes("Quentin Tarantino")),
//        toArray(),
//        map(movies => movies.sort((x,y) => x.year > y.year ? 1:-1)),
//        flatMap(movie => movie),
//        takeLast(5)
//    ).subscribe(console.log);




// fromHttpRequest('https://orels-moviedb.herokuapp.com/movies')
//    .pipe(
//        mergeAll(),
//        take(100),
//        mergeMap(movie =>  fromHttpRequest(`https://orels-moviedb.herokuapp.com/ratings`).pipe(
//                    mergeAll(),
//                    filter(rating => rating.movie == movie.id),
//                    map(rating => {
//                        return {title: movie.title, score: rating.score}
//                    } )
//                 )
//        ),
//        groupBy(movie => movie.title),
//        mergeMap(group => zip(of(group.key)  , group.pipe(count(movie => movie.score > 2))  , group.pipe(count()))),
//        filter(movie => movie[1] / movie[2] > 0.7),
//        map(movie => movie[0])
//    ).subscribe(console.log);

// fromHttpRequest('https://orels-moviedb.herokuapp.com/movies')
//    .pipe(
//        mergeAll(),
//        mergeMap( movie =>  from(movie.genres).pipe(map(genre => {return {genre: genre, title: movie.title}})) ),
//        groupBy(movie => movie.genre),
//        mergeMap( group => group.pipe(count() , map(cnt => [group.key , cnt]))),
//        min((x, y) => x[1] > y[1] ? 1 : -1),
//        mergeMap( ([genreId , movieCnt]) =>
//            fromHttpRequest(`https://orels-moviedb.herokuapp.com/genres/${genreId}`).
//            pipe(map(genre => {return {genre: genre.name , count: movieCnt}}))
//        )
//
//    ).subscribe(console.log);

 fromHttpRequest('https://orels-moviedb.herokuapp.com/movies')
    .pipe(
        mergeAll(),
        mergeMap( movie =>
                    from(movie.genres).
                    pipe(map(genre=>
                                {
                                return {genre: genre, title: movie.title , directors: movie.directors}
                                 }
                             )
                         )
                 ),
         mergeMap( movie  =>
            fromHttpRequest(`https://orels-moviedb.herokuapp.com/genres/${movie.genre}`
            ).
                pipe(map(genre => {return {directors: movie.directors, genre: genre.name , title: movie.title}}))
            ),
        filter(movie => movie.genre == "action"),

        mergeMap( movie =>  from(movie.directors).pipe(map(director => {return {director: director, title: movie.title}})) ),
        groupBy(movie => movie.director),
        mergeMap( group => group.pipe(count() , map(cnt => [group.key , cnt]))),

        max((x, y) => x[1] > y[1] ? 1 : -1),
        mergeMap( ([directorId , movieCnt]) =>
            fromHttpRequest(`https://orels-moviedb.herokuapp.com/directors/${directorId}`).
            pipe(map(director => {return {director: director.name , count: movieCnt}}))
        )  ).subscribe(console.log);


