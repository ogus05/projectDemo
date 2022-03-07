import CryptoJS from 'crypto-js';
const passwordEncryptor = (password: string, salt: string = "") => {
    if(salt === "") salt = crypto.getRandomValues(new Uint32Array(10)).reduce((p, c) => p + c).toString(16);
    const newPassword = CryptoJS.PBKDF2(password, salt, {
        keySize: 256 / 32,      //8byte
        iterations: 100,
    }).toString(CryptoJS.enc.Base64);
    return newPassword;
}
export default passwordEncryptor;