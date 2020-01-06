const order = require('../databasemodel/order');
const product = require('../databasemodel/products');

exports.getIndex = async (req, res, next) => {
    let statistical = req.query.statistical;
    let sort = req.query.sort;
    let year = req.query.year;
    let quarter = req.query.quarter;
    const month = req.query.month;
    const week = req.query.week;
    const day = req.query.day;
    let titleTable;

    if(req.user.author === "admin"){
        const bills = await order.find({confirm: 2});
        const productsOnDB = await product.find({});
        const listProduct = [];
        for(const element of productsOnDB){
            const newProduct = {
                stt: 0,
                id: element.id,
                thumbnail: element.thumbnail,
                nameProduct: element.name,
                quantitySale: 0,
                quantityInStoreHouse: element.quantity
            }
            listProduct.push(newProduct);
        }

        for (const bill of bills){
            for(const product of listProduct){
                if(product.id === bill.idProduct){
                    product.quantitySale += bill.quantity;
                }
            }
        }

        listProduct.sort(function (a, b) {
            return b.quantitySale - a.quantitySale;
        });
        for(let i = 0; listProduct.length > 10; i++){
            listProduct.pop();
        }

        for(let i = 1; i <= listProduct.length; i++){
            listProduct[i-1].stt = i;
        }

        titleTable = "THỐNG KÊ TOP 10 SẢN PHẨM BÁN CHẠY NHẤT";
        res.render('sales', {userdata:req.user, active:"sales", products: listProduct, statistical: statistical,
            day: day, month: month, year: year, week: week, quarter: quarter, sort: sort, title: titleTable});
    }
    else {
        const daysInMonth = [0,31,28,31,30,31,30,31,31,30,31,30,31];
        if((year % 400 === 0) || (year % 4 === 0 && year % 100 !== 0))
            daysInMonth[2] +=1;

        if(typeof statistical === "undefined"){
            statistical = "7day";
            sort = "topsale"
        }

        const productsOnDB = await product.find({idshop: req.user.id});
        const listProduct = [];
        let bills = [];
        for(const element of productsOnDB){
            const newProduct = {
                stt: 0,
                id: element.id,
                thumbnail: element.thumbnail,
                nameProduct: element.name,
                quantitySale: 0,
                quantityInStoreHouse: element.quantity
            }
            listProduct.push(newProduct);
        }

        switch (statistical) {
            case "year":
                bills = await order.find({yearSale: year, confirm: 2, idShop: req.user.id});
                titleTable = "THỐNG KÊ NĂM " + year;
                break;
            case "quarter":
                const arrayMonth = [1, 2, 3];
                arrayMonth[0] += (quarter - 1) * 3;
                arrayMonth[1] += (quarter - 1) * 3;
                arrayMonth[2] += (quarter - 1) * 3;
                bills = await order.find({monthSale: arrayMonth, yearSale: year, confirm: 2, idShop: req.user.id});
                titleTable = "THÓNG KÊ QUÝ " + quarter + " NĂM " + year;
                break;
            case "month":
                bills = await order.find({monthSale: month, yearSale: year, confirm: 2, idShop: req.user.id});
                titleTable = "THỐNG KÊ THÁNG " + month + " NĂM " + year;
                break;
            case "week":
                const arrayDayOfWeek = [1, 2, 3, 4, 5, 6, 7];

                for (let i = 0; i < arrayDayOfWeek.length; i++) {
                    arrayDayOfWeek[i] += (week - 1) * 7;
                }

                for (let i = 29; i <= daysInMonth[month]; i++) {
                    arrayDayOfWeek.push(i);
                }

                bills = await order.find({monthSale: month, daySale: arrayDayOfWeek, yearSale: year, confirm: 2, idShop: req.user.id});
                titleTable = "THỐNG KÊ TUẦN " + week + " THÁNG " + month + " NĂM " + year;
                break;
            case "day":
                bills = await order.find({yearSale: year, daySale: day, monthSale: month, confirm: 2, idShop: req.user.id});
                titleTable = "THỐNG KÊ NGÀY " + day + " THÁNG " + month + " NĂM " + year;
                break;
            case "7day":
                const nowDate = new Date();
                let yearNow = nowDate.getFullYear();
                let monthNow = nowDate.getMonth() + 1;
                let dayNow = nowDate.getDate();

                let newbill = await order.find({
                    yearSale: yearNow,
                    daySale: dayNow,
                    monthSale: monthNow,
                    confirm: 2
                });

                if (newbill !== null) {
                    for(const bill of newbill)
                        bills.push(bill);
                }

                for (let i = 1; i < 7; i++) {
                    dayNow--;
                    if (dayNow <= 0) {
                        monthNow--;

                        if (monthNow <= 0) {
                            monthNow = 12;
                            yearNow--;
                        }

                        dayNow = daysInMonth[monthNow];
                    }

                    newbill = await order.find({
                        yearSale: yearNow,
                        daySale: dayNow,
                        monthSale: monthNow,
                        confirm: 2
                    });

                    if (newbill !== null) {
                        for(const bill of newbill)
                            bills.push(bill);
                    }
                }

                titleTable = "THỐNG KÊ 7 NGÀY GẦN NHẤT (" + dayNow + "/" + monthNow + "/" + yearNow + " - "
                    + nowDate.getDate() + "/" + (nowDate.getMonth() + 1) + "/" + nowDate.getFullYear() + ")";
                break;
            case 'top10':
                bills = await order.find({confirm: 2, idShop: req.user.id});
                titleTable = "THỐNG KÊ TOP 10 SẢN PHẨM BÁN CHẠY NHẤT";
                break;
        }

        for (const bill of bills){
            for(const product of listProduct){
                if(product.id === bill.idProduct){
                    product.quantitySale += bill.quantity;
                }
            }
        }

        if(statistical === 'top10'){
            listProduct.sort(function (a, b) {
                return b.quantitySale - a.quantitySale;
            });
            for(let i = 0; listProduct.length > 10; i++){
                listProduct.pop();
            }
        }
        else
        {
            if(sort === "topbadsale")
            {
                listProduct.sort(function (a, b) {
                    return a.quantitySale - b.quantitySale;
                });
            }
            else{
                listProduct.sort(function (a, b) {
                    return b.quantitySale - a.quantitySale;
                });
            }
        }

        for(let i = 1; i <= listProduct.length; i++){
            listProduct[i-1].stt = i;
        }

        res.render('sales', {userdata:req.user, active:"sales", products: listProduct, statistical: statistical,
            day: day, month: month, year: year, week: week, quarter: quarter, sort: sort, title: titleTable});
    }
}