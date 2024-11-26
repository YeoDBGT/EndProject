import React from "react";
import { FaGithub, FaDiscord } from "react-icons/fa";
import "../css/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p className="footer-name">Axel</p>
        <div className="footer-social">
          <a
            href="https://github.com/YeoDBGT"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link"
          >
            <FaGithub />
          </a>
          <a href="discord://axel.k__" className="social-link">
            <FaDiscord />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
