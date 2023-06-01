import { Type } from "@prisma/client";

export default defineEventHandler(async (event) => {
  let values: string[] = Object.values(Type);
  values.unshift("All");
  values = values.map((value) => {
    return parsePrismaEnum(value);
  });
  console.log("values: ", values);
  return values;
});
