<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const form = ref({
    title: '',
    region: '',
    date: '',
    people: 1,
    description: '',
    plans: [''],
    image: null,
})

</script>

<template>
    <div class="container mt-5">
        <h1>여행 동행 구하기</h1>
        <form @submit.prevent="submitForm">
            <div class="mb-3">
                <label for="image" class="form-label">사진 등록</label>
                <input type="file" class="form-control" id="image" @change="onFileChange">
            </div>
            <div class="mb-3">
                <label for="title" class="form-label">제목</label>
                <input type="text" class="form-control" id="title" v-model="form.title" required>
            </div>
            <div class="mb-3">
                <label for="region" class="form-label">지역 선택</label>
                <input type="text" class="form-control" id="region" v-model="form.region" required>
            </div>
            <div class="mb-3">
                <label for="date" class="form-label">일정</label>
                <input type="date" class="form-control" id="date" v-model="form.date" required>
            </div>
            <div class="mb-3">
                <label for="people" class="form-label">인원</label>
                <input type="number" class="form-control" id="people" v-model="form.people" min="1" max="100" required>
            </div>
            <div class="mb-3">
                <label for="description" class="form-label">내용</label>
                <textarea class="form-control" id="description" v-model="form.description" required></textarea>
            </div>
            <div class="mb-3">
                <label for="plan" class="form-label">여행 계획</label>
                <div v-for="(plan, index) in form.plans" :key="index" class="mb-2">
                    <input type="text" class="form-control mb-1" :placeholder="'Day ' + (index + 1)"
                        v-model="form.plans[index]" required>
                </div>
                <button type="button" class="btn btn-primary" @click="addPlan">+ 계획 추가</button>
            </div>

            <button type="submit" class="btn btn-success">등록</button>
        </form>
    </div>
</template>

<style scoped></style>