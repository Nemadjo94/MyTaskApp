import React, {Component} from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
import Swipeable from 'react-native-swipeable';
import {deleteTask} from '../App';

export default class SwapableItem extends Component {

    state = {
      leftActionActivated: false,
      rightActionActivated: false,
      toggleLeft: false,
      toggleRight: false,
    };
  
    render() {
      const {leftActionActivated, toggleLeft} = this.state;
      const {rightActionActivated, toggleRight} = this.state;
  
      return (
        <Swipeable 
          leftActionActivationDistance={200} 
          leftContent={ !this.props.done ? (
            <View style={[styles.leftSwipeItem, {backgroundColor: leftActionActivated ? 'lightgoldenrodyellow' : "#fff"}]}>
                <Image  
                    source={require('../assets/check-symbol.png')}
                    style={{width: 50, height: 50, marginLeft: 5}}
                />
                <Text style={{color: '#000', fontSize: 14}} >Complete</Text>             
            </View>
          ) : null}
          onLeftActionActivate={() => this.props.completeTask(this.props.index)}
          onLeftActionDeactivate={() => this.setState({leftActionActivated: false})}
          onLeftActionComplete={() => this.setState({toggleLeft: !toggleLeft})}
        
          rightActionActivatedDistance={200}
          rightContent={(
            <View style={[styles.rightSwipeItem, {backgroundColor: rightActionActivated ? 'lightgoldenrodyellow' : 'rgba(150,0,0,0.6)'}]}>          
              <Image  
                source={require('../assets/delete.png')}
                style={{width: 50, height: 50, marginRight: 5}}
              />
              <Text style={{color: '#fff', fontSize: 14}}>Delete</Text>
            </View>
          )}
          onRightActionActivate={() => this.props.deleteTask(this.props.index)}
          onRightActionDeactivate={() => this.setState({rightActionActivated: false})}
          onRightActionComplete={() => this.setState({toggleRight: !toggleRight})}
        
          
          >
          <View style={styles.listItem}>
            <Image  
              source={this.props.done ? require('../assets/check-symbol.png') : require('../assets/circle.png')}
              style={{width: 30, height: 30, marginRight: '5%'}}
            />
            <Text style={{color: '#fff', fontSize: 16}}>{this.props.text}</Text>
          </View>
        </Swipeable>
      );
    }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 20
    },
    listItem: {
      height: 75,
      paddingLeft: 15,
      alignItems: 'center',
      justifyContent: 'flex-start',
      flexDirection: 'row',
      backgroundColor: 'rgba(0,0,0,0.6)',
      borderBottomWidth: 1,
      borderBottomColor: '#000',

    },
    leftSwipeItem: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'flex-start',
      flexDirection: 'row-reverse',
      paddingLeft: 10,
    },
    rightSwipeItem: {
      height: 75,
      alignItems: 'center',
      justifyContent: 'flex-start',
      flexDirection: 'row',
      paddingLeft: 5,
    },
  
  });