function permutations(string) {
    return (string.length == 1) ? [string] : string.split('')
        .map((e, i) => permutations(string.slice(0, i) + string.slice(i + 1)).map((e2) => e + e2))
        .reduce((r, e) => r.concat(e))
        .sort()
        .filter((e, i, a) => (i == 0) || a[i - 1] != e);
}