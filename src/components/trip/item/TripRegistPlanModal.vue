<script setup>
import { localAxios } from "@/util/http-commons.js"
import { ref, onMounted, watch, defineProps, defineEmits } from "vue";
import { useRouter } from "vue-router";
import noImage from '@/assets/noImage.jpg';

const http = localAxios();
const router = useRouter();

defineProps({
    index: Number,
    sidoList: Object,
    planDate: String
})

const emit = defineEmits(["addAttraction"]);

const gugunList = ref([]);

const getGugun = (sidoCode) => {
    http.get(`/attraction/gugun?sido-code=${sidoCode}`)
        .then((response) => {
            gugunList.value = response.data;
        })
        .catch((error) => {
            console.log(error);
        });
}

const attractionKey = ref({
    sidoCode: '',
    gugunCode: '',
    keyword: ''
})

const attractionList = ref([])

const getAttractionList = () => {
    if (attractionKey.value.sidoCode === "" || attractionKey.value.gugunCode === "") {
        alert("시/도, 구/군을 선택하세요!");
        return;
    }

    http.get(`/attraction?sido-code=${attractionKey.value.sidoCode}&gugun-code=${attractionKey.value.gugunCode}&keyword=${attractionKey.value.keyword}`)
        .then((response) => {
            attractionList.value = response.data;
        })
        .catch((error) => {
            console.log(error);
        });
}

const resetPlan = () => {
    attractionKey.value.sidoCode = '';
    attractionKey.value.gugunCode = '';
    attractionKey.value.keyword = '';
    
    attractionList.value = []
}

const addAttraction = (index, attraction) => {
    emit('addAttraction', index, attraction);
    resetPlan();
}

watch(() => attractionKey.value.sidoCode, (newSidoCode) => {
    if (attractionKey.value.sidoCode !== '') {
        getGugun(newSidoCode);
    }
});

</script>

<template>
  <button type="button" class="btn btn-primary" data-bs-toggle="modal" :data-bs-target="'#addTrip'+index">계획 추가</button>

  <div class="modal fade" :id="'addTrip' + index" tabindex="-1" aria-labelledby="addTripLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
              <div class="modal-header">
                  <h5 class="modal-title" id="addTripLabel">계획 추가</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="resetPlan"></button>
              </div>
              <div class="modal-body" style="max-height: 80vh;">
                  <div class="row g-3 align-items-center mb-3 sticky-top bg-white">
                      <div class="col-md-3">
                          <select class="form-select" id="sido" v-model="attractionKey.sidoCode" required>
                              <option disabled value="">시/도</option>
                              <option v-for="sido in sidoList" :key="sido.sidoCode" :value="sido.sidoCode">{{ sido.sidoName }}</option>
                          </select>
                      </div>
                      <div class="col-md-3">
                          <select class="form-select" id="gugun" v-model="attractionKey.gugunCode" required>
                              <option disabled value="">구/군</option>
                              <option v-for="gugun in gugunList" :key="gugun.gugunCode" :value="gugun.gugunCode">{{ gugun.gugunName }}</option>
                          </select>
                      </div>
                      <div class="col-md-3">
                          <input type="text" class="form-control" id="title" v-model="attractionKey.keyword" placeholder="검색어">
                      </div>
                      <div class="col-md-3"> 
                          <button type="button" class="btn btn-primary w-100" @click="getAttractionList">검색</button>
                      </div>
                  </div>

                  <hr>

                  <div class="overflow-auto" style="max-height: calc(80vh - 130px);"> <!-- 최대 높이를 계산하여 지정 -->
                      <div v-for="attraction in attractionList" :key="attraction.contentId" class="card mb-3" style="cursor: pointer;" @click="addAttraction(index, attraction)" data-bs-dismiss="modal" aria-label="Close">
                          <div class="row g-0">
                              <div class="col-md-4">
                                  <img :src="attraction.firstImage == null || attraction.firstImage === '' ? noImage : attraction.firstImage" class="img-fluid rounded-start" alt="Attraction Image">
                              </div>
                              <div class="col-md-8">
                                  <div class="card-body">
                                      <h5 class="card-title">{{ attraction.title }}</h5>
                                      <p class="card-text">{{ attraction.overview }}</p>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  </div>
</template>

<style scoped>
.card {
    transition: transform 0.2s;
}

.card:hover {
    transform: scale(1.02);
}

.card-body {
    padding: 0.75rem;
}

.card-title {
    font-size: 1rem;
    font-weight: bold;
}

.card-text {
    font-size: 0.875rem;
    color: #6c757d;
    margin-top: 0.5rem;
}

.img-fluid {
    height: 100%;
    object-fit: cover;
}
</style>