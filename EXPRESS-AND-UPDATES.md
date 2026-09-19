<!-- Dated: 19-09-2026 -->
Here, we will write the changes made to the package.json file. The express version has been updated from "^5.1.0" to "^5.2.1".
Due to this update the mongo connectio to express was failing. So, now we will update the code in app.js file to use the new version of express. The changes are as follows:

- Changes all the require statements to import statements.
- Changes the way to import the express module.
- Changes the way to import the mongoose module.
- Changes the way to import the session module.
- Changes the way to import the connect-mongo module.
- Changes the way to import the passport module.
- Changes the way to import the flash module.
- Changes the way to import the method-override module.
- Changes the way to import the path module.
- Changes the way to import the fileURLToPath module.
- Chnages the way to import the dotenv module.
- Changes the way to import the ejs-mate module.
- Changes the way to import the helmet module.
- Changes the way to import the express-mongo-sanitize module.
- Changes the way to import the route module.
- Changes the way to import the public module.
- Changes the way to import the userController module.
- Changes the way to import the wrapAsync module.
- Changes the way to import the storeReturnTo module.
- Changes the way to import the login module.
- Changes the way to import the logout module.
- Changes the way to import the getNavLinkColor module.
- Changes the way to import the getNavToggleColor module.
- Changes the way to import the icons module.
- Changes the way to import the bookJson module.
- Changes the way to import the readingBlissRoutes module.
- Changes the way to import the userRoutes module.
- Changes the way to import the recommendRoutes module.
- Changes the way to import the connectToCustomerRoutes module.
- Changes the way to import the User model.
- Changes the way all the files and folders are imported across files. Now, we are using the import statement instead of require statement.


Getting issue with <Incomingmessage>, the issue was express-mongo-sanitize@2.2.0 conflicting with Express 5 because it tried to overwrite read-only req.query.
- We have updated the code in the views/layout/boilerplate.ejs and views/layout/imageBoilerPlate.ejs files to check if the currentUser is defined or not before checking if it is truthy. This is to avoid any errors that may occur if currentUser is undefined. The UI will now check if currentUser is defined and truthy before rendering the navbar for logged in users and show the error notification if currentUser is undefined.
- Updated the mongoSanitize middleware in app.js to sanitize the request body, params, headers, and query parameters. This is to prevent any malicious code from being executed on the server. The sanitize options have been set to replace any special characters with '--'.
- Updated mongoose connection to remove the email validation error. The problem was a stale MongoDB index, not your current schema.

MongoDB had this old unique index:
`emailId_1`

Since emailId no longer exists, every new user had emailId: null, causing the duplicate error.

I removed the obsolete index. Current users indexes are now:
```
_id_
username_1
```
The MongoDB change was made directly in the database, not in a source file:

```
await mongoose.connection.collection("users").dropIndex("emailId_1");
```

MongoDB was changed directly by running a Node.js command that connects to the database and drops the old index:
```
node --input-type=module -e "import mongoose from 'mongoose'; await mongoose.connect('mongodb://127.0.0.1:27017/reading-bliss'); await mongoose.connection.collection('users').dropIndex('emailId_1'); console.log('Index removed'); await mongoose.connection.close();"
```
- Images were not loading because we have not allowed path:
The browser is blocking Bootstrap because your CSP allows cdn.jsdelivr.net for scripts but not for stylesheets. I’ll add jsDelivr to the existing style source allowlist, then verify the app still starts and the gallery response succeeds.
- *Error: Must supply api_key* -> The issue was caused by dotenv loading too late. Cloudinary was configured before .env values were available, so api_key was undefined. Added dotenv.config() to the top of cloudinary/index.js to fix this. Now, the Cloudinary configuration is loaded after the .env values are available, so the api_key is defined correctly.
