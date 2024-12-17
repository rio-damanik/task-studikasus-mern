const mongoose = require('mongoose');
const { model, Schema } = mongoose;

const categorySchema = new Schema({
    name: {
        type: String,
        minlength: [3, 'Panjang nama kategori minimal 3 karakter'],
        maxlength: [20, 'Panjang nama kategori maksimal 20 karakter'],
        required: [true, 'Nama kategori harus diisi']
    },
    tags: [{
        type: Schema.Types.ObjectId,
        ref: 'Tag'
    }]
}, { 
    timestamps: true,
    collection: 'categories' // explicitly set collection name
});

module.exports = model('Category', categorySchema);