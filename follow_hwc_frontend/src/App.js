import React, { useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav'
import Card from 'react-bootstrap/Card'
import Container from 'react-bootstrap/Container'
import Accordion from 'react-bootstrap/Accordion'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import ResponsiveEmbed from 'react-bootstrap/ResponsiveEmbed'
import ReactGA from 'react-ga';
ReactGA.initialize('UA-168518736-2');


function Game(props) {
  const {id, loadIframe} = props;
  const [wasLoaded, setWasLoaded] = useState(false);
  if (loadIframe && !wasLoaded) {
    setWasLoaded(true);
  }

  return wasLoaded ? 
  <ResponsiveEmbed aspectRatio="16by9">
    <iframe title={`Game ${id}`} src={`https://lichess.org/embed/${id}#1000`}
      width={600} height={397} frameBorder={0}>
    </iframe>
  </ResponsiveEmbed> : 
  <>Not loaded</>
}

function Games(props) {
  const {ids} = props;
  const [selectedGame, setSelectedGame] = useState(null);

  const reportGameShow = (game_id) => {
    console.log(`Display ${game_id}`);
    ReactGA.event({
      category: 'Navigation',
      action: 'Display game',
      label: `/game/${game_id}`
    });
  };
  const reportGameHide = (game_id) => {
    console.log(`Hide ${game_id}`);
    ReactGA.event({
      category: 'Navigation',
      action: 'Hide game',
      label: `/game/${game_id}`
    });
  };
  const reportAndSetGame = (game_id) => {
    if (game_id === null) {
      reportGameHide(selectedGame);
    } else {
      reportGameShow(game_id);
    }
    setSelectedGame(game_id);
  };

  return <Tabs 
    id='games-tab'
    activeKey={selectedGame}
    onSelect={(key) => (key === selectedGame ? reportAndSetGame(null) : reportAndSetGame(key))}>
      {ids.map(
        (game_id, index) => <Tab key={index} eventKey={game_id} title={"Game " + (index + 1)}>
          <p/>
          <Game key={game_id} id={game_id} loadIframe={selectedGame === game_id} />
          <p/>
          <Button onClick={() => reportAndSetGame(null)}>Hide</Button>
        </Tab>
      )}
  </Tabs>;
}

function Match(props) {
  const {details} = props;
  const [opponent1, opponent2] = details.opponents;
  const [result1, result2] = details.result || [null, null];
  const {games} = details;

  return <Card className="mx-auto my-1">
    <Card.Header>
    <Card.Title>{opponent1} vs {opponent2}, result {result1} - {result2}</Card.Title>
    <Card.Text>Took place on {details.date}</Card.Text>

    </Card.Header>

    <Card.Body style={{paddingTop: 10}}>
    {
      games.length ? 
        <Games ids={games}/> : 
        <>No games played</>
    }
    </Card.Body>
  </Card>;
}

function Round(props) {
  const {number, matches} = props;

  return <div>
    <Accordion.Toggle as={Button} variant="link" eventKey={number}>
      Round number {number}
    </Accordion.Toggle>
    <Accordion.Collapse eventKey={number}>
      <div>
        {matches?.map((m, idx) => <Match key={idx} details={m}></Match>)}
      </div>
    </Accordion.Collapse>
  </div>
}

class Matches extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      rounds: []
    };
  }

  componentDidMount() {
    fetch("matches.json")
      .then(res => res.json())
      .then(
        result => {
          this.setState({
            isLoaded: true,
            rounds: result
          })
        },
        error => {
          this.setState({
            isLoaded: true,
            error
          })
        });
  }

  render() {
    const {isLoaded, rounds, error} = this.state;
    return <>
    {isLoaded || <p>Loading...</p>}
    {error && <p>Error: {error?.toString()}</p>}
    <Accordion onSelect={
      (round_number) => ReactGA.event({
        category: 'Navigation',
        action: 'Display round',
        label: `/round/${round_number}`
      })
    }>
      {rounds?.rounds?.map((r, idx) => <Round key={idx} {...r}/>)}
    </Accordion>
    </>;
  }
}


function App() {
  ReactGA.pageview(window.location.pathname + window.location.search);
  return (
    <>
    <Navbar bg="light" expand="lg">
      <Navbar.Brand href="#home">Follow the Horde World Championship</Navbar.Brand>
      <Nav.Link href='https://hordechessblog.com/' target="_blank">by Horde Chess Blog</Nav.Link>
    </Navbar>
    <Container  style={{width: 800}}>
      <Matches/>
    </Container>
    </>
  );
}

export default App;
