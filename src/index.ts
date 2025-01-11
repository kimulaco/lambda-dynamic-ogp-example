import { APIGatewayProxyHandler, APIGatewayProxyEvent } from 'aws-lambda';

export const ping: APIGatewayProxyHandler = async () => {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      status: 'ok',
    }),
    isBase64Encoded: false,
  };
};

export const ogpMessage = async (event: APIGatewayProxyEvent) => {
  const message = event.queryStringParameters?.message || 'Hello, World!';
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
    }),
  };
};
