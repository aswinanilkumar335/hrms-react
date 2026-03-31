type Props = {
  title: string;
  children: React.ReactNode;
};

function Card({ title, children }: Props) {
  return (
    <div style={{
      background: "#fff",
      padding: "20px",
      borderRadius: "16px",
      boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
    }}>
      <h4 style={{ marginBottom: "10px" }}>{title}</h4>
      {children}
    </div>
  );
}

export default Card;