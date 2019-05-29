"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var prettier = require('prettier/standalone');

var plugins = [require('prettier/parser-babylon')];

var Terser = require('terser');

var flowPlugin = require('@babel/plugin-transform-flow-strip-types');

var plugin = require('./babel');

var makeWrapper = require('./wrapper');

var _require = require('./transform'),
    transform = _require.transform,
    babelify = _require.babelify;

var _require2 = require('./common'),
    getWhiteListModules = _require2.getWhiteListModules,
    setWhiteListModules = _require2.setWhiteListModules,
    addWhiteListModule = _require2.addWhiteListModule,
    removeWhiteListModule = _require2.removeWhiteListModule;

var transpile =
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee(src) {
    var options,
        _options$minify,
        minify,
        _options$minifyOpts,
        minifyOpts,
        _options$prettier,
        prettier,
        _options$prettierOpts,
        prettierOpts,
        _options$context,
        context,
        project,
        _args = arguments;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            options = _args.length > 1 && _args[1] !== undefined ? _args[1] : {};
            _options$minify = options.minify, minify = _options$minify === void 0 ? false : _options$minify, _options$minifyOpts = options.minifyOpts, minifyOpts = _options$minifyOpts === void 0 ? {} : _options$minifyOpts, _options$prettier = options.prettier, prettier = _options$prettier === void 0 ? false : _options$prettier, _options$prettierOpts = options.prettierOpts, prettierOpts = _options$prettierOpts === void 0 ? {} : _options$prettierOpts, _options$context = options.context, context = _options$context === void 0 ? '/' : _options$context, project = options.project; // The decorated plugins should append this, but for now we add here to simplify
            // src += ';const __contract = new __contract_name();const __metadata = {}'
            // then, babelify it

            src = babelify(src, [plugin]); // remove flow types

            src = babelify(src, [flowPlugin]); // don't know, maybe babel not support decorators along to private property

            _context.next = 6;
            return transform(src, context, project);

          case 6:
            src = _context.sent;
            // finally, wrap it
            src = makeWrapper(src).trim(); // preparation for minified

            src = prettify(src, {
              semi: true
            });

            if (prettier) {
              src = prettify(src, prettierOpts);
            } else if (minify) {
              src = doMinify(src, minifyOpts);
            } // console.log(src)


            return _context.abrupt("return", src);

          case 11:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function transpile(_x) {
    return _ref.apply(this, arguments);
  };
}();

function prettify(src) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return prettier.format(src, {
    parser: 'babel',
    plugins: plugins
  });
}

function doMinify(src) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var result = Terser.minify(src, (0, _objectSpread2["default"])({
    parse: {
      bare_returns: true
    },
    keep_classnames: true,
    keep_fnames: true
  }, opts));

  if (result.error) {
    throw new Error(JSON.stringify(result.error));
  }

  return result.code;
}

module.exports = {
  transpile: transpile,
  addWhiteListModule: addWhiteListModule,
  removeWhiteListModule: removeWhiteListModule,
  getWhiteListModules: getWhiteListModules,
  setWhiteListModules: setWhiteListModules
};