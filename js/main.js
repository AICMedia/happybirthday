$(document).ready(function() {
    $('#fullpage').fullpage({
        anchors:['slide1', 'slide2', 'slide3', 'slide4', 'slide5', 'slide6', 'slide7', 'slide8' ],
        sectionsColor: ['#ff5', '#4BBFC3', '#7BAABE', '#01c86d', '#f8a109', '#4BBFC3', '#7BAABE', '#f8a109'],
    });
	
    $('#cake').click(function(){
    	setTimeout(function(){
    		$('.anton-face').fadeIn('slow');
    	},200)
    	
    })

});