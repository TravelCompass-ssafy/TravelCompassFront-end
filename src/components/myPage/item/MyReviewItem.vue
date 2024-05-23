<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { userStore } from '@/stores/userStore.js';
import { storeToRefs } from "pinia";
import { getReviewByUserId, deleteReview } from "@/api/reviewAPI.js";
import { Modal } from 'bootstrap';


const store = userStore();
const { userInfo } = storeToRefs(store);

const { VITE_VUE_IMG_URL } = import.meta.env;

const reviews = ref([]);
const selectedReview = ref({
    profile: ""
});
let modalInstance = null;

onMounted(() => {
    getReviews();
    const modalEl = document.getElementById('reviewModal');
    if (modalEl) {
        modalInstance = new Modal(modalEl);
    }
})

const getReviews = () => {
    getReviewByUserId(
        userInfo.value.userId,
        ({ data }) => {
            reviews.value = data;
        },
        (error) => {
            console.log(error);
        }
    )
}

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
    <div class="container mt-5">
        <div class="row">
            <div v-for="review in reviews" :key="review.tripReviewId" class="col-12 col-sm-6 col-md-4 mb-4"
                @click="showModal(review)">
                <div class=" card h-100 shadow-sm">
                    <img :src="VITE_VUE_IMG_URL + review.reviewImageList[0]" class="card-img-top rounded-top"
                        alt="Review Image" style="height: 210px; object-fit: cover;">
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
                    <div class="menu-container">
                        <img src="@/assets/menu.png" class="menu-icon"
                            @click="selectedReview.showMenu = !selectedReview.showMenu" />
                        <div v-if="selectedReview.showMenu" class="menu-dropdown">
                            <router-link @click="hideModal"
                                :to="{ name: 'updateReview', params: { tripReviewId: selectedReview.tripReviewId, updatePage: 3 } }"
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