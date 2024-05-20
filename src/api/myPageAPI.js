import { localAxios } from "@/util/http-commons.js";

const local = localAxios();

async function updatePassword(updatePasswordForm, success, fail) {
    local.defaults.headers["Authorization"] = localStorage.getItem("accessToken");
    await local.patch(`/user/password`, updatePasswordForm).then(success).catch(fail);
}

async function updateNickName(newNickNameForm, success, fail) {
    local.defaults.headers["Authorization"] = localStorage.getItem("accessToken");
    await local.patch(`/user/nickName`, newNickNameForm).then(success).catch(fail);
}

async function updateIntroduction(newIntroductionForm, success, fail) {
    local.defaults.headers["Authorization"] = localStorage.getItem("accessToken");
    await local.patch(`/user/introduction`, newIntroductionForm).then(success).catch(fail);
}

async function updateProfileImage(file, success, fail) {
    const formData = new FormData();
    formData.append('file', file);

    await local.post('/user/profile', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `${localStorage.getItem("accessToken")}`
        }
    }).then(success).catch(fail)
}

export { updatePassword, updateNickName, updateIntroduction, updateProfileImage };