const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/*
Print notice error into screen and set status equal 404
and then transfer this error down errorHandler below
*/

// Middle resolve all of error remain
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    /*
    This line: means check if the app already been in production yet? If not will show the error onto the terminal,
    otherwise will hide it to avoid hacker can read the error
    */
  });
};

module.exports = { notFound, errorHandler }
