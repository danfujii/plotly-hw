function buildMetadata(sample) {

    // @TODO: Complete the following function that builds the metadata panel
    // Use `d3.json` to fetch the metadata for a sample
    d3.json('samples.json').then((data) => {
      var metadata = data.metadata;
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
  
      // Use d3 to select the panel with id of `#sample-metadata`
      var PANEL = d3.select('#sample-metadata');

      // Use `.html("") to clear any existing metadata
      PANEL.html("");
  
      // Use `Object.entries` to add each key and value pair to the panel
      // Hint: Inside the loop, you will need to use d3 to append new
      // tags for each key-value in the metadata.
      Object.entries(result).forEach(([key, value]) => {
        PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
      });
    });
  }
  
  function buildCharts(sample) {
  
    // @TODO: Use `d3.json` to fetch the sample data for the plots
    d3.json('samples.json').then((data) => {
      var samples = data.samples;
      var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
      var otu_ids = result.otu_ids;
      var otu_labels = result.otu_labels;
      var sample_values = result.sample_values;
  
      // @TODO: Build a Bubble Chart using the sample data
      var bubble_layout = {
        title: 'Bacteria Cultures per Sample',
        margin: { t: 0 },
        hovermode: 'closest',
        xaxis: { title: 'OTU ID'},
        margin: { t: 30 }
      };
      
      var bubble_data = [
      {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: 'markers',
        marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: 'Earth'
        }
      }
    ];
  
      Plotly.newPlot('bubble', bubble_data, bubble_layout);
  
      // @TODO: Build a bar Chart
      // HINT: You will need to use slice() to grab the top 10 sample_values,
      // otu_ids, and labels (10 each).
      var yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
      var bar_data = [
        {
          y: yticks,
          x: sample_values.slice(0, 10).reverse(),
          text: otu_labels.slice(0, 10).reverse(),
          type: 'bar',
          orientation: 'h',
        }
      ];

      var bar_layout = {
        title: 'Top 10 Bacteria Cultures Found',
        margin: { t: 30, l: 150 }
      };

      Plotly.newPlot('bar', bar_data, bar_layout);
    });
  }
  
  function init() {
    // Grab a reference to the dropdown select element
    var selector = d3.select('#selDataset');
  
    // Use the list of sample names to populate the select options
    d3.json('samples.json').then((data) => {
      console.log('data', data);
      var sample_names = data.names;
      sample_names.forEach((sample) => {
        selector
          .append('option')
          .text(sample)
          .property('value', sample);
      });
  
      // Use the first sample from the list to build the initial plots
      const firstSample = sample_names[0];
      buildCharts(firstSample);
      buildMetadata(firstSample);
    });
  };
  
  function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildCharts(newSample);
    buildMetadata(newSample);
  };
  
  // Initialize the dashboard
  init();