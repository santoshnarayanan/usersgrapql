const graphql = require('graphql');
const {  GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLSchema } = graphql;

//hard coded list of users
const users = [
    {id: '23', firstName: 'Bill', age: 20},
    {id: '47', firstName: 'Samantha', age: 21},
    {id: '50', firstName: 'Jack', age: 28}
];

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: {
        id: {type:GraphQLString },
        firstName: {type:GraphQLString} ,
        age:{type:GraphQLInt}
    }});

const RootQuery = new GraphQLObjectType({
    name:'RootQueryType',
    fields: {
        user:{
          type: UserType,
          args:{id: {type: GraphQLString}},
            resolve(parentValue, args){
              return _.find(users, {id: args.id});
            }
        }
    }
});

module.exports = new GraphQLSchema({
   query:RootQuery
});