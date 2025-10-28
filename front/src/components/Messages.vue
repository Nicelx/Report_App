<script>
import { mapStores } from "pinia";
import { useMessageStore } from "@/stores";

export default {
  data() {
    return {};
  },
  computed: {
    ...mapStores(useMessageStore),
  },
};
</script>

<template>
  <div class="messages">
    <transition-group name="message" tag="div">
      <div
        v-for="message in this.messageStore.messages"
        :class="['message', `message--${message.type}`]"
      >
        {{ message.text }}
      </div>
    </transition-group>
  </div>
</template>

<style scoped>
.messages {
  position: fixed;
  right: 30px;
  bottom: 30px;
  width: 300px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 10;
}

.message {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  transition: all 3s ease;
  min-width: 300px;
}

.message--success {
  background-color: #f6ffed;
  border: 1px solid #b7eb8f;
  color: var(--color-primary);
  font-size: 18px;
}
s .message--error {
  background-color: #fff2f0;
  border: 1px solid #ffccc7;
  color: #ff4d4f;
}

.message-enter-active,
.message-leave-active {
  transition: all 1s ease;
}

.message-enter-from {
  opacity: 0;
}

.message-leave-to {
  opacity: 0;
}

.message-move {
  transition: all 1s ease;
}
</style>
