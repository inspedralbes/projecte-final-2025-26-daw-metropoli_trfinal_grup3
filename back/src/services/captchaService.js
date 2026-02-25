const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET_KEY || '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe'; // Test secret

const verifyCaptcha = async (token) => {
    if (!token) {
        throw new Error('Captcha token is missing');
    }

    try {
        const response = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET}&response=${token}`, {
            method: 'POST',
        });

        const data = await response.json();

        if (!data.success) {
            console.error('reCAPTCHA verification failed:', data['error-codes']);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error verifying reCAPTCHA:', error);
        return false;
    }
};

export default { verifyCaptcha };
