/* jshint browser: true, esversion: 5, asi: true */
/*globals uibuilder, Vue */
// @ts-nocheck
/*
  Copyright (c) 2019 Julian Knight (Totally Information)

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/
'use strict'

/** @see https://github.com/TotallyInformation/node-red-contrib-uibuilder/wiki/Front-End-Library---available-properties-and-methods */

const login = 'admin'
const password = 'admin1'

var app = new Vue({
    // The HTML element to attach to
	el: '#app',
	/** Pre-defined data
	 *  Anything defined here can be used in the HTML
	 *  if you update it, the HTML will automatically update
	 */
	data: {
		msg: 'Nothing recieved yet',
		email: '',
		emails: new Set(),
		discord: '',
		discords: new Set(),
		maxTemp: '',
		currentMaxTemp: '',
		minTemp: '',
		currentMinTemp: '',
		url: 'http://127.0.0.1:1880/',
		lBound: 20,
		rBound: 50,
		
		//sensor list:
		name_dev: '',
		address: '',
		type: 0,
		sensors: '',
		
		interval_value_1: '',
		interval_unit_1: '',
		interval_value_2: '',
		interval_unit_2: '',
		interval_value_3: '',
		interval_unit_3: '',
		interval_value_aveva: '',
		interval_unit_aveva: '',
		
		current_interval_value_1: '',
		current_interval_unit_1: '',
		current_interval_value_2: '',
		current_interval_unit_2: '',
		current_interval_value_3: '',
		current_interval_unit_3: '',
		current_interval_value_aveva: '',
		current_interval_unit_aveva: '',
		
		units: new Set(['ms', 's', 'm', 'h']),
		
		authorised: false,
	}, 
	
	methods: {
	    login: function(){
	        let currentLogin = document.getElementById('exampleInputUsername1').value
	        let currentPassword = document.getElementById('exampleInputPassword1').value
	        if (password === currentPassword && login === currentLogin){
	            this.authorised = true;
	        }
	        
	    },
	    
	    logout: function(){
	        if (confirm('Exit administration pannel?')){
	            this.authorised = false;
	        }
	    },
	    
	    addEmail: function(){
	        let email = this.email.toLowerCase().trim()
	        if(this.validateEmail(email) && confirm(`Add ${email} to whitelist?`) && !this.emails.has(email)){
	            this.emails.add(email)
	            
	            uibuilder.send({
    	            'topic': 'add',
    	            'type': 'email',
    	            'payload':{
    	                'value': email,
    	                'emails': Array.from(this.emails) 
	                }
	            })
	            this.email = ''
	        } else {
	          alert('Invalid email adress or email is already in whitelist')  
	        }
	    },
	    
	    addDiscord: function(){
	        let discord = this.discord.trim()
	        if(this.validateDiscord(discord) && confirm(`Add ${discord} to whitelist?`) && !this.discords.has(discord)){
	            this.discords.add(discord)
	            
	            uibuilder.send({
    	            'topic': 'add',
    	            'type': 'discord',
    	            'payload':{
    	                'value': discord,
    	                'discords': Array.from(this.discords) 
	                }
	            })
	            this.discord = ''
	        } else {
	          alert('Invalid discord name or name is already in whitelist')  
	        }
	    },
	    
	    remove: function(){
	        let removeButton = event.target
	        let type = removeButton.parentNode.getAttribute("class").split(' ').slice(-1)[0]
	        let value = event.target.parentNode.innerText.split('\n')[0].trim()
	        
	        if (confirm(`Remove ${value} from whitelist?`)){
	            removeButton.parentNode.remove()
	            
	            if (type === 'email'){
	                this.emails.delete(value)    
	            }
	            
                if (type === 'discord'){
                    this.discords.delete(value)
                }	            
	            
	            uibuilder.send({
    	            'topic': 'remove',
    	            'type': type,
    	            'payload':{
    	                'value': value,
    	            }
    	        })
	        }
	        
	    },
	    
	    validateEmail: function(email){
	        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.toLowerCase())){
                return (true)
            }
            return (false)
	    },
	    
	    validateDiscord: function(discord){
	        // need to create "right" validation for discord
	        if(/[\S]+#\d{4}\b/.test(discord.trim())){
	            return (true)
	        }
	        return (false)
	    },
	    
	    validateValue: function(value){
	        if (value >= this.lBound && value <= this.rBound){
	            return (true)
	        }
	        return (false)
	    },
	    
	    saveTemp: function(){
	        let appVue = this
	        let button = event.target
	        let input = button.parentNode.childNodes[2]
	        let key = button.parentNode.getAttribute("class").split(' ').slice(-1)[0]
	        let value = Number(this[key])
	        let url = this.url + 'update_save_var/password/' + key + '/' + value
	        
	        if (this.validateValue(value)){
	            uibuilder.send({
	                'topic': 'update',
	                'payload':{
	                    'key': key,
	                    'value': value,
	                }
	            })
	            
	            fetch(url, {
	                method: 'GET',
	                mode: 'cors', // no-cors, *cors, same-origin
                    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                    credentials: 'same-origin', // include, *same-origin, omit
                    headers: {
                      'Content-Type': 'application/json'
                      // 'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    redirect: 'follow', // manual, *follow, error
                    referrerPolicy: 'no-referrer'
	            }).then(response => {
	                console.log(response)
	                if (response.ok){
	                    appVue['currentM' + key.slice(1)] = value;
	                    appVue[key] = ''
	                    input.style.borderWidth = '2px'
	                    input.style.borderColor = 'green'
	                    setTimeout(() => {
	                        input.style.borderColor = '#ced4da'
	                        input.style.borderWidth = '1px'
	                    }, 1000)
	                }
	                else if (response === undefined){
	                    input.style.borderWidth = '2px'
	                    input.style.borderColor = 'red'
	                    setTimeout(() => {
	                        input.style.borderColor = '#ced4da'
	                        input.style.borderWidth = '1px'
	                    }, 1000)
	                }
	            })
	            
	        } else {
	          alert('Value is out of bounds')  
	        }
	    },
	    
	    setInterval: function(){
	        
	        let appVue = this
	        let updated = false
	        let button = event.target
	        let input1 = button.parentNode.children[1]
	        let input2 = button.parentNode.children[2]
	        let sensor = button.parentNode.getAttribute("class").split(' ').slice(-1)[0]
	        let sensorId = sensor.split('_')[1]
	        let intervalKey = 'interval_value_' + sensorId
	        let unitKey = 'interval_unit_' + sensorId
	        let intervalUrl = this.url + 'update_save_var/password/' + intervalKey + '/' + this[intervalKey]
	        let unitUrl = this.url + 'update_save_var/password/' + unitKey + '/' + this[unitKey]
	        
	        if (this[intervalKey].length === 0 || Number(this[intervalKey]) > 1000 || !this.units.has(this[unitKey]) || /\D+/.test(this[intervalKey])){
	            alert('Values are invalid')
	            return
	        }
	        
	        
	        
	        [intervalUrl, unitUrl].forEach(url => {
	            fetch(url, {
	                method: 'GET',
	                mode: 'cors', // no-cors, *cors, same-origin
                    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                    credentials: 'same-origin', // include, *same-origin, omit
                    headers: {
                      'Content-Type': 'application/json'
                      // 'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    redirect: 'follow', // manual, *follow, error
                    referrerPolicy: 'no-referrer'
    	        }).then(response => {
    	                console.log(response)
    	                if (!updated){
        	                if (response.ok){
        	                    updated = true
        	                    input1.style.borderWidth = '2px'
        	                    input1.style.borderColor = 'green'
        	                    input2.style.borderWidth = '2px'
        	                    input2.style.borderColor = 'green'
        	                    setTimeout(() => {
        	                        input1.style.borderColor = ''
        	                        input1.style.borderWidth = '1px'
        	                        input2.style.borderColor = ''
        	                        input2.style.borderWidth = '1px'
        	                    }, 1000)
        	                    this['current_' + intervalKey] = this[intervalKey]
                                this['current_' + unitKey] = this[unitKey]
                                this[intervalKey] = ''
                                this[unitKey] = ''
        	                }
        	                else{
        	                    input1.style.borderWidth = '2px'
        	                    input1.style.borderColor = 'red'
        	                    input2.style.borderWidth = '2px'
        	                    input2.style.borderColor = 'red'
        	                    setTimeout(() => {
        	                        input1.style.borderColor = ''
        	                        input1.style.borderWidth = '1px'
        	                        input2.style.borderColor = ''
        	                        input2.style.borderWidth = '1px'
        	                    }, 1000)
        	                }
        	                updated = true
    	                }
                    })
                
	        })
            
            
            
	    },
	    
	    removeSensor: function(){
	        let url = this.url + 'delete_sensor_list/password/'
	        let removeButton = event.target
	        let name = removeButton.parentNode.childNodes[0].innerHTML.toString()
	        let sensor

	        this.sensors.forEach(item => {
	            if (item.name_dev === name){
	                sensor = item
	            }
	        })

	        let params = {
	            method: 'GET',
	            headers: {
	                'Content-Type': 'application/json'
	            },
	        }
	        
	        if (confirm(`Delete ${name} from sensor list?`)){
	            fetch((url + name), params)
	                .then(response => {console.log(response)})
	                
	            let index = this.sensors.indexOf(sensor)
	            this.sensors.splice(index, 1)
	        }
	        
	    },
	    
	    addSensor: function(){
	        let url = this.url + 'insert_sensor_list/password/'
	        let data = `('${this.name_dev}', '${this.address}', ${Number(this.type)})`
	        
	        let params = {
	            method: 'GET',
	            headers: {
	                'Content-Type': 'application/json'
	            },
	        }
	        
	        if (this.name_dev.length != 0 && this.address != 0){
	            if (confirm(`Add ${this.name_dev} to sensor_list?`)){
    	            fetch((url + data), params)
    	            .then(response => {console.log(response)})
    	            
        	        this.sensors.push({
        	            name_dev: this.name_dev,
        	            address: this.address,
        	            type: this.type,
        	        })
        	        
        	        this.name_dev = ''
        	        this.address = ''
        	        this.type = 0
	            }
    	    }
    	    else {
    	        alert('Values are invalid')
    	    }
	    }
	},

    // This is called when Vue is fully loaded
	mounted: function() {
	    // Start up uibuilder
		uibuilder.start()
		
		// Keep a convenient reference to the Vue app
		var vueApp = this

        /** Triggered when the node on the Node-RED server
         *  recieves a (non-control) msg
         */
		uibuilder.onChange('msg', function(msg) {
			vueApp.msg = msg
			if (msg.payload.emails){
    			vueApp.emails = new Set(msg.payload.emails)
			}
			if (msg.payload.discords){
			    vueApp.discords = new Set(msg.payload.discords)	    
			}
			if (msg.payload.maxTemp){
			    vueApp.currentMaxTemp = msg.payload.maxTemp;
			}
			if (msg.payload.minTemp){
			    vueApp.currentMinTemp = msg.payload.minTemp;
			}
			
			if (msg.payload.interval_value_1){
			    vueApp.current_interval_value_1 = msg.payload.interval_value_1
			}
			if (msg.payload.interval_unit_1){
			    vueApp.current_interval_unit_1 = msg.payload.interval_unit_1
			}
			if (msg.payload.interval_value_2){
			    vueApp.current_interval_value_2 = msg.payload.interval_value_2
			}
			if (msg.payload.interval_unit_2){
			    vueApp.current_interval_unit_2 = msg.payload.interval_unit_2
			}
			if (msg.payload.interval_value_3){
			    vueApp.current_interval_value_3 = msg.payload.interval_value_3
			}
			if (msg.payload.interval_unit_3){
			    vueApp.current_interval_unit_3 = msg.payload.interval_unit_3
			}
			if (msg.payload.interval_unit_aveva){
			    vueApp.current_interval_unit_aveva = msg.payload.interval_unit_aveva
			}
			if (msg.payload.interval_value_aveva){
			    vueApp.current_interval_value_aveva = msg.payload.interval_value_aveva
			}
			if (msg.payload.sensors){
			    vueApp.sensors = msg.payload.sensors
			}
			
		})

		// Send message back to node-red
// 		uibuilder.send(this.msg)

		// Triggered on reciept of a control message from node-red
		uibuilder.onChange('ctrlMsg', function(msg) {
		    console.log(msg)
		})
	},
	
}) // --- End of the Vue app definition --- //

// EOF