/*
*
* 图片上传组件
* @param {object} options 自定义配置
*
* */

!function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory)
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory()
    } else {
        root.Upper = factory()
    }
}(window, () => {
    let id = 0
    function ajax (autoConfig,file){
        const formData = new FormData()
        const xhr = new XMLHttpRequest()
        const {url,method,onProgress,header,withCredentials} = autoConfig
        const {name,type,blobInfo:{size},lastModifiedDate} = file
        const fileData = {name,type,size,lastModifiedDate}
        Object.keys(fileData).forEach(key=>formData.append(key,fileData[key]))
        if(withCredentials) xhr.withCredentials = true
        if(onProgress) {
            xhr.upload.addEventListener('progress',(event)=>{
                const percent = Math.ceil(event.loaded/event.total)*100
                onProgress(file,percent)
            })
        }
        return new Promise((resolve,reject) => {
            xhr.onreadystatechange = () => {
                if(xhr.status === 200 && xhr.readyState === 4) {
                    try {
                        const response = JSON.parse(xhr.responseText)
                        resolve(response)
                    } catch(error) {
                        reject(error)
                    }
                }
            }
            xhr.open({url,method})
            Object.keys(header).forEach(key=>{
                xhr.setRequestHeader(key,header[key])
            })
            xhr.send(formData)
        })
    }

    class Upper {

        constructor (options) {
            this.upperInput = options.upperInput
            this.autoUpload = options.autoUpload
            //最大上传尺寸限制
            this.maxSize = options.maxSize || 1024 * 1024 * 10
            //压缩限制,超过限制进行压缩
            this.maxCompressSize = options.maxCompressSize || 1024 * 30
            //最大同时上传数
            this.maxUploadSize = options.maxUploadSize || 3
            //文件信息
            this.fileList = []
            //压缩系数
            this.encoderOptions = null
            //文件处理完成回调
            this.onComplete = options.onComplete
            this.eachFileComplete = options.eachFileComplete
            this.reader = null
            this.count = 0
            //每一轮上传的图片个数
            this.currentCount = 0
            //当前待处理的图片
            this.currenList = []
            this.init()
        }

        init () {
            this.bind()
        }

        bind () {
            this.reader = new FileReader()
            this.reader.onload = this.onReadAsDataUrl.bind(this)
            this.upperInput.addEventListener('change', event => {
                const files = event.target.files
                this.currentCount = files.length
                if(this.currentCount === 0) return
                if(this.currentCount > 10) {
                    console.log('最多选择10张照片')
                    return
                }
                Array.prototype.forEach.call(files, (file,index) => {
                    if (!(/(^image\/jpe?g$)|(^image\/png$)|(^image\/gif$)/).test(file.type)) {
                        console.log('请选择正确格式的文件')
                    }  else if(file.size > this.maxSize) {
                        console.log(`请不要上传超过10M的图片(第${index+1}张)`)
                        this.currenList = []
                    } else {
                        const fileInfo = {}
                        //记录文件相关信息
                        fileInfo.file = file
                        fileInfo.type = file.type
                        fileInfo.size = file.size
                        fileInfo.name = file.name
                        fileInfo.lastModifiedDate = file.lastModifiedDate
                        fileInfo.isUpload = false
                        fileInfo.id = id++
                        this.currenList.push(fileInfo)
                    }
                })
                //把文件转换成base64进行处理
                this.reader.readAsDataURL(this.currenList[this.count].file)
            })
        }

        //reader回调
        onReadAsDataUrl (event) {
            //base64格式文件
            const result = event.target.result
            //判断是否进行压缩
            if (this.currenList[this.count].size > this.maxCompressSize) {
                this.compressImage(result).then(compressBase64 => this.base64ToBlob(compressBase64, this.count)).then(blobInfo => {
                    console.log('压缩了')
                    //blobInfo包含了文件的blob、blobURL
                    this.currenList[this.count].blobInfo = blobInfo
                    this.eachFileComplete && this.eachFileComplete(this.currenList[this.count])
                    //多个文件计数
                    this.count++
                    this.isEnd()
                }).catch(() => {})
            } else {
                this.base64ToBlob(result, this.count).then(blobInfo => {
                    console.log('没压缩')
                    this.currenList[this.count].blobInfo = blobInfo
                    this.eachFileComplete && this.eachFileComplete(this.currenList[this.count])
                    this.count++
                    this.isEnd()
                }).catch(() => {})
            }
        }

        //图片压缩
        compressImage (base64) {
            const encoderOptions = this.encoderOptions || 0.5
            return new Promise((resolve, reject) => {
                const image = new Image()
                image.onload = () => {
                    const canvas = document.createElement('canvas')
                    const ctx = canvas.getContext('2d')
                    let compressBase64 = ''
                    canvas.width = image.width
                    canvas.height = image.height
                    ctx.drawImage(image, 0, 0, image.width, image.height)
                    //png格式图片压缩无效
                    if (/^image\/jpe?g$/.test(this.currenList[this.count].type)) {
                        compressBase64 = canvas.toDataURL('image/jpeg', encoderOptions)
                    } else {
                        compressBase64 = base64
                    }
                    resolve(compressBase64)
                }
                image.src = base64
            })
        }

        //base64转blob
        base64ToBlob (base64, index) {
            //解码base64
            const decodedData = window.atob(base64.split(',')[1])
            const arrayBuffer = new ArrayBuffer(decodedData.length)
            const uint8 = new Uint8Array(arrayBuffer)
            const URL = window.URL || window.webkitURL || window.mozURL
            let blob = null
            let blobURL = null
            return new Promise((resolve, reject) => {
                for (let i = 0; i < decodedData.length; i++) {
                    uint8[i] = decodedData.charCodeAt(i)
                }
                try {
                    blob = new Blob([uint8], {type: this.currenList[index].type})
                    blobURL = URL.createObjectURL(blob)
                    let blobInfo = {blob, blobURL}
                    resolve(blobInfo)
                } catch (error) {
                    //兼容处理
                    console.log(error)
                    window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder
                    if (error.name === 'TypeError' && window.BlobBuilder) {
                        const builder = new BlobBuilder()
                        builder.append(uint8)
                        blob = builder.getBolb(this.fileInfo.type)
                        blobURL = URL.createObjectURL(blob)
                        let blobInfo = {blob, blobURL}
                        resolve(blobInfo)
                    } else {
                        console.log('不支持图片上传')
                        reject()
                    }
                }
            })
        }

        //检查文件是否处理完毕
        isEnd () {
            if (this.count === this.currentCount) {
                console.log('结束')
                this.fileList = [...this.fileList,...this.currenList]
                this.count = 0
                this.currentCount = 0
                this.currenList = []
                this.upperInput.value = ''
                if(this.auto) this.upload()
                this.onComplete && this.onComplete.call(this, this.fileList)
            } else {
                this.reader.readAsDataURL(this.currenList[this.count].file)
            }
        }

        //上传文件
        async upload () {
            //待上传的文件队列
            const uploadQueue = this.fileList.filter(file=>!file.isUpload)
            if(uploadQueue.length === 0) {

            }
        }




    }

    return Upper
})