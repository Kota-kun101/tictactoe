import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import './ViewGames.css'

class viewGames extends Component {
    constructor(props){
        super(props);
        this.state = {
            games: [],
            isLoading: true,
        }
    }

    componentDidMount(){
        this._isMounted = true;
        this.getGames();
        this.myInterval = setInterval(() => {
            this.getGames();
        }, 2000)
    }

    getGames = () =>{
        fetch('https://polar-crag-55776.herokuapp.com/Games')
        .then(response => response.json())
        .then(response => {if(this._isMounted){this.setState({games: response.data, isLoading: false})}})
        .catch(err => console.log(err))
    }

    joinGame = (game) =>{
        const gameId = game.gameId;
        const playerToJoin = this.props.playerId;
        const gameboardId = game.fk_gameboardId;
        let player = 2;
        let icon = "O";
        if(game.fk_player1 === 0){
            player = 1;
            icon = "X";
        }
        fetch('https://polar-crag-55776.herokuapp.com/Games/Join?gameId=' + gameId + '&playerId=' + playerToJoin + '&player=' + player)
        .then(this.getGames())
        .then(this.props.setGameId(gameboardId))
        .then(this.props.setIcon(icon))
        .catch(err => console.log(err))
    }

    createGame = () =>{
        fetch('https://polar-crag-55776.herokuapp.com/getGameboard')
        .then(response => response.json())
        .then(response => this.createNewGame(response.data[0].newGameboardId))
        .catch(err => console.log(err))
    }

    createNewGame = (gameboardId) =>{
        const player1Id = this.props.playerId;

        fetch('https://polar-crag-55776.herokuapp.com/newGame?gameboardId=' + gameboardId + '&player1Id=' + player1Id)
        .then(this.createNewGameboard(gameboardId))
        .catch(err => console.log(err))
    }

    createNewGameboard = (gameboardId) =>{
        fetch('https://polar-crag-55776.herokuapp.com/newGameboard?gameboardId=' + gameboardId)
        .then(this.props.setGameId(gameboardId))
        .then(this.getGames())
        .then(this.props.setIcon("X"))
        .then(() => this.props.history.push('/Area51'))
        .catch(err => console.log(err))
    }

    componentWillUnmount(){
        clearInterval(this.myInterval)
        this._isMounted = false;
    }

    render(){
        const games = this.state.games;
        const availableGames = games.map(game => {
            let maButton = <Link to="/Area51"><button className="maButton" onClick={() => this.joinGame(game)}>Join</button></Link>
            if(game.fk_player1 > 0 && game.fk_player2 > 0){
                maButton = <p>Game is Full</p>
            }
            return(
                <div className="gameBox" key={game.gameId}>
                    <p>Player1: {game.player1}</p>
                    <p>Player2: {game.player2}</p>
                    {maButton}
                </div>
            )
        })
        const playerName = this.props.playerName;
        let display_PlayerName;
        let show_Games;
        if(playerName === ""){
            display_PlayerName = <div><Link to="/" className="maButton">Enter Playername here!</Link><a className="atag" href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">Secret</a><p>Please Enter your Playername first before joining a Match lmao.</p></div>
            show_Games = false;
        }
        else{
            display_PlayerName = <div className="containerPlayerName"><p>PlayerName: {this.props.playerName}</p><Link to="/" className="leaveButtonGames">back</Link></div>
            show_Games = true;
        }

        return (
            <div className="Container_Games">
                {!this.state.isLoading && display_PlayerName}
                {this.state.isLoading && <div className="gamesLoadingContainer"><img className="gamesLoading" src="https://media.giphy.com/media/wnYB3vx9t6PXiq1ubB/giphy.gif" alt="loading..." /><p>loading...</p></div>}
                {show_Games && <div className="Games">
                    {availableGames}
                    {!this.state.isLoading && <div className="gameBox">
                        <button className="createGameBtn" onClick={() => this.createGame()}>Create Game</button>
                    </div>}
                </div>}
            </div>
        );
    }
}

export default withRouter(viewGames);