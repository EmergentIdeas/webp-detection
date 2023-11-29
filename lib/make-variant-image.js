let {imageExtensions, smallerSizeExt, imageSizeExt} = require('./definitions')

function makeVariantImage(file) {
	let info = {
		size: 'std'
		, file: file
	}
	let name = file.name

	info.ext = name.substring(name.lastIndexOf('.') + 1)
	let noExt = name.substring(0, name.lastIndexOf('.'))
	info.baseName = noExt
	for (let size of imageSizeExt) {
		let sizeString = '-' + size
		if (noExt.endsWith(sizeString)) {
			info.size = size
			info.baseName = noExt.substring(0, noExt.length - sizeString.length)
			break
		}
	}
	return info
}

module.exports = makeVariantImage