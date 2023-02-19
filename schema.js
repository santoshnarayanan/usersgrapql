const graphql = require('graphql');
const axios = require("axios");

//include helper objects which we are using in source code
const {  GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
} = graphql;

//hard coded list of users -- to be deleted  as it is replaced by json-server
const users = [
    {id: "23", firstName: 'Bill', age: 20},
    {id: "47", firstName: 'Samantha', age: 21},
    {id: "50", firstName: 'Jack', age: 28}
];
const url = 'http://localhost:3000';

const  CompanyType = new GraphQLObjectType({
    name:'Company',
    fields: () =>({
        id: {type:GraphQLString },
        name: {type:GraphQLString},
        description: {type:GraphQLString},
        users:{
            type: new GraphQLList(UserType),
            resolve(parentValue, args){
                return axios.get(`${url}/companies/${parentValue.id}/users`)
                    .then(res => res.data);
            }
        }
    })
});

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: {type:GraphQLString },
        firstName: {type:GraphQLString} ,
        age:{type:GraphQLInt},
        company:{
            type:CompanyType,
            resolve(parentValue, args){
                return axios.get(`${url}/companies/${parentValue.companyId}`)
                .then(res => res.data);
            }
        }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: {
            type: UserType,
            args: {id: {type: GraphQLString}},
            resolve(parentValue, args) {
                return axios.get(`${url}/users/${args.id}`)
                    .then(resp => resp.data);
            }
        },
        company: {
            type: CompanyType,
            args: {id: {type: GraphQLString}},
            resolve(parentValue, args) {
                return axios.get(`${url}/companies/${args.id}`)
                    .then(resp => resp.data);
            }
        }
    }
});

const mutation  = new GraphQLObjectType({
    name:'Mutation',
    fields:{
        addUser:{
           type: UserType ,
           args: {
               firstName:{type:new GraphQLNonNull(GraphQLString)},
               age:{type:new GraphQLNonNull(GraphQLInt)},
               companyId:{type:GraphQLString}
           } ,
           resolve(parentValue, {firstName, age}){
                return axios.post(`${url}/users`,{ firstName, age })
                .then(res => res.data);
           }
        },
        deleteUser: {
            type:UserType,
            args:{
                id:{type:GraphQLNonNull(GraphQLString)}
            },
            resolve(parentValue, {id }){
                return axios.delete(`${url}/users/${id}`)
                .then(res=> res.data);
            }
        }
    }
});

module.exports = new GraphQLSchema({
   query:RootQuery,
   mutation: mutation
});