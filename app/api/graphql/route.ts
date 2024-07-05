import { NextRequest, NextResponse } from "next/server";
import { serverClient } from "@/lib/server/serverClient";
import { gql } from '@apollo/client';
import { ApolloError } from "@apollo/client/errors";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization"
};

export async function POST(request: NextRequest) {
  const { query, variables } = await request.json();
  console.log("Received query:", query);
  console.log("Received variables:", variables);

  // Static argument for `created_at`
  const staticCreatedAt = new Date().toISOString();  // You can set this to a specific date-time if needed

  try {
    let result;
    if (query.trim().startsWith("mutation")) {
      // Add the static `created_at` argument to variables
      if (query.includes("insertChatbots") && !variables.created_at) {
        variables.created_at = staticCreatedAt;
      }
      result = await serverClient.mutate({
        mutation: gql`${query}`,
        variables,
      });
    } else {
      result = await serverClient.query({
        query: gql`${query}`,
        variables,
      });
    }

    console.log("GraphQL result:", result);

    const data = result.data;
    return NextResponse.json({
      data,
    }, {
      headers: corsHeaders,
    });
  } catch (error) {
    console.error('Error occurred:', error);

    if (error instanceof ApolloError) {
      console.error('ApolloError:', error);
      if (error.networkError) {
        console.error('NetworkError:', error.networkError);
      }
      if (error.graphQLErrors) {
        error.graphQLErrors.forEach((err) => console.error('GraphQLError:', err));
      }
      return NextResponse.json({
        error: error.message,
      }, {
        status: 500,
      });
    } else {
      return NextResponse.json({
        error: 'An unknown error occurred',
      }, {
        status: 500,
      });
    }
  }
}
