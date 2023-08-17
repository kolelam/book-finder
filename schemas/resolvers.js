// Importing dependencies and functions
const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

// Resolver functions
const resolvers = {
    Query: {
        // Resolver for the 'me' query, retrieves the user data
        me: async (context) => {
            // Check if the user is authenticated
            if (context.user) {
                // If authenticated, find the user data using the 'context.user._id'
                const userData = await User.findOne({ _id: context.user._id }).select('-__v -password');
                return userData;
            }
            // If not authenticated, throw an 'AuthenticationError' message indicating the user is not logged in
            throw new AuthenticationError('Not logged in');
        }
    },
    Mutation: {
        // Resolver for the 'addUser' mutation, which handles user creation
        addUser: async (args) => {
            // Create a new user in the db using the 'args' input
            const user = await User.create(args);
            // Generate a token for the new user
            const token = signToken(user);
            // Return the generated token and user data
            return { token, user };
        },
        // Resolver for the 'login' mutation
        login: async ({ email, password }) => {
            // Find the user in the database using email
            const user = await User.findOne({ email });

            // If the user does not exist, throw an 'AuthenticationError'
            if (!user) {
                throw new AuthenticationError('Incorrect information');
            }

            // Check if the provided password is correct using the 'isCorrectPassword' function in user model
            const correctPw = await user.isCorrectPassword(password);

            // If the password is incorrect, throw an 'AuthenticationError'
            if (!correctPw) {
                throw new AuthenticationError('Incorrect information');
            }

            // If the user is authenticated, generate a token for the user and return it along with the user data
            const token = signToken(user);
            return { token, user };
        },
        // Resolver for the 'saveBook' mutation
        saveBook: async ({ input }, context) => {
            // Check if the user is authenticated
            if (context.user) {
                // If authenticated, update the user's data to include the new book in the 'savedBooks' array
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { savedBooks: input } }, 
                    // Using '$addToSet' to avoid duplicate books in the 'savedBooks' array
                    { new: true, runValidators: true }
                );
                // Return the updated user data
                return updatedUser;
            }
            // If not authenticated, throw an 'AuthenticationError'
            throw new AuthenticationError('Please log in!');
        },
        // Resolver for the 'removeBook' mutation
        removeBook: async ({ bookId }, context) => {
            // Check if the user is authenticated
            if (context.user) {
                // If authenticated, update the user's data to remove the specified book from the 'savedBooks' array
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId: bookId } } }, 
                    // Using '$pull' to remove the book with the specified 'bookId'
                    { new: true, runValidators: true }
                );
                // Return the updated user data
                return updatedUser;
            }
            // If authentication fails, throw an 'AuthenticationError'
            throw new AuthenticationError('Please log in!');
        }
    }
}

module.exports = resolvers;