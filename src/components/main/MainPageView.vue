<script setup>
import BestPlanViewItem from "@/components/main/item/BestPlanViewItem.vue";
import RecentTripItem from "@/components/main/item/RecentTripItem.vue";
</script>

<template>
    <div class="container mt-5">
        <div class="row">
            <div class="col-md-12 mb-4">
                <div class="bg-lighter border rounded p-4">
                    <h5 class="mb-3 text-primary">베스트 여행도장 - 조회수</h5>
                    <best-plan-view-item />
                </div>
            </div>
            <div class="col-md-12 mb-4">
                <div class="bg-lighter border rounded p-4">
                    <h5 class="mb-3 text-success">최근 함께가요</h5>
                    <recent-trip-item />
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>

</style>