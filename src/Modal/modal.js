import React, { Component } from 'react';
import './modal.css';

import Xwon from '../TicTacToe/XwonPose.png';
import Owon from '../TicTacToe/OwonPose.png';
import XPunch from '../TicTacToe/XPunchO.png';
import OPunch from '../TicTacToe/OPunchX.png';
import tie1 from '../TicTacToe/tie1.png';
import tie2 from '../TicTacToe/tie2.png';

class Modal extends Component{
    constructor(props){
        super(props);
        this.state = {
            counter: 0,
            mainPic: 'https://media.giphy.com/media/hWZBZjMMuMl7sWe0x8/giphy.gif',
        }
    }

    componentDidMount(){
        let pic1 = Owon;
        let pic2 = OPunch;
        if(this.props.winner === "tie"){
            pic1 = tie1;
            pic2 = tie2;
        }
        if(this.props.winner === "X"){
            pic1 = Xwon;
            pic2 = XPunch;
        }
        this.myInterval = setInterval(() => {
            let mainPic = pic1;
            if(this.state.counter % 2 === 0){
                mainPic = pic2;
            }
            this.setState({
                counter: this.state.counter + 1,
                mainPic: mainPic,
            })
            if(this.state.counter >= 20){
                this.props.click();
            }
        }, 500)
    }

    componentWillUnmount(){
        clearInterval(this.myInterval)
    }

    render(){
        let message = <h2>{this.props.winner} won</h2>;
        if(this.props.winner === "tie"){
            message = <h2>its a tie, lmao u both suck...</h2>;
        }

        return(
            <div className="modal" onClick={this.props.click}>
                <div className="modal-content">
                    {message}
                    {this.state.mainPic !== null && <img className="winnerpic" src={this.state.mainPic} alt="winnerpic"/>}
                    <p>click anywhere to continue!</p>
                </div>
            </div>
        );
    }

}

export default Modal;