exports.compose = (...args) => args.reduce((prev,current) => (...values) => prev(current(...values)));

exports.curry = ( fn,arr=[] ) => (...args) => (
    arg=>arg.length===fn.length
        ? fn(...arg)
        : curry(fn,arg)
)([...arr,...args]);

// exports.generator = *(args) => {
//     for( let i=0; i < args.length; i++ ) {
//         yield args[i];
//     }
// }

