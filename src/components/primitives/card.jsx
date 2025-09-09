import { TOKENS } from ".";

const Card = ({ children, className = "" }) => (
  <div
    className={`rounded-2xl bg-white border shadow-sm ${className}`}
    style={{ borderColor: TOKENS.border }}
  >
    {children}
  </div>
);

export default Card;