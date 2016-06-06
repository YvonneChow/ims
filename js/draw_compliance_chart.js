var barPadding = 20;
var margin = {top: 50,bottom: 50,left:120,right:300};
var w = $("body").width() - margin.left - margin.right;
var h = 700 - margin.top - margin.bottom;

var svg = d3.select("div#svg")
        .append("svg")
        .attr("width", w + margin.left + margin.right)
        .attr("height", 700);

function compliance_patientInCategory(){
	svg.selectAll("*").remove();

	// draw legends
	var labelSet = [{"name":"low compliance","color":"#fbae3f"},{"name":"fair compliance","color":"#40d47e"},{"name":"over compliance","color":"#249a4b"}];
	legend = svg.selectAll("g.legend")
						.data(labelSet)
						.enter()
						.append("g")
						.attr("class","legend");
	legend.append("rect")
			.attr("stroke",function(d,i){
				return d.color;
			})
			.attr("fill",function(d,i){
				return d.color;
			})
			.attr("x",w+margin.left+50)
			.attr("y",function(d,i){
				return margin.top+20*i;
			})
			.attr("width",20)
			.attr("height",10)
			.on("click",function(d){
				var thisColor = d.color;
				if($(this).attr("fill")=="white"){
					$(this).attr("fill",thisColor);
				}
				else{
					$(this).attr("fill","white");
				}
				//svg.selectAll(".line").remove();
				
				// updateData(data);
				// drawLine();
	// 			drawTooltip();
			});

	legend.append("text")
			.attr("x",w+margin.left+80)
			.attr("y",function(d,i){
				return margin.top+20*i;
			})
			.attr("dominant-baseline","hanging")
			.text(function(d,i){
				return d.name;
			})

	d3.tsv("data/localDENovartis_Apps_Compliance-20_Categories_Pat.txt", function(error, data) {
		//console.log(data)
		// check which legends being selected
		var selectedLegends = [];
		legend.selectAll("rect").each(function(d,i){
			if($(this).attr("fill")!="white")
				selectedLegends.push(d.name);
		});
		//console.log(selectedLegends);
		var dataSet = [];
		var dataObject = {};
		for(var i = 0;i<data.length;i++){
			dataObject = [];
			for(key in data[i]){
				for(var m = 0;m<selectedLegends.length;m++){
					if(key==selectedLegends[m]){
						dataObject.push({key:data[i][key]});
					}
				}
			}
			dataSet.push(dataObject);
		}
		console.log(dataSet);
		var maximum = d3.max(data, function(d) { return Number(d["fair compliance"]); })+d3.max(data, function(d) { return Number(d["over compliance"]); })+d3.max(data, function(d) { return Number(d["low compliance"]); });
		//console.log(maximum);
		// maximum = Math.ceil(maximum/1000)*1000;

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
	    	.attr("class", "no_line_axis")
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

		// draw background line
	    function make_x_axis() {        
			return d3.svg.axis()
			    .scale(x_right)
			     .orient("bottom");
		}
	    svg.append("g")         
	        .attr("class", "grid")
	        .attr("transform", "translate(" + margin.left + "," + (margin.top+h) + ")")
	        .call(make_x_axis()
	            .tickSize(-h, 0, 0)
	            .tickFormat("")
	        );

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
					.style("left", (d3.event.pageX) + "px")
					.style("top", (d3.event.pageY + 20) + "px")
					.style("opacity",1.0);
			})
			.on("mousemove",function(d){
				tooltip.style("left", (d3.event.pageX) + "px")
						.style("top", (d3.event.pageY + 20) + "px");
			})
			.on("mouseout",function(d){			
				tooltip.style("opacity",0.0);
			});



		

	});
}

