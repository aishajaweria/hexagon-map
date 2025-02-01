
const canvas = document.getElementById("hexMap");
const ctx = canvas.getContext("2d");

canvas.width = 1114;
canvas.height = 750;

// Hexagon grid settings
const hexSize = 5;
const hexSpacing = 4;
const hexWidth = Math.sqrt(3) * hexSize;
const hexHeight = 2 * hexSize;
const offsetX = hexWidth * 0.75 + hexSpacing;
const offsetY = hexHeight * 0.5 + hexSpacing;

// Default grayscale shades
const greyShades = ["#222", "#444", "#666", "#888", "#aaa"];

// Climate zone colors (for hover effect)
const climateColors = {
    "green": "#2ecc71",  // Tropical
    "yellow": "#f1c40f", // Dry
    "red": "#e74c3c",    // Hot Desert
    "orange": "#e67e22", // Temperate
    "blue": "#3498db"    // Cold / Polar
};

// Page links for each climate region
const climateLinks = {
    "green": "regions/barzil.html",
    "yellow": "regions/usa.html",
    "blue": "regions/canada.html",
    "orange": "regions/greenland.html",
    "red": "regions/antartica.html"
};

// Load world map image
const img = new Image();
img.src = "world1.png"; // Ensure correct path

let worldImageData; // Store image data globally

img.onload = function () {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    worldImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawHexGrid(worldImageData);
};

// Function to check if a pixel represents land
function isLand(x, y, imageData) {
    if (x < 0 || y < 0 || x >= imageData.width || y >= imageData.height) {
        return false;
    }
    const index = (Math.floor(y) * imageData.width + Math.floor(x)) * 4;
    const r = imageData.data[index];
    const g = imageData.data[index + 1];
    const b = imageData.data[index + 2];
    const alpha = imageData.data[index + 3];

    return !(b > r && b > g) && alpha > 100; // Ignore blue tones (water)
}

// Assign climate zones based on regions
function getClimateZone(x, y) {
    if (y > 500) return "red";       // Antarctica
    if (x > 700 && y < 400) return "blue";  // Canada
    if (x > 500 && y < 600) return "orange"; // Greenland
    if (x > 200 && y < 500) return "yellow"; // USA
    if (x < 200 && y < 500) return "green";  // Brazil
    return null;
}

// Generate hexagonal grid
let hexagons = [];

function drawHexGrid(imageData) {
    for (let y = 0; y < canvas.height; y += offsetY) {
        for (let x = 0; x < canvas.width; x += offsetX) {
            if (isLand(x, y, imageData)) {
                let color = greyShades[Math.floor(Math.random() * greyShades.length)];
                let climateZone = getClimateZone(x, y);
                hexagons.push({ x, y, size: hexSize, color, climateZone });
                drawHexagon(x, y, hexSize, color);
            }
        }
    }
}

// Draw a hexagon
function drawHexagon(x, y, size, color) {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
        let angle = (Math.PI / 3) * i;
        let px = x + size * Math.cos(angle);
        let py = y + size * Math.sin(angle);
        ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = "#111"; // Dark border for contrast
    ctx.stroke();
}



// Click event to redirect to appropriate pages
canvas.addEventListener("click", function (event) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    hexagons.forEach(hex => {
        const dx = mouseX - hex.x;
        const dy = mouseY - hex.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < hexSize * 1.2 && hex.climateZone) {
            window.location.href = climateLinks[hex.climateZone];
        }
    });
});
