const { ApolloServer } = require("apollo-server");
const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { getUserId } = require("./utils");
const Query = require("./resolvers/query");
const Mutation = require("./resolvers/mutation");
const User = require("./resolvers/user");
const Link = require("./resolvers/links");
const { PubSub } = require("apollo-server");
const pubsub = new PubSub();
const Subscription = require("./resolvers/subscription");
const Vote = require("./resolvers/vote");

// 1
const resolvers = {
  Query,
  Mutation,
  Subscription,
  User,
  Link,
  Vote,
};

const server = new ApolloServer({
  typeDefs: fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf8"),
  resolvers,
  context: ({ req }) => {
    return {
      ...req,
      prisma,
      pubsub,
      userId: req && req.headers.authorization ? getUserId(req) : null,
    };
  },
});

server.listen().then(({ url }) => console.log(`Server is running on ${url}`));
