const product = require('../databasemodel/products');
const productService = require('../models/productService');
var async = require('async');

exports.getIndex = (req, res, next) =>  res.render('index', { userdata:req.user });

exports.getCart = (req, res, next) => res.render('cart', { userdata:req.user });

exports.getShip = (req, res, next) => res.render('ship', { userdata:req.user });

exports.getProduct = async (req, res, next) => {
    let page=req.query.page;
    let arr=[];
    let checked_array=[];
    let condition="";

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
                let array2D = pageElementsArr(list_products,3);
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
                let array2D = pageElementsArr(list_products,3);
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
        productService.getProductById(id)
            .exec(function (err, list_products) {
                if (err) { return next(err); }
                //Successful, so render
                res.render('products/productdetail', {checked: checked_array , product_list: list_products ,userdata:req.user, active: arr, condition: condition });
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
        let array2D = pageElementsArr(result,3);
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
                let array2D = pageElementsArr(list_products,3);
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
}

exports.getStatus = (req, res, next) => res.render('status_products', {userdata:req.user});

exports.getAdvanced = (req, res, next) => res.render('advanced_searching',{userdata:req.user});

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