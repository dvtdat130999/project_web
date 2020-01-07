const product = require('../databasemodel/products');
const Comment=require('../databasemodel/comments');
const Cart=require('../databasemodel/cart');
const Order=require('../databasemodel/order');
const Formidable = require('formidable');
const productService = require('../models/productService');
var async = require('async');

exports.getIndex = async (req, res, next) =>  {
    let products=await product.find();
    let amount= await getAmount(req.user);
    res.render('index', { userdata:req.user, amountItem: amount, productsNew: products });
};

exports.getCart = async (req, res, next) =>{
    const form = new Formidable();
    //console.log("Here");
    form.parse(req, async (err, fields, files) => {
        //console.log("=>");
        let arrayItem=[];
        if (req.user)
        {
            let cart = await productService.getCartOfUser(req.user.username);
            if (typeof cart[0]==="undefined")
            {
                arrayItem=[];
            }
            else
            {
                arrayItem=cart[0].listItem;
            }
        }
        else
        {
            let stringItem=fields.listItem;
            arrayItem=stringItem.split('-');
            arrayItem.shift();     //Loại bỏ phần tử đầu tiên
        }
        let arrayProduct=[];
        let number=[];
        let n=arrayItem.length;
        for (let i=0;i<n;i++)
        {
            let index=CheckExist(arrayItem[i],arrayProduct);
            if (index===-1)
            {
                arrayProduct.push(arrayItem[i]);
                number.push(1);
            }
            else
            {
                number[index]++;
            }
        }

        let listProduct = await getMoreProductByID(arrayProduct);
        //console.log(listProduct);
        let amount= await getAmount(req.user);
        res.render('cart', { userdata:req.user, product_list: listProduct, number: number, amountItem: amount });
    });
};
exports.saveCart=async (req,res,next)=>{
    let arrayItem=[];
    let stringItem=req.body.stringItem;
    arrayItem=stringItem.split('-');
    arrayItem.shift();     //Loại bỏ phần tử đầu tiên

    let username=req.user.username;
    let cart = await productService.getCartOfUser(username);
    //Lưu giỏ hàng
    let idCart=cart[0]._id;
    await Cart.updateOne({ _id: idCart },
        {
            amount: arrayItem.length,
            listItem: arrayItem
        });
    if (req.body.pay==='1')
    {
        res.redirect('/ship');
    }
    else
    {
        res.redirect('/products');
    }
};
exports.getShip = async (req, res, next) =>{
    let amount= await getAmount(req.user);
    res.render('ship', { userdata:req.user, amountItem: amount });
};

