import { useState, useRef, useEffect } from "react";
import { BaseButton } from "./button";

interface BaseDropdownProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  children?: React.ReactNode;
}

export const BaseDropdown = ({ label, children }: BaseDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<{
    vertical: "top" | "bottom";
    horizontal: "left" | "right";
  }>({ vertical: "bottom", horizontal: "left" });

  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const calculatePosition = () => {
    if (buttonRef.current && dropdownRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const estimatedHeight = 200;
      const estimatedWidth = 250;

      const spaceBelow = window.innerHeight - buttonRect.bottom;
      const spaceAbove = buttonRect.top;
      const vertical =
        spaceBelow > estimatedHeight || spaceBelow > spaceAbove
          ? "bottom"
          : "top";

      // Hitung posisi horizontal
      const spaceRight = window.innerWidth - buttonRect.left;
      const spaceLeft = buttonRect.right;
      const horizontal =
        spaceRight > estimatedWidth || spaceRight > spaceLeft
          ? "left"
          : "right";

      setPosition({ vertical, horizontal });
    }
  };

  const toggleDropdown = () => {
    if (!isOpen) {
      calculatePosition();
    }
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      calculatePosition();
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (isOpen) calculatePosition();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen]);

  const getPositionClasses = () => {
    const classes = [];

    if (position.vertical === "top") {
      classes.push("bottom-full mb-2");
    } else {
      classes.push("top-full mt-2");
    }

    if (position.horizontal === "right") {
      classes.push("right-0");
    } else {
      classes.push("left-0");
    }

    return classes.join(" ");
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <BaseButton label={label} ref={buttonRef} onClick={toggleDropdown} />
      {isOpen && (
        <div
          className={`absolute p-2 z-50 min-w-[200px] rounded-md bg-white border border-gray-200 shadow-xs ${getPositionClasses()}`}
        >
          {children}
        </div>
      )}
    </div>
  );
};
