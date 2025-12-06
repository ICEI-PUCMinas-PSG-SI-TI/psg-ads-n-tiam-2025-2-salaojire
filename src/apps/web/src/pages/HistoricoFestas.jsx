import { useEffect, useState } from "react";
import { getHistoricoDeFestas } from "@packages/firebase/firestore/clientes";

export default function HistoricoFestas({ clienteId }) {
  const [festas, setFestas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const historico = await getHistoricoDeFestas(clienteId);

        console.log("QUANTAS FESTAS CHEGARAM?", historico.length);

        // AQUI ESTAVA O ERRO: VOCÊ NÃO TINHA ISSO
        setFestas(historico);

      } catch (e) {
        console.error("Erro:", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [clienteId]);

  if (loading)
    return <div style={styles.loading}>Carregando...</div>;

  if (festas.length === 0)
    return <div style={styles.empty}>Nenhuma festa encontrada.</div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Histórico de Festas</h1>

      <div style={styles.list}>
        {festas.map((f) => {
          const dataFmt =
            f.dataFim instanceof Date
              ? f.dataFim.toLocaleDateString()
              : "—";

          return (
            <div key={f.id} style={styles.card}>
              <div style={styles.cardLeft}>
                <div style={styles.festaTitle}>Festa #{f.id}</div>

                <div style={styles.infoItem}>
                  <span style={styles.label}>Data:</span> {dataFmt}
                </div>

                <div style={styles.infoItem}>
                  <span style={styles.label}>Valor Total:</span> R$ {f.valorTotal}
                </div>

                <div style={styles.infoItem}>
                  <span style={styles.label}>Status:</span>
                  <span style={{ ...styles.statusText, color: getStatusColor(f.status) }}>
                    {f.status.toUpperCase()}
                  </span>
                </div>
              </div>

              <button style={styles.button}>
                Ver detalhes
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ===========================
      ESTILOS
   =========================== */

const gold = "#e3b23c";  
const textDark = "#2a2a2a";
const textGray = "#666";

function getStatusColor(status) {
  if (status === "finalizado") return "#2e7d32";
  if (status === "cancelado") return "#c62828";
  return "#c5941a";
}

const styles = {
container: {
  width: "100%",
  maxWidth: "2000px",
  margin: "40px auto",
  padding: "20px",
  fontFamily: "Inter, sans-serif",
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
  gridTemplateColumns: "repeat(4, 1fr)", 
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
    justifyContent: "space-between",
    minHeight: "160px",
    transition: "0.2s ease",
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
    alignSelf: "flex-start",
  },
};
