const order = require('../databasemodel/order');
const product = require('../databasemodel/products');
const user = require('../databasemodel/users');
const util = require('util')

exports.getOrder = async (req, res, next) => {
    const accept = req.query.accept;

    if (typeof accept !== "undefined") {
        const orderOnDB = await order.findOne({_id: accept});
        const productOnDB = await product.findOne({_id: orderOnDB.idProduct});

        if(productOnDB.quantity >= orderOnDB.quantity)
        {
            //Tiến hành cập nhật số lượng sản phẩm
            productOnDB.quantity = productOnDB.quantity - orderOnDB.quantity;
            productOnDB.save();

            //Tạo bill và lưu trên cơ sở dữ liệu
            const dateSale = (new Date()).toString();
            orderOnDB.dateSale = dateSale;
            orderOnDB.confirm = true;

            orderOnDB.save();

            res.redirect('/order');
            /*res.writeHead(200);
            res.end(util.inspect({newBill: newBill}));*/
        }
        else{
            res.writeHead(200);
            res.end("Khong du hang hoa");
        }

    } else {
        const id = req.query.id;

        if (typeof id === "undefined") {
            const ordersOnDB = await order.find({confirm: false, idShop: req.user.id});
            const orders = [];

            for (const element of ordersOnDB) {
                const newOrder = element;
                newOrder.urlDetail = "/order?id=" + newOrder.id;
                orders.push(newOrder);
            }

            /*res.writeHead(200);
            res.end(util.inspect({bill: bill}));*/
            res.render('bill', {userdata: req.user, orders: orders, active:"order"});
        } else {
            const orderOnDB = await order.findOne({_id: id});
            const detailProduct = await product.findOne({_id: orderOnDB.idProduct});

            const detailUser = await user.findOne({_id: orderOnDB.idUser});

            const accept = "/order?accept=" + orderOnDB.id;
            const cancel = "/order?cancel=" + orderOnDB.id;

            const newOrder = {
                thumbnail: detailProduct.thumbnail,
                quantity: orderOnDB.quantity,
                quantityInStoreHouse: detailProduct.quantity,
                nameProduct: detailProduct.name,
                nameUser: detailUser.name,
                addressDelivery: orderOnDB.addressDelivery,
                phoneNumber: detailUser.phone,
                accept: accept,
                cancel: cancel
            };

            res.render('detailOrder', {userdata: req.user, order: newOrder, active:"order"});
        }
    }
}