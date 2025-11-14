// Build: 20251114
// 200 most common English words for typing practice
export const commonWords = [
  "the", "be", "to", "of", "and", "a", "in", "that", "have", "I",
  "it", "for", "not", "on", "with", "he", "as", "you", "do", "at",
  "this", "but", "his", "by", "from", "they", "we", "say", "her", "she",
  "or", "an", "will", "my", "one", "all", "would", "there", "their", "what",
  "so", "up", "out", "if", "about", "who", "get", "which", "go", "me",
  "when", "make", "can", "like", "time", "no", "just", "him", "know", "take",
  "people", "into", "year", "your", "good", "some", "could", "them", "see", "other",
  "than", "then", "now", "look", "only", "come", "its", "over", "think", "also",
  "back", "after", "use", "two", "how", "our", "work", "first", "well", "way",
  "even", "new", "want", "because", "any", "these", "give", "day", "most", "us",
  "is", "was", "are", "been", "has", "had", "were", "said", "did", "having",
  "may", "should", "could", "might", "must", "can", "will", "would", "shall",
  "going", "where", "doing", "made", "find", "long", "down", "day", "call", "who",
  "oil", "its", "now", "find", "long", "down", "day", "did", "get", "come",
  "made", "may", "part", "over", "new", "sound", "take", "only", "little", "work",
  "know", "place", "year", "live", "me", "back", "give", "most", "very", "after",
  "thing", "our", "just", "name", "good", "sentence", "man", "think", "say", "great",
  "where", "help", "through", "much", "before", "line", "right", "too", "mean", "old",
  "any", "same", "tell", "boy", "follow", "came", "want", "show", "also", "around",
  "form", "three", "small", "set", "put", "end", "does", "another", "well", "large",
];

const punctuation = [".", ",", "!", "?", ";", ":"];
const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

export function generateWords(
  count: number, 
  options?: { includePunctuation?: boolean; includeNumbers?: boolean }
): string[] {
  const words: string[] = [];
  
  for (let i = 0; i < count; i++) {
    let word = commonWords[Math.floor(Math.random() * commonWords.length)];
    
    // Add punctuation randomly (30% chance)
    if (options?.includePunctuation && Math.random() < 0.3) {
      word += punctuation[Math.floor(Math.random() * punctuation.length)];
    }
    
    // Add numbers occasionally (15% chance to replace a word with a number)
    if (options?.includeNumbers && Math.random() < 0.15) {
      const numLength = Math.floor(Math.random() * 3) + 1; // 1-3 digits
      word = Array.from({ length: numLength }, () => 
        numbers[Math.floor(Math.random() * numbers.length)]
      ).join("");
    }
    
    words.push(word);
  }
  
  return words;
}

