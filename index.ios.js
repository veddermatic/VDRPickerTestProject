/**
 * Sample React Native App
 * This is borowed heavily from the ReactNative exmaple for their PickerIOS
 *      (http://facebook.github.io/react-native/docs/pickerios.html#content)
 * and modified to show the multi-component picker proof of concept created
 * based off of the single-component only one included in the first public
 * release of ReactNative.
 */
'use strict';

var React = require('react-native');
var VPickerIOS = require('./vedder-picker.ios.js');
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableHighlight, 
} = React;

var MAKE_COMPONENT = 0;
var MODEL_COMPONENT = 1;

var VPickerItem = VPickerIOS.Item;
var VPickerComponent = VPickerIOS.PickerComponent;

var VedderPicker = React.createClass({
    /*
       most of the code in here is to parse the car data I borrowed from the 
       React Native example.
    */
    _parseMakesListData: function () {
        var makesItems = Object.keys(CAR_MAKES_AND_MODELS).map(function (key) {
            return {value:  key, label: CAR_MAKES_AND_MODELS[key].name}
        });
        return makesItems;
    },

    _modelData:  function(makeKey) {
        return CAR_MAKES_AND_MODELS[makeKey].models.map(function (model, idx) {
            return {value: idx, label: model};
        });
    },


    getInitialState: function () {

        var selectedMake = 'cadillac';
        var selectedModel = 2; // should be 'Eldorado'

        var makeData = this._parseMakesListData();
        var models = this._modelData(selectedMake);


        var carPickerData = [
            {items: makeData},
            {items: models},
        ];

        var boringLeftValue = 'cow';
        var boringRightValue = 'Dos';
        return { carPickerData, selectedMake, selectedModel, boringRightValue, boringLeftValue }
    },

    _pickerChange: function (event) {
        /*
           The 'event.nativeEvent' object has the following attributes on it:
           "target": the reactTag of the UIPicker
           "newIndex": the numeric index of the newly selected row in the changed component
           "component": the numeric index of the changed component in the UIPIcker
           "newValue": the 'value' property of the newly selected row in the changed component. This might not be the same as the label.
        */

        var changedComponent = event.nativeEvent.component;
        var newRowValue = event.nativeEvent.newValue;
        var newRowIndex = event.nativeEvent.newIndex;
        var existingRowValue = (changedComponent === MAKE_COMPONENT) ? 
            this.state.selectedMake :
            this.state.selectedModel; 

        var currentData = this.state.carPickerData;

        if (existingRowValue !== newRowIndex) {
            if (changedComponent === MODEL_COMPONENT) {
                this.setState({ 
                    selectedModel: newRowValue,
                    carPickerData: currentData
                });
            } else {
                currentData[1].items = this._modelData(currentData[0].items[newRowIndex].value);
                this.setState({ 
                    carPickerData: currentData,
                    selectedMake: newRowValue,
                    selectedModel: 0,
                });
            }
        }

    },

    // if you don't need to do anything fancy...
    _boringPickerChange: function (event) {
        var changedComponent = event.nativeEvent.component;
        var newRowValue = event.nativeEvent.newValue;
        var existingRowSelect = (changedComponent === 0) ? 
            this.state.boringLeftValue :
            this.state.boringRightValue; 
        
        if (existingRowSelect !== newRowValue) {
            if (changedComponent === 0) {
                this.setState({boringLeftValue: newRowValue});
            } else {
                this.setState({boringRightValue: newRowValue});
            }
        }
    },


    render: function() {
        
        // makes the picker components and items for the "dynamic" picker
        var pickerComponents = this.state.carPickerData.map(function (data, idx) { 
            var selectedValue = (idx === MAKE_COMPONENT) ? this.state.selectedMake : this.state.selectedModel;
            return (
                <VPickerComponent items={data.items} selectedValue={selectedValue} key={"component_" + idx}>
                    {data.items.map(function (item) {
                        return <VPickerItem value={item.value} label={item.label} key={item.value} />
                    })}
                </VPickerComponent>
            );
        }, this);

        var make = CAR_MAKES_AND_MODELS[this.state.selectedMake];
        var modelName = make.models[this.state.selectedModel];
        var carSelectionString = make.name + ' ' + modelName;

        var boringSelectionString = this.state.boringLeftValue + ' ' + this.state.boringRightValue;

        return (
            <View style={[{paddingTop: 40}]}>

                <View>
                    <Text style={styles.headerText}>
                        Exciting Dynamic Picker!
                    </Text>
                    <Text style={styles.selectionText}>
                        {carSelectionString}
                    </Text>
                    <VPickerIOS style={styles.picker}  onChange={this._pickerChange}>
                        {pickerComponents}
                    </VPickerIOS>
                </View>

                <View style={{borderTopWidth: 1, borderTopColor: '#cccccc'}}>
                    <Text style={styles.headerText}>
                        I am boring.
                    </Text>
                    <Text style={styles.selectionText}>
                        {boringSelectionString}
                    </Text>
                    <VPickerIOS style={styles.picker} onChange={this._boringPickerChange}>
                        <VPickerComponent selectedValue={this.state.boringLeftValue}>
                            <VPickerItem value="How" label="How" />
                            <VPickerItem value="now" label="now" />
                            <VPickerItem value="brown" label="brown" />
                            <VPickerItem value="cow" label="cow" />
                        </VPickerComponent>
                        <VPickerComponent selectedValue={this.state.boringRightValue}>
                            <VPickerItem value="Uno" label="Uno" />
                            <VPickerItem value="Dos" label="Dos" />
                            <VPickerItem value="Tres" label="Tres" />
                            <VPickerItem value="Four" label="Four" />
                        </VPickerComponent>
                    </VPickerIOS>
                </View>
            </View>
        );
    }
});

