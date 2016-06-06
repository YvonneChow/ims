$(document).ready(function(){
	/**  chart  **/
    var w = 640;
    var h = 660;
    var barPadding = 350;
    var topSpacing = 20;
    var bottomSpacing = 80;
    var leftSpacing = 50;
    var rightSpacing = 50;
    var xScale, xAxis, yScale, yAsix;

	/**  data  **/
    var maximum = 0; // maximum in the data
	var minimum = 0; // minimum in the data
	var xRange = []; // x label
	var dataSet=[]; // parsed dataSet
    var component_array = [];

    var svg = d3.select("div#svg")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

	var color = d3.scale.category10();
	var legend;

	d3.tsv("data/localDENovartis_Apps_SoB-12_BETACYN_Total.txt", function(error, data) {

		// get x label
		for(var name in data[0]){
			xRange.push(name);
		}	
		xRange.splice(0,1);// get rid of name
		//console.log(xRange);
	   
		
		// get components name
		for(key in data){
			component_array.push(data[key].Components);
		}


		drawLegends();
		updateDataSet();

		xScale = d3.scale.ordinal()
			    .domain(xRange)
			    .rangeRoundBands([0,w-leftSpacing-rightSpacing]);


	    xAxis = d3.svg.axis()
	                  .scale(xScale)
	                  .orient("bottom");



	    minimum = Math.floor(minimum/100)*100;
	    maximum = Math.ceil(maximum/100)*100;
		yScale = d3.scale.linear()
			    .domain([minimum,maximum])
			    .range([h-topSpacing-bottomSpacing,0]);
	    yAxis = d3.svg.axis()
				    .scale(yScale)
				    .tickValues(d3.range(minimum, maximum, 500))
				    .orient("left");

		 

		// draw axis
	    svg.append("g")
	    	.attr("class", "axis xAxis")
	    	.attr("transform", "translate("+leftSpacing+"," + (h-bottomSpacing-(h-topSpacing-bottomSpacing-yScale(0))) + ")")
	    	.transition()
		    .duration(500)
	    	.call(xAxis)
	    	.selectAll("text")
		    .attr("y", 180);


	   	svg.append("g")
		    .attr("class","axis yAxis")
		    .attr("transform", "translate(" + leftSpacing + ","+topSpacing+")")
		    .transition()
		    .duration(500)
		    .call(yAxis);


		drawRect();
		tooltip();


		function updateDataSet(){
			// check which legends being selected
			var selectedLegends = [];
			legend.selectAll("rect").each(function(d,i){
				if($(this).attr("fill")!="white")
					selectedLegends.push(d);
			});
			//console.log(selectedLegends);

		    var dataObject=[];
		    var totalPositive = 0;
	    	var totalNegative = 0;
		    maximum = minimum = 0;
		    dataSet=[];
			for(var i=0; i<xRange.length; i++){
				for(var j = 0; j<data.length; j++){
					for(var n = 0;n<selectedLegends.length;n++){
						if(data[j]["Components"]==selectedLegends[n]){
							if(Number(data[j][xRange[i]])>=0)
								totalPositive = totalPositive+Number(data[j][xRange[i]]);
							else
								totalNegative = totalNegative+Number(data[j][xRange[i]]);

							dataObject.push({"name":data[j]["Components"],"number":Number(data[j][xRange[i]])});
						}
							
					}				
				}
				// sort data
				dataObject.sort(function(a,b){
					// descending
					return b.number-a.number;
				})

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
			minimum = Math.floor(minimum/100)*100;
		    maximum = Math.ceil(maximum/100)*100;
		    //console.log(maximum +" "+ minimum);
			//console.log(newDataSet)
		}


		function drawLegends(){
			legend = svg.selectAll("g.legend")
							.data(component_array)
							.enter()
							.append("g")
							.attr("class","legend");
			legend.append("rect")
					.attr("stroke",function(d,i){
						return color(d);
					})
					.attr("fill",function(d,i){
						return color(d);
					})
					.attr("x",w-100)
					.attr("y",function(d,i){
						return topSpacing+20*i;
					})
					.attr("width",20)
					.attr("height",10)
					.on("click",function(d){
						var thisColor = color(d);
						if($(this).attr("fill")=="white"){
							$(this).attr("fill",thisColor);
						}
						else{
							$(this).attr("fill","white");
						}
						svg.select("g.item").remove();
						updateDataSet();
						drawRect();
						tooltip();
					});

			legend.append("text")
					.attr("x",w-60)
					.attr("y",function(d,i){
						return topSpacing+20*i;
					})
					.attr("dominant-baseline","hanging")
					.text(function(d,i){
						return d;
					})
		}

		function drawRect(){

			// change the y axis
		    //console.log(minimum+"  "+maximum);
		    yScale = d3.scale.linear()
			    .domain([minimum,maximum])
			    .range([h-topSpacing-bottomSpacing,0]);
	     	yAxis = d3.svg.axis()
				    .scale(yScale)
				    .tickValues(d3.range(minimum, maximum, 500))
				    .orient("left");

			svg.select("g.axis.yAxis") 
			 	.transition()
	            .duration(500)
	            .call(yAxis);


	        svg.select("g.axis.xAxis")
	        .transition()
		    .duration(500)
	    	.attr("transform", "translate("+leftSpacing+"," + (h-bottomSpacing-(h-topSpacing-bottomSpacing-yScale(0))) + ")")
	    	.call(xAxis)
	    	.selectAll("text")
		    .attr("y", h-topSpacing-(h-bottomSpacing-(h-topSpacing-bottomSpacing-yScale(0))));




			var rectSet = svg.selectAll("g.item")
							.data(dataSet)
							.enter()
			   				.append("g")
			   				.attr("class","item");

			var rectWidth = (w-leftSpacing-rightSpacing)/dataSet.length-barPadding;
			
			var rect = rectSet.selectAll("rect")
								.data(dataSet[0].values)
								.enter()
								.append("rect");

			rect.attr("height",0)
				.attr("y", function(d,i) {
			   		var totalY = 0;
			   		var rectY = 0;
			   		var heightFromZeroToBottom = h-topSpacing-bottomSpacing-yScale(0);
			   		if(d.number>=0){
			   			for(var m = 0;m<i;m++){
			   				if(rect.data()[m].number>0)
					   			totalY = totalY + h-topSpacing-bottomSpacing-yScale(rect.data()[m].number) - heightFromZeroToBottom; 
					   		else
					   			totalY = totalY + 0;
				   		}
				   		rectY = (h-bottomSpacing-(h-topSpacing-bottomSpacing-yScale(0))) - totalY;
				        return rectY;
			   		}
			   		else if(d.number<0){
			   			for(var m = 0;m<i;m++){
			   				if(rect.data()[m].number<0)
					   			totalY = totalY + h-topSpacing-bottomSpacing-yScale(rect.data()[m].number*(-1)) - heightFromZeroToBottom; 
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
			   		if(d.number>0)
			   			return h-topSpacing-bottomSpacing-yScale(d.number) - heightFromZeroToBottom +100; 
			   		else if(d.number<0)
			   			return h-topSpacing-bottomSpacing-yScale(d.number*(-1)) - heightFromZeroToBottom +100; 
			   		else
			   			return 0;
			   })
			   .ease("swing")
			   .delay(function(d,i){
			   		var total = 0;
			   		// for(var m = 0;m<j;m++){
			   		// 	total = total + (h-topSpacing-bottomSpacing-yScale(d.values[m].number))+50;
			   		// }
			     //    return total;
			        var heightFromZeroToBottom = h-topSpacing-bottomSpacing-yScale(0);
			   		if(d.number>0){
			   			for(var m = 0;m<i;m++){
			   				if(rect.data()[m].number>0)
				   				total = total + h-topSpacing-bottomSpacing-yScale(rect.data()[m].number) - heightFromZeroToBottom +100;
				   		}
				        return total;
			   		} 
			   		else if(d.number<0){
			   			for(var m = 0;m<i;m++){
			   				if(rect.data()[m].number<0)
				   				total = total + h-topSpacing-bottomSpacing-yScale(rect.data()[m].number*(-1)) - heightFromZeroToBottom +100;
				   		}
				        return total;
			   		} 
			   		else
			   			return 0;
			   })
				.attr("fill", function(d,i){
			   		return color(d.name);
			    })
				.attr("x", function(d,i){
			   		return leftSpacing+barPadding/2;
			    })
			    .attr("y", function(d,i){
			    	var totalY = 0;
			   		var rectY = 0;
			   		var heightFromZeroToBottom = h-topSpacing-bottomSpacing-yScale(0);
			   		if(d.number>=0){
			   			for(var m = 0;m<=i;m++){
			   				if(rect.data()[m].number>0)
					   			totalY = totalY + h-topSpacing-bottomSpacing-yScale(rect.data()[m].number) - heightFromZeroToBottom; 
					   		else
					   			totalY = totalY + 0;
				   		}
				   		rectY = (h-bottomSpacing-(h-topSpacing-bottomSpacing-yScale(0))) - totalY;
				        return rectY;
			   		}
			   		else if(d.number<0){
			   			for(var m = 0;m<i;m++){
			   				if(rect.data()[m].number<0)
					   			totalY = totalY + h-topSpacing-bottomSpacing-yScale(rect.data()[m].number*(-1)) - heightFromZeroToBottom; 
					   		else
					   			totalY = totalY + 0;
				   		}
				   		rectY = (h-bottomSpacing-(h-topSpacing-bottomSpacing-yScale(0))) + totalY;
				        return rectY;
			   		}
			    })
			    .attr("width", function(d,i){
			   		return rectWidth;
			    })
			    .attr("height",function(d,i){
			    	var heightFromZeroToBottom = h-topSpacing-bottomSpacing-yScale(0);
			   		if(d.number>0)
			   			return h-topSpacing-bottomSpacing-yScale(d.number) - heightFromZeroToBottom; 
			   		else if(d.number<0)
			   			return h-topSpacing-bottomSpacing-yScale(d.number*(-1)) - heightFromZeroToBottom; 
			   		else
			   			return 0;
			    });


		    

		}


		// tooltip
		function tooltip(){
			var tooltip = d3.select("body")
					.append("div")
					.attr("class","tooltip")
					.style("opacity",0.0);

			tooltip.html("<table><tbody></tbody></table>");
			var tooltipSelect = $("div.tooltip tbody");	
			
			svg.selectAll("g.item").selectAll("rect").on("mouseover",function(d){
					//console.log(index);
					tooltipSelect.html("");
					tooltipSelect.append("<tr><td>"+dataSet[0].date+"</td></tr>");
					var posstiveArray = [];
					var negativeArray = [];
					for(var i=0;i<dataSet[0].values.length;i++){
						if(dataSet[0].values[i].number>0)
							posstiveArray.push(dataSet[0].values[i]);
						else
							negativeArray.push(dataSet[0].values[i]);
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
		}


    
	});

	

	

	// import data from txt
	$.ajax({
        url : "data/localDENovartis_Apps_SoB-12_BETACYN_Total.txt",
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