<script setup>
import { localAxios } from "@/util/http-commons.js";
import { ref, onMounted } from "vue";
import { userStore } from "@/stores/userStore.js";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { Modal } from 'bootstrap';
import { log } from "sockjs-client/dist/sockjs";

const { VITE_VUE_IMG_URL } = import.meta.env;


const http = localAxios();
const router = useRouter();
const store = userStore();

const { userInfo } = storeToRefs(store);

onMounted(() => {
    getProceedTrip();
});

const proceedTrip = ref({});
const reviews = ref([]);
const selectedReview = ref(null);
let modalInstance = null;

const getProceedTrip = () => {
    http.get(`/trip/proceed/${userInfo.value.userId}`)
        .then((response) => {

            console.log(userInfo.value.userId);
            console.log("안녕", response.data);
            proceedTrip.value = response.data;

            getReviews();
        })
        .catch((error) => {
            console.log(error);
        });
};

const getReviews = () => {
    http.get(`/review/${proceedTrip.value.tripDetailId}`)
        .then((response) => {
            reviews.value = response.data;
        })
        .catch((error) => {
            console.log(error);
        });
};

const showModal = (review) => {
    selectedReview.value = review;
    modalInstance.show();
};

// Modal instance creation
onMounted(() => {
    const modalEl = document.getElementById('reviewModal');
    modalInstance = new Modal(modalEl);
});
</script>

<template>
    <div class="container mt-4">
        <div class="row">
            <div class="col-md-12">
                <div class="card mb-4">
                    <div class="card-body">
                        <h3 class="card-title">{{ proceedTrip.title }}</h3>
                        <div class="mb-3">
                            <div class="d-flex flex-column align-items-start">
                                <div class="mt-2">{{ proceedTrip.nickname }}</div>
                            </div>
                        </div>
                        <hr>
                        <div>
                            <h5 class="card-subtitle mb-2">여행 일정</h5>
                            <p class="card-text">{{ proceedTrip.startDate }} ~ {{ proceedTrip.endDate }}</p>
                            <p class="card-text">{{ proceedTrip.sidoName }}</p>
                        </div>
                        <hr>
                        <h5 class="card-subtitle mb-2">여행계획</h5>
                        <template v-for="(tripPlan, tripPlanIndex) in proceedTrip.tripPlanAttractionList"
                            :key="tripPlanIndex">
                            <template v-if="tripPlan.length > 0">
                                <div class="font-weight-bold mt-3">{{ tripPlan[0].tripDate }}</div>
                                <div v-for="plan in tripPlan" :key="plan.contentId" class="ml-3 mb-2">
                                    <span class="badge badge-secondary text-dark" style="font-size: 1em;">{{
                                        plan.title }}</span>
                                    <router-link
                                        :to="{ name: 'regist', params: { tripDetailId: proceedTrip.tripDetailId, contentId: plan.contentId, title: plan.title } }"
                                        class="ml-2">
                                        리뷰쓰기
                                    </router-link>
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
        </div>

        <!-- Modal -->
        <div class="modal fade" id="reviewModal" tabindex="-1" aria-labelledby="reviewModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="reviewModalLabel">리뷰</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <h5>{{ selectedReview?.title }}</h5>
                        <p>{{ selectedReview?.content }}</p>
                        <div v-for="image in selectedReview?.reviewImageList" :key="image" class="mb-2">
                            <img :src="VITE_VUE_IMG_URL + image" alt="Review Image" class="img-fluid">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.review-thumbnail {
    cursor: pointer;
}
</style>