exports.getProduct = async (req, res, next) => {
    let page=req.query.page;
    let arr=[];
    let checked_array=[];
    let condition="";
    let numberOfProduct=12;

    //Search product
    let searchContent=req.query.search;
    if (typeof searchContent !== "undefined")
    {
        product.find()
            .exec( async function (err, list_products) {
                if (err) { return next(err); }
                //Successful, so render
                list_products=Search(searchContent,list_products);

                if (typeof page==="undefined"){
                    page="1";
                }
                let index=parseInt(page,10)-1;
                let array2D = pageElementsArr(list_products,numberOfProduct);

                for (i=0;i<array2D.length;i++)
                {
                    arr[i]="";
                }
                arr[index]="class=active";
                if (typeof array2D[index]==="undefined")
                {
                    array2D[index]=[];
                }
                let amount= await getAmount(req.user);
                res.render('products/list', {checked: checked_array, product_list: array2D[index],userdata:req.user, active: arr, condition: condition, search: searchContent, amountItem: amount });
            });
        return;
    }

    //Sort products
    const softby=req.query.sort;
    if (softby==="low")
    {
        product.find()
            .exec(async function (err, list_products) {
                if (err) { return next(err); }
                //Successful, so render
                list_products.sort(function(a,b){
                    return  parseInt(a.price,10)-parseInt(b.price,10);
                });
                if (typeof page==="undefined"){
                    page="1";
                }
                let index=parseInt(page,10)-1;
                let array2D = pageElementsArr(list_products,numberOfProduct);
                for (i=0;i<array2D.length;i++)
                {
                    arr[i]="";
                }
                arr[index]="class=active";
                if (typeof array2D[index]==="undefined")
                {
                    array2D[index]=[];
                }
                condition="&sort=low";
                let amount= await getAmount(req.user);
                res.render('products/list', {checked: checked_array, product_list: array2D[index],userdata:req.user, active: arr, condition: condition, amountItem: amount});
            });
        return;
    }
    else if(softby==="high")
    {
        product.find()
            .exec(async function (err, list_products) {
                if (err) { return next(err); }
                //Successful, so render
                list_products.sort(function(a,b){
                    return parseInt(b.price,10)-parseInt(a.price,10);
                });

                if (typeof page==="undefined"){
                    page="1";
                }
                let index=parseInt(page,10)-1;
                let array2D = pageElementsArr(list_products,numberOfProduct);
                for (i=0;i<array2D.length;i++)
                {
                    arr[i]="";
                }
                arr[index]="class=active";
                if (typeof array2D[index]==="undefined")
                {
                    array2D[index]=[];
                }
                condition="&sort=high";
                let amount= await getAmount(req.user);
                res.render('products/list', {checked: checked_array, product_list: array2D[index],userdata:req.user, active: arr, condition: condition, amountItem: amount  });
            });
        return;
    }

    //product classification
    const category = req.query.category;
    const trademark=req.query.trademark;
    const sex=req.query.sex;
    const color=req.query.color;
    const id = req.query.id;
    if(typeof id !== "undefined")
    {
        //Load comment
        const comment=req.query.comment;

        let result=await productService.getCommentsOfProduct(id);
        let comments=[];
        let n=result.length;
        for (i=0;i<n;i++)
        {
            comments[n-1-i]=result[i];
        }

        if (typeof page==="undefined"){
            page="1";
        }
        let index=parseInt(page,10)-1;
        let array2D = pageElementsArr(comments,10);
        for (i=0;i<array2D.length;i++)
        {
            arr[i]="";
        }
        arr[index]="class=active";
        if (typeof array2D[index]==="undefined")
        {
            array2D[index]=[];
        }
        condition="&id="+id;
        //console.log(array2D);

        productService.getProductById(id)
            .exec( async function (err, list_products) {
                if (err) { return next(err); }
                //Successful, so render
                let type=list_products[0].category;
                //console.log(type);
                let category_Ralated="";
                switch (type)
                {
                    case 1 : {
                        category_Ralated = 'watch';
                        break;
                    }
                    case 2 : {
                        category_Ralated = 'bracelet';
                        break;
                    }
                    case 3 : {
                        category_Ralated = 'ring';
                        break;
                    }
                    case 4 : {
                        category_Ralated = 'necklaced';
                        break;
                    }
                    default : {
                        category_Ralated = 'ring';
                    }
                }
                //console.log(category_Ralated);
                //Lấy các sản phẩm liên quan
                let Array_category_Related=await productService.getProductsByCategory (category_Ralated);
                let amount= await getAmount(req.user);
                res.render('products/productdetail', {checked: checked_array , product_list: list_products ,userdata:req.user, active: arr, condition: condition, comments: array2D[index], amountItem: amount, products_related: Array_category_Related});
            });
        return;
    }
    checked_array=checked(category,trademark,sex,color);

    let Array_category=[];
    let Array_trademark=[];
    let Array_sex=[];
    let Array_color=[];
    if (typeof category!=="undefined")
    {
        Array_category=await productService.getProductsByCategory (category);
        condition+="&category="+category;
    }
    if (typeof trademark!=="undefined")
    {
        Array_trademark=await productService.getProductsByTrademark(trademark);
        condition+="&trademark="+trademark;
    }
    if (typeof sex!=="undefined")
    {
        Array_sex=await productService.getProductsBySex(sex);
        condition+="&sex="+sex;
    }
    if (typeof color!=="undefined")
    {
        Array_color=await productService.getProductsByColor(color);
        condition+="&color"+color;
    }

    let Array=[];
    if (Array_category.length>0)
    {
        Array.push(Array_category);
    }
    if (Array_trademark.length>0)
    {
        Array.push(Array_trademark);
    }
    if (Array_sex.length>0)
    {
        Array.push(Array_sex);
    }
    if (Array_color.length>0)
    {
        Array.push(Array_color);
    }

    if (Array.length>0)
    {
        console.log("len:"+Array.length);
        let result=Array[0];
        for (i=1;i<Array.length;i++)
        {
            result=intersect(result,Array[i]);
        }

        if (typeof page==="undefined"){
            page="1";
        }
        let index=parseInt(page,10)-1;
        let array2D = pageElementsArr(result,numberOfProduct);
        for (i=0;i<array2D.length;i++)
        {
            arr[i]="";
        }
        arr[index]="class=active";
        if (typeof array2D[index]==="undefined")
        {
            array2D[index]=[];
        }
        let amount= await getAmount(req.user);
        res.render('products/list', { checked: checked_array, product_list: result,userdata:req.user, active: arr, condition: condition, amountItem: amount });
    }
    else
    {
        product.find()
            .exec(async function (err, list_products) {
                if (err) { return next(err); }
                //Successful, so render
                if (typeof page==="undefined"){
                    page="1";
                }
                let index=parseInt(page,10)-1;
                let array2D = pageElementsArr(list_products,numberOfProduct);
                for (i=0;i<array2D.length;i++)
                {
                    arr[i]="";
                }
                arr[index]="class=active";
                if (typeof array2D[index]==="undefined")
                {
                    array2D[index]=[];
                }
                let amount= await getAmount(req.user);
                res.render('products/list', {checked: checked_array, product_list: array2D[index],userdata:req.user, active: arr, condition: condition, amountItem: amount });
            });
    }
};

