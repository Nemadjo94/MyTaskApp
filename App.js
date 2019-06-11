import React from 'react';
import { ScrollView, View, StyleSheet, Text, KeyboardAvoidingView, TextInput, TouchableOpacity, FlatList, Image, AsyncStorage} from 'react-native';
import SwapableItem from './components/SwapableItem';
import Panel from './components/Panel';

export default class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      tasks: [], //For new tasks
      completed: [], //For completed tasks
      text: "", //Text input
      counter: 1,
      counterComplete: 1,
      //Counters are incrementing with every new task
      //assign them as keys for flat list
      //do this to avoid the same key warning
    }; 
  }
  

  
  //Key extractor for flat list
  //Flat list requires keys to be passed as string to avoid a warning
  _keyExtractor = (item, index) => (item.key).toString(); 

  //Change text state on input
  cnangeTextHandler = text => {
    this.setState({ text: text});
  };

  addTask = () =>{
    //Check if the text input is not empty
    //We dont want empty tasks
    let notEmpty = this.state.text.trim().length > 0;

    if(notEmpty){
      
      //If we have input add it to array and change state
      this.setState(
        prevState => {
          let { tasks, text, counter } = prevState;
          return {
            tasks: tasks.concat({ key: counter, text: text}),//Value added to tasks array
            text: "", //Empty text input after insert
            counter: counter += 1, //increment the counter
          };
        },
        () => Tasks.save(this.state.tasks)//save to async storage
      );
      console.log("Counter " + this.state.counter);
      console.log(this.state.tasks.length); //testing
    }
  };

  deleteTask = (i) => {
    this.setState(
      prevState => {
        let tasks = prevState.tasks.slice();
        tasks.splice(i, 1);
        return { tasks: tasks, };
      },
      () => Tasks.save(this.state.tasks),//save to async storage
    );
    console.log("task length: " + this.state.tasks.length);
  };

  deleteCompletedTask = (i) => {
    this.setState(
      prevState => {
        let completed = prevState.completed.slice();
        completed.splice(i, 1);
        return { 
          completed: completed, 
        };
      },
      () => CompletedTasks.save(this.state.completed),//save to async storage
    );
    console.log("completed length: " + this.state.tasks.length);
  };

  completeTask = (i) => {
    //Since we need two callback functions
    const SaveAll = () => {
      Tasks.save(this.state.tasks);
      CompletedTasks.save(this.state.completed);//save to async storage
    };

    this.setState(
      prevState => {
        let { completed, counterComplete } = prevState;
        let tasks = prevState.tasks.slice();
        let completedTask = tasks.splice(i, 1);
        return{
          completed: completed.concat({ key: counterComplete, text: completedTask[0].text}),
          tasks: tasks,
          counterComplete: counterComplete += 1,
        };
      },
      SaveAll,//Call both functions
    );
    console.log("completed length: " + this.state.completed.length);
  };

  clearTasks = () => {
    this.setState({
      tasks: [],
      counter: 1,
    },
    () => Tasks.save(this.state.tasks),//save to async storage
    )
  };
  
  clearCompletedTasks = () => {
    this.setState({
      completed: [],
      counterComplete: 1,
    },
    () => CompletedTasks.save(this.state.completed),//save to async storage
    )
  };

  componentDidMount(){
    //Load data on component did mount
    Tasks.all(tasks => this.setState({ tasks: tasks || [] }));
    CompletedTasks.all(tasks => this.setState({ completed: tasks || [] }));
  }

  render() {

    return (
      <KeyboardAvoidingView
        style={styles.mainContainer}
        behavior="padding"
      >
        <View style={{height: 25, backgroundColor: 'royalblue'}}></View>
        <View style={styles.headerContainer}>
        <Image  
              source={require('./assets/checklist.png')}
              style={{width: 40, height: 40, marginTop: 8, marginLeft: 10}}
            />
          <Text style={styles.header}>My Tasks</Text>
          
        </View>

        <ScrollView contentContainerStyle={styles.mainContainer}>    
       
          { this.state.tasks.length > 0 ?
            (<Panel title="Tasks to do">
            <FlatList 
              data={this.state.tasks}
              keyExtractor={this._keyExtractor}
              renderItem={({ item, index}) => 
              <SwapableItem text={item.text} deleteTask={this.deleteTask} completeTask={this.completeTask} index={index}/>
          }
            />    
      
            <TouchableOpacity 
              onPress={() => {
                this.clearTasks();
              }}
            >
              <Text style={styles.clearBtnText}>Clear all</Text>
            </TouchableOpacity>
            </Panel>)

            : (<View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
                  <Text style={{fontSize: 16}}>Start your day by adding some tasks! :)</Text>
              </View>)
            }
                 
          { this.state.completed.length > 0 ?       
            (<Panel title="Completed tasks">
               
            <FlatList 
              data={this.state.completed}
              keyExtractor={this._keyExtractor}
              renderItem={({ item, index}) =>               
              <SwapableItem text={item.text} deleteTask={this.deleteCompletedTask} completeTask={this.completeTask} done={true} index={index} />
            }
            />  
       
              <TouchableOpacity 
                onPress={() => {
                 this.clearCompletedTasks();
                }}
              >
                <Text style={styles.clearBtnText}>Clear all</Text>
              </TouchableOpacity>

            </Panel>) 
            : null }
             
        </ScrollView>

        <View style={styles.taskContainer}>
          <TextInput
            style={styles.textInput}
            onChangeText={this.cnangeTextHandler}
            value={this.state.text}
            placeholder=" Insert new task..."                                   
            />
            <TouchableOpacity 
              style={styles.searchBtn}
              onPress={() => {
                this.addTask(this.state.text)
                this.setState({task: ''})
              }}
            >
              <Text style={styles.searchBtnText}>Add</Text>
            </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>

    );
  }
}

