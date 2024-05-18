import { ref } from 'vue'
import { useRouter } from "vue-router"
import { defineStore } from 'pinia'
import { jwtDecode } from "jwt-decode"

import { userConfirm, findById, tokenRegeneration, logout } from "@/api/userAPI"
import { httpStatusCode } from "@/util/http-status"


export const userStore = defineStore('userStore', () => {
  const router = useRouter()

  const isLogin = ref(false)
  const isLoginError = ref(false)
  const userInfo = ref({
    userId: "",
    email: "",
    username: "",
    nickname: "",
    gender: "",
    birthday: "",
    totalStar: "",
    totalStarCount: "",
    profile: ""
  })
  const isValidToken = ref(false)

  const userLogin = async (loginUser) => {
    await userConfirm(
      loginUser,
      (response) => {
        if (response.status === httpStatusCode.CREATE) {
          let { data } = response
          let accessToken = data["access-token"]
          let refreshToken = data["refresh-token"]
          isLogin.value = true
          isLoginError.value = false
          isValidToken.value = true
          sessionStorage.setItem("accessToken", accessToken)
          sessionStorage.setItem("refreshToken", refreshToken)
         }
      },
      (error) => {
        console.log("로그인 실패");
        isLogin.value = false
        isLoginError.value = true
        isValidToken.value = false
      }
    )
  }

  const getUserInfo = async (token) => {
    let decodeToken = jwtDecode(token)
    console.log(decodeToken);
    await findById(
      decodeToken.userId,
      (response) => {
        if (response.status == httpStatusCode.OK) {
          userInfo.value = response.data.userInfo
        } else {
          console.log("유저 정보 없음");
        }
      },
      async (error) => {
        isValidToken.value = false
        
        await tokenRegenerate()
      }
    )
  }

  const tokenRegenerate = async () => {
    await tokenRegeneration(
      JSON.stringify(userInfo.value),
      (response) => {
        if (response.status === httpStatusCode.CREATE) {
          let accessToken = response.data["access-token"]
          sessionStorage.setItem("accessToken", accessToken)
          isValidToken.value = true
        }
      },
      async (error) => {
        if (error.response.status === httpStatusCode.UNAUTHORIZED) {
          await logout(
            userInfo.value.userid,
            (response) => {
              if (response.status === httpStatusCode.OK) {
                console.log("리프레시 토큰 제거 성공");
              } else {
                console.log("리프레시 토큰 제거 실패");
              }
              alert("로그인 유효시간이 종료되었습니다. 다시 로그인 해주세요")
              isLogin.value = false
              userInfo.value = null
              isValidToken.value = false
              router.push({name: "signin"})
            },
            (error) => {
              isLogin.value = false
              userInfo.value = null
            } 
          )
        }
      }
    )
  }

  const userLogout = async () => {
    console.log("로그아웃 아이디 : " + userInfo.value.userId)
    await logout(
      userInfo.value.userId,
      (response) => {
        if (response.status === httpStatusCode.OK) {
          isLogin.value = false
          userInfo.value = null
          isValidToken.value = false

          sessionStorage.removeItem("accessToken")
          sessionStorage.removeItem("refreshToken")
        } else {
          console.error("유저 정보 없음!!!!")
        }
      },
      (error) => {
        console.log(error)
      }
    )
  }

  return {
    isLogin,
    isLoginError,
    userInfo,
    isValidToken,
    userLogin,
    getUserInfo,
    tokenRegenerate,
    userLogout,
  }
})
