const express = require('express');
const bodyParser = require('body-parser');

const userRoute = require('./routes/userRotes');

const app = express();
const port = 4000;

app.use(bodyParser.urlencoded({ extended: false })); // urlencoded, são os dados enviados via formulário no body(x-www-form-urlencoded)

userRoute(app);

app.get('/', (req, res) => {
  res.send('Olá mundo pelo Express!') 
});

app.listen(port, () => {
  console.log('API rodando na porta 4000.')
});