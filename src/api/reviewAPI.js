import { localAxios } from "@/util/http-commons.js";

const local = localAxios();

async function writeReview(writeReviewForm, success, fail) {
    const formData = new FormData();
    formData.append('contentId', writeReviewForm.contentId);
    formData.append('tripDetailId', writeReviewForm.tripDetailId);
    formData.append('content', writeReviewForm.content);
    formData.append('star', writeReviewForm.star);

    writeReviewForm.reviewImageList.forEach((image, index) => {
        formData.append(`reviewImageList[${index}]`, image);
    });

    writeReviewForm.reviewTagList.forEach((tag, index) => {
        formData.append(`reviewTagList[${index}]`, tag);
    })

    await local.post(`/review`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `${localStorage.getItem("accessToken")}`
        }
    }).then(success).catch(fail)
}

async function getReviews(params, success, fail, final) {
    local.get(`/review`, { params: { page: params.page, size: params.size, keyword: params.keyword, category: params.category } }).then(success).catch(fail).finally(final);
}

async function getComments(reviewId, params, success, fail, final) {
    local.get(`/review/${reviewId}/comment`, { params: { page: params.page, size: params.size } }).then(success).catch(fail).finally(final);
}

async function likeReview(reviewId, success, fail) {
    local.defaults.headers["Authorization"] = localStorage.getItem("accessToken");
    local.patch(`/review/${reviewId}/like`).then(success).catch(fail);
}

async function writeCommentReply(reviewId, commentId, reply, success, fail) {
    local.defaults.headers["Authorization"] = localStorage.getItem("accessToken");
    local.post(`/review/t${reviewId}/comment/${commentId}/reply`, reply).then(success).catch(fail);
}

async function writeComment(reviewId, comment, success, fail) {
    local.defaults.headers["Authorization"] = localStorage.getItem("accessToken");
    local.post(`/review/${reviewId}/comment`, comment).then(success).catch(fail);
}

async function getReviewById(reviewId, success, fail) {
    local.get(`/review/${reviewId}`).then(success).catch(fail);
}

async function getReviewByUserId(userId, success, fail) {
    local.get(`/review/user/${userId}`).then(success).catch(fail);
}

async function deleteReview(reviewId, success, fail) {
    local.defaults.headers["Authorization"] = localStorage.getItem("accessToken");
    local.delete(`/review/${reviewId}`).then(success).catch(fail);
}

async function updateReview(reviewId, reviewData, success, fail) {
    const formData = new FormData();

    formData.append('content', reviewData.content);
    formData.append('star', reviewData.star);

    reviewData.reviewImageList.forEach((image, index) => {
        formData.append(`reviewImageList[${index}]`, image);
    });

    reviewData.reviewTagList.forEach((tag, index) => {
        formData.append(`reviewTagList[${index}]`, tag);
    })

    local.put(`/review/${reviewId}`, reviewData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `${localStorage.getItem("accessToken")}`
        }
    }).then(success).catch(fail);
}

export {
    writeReview,
    getReviews,
    getComments,
    likeReview,
    writeCommentReply,
    writeComment,
    getReviewById,
    deleteReview,
    updateReview,
    getReviewByUserId
}