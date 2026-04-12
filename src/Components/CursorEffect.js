import { useEffect } from "react";

export default function CursorEffect() {
  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    if (isMobile) return;

    const cursor = document.createElement("div");
    const follower = document.createElement("div");

    cursor.className = "cursor-dot";
    follower.className = "cursor-follower";

    document.body.appendChild(cursor);
    document.body.appendChild(follower);

    let mouseX = 0,
      mouseY = 0;
    let posX = 0,
      posY = 0;

    // Mouse Move
    const move = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      cursor.style.left = mouseX + "px";
      cursor.style.top = mouseY + "px";
    };

    document.addEventListener("mousemove", move);

    // Smooth follow animation
    const animate = () => {
      posX += (mouseX - posX) * 0.08;
      posY += (mouseY - posY) * 0.08;

      follower.style.left = posX + "px";
      follower.style.top = posY + "px";

      requestAnimationFrame(animate);
    };
    animate();

    // 🧲 Magnetic effect
    document.querySelectorAll("button, a, .hoverable").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        el.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        follower.classList.add("cursor-hover");
      });

      el.addEventListener("mouseleave", () => {
        el.style.transform = `translate(0,0)`;
        follower.classList.remove("cursor-hover");
      });
    });

    // 💥 Click particles
    const clickEffect = (e) => {
      for (let i = 0; i < 8; i++) {
        const particle = document.createElement("div");
        particle.className = "particle";

        particle.style.left = e.clientX + "px";
        particle.style.top = e.clientY + "px";

        const angle = Math.random() * 360;
        const distance = Math.random() * 50 + 20;

        particle.style.setProperty("--x", `${Math.cos(angle) * distance}px`);
        particle.style.setProperty("--y", `${Math.sin(angle) * distance}px`);

        document.body.appendChild(particle);

        setTimeout(() => particle.remove(), 600);
      }
    };

    document.addEventListener("click", clickEffect);

    return () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("click", clickEffect);
      cursor.remove();
      follower.remove();
    };
  }, []);

  return (
    <style>{`
      body {
        cursor: none;
      }

      .cursor-dot {
        position: fixed;
        width: 8px;
        height: 8px;
        background: #00eaff;
        border-radius: 50%;
        pointer-events: none;
        transform: translate(-50%, -50%);
        z-index: 9999;
      }

      // .cursor-follower {
      //   position: fixed;
      //   width: 40px;
      //   height: 40px;
      //   border-radius: 50%;
      //   pointer-events: none;
      //   transform: translate(-50%, -50%);
      //   z-index: 9998;
      //   background: radial-gradient(circle, rgba(0,234,255,0.3), transparent);
      //   transition: 0.1s;
      // }

      .cursor-hover {
        transform: translate(-50%, -50%) scale(1.8);
        background: radial-gradient(circle, rgba(93,99,241,0.4), transparent);
      }

      /* 💥 Particles */
      .particle {
        position: fixed;
        width: 6px;
        height: 6px;
        background: #00eaff;
        border-radius: 50%;
        pointer-events: none;
        transform: translate(-50%, -50%);
        animation: explode 0.6s ease-out forwards;
        z-index: 9999;
      }

      @keyframes explode {
        to {
          transform: translate(calc(-50% + var(--x)), calc(-50% + var(--y)));
          opacity: 0;
        }
      }
    `}</style>
  );
}