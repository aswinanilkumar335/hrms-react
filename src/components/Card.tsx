type Props = {
  title: string;
  children: React.ReactNode;
};

function Card({ title, children }: Props) {
  return (
    <div style={{
      background: "#fff",
      padding: "20px",
      borderRadius: "var(--border-radius-lg)",
      boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
    }}>
      <h4 style={{ marginBottom: "10px", color: "var(--text-main)" }}>{title}</h4>
      {children}
    </div>
  );
}

export default Card;