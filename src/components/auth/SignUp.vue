<script setup>

</script>

<template>
    <div class="d-flex justify-content-center align-items-center vh-100">
        <div class="card p-4" style="width: 25rem;">
            <h3 class="text-center">회원가입</h3>
            <form @submit.prevent="register">
                <div class="mb-3">
                    <label for="email" class="form-label">이메일</label>
                    <input type="email" class="form-control" id="email" v-model="email" required>
                    <button type="button" class="btn btn-primary w-100 mt-2" @click="sendVerificationCode">인증하기</button>
                </div>
                <div class="mb-3" v-if="verificationSent">
                    <label for="verificationCode" class="form-label">인증번호</label>
                    <input type="text" class="form-control" id="verificationCode" v-model="verificationCode" required>
                    <button type="button" class="btn btn-secondary w-100 mt-2" @click="verifyCode">확인하기</button>
                    <div v-if="verificationFailed" class="text-danger mt-1">인증번호가 틀립니다.</div>
                </div>
                <div class="mb-3">
                    <label for="password" class="form-label">비밀번호</label>
                    <input type="password" class="form-control" id="password" v-model="password" required>
                    <div v-if="!passwordValid" class="text-danger mt-1">비밀번호는 8자리 이상, 대소문자 및 특수문자를 포함해야 합니다.</div>
                </div>
                <div class="mb-3">
                    <label for="confirmPassword" class="form-label">비밀번호 확인</label>
                    <input type="password" class="form-control" id="confirmPassword" v-model="confirmPassword" required>
                    <div v-if="password !== confirmPassword" class="text-danger mt-1">비밀번호가 일치하지 않습니다.</div>
                </div>
                <div class="mb-3">
                    <label for="name" class="form-label">이름</label>
                    <input type="text" class="form-control" id="name" v-model="name" required>
                </div>
                <div class="mb-3">
                    <label for="nickname" class="form-label">닉네임</label>
                    <input type="text" class="form-control" id="nickname" v-model="nickname" required
                        pattern="^[A-Za-z_]+$">
                    <div v-if="!nicknameValid" class="text-danger mt-1">닉네임은 영어 및 _만 가능합니다.</div>
                </div>
                <div class="mb-3">
                    <label class="form-label">성별</label>
                    <div>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" id="male" value="male" v-model="gender"
                                required>
                            <label class="form-check-label" for="male">남성</label>
                        </div>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" id="female" value="female" v-model="gender"
                                required>
                            <label class="form-check-label" for="female">여성</label>
                        </div>
                    </div>
                </div>
                <div class="mb-3">
                    <label for="birthdate" class="form-label">생일</label>
                    <input type="date" class="form-control" id="birthdate" v-model="birthdate" required>
                </div>
                <button type="submit" class="btn btn-success w-100" :disabled="!formValid">회원가입</button>
            </form>
            <div class="mt-3 text-center">
                <a href="#" @click.prevent="goToLogin">로그인</a>
            </div>
        </div>
    </div>
</template>

<style scoped></style>