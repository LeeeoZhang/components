
/*
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
		constructor(options) {
			this.upperInput = options.upperInput
			//压缩限制,超过限制进行压缩
			this.maxSize = options.maxSize || 1024 * 30
			//文件信息
			this.fileInfoes = []
			//压缩系数
			this.encoderOptions = null
			this.init()
		}

		init() {
			this.bind()
		}

		bind() {
			this.upperInput.addEventListener('change', (event) => {
				const files = event.target.files
				const reader = new FileReader()
				let count = 0,fileLength = files.length
                //把文件转换成base64进行处理
                reader.onload =  (event) => {
                    //base64格式文件
                    const result = event.target.result
                    //判断是否进行压缩
                    if (this.fileInfoes[count].size > this.maxSize) {
                        this.compressImage(result).then(compressBase64 => this.toBlob(compressBase64,count)).then(blobInfo => {
                            console.log('压缩了')
                            //blobInfo包含了文件的blob、blobURL以及其他信息
                            this.fileInfoes[count].blobInfo = blobInfo
							//多个文件计数
							count++
							//看是否还有文件
							this.isEnd(count,fileLength,reader)
                        }).catch(()=>{})
                    } else {
                        this.toBlob(result,count).then(blobInfo => {
                            console.log('没压缩')
                            this.fileInfoes[count].blobInfo = blobInfo
							count++
							this.isEnd(count,fileLength,reader)
                        }).catch(()=>{})
                    }
                }
				Array.prototype.forEach.call(files,(file)=>{
					if(!(/(^image\/jpe?g$)|(^image\/png$)/).test(file.type)) {
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
                reader.readAsDataURL(this.fileInfoes[count].file)
			})
		}

		compressImage(base64) {
			const encoderOptions = this.encoderOptions || 0.5
			return new Promise((resolve, reject) => {
				const image = new Image()
				image.onload =  () => {
					const canvas = document.createElement('canvas')
					const ctx = canvas.getContext('2d')
					const IMG_WIDTH = image.width
					const IMG_HEIGHT = image.height
					let compressBase64 = ''
					canvas.width = IMG_WIDTH
					canvas.height = IMG_HEIGHT
					ctx.drawImage(image, 0, 0, IMG_WIDTH, IMG_HEIGHT)
					compressBase64 = canvas.toDataURL('image/jpeg', encoderOptions)
					resolve(compressBase64)
				}
				image.src = base64
			})
		}

		toBlob(base64,index) {
			//解码base64
			const decodedData = window.atob(base64.split(',')[1])
			const arrayBuffer = new ArrayBuffer(decodedData.length)
			const uint8 = new Uint8Array(arrayBuffer)
            const URL = window.URL || window.webkitURL || window.mozURL
			let blob = '',blobURL = ''
			return new Promise((resolve,reject)=>{
				for (let i = 0; i < decodedData.length; i++) {
					uint8[i] = decodedData.charCodeAt(i)
				}
				try {
					blob = new Blob([uint8],{type:this.fileInfoes[index].type})
					blobURL = URL.createObjectURL(blob)
					let blobInfo = {blob,blobURL}
					resolve(blobInfo)
				} catch (error) {
					//兼容处理
					window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder
					if (error.name === 'TypeError' && window.BlobBuilder) {
						const builder = new BlobBuilder()
						builder.append(uint8)
						blob = builder.getBolb(this.fileInfo.type)
						blobURL = URL.createObjectURL(blob)
                        let blobInfo = {blob,blobURL}
                        resolve(blobInfo)
					} else {
						console.log('不支持图片上传')
                        reject()
					}
				}
			})
		}

		//判断文件是否处理完毕
		isEnd (count,length,reader) {
            if (count === length) {
            	console.log('结束')
                console.log(this.fileInfoes)
            } else {
                reader.readAsDataURL(this.fileInfoes[count].file)
            }
        }
	}
	return Upper
})