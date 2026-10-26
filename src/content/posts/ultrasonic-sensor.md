---
title: "Ultrasonic Sensor (HC-SR04)"
subtitle: "How Arduino Uses Sound Waves and Timing to Measure Real-World Distance"
description: "Learn how the HC-SR04 ultrasonic sensor works and how Arduino measures distance using sound waves. This chapter explains trigger/echo timing, real-world behavior, and why timing is crucial in embedded systems. Perfect for beginners."
date: "2026-01-01"
cover: "/images/pathway-to-arduino/cover.webp"
series: "pathway-to-arduino"
draft: true
---

<h1>Chapter 16</h1>
<p>So far, Arduino has been reacting to <strong>buttons and knobs.</strong><br />Now we’ll make it <strong>measure distance.</strong></p>
<p>The ultrasonic sensor is perfect for this because:</p>
<ul>
<li><p>it’s visual</p>
</li>
<li><p>it’s intuitive</p>
</li>
<li><p>it teaches timing, not just voltage</p>
</li>
</ul>
<p>And timing is a big deal in embedded systems.</p>
<hr class="section-divider"/>

<h1>📡 What Is an Ultrasonic Sensor?</h1>
<p>An ultrasonic sensor measures distance using <strong>sound.</strong></p>
<p>Not audible sound —<br /><strong>ultrasonic waves</strong> (around 40 kHz).</p>
<p>The idea is simple:</p>
<ul>
<li><p>Send out a sound pulse</p>
</li>
<li><p>Wait for it to bounce back</p>
</li>
<li><p>Measure how long it took</p>
</li>
<li><p>Convert time → distance</p>
</li>
</ul>
<p>This is called <strong>time-of-flight measurement.</strong></p>
<hr class="section-divider"/>

<h1>🧠 HC-SR04 Pin Overview</h1>
<p>The HC-SR04 has <strong>4 pins:</strong></p>
<ul>
<li><p>VCC → 5V</p>
</li>
<li><p>Trig → Trigger pin (input from Arduino)</p>
</li>
<li><p>Echo → Echo pin (output to Arduino)</p>
</li>
<li><p>GND → Ground</p>
</li>
</ul>
<p>Two pins control everything:</p>
<ul>
<li><p>one starts the measurement</p>
</li>
<li><p>one reports the result</p>
</li>
</ul>
<hr class="section-divider"/>

<h1>🔌 Wiring the Sensor</h1>
<p>Connect the sensor like this:</p>
<blockquote><br />
HC-SR04 VCC  → Arduino 5V<br />
HC-SR04 GND  → Arduino GND<br />
HC-SR04 Trig → Arduino Pin 9<br />
HC-SR04 Echo → Arduino Pin 10
</blockquote>

<p>You can use any digital pins, but we’ll stick with these for consistency.</p>
<hr class="section-divider"/>

<h1>⚙️ How Measurement Actually Works</h1>
<p>Here’s what happens internally:</p>
<ul>
<li><p>Arduino sends a <strong>10 µs HIGH pulse</strong> on the Trig pin</p>
</li>
<li><p>Sensor emits <strong>8 ultrasonic bursts</strong></p>
</li>
<li><p>Sound hits an object and reflects back</p>
</li>
<li><p>Echo pin goes HIGH for the duration of the <strong>round trip</strong></p>
</li>
<li><p>Arduino measures this time</p>
</li>
</ul>
<p>Distance depends on how <strong>long Echo stays HIGH.</strong></p>
<hr class="section-divider"/>

<h1>⏱️ Measuring Time with <code>pulseIn()</code></h1>
<p>Arduino provides a helper function:</p>
<p><code>pulseIn(pin, HIGH);</code></p>
<p>It measures how long a pin stays HIGH (in microseconds).</p>
<p>We’ll use this to capture the echo time.</p>
<hr class="section-divider"/>

<h1>💻 Basic Distance Measurement Code</h1>
<pre><code>const int trigPin = 9;
const int echoPin = 10;

void setup() {
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  Serial.begin(9600);
}

void loop() {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);

  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  long duration = pulseIn(echoPin, HIGH);

  float distance = duration * 0.034 / 2;

  Serial.print("Distance: ");
  Serial.print(distance);
  Serial.println(" cm");

  delay(500);
}
</code></pre>
<hr class="section-divider"/>

<h1>🧮 Where That Formula Comes From</h1>
<p>Speed of sound in air ≈ 343 m/s</p>
<p>Convert to cm/µs:</p>
<pre>0.034 cm per microsecond</pre>


<p>We divide by 2 because:</p>
<ul>
<li><p>sound travels to the object</p>
</li>
<li><p>and back again</p>
</li>
</ul>
<hr class="section-divider"/>

<h1>🧠 What You Should Observe</h1>
<ul>
<li><p>Distance updates smoothly</p>
</li>
<li><p>Close objects → smaller values</p>
</li>
<li><p>Far objects → larger values</p>
</li>
<li><p>No object → very large or unstable readings</p>
</li>
</ul>
<p>This sensor depends heavily on environment.</p>
<hr class="section-divider"/>

<h1>⚠️ Common Problems &amp; Fixes</h1>
<ul>
<li><p>Always reading 0 → Echo pin miswired</p>
</li>
<li><p>Huge random values → no object in range</p>
</li>
<li><p>Unstable readings → angled surfaces or soft materials</p>
</li>
<li><p>Wrong distance → sensor too close (&lt;2 cm)</p>
</li>
</ul>
<p>Ultrasonic sensors don’t see everything equally.</p>
<hr class="section-divider"/>

<h1>📌 What Comes Next</h1>
<p>Ultrasonic sensors are great, but they have limits.</p>
<p>Next, we look at a simpler, faster sensor that works differently:</p>
<h3>👉 Next Chapter — IR Sensor Basics</h3>