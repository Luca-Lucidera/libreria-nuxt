import IUser from "~/interface/user";

export default defineEventHandler(async (event) => {
  const { id: userId }: IUser = event.context.user;
  
  const userBooks = await prisma.book.findMany({
    where: {
      userId,
    },
    select: {
      id: true,
      title: true,
      purchased: true,
      read: true,
      type: true,
      status: true,
      publisher: true,
      price: true,
      rating: true,
      comment: true,
    },
  });

  if(userBooks.length === 0) {
    return userBooks;
  }
  
  const books = userBooks.map((book) => {
    return {
      ...book,
      type: parsePrismaEnum(book.type),
      status: parsePrismaEnum(book.status),
      publisher: parsePrismaEnum(book.publisher),
    }
  })
  
  return books;
});
