import { Body, Controller, Post } from '@nestjs/common';
import { CreateChatCompletionRequest } from './dto/create-chat-completion.request';
import { OpenaiService } from './openai.service';
import { ChatCompletionResponse } from './openai.service'; 

@Controller('openai')
export class OpenaiController {
  constructor(private readonly openaiService: OpenaiService) {}

  @Post('chatCompletion')
  async createChatCompletion(
    @Body() body: CreateChatCompletionRequest,
  ): Promise<ChatCompletionResponse> {
    return this.openaiService.createChatCompletion(body.messages);
  }
}
