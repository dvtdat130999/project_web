const product = require('../databasemodel/products');
const Comment=require('../databasemodel/comments');
const Cart=require('../databasemodel/cart');
const Formidable = require('formidable');
const productService = require('../models/productService');
var async = require('async');

exports.getIndex = (req, res, next) =>  {
    res.render('index', { userdata:req.user });
};

exports.getCart = async (req, res, next) =>{
    const form = new Formidable();
    //console.log("Here");
    form.parse(req, async (err, fields, files) => {
        //console.log("=>");
        let stringItem=fields.listItem;
        let arrayItem=stringItem.split('-');
        arrayItem.shift();     //Loại bỏ phần tử đầu tiên

        //Nếu đã đăng nhập
        if (req.user)
        {
            let username=req.user.username;
            let cart = await productService.getCartOfUser(username);
            console.log(cart);
            if (cart.length===0)
            {
                const newCart=new Cart({user:username, amount: arrayItem.length, listItem: arrayItem});
                await newCart.save();

            }
        }
        else
        {
            //Gộp 2 giỏ hàng
        }
        console.log("pass");

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
        res.render('cart', { userdata:req.user, product_list: listProduct, number: number });
    });
};
exports.getShip = (req, res, next) => res.render('ship', { userdata:req.user });

exports.getProduct = async (req, res, next) => {
    let page=req.query.page;
    let arr=[];
    let checked_array=[];
    let condition="";
    let numberOfProduct=9;

    //Search product
    let searchContent=req.query.search;
    if (typeof searchContent !== "undefined")
    {
        product.find()
            .exec(function (err, list_products) {
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
                res.render('products/list', {checked: checked_array, product_list: array2D[index],userdata:req.user, active: arr, condition: condition, search: searchContent });
            });
        return;
    }

    //Sort products
    const softby=req.query.sort;
    if (softby==="low")
    {
        product.find()
            .exec(function (err, list_products) {
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
                res.render('products/list', {checked: checked_array, product_list: array2D[index],userdata:req.user, active: arr, condition: condition});
            });
        return;
    }
    else if(softby==="high")
    {
        product.find()
            .exec(function (err, list_products) {
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
                res.render('products/list', {checked: checked_array, product_list: array2D[index],userdata:req.user, active: arr, condition: condition  });
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
            .exec(function (err, list_products) {
                if (err) { return next(err); }
                //Successful, so render
                res.render('products/productdetail', {checked: checked_array , product_list: list_products ,userdata:req.user, active: arr, condition: condition, comments: array2D[index]});
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
        res.render('products/list', { checked: checked_array, product_list: result,userdata:req.user, active: arr, condition: condition });
    }
    else
    {
        product.find()
            .exec(function (err, list_products) {
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

                res.render('products/list', {checked: checked_array, product_list: array2D[index],userdata:req.user, active: arr, condition: condition });
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
                .exec(function (err, list_products) {
                    if (err) { return next(err); }
                    //Successful, so render
                    res.render('products/productdetail', {checked: checked_array , product_list: list_products ,userdata:req.user, active: arr, condition: condition, comments: array2D[index]});
                });
        });
    }
};

exports.getStatus = (req, res, next) => res.render('status_products', {userdata:req.user});

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
