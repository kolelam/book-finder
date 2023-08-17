import { gql } from '@apollo/client';
// Function for login
export const LOGIN_USER = gql`
mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
        token
        user {
            _id
            username
        }
    }
}`;
// Function for adding new user
export const ADD_USER = gql`
mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
        token
        user {
            _id
            username
        }
    }
}`;
// Function for saving a book for user
export const SAVE_BOOK = gql`
mutation saveBook($input: SavedBookInput) {
    saveBook(input: $input) {
        username
        _id
        bookCount
        savedBooks {
            bookId
            authors
            image
            link
            title
            description
        }
    }
}`;
// Function for removing a book from the user's saved books
export const REMOVE_BOOK = gql`
mutation removeBook($bookId: String!) {
    removeBook(bookId: $bookId) {
        _id
        username
        bookCount
        savedBooks {
            bookId
            authors
            image
            link
            title
            description
        }
    }
}`;