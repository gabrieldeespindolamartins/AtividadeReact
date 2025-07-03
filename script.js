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

// Middleware para verificar o token // essa parte pra baixo  foi toda copilotada
function verificarToken(req, res, next) {
    const token = req.headers['authorization']; // Obtém o token do cabeçalho Authorization

    if (!token) {
        return res.status(403).json({ erro: "Token não fornecido!" });
    }

    jwt.verify(token, 'secretKey', (err, decoded) => {
        if (err) {
            return res.status(401).json({ erro: "Token inválido!" });
        }

        req.usuario = decoded; // Decodifica o token e armazena os dados no request
        next(); // Passa para o próximo middleware ou rota
    });
}

// Rota GET protegida
app.get('/', verificarToken, (req, res) => {
    res.status(200).json({ mensagem: "Acesso autorizado!", usuario: req.usuario });
});