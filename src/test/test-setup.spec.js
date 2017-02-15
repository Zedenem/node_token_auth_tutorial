const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');

before(() => chai.use(sinonChai));

beforeEach(function createSinonSandbox() {
  this.sandbox = sinon.sandbox.create();
});

afterEach(() => this.sandbox.restore());
