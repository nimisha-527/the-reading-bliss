# Reading Bliss

## Project Overview

Reading Bliss is the library website. It hosts the books of the user/owner.

### Key Features

- Create your own space by registering in website and adding your favourite reads.
- User Authentication: Secure login system with roles (admin/user).
- **Registered User**:
  - Adding Books:
    - Fill a form containing book title, author, description, image upload(using cloudinary to store images) and category for book genre.
  - Update and Delete the books added by you.
  - Add reviews and recommendation for the books.
- **Non-Registered User**:
  - Browse the books that has catched your attention.
  - Add reviews.

<hr style="border:2px solid gray">  

## 🚀 Current Development Progress

### Backend (Express + MongoDB) ✅

- Mongo backend initialized.
- API endpoints for authentication.
- Using express route as middleware and routing functions to create modular and mountable route handlers.

### Frontend (Javascript + Bootstrap + EJS) ✅

- Javascript, EJS frontend initialized.
- Connected UI to API.
- UI designed for Authentication.

<hr style="border:2px solid gray">

# Getting Started

 # 1. Setup
 Install below packages:
 > - MongoDb
 > - Nodejs

 # 2. Clone the repository
	https://github.com/nimisha-527/the-reading-bliss.git
	cd reading-bliss

 # 3. Run the project
    - nodemon app.js (to run the project)
  	- mongosh (to run local database)
   ## .env setup
   You will need to setup the .env to run the project:
   - Create a cloudinary account
    - Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_KEY, CLOUDINARY_SECRET.
   - Create a Mongo Atlas account to connect your Database and set network (add your current IP address).  
    - DB_URL(this you will get when you will connect your project in the Mongo Atlas).


# Tech Stack
- *Frontend*: Javascript, EJS, BootStrap, HTML, CSS-SCSS
- *Database*: MongoDB, Mongoose
- *Backend*: ExpressJs
- *Storage*: Cloudinary

# Future Roadmap

- Optimizing the code.
- Add email/phone login, to connect the website with user email/phone.
- Feature to update password.
- Allow user to add the book which is recommended by others in their section.
- Work on advanced animations.
- User-friendly UI improvements.

<hr style="border:2px solid gray">

<br>
This is a project in active development. Feel free to submit issues or suggestions!

### Stay tuned for updates and feature improvements!

 
