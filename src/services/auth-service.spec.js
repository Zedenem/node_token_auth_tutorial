const authService = require('../services/auth-service');
const User = require('../models/user');

describe('The authentication data module', () => {
  it('should verify if a user exists', () => {
    const username = "username";

    const findOneStub = this.sandbox.stub(User, 'findOne', () => {

    });

  });
});
