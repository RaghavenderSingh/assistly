import { ApolloClient,DefaultOptions, InMemoryCache, createHttpLink} from '@apollo/client';
export const BASE_URL = process.env.NODE_ENV !== "development"? `http://${process.env}`:"http://localhost:3000/";
const httpsLink = createHttpLink({uri:`${BASE_URL}/api/graphql`,});
const defaultOptions : DefaultOptions={
    watchQuery:{
        fetchPolicy:"no-cache",
        errorPolicy:"all"
    },
    query:{
        fetchPolicy:"no-cache",
        errorPolicy:"all"
    },
    mutate:{
        fetchPolicy:"no-cache",
        errorPolicy:"all",
    }
}
const client = new ApolloClient({
    link:httpsLink,
    cache: new InMemoryCache(),
    defaultOptions:defaultOptions
})

export default client;

