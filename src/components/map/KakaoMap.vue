<script setup>
import { ref, onMounted, defineProps, watch } from "vue";
import { KakaoMap, KakaoMapMarker } from 'vue3-kakao-maps';

const props = defineProps({
    markerInfoList: Object
})

const lat = ref(33.450701);
const lng = ref(126.570667);
const markerList = ref([]);

markerList.value.push({
    lat: 33.450701,
    lng: 126.570667
})

const setFirstLocation = () => {
    if (props.markerInfoList.length > 0) {
        lat.value = props.markerInfoList[0].lat;
        lng.value = props.markerInfoList[0].lng;
    }

    console.log(lat.value);
}

watch(
    () => props.markerInfoList,
    () => {
        setFirstLocation();
    },
    {deep:true}
)

</script>

<template>
    <div>
        <KakaoMap :lat="lat" :lng="lng" :level="11" :draggable="true" :width="600" :height="400" :markerList="markerInfoList">
        </KakaoMap>
    </div>
</template>

<style scoped>

</style>