exports.postComment = async (req,res,next)=>{
    let checked_array=[];
    let id=req.query.id;
    if(typeof id !== "undefined")
    {
        const form = new Formidable();
        //console.log("Here");
        form.parse(req, async (err, fields, files) => {
            //console.log("=>"+fields.CommentBox);
            const comment=fields.CommentBox;

            if (typeof comment!=="undefined"){
                let product_id=id;
                const userName=fields.username;
                let time=new Date();
                const newComment=new Comment({product_id,userName,time,content: comment});
                let save = await newComment.save();
            }

            let result=await productService.getCommentsOfProduct(id);
            let comments=[];
            let n=result.length;
            for (i=0;i<n;i++)
            {
                comments[n-1-i]=result[i];
            }

            if (typeof page==="undefined"){
                page="1";
            }
            let index=parseInt(page,10)-1;
            let array2D = pageElementsArr(comments,10);
            let arr=[];
            for (i=0;i<array2D.length;i++)
            {
                arr[i]="";
            }
            arr[index]="class=active";
            if (typeof array2D[index]==="undefined")
            {
                array2D[index]=[];
            }
            condition="&id="+id;
            //console.log(array2D);

            productService.getProductById(id)
                .exec(async function (err, list_products) {
                    if (err) { return next(err); }
                    //Successful, so render
                    let type=list_products[0].category;
                    //console.log(type);
                    let category_Ralated="";
                    switch (type)
                    {
                        case 1 : {
                            category_Ralated = 'watch';
                            break;
                        }
                        case 2 : {
                            category_Ralated = 'bracelet';
                            break;
                        }
                        case 3 : {
                            category_Ralated = 'ring';
                            break;
                        }
                        case 4 : {
                            category_Ralated = 'necklaced';
                            break;
                        }
                        default : {
                            category_Ralated = 'ring';
                        }
                    }
                    //Lấy các sản phẩm liên quan
                    let Array_category_Related=await productService.getProductsByCategory (category_Ralated);
                    let amount= await getAmount(req.user);
                    res.render('products/productdetail', {checked: checked_array , product_list: list_products ,userdata:req.user, active: arr, condition: condition, comments: array2D[index], amountItem: amount, products_related: Array_category_Related});
                });
        });
    }
};

