import { APIGatewayProxyHandler, APIGatewayProxyEvent } from 'aws-lambda';
import satori, { Font } from 'satori'
import sharp from 'sharp'
import notoSansJpJapanese400Normal from './fonts/noto-sans-jp-japanese-400-normal.woff';
import notoSansJpLatin400Normal from './fonts/noto-sans-jp-latin-400-normal.woff';

const fonts: Font[] = [
  {
    name: 'Noto Sans JP',
    data: notoSansJpJapanese400Normal,
    weight: 400,
    style: 'normal',
  },
  {
    name: 'Noto Sans JP',
    data: notoSansJpLatin400Normal,
    weight: 400,
    style: 'normal',
  },
];

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

  try {
    const svg = await satori(
      {
        type: 'div',
        props: {
          style: {
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white',
            fontSize: 60,
            fontWeight: 400,
            fontFamily: 'Noto Sans JP',
            color: 'black',
            padding: '50px',
            lineHeight: 1.2,
            textAlign: 'center',
          },
          children: message,
        },
      },
      {
        width: 1200,
        height: 630,
        fonts,
      }
    );

    const pngBuffer = await sharp(Buffer.from(svg))
      .resize(1200, 630)
      .png()
      .toBuffer();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000',
      },
      body: pngBuffer.toString('base64'),
      isBase64Encoded: true,
    };
  } catch (error) {
    console.error('Error generating image:', error);
    const details = error instanceof Error ? error.message : 'Unknown error';
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to generate image',
        details,
      }),
    };
  }
};

