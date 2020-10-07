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


function Game(props) {
  const {id, loadIframe} = props;
  const [wasLoaded, setWasLoaded] = useState(false);
  if (loadIframe && !wasLoaded) {
    setWasLoaded(true);
  }

  return wasLoaded ? <iframe title={`Game ${id}`}
      src={`https://lichess.org/embed/${id}#1000?theme=auto&amp;bg=auto`}
      width={600} height={397} frameBorder={0}></iframe> : <>Not loaded</>

}

function Games(props) {
  const {ids} = props;
  const [selectedGame, setSelectedGame] = useState(null);

  return <>
    <Tabs 
    id='games-tab'
    activeKey={selectedGame}
    onSelect={(key) => setSelectedGame(key)}>
      {ids.map(
        (game_id, index) => <Tab eventKey={game_id} title={"Game " + (index + 1)}>
          <p/>
          <Game key={game_id} id={game_id} loadIframe={selectedGame === game_id} />
        </Tab>
      )}
    </Tabs>
  </>;
}

function Match(props) {
  const {details} = props;
  const [opponent1, opponent2] = details.opponents;
  const [result1, result2] = details.result || [null, null];
  const {games} = details;

  return <Card className="mx-auto my-1">
    <Card.Body>     
      <Card.Title>{opponent1} vs {opponent2}</Card.Title>
      <Card.Subtitle>Took place on {details.date}, result {result1} - {result2}</Card.Subtitle>

    {
      games.length ? 
        <Games ids={games}/> : 
        <p>No games played</p>
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
    <Accordion>
      {rounds?.rounds?.map((r, idx) => <Round key={idx} {...r}/>)}
    </Accordion>
    </>;
  }
}


function App() {
  return (
    <>
    <Navbar bg="light" expand="lg">
      <Navbar.Brand href="#home">Follow the Horde World Championship</Navbar.Brand>
      <Nav.Link href='https://hordechessblog.com/' target="_blank">by Horde Chess Blog</Nav.Link>
    </Navbar>
    <Container>
      <Matches/>
    </Container>
    </>
  );
}

export default App;
