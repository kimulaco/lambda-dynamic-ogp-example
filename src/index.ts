import { APIGatewayProxyHandler } from 'aws-lambda';

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
