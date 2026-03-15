/**
 * Fuzzy search utility for Russian text.
 * Supports:
 * - Exact substring match
 * - Case-insensitive matching
 * - Syllable-based partial matching (splits query into 2-char chunks)
 * - Typo tolerance via Levenshtein distance
 */

function levenshtein(a: string, b: string) {
    const m = a.length, n = b.length;
    if (m === 0) return n;
    if (n === 0) return m;

    const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;

    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            dp[i][j] = Math.min(
                dp[i - 1][j] + 1,
                dp[i][j - 1] + 1,
                dp[i - 1][j - 1] + cost
            );
        }
    }
    return dp[m][n];
}

function getSyllables(word: string, size = 2) {
    const syllables: string[] = [];
    for (let i = 0; i <= word.length - size; i++) {
        syllables.push(word.substring(i, i + size));
    }
    return syllables;
}

/**
 * Calculate fuzzy match score for a query against a text.
 * Returns a number 0-1 (0 = no match, 1 = perfect match).
 */
export function fuzzyScore(query: string, text: string) {
    if (!query || !text) return 0;

    const q = query.toLowerCase().trim();
    const t = text.toLowerCase().trim();

    // Exact substring match = best score
    if (t.includes(q)) return 1;

    // Check individual words
    const words = t.split(/\s+/);
    for (const word of words) {
        if (word.startsWith(q)) return 0.95;
    }

    // Syllable matching: check how many 2-char chunks of query exist in text
    if (q.length >= 3) {
        const syllables = getSyllables(q);
        const matchCount = syllables.filter(s => t.includes(s)).length;
        const syllableScore = matchCount / syllables.length;
        if (syllableScore >= 0.6) return 0.5 + syllableScore * 0.3;
    }

    // Levenshtein distance per word
    for (const word of words) {
        const maxLen = Math.max(q.length, word.length);
        if (maxLen === 0) continue;
        const dist = levenshtein(q, word);
        const tolerance = q.length <= 3 ? 1 : Math.floor(q.length / 3);
        if (dist <= tolerance) {
            return 0.4 + (1 - dist / maxLen) * 0.3;
        }
    }

    return 0;
}

/**
 * Search internships with fuzzy matching.
 * Searches only by position (internship title).
 * Returns items with score > threshold, sorted by relevance.
 */
export function fuzzySearch<T>(items: T[], query: string, threshold = 0.3) {
    if (!query || !query.trim()) return items;

    const q = query.trim();

    const scored = items.map(item => {
        const score = fuzzyScore(q, item.position);
        return { item, score };
    });

    return scored
        .filter(s => s.score >= threshold)
        .sort((a, b) => b.score - a.score)
        .map(s => s.item);
}
