import express from "express"

const app = express()
const handleListener = () => console.log(`Listening on http://localhost:3000`)
app.listen(3000, handleListener)
