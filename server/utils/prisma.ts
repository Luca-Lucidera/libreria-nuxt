import {Prisma, PrismaClient} from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
    globalForPrisma.prisma ||
    new PrismaClient();
if (useRuntimeConfig().public.env !== "production") globalForPrisma.prisma = prisma;

export const handleKnownPrismaError = (error: Prisma.PrismaClientKnownRequestError) => {
    switch (error.code) {
        case "P1001":
            console.error(`IMPOSSIBILE COLLEGARSI AL DATABASE. ERROR CODE: ${error.code}, MESSAGE: ${error.message}, META: ${error.meta}`)
            return createError({statusCode: 500, message: "Connection server issue, retry later"})
        case "P1002":
            console.error(`TIMEOUT CONNESSIONE AL DB. ERROR CODE: ${error.code}, MESSAGE: ${error.message}, META: ${error.meta}`)
            return createError({statusCode: 500, message: "Connection server issue, retry later"})
        case "P1008":
            console.error(`DB TIMEOUT. ERROR CODE: ${error.code}, MESSAGE: ${error.message}, META: ${error.meta}`)
            return createError({statusCode: 500, message: "Connection server issue, retry later"})
        case "P1009":
            console.error(`DB NAME ALREADY EXIST IN THE SERVER. ERROR CODE: ${error.code}, MESSAGE: ${error.message}, META: ${error.meta}`)
            return createError({statusCode: 500, message: "Connection server issue, retry later"})
        case "P1010":
            console.error(`THE CONFIGURED USER CANNOT ACCESS THE DATABSE. ERROR CODE: ${error.code}, MESSAGE: ${error.message}, META: ${error.meta}`)
            return createError({statusCode: 500, message: "Connection server issue, retry later"})
        case "P1013":
            console.error(`THE CONFIGURED CONNECTION STRING IS INVALID. ERROR CODE: ${error.code}, MESSAGE: ${error.message}, META: ${error.meta}`)
            return createError({statusCode: 500, message: "Connection server issue, retry later"})
        case "P1014":
            console.error(`IL MODELLO NON ESISTE (EX: USER MODEL NEL SCHEMA.PRISMA). ERROR CODE: ${error.code}, MESSAGE: ${error.message}, META: ${error.meta}`)
            return createError({statusCode: 500, message: "Connection server issue, retry later"})
        case "P1017":
            console.error(`SERVER CLOSED CONNECTION EARLY. ERROR CODE: ${error.code}, MESSAGE: ${error.message}, META: ${error.meta}`)
            return createError({statusCode: 500, message: "Connection server issue, retry later"})
        case "P2000":
            console.error(`IL VALORE DATO È TROPPO LUNGO PER LA COLONNA. PRISMA ERROR CODE: ${error.code}, MESSAGE: ${error.message}, META: ${error.meta}`)
            return createError({statusCode: 401, statusMessage: "Some values are too long"})
        case "P2001":
            console.error(`IL VALORE CERCATO NELLA CONDIZIONE WHERE NON ESISTE. PRISMA ERROR CODE: ${error.code}, MESSAGE: ${error.message}, META: ${error.meta}`)
            return createError({statusCode: 401, statusMessage: "Some value not exist"})
        case "P2002":
            console.error(`PRISMA ERROR CODE: ${error.code}, MESSAGE: ${error.message}, META: ${error.meta}`)
            return createError({
                statusMessage: "Valore unico nel db, non si può inserire questo valore",
                statusCode: 401
            })
        default:
            console.error(`ERRORE NON GESTITO DALLO SWITCH -> ERROR CODE: ${error.code}, MESSAGE: ${error.message}, META: ${error.meta}`)
            return createError({statusCode: 500, statusMessage: "Generic error, retry later please"})
    }
}

export const handleUnknownPrismaError = () => {

}

export const handleRustPanicError = () => {

}

export const handleInitializationError = () => {

}

export const handleValidationError = () => {

}