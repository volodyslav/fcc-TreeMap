import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const container = document.querySelector("#container")

const URLVideoGames = "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json"


async function getData(){
    try{
        const responseVideoGames = await fetch(URLVideoGames)
        const dataVideoGames = await responseVideoGames.json()
        drawTreeMap( dataVideoGames)
        
    }
    catch(e){
        console.log(e)
    }
}

getData()

function drawTreeMap(videoGames){
    const width = 1000
    const height = 800


    const svg = d3.create("svg")
                .attr("width", width)
                .attr("height", height)

    let treeMap = d3.treemap()
                .size([width, height])
                .padding(1)
                

    let root = d3.hierarchy(videoGames)
                .sum(d => d.value);
    treeMap(root);

    let colorScale = d3.scaleOrdinal()
                    .domain(videoGames.children.map(d => d.name))
                    .range(d3.schemeCategory10);
    
    const tooltip = d3.select("body")
                    .append("div")
                    .style("position", "absolute")
                    .attr("id", "tooltip")
                    
                    .style("background-color", "rgba(34, 34, 56, 0.9)")
                    .style("color", "white")
                    .style("padding", "1rem")
                    .style("border-radius", "10px")
                    .style("pointer-events", "none")
                    .style("opacity", 0)

        svg.selectAll(".tile")
                    .data(root.leaves())
                    .enter()
                    .append("rect")
                    .attr("class", "tile")
                    .attr("x", d => d.x0)
                    .attr("y", d => d.y0)
                    .attr("width", d => d.x1 - d.x0)
                    .attr("height", d => d.y1 - d.y0)
                    .attr("data-name", d => d.data.name)
                    .attr("data-category", d => d.data.category)
                    .attr("data-value", d => d.data.value)
                    .style("fill", d => colorScale(d.data.category))
                    .style("stroke", "white")
                    .style("stroke-width", 1)
                    
    
    svg.selectAll('text')
                .data(root.leaves())
                .enter()
                .append('text')
                .selectAll('tspan')
                .data(d => {
                    return d.data.name.split(/(?=[A-Z][^A-Z])/g) 
                        .map(n => {
                            return {
                                text: n,
                                x0: d.x0,                        
                                y0: d.y0                        
                            }
                        });
                })
                .enter()
                .append('tspan')
                .attr("x", (d) => d.x0 + 5)
                .attr("y", (d, i) => d.y0 + 15 + (i * 10))       
                .text((d) => d.text)
                .attr("font-size", "0.6em")
                .attr("fill", "white");

    svg.selectAll(".tile")
            .on("mouseenter", (e, d) => {
                    tooltip
                    .style("opacity", 1)
                    .html(`Name: ${d.data.name} <br>Category: ${d.data.category}  <br> Value: ${d.value}`)
                    .style("left", (e.pageX + 20) + "px")
                    .style("top", (e.pageY + 20) + "px")
                    .attr("data-value", d.value)
                })
                .on("mouseleave", () => {
                    tooltip.style("opacity", 0)
                })

    const svgLegend = d3.create("svg")
                        .attr("width", 600)
                        .attr("height", 300)
                        .attr("id", "legend")
                        .style("margin", "1rem")
    
    const legendData = colorScale.domain().map(category => ({
                        name: category,
                        color: colorScale(category)
                        }));

                        const columns = 3; 
                        const columnWidth = 150; 
                        const itemHeight = 25; 
                        
                        
    const legendGroup = svgLegend.selectAll(".item")
                          .data(legendData)
                          .enter()
                          .append("g")
                          .attr("class", "item")
                          .attr("transform", (d, i) => `translate(${Math.floor(i / columns) * columnWidth}, ${i % columns * itemHeight})`);

    
    legendGroup.append("rect")
                    .attr("x", 0)
                    .attr("y", 0)
                    .attr("width", 20)
                    .attr("height", 20)    
                    .style("fill", d => d.color) 
                    .attr("class", "legend-item")    

    legendGroup.append("text")
                    .attr("x", 30)
                    .attr("y", 15)       
                    .text((d) => d.name)
                    .attr("font-size", "1rem")
 
    container.appendChild(svg.node())
    container.appendChild(svgLegend.node())
}