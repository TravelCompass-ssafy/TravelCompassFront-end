<script setup>
import { ref, reactive, onMounted } from 'vue';
import { getReviews, getComments, likeReview, writeComment, writeCommentReply, deleteReview } from '@/api/reviewAPI.js';
import { httpStatusCode } from "@/util/http-status";
import { format } from 'date-fns';
import { storeToRefs } from "pinia";
import { userStore } from "@/stores/userStore.js"
import { useRouter } from "vue-router";

const store = userStore();
const { VITE_VUE_IMG_URL } = import.meta.env;
const { isLogin, userInfo } = storeToRefs(store);

const reviews = ref([]);
const isLoading = ref(false);
const page = ref(0);
const size = 2;
const isCommentsModalOpen = ref(false);
const activeReviewId = ref(null);
const comments = ref([]);
const commentsPage = ref(0);
const commentSize = 10;
const addCommentForm = reactive({ content: '' });
const replyCommentForm = reactive({ content: '' });
const activeReplyToComment = ref(null);

const searchKeyword = ref('');
const selectedCategory = ref("");

const scrollObserver = ref(null);
const commentsScrollObserver = ref(null);

const formatDate = (dateString) => {
    return format(new Date(dateString), "yyyy년 MM월 dd일 aaa h:mm");
}

const loadReviews = async () => {
    if (isLoading.value) return;
    isLoading.value = true;

    getReviews(
        {
            page: page.value,
            size: size,
            keyword: searchKeyword.value,
            category: selectedCategory.value
        },
        ({ data }) => {
            reviews.value.push(...data);
            page.value++;
        },
        (error) => {
            console.error(error);
        },
        () => {
            isLoading.value = false;
        }
    );
}

const loadComments = async (reviewId) => {
    if (isLoading.value) return;
    isLoading.value = true;

    getComments(
        reviewId,
        {
            page: commentsPage.value,
            size: commentSize
        },
        ({ data }) => {
            comments.value.push(...data);
            commentsPage.value++;
        },
        (error) => {
            console.error(error);
        },
        () => {
            isLoading.value = false;
        }
    );
}

const openComments = (reviewId) => {
    isCommentsModalOpen.value = true;
    activeReviewId.value = reviewId;
    comments.value = [];
    commentsPage.value = 0;
    loadComments(reviewId);
}

const toggleLike = async (reviewId) => {
    const review = reviews.value.find(r => r.tripReviewId === reviewId);
    if (!review) return;

    if (review.likeCheck) {
        // 이미 좋아요를 누른 경우, 좋아요 취소
        likeReview(
            reviewId,
            () => {
                review.likeCount--;
                review.likeCheck = false;
            },
            (error) => {
                console.error(error);
            }
        );
    } else {
        // 좋아요를 누르지 않은 경우, 좋아요 추가
        likeReview(
            reviewId,
            () => {
                review.likeCount++;
                review.likeCheck = true;
            },
            (error) => {
                console.error(error);
            }
        );
    }
}

const replyComment = async (commentId) => {
    if (!replyCommentForm.content) return;

    writeCommentReply(
        activeReviewId.value,
        commentId,
        { content: replyCommentForm.content },
        (response) => {
            if (response.status == httpStatusCode.CREATE) {
                const comment = comments.value.find(c => c.reviewCommentId === commentId);
                if (comment) {
                    comment.replyCnt++;
                    comment.replies.unshift(response.data);
                }

                replyCommentForm.content = '';
                activeReplyToComment.value = null;
            }
        },
        (error) => {
            console.error(error);
        }
    );
}

const addComment = async () => {
    if (!addCommentForm.content) return;

    writeComment(
        activeReviewId.value,
        { content: addCommentForm.content },
        (response) => {
            if (response.status == httpStatusCode.CREATE) {
                comments.value.unshift(response.data);
                addCommentForm.content = '';

                const review = reviews.value.find(r => r.tripReviewId === activeReviewId.value);
                review.commentCount++;
            }
        },
        (error) => {
            console.error(error);
        }
    );
}

const toggleReplyForm = (commentId) => {
    if (commentId !== null && commentId !== undefined) {
        activeReplyToComment.value = activeReplyToComment.value === commentId ? null : commentId;
    }
}

