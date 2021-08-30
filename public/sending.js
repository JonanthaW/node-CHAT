var socket = io.connect();

document.querySelector("#chat").addEventListener("submit", (e) => {
  e.preventDefault();
  socket.emit("enviar mensagem", document.querySelector("#texto_mensagem").value);
  document.querySelector("#texto_mensagem").value = "";
})

socket.on("atualizar mensagem", mensagem => {
  let mensagem_formatada = document.createElement('p');

  mensagem_formatada.textContent = mensagem;
  document.querySelector("#historico_mensagens").append(mensagem_formatada);
});


document.querySelector("#login").addEventListener("submit", (watcher) => {
      watcher.preventDefault();

      socket.emit("entrar", document.querySelector("#apelido").value, valido => {
        if (valido) {
          document.querySelector("#acesso_usuario").style.display = "none";
          document.querySelector("#sala_chat").style.display = "block";

        }
        else {
          document.querySelector("#acesso_usuario").value = "";
          alert("Já existe um usuário com este nickname.");
        }
      })
})

socket.on("entrou chat", quem_logou => {
  let entries = ["acabou de se conectar!", "chegou no esqueminha!", "deu as caras de novo!", "veio cobrar o aluguel!"];
  let mensagem_join = document.createElement("h2");

  mensagem_join.textContent = `${quem_logou} ${entries[Math.floor(Math.random() * entries.length)]}`;
  document.querySelector("#historico_mensagens").appendChild(mensagem_join);
})

socket.on("saiu chat", quem_saiu => {
  let entries = ["foi respirar um pouco!", "acabou de se desconectar!", "foi comprar pão!", "veio mas já se foi!"];
  let mensagem_left = document.createElement("h3");
  mensagem_left.textContent = `${quem_saiu} ${entries[Math.floor(Math.random() * entries.length)]}`;
  document.querySelector("#historico_mensagens").appendChild(mensagem_left);
})

socket.on("atualizar usuarios", function(usuarios){
document.querySelector("#lista_usuarios").innerText = "";
   for (indice of usuarios) {
        var opcao_usuario = document.createElement("option");
        opcao_usuario.innerText = indice;
        document.querySelector("#lista_usuarios").appendChild(opcao_usuario);
    };
});
