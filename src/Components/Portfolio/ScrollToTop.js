import { useState, useEffect } from "react";
import { FaArrowUp } from "react-icons/fa";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  // Show button after scrolling down 300px
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  // Scroll smoothly to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {visible && (
        <div onClick={scrollToTop} className="scroll-top hoverable">
          <FaArrowUp />
        </div>
      )}

      <style>
        {`
          .scroll-top {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            background-color: #5d63f1;
            color: white;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 50%;
            box-shadow: 0 0 15px rgba(93,99,241,0.6);
            cursor: pointer;
            z-index: 9999;
            font-size: 1.5rem;
            transition: transform 0.3s, box-shadow 0.3s;
          }

          .scroll-top:hover {
            transform: scale(1.2);
            box-shadow: 0 0 25px rgba(93,99,241,0.9);
          }
        `}
      </style>
    </>
  );
}
