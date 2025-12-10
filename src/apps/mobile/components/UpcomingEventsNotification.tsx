import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export type EventoNotificacao = {
    id: string;
    nomeEvento: string;
    dataInicio: Date | null;
    clienteNome: string;
    clienteEmail: string;
};

type UpcomingEventsNotificationProps = {
    eventos: EventoNotificacao[];
};

export default function UpcomingEventsNotification({ eventos }: UpcomingEventsNotificationProps) {

    const handleNotificar = async (evento: EventoNotificacao) => {
        if (!evento.clienteEmail) {
            Alert.alert("Erro", "Cliente sem email cadastrado.");
            return;
        }

        const subject = encodeURIComponent(`Lembrete: Seu evento ${evento.nomeEvento} está chegando!`);
        const dataFormatada = evento.dataInicio ? evento.dataInicio.toLocaleDateString('pt-BR') : 'data a confirmar';
        const body = encodeURIComponent(`Olá ${evento.clienteNome},\n\nEstamos passando para lembrar do seu evento "${evento.nomeEvento}" agendado para ${dataFormatada}.\n\nAnsiosos para recebê-lo!\n\nAtt,\nEquipe Jiré Festas`);

        const url = `mailto:${evento.clienteEmail}?subject=${subject}&body=${body}`;

        const canOpen = await Linking.canOpenURL(url);
        if (!canOpen) {
            Alert.alert("Erro", "Não foi possível abrir o app de email.");
        } else {
            Linking.openURL(url);
        }
    };

    if (eventos.length === 0) {
        return (
            <View style={styles.card}>
                <View style={styles.cardHeaderRow}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons name="notifications-outline" size={20} color="#555" style={{ marginRight: 8 }} />
                        <Text style={styles.cardTitleEmphasis}>Notificações Pendentes</Text>
                    </View>
                </View>
                <Text style={styles.emptyText}>Nenhum evento próximo (7 dias) para notificar.</Text>
            </View>
        );
    }

    return (
        <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name="notifications" size={20} color="#F0B100" style={{ marginRight: 8 }} />
                    <Text style={styles.cardTitleEmphasis}>Notificar Clientes</Text>
                </View>
                <Text style={styles.badge}>{eventos.length} pendente(s)</Text>
            </View>

            {eventos.map((evento) => (
                <View key={evento.id} style={styles.row}>
                    <View style={styles.info}>
                        <Text style={styles.clienteName}>{evento.clienteNome}</Text>
                        <Text style={styles.eventName}>{evento.nomeEvento} • {evento.dataInicio?.toLocaleDateString('pt-BR')}</Text>
                    </View>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => handleNotificar(evento)}
                    >
                        <Text style={styles.buttonText}>Email</Text>
                        <Ionicons name="mail-outline" size={16} color="#000" />
                    </TouchableOpacity>
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 18,
        padding: 16,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
        marginBottom: 16,
    },
    cardHeaderRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    cardTitleEmphasis: {
        fontSize: 15,
        fontWeight: "800",
        color: "#111",
    },
    badge: {
        fontSize: 12,
        color: "#F0B100",
        fontWeight: "700",
        backgroundColor: "#FFF5CC",
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
    },
    emptyText: {
        color: "#777",
        fontSize: 13,
        fontStyle: 'italic',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    info: {
        flex: 1,
        marginRight: 10,
    },
    clienteName: {
        fontSize: 14,
        fontWeight: '700',
        color: '#333',
    },
    eventName: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
    button: {
        flexDirection: 'row',
        backgroundColor: '#F0B100',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 8,
        alignItems: 'center',
        gap: 6
    },
    buttonText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#000',
    }
});