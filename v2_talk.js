function dateTime(ms) {
	var now = new Date();
	var d = new Date(ms);
	
	var s;
	if (d.getFullYear()!=now.getFullYear()||d.getMonth()!=now.getMonth()||d.getDate()!=now.getDate()) {
		s = (d.getMonth() + 1) + "/" + d.getDate() + "/" + d.getFullYear() + " ";
	} else {
		s = "";
	}
	
	return s + (d.getHours()>9?d.getHours():"0"+d.getHours()) + ":" 
		+ (d.getMinutes()>9?d.getMinutes():"0"+d.getMinutes()) + ":" 
		+ (d.getSeconds()>9?d.getSeconds():"0"+d.getSeconds());
}

function getResult(rspTxt, alarm) {
	try {
		eval("var rsp = " + rspTxt);
	} catch (e) {
		if (alarm) {
			alert(e);
		} else {
			$(".errorDiv").text(e);
		}
		
		return null;
	}
	
	if (rsp.result != "success") {
		if (alarm) {
			alert(rsp.messages[0]);
		} else {
			$(".errorDiv").text(rsp.messages[0]);	
		}
		
		return null;
	}
	
	eval("var r = " + rsp.data);
	return r;
}

function popPages(bar, r) {
	bar.html("");
	
	var ad = r.adjacentPages;
	var lastIdx = ad.length - 1;
	if (lastIdx >= 0) {
		var startIdx = ad[0];
		var endIdx = ad[lastIdx];
		if (startIdx > 1) {
			$('<span class="spg">[ <a class="apg" href="javascript:void(0)" rel="1">First</a> ]</span>').appendTo(bar);
			$('<span class="spg">[ <a class="apg" href="javascript:void(0)" rel="' + (r.page-1) + '">Prev</a> ]</span>').appendTo(bar);
		}
		for (var i = 0; i < ad.length; i++) {
			var p = ad[i];
			if (p == r.page) {
				$('<span class="spg cpg">' + p + '</span>').appendTo(bar);
			} else {
				$('<span class="spg">[ <a class="apg" href="javascript:void(0)" rel="' + p + '">' + p + '</a> ]</span>').appendTo(bar);
			}
		}
		if (endIdx < r.pageCount) {
			$('<span class="spg">[ <a class="apg" href="javascript:void(0)" rel="' + (r.page+1) + '">Next</a> ]</span>').appendTo(bar);
			$('<span class="spg">[ <a class="apg" href="javascript:void(0)" rel="' + (r.pageCount) + '">Last</a> ]</span>').appendTo(bar);
		}
	}
	
	$('<input class="tpg" value="' + r.page + '"> / <span class="pc">' + r.pageCount + '</span>').appendTo(bar);
}

function getScaledSize(w, h) {
	var mw = 150, mh = 150;
	if (w <= mw && h <= mh) {
		return { width: w, height: h };
	}
	
	if (mw / w < mh / h) {
		return { width: mw, height: mw * h / w };
	} else {
		return { width: mh * w / h, height: mh };
	}
}

