import React, { useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav'
import Card from 'react-bootstrap/Card'
import Container from 'react-bootstrap/Container'

function Game(props) {
  return <p>
    <iframe title={`Game ${props.id}`}
      src={`https://lichess.org/embed/${props.id}#1000?theme=auto&amp;bg=auto`}
      width={600} height={397} frameborder={0}></iframe>
  </p>
}

function Games(props) {
  const {ids} = props;
  const [isOpen, setIsOpen] = useState(false);
  return <div>
    {ids.length} games 
    
    <Button onClick={() => {
        setIsOpen(!isOpen);
    }}>{isOpen ? "collapse" : "Expand"}</Button>
    {isOpen && ids.map(id =><Game id={id}/>)}
  </div>
}

function Match(props) {
  const {details} = props;
  const [opponent1, opponent2] = details.opponents;
  const {games} = details;

  return <Card>
    <Card.Body>
    <Card.Title>{opponent1} vs {opponent2}</Card.Title>
    <Card.Subtitle>Took place on {details.date}</Card.Subtitle>
    {
      games.length ? 
        <Games ids={games}/> : 
        <p>No games played</p>
    }
    </Card.Body>
  </Card>;
}

class Matches extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      matches: []
    };
  }

  componentDidMount() {
    fetch("matches.json")
      .then(res => res.json())
      .then(
        result => {
          result.sort((match1, match2) => {
            return Date.parse(match1.date) - Date.parse(match2.date);
          });
          this.setState({
            isLoaded: true,
            matches: result
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
    const {isLoaded, matches, error} = this.state;
    return <>
    <h1>Matches:</h1>
    {isLoaded || <p>Loading...</p>}
    {error && <p>Error: {error?.toString()}</p>}
    {matches?.map(m => <Match details={m}/>)}
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
