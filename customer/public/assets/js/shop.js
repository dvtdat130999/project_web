$(document).ready(function() {
    $("body").fadeIn(400);

$('#myCarousel').carousel()
$('#newProductCar').carousel()

/* Home page item price animation */
$('.thumbnail').mouseenter(function() {
   $(this).children('.zoomTool').fadeIn();
});

$('.thumbnail').mouseleave(function() {
	$(this).children('.zoomTool').fadeOut();
});

// Show/Hide Sticky "Go to top" button
	$(window).scroll(function(){
		if($(this).scrollTop()>200){
			$(".gotop").fadeIn(200);
		}
		else{
			$(".gotop").fadeOut(200);
		}
	});
// Scroll Page to Top when clicked on "go to top" button
	$(".gotop").click(function(event){
		event.preventDefault();

		$.scrollTo('#gototop', 1500, {
        	easing: 'easeOutCubic'
        });
	});

});

function loadItem() {
	let item = document.getElementById("item");
	let loadItem=localStorage.getItem("item");
	let loadListItem=localStorage.getItem("listItem");
	if (loadItem===null)
	{
		loadItem=0;
		localStorage.setItem("item",loadItem);
		localStorage.setItem("listItem","");
	}
	item.innerText=" Giỏ hàng ("+loadItem+")";
	document.getElementById("listItem").value=loadListItem;
}

function resetLocalData() {
	localStorage.setItem("item",0);
	localStorage.setItem("listItem","");
}

/*Tính toán tổng tiền. type là loại hàm (1:Add, 2:remove, 3:removeAll)*/
function Caculate(id, type, numberPre) {
	let price=document.getElementById("price"+id).value;
	price=parseInt(price);
	let number=document.getElementById("number"+id).value;
	let sum=document.getElementById("sum").value;

	let S=price*number;

	document.getElementById("sum"+id).innerText=S.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')+"đ";
	let sumPrice=document.getElementById("sum").value;
	sumPrice=parseInt(sumPrice);
	if (type===1)
	{
		sumPrice+=price;
	}
	else if (type===2)
	{
		sumPrice-=price;
	}
	else if (type===3)
	{
		sumPrice-=price*numberPre;
	}
	document.getElementById("sum").value=sumPrice;
	document.getElementById("sumPrice").innerText=sumPrice.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')+"đ";
}

function shop(id) {
	let item = document.getElementById("item");
	let loadItem=localStorage.getItem("item");
	let loadListItem=localStorage.getItem("listItem");
	loadItem++;
	loadListItem=loadListItem+"-"+id;
	localStorage.setItem("item",loadItem);
	localStorage.setItem("listItem",loadListItem);
	item.innerText=" Giỏ hàng ("+loadItem+")";
	document.getElementById("listItem").value=loadListItem;

	let number=document.getElementById("number"+id);
	if (number!==null)
	{
		number.value=parseInt(number.value)+1;
		document.getElementById("NumberOfProduct").innerText=loadItem+" sản phẩm";
		Caculate(id,1,0);
	}
	else{
		alert("Sản phẩm đã được cho vào giỏ hàng");
	}
}

function removeItem(id) {
	let item = document.getElementById("item");
	let loadItem=localStorage.getItem("item");
	let loadListItem=localStorage.getItem("listItem");
	let number=document.getElementById("number"+id);
	if (number.value>0)
	{
		loadItem--;
		number.value=number.value-1;
	}
	else
	{
		return;
	}
	let arrayItem=loadListItem.split('-');
	arrayItem.splice(arrayItem.indexOf(id),1);
	let stringItem="";
	for (let i=1;i<arrayItem.length;i++)
	{
		stringItem=stringItem+"-"+arrayItem[i];
	}
	localStorage.setItem("item",loadItem);
	localStorage.setItem("listItem",stringItem);
	item.innerText=" Giỏ hàng ("+loadItem+")";
	document.getElementById("listItem").value=stringItem;

	document.getElementById("NumberOfProduct").innerText=loadItem+" sản phẩm";
	Caculate(id,2,0);
}

function removeAllItem(id) {
	let item = document.getElementById("item");
	let loadItem=localStorage.getItem("item");
	let loadListItem=localStorage.getItem("listItem");

	let arrayItem=loadListItem.split('-');
	let stringItem="";
	for (let i=1;i<arrayItem.length;i++)
	{
		if (arrayItem[i]!==id)
		{
			stringItem=stringItem+"-"+arrayItem[i];
		}
		else
		{
			loadItem--;
		}
	}
	localStorage.setItem("item",loadItem);
	localStorage.setItem("listItem",stringItem);
	item.innerText=" Giỏ hàng ("+loadItem+")";
	document.getElementById("listItem").value=stringItem;

	let number=document.getElementById("number"+id);
	let numberPre=number.value;
	number.value=0;
	document.getElementById("NumberOfProduct").innerText=loadItem+" sản phẩm";
	Caculate(id,3,numberPre);
}
