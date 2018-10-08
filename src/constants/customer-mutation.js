import gql from 'graphql-tag'

// 追加
export const CREATE_CUSTOMER = gql`
    mutation createCustomer($name: String, $gender: String) {
        createCustomer(data: {status: PUBLISHED, name: $name, gender: $gender}) {
            id
            name
            gender
        }
    }
`

// 更新
export const UPDATE_CUSTOMER = gql`
    mutation updateCustomer($id: ID, $name: String, $gender: String) {
        updateCustomer(data: {name: $name, gender: $gender}, where:{id:$id}) {
            name
            gender
        }
    }
`

// 削除
export const DELETE_CUSTOMER = gql`
    mutation deleteCustomer($id: ID) {
        deleteCustomer(where:{id: $id}){
            id
        }
    }
`