var styles = StyleSheet.create({
    // if you put this on the main view, your pickers will move over to the
    // right and be off-screen. This confuses me.
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    picker: {
        // to see width related craziness, uncomment the below
        // backgroundColor: '#fff9f0',
        // width: 250,
    },
    headerText: {
        backgroundColor: '#ffffff',
        fontSize: 18,
        color: '#666666',
        textAlign: 'center',
        paddingTop: 12,
    }, 
    selectionText: {
        backgroundColor: '#ffffff',
        color: '#333333',
        textAlign: 'center',
        paddingBottom: 12,
        fontSize: 21,
    }
});

// copy / paste from the ReactNative example...
var CAR_MAKES_AND_MODELS = {
  amc: {
    name: 'AMC',
    models: ['AMX', 'Concord', 'Eagle', 'Gremlin', 'Matador', 'Pacer'],
  },
  alfa: {
    name: 'Alfa-Romeo',
    models: ['159', '4C', 'Alfasud', 'Brera', 'GTV6', 'Giulia', 'MiTo', 'Spider'],
  },
  aston: {
    name: 'Aston Martin',
    models: ['DB5', 'DB9', 'DBS', 'Rapide', 'Vanquish', 'Vantage'],
  },
  audi: {
    name: 'Audi',
    models: ['90', '4000', '5000', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'Q5', 'Q7'],
  },
  austin: {
    name: 'Austin',
    models: ['America', 'Maestro', 'Maxi', 'Mini', 'Montego', 'Princess'],
  },
  borgward: {
    name: 'Borgward',
    models: ['Hansa', 'Isabella', 'P100'],
  },
  buick: {
    name: 'Buick',
    models: ['Electra', 'LaCrosse', 'LeSabre', 'Park Avenue', 'Regal',
             'Roadmaster', 'Skylark'],
  },
  cadillac: {
    name: 'Cadillac',
    models: ['Catera', 'Cimarron', 'Eldorado', 'Fleetwood', 'Sedan de Ville'],
  },
  chevrolet: {
    name: 'Chevrolet',
    models: ['Astro', 'Aveo', 'Bel Air', 'Captiva', 'Cavalier', 'Chevelle',
             'Corvair', 'Corvette', 'Cruze', 'Nova', 'SS', 'Vega', 'Volt'],
  },
};


AppRegistry.registerComponent('VedderPicker', () => VedderPicker);
