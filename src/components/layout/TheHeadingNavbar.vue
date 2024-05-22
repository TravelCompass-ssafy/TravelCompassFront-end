<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { userStore } from "@/stores/userStore.js";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import axios from "axios";
import noProfileImage from "@/assets/noprofile.jpg";

const { VITE_VUE_IMG_URL, VITE_API_URL, VITE_VUE_SSE_URL } = import.meta.env;

const router = useRouter();
const store = userStore();

const { userLogout } = store;
const { isLogin, userInfo, isCurrentTrip } = storeToRefs(store);

const logout = () => {
  userLogout();
  router.push({ name: "main" });
};

const profileImageUrl = computed(() => {
  return isLogin.value ? import.meta.env.VITE_VUE_IMG_URL + userInfo.value.profile : noProfileImage;
});

// 알람 관련 상태 변수
const notifications = ref([]);
const unreadCount = ref(0);

const toasts = ref([]);

// SSE 연결 함수
const connectSSE = () => {
  if (!isLogin.value) return;

  const userId = userInfo.value.userId;
  const sse = new EventSource(`${VITE_VUE_SSE_URL}/sse/connect/${userId}`);

  sse.addEventListener('connect', e => {
    const { data } = e;
    console.log(data);
  })

  sse.addEventListener('notifyJoinTripMember', e => {
    const { data } = e;
    console.log(data);
    notifications.value.push(data);
    unreadCount.value++;
    showToast(data);
  })

  sse.onerror = () => {
    sse.close();
  };
};

const showToast = (message) => {
  const id = Date.now();
  toasts.value.push({ id, message });
  setTimeout(() => {
    toasts.value = toasts.value.filter((toast) => toast.id !== id);
  }, 5000); // 5초 후에 자동으로 사라지게 설정
};


onMounted(() => {
  connectSSE();
  watch(isLogin, (newVal) => {
    if (newVal) {
      connectSSE();
    }
  });
});

const markAllAsRead = () => {
  unreadCount.value = 0;
};

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
            <!-- 알람 아이콘 -->
            <li class="nav-item dropdown">
              <a class="nav-link" href="#" id="notificationDropdown" role="button" data-bs-toggle="dropdown"
                aria-expanded="false">
                <img src="@/assets/alarmBell.png" style="width: 3rem; height: 3rem; object-fit: cover" />
                <span v-if="unreadCount > 0" class="badge bg-danger">{{ unreadCount }}</span>
              </a>
              <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="notificationDropdown">
                <li>
                  <a class="dropdown-item" href="#" @click="markAllAsRead">모두 읽음 표시</a>
                </li>
                <li>
                  <hr class="dropdown-divider">
                </li>
                <li v-for="(notification, index) in notifications" :key="index" class="dropdown-item">
                  {{ notification }}
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- 토스트 알림 컨테이너 -->
    <div class="toast-container">
      <div v-for="toast in toasts" :key="toast.id" class="toast">
        <div class="toast-message">{{ toast.message }}</div>
        <div class="close" @click="() => toasts.value = toasts.value.filter(t => t.id !== toast.id)">✕</div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.badge {
  position: absolute;
  top: 10px;
  right: 10px;
}

.toast-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1050;
}

.toast {
  display: flex;
  align-items: center;
  padding: 10px;
  margin-bottom: 10px;
  background-color: #343a40;
  color: white;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.toast .toast-message {
  margin-left: 10px;
}

.toast .close {
  margin-left: auto;
  cursor: pointer;
}
</style>
