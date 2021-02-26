#! /usr/local/bin/node

const fs = require('fs')

let argv = require('minimist')(process.argv.slice(2));

let spec = JSON.parse(fs.readFileSync(argv._[0]))
let name = spec.name
let ext = spec.fallback
console.log(`convert ${name}-2x.webp -background white -alpha background ${name}-2x.${ext}`)
console.log(`convert ${name}.webp -background white -alpha background ${name}.${ext}`)
console.log(`convert ${name}-half.webp -background white -alpha background ${name}-half.${ext}`)
console.log(`convert ${name}-quarter.webp -background white -alpha background ${name}-quarter.${ext}`)

