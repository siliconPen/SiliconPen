---
title: "Analog Input: Reading Sensors with analogRead()"
subtitle: "How Arduino Measures the Real World Through Voltage Levels and Sensors"
description: "Learn how Arduino reads real-world signals using analogRead(). This chapter explains analog inputs, voltage levels, and how sensors provide continuous values instead of simple HIGH/LOW signals. Perfect for beginners exploring sensors and data."
date: "2026-01-13"
cover: "/images/pathway-to-arduino/cover.webp"
series: "pathway-to-arduino"
order: 8
tags:
  - "electronics"
  - "arduino"
  - "analog"
  - "inputs"
  - "signals"
  - "explainer"
draft: false
---

<h1>Chapter 8</h1>
<p>Until now, Arduino has lived in a <strong>binary world</strong>.</p>
<ul>
<li><p>HIGH or LOW</p>
</li>
<li><p>ON or OFF</p>
</li>
<li><p>Pressed or Released</p>
</li>
</ul>
<p>But the real world is not binary.</p>
<p>Light intensity, temperature, distance, pressure — these things change gradually.<br />To sense them, Arduino needs to move beyond digital logic.</p>
<p>That’s where <strong>analog input</strong> comes in.</p>
<hr class="section-divider"/>

<h1>🌊 What Is an Analog Signal?</h1>
<p>An <strong>analog signal</strong> is a signal that can take <strong>many values</strong>, not just two.</p>
<p>Examples:</p>
<ul>
<li><p>brightness of light</p>
</li>
<li><p>temperature of a room</p>
</li>
<li><p>position of a knob</p>
</li>
<li><p>sound amplitude</p>
</li>
</ul>
<p>Instead of asking:</p>
<p><sp-line>“Is this HIGH or LOW?”</sp-line></p>
<p>Arduino now asks:</p>
<p><sp-rule>“How much voltage is here?”</sp-rule></p>
<hr class="section-divider"/>

<h1>🔌 Analog Pins on Arduino</h1>
<p>On the Arduino Uno, analog input pins are labeled:</p>
<blockquote>A0, A1, A2, A3, A4, A5</blockquote>
<img src="/images/pathway-to-arduino/analog-input-reading-sensors-with-analogread/1.png" alt="" />

<p>These pins are connected to an internal circuit called the <strong>ADC</strong><br />(<em>Analog-to-Digital Converter</em>).</p>
<hr class="section-divider"/>

<h1>🧠 What the ADC Actually Does</h1>
<h3>The ADC:</h3>
<ul>
<li><p>measures the voltage on an analog pin</p>
</li>
<li><p>converts it into a number Arduino can understand</p>
</li>
</ul>
<h3>On Arduino Uno:</h3>
<ul>
<li><p>input range: 0V to 5V</p>
</li>
<li><p>resolution: 10-bit</p>
</li>
</ul>
<h3>That means:</h3>
<sp-block>
0V   → 0<br />
5V   → 1023
</sp-block>

<p>Every voltage in between maps to a value <em>between</em> <strong>0 and 1023</strong>.</p>
<hr class="section-divider"/>

<h1>🔢 <code>analogRead()</code> Basics</h1>
<p>To read an analog value we use:</p>
<p><code>int sensorValue = analogRead(A0);</code></p>
<p>This returns a number between <strong>0 and 1023</strong>,<br />depending on the voltage present at pin A0.<br />Similarly, we can obtain inputs from other analog pins!</p>
<hr class="section-divider"/>

