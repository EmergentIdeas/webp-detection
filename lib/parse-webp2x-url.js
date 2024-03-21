
function parseWebp2xUrl(url) {
	
	let i = url.lastIndexOf('#')
	if(i < 0) {
		return {
			url: url
		}
	}
	
	let result = {
		url: url.substring(0, i)
		, params: {}
	}

	let parts = url.substring(i + 1).split('&')
	for(let part of parts) {
		let sides = part.split('=')
		if(sides[1]) {
			sides[1] = decodeURIComponent(sides[1])
		}
		result.params[sides[0]] = sides[1]
	}

	return result
}

module.exports = parseWebp2xUrl