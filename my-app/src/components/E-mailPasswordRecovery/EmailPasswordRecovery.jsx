import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import "../../styles/EmailRecovery/EmailRecovery.css"


export default class EmailPasswordRecovery extends Component {
  render() {
    return (
       <div className="confirmation-container">
        <div className="confirmation-message">
        An email has been sent to your email address to recover your password.
        Please follow the link in the email to complete password recovery. <Link to ='/'>Go home</Link>
        </div>
        </div>
    )
  }
}
