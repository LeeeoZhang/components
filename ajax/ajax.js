
//默认配置
const DEFAULT_REQUEST_CONFIG = {
    method:'GET',
    url:'',
    header:{

    },
    dataType:'json',
}





export default function ajax(options) {
    const opts = Object.assign({},DEFAULT_REQUEST_CONFIG,options)
}