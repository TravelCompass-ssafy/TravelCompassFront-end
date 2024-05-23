<script setup>
import { localAxios } from "@/util/http-commons.js";
import { ref, onMounted } from "vue";
import { userStore } from "@/stores/userStore.js";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { Modal } from 'bootstrap';
import { deleteReview } from '@/api/reviewAPI.js';

const { VITE_VUE_IMG_URL } = import.meta.env;

const http = localAxios();
const router = useRouter();
const store = userStore();

const { isLogin, userInfo } = storeToRefs(store);

const proceedTrip = ref({});
const reviews = ref([]);
const selectedReview = ref({
    profile: ""
});
let modalInstance = null;
const isOwner = ref(false);

onMounted(() => {
    getProceedTrip();
    const modalEl = document.getElementById('reviewModal');
    if (modalEl) {
        modalInstance = new Modal(modalEl);
    }
});

const getProceedTrip = () => {
    http.get(`/trip/proceed/${userInfo.value.userId}`)
        .then((response) => {
            proceedTrip.value = response.data;
            getReviews();
        })
        .catch((error) => {
            console.log(error);
        });
};

const getReviews = () => {
    http.get(`/review/trip/${proceedTrip.value.tripDetailId}`)
        .then((response) => {
            reviews.value = response.data;

        })
        .catch((error) => {
            console.log(error);
        });
};

const deleteReviewById = async (reviewId) => {
    deleteReview(
        reviewId,
        () => {
            reviews.value = reviews.value.filter(review => review.tripReviewId !== reviewId);
            hideModal();
        },
        (error) => {
            console.error(error);
        }
    );
}

const showModal = (review) => {
    selectedReview.value = review;
    if (isLogin) {
        isOwner.value = review.userId === userInfo.value.userId;
    }
    if (modalInstance) {
        modalInstance.show();
    }
};

const hideModal = () => {
    if (modalInstance) {
        modalInstance.hide();
    }
}
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
                        <h5 class="modal-title" id="reviewModalLabel"><span class="text-muted"><img
                                    src="@/assets/location.png" width="20" height="20" />{{
                                        selectedReview.attractionTitle }} </span></h5>
                        <div v-if="isOwner" class="menu-container">
                            <img src="@/assets/menu.png" class="menu-icon"
                                @click="selectedReview.showMenu = !selectedReview.showMenu" />
                            <div v-if="selectedReview.showMenu" class="menu-dropdown">
                                <router-link @click="hideModal"
                                    :to="{ name: 'updateReview', params: { tripReviewId: selectedReview.tripReviewId, updatePage: 1 } }"
                                    class="dropdown-item">수정</router-link>
                                <button @click="deleteReviewById(selectedReview.tripReviewId)"
                                    class="dropdown-item">삭제</button>
                            </div>
                        </div>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>

                    </div>
                    <div class="modal-body">
                        <div class="card-header d-flex align-items-center">
                            <img :src="VITE_VUE_IMG_URL + selectedReview.profile" class="rounded-circle me-3" width="50"
                                height="50" />
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
</template>

<style scoped>
.review-thumbnail {
    cursor: pointer;
}

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

/* 메뉴 아이콘 및 드롭다운 스타일 */
.menu-container {
    position: relative;
}

.menu-icon {
    width: 24px;
    height: 24px;
    cursor: pointer;
}

.menu-dropdown {
    position: absolute;
    right: 0;
    background-color: white;
    border: 1px solid #ddd;
    border-radius: 5px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    z-index: 10;
}

.menu-dropdown .dropdown-item {
    padding: 8px 16px;
    cursor: pointer;
    display: block;
    width: 100%;
    text-align: left;
    color: #333;
}

.menu-dropdown .dropdown-item:hover {
    background-color: #f0f0f0;
}
</style>
