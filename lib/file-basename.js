
function fileBasename(name) {
	return name.substring(0, name.lastIndexOf('.'))
}

module.exports = fileBasename