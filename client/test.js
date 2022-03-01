const fs = require('fs');
const path = require('path');



const lowerForderNames = fs.readdirSync(path.join(__dirname, './src'));
const entries = lowerForderNames.map(forderName => {
    if(forderName === 'scss') console.log('scss');
    else{
        return {[forderName]: `./src/${forderName}/${forderName}.tsx`};
    }
})
console.log(entries);