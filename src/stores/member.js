import { ref } from 'vue'
import { useRouter } from "vue-router"
import { defineStore } from 'pinia'
import { jwtDecode } from "jwt-decode"


export const useCounterStore = defineStore('memberStore', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }

  return { count, doubleCount, increment }
})
