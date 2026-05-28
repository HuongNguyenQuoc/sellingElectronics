const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next); // The function Promise.resolve will run the function fn(req, res, next) be called
  // and return one value that you want. If it call one of the another promise return promise be called it.
}

module.exports = asyncHandler;