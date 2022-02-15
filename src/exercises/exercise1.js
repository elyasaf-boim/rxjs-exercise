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
    max
} = require("rxjs/operators");
const {from, concat, pipe} = require("rxjs");

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