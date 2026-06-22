import app from './main.js'

const PORT = process.env.PORT || 3000

app.listen(PORT,'0.0.0.0', () => {
    console.log(`SERVER STARTED ON PORT ${PORT}`)
})







