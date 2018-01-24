const assert = require('assert')
const _o = require('../array-lib.js')

function testMap(item,index){
    return Math.pow(item,2)
}

console.log(_o.reduce([1,2,3,4]))