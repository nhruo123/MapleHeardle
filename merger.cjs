const fs = require("node:fs")

const dir = 'bgm'

const files = fs.readdirSync(dir)


let results = files.flatMap((file) => JSON.parse(fs.readFileSync(`${dir}/${file}`)))

results = results.filter((song) => song.metadata.year <= 2020)

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
