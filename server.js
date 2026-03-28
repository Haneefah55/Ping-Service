import express from 'express'
import axios from 'axios'
import dotenv from 'dotenv'



dotenv.config()


const app = express()

const wake = process.env.WAKE_URL

const port = process.env.PORT

const axiosInstance = axios.create({
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
  timeout: 120000,
})

const services = [
  "https://e-commerce-u97s.onrender.com/health", 
  "https://wallet-mobile.onrender.com/health"
]

app.get(`/${wake}`, async(req, res) => {
  

  try {
    const result = await Promise.allSettled(
      services.map((url) => axiosInstance.get(url, { timeout: 12000 })
      
    
      )
    )

    

    const response = result.map((result, index) => ({
      service: services[index],
      status: result.status === "fulfilled" ? "connected" : "not-connected"
    }))

    console.log("service running")

    res.json({
      message: "wake-up call sent",
      services: response
    })


  } catch (error) {
    console.log(error)
    res.json({ 
      message: "error sending wake up call",
      error: error.message

    })
  }
})




app.listen(port, () => {
  console.log("ping service running")
})



