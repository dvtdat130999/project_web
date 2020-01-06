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
        cancel: cancel,
        confirm: orderOnDB.confirm
    };

    return newOrder;
}

exports.getAllOrdersConfirmOfShop = async (idShop) =>{
    const ordersOnDB = await order.find({confirm: 2, idShop: idShop});
    const orders = [];

    for (const element of ordersOnDB) {
        const newOrder = element;
        newOrder.urlDetail = "/order?id=" + newOrder.id;
        orders.push(newOrder);
    }
    return orders;
}

exports.getAllOrdersNotConfirmOfShop = async (idShop) =>{
    const ordersOnDB = await order.find({confirm: 0, idShop: idShop});
    const orders = [];

    for (const element of ordersOnDB) {
        const newOrder = element;
        newOrder.urlDetail = "/order?id=" + newOrder.id;
        orders.push(newOrder);
    }
    return orders;
}

exports.AcceptOrder = async (idProduct) =>{
    const orderOnDB = await order.findOne({_id: idProduct});
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

        orderOnDB.confirm = 2;

        orderOnDB.save();

        return true;
    }
    else{
        return false;
    }
};