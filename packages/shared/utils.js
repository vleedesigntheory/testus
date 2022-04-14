exports.extend = (to, _from) => Object.assign(to, _from);

exports.clone = obj => {
    if(obj===null){
        return null
    };
    if({}.toString.call(obj)==='[object Array]'){
        let newArr=[];
        newArr=obj.slice();
        return newArr;
    };
    let newObj={};
    for(let key in obj){
        if(typeof obj[key]!=='object'){
            newObj[key]=obj[key];
        }else{
            newObj[key]=clone(obj[key]);
        }
    }
    return newObj;
}