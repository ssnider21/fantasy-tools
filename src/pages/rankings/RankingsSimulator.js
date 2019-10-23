/** @jsx jsx */
import { jsx } from '@emotion/core';
import React, { useEffect } from 'react';
import styled from '@emotion/styled';
import qs from 'query-string';
import { Helmet } from 'react-helmet';
import Table from './TrueRankingsTable';
import { Typography, TextField, Button } from '@material-ui/core';
import GameDayImg from './game-day.svg';
import ReactGA from 'react-ga';

const SubmitButton = styled(Button)({
  marginTop: '16px',
  marginBottom: '8px',
  marginLeft: '16px',
  height: '53px',
  '@media(max-width: 600px)': {
    margin: 0,
    width: '100%'
  }
});

const Home = () => {
  const [espnUrl, setEspnUrl] = React.useState();
  const [leagueId, setLeagueId] = React.useState(1788259);
  const [seasonId, setSeasonId] = React.useState(2019);

  useEffect(() => {
    ReactGA.pageview(window.location.pathname + window.location.search);
  }, []);

  const onSubmit = e => {
    e.preventDefault();
    const parsed = qs.parse(espnUrl.substring(espnUrl.indexOf('?'), espnUrl.length));
    setLeagueId(parsed.leagueId);
    setSeasonId(parsed.seasonId);
  };

  return (
    <>
      <Helmet>
        <title>Fantasy Tools | Standings Simulator</title>
        <meta
          name="description"
          content="A tool to simulate every possible matchup against teams in your league."
        />
      </Helmet>
      <header
        css={{
          minHeight: 288,
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <div>
          <Typography variant="h1" css={{ fontWeight: 600 }}>
            Standings Simulator
          </Typography>
        </div>
      </header>
      <section>
        <Table leagueId={leagueId} seasonId={seasonId} />
      </section>
    </>
  );
};

export default Home;
