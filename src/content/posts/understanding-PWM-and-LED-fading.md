---
title: "Understanding PWM & LED Fading"
subtitle: "How Arduino Fakes Analog Output Using High-Speed Digital Switching"
description: "If Arduino can only output HIGH or LOW, how does it control brightness or motor speed? This chapter explains Pulse Width Modulation (PWM) in simple terms—how it fakes analog output and lets you fade LEDs or control power smoothly."
date: "2026-07-13"
cover: "/images/pathway-to-arduino/cover.webp"
series: "pathway-to-arduino"
order: 10
tags:
  - "electronics"
  - "arduino"
  - "analog"
  - "inputs"
  - "signals"
  - "explainer"
  - "PWM"
draft: false
---

<h1>Chapter 10</h1>
<p>In the previous chapter, you used a potentiometer to generate smooth values between 0 and 1023, and then mapped them into useful ranges.</p>
<sp-q><p>Now comes a natural question:</p>
<p>If Arduino outputs only HIGH or LOW, how does it control brightness or speed?</p></sp-q>
<p>This chapter answers that with <strong>PWM</strong></p>
<hr class="section-divider"/>

<h1>💡 The Problem PWM Solves</h1>
<p>Digital output pins can only do this:</p>
<ul>
<li><p>HIGH → 5V</p>
</li>
<li><p>LOW → 0V</p>
</li>
</ul>
<p>But LEDs don’t just need ON or OFF.<br />They can be <strong>dim, bright,</strong> or anything in between.</p>
<p>So how do we fake an “analog output” using a digital pin?</p>
<hr class="section-divider"/>

<h1>⚡ What Is PWM?</h1>
<blockquote><p>PWM stands for <strong>Pulse Width Modulation</strong>.</p></blockquote>
<p>Instead of outputting a steady voltage, Arduino:</p>
<ul>
<li><p>switches the pin <strong>ON and OFF</strong> very fast</p>
</li>
<li><p>controls <strong>how long</strong> it stays ON vs OFF</p>
</li>
</ul>
<p>This ratio is called the <strong>duty cycle</strong>.</p>
<hr class="section-divider"/>

<h1>🧠 Think of PWM Like This</h1>
<p>Imagine flipping a switch very fast:</p>
<ul>
<li><p>ON for long time → looks bright</p>
</li>
<li><p>ON for short time → looks dim</p>
</li>
</ul>
<sp-sidenote><p>Your eyes (and motors) don’t see the rapid switching —<br />they see the <strong>average effect</strong>.</p></sp-sidenote>
<p>That’s <h3>PWM.</h3></p>
<hr class="section-divider"/>

<h1>📊 Duty Cycle Explained</h1>
<ul>
<li><p>0% duty cycle → always OFF</p>
</li>
<li><p>50% duty cycle → ON half the time</p>
</li>
<li><p>100% duty cycle → always ON</p>
</li>
</ul>
<p>Arduino expresses this using numbers:</p>
<ul>
<li>0   → 0%   (OFF)</li>
<li>128 → ~50%</li>
<li>255 → 100% (FULL ON)</li>
</ul>
<hr class="section-divider"/>

<h1>🔌 PWM Pins on Arduino Uno</h1>
<p>Not all pins support PWM.</p>
<p>On Arduino Uno, PWM pins are marked with <code>~</code>:</p>
<pre>3, 5, 6, 9, 10, 11</pre>

<p>Only these pins can use <code>analogWrite()</code>.</p>
<p>Click here to learn about pin scheme of <a href="/posts/understanding-the-arduino-uno-board.html">Arduino.</a></p>
<hr class="section-divider"/>

<h1>💻 Basic PWM Example (LED Fade)</h1>
<pre><code>void setup() {
  pinMode(9, OUTPUT);
}

