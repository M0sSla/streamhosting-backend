import { Controller, HttpCode, HttpStatus, Post, Body, Headers, UnauthorizedException } from '@nestjs/common';
import { WebhookService } from './webhook.service';

@Controller('webhook')
export class WebhookController {
  public constructor(private readonly webhookService: WebhookService) {}

  @Post('livekit')
  @HttpCode(HttpStatus.OK)
  public async recieveWebhookLivekit(
    @Body() body: string,
    @Headers('Authorization') autharization: string
  ) {
    if (!autharization) {
      throw new UnauthorizedException('Отсутствует заголовок авторизации');
    }
    return this.webhookService.recieveWebhookLivekit(body, autharization);
  }
}
