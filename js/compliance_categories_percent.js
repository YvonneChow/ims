$(document).ready(function(){

    var w = 1000;
    var h = 580;
    var barPadding = 20;
    var topSpacing = 80;
    var leftSpacing = 80;

    var svg = d3.select("div#svg")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

	d3.tsv("data/localDENovartis_Apps_Compliance-20_Categories_Percent.txt", function(error, data) {

		var maximum = 1;

	    var xScale = d3.scale.linear()
	                 .domain([0,maximum])
	                 .rangeRound([0,(w-leftSpacing)]);


	    var x_right = d3.scale.linear()
	                 .domain([0,maximum])
	                 .rangeRound([0,(w-leftSpacing)]);
	    // var xAxis_right = d3.svg.axis()
	    //               .scale(x_right)
	    //               .orient("bottom")
	    //               .ticks(5);


	    var y = d3.scale.ordinal()
			    .domain(data.map(function(d){return d["Market Segments"].toLowerCase()}))
			    .rangePoints([0,h-topSpacing-barPadding],1);
	    var yAxis = d3.svg.axis()
				    .scale(y)
				    .orient("left");

		// draw axis
	    // svg.append("g")
	    // 	.attr("class", "axis")
	    // 	.attr("transform", "translate("+leftSpacing+"," + (h-barPadding) + ")")
	    // 	.transition()
		   //  .duration(500)
	    // 	.call(xAxis_right);
	   	svg.append("g")
		    .attr("class","axis yaxis")
		    .attr("transform", "translate(" + leftSpacing + ","+topSpacing+")")
		    .transition()
		    .duration(500)
		    .call(yAxis);


		// draw rect
		var rect = svg.selectAll("body")
						.data(data)
		   				.enter()
		   				.append("g")
		   				.attr("class","item");

		rect.append("rect")
			.attr("class",'low_compliance')
			.attr("width",0)
		   .transition()
		   .duration(250)
		   .ease("swing")
		   .delay(function(d,i){
		   		return 50*i;
		   })
		   .attr("x", function(d,i){
		   		return leftSpacing;
		   })
		   .attr("y", function(d,i) {
		        return (h-barPadding-topSpacing) / data.length * i +topSpacing;
		   })
		   .attr("height", h / data.length - barPadding)
		   .attr("width", function(d,i){
		   		return xScale(d["low compliance"]);
		   });

	    rect.append("rect")
	       .attr("class",'fair_compliance')
	       .attr("width",0)
		   .transition()
		   .duration(250)
		   .ease("swing")
		   .delay(function(d,i){
		   		return 250+50*i;
		   })
		   .attr("x", function(d,i){
		   		return　leftSpacing+xScale(d["low compliance"]);
		   })
		   .attr("y", function(d,i) {
		        return (h-barPadding-topSpacing) / data.length * i +topSpacing;
		   })
		   .attr("height", h / data.length - barPadding)
		   .attr("width", function(d,i){
		   		return xScale(d["fair compliance"]);
		   });


		rect.append("rect")
			.attr("class",'over_compliance')
			.attr("width",0)
		   .transition()
		   .duration(250)
		   .ease("swing")
		   .delay(function(d,i){
		   		return 250*2+50*i;
		   })
		   .attr("x", function(d,i){
		   		return　leftSpacing+xScale(d["low compliance"])+xScale(d["fair compliance"]);
		   })
		   .attr("y", function(d,i) {
		        return (h-barPadding-topSpacing) / data.length * i +topSpacing;
		   })
		   .attr("height", h / data.length - barPadding)
		   .attr("width", function(d,i){
		   		return xScale(d["over compliance"]);
		   });


		// tooltip
		var tooltip = d3.select("body")
							.append("div")
							.attr("class","tooltip")
							.style("opacity",0.0);	
		
		rect.on("mouseover",function(d){

			var tooltipHTML = "<table><tbody><tr>"
									+"<td><span class='color low_compliance'></span><span>low compliance</span></td>"
									+"<td class='value'>"+(Number(d["low compliance"])*100).toFixed(1)+"%"+"</td>"
								+"</tr>"
								+"<tr>"
									+"<td><span class='color fair_compliance'></span><span>fair compliance</span></td>"
									+"<td class='value'>"+(Number(d["fair compliance"])*100).toFixed(1)+"%"+"</td>"
								+"</tr>"
								+"<tr>"
									+"<td><span class='color over_compliance'></span><span>over compliance</span></td>"
									+"<td class='value'>"+(Number(d["over compliance"])*100).toFixed(1)+"%"+"</td>"
								+"</tr>"
						   +"</tbody></table>";

			tooltip.html(tooltipHTML)
					.style("left", (d3.event.pageX + 20) + "px")
					.style("top", (d3.event.pageY) + "px")
					.style("opacity",1.0);
			})
			.on("mousemove",function(d){
				tooltip.style("left", (d3.event.pageX + 20) + "px")
						.style("top", (d3.event.pageY) + "px");
			})
			.on("mouseout",function(d){			
				tooltip.style("opacity",0.0);
			});


		// // draw label
		// var labelSet = ["low compliance","fair compliance","over compliance"];
  // 		var label = svg.selectAll("body")
  // 						.data(labelSet)
  // 						.enter()
  // 						.append("g")
		//    				.attr("class","label");

		// label.append("rect")
		// 		.attr('class','label')
		// 		.attr("opacity",0)
		// 		.transition()
		//     	.duration(500)
		//     	.attr("opacity",1)
		// 		.attr("x",function(d,i){return w-(labelSet.length - i)*135;})
		// 		.attr("y", topSpacing/2-13)
		// 		.attr("width",14)
		// 		.attr("height",14)
		// 		.attr("class",function(d){return d.replace(' ','_');});
		// label.append("text")
		// 		.attr("class","label_text")
		// 		.attr("opacity",0)
		// 		.transition()
		//     	.duration(500)
		//     	.attr("opacity",1)
		// 		.attr("x",function(d,i){return w-(labelSet.length - i)*135+20;})
		// 		.attr("y", topSpacing/2)
		// 		.text(function(d){return d;});

	});



	// import data from txt
	$.ajax({
        url : "data/localDENovartis_Apps_Compliance-20_Categories_Percent.txt",
        //dataType: "text",
        success : function (data) {
        	var html="";
            var tr = data.split("\n");
            for(var i = 0;i<tr.length;i++){
            	var td = tr[i].split("\t");
            	// table head
            	if(i==0){
            		for(var j = 0; j< td.length;j++){
	            		html = html+"<th>"+td[j]+"</th>";
	            	}
	            	$("table thead").append("<tr>"+html+"</tr>");
            	}
            	// table data
            	else{
            		for(var j = 0; j< td.length;j++){
	            		html = html+"<td>"+td[j]+"</td>";
	            	}
	            	$("table tbody").append("<tr>"+html+"</tr>");
	            	}
            	html = "";
            }

        }
    });
  
});