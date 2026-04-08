import { PrismaService } from "@/src/core/prisma/prisma.service";
import { Logger, type CanActivate, type ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";

@Injectable()
export class GqlAuthGuard implements CanActivate {
    private readonly logger = new Logger(GqlAuthGuard.name)

    public constructor(private readonly prismaService: PrismaService) {}


    public async canActivate(context: ExecutionContext): Promise<boolean> {
        const ctx = GqlExecutionContext.create(context)
        const request = ctx.getContext().req

        this.logger.debug(
            JSON.stringify({
                path: request.path,
                sessionId: request.sessionID ?? null,
                hasCookieHeader: Boolean(request.headers?.cookie),
                cookieHeader: request.headers?.cookie ?? null,
                hasSession: Boolean(request.session),
                sessionUserId: request.session?.userId ?? null
            })
        )

        // if (typeof request.session.userId === 'undefined') {
        if (!request.session?.userId) {
            throw new UnauthorizedException('Пользователь не авторизован')
        }

        const user = await this.prismaService.user.findUnique({
            where: {
                id: request.session.userId
            }
        })

        if (!user) {
            this.logger.warn(
                `Session ${request.sessionID} contains userId=${request.session.userId}, but user was not found`
            )
            throw new UnauthorizedException('Пользователь не найден')
        }

        request.user = user
        return true
    }
}
