import type { FC } from 'react';

interface Props {
  message: string;
}

export const OgpMessage: FC<Props> = ({ message }) => {
  return (
    <div
      style={{
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
      }}
    >
      {message}
    </div>
  );
};
