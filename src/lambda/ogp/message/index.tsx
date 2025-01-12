import { APIGatewayProxyEvent } from 'aws-lambda'
import satori from 'satori'
import sharp from 'sharp'
import { OgpMessage } from './components/OgpMessage'
import { DEFAULT_FONTS } from '@/config/font'

export const index = async (event: APIGatewayProxyEvent) => {
  const message = event.queryStringParameters?.message || 'Hello, World!'

  try {
    const svg = await satori(<OgpMessage message={message} />, {
      width: 1200,
      height: 630,
      fonts: DEFAULT_FONTS,
    })

    const pngBuffer = await sharp(Buffer.from(svg)).resize(1200, 630).png().toBuffer()

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000',
      },
      body: pngBuffer.toString('base64'),
      isBase64Encoded: true,
    }
  } catch (error) {
    console.error('Error generating image:', error)
    const details = error instanceof Error ? error.message : 'Unknown error'
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to generate image',
        details,
      }),
    }
  }
}
