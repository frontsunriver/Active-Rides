const PAYSTACK_PUBLIC_KEY = "pk_live_ecba2b96d1ee56d5e3c819ce86e3c22f2361f6a7";
const PAYSTACK_SECRET_KEY = "sk_live_bfe01f969ffdc14ed5d638810988e1b591e2957d";

var paystack = require('paystack')(PAYSTACK_SECRET_KEY);
const templateLib = require('./template');

module.exports.render_checkout = function (request, response) {

    var order_id = request.body.order_id;
    var email = request.body.email;
    var amount = request.body.amount;

    response.send(templateLib.getTemplate(
        PAYSTACK_PUBLIC_KEY,
        order_id,
        email,
        amount
    ));
};

module.exports.process_checkout = function (request, response) {
    paystack.transaction.verify(request.query.reference, (error, body) => {
        if(error){
            response.redirect('/cancel');
            return;
        }
        if(body.status){
            let data = body.data;
            if(data.status === 'success'){
                response.redirect("/success?order_id=" + data.metadata.order_id + "&amount=" + parseFloat(data.amount/100) + "&transaction_id=" + data.reference);
            }else{
                response.redirect('/cancel');
            }
        }else{
            response.redirect('/cancel');
        }
    });
};