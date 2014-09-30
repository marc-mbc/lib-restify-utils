'use strict';
module.exports.init = function(log) {
  var restify = require('restify');
  
  return {
    /*
     *  RESTIFY
     */

    //PARAMS
    getParam: function (req, name, defaultValue) {
      if (defaultValue !== undefined) {
        req.params[name] = req.params[name] ? req.params[name] : defaultValue;
      }
      return req.params[name];
    },

    //FILES
    getFile: function (req, name) {
      return req.files[name];
    },

    //HEADERS
    getAuthorization: function (req, name, defaultValue) {
      return req.authorization[name] || defaultValue;
    },

    //RESPONSE
    
    //http://stackoverflow.com/questions/10973479/how-do-you-send-html-with-restify
    sendHTML: function (res, result) {
      if (!res._headerSent) {
        res.writeHead(200, {
          'Content-Length': Buffer.byteLength(result),
          'Content-Type': 'text/html'
        });
        res.write(result);
        res.end();
      }
      else {
        log.error('Error Already send', result);
        res.end();
      }
    },

    //http://www.restapitutorial.com/lessons/httpmethods.html
    sendOk: function (res, result) {
      if (!res._headerSent) res.send(200, result);
      else {
        log.error('Error Already send', result);
        res.end();
      }
    },

    sendRedirect: function (res, url) {
      if (!res._headerSent) {
        res.header('Location', url);
        res.send(302);
      }
      else {
        log.error('Error Already send, redirect to ', url);
        res.end();
      }
    },

    sendCreated: function (res, result) {
      if (!res._headerSent) res.send(201, result);
      else {
        log.error('Error Already send', result);
        res.end();
      }
    },

    sendUpdated: function (res, result) {
      var code;
      if (!result) code = 204;
      else code = 201;
      if (!res._headerSent) res.send(code, result);
      else {
        log.error('Error Already send', result);
        res.end();
      }
    },

    sendInternalError: function (res, err) {
      if (!res._headerSent) {
        log.error(err);
        res.send(500, new restify.InternalError('Oops, internal error :S'));
      }
      else {
        log.error('Error Already send', err);
        res.end();
      }
    },

    sendInvalidArgumentError: function (res, err) {
      var logErr = err;
      if (typeof err !== 'string') {
        if(err.message && typeof err.message === 'string') err = err.message;
        else if (typeof err.success !== undefined) err = 'Oops, invalid argument backend error';
        else err = 'Oops, invalid argument error';
      }
      if (!res._headerSent) {
        log.error(logErr);
        res.send(400, new restify.InvalidArgumentError(err));
      }
      else {
        log.error('Error Already send', logErr);
        res.end();
      }
    },

    sendUnauthorizedError: function (res, err) {
      if (!res._headerSent) {
        log.error(err);
        res.send(401, new restify.UnauthorizedError(err));
      }
      else {
        log.error('Error Already send', err);
        res.end();
      }
    },

    sendInvalidCredentialsError: function (res, err) {
      if (!res._headerSent) {
        log.error(err);
        res.send(401, new restify.InvalidCredentialsError(err));
      }
      else {
        log.error('Error Already send', err);
        res.end();
      }
    },

    sendForbiddenError: function (res, err) {
      if (!res._headerSent) {
        log.error(err);
        res.send(403, new restify.ForbiddenError(err));
      }
      else {
        log.error('Error Already send', err);
        res.end();
      }
    }
  };
};
