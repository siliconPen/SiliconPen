---
title: "Using Potentiometers & Mapping Values"
subtitle: "Transforming Raw Analog Values into Useful Ranges for Real-World Control"
description: "Learn how to use potentiometers with Arduino and convert raw analogRead() values into useful ranges. This chapter explains voltage division, reading 0–1023 values, and mapping them to angles, brightness, speed, or any custom scale."
date: "2026-01-17"
cover: "/images/pathway-to-arduino/cover.webp"
series: "pathway-to-arduino"
order: 9
tags:
  - "electronics"
  - "arduino"
  - "analog"
  - "inputs"
  - "signals"
  - "explainer"
draft: false
---

<h1>Chapter 9</h1>
<p>In the previous chapter, you learned how Arduino reads analog values using <code>analogRead()</code>.</p>
<p>You saw numbers between <strong>0 and 1023</strong> scrolling in the Serial Monitor.</p>
<sp-q><h3>But here’s the real question:</h3>
<p>What do we do with those numbers?</p></sp-q>
<p>Because raw numbers by themselves don’t mean much.</p>
<p>This chapter is about <strong>turning readings into control</strong>.</p>
<hr class="section-divider"/>

<h1>🔘 What Is a Potentiometer (Really)?</h1>
<blockquote><br />A potentiometer is not just a “knob”.
<br /><h3>Electrically, it is a <strong>variable voltage divider</strong>.<h3></blockquote>
<img src="/images/pathway-to-arduino/using-potentiometers-and-mapping-values/1.jpeg" alt="" />
  <h3>It has three pins:</h3>
<ul>
<li><p>one connected to 5V</p>
</li>
<li><p>one connected to GND</p>
</li>
<li><p>the middle pin outputs a variable voltage</p>
</li>
</ul>
<h3>As you turn the knob:</h3>
<ul>
<li><p>the voltage at the middle pin changes</p>
</li>
<li><p>Arduino reads that voltage using <code>analogRead()</code></p>
</li>
</ul>
<h2>🔌 Wiring the Potentiometer</h2>
<h3>Connect it like this:</h3>
<ul>
<li>One side pin  → 5V</li>
<li>Other side   → GND</li>
<li>Middle pin  → A0</li>
</ul>
<p>That’s it.<br />No extra components required.</p>
<p>I have an full tutorial on <a href="/posts/potentiometer.html">potentiometer</a>, check it out to know more!</p>
<hr class="section-divider"/>

<h1>💻 Reading the Potentiometer</h1>
<p>We have done this in our <a href="analog-input-reading-sensors-with-analogread.html#hardware-time-reading-a-potentiometer">previous chapter.</a></p>
<img src="/images/pathway-to-arduino/using-potentiometers-and-mapping-values/2.png" alt="" />
<pre><code>void setup() {
  Serial.begin(9600);
}

void loop() {
  int potValue = analogRead(A0);
  Serial.println(potValue);
  delay(200);
}
</code></pre>

<p>Now turn the knob.</p>
<p>You should see values smoothly changing between:</p>
<ul>
<li>0 (near GND)</li>
<li>1023 (near 5V)</li>
</ul>
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
<sp-video
  src="https://www.youtube.com/embed/GH0lQ8gcdgc"
  title="Live demo: Arduino and Potentiometer"
  caption="Live demo of Arduino and Potentiometer.">
</sp-video>
<br />
<hr class="section-divider"/>

<h1>🧠 What You Should Notice</h1>
<ul>
<li><p>The change is continuous</p>
</li>
<li><p>Small turns → small changes</p>
</li>
<li><p>Fast turns → fast changes</p>
</li>
</ul>
<sp-answer>This is analog control in its pure form.</sp-answer>
<hr class="section-divider"/>

