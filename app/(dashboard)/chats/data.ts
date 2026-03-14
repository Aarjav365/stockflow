export type Convo = {
  sender: string;
  message: string;
  timestamp: string;
};

export type ChatUser = {
  id: number;
  fullName: string;
  avatar: string;
  title: string;
  messages: Convo[];
};

export const conversations: ChatUser[] = [
  {
    id: 1,
    fullName: "Alice Johnson",
    avatar: "",
    title: "Design Lead",
    messages: [
      { sender: "Alice Johnson", message: "Hey, how's the design going?", timestamp: "2026-03-14T08:00:00Z" },
      { sender: "You", message: "Almost done with the mockups!", timestamp: "2026-03-14T08:05:00Z" },
      { sender: "Alice Johnson", message: "Great, can you share them by EOD?", timestamp: "2026-03-14T08:10:00Z" },
    ],
  },
  {
    id: 2,
    fullName: "Bob Smith",
    avatar: "",
    title: "Backend Developer",
    messages: [
      { sender: "Bob Smith", message: "The API endpoint is ready for testing.", timestamp: "2026-03-14T09:00:00Z" },
      { sender: "You", message: "I'll test it right away. Any specific cases?", timestamp: "2026-03-14T09:15:00Z" },
      { sender: "Bob Smith", message: "Try edge cases with empty payloads.", timestamp: "2026-03-14T09:20:00Z" },
    ],
  },
  {
    id: 3,
    fullName: "Charlie Davis",
    avatar: "",
    title: "Project Manager",
    messages: [
      { sender: "Charlie Davis", message: "Sprint review at 3 PM today.", timestamp: "2026-03-14T10:00:00Z" },
      { sender: "You", message: "Got it, I'll prepare the demo.", timestamp: "2026-03-14T10:05:00Z" },
    ],
  },
  {
    id: 4,
    fullName: "Diana Wilson",
    avatar: "",
    title: "QA Engineer",
    messages: [
      { sender: "Diana Wilson", message: "Found a bug in the login flow.", timestamp: "2026-03-14T11:00:00Z" },
      { sender: "You", message: "Can you share the steps to reproduce?", timestamp: "2026-03-14T11:10:00Z" },
      { sender: "Diana Wilson", message: "Already logged it in Jira with screenshots.", timestamp: "2026-03-14T11:15:00Z" },
    ],
  },
  {
    id: 5,
    fullName: "Edward Brown",
    avatar: "",
    title: "DevOps Engineer",
    messages: [
      { sender: "Edward Brown", message: "Deployed the latest build to staging.", timestamp: "2026-03-14T12:00:00Z" },
      { sender: "You", message: "Thanks! I'll verify the changes.", timestamp: "2026-03-14T12:05:00Z" },
    ],
  },
];
