var barPadding = 10;
var margin = {top: 50,bottom: 80,left:120,right:260};
var w = $("body").width() - margin.left - margin.right;
var h = 700 - margin.top - margin.bottom;
//var color = d3.scale.category20c();
var colors = [
              "rgb(116,184,111)", //new
              "rgb(72,139,67)", //win
              "rgb(168,205,165)", //add-on
              "rgb(142,69,69)", //off drug
              "rgb(170,115,115)", //end
              "rgb(114,22,22)", //loss
              "rgb(227,208,208)", //drop off
              "rgb(65,99,153)", //repeat
              "rgb(163,195,247)" //restart
              ];
var componentSet = ["Repeat","Restart","Win","New","Add-On","Loss","Off Drug","End","Drop-Off"];
var legendSet = [
{
	name: "Add-On",
	color: "rgb(168,205,165)"
},
{
	name: "New",
	color: "rgb(116,184,111)"
},
{
	name: "Win",
	color: "rgb(72,139,67)"
},
{
	name: "Restart",
	color: "rgb(163,195,247)"
},
{
	name: "Repeat",
	color: "rgb(65,99,153)"
},
{
	name: "Loss",
	color: "rgb(114,22,22)"
},
{
	name: "Off Drug",
	color: "rgb(142,69,69)"
},
{
	name: "End",
	color: "rgb(170,115,115)"
},
{
	name: "Drop-Off",
	color: "rgb(227,208,208)"
}
];

var svg = d3.select("div#svg")
        .append("svg")
        .attr("width", w + margin.left + margin.right)
        .attr("height", 700);

function sob(drugName,time){
	svg.selectAll("*").remove();
	$("div.tooltip").remove();
	d3.tsv("data/localDENovartis_Apps_SoB-12_"+drugName+"_"+time+".txt", function(error, data) {
		if(time=="Month"){
			barPadding = 10;
			processData(data);
			svg.selectAll(".xAxis")
		    	.selectAll("text")
			    .attr("x", -10)
			    .attr("font-size","10px")
			    .attr("text-anchor","middle")
			    .attr("transform", "rotate(-23)");
		}   
		if(time=="Quarter"){
			barPadding = 30;
			processData(data);
		}
		if(time=="MAT"){
			barPadding = 120;
			processData(data);
		}
		if(time=="Total"){
			barPadding = 500;
			processData(data);
		}
	});
}2

