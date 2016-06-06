$(document).ready(function(){

    var w = 1050;
    var h = 660;
    var barPadding = 20;
    var topSpacing = 30;
    var bottomSpacing = 80;
    var leftSpacing = 40;
    var rightSpacing = 50;

    var svg = d3.select("div#svg")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

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
		//console.log(dataObject);


		for(var i=0;i<xtime.length;i++){
			xtime[i] = parseDate(xtime[i]);
		}
		var xScale = d3.time.scale()
						.domain(d3.extent(xtime, function(d) { return d; }))
						.range([0,w-leftSpacing-rightSpacing]);

	    var xAxis = d3.svg.axis()
	                  .scale(xScale)
	                  .orient("bottom");




		var yScale = d3.scale.linear()
			    .domain([0,maximum])
			    .rangeRound([h-topSpacing-bottomSpacing-barPadding,0]);
	    var yAxis = d3.svg.axis()
				    .scale(yScale)
				    .orient("left");

		// draw axis
	    svg.append("g")
	    	.attr("class", "no_line_axis")
	    	.attr("transform", "translate("+leftSpacing+"," + (h-barPadding-bottomSpacing+10) + ")")
	    	.transition()
		    .duration(500)
	    	.call(xAxis);

	   	svg.append("g")
		    .attr("class","axis")
		    .attr("transform", "translate(" + leftSpacing + ","+topSpacing+")")
		    .transition()
		    .duration(500)
		    .call(yAxis);



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
		      .attr("transform", "translate("+leftSpacing+"," + topSpacing + ")")
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
  					return "translate(" + (leftSpacing+xScale(d.values.date)) + "," + (topSpacing+yScale(d.values.number)) + ")";
  				}); 

  		var verticalLine = svg.append("line")
  								.attr("stroke-dasharray",10)
  								.attr("stroke","#a6a8ac")
  								.attr("stroke-width", 0.8)
  								.attr("display","none");

		svg.append("rect")
	        .attr("width", w-rightSpacing-leftSpacing)
	        .attr("height", h-bottomSpacing-topSpacing)
	        .attr("fill", "none")
	        .attr("pointer-events", "all")
	        .attr("transform","translate("+leftSpacing+","+topSpacing+")")
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
  				$(this).attr("transform","translate(" + (leftSpacing+xScale(itemPointSet[i].date)) + "," +  (topSpacing+yScale(itemPointSet[i].number)) + ")");
  				circleColor = $(this).attr("fill");
  				circleName = $(this).attr("name");
  				circleDate = month[itemPointSet[i].date.getUTCMonth()]+" "+itemPointSet[i].date.getFullYear();
  				itemInfoSet.push({"color":circleColor,"name":circleName,"date":circleDate,"number":itemPointSet[i].number}); 
  			});

  			// sort JSON for tooltip box
  			//console.log(itemInfoSet)
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
		   	verticalLine.attr('x1',leftSpacing+xScale(itemPointSet[0].date))
		   				.attr('x2',leftSpacing+xScale(itemPointSet[0].date))
		   				.attr('y1',topSpacing)
		   				.attr('y2',h-bottomSpacing);


			tooltip.style("left", (d3.event.pageX + 20) + "px")
						.style("top", (d3.event.pageY) + "px");




			



		}

    
	});



	// import data from txt
	$.ajax({
        url : "data/localDENovartis_Apps_Compliance-20_InTime_Percent.txt",
        //dataType: "text",
        success : function (data) {
        	var html_first_half="";
        	var html_second_half="";
            var tr = data.split("\n");
            for(var i = 0;i<tr.length;i++){
            	var td = tr[i].split("\t");

            	html_first_half="";
            	html_second_half="";


            	// table head
            	if(i==0){
            		var td0;
            		for(var j = 0; j< td.length;j++){
            			td0=td[0];
            			if(j< td.length/2){
            				html_first_half = html_first_half+"<th>"+td[j]+"</th>";
            			}
            			else{
            				html_second_half = html_second_half+"<th>"+td[j]+"</th>";
            			}	            		
	            	}
	            	html_second_half= "<th>"+td0+"</th>" + html_second_half;
	            	$("table#first_half thead").append("<tr>"+html_first_half+"</tr>");
	            	$("table#second_half thead").append("<tr>"+html_second_half+"</tr>");

            	}
            	// table data
            	else{
            		var td0;
            		for(var j = 0; j< td.length;j++){
            			td0=td[0];
            			if(j< td.length/2){
            				html_first_half = html_first_half+"<td>"+td[j]+"</td>";
            			}
            			else{
            				html_second_half = html_second_half+"<td>"+td[j]+"</td>";
            			}	            		
	            	}
	            	html_second_half= "<td>"+td0+"</td>" + html_second_half;
	            	$("table#first_half tbody").append("<tr>"+html_first_half+"</tr>");
	            	$("table#second_half tbody").append("<tr>"+html_second_half+"</tr>");
	            }
            }

        }
    });
  
});