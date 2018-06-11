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

    class Upper {
        constructor (options) {
            this.upperInput = options.upperInput
            //压缩限制,超过限制进行压缩
            this.maxSize = options.maxSize || 1024 * 30
            //文件信息
            this.fileInfoes = []
            //压缩系数
            this.encoderOptions = null
            //文件处理完成回调
            this.onComplete = options.onComplete
            //文件数
            this.fileLength = 0
            this.reader = null
            this.count = 0
            this.init()
        }

        init () {
            this.bind()
        }

        bind () {
            this.reader = new FileReader()
            this.reader.onload = this.onReadAsDataUrl.bind(this)
            this.upperInput.addEventListener('change', (event) => {
                const files = event.target.files
                this.fileLength = files.length
                //把文件转换成base64进行处理
                Array.prototype.forEach.call(files, file => {
                    if (!(/(^image\/jpe?g$)|(^image\/png$)|(^image\/gif$)/).test(file.type)) {
                        console.log('请选择正确格式的文件')
                        return
                    }
                    const fileInfo = {}
                    //记录文件相关信息
                    fileInfo.file = file
                    fileInfo.type = file.type
                    fileInfo.size = file.size
                    fileInfo.name = file.name
                    fileInfo.lastModifiedDate = file.lastModifiedDate
                    this.fileInfoes.push(fileInfo)
                })
                console.log(this)
                this.reader.readAsDataURL(this.fileInfoes[this.count].file)
            })
        }

        onReadAsDataUrl (event) {
            //base64格式文件
            const result = event.target.result
            //判断是否进行压缩
            console.log(this.fileInfoes[this.count])
            if (this.fileInfoes[this.count].size > this.maxSize) {
                this.compressImage(result).then(compressBase64 => this.toBlob(compressBase64, this.count)).then(blobInfo => {
                    console.log('压缩了')
                    //blobInfo包含了文件的blob、blobURL
                    this.fileInfoes[this.count].blobInfo = blobInfo
                    //多个文件计数
                    this.count++
                    this.isEnd()
                }).catch(() => {})
            } else {
                this.toBlob(result, this.count).then(blobInfo => {
                    console.log('没压缩')
                    this.fileInfoes[this.count].blobInfo = blobInfo
                    this.count++
                    this.isEnd()
                }).catch(() => {})
            }
        }

        compressImage (base64) {
            const encoderOptions = this.encoderOptions || 0.5
            return new Promise((resolve, reject) => {
                const image = new Image()
                image.onload = () => {
                    const canvas = document.createElement('canvas')
                    const ctx = canvas.getContext('2d')
                    const IMG_WIDTH = image.width
                    const IMG_HEIGHT = image.height
                    let compressBase64 = ''
                    canvas.width = IMG_WIDTH
                    canvas.height = IMG_HEIGHT
                    ctx.drawImage(image, 0, 0, IMG_WIDTH, IMG_HEIGHT)
                    compressBase64 = canvas.toDataURL('image/jpg', encoderOptions)
                    resolve(compressBase64)
                }
                image.src = base64
            })
        }

        toBlob (base64, index) {
            //解码base64
            const decodedData = window.atob(base64.split(',')[1])
            const arrayBuffer = new ArrayBuffer(decodedData.length)
            const uint8 = new Uint8Array(arrayBuffer)
            const URL = window.URL || window.webkitURL || window.mozURL
            let blob = '', blobURL = ''
            return new Promise((resolve, reject) => {
                for (let i = 0; i < decodedData.length; i++) {
                    uint8[i] = decodedData.charCodeAt(i)
                }
                try {
                    blob = new Blob([uint8], {type: this.fileInfoes[index].type})
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
            if (this.count === this.length) {
                console.log('结束')
                this.count  = 0
                this.onComplete && this.onComplete.call(this, this.fileInfoes)
            } else {
                this.reader.readAsDataURL(this.fileInfoes[this.count].file)
            }
        }

    }

    return Upper
})