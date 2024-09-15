import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoModule } from 'src/mongo-module/mongo.module';
import { Post, PostsSchema } from 'src/features/posts/domain/posts-schema';
import { PostsQueryRepository } from 'src/features/posts/infrastructure/posts.query-repository';
import { PostsController } from 'src/features/posts/api/posts.controller';
import { PostsRepository } from 'src/features/posts/infrastructure/posts-repository';
import { CommentsQueryRepository } from 'src/features/comments/infrastructure/comments.query-repository';
import {
  Comment,
  CommentsSchema,
} from 'src/features/comments/domain/comments-schema';
import { PostsService } from 'src/features/posts/application/posts.service';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateCommentForPostHandler } from 'src/features/comments/application/use-cases/create-comment-for-post';
import { CommentsRepository } from 'src/features/comments/infrastructure/comments-repository';
import { GetLikeInfoHandler } from 'src/features/comments-likes/application/use-cases/get-like-info';
import { CommentsLikesQueryRepository } from 'src/features/comments-likes/infrastructure/comments-likes-query-repository';
import { GetNewestLikesHandler } from 'src/features/comments-likes/application/use-cases/get-newest-likes';
import { BlogsQueryRepository } from 'src/features/blogs/infrastructure/blogs.query-repository';
import { UsersQueryRepository } from 'src/features/users/infrastructure/users.query-repository';
import { PostsLikesRepository } from 'src/features/posts-likes/infrastructure/posts-likes-repository';
import { PostsLikesQueryRepository } from 'src/features/posts-likes/infrastructure/posts-likes-query-repository';
import { UpdateOrCreateLikePostStatusHandler } from 'src/features/posts-likes/application/use-cases/update-or-create-like-post-status';

@Module({
  imports: [
    CqrsModule,
    MongoModule,
    MongooseModule.forFeature([{ name: Post.name, schema: PostsSchema }]),
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentsSchema }]),
    // MongooseModule.forFeature([
    //   { name: CommentLikes.name, schema: LikesSchema },
    // ]),
  ],
  controllers: [PostsController],
  providers: [
    BlogsQueryRepository,
    PostsService,
    PostsRepository,
    PostsLikesRepository,
    PostsLikesQueryRepository,
    CommentsLikesQueryRepository,
    CommentsRepository,
    PostsQueryRepository,
    UsersQueryRepository,
    CommentsQueryRepository,
    CreateCommentForPostHandler,
    UpdateOrCreateLikePostStatusHandler,
    GetLikeInfoHandler,
    GetNewestLikesHandler,
  ],
})
export class PostsModule {}
