
let {imageExtensions, smallerSizeExt, imageSizeExt} = require('./definitions')

function isFileImageName(name) {
	let nameLower = name.toLowerCase()
	for (let ext of imageExtensions) {
		if (nameLower.endsWith('.' + ext)) {
			return true
		}
	}
	return false
}

module.exports = isFileImageName