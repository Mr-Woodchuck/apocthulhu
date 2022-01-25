import { formatRoll } from './chat.js'

export default class ApocthulhuHooks {

  static async onRenderChatMessage(
    message,
    html,
    data,
  ) {
    if (message.isRoll && message.isContentVisible) {
      await formatRoll(message, html, data);
    }

    // chat.hideChatActionButtons(message, html, data);
  }
};
