const mocha = require('mocha')
const assert = require('chai').assert
const condense = require('../lib/condense-image-variants')

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
