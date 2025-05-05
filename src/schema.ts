import gql from "graphql-tag";
import { GraphQLContext, Message } from "./types/typing";

export const typeDefs = gql`
  type Message {
    id: String!
    username: String!
    userImg: String
    text: String!
    timestamp: String!
  }

  type Query {
    messages(limit: Int = 100): [Message!]!
  }

  type Mutation {
    sendMessage(
      username: String!
      userImg: String
      text: String!
      id: String!
      timestamp: String!
    ): Message!
  }

  type Subscription {
    messageSent: Message!
  }
`;

const MESSAGE_SENT = "MESSAGE_SENT";

export const resolvers: any = {
  Query: {
    messages: async (
      _: any,
      { limit }: { limit: number },
      { prisma }: GraphQLContext
    ) => {
      return prisma.message.findMany({
        orderBy: { timestamp: "asc" },
        take: limit,
      });
    },
  },

  Mutation: {
    sendMessage: async (_: any, args: Message, context: GraphQLContext) => {
      const { prisma, pubsub } = context;
      const message = await prisma.message.create({ data: args });
      await pubsub.publish(MESSAGE_SENT, { messageSent: message });
      return message;
    },
  },

  Subscription: {
    messageSent: {
      subscribe: (_: any, __: any, { pubsub }: GraphQLContext) =>
        pubsub.asyncIterator([MESSAGE_SENT]),
    },
  },
};
