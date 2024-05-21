<script setup>
import { ref, reactive, onMounted } from 'vue';
import { getReviews, getComments, likeReview, writeComment, writeCommentReply } from '@/api/reviewAPI.js';
import { httpStatusCode } from "@/util/http-status";

const { VITE_VUE_IMG_URL } = import.meta.env;

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

const scrollObserver = ref(null);
const commentsScrollObserver = ref(null);

const loadReviews = async () => {
    if (isLoading.value) return;
    isLoading.value = true;

    getReviews(
        {
            page: page.value,
            size: size
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
</script>

<template>
    <div class="container mt-5">
        <div v-for="(review, index) in reviews" :key="review.id" class="card mb-4">
            <div class="card-header d-flex align-items-center">
                <img :src="VITE_VUE_IMG_URL + review.profile" class="rounded-circle me-3" width="50" height="50" />
                <div>
                    <h5 class="mb-0">{{ review.nickName }}</h5>
                    <small class="text-muted">{{ review.createdAt }}</small>
                </div>
            </div>
            <div class="card-body">
                <h5 class="card-title">{{ review.title }}</h5>
                <div class="image-slider">
                    <div v-for="(image, imageIndex) in review.reviewImageList" :key="imageIndex" class="image-slide">
                        <img :src="VITE_VUE_IMG_URL + image" class="img-fluid" />
                    </div>
                </div>
                <p class="card-text mt-3">
                    {{ review.content }}
                </p>
                <p>
                    <span v-for="(tag, tagIndex) in review.reviewTagList" :key="tagIndex" class="badge bg-primary me-1">
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
        <b-modal v-model="isCommentsModalOpen" title="댓글" size="lg">
            <section class="comments-section my-5">
                <div class="row justify-content-center">
                    <div class="col-md-8">
                        <div class="card">
                            <div class="card-header">
                                <h5 class="card-title">Comments</h5>
                            </div>
                            <div class="card-body">
                                <!-- 댓글 Form -->
                                <form>
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

                                        <span class="comment-userNickName fw-bold me-2">{{ comment.nickName }}</span>
                                        <span class="comment-date text-muted">{{ comment.createdAt }}</span>
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
                                                @click="toggleReplyList(comment.reviewCommentId)">답글
                                                {{ comment.replyCnt }}개</button>
                                        </div>
                                    </div>
                                    <!-- 대댓글 리스트 -->
                                    <div v-if="comment.showReplies" class="reply-list mt-3">
                                        <div class="reply" v-for="reply in comment.replies"
                                            :key="reply.reviewCommentId">
                                            <div class="reply-user-info d-flex align-items-center mb-2">
                                                <img :src="VITE_VUE_IMG_URL + reply.profile" class="rounded-circle me-3"
                                                    width="50" height="50" />
                                                <span class="reply-userNickName fw-bold me-2">{{ reply.nickName
                                                    }}</span>
                                                <span class="reply-date text-muted">{{ reply.createdAt }}</span>
                                            </div>
                                            <div class="reply-content">{{ reply.content }}</div>
                                        </div>
                                    </div>
                                    <!-- End Reply List -->
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div ref="commentsScrollObserver" style="height: 20px;"></div>
            </section>
        </b-modal>
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
</style>
