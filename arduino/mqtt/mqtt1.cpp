#include <WiFi.h>
#include <PubSubClient.h>

const char *ssid = "";
const char *password = "";

const char *topic = "esp32/seminarmqtt/rgb"; //subscribe
const char *topicSensor = "esp32/seminarmqtt/sensor"; //publish
const char *mqtt_server = "mqtt-dashboard.com";
boolean retain = true;

WiFiClient espClient;
PubSubClient client(espClient);

unsigned long previousMillis = 0;
const unsigned long interval = 5000;

int sendorData = 0;

const int ledRed = 2;
const int ledGreen = 15;
const int ledBlue = 4;

void setup() {
  Serial.begin(115200);

  pinMode(ledRed, OUTPUT);
  pinMode(ledGreen, OUTPUT);
  pinMode(ledBlue, OUTPUT);


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
  unsigned long currentMillis = millis();

  if (currentMillis - previousMillis >= interval) {
    readSensor();
    client.publish(topicSensor, String(sendorData).c_str(), retain);
    previousMillis = currentMillis; 
  }

  if (!client.connected()) {
    connectMqtt();
  }
  client.loop();
}

void connectMqtt() {
  while (!client.connected()) {
    Serial.print("❓");
    if (client.connect("ESP32Client")) {
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

  if (x.equals("lr-on")) {
    digitalWrite(ledRed, HIGH);
  } else if (x.equals("lr-off")) {
    digitalWrite(ledRed, LOW);
  }

  if (x.equals("lg-on")) {
    digitalWrite(ledGreen, HIGH);
  } else if (x.equals("lg-off")) {
    digitalWrite(ledGreen, LOW);
  }

  if (x.equals("lb-on")) {
    digitalWrite(ledBlue, HIGH);
  } else if (x.equals("lb-off")) {
    digitalWrite(ledBlue, LOW);
  }
  Serial.println();
  Serial.println("--------");
}

void readSensor() {
  sendorData = random(20, 36);
  Serial.println(sendorData);
}
