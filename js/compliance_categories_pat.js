$(document).ready(function(){
	$("#chart_name").text("Patient assessment of Compliance rates in categories");

    var barPadding = 20;
    var margin = {top: 50,bottom: 50,left:120,right:120};
    var w = $("body").width() - margin.left - margin.right;
    var h = 700 - margin.top - margin.bottom;

    var svg = d3.select("div#svg")
            .append("svg")
            .attr("width", w + margin.left + margin.right)
            .attr("height", 700);

	d3.tsv("data/localDENovartis_Apps_Compliance-20_Categories_Pat.txt", function(error, data) {

		var maximum = d3.max(data, function(d) { return Number(d["fair compliance"]); })+d3.max(data, function(d) { return Number(d["over compliance"]); })+d3.max(data, function(d) { return Number(d["low compliance"]); });
		//console.log(maximum);
		maximum = Math.ceil(maximum/1000)*1000;

	    var xScale = d3.scale.linear()
	                 .domain([0,maximum])
	                 .rangeRound([0,w]);


	    var x_right = d3.scale.linear()
	                 .domain([0,maximum])
	                 .rangeRound([0,w]);
	    var xAxis_right = d3.svg.axis()
	                  .scale(x_right)
	                  .orient("bottom")
	                  .ticks(5)
	                  .outerTickSize(0);


	    var y = d3.scale.ordinal()
			    .domain(data.map(function(d){return d["Market Segments"].toLowerCase()}))
			    .rangeRoundBands([0,h]);
	    var yAxis = d3.svg.axis()
				    .scale(y)
				    .orient("left");

		// draw axis
	    svg.append("g")
	    	.attr("class", "axis")
	    	.attr("transform", "translate("+ margin.left +"," + (h+margin.top) + ")")
	    	.transition()
		    .duration(500)
	    	.call(xAxis_right)
	    	.selectAll("text")
		    .attr("y", 20);

	   	svg.append("g")
		    .attr("class","axis yaxis")
		    .attr("transform", "translate(" + margin.left + ","+ (margin.top)+")")
		    .transition()
		    .duration(500)
		    .call(yAxis);

		// draw background axis
		var backgroundxAxis = svg.selectAll("body")
  						.data(data)
  						.enter()
  						.append("g");

		backgroundxAxis.attr("class","backgroundAxis")
						.append("line")
						.attr("opacity",0)
						.transition()
				    	.duration(500)
				    	.attr("opacity",1)
						.attr('y1',function(d,i){
							return 0.5*(h / data.length - barPadding) + i*(barPadding+(h / data.length - barPadding))+margin.top;
						})
						.attr('x1',margin.left)
						.attr("y2", function(d,i){
							return 0.5*(h / data.length - barPadding) + i*(barPadding+(h / data.length - barPadding))+margin.top;
						})
						.attr('x2',w + margin.left);

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
		   		return margin.left;
		   })
		   .attr("y", function(d,i) {
		        return h / data.length * i +margin.top;
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
		   		return　margin.left+xScale(d["low compliance"]);
		   })
		   .attr("y", function(d,i) {
		        return h / data.length * i +margin.top;
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
		   		return　margin.left+xScale(d["low compliance"])+xScale(d["fair compliance"]);
		   })
		   .attr("y", function(d,i) {
		        return h / data.length * i +margin.top;
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
									+"<td class='value'>"+d["low compliance"]+"</td>"
								+"</tr>"
								+"<tr>"
									+"<td><span class='color fair_compliance'></span><span>fair compliance</span></td>"
									+"<td class='value'>"+d["fair compliance"]+"</td>"
								+"</tr>"
								+"<tr>"
									+"<td><span class='color over_compliance'></span><span>over compliance</span></td>"
									+"<td class='value'>"+d["over compliance"]+"</td>"
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
        url : "data/localDENovartis_Apps_Compliance-20_Categories_Pat.txt",
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