const fs = require('fs');
const { join } = require('path');
const { send } = require('process');

const filePath = join(__dirname, 'users.json'); 

const getUsers = () => {
  const data = fs.existsSync(filePath) // existsSync: verifica se o arquico existe
    ? fs.readFileSync(filePath) // se o arquivo existir, o arquivo vai ser lido de forma assíncrona(pois precisamos esperar que os dados retornem, para poder listar os usuários)
    : [] // senão, vai ser retornado um array vazio
    
    try { // try catch para tratar qualquer erro que ocorra durante o processo
      return JSON.parse(data) // se der tudo ok vai retornar um JSON com um parse desses dados
    } catch (error) {
      return []
    }
};

const saveUser = (users) => fs.writeFileSync(filePath, JSON.stringify(users, null, '\t')) // (users): vai receber como parâmetro os dados do usuário; writeFileSync: vai escrever de forma assíncrona no arquivo; JSON: em seguida vai transformar em JSON; e adicionar uma tabulação "\t" para deixar o arquivo mais legível.

const userRoute = (app) => { // app: a própria aplicação vai ser passada como dependencia 
  app.route('/users/:id?') // essa rota vai cuidar de todas as requições feita pata users(post, get, put, delete); :id? recebe como parâmetro opcional o id, pois quando quisermos atualizar ou deletar um usuário vamos precisar. 

    // GET localhost:4000/users
    .get((req, res) => {
      const users = getUsers() // ler do método getUsers, ou seja, busca os usuários do BD e retorna os dados em json

      res.send({ users }) // e retorna para a aplicação/usuário que está fazendo essa requisição um objeto com os users
    })

    // POST localhost:4000/users
    .post((req, res) => {
      const users = getUsers()

      users.push(req.body) // vamos pegar esse objeto, que é um array de usuários e da push para inserir o corpo da requisição(que nada mais é que esse novo usuário)
      saveUser(users) //em seguida chamamos o método saveUser, que vai atualizar esse arquivo do BD

      res.status(201).send('Created') // resposta com o status code 201 Created
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

    // DELETE localhost:4000/users/1
    .delete((req, res) => {
      const users = getUsers()

      saveUser(users.filter(user => user.id !== req.params.id)) // o filter vai filtar todos os usuários diferentes do id do usuário passado na requisição, ou seja, vai salvar todos menos o que foi mandado na requisição. Excluindo-o.

      res.status(200).send('OK')
    })
    
};

module.exports = userRoute; // exportar para usarmos externamente
