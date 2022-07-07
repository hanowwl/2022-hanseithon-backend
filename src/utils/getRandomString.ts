export const getRandomString = (length: number) => {
  const randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const result = [];

  for (let i = 0; i < length; i++) {
    result.push(
      randomChars.charAt(Math.floor(Math.random() * randomChars.length)),
    );
  }

  return result.join('');
};
