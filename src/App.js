import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, KeyboardAvoidingView, Platform, Modal,
} from 'react-native';
import { handleInput, clearInput } from './Order';

const ORDERS_FOR_FREE = 10;

export default function App() {
  const [points, setPoints] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const scrollRef = useRef(null);

  function startBot() {
    clearInput();
    const welcome = handleInput();
    setMessages(welcome.map(m => ({ from: 'bot', text: m })));
    setModalVisible(true);
  }

  function send() {
    if (!input.trim()) return;
    const userMsg = { from: 'user', text: input };
    const responses = handleInput(input);
    const botMsgs = responses.map(m => ({ from: 'bot', text: m }));
    const newMessages = [...messages, userMsg, ...botMsgs];
    setMessages(newMessages);
    setInput('');

    const lastMsg = responses[responses.length - 1] || '';
    if (lastMsg.includes('Thank you')) {
      setPoints(prev => prev + 1);
      setTimeout(() => setModalVisible(false), 1500);
    }

    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  }

  const ordersLeft = ORDERS_FOR_FREE - (points % ORDERS_FOR_FREE);
  const isFreeNext = points > 0 && points % ORDERS_FOR_FREE === 0;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Burger Queen</Text>

      <View style={styles.body}>
        <Text style={styles.pointsLabel}>Loyalty Points</Text>
        <Text style={styles.pointsNumber}>{points}</Text>

        <View style={styles.dotsRow}>
          {Array.from({ length: ORDERS_FOR_FREE }).map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i < (points % ORDERS_FOR_FREE) && styles.dotFilled,
                isFreeNext && styles.dotFree
              ]}
            />
          ))}
        </View>

        {isFreeNext ? (
          <Text style={styles.freeMsg}>🎉 Your next order is FREE!</Text>
        ) : (
          <Text style={styles.subLabel}>{ordersLeft} order{ordersLeft !== 1 ? 's' : ''} until a free meal</Text>
        )}
      </View>

      <TouchableOpacity style={styles.fab} onPress={startBot}>
        <Text style={styles.fabText}>Order</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.drawer}>
            <View style={styles.drawerHeader}>
              <Text style={styles.drawerTitle}>Place an Order</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.closeBtn}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              ref={scrollRef}
              style={styles.chat}
              contentContainerStyle={{ padding: 16 }}
            >
              {messages.map((msg, i) => (
                <Text key={i} style={msg.from === 'bot' ? styles.bot : styles.user}>
                  {msg.from === 'bot' ? '> ' : ''}{msg.text}
                </Text>
              ))}
            </ScrollView>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  value={input}
                  onChangeText={setInput}
                  onSubmitEditing={send}
                  placeholder="type here..."
                  placeholderTextColor="#999"
                  returnKeyType="send"
                />
                <TouchableOpacity onPress={send} style={styles.sendBtn}>
                  <Text style={styles.sendText}>Send</Text>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  header: {
    paddingTop: 60, paddingBottom: 16, textAlign: 'center',
    fontSize: 20, fontWeight: 'bold',
    borderBottomWidth: 1, borderColor: '#000'
  },

  body: {
    flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24
  },

  pointsLabel: { fontSize: 14, color: '#999', letterSpacing: 2, textTransform: 'uppercase' },
  pointsNumber: { fontSize: 80, fontWeight: 'bold', color: '#000', marginVertical: 8 },

  dotsRow: { flexDirection: 'row', marginVertical: 16, gap: 8 },
  dot: {
    width: 18, height: 18, borderRadius: 9,
    borderWidth: 1, borderColor: '#000', backgroundColor: '#fff'
  },
  dotFilled: { backgroundColor: '#000' },
  dotFree: { backgroundColor: '#000', borderColor: '#000' },

  subLabel: { fontSize: 14, color: '#666', marginTop: 8 },
  freeMsg: { fontSize: 16, fontWeight: 'bold', color: '#000', marginTop: 8 },

  fab: {
    position: 'absolute', bottom: 36, right: 28,
    backgroundColor: '#000', borderRadius: 32,
    paddingVertical: 14, paddingHorizontal: 24,
    elevation: 4,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3, shadowRadius: 4,
  },
  fabText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },

  modalOverlay: {
    flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)'
  },
  drawer: {
    height: '75%', backgroundColor: '#fff',
    borderTopLeftRadius: 16, borderTopRightRadius: 16,
    overflow: 'hidden'
  },
  drawerHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 16, borderBottomWidth: 1, borderColor: '#000'
  },
  drawerTitle: { fontSize: 16, fontWeight: 'bold' },
  closeBtn: { fontSize: 18, color: '#000' },

  chat: { flex: 1 },
  bot: { fontSize: 15, marginBottom: 8, color: '#000' },
  user: { fontSize: 15, marginBottom: 8, color: '#000', textAlign: 'right' },

  inputRow: { flexDirection: 'row', borderTopWidth: 1, borderColor: '#000' },
  input: { flex: 1, padding: 12, fontSize: 15, color: '#000' },
  sendBtn: { padding: 12, justifyContent: 'center' },
  sendText: { fontSize: 15, fontWeight: 'bold' },
});