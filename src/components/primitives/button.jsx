import { TOKENS } from ".";

const Button = ({
  children,
  variant = "primary",
  className = "",
  href, // optional href
  newTab = false, // optional newTab flag
  ...props
}) => {
  const base =
    "px-3 py-2 rounded-xl text-sm font-medium transition focus:outline-none focus:ring-2";

  let styles = {};
  if (variant === "primary") {
    styles = { backgroundColor: TOKENS.primary, color: TOKENS.white };
  } else if (variant === "ghost") {
    styles = {
      borderColor: TOKENS.border,
      color: TOKENS.primary,
      backgroundColor: TOKENS.white,
    };
  } else if (variant === "danger") {
    styles = { backgroundColor: TOKENS.redAccent, color: TOKENS.white };
  }

  // If href is provided, render as a link
  if (href) {
    return (
      <a
        href={href}
        target={newTab ? "_blank" : undefined}
        rel={newTab ? "noopener noreferrer" : undefined}
        className={`${base} ${
          variant === "ghost" ? "border" : ""
        } ${className}`}
        style={styles}
        {...props}
      >
        {children}
      </a>
    );
  }

  // Otherwise, render as a button
  return (
    <button
      className={`${base} ${variant === "ghost" ? "border" : ""} ${className}`}
      style={styles}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;