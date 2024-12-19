const units = {
    Celcius: "°C",
    Fahrenheit: "°F",
  };
  
  const config = {
    minTemp: -20,
    maxTemp: 50,
    currentTemp: 30,
    unit: "Celcius",
  };
  
  // Change min, max, and current temperature values
  const tempValueInputs = document.querySelectorAll("input[type='text']");
  
  tempValueInputs.forEach(input => {
    input.addEventListener("change", event => {
      const newValue = parseFloat(event.target.value);
  
      if (isNaN(newValue)) {
        input.value = config[input.id];
        return;
      } else {
        config[input.id] = newValue;
        if (input.id === "currentTemp") {
          setTemperature();
        }
      }
    });
  });
  
  // Switch unit of temperature
  const unitP = document.getElementById("unit");
  
  unitP.addEventListener("click", () => {
    config.unit = config.unit === "Celcius" ? "Fahrenheit" : "Celcius";
    unitP.innerHTML = config.unit + " " + units[config.unit];
    return setTemperature();
  });
  
  // Set temperature based on current input
  const temperature = document.getElementById("temperature");
  
  function setTemperature() {
    const heightPercentage = ((config.currentTemp - config.minTemp) / (config.maxTemp - config.minTemp)) * 100;
    temperature.style.height = Math.max(0, Math.min(100, heightPercentage)) + "%"; // Clamp between 0 and 100
    temperature.dataset.value = config.currentTemp + units[config.unit];
  }
  
  // Initialize temperature display
  setTimeout(setTemperature, 1000);
  

// gauge
var humidityValue = 65; // Example humidity value

        var chart = JSC.chart('chartDiv', { 
            legend_visible: false, 
            xAxis_spacingPercentage: 0.4, 
            yAxis: [ 
                { 
                    id: 'humidityAxis', 
                    customTicks: [0, 20, 40, 60, 80, 100], 
                    scale_range: [0, 100], 
                    line: { width: 10, color: 'smartPalette:humidityPalette' } 
                } 
            ], 
            defaultSeries: { 
                type: 'gauge column roundcaps', 
                shape: { 
                    label: { 
                        text: humidityValue + '%', // Directly display the humidity value
                        align: 'center', 
                        verticalAlign: 'middle', 
                        style_fontSize: 22, 
                        style_color: '#333' 
                    } 
                } 
            }, 
            series: [ 
                { 
                    yAxis: 'humidityAxis', 
                    palette: { 
                        id: 'humidityPalette', 
                        ranges: [ 
                            { value: 20, color: '#FF5353' },   // Dry
                            { value: 40, color: '#FFD221' },   // Comfortable
                            { value: 60, color: '#77E6B4' },   // Ideal
                            { value: 80, color: '#21D683' },   // High Humidity
                            { value: 100, color: '#007ACC' }   // Very High Humidity
                        ] 
                    }, 
                    points: [['Humidity', humidityValue]] // Example humidity value
                } 
            ] 
        });

        // Simulate soil moisture value from a sensor
        var soilMoistureValue = 20; // Replace with actual value from your system

        // Define default options for the gauge
        function defaultGaugeOptions() {
            return {
                debug: true,
                type: 'gauge',
                animation_duration: 0,
                legend_visible: false,
                xAxis: {
                    scale: {
                        range: [0, 1]
                    }
                },
                palette: {
                    pointValue: '%yValue',
                    ranges: [
                        { value: [0, 30], color: '#FF5353' }, // Dry soil
                        { value: [30, 70], color: '#FFD221' }, // Moist soil
                        { value: [70, 100], color: '#77E6B4' }  // Wet soil
                    ]
                },
                yAxis: {
                    defaultTick: {
                        padding: 13,
                        label_visible: false
                    },
                    line: {
                        width: 15,
                        breaks_gap: 0.03,
                        color: 'smartPalette'
                    },
                    scale: { range: [0, 100], interval: 10 }
                },
                defaultSeries: {
                    opacity: 1,
                    mouseTracking_enabled: false,
                    shape: {
                        label: {
                            text: '%sum%',
                            style: { fontSize: '24px' },
                            align: 'center',
                            verticalAlign: 'middle'
                        }
                    }
                },
                defaultPoint: {
                    marker: {
                        outline: {
                            width: 8,
                            color: 'currentColor'
                        },
                        fill: 'white',
                        type: 'circle',
                        size: 35
                    }
                },
                series: [
                    {
                        type: 'marker',
                        mouseTracking_enabled: false,
                        points: [{ y: soilMoistureValue }]
                    }
                ]
            };
        }

        // Create the soil moisture gauge
        var soilMoistureGauge = JSC.chart(
            'soilMoistureGauge',
            defaultGaugeOptions()
        );


        // js code 
        // Get references to the irrigation card and the text element
const irrigationCard = document.getElementById('irrigationCard');
const unitText = irrigationCard.querySelector('#unit');

// Initial irrigation state (Off by default)
let irrigationOn = false;

// Set the default color to red (Off state)
irrigationCard.style.backgroundColor = '#f44336';

// Event listener for card click
irrigationCard.addEventListener('click', function () {
  irrigationOn = !irrigationOn; // Toggle the state

  // Change the card color and text based on the state
  if (irrigationOn) {
    irrigationCard.style.backgroundColor = '#4CAF50'; // Green color for "On"
    unitText.textContent = 'Irrigation Control: ON'; // Update text to "On"
  } else {
    irrigationCard.style.backgroundColor = '#f44336'; // Red color for "Off"
    unitText.textContent = 'Irrigation Control: OFF'; // Update text to "Off"
  }
});
