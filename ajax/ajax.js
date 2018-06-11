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
                const response = JSON.parse(xhr.responseText)
                resolve(response)
            }
        }





    })
}