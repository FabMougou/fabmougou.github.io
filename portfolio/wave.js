(() => {
  const pre = document.getElementById("ascii-wave");
  if (!pre) return;

  const charset = " .'`^\",:;Il!i~+_-?][}{1)(|/tfjrxnuvczXYUJCLQ0OZmwqpdbkhaos#MW&8%B@$";
  const state = {
    cols: 0,
    rows: 0,
    mouseX: 0,
    mouseY: window.innerHeight / 2,
    smoothMouseX: 0,
    smoothMouseY: window.innerHeight / 2,
    panelWidth: 0,
    time: 0,
    heights: [],
    velocities: [],
    targets: [],
  };

  const getPanelWidth = () => {
    const panel = pre.parentElement;
    return panel ? panel.clientWidth : 0;
  };

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

  const recalcGrid = () => {
    const style = window.getComputedStyle(pre);
    const fontSize = parseFloat(style.fontSize) || 12;
    const lineHeight = parseFloat(style.lineHeight) || fontSize;

    // Approximate mono character width and compute drawable grid.
    const charWidth = Math.max(6, Math.round(fontSize * 0.62));
    state.panelWidth = getPanelWidth();
    state.cols = Math.max(14, Math.floor(state.panelWidth / charWidth));
    state.rows = Math.max(22, Math.floor(window.innerHeight / lineHeight));

    state.heights = Array(state.rows).fill(0);
    state.velocities = Array(state.rows).fill(0);
    state.targets = Array(state.rows).fill(0);
  };

  const selectChar = (intensity) => {
    const capped = clamp(intensity, 0, 1);
    const index = Math.floor(capped * (charset.length - 1));
    return charset[index];
  };

  const updateSurface = () => {
    state.time += 0.015;

    state.smoothMouseX += (state.mouseX - state.smoothMouseX) * 0.09;
    state.smoothMouseY += (state.mouseY - state.smoothMouseY) * 0.09;

    const mouseRow = clamp(
      Math.floor((clamp(state.smoothMouseY, 0, Math.max(1, window.innerHeight)) / Math.max(1, window.innerHeight)) * (state.rows - 1)),
      0,
      state.rows - 1
    );

    const liftByHeight = 1;
    const xNorm = clamp(state.smoothMouseX / Math.max(1, state.panelWidth), 0, 1);
    const xInfluence = 1 - xNorm;
    const maxLift = state.cols * 0.5;
    const spread = Math.max(2, state.rows * 0.05);

    for (let row = 0; row < state.rows; row++) {
      const distance = row - mouseRow;
      const influence = Math.exp(-(distance * distance) / (2 * spread * spread));
      state.targets[row] = influence * liftByHeight * xInfluence * maxLift;
    }

    for (let row = 0; row < state.rows; row++) {
      const spring = (state.targets[row] - state.heights[row]) * 0.08;
      state.velocities[row] = (state.velocities[row] + spring) * 0.5;
    }

    for (let row = 1; row < state.rows - 1; row++) {
      const neighborPull = (state.heights[row - 1] + state.heights[row + 1] - 2 * state.heights[row]) * 0.042;
      state.velocities[row] += neighborPull;
    }

    for (let row = 0; row < state.rows; row++) {
      state.heights[row] = clamp(state.heights[row] + state.velocities[row], 0, maxLift);
    }
  };

  const render = () => {
    updateSurface();
    const rippleStrength = 0.008
    const baseWaterHeight = 0.05
    const baseWaterWidth = Math.floor(state.cols * baseWaterHeight);
    const globalSwell = Math.sin(state.time * 1.7) * (state.cols * rippleStrength);

    let output = "";

    for (let row = 0; row < state.rows; row++) {
      const crest = state.heights[row];
      const localRipple = Math.sin(state.time * 3.1 + row * 0.3) * (state.cols * rippleStrength);
      const frontCol = clamp(
        Math.floor((state.cols - 1) - (baseWaterWidth + crest + globalSwell + localRipple)),
        0,
        state.cols - 1
      );

      for (let col = 0; col < state.cols; col++) {
        if (col >= frontCol) {
          const distanceFromFront = col - frontCol;
          const maxDepth = Math.max(1, (state.cols - 1) - frontCol);
          const nearFront = Math.exp(-distanceFromFront / Math.max(2, state.cols * 0.09));
          const body = ((state.cols - 1) - col) / maxDepth;
          const shimmer = Math.sin(state.time * 2.6 + col * 0.3 + row * 0.12) * 0.5 + 0.5;
          const intensity = 0.12 + nearFront * 0.56 + body * 0.18 + shimmer * 0.07;
          output += selectChar(intensity);
        } else {
          output += " ";
        }
      }

      if (row < state.rows - 1) output += "\n";
    }

    pre.textContent = output;
    requestAnimationFrame(render);
  };

  window.addEventListener("mousemove", (event) => {
    state.mouseX = event.clientX;
    state.mouseY = event.clientY;
  });

  window.addEventListener("resize", () => {
    recalcGrid();
  });

  recalcGrid();
  render();
})();
