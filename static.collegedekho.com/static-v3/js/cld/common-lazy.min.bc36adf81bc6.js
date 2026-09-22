!function(){var i,n
async function t(){var o=window.location.pathname
return await(await fetch("/api/common/profile-navigation?next="+o)).json()}i=function(o){window.location.href},n=function(o,i){window.location.href},$("#profile-icon").click(async function(){var o
i(),(IsAuthenticated?(""==$("#profile-logged-in").text().trim()&&(o=await t(),$("#profile-logged-in").html(o.html)),$("#profile-logged-in .content-userModal")):(""==$("#profile-logged-out").text().trim()&&(o=await t(),$("#profile-logged-out").html(o.html)),$("#profile-logged-out .content-userModal"))).addClass("open"),$("body").addClass("bodyScroll")}),$(document).on("click","#profile-logged-out .close",function(){$("#profile-logged-out .content-userModal").removeClass("open"),$("body").removeClass("bodyScroll")}),$(document).on("click","#profile-logged-in .close",function(){$("#profile-logged-in .content-userModal").removeClass("open"),$("body").removeClass("bodyScroll")}),$(".menu").click(function(){i()}),$(".sub-links > .more-links").click(function(){var o=$(this).text().trim()
n()}),$(document).on("click","#profile-logged-in li a",function(o){var i=$(this).text().trim()
n()}),$("#popupOver li a").click(function(){var o=$(this).text().trim()
n()})}.call(this)
