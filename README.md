# RoomReviews
Personal Full Stack Project

[RoomReviews](https://roomreviews.onrender.com/) is an online directory for discovering local hotels and reviewing them, similar to yelp

Live Website Link: [RoomReviews](https://roomreviews.onrender.com/) (takes time to load using free hosting on render)

App was built using MongoDB, Express and Node.js stack

![homepage](https://github.com/tnajim/RoomReviews/assets/47018694/6fe7bf6b-580b-4d18-9dac-d7047e660d0d)

## Implemented features
- Full CRUD for the Hotel, Review and User model
- Express routers and controllers
- Authentication and Route Authorization
- Custom error handling middleware
- Client-side form validations and back-end [JOI schema](https://www.npmjs.com/package/joi) validations
- Basic website security ([sanitize-html](https://www.npmjs.com/package/sanitize-html) for xss protection, [helmet](https://www.npmjs.com/package/helmet) package for protecting http headers and whitelisting allowed resources)
- Front-End made with Templating and Partials using [ejs](https://www.npmjs.com/package/ejs) and [ejs-mate](https://www.npmjs.com/package/ejs-mate)
- [Express Sessions](https://www.npmjs.com/package/express-session)
- User model using [passport.js](https://www.passportjs.org/) package to salt and hash passwords
- Image uploading using [multer](https://www.npmjs.com/package/multer) and [cloudinary](https://cloudinary.com/)
- Maps using [mapbox](https://www.mapbox.com/)
- [connect-mongo](https://www.npmjs.com/package/connect-mongo) used for the session store
- Hotels pagination and search bar to search using hotel name or location
- Database seeding
- Deployed using Render, [RoomReviews](https://roomreviews.onrender.com/)

### to do list: 
- add password constraints when registering (regex maybe)
- add limit to how many images can be uploaded and limit file size (check cloudinary settings)
- add default geodata/flash message in case location could not be found on mapbox (\controllers\hotels.js:22:47))
- flash message on same page instead of redirecting to error.ejs
- limit review display on hotel show page (implement pagination)

### Hotels
![hotels](https://github.com/tnajim/RoomReviews/assets/47018694/114816ad-b21e-4f15-a1ea-65aa80ffa6e6)
### View Hotel
![hotel1](https://github.com/tnajim/RoomReviews/assets/47018694/9b33a26d-a3e7-4b3a-aa26-8d1b8de1268f)
### Login
![login](https://github.com/tnajim/RoomReviews/assets/47018694/81ffa05e-cc9e-461c-a8b2-274f341ba11e)
### Signup
![signup](https://github.com/tnajim/RoomReviews/assets/47018694/1ffbc606-479b-49ff-8eef-1885dc3f0ffa)
### New Hotel
![newhotel](https://github.com/tnajim/RoomReviews/assets/47018694/ca42141a-796f-4c41-a8c5-dfae6043f7c3)
### Edit Hotel
![hoteledit](https://github.com/tnajim/RoomReviews/assets/47018694/fccd6396-f613-4821-964e-0f270e6cb97d)
### Editing Hotel as the Author
![hotel1admin2](https://github.com/tnajim/RoomReviews/assets/47018694/fd60b6a4-a082-4bba-bfcf-422afe340b7a)


