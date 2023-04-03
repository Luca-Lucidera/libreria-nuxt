export function parsePrismaEnum(prismaEnum: string) {
  const enumArray = prismaEnum.split("_");
  let value = "";
  enumArray.forEach((word, i) => {
    if (i !== enumArray.length - 1) {
      value += word + " ";
    } else {
      value += word;
    }
  });
  return value;
}

export function composePrismaEnum(value: string) {
  const enumArray = value.split(" ");
  let prismaEnum = "";
  enumArray.forEach((word, i) => {
    if (i !== enumArray.length - 1) {
      prismaEnum += word + "_";
    } else {
      prismaEnum += word;
    }
  });
  return prismaEnum;
}
