<script setup>
import { localAxios } from "@/util/http-commons.js"
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { userStore } from '@/stores/userStore.js'
import { Modal } from 'bootstrap';

const { VITE_VUE_IMG_URL } = import.meta.env;

const http = localAxios();
const route = useRoute();
const router = useRouter();
const store = userStore();

const reviews = ref([]);
const selectedReview = ref({
    profile: ""
});
let modalInstance = null;

onMounted(() => {
    getTripDetail();
    upCountView();
    const modalEl = document.getElementById('reviewModal');
    if (modalEl) {
        modalInstance = new Modal(modalEl);
    }
})

const upCountView = () => {
    http.put(`/trip/view/${route.params.tripDetailId}`)
        .then((response) => {
        })
        .catch((error) => {
            console.log(error);
        });
}

const tripDetail = ref({});

const getTripDetail = () => {
    http.get(`/trip/${route.params.tripDetailId}`)
        .then((response) => {
            tripDetail.value = response.data;
            getReviews();
        })
        .catch((error) => {
            console.log(error);
        });
}

const joinAble = ref(false);

const joinTrip = async () => {
    const joinParams = {
        userId: store.userInfo.userId,
        startDate: tripDetail.value.startDate,
        endDate: tripDetail.value.endDate
    }

    http.get("/trip/checkjoinable", { params: joinParams })
        .then((response) => {
            joinAble.value = response.data;

            if (tripDetail.value.memberList.length >= tripDetail.value.maxCapacity) {
                alert("정원이 초과되었습니다!");
                return;
            }

            if (tripDetail.value.memberList.some(member => member.userId === store.userInfo.userId)) {
                alert("이미 참가하였습니다. ");
                return;
            }

            if (!joinAble.value) {
                alert("중복된 일정이 있습니다!");
                return;
            }

            const tripDetailMemberDto = {
                tripDetailId: tripDetail.value.tripDetailId,
                userId: store.userInfo.userId,
                nickname: tripDetail.value.nickname
            }

            http.post(`/trip/${tripDetail.value.tripDetailId}`, tripDetailMemberDto, {
                headers: {
                    'Authorization': `${localStorage.getItem("accessToken")}`
                }
            })
                .then((response) => {
                    getTripDetail();
                    alert("동행하였습니다!");
                })
                .catch((error) => {
                    console.log(error);
                    alert("동행실패!");
                });
        })
}

const getReviews = () => {
    http.get(`/review/trip/${route.params.tripDetailId}`)
        .then((response) => {
            reviews.value = response.data;
        })
        .catch((error) => {
            console.log(error);
        });
};

const showModal = (review) => {
    selectedReview.value = review;
    if (modalInstance) {
        modalInstance.show();
    }
};

const deleteTrip = () => {
    http.delete(`/trip/${tripDetail.value.tripDetailId}`)
        .then((response) => {
            console.log("삭제완료");
            router.push({ name:'share-list' });
        })
        .catch((error) => {
            console.log(errer);
        })
}

</script>

