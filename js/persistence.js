function drawPersistence(number){

	var margin = {top:30,bottom:30,left:50,right:200}
	var w = 1200 - margin.left - margin.right;
	var h = 650 - margin.top - margin.bottom;

	var svg = d3.select("div#svg")
	        .append("svg")
	        .attr("width", w + margin.left + margin.right)
	        .attr("height", h + margin.top + margin.bottom);

	var dataSet = [];
	var maximum = 0;
	var color = d3.scale.category10();
	var legend;
	var xScale, xAxis, yScale, yAxis;

	d3.tsv("data/Persistence_"+number+"_localDENovartis_Apps_Persistence-19_.txt", function(error, data) {
		//console.log(data);

		var dataObject = [];
		for(var i = 0; i < data.length; i++){
			var j = 0;
			dataObject = [];
			for( item in data[i] ){
				dataObject.push({"index": item , "number":Number(data[i][item])});
				if(maximum < Number(data[i][item])){
					maximum = Number(data[i][item]);
				}
			}
			dataObject.pop();
			var marketSegment = data[i]["Market Segments"];
			dataSet.push({"MarketSegment":marketSegment,"values":dataObject});
		}

		// draw legends
		legend = svg.selectAll("g.legend")
							.data(dataSet)
							.enter()
							.append("g")
							.attr("class","legend");
		legend.append("rect")
				.attr("stroke",function(d,i){
					return color(d.MarketSegment);
				})
				.attr("fill",function(d,i){
					return color(d.MarketSegment);
				})
				.attr("x",w+margin.left+margin.right-120)
				.attr("y",function(d,i){
					return margin.top+20*i;
				})
				.attr("width",20)
				.attr("height",10)
				.on("click",function(d){
					var thisColor = color(d.MarketSegment);
					if($(this).attr("fill")=="white"){
						$(this).attr("fill",thisColor);
					}
					else{
						$(this).attr("fill","white");
					}
					svg.selectAll(".line").remove();
					
					updateData(data);
					drawLine();
					drawTooltip();
				});

		legend.append("text")
				.attr("x",w+margin.left+margin.right-90)
				.attr("y",function(d,i){
					return margin.top+20*i;
				})
				.attr("dominant-baseline","hanging")
				.text(function(d,i){
					return d.MarketSegment;
				})

		xScale = d3.scale.linear()
						.domain([0,12])
						.range([0,w]);

	    xAxis = d3.svg.axis()
	                  .scale(xScale)
	                  .orient("bottom");



	    //maximum = Math.ceil(maximum/100)*100;
		yScale = d3.scale.linear()
			    .domain([0,maximum])
			    .rangeRound([h,0]);
	    yAxis = d3.svg.axis()
				    .scale(yScale)
				    .orient("left");

		// draw axis
	    svg.append("g")
	    	.attr("class", "axis no_line_axis")
	    	.attr("transform", "translate("+ margin.left +"," + ( h + margin.top ) + ")")
	    	.transition()
		    .duration(500)
	    	.call(xAxis);

	   	svg.append("g")
		    .attr("class","axis yAxis")
		    .attr("transform", "translate(" + margin.left + ","+ margin.top +")")
		    .transition()
		    .duration(500)
		    .call(yAxis);

		drawLine();
	    drawTooltip();

		

	});



	// update dataSet
	function updateData(data){
		// check which legends being selected
		var selectedLegends = [];
		legend.selectAll("rect").each(function(d,i){
			if($(this).attr("fill")!="white")
				selectedLegends.push(d);
		});
		//console.log(selectedLegends);
		dataSet = [];
		maximum = 0;
		var dataObject = [];
		for(var i = 0; i < data.length; i++){
			dataObject = [];
			var marketSegment = data[i]["Market Segments"];
			for(var n = 0;n<selectedLegends.length;n++){
				if(marketSegment == selectedLegends[n].MarketSegment){
					for( item in data[i] ){
						dataObject.push({"index": item , "number":Number(data[i][item])});
						if(maximum < Number(data[i][item])){
							maximum = Number(data[i][item]);
						}
					}			
				}	
			}
			dataObject.pop();
			if(dataObject.length>0){
				dataSet.push({"MarketSegment":marketSegment,"values":dataObject});
			}
		}
		//maximum = Math.ceil(maximum/100)*100;
		//console.log(dataSet)
	}

	// draw line
	function drawLine(){
		yScale = d3.scale.linear()
			    .domain([0,maximum])
			    .rangeRound([h,0]);
	    yAxis = d3.svg.axis()
				    .scale(yScale)
				    .orient("left");
		svg.select("g.axis.yAxis") 
			 	.transition()
	            .duration(500)
	            .call(yAxis);



		// draw line
		var line = d3.svg.line()
				    .x(function(d) { return xScale(d.index); })
				    .y(function(d) { return yScale(d.number); });
				    //.interpolate("basis");

		

		var itemLine = svg.selectAll("path.line")
				      .data(dataSet)
				   	  .enter()
				   	  .append("path");

	 
	    itemLine.attr("class", "line")
		      .attr("d", function(d) { return line(d.values); })
		      .attr("transform", "translate("+ margin.left +"," + margin.top + ")")
		      .style("stroke", function(d) {return color(d.MarketSegment); });


		// line animation
	    for(var i = 0;i<itemLine[0].length;i++){
	    	d3.select(itemLine[0][i])
	     		.attr("stroke-dasharray", itemLine[0][i].getTotalLength() + " " + itemLine[0][i].getTotalLength() ) 
	      		.attr("stroke-dashoffset", itemLine[0][i].getTotalLength())
	      		.transition()
		        .duration(500)
		        .ease("linear")
		        .attr("stroke-dashoffset", 0);
	    }

	}

	// draw tooltip
	function drawTooltip(){
		svg.selectAll("circle").remove();
		svg.selectAll(".vertical_line").remove();
		svg.selectAll("rect.bg_rect").remove();
		$("div.tooltip tbody").html("");
		// tooltip
		bisectDate = d3.bisector(function(d) { return d.index; }).left;
		// console.log(dataSet)
		//var lineSvg = svg.append("g");
		var focus = svg.selectAll('svg')
						.data(dataSet)
						.enter()
						.append("circle") 
				        .attr("fill", function(d) { return color(d.MarketSegment); })
				        .attr("r", 4)
				        //.attr("transform","translate(0,0)")
				        .attr("display", "none")
				        .attr("name",function(d) { return d.MarketSegment; });

		svg.selectAll("circle")
					.attr("transform", function(d){
						return "translate(" + (margin.left+xScale(d.values.index)) + "," + (margin.top+yScale(d.values.number)) + ")";
					}); 

			var verticalLine = svg.append("line")
									.attr("class","vertical_line")
									.attr("stroke-dasharray",10)
									.attr("stroke","#a6a8ac")
									.attr("stroke-width", 0.8)
									.attr("display","none");

		svg.append("rect")
			.attr("class",'bg_rect')
	        .attr("width", w)
	        .attr("height", h)
	        .attr("fill", "none")
	        .attr("pointer-events", "all")
	        .attr("transform","translate("+margin.left+","+margin.top+")")
	        .on("mouseover", function() { 
	        	focus.attr("display", null); 
	        	verticalLine.attr("display",null);
	        	tooltip.style("left", (d3.event.pageX) + "px")
						.style("top", (d3.event.pageY + 20) + "px")
						.style("opacity",1.0);
	        })
	        .on("mouseout", function() { 
	        	focus.attr("display", "none"); 
	        	verticalLine.attr("display","none");
	        	tooltip.style("opacity",0.0);
	        })
	        .on("mousemove", function(){
	        	var x0 = xScale.invert(d3.mouse(this)[0]);

			   	// draw circles
			    var itemPointSet = [];
			    for(key in dataSet){
			    	var datum = dataSet[key].values;
			    	var i = bisectDate(datum, x0, 1);
			    	var d0 = datum[i - 1],
			    	d1 = datum[i];
			    	d = x0 - d0.index > d1.index - x0 ? d1 : d0;
			    	itemPointSet.push(d);

			    }
			    //console.log(itemPointSet)

			    var itemInfoSet=[];// combine color and date, number in an array
	  			var circleColor;
	  			var circleName;

	  			$("circle").each(function(i){
	  				$(this).attr("transform","translate(" + (margin.left+xScale(itemPointSet[i].index)) + "," +  (margin.top+yScale(itemPointSet[i].number)) + ")");
	  				circleColor = $(this).attr("fill");
	  				circleName = $(this).attr("name");
	  				itemInfoSet.push({"color":circleColor,"name":circleName,"number":itemPointSet[i].number}); 
	  			});

	  			// sort JSON for tooltip box
				itemInfoSet.sort(function(a,b){
					// descending
					return b.number-a.number;
				})
				//console.log(itemInfoSet);

				// append to tooltip
				tooltipSelect.html("");
				//tooltipSelect.append("<tr><td>"+itemInfoSet[0].index+"</td></tr>");
				for(var i=0;i<itemInfoSet.length;i++){
					tooltipSelect.append("<tr><td><span class='color' style='background-color:"+itemInfoSet[i].color+"'></span><span>"+ itemInfoSet[i].name +"</span></td><td class='value'>"+itemInfoSet[i].number+"</td></tr>");
				}
	  			

	      		// draw vertical line
			   	verticalLine.attr('x1',margin.left+xScale(itemPointSet[0].index))
			   				.attr('x2',margin.left+xScale(itemPointSet[0].index))
			   				.attr('y1',margin.top)
			   				.attr('y2',h+margin.top);


				tooltip.style("left", (d3.event.pageX) + "px")
							.style("top", (d3.event.pageY + 20) + "px");
	        });


	    	// tooltip box
		   	var tooltip = d3.select("body")
							.append("div")
							.attr("class","tooltip")
							.style("opacity",0.0);	
			var tooltipHTML = "<table><tbody></tbody></table>";
			tooltip.html(tooltipHTML);
			var tooltipSelect = $("div.tooltip tbody");




	}





	// import data from txt
	$.ajax({
	    url : "data/Persistence_"+number+"_localDENovartis_Apps_Persistence-19_.txt",
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
}
