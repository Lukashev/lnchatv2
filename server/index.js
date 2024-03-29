import 'module-alias/register'
import express from 'express'
import logger from 'morgan'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import http from 'http'
import SocketIO from 'socket.io'
import socketAuth from './utils/socketAuth'
import apiRouter from '@root/api'
import SocketListener from '@root/stateful'
import './db'

const app = express()
const server = http.Server(app)
const io = SocketIO(server)

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(express.static(__dirname + '/build'))

app.use(logger('dev', { skip: () => process.env.NODE_ENV === 'production' }))
app.use('/api', apiRouter)
app.use('*', (req, res) => {
  res.sendFile(`${__dirname}/build/index.html`)
})

io.use(socketAuth())

export const socketListener = new SocketListener(io)

server.listen(process.env.PORT || 5000, () => {
  console.log('Server is running')
})
