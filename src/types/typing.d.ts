import { pubsub } from "../index.js";
import { prisma } from "../prisma/prisma.js";

interface GraphQLContext {
  prisma: typeof prisma;
  pubsub: typeof pubsub;
}

interface Message {
  userId: string;
  username: string;
  userImg?: string;
  text: string;
  timestamp: string;
}
