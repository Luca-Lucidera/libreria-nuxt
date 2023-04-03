import { Publisher, Status, Type } from "@prisma/client";

export default interface IBookTableFilter {
  type: Type[];
  status: Status[];
  publisher: Publisher[];
}