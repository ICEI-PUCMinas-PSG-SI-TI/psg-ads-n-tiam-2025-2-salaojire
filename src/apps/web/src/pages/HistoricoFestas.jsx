import { useEffect, useState } from "react";
import { getAllAgendamentos } from "@packages/firebase/firestore/clientes";

export default function HistoricoFestas() {
  const [festas, setFestas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null); 

  useEffect(() => {
  document.body.style.height = "auto";
  document.documentElement.style.height = "auto";
  document.body.style.overflow = "auto";
  document.documentElement.style.overflow = "auto";

  return () => {
    
  };
}, []);


  useEffect(() => {
    async function load() {
      try {
        const lista = await getAllAgendamentos();

        lista.sort((a, b) => {
          const dataA = a.dataFim?.toDate ? a.dataFim.toDate() : new Date(a.dataFim);
          const dataB = b.dataFim?.toDate ? b.dataFim.toDate() : new Date(b.dataFim);
          return dataB - dataA;
        });

        setFestas(lista);
      } catch (e) {
        console.error("Erro:", e);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading)
    return <div style={styles.loading}>Carregando...</div>;

  if (festas.length === 0)
    return <div style={styles.empty}>Nenhum agendamento encontrado.</div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Todos os Agendamentos</h1>

      <div style={styles.list}>
        {festas.map((f) => {
          const inicioFmt = f.dataInicio?.toDate
            ? f.dataInicio.toDate().toLocaleDateString()
            : "—";

          const entregaFmt = f.dataFim?.toDate
            ? f.dataFim.toDate().toLocaleDateString()
            : "—";

          const valorTotal = f.valorTotal || 0;
          const valorPago = f.valorPago || 0;
          const valorPendente = valorTotal - valorPago;

          return (
            <div key={f.id} style={styles.card}>

              <div style={styles.festaTitle}>Agendamento #{f.id}</div>

              <div style={styles.infoItem}>
                <span style={styles.label}>Cliente:</span> {f.clienteNome}
              </div>

              <div style={styles.infoItem}>
                <span style={styles.label}>Início:</span> {inicioFmt}
              </div>

              <div style={styles.infoItem}>
                <span style={styles.label}>Entrega:</span> {entregaFmt}
              </div>

              <div style={styles.infoItem}>
                <span style={styles.label}>Valor Total:</span> R$ {valorTotal}
              </div>

              <div style={styles.infoItem}>
                <span style={styles.label}>Valor Pago:</span> R$ {valorPago}
              </div>

              <div style={styles.infoItem}>
                <span style={styles.label}>Pendente:</span>
                <strong style={{ color: "#c62828" }}> R$ {valorPendente} </strong>
              </div>

              <button style={styles.button} onClick={() => setSelected(f)}>
                Visualizar mais
              </button>

            </div>
          );
        })}
      </div>

      {/* ===========================
                MODAL
      =========================== */}
      {selected && (
        <div style={modalStyles.overlay}>
          <div style={modalStyles.modal}>

            <h2 style={{ marginBottom: 15 }}>Itens Alugados</h2>

            {selected.itensAlugados?.length > 0 ? (
              selected.itensAlugados.map((item, i) => {
                const total = (item.precoUnitario || 0) * (item.qtd || 1);

                return (
                  <div key={i} style={modalStyles.item}>
                    <strong>{item.nome || item.id}</strong>

                    <div>Quantidade: {item.qtd || 1}</div>
                    <div>Preço Unitário: R$ {item.precoUnitario || 0}</div>
                    <div>Total: R$ {total}</div>

                    {item.url && (
                      <img 
                        src={item.url} 
                        style={{ width: 80, borderRadius: 8, marginTop: 8 }}
                      />
                    )}
                  </div>
                );
              })
            ) : (
              <p>Nenhum item alugado.</p>
            )}

            <button 
              style={modalStyles.closeButton}
              onClick={() => setSelected(null)}
            >
              Fechar
            </button>

          </div>
        </div>
      )}
    </div>
  );
}


/* ===========================
      ESTILOS ORIGINAIS
   =========================== */

const gold = "#e3b23c";  
const textDark = "#2a2a2a";
const textGray = "#666";

const styles = {
  container: {
    width: "100%",
    maxWidth: "2000px",
    margin: "40px auto",
    padding: "20px",
    fontFamily: "Inter, sans-serif",
     minHeight: "100vh",
  },

  title: {
    fontSize: "32px",
    fontWeight: "600",
    color: textDark,
    marginBottom: "30px",
    borderLeft: `6px solid ${gold}`,
    paddingLeft: "12px",
  },

 list: {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "25px",
  width: "100%",
},


  card: {
    background: "#ffffff",
    borderRadius: "12px",
    padding: "25px",
    border: `1px solid ${gold}33`,
    display: "flex",
    flexDirection: "column",
    minHeight: "240px",
  },

  festaTitle: {
    fontSize: "22px",
    fontWeight: "600",
    color: textDark,
    marginBottom: "8px",
  },

  infoItem: {
    fontSize: "15px",
    color: textGray,
    marginTop: "4px",
  },

  label: {
    fontWeight: "600",
    color: textDark,
  },

  button: {
    marginTop: "15px",
    padding: "10px 16px",
    background: gold,
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    width: "150px",
  },
};


/* ===========================
            MODAL
   =========================== */

const modalStyles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
     overflowY: "auto", 
  },

  modal: {
    width: "480px",
    background: "#fff",
    padding: "25px",
    borderRadius: "10px",
    border: `2px solid ${gold}`,
    maxHeight: "80vh",
    overflowY: "auto",
  },

  item: {
    padding: "10px",
    marginBottom: "15px",
    borderBottom: "1px solid #ddd",
  },

  closeButton: {
    marginTop: "20px",
    width: "100%",
    padding: "10px",
    background: gold,
    border: "none",
    color: "#fff",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
  },
};
