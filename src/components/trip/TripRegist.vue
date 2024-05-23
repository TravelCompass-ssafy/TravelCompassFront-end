<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { useRouter } from "vue-router";

import { localAxios } from "@/util/http-commons.js"
import { userStore } from '@/stores/userStore.js'

import TripRegistPlanModal from "@/components/trip/item/TripRegistPlanModal.vue";

const http = localAxios();
const router = useRouter();
const store = userStore();

const selectedFile = ref(null);

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

const onFileChange = (event) => {
    selectedFile.value = event.target.files[0];
}

const registTrip = () => {
    const joinParams = {
        userId: store.userInfo.userId,
        startDate: form.value.startDate,
        endDate: form.value.endDate
    }

    http.get("/trip/checkjoinable", { params: joinParams })
        .then((response) => {
            joinAble.value = response.data;

            if (!joinAble.value) {
                alert("중복된 일정이 있습니다!");
                return;
            }

            const formData = new FormData();

            formData.append('title', form.value.title);
            formData.append('userId', form.value.userId);
            formData.append('userNickname', form.value.userNickname);
            formData.append('sidoCode', form.value.sidoCode);
            formData.append('startDate', form.value.startDate);
            formData.append('endDate', form.value.endDate);
            formData.append('maxCapacity', form.value.maxCapacity);
            formData.append('content', form.value.content);
            formData.append('tripPlanAttractionListJson', JSON.stringify(form.value.tripPlanAttractionList));
            formData.append('image', selectedFile.value);

            http.post("/trip", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `${localStorage.getItem("accessToken")}`
                }
            })
                .then((response) => {
                    router.push({ name: "trip" });
                })
                .catch((error) => {
                    console.log(error);
                });
        })
}

let disableWatchers = false;

watch(() => form.value.endDate, (newEndDate, oldEndDate) => {
    if (disableWatchers) return;
    if (form.value.startDate && form.value.startDate > newEndDate) {
        alert("날짜를 잘못 입력하였습니다.");
        disableWatchers = true;
        form.value.endDate = oldEndDate;
        disableWatchers = false;
    }
});

watch(() => form.value.startDate, (newStartDate, oldStartDate) => {
    if (disableWatchers) return;
    if (form.value.endDate && form.value.endDate < newStartDate) {
        alert("날짜를 잘못 입력하였습니다.");
        disableWatchers = true;
        form.value.startDate = oldStartDate;
        disableWatchers = false;
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
        <h1 class="mb-4 text-center">여행 동행 구하기</h1>
        <form>
            <div class="mb-3">
                <label for="image" class="form-label fw-bold">사진 등록</label>
                <input type="file" class="form-control" id="image" @change="onFileChange">
            </div>
            <div class="mb-3">
                <label for="title" class="form-label fw-bold">제목</label>
                <input type="text" class="form-control" id="title" v-model="form.title" required>
            </div>
            <div class="mb-3">
                <label for="region" class="form-label fw-bold">지역 선택</label>
                <select class="form-select" id="region" v-model="form.sidoCode" required>
                    <option disabled value="">지역을 선택하세요</option>
                    <option v-for="sido in sidoList" :key="sido.sidoCode" :value="sido.sidoCode">{{ sido.sidoName }}
                    </option>
                </select>
            </div>
            <div class="mb-3">
                <label for="date" class="form-label fw-bold">일정</label>
                <div class="d-flex gap-2">
                    <input type="date" class="form-control" v-model="form.startDate" required>
                    <input type="date" class="form-control" v-model="form.endDate" required>
                </div>
            </div>
            <div class="mb-3">
                <label for="people" class="form-label fw-bold">인원</label>
                <select class="form-select" id="people" v-model="form.maxCapacity" required>
                    <option disabled value="">인원을 선택하세요</option>
                    <option v-for="i in 100" :key="i" :value="i">{{ i }}</option>
                </select>
            </div>
            <div class="mb-3">
                <label for="description" class="form-label fw-bold">내용</label>
                <textarea class="form-control" id="description" rows="5" v-model="form.content" required></textarea>
            </div>
            <div class="mb-3">
                <label for="plan" class="form-label fw-bold">여행 계획</label>
                <template v-for="(planDate, index) in dateRange" :key="planDate">
                    <div class="mb-2" :id="planDate">
                        <label class="form-label fw-bold text-primary">{{ planDate }}</label>
                    </div>
                    <div v-for="(attraction, planIndex) in form.tripPlanAttractionList[index]" :key="attraction.contentId" class="d-flex align-items-center mb-2">
                        <div class="flex-grow-1">
                            <label class="form-label">{{ attraction.title }}</label>
                        </div>
                        <button type="button" @click="deleteAttraction(index, planIndex)" class="btn btn-danger btn-sm ms-2">제거</button>
                    </div>
                    <div class="mb-3">
                        <TripRegistPlanModal :index="index" :sido-list="sidoList" :plan-date="planDate" @add-attraction="addAttraction"></TripRegistPlanModal>
                    </div>
                </template>
            </div>
            <div class="text-center">
                <button type="submit" @click.prevent="registTrip" class="btn btn-success">등록</button>
            </div>
        </form>
    </div>
</template>

<style scoped>
.container {
    max-width: 700px;
    margin: auto;
}

label.form-label.fw-bold.text-primary {
    font-size: 1.1em;
    padding-bottom: 0.5em;
    border-bottom: 2px solid #007bff;
    display: block;
}
</style>
