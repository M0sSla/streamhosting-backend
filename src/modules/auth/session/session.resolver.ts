import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { SessionService } from './session.service';
import { UserModel } from '../account/models/user.model';
import { GqlContext } from '@/src/shared/types/gql-context.types';
import { LoginInput } from './inputs/login.input';

@Resolver('Session')
export class SessionResolver {
  public constructor(private readonly sessionService: SessionService) {}

  @Mutation(() => UserModel, { name: 'loginUser' })
  public async login(
    @Context() { req }: GqlContext,
    @Args('data') input: LoginInput
  ) {
    return this.sessionService.login(req, input)
  }

  @Mutation(() => UserModel, { name: 'logoutUser' })
  public async logout(
    @Context() { req }: GqlContext
  ) {
    return this.sessionService.logout(req)
  }
}
