if(process.env.NODE_ENV==='production'){
    module.exports = require('./prod')
}
else{
    module.exports = require('./dev')
}
/* if we are on the production side then we'll export the production file else we'll export development file
signifying we're on the development side */