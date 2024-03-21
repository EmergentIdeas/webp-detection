let {imageExtensions, smallerSizeExt, imageSizeExt} = require('./definitions')

let fallbackSizeExt = ['std', '2x', ...smallerSizeExt]
let fallbackImgageExtensions = imageExtensions.filter(item => item != 'webp')

function findPrimaryVariant(variants) {
	for(let size of fallbackSizeExt) {
		for(img of fallbackImgageExtensions) {
			for(let variant of variants) {
				if(variant.size == size && variant.ext == img) {
					return variant
				}
			}
		}
	}
}

module.exports = findPrimaryVariant