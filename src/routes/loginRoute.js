const axios = require('axios');

module.exports = function(app){
    const loginController = require('../controllers/loginController');
    const google = require('googleapis');
    var googleClient = require('../../config/google.json');

    const googleConfig = {
        clientId: googleClient.web.client_id,
        clientSecret: googleClient.web.client_secret,
        redirect: googleClient.web.redirect_uris[0]
    };

    const scopes = [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
    ];

    const oauth2Client = new google.Auth.OAuth2Client(
        googleConfig.clientId,
        googleConfig.clientSecret,
        googleConfig.redirect
    );

    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes
    });

    async function getGooglePlusApi(auth) {
        return google.plus_v1;
    }

    async function googleLogin(code) {
        const {tokens} = await oauth2Client.getToken(code);

        // Fetch the user's profile with the access token and bearer
        // bearer 이 머고? ********
        console.log(tokens);
        const googleUser = await axios
        .get(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokens.access_token}`,
        {
            headers: {
            Authorization: `Bearer ${tokens.id_token}`,
            },
        },
        )
        .then(res => res.data)
        .catch(error => {
        throw new Error(error.message);
        });

        return googleUser;
    }

    app.post('/signup', loginController.signup);
    app.get('/logout', loginController.logout);
    app.get('/check', loginController.checkLoginState);
    // label login
    // app.post('/login', loginController.login);
    // google login
    app.get('/login', function (req, res) {
        console.log('login start')
        res.redirect(url);
    });
      
    app.get("/auth/google/login/callback", async function (req, res) {
        const googleUser = await googleLogin(req.query.code);
        req.session.userId = googleUser.userId;
        req.session.is_logined = true;
        console.log(finish)
        res.redirect("http://localhost:3000");
    });
};