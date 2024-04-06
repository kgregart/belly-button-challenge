// Assign constant variable to the URL 
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";
let data;

// Initialize the page
function init() {

//Reference for dropdown selection
        let dropdown = d3.select("#selDataset");

    // Populating the dropdown menu with sample IDs using D3
    d3.json(url).then((jsonData) => {
        data = jsonData; 
        console.log(data); 
        
        // Adding dropdown menu options
        data.names.forEach((name) => {
            dropdown.append("option").text(name).property("value", name);
        });

        // Use the first sample ID to chart data
        let firstSample = data.names[0];
        BarChart(firstSample);
        BubbleChart(firstSample);
        SampleMetadata(firstSample);
        Gauge(firstSample);
    });
}

// Function to build the bar chart
function BarChart(sample) {
        
    // Filter the data for the selected sample ID
        var selectedSample = data.samples.filter((s) => s.id == sample)[0];

        // Sort sample_values in descending order
        selectedSample.sample_values.sort((a, b) => b - a);

        // Get the top 10 OTUs' sample values, IDs, and labels
        var topSampleValues = selectedSample.sample_values.slice(0, 10).reverse();
        var topOTUIDs = selectedSample.otu_ids.slice(0, 10).reverse();
        var topOTULabels = selectedSample.otu_labels.slice(0, 10).reverse();

        // Create the horizontal bar chart
        var trace = {
            x: topSampleValues,
            y: topOTUIDs.map((id) => `OTU ${id}`),
            text: topOTULabels,
            type: "bar",
            orientation: "h"
        };

        var plotData = [trace];

        var layout = {
            title: `Top 10 OTUs for Sample ${sample}`,
            xaxis: {title: "Sample Values"},
            yaxis: {title: "OTU IDs"}
        };

        Plotly.newPlot("bar", plotData, layout);
}

// Function to build the bubble chart
function BubbleChart(sample) {
        
    // Filter the data for the selected sample ID
        var selectedSample = data.samples.filter((s) => s.id === sample)[0];
        
        // Get data for the bubble chart
        var otuIds = selectedSample.otu_ids;
        var sampleValues = selectedSample.sample_values;
        var otuLabels = selectedSample.otu_labels;
        var trace = {
            x: otuIds,
            y: sampleValues,
            text: otuLabels,
            mode: 'markers',
            marker: {
                size: sampleValues,  
                color: otuIds,       
            }
        };
        var plotData = [trace];
        var layout = {
            title: `Bubble Chart for Sample ${sample}`,
            xaxis: {title: "OTU IDs"},
            yaxis: {title: "Sample Values"}
        };
        Plotly.newPlot("bubble", plotData, layout);
    }

// Function to display sample metadata
function SampleMetadata(sample) {
        
    // Filter data for the selected sample ID
        var metadata = data.metadata.filter((p) => p.id == sample)[0];
       
        // Select the HTML element to display the metadata
        var metadataPanel = d3.select("#sample-metadata");
        
        // Clear metadata
        metadataPanel.html("");
        
        // Loop through the metadata properties and display them
        Object.entries(metadata).forEach(([key, value]) => {
            metadataPanel.append("p").text(`${key}: ${value}`);
        });
}

// Function to build the gauge chart
function Gauge(sample) {
       
        // Filter data for selected sample ID
        var selectedMetadata = data.metadata.filter((m) => m.id == sample)[0];
       
        // Get weekly washing frequency
        var wfreq = selectedMetadata.wfreq;
       
        // Create gauge chart
        var plotData = [
            {
                domain: {x: [0, 1], y: [0, 1]},
                value: wfreq,
                title: {text: "Belly Button Weekly Washing Frequency"},
                type: "indicator",
                mode: "gauge+number",
                gauge: {
                    axis: {range: [0, 9] },
                    steps: [
                        {range: [0, 1], color: "pink"},
                        {range: [1, 2], color: "red"},
                        {range: [2, 3], color: "darkred"},
                        {range: [3, 4], color: "lightyellow"},
                        {range: [4, 5], color: "yellow"},
                        {range: [5, 6], color: "gold"},
                        {range: [6, 7], color: "lightgreen"},
                        {range: [7, 8], color: "green"},
                        {range: [8, 9], color: "darkgreen"}
                ]}}];
        var layout = {
            width: 400,
            height: 300,
            margin: {t: 0, b: 0},
        };

        Plotly.newPlot("gauge", plotData, layout);
}
// Call gauge function in optionChange function
function optionChanged(newSample) {
    BarChart(newSample);
    BubbleChart(newSample);
    SampleMetadata(newSample);
    Gauge(newSample); 
}

// Initialize the page
init();