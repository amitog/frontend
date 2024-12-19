// Units for temperature
const units = {
    Celcius: "°C",
    Fahrenheit: "°F",
};

// Initial configuration for temperature
const config = {
    minTemp: -20,
    maxTemp: 50,
    currentTemp: 30,
    unit: "Celcius",
};

// Default humidity and soil moisture values
let humidityValue = 0;
let soilMoistureValue = 0;

// Update the temperature value from user input
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
    unitP.innerHTML = `${config.unit} ${units[config.unit]}`;
    setTemperature();
});

// Set the temperature display
const temperature = document.getElementById("temperature");
function setTemperature() {
    let displayTemp = config.currentTemp;
    if (config.unit === "Fahrenheit") {
        displayTemp = (config.currentTemp * 9/5) + 32;
    }

    const heightPercentage = ((displayTemp - config.minTemp) / (config.maxTemp - config.minTemp)) * 100;
    temperature.style.height = Math.max(0, Math.min(100, heightPercentage)) + "%";
    temperature.dataset.value = displayTemp.toFixed(1) + units[config.unit];
}

// Initialize temperature display
setTemperature();

// Function to fetch sensor data from the backend
async function fetchSensorData() {
    try {
        const response = await fetch('http://localhost:5000/get_sensor_data');
        if (response.ok) {
            const data = await response.json();
            // Update the temperature, humidity, and soil moisture with the fetched data
            updateTemperature(data.temperature);
            updateHumidity(data.humidity);
            updateSoilMoisture(data.soil_moisture);
        } else {
            console.error('Failed to fetch sensor data');
        }
    } catch (error) {
        console.error('Error fetching sensor data:', error);
    }
}

// Function to update the temperature
function updateTemperature(temperature) {
    config.currentTemp = temperature;
    setTemperature();
}

// Function to update humidity
function updateHumidity(humidity) {
    humidityValue = humidity; // Update global humidity value
    chart.series(0).options({
        points: [['Humidity', humidityValue]]
    });
    chart.series(0).options({
        shape_label_text: `${humidityValue.toFixed(1)}%`
    });
}

// Function to update soil moisture
function updateSoilMoisture(soilMoisture) {
    soilMoistureValue = Math.max(0, Math.min(100, soilMoisture));  // Ensure it's within 0-100 range
    console.log("Updated soil moisture:", soilMoistureValue);

    // Update the soil moisture gauge with the new value
    soilMoistureGauge.series(0).options({
        points: [['Soil Moisture', soilMoistureValue]]
    });

    // Update the label for the soil moisture gauge
    soilMoistureGauge.series(0).options({
        shape_label_text: `${soilMoistureValue.toFixed(1)}%`
    });
}

// Initialize fetching data when the page loads
window.onload = function () {
    fetchSensorData();  // Fetch the initial sensor data
    setInterval(fetchSensorData, 5000);  // Fetch data every 5 seconds to keep it updated
};

// Humidity Gauge setup
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
                text: `${humidityValue}%`,
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
                    { value: 20, color: '#FF5353' }, // Dry
                    { value: 40, color: '#FFD221' }, // Comfortable
                    { value: 60, color: '#77E6B4' }, // Ideal
                    { value: 80, color: '#21D683' }, // High Humidity
                    { value: 100, color: '#007ACC' } // Very High Humidity
                ]
            },
            points: [['Humidity', humidityValue]]
        }
    ]
});

// Soil Moisture Gauge setup
var soilMoistureGauge = JSC.chart('soilMoistureGauge', {
    legend_visible: false,
    xAxis_spacingPercentage: 0.4,
    yAxis: [
        {
            id: 'soilMoistureAxis',
            customTicks: [0, 20, 40, 60, 80, 100],  // Custom ticks for soil moisture
            scale_range: [0, 100],
            line: { width: 10, color: 'smartPalette:soilMoisturePalette' }
        }
    ],
    defaultSeries: {
        type: 'gauge column roundcaps',
        shape: {
            label: {
                text: `${soilMoistureValue}%`,
                align: 'center',
                verticalAlign: 'middle',
                style_fontSize: 22,
                style_color: '#333'
            }
        }
    },
    series: [
        {
            yAxis: 'soilMoistureAxis',
            palette: {
                id: 'soilMoisturePalette',
                ranges: [
                    { value: 20, color: '#FF5353' },  // Dry soil
                    { value: 40, color: '#FFD221' },  // Moist soil
                    { value: 60, color: '#77E6B4' },  // Comfortable soil
                    { value: 80, color: '#21D683' },  // Ideal soil moisture
                    { value: 100, color: '#007ACC' }  // Wet soil
                ]
            },
            points: [['Soil Moisture', soilMoistureValue]]  // Initial soil moisture value
        }
    ]
});

// Irrigation Control Card
const irrigationCard = document.getElementById('irrigationCard');
const unitText = irrigationCard.querySelector('#unit');
let irrigationOn = false;

// Initial irrigation state
irrigationCard.style.backgroundColor = '#f44336';

// Toggle irrigation state on card click
irrigationCard.addEventListener('click', async function () {
    irrigationOn = !irrigationOn;

    // Update the card color and text
    if (irrigationOn) {
        irrigationCard.style.backgroundColor = '#4CAF50'; // Green for "On"
        unitText.textContent = 'Irrigation Control: ON';
    } else {
        irrigationCard.style.backgroundColor = '#f44336'; // Red for "Off"
        unitText.textContent = 'Irrigation Control: OFF';
    }

    // Send the irrigation state to the backend
    try {
        const response = await fetch('http://localhost:5000/irrigation_control', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ irrigation_on: irrigationOn })
        });

        if (response.ok) {
            console.log('Irrigation state updated successfully');
        } else {
            console.error('Failed to update irrigation state');
        }
    } catch (error) {
        console.error('Error sending irrigation state:', error);
    }
});
