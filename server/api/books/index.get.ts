import {Book} from "~/types/book";
import {parsePrismaEnum} from "~/server/utils/parser";

export default defineEventHandler(async (event) => {
    console.log("PIPPO")
    const result = await handleSecurity(event);
    if (!result.success) {
        throw createError({statusCode: 401, statusMessage: result.errorData});
    }
    if (!result.successData?.user?.id) {
        throw createError({statusCode: 401, statusMessage: "Token invalid"});
    }
    const userBooks = await prisma.book.findMany({
        where: {
            userId: result.successData.user.id
        }
    });

    if (userBooks.length === 0) {
        return userBooks;
    }

    const books: Book[] = userBooks.flatMap(book => ({
        ...book,
        type: parsePrismaEnum(book.type),
        status: parsePrismaEnum(book.status),
        publisher: parsePrismaEnum(book.publisher),
    }))

    return books
})