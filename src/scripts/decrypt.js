import fs from 'fs';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const algorithm = 'aes-256-cbc';
const key = Buffer.from(process.env.ENCRYPT_SECRET_KEY);

function decryptFile(inputFile, outputFile) {
  const input = fs.readFileSync(inputFile);

  // Первые 16 байт — это IV
  const iv = input.slice(0, 16);
  const encryptedData = input.slice(16);

  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  const decrypted = Buffer.concat([
    decipher.update(encryptedData),
    decipher.final(),
  ]);

  fs.writeFileSync(outputFile, decrypted);
  console.log(`✅ Файл расшифрован: ${outputFile}`);
}

// usage: node decrypt.js input.enc output.txt
const [, , inputFile, outputFile] = process.argv;
if (!inputFile || !outputFile) {
  console.error('❌ Использование: node decrypt.js input.enc output.txt');
  process.exit(1);
}

decryptFile(inputFile, outputFile);
