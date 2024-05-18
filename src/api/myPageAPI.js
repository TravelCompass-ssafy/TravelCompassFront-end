import { localAxios } from "@/util/http-commons.js";

const local = localAxios();

async function updatePassword(updatePasswordForm, success, fail) {
    local.defaults.headers["Authorization"] = sessionStorage.getItem("accessToken");
    await local.patch(`/user/password`, updatePasswordForm).then(success).catch(fail);
}

export { updatePassword };