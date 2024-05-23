<script setup>
    import { localAxios } from "@/util/http-commons.js"
    import { ref, defineProps, defineEmits, onMounted } from "vue";
    import { useRouter } from "vue-router";

const http = localAxios();
const router = useRouter();

const props = defineProps({
    tripDetail: Object
})

const emit = defineEmits(['getTripDetail']);

const updateData = ref({
    tripDetailId: props.tripDetail.tripDetailId,
    title: props.tripDetail.title,
    content: props.tripDetail.content
})

const updateTrip = () => {
    router.push({ name: "trip-detail", params: { tripDetailId: updateData.value.tripDetailId } })
    http.put("/trip", updateData.value)
        .then((response) => {
            emit('getTripDetail');
        })
}
</script>

<template>
    <button type="button" class="btn btn-primary btn-sm me-2" data-bs-toggle="modal" :data-bs-target="'#updateTrip'">수정</button>

    <div class="modal fade" :id="'updateTrip'" tabindex="-1" aria-labelledby="addTripLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">수정하기</h5>
                </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label for="title" class="form-label">제목</label>
                            <input type="text" class="form-control" id="title" v-model="updateData.title" required>
                        </div>
                        <div class="mb-3">
                            <label for="description" class="form-label">내용</label>
                            <textarea class="form-control" id="description" v-model="updateData.content" required></textarea>
                        </div>
                    </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" @click="updateTrip" data-bs-dismiss="modal">변경하기</button>
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">닫기</button>
                </div>
            </div>
        </div>
    </div>

</template>

<style scoped>

</style>