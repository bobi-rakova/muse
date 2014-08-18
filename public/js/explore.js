$(function(){
	function loadItems() {
		$.get("/get-all", function(res, err){
			console.log(res)

			var jobs = []
			for(var i=0; i<res.length; i++)
				jobs.push(JSON.parse(res[i]))
			
			var objects = {items: jobs}
			var template = $('#template').html();
			// Mustache.parse(template);
			var rendered = Mustache.render(template, objects);
			$('#target').html(rendered);
		})
	}
	loadItems()
})