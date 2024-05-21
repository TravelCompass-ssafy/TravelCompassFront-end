<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { useRouter } from "vue-router";

import { localAxios } from "@/util/http-commons.js"
import { userStore } from '@/stores/userStore.js'

import TripRegistPlanModal from "@/components/trip/item/TripRegistPlanModal.vue";

const http = localAxios();
const router = useRouter();
const store = userStore();

onMounted(() => {
    getSido();
})

const sidoList = ref([]);

const getSido = () => {
    http.get("/attraction/sido")
        .then((response) => {
            sidoList.value = response.data;
        })
        .catch((error) => {
            console.log(error);
        });
}

const form = ref({
    title: '',
    userId: store.userInfo.userId,
    userNickname: store.userInfo.nickname,
    sidoCode: '',
    startDate: '',
    endDate: '',
    maxCapacity: 0,
    content: '',
    tripPlanAttractionList: [],
    image: null,
})

const addAttraction = (index, attraction) => {
    form.value.tripPlanAttractionList[index].push(attraction);
}

const deleteAttraction = (index, planIndex) => {
    form.value.tripPlanAttractionList[index].splice(planIndex, 1);
}


const joinAble = ref(false);

const registTrip = () => {
    const joinParams = {
        userId: store.userInfo.userId,
        startDate: form.value.startDate,
        endDate: form.value.endDate
    }

    console.log(joinParams);

    http.get("/trip/checkjoinable", { params: joinParams })
        .then((response) => {
            joinAble.value = response.data;

            if (!joinAble.value) {
                alert("중복된 일정이 있습니다!");
                return;
            }

            console.log(form.value);
            http.post("/trip", form.value)
                .then((response) => {
                    router.push({ name: "trip" });
                })
                .catch((error) => {
                console.log(error);
                });
        })
}

watch(() => form.value.endDate, (newEndDate, oldEndDate) => {
    if (form.value.startDate && form.value.startDate > newEndDate) {
        alert("날짜를 잘못 입력하였습니다.");
        form.value.endDate = oldEndDate;
    }
});

watch(() => form.value.startDate, (newStartDate, oldStartDate) => {
    if (form.value.endDate && form.value.endDate < newStartDate) {
        alert("날짜를 잘못 입력하였습니다.");
        form.value.startDate = oldStartDate;
    }
});

const dateRange = computed(() => {
    const startDate = new Date(form.value.startDate);
    const endDate = new Date(form.value.endDate);
    const range = [];
    let currentDate = startDate;
    while (currentDate <= endDate) {
        range.push(currentDate.toISOString().split('T')[0]);
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return range;
});

watch(dateRange, (newRange) => {
    form.value.tripPlanAttractionList = newRange.map(() => []);
}, { immediate: true });
</script>

<template>
    <div class="container mt-5">
        <h1>여행 동행 구하기</h1>
        <form>
            <div class="mb-3">
                <label for="image" class="form-label">사진 등록</label>
                <input type="file" class="form-control" id="image" @change="onFileChange">
            </div>
            <div class="mb-3">
                <label for="title" class="form-label">제목</label>
                <input type="text" class="form-control" id="title" v-model="form.title" required>
            </div>
            <div class="mb-3">
                <label for="region" class="form-label">지역 선택</label>
                <select class="form-select" id="region" v-model="form.sidoCode" required>
                    <option disabled value="">지역을 선택하세요</option>
                    <option v-for="sido in sidoList" :key="sido.sidoCode" :value="sido.sidoCode">{{ sido.sidoName }}</option>
                </select>
            </div>
            <div class="mb-3">
                <label for="date" class="form-label">일정</label>
                <input type="date" class="form-control" id="date" v-model="form.startDate" required>
                <input type="date" class="form-control" id="date" v-model="form.endDate" required>
            </div>
            <div class="mb-3">
                <label for="people" class="form-label">인원</label>
                <select class="form-select" id="people" v-model="form.maxCapacity" required>
                    <option disabled value="1">인원을 선택하세요</option>
                    <option v-for="i in 100" :key="i" :value="i">{{ i }}</option>
                </select>
            </div>
            <div class="mb-3">
                <label for="description" class="form-label">내용</label>
                <textarea class="form-control" id="description" v-model="form.content" required></textarea>
            </div>
            <div class="mb-3">
                <label for="plan" class="form-label">여행 계획</label>
                <template v-for="(planDate, index) in dateRange" :key="planDate">
                    <div class="mb-2" :id="planDate">
                        <label for="people" class="form-label">{{ planDate }}</label>
                    </div>
                    <div v-for="(attraction, planIndex) in form.tripPlanAttractionList[index]" :key="attraction.contentId">
                        <label for="people" class="form-label">{{ attraction.title }}</label>
                        <button type="button" @click="deleteAttraction(index, planIndex)" class="btn btn-danger">제거</button>
                    </div>
                    <div>
                        <TripRegistPlanModal :index="index" :sido-list="sidoList" :plan-date="planDate" @add-attraction="addAttraction"></TripRegistPlanModal>
                    </div>
                </template>
            </div>

            <button type="submit" @click.prevent="registTrip" class="btn btn-success">등록</button>
        </form>

    </div>
</template>

<style scoped></style>