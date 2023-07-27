import { Prisma } from '@prisma/client';
import { SortOrderVal } from '~/utils/enums';


interface SortInput {
  sortKey?: string;
}

export const createFindManyPostQuery = (input: SortInput): Prisma.PostFindManyArgs => {
  const postQuery: Prisma.PostFindManyArgs = {
    take: 10,
    include: {
      likes: true,
      dislikes: true,
      comments: true,
      tags: true,
    },
  };

  if (input.sortKey) {
    switch (input.sortKey) {
      case SortOrderVal.CREATED_ASC:
        postQuery.orderBy = { createdAt: 'desc' };
        break;
      case SortOrderVal.CREATED_DESC:
        postQuery.orderBy = { createdAt: 'asc' };
        break;
      case SortOrderVal.LIKES_ASC:
        postQuery.orderBy = { likes: { _count: 'desc' } };
        break;
      case SortOrderVal.LIKES_DESC:
        postQuery.orderBy = { dislikes: { _count: 'desc' } };
        break;

      default:
        break;
    }
  }
  return postQuery;
};