import { TOKENS } from ".";

const CardHeader = ({ title, icon, subtitle, actions }) => (
  <div
    className="p-4 border-b flex items-center justify-between"
    style={{ borderColor: TOKENS.border }}
  >
    <div className="flex items-start gap-3">
      {icon}
      <div>
        <h3 className="text-lg font-semibold" style={{ color: TOKENS.text }}>
          {title}
        </h3>
        {subtitle && (
          <p className="text-xs" style={{ color: TOKENS.muted }}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
    <div className="flex items-center gap-2">{actions}</div>
  </div>
);

export default CardHeader;