import React from 'react';
import './App.css';

function Game(props) {
  //     <a href={`https://lichess.org/${props.id}`} target="_blank">Link</a>
  return <p>
    <iframe
      src={`https://lichess.org/embed/${props.id}#1000?theme=auto&amp;bg=auto`}
      width={600} height={397} frameborder={0}></iframe>
  </p>
}

function Match(props) {
  const {details} = props;
  const [opponent1, opponent2] = details.opponents;
  const {games} = details;

  return <>
    <h1>{opponent1} vs {opponent2}</h1>
    <p>Took place on {details.date}</p>
    {games.length ? games.map(g =><Game id={g}/>) : <p>No games played</p>}
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
    <h1>Follow Horde World Championship</h1>
    <div className="App">
      <Matches/>
    </div>
    </>
  );
}

export default App;
