import React, { Component } from "react";
import './Form.css';

class form extends Component{
    constructor(props){
        super(props);
        this.state = {
          name: "",
          email: "",
          subject: "",
          message: "",
        }
        this.handleInput = this.handleInput.bind(this);
    }

    handleInput = e =>{
      this.setState({
        [e.target.name]: e.target.value,
      })
    }

    sendMessage = () =>{
        let emptyFields = "";
        let existsEmptyField = false;
        if(this.state.name === ""){
            emptyFields += " Name*,";
            existsEmptyField = true;
        }
        if(this.state.email === ""){
            emptyFields += " Email*,";
            existsEmptyField = true;
        }
        if(this.state.subject === ""){
            emptyFields += " Subject*,";
            existsEmptyField = true;
        }
        if(this.state.message === ""){
            emptyFields += " Message*,";
            existsEmptyField = true;
        }
        if(existsEmptyField){
            alert(emptyFields);
        }
        else{
            const mailgun = require("mailgun-js");
            const DOMAIN = 'sandbox562bdb9615e04e6cab98e6c3da0e66a9.mailgun.org';
            const api_key = "d1d6220993f661c0a2a422255ca627a0-3d0809fb-ba0bdcca"
            const mg = mailgun({apiKey: api_key, domain: DOMAIN});
            
            const data = {
                from: this.state.name + ' <' + this.state.email + '>',
                to: 'kota.schnider@gmail.com',
                subject: this.state.subject,
                text: this.state.message,
            };

            this.setState({
                name: "",
                email: "",
                subject: "",
                message: "",
            })

            mg.messages().send(data, (error, body)  => {
                console.log(body);
                if(error){
                    console.log(error)
                }
                alert("Nachricht wurde erfolgreich versendet.")
            });
        }

    }

    render(){
        return(
            <div className="container_Forms">
                <div className="row_form">
                    <p>Your Name:</p>
                    <input className="inputfieldForm" name="name" type="text" placeholder="Name" value={this.state.name} onChange={this.handleInput} />
                </div>
                <div className="row_form">
                    <p>Your Email:</p>
                    <input className="inputfieldForm" name="email" type="email" placeholder="Email" value={this.state.email} onChange={this.handleInput} />
                </div>
                <div className="row_form">
                    <p>Subject:</p>
                    <input className="inputfieldForm" name="subject" type="text" placeholder="Subject" value={this.state.subject} onChange={this.handleInput} />
                </div>
                <div className="row_form">
                    <p>Message:</p>
                    <textarea className="textareaForm" name="message" type="text" placeholder="Message" value={this.state.message} onChange={this.handleInput} />
                </div>
                <button className="formSubmitBtn" onClick={() => this.sendMessage()}>Submit</button>
            </div>
        );
    }
}

export default form;