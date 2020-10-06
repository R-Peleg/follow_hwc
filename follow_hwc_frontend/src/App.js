import React, { useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';


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
    <Button onClick={() => {
        setIsOpen(!isOpen);
    }}>Expand</Button>
    {isOpen && ids.map(id =><Game id={id}/>)}
  </div>
}

function Match(props) {
  const {details} = props;
  const [opponent1, opponent2] = details.opponents;
  const {games} = details;

  return <>
    <h1>{opponent1} vs {opponent2}</h1>
    <p>Took place on {details.date}</p>
    {
      games.length ? 
        <Games ids={games}/> : 
        <p>No games played</p>
    }
  </>;
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
    <p>{matches?.map(m => <Match details={m}/>)}</p>
    </>;
  }
}

function App() {
  return (
    <>
    <h1>Follow the Horde World Championship</h1>
    <h2>Brought you by <a href='https://hordechessblog.com/' target="_blank">Horde Chess Blog</a></h2>
    <div className="App">
      <Matches/>
    </div>
    </>
  );
}

export default App;
