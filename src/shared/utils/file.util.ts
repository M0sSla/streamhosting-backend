import { ReadStream, createReadStream } from 'fs';

export function validateFileFormat(
    filename: string, 
    allowedFileFormats: string[]
) {
  const fileParts = filename.split('.');
  return allowedFileFormats.includes(fileParts[fileParts.length - 1].toLowerCase());
}

export async function validateFileSize(
    fileStream: ReadStream, 
    allowedSizeInBytes: number
) {
    return new Promise((resolve, reject) => {
        let fileSizeInBytes = 0;
        
        fileStream
        .on('data', (data: Buffer) => {
            // = or += ? 
            fileSizeInBytes += data.byteLength
        })
        .on('end', () => {
            resolve(fileSizeInBytes <= allowedSizeInBytes)
        })
        .on('error', (error) => {
            reject(error)
        })
    })
}