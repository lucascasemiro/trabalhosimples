const express =  require("express")
const app = express();
const path =  require("path")

app.post('/pg', (req, res) =>{
    const dados = req.body
    res.send('<h1>pg</h1>')
    })
    app.put('/pg:id', (req, res) =>{
        res.send(req.params.id)
        res.send('<h1>att</h1>')
        })
        app.get('/', (req, res) =>{
            res.sendFile(path.join(__dirname, 'index.html'))
            })
app.listen(4000)
