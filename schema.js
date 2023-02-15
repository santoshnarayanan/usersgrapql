const graphql = require('graphql');
const {GraphQLString, GraphQLInt} = require("graphql");
const {  GraphQLObjectType } = graphql;

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

            }
        }
    }
});