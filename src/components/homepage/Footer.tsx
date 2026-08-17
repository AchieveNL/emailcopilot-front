import React from "react";
import Logo from "./Logo";
import Link from "next/link";

function Footer() {
  return (
    // making the footer take the full screen width and ignoring the max-width constraint of the container to ensure it spans edge-to-edge, creating a clear separation from the main content and grounding the design
    <footer
      style={{ borderTop: "1px solid rgba(0,0,0,0.07)" }}
      className="w-full overflow-hidden z-0 px-6 py-12 relative bg-white"
    >
      <div className="max-w-315 m-auto">
        <div className="flex flex-col lg:flex-row  items-start md:items-center lg:items-end justify-between w-full gap-6 lg:gap-0 mb-10">
          <span
            className="order-3 lg:order-1 text-left lg:text-center mt-2 lg:mt-0"
            style={{ fontSize: "0.8rem", color: "#a0a0b0" }}
          >
            Powered by{" "}
            <a
              href="https://www.achieve.nl"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#a0a0b0" }}
              className="hover:text-gray-700 transition"
            >
              Achieve.nl
            </a>{" "}
            © 2026
          </span>

          <div className="flex flex-col items-start md:items-center gap-4 lg:gap-6 order-1 lg:order-2">
            <Logo />
            <div className="flex flex-col md:flex-row items-start lg:items-center gap-3 lg:gap-6">
              <Link href="/terms">
                <span
                  className=" hover:text-gray-700 transition"
                  style={{ fontSize: "0.8rem", color: "#a0a0b0" }}
                >
                  General terms
                </span>
              </Link>
              <Link href="/disclaimer">
                <span
                  className=" hover:text-gray-700 transition"
                  style={{ fontSize: "0.8rem", color: "#a0a0b0" }}
                >
                  Disclaimer
                </span>
              </Link>
              <Link href="/privacy">
                <span
                  className=" hover:text-gray-700 transition"
                  style={{ fontSize: "0.8rem", color: "#a0a0b0" }}
                >
                  Privacy Statement
                </span>
              </Link>
            </div>
          </div>

          <span
            className="order-2 lg:order-3 text-left lg:text-center"
            style={{ fontSize: "0.8rem", color: "#a0a0b0" }}
          >
            2026 © EmailCopilot. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
