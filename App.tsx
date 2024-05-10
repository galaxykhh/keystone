import { observer } from 'mobx-react-lite';
import React, { useCallback, useEffect } from 'react';
import type { PropsWithChildren } from 'react';
import {
  ActivityIndicator,
  Button,
  FlatList,
  ListRenderItemInfo,
  SafeAreaView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import { useStore } from './src/use-store';
import { TodoEntity } from './src/todo/todo.entity';
import { TodosRemoteStore } from './src/todo/todo-store';
import { getSnapshot } from 'mobx-keystone';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({ children, title }: SectionProps): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

const App = () => {
  return (
    <TodoListView />
  );
};

type Prop = {
  item: TodoEntity;
}

const TodoListItem = observer(({ item }: Prop) => {
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


const TodoListView = observer(() => {
  const { todosStore } = useStore();
  const { todos } = todosStore;
  
  const renderItem = useCallback(({ item }: ListRenderItemInfo<TodoEntity>) => {
    return <TodoListItem item={item} />
  }, []);
  
  
  useEffect(() => {
    const snapshot = getSnapshot(todosStore);
    console.log(snapshot);
  }, [todosStore]);

  return (
    <SafeAreaView>
      <Button title='Refetch' onPress={() => todos.refetch()} />
      {todos.isRefetching && <ActivityIndicator />}
      <Section title={`Todos ${todosStore.filteredCount}`}>
        {todos.isSuccess
          ? (
            <FlatList
              data={todosStore.filteredTodos.slice()}
              keyExtractor={item => item.id.toString()}
              renderItem={renderItem}
              contentContainerStyle={{ gap: 6 }}
            />
          )
          : <ActivityIndicator />
        }
      </Section>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,

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
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
