$(document).ready(function(){

    var w = 1050;
    var h = 660;
    var barPadding = 10;
    var topSpacing = 20;
    var bottomSpacing = 80;
    var leftSpacing = 40;
    var rightSpacing = 50;

    var svg = d3.select("div#svg")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

	d3.tsv("data/localDENovartis_Apps_SoB-12_ALPHACYN_Month.txt", function(error, data) {
		var xScale, xAxis, yScale, yAsix;

	/**  data  **/
	var xRange = []; // x label
	var dataSet=[]; // parsed dataSet
    var component_array = [];
var color = d3.scale.category10();
	var legend;
		var maximum = 0;
		var minimum = 0;
		var xRange = [];
		for(var name in data[0]){
			xRange.push(name);
		}
		// get rid of maket segments name
		xRange.splice(0,1);
		
	    // parse data
	    var dataSet=[];
	    var dataObject=[];
	    var totalPositive = 0;
	    var totalNegative = 0;
		for(var i=0; i<xRange.length; i++){
			for(var j = 0; j<data.length; j++){
				if(Number(data[j][xRange[i]])>=0)
					totalPositive = totalPositive+Number(data[j][xRange[i]]);
				else
					totalNegative = totalNegative+Number(data[j][xRange[i]]);
				dataObject.push({"name":data[j]["Components"],"number":Number(data[j][xRange[i]])});				
			}
			// move Repeat to the first
			var dataObjectTmp =[];
			dataObjectTmp.name = dataObject[7].name;
			dataObjectTmp.number = dataObject[7].number;
			dataObject[7].name = dataObject[0].name;
			dataObject[7].number = dataObject[0].number;
			dataObject[0].name = dataObjectTmp.name;
			dataObject[0].number = dataObjectTmp.number;
			if(totalPositive>maximum){
				maximum = totalPositive;
			}
			if(totalNegative<minimum){
				minimum = totalNegative;
			}
			totalPositive=0
			totalNegative=0;
			//console.log(dataObject);
			//dataSet[data[i]["Market Segments"]] = dataObject;
			dataSet.push({"date":xRange[i],"values":dataObject});
			dataObject = [];			
		}
		console.log(dataSet);

		// var xScale = d3.time.scale()
		// 				.domain(d3.extent(xtime, function(d) { return d; }))
		// 				.range([0,w-leftSpacing-rightSpacing]);

		var xScale = d3.scale.ordinal()
			    .domain(xRange)
			    .rangeRoundBands([0,w-leftSpacing-rightSpacing]);


	    var xAxis = d3.svg.axis()
	                  .scale(xScale)
	                  .orient("bottom");



	    minimum = Math.round(minimum/100)*100;
	    maximum = Math.ceil(maximum/100)*100;
		var yScale = d3.scale.linear()
			    .domain([minimum,maximum])
			    .range([h-topSpacing-bottomSpacing,0]);
	    var yAxis = d3.svg.axis()
				    .scale(yScale)
				    .tickValues(d3.range(minimum, maximum, 200))
				    .orient("left");

		// draw axis
	    svg.append("g")
	    	.attr("class", "axis")
	    	.attr("transform", "translate("+leftSpacing+"," + (h-bottomSpacing-(h-topSpacing-bottomSpacing-yScale(0))) + ")")
	    	.transition()
		    .duration(500)
	    	.call(xAxis)
	    	.selectAll("text")
		    .attr("y", 70)
		    .attr("x", -56)
		    .attr("font-size","10px")
		    .attr("text-anchor","middle")
		    .attr("transform", "rotate(-40)");


	   	svg.append("g")
		    .attr("class","axis")
		    .attr("transform", "translate(" + leftSpacing + ","+topSpacing+")")
		    .transition()
		    .duration(500)
		    .call(yAxis);


		// draw rect
		var color = d3.scale.category10();

		var rect = svg.selectAll("g.item")
						.data(dataSet)
		   				.enter()
		   				.append("g")
		   				.attr("class","item");

		var rectWidth = (w-leftSpacing-rightSpacing)/dataSet.length-barPadding;
		
		for(var j = 0;j<dataSet[0].values.length;j++){
			rect.append("rect")
				.attr("height",0)
				.attr("y", function(d,i) {
			   		var totalY = 0;
			   		var rectY = 0;
			   		var heightFromZeroToBottom = h-topSpacing-bottomSpacing-yScale(0);
			   		if(d.values[j].number>=0){
			   			for(var m = 0;m<j;m++){
			   				if(d.values[m].number>0)
					   			totalY = totalY + h-topSpacing-bottomSpacing-yScale(d.values[m].number) - heightFromZeroToBottom; 
					   		else
					   			totalY = totalY + 0;
				   		}
				   		rectY = (h-bottomSpacing-(h-topSpacing-bottomSpacing-yScale(0))) - totalY;
				        return rectY;
			   		}
			   		else if(d.values[j].number<0){
			   			for(var m = 0;m<j;m++){
			   				if(d.values[m].number<0)
					   			totalY = totalY + h-topSpacing-bottomSpacing-yScale(d.values[m].number*(-1)) - heightFromZeroToBottom; 
					   		else
					   			totalY = totalY + 0;
				   		}
				   		rectY = (h-bottomSpacing-(h-topSpacing-bottomSpacing-yScale(0))) + totalY;
				        return rectY;
			   		} 
			   })
			   .transition()
			   .duration(function(d){
			   		// var height = h-topSpacing-bottomSpacing-yScale(d.values[j].number);
			   		// return height+50;
			   		var heightFromZeroToBottom = h-topSpacing-bottomSpacing-yScale(0);
			   		if(d.values[j].number>0)
			   			return h-topSpacing-bottomSpacing-yScale(d.values[j].number) - heightFromZeroToBottom +100; 
			   		else if(d.values[j].number<0)
			   			return h-topSpacing-bottomSpacing-yScale(d.values[j].number*(-1)) - heightFromZeroToBottom +100; 
			   		else
			   			return 0;
			   })
			   .ease("swing")
			   .delay(function(d){
			   		var total = 0;
			   		// for(var m = 0;m<j;m++){
			   		// 	total = total + (h-topSpacing-bottomSpacing-yScale(d.values[m].number))+50;
			   		// }
			     //    return total;
			        var heightFromZeroToBottom = h-topSpacing-bottomSpacing-yScale(0);
			   		if(d.values[j].number>0){
			   			for(var m = 0;m<j;m++){
			   				if(d.values[m].number>0)
				   				total = total + h-topSpacing-bottomSpacing-yScale(d.values[m].number) - heightFromZeroToBottom +100;
				   		}
				        return total;
			   		} 
			   		else if(d.values[j].number<0){
			   			for(var m = 0;m<j;m++){
			   				if(d.values[m].number<0)
				   				total = total + h-topSpacing-bottomSpacing-yScale(d.values[m].number*(-1)) - heightFromZeroToBottom +100;
				   		}
				        return total;
			   		} 
			   		else
			   			return 0;
			   })
			   .attr("x", function(d,i){
			   		return leftSpacing+(2*i+1)*barPadding/2+rectWidth*i;
			   })
			   .attr("y", function(d,i) {
			   		var totalY = 0;
			   		var rectY = 0;
			   		var heightFromZeroToBottom = h-topSpacing-bottomSpacing-yScale(0);
			   		if(d.values[j].number>=0){
			   			for(var m = 0;m<=j;m++){
			   				if(d.values[m].number>0)
					   			totalY = totalY + h-topSpacing-bottomSpacing-yScale(d.values[m].number) - heightFromZeroToBottom; 
					   		else
					   			totalY = totalY + 0;
				   		}
				   		rectY = (h-bottomSpacing-(h-topSpacing-bottomSpacing-yScale(0))) - totalY;
				        return rectY;
			   		}
			   		else if(d.values[j].number<0){
			   			for(var m = 0;m<j;m++){
			   				if(d.values[m].number<0)
					   			totalY = totalY + h-topSpacing-bottomSpacing-yScale(d.values[m].number*(-1)) - heightFromZeroToBottom; 
					   		else
					   			totalY = totalY + 0;
				   		}
				   		rectY = (h-bottomSpacing-(h-topSpacing-bottomSpacing-yScale(0))) + totalY;
				        return rectY;
			   		}
			   })
			   .attr("fill",function(d){
			   		return color(d.values[j].name);
			   })
			   .attr("height", function(d,i){
			   		var heightFromZeroToBottom = h-topSpacing-bottomSpacing-yScale(0);
			   		if(d.values[j].number>0)
			   			return h-topSpacing-bottomSpacing-yScale(d.values[j].number) - heightFromZeroToBottom; 
			   		else if(d.values[j].number<0)
			   			return h-topSpacing-bottomSpacing-yScale(d.values[j].number*(-1)) - heightFromZeroToBottom; 
			   		else
			   			return 0;
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
				//var index = $("g.item").index(this);
				//console.log(index);
				tooltipSelect.html("");
				tooltipSelect.append("<tr><td>Time: "+d.date+"</td></tr>");

				var posstiveArray = [];
				var negativeArray = [];
				for(var i=0;i<d.values.length;i++){
					if(d.values[i].number>0)
						posstiveArray.push(d.values[i]);
					else
						negativeArray.push(d.values[i]);
				}
				
				for(var i=posstiveArray.length-1;i>=0;i--){
					//console.log(posstiveArray[i])
					tooltipSelect.append("<tr><td><span class='color' style='background-color:"+color(posstiveArray[i].name)+"'></span><span>"+ posstiveArray[i].name +"</span></td><td class='value'>"+posstiveArray[i].number+"</td></tr>");
				}
				for(var i=0;i<negativeArray.length;i++){
					//console.log(posstiveArray[i])
					tooltipSelect.append("<tr><td><span class='color' style='background-color:"+color(negativeArray[i].name)+"'></span><span>"+ negativeArray[i].name +"</span></td><td class='value'>"+negativeArray[i].number+"</td></tr>");
				}
				tooltip.style("left", (d3.event.pageX) + "px")
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



	// import data from txt
	$.ajax({
        url : "data/localDENovartis_Apps_SoB-12_ALPHACYN_Month.txt",
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