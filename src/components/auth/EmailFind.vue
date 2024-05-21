<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { findEmailAPI } from "@/api/userAPI";
import { httpStatusCode } from "@/util/http-status";

const router = useRouter();

const findUser = ref({
    nickName: "",
    birthday: "",
})


const findEmail = async () => {
    findEmailAPI(
        findUser.value,
        (response) => {
            if (response.status === httpStatusCode.OK) {
                const { data } = response;
                alert(`고객님이 가입하신 이메일은 \n ${data.email} 입니다.`)
                router.push({ name: "signin" });
            }
        },
        (error) => {
            if (error.response.status === httpStatusCode.NOTFOUND) {
                alert("이메일이 존재하지 않습니다.")
            }
            else {
                alert("아이디 찾기에 실패했습니다.")
            }
        }
    )
}
</script>

<template>
    <div class="d-flex justify-content-center align-items-center vh-100">
        <div class="card p-4" style="width: 20rem;">
            <h3 class="text-center">아이디 찾기</h3>
            <form @submit.prevent="findEmail">
                <div class="mb-3">
                    <label for="name" class="form-label">닉네임</label>
                    <input type="text" class="form-control" id="name" v-model="findUser.nickName" required>
                </div>
                <div class="mb-3">
                    <label for="birthdate" class="form-label">생년월일</label>
                    <input type="date" class="form-control" id="birthdate" v-model="findUser.birthday" required>
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