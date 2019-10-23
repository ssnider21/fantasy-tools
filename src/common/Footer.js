/** @jsx jsx */
import { jsx } from '@emotion/core';
import WaveImg from './wave.svg';
import { Typography } from '@material-ui/core';

const Footer = () => {
  return (
    <footer>
      <div
        css={{
          minHeight: 300,
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'flex-end'
        }}
      >
        <Typography css={{ margin: '0.5rem', color: '#bbb' }}>
          Adapted from fantasytools.dev by Jake Partusch.
        </Typography>
      </div>
    </footer>
  );
};

export default Footer;
