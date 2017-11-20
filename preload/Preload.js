function preload(list, success, progress) {
	var length = list.length
	var n = 0
	var imageRegex = /.*\.(png|jpg|gif|jpeg)/
	var audioRegex = /.*\.(mp3|mp4)/
	for (var i = 0; i < length; i++) {
		if (imageRegex.test(list[i].src)) {
			var image = new Image()
			image.onload = function() {
				n++
				progress && progress.call(null, (n / length) * 100)
				if (n === length) {
					success && success.call(null)
				}
			}
			image.src = list[i].src
		} else if (audioRegex.test(list[i].src)) {
			var audio = new Audio()
			audio.onloadedmetadata = function() {
				n++
				progress && progress.call(null, (n / length) * 100)
				if (n === length) {
					success && success.call(null)
				}
			}
			audio.src = list[i].src
		}
	}
}