<h1>🧪 Hardware Time: Reading a Potentiometer</h1>
<h3>Components Required:</h3>
<ul>
<li>Breadboard</li>
<li>Male to Female Jumper Wires</li>
<li>Arduino UNO</li>
<li>10k Potentiometer</li>
</ul>
<p>A potentiometer is the easiest analog sensor to understand.</p>
<p>It is a <em><strong>variable voltage divider</strong></em>.<br />Check this article to learn more about <a href="/posts/potentiometer.html">potentiometer</a>.</p>
<h3>Now,</h3>
<img src="/images/pathway-to-arduino/analog-input-reading-sensors-with-analogread/2.png" alt="" />
<p>Connect the three pins of the potentiometer in the given way!</p>
<blockquote><br />
One end → 5V<br />  
Other end → GND<br />  
Middle pin → A0
</blockquote>
<img src="/images/pathway-to-arduino/analog-input-reading-sensors-with-analogread/3.jpeg" alt="" />
<p>Once done, upload the code given below to Arduino.</p>
<h3>Code:</h3>
<pre><code>
void setup() {
  Serial.begin(9600);
}

void loop() {
  int value = analogRead(A0);
  Serial.println(value);
  delay(200);
}
</code></pre>

<p>Paste and hit <strong>Upload!</strong><br />Open the serial monitor on the top right corner.</p>
<p>Turn the knob and watch the numbers change.</p>
<sp-video
  src="https://www.youtube.com/embed/GH0lQ8gcdgc"
  title="Live demo: Arduino and Potentiometer"
  caption="Live demo of Arduino and Potentiometer.">
</sp-video>
<p><sp-answer>This is analog input in its purest form.</sp-answer></p>
<br />
<sp-lab
  title="Arduino Potentiometer Input"
  subtitle="Interactive simulation built in Tinkercad"
  link="https://www.tinkercad.com/things/28BDNczwmpV-reading-potentiometer-using-arduino"
  button="Open Simulation in Tinkercad"
  image="/images/pathway-to-arduino/analog-input-reading-sensors-with-analogread/2.png"
>
  Try rotating the potentiometer and observe how the analog value
  changes in the Serial Monitor.
</sp-lab>
<br />
<h3>Why didn&#39;t we use <code>pinMode()</code> here?</h3>
<p><sp-q>You might be wondering why we didn’t explicitly set pin <strong>A0</strong> as INPUT using <code>pinMode()</code>.</sp-q></p>
<p>That’s because analog pins are <strong>input-only by default</strong>.<br />When you use <code>analogRead()</code>, Arduino automatically routes that pin to the internal <strong>ADC (Analog-to-Digital Converter)</strong>.</p>
<p>In simple terms:</p>
<ul>
<li>digital pins need direction to be specified</li>
<li>analog pins are already meant for reading voltages</li>
</ul>
<p><sp-answer>So no extra configuration is required here.</sp-answer></p>

<hr class="section-divider"/>

<h1>🧠 What You Should Notice</h1>
<ul>
<li><p>The values change smoothly</p>
</li>
<li><p>Small turns → small number changes</p>
</li>
<li><p>Big turns → big number changes</p>
</li>
</ul>
<p>This is fundamentally different from digital input.</p>
<hr class="section-divider"/>

<h1>⚠️ Important Things to Remember</h1>
<ul>
<li><p>Analog pins do not output voltage (by default)</p>
</li>
<li><p>They only measure voltage</p>
</li>
<li><p>Input voltage must stay between 0–5V</p>
</li>
<li><p><sp-warning>Exceeding this can damage the ADC</sp-warning></p>
</li>
</ul>
<p>This why we require a <strong>voltage divider!!</strong></p>
<hr class="section-divider"/>

<h1>🧰 Common Beginner Mistakes</h1>
<ul>
<li><p>Connecting sensors directly without a voltage divider</p>
</li>
<li><p>Expecting analog pins to “output analog voltage”</p>
</li>
<li><p>Forgetting to connect GND</p>
</li>
<li><p>Confusing analogRead() with PWM</p>
</li>
</ul>
<p>These are normal mistakes. You’re learning how the real world behaves.</p>
<p><sp-fact>Many sensors that you will use will use the ADC logic!</sp-fact></p>
<hr class="section-divider"/>

<h1>📌 What Comes Next</h1>
<p>Now that we can read levels, the next step is to use those levels meaningfully.</p>
<h3>👉 Next Chapter — Using Potentiometers &amp; Mapping Values</h3>
<p>This is where raw numbers become control.<br />Next Post Coming Soon!!</p>