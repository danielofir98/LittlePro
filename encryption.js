// encryption.js
const crypto = require('crypto');

const Encryption = {
  encrypt(plaintext, key) {
    try {
      const iv = crypto.randomBytes(12);
      const cipher = crypto.createCipheriv('aes-256-gcm', padKey(key), iv);
      let encrypted = cipher.update(plaintext, 'utf8', 'base64');
      encrypted += cipher.final('base64');
      const authTag = cipher.getAuthTag().toString('base64');
      return JSON.stringify({
        iv: iv.toString('base64'),
        tag: authTag,
        data: encrypted
      });
    } catch (err) {
      console.error("Encryption error:", err);
      return null;
    }
  },
  decrypt(ciphertext, key) {
    try {
      const obj = JSON.parse(ciphertext);
      const iv = Buffer.from(obj.iv, 'base64');
      const tag = Buffer.from(obj.tag, 'base64');
      const encryptedData = obj.data;
      const decipher = crypto.createDecipheriv('aes-256-gcm', padKey(key), iv);
      decipher.setAuthTag(tag);
      let decrypted = decipher.update(encryptedData, 'base64', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    } catch (err) {
      console.error("Decryption error:", err);
      throw err;
    }
  }
};

function padKey(key) {
  let buf = Buffer.alloc(32);
  buf.fill(0);
  Buffer.from(key).copy(buf);
  return buf;
}

module.exports = Encryption;