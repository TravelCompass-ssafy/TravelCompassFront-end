import { createRouter, createWebHistory } from "vue-router";
import TheMainView from "@/views/TheMainView.vue";
import TripChat from "@/components/trip/chat/TripChat.vue";
import ChatBot from "@/components/openai/ChatBot.vue";

import { storeToRefs } from "pinia";

import { userStore } from "@/stores/userStore.js";

const onlyAuthUser = async (to, from, next) => {
  const store = userStore();
  const { userInfo, isValidToken } = storeToRefs(store);
  const { getUserInfo } = store;

  let token = localStorage.getItem("accessToken");

  if (userInfo.value != null && token) {
    await getUserInfo(token);
  }
  if (!isValidToken.value || userInfo.value === null) {
    next({ name: "user-login" });
  } else {
    next();
  }
};

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/chatBot",
      name: "chatBot",
      component: ChatBot,
    },
    {
      path: "/",
      name: "main",
      component: TheMainView,
    },
    {
      path: "/trip",
      name: "trip",
      component: () => import("@/views/TheTripView.vue"),
      redirect: { name: "trip-list" },
      children: [
        {
          path: "trip-list",
          name: "trip-list",
          component: () => import("@/components/trip/TripList.vue"),
        },
        {
          path: "trip-regist",
          name: "trip-regist",
          component: () => import("@/components/trip/TripRegist.vue"),
        },
        {
          path: "trip-detail/:tripDetailId",
          name: "trip-detail",
          component: () => import("@/components/trip/TripDetail.vue"),
        },
      ],
    },
    {
      path: "/auth",
      name: "auth",
      component: () => import("@/views/TheAuthView.vue"),
      children: [
        {
          path: "signin",
          name: "signin",
          component: () => import("@/components/auth/SignIn.vue"),
        },
        {
          path: "email-find",
          name: "email-find",
          component: () => import("@/components/auth/EmailFind.vue"),
        },
        {
          path: "password-reset",
          name: "password-reset",
          component: () => import("@/components/auth/PasswordReset.vue"),
        },
        {
          path: "signup",
          name: "signup",
          component: () => import("@/components/auth/SignUp.vue"),
        },
      ],
    },
    {
      path: "/proceed/",
      name: "proceed",
      component: () => import("@/views/TheProceedView.vue"),
    },
    {
      path: "/share",
      name: "share",
      component: () => import("@/views/TheShareView.vue"),
      redirect: { name: "share-list" },
      children: [
        {
          path: "share-list",
          name: "share-list",
          component: () => import("@/components/share/ShareList.vue"),
        },
        {
          path: "share/:tripDetailId",
          name: "share-detail",
          component: () => import("@/components/share/ShareDetail.vue"),
        },
      ],
    },
    {
      path: "/review",
      name: "review",
      component: () => import("@/views/TheReviewView.vue"),
      children: [
        {
          path: "regist/:tripDetailId/:contentId/:title",
          name: "regist",
          component: () => import("@/components/review/RegistReview.vue"),
          props: true,
        },
        {
          path: "list",
          name: "list",
          component: () => import("@/components/review/ReviewList.vue"),
        },
        {
          path: "updateReview/:tripReviewId/:updatePage",
          name: "updateReview",
          component: () => import("@/components/review/ReviewUpdate.vue"),
          props: true,
        },
      ],
    },
    {
      path: "/mypage",
      name: "mypage",
      component: () => import("@/views/TheMyPageView.vue"),
    },
    {
      path: "/chat",
      name: "chat",
      component: TripChat,
    },
  ],
});

export default router;
