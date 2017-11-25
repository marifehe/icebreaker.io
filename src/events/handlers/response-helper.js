'use strict';

class ResponseHelper {
  static success(data, _clientCb) {
    const clientCb = _clientCb || (() => {});
    const responseMessage = {
      success: true,
      data
    };
    clientCb(responseMessage);
  }

  static failure(error, _clientCb) {
    const clientCb = _clientCb || (() => {});
    const responseMessage = {
      success: false,
      data: { error }
    };
    clientCb(responseMessage);
  }
}

module.exports = ResponseHelper;