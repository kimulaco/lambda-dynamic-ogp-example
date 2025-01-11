import { APIGatewayProxyHandler, APIGatewayProxyEvent } from 'aws-lambda';
import satori, { Font } from 'satori';
import sharp from 'sharp';
import notoSansJpJapanese400Normal from './assets/fonts/noto-sans-jp-japanese-400-normal.woff';
import notoSansJpLatin400Normal from './assets/fonts/noto-sans-jp-latin-400-normal.woff';
import { OgpMessage } from './components/OgpMessage';

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
      <OgpMessage message={message} />,
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
