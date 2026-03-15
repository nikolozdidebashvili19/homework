const fs = require('fs/promises')
const readFile = async (filePath , isParsed)=> {
    const data = await  fs.readFile(filePath, 'utf8')
    return isParsed ? JSON.parse(data) : data
}

const writeFile = async (filePath, data) => {
    data = typeof data != 'string' ? JSON.stringify(data) : data
    await fs.writeFile(filePath, data)
    console.log("written")
}

module.exports = {
    readFile,
    writeFile
}