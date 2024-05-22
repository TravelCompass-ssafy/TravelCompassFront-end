<script setup>
import { ref, onMounted, defineProps } from "vue";
import { KakaoMap, KakaoMapMarker } from 'vue3-kakao-maps';

const props = defineProps({
    
})

const coordinate = {
    lat: 37.566826,
    lng: 126.9786567
};

</script>

<template>
    <div>
        <KakaoMap :lat="coordinate.lat" :lng="coordinate.lng" :draggable="true" :width="600" :height="400">
            <KakaoMapMarker :lat="coordinate.lat" :lng="coordinate.lng"></KakaoMapMarker>
        </KakaoMap>
    </div>
</template>

<style scoped>

</style>