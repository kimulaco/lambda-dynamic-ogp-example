import type { FC } from 'react'

export type GachaResult = 0 | 1 | 2

interface Props {
  result: GachaResult
}

export const OgpGachaResult: FC<Props> = ({ result }) => {
  const imgUrl = `https://lambda-dynamic-ogp-example.s3.ap-northeast-1.amazonaws.com/assets/img/gacha/result/r${result}.png`

  return (
    <img
      src={imgUrl}
      width="192"
      height="192"
      style={{
        width: '192px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
      }}
    />
  )
}
