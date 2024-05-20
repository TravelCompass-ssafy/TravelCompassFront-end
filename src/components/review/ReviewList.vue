<script setup>
import { ref, reactive, onMounted } from 'vue';
import { getReviews, getComments, likeReview, writeCommentReply } from '@/api/reviewAPI.js';
import { log } from "sockjs-client/dist/sockjs";
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
const newReply = ref('');
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
    )

}

const loadComments = async (reviewId) => {
    if (isLoading.value) return;
    isLoading.value = true;

    getComments(
        reviewId,
        {
            commentsPage: commentsPage.value,
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
    )
}

const openComments = (reviewId) => {
    isCommentsModalOpen.value = true;
    activeReviewId.value = reviewId;
    comments.value = [];
    commentsPage.value = 0;
    loadComments(reviewId);
}

const toggleLike = async (reviewId) => {

    likeReview(
        reviewId,
        () => {
            const review = reviews.value.find(r => r.id === reviewId);
            review.likes++;
        },
        (error) => {
            console.error(error);
        }
    )
}

const replyToComment = (commentId) => {
    activeReplyToComment.value = commentId;
}

const submitReply = async (commentId) => {
    if (!newReply.value) return;

    writeCommentReply(
        commentId,
        { content: newReply.value },
        (response) => {
            if (response.status == httpStatusCode.CREATE) {
                const comment = comments.value.find(c => c.id === commentId);
                comment.replies.push(newReply.value);
                newReply.value = '';
                activeReplyToComment.value = null;
            }
        },
        (error) => {
            console.error(error);
        }
    )
}

const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
        loadReviews();
    }
})

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
                    <button class="btn btn-outline-primary" @click="openComments(review.id)">
                        댓글 {{ review.commentCount }}
                    </button>
                    <button class="btn btn-outline-danger" @click="toggleLike(review.id)">
                        ❤️ 좋아요 {{ review.likeCount }}
                    </button>
                </div>
            </div>
        </div>
        <div ref="scrollObserver" style="height: 20px;"></div>

        <!-- 댓글 모달 -->
        <b-modal v-model="isCommentsModalOpen" title="댓글" size="lg">
            <div>
                <textarea v-model="newComment" placeholder="댓글을 작성하세요..."></textarea>
                <button @click="submitComment">댓글 작성</button>
            </div>
            <div v-for="comment in comments" :key="comment.reviewCommentId">
                <div class="mb-3">
                    <p><strong>{{ comment.userName }}</strong> {{ comment.content }}</p>
                    <button @click="toggleReplies(comment)">답글 보기 ({{ comment.replyCnt }})</button>
                </div>
                <!-- 대댓글 목록을 표시하는 부분 -->
                <div v-if="comment.showReplies">
                    <div v-for="reply in comment.replies" :key="reply.reviewCommentId" class="ms-4">
                        <p><strong>{{ reply.userName }}</strong> {{ reply.content }}</p>
                    </div>
                    <div>
                        <textarea v-model="newReply[comment.reviewCommentId]" placeholder="대댓글을 작성하세요..."></textarea>
                        <button @click="submitReply(comment.reviewCommentId)">대댓글 작성</button>
                    </div>
                </div>
            </div>
            <div ref="commentsScrollObserver" style="height: 20px;"></div>
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