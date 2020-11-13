require('dotenv').config()
const mongoose = require('mongoose')
mongoose.connect(`mongodb://localhost:27017/noderest`, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false  })
    .then(res => console.log('Conected to Database..'))
    .catch(error => console.log('error ->', error.message));   

mongoose.Promise = global.Promise

module.exports = mongoose