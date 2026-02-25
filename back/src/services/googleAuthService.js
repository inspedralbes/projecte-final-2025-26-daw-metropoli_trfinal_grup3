import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client();

/**
 * Verify Google ID Token or Access Token
 * For useGoogleLogin with 'code' or implicitly with 'accessToken', 
 * we usually get an access_token. To get user info, we can use Google's userinfo endpoint.
 */
const verifyGoogleToken = async (accessToken) => {
    try {
        const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`);
        
        if (!response.ok) {
            throw new Error('Failed to verify Google token');
        }

        const payload = await response.json();
        
        // payload contains: sub (id), name, email, picture, etc.
        return {
            googleId: payload.sub,
            email:    payload.email,
            nombre:   payload.name,
            foto:     payload.picture
        };
    } catch (error) {
        console.error('Error verifying Google token:', error);
        throw new Error('Invalid Google token');
    }
};

export default { verifyGoogleToken };
