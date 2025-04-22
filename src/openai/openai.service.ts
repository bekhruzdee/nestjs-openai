import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ChatCompletionMessageDto } from './dto/create-chat-completion.request';
import { ChatCompletionMessageParam } from 'openai/resources/chat';


export interface ChatCompletionResponse {
  choices: {
    message: ChatCompletionMessageParam;
  }[];
}

const getBotResponse = (userMessage: string): ChatCompletionMessageParam => {
  const message = userMessage.toLowerCase().trim();

  if (message.includes('hello') || message.includes('hi')) {
    return {
      role: 'assistant',
      content: 'Hello! How can I assist you today?',
    };
  } else if (message.includes('what is your name') || message.includes('who are you')) {
    return {
      role: 'assistant',
      content: 'I am Grok, an AI assistant created by xAI!',
    };
  } else if (message.includes('how are you') || message.includes('how are you doing')) {
    return { role: 'assistant', content: 'I am doing well, thank you! How about you?' };
  } else if (message.includes('help') || message.includes('assist')) {
    return {
      role: 'assistant',
      content: 'Of course, what do you need help with? Feel free to ask me anything!',
    };
  } else if (message.includes('today') || message.includes('now')) {
    return {
      role: 'assistant',
      content: `Today is ${new Date().toLocaleDateString('en-US')}. Current time: ${new Date().toLocaleTimeString('en-US')}.`,
    };
  } else {
    return {
      role: 'assistant',
      content: 'Sorry, I cannot answer that question. Would you like to ask something else?',
    };
  }
};

@Injectable()
export class OpenaiService {
  constructor() {}

  async createChatCompletion(
    messages: ChatCompletionMessageDto[],
  ): Promise<ChatCompletionResponse> {
    try {
      const lastMessage = messages[messages.length - 1];
      if (!lastMessage || lastMessage.role !== 'user') {
        throw new InternalServerErrorException(
          'Invalid message format: Last message must be from the user.',
        );
      }

      const botResponse = getBotResponse(lastMessage.content);

      const response: ChatCompletionResponse = {
        choices: [
          {
            message: botResponse,
          },
        ],
      };

      await new Promise((resolve) => setTimeout(resolve, 1000));

      return response;
    } catch (error) {
      console.error(
        '❌ Error in createChatCompletion:',
        error?.message || error,
      );
      throw new InternalServerErrorException(
        'An error occurred while processing the request.',
      );
    }
  }
}
