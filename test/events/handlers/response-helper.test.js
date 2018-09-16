'use strict';

/* eslint-env mocha */
/* eslint-disable no-unused-expressions */

const chai = require('chai');

const expect = chai.expect;

const ResponseHelper = require('../../../src/events/handlers/response-helper');

describe('ResponseHelper tests', () => {
  describe('success()', () => {
    it('shoud call the client callback with success message', (done) => {
      // Arrange
      const data = 'test-data';
      const clientCb = (message) => {
        // Assert
        expect(message.success).to.be.true;
        expect(message.data).to.equal(data);
        done();
      };
      // Act
      ResponseHelper.success(data, clientCb);
    });

    it('test to cover no clientCb path', () => {
      const data = 'test-data';
      ResponseHelper.success(data);
    });
  });

  describe('failure()', () => {
    it('shoud call the client callback with failure message', (done) => {
      // Arrange
      const error = 'test-error';
      const clientCb = (message) => {
        // Assert
        expect(message.success).to.be.false;
        expect(message.data.error).to.equal(error);
        done();
      };
      // Act
      ResponseHelper.failure(error, clientCb);
    });

    it('test to cover no clientCb path', () => {
      const error = 'test-error';
      ResponseHelper.failure(error);
    });
  });
});
