import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Event {
    type: string;
    title: string;
    time: string;
}

interface EventListProps {
    selectedDate: Date;
    events: Event[];
}

const EventList: React.FC<EventListProps> = ({ selectedDate, events }) => {
    const formatDate = (date: Date) => {
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'long' });
        const year = date.getFullYear();

        const monthCapitalized = month.charAt(0).toUpperCase() + month.slice(1);
        return `${day} de ${monthCapitalized} ${year}`;
    };

    const renderEventIcon = (type: string) => {
        switch (type) {
            case 'birthday':
                return <Ionicons name="balloon-outline" size={24} color="#000" />;
            case 'gathering':
                return <Ionicons name="people-outline" size={24} color="#000" />;
            default:
                return <Ionicons name="calendar-outline" size={24} color="#000" />;
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.dateHeader}>{formatDate(selectedDate)}</Text>

            {events.map((event, index) => (
                <View key={index} style={styles.eventCard}>
                    <View style={styles.iconContainer}>
                        {renderEventIcon(event.type)}
                    </View>
                    <View style={styles.eventDetails}>
                        <Text style={styles.eventTitle}>{event.title}</Text>
                        <Text style={styles.eventTime}>{event.time}</Text>
                    </View>
                </View>
            ))}

            {events.length === 0 && (
                <Text style={styles.noEventsText}>Nenhum evento para este dia.</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    dateHeader: {
        fontSize: 18,
        color: '#666',
        marginBottom: 15,
    },
    eventCard: {
        flexDirection: 'row',
        backgroundColor: '#EFEBE0',
        borderRadius: 20,
        padding: 15,
        marginBottom: 10,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 2,
    },
    iconContainer: {
        marginRight: 15,
    },
    eventDetails: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    eventTitle: {
        fontSize: 14,
        color: '#333',
        flex: 1,
    },
    eventTime: {
        fontSize: 14,
        color: '#333',
    },
    noEventsText: {
        color: '#999',
        fontStyle: 'italic',
    }
});

export default EventList;
