const fs = require("node:fs")

const dir = 'bgm'

const files = fs.readdirSync(dir)


let results = files.flatMap((file) => JSON.parse(fs.readFileSync(`${dir}/${file}`)))

// sorry if you like any of them I just don't know them / they are bad for heradle
const clientsToIgnore = new Set(['JMS 0.93', 'CMS 0.47', 'BMS 0.19', 'JMS 1.75',
	'JMS 1.73', 'JMS 1.75', 'JMS 1.76', 'CMS 1.03', 'KMST 1.2.505', 'JMS 3.31', 'JMS 3.34', 'GMS 1.57', 'GMS 1.71', 'CNST 1.15', 'CNST 1.25', 'MSEA 1.80'])

results = results.filter((song) => {
	return song.metadata.year <= 2018 ||
		song.metadata.year === undefined ||
		clientsToIgnore.has(song.source.client);
})

shuffleList(results)

function shuffleList(array) {
	for (let i = 0; i < array.length; i++) {
		let swapIndex = Math.floor(Math.random() * array.length)
		let tmp = array[i]
		array[i] = array[swapIndex]
		array[swapIndex] = tmp

	}
}

fs.writeFileSync('bgm.json', JSON.stringify(results))
console.log(`Done, songs in pool: ${results.length}`)
