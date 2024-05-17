import { localAxios } from "@/util/http-commons.js";

const local = localAxios();

async function signUpAPI(user, success, fail) {
    await local.post('/auth/sign-up', user).then(success).catch(fail);
}

async function sendVerificationCodeAPI(email, success, fail) {
    await local.post('/auth/email/auth', email).then(success).catch(fail);
}

async function emailVerifyAPI(auth, success, fail) {
    await local.get('/auth/email/verification', { params: {'emailAuthNumberId': auth.emailAuthNumberId, 'authNumber': auth.authNumber}}).then(success).catch(fail);
}

export { signUpAPI, sendVerificationCodeAPI, emailVerifyAPI };