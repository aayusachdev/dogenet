const theme = {
  palette: {
    primary: {
      light: '#534bae',
      main: '#16CFF7',
      dark: '#0A6AB4',
      contrastText: '#fff'
    },
    secondary: {
      light: '#16CFF7',
      main: '#08080D',
      dark: '#000',
      contrastText: '#f2f2f2',
    }
  },
  styles: {
    form: {
      textAlign: 'center',
    },
    logo: {
      borderRadius: '100%',
      maxWidth: '90px',
      margin: '20px auto 20px auto'
    },
    pageTitle: {
      fontSize: '1.8rem',
      fontWeight: '300',
      letterSpacing: '2px',
    },
    textField: {
      margin: '10px auto 10px auto',
    },
    input: {
      color: 'white'
  },
    customError: {
      color: "#ff0000",
      fontSize: '0.8rem',
      marginBottom: '10px'
    },
    loading: {
      marginLeft: '10px'
    },
    button: {
      borderRadius: '25px',
      padding: '10px 24px',
      minWidth: '100px'
    },
    timestamp: {
      color: 'gray',
      fontSize: '14px',
    }
  },
  overrides: {
    MuiInputBase: {
      input: {
        borderBottom: "2px solid #f2f2f2",
        color: '#f2f2f2'
      },
    },
  },
};

export default theme;