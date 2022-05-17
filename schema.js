const gql = require('graphql-tag');

const typeDefs = gql`
type User {
    userName : String!
    passwordHash : String!
}

type Token {
    value : String!
    userName : String!
}

type Urls {
    url: String!
    shortid:String!
}

type savedUrl {
    url:String!
    urlName:String!
    userName:String!
}

type ShortenerUrl {
    value:String!
}

type Query {
    userCount : Int!
    allUsers : [User]!
    urlSavedByUser(userName:String!) : [savedUrl]!
    lastUrl : String!
    urlCount : Int!
}

type Mutation{
    registerUser (
        userName:String!
        password : String!
    ) : Token
    login (
        userName : String!
        password : String!
    ) : Token
    createUrl (
        url: String!
    ) : ShortenerUrl
    addUrl (
        url:String!
        userName:String!
        urlName:String!
    ): savedUrl
}

type Subscription  {
    latestUrl: ShortenerUrl!
    updateUrlCount : Int!
}

`

module.exports = typeDefs