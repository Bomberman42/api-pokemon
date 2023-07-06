const fastify = require('fastify')({
    logger: true
})

// Registrar as rotas
fastify.register(require('./routes/pokemon.route'));
fastify.register(require('./routes/trainers.route'));

fastify.listen({ port: 3000 }, (err, address) => {
    if (err) throw err
    console.log("Servidor Rodando");
})