$(document).ready(function(){function t(t){var e=[];p.selectAll("rect").each(function(t,a){"white"!=$(this).attr("fill")&&e.push(t.name)}),s=[],i=0;for(var a=[],r=0;r<t.length;r++){a=[];for(var n=t[r]["Segment Combination"],l=0;l<e.length;l++)if(n==e[l])for(var o=0;o<g.length;o++)a.push({date:v(g[o]),number:t[r][g[o]]}),Number(t[r][g[o]])>i&&(i=t[r][g[o]]);a.length>0&&s.push({name:n,values:a})}}function e(){h=d3.scale.linear().domain([0,i]).rangeRound([l,0]),m=d3.svg.axis().scale(h).orient("left"),o.select("g.axis.yAxis").transition().duration(500).call(m);var t=d3.svg.line().x(function(t){return u(t.date)}).y(function(t){return h(t.number)}),e=o.selectAll("path.line").data(s).enter().append("path");e.attr("class","line").attr("d",function(e){return t(e.values)}).attr("transform","translate("+r.left+","+r.top+")").style("stroke",function(t){return c(t.name)});for(var a=0;a<e[0].length;a++)d3.select(e[0][a]).attr("stroke-dasharray",e[0][a].getTotalLength()+" "+e[0][a].getTotalLength()).attr("stroke-dashoffset",e[0][a].getTotalLength()).transition().duration(500).ease("linear").attr("stroke-dashoffset",0)}function a(){o.selectAll("circle").remove(),o.selectAll(".vertical_line").remove(),o.selectAll("rect.bg_rect").remove(),$("div.tooltip tbody").html(""),bisectDate=d3.bisector(function(t){return t.date}).left;var t=o.selectAll("svg").data(s).enter().append("circle").attr("fill",function(t){return c(t.name)}).attr("r",4).attr("display","none").attr("name",function(t){return t.name});o.selectAll("circle").attr("transform",function(t){return"translate("+(r.left+u(t.values.date))+","+(r.top+h(t.values.number))+")"});var e=o.append("line").attr("class","vertical_line").attr("stroke-dasharray",10).attr("stroke","#a6a8ac").attr("stroke-width",.8).attr("display","none");o.append("rect").attr("class","bg_rect").attr("width",n).attr("height",l).attr("fill","none").attr("pointer-events","all").attr("transform","translate("+r.left+","+r.top+")").on("mouseover",function(){t.attr("display",null),e.attr("display",null),a.style("left",d3.event.pageX+"px").style("top",d3.event.pageY+20+"px").style("opacity",1)}).on("mouseout",function(){t.attr("display","none"),e.attr("display","none"),a.style("opacity",0)}).on("mousemove",function(){var t=u.invert(d3.mouse(this)[0]),n=[];for(key in s){var o=s[key].values,i=bisectDate(o,t,1),c=o[i-1],f=o[i];d=t-c.date>f.date-t?f:c,n.push(d)}var m=[],g,v,y=new Array(12);y[0]="Jan",y[1]="Feb",y[2]="Mar",y[3]="Apr",y[4]="May",y[5]="Jun",y[6]="Jul",y[7]="Aug",y[8]="Sep",y[9]="Oct",y[10]="Nov",y[11]="Dec",$("circle").each(function(t){$(this).attr("transform","translate("+(r.left+u(n[t].date))+","+(r.top+h(n[t].number))+")"),g=$(this).attr("fill"),v=$(this).attr("name"),circleDate=y[n[t].date.getUTCMonth()]+" "+n[t].date.getFullYear(),m.push({color:g,name:v,date:circleDate,number:n[t].number})}),m.sort(function(t,e){return e.number-t.number}),console.log(m),p.html(""),p.append("<tr><td>"+m[0].date+"</td></tr>");for(var i=0;i<m.length;i++)p.append("<tr><td><span class='color' style='background-color:"+m[i].color+"'></span><span>"+m[i].name+"</span></td><td class='value'>"+m[i].number+"</td></tr>");e.attr("x1",r.left+u(n[0].date)).attr("x2",r.left+u(n[0].date)).attr("y1",r.top).attr("y2",l+r.top),a.style("left",d3.event.pageX+25+"px").style("top",d3.event.pageY+"px")});var a=d3.select("body").append("div").attr("class","tooltip").style("opacity",0),i="<table><tbody></tbody></table>";a.html(i);var p=$("div.tooltip tbody")}var r={top:30,bottom:30,left:50,right:350},n=1400-r.left-r.right,l=650-r.top-r.bottom,o=d3.select("div#svg").append("svg").attr("width",n+r.left+r.right).attr("height",l+r.top+r.bottom),s=[],i=0,c=d3.scale.category20c(),p,u,f,h,m,g=[],v=d3.time.format("%Y-%m").parse;d3.tsv("data/localDENovartis_Apps_CoMedication-22_TimelyPat_ALPHACYN.txt",function(d,y){for(var b in y[0])g.push(b);g.splice(0,1);for(var x=[],A=0;A<y.length;A++){x=[];for(var _=0;_<g.length;_++)x.push({date:v(g[_]),number:y[A][g[_]]}),Number(y[A][g[_]])>i&&(i=y[A][g[_]]);s.push({name:y[A]["Segment Combination"],values:x})}for(var k=[],A=0;A<g.length;A++)k[A]=v(g[A]);p=o.selectAll("g.legend").data(s).enter().append("g").attr("class","legend"),p.append("rect").attr("stroke",function(t,e){return c(t.name)}).attr("fill",function(t,e){return c(t.name)}).attr("x",n+r.left+r.right-330).attr("y",function(t,e){return r.top+20*e+1}).attr("width",10).attr("height",6).on("click",function(r){var n=c(r.name);"white"==$(this).attr("fill")?$(this).attr("fill",n):$(this).attr("fill","white"),o.selectAll(".line").remove(),t(y),e(),a()}),p.append("text").attr("x",n+r.left+r.right-315).attr("y",function(t,e){return r.top+20*e}).attr("dominant-baseline","hanging").text(function(t,e){return t.name}).attr("font-size","11px"),u=d3.time.scale().domain(d3.extent(k,function(t){return t})).range([0,n]),f=d3.svg.axis().scale(u).orient("bottom"),h=d3.scale.linear().domain([0,i]).rangeRound([l,0]),m=d3.svg.axis().scale(h).orient("left"),o.append("g").attr("class","axis no_line_axis").attr("transform","translate("+r.left+","+(l+r.top)+")").transition().duration(500).call(f),o.append("g").attr("class","axis yAxis no_line_axis").attr("transform","translate("+r.left+","+r.top+")").transition().duration(500).call(m),e(),a()}),$.ajax({url:"data/localDENovartis_Apps_CoMedication-22_TimelyPat_ALPHACYN.txt",success:function(t){for(var e="",a="",r=t.split("\n"),n=0;n<r.length;n++){var l=r[n].split("	");if(e="",a="",0==n){for(var o,s=0;s<l.length;s++)o=l[0],s<l.length/2?e=e+"<th>"+l[s]+"</th>":a=a+"<th>"+l[s]+"</th>";a="<th>"+o+"</th>"+a,$("table#first_half thead").append("<tr>"+e+"</tr>"),$("table#second_half thead").append("<tr>"+a+"</tr>")}else{for(var o,s=0;s<l.length;s++)o=l[0],s<l.length/2?e=e+"<td>"+l[s]+"</td>":a=a+"<td>"+l[s]+"</td>";a="<td>"+o+"</td>"+a,$("table#first_half tbody").append("<tr>"+e+"</tr>"),$("table#second_half tbody").append("<tr>"+a+"</tr>")}}}})});