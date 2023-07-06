var axios = require ('axios');
var fs = require ('fs');
var pokemon = JSON.parse(fs.readFileSync('./Database/pokemon.json'));

function updatePokemonDatabase(){
    fs.writeFileSync('./Database/pokemon.json', JSON.stringify(pokemon))
}

module.exports = function(fastify, opts, next){

    fastify.get('/pokemon/load', async (request, reply) => {
        reply.type('application/json').code(200)

        var urlRequest = "https://pokeapi.co/api/v2/pokemon/";
        var response = await axios.get(urlRequest);
        var pokemonList = response.data.results;
        
        
        for(var index = 0; index < pokemonList.length; index++){
            
            var urlResults = await axios.get(pokemonList[index].url);
            var pokemonType = urlResults.data.types[0].type.name;

            var newPokemon = {
                name: pokemonList[index].name,
                id: pokemon.length + 1,
                type: pokemonType,
            };

            pokemon.push(newPokemon);

        }

        updatePokemonDatabase();

        return pokemon
    })

    fastify.get('/pokemon', async (request, reply) => {
        reply.type('application/json').code(200)
        return pokemon;
    })

    fastify.get('/pokemon/type/:value', async (request, reply) => {
        reply.type('application/json').code(200)

        var pokemonValue = request.params.value;
        var pokemonType = [];

        for(var index = 0; index < pokemon.length; index++){
            if(pokemon[index].type.toLowerCase() == pokemonValue.toLowerCase()){
                //pokemonType = pokemon.filter(pokemon => pokemon.type.toLowerCase() === pokemonValue.toLowerCase());
                pokemonType.push(pokemon[index]);
                console.log(pokemonType);
            }
        }

        return pokemonType;
    })

    fastify.get('/pokemon/:id', async (request, reply) => {
        reply.type('application/json').code(200)

        var pokemonId = request.params.id;
        var findPokemon = {};

        for(var index = 0; index < pokemon.length;  index++){
            if(pokemon[index].id == pokemonId){
                findPokemon = pokemon[index]
            }
        }

        return findPokemon
    })

    fastify.delete('/pokemon/:id', async (request, reply) => {
        reply.type('application/json').code(200)

        var pokemonId = request.params.id;

        for(var index = 0; index < pokemon.length;  index++){
            if(pokemon[index].id == pokemonId){
                pokemon.splice(index, 1)
            }
        }

        updatePokemonDatabase();

        return pokemon
    })

    fastify.post('/pokemon', async (request, reply) => {
        reply.type('application/json').code(200)

        var newPokemon = {
            name: request.body.name,
            id: pokemon.length + 1,
            type: request.body.type,
        };

        pokemon.push(newPokemon);

        updatePokemonDatabase();
        
        return pokemon;
    })

    fastify.put('/pokemon/:id', async (request, reply) => {
        reply.type('application/json').code(200)

        var pokemonId = request.params.id;
        // var attPokemon = {
        //     name: request.body.name,
        //     id: Number(pokemonId),
        //     type: request.body.type,
        // }

        for(var index = 0; index < pokemon.length; index++){
            if(pokemon[index].id == pokemonId){
                //pokemon.splice(index, 1, attPokemon)
                pokemon[index].name = request.body.name;
                pokemon[index].type = request.body.type;
            }
        }

        updatePokemonDatabase();

        return pokemon;
    })

    next();
}