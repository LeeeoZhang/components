let _o = {
    each (obj,fn,context) {
        for(let i = 0;i<obj.length;i++) {
            fn && fn.call(context,obj[i],i)
        }
    },

    map (obj,fn,context) {
        if(!fn) return []
        let result = []
        _o.each(obj,function(item,index){
            result.push(fn.call(context,item,index))
        })
        return result
    },

    reduce (obj,fn,memo,context) {
        let result = (memo ? memo : 0)
        _o.each(obj,function(item,index){
            result += (fn ? fn.call(context,item,index):item)
        })
        return result
    }
}

module.exports = _o