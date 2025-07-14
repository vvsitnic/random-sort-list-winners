# random-sort-list-winners

This web application is to retrieve html table from a website.
It is powered by NodeJS, and is transpiled by Parcel.

To host it, it would be preferable to use netlify as a hosting platform.
The main reason to do it is the price factor, and the CORS issue that prevents client to access other websites directly to prevent code injections and malicious attacks.
To safly bypass it, the netlify serverless service comes into clutch by providing proxy between the client and website.

## Instalation and deployment

Due to the fact that this app takes advantage of netlify serverless, simply running `npm run dev` on a local machine will not work. For this reason the best option would be to connect netlify to your github repo or manually upload application files to netlify.
