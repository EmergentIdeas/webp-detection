const fileBasename = require('./file-basename')

function urlBasename(url) {
	while(url.endsWith('/')) {
		url = url.substring(0, url.length - 1)
	}
	
	let parts = url.split('/')
	let last = parts.pop()
	
	let i = last.lastIndexOf('.')
	let ext
	if(i > -1) {
		ext = last.substring(i + 1)
	}
	
	let result = {
		basename: fileBasename(last)
		, ext: ext
	}
	
	parts.push(result.basename)
	result.baseUrl = parts.join('/')
	
	return result
}

module.exports = urlBasename