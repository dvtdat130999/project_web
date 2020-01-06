const order = require('../databasemodel/order');
const product = require('../databasemodel/products');
const user = require('../databasemodel/users');
const util = require('util')
const orderService = require('../models/orderService');

exports.getOrder = async (req, res, next) => {
    //Phân quyền, nếu là admin thì sẽ có cách ứng xử khác
    if(req.user.author === 'admin') {
        //Chỉ cho phép admin xem tất cả các order đã xác nhận của tất cả các shop
        //nếu có id thì cho phép xem chi tiết order
        const id = req.query.id;
        if (typeof id === "undefined") {
            const orders = await orderService.getAllOrdersConfirm();
            res.render('bill', {userdata: req.user, orders: orders, active:"order"});
        } else {
            const newOrder = await orderService.getDetailOrder(id);
            res.render('detailOrder', {userdata: req.user, order: newOrder, active:"order"});
        }
    }
    else
    {
        const accept = req.query.accept;
        const confirmOrder = req.query.confirmOrder;

        //Nếu có confirm thì tìm order đã xác nhận
        //Ngược lại, tìm order chưa xác nhận

        if (typeof accept !== "undefined") {
            const result = await orderService.AcceptOrder(accept);

            if(result === true)
            {
                req.flash('success_msg', 'Xác nhận thành công đơn hàng !!');
                if(typeof confirmOrder !== "undefined") {
                    res.redirect('/order?confirmOrder=1');
                }else{
                    res.redirect('/order');
                }

            }
            else{
                res.writeHead(200);
                res.end("Khong du hang hoa");
            }
        } else {
            //Nếu có id thì xem chi tiết đơn hàng
            if(typeof confirmOrder !== "undefined"){
                let orders;
                if(confirmOrder == "1")
                {
                    orders = await orderService.getAllOrdersOfShop(req.user.id, 1);
                    res.render('orderDelivery', {userdata: req.user, orders: orders, active:"order"});
                }
                else
                {
                    orders = await orderService.getAllOrdersOfShop(req.user.id, 2);
                    res.render('bill', {userdata: req.user, orders: orders, active:"order"});
                }


            }
            else
            {
                const id = req.query.id;

                if (typeof id === "undefined") {
                    const orders = await orderService.getAllOrdersOfShop(req.user.id, 0);
                    res.render('order', {userdata: req.user, orders: orders, active:"order"});
                } else {
                    const newOrder = await orderService.getDetailOrder(id);
                    res.render('detailOrder', {userdata: req.user, order: newOrder, active:"order"});
                }
            }
        }
    }
};