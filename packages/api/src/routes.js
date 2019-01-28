const express = require('express');
const { connectFacebook } = require('./connect/facebook');
const { connectGoogle } = require('./connect/google');
const { twitterRequestToken, connectTwitter } = require('./connect/twitter');
const { connectEmail, connectEmailCallback } = require('./connect/email');
const { guestToken, guestVerifications } = require('./guest');

const router = express.Router();

router.get('/', (req, res) => {
  OK(res);
});

router.post('/connect/facebook', connectFacebook);
router.post('/connect/google', connectGoogle);
router.get('/connect/twitter/oauth-token', twitterRequestToken);
router.post('/connect/twitter', connectTwitter);
router.post('/connect/email', connectEmail);
router.post('/connect/email/callback', connectEmailCallback);

router.get('/guest/token', guestToken);
router.post('/guest/verifications', guestVerifications);

module.exports = router;