function processData(data){
	//console.log(data)
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
    var sortedDataObject = [];
    var totalPositive = 0;
    var totalNegative = 0;
	for(var i=0; i<xRange.length; i++){
		for(var j = 0; j<data.length; j++){
			if(Number(data[j][xRange[i]])>=0)
				totalPositive = totalPositive+Number(data[j][xRange[i]]);
			else
				totalNegative = totalNegative+Number(data[j][xRange[i]]);
			dataObject.push({"name":data[j]["Components"],"number":Number(data[j][xRange[i]]),"color":colors[j]});				
		}
		//console.log(dataObject)
		// sort data
		// dataObject.sort(function(a,b){
		// 	// descending
		// 	return b.number-a.number;
		// })
		for(var m = 0; m < componentSet.length; m ++){
			for(item in dataObject){
				if(componentSet[m] == dataObject[item].name){
					sortedDataObject.push(dataObject[item]);
				}
			}
		}
		//console.log(dataObject)
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
		dataSet.push({"date":xRange[i],"values":sortedDataObject});
		dataObject = [];
		sortedDataObject = [];			
	}
	//console.log(dataSet);

	//var color = d3.scale.category10();
	var legend = svg.selectAll("g.legend")
						.data(legendSet)
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
			.attr("x",margin.left+w+margin.right-180)
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
				svg.selectAll("g.item").remove();
				svg.selectAll("g.grid").remove();
				updateDataSet();
				drawRect();
				tooltip();
			});

	legend.append("text")
			.attr("x",margin.left+w+margin.right-140)
			.attr("y",function(d,i){
				return margin.top+20*i;
			})
			.attr("dominant-baseline","hanging")
			.text(function(d,i){
				return d.name;
			})

	var xScale = d3.scale.ordinal()
		    .domain(xRange)
		    .rangeRoundBands([0,w]);


    var xAxis = d3.svg.axis()
                  .scale(xScale)
                  .orient("bottom")
                  .outerTickSize(0);



    // minimum = Math.floor(minimum/100)*100;
    // maximum = Math.ceil(maximum/100)*100;
    if(maximum>100){
    	minimum = Math.floor(minimum/100)*100;
    	maximum = Math.ceil(maximum/100)*100;
    }
	var yScale = d3.scale.linear()
		    .domain([minimum,maximum])
		    .range([h,0]);
    var yAxis = d3.svg.axis()
			    .scale(yScale)
			    //.tickValues(d3.range(minimum, maximum, 200))
			    .orient("left");

	// draw axis
    svg.append("g")
    	.attr("class", "no_line_axis xAxis")
    	.attr("transform", "translate("+margin.left+"," + (h+margin.top) + ")")
    	.transition()
	    .duration(500)
    	.call(xAxis)
    	.selectAll("text")
	    .attr("y", 30);
	    // .attr("x", -40)
	    // .attr("font-size","10px")
	    // .attr("text-anchor","middle")
	    // .attr("transform", "rotate(-30)");


   	svg.append("g")
	    .attr("class","no_line_axis yAxis")
	    .attr("transform", "translate(" + margin.left + ","+margin.top+")")
	    .transition()
	    .duration(500)
	    .call(yAxis);

	// draw background line
    function make_y_axis() {        
	    return d3.svg.axis()
	        .scale(yScale)
	        .orient("left");
	}
    svg.append("g")         
	    .attr("class", "grid")
	    .call(make_y_axis()
	        .tickSize(-w, 0, 0)
	        .tickFormat("")
	        )
	    .attr("transform", "translate("+ margin.left +"," + ( margin.top ) + ")");


	// draw rect
	drawRect();
	tooltip();


	function updateDataSet(){
		// check which legends being selected
		var selectedLegends = [];
		legend.selectAll("rect").each(function(d,i){
			if($(this).attr("fill")!="white")
				selectedLegends.push(d.name);
		});
		//console.log(selectedLegends);

	    var dataObject=[];
	    var sortedDataObject=[];
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
						dataObject.push({"name":data[j]["Components"],"number":Number(data[j][xRange[i]]),"color": colors[j]});
					}
				}				
			}
			// sort data
			// dataObject.sort(function(a,b){
			// 	// descending
			// 	return b.number-a.number;
			// })
			for(var m = 0; m < componentSet.length; m ++){
				for(item in dataObject){
					if(componentSet[m] == dataObject[item].name){
						sortedDataObject.push(dataObject[item]);
					}
				}
			}
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
			dataSet.push({"date":xRange[i],"values":sortedDataObject});
			dataObject = [];			
			sortedDataObject = [];
		}
		//console.log(dataSet)


	}
	
	function drawRect(){
		if(maximum>100){
	    	minimum = Math.floor(minimum/100)*100;
	    	maximum = Math.ceil(maximum/100)*100;
	    }
		yScale = d3.scale.linear()
			    .domain([minimum,maximum])
			    .range([h,0]);
	    yAxis = d3.svg.axis()
				    .scale(yScale)
				    //.tickValues(d3.range(minimum, maximum, 200))
				    .orient("left");

		// draw axis
	    svg.select(".yAxis")
		    .attr("transform", "translate(" + margin.left + ","+margin.top+")")
		    .transition()
		    .duration(500)
		    .call(yAxis);

		// draw background line
	    function make_y_axis() {        
		    return d3.svg.axis()
		        .scale(yScale)
		        .orient("left");
		}
	    svg.append("g")         
		    .attr("class", "grid")
		    .call(make_y_axis()
		        .tickSize(-w, 0, 0)
		        .tickFormat("")
		        )
		    .attr("transform", "translate("+ margin.left +"," + ( margin.top ) + ")");

		var rect = svg.selectAll("g.item")
					.data(dataSet)
	   				.enter()
	   				.append("g")
	   				.attr("class","item");

		var rectWidth = w/dataSet.length-barPadding;
		for(var j = 0;j<dataSet[0].values.length;j++){
			rect.append("rect")
				.attr("height",0)
				.attr("y", function(d,i) {
			   		var totalY = 0;
			   		var rectY = 0;
			   		var heightFromZeroToBottom = h-yScale(0);
			   		if(d.values[j].number>=0){
			   			for(var m = 0;m<j;m++){
			   				if(d.values[m].number>0)
					   			totalY = totalY + h-yScale(d.values[m].number) - heightFromZeroToBottom; 
					   		else
					   			totalY = totalY + 0;
				   		}
				   		rectY = (h+margin.top-heightFromZeroToBottom) - totalY;
				        return rectY;
			   		}
			   		else if(d.values[j].number<0){
			   			for(var m = 0;m<j;m++){
			   				if(d.values[m].number<0)
					   			totalY = totalY + h-yScale(d.values[m].number*(-1)) - heightFromZeroToBottom; 
					   		else
					   			totalY = totalY + 0;
				   		}
				   		rectY = (h+margin.top-heightFromZeroToBottom) + totalY;
				        return rectY;
			   		} 
			   })
			   .transition()
			   .duration(function(d){
			   		var heightFromZeroToBottom = h-yScale(0);
			   		if(d.values[j].number>0)
			   			return h-yScale(d.values[j].number) - heightFromZeroToBottom; 
			   		else if(d.values[j].number<0)
			   			return h-yScale(d.values[j].number*(-1)) - heightFromZeroToBottom; 
			   		else
			   			return 0;
			   })
			   .ease("swing")
			   .delay(function(d){
			   		var total = 0;
			        var heightFromZeroToBottom = h-yScale(0);
			   		if(d.values[j].number>0){
			   			for(var m = 0;m<j;m++){
			   				if(d.values[m].number>0)
				   				total = total + h-yScale(d.values[m].number) - heightFromZeroToBottom;
				   		}
				        return total;
			   		} 
			   		else if(d.values[j].number<0){
			   			for(var m = 0;m<j;m++){
			   				if(d.values[m].number<0)
				   				total = total + h-yScale(d.values[m].number*(-1)) - heightFromZeroToBottom;
				   		}
				        return total;
			   		} 
			   		else
			   			return 0;
			   })
			   .attr("x", function(d,i){
			   		return margin.left+(2*i+1)*barPadding/2+rectWidth*i;
			   })
			   .attr("y", function(d,i) {
			   		var totalY = 0;
			   		var rectY = 0;
			   		var heightFromZeroToBottom = h-yScale(0);
			   		if(d.values[j].number>=0){
			   			for(var m = 0;m<=j;m++){
			   				if(d.values[m].number>0)
					   			totalY = totalY + h-yScale(d.values[m].number) - heightFromZeroToBottom; 
					   		else
					   			totalY = totalY + 0;
				   		}
				   		rectY = (h+margin.top-heightFromZeroToBottom) - totalY;
				        return rectY;
			   		}
			   		else if(d.values[j].number<0){
			   			for(var m = 0;m<j;m++){
			   				if(d.values[m].number<0)
					   			totalY = totalY + h-yScale(d.values[m].number*(-1)) - heightFromZeroToBottom; 
					   		else
					   			totalY = totalY + 0;
				   		}
				   		rectY = (h+margin.top-heightFromZeroToBottom) + totalY;
				        return rectY;
			   		}
			   })
			   .attr("fill",function(d){
			   		return d.values[j].color;
			   })
			   .attr("height", function(d,i){
			   		var heightFromZeroToBottom = h-yScale(0);
			   		if(d.values[j].number>0)
			   			return h-yScale(d.values[j].number) - heightFromZeroToBottom; 
			   		else if(d.values[j].number<0)
			   			return h-yScale(d.values[j].number*(-1)) - heightFromZeroToBottom; 
			   		else
			   			return 0;
			   })
			   .attr("width", function(d,i){
			   		return rectWidth;
			   });


		}
	}

	// tooltip
	function tooltip(){
		var rect = svg.selectAll("g.item");
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
				tooltipSelect.append("<tr><td>"+d.date+"</td></tr>");

				var positiveArray = [];
				var negativeArray = [];
				for(var i=0;i<d.values.length;i++){
					if(d.values[i].number>0)
						positiveArray.push(d.values[i]);
					else
						negativeArray.push(d.values[i]);
				}
				
				for(var i=positiveArray.length-1;i>=0;i--){
					//console.log(positiveArray[i])
					tooltipSelect.append("<tr><td class='value'>"+positiveArray[i].number+"</td><td><span class='text-right'>"+ positiveArray[i].name +"</span></td></tr>");
				}
				for(var i=0;i<negativeArray.length;i++){
					//console.log(positiveArray[i])
					tooltipSelect.append("<tr><td class='value'>"+negativeArray[i].number+"</td><td><span>"+ negativeArray[i].name +"</span></td></tr>");
				}
				tooltip.style("left", (d3.event.pageX + 25) + "px")
					.style("top", (d3.event.pageY) + "px")
					.style("opacity",1.0);
			})
			.on("mousemove",function(d){
				tooltip.style("left", (d3.event.pageX + 25) + "px")
						.style("top", (d3.event.pageY) + "px");
			})
			.on("mouseout",function(d){			
				tooltip.style("opacity",0.0);
			});

	}

    
}
