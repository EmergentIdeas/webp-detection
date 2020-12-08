
var webpdetect = function() {
	function addClass(className) {
		document.getElementsByTagName('html')[0].classList.add(className)
	}
	var img = new Image()
	img.onload = function() { addClass('webp') }
	img.onerror = function() { addClass('no-webp') }
	img.src = 'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA='
}
if(typeof module != 'undefined') {
	module.exports = webpdetect
}