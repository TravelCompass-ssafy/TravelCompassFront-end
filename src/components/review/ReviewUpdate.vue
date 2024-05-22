<script setup>
import StarRating from "@/components/common/StarRating.vue";
import { httpStatusCode } from "@/util/http-status";
import { ref, reactive, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getReviewById, updateReview } from "@/api/reviewAPI.js"

const { VITE_VUE_IMG_URL } = import.meta.env;

const route = useRoute();
const router = useRouter();

const props = defineProps(
    {
        tripReviewId: {
            type: Number,
            required: true
        }
    }
)

const images = ref([]);
const imagePreviews = ref([]);
const newTag = ref('');
const tags = reactive([]);
const content = ref('');
const rating = ref(0);

onMounted(() => {
    loadReview();
});

const loadReview = () => {
    getReviewById(
        props.tripReviewId,
        (response) => {
            const review = response.data;
            images.value = review.reviewImageList;
            imagePreviews.value = review.reviewImageList.map(image => VITE_VUE_IMG_URL + image);
            tags.push(...review.reviewTagList);
            content.value = review.content;
            rating.value = review.star;
        },
        (error) => {
            console.error(error);
        }
    )
};

const onFileChange = (event) => {
    const files = event.target.files;
    images.value = [];
    imagePreviews.value = [];
    for (let i = 0; i < files.length; i++) {
        images.value.push(files[i]);
        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreviews.value.push(e.target.result);
        };
        reader.readAsDataURL(files[i]);
    }
}

const addTag = () => {
    if (newTag.value && !tags.includes(newTag.value)) {
        tags.push(newTag.value);
        newTag.value = '';
    }
}

const removeTag = (index) => {
    tags.splice(index, 1);
}

const setRating = (selectedRating) => {
    rating.value = selectedRating;
}

const submitReview = () => {
    const reviewData = {
        reviewImageList: images.value,
        reviewTagList: tags,
        content: content.value,
        star: rating.value
    }

    updateReview(
        props.tripReviewId,
        reviewData,
        (response) => {
            if (response.status == httpStatusCode.OK) {
                alert("리뷰가 수정되었습니다.");
                router.push({
                    name: "list"
                });
            }
        },
        (error) => {
            alert("리뷰 수정에 실패했습니다.");
        }
    )
}
</script>

<template>
    <div class="container mt-5">
        <h2 class="mb-4">리뷰 수정</h2>
        <form @submit.prevent="submitReview">

            <div class="mb-3">
                <label class="form-label">사진 수정</label>
                <input type="file" class="form-control" multiple @change="onFileChange">
                <div class="mt-2">
                    <img v-for="(image, index) in imagePreviews" :key="index" :src="image" class="img-thumbnail"
                        width="100">
                </div>
            </div>


            <div class="mb-3">
                <label class="form-label">태그 수정</label>
                <div class="input-group">
                    <input type="text" class="form-control" v-model="newTag" @keyup.enter="addTag">
                    <button class="btn btn-outline-secondary" type="button" @click="addTag">추가</button>
                </div>
                <div class="mt-2">
                    <span v-for="(tag, index) in tags" :key="index" class="badge bg-primary me-1">
                        {{ tag }} <button type="button" class="btn-close btn-close-white btn-sm" aria-label="Close"
                            @click="removeTag(index)"></button>
                    </span>
                </div>
            </div>


            <div class="mb-3">
                <label class="form-label">내용 수정</label>
                <textarea class="form-control" v-model="content" rows="5" required></textarea>
            </div>

            <div class="mb-3">
                <label class="form-label">별점 수정</label>
                <star-rating :rating="rating" @rating-selected="setRating"></star-rating>
            </div>

            <button type="submit" class="btn btn-primary">수정하기</button>
        </form>
    </div>
</template>

<style scoped>
.img-thumbnail {
    margin-right: 5px;
    margin-bottom: 5px;
}
</style>