function compliance_percentInCategory(){
	svg.selectAll("*").remove();
	d3.tsv("data/localDENovartis_Apps_Compliance-20_Categories_Percent.txt", function(error, data) {

		var maximum = 1;

	    var xScale = d3.scale.linear()
	                 .domain([0,maximum])
	                 .rangeRound([0,w]);


	    var x_right = d3.scale.linear()
	                 .domain([0,maximum])
	                 .rangeRound([0,w]);



	    var y = d3.scale.ordinal()
			    .domain(data.map(function(d){return d["Market Segments"].toLowerCase()}))
			    .rangeRoundBands([0,h]);
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
		    .attr("transform", "translate(" + margin.left + ","+margin.top+")")
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
									+"<td class='value'>"+(Number(d["low compliance"])*100).toFixed(2)+"%"+"</td>"
								+"</tr>"
								+"<tr>"
									+"<td><span class='color fair_compliance'></span><span>fair compliance</span></td>"
									+"<td class='value'>"+(Number(d["fair compliance"])*100).toFixed(2)+"%"+"</td>"
								+"</tr>"
								+"<tr>"
									+"<td><span class='color over_compliance'></span><span>over compliance</span></td>"
									+"<td class='value'>"+(Number(d["over compliance"])*100).toFixed(2)+"%"+"</td>"
								+"</tr>"
						   +"</tbody></table>";

			tooltip.html(tooltipHTML)
					.style("left", (d3.event.pageX) + "px") 
					.style("top", (d3.event.pageY + 20) + "px")
					.style("opacity",1.0);
			})
			.on("mousemove",function(d){
				tooltip.style("left", (d3.event.pageX) + "px")
						.style("top", (d3.event.pageY + 20) + "px");
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
}


function compliance_patientInTime(){
	svg.selectAll("*").remove();
	d3.tsv("data/localDENovartis_Apps_Compliance-20_InTime_Rx.txt", function(error, data) {

		var maximum = 0;
		var parseDate = d3.time.format("%Y-%m").parse;
		var xtime = [];
		for(var name in data[0]){
			xtime.push(name);
		}
		// get rid of maket segments name
		xtime.splice(0,1);
		
	    // parse data
	    var dataSet=[];
	    var dataObject=[];
		for(var i=0; i<data.length; i++){
			for(var j = 0; j<xtime.length; j++){
				//dataObject[xtime[j]] = data[i][xtime[j]];
				dataObject.push({"date":parseDate(xtime[j]),"number":data[i][xtime[j]]});
				if(Number(data[i][xtime[j]])>maximum){
					maximum = data[i][xtime[j]];
				}
			}
			//console.log(dataObject);
			//dataSet[data[i]["Market Segments"]] = dataObject;
			dataSet.push({"name":data[i]["Market Segments"],"values":dataObject});
			dataObject = [];			
		}
		//console.log(maximum);


		for(var i=0;i<xtime.length;i++){
			xtime[i] = parseDate(xtime[i]);
		}
		var xScale = d3.time.scale()
						.domain(d3.extent(xtime, function(d) { return d; }))
						.range([0,w]);

	    var xAxis = d3.svg.axis()
	                  .scale(xScale)
	                  .orient("bottom")
	                  .outerTickSize(0);




		var yScale = d3.scale.linear()
			    .domain([0,maximum])
			    .rangeRound([h,0]);
	    var yAxis = d3.svg.axis()
				    .scale(yScale)
				    .orient("left")
				    .outerTickSize(0);

		// draw axis
	    svg.append("g")
	    	.attr("class", "axis")
	    	.attr("transform", "translate("+ margin.left +"," + ( h + margin.top ) + ")")
	    	.transition()
		    .duration(500)
	    	.call(xAxis)
	    	.selectAll("text")
		    .attr("y", 30);



	   	svg.append("g")
		    .attr("class","no_line_axis")
		    .attr("transform", "translate(" + margin.left + ","+margin.top+")")
		    .transition()
		    .duration(500)
		    .call(yAxis);

		// draw background line
	    function make_y_axis() {        
		    return d3.svg.axis()
		        .scale(yScale)
		        .orient("left")
		        .ticks(8)
		}
	    svg.append("g")         
		    .attr("class", "grid")
		    .call(make_y_axis()
		        .tickSize(-w, 0, 0)
		        .tickFormat("")
		        )
		    .attr("transform", "translate("+ margin.left +"," + ( margin.top ) + ")");




		// draw line
		var line = d3.svg.line()
				    .x(function(d) { return xScale(d.date); })
				    .y(function(d) { return yScale(d.number); });
				    //.interpolate("basis");

		var color = d3.scale.category10();

		var itemLine = svg.selectAll(".item")
				      .data(dataSet)
				   	  .enter()
				   	  .append("path");

	 
	    itemLine.attr("class", "line")
		      .attr("d", function(d) { return line(d.values); })
		      .attr("transform", "translate("+margin.left+"," + margin.top + ")")
		      .style("stroke", function(d) {return color(d.name); });



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


		// tooltip
		bisectDate = d3.bisector(function(d) { return d.date; }).left;

		//var lineSvg = svg.append("g");
		var focus = svg.selectAll('svg')
						.data(dataSet)
						.enter()
						.append("circle") 
				        .attr("fill", function(d) { return color(d.name); })
				        .attr("r", 4)
				        //.attr("transform","translate(0,0)")
				        .attr("display", "none")
				        .attr("name",function(d) { return d.name; });

		svg.selectAll("circle")
  				.attr("transform", function(d){
  					return "translate(" + (margin.left+xScale(d.values.date)) + "," + (margin.top+yScale(d.values.number)) + ")";
  				}); 

  		var verticalLine = svg.append("line")
  								.attr("stroke-dasharray",10)
  								.attr("stroke","#a6a8ac")
  								.attr("stroke-width", 0.8)
  								.attr("display","none");

		svg.append("rect")
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
	        .on("mousemove", mousemove);


	    	// tooltip box
		   	var tooltip = d3.select("body")
							.append("div")
							.attr("class","tooltip")
							.style("opacity",0.0);	
			var tooltipHTML = "<table><tbody></tbody></table>";
			tooltip.html(tooltipHTML);
			var tooltipSelect = $("div.tooltip tbody");



	   function mousemove(){
		   	var x0 = xScale.invert(d3.mouse(this)[0]);

		   	// draw circles
		    var itemPointSet = [];
		    for(key in dataSet){
		    	var datum = dataSet[key].values;
		    	var i = bisectDate(datum, x0, 1);
		    	var d0 = datum[i - 1],
		    	d1 = datum[i];
		    	d = x0 - d0.date > d1.date - x0 ? d1 : d0;
		    	itemPointSet.push(d);
		    }

		    var itemInfoSet=[];// combine color and date, number in an array
  			var circleColor;
  			var circleName;

  			var month = new Array(12);
				month[0] = "Jan";
				month[1] = "Feb";
				month[2] = "Mar";
				month[3] = "Apr";
				month[4] = "May";
				month[5] = "Jun";
				month[6] = "Jul";
				month[7] = "Aug";
				month[8] = "Sep";
				month[9] = "Oct";
				month[10] = "Nov";
				month[11] = "Dec";
  			$("circle").each(function(i){
  				$(this).attr("transform","translate(" + (margin.left+xScale(itemPointSet[i].date)) + "," +  (margin.top+yScale(itemPointSet[i].number)) + ")");
  				circleColor = $(this).attr("fill");
  				circleName = $(this).attr("name");
  				circleDate = month[itemPointSet[i].date.getUTCMonth()]+" "+itemPointSet[i].date.getFullYear();
  				itemInfoSet.push({"color":circleColor,"name":circleName,"date":circleDate,"number":itemPointSet[i].number}); 
  			});

  			// sort JSON for tooltip box
			itemInfoSet.sort(function(a,b){
				// descending
				return b.number-a.number;
			})
			//console.log(itemInfoSet);

			// append to tooltip
			tooltipSelect.html("");
			tooltipSelect.append("<tr><td>"+itemInfoSet[0].date+"</td></tr>");
			for(var i=0;i<itemInfoSet.length;i++){
				tooltipSelect.append("<tr><td><span class='color' style='background-color:"+itemInfoSet[i].color+"'></span><span>"+ itemInfoSet[i].name +"</span></td><td class='value'>"+itemInfoSet[i].number+"</td></tr>");
			}
  			

      		// draw vertical line
		   	verticalLine.attr('x1',margin.left+xScale(itemPointSet[0].date))
		   				.attr('x2',margin.left+xScale(itemPointSet[0].date))
		   				.attr('y1',margin.top)
		   				.attr('y2',h+margin.top);


			tooltip.style("left", (d3.event.pageX) + "px")
						.style("top", (d3.event.pageY + 20) + "px");


		}

    
	});

}


function compliance_percentInTime(){
	svg.selectAll("*").remove();
	d3.tsv("data/localDENovartis_Apps_Compliance-20_InTime_Percent.txt", function(error, data) {

		var maximum = 0;
		var parseDate = d3.time.format("%Y-%m").parse;
		var xtime = [];
		for(var name in data[0]){
			xtime.push(name);
		}
		// get rid of maket segments name
		xtime.splice(0,1);
		
	    // parse data
	    var dataSet=[];
	    var dataObject=[];
		for(var i=0; i<data.length; i++){
			for(var j = 0; j<xtime.length; j++){
				//dataObject[xtime[j]] = data[i][xtime[j]];
				dataObject.push({"date":parseDate(xtime[j]),"number":data[i][xtime[j]]});
				if(Number(data[i][xtime[j]])>maximum){
					maximum = data[i][xtime[j]];
				}
			}
			//console.log(dataObject);
			//dataSet[data[i]["Market Segments"]] = dataObject;
			dataSet.push({"name":data[i]["Market Segments"],"values":dataObject});
			dataObject = [];			
		}
		//console.log(maximum);


		for(var i=0;i<xtime.length;i++){
			xtime[i] = parseDate(xtime[i]);
		}
		var xScale = d3.time.scale()
						.domain(d3.extent(xtime, function(d) { return d; }))
						.range([0,w]);

	    var xAxis = d3.svg.axis()
	                  .scale(xScale)
	                  .orient("bottom")
	                  .outerTickSize(0);




		var yScale = d3.scale.linear()
			    .domain([0,maximum])
			    .rangeRound([h,0]);
	    var yAxis = d3.svg.axis()
				    .scale(yScale)
				    .orient("left")
				    .outerTickSize(0);

		// draw axis
	    svg.append("g")
	    	.attr("class", "axis")
	    	.attr("transform", "translate("+ margin.left +"," + ( h + margin.top ) + ")")
	    	.transition()
		    .duration(500)
	    	.call(xAxis)
	    	.selectAll("text")
		    .attr("y", 30);



	   	svg.append("g")
		    .attr("class","no_line_axis")
		    .attr("transform", "translate(" + margin.left + ","+margin.top+")")
		    .transition()
		    .duration(500)
		    .call(yAxis);

		// draw background line
	    function make_y_axis() {        
		    return d3.svg.axis()
		        .scale(yScale)
		        .orient("left")
		        .ticks(8)
		}
	    svg.append("g")         
		    .attr("class", "grid")
		    .call(make_y_axis()
		        .tickSize(-w, 0, 0)
		        .tickFormat("")
		        )
		    .attr("transform", "translate("+ margin.left +"," + ( margin.top ) + ")");




		// draw line
		var line = d3.svg.line()
				    .x(function(d) { return xScale(d.date); })
				    .y(function(d) { return yScale(d.number); });
				    //.interpolate("basis");

		var color = d3.scale.category10();

		var itemLine = svg.selectAll(".item")
				      .data(dataSet)
				   	  .enter()
				   	  .append("path");

	 
	    itemLine.attr("class", "line")
		      .attr("d", function(d) { return line(d.values); })
		      .attr("transform", "translate("+margin.left+"," + margin.top + ")")
		      .style("stroke", function(d) {return color(d.name); });



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


		// tooltip
		bisectDate = d3.bisector(function(d) { return d.date; }).left;

		//var lineSvg = svg.append("g");
		var focus = svg.selectAll('svg')
						.data(dataSet)
						.enter()
						.append("circle") 
				        .attr("fill", function(d) { return color(d.name); })
				        .attr("r", 4)
				        //.attr("transform","translate(0,0)")
				        .attr("display", "none")
				        .attr("name",function(d) { return d.name; });

		svg.selectAll("circle")
  				.attr("transform", function(d){
  					return "translate(" + (margin.left+xScale(d.values.date)) + "," + (margin.top+yScale(d.values.number)) + ")";
  				}); 

  		var verticalLine = svg.append("line")
  								.attr("stroke-dasharray",10)
  								.attr("stroke","#a6a8ac")
  								.attr("stroke-width", 0.8)
  								.attr("display","none");

		svg.append("rect")
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
	        .on("mousemove", mousemove);


	    	// tooltip box
		   	var tooltip = d3.select("body")
							.append("div")
							.attr("class","tooltip")
							.style("opacity",0.0);	
			var tooltipHTML = "<table><tbody></tbody></table>";
			tooltip.html(tooltipHTML);
			var tooltipSelect = $("div.tooltip tbody");



	   function mousemove(){
		   	var x0 = xScale.invert(d3.mouse(this)[0]);

		   	// draw circles
		    var itemPointSet = [];
		    for(key in dataSet){
		    	var datum = dataSet[key].values;
		    	var i = bisectDate(datum, x0, 1);
		    	var d0 = datum[i - 1],
		    	d1 = datum[i];
		    	d = x0 - d0.date > d1.date - x0 ? d1 : d0;
		    	itemPointSet.push(d);
		    }

		    var itemInfoSet=[];// combine color and date, number in an array
  			var circleColor;
  			var circleName;

  			var month = new Array(12);
				month[0] = "Jan";
				month[1] = "Feb";
				month[2] = "Mar";
				month[3] = "Apr";
				month[4] = "May";
				month[5] = "Jun";
				month[6] = "Jul";
				month[7] = "Aug";
				month[8] = "Sep";
				month[9] = "Oct";
				month[10] = "Nov";
				month[11] = "Dec";
  			$("circle").each(function(i){
  				$(this).attr("transform","translate(" + (margin.left+xScale(itemPointSet[i].date)) + "," +  (margin.top+yScale(itemPointSet[i].number)) + ")");
  				circleColor = $(this).attr("fill");
  				circleName = $(this).attr("name");
  				circleDate = month[itemPointSet[i].date.getUTCMonth()]+" "+itemPointSet[i].date.getFullYear();
  				itemInfoSet.push({"color":circleColor,"name":circleName,"date":circleDate,"number":itemPointSet[i].number}); 
  			});

  			// sort JSON for tooltip box
			itemInfoSet.sort(function(a,b){
				// descending
				return b.number-a.number;
			})
			//console.log(itemInfoSet);

			// append to tooltip
			tooltipSelect.html("");
			tooltipSelect.append("<tr><td>"+itemInfoSet[0].date+"</td></tr>");
			for(var i=0;i<itemInfoSet.length;i++){
				tooltipSelect.append("<tr><td><span class='color' style='background-color:"+itemInfoSet[i].color+"'></span><span>"+ itemInfoSet[i].name +"</span></td><td class='value'>"+Number(itemInfoSet[i].number).toFixed(2)+"</td></tr>");
			}
  			

      		// draw vertical line
		   	verticalLine.attr('x1',margin.left+xScale(itemPointSet[0].date))
		   				.attr('x2',margin.left+xScale(itemPointSet[0].date))
		   				.attr('y1',margin.top)
		   				.attr('y2',h+margin.top);


			tooltip.style("left", (d3.event.pageX) + "px")
						.style("top", (d3.event.pageY + 20) + "px");


		}

    
	});

}

