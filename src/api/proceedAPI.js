import { localAxios } from "@/util/http-commons.js";

const local = localAxios();

async function isPoceedTrip(userId, success, fail) {
    local.get(`/trip/proceed/${userId}`).then(success).catch(fail);
}

export { isPoceedTrip }