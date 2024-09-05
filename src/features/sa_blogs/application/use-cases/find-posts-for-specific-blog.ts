import { Inject } from '@nestjs/common';
import { PostsQueryRepository } from 'src/features/posts/infrastructure/posts.query-repository';
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  QueryParams,
  RequiredParamsValuesForPosts,
} from 'src/shared/common-types';
import { GetLikeInfoCommand } from 'src/features/likes/application/use-cases/get-like-info';
import { GetNewestLikesCommand } from 'src/features/likes/application/use-cases/get-newest-likes';

export class FindPostsForSpecificBlogCommand {
  constructor(
    public blogId: string,
    public userId: string | null,
    public params: RequiredParamsValuesForPosts,
  ) {}
}

@CommandHandler(FindPostsForSpecificBlogCommand)
export class FindBlogsForSpecificBlogHandler
  implements ICommandHandler<FindPostsForSpecificBlogCommand>
{
  constructor(
    @Inject() protected postsQueryRepository: PostsQueryRepository,
    @Inject() protected commandBus: CommandBus,
  ) {}

  async execute({ blogId, params, userId }: FindPostsForSpecificBlogCommand) {
    const posts = await this.postsQueryRepository.findPostsForSpecificBlog(
      params,
      blogId,
      userId,
    );

    return posts;
  }
}
