<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

import { signUpAPI, sendVerificationCodeAPI, emailVerifyAPI, isEmailExistsAPI, isNickNameExistsAPI } from "@/api/userAPI.js"
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
const isValidVerificationCode = ref(false);
const emailValidCheck = ref(false);
const nickNameValidCheck = ref(false);

const signUp = async () => {
    if (signUpForm.value.password !== confirmPassword.value) {
        alert("패스워드가 일치하지 않습니다.");
    }
    else if (emailValidCheck) {
        alert("이미 존재하는 이메일입니다. \n기존 이메일을 이용해주세요!")
    }
    else if (nickNameValidCheck) {
        alert("이미 존재하는 닉네임입니다. \n다른 닉네임을 사용해주세요!")
    }
    else {
        const data = {
            emailAuthNumberId: emailAuthNumberId.value,
            authNumber: authNumber.value
        }

        let isEmailAuth = false;
        await emailVerifyAPI(
            data,
            () => {
                isEmailAuth = true;
            },
            (error) => {
                isValidVerificationCode.value = true;
                alert("이메일 인증에 실패하셨습니다.");
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
                    alert("회원가입에 실패하셨습니다.")
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

const emailDuplicated = async () => {
    await isEmailExistsAPI(
        {
            email: signUpForm.value.email
        },
        () => {
            emailValidCheck.value = false;
        },
        (error) => {
            if (error.response.status === httpStatusCode.CONFLICT) {
                emailValidCheck.value = true;
            }
        }
    )
}

const nickNameDuplicated = async () => {
    console.log('sdkdk');
    await isNickNameExistsAPI(
        {
            nickName: signUpForm.value.nickname
        },
        () => {
            nickNameValidCheck.value = false;
        },
        (error) => {
            console.error(error.response.status);
            if (error.response.status === httpStatusCode.CONFLICT) {
                nickNameValidCheck.value = true;
            }
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
                    <input @blur="emailDuplicated" type="email" class="form-control" id="email"
                        v-model="signUpForm.email" required>
                    <div v-if="emailValidCheck" class="text-danger mt-1">이미 존재하는 이메일 입니다.</div>
                    <button type="button" class="btn btn-primary w-100 mt-2" @click="sendVerificationCode">인증하기</button>
                </div>
                <div class="mb-3">
                    <label for="verificationCode" class="form-label">인증번호</label>
                    <input type="text" class="form-control" id="verificationCode" v-model="authNumber" required>
                    <div v-if="isValidVerificationCode" class="text-danger mt-1">인증번호를 확인해주세요.</div>
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
                    <input @blur="nickNameDuplicated" type="text" class="form-control" id="nickname"
                        v-model="signUpForm.nickname" required pattern="^[A-Za-z0-9_]+$"
                        placeholder="영어, 숫자, _ 로 입력해주세요.">
                    <div v-if="nickNameValidCheck" class="text-danger mt-1">이미 존재하는 닉네임 입니다.</div>
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
                <router-link :to="{ name: 'signin' }">로그인</router-link>
            </div>
        </div>
    </div>
</template>

<style scoped></style>