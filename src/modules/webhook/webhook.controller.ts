import {
	Body,
	Controller,
	Headers,
	HttpCode,
	HttpStatus,
	Post,
	RawBody,
	UnauthorizedException
} from '@nestjs/common'

import { WebhookService } from './webhook.service'

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
    return this.webhookService.receiveWebhookLivekit(body, autharization);
  }

  @Post('stripe')
	@HttpCode(HttpStatus.OK)
	public async receiveWebhookStripe(
		@RawBody() rawBody: string,
		@Headers('stripe-signature') sig: string
	) {
		if (!sig) {
			throw new UnauthorizedException(
				'Отсутствует подпись Stripe в заголовке'
			)
		}

		const event = await this.webhookService.constructStripeEvent(
			rawBody,
			sig
		)

		await this.webhookService.receiveWebhookStripe(event)
	}
}
