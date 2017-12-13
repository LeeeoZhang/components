function preload(list, success, progress) {
	var length = list.length
	var n = 0
	for (var i = 0; i < length; i++) {
		var image = new Image()
		image.onload = function () {
			n++
			progress && progress.call(null, (n / length) * 100)
			if (n === length) {
				success && success.call(null)
			}
		}
		image.src = list[i]
	}
}