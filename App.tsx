import React, { useCallback, useEffect } from 'react';
import {
  ActivityIndicator,
  Button,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { observer } from 'mobx-react-lite';
import { useStore } from './src/use-store';
import { TodoEntity } from './src/todo/todo.entity';
import { TodosStore } from './src/todo/todo-store';

const App = () => {
  const store = useStore();

  return (
    <TodoListView todosStore={store.todosStore} />
  );
};

const TodoListView = observer(({ todosStore }: { todosStore: TodosStore }) => {
  const { todos } = todosStore;
  const { isPending } = todos;
  const { pending, done } = todosStore;

  const renderItem = useCallback((todo: TodoEntity) => {
    return <TodoListItem key={todo.id} item={todo} />
  }, []);

  if (isPending) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Button title='RELOAD' onPress={() => todos.fetch()} />
      <Text style={styles.sectionTitle}>{`Pending ${pending.length}`}</Text>
      <ScrollView style={{ flex: 1 }}>
        <View style={{ gap: 4 }}>
          {pending.map(todo => renderItem(todo))}
        </View>
      </ScrollView>

      <Text style={styles.sectionTitle}>{`Done ${done.length}`}</Text>
      <ScrollView style={{ flex: 1 }}>
        <View style={{ gap: 4 }}>
          {done.map(todo => renderItem(todo))}
        </View>
      </ScrollView>

    </SafeAreaView>
  );
});

const TodoListItem = observer(({ item }: { item: TodoEntity }) => {
  return (
    <View style={styles.todoContainer}>
      <Text style={styles.todoTitle}>{item.title}</Text>
      <Text>{item.completedDisplayName}</Text>
      <Button title='TOGGLE' onPress={() => {
        item.toggle();
      }} />
    </View>
  );
});

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 32,
    fontWeight: '600',
    color: 'white',
  },
  todoContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    gap: 12,
    padding: 12,
    backgroundColor: '#AAAAAA',
    borderRadius: 12,
  },
  todoTitle: {
    flexShrink: 1,
    fontSize: 16,
  },
});

export default App;
