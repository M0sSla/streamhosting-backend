import { PrismaService } from '@/src/core/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { LivekitService } from '../libs/livekit/livekit.service';
import { NotificationService } from '../notification/notification.service';
import { TelegramService } from '../libs/telegram/telegram.service';

@Injectable()
export class WebhookService {
    public constructor(
        private readonly prismaService: PrismaService,
        private readonly livekitService: LivekitService,
        private readonly notificationService: NotificationService,
		private readonly telegramService: TelegramService
    ) {}

    public async recieveWebhookLivekit(body: string, autharization: string) {
        // true is a little bit unsafe, if unnecessary, we can remove it later
        const event = await this.livekitService.receiver.receive(body, autharization, true);

        if (event.event === 'ingress_started') {
			const stream = await this.prismaService.stream.update({
				where: {
					ingressId: event.ingressInfo?.ingressId
				},
				data: {
					isLive: true
				},
				include: {
					user: true
				}
			})

			const followers = await this.prismaService.follow.findMany({
				where: {
					followingId: stream.user?.id,
					follower: {
						isDeactivated: false
					}
				},
				include: {
					follower: {
						include: {
							notificationSettings: true
						}
					}
				}
			})

			for (const follow of followers) {
				const follower = follow.follower

                // Может все накрыться медным тазом, потому что используем !! для гарантии наличия юзера, но в теории, если стрим есть, то юзер тоже должен быть
				if (follower.notificationSettings?.siteNotifications) {
					await this.notificationService.createStreamStart(
						follower.id,
						stream.user!!
					)
				}

				if (
					follower.notificationSettings?.telegramNotifications &&
					follower.telegramId
				) {
					await this.telegramService.sendStreamStart(
						follower.telegramId,
						stream.user!!
					)
				}
			}
		}

        if (event.event === 'ingress_ended') {
			const stream = await this.prismaService.stream.update({
				where: {
					ingressId: event.ingressInfo?.ingressId
				},
				data: {
					isLive: false
				}
			})

			await this.prismaService.chatMessage.deleteMany({
				where: {
					streamId: stream.id
				}
			})
		}

        
    }
}
