(function($){
	
	$('li').hover(
		function() {
			var $el = $(this)
			,	el_pos = $el.position()
			,	word = $el.text()
			,	el_height = $el.outerHeight(true)
			,	el_width = $el.width()
			,	pluralizer
			,	popover_height
			,	y
			,	left = el_pos.left + 50 + 'px'
			,	url = '/words/' + word + '.json';
		
			pluarlizer = function(num, word) {
				word = num === 1 ? word : word + 's';
				return num + ' ' + word;
			};
					
		
			$.getJSON(url, function(data) {
							
				$('#popover-text').html([
					'<h1>' + data.word + '</h1>',
					'<ul>',
					'	<li>Added by ' + data.addedby + ' on ' + data.created.str + '</li>',
					'	<li>Last used on ' + data.lastused.str + '</li>',
					'	<li>Used ' + pluarlizer(data.usagecount, 'time') + '</li>',
					'</ul>'
				].join(''));
			
				var popover_position = function() {
					var y = el_pos.top - $('#popover').height()
					,	scrolltop = $(window).scrollTop()
					,	position;
				
					if (y < scrolltop) {
						position = 'below';
					} else if (y > 0) {
						position = 'above';
					}
					return position;
				}();
			
				// var up_down = position === 'above' ? 'down' : 'up';
			
				$('#popover-arrow-border, #popover-arrow').removeClass();
			
				if (popover_position === 'above')  {
					$('#popover-arrow-border, #popover-arrow').addClass('down');
					$('#popover').css({
						top: ((el_pos.top - $('#popover').height())-20) +'px'
					});
				} else {
					$('#popover-arrow-border, #popover-arrow').addClass('up');
					$('#popover').css({
						top: (el_pos.top + el_height - 23) + 'px'
					});
				}
				
				window.setTimeout(function() {$('#popover').css({left: left}).fadeIn();}, 500);
			});
		},
		function(e) {
			$('#popover').css({
				left: '-999999px',
				top: '-999999px'
			}).hide();
		}
	);
	
})(jQuery);