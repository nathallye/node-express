# Node.js com Express

## Node.js

### Origem do Node.js
- Criado em 2009 por Ryan Dahl;
- Combina a máquina virtual JavaScript V8, Event Loop e a libuV;
- Usa o JavaScript como linguagem de programação;
- É guiado a eventos (Event Driven);
- V8(engenharia por trás do Google Chrome) + libuv = Node.js .

### Características
- É um ambiente de servidor de código aberto;
- Gratuíto para uso;
- É executado em várias plataformas (Windows, Linux, Unix, Mac OS X, etc.);
- É JavaScript no servidor;
- Event Loop (Loop de Eventos);
- Assincronicidade (não espera um execução terminar para iniciar a da proxima requisição);
- Processos de I/O não bloqueante;
- Alta performance (quando bem estruturado).

### Event Loop
<img width="" src="/img/1.jpg"/>
Nada mais é do que ele escutar os eventos do servidor node.

**Ex.:** ele recebe uma requisição GET via HTTP, para listar os usuários. Então, essa requisição vai ter uma função dentro do node.js que vai registrar um **callback**, que nada mais é que uma função que vai ser chamada quando esse processo for concluído. Então, o **envent loop** vai jogar esse processo lá a stack/fila de execução. A **libuV** vai ser responsável por fazer essa comunicação entre o banco de dados, para poder listar os usuários e responder essa requisição. Mas, depois que o **envent loop** joga esse processamento para a fila, ele já fica disponivel para receber uma próxima requisição.

### Instalando o Node.js
Para obter a versão distro-estável do Node.js, utilize o gerenciador de pacotes apt. Primeiramente, atualize seu índice de pacotes local:

```
sudo apt update
```

Então, instale o pacote Node.js dos repositórios:

```
sudo apt install nodejs
```

Para verificar qual versão do Node.js você tem instalada após esses passos iniciais, digite:

```
nodejs -v
```

Verificando se o Node.js está rodando direitinho na nossa máquina. 

1° Vamos criar um arquivo **_index.js_** e colar o script:

```JavaScript
console.log('Rodando o node.js...')
```

2° No terminal:

```
node index.js

Retorno => Rodando o node.js...
```

## Express

### O que é o Express?
- Framework web minimalista e rápido para Node.js(desenvolvido para criarmos APIs de maneira fácil);
- Fornece uma estrutura e conjunto de recursos robustos para aplicações Web e mobile;
- Dispõe de métodos utilitários HTTP e middlewares para criar uma API rápida e segura.

### Criando uma API com Express
#### Instalando o Express no projeto
Dentro da pasta do projeto, no terminal vamos iniciar o projeto:

```
npm init
```

Ou para forçar a inicialização do projeto com as configurações padrão:

```
npm init -y
```

Em seguida, podemos instalar o Express rodando o comando a seguir:

```
npm install express --save
```

- O **--save** significa que queremos adicionar a referência dessa dependência no arquivo **package.json**(arquivo que gerência as dependências do projeto).

- Devem ser criados:
A Pasta: **_node_modules_**(que instala todas as bibliotecas que express tem como dependência);
Os Arquivos: **_package-lock.json_**(que possui os arquivos do projeto) e **_package.json_**(arquivo que gerência as dependências do projeto).

Verificando se o Express está rodando direitinho no nosso projeto. 

No arquivo **_index.js_** vamos colar o script:

```JavaScript
const express = require('express');
const app = express();
const port = 4000;

app.listen(port, () => {
  console.log('API rodando na porta 3000.')
});
```
- A primeira linha do script faz a **requisição do express** para ficar disponivel no projeto e **armazena em uma constante**;
- A segunda linha pega a **função express** para criar a **constante app**;
- A terceira linha do script diz respeito a constante que armazena o número da porta que vai ser rodada a aplicação;
- A quarta linha é a função app.listen, onde recebe como argumento o número da port e uma função callback que vai informar quando a api está pronta para ser usada.

