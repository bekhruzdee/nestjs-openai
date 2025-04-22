import { Injectable, InternalServerErrorException } from '@nestjs/common';
import OpenAI from 'openai';
import { ChatCompletionMessageDto } from './dto/create-chat-completion.request';
import { ChatCompletionMessageParam } from 'openai/resources/chat';

@Injectable()
export class OpenaiService {
  constructor(private readonly openai: OpenAI) {}

  async createChatCompletion(messages: ChatCompletionMessageDto[]) {
    try {
      return await this.openai.chat.completions.create({
        messages: messages as ChatCompletionMessageParam[],
        model: 'gpt-3.5-turbo',
      });
    } catch (error) {
      console.error('❌ OpenAI API Error:', error?.message || error);

      if (error?.code === 'insufficient_quota') {
        throw new InternalServerErrorException(
          'Your OpenAI quota has been exceeded. Please check your billing details.',
        );
      } else if (error?.code === 'model_not_found') {
        throw new InternalServerErrorException(
          'The specified model was not found or you do not have access to it.',
        );
      }

      throw new InternalServerErrorException(
        'An error occurred while processing the request with OpenAI.',
      );
    }
  }
}
