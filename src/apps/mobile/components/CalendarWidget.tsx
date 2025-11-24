import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const daysOfWeek = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'];


interface CalendarWidgetProps {
    selectedDate: Date;
    onDateSelect: (date: Date) => void;
    markedDates?: string[]; // Array of date strings in YYYY-MM-DD format
}

const CalendarWidget: React.FC<CalendarWidgetProps> = ({ selectedDate, onDateSelect, markedDates = [] }) => {
    const [currentDate, setCurrentDate] = useState(new Date()); // Start with current date
    const [showMonthPicker, setShowMonthPicker] = useState(false);

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month, 1).getDay();
    };

    const changeMonth = (increment: number) => {
        const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + increment, 1);
        setCurrentDate(newDate);
    };

    const selectMonth = (monthIndex: number) => {
        const newDate = new Date(currentDate.getFullYear(), monthIndex, 1);
        setCurrentDate(newDate);
        setShowMonthPicker(false);
    };

    const renderDays = () => {
        const daysInMonth = getDaysInMonth(currentDate);
        const firstDay = getFirstDayOfMonth(currentDate);
        const days = [];

        // Empty slots for previous month
        for (let i = 0; i < firstDay; i++) {
            days.push(<View key={`empty-${i}`} style={styles.dayCell} />);
        }

        // Days of the month
        for (let i = 1; i <= daysInMonth; i++) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
            const isSelected = selectedDate &&
                date.getDate() === selectedDate.getDate() &&
                date.getMonth() === selectedDate.getMonth() &&
                date.getFullYear() === selectedDate.getFullYear();

            // Check if date has event
            const dateString = date.toISOString().split('T')[0];
            const hasEvent = markedDates.includes(dateString);

            // Check if it is today
            const today = new Date();
            const isToday = date.getDate() === today.getDate() &&
                date.getMonth() === today.getMonth() &&
                date.getFullYear() === today.getFullYear();

            days.push(
                <TouchableOpacity
                    key={i}
                    style={[
                        styles.dayCell,
                        isSelected && styles.selectedDayCell,
                        hasEvent && !isSelected && styles.eventDayCell
                    ]}
                    onPress={() => onDateSelect(date)}
                >
                    <Text style={[
                        styles.dayText,
                        isSelected && styles.selectedDayText,
                        hasEvent && !isSelected && styles.eventDayText,
                        isToday && !isSelected && styles.todayText
                    ]}>{i}</Text>
                </TouchableOpacity>
            );
        }

        return days;
    };

    const formatMonthYear = (date: Date) => {
        const months = [
            'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
        ];
        return `${months[date.getMonth()]}, ${date.getFullYear()}`;
    };

    const renderMonthPicker = () => {
        const months = [
            'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
            'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
        ];

        return (
            <View style={styles.monthPickerContainer}>
                {months.map((month, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[styles.monthPickerCell, currentDate.getMonth() === index && styles.selectedMonthPickerCell]}
                        onPress={() => selectMonth(index)}
                    >
                        <Text style={[styles.monthPickerText, currentDate.getMonth() === index && styles.selectedMonthPickerText]}>
                            {month}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => setShowMonthPicker(!showMonthPicker)} style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.headerTitle}>{formatMonthYear(currentDate)}</Text>
                    <Ionicons name={showMonthPicker ? "chevron-up" : "chevron-down"} size={24} color="#333" />
                </TouchableOpacity>

                {/* Reset Button */}
                {(currentDate.getMonth() !== new Date().getMonth() || currentDate.getFullYear() !== new Date().getFullYear()) && (
                    <TouchableOpacity onPress={() => setCurrentDate(new Date())} style={styles.resetButton}>
                        <Ionicons name="refresh" size={20} color="#F4B400" />
                        <Text style={styles.resetText}>Voltar</Text>
                    </TouchableOpacity>
                )}
            </View>

            {showMonthPicker ? (
                renderMonthPicker()
            ) : (
                <>
                    <View style={styles.weekDays}>
                        {daysOfWeek.map((day) => (
                            <Text key={day} style={styles.weekDayText}>{day}</Text>
                        ))}
                    </View>

                    <View style={styles.daysGrid}>
                        {renderDays()}
                    </View>
                </>
            )}

            <View style={styles.handleBar} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#F5F5F5',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        width: '100%',
        maxWidth: 500,
        alignSelf: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    resetButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 5,
    },
    resetText: {
        color: '#F4B400',
        marginLeft: 5,
        fontWeight: 'bold',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
        marginRight: 10,
    },
    weekDays: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    weekDayText: {
        width: '14.28%',
        textAlign: 'center',
        color: '#999',
        fontSize: 12,
    },
    daysGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
    },
    dayCell: {
        width: '14.28%',
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 5,
    },
    selectedDayCell: {
        backgroundColor: '#F4B400',
        borderRadius: 20,
    },
    eventDayCell: {
        borderColor: '#F4B400',
        borderWidth: 1,
        borderRadius: 20,
    },
    dayText: {
        fontSize: 16,
        color: '#333',
    },
    selectedDayText: {
        color: '#FFF',
        fontWeight: 'bold',
    },
    eventDayText: {
        color: '#F4B400',
    },
    todayText: {
        color: '#F4B400',
        fontWeight: 'bold',
    },
    handleBar: {
        width: 40,
        height: 4,
        backgroundColor: '#CCC',
        borderRadius: 2,
        alignSelf: 'center',
        marginTop: 10,
    },
    monthPickerContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingVertical: 20,
    },
    monthPickerCell: {
        width: '30%',
        paddingVertical: 15,
        alignItems: 'center',
        marginBottom: 10,
        borderRadius: 10,
        backgroundColor: '#fff',
    },
    selectedMonthPickerCell: {
        backgroundColor: '#F4B400',
    },
    monthPickerText: {
        fontSize: 16,
        color: '#333',
    },
    selectedMonthPickerText: {
        color: '#FFF',
        fontWeight: 'bold',
    }
});

export default CalendarWidget;
