import { PrismaService } from '@/src/core/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { LivekitService } from '../libs/livekit/livekit.service';

@Injectable()
export class WebhookService {
    public constructor(
        private readonly prismaService: PrismaService,
        private readonly livekitService: LivekitService
    ) {}

    public async recieveWebhookLivekit(body: string, autharization: string) {
        // true is a little bit unsafe, if unnecessary, we can remove it later
        const event = await this.livekitService.receiver.receive(body, autharization, true);

        if(event.event === 'ingress.started') {
            await this.prismaService.stream.update({
                where: {
                    ingressId: event.ingressInfo?.ingressId 
                },
                data: {
                    isLive: true
                }
            })
        }

        if(event.event === 'ingress.ended') {
            await this.prismaService.stream.update({
                where: {
                    ingressId: event.ingressInfo?.ingressId 
                },
                data: {
                    isLive: false
                }
            })
        }

        
    }
}