#### Criando a primeira rota da API 
Dentro do arquivo **_index.js_** vamos implementar a primeira rota, que vai cair na tela principal da aplicação(http://localhost:4000).

```JavaScript
// rota GET
app.get('/', (req, res) => {
  res.send('Olá mundo pelo Express!') 
});
```
- **/** : root da url da aplicação;
- **req**, **res**: parâmetros da requisição, **req** tem os dados da requisição e o **res** é responsável por resolver/responder a requisição;
- **send**: envia uma mensagem.

#### Criando rotas para usuários da API
Vamos criar uma pasta chamada **routes**. Dentro dela vamos criar um arquivo chamado **_userRoutes.js_**.

Dentro do arquivo **_index.js_** vamos importar esse arquivo de rotas de usuários:

```JavaScript
const userRoute = require('./routes/userRotes');
```
##### Simulando interação com o BD
Vamos usar um módulo nativo do node.js chamado **fs** para trabalharmos com file sisten(arquivo sistema).
Vamos usar o **join** do **path** que vai nos auxiliar com pastas de arquivos/caminhos de diretórios.
Na linha 3 no código, vamos informar um caminho para o arquivo json que vai ser criado para simular a interação com BD. No lugar de criarmos um Banco de Dados agora, vamos criar um arquivo json que vai armazenar os usuários(dados) da API.

``` JavaScript
const fs = require('fs');
const { join } = require('path');

const filePath = join(__dirname, 'users.json'); 
//              join([nome_diretorio], [nome_do_arquivo])
```

Em seguida, vamos criar dois métodos para buscar esses usuários do arquivo e salvar(simulação de GET e POST).

Vamos criar um método **getUsers**, vai ser a função para listar os usuários existentes:

``` JavaScript
const getUsers = () => {
  const data = fs.existsSync(filePath) // existsSync: verifica se o arquico existe;
    ? fs.readFileSync(filePath) // se o arquivo existir, o arquivo vai ser lido de forma assíncrona(pois precisamos esperar que os dados retornem, para poder listar os usuários);
    : [] // senão, vai ser retornado um array vazio;
    
    try { // try catch para tratar qualquer erro que ocorra durante o processo;
      return JSON.parse(data) // se der tudo ok vai retornar um JSON com um parse desses dados(O método JSON.parse() analisa uma string JSON, construindo o valor ou um objeto JavaScript descrito pela string).
    } catch (error) {
      return []
    }
}
```

Vamos criar um método **saveUsers**, vai ser a função para salvar os usuários criados:

``` JavaScript
const saveUser = (users) => fs.writeFileSync(filePath, JSON.stringify(users, null, '\t')) 
// (users): vai receber como parâmetro os dados do usuário; writeFileSync: vai escrever de forma assíncrona no arquivo; JSON: em seguida vai transformar em JSON; e adicionar uma tabulação "\t" para deixar o arquivo mais legível.
```

##### GET
Por fim, vamos criar a função **useRoute** para definirmos as rotas:

``` JavaScript
const userRoute = (app) => { // app: a própria aplicação vai ser passada como dependencia;
  app.route('/users/:id?') // essa rota vai cuidar de todas as requições feita pata users(post, get, put, delete); :id? recebe como parâmetro opcional o id, pois quando quisermos atualizar ou deletar um usuário vamos precisar. 

    // GET localhost:4000/users
    .get((req, res) => {
      const users = getUsers() // ler do método getUsers, ou seja, busca os usuários do BD e retorna os dados em json;

      res.send({ users }) // e retorna para a aplicação/usuário que está fazendo essa requisição um objeto com os users.
    })
};

module.exports = userRoute; // exportar para usarmos externamente
```

Podemos testar a primeira rota criada (GET localhost:4000/users).

No arquivo **_index.js_** já conseguimos acessar essa função, tendo em vista que ela foi exportada no final do arquivo anteriormente.
Vamos usar a função e passar como dependência a app (que é a aplicação express, passada como injeção de dependência para essa rota):

``` JavaScript
userRoute(app);
```
###### Levantando o servidor
Para levantar o servidor, no terminal vamos rodar o comando:
```
node index.js
```

_Nodemon_

Para não precisarmos reiniciar o servidor a cada alteração feita, podemos usar o _nodemon_, ele reinicia o server automaticamente toda vez que salamos uma alteração no arquivo.

Vamos baixar e salva-lo como uma dependência do nosso projeto no ambiente de desenvolvimento:

```
sudo npm install nodemon --save -dev
```

Para rodar o server com o nodemon:

```
npx nodemon index.js
```

Podemos também colocar esse script dentro de package.json, no campo **scripts**:

``` JSON
// [...]
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "npx nodemon index.js"
  },
// [...]
```

Com isso, para iniciar o servidor só vamos precisar usar o comando no terminal:

```
npm start
```

###### Testando a requisição via Postman

Com isso, já conseguimos testar a requisição HTTP GET via Postman.

```
GET http://localhost:4000/users

Retorno => 
{
  "users": []
}
```

##### POST
Primeiramente, para transformar os dados que vem no corpo da requisição HTTP em objeto/JSON é necessário instalar um middleware para o express.

No arquivo **_index.js_** vamos importar o body-parse para o projeto:

``` JavaScript
const bodyParser = require('body-parser');
```

E informar ao node.js que vamos usar esse middleware para transformar o dado do post em um objeto:

``` JavaScript
app.use(bodyParser.urlencoded({ extended: false })); // urlencoded, são os dados enviados via formulário no body(x-www-form-urlencoded)
```

Agora, podemos criar a nossa rota com tranquilidade, sabendo que esse dado vai ser devidamente convertido na requisição.

Ainda na função userRoute:

``` JavaScript
const userRoute = (app) => { 
  app.route('/users/:id?')  

    // GET localhost:4000/users
    .get((req, res) => {
      // [...]
    })

    // POST localhost:4000/users
    .post((req, res) => {
      const users = getUsers()

      users.push(req.body) // vamos pegar esse objeto, que é um array de usuários e da push para inserir o corpo da requisição(que nada mais é que esse novo usuário);
      saveUser(users) // em seguida chamamos o método saveUser, que vai atualizar esse arquivo do BD;

      res.status(201).json(req.body) // resposta com o status code 201 Created
    })
};

module.exports = userRoute; 
```

Agora, vamos testar a requisição HTTP POST via Postman.

```
POST http://localhost:4000/users

body -> x-www-form-urlencoded

key   value
name  joão
id    1
```

##### PUT

Ainda na função userRoute:

``` JavaScript
const userRoute = (app) => { 
  app.route('/users/:id?')  

    // GET localhost:4000/users
    .get((req, res) => {
      // [...]
    })

    // POST localhost:4000/users
    .post((req, res) => {
      // [...]
    })

    // PUT localhost:4000/users/1
    .put((req, res) => {
      const users = getUsers();

      saveUser(users.map(user => { //vamos usar o map para ciar um novo objeto com as alterações;
        if (user.id === req.params.id) { // se o id do usuário for igual ao passado no parâmetro da requisição
          return { // retorna um objeto com o usuário atual, mesclando com os novos dados passados no body
            ...user, // operador Spread, permite que expressões expandam o conteúdo
            ...req.body
          }
        }
        return user // se não, só retorna o usuário atual
      }))

      res.status(200).send('OK')
    })
};

module.exports = userRoute; 
```

Agora, vamos testar a requisição HTTP PUT via Postman.

```
PUT http://localhost:4000/users/1

body -> x-www-form-urlencoded

key   value
name  João Paulo da Silva

retorno =>
OK
```

##### DELETE

Ainda na função userRoute:

``` JavaScript
const userRoute = (app) => { 
  app.route('/users/:id?')  

    // GET localhost:4000/users
    .get((req, res) => {
      // [...]
    })

    // POST localhost:4000/users
    .post((req, res) => {
      // [...]
    })

    // PUT localhost:4000/users/1
    .put((req, res) => {
      // [...]
    })

    // DELETE localhost:4000/users/1
    .delete((req, res) => {
      const users = getUsers()

      saveUser(users.filter(user => user.id !== req.params.id)) // o filter vai filtar todos os usuários diferentes do id do usuário passado na requisição, ou seja, vai salvar todos menos o que foi mandado na requisição. Excluindo-o.

      res.status(200).send('OK')
    })

};

module.exports = userRoute; 
```

Agora, vamos testar a requisição HTTP DELETE via Postman.

```
DELETE http://localhost:4000/users/1

retorno =>
OK
```

#### Adicionando validação de Input de dados

##### Criando o schema

Não interessa se você estamos salvando os dados em um arquivo de texto, no MongoDB ou em um banco relacional como MySQL, vamos querer validar os inputs de dados que o usuário ou cliente da API enviou antes de persisti-los na base.

Para fazer validações vamos usar o pacote **Joi**, um dos mais famosos para este fim na atualidade.

```
npm i joi --save
```

Quando estamos falando de web, é muito comum usar o padrão MVC (Model View Controller) ou alguma arquitetura inspirada nele. Neste padrão, temos uma camada da aplicação, a Model, responsável pela lógica de persistência dos dados, incluindo os schemas de validação.

Sendo assim, vamos **criar uma pasta models** na raiz do projeto e **dentro dela adicionar um arquivo userSchema.js**.

Nesse arquivo userSchema.js vamos importar o **Joi** e adicionar as validações:

``` JavaScript
const Joi = require('joi');

module.exports = Joi.object({
  id: Joi.number()
    .required(),
  name: Joi.string()
    .min(3)
    .required(),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
});
```

Este módulo de validação retorna um objeto userSchema que usaremos em nossa rota da web API para validar a entrada de dados de usuários.

##### Criando o middleware

Agora que temos tudo configurado e criado, basta a gente adicionar a validação na nossa rota de POST e UPDATE.

A rota POST espera no request.body os dados do usuário a ser salvo no banco de dados. Mas antes de executar o callback do POST, vamos adicionar uma chamada ao nosso userSchema, para ele validar o body da requisição usando um middleware Express. Middlewares no Express são como se fossem camadas intermediárias de processamento da requisição HTTP, ou seja, ao invés de um único callback para tratar request e response, nós dividimos a responsabilidade com outras funções para aumentar o reuso, diminuir a complexidade e aumentar a facilidade de manutenção.

Vamos abrir o **routes/userRoutes.js** e além de adicionar mais um require ao userSchema, vamos adicionar o middleware abaixo.

``` JavaScript
const userSchema = require('../models/userSchema');

const validationMiddleware = (request, response, next) => { //Middleware para validação dos dados
  const { error } = userSchema.validate(request.body)
  const valid = error == null; 
 
  if (valid) { 
    next(); 
  } else { 
    const { details } = error; 
    const message = details.map(i => i.message).join(',');
 
    console.log("error", message); 
    response.status(422).json({ error: message })
  } 
}
```
Este middleware utiliza o userSchema para validar a request.body e se veio um erro, coleta e formata os detalhes, imprime no console e devolve em uma resposta HTTP 422 (uma especialização do 400 Bad Request que sinaliza Unprocessable Entity, que é o caso aqui).

Para usar este middleware é muito simples, na rota POST deste mesmo routes/users.js, adicione o nome do middleware antes do callback tradicional.

``` JavaScript
.post(validationMiddleware, (req, res) => {
      const users = getUsers()

      users.push(req.body) 
      saveUser(users) 

      res.status(201).json(req.body)
    })
```

## Desenvolvendo Ferramentas de Linha de Comando em Node.js


### O que é uma CLI?

- Ferramenta que disponibiliza uma interface de linha de comando para executar tarefas no terminal;
- Normalmente são criadas através de Shell Script;
- Automatiza uma tarefa através de um arquivo executável;
- Pode ser facilmente distribuído em várias plataformas.

### Por que criar uma CLI em Node.js?

- A popularidade do Node.js se dá ao rico ecossistema de pacotes;
- Mais de 900.000 pacotes registrados no NPM;
- CLIS podem ser facilmente distribuídas e consumidas em múltiplas plataformas;
- Explorar o ecossistema, incluindo sua grande quantidade de pacotes focados em CLI.

## Criação de templates com Pug

### O que é o Pug?

- É uma template engine de alta performance;
- Implementado com JavaScript para Node.js e Browsers;
- Conhecido anteriormente como "Jade";
- Pode ser integrado com Express.

### Prós e Contras

#### Prós

- Escrever mais HTML com menos código;
- Código parecido com parágrafos, o que a legibilidade do código e simplifica projetos com vários desenvolvedores;
- Não há fechamento de tags. É usado indentação para identificar aninhamento de tags;
- É possível escrever JavaScript dentro dos templates .pug.

#### Contras
- Espaços em branco importam - e muito! Um mínimo erro de indentação pode trazer grandes problemas para seu código;
- Não é possível usar código HTML de qualquer lugar. É preciso converter para Pug antes de usar.# cli-com-nodejs
