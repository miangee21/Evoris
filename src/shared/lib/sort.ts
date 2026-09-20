//src/shared/lib/sort.ts
export function compareEvorisStrings(a: string, b: string): number {
  const tokenize = (str: string): string[] => str.match(/\d+|\D+/g) ?? [];
  const tokensA = tokenize(a);
  const tokensB = tokenize(b);

  const len = Math.min(tokensA.length, tokensB.length);

  for (let i = 0; i < len; i++) {
    const tokenA = tokensA[i] ?? "";
    const tokenB = tokensB[i] ?? "";

    const isNumA = /^\d+$/.test(tokenA);
    const isNumB = /^\d+$/.test(tokenB);

    if (isNumA && isNumB) {
      const numA = parseInt(tokenA, 10);
      const numB = parseInt(tokenB, 10);
      if (numA !== numB) return numA - numB;
    } else if (isNumA) {
      return -1;
    } else if (isNumB) {
      return 1;
    } else {
      const charLen = Math.min(tokenA.length, tokenB.length);
      for (let j = 0; j < charLen; j++) {
        const charA = tokenA[j] ?? "";
        const charB = tokenB[j] ?? "";
        if (charA === charB) continue;

        const lowerA = charA.toLowerCase();
        const lowerB = charB.toLowerCase();

        if (lowerA !== lowerB) {
          return lowerA.localeCompare(lowerB);
        }

        if (charA < charB) return -1;
        if (charA > charB) return 1;
      }
      if (tokenA.length !== tokenB.length) {
        return tokenA.length - tokenB.length;
      }
    }
  }
  return a.length - b.length;
}

export function sortByName<T>(
  list: readonly T[],
  getName: (value: T) => string,
): T[] {
  return [...list].sort((a, b) => compareEvorisStrings(getName(a), getName(b)));
}
