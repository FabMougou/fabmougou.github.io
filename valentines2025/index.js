document.addEventListener('DOMContentLoaded', () => {
  // Cache DOM elements
  const enterButton = document.getElementById("enter-button");
  const infoContainer = document.getElementById("info-container");
  const yesButton = document.getElementById("yes-button");
  const neonContainer = document.getElementById("neon-container");
  let neonPaths;

  // Initial animation sequence
  if (enterButton) {
    enterButton.addEventListener("click", () => {
      enterButton.style.opacity = "0";
      document.body.style.backgroundColor = "black";
      
      setTimeout(() => {
        neonPaths = document.querySelectorAll("path");
        
        // Initialize neon effect
        neonPaths.forEach(path => {
          path.style.stroke = "var(--clr-neon)";
          path.style.opacity = "1";
        });

        // Add pulsing neon glow
        gsap.killTweensOf(neonPaths, { filter: true });
        gsap.fromTo(neonPaths,
          { filter: "none" },
          {
            filter: "drop-shadow(5px 0px 10px rgba(255, 0, 98, 1))",
            duration: 4,
            ease: "power2.inOut",
            repeat: -1,
            yoyo: true
          }
        );

        // Animate stroke dash
        gsap.to(neonPaths, {
          strokeDasharray: 1000,
          duration: 3,
          ease: "power1.inOut",
          onComplete: () => {
            gsap.to(neonPaths, {
              strokeDasharray: 2000,
              duration: 5,
              ease: "power2.inOut",
            })
          }
        });
      }, 2000);

      // Show info container after animation
      setTimeout(() => {
        infoContainer.classList.remove("d-none", "opacity-0");
      }, 10000);
    });
  }

  // Handle positive response
  if (yesButton) {
    yesButton.addEventListener("click", () => {
      // Hide info container
      gsap.to(infoContainer, {
        opacity: 0,
        duration: 0.5,
        onComplete: () => {
          setTimeout(() => infoContainer.classList.add("d-none"), 500);
        }
      });
      
      // Change neon effect color
      neonPaths = document.querySelectorAll("path");
      gsap.killTweensOf(neonPaths, { filter: true });
      gsap.fromTo(neonPaths,
        { filter: "drop-shadow(0px 0 0px var(--clr-neon2))" },
        { filter: "drop-shadow(5px 0 7px var(--clr-neon2))", duration: 0.5, ease: "power1.inOut" }
      );
    });
  }
  
  // Load and animate SVG
  fetch('flowers2.svg')
    .then(response => response.text())
    .then(svgText => {
      neonContainer.innerHTML = svgText;
      neonPaths = document.querySelectorAll("path");
      
      gsap.to(neonPaths, {
        strokeDashoffset: 5,
        duration: 5,
        ease: "linear",
        repeat: -1,
        yoyo: true
      });
    })
    .catch(error => console.error('Error loading SVG:', error));
});