<script setup>
import { ref } from "vue";
const email = ref("");
const verificationCode = ref(false);

</script>

<template>
    <div class="d-flex justify-content-center align-items-center vh-100">
        <div class="card p-4" style="width: 20rem;">
            <h3 class="text-center">비밀번호 재설정</h3>
            <form @submit.prevent="resetPassword">
                <div class="mb-3">
                    <label for="email" class="form-label">이메일</label>
                    <input type="email" class="form-control" id="email" v-model="email" required>
                </div>
                <button type="button" class="btn btn-primary w-100 mb-3" @click="sendVerificationCode">인증하기</button>

                <div class="mb-3">
                    <label for="verificationCode" class="form-label">인증번호</label>
                    <input type="text" class="form-control" id="verificationCode" v-model="verificationCode" required>
                    <div v-if="verificationFailed" class="text-danger mt-1">인증번호가 틀립니다.</div>
                </div>

                <button type="submit" class="btn btn-success w-100">비밀번호 재설정</button>
            </form>
            <div class=" mt-3 text-center">
                <router-link :to="{ name: 'signin' }">로그인</router-link>
            </div>
        </div>
    </div>
</template>


<style scoped></style>

<style scoped>
.vh-100 {
    height: 100vh;
}
</style>