void loop() {
  analogWrite(9, 128); // ~50% brightness
}
</code></pre>
<sp-lab
  title="Arduino Basic PWM"
  subtitle="Interactive simulation built in Tinkercad"
  link="https://www.tinkercad.com/things/8wEFnZn7DDA-pwm-basic"
  button="Open Simulation in Tinkercad"
  image="/images/pathway-to-arduino/understanding-PWM-and-LED-fading/1.png"
>
  Try playing with the voltage value and see different levels of brightness!
</sp-lab>
<p>Even though the function is called <code>analogWrite()</code>,<br />it is still <strong>digital PWM</strong>, not true analog voltage.</p>
<hr class="section-divider"/>

<h1>🔄 Fading an LED Smoothly</h1>
<pre><code>void setup() {
  pinMode(9, OUTPUT);
}

void loop() {
  for (int i = 0; i <= 255; i++) {
    analogWrite(9, i);
    delay(10);
  }

  for (int i = 255; i >= 0; i--) {
    analogWrite(9, i);
    delay(10);
  }
}
</code></pre>
<sp-lab
  title="Arduino Fading LED PWM"
  subtitle="Interactive simulation built in Tinkercad"
  link="https://www.tinkercad.com/things/kTncBdyO7dY-pwm-fading-led"
  button="Open Simulation in Tinkercad"
  image="/images/pathway-to-arduino/understanding-PWM-and-LED-fading/1.png"
>
  Try changing the delay to obtain different speeds of fading!
</sp-lab>
<p>This gradually changes the duty cycle, making the LED fade in and out.</p>
<hr class="section-divider"/>

<h1>🔁 Potentiometer → PWM Control</h1>
<p>Now combine what you learned earlier:</p>
<pre><code>void setup() {
  pinMode(9, OUTPUT);
}

void loop() {
  int potValue = analogRead(A0);
  int pwmValue = map(potValue, 0, 1023, 0, 255);
  analogWrite(9, pwmValue);
}
</code></pre>
<sp-lab
  title="Arduino PWM using Potentiometer Input"
  subtitle="Interactive simulation built in Tinkercad"
  link="https://www.tinkercad.com/things/gHHbhdqs8h7-using-pwm-with-potentiometer"
  button="Open Simulation in Tinkercad"
  image="/images/pathway-to-arduino/understanding-PWM-and-LED-fading/2.png"
>
  Try rotating the potentiometer and observe how the LED brightness
  changes in real time.
</sp-lab>
<p>Turning the potentiometer now directly controls LED brightness.</p>
<hr class="section-divider"/>

<h1>🎯Let's Recall Previous Chapters!!</h1>
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

<h1>⚠️ Important PWM Facts</h1>
<ul>
<li><p>PWM does not change voltage level</p>
</li>
<li><p>It changes time ON vs OFF</p>
</li>
<li><p>Average voltage is what devices respond to</p>
</li>
<li><p>Frequency is fixed by Arduino timers (for now)</p>
</li>
</ul>
<p>Later, we’ll talk about PWM frequency, noise, and motors.</p>
<hr class="section-divider"/>

<h1>🧰 Common Beginner Mistakes</h1>
<ul>
<li><p>Using <code>analogWrite()</code> on non-PWM pins</p>
</li>
<li><p>Expecting smooth fade on wrong pin</p>
</li>
<li><p>Forgetting the resistor for LED</p>
</li>
<li><p>Thinking PWM is “real analog output”</p>
</li>
</ul>
<p>PWM is a clever illusion, not true analog.</p>
<hr class="section-divider"/>

<h1>📌 What Comes Next</h1>
<p>You’ve now completed the core I/O fundamentals:</p>
<ul>
<li><p>Digital Output</p>
</li>
<li><p>Digital Input</p>
</li>
<li><p>Analog Input</p>
</li>
<li><p>PWM Output</p>
</li>
</ul>
<p>Next, we fix a problem you’ve already seen but maybe ignored:</p>
<h3>👉 Delays vs Non-Blocking Code (millis())</h3>