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
  local.defaults.headers["Authorization"] = localStorage.getItem("accessToken");
  await local.get(`/auth/info/${userid}`).then(success).catch(fail);
}
  
async function tokenRegeneration(user, success, fail) {
  local.defaults.headers["refreshToken"] = localStorage.getItem("refreshToken");
  await local.post(`/auth/refresh`, user).then(success).catch(fail);
}
  
async function logout(userid, success, fail) {
  await local.get(`/auth/logout/${userid}`).then(success).catch(fail);
}

async function findEmailAPI(user, success, fail) {
  await local.get(`/auth/email/find`, { params: { nickName: user.nickName, birthday: user.birthday } }).then(success).catch(fail);
}

async function resetPasswordAPI(email, success, fail) {
  await local.patch(`/auth/resetPassword`, email).then(success).catch(fail);
}
  
async function isEmailExistsAPI(param, success, fail) {
  await local.get(`/auth/emailCheck`, { params: { email: param.email } }).then(success).catch(fail);
}

async function isNickNameExistsAPI(param, success, fail) {
  await local.get(`/auth/nickNameCheck`, { params: { nickName: param.nickName } }).then(success).catch(fail);
}

export {
  signUpAPI,
  sendVerificationCodeAPI,
  emailVerifyAPI,
  userConfirm,
  findById,
  tokenRegeneration,
  logout,
  findEmailAPI,
  resetPasswordAPI,
  isEmailExistsAPI,
  isNickNameExistsAPI
};