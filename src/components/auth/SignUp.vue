<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

import { signUpAPI, sendVerificationCodeAPI, emailVerifyAPI } from "@/api/userAPI.js"
import { HttpStatusCode } from "axios";
import { httpStatusCode } from "@/util/http-status"

const router = useRouter();

const signUpForm = ref({
    email: "",
    password: "",
    username: "",
    nickname: "",
    gender: "",
    birthday: "",
})

const confirmPassword = ref("");
const authNumber = ref("");
const emailAuthNumberId = ref("");

const signUp = async () => {
    if (!confirmPassword) {
        alert("패스워드가 일치하지 않습니다.");
    }
    else {
        const data = {
            emailAuthNumberId: emailAuthNumberId.value,
            authNumber: authNumber.value
        }

        let isEmailAuth = true;
        await emailVerifyAPI(
            data,
            (response) => {
                if (response.status == httpStatusCode.UNAUTHORIZED) {
                    alert("이메일 인증에 실패하셨습니다.")
                    isEmailAuth = false;
                }
            },
            (error) => {
                console.log("이메일 인증 실패");
            }
        )

        if (isEmailAuth) {
            await signUpAPI(
                signUpForm.value,
                (response) => {
                    if (response.status === httpStatusCode.CREATE) {
                        alert("여행 나침반 가입을 축하드립니다!!");
                        router.push({ name: "signin" });
                    }
                },
                (error) => {
                    console.log("회원가입 실패");
                }
            )
        }

    }

}

const sendVerificationCode = async () => {
    const data = {
        email: signUpForm.value.email
    };

    await sendVerificationCodeAPI(
        data,
        (response) => {
            if (response.status === httpStatusCode.CREATE) {
                alert("이메일로 인증코드를 발신했습니다!!");
                emailAuthNumberId.value = response.data.emailAuthNumberId;
            }
        },
        (error) => {
            alert("인증코드 발신을 실패했습니다");
        }
    )
}
</script>

<template>
    <div class="d-flex justify-content-center align-items-center vh-100">
        <div class="card p-4" style="width: 25rem;">
            <h3 class="text-center">회원가입</h3>
            <form @submit.prevent="signUp">
                <div class="mb-3">
                    <label for="email" class="form-label">이메일</label>
                    <input type="email" class="form-control" id="email" v-model="signUpForm.email" required>
                    <button type="button" class="btn btn-primary w-100 mt-2" @click="sendVerificationCode">인증하기</button>
                </div>
                <div class="mb-3">
                    <label for="verificationCode" class="form-label">인증번호</label>
                    <input type="text" class="form-control" id="verificationCode" v-model="authNumber" required>
                </div>
                <div class="mb-3">
                    <label for="password" class="form-label">비밀번호</label>
                    <input type="password" class="form-control" id="password" v-model="signUpForm.password" required>
                </div>
                <div class="mb-3">
                    <label for="confirmPassword" class="form-label">비밀번호 확인</label>
                    <input type="password" class="form-control" id="confirmPassword" v-model="confirmPassword" required>
                    <div v-if="signUpForm.password !== confirmPassword" class="text-danger mt-1">비밀번호가 일치하지 않습니다.</div>
                </div>
                <div class="mb-3">
                    <label for="name" class="form-label">이름</label>
                    <input type="text" class="form-control" id="name" v-model="signUpForm.username" required>
                </div>
                <div class="mb-3">
                    <label for="nickname" class="form-label">닉네임</label>
                    <input type="text" class="form-control" id="nickname" v-model="signUpForm.nickname" required
                        pattern="^[A-Za-z0-9_]+$">
                </div>
                <div class="mb-3">
                    <label class="form-label">성별</label>
                    <div>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" id="M" value="M" v-model="signUpForm.gender"
                                required>
                            <label class="form-check-label" for="M">남성</label>
                        </div>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" id="F" value="F" v-model="signUpForm.gender"
                                required>
                            <label class="form-check-label" for="F">여성</label>
                        </div>
                    </div>
                </div>
                <div class="mb-3">
                    <label for="birthdate" class="form-label">생일</label>
                    <input type="date" class="form-control" id="birthdate" v-model="signUpForm.birthday" required>
                </div>
                <button type="submit" class="btn btn-success w-100">회원가입</button>
            </form>
            <div class="mt-3 text-center">
                <a href="#" @click.prevent="goToLogin">로그인</a>
            </div>
        </div>
    </div>
</template>

<style scoped></style>