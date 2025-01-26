**#Public**

**LINK**: https://expressjs.com/en/starter/static-files.html

- To serve static files such as images, CSS files, and JavaScript files, use the `express.static` built-in middleware function in Express.

- The root argument specifies the root directory from which to serve static assets. For more information on the options argument, see `express.static`.
    For example, use the following code to serve images, CSS files, and JavaScript files in a directory named public:
    `app.use(express.static('public'))`

- To use multiple static assets directories, call the express.static middleware function multiple times:
    `app.use(express.static('public'))`
    `app.use(express.static('files'))`