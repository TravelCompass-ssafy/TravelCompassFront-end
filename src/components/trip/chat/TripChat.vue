<script setup>
import { ref, onMounted } from "vue";
import { userStore } from "@/stores/userStore.js"
import { storeToRefs } from "pinia"
import SockJS from "sockjs-client/dist/sockjs"
import Stomp from "stompjs"

const store = userStore();
const { userInfo } = storeToRefs(store);

const tripDetailId = ref(2);
const messages = ref([]);
const sendMessageForm = ref({
    tripDetailId: tripDetailId.value,
    userId: userInfo.value.userId,
    message: ""
})

let stompClient;

onMounted(() => {
    const socket = new SockJS('http://localhost/ws');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, frame => {
        console.log('Connected: ' + frame);
        stompClient.subscribe(`/topic/messages/${tripDetailId.value}`, message => {
            messages.value.push(JSON.parse(message.body));
        })
    })
})

const sendMessage = () => {
    stompClient.send('/app/chat', {}, JSON.stringify(sendMessageForm.value))
    sendMessageForm.value.message = '';
}

</script>

<template>
    <div class="container">

        <div class="mt-3">
            <ul class="list-group">
                <li v-for="message in messages" :key="message.tripDetailChatId" class="list-group-item">
                    <div v-if="message.userId !== userInfo.userId" class="d-flex justify-content-start">
                        <img :src="'http://localhost' + message.profile" class="rounded-circle me-2"
                            style="width: 40px; height: 40px;">
                        <div>
                            <div><strong>{{ message.nickname }}</strong></div>
                            <div>{{ message.message }}</div>
                            <div><small>{{ message.createdAt }}</small></div>
                        </div>
                    </div>
                    <div v-else class="d-flex justify-content-end">
                        <div class="text-end">
                            <div>{{ message.message }}</div>
                            <div><small>{{ message.createdAt }}</small></div>
                        </div>
                        <img :src="'http://localhost' + message.profile" class="rounded-circle ms-2"
                            style="width: 40px; height: 40px;">
                    </div>
                </li>
            </ul>
        </div>

        <div class="mb-3">
            <input v-model="sendMessageForm.message" class="form-control" placeholder="Message">
        </div>
        <button @click="sendMessage" class="btn btn-primary">Send</button>
    </div>
</template>

<style scoped></style>