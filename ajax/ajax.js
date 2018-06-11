//默认配置
const DEFAULT_REQUEST_CONFIG = {
    method: 'GET',
    url: '',
    header: {},
    data: {},
    dataType: 'json',
}


export default function ajax (options) {
    const opts = Object.assign({}, DEFAULT_REQUEST_CONFIG, options)
    const xhr = new XMLHttpRequest()
    return new Promise((resolve, reject) => {
        xhr.onreadystatechange  = () => {
            if(xhr.readyState === 4 && xhr.status === 200) {
                try {
                    const response = JSON.parse(xhr.responseText)
                    resolve(response)
                } catch (error) {

                }
            } else {
                reject()
            }
        }
        if(opts.withCredentials) xhr.withCredentials = true
        if(opts.onUpload) xhr.upload = opts.onUpload
        //初始化一个请求
        xhr.open({
            url:opts.url,
            method:opts.method,
        })
        //设置请求头
        Object.keys(opts.header).forEach(key=>{
            xhr.setRequestHeader(key,opts.header[key])
        })
        //发送请求
        xhr.send({...opts.data})
    })
}