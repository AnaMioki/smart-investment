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
                    email: usuario.email,
                    perfil: usuario.perfil
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

function atualizarDados(req, res) {
    var idUsuario = req.body.idUsuario;
    var novoNome = req.body.novoNome;
    var novoEmail = req.body.novoEmail;
    usuarioModel.atualizarDados(idUsuario, novoNome, novoEmail)
        .then(function (resultado) {
            res.json(resultado);;
        })
        .catch(function (erro) {
            console.log(erro);
            console.log("\nHouve um erro ao atualizar os dados! Erro: ", erro.sqlMessage);
            res.status(500).json({ erro: "Erro interno ao atualizar dados" });
        });
}   

function buscarUsuarios(req, res) {
    usuarioModel.buscarUsuarios()
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            console.log("\nHouve um erro ao buscar usuários! Erro: ", erro.sqlMessage);
            res.status(500).json({ erro: "Erro interno ao buscar usuários" });
        });
}

function excluirUsuario(req, res) {
    var idUsuario = req.params.idUsuario;
    usuarioModel.excluirUsuario(idUsuario)
        .then(function (resultado) {
            res.json(resultado);;
        })
        .catch(function (erro) {
            console.log(erro);
            console.log("\nHouve um erro ao excluir o usuário! Erro: ", erro.sqlMessage);
            res.status(500).json({ erro: "Erro interno ao excluir usuário" });
        });
}

function atualizarPerfil(req, res) {
    var idUsuario = req.body.idUsuario;
    var novoPerfil = req.body.novoPerfil;
    usuarioModel.atualizarPerfil(idUsuario, novoPerfil)
        .then(function (resultado) {
            res.json(resultado);;
        })
        .catch(function (erro) {
            console.log(erro);
            console.log("\nHouve um erro ao atualizar o perfil! Erro: ", erro.sqlMessage);
            res.status(500).json({ erro: "Erro interno ao atualizar perfil" });
        });
}

module.exports = {
    autenticar,
    cadastrar,
    buscarUsuarios,
    excluirUsuario,
    atualizarPerfil,
    atualizarDados
}