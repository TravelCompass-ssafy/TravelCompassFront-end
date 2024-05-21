<script setup>
import { ref, onMounted, computed, watch, nextTick } from "vue";
import { userStore } from "@/stores/userStore.js"
import { storeToRefs } from "pinia"
import SockJS from "sockjs-client/dist/sockjs"
import Stomp from "stompjs"
import { format, parseISO, isSameDay } from 'date-fns'
import { getMessages } from "@/api/chatAPI.js"

const { VITE_VUE_SOCKET, VITE_VUE_IMG_URL } = import.meta.env;

const props = defineProps({
    tripDetailId: Number,
})

const store = userStore();
const { userInfo } = storeToRefs(store);

const messages = ref([]);
const currentPage = ref(0);
const pageSize = 5;
const hasMoreData = ref(true); // 더 이상 데이터가 없는 경우를 추적

const chatContainer = ref(null);
const isLoading = ref(false); // 로딩 상태 추적
const userInitiatedScroll = ref(false); // 사용자가 스크롤을 했는지 추적

const sendMessageForm = ref({
    tripDetailId: props.tripDetailId,
    userId: userInfo.value.userId,
    message: ""
})

let stompClient;

const loadMessages = async () => {
    if (isLoading.value || !hasMoreData.value) return; // 여러 요청이 동시에 발생하지 않도록 방지
    isLoading.value = true;

    const params = {
        page: currentPage.value,
        size: pageSize
    }
    getMessages(
        props.tripDetailId,
        params,
        ({ data }) => {
            if (data.length < pageSize) {
                hasMoreData.value = false; // 더이상 데이터가 없음
            }
            messages.value = [...data.reverse(), ...messages.value];
        },
        (error) => {
            console.error();
        }
    )
    isLoading.value = false;

}

onMounted(() => {
    const socket = new SockJS(`${VITE_VUE_SOCKET}/ws`);
    stompClient = Stomp.over(socket);
    stompClient.connect({}, frame => {
        console.log('Connected: ' + frame);
        stompClient.subscribe(`/topic/messages/${props.tripDetailId}`, async (message) => {
            const parsedMessage = JSON.parse(message.body);
            parsedMessage.createdAtFormatted = format(parseISO(parsedMessage.createdAt), 'yyyy-MM-dd HH:mm:ss');
            messages.value.push(parsedMessage);

            // await nextTick(); // DOM 업데이트 후 스크롤 위치 조정
            if (!userInitiatedScroll.value) {
                scrollToBottom(); // 새로운 메시지를 받을 때 맨 아래로 스크롤
            }
        })
    })

    loadMessages();
})

const sendMessage = async () => {
    if (sendMessageForm.value.message.trim() === '') return; // 빈 메시지를 전송하지 않도록 방지

    stompClient.send('/app/chat', {}, JSON.stringify(sendMessageForm.value))
    sendMessageForm.value.message = '';

    await nextTick();
    scrollToBottom(); // 새로운 메시지를 보낼 때 맨 아래로 스크롤
}

const handleScroll = () => {
    const element = chatContainer.value;
    const threshold = 50;
    if (element.scrollTop <= threshold && hasMoreData.value) {
        currentPage.value++; // 현재 페이지를 증가시켜 이전 메시지 가져오기
        loadMessages();
    }

    /*
    scrollHeight: 요소의 전체 스크롤 가능 높이
    scrollTop: 스크롤이 맨 위에서부터 얼마나 떨어져있는지
    clentHeight: 요소의 높이
    */
    // 사용자가 스크롤을 직접 조작했는지 감지
    userInitiatedScroll.value = (element.scrollHeight - element.scrollTop - element.clientHeight > threshold);
}

const scrollToBottom = async () => {
    await nextTick();
    const element = chatContainer.value;
    element.scrollTop = element.scrollHeight;
};


const formattedMessages = computed(() => {
    const formatted = [];
    let lastDate = null;

    messages.value.forEach(message => {
        const messageDate = parseISO(message.createdAt);
        if (!lastDate || !isSameDay(lastDate, messageDate)) {
            formatted.push({
                type: 'date',
                date: format(messageDate, 'yyyy년 M월 d일')
            });
            lastDate = messageDate;
        }
        formatted.push(message);
    });

    return formatted;
});
</script>

<template>

    <div class="container">
        <div class="mt-3" id="scroll" ref="chatContainer" @scroll="handleScroll">
            <ul class="list-group">
                <li v-for="message in formattedMessages" :key="message.tripDetailChatId || message.date"
                    class="list-group-item">
                    <template v-if="message.type === 'date'">
                        <div class="text-center text-muted">{{ message.date }}</div>
                    </template>
                    <template v-else>
                        <div v-if="message.userId !== userInfo.userId" class="d-flex justify-content-start">
                            <img :src="VITE_VUE_IMG_URL + message.profile" class="rounded-circle me-2"
                                style="width: 40px; height: 40px;">
                            <div>
                                <div><strong>{{ message.nickName }}</strong></div>
                                <div>{{ message.message }}</div>
                                <div><small>{{ format(parseISO(message.createdAt), 'HH:mm') }}</small></div>
                            </div>
                        </div>
                        <div v-else class="d-flex justify-content-end">
                            <div class="text-end">
                                <div>{{ message.message }}</div>
                                <div><small>{{ format(parseISO(message.createdAt), 'HH:mm') }}</small></div>
                            </div>
                            <!-- <img :src="'http://localhost' + message.profile" class="rounded-circle ms-2"
                                style="width: 40px; height: 40px;"> -->
                        </div>
                    </template>
                </li>
            </ul>
        </div>
        <div class="mt-3 mb-3">
            <input @keyup.enter="sendMessage" v-model="sendMessageForm.message" class="form-control"
                placeholder="Message">
        </div>
        <button @click="sendMessage" class="btn btn-primary">Send</button>
    </div>
</template>

<style scoped>
.container {
    width: 500px;
}

#scroll {
    height: 300px;
    /* 채팅 컨테이너 높이 */
    overflow-y: auto;
    /* 세로 스크롤만 표시되도록 */
}
</style>