let numOfRows = 48 / 4;
let startFrom = 4
for (let i = 0; i < numOfRows; i++) {
    for (let j = 0; j < 4; j++) {
        let index = (i * 4) + j
        if(index>=startFrom){
            console.log(index-startFrom)
        }
    }
}