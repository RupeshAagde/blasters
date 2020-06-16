'use strict'
const path = require('path')
const SVGO = require('svgo')
const fsPromise = require('fs').promises
const fs = require('fs')

const outputDir = path.join(__dirname, '../src/auto_gen')
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir)
}

const svgo = new SVGO({
  plugins: [
    { removeViewBox: false },
    { removeDimensions: false },
    {
      cleanupIDs: {
        remove: false,
        minify: false,
        prefix: 'svg',
        force: true
      }
    },
    {
      prefixIds: true
    }
  ]
})

async function run(srcPath, destPath) {
  const basePath = srcPath
  const allfiles = await fsPromise.readdir(basePath)

  //read all svg files
  const svgStreams = await allfiles.map(async (file) => {
    const fileStream = await fsPromise.readFile(path.join(basePath, file))
    const fileName = file.replace('.svg', '')
    return {
      svgName: fileName,
      stream: await svgo.optimize(fileStream)
    }
  })
  const svgContent = await Promise.all(svgStreams)

  //Create a single svg file with svg html
  let str = `"use strict";\nvar svgs={}; \n`
  svgContent.forEach((fc) => {
    str = str + `svgs["${fc.svgName}"] = '${fc.stream.data}';\n`
  })
  str = str + `module.exports = svgs;`

  const writeFilePath = destPath
  await fsPromise.writeFile(writeFilePath, str)
  return
}

//Generate common assets
const srcCommonAssetPath = path.join(__dirname, '../assets/svgs/')
const destCommonAssetPath = path.join(__dirname, '../src/auto_gen/svgs.js')
run(srcCommonAssetPath, destCommonAssetPath)
