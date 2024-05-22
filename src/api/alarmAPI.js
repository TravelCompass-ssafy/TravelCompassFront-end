import axios from 'axios';

const { VITE_VUE_SSE_URL } = import.meta.env;

async function joinTripAlaram(tripDetailId, success, fail) {
    await axios.post(`${VITE_VUE_SSE_URL}/sse/joinTrip/trip/${tripDetailId}`).then(success).catch(fail);

}

export { joinTripAlaram };