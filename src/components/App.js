import React, { Component } from 'react';
import { map } from 'lodash';
import { hot } from 'react-hot-loader';
import InfectionCard from './InfectionCard';
import cardData from '../data/cards.json';

@hot(module)
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      infectionDeck: [],
      discardPile: [],
      boxSix: [],
    };

    this.handleReset = this.handleReset.bind(this);
    this.handleEpidemic = this.handleEpidemic.bind(this);
    this.handleMove = this.handleMove.bind(this);
  }

  componentDidMount() {
    this.initialize();
  }

  render() {
    const { infectionDeck, discardPile, boxSix } = this.state;

    return (
      <div>
        <h1>Pandemic Tracker</h1>
        <div className="buttons">
          <a className="epidemic" onClick={this.handleEpidemic}>
            Epidemic
          </a>
          <a className="reset" onClick={this.handleReset}>
            Reset
          </a>
        </div>
        <div className="infection deck">
          <h2>Infection Deck ({infectionDeck.length})</h2>
          {map(infectionDeck, (infCard, index) => {
            return (
              <InfectionCard
                key={index}
                index={index}
                name={infCard.name}
                color={infCard.color}
                onDiscard={index => this.handleMove('discard', index)}
              />
            );
          })}
        </div>
        <div className="discard deck">
          <h2>Discard Pile ({discardPile.length})</h2>
          {map(discardPile, (infCard, index) => {
            return (
              <InfectionCard
                key={index}
                index={index}
                name={infCard.name}
                color={infCard.color}
                onDiscard={index => this.handleMove('innoculate', index)}
              />
            );
          })}
        </div>
        <div className="box-six deck">
          <h2>Box Six ({boxSix.length})</h2>
          {map(boxSix, (infCard, index) => {
            return (
              <InfectionCard
                key={index}
                index={index}
                name={infCard.name}
                color={infCard.color}
                onDiscard={index => this.handleMove('unnoculate', index)}
              />
            );
          })}
        </div>
      </div>
    );
  }

  initialize() {
    let loadedCards = [];
    cardData.forEach(card => {
      for (let i = 0; i < card.count; i++) {
        loadedCards.push({
          name: card.name,
          color: card.color,
        });
      }
    });
    loadedCards.sort(this.handleSort);
    this.setState({ infectionDeck: loadedCards, discardPile: [], boxSix: [] });
  }

  handleReset() {
    this.initialize();
  }

  handleEpidemic() {
    const { infectionDeck, discardPile } = this.state;
    let newInfectionDeck = [...discardPile, { name: 'EPIDEMIC', color: 'green' }, ...infectionDeck];

    this.setState({
      infectionDeck: newInfectionDeck,
      discardPile: [],
    });
  }

  handleMove(action, index) {
    const { infectionDeck, discardPile, boxSix } = this.state;
    let sourceDeck, destDeck;

    if (action === 'discard') {
      sourceDeck = [...infectionDeck];
      destDeck = [...discardPile];
    } else if (action === 'innoculate') {
      sourceDeck = [...discardPile];
      destDeck = [...boxSix];
    } else if (action === 'unnoculate') {
      sourceDeck = [...boxSix];
      destDeck = [...discardPile];
    }

    let cardToMove = sourceDeck[index];

    if (cardToMove.name !== 'EPIDEMIC') {
      destDeck = destDeck.concat(cardToMove);
      destDeck.sort(this.handleSort);
    }

    sourceDeck.splice(index, 1);

    if (sourceDeck.length && sourceDeck[0].name === 'EPIDEMIC') {
      sourceDeck.splice(0, 1);
    }

    if (action === 'discard') {
      this.setState({
        infectionDeck: sourceDeck,
        discardPile: destDeck,
      });
    } else if (action === 'innoculate') {
      this.setState({
        discardPile: sourceDeck,
        boxSix: destDeck,
      });
    } else if (action === 'unnoculate') {
      this.setState({
        boxSix: sourceDeck,
        discardPile: destDeck,
      });
    }
  }

  handleSort(cardA, cardB) {
    if (cardA.color === cardB.color) {
      return cardA.name > cardB.name ? 1 : -1;
    }
    return cardA.color > cardB.color ? 1 : -1;
  }
}

export default App;
