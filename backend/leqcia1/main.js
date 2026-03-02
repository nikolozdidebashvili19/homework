const { read, readdir } = require('fs');
const fs = require('fs/promises');

// const [, , op, num1, num2] = process.argv;
 
// const n1 = Number(num1);
// const n2 = Number(num2);

// if (op === "sum") {
//   console.log(n1 + n2);
// } else if (op === "sub") {
//   console.log(n1 - n2);
// } else if (op === "mult") {
//   console.log(n1 * n2);
// }
async function main() {

// console.log(readData);

 const [,, fileName , data] = process.argv;
await fs.writeFile(fileName , data);
console.log("written succesfully")
}

 async function amount() {
    const readData = await fs.readFile('result.txt' , 'utf-8');
    let xmovani = ["a" , "e" , "i" , "o" , "u"]
    let trimmed = readData
    let xmovanicount = 0
for (let i = 0; i < 20; i++) {
   if (["a", "e", "i", "o", "u"].includes)
     console.log();
}
    

}


amount()