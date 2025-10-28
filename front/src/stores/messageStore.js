import { defineStore } from "pinia";

export const useMessageStore = defineStore("message", {
  state: () => ({
    messages: [],
  }),

  actions: {
    addMessage(message) {
        const id = Date.now() + Math.random();
        const {text, type, duration = 2000} = message

        this.messages.push({
            id,
            text,
            type,
            duration : duration 
        })

        setTimeout(() => {
            this.removeMessage(id);
        }, duration);
    },

    success(text, duration) {
      this.addMessage({ text, type: "success", duration });
    },

    error(text, duration ) {
      this.addMessage({ text, type: "error", duration });
    },

    removeMessage(id) {
        this.messages = this.messages.filter(msg => msg.id !== id);
    }
  },
});
