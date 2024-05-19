import { localAxios } from "@/util/http-commons";

const local = localAxios()

async function getMessages(tripDetailid, param, success, fail) {
    await local.get(`/chat/${tripDetailid}`, { params: { page: param.page, size: param.size } }).then(success).catch(fail);
}

export { getMessages }