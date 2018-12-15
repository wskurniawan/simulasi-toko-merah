const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

// Suggested options for similarity to existing grpc.load behavior
var load_catalog_proto = protoLoader.loadSync(
   './proto/catalog.proto',
   {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true
   });
var catalog_proto = grpc.loadPackageDefinition(load_catalog_proto);

var load_order_proto = protoLoader.loadSync(
   './proto/order.proto',
   {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true
   });
var order_proto = grpc.loadPackageDefinition(load_order_proto);
//var catalog_proto = grpc.load('./proto/catalog.proto');

//model
const item_model = require('./model/item');
const order_model = require('./model/order');

const server = new grpc.Server();

//handler
server.addService(catalog_proto.v1.CatalogService.service, {
   GetCatalog: function(call, callback){
      var keyword = call.request.Keyword;
      var query = { 
         name: {
            $regex: keyword,
            $options: '$i'
         } 
      };
   
      item_model.find(query).then(result => {
         var list_item = [];
         for(index in result){
            var result_item = result[index];
            result_item.price = result_item.price.replace('.', '');
            var item = {
               vendor: 1,
               id: result_item._id,
               produk: result_item.name,
               gambar: result_item.image,
               harga: parseInt(result_item.price),
               kategori: result_item.category,
               link: ''
            }

            list_item.push(item);
         }

         var response = {
            vendor: 1,
            products: list_item
         }

         if(list_item.length > 0){
            callback(null, response);
         }else{
            callback(new Error('not found'));
         }
      }).catch(error => {
         console.error(error);
         callback(error);
      });
   },
   GetByCategory: function(call, callback){
      var keyword = call.request.Keyword;
      var query = { 
         category: {
            $regex: keyword,
            $options: '$i'
         } 
      };
   
      item_model.find(query).then(result => {
         var list_item = [];
         for(index in result){
            var result_item = result[index];
            result_item.price = result_item.price.replace('.', '');
            result_item.price = result_item.price.replace('.', '');
            var item = {
               vendor: 1,
               id: result_item._id,
               produk: result_item.name,
               gambar: result_item.image,
               harga: parseInt(result_item.price),
               kategori: result_item.category,
               link: ''
            }

            list_item.push(item);
         }

         var response = {
            vendor: 1,
            products: list_item
         }

         if(list_item.length > 0){
            callback(null, response);
         }else{
            callback(new Error('not found'));
         }
      }).catch(error => {
         console.error(error);
         callback(error);
      });
   }
});

server.addService(order_proto.v1.OrderService.service, {
   CreateOrder: function(call, callback){
      var order = call.request;
      var id_item = order.barang.id;
      
      item_model.findById(id_item).then(result => {
         order.barang = { vendor: 'BUKALAPAK',
            id: result._id,
            produk: result.name,
            gambar: result.image,
            harga: result.price,
            kategori: result.category,
            link: '' 
         };

         order.barang.harga = order.barang.harga.replace('.', '');
         order.barang.harga = order.barang.harga.replace('.', '');
         order.barang.harga = parseInt(order.barang.harga);

         console.log(order);
         return order_model.create(order);
      }).then(result => {
         console.log(result);
         callback(null, { success: true, code: 0, message: 'order berhasil' });
      }).catch(error => {
         console.error(error);
      });
   },
   GetOrders: function(call, callback){
      const UserId = call.request.id;
      console.log(UserId);
      
      order_model.find({ 'pembeli.email': UserId }).then(result => {
         console.log(result);
         var list_result = result;
         var final_result = [];

         for(index in list_result){
            var result_item = list_result[index];

            var item = {
               vendor: result_item.vendor,
               id: result_item._id,
               pembeli: result_item.pembeli,
               barang: result_item.barang,
               kuantitas: result_item.kuantitas,
               status: result_item.status,
               created_at: result_item.created_at
            }

            final_result.push(item);
         }

         callback(null, {
            orders: final_result
         });
      }).catch(error => {
         console.error(error);
         callback(error);
      });
   }
})

server.bind('0.0.0.0:5009', grpc.ServerCredentials.createInsecure());

module.exports.start_grpc = function(){
   server.start();
   console.log('grpc server started');
}