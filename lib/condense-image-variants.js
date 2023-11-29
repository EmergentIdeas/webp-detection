let {imageExtensions, smallerSizeExt, imageSizeExt} = require('./definitions')
const findPreviewVariant = require('./find-preview-variant')
const isFileImage = require('./is-file-image')
const makeVariantImage = require('./make-variant-image')
const fileBasename = require('./file-basename')

/**
 * Condenses an array of files into logical images with their variants. This works on a set of image files which all share
 * a base name, but have different extensions depending on how much larger or smaller they are compared to
 * the "natural" size of that image and what format they use (png, jpg, webp). There may also exist an additional json
 * file which shares the base name which contains information about description or other attributes.
 * 
 * @param {array} directoryContents An array of file objects like those returned from FileSink.getFullFileInfo
 * That is, they have a `name` attribute which is the file name and a `directory` attribute which is true if a directory.
 * @returns A map of variants keyed by the image's base name.
 */
function condenseImageVaraints(directoryContents) {
	let files = directoryContents.filter(child => !child.directory)
	let definitions = files.filter(child => child.name.toLowerCase().endsWith('.json'))
	let imageFiles = files.filter(isFileImage)

	let variants = {}
	function getVariant(baseName) {
		if (baseName in variants) {
			return variants[baseName]
		}
		let variant = {
			baseName: baseName
			, variants: []
		}
		variants[baseName] = variant
		return variant
	}

	// create variants for all the definitions. Images don't have to have
	// defintions but if they do, we want to do them first.
	for (let definition of definitions) {
		let baseName = fileBasename(definition.name)
		let variant = getVariant(baseName)
		variant.definitionFile = definition
	}
	
	// match up all the image files to their variant definitions
	for(let imageVariant of imageFiles.map(makeVariantImage)) {
		let variant = getVariant(imageVariant.baseName)
		variant.variants.push(imageVariant)
	}
	
	// remove those without images
	for(let baseName of Array.from(Object.keys(variants))) {
		if(variants[baseName].variants.length == 0) {
			delete variants[baseName]
		}
	}
	
	// set the preview variant
	Object.values(variants).forEach(setPreviewVariant)

	return variants
}

function setPreviewVariant(variantDefinition) {
	let preview = findPreviewVariant(variantDefinition.variants)
	variantDefinition.preview = preview
}


module.exports = condenseImageVaraints