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
	//window.location.reload(true);
}