const toggleReplyList = (commentId) => {
    const comment = comments.value.find(c => c.reviewCommentId === commentId);
    if (comment) {
        comment.showReplies = !comment.showReplies;
    }
}

const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
        loadReviews();
    }
});

const commentsObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
        loadComments(activeReviewId.value);
    }
});

onMounted(() => {
    if (scrollObserver.value) {
        observer.observe(scrollObserver.value);
    }
    if (commentsScrollObserver.value) {
        commentsObserver.observe(commentsScrollObserver.value);
    }
    loadReviews();
});

const searchReviews = () => {
    reviews.value = [];
    page.value = 0;
    loadReviews();
}

const deleteReviewById = async (reviewId) => {
    deleteReview(
        reviewId,
        () => {
            reviews.value = reviews.value.filter(review => review.tripReviewId !== reviewId);
        },
        (error) => {
            console.error(error);
        }
    );
}

const isReviewOwner = (review) => {
    if (isLogin) {
        return review.userId === userInfo.value.userId;
    }
    else {
        return false;
    }
}

</script>

<template>
    <div class="container mt-5">
        <div class="row justify-content-center">
            <div class="col-md-5">
                <!-- 검색 및 필터 UI -->
                <div class="d-flex align-items-center mb-4 p-3 shadow-sm rounded">
                    <select v-model="selectedCategory" class="form-select me-2" style="flex: 1;">
                        <option value="">모든 카테고리</option>
                        <option value="12">관광지</option>
                        <option value="14">문화시설</option>
                        <option value="15">축제공연행사</option>
                        <option value="25">여행코스</option>
                        <option value="28">레포츠</option>
                        <option value="32">숙박</option>
                        <option value="38">쇼핑</option>
                        <option value="39">음식점</option>
                    </select>
                    <input v-model="searchKeyword" type="text" class="form-control me-2" style="flex: 2;"
                        placeholder="검색어 입력" />
                    <button @click="searchReviews" class="btn btn-primary" style="flex: 0 0 auto;">검색</button>
                </div>

                <div v-for="(review, index) in reviews" :key="review.id" class="card mb-4">
                    <div class="card-header d-flex align-items-center justify-content-between">
                        <div class="d-flex align-items-center">
                            <img :src="VITE_VUE_IMG_URL + review.profile" class="rounded-circle me-3" width="50"
                                height="50" />
                            <div>
                                <h5 class="mb-0">{{ review.nickName }}</h5>
                                <small class="text-muted">{{ formatDate(review.createdAt) }}</small>
                            </div>
                        </div>
                        <div v-if="isReviewOwner(review)" class="menu-container">
                            <img src="@/assets/menu.png" class="menu-icon"
                                @click="review.showMenu = !review.showMenu" />
                            <div v-if="review.showMenu" class="menu-dropdown">
                                <router-link
                                    :to="{ name: 'updateReview', params: { tripReviewId: review.tripReviewId, updatePage: 2 } }"
                                    class="dropdown-item">수정</router-link>
                                <button @click="deleteReviewById(review.tripReviewId)" class="dropdown-item">삭제</button>
                            </div>
                        </div>
                    </div>

                    <div class="card-body">
                        <h5 class="card-title">{{ review.title }}</h5>
                        <div class="d-flex align-items-center justify-content-between mb-3">
                            <span class="text-muted"><img src="@/assets/location.png" width="20" height="20" />{{
                                review.attractionTitle }} </span>
                            <span class="star-rating">{{ review.star }}⭐</span>
                        </div>
                        <div class="image-slider">
                            <div v-for="(image, imageIndex) in review.reviewImageList" :key="imageIndex"
                                class="image-slide">
                                <img :src="VITE_VUE_IMG_URL + image" class="img-fluid trip-image" />
                            </div>
                        </div>
                        <p class="card-text mt-3">{{ review.content }}</p>
                        <p>
                            <span v-for="(tag, tagIndex) in review.reviewTagList" :key="tagIndex"
                                class="badge bg-primary me-1">
                                {{ tag }}
                            </span>
                        </p>
                        <div class="d-flex justify-content-between">
                            <button class="btn btn-outline-primary" @click="openComments(review.tripReviewId)">
                                댓글 {{ review.commentCount }}
                            </button>
                            <button :class="['btn', 'btn-outline-danger', { 'btn-outline-light': !review.likeCheck }]"
                                @click="toggleLike(review.tripReviewId)">
                                <span style="color: black;">❤️ 좋아요 {{ review.likeCount }}</span>
                            </button>
                        </div>
                    </div>
                </div>
                <div ref="scrollObserver" style="height: 20px;"></div>

                <!-- 댓글 모달 -->
                <b-modal v-model="isCommentsModalOpen" title="댓글" size="">
                    <section class="comments-section ">
                        <div class="row justify-content-center">
                            <div>
                                <div class="card-body">
                                    <!-- 댓글 Form -->
                                    <form class="mb-3">
                                        <div class="mb-3">
                                            <input v-model="addCommentForm.content" type="text" name="content"
                                                class="form-control" placeholder="댓글을 작성해주세요" />
                                        </div>
                                        <button @click.prevent="addComment" class="btn btn-primary">댓글 작성</button>
                                    </form>
                                    <!-- 댓글 Form 끝 -->

                                    <!-- 댓글 -->
                                    <div class="comment" v-for="comment in comments" :key="comment.reviewCommentId">
                                        <!-- 댓글 사용자 정보 -->
                                        <div class="comment-user-info d-flex align-items-center mb-2">
                                            <img :src="VITE_VUE_IMG_URL + comment.profile" class="rounded-circle me-3"
                                                width="50" height="50" />
                                            <span class="comment-userNickName fw-bold me-2">{{ comment.nickName
                                                }}</span>
                                            <span class="comment-date text-muted">{{
                                                formatDate(comment.createdAt) }}</span>
                                        </div>
                                        <!-- 댓글 정보 -->
                                        <div class="comment-content mb-2">{{ comment.content }}</div>
                                        <!-- 대댓글 Button -->
                                        <div class="comment-actions">
                                            <button class="btn btn-link reply-btn"
                                                @click="toggleReplyForm(comment.reviewCommentId)">답글</button>
                                        </div>
                                        <!-- 대댓글 Form -->
                                        <div v-if="activeReplyToComment === comment.reviewCommentId"
                                            class="reply-form mt-2">
                                            <form>
                                                <div class="mb-3">
                                                    <input v-model="replyCommentForm.content" type="text" name="content"
                                                        class="form-control" placeholder="답글을 작성해주세요" />
                                                </div>
                                                <button @click.prevent="replyComment(comment.reviewCommentId)"
                                                    class="btn btn-primary">답변 작성</button>
                                            </form>
                                        </div>
                                        <!-- 대댓글 Form 끝 -->

                                        <!-- 대댓글 보기 -->
                                        <div class="d-flex flex-row user-feed mt-2">
                                            <div v-if="comment.replyCnt > 0">
                                                <button class="ml-3 toggle-replies btn btn-link"
                                                    @click="toggleReplyList(comment.reviewCommentId)">답글 {{
                                                        comment.replyCnt }}개</button>
                                            </div>
                                        </div>
                                        <!-- 대댓글 리스트 -->
                                        <div v-if="comment.showReplies" class="reply-list mt-3">
                                            <div class="reply" v-for="reply in comment.replies"
                                                :key="reply.reviewCommentId">
                                                <div class="reply-user-info d-flex align-items-center mb-2">
                                                    <img :src="VITE_VUE_IMG_URL + reply.profile"
                                                        class="rounded-circle me-3" width="50" height="50" />
                                                    <span class="reply-userNickName fw-bold me-2">{{ reply.nickName
                                                        }}</span>
                                                    <span class="comment-date text-muted">{{
                                                        formatDate(reply.createdAt) }}</span>
                                                </div>
                                                <div class="reply-content">{{ reply.content }}</div>
                                            </div>
                                        </div>
                                        <!-- End Reply List -->
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div ref="commentsScrollObserver" style="height: 20px;"></div>
                    </section>
                </b-modal>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* 이미지 슬라이드 CSS */
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

/* 리뷰 카드의 가로 크기 조절 */
.card {
    max-width: 800px;
    /* 원하는 가로 크기로 조절 */
}

/* 별점 및 관광지 이름 스타일 */
.star-rating {
    font-size: 1.25rem;
    color: #ffcc00;
    margin-right: 10px;
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

.trip-image {
    height: 200px;
    object-fit: cover;
}
</style>
