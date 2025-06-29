import React from 'react';
import Sketch from 'react-p5';

const ASCIIWave = ({ 
  numCells = 500, 
  cellSize = 10, 
  canvasWidth = 400, 
  canvasHeight = 400,
  // Physics parameters
  springForce = 0.05,       
  damping = 0.7,          
  waveSpread = 6,          
  minIntensity = 0.05,     
  maxWaveHeight = 1.0,     
  // Visual parameters
  waterColor = [100, 150, 255], 
  backgroundColor = 220,   
  showMouseIndicator = false, 
  // ASCII parameters
  useAscii = true,
  asciiCharset = " .'`^\",:;Il!i~+_-?][}{1)(|/tfjrxnuvczXYUJCLQ0OZmwqpdbkhaos#MW&8%B@$",
  asciiFont = "Courier New",
  asciiFontSize = 12,
  asciiColor = [100, 200, 255],
  // Color variation parameters
  colorVariation = 0.3,        // How much color varies (0-1)
  hueShift = 0.1,             // Random hue shifting (0-1)
  saturationVariation = 0.2,   // Saturation randomness (0-1)
  brightnessVariation = 0.25,  // Brightness randomness (0-1)
  colorNoise = 0.15,          // Perlin noise-like color variation (0-1)
  // Interaction parameters
  mouseInfluence = true,   
  gravity = 0.02,          
  turbulence = 0.1,          
  clickRedistribution = true 
}) => {
  let grid;
  let gridWidth;
  let gridHeight;
  let particles = [];
  let mouseCol = -1;
  let mouseRowFromBottom = 0;
  let waterHeights = [];
  let mouseAngle = 0; // Track mouse angle for color calculation
  let colorSeed = Math.random() * 1000; // Seed for consistent randomness

  const shuffleCharset = (charset) => {
    const chars = charset.split('');
    for (let i = chars.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [chars[i], chars[j]] = [chars[j], chars[i]];
    }
    return chars.join('');
  };

  const setup = (p5, canvasParentRef) => {

    asciiCharset = shuffleCharset(asciiCharset)
    
    p5.createCanvas(canvasWidth, canvasHeight).parent(canvasParentRef);
    
    if (useAscii) {
      p5.textFont(asciiFont);
      p5.textSize(asciiFontSize);
      const charWidth = p5.textWidth('M');
      const charHeight = asciiFontSize;
      
      gridWidth = Math.floor(canvasWidth / charWidth);
      gridHeight = Math.floor(canvasHeight / charHeight);
      
      cellSize = Math.max(charWidth, charHeight);
    } else {
      gridWidth = Math.floor(canvasWidth / cellSize);
      gridHeight = Math.floor(canvasHeight / cellSize);
    }

    grid = Array(gridHeight).fill(null).map(() => 
      Array(gridWidth).fill(null).map(() => ({ 
        filled: false, 
        intensity: 0, 
        depthFromSurface: 0,
        colorSeed: Math.random() // Individual color seed for each cell
      }))
    );
    
    waterHeights = Array(gridWidth).fill(0);

    for (let i = 0; i < numCells; i++) {
      particles.push({
        col: Math.floor(Math.random() * gridWidth),
        row: gridHeight - 1,
        targetRow: gridHeight - 1,
        velocity: 0,
        baseRow: gridHeight - 1,
        colorSeed: Math.random() // Individual color seed for each particle
      });
    }
    
    p5.background(backgroundColor);
  };

  // Simple noise function for color variation
  const noise2D = (x, y, seed = 0) => {
    const n = Math.sin(x * 12.9898 + y * 78.233 + seed * 37.719) * 43758.5453;
    return (n - Math.floor(n));
  };

  const getWaveColor = (p5, intensity = 1.0) => {
    // Use the waterColor prop directly
    const [r, g, b] = waterColor;
    
    // Apply intensity (makes it darker when intensity is lower)
    const adjustedR = r * intensity;
    const adjustedG = g * intensity;
    const adjustedB = b * intensity;
    
    return [
      Math.max(0, Math.min(255, adjustedR)),
      Math.max(0, Math.min(255, adjustedG)),
      Math.max(0, Math.min(255, adjustedB))
    ];
  };

  const updateParticles = (p5) => {
    // Calculate mouse position
    if (mouseInfluence && p5.mouseX >= 0 && p5.mouseX <= canvasWidth && 
        p5.mouseY >= 0 && p5.mouseY <= canvasHeight) {
      if (useAscii) {
        p5.textFont(asciiFont);
        p5.textSize(asciiFontSize);
        const charWidth = p5.textWidth('M');
        mouseCol = Math.floor(p5.mouseX / charWidth);
        const mouseRowFromTop = Math.floor(p5.mouseY / asciiFontSize);
        mouseRowFromBottom = gridHeight - 1 - mouseRowFromTop;
      } else {
        mouseCol = Math.floor(p5.mouseX / cellSize);
        const mouseRowFromTop = Math.floor(p5.mouseY / cellSize);
        mouseRowFromBottom = gridHeight - 1 - mouseRowFromTop;
      }
    } else {
      mouseCol = -1;
      mouseRowFromBottom = 0;
    }

    // Clear grid and reset water heights
    for (let row = 0; row < gridHeight; row++) {
      for (let col = 0; col < gridWidth; col++) {
        grid[row][col].filled = false;
        grid[row][col].intensity = 0;
        grid[row][col].depthFromSurface = 0;
      }
    }
    waterHeights.fill(0);

    // Update particles
    particles.forEach(particle => {
      if (mouseCol >= 0 && mouseInfluence) {
        const distance = Math.abs(particle.col - mouseCol);
        const normalizedDistance = distance / (gridWidth / waveSpread);
        const intensity = Math.exp(-normalizedDistance * normalizedDistance);
        const adjustedIntensity = Math.max(intensity, minIntensity);
        
        const maxHeight = (mouseRowFromBottom + 1) * maxWaveHeight;
        const targetHeight = Math.floor(adjustedIntensity * maxHeight);
        particle.targetRow = gridHeight - targetHeight;
        particle.intensity = adjustedIntensity;
      } else {
        particle.targetRow = particle.baseRow;
        particle.intensity = 0.5;
        if (gravity > 0) {
          particle.velocity += gravity;
        }
      }

      if (turbulence > 0) {
        particle.velocity += (Math.random() - 0.5) * turbulence;
      }

      const targetDiff = particle.targetRow - particle.row;
      particle.velocity += targetDiff * springForce;
      particle.velocity *= damping;
      particle.row += particle.velocity;

      particle.row = Math.max(0, Math.min(gridHeight - 1, particle.row));

      // Track the highest particle in each column
      const gridRow = Math.floor(particle.row);
      const gridCol = Math.max(0, Math.min(gridWidth - 1, particle.col));
      if (gridRow >= 0 && gridRow < gridHeight) {
        const currentHeight = gridHeight - gridRow;
        if (currentHeight > waterHeights[gridCol]) {
          waterHeights[gridCol] = currentHeight;
        }
      }
    });

    // Fill grid based on water heights with depth-based effects
    for (let col = 0; col < gridWidth; col++) {
      const waterLevel = waterHeights[col];
      
      for (let row = gridHeight - waterLevel; row < gridHeight; row++) {
        if (row >= 0) {
          const depthFromSurface = row - (gridHeight - waterLevel);
          const maxDepth = waterLevel;
          
          const surfaceIntensity = maxDepth > 0 ? 1.0 - (depthFromSurface / maxDepth) : 1.0;
          const glintFactor = Math.pow(surfaceIntensity, 0.8);
          
          const baseIntensity = 0.6;
          const finalIntensity = baseIntensity + (glintFactor * 0.4);
          
          grid[row][col].filled = true;
          grid[row][col].intensity = finalIntensity;
          grid[row][col].depthFromSurface = depthFromSurface;
        }
      }
    }
  };

  const draw = (p5) => {
    p5.background(backgroundColor);
    
    updateParticles(p5);
    
    if (useAscii) {
      // Draw ASCII characters with simple black color
      p5.textFont(asciiFont);
      p5.textSize(asciiFontSize);
      p5.textAlign(p5.LEFT, p5.TOP);
      p5.textStyle(p5.BOLD);
      
      const charWidth = p5.textWidth('M');
      const charHeight = asciiFontSize;
      
      for (let row = 0; row < gridHeight; row++) {
        for (let col = 0; col < gridWidth; col++) {
          if (grid[row][col].filled) {
            const intensity = grid[row][col].intensity;
            
            // Choose ASCII character based on intensity
            const adjustedIntensity = Math.pow(intensity, 0.7);
            const charIndex = Math.floor(adjustedIntensity * (asciiCharset.length - 1));
            const char = asciiCharset[Math.min(charIndex, asciiCharset.length - 1)];
            
            // Get simple black color
            const [r, g, b] = getWaveColor(p5, intensity);
            const alpha = Math.floor(Math.min(255, intensity * 300));
            
            p5.fill(r, g, b, alpha);
            
            p5.text(
              char,
              col * charWidth,
              row * charHeight
            );
          }
        }
      }
    } else {
      // Draw regular colored rectangles with simple black color
      p5.noStroke();
      
      for (let row = 0; row < gridHeight; row++) {
        for (let col = 0; col < gridWidth; col++) {
          if (grid[row][col].filled) {
            const intensity = grid[row][col].intensity;
            
            // Get simple black color
            const [r, g, b] = getWaveColor(p5, intensity);
            const alpha = Math.floor(Math.min(255, intensity * 300));
            
            p5.fill(r, g, b, alpha);
            p5.rect(
              col * cellSize, 
              row * cellSize, 
              cellSize, 
              cellSize
            );
          }
        }
      }
    }

    if (showMouseIndicator && mouseCol >= 0) {
      p5.fill(255, 0, 0, 100);
      if (useAscii) {
        const charWidth = p5.textWidth('M');
        p5.rect(mouseCol * charWidth, 0, charWidth, canvasHeight);
      } else {
        p5.rect(mouseCol * cellSize, 0, cellSize, canvasHeight);
      }
    }
  };
  
  const mouseClicked = (p5) => {
    if (clickRedistribution) {
      particles.forEach(particle => {
        particle.col = Math.floor(Math.random() * gridWidth);
        particle.velocity = 0;
        particle.colorSeed = Math.random();
      });
      
      // Regenerate color seeds for grid cells
      for (let row = 0; row < gridHeight; row++) {
        for (let col = 0; col < gridWidth; col++) {
          grid[row][col].colorSeed = Math.random();
        }
      }
    }
  };

  return <Sketch setup={setup} draw={draw} mouseClicked={mouseClicked} />;
};

export default ASCIIWave;