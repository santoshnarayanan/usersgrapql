const graphql = require('graphql');
const axios = require("axios");
const {  GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLSchema } = graphql;

//hard coded list of users
const users = [
    {id: "23", firstName: 'Bill', age: 20},
    {id: "47", firstName: 'Samantha', age: 21},
    {id: "50", firstName: 'Jack', age: 28}
];
const usersUrl = 'http://localhost:3000/users';

const  CompanyType = new GraphQLObjectType({
    name:'Company',
    fields:{
        id: {type:GraphQLString },
        name: {type:GraphQLString},
        description: {type:GraphQLString}
    }
});

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: {
        id: {type:GraphQLString },
        firstName: {type:GraphQLString} ,
        age:{type:GraphQLInt},
        company:{
            type:CompanyType
        }
    }});

const RootQuery = new GraphQLObjectType({
    name:'RootQueryType',
    fields: {
        user:{
          type: UserType,
          args:{id: {type: GraphQLString}},
            resolve(parentValue, args){
                return axios.get(`${usersUrl}/${args.id}`)
                    .then(resp => resp.data);
            }
        }
    }
});

module.exports = new GraphQLSchema({
   query:RootQuery
});