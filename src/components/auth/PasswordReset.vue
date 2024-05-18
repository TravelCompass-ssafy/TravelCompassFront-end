<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { httpStatusCode } from "@/util/http-status";

import { sendVerificationCodeAPI, resetPasswordAPI, emailVerifyAPI } from "@/api/userAPI";

const router = useRouter();

const passwordResetForm = ref({
    email: "",
    verificationCode: "",
})

const emailAuthNumberId = ref();
const isValid = ref(false);

const sendVerificationCode = async () => {
    const data = {
        email: passwordResetForm.value.email
    }
    sendVerificationCodeAPI(
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

const resetPassword = async () => {
    const data = {
        emailAuthNumberId: emailAuthNumberId.value,
        authNumber: passwordResetForm.value.verificationCode,
    }

    emailVerifyAPI(
        data,
        (response) => {
            const data = {
                email: passwordResetForm.value.email
            }

            if (response.status === httpStatusCode.NOCONTENT) {
                resetPasswordAPI(
                    data,
                    (response) => {
                        if (response.status === httpStatusCode.NOCONTENT) {
                            alert("임시 비밀번호를 이메일에 발송했습니다. \n 임시 비밀번호로 로그인 해주세요.")
                            router.push({ name: "signin" })
                        }
                    },
                    (error) => {
                        alert("비밀번호 재전송을 실패했습니다.")
                    }
                )
            }
        },
        (error) => {
            if (error.response.status === httpStatusCode.UNAUTHORIZED) {
                isValid.value = true;
            }
            else {
                alert("비밀번호 재전송을 실패했습니다.")
            }
        }
    )



}

</script>

<template>
    <div class="d-flex justify-content-center align-items-center vh-100">
        <div class="card p-4" style="width: 20rem;">
            <h3 class="text-center">비밀번호 재설정</h3>
            <form @submit.prevent="resetPassword">
                <div class="mb-3">
                    <label for="email" class="form-label">이메일</label>
                    <input type="email" class="form-control" id="email" v-model="passwordResetForm.email" required>
                </div>
                <button type="button" class="btn btn-primary w-100 mb-3" @click="sendVerificationCode">인증하기</button>

                <div class="mb-3">
                    <label for="verificationCode" class="form-label">인증번호</label>
                    <input type="text" class="form-control" id="verificationCode"
                        v-model="passwordResetForm.verificationCode" required>
                    <div v-if="isValid" class="text-danger mt-1">인증번호가 틀립니다.</div>
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