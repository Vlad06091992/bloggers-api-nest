import { Inject } from '@nestjs/common';
import { PostsQueryRepository } from 'src/features/posts/infrastructure/posts.query-repository';
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RequiredParamsValuesForPostsOrComments } from 'src/shared/common-types';
import { PostsReactionsQueryRepository } from 'src/features/posts-reactions/infrastructure/posts-reactions-query-repository';

export class FindPostsForSpecificBlogCommand {
  constructor(
    public blogId: string,
    public userId: string | null,
    public params: RequiredParamsValuesForPostsOrComments,
  ) {}
}

@CommandHandler(FindPostsForSpecificBlogCommand)
export class FindBlogsForSpecificBlogHandler
  implements ICommandHandler<FindPostsForSpecificBlogCommand>
{
  constructor(
    @Inject() protected postsQueryRepository: PostsQueryRepository,
    @Inject()
    protected postsLikesQueryRepository: PostsReactionsQueryRepository,
    @Inject() protected commandBus: CommandBus,
  ) {}

  async execute({ blogId, params, userId }: FindPostsForSpecificBlogCommand) {
    const response = await this.postsQueryRepository.findPostsForSpecificBlog(
      params,
      blogId,
      userId,
    );

    return response;
  }
}
