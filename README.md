# Project Description

Full MERN stack app with the login functionality, in which users can log in and share their news with other users. Users also can change their basic info and passwords, and edit and delete their own posts. This app was made in accordance with design from adobexd file in this directory.

Login is done with JWT using refresh tokens technique which sends access tokens to users and stores them in memory (RAM), without storing them in localStorage or anything else, and when they expire, user's requests will bounce, at which point the response from server will be intercepted (with the help from axios) and new access token will be requested from server, using refresh token. If refresh token is valid (after lookup in DB) - new access token will be generated and sent... Users can also persist their state by checking Remember me when logging in, and if they do, their state will persist even if they leave site, close browser, etc. If they chose not, their sessions are only valid for as long as they don't leave the site.

refresh.js file in controllers/api/v1/auth has 3 different implementations of refreshing tokens: first - where refresh token is valid for a specific number of days (or time in general), and after that it expires and users must log in again, second - where refresh token is rotated (replaced) after each usage, and third - where token is valid for some period of time, but is rotated after another shorter period of time has expired, allowing it's rotation not to be too heavy on db and bandwidth, but also alowing recurring users to keep their log in state forever, without needing to enter their pw again and again...

# RUN

To run the project, first install all dependencies from the main folder:

`npm i` 

Then do the same in views (where Create-React-App is located):

`cd views && npm i`

Then add .env file with 3 variables: 

MONGO_URI(with your own mongo atlas uri), ACCESS_TOKEN_SECRET(random long string as a secret for creating and verifying access tokens), and REFRESH_TOKEN_SECRET(random long string as a secret for creating and verifying refresh tokens)

Finally, to concurrently run both server and react app, run the command bellow FROM THE MAIN FOLDER:

`npm run dev`