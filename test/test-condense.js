const mocha = require('mocha')
const assert = require('chai').assert
const condense = require('../lib/condense-image-variants')
const parseWebp2xUrl = require('../lib/parse-webp2x-url')
const generatePictureMarkup = require('../lib/generate-picture-markup')

let data1 = require('../test-data/data1')
let data2 = require('../test-data/data2')
describe(" basic tests", function() {
	
	it("condense", function() {
		let variants = condense(data2)
		// console.log(JSON.stringify(variants, null, '\t'))
		// console.log(Object.keys(variants))

		let keys = Object.keys(variants)
		let remaining = keys.filter(item => !aggregateBaseName.includes(item))

		assert.equal(remaining.length, 0)
	})
	
	it("url parse", function() {
		let url = '/empty/4cats.jpg#format=webp2x&width=512&height=256&alt=see%20the%204%20cats'
		let o = parseWebp2xUrl(url)

		assert.equal(o.url, '/empty/4cats.jpg')
		assert.equal(o.params.width, '512')
		assert.equal(o.params.height, '256')
		assert.equal(o.params.format, 'webp2x')
		assert.equal(o.params.alt, 'see the 4 cats')
	})

	it("picture generation", function() {
		let url = '/empty/4cats.jpg#format=webp2x&width=512&height=256&alt=see%20the%204%20cats'
		let o = parseWebp2xUrl(url)
		let html = generatePictureMarkup(o.url, o.params)
		console.log(html)

	})

	it("picture generation 2", function() {
		let url = '/empty/4cats.png#format=webp2x&width=512&height=256&alt=see%20the%204%20cats'
		let o = parseWebp2xUrl(url)
		o.params.displayWidth = '300px'
		o.params.height = 200
		o.params.pictureStyle = 'display: block'
		o.params.imgStyle = 'display: inline'
		o.params.pictureClass = 'my-pic'
		let html = generatePictureMarkup(o.url, o.params)
		console.log(html)

	})

	it("picture generation 3", function() {
		let url = '/empty/4cats.png#format=webp2x&width=512&height=256&alt=see%20the%204%20cats'
		let o = parseWebp2xUrl(url)
		o.params.displayWidth = '300px'
		o.params.height = 200
		o.params.pictureStyle = 'display: block'
		o.params.imgStyle = 'display: inline'
		o.params.pictureClass = 'my-pic'
		delete o.params.format
		let html = generatePictureMarkup(o.url, o.params)
		console.log(html)

	})

})


var aggregateBaseName = [
  'aggregates-boulders',
  'aggregates-concrete-class-5',
  'aggregates-crushed-rock',
  'aggregates-granite-class-2',
  'aggregates-gravel-class-5',
  'aggregates-onsite-crushing',
  'aggregates-pea-rock',
  'aggregates-roof-rock-big',
  'aggregates-roof-rock',
  'aggregates-screened-black-dirt',
  'aggregates-washed-rock',
  'aggregates-washed-sand',
  'abc'
]
