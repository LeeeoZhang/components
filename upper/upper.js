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
	console.log(event)
	// reader.onload = function(event) {
	// 	const result = event.target.result
	// 	toBlob(result)
	// }
	// reader.readAsDataURL(event.target.files[0])
})

function preView (blob) {
	let li = document.createElement('li')
	Object.assign(li.style,{
		backgroundImage: `url(${blob})`,
		backgroundPosition: '0 0',
		backgroundSize:'100% 100%',
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
	const canvas = document.createElement('canvas')
	const ctx = canvas.getContext('2d')
	const image = new Image()
	image.onload = function () {
		ctx.drawImage(image,0,0,image.width,image.height)
	}
	image.src = base64
}

function toFile(blob) {

}