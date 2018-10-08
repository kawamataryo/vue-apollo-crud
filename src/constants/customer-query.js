import gql from 'graphql-tag'

// すべての顧客を取得
export const ALL_CUSTOMERS = gql`
    query allCustomers {
        customers(where: {status: PUBLISHED}) {
            id
            createdAt
            name
            gender
        }
    }
`
