<script setup>
import { ref } from "vue";
const username = ref("");
const birthday = ref("");

</script>

<template>
    <div class="d-flex justify-content-center align-items-center vh-100">
        <div class="card p-4" style="width: 20rem;">
            <h3 class="text-center">아이디 찾기</h3>
            <form @submit.prevent="findUsername">
                <div class="mb-3">
                    <label for="name" class="form-label">이름</label>
                    <input type="text" class="form-control" id="name" v-model="username" required>
                </div>
                <div class="mb-3">
                    <label for="birthdate" class="form-label">생년월일</label>
                    <input type="date" class="form-control" id="birthdate" v-model="birthday" required>
                </div>
                <button type="submit" class="btn btn-primary w-100">아이디 찾기</button>
            </form>
            <div class="mt-3 text-center">
                <router-link :to="{ name: 'signin' }">로그인</router-link>
            </div>
        </div>
    </div>
</template>

<style scoped></style>