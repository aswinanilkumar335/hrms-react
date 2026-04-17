type Props = {
  title?: string;
  children: React.ReactNode;
  className?: string;
  headerAction?: React.ReactNode;
};

function Card({ title, children, className = "", headerAction }: Props) {
  return (
    <div className={`premium-card ${className}`} style={{
      background: "#fff",
      padding: "24px",
      borderRadius: "var(--border-radius-lg)",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      border: "1px solid var(--border-light)",
      height: "100%"
    }}>
      {(title || headerAction) && (
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          marginBottom: "20px" 
        }}>
          {title && <h4 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "var(--text-main)" }}>{title}</h4>}
          {headerAction}
        </div>
      )}
      <div className="card-content">
        {children}
      </div>
    </div>
  );
}

export default Card;