//Async Storage for tasks
let Tasks = {
  convertToArrayOfObject(tasks, callback) {
    return callback(
      tasks ? tasks.split("||").map((task, i) => ({ key: i, text: task })) : []
    );
  },
  convertToStringWithSeparators(tasks) {
    return tasks.map(task => task.text).join("||");
  },
  all(callback) {
    return AsyncStorage.getItem("TASKS", (err, tasks) =>
      this.convertToArrayOfObject(tasks, callback)
    );
  },
  save(tasks) {
    AsyncStorage.setItem("TASKS", this.convertToStringWithSeparators(tasks));
    console.log("Task saved");
  }
};
//Async Storage for completed tasks
let CompletedTasks = {
  convertToArrayOfObject(tasks, callback) {
    return callback(
      tasks ? tasks.split("||").map((task, i) => ({ key: i, text: task })) : []
    );
  },
  convertToStringWithSeparators(tasks) {
    return tasks.map(task => task.text).join("||");
  },
  all(callback) {
    return AsyncStorage.getItem("COMPLETED_TASKS", (err, tasks) =>
      this.convertToArrayOfObject(tasks, callback)
    );
  },
  save(tasks) {
    AsyncStorage.setItem("COMPLETED_TASKS", this.convertToStringWithSeparators(tasks));
    console.log("Completed task saved");
  }
};



const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  taskContainer: {
		zIndex: 3,
    height: 70,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: '100%',
    flexDirection: 'row',
  },
  header: {
    color: '#fff',
    fontSize: 36,
    alignSelf: 'center',
    fontWeight: 'bold',
  },
  completedTaskHeader: {
    color: '#fff',
    fontSize: 22,
    alignSelf: 'center',
  },
  headerContainer: {
    height: 75,
    width: '100%',
    borderBottomWidth:1,
    borderBottomColor: 'royalblue',
    marginBottom: 2,
    backgroundColor: 'dodgerblue',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row-reverse',
  },
  textInput: {
    height: 70,
    width: '80%',
    fontSize: 22,
    color: '#fff',
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignSelf: 'center',
  },
  searchBtn: {
    height: 70,
    width: '80%',
    backgroundColor: 'dodgerblue',
    borderLeftWidth:1,
    borderLeftColor: 'royalblue',      
    borderBottomWidth:1,
    borderBottomColor: 'royalblue', 
  },
  searchBtnText: {
    fontSize: 22,
    color: '#fff',
    marginTop: '4%',
    marginLeft: '6.5%',
  },
  tasksContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth:0.4,
    borderBottomColor: '#000',

  },
  completedTaskContainer: {
    width: '100%',
    borderBottomWidth:1,
    borderBottomColor: 'royalblue',
    backgroundColor: 'dodgerblue',
    marginBottom: 2,
  },
  items: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth:0.4,
    borderBottomColor: '#000',
  },
  icon: {
    width: 30,
    height: 30,
    margin: 5,
  },
  list: {
    flexDirection: 'row',
    flex: 1,
    borderBottomWidth:0.4,
    marginBottom: 10,
  },
  itemText: {
    width: '85%',
  },listItem: {
    height: 75,
    alignItems: 'center',
    justifyContent: 'center'
  },
  leftSwipeItem: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: 20
  },
  rightSwipeItem: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingLeft: 20
  },
  clearBtnText: {
    fontSize: 18,
    color: 'dodgerblue',
    alignSelf: 'flex-end',
    margin: 12
  }

})









      


