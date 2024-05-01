
/**
 * Yes, I stole this function. Cited below.
 * Generate a random string of a given length.
 * @param length {number} How many characters listed in `characters` to generate.
 * @returns {string}
 * @source https://stackoverflow.com/a/1349426/2769671
 */
export function makeid(length: number): string {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}
