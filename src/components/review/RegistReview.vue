<script setup>
import StarRating from "@/components/common/StarRating.vue";
import { httpStatusCode } from "@/util/http-status";
import { ref, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import { writeReview } from "@/api/reviewAPI.js"

const route = useRoute();
const router = useRouter();

const props = defineProps(
    {
        tripDetailId: {
            type: Number,
            required: true
        },
        contentId: {
            type: Number,
            required: true
        },
        title: {
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
        contentId: props.contentId,
        tripDetailId: props.tripDetailId,
        reviewImageList: images.value,
        content: content.value,
        reviewTagList: tags,
        star: rating.value
    }

    writeReview(
        reviewData,
        (response) => {
            if (response.status == httpStatusCode.CREATE) {
                alert("리뷰를 등록하셨습니다.")
                router.push({
                    name: "proceed"
                });
            }
        },
        (error) => {
            alert("리뷰 등록에 실패했습니다.")
        }
    )
}
</script>

<template>
    <div class="container mt-5">
        <h2 class="mb-4">리뷰 등록</h2>
        <form @submit.prevent="submitReview">
            <!-- 관광지 정보 제목 -->
            <div class="mb-3">
                <label class="form-label">관광지 정보</label>
                <input type="text" class="form-control" :value="title" disabled>
            </div>

            <!-- 사진 등록 -->
            <div class="mb-3">
                <label class="form-label">사진 등록</label>
                <input type="file" class="form-control" multiple @change="onFileChange">
                <div class="mt-2">
                    <img v-for="(image, index) in imagePreviews" :key="index" :src="image" class="img-thumbnail"
                        width="100">
                </div>
            </div>

            <!-- 태그 -->
            <div class="mb-3">
                <label class="form-label">태그</label>
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

            <!-- 내용 -->
            <div class="mb-3">
                <label class="form-label">내용</label>
                <textarea class="form-control" v-model="content" rows="5" required></textarea>
            </div>

            <!-- 별점 -->
            <div class="mb-3">
                <label class="form-label">별점</label>
                <star-rating :rating="rating" @rating-selected="setRating"></star-rating>
            </div>

            <!-- 등록하기 버튼 -->
            <button type="submit" class="btn btn-primary">등록하기</button>
        </form>
    </div>
</template>

<style scoped>
.img-thumbnail {
    margin-right: 5px;
    margin-bottom: 5px;
}
</style>