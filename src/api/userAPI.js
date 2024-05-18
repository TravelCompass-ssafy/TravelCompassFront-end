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

async function userConfirm(param, success, fail) {
    await local.post(`/auth/login`, param).then(success).catch(fail);
  }
  
  async function findById(userid, success, fail) {
    local.defaults.headers["Authorization"] = sessionStorage.getItem("accessToken");
    await local.get(`/auth/info/${userid}`).then(success).catch(fail);
  }
  
  async function tokenRegeneration(user, success, fail) {
    local.defaults.headers["refreshToken"] = sessionStorage.getItem("refreshToken");
    await local.post(`/auth/refresh`, user).then(success).catch(fail);
  }
  
  async function logout(userid, success, fail) {
    await local.get(`/auth/logout/${userid}`).then(success).catch(fail);
  }

export { signUpAPI, sendVerificationCodeAPI, emailVerifyAPI, userConfirm, findById, tokenRegeneration, logout };