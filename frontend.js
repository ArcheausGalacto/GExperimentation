import React, { useRef, useEffect } from 'react';

const BubbleMitosisScreensaver = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let bubbles = [];
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Bubble {
      constructor(x, y, radius, vx, vy) {
        this.x = x;
        this.y = y;
        this.radius = radius || Math.random() * 20 + 10;
        this.velocity = {
          x: vx || (Math.random() - 0.5) * 2,
          y: vy || (Math.random() - 0.5) * 2
        };
        this.maxRadius = 50;
        this.minRadius = 5;
      }

      update() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;

        // Boundary checking
        if (this.x - this.radius < 0 || this.x + this.radius > canvas.width) {
          this.velocity.x *= -1;
          this.x = Math.max(this.radius, Math.min(canvas.width - this.radius, this.x));
        }
        if (this.y - this.radius < 0 || this.y + this.radius > canvas.height) {
          this.velocity.y *= -1;
          this.y = Math.max(this.radius, Math.min(canvas.height - this.radius, this.y));
        }

        // Ensure minimum velocity
        const minVelocity = 0.5;
        const speed = Math.sqrt(this.velocity.x ** 2 + this.velocity.y ** 2);
        if (speed < minVelocity) {
          this.velocity.x = (this.velocity.x / speed) * minVelocity;
          this.velocity.y = (this.velocity.y / speed) * minVelocity;
        }

        // Damping
        this.velocity.x *= 0.99;
        this.velocity.y *= 0.99;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }

    const initBubbles = () => {
      for (let i = 0; i < 20; i++) {
        bubbles.push(new Bubble(Math.random() * canvas.width, Math.random() * canvas.height));
      }
    };

    const mergeBubbles = (b1, b2) => {
      const newRadius = Math.min(Math.sqrt(b1.radius**2 + b2.radius**2), b1.maxRadius);
      const newX = (b1.x + b2.x) / 2;
      const newY = (b1.y + b2.y) / 2;
      const newVx = (b1.velocity.x * b1.radius + b2.velocity.x * b2.radius) / (b1.radius + b2.radius);
      const newVy = (b1.velocity.y * b1.radius + b2.velocity.y * b2.radius) / (b1.radius + b2.radius);
      return new Bubble(newX, newY, newRadius, newVx, newVy);
    };

    const splitBubble = (bubble) => {
      const newRadius = Math.max(bubble.radius / Math.sqrt(2), bubble.minRadius);
      const angle = Math.random() * Math.PI * 2;
      const distance = newRadius;
      const speed = Math.sqrt(bubble.velocity.x ** 2 + bubble.velocity.y ** 2);
      return [
        new Bubble(
          bubble.x + Math.cos(angle) * distance, 
          bubble.y + Math.sin(angle) * distance, 
          newRadius,
          bubble.velocity.x + Math.cos(angle) * speed,
          bubble.velocity.y + Math.sin(angle) * speed
        ),
        new Bubble(
          bubble.x - Math.cos(angle) * distance, 
          bubble.y - Math.sin(angle) * distance, 
          newRadius,
          bubble.velocity.x - Math.cos(angle) * speed,
          bubble.velocity.y - Math.sin(angle) * speed
        )
      ];
    };

    const animate = () => {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const newBubbles = [];

      for (let i = 0; i < bubbles.length; i++) {
        bubbles[i].update();
        bubbles[i].draw();

        // Check for collisions and merge
        for (let j = i + 1; j < bubbles.length; j++) {
          const dx = bubbles[i].x - bubbles[j].x;
          const dy = bubbles[i].y - bubbles[j].y;
          const distance = Math.sqrt(dx*dx + dy*dy);
          if (distance < bubbles[i].radius + bubbles[j].radius) {
            const newBubble = mergeBubbles(bubbles[i], bubbles[j]);
            newBubbles.push(newBubble);
            bubbles.splice(j, 1);
            bubbles.splice(i, 1);
            i--;
            break;
          }
        }

        // Random chance to split
        if (Math.random() < 0.002 && bubbles[i].radius > bubbles[i].minRadius * 2) {
          const splitBubbles = splitBubble(bubbles[i]);
          newBubbles.push(...splitBubbles);
          bubbles.splice(i, 1);
          i--;
        }
      }

      bubbles = bubbles.concat(newBubbles);

      // Ensure minimum number of bubbles
      while (bubbles.length < 10) {
        bubbles.push(new Bubble(Math.random() * canvas.width, Math.random() * canvas.height));
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    initBubbles();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }} />;
};

