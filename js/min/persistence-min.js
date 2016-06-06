function drawPersistence(t){function e(t){var e=[];u.selectAll("rect").each(function(t,a){"white"!=$(this).attr("fill")&&e.push(t)}),o=[],c=0;for(var a=[],r=0;r<t.length;r++){a=[];for(var n=t[r]["Market Segments"],l=0;l<e.length;l++)if(n==e[l].MarketSegment)for(item in t[r])a.push({index:item,number:Number(t[r][item])}),c<Number(t[r][item])&&(c=Number(t[r][item]));a.pop(),a.length>0&&o.push({MarketSegment:n,values:a})}}function a(){g=d3.scale.linear().domain([0,c]).rangeRound([i,0]),h=d3.svg.axis().scale(g).orient("left"),s.select("g.axis.yAxis").transition().duration(500).call(h);var t=d3.svg.line().x(function(t){return f(t.index)}).y(function(t){return g(t.number)}),e=s.selectAll("path.line").data(o).enter().append("path");e.attr("class","line").attr("d",function(e){return t(e.values)}).attr("transform","translate("+n.left+","+n.top+")").style("stroke",function(t){return p(t.MarketSegment)});for(var a=0;a<e[0].length;a++)d3.select(e[0][a]).attr("stroke-dasharray",e[0][a].getTotalLength()+" "+e[0][a].getTotalLength()).attr("stroke-dashoffset",e[0][a].getTotalLength()).transition().duration(500).ease("linear").attr("stroke-dashoffset",0)}function r(){s.selectAll("circle").remove(),s.selectAll(".vertical_line").remove(),s.selectAll("rect.bg_rect").remove(),$("div.tooltip tbody").html(""),bisectDate=d3.bisector(function(t){return t.index}).left;var t=s.selectAll("svg").data(o).enter().append("circle").attr("fill",function(t){return p(t.MarketSegment)}).attr("r",4).attr("display","none").attr("name",function(t){return t.MarketSegment});s.selectAll("circle").attr("transform",function(t){return"translate("+(n.left+f(t.values.index))+","+(n.top+g(t.values.number))+")"});var e=s.append("line").attr("class","vertical_line").attr("stroke-dasharray",10).attr("stroke","#a6a8ac").attr("stroke-width",.8).attr("display","none");s.append("rect").attr("class","bg_rect").attr("width",l).attr("height",i).attr("fill","none").attr("pointer-events","all").attr("transform","translate("+n.left+","+n.top+")").on("mouseover",function(){t.attr("display",null),e.attr("display",null),a.style("left",d3.event.pageX+"px").style("top",d3.event.pageY+20+"px").style("opacity",1)}).on("mouseout",function(){t.attr("display","none"),e.attr("display","none"),a.style("opacity",0)}).on("mousemove",function(){var t=f.invert(d3.mouse(this)[0]),r=[];for(key in o){var l=o[key].values,s=bisectDate(l,t,1),p=l[s-1],u=l[s];d=t-p.index>u.index-t?u:p,r.push(d)}var m=[],h,v;$("circle").each(function(t){$(this).attr("transform","translate("+(n.left+f(r[t].index))+","+(n.top+g(r[t].number))+")"),h=$(this).attr("fill"),v=$(this).attr("name"),m.push({color:h,name:v,number:r[t].number})}),m.sort(function(t,e){return e.number-t.number}),c.html("");for(var s=0;s<m.length;s++)c.append("<tr><td><span class='color' style='background-color:"+m[s].color+"'></span><span>"+m[s].name+"</span></td><td class='value'>"+m[s].number+"</td></tr>");e.attr("x1",n.left+f(r[0].index)).attr("x2",n.left+f(r[0].index)).attr("y1",n.top).attr("y2",i+n.top),a.style("left",d3.event.pageX+"px").style("top",d3.event.pageY+20+"px")});var a=d3.select("body").append("div").attr("class","tooltip").style("opacity",0),r="<table><tbody></tbody></table>";a.html(r);var c=$("div.tooltip tbody")}var n={top:30,bottom:30,left:50,right:200},l=1200-n.left-n.right,i=650-n.top-n.bottom,s=d3.select("div#svg").append("svg").attr("width",l+n.left+n.right).attr("height",i+n.top+n.bottom),o=[],c=0,p=d3.scale.category10(),u,f,m,g,h;d3.tsv("data/Persistence_"+t+"_localDENovartis_Apps_Persistence-19_.txt",function(t,d){for(var v=[],b=0;b<d.length;b++){var y=0;v=[];for(item in d[b])v.push({index:item,number:Number(d[b][item])}),c<Number(d[b][item])&&(c=Number(d[b][item]));v.pop();var x=d[b]["Market Segments"];o.push({MarketSegment:x,values:v})}u=s.selectAll("g.legend").data(o).enter().append("g").attr("class","legend"),u.append("rect").attr("stroke",function(t,e){return p(t.MarketSegment)}).attr("fill",function(t,e){return p(t.MarketSegment)}).attr("x",l+n.left+n.right-120).attr("y",function(t,e){return n.top+20*e}).attr("width",20).attr("height",10).on("click",function(t){var n=p(t.MarketSegment);"white"==$(this).attr("fill")?$(this).attr("fill",n):$(this).attr("fill","white"),s.selectAll(".line").remove(),e(d),a(),r()}),u.append("text").attr("x",l+n.left+n.right-90).attr("y",function(t,e){return n.top+20*e}).attr("dominant-baseline","hanging").text(function(t,e){return t.MarketSegment}),f=d3.scale.linear().domain([0,12]).range([0,l]),m=d3.svg.axis().scale(f).orient("bottom"),g=d3.scale.linear().domain([0,c]).rangeRound([i,0]),h=d3.svg.axis().scale(g).orient("left"),s.append("g").attr("class","axis no_line_axis").attr("transform","translate("+n.left+","+(i+n.top)+")").transition().duration(500).call(m),s.append("g").attr("class","axis yAxis").attr("transform","translate("+n.left+","+n.top+")").transition().duration(500).call(h),a(),r()}),$.ajax({url:"data/Persistence_"+t+"_localDENovartis_Apps_Persistence-19_.txt",success:function(t){for(var e="",a=t.split("\n"),r=0;r<a.length;r++){var n=a[r].split("	");if(0==r){for(var l=0;l<n.length;l++)e=e+"<th>"+n[l]+"</th>";$("table thead").append("<tr>"+e+"</tr>")}else{for(var l=0;l<n.length;l++)e=e+"<td>"+n[l]+"</td>";$("table tbody").append("<tr>"+e+"</tr>")}e=""}}})}