import express from 'express'
import axios from 'axios'
import dotenv from 'dotenv'
import rateLimit from 'express-rate-limit'
import cors from 'cors'



dotenv.config()


const app = express()

//const wake = process.env.WAKE_URL

const port = process.env.PORT



const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 10
})

const services = [
  "https://e-commerce-u97s.onrender.com/health", 
  "https://wallet-mobile.onrender.com/health"
]


app.use(cors({
  origin: "*"
}))




app.get('/wake', async(req, res) => {
  

  try {
    const result = await Promise.allSettled(
      services.map(async (url) => {
        const start = Date.now()
        await axios.get(url, { timeout: 80000 })
        return { url, time: Date.now() - start }
      }
      )
    )
    const response = result.map((result, index) => ({
      service: services[index],
      status: result.status === "fulfilled" ? "connected" : "not-connected",
      responseTime: result.status === "fulfilled" ? `${result.value.time}ms` : null
    }))
    console.log("res", response)

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
  console.log("ping service running ", `on port ${port}`)
})



