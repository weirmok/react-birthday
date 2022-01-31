import React, { useState } from "react"
import { Card, Button, Alert } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"

export default function Dashboard() {
  const [error, setError] = useState("")
  const { currentUser, logout, birthday, quote } = useAuth()
  const history = useHistory()

  async function handleLogout() {
    setError("")

    try {
      await logout()
      history.push("/login")
    } catch {
      setError("Failed to log out")
    }
  }
  function calcDays(birthdate) {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    let firstDate = new Date();
    const currentYear = firstDate.getFullYear();

    firstDate = new Date(currentYear, firstDate.getMonth(), firstDate.getDate());
    const [, bMonth, bDay] = birthdate.split('-');
    const currentBirth = currentYear + birthdate.substring(4);
    const secondDate = new Date(currentYear, Number(bMonth) - 1, bDay);

    if(firstDate - secondDate <= 0) {
      return Math.round(Math.abs((firstDate - secondDate) / oneDay));
    } else {
      let nextyear = new Date((currentYear+1) + birthdate.substring(4));
      return Math.round(Math.abs((firstDate - nextyear) / oneDay));
    }
  }
  
  let text = ''
  if (birthday) {
    const days = calcDays(birthday.birthdate);
    if (days === 0) {
      text += `Happy Birthday, ${birthday.name}!`;
    } else {
      text += `${days} DAYS LEFT UTIL YOUR BIRTHDAY!`;
    }
  }

  return (
    <>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Profile</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <strong>Email:</strong> {currentUser.email}
          <br/>
          <strong>Birthday:</strong> {birthday && birthday.birthdate}
          <br />
          <h5>{text}</h5>
          {quote && <h3>{quote.text}</h3>}
          {quote && <h5>{quote.author}</h5>}
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        <Button variant="link" onClick={handleLogout}>
          Log Out
        </Button>
      </div>
    </>
  )
}
