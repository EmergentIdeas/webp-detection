#! /usr/local/bin/node

const fs = require('fs')
const path = require('path')

let cdnNum = -1;
function getCdnNum() {
	cdnNum = (cdnNum + 1 ) % 4
	return cdnNum
}
function getCdn() {
	return '@{cdn' + getCdnNum() + "}"
}
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

try {
	fs.mkdirSync(viewDir, {recursive: true})	
}
catch(e) {
	console.log(e)
}

let styles = `
.setup-defaults() {
	@cdn0: '';
	@cdn1: '';
	@cdn2: '';
	@cdn3: '';
}


.setup-defaults();

` 

let imgDirectory = source
if(imgDirectory.startsWith('public/')) {
	imgDirectory = imgDirectory.substring(6)
}
else if(imgDirectory.startsWith('webroot/')) {
	imgDirectory = imgDirectory.substring(7)
}

if(imgDirectory.startsWith('/') == false) {
	imgDirectory = '/' + imgDirectory
}

for(let descFile of imageDescriptions) {
	let desc = JSON.parse(fs.readFileSync(descFile))
	
	let cdn = getCdn()
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

	let sizes = desc.size.split('x')
	let dim = sizes[0] / 2
	let ratio = sizes[1]/sizes[0] 

	let pictureEl = 
`<picture class="${pictureClass}">
	<source media="(max-width: ${dim /4}px)" srcset="__::cdnPrefix__${imgDirectory}/${imgName}-half.webp 2x, __::cdnPrefix__${imgDirectory}/${imgName}-quarter.webp 1x" type="image/webp">
	<source media="(max-width: ${dim /4}px)" srcset="__::cdnPrefix__${imgDirectory}/${imgName}-half.${downgradeSuffix} 2x, __::cdnPrefix__${imgDirectory}/${imgName}-quarter.${downgradeSuffix} 1x" type="${downgradeType}">
	<source media="(max-width: ${dim /2}px)" srcset="__::cdnPrefix__${imgDirectory}/${imgName}.webp 2x, __::cdnPrefix__${imgDirectory}/${imgName}-half.webp 1x" type="image/webp">
	<source media="(max-width: ${dim /2}px)" srcset="__::cdnPrefix__${imgDirectory}/${imgName}.${downgradeSuffix} 2x, __::cdnPrefix__${imgDirectory}/${imgName}-half.${downgradeSuffix} 1x" type="${downgradeType}">
	<source srcset="__::cdnPrefix__${imgDirectory}/${imgName}-2x.webp 2x, __::cdnPrefix__${imgDirectory}/${imgName}.webp 1x" type="image/webp">
	<source srcset="__::cdnPrefix__${imgDirectory}/${imgName}-2x.${downgradeSuffix} 2x, __::cdnPrefix__${imgDirectory}/${imgName}.${downgradeSuffix} 1x" type="${downgradeType}">
	<img src="__::cdnPrefix__${imgDirectory}/${imgName}.${downgradeSuffix}" alt="${alt}">
</picture>
`
	fs.writeFileSync(path.join(viewDir, imgName + '.tri'), pictureEl)

	styles +=
`
.${pictureClass} img {
	width: ${dim}px;
}

.ready-to-load-img .${pictureClass}-background, .ready-to-load-img .${pictureClass}-background-with-ratio {
	background-image: url("${cdn}${imgDirectory}/${imgName}.${downgradeSuffix}");
	
	.webp & {
		background-image: url("${cdn}${imgDirectory}/${imgName}.webp");
	}
	@media (max-width: ${dim / 2}px) {

		background-image: url("${cdn}${imgDirectory}/${imgName}-half.${downgradeSuffix}");
		
		.webp & {
			background-image: url("${cdn}${imgDirectory}/${imgName}-half.webp");
		}
	}
	@media (min-width: ${dim}px) {

		background-image: url("${cdn}${imgDirectory}/${imgName}-2x.${downgradeSuffix}");

		.webp & {
			background-image: url("${cdn}${imgDirectory}/${imgName}-2x.webp");
		}
	}
	@media (-webkit-min-device-pixel-ratio: 1.5), (min-resolution: 144dpi){ 
		background-image: url("${cdn}${imgDirectory}/${imgName}-2x.${downgradeSuffix}");
		
		.webp & {
			background-image: url("${cdn}${imgDirectory}/${imgName}-2x.webp");
		}
		
		@media (max-width: ${dim / 2}px) {

			background-image: url("${cdn}${imgDirectory}/${imgName}.${downgradeSuffix}");
			
			.webp & {
				background-image: url("${cdn}${imgDirectory}/${imgName}.webp");
			}
		}
	}
}

.${pictureClass}-background-ratio, .${pictureClass}-background-with-ratio {
	.ratio(${ratio});
	background-position: center center;
	background-size: cover;
}
`

}

fs.writeFileSync(lessFile, styles)
