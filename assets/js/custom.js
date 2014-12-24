

// Used for getting the query string
(function($) {
    $.QueryString = (function(a) {
        if (a == "") return {};
        var b = {};
        for (var i = 0; i < a.length; ++i)
        {
            var p=a[i].split('=');
            if (p.length != 2) continue;
            b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
        }
        return b;
    })(window.location.search.substr(1).split('&'))
})(jQuery);

//used for serializing forms. Useful for translation Form->Json
$.fn.serializeObject = function()
{
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

//adds submit button and
(function ( $ ) {
    $.fn.autopost = function() {
    	
    	//add default fields
    	var dateInput = $('<label for="date">Date:</label><input type="date" name="date" id="date" value=""><br/>');
    	var commentInput = $('<label for="comment">Comment:</label><textarea name="comment" id="comment" value=""></textarea><br/>');
    	var submitButton = $('<a id="submit" class="ui-shadow ui-btn ui-corner-all" data-icon="check" href="#">Submit</a>');
    	var satisfactionGroup = $('<fieldset data-role="controlgroup" data-type="horizontal"><legend>Feeling:</legend>' +
    			'<input type="radio" name="feeling" id="good" value="good" /><label for="good">&nbsp;(ʘ‿ʘ)&nbsp;</label>' +
    			'<input type="radio" name="feeling" id="average" value="average" /><label for="average">&nbsp;(◕_◕)&nbsp;</label>' +
    			'<input type="radio" name="feeling" id="bad" value="bad"><label for="bad">&nbsp;(◉︵◉)&nbsp;</label></fieldset><br/>'); 
    	this.prepend(dateInput);
    	this.append(satisfactionGroup);
    	this.append(commentInput);
    	this.append(submitButton);
    	
    	var popup = $('<div data-role="popup" id="popupResult" data-overlay-theme="a" data-theme="b" class="ui-content">All ok go <a href="../index.html" data-ajax="false">back</a></div>');
    	$('body').append(popup);
    	
    	//set date
    	var date = new Date();
    	var year = date.getFullYear();
    	var month = (1 + date.getMonth()).toString();
    	month = month.length > 1 ? month : '0' + month;
    	var day = date.getDate().toString();
    	day = day.length > 1 ? day : '0' + day;
    	var dateString = year + '-' + month + '-' + day;
    	
    	$('input[type="date"]').val(dateString);
    	
    	//restart the styles for the dynamically added componenets
    	this.trigger("create");
    	
    	var that = this;
    	$(this).on('click', "#submit", function() {
    		var formObject = that.serializeObject()
    		formObject.tag = that.data('tag');
    		var data = JSON.stringify(formObject);
    		var apiKey = $.QueryString["apiKey"];
    		
    		var url = "https://api.mongolab.com/api/1/databases/" + that.data('database') + "/collections/" + that.data('collection') + "?apiKey=" + apiKey;
    		console.log(url);
    		$.ajax( { url: url,
    			  data: data,
    			  type: "POST",
    			  contentType: "application/json" } )
    			  .done(function( data ) {
    				 $("#popupResult").popup().popup("open");  
				    });
    		return false;
    	});
    };
}( jQuery ));

function dateToString(date) {
	var m_names = new Array("Јануари", "Февруари", "Март", 
			"Април", "Мај", "Јуни", "Јули", "Август", "Септември", 
			"Октомври", "Ноември", "Декември");
	
	var d_names = new Array("Недела", "Понеделник", "Вторник", "Среда", 
			"Четврток", "Петок", "Сабота");
	var day_month = date.getDate();
	var month = date.getMonth();
	var year = date.getFullYear();
	var day_week = date.getDay();
	return d_names[day_week] + ", " + day_month + " " + m_names[month]	+ ", " + year;
}
//********************************************************
//********************************************************
//********************************************************
$().ready(function() {
	//append footer
	$("#footer").load("../assets/snippets/footer.html");
	//make each form autopost
	$('form[data-type="autopost"]').autopost();
	
	//append api key to each link
	var apiKey = $.QueryString["apiKey"];
	$("a").each(function() {
  	  var _href = $(this).attr("href");
  	  if (_href.indexOf("#") != 0) {
  		  $(this).attr("href", _href + '?apiKey=' + apiKey);
  	  }
  	});
	
});