function txt2html(s, opt) {
	if (!s) {
		return "";
	}
	s = esc(s);
	var sArr = s.split('|||');
	if(sArr.length == 7){
		var s = '<div class="msg-order-item clearfix" style="padding-bottom:0;margin-bottom:0">'+
			'<div class="order-item-content">'+
				'<div class="order-item-top clearfix">' +
					'<div class="order-item-number"><span class="order-item-content-title">'+l_online_talk_number+': </span><a href="'+opt.orderUrl+sArr[1]+'" target="_blank"><b>'+sArr[1]+'</b></a></div>'+
					'<div class="order-item-date"><span style="color:#999;">' + sArr[2] + ' </span></div>'+
				'</div>' +
				'<div class="clearfix">'+
					'<div class="order-item-address"><span class="order-item-content-title">'+l_online_talk_receiver+': </span><span>'+sArr[3]+'</span></div>'+
					'<div class="order-item-address"><span class="order-item-content-title">'+l_online_talk_country+': </span><span>'+sArr[4]+'</span></div>'+
					'<div class="order-item-address"><span class="order-item-content-title">'+l_online_talk_address+': </span><span>'+sArr[5]+'</span></div>'+
					'<div class="order-item-total"><span class="order-item-content-title">'+l_online_talk_amount+': </span><span style="color:#F23030;">' + sArr[6] + ' </span></div>'+
				'</div>'+
			'</div>'+
		'</div>';
	}else{
		if(s.indexOf("www.sunsky-online.com") > -1 && s.indexOf("contact=") > -1 ){
			s = s.replace(/(http\:\/\/www.sunsky-online.com\/\S+)/g, "<a href='$1' target='_blank'>$1</a>");
			s = s.replace(/(https\:\/\/www.sunsky-online.com\/\S+)/g, "<a href='$1' target='_blank'>$1</a>");
		}else{
			s = s.replace(/(http\:\/\/www.sunsky-online.com\/\S+)/g, "<a href='$1' target='_blank'>$1</a>");
			s = s.replace(/(https\:\/\/www.sunsky-online.com\/\S+)/g, "<a href='$1' target='_blank'>$1</a>");
			if(s.indexOf('_@#@') > -1){
				s = "<div class='msg-product-conent'>" + s + "</div>";
				s = s.replace(/_@#@img/g,"<div><img src='");
				s = s.replace(/img@#@/g,"'></div>");
				s = s.replace(/_@#@item(.*)item@#@/g,"<div class='msg-product-itemno'><a target='_blank' href='"+opt.itemUrl+"$1'>$1</a></div>");
				s = s.replace(/_@#@/g,"<div>");
				s = s.replace(/@#@/g, "</div>");;
			}else{
				s = s.replace(/(^|\W+)((S\-)?[A-Z]\w{0,3}\-?\d{4,9}[A-Z]*)(?=$|[^\w'<]+)/gi, "$1<a href='" + opt.itemUrl + "$2' target='_blank'>$2</a>");
			}
			s = s.replace(/(^|\W+)(\d{10})(?=$|[^\d'<]+)/g, "$1<a href='" + opt.orderUrl + "$2' target='_blank'>$2</a>");
			s = s.replace(/\n/g, "<br/>");
		}
	}
	return s;
}

function formatUserMsg(m, opt) {
	var html = '<div class="msgContent">';
	
	var mc;
	if (m.type == "TEXT") {
		html += txt2html(m.content, opt);
	} else {
		eval("mc = " + m.content);
	
		if (mc.CODE == "PRICE_MATCH") {
			html += '<div class="titleContent">[ PRICE MATCH ]</div>';
		} else if (mc.CODE == "ERROR_REPORT") {
			html += '<div class="titleContent">[ ERROR REPORT ]</div>';
		}
		
		if (!isEmpty(mc.TXT)) {
			html += '<div class="txtContent">' + txt2html(mc.TXT, opt) + '</div>';
		}
		
		if (!isEmpty(mc.URL)) {
			html += '<div class="linkContent">URL: <a href="' + esc(mc.URL) + '" target="_blank">' + esc(mc.URL) + '</a></div>';
		}
		
		if (!isEmpty(mc.ITEM_NO)) {
			html += '<div class="itemContent">Item #: <a href="' + opt.itemUrl + esc(mc.ITEM_NO) + '" target="_blank">' + esc(mc.ITEM_NO) + '</a></div>';
		}
		
		if (!isEmpty(mc.ERROR_TYPE)) {
			html += '<div class="txtContent">Error Type: ' + esc(mc.ERROR_TYPE) + '</div>';
		}
		
		if (mc.IMGS) {
			html += '<div class="imgContent">';
			
			for (var j = 0; j < mc.IMGS.length; j++) {
				var img = mc.IMGS[j];
				var sz = getScaledSize(img.width, img.height);
				var url = opt.imgUrl + "/" + img.path;
				html += '<a href="' + url + '" target="_blank"><img src="' + url + '" width="' + sz.width 
						+ '" height="' + sz.height + '" title="' + esc(img.name) + '" /></a>';
			}
			
			html += '</div>';
		}
	}
	
	html += '</div><div class="msgFooter">';
	
	if (mc && mc.FROM) {
		html += '<div class="msgFrom">From ';
		if (mc.FROM.MODULE == "PRODUCT") {
			html += 'Item <a href="' + opt.itemUrl + esc(mc.FROM.ITEM_NO) + '" target="_blank">' + esc(mc.FROM.ITEM_NO) + '</a>';
		} else if (mc.FROM.MODULE == "ORDER") {
			html += 'Order <a href="' + opt.orderUrl + esc(mc.FROM.ORDER_NO) + '" target="_blank">' + esc(mc.FROM.ORDER_NO) + '</a>';
		}
		
		html += '</div>';
	}
	
	html += '<div class="msgTime">' + dateTime(m.gmtCreated.time) + '</div><div class="ClearFloat"></div></div>';
	return html;
}

function formatContactMsg(m, opt) {
	var html = '<div class="msgContent">';
	
	var mc;
	if (m.type == "TEXT") {
		html += txt2html(m.content, opt);
	} else {
		eval("mc = " + m.content);
	
		if (mc.CODE == "PRICE_MATCH") {
			html += '<div class="titleContent">[ PRICE MATCH ]</div>';
		} else if (mc.CODE == "ERROR_REPORT") {
			html += '<div class="titleContent">[ ERROR REPORT ]</div>';
		}
		
		if (!isEmpty(mc.TXT)) {
			html += '<div class="txtContent">' + txt2html(mc.TXT, opt) + '</div>';
		}
		
		if (!isEmpty(mc.URL)) {
			html += '<div class="linkContent">URL: <a href="' + esc(mc.URL) + '" target="_blank">' + esc(mc.URL) + '</a></div>';
		}
		
		if (!isEmpty(mc.ITEM_NO)) {
			html += '<div class="itemContent">Item #: <a href="' + opt.itemUrl + esc(mc.ITEM_NO) + '" target="_blank">' + esc(mc.ITEM_NO) + '</a></div>';
		}
		
		if (!isEmpty(mc.ERROR_TYPE)) {
			html += '<div class="txtContent">Error Type: ' + esc(mc.ERROR_TYPE) + '</div>';
		}
		
		if (mc.IMGS) {
			html += '<div class="imgContent">';
			
			for (var j = 0; j < mc.IMGS.length; j++) {
				var img = mc.IMGS[j];
				var sz = getScaledSize(img.width, img.height);
				var url = opt.imgUrl + "/" + img.path;
				html += '<a href="' + url + '" target="_blank"><img src="' + url + '" width="' + sz.width 
						+ '" height="' + sz.height + '" title="' + esc(img.name) + '" /></a>';
			}
			
			html += '</div>';
		}
	}

	html += '</div><div class="msgFooter">';
	
	if (mc && mc.FROM) {
		html += '<div class="msgFrom">From ';
		if (mc.FROM.MODULE == "PRODUCT") {
			html += 'Item <a href="' + opt.itemUrl + esc(mc.FROM.ITEM_NO) + '" target="_blank">' + esc(mc.FROM.ITEM_NO) + '</a>';
		} else if (mc.FROM.MODULE == "ORDER") {
			html += 'Order <a href="' + opt.orderUrl + esc(mc.FROM.ORDER_NO) + '" target="_blank">' + esc(mc.FROM.ORDER_NO) + '</a>';
		}
		
		html += '</div>';
	}
	
	html += '<div rel="'+m.id+'" class="callbackbtn" style="float:right;padding-left:10px;cursor:pointer;display:none">'+
		'<span style="color:blue;text-decoration:underline;height:18px;">ÃƒÂ¦Ã¢â‚¬â„¢Ã‚Â¤ÃƒÂ¥Ã¢â‚¬ÂºÃ…Â¾</span></div>'+
		'<div class="msgTime" style="line-height:18px;">' + dateTime(m.gmtCreated.time) + '</div>'+
		'<div class="ClearFloat"></div></div>';
	return html;
}

function MyMessageFrame(id, topicType, topicId, opt, initMsg, showHistory) {
	var that = this;
	var c = $(opt.container);
	
	this.id = id;
	this.topicType = topicType;
	this.topicId = topicId;
	this.initMsg = initMsg;
	this.lastId = 0;
	this.isLastPage = topicId == null;
	this.vistHistoryBeforeScroll = 0;
	this.orderBeforeScroll = 0;
	this.vistHistoryLoading = false;
	this.orderLoading = false;
	this.vistHistoryPage = 1;
	this.orderPage = 1;
	this.showHistory = showHistory
	
	function parseResult(rspTxt, status) {
		var r = getResult(rspTxt);
		if (r == null) {
			return;
		}
		
		that.topicId = r.userTopicId;
		
		c.find("#displayName").text(r.talk.contactDisplayName);
		
		var w = c.find("#msgWin");
		w.html("");
		appendMsgList(w, r.result);
		
		var pg = c.find("#pgBar");
		popPages(pg, r);
		
		pg.find(".apg").click(function() {
				gotoPage($(this).attr("rel"));
			});
			
		pg.find(".tpg").keydown(function(event) {
				if (event.keyCode == 13) {
					gotoPage($(this).val());
				}
			});
		
		popRating(c.find("#rateBar"), r);
		
		that.isLastPage = (r.page == r.pageCount);
	}
	
	function popRating(bar, r) {
		bar.html("");
		
		var k = r.talk;
		if (!k.userId && isEmpty(k.email)) {
			var html = '<span>Your Email: </span><input id="userEmail" maxLength="128" style="width:200px;" />';
			$(html).appendTo(bar);
			c.find("#pgBar").html("");
			c.find("#userEmail").blur(function() {
				var e = $(this);
				if (!isEmail(e.val())) {
					e.addClass("error");
				}
			}).focus(function() {
				$(this).removeClass("error");
			}).keyup(function() {
				enableBtn();
			}).focus();
			return;
		}
		
		var t = r.topic;
		if (!t) {
			return;
		}
		
		var html = '<a href="javascript:void(0)" class="ratingHint">' + l_online_talk_rating + ': ' +
				'<span>' + l_online_talk_rating_des + '</span></a>' +
				'<div class="ratingDlg"><div class="ratingScore"><input type="hidden" id="rating" value="' + (t.rating) + '" />';
		for (var i = 1; i <= 5; i++) {
			html += '<a href="javascript:void(0)" class="rating ' + ((t.rating<1 || i > t.rating) ? "unfilled" : "filled") + '" v="' + i + '"></a>';
		}
		
		html += '<div class="ClearFloat"></div></div>' +
			'<div class="ratingEx"><div class="ratingRmk"><div class="ddInput">' +
					'<input id="ratingRemark" maxLength="128" class="ddValue" style="width:200px;" value="' 
						+ esc(t.ratingRemark) + '" /><div class="ddIcon">' +
						'<ul class="ddList" style="width:220px;left:-220px;">' +
						'<li>' + l_online_talk_rating_info1 + '</li>' + 
						'<li>' + l_online_talk_rationg_info2 + '</li>' + 
						'</ul></div><div class="ClearFloat"></div></div></div>' +
				'<div class="ratingSubmit"><input type="button" class="submitBtn" value="' + l_online_talk_submit + '" /></div>' +
				'</div></div><div class="ClearFloat"></div>';
				
		$(html).appendTo(bar);
		bar.find(".rating").click(rate2);
		bar.find("#ratingRemark").focus(function() { $(this).select(); }).keydown(function(event) {
			if (event.keyCode == 13) {
				$(this).parents(".ratingDlg").find(".submitBtn").click();
			}			
		});
		
		var dd = bar.find(".ddInput");
		dd.find(".ddIcon").hover(function() {
			$(this).addClass("hover");
		}, function() {
			$(this).removeClass("hover");
		});
		
		dd.find("li").click(function() {
			var li = $(this);
			var dd = li.parents(".ddInput");
			dd.find(".ddValue").val(li.text());
			dd.find(".ddIcon").removeClass("hover");
		});
		
		bar.find(".submitBtn").click(function() {
			var dlg = $(this).parents(".ratingDlg");
			submitRating({ id: that.topicId, rating: dlg.find("#rating").val(), ratingRemark: dlg.find("#ratingRemark").val() });
		});
	}
	
	function rate2(event) {
		stopBubble(event);
		
		rate(this, "rating");
		
		var e = $(this);
		var v = e.attr("v");
		if (v < 5) {
			var dlg = c.find(".ratingDlg");
			dlg.appendTo(c.find('.msgFrame'));
			
			var o = $("#rateBar").offset();
			dlg.addClass("withEx").css("left", '0px').css("bottom", '0px');
			
			dlg.find("#ratingRemark").focus();
		} else {
			submitRating({ id: that.topicId, rating: 5 });
		}
	}
	
	function submitRating(data) {
		$.post(opt.rateUrl, data, function() {});
		closeRatingDlg();
	}
	
	function closeRatingDlg() {
		c.find(".ratingDlg").removeClass("withEx").insertAfter(opt.container + " #rateBar .ratingHint");
	}
	
	function appendMsgList(w, msgList) {
		var lastId = 0;
		var msgIds = [];
		for (var i = 0; i < msgList.length; i++) {
			var m = msgList[i];
			if (m.id <= that.lastId) {
				continue;
			}
			
			lastId = m.id;
			
			var cls = "msg";
			cls += m.dir > 0 ? " msgOut" : " msgIn";
			
			if (m.unread && m.dir < 0) {
				msgIds.push(m.id);
				cls += " unread";
			}
			
			$('<div class="' + cls + '">' + formatUserMsg(m, opt) + '</div>').appendTo(w);
		}
		
		if (msgList.length > 0 && w.find(".msgHint").length == 0) {
			var msg = msgList[msgList.length - 1];
			if (msg.dir > 0) {
				var now = new Date();
				var msgTime = new Date(msg.gmtCreated.time);
				if ((now.getTime() - msgTime.getTime()) < 60000) {
					var hours = msgTime.getUTCHours() + 8;
					var minutes = msgTime.getUTCMinutes();
					var day = msgTime.getUTCDay();
					if (day == 0 || (hours < 9 || hours >= 19)) {
						var h = hours > 9 ? hours : "0" + hours;
						var m = minutes > 9 ? minutes : "0" + minutes;
						var time_now = jQuery.format(l_online_talk_leave_msg2, h + ':' + m);
						$('<div class="msg msgIn msgHint"><div class="msgContent">'+l_online_talk_leave_msg1+'<br>'+time_now+'<br>'+l_online_talk_leave_msg3+'</div></div>').appendTo(w);
					}
				}
			}
		}
		
		if (msgList.length > 0) {
			w.scrollTop(w[0].scrollHeight);
		}
		
		if (msgIds.length > 0) {
			$.post(opt.readUrl, { topicId: that.topicId, messageIds: msgIds });
		}
		
		if (lastId > that.lastId) {
			that.lastId = lastId;
		}
	}
	
	function checkNewMsg() {
		$.post(opt.msgUrl, { userTopicId: that.topicId, startId: that.lastId }, function(rspTxt, status) {
				var r = getResult(rspTxt);
				if (r == null) {
					return;
				}
				
				var w = c.find("#msgWin");
				appendMsgList(w, r.result);
			});
	}
	
	function enableBtn() {
		var dis = isEmpty(c.find("#msgInput").val());
		if (!dis) {
			var email = c.find("#userEmail");
			if (email.length > 0) {
				dis = !isEmail(email.val());
			}
		}
	
		c.find("#msgBtn").attr("disabled", dis);
		return !dis;
	}
	
	function gotoPage(page) {
		that.lastId = 0;
		$.post(opt.msgUrl, { userTopicId: that.topicId, page: page }, parseResult);
	}
	
	function showUploadDlg(event) {
		stopBubble(event);
		
		$("#uploadDlg").remove();
		$('<div id="uploadDlg"><form action="' + opt.sendUrl + '" method="post" enctype="multipart/form-data" target="u_f_' + that.id + 
				'"><input id="fileSel" type="file" name="imgs" value="Upload" /> ' +
				'[ <a id="closeDlg" href="javascript:void(0)">Close</a> ]' +
				'<input type="hidden" name="type" value="MIXED" /><input type="hidden" id="content" name="content" />' +
				'<input type="hidden" name="topicType" value="' + esc(that.topicType) +'" />' +
				'<input type="hidden" name="topicId" value="' + (that.topicId ? that.topicId : "") +'" /></form>' +
				'(' + l_online_talk_file_limit + ')</div>').appendTo(document.body);
				
		var dlg = $("#uploadDlg");
		if (that.initMsg) {
			dlg.find("#content").val(JSON.stringify(that.initMsg));
		}
		
		var a = c.find("#aUpImg");
		var o = a.offset();
		dlg.css("left", o.left).css("top", o.top - dlg.height());
		
		dlg.find("#closeDlg").click(function() { $("#uploadDlg").remove(); });
		dlg.find("#fileSel").change(function() {
			var f = $(this).val();
			if (!isEmpty(f)) {
				var p = f.lastIndexOf(".");
				if (p > 0) {
					f = f.substring(p + 1);
				}
				
				if ("|gif|jpg|png|".indexOf("|" + f.toLowerCase() + "|") >= 0) {
					if (!setProcessing()) {
						return;
					}
					
					c.find(".aBtn").css("display", "none");
					c.find("#procpic").css("display", "inline-block");
					this.form.submit();
					$("#uploadDlg").remove();
				} else {
					alert("Unsupported file type");
				}
			}
		}).click();
	}
	
	function setProcessing() {
		if (that.topicId) {
			return true;
		}
		
		if (that.isProcessing) {
			alert("Previous message is being sent");
			return false;
		}
		
		that.isProcessing = true;
		return true;
	}
	
	function handleUploadResult() {
		var s = this.contentWindow.document.body.innerHTML;
		if (isEmpty(s) || (s.indexOf("{") == -1 && s.indexOf("Error") == -1)) {
			return;
		}
		
		var i = s.indexOf("{");
		var j = s.lastIndexOf("}");
		s = s.substring(i == -1 ? 0 : i, j == -1 ? s.length : j+1);
		
		that.isProcessing = false;
		c.find(".aBtn").css("display", "inline-block");
		c.find("#procpic").css("display", "none");
		
		var r = getResult(s, true);
		if (r) {
			that.initMsg = null;
			that.topicId = r;
			if (that.isLastPage) {
				checkNewMsg();
			} else {
				$.post(opt.msgUrl, { userTopicId: that.topicId }, parseResult);
			}
		}
	}
	
	function loadOrders(page){
		var html = '';
		if(!LOGINED){
			html = '<div style="line-height:100px;text-align:center">Please <a style="text-decoration:underline" href="'+APPURL+'/user/login.do?toUrl='+opt.toUrl+'">Sign In or Register</a></div>';
			c.find('#msgMyOrders').html(html);
		}else{
			that.orderLoading = true;
			c.find('#msgMyOrders').after('<div class="order-loading">Loading...</div>');
			$.post(APPURL + '/order/default!myRecentOrderList.do', {page:page}, function(res){
				eval('var result = ' + res);
				eval('var olist = ' + result.data);
				if(olist.length == 0){
					if(page == 1){
						html = '<div style="line-height:100px;text-align:center">No Order Data</div>';
						c.find('#msgMyOrders').html(html);
					}
				}else{
					for(var i = 0; i < olist.length; i++){
						var order = olist[i];
						html += '<div class="msg-order-item clearfix">'+
							'<div class="order-item-content">'+
								'<div class="order-item-top clearfix">' +
									'<div class="order-item-number"><span class="order-item-content-title">'+l_online_talk_number+': </span><a href="'+APPURL+'/order/default!myOrderDetail.do?id='+order.id+'" target="_blank"><b>'+order.number+'</b></a></div>'+
									'<div class="order-item-date"><span style="color:#999;">' + order.date + ' </span></div>'+
								'</div>' +
								'<div class="clearfix">'+
									'<div class="order-item-address"><span class="order-item-content-title">'+l_online_talk_receiver+': </span><span>'+order.receiver+'</span></div>'+
									'<div class="order-item-address"><span class="order-item-content-title">'+l_online_talk_country+': </span><span>'+order.countryName+'</span></div>'+
									'<div class="order-item-address"><span class="order-item-content-title">'+l_online_talk_address+': </span><span>'+order.address+'</span></div>'+
									'<div class="order-item-total"><span class="order-item-content-title">'+l_online_talk_amount+': </span><span style="color:#F23030;">' + order.sign + parseFloat(order.totalAmount).toFixed(2) + ' </span></div>'+
								'</div>'+
							'</div>'+
							'<div class="order-send-btn" rel="'+order.id+'|||'+order.number+'|||'+order.date+'|||'+order.receiver+'|||'+order.countryName+'|||'+order.address+'|||'+order.sign + parseFloat(order.totalAmount).toFixed(2)+'">'+l_online_talk_send+'</div>'+
						'</div>';
					}
					if(that.orderPage == 1){
						c.find('#msgMyOrders').html(html);
					}else{
						c.find('.msg-order-item:last-child').after(html);
					}
					that.orderPage++;
				}
				c.find('.order-loading').remove();
				that.orderLoading = false;
			});
		}
	}

	function loadVistHistory(page){
		var html = '';
		that.vistHistoryLoading = true;
		c.find('#msgVistHistory').after('<div class="visthistory-loading">Loading...</div>');
		$.post(APPURL + '/user/default!historyList.do', {page:page}, function(res){
			eval('var result = ' + res);
			eval('var plist = ' + result.data);
			if(plist.length > 0){
				for(var i = 0; i < plist.length; i++){
					var product = plist[i];
					html += '<div class="msg-visthistory-item clearfix">'+
						'<a class="visthistory-item-img" href="'+APPURL+'/product/'+product.itemNo+'.htm" target="_blank"><span></span><img src="'+opt.productImgUrl+'/'+product.itemNo+'.jpg"></a>'+
						'<div class="visthistory-item-content">'+
							'<div class="visthistory-item-title"><a href="'+APPURL+'/product/'+product.itemNo+'.htm" target="_blank">'+product.title+'</a></div>'+
							'<div class="visthistory-item-price">'+product.sign+product.price+'</div>'+
						'</div>'+
						'<div class="visthistory-send-btn" rel="'+product.itemNo+'">'+l_online_talk_send+'</div>'+
					'</div>';
				}
				if(that.vistHistoryPage == 1){
					c.find('#msgVistHistory').html(html);
				}else{
					c.find('.msg-visthistory-item:last-child').after(html);
				}
				that.vistHistoryPage++;
			}
			c.find('.visthistory-loading').remove();
			that.vistHistoryLoading = false;
		});
	}
	
	this.show = function() {
		var chtml = '<div class="titleBar"><div id="displayName">Connecting...</div></div>'+
			'<div class="clearfix"><table><tr><td>' + 
				'<div style="position:relative" class="msgFrame">'+   
					'<div id="msgWin"></div>'+
					'<div class="msgToolbar">'+
						'<div id="rateBar"></div>' +
						'<div id="pgBar"><input class="tpg" value="1"> / <span class="pc">0</span></div>'+
						'<div class="ClearFloat"></div>'+
					'</div>' +
					'<div class="inputDiv">'+
						'<textarea id="msgInput" maxlength="1024" />'+
						'<div>'+
							'<div class="btnList">' +
								'<a id="aUpImg" class="aBtn" href="javascript:void(0)">'+l_upload_images+'</a>'+
								'<span id="procpic"></span>'+
							'</div>' +
							'<input class="topic-sendmsg-btn" type="button" id="msgBtn" value="'+l_send_message+'" />'+
							'<div class="ClearFloat"></div>'+
						'</div>'+
					'</div>' +
					'<iframe id="uploadFrm" name="u_f_' + that.id + '"/>'+
				'</div></td>';
		if(that.showHistory == "showHistory"){
			chtml += '<td><div class="msgright">'+
				'<div class="msgright-tab clearfix">'+
					'<div class="msgright-tab-title recentview active">'+l_online_talk_recviewed+'</div>'+
					'<div class="msgright-tab-title recentorders">'+l_online_talk_myorders+'</div>'+
				'</div>'+
				'<div id="msgVistHistoryContainer" class="msgright-content"><div id="msgVistHistory" class="clearfix"></div></div>'+
				'<div style="display:none" id="msgMyOrdersContainer" class="msgright-content"><div id="msgMyOrders" class="clearfix"></div></div>'+
			'</div></td>';
		}
					
		chtml += '</tr></table></div>';
		c.html(chtml);
		loadVistHistory(that.vistHistoryPage);
		loadOrders(that.orderPage);
		
		c.find('.recentview').click(function(){
			c.find('.msgright-tab-title').removeClass('active');
			$(this).addClass('active');
			c.find('#msgVistHistoryContainer').show();
			c.find('#msgMyOrdersContainer').hide();
		});
		c.find('.recentorders').click(function(){
			c.find('.msgright-tab-title').removeClass('active');
			$(this).addClass('active');
			c.find('#msgVistHistoryContainer').hide();
			c.find('#msgMyOrdersContainer').show();
		});

		c.find('#msgVistHistoryContainer').scroll(function(){
			var afterScroll = $(this).scrollTop();
			if(afterScroll > that.vistHistoryBeforeScroll && !that.vistHistoryLoading){
				if(435 + $(this).scrollTop() > c.find('#msgVistHistory').height() - 10){
					loadVistHistory(that.vistHistoryPage);
				}
			}
			that.vistHistoryBeforeScroll = afterScroll;
		});
		c.find('#msgMyOrdersContainer').scroll(function(){
			var afterScroll = $(this).scrollTop();
			if(afterScroll > that.orderBeforeScroll && !that.orderLoading){
				if(435 + $(this).scrollTop() > c.find('#msgMyOrders').height() - 10){
					loadOrders(that.orderPage);
				}
			}
			that.orderBeforeScroll = afterScroll;
		});
		c.find("#msgInput").keydown(function(event) {
			if (event.keyCode == 13) {
				var b = event.ctrlKey || event.altKey || event.shiftKey;
				if (!b) {
					event.preventDefault();
				}
			}
		}).keyup(function(event) {
			enableBtn();
			if (event.keyCode == 13) {
				var b = event.ctrlKey || event.altKey || event.shiftKey;
				if (!b && !isEmpty(c.find("#msgInput").val())) {
					c.find("#msgBtn").click();
				}
			}
		}).focus();
		c.off('click','.order-send-btn');
		c.on('click', '.order-send-btn', function(){
			var orderMsg = $(this).attr('rel');
			var digest = orderMsg.length > 45 ? orderMsg.substring(0, 40) + "..." : orderMsg;
			var data = { topicType: that.topicType, topicId: that.topicId, type: "TEXT", content: orderMsg, digest: digest };
			$.ajax({ 
				url: opt.sendUrl, 
				type: "post", 
				async: false, 
				data: data,
				success: function (rspTxt) {
					that.isProcessing = false;
					var r = getResult(rspTxt, true);
					if (r) {
						that.initMsg = null;
						that.topicId = r;
						c.find("#msgInput").val("");
						enableBtn();
						if (that.isLastPage) {
							checkNewMsg();
						} else {
							$.post(opt.msgUrl, { userTopicId: that.topicId }, parseResult);
						}
					}
				}
			 });
		});
		c.off('click','.visthistory-send-btn');
		c.on('click','.visthistory-send-btn',function(){
			var img = $(this).parents('.msg-visthistory-item').find('img').attr('src');
			var title = $(this).parents('.msg-visthistory-item').find('.visthistory-item-title').text();
			var itemNo = $(this).attr('rel');
			var content = "_@#@img" + img + "img@#@" + "_@#@" + title + "@#@" + "_@#@item" + itemNo + "item@#@";
			var digest = content.length > 45 ? content.substring(0, 40) + "..." : content;
			var data = { topicType: that.topicType, topicId: that.topicId, type: "TEXT", content: content, digest: digest };
			$.ajax({ 
				url: opt.sendUrl, 
				type: "post", 
				async: false, 
				data: data,
				success: function (rspTxt) {
					that.isProcessing = false;
					
					var r = getResult(rspTxt, true);
					if (r) {
						that.initMsg = null;
						that.topicId = r;
						c.find("#msgInput").val("");
						enableBtn();
						if (that.isLastPage) {
							checkNewMsg();
						} else {
							$.post(opt.msgUrl, { userTopicId: that.topicId }, parseResult);
						}
					}
				}
			 });
		});
		
		c.find("#msgBtn").click(function() {
			if (!enableBtn()) {
				return;
			}
			
			if (!setProcessing()) {
				return;
			}
			
			var txt = c.find("#msgInput").val();
			var digest = txt.length > 45 ? txt.substring(0, 40) + "..." : txt;
			
			var type;
			var content;
			if (that.initMsg) {
				that.initMsg.TXT = txt;
				type = "MIXED";
				content = JSON.stringify(that.initMsg);
			} else {
				type = "TEXT";
				content = txt;
			}
			
			var data = { topicType: that.topicType, topicId: that.topicId, type: type, content: content, digest: digest };
			var email = $("#userEmail");
			if (email.length > 0) {
				data.email = email.val();
			}
			
			$.ajax({ 
				url: opt.sendUrl, 
				type: "post", 
				async: false, 
				data: data,
				success: function (rspTxt) {
					that.isProcessing = false;
					
					var r = getResult(rspTxt, true);
					if (r) {
						that.initMsg = null;
						that.topicId = r;
						c.find("#msgInput").val("");
						enableBtn();
						if (that.isLastPage) {
							checkNewMsg();
						} else {
							$.post(opt.msgUrl, { userTopicId: that.topicId }, parseResult);
						}
					}
				}
			 });
		});
		
		enableBtn();
		
		c.click(function() { $("#uploadDlg").remove(); closeRatingDlg() });
	
		c.find("#aUpImg").click(showUploadDlg);
		c.find("#uploadFrm").load(handleUploadResult);
		
		$.post(opt.msgUrl, { userTopicId: that.topicId }, parseResult);
		
		var intv = c.attr("intv");
		if (intv) {
			clearInterval(intv);
		}
		
		intv = setInterval(function() {
			if (!that.isLastPage) {
				return;
			}
			
			checkNewMsg();
		}, 5000);
		
		c.attr("intv", intv);
	};
	
}

function MessageFrame(id, topicType, topicId, userId, opt, initMsg) {
	var that = this;
	var c = $(opt.container);
	
	this.id = id;
	this.topicType = topicType;
	this.topicId = topicId;
	this.userId = userId;
	this.initMsg = initMsg;
	this.lastId = 0;
	this.isLastPage = topicId == null;
	
	function parseResult(rspTxt, status) {
		var r = getResult(rspTxt);
		if (r == null) {
			return;
		}
		
		that.topicId = r.contactTopicId;
		
		var k = r.talk;
		var dis;
		if (k.userId > 0) {
			dis = '<a href="' + opt.userUrl + k.userId + '" target="_blank">' + k.userDisplayName + '</a>';
		} else {
			dis = '<span>' + k.userDisplayName;
			if (!isEmpty(k.email)) {
				dis += ' (<a href="mailto:' + k.email + '">' + k.email + '</a>)'
			}
			
			dis += '</span>';
		}
		
		c.find("#displayName").html(dis);
		
		var w = c.find("#msgWin");
		w.html("");
		appendMsgList(w, r.result);
		
		var pg = c.find("#pgBar");
		popPages(pg, r);
		
		pg.find(".apg").click(function() {
			gotoPage($(this).attr("rel"));
		});
		
		pg.find(".tpg").keydown(function(event) {
			if (event.keyCode == 13) {
				gotoPage($(this).val());
			}
		});

		that.isLastPage = (r.page == r.pageCount);
	}
	
	function appendMsgList(w, msgList) {
		var lastId = 0;
		var msgIds = [];
		for (var i = 0; i < msgList.length; i++) {
			var m = msgList[i];
			if (m.id <= that.lastId) {
				continue;
			}
			
			lastId = m.id;
			
			var cls = "msg";
			cls += m.dir > 0 ? " msgIn" : " msgOut";
			
			if (m.unread && m.dir > 0) {
				msgIds.push(m.id);
				cls += " unread";
			}
			
			$('<div class="' + cls + '">' + formatContactMsg(m, opt) + '</div>').appendTo(w);
		}
		
		w.find('.msgOut').off('mouseenter').on('mouseenter', function(){
			$(this).find('.callbackbtn').show();
		});
		
		w.find('.msgOut').off('mouseleave').on('mouseleave', function(){
			$(this).find('.callbackbtn').hide();
		});
		
		w.find('.callbackbtn').off('click').on('click', function(){
			var msgid = $(this).attr('rel');
			var self = $(this);
			if(confirm('ÃƒÂ§Ã‚Â¡Ã‚Â®ÃƒÂ¥Ã‚Â®Ã…Â¡ÃƒÂ¨Ã‚Â¦Ã‚ÂÃƒÂ¦Ã¢â‚¬â„¢Ã‚Â¤ÃƒÂ¥Ã¢â‚¬ÂºÃ…Â¾ÃƒÂ¨Ã‚Â¯Ã‚Â¥ÃƒÂ¦Ã‚ÂÃ‚Â¡ÃƒÂ¤Ã‚Â¿Ã‚Â¡ÃƒÂ¦Ã‚ÂÃ‚Â¯ÃƒÂ¥Ã‚ÂÃ¢â‚¬â€ÃƒÂ¯Ã‚Â¼Ã…Â¸')){
				$.post('talk!callback.do?messageIds='+msgid, {}, function(){
					self.parents('.msgOut').remove();
				});
			}
		});
		
		if (msgList.length > 0) {
			w.scrollTop(w[0].scrollHeight);
		}
		
		if (msgIds.length > 0) {
			$.post(opt.readUrl, { topicId: that.topicId, messageIds: msgIds });
		}
		
		if (lastId > that.lastId) {
			that.lastId = lastId;
		}
	}
	
	function checkNewMsg() {
		$.post(opt.msgUrl, { contactTopicId: that.topicId, startId: that.lastId }, function(rspTxt, status) {
				var r = getResult(rspTxt);
				if (r == null) {
					return;
				}
		
				var w = c.find("#msgWin");
				appendMsgList(w, r.result);
			});
	}
	
	function enableBtn() {
		c.find("#msgBtn").attr("disabled", isEmpty(c.find("#msgInput").val()));
	}
	
	function gotoPage(page) {
		that.lastId = 0;
		$.post(opt.msgUrl, { contactTopicId: that.topicId, page: page }, parseResult);
	}
	
	function showUploadDlg(event) {
		stopBubble(event);
		
		$("#uploadDlg").remove();
		$('<div id="uploadDlg"><form action="' + opt.sendUrl + '" method="post" enctype="multipart/form-data" target="u_f_' + that.id + 
				'"><input id="fileSel" type="file" name="imgs" value="Upload" /> ' +
				'[ <a id="closeDlg" href="javascript:void(0)">Close</a> ]' +
				'<input type="hidden" name="type" value="MIXED" /><input type="hidden" id="content" name="content" />' +
				'<input type="hidden" name="topicType" value="' + esc(that.topicType) +'" />' +
				'<input type="hidden" name="topicId" value="' + (that.topicId ? that.topicId : "") +'" /></form>' +
				'(' + l_online_talk_file_limit + ')</div>').appendTo(document.body);
				
		var dlg = $("#uploadDlg");
		if (that.initMsg) {
			dlg.find("#content").val(JSON.stringify(that.initMsg));
		}
		
		var a = c.find("#aUpImg");
		var o = a.offset();
		dlg.css("left", o.left).css("top", o.top - dlg.height());
		
		dlg.find("#closeDlg").click(function() { $("#uploadDlg").remove(); });
		dlg.find("#fileSel").change(function() {
			var f = $(this).val();
			if (!isEmpty(f)) {
				var p = f.lastIndexOf(".");
				if (p > 0) {
					f = f.substring(p + 1);
				}
				
				if ("|gif|jpg|png|".indexOf("|" + f.toLowerCase() + "|") >= 0) {
					if (!setProcessing()) {
						return;
					}
					
					c.find(".aBtn").css("display", "none");
					c.find("#procpic").css("display", "inline-block");
					this.form.submit();
					$("#uploadDlg").remove();
				} else {
					alert("Unsupported file type");
				}
			}
		}).click();
	}
	
	function setProcessing() {
		if (that.topicId) {
			return true;
		}
		
		if (that.isProcessing) {
			alert("Previous message is being sent");
			return false;
		}
		
		that.isProcessing = true;
		return true;
	}
	
	function handleUploadResult() {
		var s = this.contentWindow.document.body.innerHTML;
		if (isEmpty(s)) {
			return;
		}
		
		that.isProcessing = false;
		c.find(".aBtn").css("display", "inline-block");
		c.find("#procpic").css("display", "none");
					
		var r = getResult(s, true);
		if (r) {
			that.initMsg = null;
			that.topicId = r;
			if (that.isLastPage) {
				checkNewMsg();
			} else {
				$.post(opt.msgUrl, { contactTopicId: that.topicId }, parseResult);
			}
		}
	}
	
	this.show = function() {
		c.html('<div class="titleBar"><div id="displayName">Connecting...</div></div><div class="msgFrame">' + 
			'<div id="msgWin"></div><div class="msgToolbar">' +
			'<div id="pgBar" align="right"><input class="tpg" value="1"> / <span class="pc">0</span></div><div class="ClearFloat"></div></div>' +
			'<div class="inputDiv"><textarea id="msgInput" /><div><div class="btnList">' +
			'<a id="aUpImg" class="aBtn" href="javascript:void(0)">'+l_upload_images+'</a><span id="procpic"></span></div>' +
			'<input class="topic-sendmsg-btn" type="button" id="msgBtn" value="'+l_send_message+'" /><div class="ClearFloat"></div></div></div>' +
			'<iframe id="uploadFrm" name="u_f_' + that.id + '"/></div>');
		
		c.find("#msgInput").keydown(function(event) {
			if (event.keyCode == 13) {   
				var b = event.ctrlKey || event.altKey || event.shiftKey;
				if (!b) {
					event.preventDefault();
				}
			}
		}).keyup(function(event) {
			enableBtn();
			if (event.keyCode == 13) {
				var b = event.ctrlKey || event.altKey || event.shiftKey;
				if (!b && !isEmpty(c.find("#msgInput").val())) {
					c.find("#msgBtn").click();
				}
			}
		}).focus();

		c.find("#msgBtn").click(function() {
			if (!setProcessing()) {
				return;
			}
			
			var txt = c.find("#msgInput").val();
			var digest = txt.length > 45 ? txt.substring(0, 40) + "..." : txt;
			
			var type;
			var content;
			if (that.initMsg) {
				that.initMsg.TXT = txt;
				type = "MIXED";
				content = JSON.stringify(that.initMsg);
			} else {
				type = "TEXT";
				content = txt;
			}
			
			$.ajax({ 
				url: opt.sendUrl, 
				type: "post", 
				async: false, 
				data: { topicType: that.topicType, topicId: that.topicId, userId: that.userId, type: type, content: content, digest: digest },
				success: function (rspTxt) {
							that.isProcessing = false;
					
							var r = getResult(rspTxt);
							if (r) {
								that.initMsg = null;
								that.topicId = r;
								c.find("#msgInput").val("");
								enableBtn();
								if (that.isLastPage) {
									checkNewMsg();
								} else {
									$.post(opt.msgUrl, { contactTopicId: that.topicId }, parseResult);
								}
							}
						}
			 });
		});

		enableBtn();
		
		c.click(function() { $("#uploadDlg").remove(); });
		
		c.find("#aUpImg").click(showUploadDlg);
		c.find("#uploadFrm").load(handleUploadResult);
		
		$.post(opt.msgUrl, { contactTopicId: that.topicId, userId: that.userId }, parseResult);
		
		var intv = c.attr("intv");
		if (intv) {
			clearInterval(intv);
		}
		
		intv = setInterval(function() {
			if (!that.isLastPage) {
				return;
			}
			
			checkNewMsg();
		}, 5000);
		
		c.attr("intv", intv);
	};
	
}