import express from 'express'
// import nanoid from 'nanoid'
import path from 'path'
const __dirname = path.resolve()
import authRouter from './routes/auth.mjs'
import postRouter from './routes/post.mjs'


const app = express()
app.use(express.json())

app.use('/api/v1', authRouter)

app.use((req,res,next)=>{
    let token = 'valid'
    if(token === 'valid'){
        next()
    }else{
        res.send({message: 'invalid token'})
    }
})
app.use('/api/v1', postRouter)

app.use(express.static(path.join(__dirname, 'public')))

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})
