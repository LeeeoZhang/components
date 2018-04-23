function $(selector) {
	return document.querySelector(selector)
}

const upperInput = $('.upper-input')
const display = $('.display')
const reader = new FileReader()
const fileInfo = {}

upperInput.addEventListener('change',(event) => {
	const file = event.target.files[0]
	//记录文件相关信息
	fileInfo.type = file.type || 'image/jpeg'
	fileInfo.size = file.size
	fileInfo.name = file.name
	fileInfo.lastModifiedDate = file.lastModifiedDate
	//把文件转为base64进行处理
	reader.onload = function(event) {
		//base64源文件
		const result = event.target.result
		toBlob(result).then((blobData)=>{
			preView(blobData.blobURL)
		})
	}
	reader.readAsDataURL(event.target.files[0])
})

function preView (blobURL) {
	let li = document.createElement('li')
	Object.assign(li.style,{
		backgroundImage: `url(${blobURL})`,
		backgroundPosition: 'center center',
		backgroundSize:'cover',
		backgroundRepeate:'no-repeate',
	})
	display.appendChild(li)
}

//图片压缩
function compressImage (base64,encoderOptions = 0.5) {
	return new Promise((resolve,reject) => {
		const image = new Image()
		image.onload = function () {
			const canvas = document.createElement('canvas')
			const ctx = canvas.getContext('2d')
			const IMG_WIDTH = image.width
			const IMG_HEIGHT = imgae.height
			let compressBase64 = ''
			canvas.width = IMG_WIDTH
			canvas.height = IMG_HEIGHT
			ctx.drawImage(images,0,0,IMG_WIDTH,IMG_HEIGHT)
			compressBase64 = canvas.toDataURL('image/jpeg',encoderOptions)
			resolve(compressBase64)
		}
		image.src = base64
	})
}

function toBlob (base64) {
	//解码base64
	const decodedData = window.atob(base64.split(',')[1])
	//数据操作
	const arrayBuffer = new ArrayBuffer(decodedData.length)
	const uint8 = new Uint8Array(arrayBuffer)
	let blob = ''
	return new Promise((resolve,rejetc)=>{
		for(let i = 0; i<decodedData.length; i++) {
			uint8[i] = decodedData.charCodeAt(i)
		}
		try {
			blob = new Blob([uint8],{type:fileInfo.type})
			blobURL = URL.createObjectURL(blob)
			resolve({blob,blobURL})
		} catch(error) {
			
		}
	})
}
