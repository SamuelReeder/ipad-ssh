import React, { useState, useRef } from 'react';
import { View, TextInput, Text, Button, ScrollView, StyleSheet } from 'react-native';
import { NodeSSH } from 'node-ssh';

const Terminal = () => {
  const [command, setCommand] = useState('');  // Command entered by the user
  const [output, setOutput] = useState('');    // Output shown in the terminal
  const scrollViewRef = useRef();              // Reference for scrolling
  
  const [connected, setConnected] = useState(false);
  const ssh = new NodeSSH();

  // SSH connection details
  const [host, setHost] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Function to handle SSH connection
  const connectToSSH = async () => {
    try {
      await ssh.connect({
        host: host,
        username: username,
        password: password,
      });
      setConnected(true);
      setOutput(prev => prev + '\nConnected to SSH successfully.\n');
    } catch (err) {
      setOutput(prev => prev + '\nError connecting to SSH: ' + err.message + '\n');
    }
  };

  // Function to execute command on SSH
  const runCommand = async () => {
    if (connected && command) {
      try {
        const result = await ssh.execCommand(command);
        const outputText = result.stdout || result.stderr;
        setOutput(prev => prev + '\n$ ' + command + '\n' + outputText + '\n');
        setCommand(''); // Reset command after execution
      } catch (err) {
        setOutput(prev => prev + '\nError: ' + err.message + '\n');
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* SSH Connection Inputs */}
      {!connected && (
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Host"
            style={styles.input}
            value={host}
            onChangeText={setHost}
          />
          <TextInput
            placeholder="Username"
            style={styles.input}
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            placeholder="Password"
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />
          <Button title="Connect" onPress={connectToSSH} />
        </View>
      )}

      {/* Terminal Output */}
      <ScrollView 
        style={styles.outputContainer} 
        ref={scrollViewRef} 
        onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
      >
        <Text style={styles.outputText}>{output}</Text>
      </ScrollView>

      {/* Command Input */}
      {connected && (
        <TextInput
          style={styles.commandInput}
          value={command}
          onChangeText={setCommand}
          onSubmitEditing={runCommand}
          placeholder="Enter command..."
          returnKeyType="send"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  inputContainer: {
    padding: 10,
  },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    marginVertical: 5,
  },
  outputContainer: {
    flex: 1,
    backgroundColor: '#000',
    padding: 10,
  },
  outputText: {
    color: '#00FF00',  // Terminal green text
  },
  commandInput: {
    backgroundColor: '#333',
    color: '#FFF',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#777',
  },
});

export default Terminal;
