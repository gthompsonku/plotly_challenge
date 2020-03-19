function init() {
    //import data and save to variable data
    d3.json("samples.json").then((importedData) => {
        var data = importedData;
        
        //get sample names from json file to populate the dropdown menu 
        var names = data.names;
        //console.log(names);

        //select dropdown element and initalize option html tag
        var dropdown = d3.select("#selDataset");
        var option;
    
        //create a dropdown option for each sample name
        names.forEach(name => {
            option=dropdown.append('option');
            option.append("option").text(name);
            });
        
        //initialize the page with default plot
        getIndividualSampleData(names[0]); 
    });     
};


    //event listener for dropdown menu
 d3.select('#selDataset').on("change", getUserInput);


    //function to get user input when dropdown menu item is selected
function getUserInput() {
    var dropdown = d3.select("#selDataset");
    var userInput = dropdown.property("value");
    console.log(userInput);
    
    getIndividualSampleData(userInput);
 };


    //function gets data for individual sample to be used for plot and chart 
function getIndividualSampleData(name) {
    d3.json("samples.json").then((data) => {

        var metadata = data.metadata;
        var individualMetaData = metadata.filter(metadata => metadata.id === parseInt(name))[0];
        console.log(individualMetaData);
   
        var samples = data.samples;
        var individualSampleData = samples.filter(sample => sample.id === name)[0];
        console.log(individualSampleData);

        buildTable(individualMetaData);
        buildPlot(individualSampleData);
    });
};
 

    //function displays demographic information for the selected subject
function buildTable(data) {

    var demoTable = d3.select("#sample-metadata");

    //clear table of existing data
    demoTable.html("");

    Object.entries(data).forEach((row) => {
        demoTable.append("h5").text(row[0]+": "+ row[1]+"\n");
    });
};


    //function to build the charts 
function buildPlot(data) {

    //Horizontal Bar Chart

    //Get top 10 sample values and sort in descending order 
    var sorted_sample_values=data.sample_values.sort((a,b) => b.sample_values - a.sample_values);
    var sorted_sample_values=sorted_sample_values.slice(0,10).reverse()
    console.log(sorted_sample_values);

    //Get OTU ids and labels for yaxis and text
    var otu_ids = (data.otu_ids.slice(0,10)).reverse();
    var otu_id_labels = otu_ids.map(d => "OTU "+ d);
    
    var otu_labels = data.otu_labels.slice(0,10);


    //Horizontal Bar Chart
    var trace = {
        x: sorted_sample_values,
        y: otu_id_labels,
        text: otu_labels,
        type:'bar',
        orientation: 'h'
    };
    
    var data = [trace];
    
    var layout = {
        title: "Top 10 Bugs",
        yaxis: {
            tickmode: 'linear',
        },
    };
    
    Plotly.newPlot("bar", data, layout);



    //Bubble chart
    var trace2 = {
        x: otu_ids,
        y: sorted_sample_values,
        text: otu_labels,
        mode: 'markers',
        marker: {
            size: sorted_sample_values,
            color: otu_ids,
        },
    };
    
    var data2 = [trace2];
    
    var layout2 = {
        showlegend: false,
        xaxis: {
            title: "OTU ID"
        },
        //width: 1200,
    };

    Plotly.newPlot("bubble", data2, layout2);

};



init();