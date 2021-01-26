const fs = require('fs')
const path = require('path')

let argv = require('minimist')(process.argv.slice(2));
if(argv['help']) {
	console.log('Arguments:')	
	console.log('-s <image source directory> -v <view dest directory> -l <less file>')
	process.exit()
}
let source = argv['s'] || 'public/img'
let viewDir = argv['v'] || 'views/images'
let lessFile = argv['l'] || 'less/images.less'

let imageDescriptions = fs.readdirSync(source).filter(file => file.endsWith('.json')).map(file => source + '/' + file)


let styles = ''

let imgDirectory = source
if(imgDirectory.startsWith('public/')) {
	imgDirectory = imgDirectory.substring(6)
}

for(let descFile of imageDescriptions) {
	let desc = JSON.parse(fs.readFileSync(descFile))
	
	let imgName = desc.name
	let downgradeSuffix = desc.fallback
	let downgradeType
	if(downgradeSuffix == 'png') {
		downgradeType = "image/png"
	}
	else {
		downgradeType = "image/jpeg"
	}
	
	let alt = desc.alt || desc.name
	let pictureClass = desc.name + '-picture'
	console.log(downgradeSuffix)

	let pictureEl = 
`<picture class="${pictureClass}">
	<source srcset="${imgDirectory}/${imgName}-2x.webp 2x, ${imgDirectory}/${imgName}.webp 1x" type="image/webp">
	<source srcset="${imgDirectory}/${imgName}-2x.${downgradeSuffix} 2x, ${imgDirectory}/${imgName}.${downgradeSuffix} 1x" type="${downgradeType}">
	<img src="${imgDirectory}/${imgName}.${downgradeSuffix}" alt="${alt}">
</picture>
`
	fs.writeFileSync(path.join(viewDir, imgName + '.tri'), pictureEl)
	
	let dim = desc.size.split('x')[0] / 2
	styles +=
`
.${pictureClass} img {
	width: ${dim}px;
}

.${pictureClass}-background {
	
	background-image: url("${imgDirectory}/${imgName}.${downgradeSuffix}");
	
	.webp & {
		background-image: url("${imgDirectory}/${imgName}.webp");
	}
	@media (-webkit-min-device-pixel-ratio: 1.5), (min-resolution: 144dpi){ 
		background-image: url("${imgDirectory}/${imgName}-2x.${downgradeSuffix}");
		
		.webp & {
			background-image: url("${imgDirectory}/${imgName}-2x.webp");
		}
	}
}
`

}

fs.writeFileSync(lessFile, styles)
