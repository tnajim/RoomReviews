# RoomReviews
Personal fullstack project for testing.

[RoomReviews](https://roomreviews.onrender.com/) is an online directory for discovering local hotels and reviewing them, similar to yelp

App built with MongoDB, Express and Node.js stack

## Implemented features
- Full CRUD for the Hotel model
- Database seeding
- Express routers and controllers
- Templating and partials using [ejs](https://www.npmjs.com/package/ejs) and [ejs-mate](https://www.npmjs.com/package/ejs-mate)
- Custom error handling middleware
- Client-side form validations and back-end [JOI schema](https://www.npmjs.com/package/joi) validations
- Hotel, Review and User models
- [Express Sessions](https://www.npmjs.com/package/express-session)
- User model using [passport.js](https://www.passportjs.org/) package to salt and hash passwords
- Basic authentication and route authorization
- Image uploading using [multer](https://www.npmjs.com/package/multer) and [cloudinary](https://cloudinary.com/)
- Maps using [mapbox](https://www.mapbox.com/)
- Basic website security ([sanitize-html](https://www.npmjs.com/package/sanitize-html) for xss, [helmet](https://www.npmjs.com/package/helmet) package for protecting http headers and whitelisting allowed resources)
- [connect-mongo](https://www.npmjs.com/package/connect-mongo) used for the session store
- Deployed using Render, [RoomReviews](https://roomreviews.onrender.com/)

### to do list: 
- add password constraints when registering
- add limit to how many images can be uploaded and limit file size
- add default geodata/flash message in case location could not be found on mapbox (\controllers\hotels.js:22:47))
- flash message on same page instead of redirecting to error.ejs
- limit review display on hotel show page
