const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

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

var client = new catalog_proto.v1.CatalogService('localhost:5009', grpc.credentials.createInsecure());
var order_client = new order_proto.v1.OrderService('localhost:5009', grpc.credentials.createInsecure());

order_client.GetOrders({
   id: '02938019093128'
}, function(error, result){
   if(error){
      return console.error(error);
   }

   console.log(result);
});

/*order_client.CreateOrder({
   vendor: 'BUKALAPAK',
   id: '02938019093128',
   pembeli: {
      nama: 'saya',
      telepon: '09934834',
      alamat: 'rumah',
      email: 'saya@rumah.saya'
   },
   barang: {
      vendor: 'BUKALAPAK',
      id: '5be1559fc089512b003a0763',
      produk: 'Ready Stock Antena Tv Toyosaki Aio 220 . Kabel 10 M Indoor . Outdoor Luar Dalam -Jb 1800',
      gambar: 'https://s2.bukalapak.com/img/7414485083/s-194-194/Ready_Stock_Antena_Tv_Toyosaki_Aio_220__Kabel_10_M_Indoor__O.jpg',
      harga: 127000,
      kategori: 'Komponen Elektronik, dan Barang Alat Elektronik',
      link: '' 
   },
   kuantitas: 1,
   status: 'proses',
   created_at: Date.now()
}, function(err, response){
   if(err){
      return console.log(err);
   }

   console.log(response);
});*/

/*client.GetByCategory('elektronik', function(error, response){
   if(error){
      return console.log(error);
   }
   console.log(response);
});*/