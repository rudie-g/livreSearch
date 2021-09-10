import { gql } from '@apollo/client';

export const GET_ME = gql`
    query getThisUser {
        getThisUser {
            _id
            email
            username
            savedBooks {
                bookId
                title
                description
                image
                authors
            }
        }
    }
 
`