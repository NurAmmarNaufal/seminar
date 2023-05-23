#include <WiFi.h>
#include <PubSubClient.h>

const char *ssid = "";
const char *password = "";

const char *topic = "esp32/seminarmqtt/sensor";     //subscribe
const char *topicSensor = "esp32/seminarmqtt/rgb";  //publish
const char *mqtt_server = "mqtt-dashboard.com";
boolean retain = true;

WiFiClient espClient;
PubSubClient client(espClient);

String message = "";
String newMessage = "";

void setup() {
  Serial.begin(115200);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi!");

  client.setServer(mqtt_server, 1883);
  client.setCallback(callback);

  connectMqtt();
}

void loop() {
  serial();

  if (!client.connected()) {
    connectMqtt();
  }
  client.loop();
}

void serial() {
  if (Serial.available() > 0) {
    newMessage = Serial.readString();
    newMessage.trim();
    Serial.println(newMessage);
  }
}

void connectMqtt() {
  while (!client.connected()) {
    Serial.print("❓");
    if (client.connect("ESP32Client")) {

      if (!message.equals(newMessage)) {
        client.publish(topicSensor, newMessage.c_str(), true);
        message = newMessage;
      }
      client.subscribe(topic);
      Serial.println("✔️");
    } else {
      Serial.print("❌");
      Serial.println(client.state());
      delay(1000);
    }
  }
}

void callback(char *topic, byte *payload, unsigned int length) {
  Serial.print("Message arrived in topic: ");
  Serial.println(topic);
  Serial.print("Message:");
  String x = "";
  for (int i = 0; i < length; i++) {
    x += (char)payload[i];
  }
  x.trim();
  Serial.print(x);

  Serial.println();
  Serial.println("--------");
}
