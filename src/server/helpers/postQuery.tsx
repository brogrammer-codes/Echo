import { Prisma } from '@prisma/client';

// interface SortInput {
//     sortKey?: 'createdAt' | 'likes';
//     sortValue?: 'asc' | 'desc';
//   }
interface SortInput {
  sortKey?: string;
  sortValue?: string;
}

export const createFindManyPostQuery = (input: SortInput): Prisma.PostFindManyArgs => {
  const postQuery: Prisma.PostFindManyArgs = {
    take: 10, 
    include: {
      likes: true,
      dislikes: true,
      comments: true,
    },
  };

  if (input.sortKey && input.sortValue) {
    if (input.sortKey === 'createdAt') {
      postQuery.orderBy = { createdAt: input.sortValue as Prisma.SortOrder };
    } else if (input.sortKey === 'likes') {
      
      if (input.sortValue === 'asc') {
        postQuery.orderBy = { likes: { _count: 'asc' } };
      } else if (input.sortValue === 'desc') {
        postQuery.orderBy = { likes: { _count: 'desc' } };
      }
    }
  }

  return postQuery;
};