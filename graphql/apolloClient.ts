import { ApolloClient, DefaultOptions, InMemoryCache, createHttpLink } from '@apollo/client';
export const BASE_URL = process.env.NODE_ENV !== "development" ? `${process.env.NEXT_PUBLIC_DEV_URL}` : "http://localhost:3000/";
const httpsLink = createHttpLink({ uri: `https://assistly-git-main-raghavendersinghs-projects.vercel.app/api/graphql`, });
const defaultOptions: DefaultOptions = {
    watchQuery: {
        fetchPolicy: "no-cache",
        errorPolicy: "all"
    },
    query: {
        fetchPolicy: "no-cache",
        errorPolicy: "all"
    },
    mutate: {
        fetchPolicy: "no-cache",
        errorPolicy: "all",
    }
}
const client = new ApolloClient({
    link: httpsLink,
    cache: new InMemoryCache(),
    defaultOptions: defaultOptions
})

export default client;

