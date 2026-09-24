import { Text, View, StyleSheet, Button } from 'react-native';
import { Paypur } from 'react-native-paypur';

Paypur.init({
  gatewayKey: '178338e896a15e4c57243c830375d80d',
  gatewaySalt:
    '448c8d88784f979f3bc420e6c02015f50e8d5cf1d42def37221139628b926689',
});

export default function App() {
  function verifyPg() {
    console.log('verifyInit', Paypur.verifyInit());
  }

  function handlePayment() {
    Paypur.startPayment({
      orderId: 'order_02b1df539117',
      amount: '100.55',
      surl: 'https://example.com/paypur/success',
      furl: 'https://example.com/paypur/failure',
      customer: {
        firstname: 'John',
        email: 'john@example.com',
        phone: '9999999999',
      },
    });
  }
  return (
    <View style={styles.container}>
      <Text>Paypur</Text>
      <Button title="Init payment" onPress={handlePayment} />
      <Button title="verify PG integration" onPress={verifyPg} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
