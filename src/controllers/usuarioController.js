var usuarioModel = require("../models/usuarioModel");

function autenticar(req, res) {
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;

    if (!email) {
        res.status(400).send("Seu email está undefined!");
        return;
    }
    if (!senha) {
        res.status(400).send("Sua senha está indefinida!");
        return;
    }

    usuarioModel.autenticar(email, senha)
        .then(
            function (resultadoAutenticar) {
                console.log(`\nResultados encontrados: ${resultadoAutenticar.length}`);
                console.log(`Resultados: ${JSON.stringify(resultadoAutenticar)}`); // transforma JSON em String

                if (resultadoAutenticar.length == 1) {
                    console.log(resultadoAutenticar);
                    const usuario = resultadoAutenticar[0];
                    res.json({
                    idUsuario: usuario.idUsuario,      
                    nome: usuario.nome,
                    email: usuario.email
                });
                   
                } else if (resultadoAutenticar.length == 0) {
                    res.status(403).send("Email e/ou senha inválido(s)");
                } else {
                    res.status(403).send("Mais de um usuário com o mesmo login e senha!");
                }
            }
        ).catch(
            function (erro) {
                console.log(erro);
                console.log("\nHouve um erro ao realizar o login! Erro: ", erro.sqlMessage);
                res.status(500).json({erro: "Erro interno ao tentar autenticar"});
            }
        );
}



function cadastrar(req, res) {
    // Crie uma variável que vá recuperar os valores do arquivo cadastro.html

    var nomeCompleto = req.body.nomeCompleto;
    var dtNascimento = req.body.dtNascimento;
    var email = req.body.email;
    var senha = req.body.senha;
    var perfil = req.body.perfil;

    if (!nomeCompleto || !dtNascimento || !perfil || !email || !senha) {
        res.status(400).send("Campos obrigatórios faltando!");
        return;
    }

    if (perfil == "alto") {
        perfil = "Arrojado";
    } else if (perfil == "baixo") {
        perfil = "Conservador"
    } else if (perfil == "moderado") {
        perfil = "Moderado"
    }

    // const perfisValidos = ["Conservador", "Moderado", "Arrojado"];
    // if (!perfisValidos.includes(perfisValidos)) {
    //     res.status(400).send("Perfil inválido! Escolha: Conservador, Moderado ou Arrojado");
    //     return;
    // }

    // Passe os valores como parâmetro e vá para o arquivo usuarioModel.js
    usuarioModel.cadastrar(nomeCompleto, dtNascimento, email, senha, perfil)
        .then(resultado => res.json(resultado))
        .catch(erro => {
            console.log("Erro ao cadastrar: ", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        });
    // .then(
    //     function (resultado) {
    //         res.json(resultado);
    //     }
    // ).catch(
    //     function (erro) {
    //         console.log(erro);
    //         console.log(
    //             "\nHouve um erro ao realizar o cadastro! Erro: ",
    //             erro.sqlMessage
    //         );
    //         res.status(500).json(erro.sqlMessage);
    //     }
    // );

}

function alterar(req, res) {
    var email = req.body.emailServer;
    var novoPerfil = req.body.perfilServer;

    usuarioModel.alterar(novoPerfil, email)
        .then(resultado => res.json(resultado))
        .catch(erro => {
            console.log("Erro ao alterar perfil: ", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        });
}

module.exports = {
    autenticar,
    cadastrar,
    alterar
}