"use client"

import { useEffect, useState } from "react"

const BACKEND_URL = "https://localhost:8000"


export default function Home() {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

    useEffect(() => {
      fetch(`${BACKEND_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json" 
        },
        body: JSON.stringify({
          email,
          password 
        })
      })
  }, [])

  return <h1>Hello, NextJs</h1>
}
