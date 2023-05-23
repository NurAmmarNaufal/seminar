#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

const char* ssid = "";
const char* password = "";

const char* server = "https://seminar-eight.vercel.app/httpreq";
// const char* server = "https://seminar-eight.vercel.app/mongo/create";


int inputTemp = 0;
int inputKelembapanTanah = 0;

HTTPClient https;

void setup() {
  Serial.begin(115200);

  pinMode(33, INPUT_PULLUP);  

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi!");
}

void loop() {
  serial();
  // readSensor();

  if (digitalRead(33) == LOW) {
    if (WiFi.isConnected()) {
      sendData();
    }
    delay(200);
  }
}

// HTTPS request
void sendData() {
  https.begin(server);
  https.addHeader("Content-Type", "application/json");
  // prepare JSON payload
  const size_t capacity = JSON_OBJECT_SIZE(2);
  DynamicJsonDocument doc(capacity);
  doc["temp"] = inputTemp;
  doc["tanah"] = inputKelembapanTanah;
  String jsonPayload;
  serializeJson(doc, jsonPayload);

  // send POST request with JSON payload
  Serial.println("kirim data -> " + jsonPayload);
  int httpResponseCode = https.POST(jsonPayload);

  if (httpResponseCode > 0) {
    String response = https.getString();
    Serial.println("HTTP Response code: " + String(httpResponseCode));
    Serial.println("HTTP Response body: " + response);

    // parse JSON response
    DynamicJsonDocument jsonDoc(1024);
    DeserializationError error = deserializeJson(jsonDoc, response);

    if (error) {
      Serial.println("Failed to parse JSON response!");
    } else {
      String responds = jsonDoc["data"].as<String>();
      String kipas = jsonDoc["data"]["kipas"]["value"].as<String>();
      String pompa = jsonDoc["data"]["pompa"]["value"].as<String>();
      Serial.println("kipas: " + kipas);
      Serial.println("pompa: " + pompa);
    }
  } else {
    Serial.println("Error: " + https.errorToString(httpResponseCode));
    sendData();
  }

  // https.end();
}

void serial() {
  if (Serial.available() > 0) {
    String data = Serial.readString();
    data.trim();
    Serial.println(data);

    if (data.equals("send")) {
      if (WiFi.isConnected()) {
        sendData();
      }
    } else if (data.startsWith("temp")) {
      data.replace("temp", "");
      inputTemp = data.toInt();
      Serial.println(inputTemp);
    } else if (data.startsWith("tanah")) {
      data.replace("tanah", "");
      inputKelembapanTanah = data.toInt();
      Serial.println(inputKelembapanTanah);
    }
  }
}

void readSensor() {
  //coding untuk baca sensor
}