const GalactoCorpHomepage = () => {
  return (
    <div className="font-sans">
      <BubbleMitosisScreensaver />
      <div className="relative z-10">
        <header className="bg-white bg-opacity-70 shadow-md fixed top-0 left-0 right-0 z-20">
          <div className="container mx-auto px-4 py-4 bg-white">
            <h1 className="text-4xl font-bold text-blue-800">Galacto Corp</h1>
            <p className="text-xl text-gray-600">Pioneering Next-Generation Sequencing Technology</p>
          </div>
        </header>
        <nav className="bg-blue-800 text-white fixed top-24 left-0 right-0 z-20">
          <div className="container mx-auto px-4 py-2">
            <ul className="flex space-x-4">
              <li><button className="px-4 py-2 rounded hover:bg-blue-700 transition-colors">Home</button></li>
              <li><button className="px-4 py-2 rounded hover:bg-blue-700 transition-colors">Team</button></li>
              <li><button className="px-4 py-2 rounded hover:bg-blue-700 transition-colors">App</button></li>
            </ul>
          </div>
        </nav>
        <main className="container mx-auto px-4 pt-48 pb-16">
          <section className="bg-white bg-opacity-70 rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-3xl font-semibold text-blue-700 mb-4">Our Mission</h2>
            <p className="text-lg text-gray-800">
              At Galacto Corp, we harness the power of NGS to deliver innovative solutions for clinical, environmental, and national health. Our cutting-edge Genicus system initially revolutionized bacterial identification in-silico. Now, we're expanding our expertise to tackle environmental and national challenges by introducing advanced NGS testing for wastewater pathogen tracking.
            </p>
          </section>

          <section className="bg-white bg-opacity-70 rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-3xl font-semibold text-blue-700 mb-4">NGS Testing</h2>
            <p className="text-lg text-gray-800">
              We're excited to announce our strategic pivot to environmental health. Leveraging our proven Genicus system, we now offer comprehensive NGS testing of wastewater. This new service is designed to detect and track pathogens, providing critical data for public health monitoring and environmental protection, as well as the detection of emerging biological threats.
            </p>
          </section>

          <section className="bg-white bg-opacity-70 rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-3xl font-semibold text-blue-700 mb-4">New Innovations and Big Data</h2>
            <p className="text-lg text-gray-800">
              Our innovative approach to NGS testing for wastewater pathogen tracking is at the forefront of genomic science. By analyzing wastewater samples, we can identify and monitor a wide range of pathogens such as viruses, bacteria, fungi, and phage, offering valuable insights into public health trends.
            </p>
          </section>

          <section className="bg-white bg-opacity-70 rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-3xl font-semibold text-blue-700 mb-4">Collaborations</h2>
            <p className="text-lg text-gray-800">
              Galacto Corp is looking to collaborate with public health organizations, research institutions, and environmental agencies to expand the reach and impact of our wastewater pathogen tracking services. By working together, we can enhance community health monitoring, respond swiftly to emerging threats, and contribute to a safer environment.
            </p>
          </section>

          <section className="bg-white bg-opacity-70 rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-3xl font-semibold text-blue-700 mb-4">Coming Soon: GalactoNet</h2>
            <p className="text-lg text-gray-800">
              We're thrilled to announce our upcoming product, GalactoNet, which aims to provide a visual indicator of the spread of disease. It works through the collection of sample-associated coordinate data in address form and our rapid analytical systems. This will enable us to demonstrate the spread of emerging pathogens in near real-time, creating a custom 'weather map' for pathogens.
            </p>
          </section>
        </main>

        <footer className="bg-white bg-opacity-70 shadow-md mt-8 py-6">
          <div className="container mx-auto px-4 text-center text-gray-800">
            <p>&copy; 2024 Galacto Corp. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default GalactoCorpHomepage;