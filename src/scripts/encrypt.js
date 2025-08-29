import fs from 'fs';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const algorithm = 'aes-256-cbc';
const key = Buffer.from(process.env.ENCRYPT_SECRET_KEY);
const iv = crypto.randomBytes(16);

function encryptFile(inputFile, outputFile) {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  const input = fs.createReadStream(inputFile);
  const output = fs.createWriteStream(outputFile);

  output.write(iv);

  input.pipe(cipher).pipe(output);
  output.on('finish', () => console.log(`File encrypted to: ${outputFile}`));
}

const [, , inputFile, outputFile] = process.argv;
if (!inputFile || !outputFile) {
  console.error('❌ usage: node encrypt.js input.txt output.enc');
  process.exit(1);
}

encryptFile(inputFile, outputFile);
