const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routerUser = require('./routes/users');


const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true
});


app.get ('/', (req,res) => {
  res.send(`hello world`)
})

app.use(bodyParser.json());
app.use((req, res, next) => {
  req.user = {
    _id: '621bbd7568ca5e28605edd0c',
  };
  next();
});
app.use('/users', routerUser)

// mongoose.connect('mongodb://localhost:27017/mestodb', {
//   useCreateIndex: true,
//   useFindAndModify: false,
// });

app.listen(PORT, () => {
  console.log(`App listening ${PORT}`);
});