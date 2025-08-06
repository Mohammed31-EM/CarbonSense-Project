require('dotenv').config()
const mqtt = require('mqtt');
const Reading = require('../models/reading')

// Use environment variables for credentials for security
const MQTT_BROKER = process.env.MQTT_BROKER || '5017366e502b4a20a0d696a96d97570b.s1.eu.hivemq.cloud';
const MQTT_PORT = process.env.MQTT_PORT || 8883;
const MQTT_USERNAME = process.env.MQTT_USERNAME ;
const MQTT_PASSWORD = process.env.MQTT_PASSWORD ;

// Construct URL for TLS
const brokerUrl = `mqtts://${MQTT_BROKER}:${MQTT_PORT}`;

const options = {
  username: MQTT_USERNAME,
  password: MQTT_PASSWORD,
  // Optional: keepalive, clientId, clean, etc.
};


const client = mqtt.connect(brokerUrl, options);

client.on('connect', () => {
  console.log('🟢 Connected to HiveMQ Cloud!');
  // Subscribe to a topic for new readings
  client.subscribe('plant1/temperature', (err) => {
    if (err) {
      console.error('❌ Failed to subscribe to readings topic:', err.message);
    } else {
      console.log('✅ Subscribed to topic: plant1/temperature');
    }
  });
});

client.on('message', async (topic, message) => {
  if (topic === 'plant1/temperature') {
    // Handle new reading message (JSON)
    try {
      const reading = JSON.parse(message.toString());
      console.log('📥 New Reading Received via MQTT:', reading);
      
      await Reading.create({
        equipmentId: reading.equipmentId,
        parameter: reading.parameter,
        value: reading.value,
        timestamp: reading.timestamp ? new Date(reading.timestamp * 1000) : new Date(),

      })
      
    } catch (err) {
      console.error('❌ Failed to parse MQTT reading:', err.message);
    }
  }
});

client.on('error', (err) => {
  console.error('❌ MQTT Connection Error:', err.message);
});

/**
 * Publish a new reading event to MQTT
 * @param {Object} reading - The reading object to publish
 */
function publishReading(reading) {
  if (!client.connected) {
    console.warn('MQTT client not connected, cannot publish reading');
    return;
  }
  client.publish('plant1/temperature', JSON.stringify(reading), { qos: 1 }, (err) => {
    if (err) {
      console.error('❌ Failed to publish reading:', err.message);
    } else {
      console.log('🚀 Published new reading to MQTT:', reading);
    }
  });
}

/**
 * Publish a plant event to MQTT
 * @param {Object} plant - The plant object
 * @param {String} action - Action type (created, updated, deleted)
 */
function publishPlant(plant, action) {
  if (!client.connected) {
    console.warn('MQTT client not connected, cannot publish plant');
    return;
  }
  const payload = { action, plant };
  client.publish('carbonsense/plants/event', JSON.stringify(payload), { qos: 1 }, (err) => {
    if (err) {
      console.error('❌ Failed to publish plant event:', err.message);
    } else {
      console.log(`🚀 Published plant ${action} event to MQTT:`, plant);
    }
  });
}

/**
 * Publish an equipment event to MQTT
 * @param {Object} equipment - The equipment object
 * @param {String} action - Action type (created, updated, deleted)
 */
function publishEquipment(equipment, action) {
  if (!client.connected) {
    console.warn('MQTT client not connected, cannot publish equipment');
    return;
  }
  const payload = { action, equipment };
  client.publish('carbonsense/equipment/event', JSON.stringify(payload), { qos: 1 }, (err) => {
    if (err) {
      console.error('❌ Failed to publish equipment event:', err.message);
    } else {
      console.log(`🚀 Published equipment ${action} event to MQTT:`, equipment);
    }
  });
}

module.exports = { client, publishReading, publishPlant, publishEquipment };