const crypto = require('crypto');

function generateSecret() {
    return crypto.randomBytes(32).toString('hex');
}

console.log('JWT_SECRET=' + generateSecret());