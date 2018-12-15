const express = require('express');
const mongoose = require('mongoose');
const body_parser = require('body-parser');

//config
const config = require('./config.json');

mongoose.connect(config.db_uri, function(err){
   if(err){
      return console.log(err);
   }

   console.log('db connected');
});

const order_model = require('./model/order');
const app = express();

const grpc_service = require('./grpc');

grpc_service.start_grpc();

app.set('view engine', 'ejs');
app.use(body_parser.json());

app.get('/', function(req, res, next){
   res.redirect('/order-list');
});

app.get('/order-list', function(req, res, next){
   order_model.find().then(result => {
      var data = {
         list_order: result
      };

      res.render('list-order', data);
   }).catch(error => {
      next(error);
   });
});

app.get('/update-order/:id_order', function(req, res, next){
   var id_order = req.params.id_order;

   order_model.findById(id_order).then(result => {
      var update_status = '';
      if(result.status === ''){
         update_status = 'dikirim';
      }else if(result.status === 'dikirim'){
         update_status = 'diterima';
      }else{
         update_status = 'selesai';
      }

      return order_model.findByIdAndUpdate(id_order, { $set: {status: update_status }});
   }).then(result => {
      res.redirect('/order-list');
   }).catch(error => {
      next(error);
   });
});

app.use(function(err, req, res, next){
   console.error(err);

   res.send(err);
});

app.listen(process.env.PORT || 5010, function(){
   console.log('app ready');
});