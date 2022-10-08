const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export const getRandomString = (length: number) => {
  return Array.from({ length }).reduce<string>((str) => {
    const pos = Math.floor(Math.random() * characters.length);

    return str + (characters.at(pos) || "");
  }, "");
};
