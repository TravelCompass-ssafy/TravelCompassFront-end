<script setup>
import { ref } from "vue";

const props = defineProps(
    {
        rating: {
            type: Number,
            default: 0
        }
    }
)

const emit = defineEmits(['rating-selected']);

const stars = ref([1, 2, 3, 4, 5]);
const selectedRating = ref(props.rating);

const selectRating = (star) => {
    selectedRating.value = star;
    emit('rating-selected', star);
}
</script>

<template>
    <div>
        <span v-for="star in stars" :key="star" @click="selectRating(star)" class="star"
            :class="{ 'star-selected': star <= rating }">&#9733;</span>
    </div>
</template>

<style scoped>
.star {
    font-size: 2rem;
    cursor: pointer;
}

.star-selected {
    color: gold;
}
</style>