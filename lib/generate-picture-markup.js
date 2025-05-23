const urlBasename = require('./url-basename')
const escapeAttr = require('@dankolz/escape-html-attribute-value')

function addAttribute(style, value) {
	if(style === null || style === undefined) {
		style = ''
	}
	else if(style) {
		style += '; '
	}
	style += value
	return style
}

/**
 * Generate markup for a picture with webp double density components and a fallback to another format
 * @param {string} url The URL of the primary fallback image
 * @param {object} options
 * @param {object} options.width The natural width of the single size image
 * @param {object} options.height The natural height of the single size image
 * @param {string} [options.format] Set with webp2x which will generate an picture with webp alternatives. Anything else will cause a simpler picture with single image element
 * @param {string} [options.alt] The alt text (descriptive text) for the image, If blank it will be set from the image name
 * @param {string} [options.displayWidth] The width at which the picture will actually be displayed if known and different from the natural width
 * @param {string} [options.displayHeight] The height at which the picture will actually be displayed if known and different from the natural height
 * @param {string} [options.pictureStyle] Style attribute text for the picture element
 * @param {string} [options.imgStyle] Style attribute text for the image element
 * @param {string} [options.imgClass] Class attribute for the image element
 * @param {string} [options.pictureClass] The class attribute value. If blank it will be set from the base name
 * @param {string} [options.cdnPrefix] A prefix for the url
 * @param {string} [options.loading] The loading attribute. Defaults to 'lazy'. Use 'eager' as the alternative.
 * @param {string} [options.ratio] If set to 'preserve' (the default), the img tag will get its height set but will also get a style attribute of height: auto
 * @returns 
 */
function generatePictureMarkup(url, {width, height, format, alt, 
	displayWidth, displayHeight, pictureStyle, imgStyle = '', imgClass, pictureClass, 
	cdnPrefix = '', loading = 'lazy', ratio = 'preserve'} = {}) {
	
	let pictureStyleAttr = ''
	if(pictureStyle) {
		pictureStyleAttr = ` style="${pictureStyle}" `
	}
	
	if(ratio === 'preserve') {
		imgStyle = addAttribute(imgStyle, 'height: auto')	
	}


	let imgStyleAttr = ''
	if(imgStyle) {
		imgStyleAttr = ` style="${imgStyle}" `
	}

	let imgClassAttr = ''
	if(imgClass) {
		imgClassAttr = ` class="${imgClass}" `
	}
	
	let {basename, ext, baseUrl} = urlBasename(url)
	if(!pictureClass) {
		pictureClass = escapeAttr(basename) + '-picture'
	}
	
	if(!alt) {
		alt = basename
	}
	alt = escapeAttr(alt, true)
	
	if(!displayWidth && width) {
		displayWidth = width + 'px'
	}
	if(!displayHeight && height) {
		displayHeight = height + 'px'
	}
	
	
	let picture
	
	if(format === 'webp2x') {
		let full = parseInt(width)
		let double = 2 * full
		let half = Math.ceil(full / 2)
		let quarter = Math.ceil(full / 4)
		baseUrl = baseUrl.split(' ').join('%20')
		
		
		let fallback = 'image/jpeg'
		if(ext.toLowerCase() == 'png') {
			fallback = 'image/png'
		}
		picture = 
`<picture class="${pictureClass}" ${pictureStyleAttr}>
	<source 
		srcset="${cdnPrefix}${baseUrl}-2x.webp ${double}w, ${cdnPrefix}${baseUrl}.webp ${full}w, ${cdnPrefix}${baseUrl}-half.webp ${half}w, ${cdnPrefix}${baseUrl}-quarter.webp ${quarter}w"  
		sizes="min(100vw, ${displayWidth})"
		type="image/webp">
	<source 
		srcset="${cdnPrefix}${baseUrl}-2x.${ext} ${double}w, ${cdnPrefix}${baseUrl}.${ext} ${full}w, ${cdnPrefix}${baseUrl}-half.${ext} ${half}w, ${cdnPrefix}${baseUrl}-quarter.${ext} ${quarter}w"  
		sizes="min(100vw, ${displayWidth})"
		type="${fallback}">
	
	<img src="${cdnPrefix}${baseUrl}.${ext}" alt="${alt}" width="${displayWidth}" height="${displayHeight}" ${imgStyleAttr} ${imgClassAttr} loading="${loading}">
</picture>
`
	}
	else {
		let widthAttr = ''
		if(displayWidth) {
			widthAttr = `width="${displayWidth}"`
		}
		
		let heightAttr = ''
		if(displayHeight) {
			heightAttr = `height="${displayHeight}"`
		}
picture = `<picture class="${pictureClass}" ${pictureStyleAttr}>
	<img src="${cdnPrefix}${baseUrl}.${ext}" alt="${alt}" ${widthAttr} ${heightAttr} ${imgStyleAttr} ${imgClassAttr}  loading="${loading}">
</picture>
`
	}
	return picture

}

module.exports = generatePictureMarkup