import React, {Component} from 'react';
import {BrowserRouter, Route} from 'react-router-dom';
import PlayingField from './Spielfeld/Spielfeld';
import Entername from './EnterName/EnterName';
import Games from './viewGames/ViewGames';
import Modal from './Modal/modal';
import './App.css';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
        playerName: '',
        playerId: 0,
        gameboardId: 0,
        icon: '',

        isModalOpen: false,
        winner: '',
    }
  }

  openModal = (winner) =>{
    this.setState({
      isModalOpen: true,
      winner: winner,
    })
  }

  closeModal = () =>{
    this.setState({isModalOpen: false})
  }

  setplayerName = (playerName) =>{
    this.setState({
      playerName: playerName,
    })
  }

  setplayerId = (playerId) =>{
    this.setState({
      playerId: playerId,
    })
  }

  setgameId = (gameboardId) =>{
    this.setState({
      gameboardId: gameboardId,
    })
  }

  seticon = (icon) =>{
    this.setState({
      icon: icon,
    })
  }

  render(){
    return (
      <BrowserRouter>
      <div className="App">
        <Route path="/" exact render={() =>
            <Entername setPlayerName={this.setplayerName} setPlayerId={this.setplayerId}/>
        }/>
        <Route path="/Area51" exact render={() =>
          <div>
            {this.state.isModalOpen && <Modal winner={this.state.winner} click={this.closeModal}/>}
            <PlayingField playerName={this.state.playerName} playerId={this.state.playerId} gameId={this.state.gameboardId} icon={this.state.icon} setIcon={this.seticon} showModal={this.openModal}/>
          </div>
        }/>
        <Route path="/Games" exact render={() =>
          <Games setGameId={this.setgameId} setIcon={this.seticon} playerName={this.state.playerName} playerId={this.state.playerId}/>
        }/>
      </div>
      </BrowserRouter>
    );
  }
}

export default App;
