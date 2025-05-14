import React, { Component } from 'react'
import "../../styles/EmailRecovery/EmailRecovery.css"
import { Link } from 'react-router-dom'

export default class EmailConfirmLetter extends Component {
  render() {
    return (
      <div className="confirmation-container">
        <div className="confirmation-message">
        An email has been sent to your email address to confirm your account.
        Please follow the link in the email to complete your registration. <Link to ='/'>Go home</Link>
        </div>
        </div>
    )
  }
}
