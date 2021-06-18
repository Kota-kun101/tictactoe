import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';

import './Spielfeld.css'

class spielfeld extends Component {
    constructor(props){
      super(props);
      this.state = {
          gameboard: {},
          numberOfGames: 0,
          game: [],
          isLoading: true,
      }
      this.handleUnload = this.handleUnload.bind(this); //cool
  }

  componentDidMount(){
    this._isMounted = true;
    this.myInterval = setInterval(() => {
      this.getGameboard();
      this.checkWin();
      this.getGame(this.props.gameId);
    }, 1000)
    window.addEventListener('beforeunload', this.handleUnload);
  }

  getGameboard = () =>{
    const gameId = this.props.gameId;
    fetch('https://polar-crag-55776.herokuapp.com/Gameboard?gameboardId=' + gameId)
    .then(response => response.json())
    .then(response => {if(this._isMounted){this.setState({gameboard: response.data[0], numberOfGames: response.data[0].numberOfGames, isLoading: false})}})
    .catch(err => console.log(err))
  }

  getIcon = (changeState) =>{
    const numberOfGames = this.state.numberOfGames;

    if(changeState){
      this.setState({
        numberOfGames: this.state.numberOfGames + 1,
      })
    }

    if(numberOfGames % 2 === 0){
      return 'X';
    }
    else{
      return 'O';
    }
  }

  handleClick = (nr, value) =>{
    if(value === '_' && this.getIcon(false) === this.props.icon)
    {
      const fieldId = nr;
      const icon = this.getIcon(true);
      const gameId = this.props.gameId;
      fetch('https://polar-crag-55776.herokuapp.com/Gameboard/UpdateField?fieldId=' + fieldId + '&icon=' + icon + '&gameId=' + gameId)
      .then(this.getGameboard())
      .catch(err => console.log(err))
    }
  }

  clearGameboard = () =>{
    const gameId = this.props.gameId;
    fetch('https://polar-crag-55776.herokuapp.com/Gameboard/Clear?gameId=' + gameId)
    .then(this.getGameboard())
    .catch(err => console.log(err))
  }

  getGame = (gameId) =>{
    fetch('https://polar-crag-55776.herokuapp.com/getGamePlayerName?gameboardId=' + gameId)
    .then(response => response.json())
    .then(response => {if(this._isMounted){this.setState({game: response.data[0]})}})
    .catch(err => console.log(err))
  }

  checkWin = () =>{
    const gameboard = this.state.gameboard;
    if(gameboard.field1 !== undefined){
      const icon = (this.state.numberOfGames + 1) % 2 === 0 ? 'X' : 'O';
      let didPlayerWin = false;
      const situations = [
        [gameboard.field1, gameboard.field2, gameboard.field3],
        [gameboard.field4, gameboard.field5, gameboard.field6],
        [gameboard.field7, gameboard.field8, gameboard.field9],
        [gameboard.field1, gameboard.field4, gameboard.field7],
        [gameboard.field2, gameboard.field5, gameboard.field8],
        [gameboard.field3, gameboard.field6, gameboard.field9],
        [gameboard.field1, gameboard.field5, gameboard.field9],
        [gameboard.field3, gameboard.field5, gameboard.field7],
      ];
      for (let i = 0; i < situations.length; i++){
        const [a, b, c] = situations[i];
        if (a !== '_' && a === b && a === c) {
          console.log(icon + " has won!")
          console.log(a + ", " + b + ", " + c)
          didPlayerWin = true
          this.props.showModal(icon);
          this.clearGameboard();
        }
      }
      if(!didPlayerWin && gameboard.field1 !== '_' && gameboard.field2 !== '_' && gameboard.field3 !== '_' && gameboard.field4 !== '_' && gameboard.field5 !== '_' && gameboard.field6 !== '_' && gameboard.field7 !== '_' && gameboard.field8 !== '_' && gameboard.field9 !== '_'){
        console.log("its a tie, lmao u both suck")
        this.props.showModal("tie");
        this.clearGameboard();
      }
    }
  }

  leaveGame = () =>{
    if(this.props.icon === "X"){
      this.leavesGame(1);
    }
    else{
      this.leavesGame(2);
    }
  }

  leavesGame = (playernr) =>{
    const player = playernr;
    const gameId = this.props.gameId;
    fetch('https://polar-crag-55776.herokuapp.com/Gameboard/leaveGame?gameId=' + gameId + '&player=' + player)
    .then(this.clearGameboard())
    .then(() => this.props.history.push('/Games'))
    .catch(err => console.log(err))
  }

  handleUnload(e) {
    this.leaveGame();
  }

  componentWillUnmount(){
    clearInterval(this.myInterval)
    this._isMounted = false;
    this.leaveGame();
    window.removeEventListener('beforeunload', this.handleUnload);
  }

  render(){
    const gameboard = this.state.gameboard;

    let isXmyTurn = "yess";
    let isOmyTurn = "nooo";
    if(this.getIcon(false) === "O"){
      isXmyTurn = "nooo"
      isOmyTurn = "yess"
    }

    let playerNames = <div><Link to="/" className="maButton2">Enter Playername here!</Link><p>Please Enter your Playername first before joining a Match lmao.</p></div>;
    if(this.props.playerId !== 0){
      playerNames = (
        <div className="row1">
          <p className={isXmyTurn}>Player1: {this.state.game.player1} as X</p>
          <p/>
          <p className={isOmyTurn}>Player2: {this.state.game.player2} as O</p>
        </div>
      );
    }

    const loadingImg = <img className="playingFieldLoading" src="https://media.giphy.com/media/wnYB3vx9t6PXiq1ubB/giphy.gif" alt="loading..." />;

    return (
      <div className="field">
        <div className="row1">
          {playerNames}
        </div>
          <div className="row">
            <button className="feldbutton" onClick={() => this.handleClick(1, gameboard.field1)}>{gameboard.field1 || loadingImg}</button>
            <button className="feldbutton" onClick={() => this.handleClick(2, gameboard.field2)}>{gameboard.field2 || loadingImg}</button>
            <button className="feldbutton" onClick={() => this.handleClick(3, gameboard.field3)}>{gameboard.field3 || loadingImg}</button>
          </div>
          <div className="row"> 
            <button className="feldbutton" onClick={() => this.handleClick(4, gameboard.field4)}>{gameboard.field4 || loadingImg}</button>
            <button className="feldbutton" onClick={() => this.handleClick(5, gameboard.field5)}>{gameboard.field5 || loadingImg}</button>
            <button className="feldbutton" onClick={() => this.handleClick(6, gameboard.field6)}>{gameboard.field6 || loadingImg}</button>
          </div>
          <div className="row">
            <button className="feldbutton" onClick={() => this.handleClick(7, gameboard.field7)}>{gameboard.field7 || loadingImg}</button>
            <button className="feldbutton" onClick={() => this.handleClick(8, gameboard.field8)}>{gameboard.field8 || loadingImg}</button>
            <button className="feldbutton" onClick={() => this.handleClick(9, gameboard.field9)}>{gameboard.field9 || loadingImg}</button>
          </div>
          <button className="leaveBtn" onClick={() => this.leaveGame()}>leave</button>
      </div>
    );
  }
}

export default withRouter(spielfeld);