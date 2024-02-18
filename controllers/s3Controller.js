const { S3Client, PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { createReadStream } = require("fs");
const fs = require("fs");

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Function to upload file to S3
async function uploadFileToS3(username, bucketName, file) {
  const fileStream = createReadStream(file.path);
  const folderName = "receipts";
  const fileName = `${folderName}/${username}-${Date.now()}`;
  const uploadParams = {
    Bucket: bucketName,
    Key: fileName,
    Body: fileStream,
    ContentType: file.mimetype,
    ContentDisposition: 'inline',
  };
 
  try {
    console.log("Uploading file to S3");
    await s3Client.send(new PutObjectCommand(uploadParams));
    console.log("File uploaded successfully:");
    return `https://${bucketName}.s3.amazonaws.com/${fileName}`;
  }
  catch (err) {
    console.error("Error uploading file:", err);
    throw err; // Re-throw the error to handle it in the calling function
  }
}


// Function to delete file from S3
async function deleteFileFromS3(fileUrl) {
  const fileName = fileUrl.split("/").pop();
  const folderName = "receipts";
  const deleteParams = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `${folderName}/${fileName}`,
  };

  try {
    const data = await s3Client.send(new DeleteObjectCommand(deleteParams));
    console.log("File deleted successfully:", fileName);
  } catch (err) {
    console.error("Error deleting file:", err);
    throw err; // Re-throw the error to handle it in the calling function
  }
}

// Delete from local disk
function deleteFile(filePath) {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error("Error deleting file:", err);
    } else {
      console.log("File deleted successfully.");
    }
  });
}
 
module.exports = {
  deleteFile,
  uploadFileToS3,
  deleteFileFromS3
};