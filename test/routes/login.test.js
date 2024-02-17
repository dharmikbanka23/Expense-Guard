const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const request = require('supertest');
const rewire = require('rewire');

chai.use(sinonChai);

const sandbox = sinon.createSandbox();

// Import the router directly from your routes file
const loginRoute = rewire('../../routes/login');

// Ensure that the route handler is set up correctly
const app = require('express')();
app.use('/', loginRoute);

describe('Login Routes', () => {
  let authenticateStub;

  beforeEach(() => {
    // Stub the authenticate middleware
    authenticateStub = sandbox.stub().returns(false);
    loginRoute.__set__('authenticate', authenticateStub);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('GET /login', () => {

    it('should render login page if not authenticated', (done) => {

      // Perform the request and make assertions
      request(app)
        .get('/')
        .set('cookie', 'token=test_token')  // Optional: Set cookies if needed
        .expect(200)
        .end((err, res) => {
          expect(res.text).to.include('<title>Expense Guard | Login</title>');
          expect(authenticateStub).to.be.calledOnceWithExactly({ cookies: {} });
          done(err);
        });
    });

  });

});

// it('should redirect to dashboard page if already authenticated', (done) => {
//   // Make sure to reset the authenticateStub to a new instance
//   let authenticateStub = sandbox.stub().returns(true);
//   app.__set__('authenticate', authenticateStub);

//   request(app)
//     .get('/login')
//     .set('cookie', 'token=test_token')
//     .expect(302) // Redirect status code
//     .end((err, response) => {
//       expect(response.header.location).to.equal('/dashboard');
//       done(err);
//     });
// });
  // describe('POST /login', () => {

  //   it('should redirect to dashboard on successful login', (done) => {
  //     const fakeUserRecord = {
  //       username: 'test_user',
  //       email: 'test@example.com',
  //       password: '$hashed$password',
  //     };

  //     // Stub the findOne method of userModel to return the fakeUserRecord
  //     let stub = sinon.stub(userModel, 'findOne').resolves(fakeUserRecord);

  //     request(app).post('/login')
  //       .send({
  //         user: 'test_user',
  //         password: 'password123', // Replace with the actual password
  //       })
  //       .expect(302) // Redirect status code
  //       .end((err, response) => {
  //         expect(response.header.location).to.equal('/dashboard');
  //         done(err);
  //       });

  //     // Restore the findOne method of userModel
  //     stub.restore();
  //   });

  //   it('should render the login page with an error message on invalid login', (done) => {
  //     // Stub the findOne method of userModel to simulate an invalid login
  //     let stub = sinon.stub(userModel, 'findOne').resolves(fakeUserRecord)

  //     request(app).post('/login')
  //       .send({
  //         user: 'invalid_user',
  //         password: 'invalid_password',
  //       })
  //       .expect(200)
  //       .end((err, response) => {
  //         expect(response.text).to.include('Invalid user or password');
  //         done(err);
  //       });
      
  //     // Restore the findOne method of userModel
  //     stub.restore();
  //   });

  // });