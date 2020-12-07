'use strict';
const { OK } = require("../helpers/http.status")
const { ErrorHandler } = require("../helpers/error")

exports.REQUEST_HANDLER = async (res, next, handler, params) => {
   try {
      let resp = await handler(...params)
      if (resp.error) throw new ErrorHandler(resp.errorCode, resp.message)
      res.status(OK).json(resp.data)
   }
   catch (error) { next(error) }
}