const app = require('./index.js');
// Needed to deal with DEPTH_ZERO_SELF_SIGNED_CERT error with Heroku
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
app.listen(process.env.PORT || 5000, () => {
    console.log("Server up and running on port: " + (process.env.PORT || 5000));
});