<h1>🔄 Why Mapping Is Needed</h1>
<h2>The problem:</h2>
<ul>
<li><code>analogRead()</code> → 0 to 1023</li>
</ul>
<h3>But real-world outputs often need:</h3>
<ul>
<li><p>0 to 255 (PWM)</p>
</li>
<li><p>0 to 180 (servo angle)</p>
</li>
<li><p>specific ranges</p>
</li>
</ul>
<p>So we need a way to <strong>convert one range into another</strong>.</p>
<p>That’s where <code>map()</code> comes in.</p>
<hr class="section-divider"/>

<h1>🔢 The <code>map()</code> Function</h1>
<h2>Arduino provides a helper function:</h2>
<p><code>map(value, fromLow, fromHigh, toLow, toHigh)</code></p>
<h3>Example:</h3>
<p><code>int mappedValue = map(potValue, 0, 1023, 0, 255);</code></p>
<p>Now turning the potentiometer controls values between 0 and 255!</p>
<hr class="section-divider"/>

<h1>🧪 Hardware Time: Potentiometer → Serial Output</h1>
<p>Same circuit, change the code to this!</p>
<pre><code>void setup() {
  Serial.begin(9600);
}

void loop() {
  int potValue = analogRead(A0);
  int mappedValue = map(potValue, 0, 1023, 0, 255);

  Serial.print("Raw: ");
  Serial.print(potValue);
  Serial.print("  Mapped: ");
  Serial.println(mappedValue);

  delay(200);
}
</code></pre>

<p>This shows you both:</p>
<ul>
<li><p>what Arduino reads</p>
</li>
<li><p>what Arduino uses</p>
</li>
</ul>
<p>Now you can see how the original value is efficiently mapped into our specified range.</p>
<hr class="section-divider"/>
<h1>🎯Let's Recall!!</h1>
<sp-quiz title="Arduino Basics">
  <sp-q>
    <q>What happens if a digital input pin is left floating?</q>
    <o correct>It can randomly read HIGH or LOW</o>
    <o>It always reads LOW</o>
    <o>It becomes OUTPUT</o>
  </sp-q>

  <sp-q>
    <q>Why do we use pull-up resistors?</q>
    <o>To increase current</o>
    <o correct>To prevent floating inputs</o>
    <o>To protect the microcontroller</o>
  </sp-q>

  <sp-q>
    <q>Which function is used to read analog inputs?</q>
    <o>serial.Print</o>
    <o correct>analogRead</o>
    <o>analogReader</o>
  </sp-q>
  </sp-quiz>

  <sp-reveal title="Quiz Answers!">
  1. It can randomly read HIGH or LOW<br />
  2. To prevent floating inputs<br />
  3. analogRead

  <p>Check these if you got them wrong: </p>
  <ul>
  <li><a href="using-digital-inputs-in-arduino.html#the-floating-pin-problem">Floating Pin Concepts</a></li>
  <li><a href="/posts/analog-input-reading-sensors-with-analogread.html">Analog Inputs</a></li>
  </ul>
  </sp-reveal>
<hr class="section-divider"/>

<h1>⚠️ Important Notes About <code>map()</code></h1>
<ul>
<li><p><code>map()</code> does not limit values automatically</p>
</li>
<li><p>If inputs exceed range, outputs can too</p>
</li>
<li><p>It works only with integers</p>
</li>
</ul>
<hr class="section-divider"/>

<h1>🧰 Common Beginner Mistakes</h1>
<ul>
<li><p>Forgetting to connect GND</p>
</li>
<li><p>Wiring the middle pin incorrectly</p>
</li>
<li><p>Expecting perfect stability (analog is noisy)</p>
</li>
<li><p>Thinking <code>map()</code> changes voltage (it doesn’t)</p>
</li>
</ul>
<p><code>map()</code> changes numbers, not signals.</p>
<hr class="section-divider"/>

<h1>📌 What Comes Next</h1>
<p>Now that we can:</p>
<ul>
<li><p>read analog values</p>
</li>
<li><p>convert them into useful ranges</p>
</li>
</ul>
<p>The next step is to use them to control something visible.</p>
<h3>👉 Next Chapter — Understanding PWM &amp; LED Fading</h3>
<p>This is where analog input meets digital output.</p>