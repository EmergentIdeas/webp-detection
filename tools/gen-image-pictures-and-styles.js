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

function rd(num) {
	return Math.round(num)
}

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
	let height = sizes[1] / 2
	let ratio = sizes[1]/sizes[0] 

	let pictureEl = 
`<picture class="${pictureClass}">
	__$globals.imageScratchpad = {width: this.imageWidth || ${rd(dim)}, height: this.imageHeight || ${rd(height)}, imageStyle: this.imageStyle || 'height: auto' }??''__
	<source 
		srcset="__::cdnPrefix__${imgDirectory}/${imgName}-2x.webp ${dim * 2}w, __::cdnPrefix__${imgDirectory}/${imgName}.webp ${rd(dim)}w, __::cdnPrefix__${imgDirectory}/${imgName}-half.webp ${rd(dim / 2)}w, __::cdnPrefix__${imgDirectory}/${imgName}-quarter.webp ${rd(dim / 4)}w"  
		sizes="min(100vw, __$globals.imageScratchpad.width__px)"
		type="image/webp">
	<source 
		srcset="__::cdnPrefix__${imgDirectory}/${imgName}-2x.${downgradeSuffix} ${dim * 2}w, __::cdnPrefix__${imgDirectory}/${imgName}.${downgradeSuffix} ${rd(dim)}w, __::cdnPrefix__${imgDirectory}/${imgName}-half.${downgradeSuffix} ${rd(dim / 2)}w, __::cdnPrefix__${imgDirectory}/${imgName}-quarter.${downgradeSuffix} ${rd(dim / 4)}w"  
		sizes="min(100vw, __$globals.imageScratchpad.width__px)"
		type="${downgradeType}">
	
	<img src="__::cdnPrefix__${imgDirectory}/${imgName}.${downgradeSuffix}" alt="${alt}" width="__$globals.imageScratchpad.width__" height="__$globals.imageScratchpad.height__" style="__$globals.imageScratchpad.imageStyle__">
	__delete $globals.imageScratchpad??''__
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
	
`
	if(dim / 2 > 327) {
		styles +=
`	
	@media (max-width: ${dim / 2}px) {

		background-image: url("${cdn}${imgDirectory}/${imgName}-half.${downgradeSuffix}");
		
		.webp & {
			background-image: url("${cdn}${imgDirectory}/${imgName}-half.webp");
		}
	}
`	
	}
	
`	@media (min-width: ${dim}px) {

		background-image: url("${cdn}${imgDirectory}/${imgName}-2x.${downgradeSuffix}");

		.webp & {
			background-image: url("${cdn}${imgDirectory}/${imgName}-2x.webp");
		}
	}
`
	
	styles +=
`	@media (-webkit-min-device-pixel-ratio: 1.5), (min-resolution: 144dpi){ 
		background-image: url("${cdn}${imgDirectory}/${imgName}-2x.${downgradeSuffix}");
		
		.webp & {
			background-image: url("${cdn}${imgDirectory}/${imgName}-2x.webp");
		}
`		
	if(dim / 2 > 327) {
		styles +=
`		@media (max-width: ${dim / 2}px) {

			background-image: url("${cdn}${imgDirectory}/${imgName}.${downgradeSuffix}");
			
			.webp & {
				background-image: url("${cdn}${imgDirectory}/${imgName}.webp");
			}
		}
`		
	}
	styles +=	
`	}
`
	
	
	styles +=
`}
.ready-to-load-img .${pictureClass}-box-background, .ready-to-load-img .${pictureClass}-box-background-with-ratio {
	background-image: url("${cdn}${imgDirectory}/${imgName}.${downgradeSuffix}");
	
	.webp & {
		background-image: url("${cdn}${imgDirectory}/${imgName}.webp");
	}
	@media (-webkit-min-device-pixel-ratio: 1.5), (min-resolution: 144dpi){ 
		background-image: url("${cdn}${imgDirectory}/${imgName}-2x.${downgradeSuffix}");
		
		.webp & {
			background-image: url("${cdn}${imgDirectory}/${imgName}-2x.webp");
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
