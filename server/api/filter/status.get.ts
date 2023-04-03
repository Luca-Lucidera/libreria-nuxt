import { Status } from "@prisma/client";

export default defineEventHandler(async (event) => {
  let values: string[] = Object.values(Status);
  values.unshift("All");
  values = values.map((value) => {
    return parsePrismaEnum(value);
  });
  return values;
});
