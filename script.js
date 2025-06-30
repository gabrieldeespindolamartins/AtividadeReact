const express = require('express'); //importando o express
const app = express(); //instanciando o express
const jwt = require('jsonwebtoken'); //importando o jwt
const porta = 3000;


//1 rota get: enviando mensagem em formato json    
app.get('/', (req,res) => {
    res.json({"mensagem": "Bem-vindo a api"})
})

const usuarios = [] //array para armazenar usuarios

//2 rota post: criando cadastro de usuario
app.post('/cadastro', (req, res)=>{
    
    const {nome, email, senha} = req.body //requisição do post

    if(!nome || !email || !senha){//verificando o preenchimento dos campos
        return res.status(401).json({erro: "Preencha todos os campos!"})
    }

    //verificando se o email ja ta inserido
    const emailExis = usuarios.find(usuario => usuario.email === email)
    if(emailExis){
        return res.status(409).json({erro: "email já cadastrado!"})
    }

    const novoUsuario = {id: usuarios.length +1, nome, email, senha} 
    usuarios.push(novoUsuario) //armazenando o usuario no array
})

//3 rota post com token:
app.post('/login', (req, res)=>{

    const {nome, senha} = req.body //requisição do post

    if(!nome || !senha){//verificando o preenchimento dos campos
        return res.status(401).json({erro: "Preencha todos os campos!"})
    }

    // verificando se o usuario e senha estão corretos existem
    if (nome = usuarios.find(usuario => usuario.nome === nome && usuario.senha === senha)){

        const token = jwt.sign(usuario, 'secretKey', {expiresIn: '1h'})//gerando token com jwt
        return res.status(200).json({token})//retornando token

    } else {
        return res.status(400).json({erro: "usuario ou senha incorretos!"})
    }


})