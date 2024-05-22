<script setup>
import { ref } from "vue";
import { storeToRefs } from "pinia"
import { userStore } from "@/stores/userStore"
import { useRouter } from "vue-router";

const router = useRouter()

const store = userStore();

const { isLogin, isLoginError } = storeToRefs(store)
const { userLogin, getUserInfo } = store

const loginUser = ref({
    email: "",
    password: ""
})

const login = async () => {
    await userLogin(loginUser.value)
    let token = localStorage.getItem("accessToken")
    if (isLogin.value) {
        getUserInfo(token)
        router.replace("/")
    }
}

</script>

<template>
    <div class="d-flex justify-content-center align-items-center vh-100">
        <div class="card p-4" style="width: 20rem;">
            <h3 class="text-center">로그인</h3>
            <form @submit.prevent="login">
                <div class="mb-3">
                    <label for="username" class="form-label">이메일</label>
                    <input type="text" class="form-control" id="username" v-model="loginUser.email" required>
                </div>
                <div class="mb-3">
                    <label for="password" class="form-label">비밀번호</label>
                    <input type="password" class="form-control" id="password" v-model="loginUser.password"
                        @keyup.enter="login" required>
                </div>
                <div class="mb-3 text-end">
                    <router-link :to="{ name: 'password-reset' }">비밀번호 재설정</router-link>
                </div>
                <button type="submit" class="btn btn-primary w-100">로그인</button>
            </form>
            <div class="mt-3 text-center">
                <router-link :to="{ name: 'signup' }">회원가입</router-link> | <router-link
                    :to="{ name: 'email-find' }">아이디찾기</router-link>
            </div>
        </div>
    </div>
</template>

<style scoped></style>