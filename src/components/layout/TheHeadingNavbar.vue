<script setup>
import { localAxios } from "@/util/http-commons.js"
import { ref, onMounted, computed, watch } from "vue";
import { userStore } from "@/stores/userStore.js"
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import noProfileImage from "@/assets/noprofile.jpg"

const { VITE_VUE_IMG_URL } = import.meta.env;

const router = useRouter();
const store = userStore();

const { userLogout } = store;
const { isLogin, userInfo, isCurrentTrip } = storeToRefs(store);

const logout = () => {
  userLogout();
  router.push({ name: "main" });
}

const profileImageUrl = computed(() => {
  return isLogin.value ? import.meta.env.VITE_VUE_IMG_URL + userInfo.value.profile : noProfileImage;
});
</script>

<template>
  <div>
    <nav class="navbar navbar-expand-lg">
      <div class="container">
        <router-link :to="{ name: 'main' }" class="nav-link">
          <a class="navbar-brand" href="#"><img src="@/assets/logo2.png" style="width: 100px; height: auto;" /></a>
        </router-link>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse justify-content-end" id="navbarNavDropdown">
          <ul class="navbar-nav">
            <li class="nav-item" v-if="isCurrentTrip">
              <router-link :to="{ name: 'proceed' }" class="nav-link">어디가니?</router-link>
            </li>
            <li class="nav-item">
              <router-link :to="{ name: 'trip' }" class="nav-link">함께가요</router-link>
            </li>
            <li class="nav-item">
              <router-link :to="{ name: 'share' }" class="nav-link">여행도장</router-link>
            </li>
            <li class="nav-item">
              <router-link :to="{ name: 'list' }" class="nav-link">발자취</router-link>
            </li>
            <li class="nav-item dropdown">
              <img class="nav-link dropdown-toggle rounded-circle" :src="profileImageUrl" id="navbarDropdown"
                role="button" data-bs-toggle="dropdown" aria-expanded="false"
                style="width: 3rem; height: 3rem; object-fit: cover" />
              <ul class="dropdown-menu">

                <div v-if="isLogin">
                  <li><router-link :to="{ name: 'mypage' }" class="dropdown-item">마이페이지</router-link></li>
                  <li><a class="dropdown-item" href="#" @click="logout">로그아웃</a></li>
                </div>
                <div v-else>
                  <li><router-link :to="{ name: 'signin' }" class="dropdown-item">로그인</router-link></li>
                  <li><router-link :to="{ name: 'signup' }" class="dropdown-item">회원가입</router-link></li>
                </div>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </div>
</template>

<style scoped></style>