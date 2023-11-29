let {imageExtensions, smallerSizeExt, imageSizeExt} = require('./definitions')

function findPreviewVariant(variants) {
	for(let size of imageSizeExt) {
		for(img of imageExtensions) {
			for(let variant of variants) {
				if(variant.size == size && variant.ext == img) {
					return variant
				}
			}
		}
	}
}

module.exports = findPreviewVariant