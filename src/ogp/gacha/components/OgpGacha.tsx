import type { CSSProperties, FC } from 'react'
import { OgpGachaResult, type GachaResult } from './OgpGachaResult'

export { GachaResult }

interface Props {
  results: GachaResult[]
}

const divStyleBase: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
}

export const OgpGacha: FC<Props> = ({ results }) => {
  const totalGachaCount = results.length
  const bigWinCount = results.filter((result) => result === 2).length
  const smallWinCount = results.filter((result) => result === 1).length
  const missCount = results.filter((result) => result === 0).length
  const displayResults = results.slice(0, 10)

  return (
    <div
      style={{
        ...divStyleBase,
        height: '100%',
        width: '100%',
        padding: '30px',
        backgroundColor: '#1458a7',
        fontSize: 32,
        fontWeight: 600,
      }}
    >
      <div
        style={{
          ...divStyleBase,
          height: '100%',
          width: '100%',
          padding: '30px',
          backgroundColor: '#fff',
          borderRadius: '10px',
        }}
      >
        <div
          style={{
            ...divStyleBase,
            flexDirection: 'row',
            flexWrap: 'wrap',
            width: '100%',
            gap: '30px',
            borderRadius: '10px',
          }}
        >
          {displayResults.map((result, index) => (
            <OgpGachaResult result={result} key={index} />
          ))}
        </div>

        <div
          style={{
            ...divStyleBase,
            width: '800px',
            height: '300px',
            position: 'absolute',
            backgroundColor: 'rgba(250, 250, 250, 0.9)',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
            borderRadius: '10px',
          }}
        >
          {totalGachaCount <= 0 && <p style={{ fontSize: 48 }}>ガチャしてみよう!!</p>}

          {totalGachaCount > 0 && <p style={{ fontSize: 48 }}>{totalGachaCount}ガチャしたよ!!</p>}

          {totalGachaCount > 0 && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '30px',
              }}
            >
              <p style={{ fontSize: 30 }}>大当たり: {bigWinCount}</p>
              <p style={{ fontSize: 30 }}>小当たり: {smallWinCount}</p>
              <p style={{ fontSize: 30 }}>はずれ: {missCount}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
