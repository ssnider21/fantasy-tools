/** @jsx jsx */
import { jsx } from '@emotion/core';
import { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Typography
} from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { getPowerRankings } from '../../api/FantasyFootballApiv2';
import styled from '@emotion/styled';
import AlertDialog from './AlertDialog';
import ReactGA from 'react-ga';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(3),
    overflowX: 'auto',
    margin: 'auto',
    maxWidth: 960
  }
}));

/*
  Should return a dark red for bad record and dark green for a good record,
  mediocre records should be light red/green
*/
const getHslCellColor = (wins, losses) => {
  const totalGames = losses + wins;
  if (wins < losses) {
    const winPercentage = wins / totalGames;
    return `hsl(0, 65%,${(winPercentage + 0.5) * 100}%)`;
  } else {
    const lossPercentage = losses / totalGames;
    return `hsl(100, 65%,${(lossPercentage + 0.4) * 100}%)`;
  }
};

const getHslLuckColor = luck => {
  luck = parseFloat(luck);
  if (luck < 0) {
    return `hsl(0, 65%,${Math.max((luck + 0.8) * 100, 25)}%)`;
  } else {
    return `hsl(120, 65%,${Math.max((0.7 - luck) * 100, 13)}%)`;
  }
};

const displayWeeklyRecords = (team, totalTeams) => {
  return team.wins.map((wins, index) => {
    const losses = totalTeams - 1 - wins;
    return (
      <TableCell
        align="center"
        css={{ padding: '10px', backgroundColor: getHslCellColor(wins, losses) }}
        key={`record-${index}`}
      >
        {wins} - {losses}
      </TableCell>
    );
  });
};

const displayLuckRating = (actualWins, totalWins) => {
  const luck = (actualWins / (totalWins * (1 / 9)) - 1).toFixed(4);
  return (
    <StyledTableCell
      align="center"
      className="luck-rating-cell"
      css={{ padding: '10px', backgroundColor: getHslLuckColor(luck) }}
    >
      <Typography variant="body1">{luck}</Typography>
    </StyledTableCell>
  );
};

const displayWeeklyHeaders = rankings => {
  if (rankings.length === 0) {
    return null;
  }
  return rankings[0].wins.map((win, i) => <TableCell key={`rankings-${i}`}>{i + 1}</TableCell>);
};

const TeamName = ({ name, isLargeScreen }) => {
  return (
    <Typography
      css={{
        marginLeft: isLargeScreen ? '15px' : '',
        fontSize: isLargeScreen ? '1.25rem' : '0.85rem'
      }}
      variant="subtitle1"
      component="span"
    >
      {name}
    </Typography>
  );
};

const StyledTableCell = styled(TableCell)({
  padding: '14px'
});

export default function TrueRankinsTable(props) {
  const classes = useStyles();

  const isLargeScreen = useMediaQuery('(min-width:960px)');

  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const { leagueId, seasonId = 2020 } = props;

  useEffect(() => {
    const fetchRankings = async () => {
      setLoading(true);
      try {
        if (leagueId && seasonId) {
          let rankings = await getPowerRankings(leagueId, seasonId);
          setRankings(rankings);
          ReactGA.event({
            category: 'User',
            action: 'Searched Rankings - Success'
          });
        }
      } catch (e) {
        console.error(e);
        ReactGA.event({
          category: 'User',
          action: 'Searched Rankings - Failure',
          value: `LeagueId: ${leagueId}, SeasonId: ${seasonId}`
        });
        setShowAlert(true);
      }
      setLoading(false);
    };
    fetchRankings();
  }, [leagueId, seasonId]);

  if (!leagueId || loading) {
    return null;
  }

  return (
    <Paper className={classes.root} css={{ maxWidth: '1400px' }}>
      <AlertDialog open={showAlert} handleClose={() => setShowAlert(false)} />
      {rankings.length > 0 && (
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell css={{ minWidth: isLargeScreen ? '250px' : undefined }}>
                Team
              </StyledTableCell>
              {isLargeScreen && displayWeeklyHeaders(rankings)}
              <StyledTableCell
                align="center"
                css={{ minWidth: isLargeScreen ? '100px' : undefined }}
              >
                Simulated Record
              </StyledTableCell>
              <StyledTableCell
                align="center"
                css={{ minWidth: isLargeScreen ? '100px' : undefined }}
              >
                ESPN Record
              </StyledTableCell>
              <StyledTableCell
                align="center"
                css={{ minWidth: isLargeScreen ? '100px' : undefined }}
              >
                Expected Record
              </StyledTableCell>
              <StyledTableCell
                align="center"
                css={{ minWidth: isLargeScreen ? '100px' : undefined }}
              >
                Luck Rating
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rankings.map(row => (
              <TableRow key={row.name}>
                <StyledTableCell>
                  <div css={{ display: 'flex', alignItems: 'center' }}>
                    {isLargeScreen && <Avatar alt={row.name} src={row.logo} />}
                    <TeamName name={row.name} isLargeScreen={isLargeScreen} />
                  </div>
                </StyledTableCell>
                {isLargeScreen && displayWeeklyRecords(row, rankings.length)}
                <StyledTableCell align="center" className="simulated-record-cell">
                  <Typography variant="body1" css={{ fontWeight: '600' }}>
                    {row.totalWins} - {row.totalLosses}
                  </Typography>
                </StyledTableCell>
                <StyledTableCell align="center" className="actual-record-cell">
                  <Typography variant="body1">
                    {row.actualRecord.wins} - {row.actualRecord.losses}
                  </Typography>
                </StyledTableCell>
                <StyledTableCell align="center" className="expected-record-cell">
                  <Typography variant="body1">
                    {(row.totalWins * (1 / 9)).toFixed(2)} -{' '}
                    {(row.totalLosses * (1 / 9)).toFixed(2)}
                  </Typography>
                </StyledTableCell>
                {displayLuckRating(row.actualRecord.wins, row.totalWins)}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Paper>
  );
}