<template>
    <div class="container mt-4">
        <div class="row">
            <div class="col-md-12">
                <div class="card mb-4">
                    <img :src="VITE_VUE_IMG_URL + '/' + tripDetail.imagePath" class="card-img-top img-fluid"
                        alt="Trip Image" style="max-height: 300px; object-fit: cover;">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center">
                            <h3 class="card-title m-0">{{ tripDetail.title }}</h3>
                            <template v-if="tripDetail.userId === store.userInfo.userId">
                                <button type="button" @click="deleteTrip" class="btn btn-danger btn-sm">삭제</button>
                            </template>
                        </div>
                        <div class="mb-3">
                            <div class="d-flex flex-column align-items-start">
                                <div>{{ tripDetail.view + 1 }} views</div>
                                <div v-if="tripDetail.memberList">
                                    {{ tripDetail.memberList.length }}/{{ tripDetail.maxCapacity }} members
                                </div>
                                <div v-else>
                                    0/{{ tripDetail.maxCapacity }} members
                                </div>
                                <div class="mt-2">{{ tripDetail.nickname }}</div>
                            </div>
                        </div>
                        <hr>
                        <div>
                            <h5 class="card-subtitle mb-2">여행 일정</h5>
                            <p class="card-text">{{ tripDetail.startDate }} ~ {{ tripDetail.endDate }}</p>
                            <p class="card-text">{{ tripDetail.sidoName }}</p>
                        </div>
                        <hr>
                        <div>
                            <h5 class="card-subtitle mb-2">소개</h5>
                            <p class="card-text">{{ tripDetail.content }}</p>
                        </div>
                        <hr>
                        <div>
                            <h5 class="card-subtitle mb-2">참여한 사람</h5>
                            <div class="d-flex flex-row flex-wrap">
                                <div class="p-2" v-for="member in tripDetail.memberList || []"
                                    :key="member.tripDetailMemberId">
                                    {{ member.nickname }}
                                </div>
                            </div>
                        </div>
                        <hr>
                        <h5 class="card-subtitle mb-2">여행계획</h5>
                        <template v-for="(tripPlan, tripPlanIndex) in tripDetail.tripPlanAttractionList"
                            :key="tripPlanIndex">
                            <template v-if="tripPlan.length > 0">
                                <div class="font-weight-bold mt-3">{{ tripPlan[0].tripDate }}</div>
                                <div v-for="plan in tripPlan" :key="plan.contentId" class="ml-3 mb-2">
                                    <span class="badge badge-secondary text-dark" style="font-size: 1em;">{{ plan.title
                                        }}</span>
                                </div>
                            </template>
                        </template>
                        <hr>
                        <h5 class="card-subtitle mb-2">리뷰</h5>
                        <div class="d-flex flex-wrap">
                            <div v-for="review in reviews" :key="review.tripReviewId" class="review-thumbnail m-2"
                                @click="showModal(review)">
                                <img :src="VITE_VUE_IMG_URL + review.reviewImageList[0]" alt="Review Image"
                                    class="img-thumbnail" style="width: 150px; height: 150px; object-fit: cover;">
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Modal -->
            <div class="modal fade" id="reviewModal" tabindex="-1" aria-labelledby="reviewModalLabel"
                aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="reviewModalLabel"><span class="text-muted"><img
                                        src="@/assets/location.png" width="20" height="20" />{{
                                            selectedReview.attractionTitle }} </span></h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="card-header d-flex align-items-center">
                                <img :src="VITE_VUE_IMG_URL + selectedReview.profile" class="rounded-circle me-3"
                                    width="50" height="50" />
                                <div>
                                    <h5 class="mb-0">{{ selectedReview.nickName }}</h5>
                                    <small class="text-muted">{{ selectedReview.createdAt }}</small>
                                </div>
                            </div>
                            <div class="card-body">
                                <h5 class="card-title">{{ selectedReview.title }}</h5>
                                <div class="d-flex align-items-center justify-content-between mb-3">

                                    <span class="star-rating">{{ selectedReview.star }}⭐</span>
                                </div>
                                <div class="image-slider">
                                    <div v-for="(image, imageIndex) in selectedReview.reviewImageList" :key="imageIndex"
                                        class="image-slide">
                                        <img :src="VITE_VUE_IMG_URL + image" class="img-fluid" />
                                    </div>
                                </div>
                                <p class="card-text mt-3">{{ selectedReview.content }}</p>
                                <p>
                                    <span v-for="(tag, tagIndex) in selectedReview.reviewTagList" :key="tagIndex"
                                        class="badge bg-primary me-1">
                                        {{ tag }}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.image-slider {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
}

.image-slide {
    flex: 0 0 auto;
    scroll-snap-align: start;
    margin-right: 10px;
}

.image-slide img {
    max-width: 100%;
    max-height: 300px;
}
</style>