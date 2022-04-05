const path = "samples.json";

const dataPromise = d3.json(path);

dataPromise.then(function(samples) 
{
    let names = samples.names

    console.log(samples)

    //generates dropdown
    for (const name of names) 
    {
        var option = document.createElement("option")
        option.value = name
        option.text = name
        document.getElementById("selDataset").appendChild(option)
    }

    //populates initial page
    function init(samples) 
    {
        //this section of code generates the graphs
        var bacteriaData = samples.samples[0]
        var personData = samples.metadata[0]

        let vals = []
        let ids = []

        //loops throught the sampe data in order to save 
        //the id and values for use with the graphs
        for (let i = 0; i < bacteriaData.otu_ids.length; i++) 
        {
            vals.push(bacteriaData.sample_values[i])
            ids.push('OTU ' + bacteriaData.otu_ids[i].toString())

            if(i >= 9)
            {
                i += bacteriaData.otu_ids.length
            }
        }

        //creates the list element that stores the demographic info
        var list = document.createElement('ul')
        list.id = 'list'
        document.getElementById('sample-metadata').appendChild(list)

        //populates the list with the individuals information
        for(const stat in personData)
        {      
            var text = document.createElement('p')
            text.textContent = stat + ': ' + personData[stat] 
            text.id = stat          
            document.getElementById('list').appendChild(text)
        }

        //creates the framework for the bar chart
        var barData = 
        [{
            type: 'bar',
            x: vals,
            y: ids,
            orientation: 'h'
        }];

        //creates the framework for the bubble chart
        var bubbleData = 
        [{
            x: ids,
            y: vals,
            text: bacteriaData.otu_labels,
            mode:'markers',
            marker: {
                size: vals,
                color: ['black','blue','red','yellow','green','purple','orange','cyan','indigo','lime']
            }
        }];

        //creates layout for bubble chart
        var layout = 
        {
            title: 'OTU ID',
            showlegend: false,
            height: 600,
            width: 800
        }

        //graphs the data
        Plotly.newPlot("bar", barData)
        Plotly.newPlot('bubble',bubbleData,layout)
        
    }

    //calls on the optionChanged function when a new ID is selected
    document.getElementById('selDataset').onchange =  function () {optionChanged(samples)};

    //updates the data once a new id is chosen
    function optionChanged(samples) 
    {
        console.log('You updated the subject ID!')

        let names = samples.names
        let demographics = samples.metadata
        let sampleList = samples.samples

        var dropdownMenu = d3.select("#selDataset")
        var selectedId = dropdownMenu.property("value")
        var selectedIndex = names.indexOf(selectedId)

        let vals = []
        let ids = []

        //updates the demographic information

        var personData = demographics[selectedIndex]
        for(const stat in personData)
        {
            document.getElementById(stat).textContent = stat + ': ' + personData[stat]
        }      

        //for loop to find sample data for given id
        bacteriaData = sampleList[selectedIndex]

        for( let j = 0; j < bacteriaData.otu_ids.length ; j++)
        {
            vals.push(bacteriaData.sample_values[j])
            ids.push('OTU ' + bacteriaData.otu_ids[j].toString())
            if(j >= 9)
            {
                j += bacteriaData.otu_ids.length
            }
        }


    

        //recreates the bar chart
        var barData = 
        [{
            type: 'bar',
            x: vals,
            y: ids,
            orientation: 'h'
        }];

        //recreates the bubble chart
        var bubbleData = 
        [{
            x: ids,
            y: vals,
            text: bacteriaData.otu_labels,
            mode:'markers',
            marker: {
                size: vals,
                color: ['black','blue','red','yellow','green','purple','orange','cyan','indigo','lime']
            }
        }];

        //recreates the layout for bubble chart
        var layout = 
        {
            title: 'OTU ID',
            showlegend: false,
            height: 600,
            width: 800
        }

        //replots the graphs
        Plotly.newPlot("bar", barData)
        Plotly.newPlot('bubble',bubbleData,layout)
    }

    //runs the initialization function
    init(samples);

});
