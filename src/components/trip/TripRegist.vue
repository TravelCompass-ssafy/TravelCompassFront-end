<script setup>
import { localAxios } from "@/util/http-commons.js"
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";

const http = localAxios();
const router = useRouter();

onMounted(() => {
    getSido();
})

const sidoList = ref([]);
const gugunList = ref([]);

const getSido = () => {
    http.get("/attraction/sido")
        .then((response) => {
            sidoList.value = response.data;
        })
        .catch((error) => {
            console.log(error);
        });
}

const getGugun = (sidoCode) => {
    http.get(`/attraction/gugun?sido-code=${sidoCode}`)
        .then((response) => {
            gugunList.value = response.data;
        })
        .catch((error) => {
            console.log(error);
        });
}

const form = ref({
    title: '',
    sidoCode: '',
    startDate: '',
    endDate: '',
    maxCapacity: 0,
    content: '',
    plans: [''],
    image: null,
})

const registTrip = () => {
    console.log(form.value);
    if (form.value.startDate > form.value.endDate) {
        console.log(123);
    }
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
                    <option disabled value="0">인원을 선택하세요</option>
                    <option v-for="i in 100" :key="i" :value="i">{{ i }}</option>
                </select>
            </div>
            <div class="mb-3">
                <label for="description" class="form-label">내용</label>
                <textarea class="form-control" id="description" v-model="form.content" required></textarea>
            </div>
            <div class="mb-3">
                <label for="plan" class="form-label">여행 계획</label>
                <div v-for="(plan, index) in form.plans" :key="index" class="mb-2">
                    <input type="text" class="form-control mb-1" :placeholder="'Day ' + (index + 1)"
                        v-model="form.plans[index]" required>
                </div>


                <button type="button" class="btn btn-primary" @click="addPlan">+ 계획 추가</button>
            </div>

            <button type="submit" @click.prevent="registTrip" class="btn btn-success">등록</button>

            <!-- Button trigger modal -->
            <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addTrip">
            계획 추가
            </button>

            <!-- Modal -->
            <div class="modal fade" id="addTrip" tabindex="-1" aria-labelledby="addTripLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="addTripLabel">계획 추가</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            ...
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-primary">추가</button>
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">닫기</button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </div>
</template>

<style scoped></style>