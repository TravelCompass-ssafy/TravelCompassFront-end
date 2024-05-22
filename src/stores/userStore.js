import { ref } from 'vue'
import { useRouter } from "vue-router"
import { defineStore } from 'pinia'
import { jwtDecode } from "jwt-decode"

import { userConfirm, findById, tokenRegeneration, logout } from "@/api/userAPI"
import { isPoceedTrip } from "@/api/proceedAPI.js"
import { httpStatusCode } from "@/util/http-status"


export const userStore = defineStore(
  'userStore',
  () => {
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
  const isCurrentTrip = ref(false)

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
          localStorage.setItem("accessToken", accessToken)
          localStorage.setItem("refreshToken", refreshToken)
          userInfo.value = data.userInfo;
        }
      },
      (error) => {
        console.log("로그인 실패");
        isLogin.value = false
        isLoginError.value = true
        isValidToken.value = false
      }
    );
    getProceedTrip();
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
          localStorage.setItem("accessToken", accessToken)
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
    await logout(
      userInfo.value.userId,
      (response) => {
        if (response.status === httpStatusCode.OK) {
          isLogin.value = false
          userInfo.value = {
            userId: "",
            email: "",
            username: "",
            nickname: "",
            gender: "",
            birthday: "",
            totalStar: "",
            totalStarCount: "",
            profile: ""
          }
          isValidToken.value = false
          isCurrentTrip.value = false

          localStorage.removeItem("accessToken")
          localStorage.removeItem("refreshToken")

        } else {
          console.error("유저 정보 없음!!!!")
        }
      },
      (error) => {
        console.log(error)
      }
    )
    }
    
    const getProceedTrip = () => {
      if (isLogin.value) {
        isPoceedTrip(
          userInfo.value.userId,
          () => {
            console.log("아아");
            isCurrentTrip.value = true;
          },
          (error) => {
            console.log("우우");
            console.error(error);
          }
        )
      }
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
    isCurrentTrip
  }
  },
  {
    persist: true,
  }
)