exports.shopping= async (req,res,next)=>{
    //console.log("+===> "+req.body.shopProduct);
    let shopProduct=req.body.shopProduct;
    let amount=parseInt(req.body.shopAmount);
    let username=req.user.username;
    let cart = await productService.getCartOfUser(username);
    //console.log(cart);
    if (cart.length===0)    //Giỏ hàng chưa tồn tại
    {
        let arrayItem=[];
        for (let i=0;i<amount;i++)
        {
            arrayItem.push(shopProduct);
        }
        const newCart=new Cart({user:username, amount: arrayItem.length, listItem: arrayItem});
        await newCart.save();
    }
    else
    {
        //Gộp 2 giỏ hàng.
        let idCart=cart[0]._id;
        let arrayProduct=cart[0].listItem;
        //console.log(arrayProduct);
        for (let i=0;i<amount;i++)
        {
            arrayProduct.push(shopProduct);
        }
        //console.log(arrayProduct);
        await Cart.updateOne({ _id: idCart },
            {
                amount: arrayProduct.length,
                listItem: arrayProduct
            });
    }
};

exports.postStatus = async (req, res, next) =>{
    //Lấy ID người dùng
    let idUser=req.user._id;
    //lấy địa chỉ
    let address=req.body.address+', '+req.body.ward+', '+req.body.district+', '+req.body.city;
    //Lấy ngày hiện tại
    let now=new Date();
    let day=now.getDate();
    let month=now.getMonth()+1;
    let year=now.getFullYear();
    //lấy thông tin cart
    let cart = await productService.getCartOfUser(req.user.username);
    let arrayItem=cart[0].listItem;
    //chuyển thành 2 mảng
    let arrayProduct=[];
    let number=[];
    let n=arrayItem.length;
    for (let i=0;i<n;i++)
    {
        let index=CheckExist(arrayItem[i],arrayProduct);
        if (index===-1)
        {
            arrayProduct.push(arrayItem[i]);
            number.push(1);
        }
        else
        {
            number[index]++;
        }
    }

    let listProduct = await getMoreProductByID(arrayProduct);
    //Mỗi sản phẩm lưu thành 1 order
    for (let i=0; i<listProduct.length;i++)
    {
        let order=new Order({idShop: listProduct[i].idshop, idUser: idUser, idProduct: listProduct[i]._id,
            nameProduct: listProduct[i].name, quantity: number[i], addressDelivery: address, confirm: 0,
            daySale: day, monthSale: month, yearSale: year});
        await order.save();
    }
    //Xóa cart => amount = 0
    await Cart.deleteOne({user: cart[0].user});

    res.redirect('/status');
};

exports.getStatus = async (req,res,next)=>{
    //Lấy tất cả orders của tôi
    let orders=await productService.getAllMyOrder(req.user._id);
    console.log(orders);
    //lấy danh sách sản phẩm tưởng ứng
    let products=[];
    for (let i=0;i<orders.length;i++)
    {
        let product=await productService.getProductById_Wait(orders[i].idProduct);
        products.push(product[0]);
    }

    console.log(products);

    let amount= await getAmount(req.user);
    res.render('status_products', {userdata:req.user, amountItem: amount, orders: orders, products: products});
};

