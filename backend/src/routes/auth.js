const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

const BASE = process.env.BACKEND_URL || 'http://localhost:5000';
const FRONTEND = process.env.FRONTEND_URL || 'http://localhost:3000';

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${BASE}/auth/google/callback`
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const { id, displayName, emails, photos } = profile;
    const email = emails?.[0]?.value;
    let user = await User.findOne({ googleId: id });
    if (!user) {
      user = new User({
        googleId: id,
        name: displayName,
        email,
        avatar: photos?.[0]?.value
      });
      await user.save();
    }
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

/**
 * @route GET /auth/google
 * Start Google OAuth
 */
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

/**
 * @route GET /auth/google/callback
 * OAuth callback
 */
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
  // issue JWT cookie
  const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.cookie('token', token, { httpOnly: true, sameSite: 'lax' });
  res.redirect(`${FRONTEND}/dashboard`);
});

router.get('/logout', (req, res) => {
  res.clearCookie('token');
  req.logout(() => {});
  res.json({ ok: true });
});

module.exports = router;
