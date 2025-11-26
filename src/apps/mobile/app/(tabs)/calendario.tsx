import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, SafeAreaView, ActivityIndicator, TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import CalendarWidget from "../../components/CalendarWidget";
import EventList from "../../components/EventList";
import FirebaseAPI from "@packages/firebase";

interface Event {
  type: string;
  title: string;
  time: string;
}

export default function CalendarioScreen() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [allEvents, setAllEvents] = useState<Record<string, Event[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const agendamentos = await FirebaseAPI.firestore.clientes.getAllAgendamentos();

      const eventsMap: Record<string, Event[]> = {};

      agendamentos.forEach((ag: any) => {
        if (!ag.dataInicio) return;

        const dataInicio = ag.dataInicio.seconds ? new Date(ag.dataInicio.seconds * 1000) : new Date(ag.dataInicio);
        const dataFim = ag.dataFim?.seconds ? new Date(ag.dataFim.seconds * 1000) : (ag.dataFim ? new Date(ag.dataFim) : null);

        const dateString = dataInicio.toISOString().split('T')[0];

        const startTime = `${String(dataInicio.getHours()).padStart(2, '0')}:${String(dataInicio.getMinutes()).padStart(2, '0')}`;
        const endTime = dataFim ? `${String(dataFim.getHours()).padStart(2, '0')}:${String(dataFim.getMinutes()).padStart(2, '0')}` : '';

        const event: Event = {
          type: 'gathering',
          title: ag.nome || 'Evento sem nome',
          time: endTime ? `${startTime} - ${endTime}` : startTime
        };

        if (!eventsMap[dateString]) {
          eventsMap[dateString] = [];
        }
        eventsMap[dateString].push(event);
      });

      setAllEvents(eventsMap);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const getEventsForDate = (date: Date): Event[] => {
    const dateString = date.toISOString().split('T')[0];
    return allEvents[dateString] || [];
  };

  const voltar = () => {
    router.push("/");
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#F4B400" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          <TouchableOpacity onPress={voltar} style={{ paddingRight: 10 }}>
            <Ionicons name="arrow-back" size={24} color="#FFD700" />
          </TouchableOpacity>
          Calendário
        </Text>
      </View>
      <ScrollView style={styles.container}>
        <CalendarWidget
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
          markedDates={Object.keys(allEvents)}
        />

        <EventList
          selectedDate={selectedDate}
          events={getEventsForDate(selectedDate)}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#000",
    padding: 20,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  headerTitle: {
    color: "#ffd700ff",
    fontSize: 20,
    fontWeight: "bold",
    flexDirection: 'row',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
  },
});
