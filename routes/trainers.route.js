var fs = require ('fs');
const { stringify } = require('querystring');
var trainers = JSON.parse(fs.readFileSync('./Database/trainers.json'));

function firstPokemon(){

    var randomIndexPokemon = -1;

    var initialPokemon = [{
        name: "Charmander",
        type: "Fire",
        id: 1
    }, 
    {
        name: "Bulbasaur",
        type: "Grass",
        id: 1
    },
    {
        name:  "Squirtle",
        type: "Water",
        id: 1
    }
    ]

    randomIndexPokemon = Math.floor(Math.random() * initialPokemon.length);

    return initialPokemon[randomIndexPokemon]
}

function updateTrainersDatabase(){
    fs.writeFileSync('./Database/trainers.json', JSON.stringify(trainers))
}

module.exports = function(fastify, opts, next){

    fastify.get('/trainers', async (request, reply) => {
        reply.type('application/json').code(200)

        updateTrainersDatabase();

        return trainers
    })

    fastify.get('/trainers/:id', async (request, reply) => {
        reply.type('application/json').code(200)

        var trainerId = request.params.id;
        var findTrainer = {};

        for(var index = 0; index < trainers.length;  index++){
            if(trainers[index].id == trainerId){
                findTrainer = trainers[index]
            }
        }

        return findTrainer
    })

    fastify.post('/trainers', async (request, reply) => {
        reply.type('application/json').code(200)

        var randomPokemon = firstPokemon();
        var newTrainers = {
            name: request.body.trainer,
            id: trainers.length + 1,
            number: request.body.number,
            pokeball: []
        };
               
        for(var index = 0; index < trainers.length; index++){  

            if(trainers[index].number == newTrainers.number){
                reply.type('application/json').code(400)
                return {
                    error: "Este usuário já foi cadastrado"
                }
            }
        }

        newTrainers.pokeball = [randomPokemon]
        trainers.push(newTrainers);
        updateTrainersDatabase();

        return trainers
    })

    //////////////////////////////////////////////////////////////////////////

    fastify.post('/trainers/:id/pokedex', async (request, reply) => {
        reply.type('application/json').code(200)

        var trainerId = request.params.id;
        var pokeball = [];
        var pokedballLimit = 7;
        var newPokemonInPokedex = {
            name: request.body.pokemon,
            type: request.body.type
        };
        
        for(var index = 0; index < trainers.length; index++){

            if(trainers[index].id == trainerId){ 
                
                if(trainers[index].pokeball.length == pokedballLimit){
                    reply.type('application/json').code(400)
                    return {
                        error: "Sua Pokedex esta cheia"
                    }
                }

                pokeball = newPokemonInPokedex;
   
                newPokemonInPokedex.id = trainers[index].pokeball.length + 1;
                
                trainers[index].pokeball.push(newPokemonInPokedex);
                
                pokeball = trainers[index].pokeball;
                
            }
        }

        updateTrainersDatabase();

        return pokeball
    })

    fastify.put('/trainers/:id', async (request, reply) => {
        reply.type('application/json').code(200)

        var trainerId = request.params.id;

        for(var index = 0; index < trainers.length; index++){
            if(trainers[index].id == trainerId){
                trainers[index].name = request.body.name;
                trainers[index].number = request.body.number;
            }
        }

        updateTrainersDatabase();
        return trainers
    })

    fastify.patch('/trainers/:trainerId/pokedex/:pokemonId', async (request, reply) => {
        reply.type('application/json').code(200)

        var trainerId = request.params.trainerId;
        var pokemonId = request.params.pokemonId;
        var pokeball = [];

        trainerIndex = -1;

        for(var index = 0; index < trainers.length; index++){

            if(trainers[index].id == trainerId){

                trainerIndex = index;

            }

        }

        for(var index = 0; index < trainers[trainerIndex].pokeball.length; index++){

            if(trainers[trainerIndex].pokeball[index].id == pokemonId){

                trainers[trainerIndex].pokeball[index].name = request.body.pokemon;
                trainers[trainerIndex].pokeball[index].type = request.body.type;
                
                pokeball = trainers[trainerIndex].pokeball;
            }

        }

        updateTrainersDatabase();
        return pokeball
    })

    next();
}