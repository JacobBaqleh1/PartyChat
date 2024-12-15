const names: string[] = [
  "Jacob",
  "Emily",
  "Michael",
  "Sarah",
  "David",
  "Jessica",
  "Chris",
  "Anna",
  "James",
  "Sophia",
  "Matthew",
  "Emma",
  "Joshua",
  "Olivia",
  "Andrew",
  "Mia",
  "Daniel",
  "Ava",
  "Ethan",
  "Isabella",
];

const thoughts: string[] = [
  "This is a great thought!",
  "I love coding in JavaScript.",
  "Mongoose makes life easier.",
  "Learning new things is so fun!",
  "Have you tried TypeScript yet?",
  "React is my favorite framework!",
  "Node.js rocks!",
  "MongoDB is so flexible.",
  "Keep calm and write clean code.",
  "Debugging is like being a detective!",
];

// Get a random item from an array
const getRandomArrItem = <T>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];

// Generate random usernames
const getRandomUsername = (): string =>
  `${getRandomArrItem(names)}_${Math.floor(Math.random() * 1000)}`;

// Generate random email addresses
const getRandomEmail = (): string =>
  `${getRandomUsername().toLowerCase()}@example.com`;

// Define the shape of a thought object
interface Thought {
  thoughtText: string;
  username: string;
  createdAt: Date;
  reactions: any[]; // Adjust this if reactions have a specific structure
}

// Generate random thoughts
const getRandomThoughts = (count: number): Thought[] => {
  const results: Thought[] = [];
  for (let i = 0; i < count; i++) {
    results.push({
      thoughtText: getRandomArrItem(thoughts),
      username: getRandomUsername(),
      createdAt: new Date(),
      reactions: [],
    });
  }
  return results;
};

// Export functions
export {
  getRandomUsername,
  getRandomEmail,
  getRandomThoughts,
  getRandomArrItem,
};
