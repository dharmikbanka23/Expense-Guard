const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
const rewire = require('rewire');
const request = require('supertest');
const sandbox = sinon.createSandbox();

// const connectDB = require('../../db');
let app = rewire('../../app');

// describe('Testing Login Route', () => {

//   let stubDatabase;

//   beforeEach(() => {
//     stubDatabase = sinon.stub().resolves();
//     app.__set__('connectDB', stubDatabase);
//   })
  
//   afterEach(() => {
//     app = rewire('../../app');
//     sandbox.restore();
//   });

//   it('should stub the database', () => {
//   })

// })