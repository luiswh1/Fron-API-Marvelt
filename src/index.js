import axios from 'axios';

class App {
    constructor() {
        this.urlBase = '`https://gateway.marvel.com/v1/public/characters?apikey=4ff772b71991717c8573759b953eedde&hash=22440e3aba8e1547b5a51ebb3243aa05&ts=1611155409`;';

        //this.buscarPersonagens();

        this.atribuirDom();

        
    }

    // Método para centralizar todas as chamadas a API.
    consomeApi(url) {
        return axios.get(url);
    }

    atribuirDom() {
        document.getElementById("pesquisar").onclick = (event) => this.pesquisar();
    }

    pesquisar(){
        const texto = document.getElementById("texto").value; 
        
        this.buscarPersonagens(texto);

    }

    // Buscar dados de personagens.
    buscarPersonagens(texto) {
        // monto a URL para a requisiçao
        let urlRequisicao = `${this.urlBase}personagens`;
        // se veio texto de pesquisa, colocar na URL.
        if (texto) {
            //concatena o texto na url (query params para filtrar)
            urlRequisicao += `?nome=${texto}`;
        }
        
        // mostrar barra de carregamento e esconder a lista
        document.getElementById("loading").style.display = "flex";
        document.getElementById("lista-personagens").style.display = "none";

        //Envia a requisiçao para o Backend e consome a api.
        this.consomeApi(urlRequisicao).then(response => {
            // injetar os dados da lista em CARDS na tela.
            let html = "";
            response.data.results.forEach(p => {
            html += this.cardPersonagem(p);

            });

            document.getElementById("lista-personagens").innerHTML = html;

            // esconder a barra de carregamento e mostrar a lista
            document.getElementById("loading").style.display = "none";
            document.getElementById("lista-personagens").style.display = "flex";

            // atribuir evento ao click de todos os botoes de detalhe
            document.querySelectorAll(".bt-detalhe").forEach((el) => {
                el.onclick = (event) => this.cliqueDetalhe(event);
            });
        });
    }

    cliqueDetalhe(event) {
        const id = event.path[0].dataset.id;

     
        // monto a url para a requisiçao
        let urlRequisicao = `${this.urlBase}personagens/${id}`;

        // Mostra o carregando
        document.getElementById("loading").style.display = "flex";
        
        // Esconder a listagem
        document.getElementById("lista-personagens").style.display = "none";

           // envio a requisiçao para o Backend
           // this.consomeApi(`${this.urlBase}personagens/11111111`)
        this.consomeApi(urlRequisicao).then(response => {
            let html = `<h1>${response.data.results[0].name}</h1>
                <h3>${response.data.results[0].description}</h3>
                <br>
                <br>
                <a class ="btn btn-secondary bt-voltar" role="button">Voltar</a>
            `;

            // injetar o layout na pagina
            document.getElementById('detalhes').innerHTML = html;

            // Esconder o progressor
            document.getElementById("loading").style.display = "none";
            // Mostrar os detalhes no HTML
            document.getElementById("detalhes").style.display = "flex";

            // Interceptar o clique no voltar
            document.querySelector(".bt-voltar").onclick = (event) => {
                document.getElementById("lista-personagens").style.display = "flex";
                document.getElementById("detalhes").style.display = "none";
            }
    });
}
    cardPersonagem(personagem) {
       return `
        <div class="col-lg-4">
        <img src="${personagem.thumbnail.path}.${personagem.thumbnail.extension}" class="bd-placeholder-img rounded-circle" width="140" height="140">


        <h2>${personagem.name}</h2>
        <p>${personagem.description || "Sem Detalhes"}</p>
        <p><a data-id="${personagem.id}" class="btn btn-secondary bt-detalhe" href="#" role="button">View details &raquo;</a></p>
    </div>`
    }
}

new App();
