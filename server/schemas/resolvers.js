const { AuthenticationError } = require('apollo-server-express');
const {User} = require('../models')
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {

        getAllUsers: async () => {
            return User.find();
        },

        getThisUser: async (parent, args, context) => {
            if (context.user) {
                return User.findOne({ _id: context.user._id });
              }
              throw new AuthenticationError('You need to be logged in!');
        }
    },

    Mutation: {

        addUser: async (parent, {username, email, password}) => {
            const user = await User.create({username, email, password})
            const token = signToken(user);
            return { token, user };
        },

        login: async (parent, {email, password}) => {
            const user = await User.findOne({ email })

            if(!user) {
                throw new AuthenticationError('No User Found')
            }

            const correctPw = await user.isCorrectPassword(password)

            if(!correctPw) {
                throw new AuthenticationError('Incorrect Password')
            }

            const token = signToken(user);
            return {token, user}
        },

        saveBook: async (parent, {input}, context) => {
            if (context.user) {
                const updated = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { savedBooks: input } },
                    {new: true}
                  );
                  return updated;
            }
            throw new AuthenticationError('You need to be logged in!');
        },

        removeBook: async (parent, {bookId}, context) => {
            if (context.user) {
                const updated = await User.findOneAndUpdate(
                    {_id: context.user._id},
                    { $pull: {savedBooks: {bookId: bookId}}},
                    {new: true}
                )
                return updated;
            }
            throw new AuthenticationError('You need to be logged in!');
        }
    }
}

module.exports = resolvers;