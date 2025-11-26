import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function GraficoBarras({ dados, titulo, valor, unidade, esquerda = false }) {

  const dadosOrdenados = useMemo(() => {
    return [...dados].sort((a, b) => {
    const A = a[valor] || 0;
    const B = b[valor] || 0;

    return B - A;
  });
  }, [dados])

  const maiorValor = dadosOrdenados.length > 0
  ? Math.max(...dadosOrdenados.map(item => Number(item[valor]))) : 1;
  
  const cores = ['#FF5B5B', '#FFD154', '#4ADB97', '#6AB8E8', '#A58BFF'];

  const RenderIcone = ({ url }) => {
    if (url) {
      return (
        <Image
          source={{ uri: url }}
          style={styles.imagemItem}
          resizeMode="cover"
        />
      );
    }

    return (
      <View style={styles.iconePlaceholder}>
        <MaterialCommunityIcons name="cube-outline" size={20} color="#666" />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>{titulo}</Text>

      <View style={styles.listaContainer}>
        {dadosOrdenados.map((item, index) => {
          const porcentagem = (Number(item[valor]) / maiorValor) * 100;
          const corBarra = cores[index % cores.length];

          return (
            <View key={index} style={styles.linha}>

              <View style={styles.colunaIcone}>
                <RenderIcone url={item.imageUrl} />
              </View>

              <View style={styles.colunadadosOrdenados}>

                <View style={styles.cabecalhoLinha}>
                  <Text style={styles.textoNome} numberOfLines={1}>
                    {item.nome}
                  </Text>
                  <Text style={styles.textoValor}>
                    {esquerda ? `${unidade} ${item[valor]}` : `${item[valor]} ${unidade}`}
                  </Text>
                </View>

                <View style={styles.fundoBarra}>
                  <View style={[
                    styles.barraPreenchida,
                    { width: `${porcentagem}%`, backgroundColor: corBarra }
                  ]}
                  />
                </View>
              </View>

            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  titulo: {
    color: '#2C3E50',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  listaContainer: {
    gap: 16,
  },
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colunaIcone: {
    marginRight: 12,
  },
  imagemItem: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
  },
  iconePlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#f2f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  colunadadosOrdenados: {
    flex: 1,
    justifyContent: 'center',
  },
  cabecalhoLinha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
    alignItems: 'center',
  },
  textoNome: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  textoValor: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555',
  },
  fundoBarra: {
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    width: '100%',
    overflow: 'hidden',
  },
  barraPreenchida: {
    height: '100%',
    borderRadius: 4,
  }
});