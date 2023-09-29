const crypto = require('crypto');


let mapResetPassword = [];


function generateRandomCode() {
    const code = crypto.randomBytes(2).readUInt16BE(0);
    return String(code).padStart(5, '0');
}

const handleMapResetCode = (code) => {
    const data = {
        code: code,
        date: Date.now()
    }

    mapResetPassword = mapResetPassword.filter(element => Date.now() - element.date <= 600000);

    mapResetPassword.push(data);
}


const handleCheckPin = (pin) => {
    return mapResetPassword.some(element => element.code === pin);
}



module.exports={
    generateRandomCode,
    handleMapResetCode,
    handleCheckPin
}