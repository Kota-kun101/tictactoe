import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import './EnterName.css'

class feld extends Component {
    constructor(props){
        super(props);
        this.state = {
            player: '',
            playerId: 0,
        }
    }

    handleInput = (e) =>{
        this.setState({
            player: e.target.value,
        })
    }

    componentDidMount(){
        this.getPlayer();
    }

    getPlayer = () =>{
        fetch('https://polar-crag-55776.herokuapp.com/getPlayer')
        .then(response => response.json())
        .then(response => this.reservatePlace(response.data[0].newPlayerId))
        .catch(err => console.log(err))
    }

    reservatePlace = (playerId) =>{
        this.setState({
            playerId: playerId,
        })
        fetch('https://polar-crag-55776.herokuapp.com/newPlayer?playerId=' + playerId)
        .catch(err => console.log(err))
    }

    handleClick = () =>{
        const player = this.state.player;
        const playerId = this.state.playerId;
        console.log(playerId + ' ' + player);
        if(player !== "" && playerId !== 0){
            fetch('https://polar-crag-55776.herokuapp.com/newPlayer/Name?playerName=' + player + '&playerId=' + playerId)
            .then(() => this.props.setPlayerName(player))
            .then(this.setState({player: ''}))
            .then(() => this.props.setPlayerId(playerId))
            .then(this.setState({playerId: 0}))
            .catch(err => console.log(err))
        }
    }

    render(){
        const playerName = this.state.player;
        const playerId = this.state.playerId;
        let btn_Submit;
        if(playerId === 0){
            btn_Submit = <div className="loadingContainer"><img className="loadingGif" src="https://media.giphy.com/media/wnYB3vx9t6PXiq1ubB/giphy.gif" alt="loading..."/><p>loading...</p></div>
        }
        else{
            if(playerName === ""){
                btn_Submit = <button className="btn_en" onClick={this.handleClick}>Submit</button>
            }
            else{
                btn_Submit = <Link to="/Games"><button className="btn_en" onClick={this.handleClick}>Submit</button></Link>
            }
        }


        return (
            <div className="enterNameContainer">
                <h1 className="header1">Enter your Name:</h1>
                <input id="player" className="input_en" type="text" name="player" value={this.state.player} onChange={this.handleInput}/>
                {btn_Submit}
            </div>
        );
    }
}

export default feld;