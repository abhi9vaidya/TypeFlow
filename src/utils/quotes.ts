// Build: 20251114
// Collection of quotes for quote mode
export interface Quote {
  id: string;
  text: string;
  source: string;
  length: number;
}

export const quotes: Quote[] = [
  {
    id: "1",
    text: "The only way to do great work is to love what you do.",
    source: "Steve Jobs",
    length: 52
  },
  {
    id: "2",
    text: "Innovation distinguishes between a leader and a follower.",
    source: "Steve Jobs",
    length: 59
  },
  {
    id: "3",
    text: "Code is like humor. When you have to explain it, it's bad.",
    source: "Cory House",
    length: 59
  },
  {
    id: "4",
    text: "First, solve the problem. Then, write the code.",
    source: "John Johnson",
    length: 48
  },
  {
    id: "5",
    text: "Experience is the name everyone gives to their mistakes.",
    source: "Oscar Wilde",
    length: 57
  },
  {
    id: "6",
    text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    source: "Martin Fowler",
    length: 113
  },
  {
    id: "7",
    text: "The best error message is the one that never shows up.",
    source: "Thomas Fuchs",
    length: 55
  },
  {
    id: "8",
    text: "Simplicity is the soul of efficiency.",
    source: "Austin Freeman",
    length: 38
  },
  {
    id: "9",
    text: "Make it work, make it right, make it fast.",
    source: "Kent Beck",
    length: 43
  },
  {
    id: "10",
    text: "Programs must be written for people to read, and only incidentally for machines to execute.",
    source: "Harold Abelson",
    length: 92
  },
  {
    id: "11",
    text: "Truth can only be found in one place: the code.",
    source: "Robert C. Martin",
    length: 48
  },
  {
    id: "12",
    text: "The function of good software is to make the complex appear to be simple.",
    source: "Grady Booch",
    length: 73
  },
  {
    id: "13",
    text: "Walking on water and developing software from a specification are easy if both are frozen.",
    source: "Edward V. Berard",
    length: 91
  },
  {
    id: "14",
    text: "It's not a bug, it's an undocumented feature.",
    source: "Anonymous",
    length: 46
  },
  {
    id: "15",
    text: "Talk is cheap. Show me the code.",
    source: "Linus Torvalds",
    length: 33
  },
];

export function getRandomQuote(): Quote {
  return quotes[Math.floor(Math.random() * quotes.length)];
}

export function quoteToWords(quote: Quote): string[] {
  return quote.text.split(' ');
}

