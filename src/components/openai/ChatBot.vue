<template>
    <div class="chatbot-container">
        <div v-if="showChatbot" class="chatbot-window">
            <div class="chatbot-header">
                <img src="@/assets/chatbot.jpg" alt="Chatbot" class="chatbot-icon" />
                <span class="chatbot-title">Chatbot</span>
            </div>
            <div class="chatbot-messages" ref="messages">
                <div v-for="(message, index) in chatHistory" :key="index" class="chat-message">
                    <div
                        :class="{ 'user-message': message.sender === 'user', 'bot-message': message.sender === 'bot' }">
                        {{ message.content }}
                    </div>
                </div>
                <div v-if="loading" class="loading-overlay">
                    <img src="@/assets/loading.png" alt="Loading" class="loading-icon" />
                </div>
            </div>
            <input v-model="userInput" @keyup.enter="sendMessage" placeholder="Type a message..." class="chat-input" />
        </div>
        <div class="chatbot-toggle" @click="toggleChatbot">
            <img src="@/assets/chatbot.jpg" alt="Chatbot" class="chatbot-toggle-icon" />
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { getBotResponse } from '@/api/openaiAPI';

const showChatbot = ref(false);
const chatHistory = ref([]);
const userInput = ref('');
const loading = ref(false);

const toggleChatbot = () => {
    showChatbot.value = !showChatbot.value;
};

const sendMessage = async () => {
    if (userInput.value.trim() === '') return;
    const userMessage = { content: userInput.value, sender: 'user' };
    chatHistory.value.push(userMessage);
    userInput.value = '';

    loading.value = true; // 로딩 시작

    try {
        const botResponse = await getBotResponse(userMessage.content);
        const botMessage = { content: botResponse, sender: 'bot' };
        chatHistory.value.push(botMessage);
    } catch (error) {
        console.error('Error fetching bot response:', error);
    } finally {
        loading.value = false; // 로딩 종료
    }
};
</script>

<style scoped>
.chatbot-window {
    width: 300px;
    height: 400px;
    background-color: #f2f2f2;
    border-radius: 15px;
    overflow: hidden;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    position: fixed;
    bottom: 105px;
    /* 조정 가능한 값 */
    right: 40px;
    /* 조정 가능한 값 */
    z-index: 1000;
    /* 토글 아이콘 위로 윈도우가 올라오도록 설정 */
}

.chatbot-toggle {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background-color: #007bff;
    position: fixed;
    bottom: 20px;
    right: 20px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1001;
    /* 토글 아이콘이 가장 위에 뜨도록 설정 */
}


.chatbot-container {
    position: fixed;
    bottom: 20px;
    right: 20px;
    display: flex;
    flex-direction: column;
}

.chatbot-window {
    width: 300px;
    height: 400px;
    background-color: #f2f2f2;
    border-radius: 15px;
    overflow: hidden;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
}

.chatbot-header {
    background-color: #007bff;
    color: #fff;
    padding: 10px;
    display: flex;
    align-items: center;
}

.chatbot-icon {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    margin-right: 10px;
}

.chatbot-title {
    font-size: 18px;
}

.chatbot-messages {
    flex: 1;
    overflow-y: auto;
    padding: 10px;
    position: relative;
}

.chat-message {
    margin-bottom: 10px;
}

.user-message {
    text-align: right;
}

.bot-message {
    text-align: left;
}

.chat-input {
    border: none;
    padding: 10px;
    font-size: 16px;
    outline: none;
}

.chatbot-toggle {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background-color: #007bff;
    position: absolute;
    bottom: 20px;
    right: 20px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
}

.chatbot-toggle-icon {
    width: 40px;
    height: 40px;
}

.loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-color: rgba(255, 255, 255, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
}

.loading-icon {
    width: 50px;
    height: 50px;
}
</style>