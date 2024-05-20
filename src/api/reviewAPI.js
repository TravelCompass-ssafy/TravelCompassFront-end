import { localAxios } from "@/util/http-commons.js";

const local = localAxios();

async function writeReview(writeReviewForm, success, fail) {
    console.log(writeReviewForm);

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

export { writeReview }