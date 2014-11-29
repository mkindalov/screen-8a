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
$().ready(function() {
	$('form[data-type="autopost"]').autopost();
});


(function ( $ ) {
    $.fn.autopost = function( options ) {
        var settings = $.extend({
        }, options );
        
        var submitButton = $('<a id="submit" class="ui-shadow ui-btn ui-corner-all" data-icon="check" href="#">Submit</a>');
    	this.append(submitButton).end();
    	
    	var apiKey = $.QueryString["apiKey"];
    	
    	$("a").each(function() {
    	  var _href = $(this).attr("href");
    	  if (_href != "#") {
    		  $(this).attr("href", _href + '?apiKey=' + apiKey);
    	  }
    	});
    	
    	var that = this;
    	
    	$(this).on('click', "#submit", function() {
    		var frm = $('form');
    		var data = JSON.stringify(frm.serializeObject());
    		var apiKey = $.QueryString["apiKey"];
    		
    		var url = "https://api.mongolab.com/api/1/databases/" + that.data('database') + "/collections/" + that.data('collection') + "?apiKey=" + apiKey;
    		console.log(url);
    		$.ajax( { url: url,
    			  data: data,
    			  type: "POST",
    			  contentType: "application/json" } )
    			  .done(function( data ) {
				    alert("ok");
				    });
    		return false;
    	});
    };
}( jQuery ));