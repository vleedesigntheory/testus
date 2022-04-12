

exports.extend = (to, _from) => {
    for( let key in _from ) {
        to[key] = _from[key];
    }
    return to;
}