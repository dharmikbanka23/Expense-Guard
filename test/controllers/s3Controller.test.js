const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
const path = require('path');

const { S3Client, PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { createReadStream } = require("fs");
const fs = require("fs");
const customFile = require('../../controllers/s3Controller');

afterEach(() => {
  sinon.restore();
});

describe('s3 Controller', () => {

  describe('Upload File to S3', () => {

    it('should handle uploading a file to S3', async () => {
      // File path
      const filePath = path.resolve(__dirname, '../..', 'public/images/register.jpg');

      // Stubbing the S3 upload function
      const uploadFileStub = sinon.stub(S3Client.prototype, 'send').resolves({});

      // Calling the function
      let result = await customFile.uploadFileToS3('test-user', 'test-bucket', { path: filePath, mimetype: 'test-mimetype' });

      expect(uploadFileStub).to.have.been.calledOnce;
      expect(result).to.match(/https:\/\/test-bucket\.s3\.amazonaws\.com\/receipts\/test-user-\d+/);
    });

    it('should handle error when uploading a file to S3', async () => {
      // File path
      const filePath = path.resolve(__dirname, '../..', 'public/images/register.jpg');

      // Stubbing the S3 upload function to throw an error
      const uploadFileStub = sinon.stub(S3Client.prototype, 'send').throws('Error uploading file');

      // Calling the function and expecting it to throw an error
      await expect(customFile.uploadFileToS3('test-user', 'test-bucket', { path: filePath, mimetype: 'test-mimetype' }))
        .to.be.rejectedWith('Error uploading file');
    });

  });

  describe('Delete File from S3', () => {

    it('should handle deleting a file from S3', async () => {
      // Stubbing the S3 delete function to resolve successfully
      const deleteFileStub = sinon.stub(S3Client.prototype, 'send').resolves({});

      // Calling the function and expecting it to resolve successfully
      const fileUrl = 'https://test-bucket.s3.amazonaws.com/receipts/test-file.jpg';
      await expect(customFile.deleteFileFromS3(fileUrl)).to.eventually.be.fulfilled;

      // Also, you can check if the stub was called once (optional)
      expect(deleteFileStub).to.have.been.calledOnce;
    });

    it('should handle error when deleting a file from S3', async () => {
      // Stubbing the S3 delete function to throw an error
      const deleteFileStub = sinon.stub(S3Client.prototype, 'send').throws('Error deleting file');

      // Calling the function and expecting it to throw an error
      const fileUrl = 'https://test-bucket.s3.amazonaws.com/receipts/test-file.jpg';
      await expect(customFile.deleteFileFromS3(fileUrl)).to.eventually.be.rejectedWith('Error deleting file');

      // Also, you can check if the stub was called once (optional)
      expect(deleteFileStub).to.have.been.calledOnce;
    });

  });

  describe('Delete File from Local Disk', () => {

    it('should handle deleting a local file', async () => {
      // Stubbing the fs.unlink function
      sinon.stub(fs, 'unlink').callsFake((filePath, callback) => {
        callback(null); // Simulate successful deletion
      });

      // Calling the function and expecting it to resolve successfully
      const filePath = '/path/to/local/file.txt';
      customFile.deleteFile(filePath, (err) => {
        expect(err).to.be.null;
      });
    });

    it('should handle error when deleting a local file', async () => {
      // Stubbing the fs.unlink function to throw an error
      sinon.stub(fs, 'unlink').callsFake((filePath, callback) => {
        callback(new Error('Error deleting file from local disk')); // Simulate an error
      });

      // Calling the function and expecting it to throw an error
      const filePath = '/path/to/local/file.txt';
      customFile.deleteFile(filePath, (err) => {
        expect(err).to.be.an.instanceOf(Error);
        expect(err.message).to.equal('Error deleting file from local disk');
      });
    });

  });

});