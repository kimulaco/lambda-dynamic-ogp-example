export const ping = async () => {
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
