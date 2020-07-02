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
		telegrams: new Set(),
		telegram: '',
		url: 'http://127.0.0.1:1880/',
		discord_url: 'https://discord-alerts.herokuapp.com/get_ids',
		telegram_rul: '',
		password: '',
		
		//sensor list:
		name_dev: '',
		address: '',
		type: 1,
		min_value: '',
		max_value: '',
		interval_value: '',
		current_interval_value: '',
		unit_value: '',
		current_unit_value: '',
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
	
	component: [
	     
	],  
	
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
	    
	    addTelegram: function(){
	        let telegram = this.telegram.trim()
	        
	        let url = `${this.url}add_telegram_name/` + this.password + '/'
	        
	        let body = {
	            'name': telegram,
	            'id': '',
	        }
	        
	        if((this.validateTelegram(telegram) || this.validateTelegramId(telegram)) && confirm(`Add ${telegram} to whitelist?`) && !this.telegrams.has(telegram)){
	            
	            fetch(url, {
	                method: 'POST',
	                mode: 'cors', // no-cors, *cors, same-origin
                    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                    credentials: 'same-origin', // include, *same-origin, omit
                    headers: {
                      'Content-Type': 'application/json',
                      'Access-Control-Allow-Origin': '*',
                    },
                    body: JSON.stringify(body),
                    redirect: 'follow', // manual, *follow, error
                    referrerPolicy: 'no-referrer'
	            }).then(response => {
	                console.log(response)
	                if (response.ok){
	                    this.telegrams.add(telegram)
	                    this.telegram = ''
	                }
	                else {
	                    alert('Something went wrong...')
	                    return
	                }
	            })
	            
	        } else {
	          alert('Invalid telegram name or name is already in whitelist')  
	        }
	    },
	    
	    addDiscord: function(){
	        let discord = this.discord.trim()
	        
	        let url = `${this.url}add_discord_name/` + this.password + '/'
	        
	        let body = {
	            'name': discord,
	            'id': '',
	        }
	        
	        if((this.validateDiscord(discord) || this.validateDiscordId) && confirm(`Add ${discord} to whitelist?`) && !this.discords.has(discord)){
	            
	            fetch(url, {
	                method: 'POST',
	                mode: 'cors', // no-cors, *cors, same-origin
                    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                    // credentials: 'same-origin', // include, *same-origin, omit
                    headers: {
                      'Content-Type': 'application/json',
                      'Access-Control-Allow-Origin': '*',
                      // 'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: JSON.stringify(body),
                    redirect: 'follow', // manual, *follow, error
                    referrerPolicy: 'no-referrer'
	            }).then(response => {
	                console.log(response)
	                if (response.ok){
	                    this.discords.add(discord)
	                    this.discord = ''
	                }
	                else {
	                    alert('Something went wrong...')
	                    return
	                }
	            })
	            
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
                
                if (type === 'telegarm'){
                    this.telegrams.delete(value)
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
	    
	   // values validation 
	    
	    validateTelegram: function(telegram){
	        if(/\@\S{3,}/.test(telegram)){
	            return (true)
	        }
	        return (false)
	    },
	    
	    validateEmail: function(email){
	        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.toLowerCase())){
                return (true)
            }
            return (false)
	    },
	    
	    validateDiscord: function(discord){
	        if(/[\S]+#\d{4}\b/.test(discord.trim())){
	            return (true)
	        }
	        return (false)
	    },
	    
	    validateDiscordId: function(discord){
	        if(/\d+\b/.test(discord.trim())){
	            return (true)
	        }
	        return (false)
	    },
	    
	    validateTelegramId: function(telegram){
	        if(/\d+/.test(telegram.trim())){
	            return (true)
	        }
	        return (false)
	    },
	    
	   // Setting intervals for sensors and Aveva:
	    
	    setInterval: function(){
	       
	        let updated = false
	        let button = event.target
	        let input1 = button.parentNode.children[1]
	        let input2 = button.parentNode.children[2]
	        let sensor = button.parentNode.getAttribute("class").split(' ').slice(-1)[0]
	        let sensorId = sensor.split('_')[1]
	        let intervalKey = 'interval_value_' + sensorId
	        let unitKey = 'interval_unit_' + sensorId
	        let intervalUrl = this.url + 'update_save_var' + this.password + '/' + intervalKey + '/' + this[intervalKey]
	        let unitUrl = this.url + 'update_save_var/' + this.password + '/' + unitKey + '/' + this[unitKey]
	        
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
        	                if (Number(response.status) === 200){
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
	    
	   // Sensors manipulations:
	    
	    removeSensor: function(){
	        let url = this.url + 'delete_sensor_list/' + this.password + '/'
	        let sys_url = this.url  + 'delete_system_var/' + this.password + '/'
	        let removeButton = event.target
	        let name = removeButton.parentNode.childNodes[0].innerHTML.toString()
	        let sys_name_1 = name + '_min'
	        let sys_name_2 = name + '_max'
	        
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
	            
	            fetch((sys_url + sys_name_1), params)
	                .then(response => {console.log(response)})
                fetch((sys_url + sys_name_2), params)
	                .then(response => {console.log(response)})
	        }
	        
	    },
	    
	    validateSensorValues: function(name, address){
	        if(name.lenght != 0 && address != 0){
	            return (true)
	        }
	        return (false)
	            
	    },
	    
	    addSensor: function(){
	        let vueApp = this
	        
	        let url = this.url + 'insert_sensor_list/' + this.password + '/'
	        let min_values_url = `${this.url}update_save_var/${this.password}/${this.name_dev}_min/${this.min_value}`
	        let max_values_url = `${this.url}update_save_var/${this.password}/${this.name_dev}_max/${this.max_value}`
	        
	        console.log(min_values_url)
	        
	        console.log(max_values_url)
	        
	        let data = `('${this.name_dev}', '${this.address}', '${Number(this.type)}')`
	        
	        let params = {
	            method: 'GET',
	            headers: {
	                'Content-Type': 'application/json'
	            },
	        }
	        
	        if (this.validateSensorValues(this.name_dev, this.address)){
	            if (confirm(`Add ${this.name_dev} to sensor_list?`)){
    	            fetch((url + data), params)
    	            .then(response => {console.log(response)
    	                if (response.ok){
    	                    vueApp.sensors.push({
                	            name_dev: vueApp.name_dev,
                	            address: vueApp.address,
                	            type: vueApp.type,
                	            min_value: vueApp.min_value,
                	            max_value: vueApp.max_value,
                	        })
                	        
                	        vueApp.name_dev = ''
                	        vueApp.address = ''
                	        vueApp.type = 0
            	        }
    	            })
    	            
    	            fetch(min_values_url, params).then(response => {
	                    console.log(response)
	                    if (response.ok){
	                        vueApp.min_value = ''
	                    }
	                    fetch(max_values_url, params).then(response => {
    	                    console.log(response)
    	                    if (response.ok){
    	                        vueApp.max_value = ''
    	                    }
    	                })
	                })
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
			if (msg.payload.telegrams){
			    vueApp.telegrams = new Set(msg.payload.telegrams)
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
			if (msg.payload.password){
			    vueApp.password = msg.payload.password
			}
			if (msg.payload.sensors){
			    vueApp.sensors = msg.payload.sensors
			    vueApp.sensors.forEach(sensor =>{
			        sensor.min_value = vueApp.system_vars[sensor.name_dev + '_min']
			        sensor.max_value = vueApp.system_vars[sensor.name_dev + '_max']
			    })
			}
			if (msg.system_vars){
			    vueApp.system_vars = msg.system_vars
			    
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