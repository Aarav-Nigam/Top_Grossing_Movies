url="https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json";

let moviesData;

let canvas=d3.select("#canvas");
let tooltip = d3.select('#tooltip')
function drawTreeMap(){
    let hierarchy=d3.hierarchy(moviesData,(node)=>{//Data structure to represent tree
        return node['children'];
    })
    .sum((node)=>{
        return node['value'];
    })
    .sort((nodea,nodeb)=>{
        return nodeb['value']-nodea['value'];
    })
    let createTreeMap=d3.treemap().size([1000,600])
    createTreeMap(hierarchy);
    let moviesTitles=hierarchy.leaves()
    console.log(moviesTitles);
    let block=canvas.selectAll('g')
                    .data(moviesTitles)
                    .enter()
                    .append('g').attr('transform',(movie)=>{
                        return 'translate('+movie['x0']+', '+movie['y0']+')'
                    });
    block.append('rect').attr('class','tile')
        .attr('fill',(movie)=>{
            switch(movie['data']['category']){
                case "Action":return 'red';
                case "Drama":return 'blue';
                case "Adventure":return 'purple';
                case "Family":return "yellow";
                case "Animation":return "green";
                case "Comedy":return "violet";
                default: return 'grey';
            }
        })
        .attr('data-name',(movie)=>{
            return movie['data']['name'];
        })
        .attr('data-category',(movie)=>{
            return movie['data']['category'];
        })
        .attr('data-value',(movie)=>{
            return movie['data']['value'];
        })
        .attr('width',(movie)=>{
            return movie['x1']-movie['x0'];
        })
        .attr('height',(movie)=>{
            return movie['y1']-movie['y0'];
        })
        .on('mouseover', (movie) => {
            movie=movie.srcElement.__data__;
            console.log(movie);
            tooltip.transition()
                .style('visibility', 'visible')
                let revenue = movie['data']['value'].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                tooltip.html('$ ' + revenue + '<hr />' + movie['data']['name'])
                tooltip.attr('data-value', movie['data']['value'])
        })
        .on('mouseout', (movie) => {
            tooltip.transition()
                    .style('visibility', 'hidden')
        });
    block.append('text')
        .text((movie)=>{
        return movie['data']['name'];
    })
    .attr('x',5)
    .attr('y',20);

    
    console.log(block);
}
d3.json(url)
    .then((data,error)=>{
        if(error){
            console.log(error);
        }
        else{
            moviesData=data;
        }
        drawTreeMap()
    });