<script setup>
import { ref, onMounted } from "vue";
import { userStore } from "@/stores/userStore.js"
import { storeToRefs } from "pinia";

import { updatePassword } from "@/api/myPageAPI";
import { httpStatusCode } from "@/util/http-status";

const store = userStore();

const { userInfo } = storeToRefs(store);

const showuserInfoImageModal = ref(false);
const showNicknameModal = ref(false);
const showIntroductionModal = ref(false);
const showChangePasswordModal = ref(false);
const newNickname = ref('');
const newIntroduction = ref('');
const currentPassword = ref('');
const newPassword = ref('');
const confirmNewPassword = ref('');

const changePassword = () => {
    if (newPassword.value != confirmNewPassword.value) {
        alert("비밀번호가 일치하지 않습니다!")
    }
    else {
        const data = {
            currentPassword: currentPassword.value,
            newPassword: newPassword.value
        }
        updatePassword(
            data,
            (response) => {
                if (response.status === httpStatusCode.NOCONTENT) {
                    alert("비밀번호가 변경되었습니다!")
                }
            },
            (error) => {
                if (error.response.status === httpStatusCode.UNAUTHORIZED) {
                    alert("현재 비밀번호가 일치하지 않습니다.")
                }
                else {
                    alert("비밀번호 변경에 실패하셨습니다.")
                }
            }
        )
    }
}

</script>

<template>
    <div class="container mt-5">
        <div class="row">
            <div class="col-md-4 text-center">
                <div class="userInfo-image-wrapper">
                    <img :src="userInfo.profile" class="rounded-circle border" width="150" height="150" alt="프로필 사진"
                        @click="showuserInfoImageModal = true">
                </div>
            </div>
            <div class="col-md-8">
                <div class="userInfo-details">
                    <h3>{{ userInfo.username }}
                        <button @click.prevent="showChangePasswordModal = true"
                            class="btn btn-link text-decoration-none">비밀번호 수정</button>
                    </h3>
                    <p><strong>닉네임:</strong> {{ userInfo.nickname }}
                        <button class="btn btn-link p-0" @click="showNicknameModal = true">변경</button>
                    </p>
                    <p><strong>소개:</strong> {{ userInfo.introduction }}
                        <button class="btn btn-link p-0" @click="showIntroductionModal = true">변경</button>
                    </p>
                    <p><strong>성별:</strong> {{ userInfo.gender }}</p>
                    <p><strong>생일:</strong> {{ userInfo.birthday }}</p>
                    <div>
                        <strong>사용자 별점:</strong>
                        <div class="star-rating">
                            <div class="filled-stars" :style="{ width: userInfo.rating * 10 + '%' }"></div>
                            <div class="empty-stars"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- userInfo Image Modal -->
        <div v-if="showuserInfoImageModal" class="modal d-block" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">프로필 사진 변경</h5>
                        <button type="button" class="btn-close" @click="showuserInfoImageModal = false"></button>
                    </div>
                    <div class="modal-body">
                        <input type="file" class="form-control" @change="onFileChange">
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary"
                            @click="showuserInfoImageModal = false">닫기</button>
                        <button type="button" class="btn btn-primary" @click="changeuserInfoImage">변경</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Nickname Modal -->
        <div v-if="showNicknameModal" class="modal d-block" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">닉네임 변경</h5>
                        <button type="button" class="btn-close" @click="showNicknameModal = false"></button>
                    </div>
                    <div class="modal-body">
                        <input type="text" class="form-control" v-model="newNickname" required>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="showNicknameModal = false">닫기</button>
                        <button type="button" class="btn btn-primary" @click="changeNickname">변경</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Introduction Modal -->
        <div v-if="showIntroductionModal" class="modal d-block" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">소개 변경</h5>
                        <button type="button" class="btn-close" @click="showIntroductionModal = false"></button>
                    </div>
                    <div class="modal-body">
                        <textarea class="form-control" v-model="newIntroduction" rows="3" required></textarea>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary"
                            @click="showIntroductionModal = false">닫기</button>
                        <button type="button" class="btn btn-primary" @click="changeIntroduction">변경</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Change Password Modal -->
        <div v-if="showChangePasswordModal" class="modal d-block" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">비밀번호 변경</h5>
                        <button type="button" class="btn-close" @click="showChangePasswordModal = false"></button>
                    </div>
                    <div class="modal-body">
                        <input type="password" class="form-control mb-2" placeholder="현재 비밀번호" v-model="currentPassword"
                            required>
                        <input type="password" class="form-control mb-2" placeholder="새 비밀번호" v-model="newPassword"
                            required>
                        <input type="password" class="form-control" placeholder="새 비밀번호 확인" v-model="confirmNewPassword"
                            required>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary"
                            @click="showChangePasswordModal = false">닫기</button>
                        <button type="button" class="btn btn-primary" @click="changePassword">변경</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.userInfo-image-wrapper {
    margin-bottom: 20px;
    cursor: pointer;
}

.userInfo-details {
    background-color: #f8f9fa;
    padding: 20px;
    border-radius: 10px;
}

.modal-dialog {
    max-width: 500px;
}

.modal-body input,
.modal-body textarea {
    width: 100%;
}

.star-rating {
    position: relative;
    display: inline-block;
    font-size: 0;
    line-height: 0;
}

.star-rating .empty-stars::before,
.star-rating .filled-stars::before {
    content: '★★★★★';
    font-size: 20px;
    line-height: 1;
}

.star-rating .empty-stars {
    color: #e4e5e9;
}

.star-rating .filled-stars {
    position: absolute;
    top: 0;
    left: 0;
    white-space: nowrap;
    overflow: hidden;
    color: #ffc107;
    width: 0;
}
</style>
