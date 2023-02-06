import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

//serialize user
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

//deserialize user
passport.deserializeUser((user: any, done) => {
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env..GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "http://localhost:3000/auth/google/callback",
      passReqToCallback: true,
    },
    function (request, accessToken, refreshToken, profile, done) {
      console.log(profile, "profile");

      //check if the user is registered using User model(to be created)
      User.findOne(
        { googleId: profile.id },
        async function (err: Error, user: any) {
          if (!user) {
            //if user is not in the system, create new user
            user = new user({ googleId: profile.id }, async function (
              err: Error,
              user: any
            ) {
              //save new user to db
              await user.save();
              return done(err, user);
            });
          }
        }
      );
    }
  )
);
