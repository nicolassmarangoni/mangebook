const mongoose = require('mongoose'); // Variável mongoose que irá armazenar a conexão futura com o MongoDB

// Define a estrutura para salvar o produto no banco de dados
const AtivoSchema = new mongoose.Schema({
    // nome, tipo string, required indica que o parâmetro é obrigatório
    nome: {
        type: String,
        required: true
    },
    quantidade: {
        type: Number,
        required: true
    },
    lote: {
        type: Number,
        required: true
    },
    tipo: {
        type: String,
        required: true
    },
    id_ativo: {
        type: String,
        required:true
    }

});

// Exportando o modelo para salvar os ativos
module.exports = mongoose.model('Ativo', AtivoSchema);

