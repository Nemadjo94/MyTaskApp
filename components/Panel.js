import React from 'react';
import {StyleSheet, Text, View, Image, TouchableHighlight,Animated, ScrollView} from 'react-native'; 

export default class Panel extends React.Component{
    constructor(props){
        super(props);

        this.icons = {     
            'up'    : require('../assets/Arrowhead.png'),
            'down'  : require('../assets/Arrowhead-Down.png')
        };

        this.state = {      
            title       : props.title,
            expanded    : true,
            animation   : new Animated.Value()
        };
    }

    toggle(){
        
        let initialValue    = this.state.expanded? this.state.maxHeight + this.state.minHeight : this.state.minHeight,
            finalValue      = this.state.expanded? this.state.minHeight : this.state.maxHeight + this.state.minHeight;
    
        this.setState({
            expanded : !this.state.expanded  
        });
    
        this.state.animation.setValue(initialValue);  
        Animated.spring(    
            this.state.animation,
            {
                toValue: finalValue
            }
        ).start();  
    }

    _setMaxHeight(event){
        this.setState({
            maxHeight   : event.nativeEvent.layout.height
        });
    }
    
    _setMinHeight(event){
        this.setState({
            minHeight   : event.nativeEvent.layout.height
        });
    }


    render(){
        let icon = this.icons['up'];

        if(this.state.expanded){
            icon = this.icons['down'];   
        }

       
        return ( 
            <Animated.View style={[styles.container,{height: this.state.animation, flex: this.state.expanded ? 1 : null}]} >

                <View style={styles.titleContainer} onLayout={this._setMinHeight.bind(this)}>
                    <Text style={styles.title}>{this.state.title}</Text>
                    <TouchableHighlight 
                        onPress={this.toggle.bind(this)}
                        underlayColor="#f1f1f1">
                        <Image
                            style={styles.buttonImage}
                            source={icon}
                        ></Image>
                    </TouchableHighlight>
                </View>

                <ScrollView contentContainerStyle={styles.body} onLayout={this._setMaxHeight.bind(this)}>  
               
                    {this.props.children}
                
                </ScrollView>

            </Animated.View>
        );
    }
}

var styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        overflow:'hidden',
        marginBottom: 2,
    },
    titleContainer: {
        flexDirection: 'row',
        backgroundColor: 'dodgerblue',
    },
    title: {
        flex: 1,
        padding: 10,
        color: '#FFF',
        fontWeight: 'bold',
        alignSelf: 'center',
        fontSize: 16,
    },
    buttonImage: {
        width: 35,
        height: 35,
        margin: 20,
    },
    body: {
        padding: 0,
        backgroundColor: '#FFF',      
    }
});

