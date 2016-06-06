$(document).ready(function(){

    var w = 1050;
    var h = 660;
    var barPadding = 10;
    var topSpacing = 30;
    var bottomSpacing = 80;
    var leftSpacing = 50;
    var rightSpacing = 50;

    var svg = d3.select("div#svg")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

	d3.tsv("data/localDENovartis_Apps_Compliance-20_Ranges_Pat.txt", function(error, data) {

		var maximum = 0;
		var xRange = [];
		for(var name in data[0]){
			xRange.push(name);
		}
		// get rid of maket segments name
		xRange.splice(0,1);
		
	    // parse data
	    var dataSet=[];
	    var dataObject=[];
	    var total = 0;
		for(var i=0; i<xRange.length; i++){
			for(var j = 0; j<data.length; j++){
				total = total+Number(data[j][xRange[i]]);
				dataObject.push({"name":data[j]["Market Segments"],"number":Number(data[j][xRange[i]])});				
			}
			if(total>maximum){
				maximum = total;
			}
			total=0;
			//console.log(dataObject);
			//dataSet[data[i]["Market Segments"]] = dataObject;
			dataSet.push({"range":xRange[i],"values":dataObject});
			dataObject = [];			
		}
		//console.log(dataSet);

		// var xScale = d3.time.scale()
		// 				.domain(d3.extent(xtime, function(d) { return d; }))
		// 				.range([0,w-leftSpacing-rightSpacing]);

		var xScale = d3.scale.ordinal()
			    .domain(xRange)
			    .rangeRoundBands([0,w-leftSpacing-rightSpacing]);

	    var xAxis = d3.svg.axis()
	                  .scale(xScale)
	                  .orient("bottom");




		var yScale = d3.scale.linear()
			    .domain([0,maximum])
			    .rangeRound([h-topSpacing-bottomSpacing,0]);
	    var yAxis = d3.svg.axis()
				    .scale(yScale)
				    .orient("left");

		// draw axis
	    svg.append("g")
	    	.attr("class", "axis")
	    	.attr("transform", "translate("+leftSpacing+"," + (h-bottomSpacing) + ")")
	    	.transition()
		    .duration(500)
	    	.call(xAxis)
	    	.selectAll("text")
		    .attr("y", 15);

	   	svg.append("g")
		    .attr("class","axis")
		    .attr("transform", "translate(" + leftSpacing + ","+topSpacing+")")
		    .transition()
		    .duration(500)
		    .call(yAxis);


		// draw rect
		var color = d3.scale.category10();

		var rect = svg.selectAll("body")
						.data(dataSet)
		   				.enter()
		   				.append("g")
		   				.attr("class","item");

		var currentRectSet=[];

		var rectWidth = (w-leftSpacing-rightSpacing)/dataSet.length-barPadding;
		
		for(var j = 0;j<dataSet[0].values.length;j++){
			rect.append("rect")
				.attr("height",0)
				.attr("y", function(d,i) {
			   		//var eachRectY = h-topSpacing-bottomSpacing-yScale(d.values[j].number);
			   		var totalY = 0;
			   		for(var m = 0;m<j;m++){
			   			totalY = totalY + (h-topSpacing-bottomSpacing-yScale(d.values[m].number));
			   		}
			   		rectY = (h-bottomSpacing) - totalY;
			        return rectY;
			   })
			   .transition()
			   .duration(function(d){
			   		var height = h-topSpacing-bottomSpacing-yScale(d.values[j].number);
			   		return height+50;
			   })
			   .ease("liner")
			   .delay(function(d){
			   		var total = 0;
			   		for(var m = 0;m<j;m++){
			   			total = total + (h-topSpacing-bottomSpacing-yScale(d.values[m].number))+50;
			   		}
			        return total;
			   })
			   .attr("x", function(d,i){
			   		return leftSpacing+(2*i+1)*barPadding/2+rectWidth*i;
			   })
			   .attr("y", function(d,i) {
			   		//var eachRectY = h-topSpacing-bottomSpacing-yScale(d.values[j].number);
			   		var totalY = 0;
			   		for(var m = 0;m<=j;m++){
			   			totalY = totalY + (h-topSpacing-bottomSpacing-yScale(d.values[m].number));
			   		}
			   		rectY = (h-bottomSpacing) - totalY;
			        return rectY;
			   })
			   .attr("fill",function(d,i){
			   		return color(d.values[j].name);
			   })
			   .attr("height", function(d,i){
			   		return h-topSpacing-bottomSpacing-yScale(d.values[j].number);
			   })
			   .attr("width", function(d,i){
			   		return rectWidth;
			   });


		}






		// tooltip
		var tooltip = d3.select("body")
					.append("div")
					.attr("class","tooltip")
					.style("opacity",0.0);

		tooltip.html("<table><tbody></tbody></table>");
		var tooltipSelect = $("div.tooltip tbody");	
		
		rect.on("mouseover",function(d){
				var index = $("g.item").index(this);
				//console.log(index);
				tooltipSelect.html("");
				tooltipSelect.append("<tr><td>Range: "+dataSet[index].range+"</td></tr>");
				for(var i=0;i<dataSet[index].values.length;i++){
					tooltipSelect.append("<tr><td><span class='color' style='background-color:"+color(dataSet[index].values[i].name)+"'></span><span>"+ dataSet[index].values[i].name +"</span></td><td class='value'>"+dataSet[index].values[i].number+"</td></tr>");
				}
				tooltip.style("left", (d3.event.pageX + 20) + "px")
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
    
	});



	// import data from txt
	$.ajax({
        url : "data/localDENovartis_Apps_Compliance-20_Ranges_Pat.txt",
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