<script setup>
import TripChat from "@/components/trip/chat/TripChat.vue";
import TripUpdateModal from "@/components/trip/item/TripUpdateModal.vue"

import KakaoMap from "@/components/map/KakaoMap.vue";

import { localAxios } from "@/util/http-commons.js"
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { userStore } from '@/stores/userStore.js'
import { joinTripAlaram } from "@/api/alarmAPI";
import { jwtDecode } from "jwt-decode"

const { VITE_VUE_IMG_URL } = import.meta.env;

const http = localAxios();
const route = useRoute();
const router = useRouter();
const store = userStore();

onMounted(() => {
    getTripDetail();
    upCountView();
})

const upCountView = () => {
    http.put(`/trip/view/${route.params.tripDetailId}`)
        .then((response) => {
        })
        .catch((error) => {
        });
}

const tripDetail = ref({});

const getTripDetail = () => {
    http.get(`/trip/${route.params.tripDetailId}`)
        .then((response) => {
          tripDetail.value = response.data;
            markerInput();
        })
        .catch((error) => {
            console.log(error);
        });
}

const joinAble = ref(false);

const joinTrip = async () => {
    const joinParams = {
        userId: store.userInfo.userId,
        startDate: tripDetail.value.startDate,
        endDate: tripDetail.value.endDate
    }

    http.get("/trip/checkjoinable", { params: joinParams })
        .then((response) => {
            joinAble.value = response.data;

            if (tripDetail.value.memberList.length >= tripDetail.value.maxCapacity) {
                alert("정원이 초과되었습니다!");
                return;
            }

            if (tripDetail.value.memberList.some(member => member.userId === store.userInfo.userId)) {
                alert("이미 참가하였습니다. ");
                return;
            }

            if (!joinAble.value) {
                alert("중복된 일정이 있습니다!");
                return;
            }

            const tripDetailMemberDto = {
                tripDetailId: tripDetail.value.tripDetailId,
                userId: store.userInfo.userId,
                nickname: tripDetail.value.nickname
            }

            http.post(`/trip/${tripDetail.value.tripDetailId}`, tripDetailMemberDto, {
                headers: {
                    'Authorization': `${localStorage.getItem("accessToken")}`
                }
            })
                .then((response) => {
                    joinTripAlaram(
                        tripDetail.value.tripDetailId,
                        () => {
                        },
                        (error) => {
                            console.error(error);
                        }
                    )
                    getTripDetail();
                    alert("동행하였습니다!");
                })
                .catch((error) => {
                    console.log(error);
                    alert("동행실패!");
                });
        })
}

const deleteTrip = () => {
    http.delete(`/trip/${tripDetail.value.tripDetailId}`)
        .then((response) => {
            router.push({ name: 'trip-list' });
        })
        .catch((error) => {
            console.log(errer);
        })
}

const markerInfoList = ref([]);

const markerInput = () => {
    let index = 1;

    for (let i = 0; i < tripDetail.value.tripPlanAttractionList.length; i++) {
        const markerList = tripDetail.value.tripPlanAttractionList[i];

        for (let j = 0; j < markerList.length; j++) {
            const marker = markerList[j];
            const data = {
                key: index,
                lat: marker.latitude,
                lng: marker.longitude
            };

            markerInfoList.value.push(data);
            index++;
        }
    }
}

</script>

<template>
    <div class="container mt-4">
        <div class="row">
            <div class="col-md-12">
                <div class="card mb-4">
                    <img :src="VITE_VUE_IMG_URL + tripDetail.imagePath" class="card-img-top img-fluid"
                        alt="Trip Image" style="max-height: 300px; object-fit: cover;">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center">
                            <h3 class="card-title m-0">{{ tripDetail.title }}</h3>
                            <div v-if="tripDetail.userId === store.userInfo.userId">
                                <trip-update-modal :trip-detail="tripDetail" @get-trip-detail="getTripDetail" />
                                <button type="button" @click="deleteTrip" class="btn btn-danger btn-sm">삭제</button>
                            </div>
                        </div>
                        <div class="mb-3">
                            <div class="d-flex flex-column align-items-start">
                                <div>{{ tripDetail.view + 1 }} views</div>
                                <div v-if="tripDetail.memberList">
                                    {{ tripDetail.memberList.length }}/{{ tripDetail.maxCapacity }} members
                                </div>
                                <div v-else>
                                    0/{{ tripDetail.maxCapacity }} members
                                </div>
                                <div class="mt-2">{{ tripDetail.nickname }}</div>
                            </div>
                        </div>
                        <hr>
                        <div>
                            <h5 class="card-subtitle mb-2">여행 일정</h5>
                            <p class="card-text">{{ tripDetail.startDate }} ~ {{ tripDetail.endDate }}</p>
                            <p class="card-text">{{ tripDetail.sidoName }}</p>
                        </div>
                        <hr>
                        <div>
                            <h5 class="card-subtitle mb-2">소개</h5>
                            <p class="card-text">{{ tripDetail.content }}</p>
                        </div>
                        <hr>
                        <div>
                            <h5 class="card-subtitle mb-2">참여중</h5>
                            <div class="d-flex flex-row flex-wrap">
                                <div class="p-2" v-for="member in tripDetail.memberList"
                                    :key="member.tripDetailMemberId">
                                    {{ member.nickName }}
                                </div>
                            </div>
                        </div>
                        <hr>
                        <h5 class="card-subtitle mb-2">여행계획</h5>
                        <kakao-map :marker-info-list="markerInfoList"/>
                        <template v-for="(tripPlan, tripPlanIndex) in tripDetail.tripPlanAttractionList"
                            :key="tripPlanIndex">
                            <template v-if="tripPlan.length > 0">
                                <div class="font-weight-bold mt-3">{{ tripPlan[0].tripDate }}</div>
                                <div v-for="plan in tripPlan" :key="plan.contentId" class="ml-3 mb-2">
                                    <span class="badge badge-secondary text-dark" style="font-size: 1em;">{{ plan.title
                                        }}</span>
                                </div>
                            </template>
                        </template>
                    </div>
                </div>
            </div>
        </div>

        <button type="button" class="btn btn-primary" @click="joinTrip">동행하기</button>

        <TripChat :trip-detail-id="route.params.tripDetailId" />
    </div>
</template>

<style scoped></style>