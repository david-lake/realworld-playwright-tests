const crypto = require('crypto');

// Generate RSA key pair
const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: { type: 'spki', format: 'pem' },
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
});

// Convert to JWK format using Node's native export
const publicJwk = crypto.createPublicKey(publicKey).export({ format: 'jwk' });
const privateJwk = crypto.createPrivateKey(privateKey).export({ format: 'jwk' });

console.log('Public JWK:');
console.log(JSON.stringify(publicJwk));
console.log('\nPrivate JWK:');
console.log(JSON.stringify(privateJwk));
