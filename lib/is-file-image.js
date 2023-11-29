const isFileImageName = require('./is-file-image-name')

function isFileImage(file) {
	return isFileImageName(file.name)
}

module.exports = isFileImage