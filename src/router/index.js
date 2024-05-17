import { createRouter, createWebHistory } from 'vue-router'
import TheMainView from "@/views/TheMainView.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "main",
      component: TheMainView,
    },
    {
      path: "/trip",
      name: "trip",
      component: () => import("@/views/TheTripView.vue"),
      children: [
        {
          path: "regist",
          name: "regist",
          component: () => import("@/components/trip/TripRegist.vue")
        },
        {
          path: "test",
          name: "test",
          component: () => import("@/components/Test.vue")
        }
      ]
    },
    {
      path: "/auth",
      name: "auth",
      component: () => import("@/views/TheAuthView.vue"),
      children: [
      ]
    },
    {
      path: "/proceed",
      name: "proceed",
      component: () => import("@/views/TheProceedView.vue"),
      children: [
      ]
    },
    {
      path: "/share",
      name: "share",
      component: () => import("@/views/TheShareView.vue"),
      children: [
      ]
    },
    {
      path: "/review",
      name: "review",
      component: () => import("@/views/TheReviewView.vue"),
    },
    {
      path: "/mypage",
      name: "mypage",
      component: () => import("@/views/TheMyPageView.vue"),
    }
  ]
})

export default router