////////////////////////////////////////////////////////////////////////////
//Helper
//Hàm lưu vết checked
function checked(category,trademark,sex,color) {
    let categories=5;
    let trademarks=5;
    let sexs=3;
    let colors=5;

    let n=categories+trademarks+sexs+colors;
    let array=new Array(n);

    for (i=0;i<n;i++)
    {
        array[i]="";
    }

    if (typeof category==="undefined")
    {
        category="";
    }
    if (typeof trademark==="undefined")
    {
        trademark="";
    }
    if (typeof sex==="undefined")
    {
        sex="";
    }
    if (typeof color==="undefined")
    {
        color="";
    }

    let index=0;
    switch(category)
    {
        case "watch":
            array[index]="checked";
            break;
        case "bracelet":
            array[index+1]="checked";
            break;
        case "ring":
            array[index+2]="checked";
            break;
        case "necklaced":
            array[index+3]="checked";
            break;
        default:
            array[index+4]="checked";
    }

    index=categories;
    switch(trademark)
    {
        case "luxury":
            array[index]="checked";
            break;
        case "pnj":
            array[index+1]="checked";
            break;
        case "doji":
            array[index+2]="checked";
            break;
        case "sjc":
            array[index+3]="checked";
            break;
        default:
            array[index+4]="checked";
    }

    index=categories+trademarks;
    switch(sex)
    {
        case "male":
            array[index]="checked";
            break;
        case "female":
            array[index+1]="checked";
            break;
        default:
            array[index+2]="checked";
    }

    index=categories+trademarks+sexs;
    switch(color)
    {
        case "yellow":
            array[index]="checked";
            break;
        case "white":
            array[index+1]="checked";
            break;
        case "violet":
            array[index+2]="checked";
            break;
        case "blue":
            array[index+3]="checked";
            break;
        default:
            array[index+4]="checked";
    }

    return array;
}

//hàm tạo ra mảng 2 chiều sản phẩm
function pageElementsArr(arr, eleDispCount) {
    const arrLen = arr.length;
    const noOfPages = Math.ceil(arrLen / eleDispCount);
    let pageArr = [];
    let perPageArr = [];
    let index = 0;
    let condition = 0;
    let remainingEleInArr = 0;

    for (let i = 0; i < noOfPages; i++) {

        if (i === 0) {
            index = 0;
            if (arrLen>=eleDispCount)
            {
                condition = eleDispCount;
            }
            else
            {
                condition=arrLen;
            }
        }
        for (let j = index; j < condition; j++) {
            perPageArr.push(arr[j]);
        }
        pageArr.push(perPageArr);
        if (i === 0) {
            remainingEleInArr = arrLen - perPageArr.length;
        } else {
            remainingEleInArr = remainingEleInArr - perPageArr.length;
        }

        if (remainingEleInArr > 0) {
            if (remainingEleInArr > eleDispCount) {
                index = index + eleDispCount;
                condition = condition + eleDispCount;
            } else {
                index = index + perPageArr.length;
                condition = condition + remainingEleInArr;
            }
        }
        perPageArr = [];
    }
    return pageArr;
}

function intersect(array1, array2)
{
    let result=[];
    let n1=array1.length;
    let n2=array2.length;

    for (let i=0;i<n1;i++)
    {
        for (let j=0;j<n2;j++)
        {
            if (array1[i]._id.toString()===array2[j]._id.toString())
            {
                result.push(array1[i]);
                break;
            }
        }
    }

    return result;
}

function Search(content, listProducts)
{
    let result=[];
    let n=listProducts.length;
    content=content.toLowerCase();
    for (i=0;i<n;i++)
    {
        //console.log("=>"+listProducts[i].name);
        let item=listProducts[i].name.toLowerCase();
        let compare=item.search(content);
        if (compare>=0)
        {
            //console.log("com: "+compare);
            //console.log(listProducts[i]);
            result.push(listProducts[i]);
        }
    }
    return result;
}

/**
 * @return {number}
 */
function CheckExist(item, arrayItem) {
    let n=arrayItem.length;
    for (let i=0;i<n;i++)
    {
        if (arrayItem[i]===item)
        {
            return i;
        }
    }
    return -1;
}

async function getMoreProductByID(arrayID) {
    let listProduct=[];
    let n=arrayID.length;
    for (let i=0;i<n;i++)
    {
        let product = await productService.getProductById(arrayID[i]);
        listProduct.push(product[0]);
    }
    return listProduct;
}

async function getAmount(user) {
    if (user)
    {
        let cart = await productService.getCartOfUser(user.username);
        if (cart.length>0)
        {
            return cart[0].amount;
        }
        else
        {
            return 0;
        }
    }
    return -1;
}
