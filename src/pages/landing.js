import React from 'react'
import withStyles from '@material-ui/core/styles/withStyles'
import { Link } from 'react-router-dom';

// MUI stuff
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import '../App.css';
import hero1 from '../assets/images/hero1.png';
import hero2 from '../assets/images/hero2.png';
import hero3 from '../assets/images/hero3.png';
import hero4 from '../assets/images/hero4.png';

const styles = (theme) => ({
  ...theme.styles,
  heroLeft: {
    marginTop: '5vh',
    paddingLeft: '1rem'
  },
  heroRight: {
    marginTop: '5vh'
  },
  heropic: {
    maxWidth: '50%',
  },
  text1: {
    color: '#efe1b3',
    fontWeight: '600',
    letterSpacing: '2px',
    fontSize: '1rem'
  },
  text2: {
    color: '#d4af37',
    fontWeight: '400',
    fontSize: '12vh',
  },
  text3: {
    color: '#f8f8f8',
    fontSize: '1rem',
    margin: '1rem 0rem'
  }
});

function landing(props) {
  const { classes } = props;
  return (
    <>
      <Grid container spacing={0}>
        <Grid item xs={12} sm={7} className={classes.heroLeft}>
          <Typography variant="subtitle1" className={classes.text1}>
            A NEXT GEN PLATFORM
          </Typography>
          <Typography variant="h1" className={classes.text2}>
            Take your social life to the moon.
          </Typography>
          <Typography variant="h5" className={classes.text3}>
            Your new authentic social media platform with stuff that actually matters.
            <br/>Now connect with what appeals.
          </Typography>
          <Link to="/signup">
            <button className="getStartedBtn">
              GET STARTED
            </button></Link>
        </Grid>
        <Grid item xs={12} sm={5} className={classes.heroRight}>
          <img src={hero1} alt="1 hero pic" className={classes.heropic} />
          <img src={hero2} alt="2 hero pic" className={classes.heropic} />
          <img src={hero3} alt="3 hero pic" className={classes.heropic} />
          <img src={hero4} alt="4 hero pic" className={classes.heropic} />
        </Grid>
      </Grid>
    </>
  )
}


export default withStyles(styles)(landing);