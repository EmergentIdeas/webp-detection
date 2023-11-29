let definitions = {
	imageExtensions: ['jpg', 'jpeg', 'png', 'gif', 'tiff', 'webp']
	, smallerSizeExt: ['quarter', 'half']
}
definitions.imageSizeExt = [...definitions.smallerSizeExt, 'std', '2x']

module.exports = definitions