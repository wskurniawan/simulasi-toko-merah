const mongoose = require('mongoose');

const Schema = mongoose.Schema({ 
   vendor: String,
   id: String,
   pembeli:
   {
      nama: String,
      alamat: String,
      telepon: String,
      email: String
   },
   barang:
   {
      vendor: String,
      id: String,
      produk: String,
      gambar: String,
      harga: Number,
      kategori: String,
      link: String
   },
   kuantitas: Number,
   status: String,
   created_at: String
});

module.exports = mongoose.model('order', Schema);