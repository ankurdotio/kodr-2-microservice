import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import config from "../config/config.js";
import { v4 as uuidv4 } from 'uuid';
import { getSignedUrl as getAwsSignedUrl } from "@aws-sdk/s3-request-presigner";


const s3 = new S3Client({
    region: config.AWS_REGION,
    credentials: {
        accessKeyId: config.AWS_ACCESS_KEY_ID,
        secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
    }
})

export async function uploadFile(file) {

    const key = `${uuidv4()}-${file.originalname}`;

    const command = new PutObjectCommand({
        Bucket: 'kodr-2',
        Body: file.buffer,
        Key: key,
    })

    const result = await s3.send(command);

    return key;

}

export async function getSignedUrlForAccess(key) {
    // Generate a signed URL for accessing the file
    const signedUrl = await getAwsSignedUrl(s3, new GetObjectCommand({
        Bucket: 'kodr-2',
        Key: key,
    }), {
        expiresIn: 3600 // URL expiration time in seconds
    })

    return signedUrl;
}