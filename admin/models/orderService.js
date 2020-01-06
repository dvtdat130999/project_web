const order = require('../databasemodel/order');
const product = require('../databasemodel/products');
const user = require('../databasemodel/users');

exports.getAllOrdersConfirm = async () => {
    const ordersOnDB = await order.find({confirm: 2});
    const orders = [];

    for (const element of ordersOnDB) {
        const newOrder = element;
        newOrder.urlDetail = "/order?id=" + newOrder.id;
        orders.push(newOrder);
    }

    return orders;
}

exports.getDetailOrder = async (id) => {
    const orderOnDB = await order.findOne({_id: id});
    const detailProduct = await product.findOne({_id: orderOnDB.idProduct});
    const detailUser = await user.findOne({_id: orderOnDB.idUser});

    let accept;
    if(orderOnDB.confirm == 0)
    {
        accept = "/order?accept=" + orderOnDB.id;
    }
    else
    {
        accept = "/order?accept=" + orderOnDB.id + "&confirmOrder=1";
    }
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
        cancel: cancel,
        confirm: orderOnDB.confirm
    };

    return newOrder;
}

exports.getAllOrdersOfShop = async (idShop, status) =>{
    const ordersOnDB = await order.find({confirm: status, idShop: idShop});
    const orders = [];

    for (const element of ordersOnDB) {
        const newOrder = element;
        newOrder.urlDetail = "/order?id=" + newOrder.id;
        orders.push(newOrder);
    }
    return orders;
}

exports.AcceptOrder = async (idOrder) =>{
    const orderOnDB = await order.findOne({_id: idOrder});
    const productOnDB = await product.findOne({_id: orderOnDB.idProduct});

    if(productOnDB.quantity >= orderOnDB.quantity)
    {
        //Tiến hành cập nhật số lượng sản phẩm
        productOnDB.quantity = productOnDB.quantity - orderOnDB.quantity;
        productOnDB.save();

        //Tạo bill và lưu trên cơ sở dữ liệu
        const dateSale = new Date();
        orderOnDB.daySale = dateSale.getDate();
        orderOnDB.monthSale = dateSale.getMonth() + 1;
        orderOnDB.yearSale = dateSale.getFullYear();

        if(orderOnDB.confirm == 0) {
            orderOnDB.confirm = 1;
        }
        else
        if(orderOnDB.confirm == 1) {
            orderOnDB.confirm = 2;
        }



        orderOnDB.save();

        return true;
    }
    else {
        return false;
    }
};
