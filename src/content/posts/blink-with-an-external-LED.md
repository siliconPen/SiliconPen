---
title: "Blink with an External LED"
subtitle: "Understanding the Brain and Bones of Arduino Circuits!"
description: "Controlling LED using Arduino!"
date: "2025-12-17"
cover: "/images/pathway-to-arduino/cover.webp"
series: "pathway-to-arduino"
order: 4
draft: false
---

<h1>Chapter 4</h1>
<p>So in the <a href="/posts/setting-up-the-arduino-IDE.html">last post</a>, we successfully set up our Arduino IDE and ran the example Blink program.<br />In this post, we’ll first understand what that code actually does, and then build a real circuit to implement the same logic ourselves.</p>
<hr class="section-divider"/>

<h1>💡Understanding the Blink</h1>
<h2>Quick Recap</h2>
<h3>Blink Program</h3>
<pre>
<code>
void setup() {
  pinMode(LED_BUILTIN, OUTPUT);
}

void loop() {
  digitalWrite(LED_BUILTIN, HIGH);
  delay(1000);
  digitalWrite(LED_BUILTIN, LOW);
  delay(1000);
}
</code>
</pre>
<h3>What Did It Do?</h3>
<p>The built-in LED on the Arduino board started blinking — ON for 1 second, OFF for 1 second, repeatedly.</p>
<p>Simple to observe, but there’s a lot happening behind the scenes.</p>
<h2>Code Logic Simplified</h2>
<h3>Void Setup</h3>
<p>This block runs exactly once when the Arduino starts.</p>
<p>It is used to:</p>
<ul>
<li><p>set pin modes</p>
</li>
<li><p>initialize variables and constants</p>
</li>
<li><p>prepare the board before the main program runs</p>
</li>
</ul>
<p>Now look at this line:</p>
<ul><li><p><code>pinMode(LED_BUILTIN, OUTPUT);</code></p></li>
<p>This tells the Arduino that the pin connected to the built-in LED should act as an output — meaning it will provide voltage/current to a component.</p></ul>
<p>For now, the LED is already mounted on the board, which might feel a bit abstract. Don’t worry — we’ll remove that abstraction soon.</p>
<img src="/images/pathway-to-arduino/blink-with-an-external-LED/1.png" alt="diagram" />
<h3>Void Loop</h3>
<p>This block runs again and again, endlessly.</p>
<p>Whatever code you place here will repeat continuously — useful for blinking LEDs, rotating motors, reading sensors, etc.</p>
<ul><li><p><code>digitalWrite(LED_BUILTIN, HIGH);</code></li>This sets the LED pin to HIGH, meaning it outputs 5V.<br />As a result, the LED turns ON.</p></ul>
<ul><li><p><code>delay(1000);</code></li>This pauses the program for 1000 milliseconds (1 second).<br />During this time, the LED stays ON.</p></ul>
<ul><li><p><code>digitalWrite(LED_BUILTIN, LOW);</code></li>This sets the pin to LOW, meaning 0V output.<br />The LED turns OFF.</p></ul>
<ul><li><p><code>delay(1000);</code></li>The OFF state is also held for 1 second.</p></ul>
<p>After this, the loop() function starts again, creating the blinking pattern.</p>
<hr class="section-divider"/>
<h1>🚨Creating A Blinking LED Circuit</h1>
<img src="/images/pathway-to-arduino/blink-with-an-external-LED/2.jpg" alt="ckt photo" />
<h2>What we&#39;ll do?</h2>
<p>Now that we understand the idea, let’s build the same thing ourselves using an external LED.<br />This is where the concepts of pins, voltage, and output start making real sense.</p>
<h2>Components Required</h2>
<img src="/images/pathway-to-arduino/blink-with-an-external-LED/3.jpg" alt="components" />
<ul>
<li>Breadbord  <a href="/posts/know-your-weapons.html">(Basic Electronic Components!)</a></li>
<li>Jumper Wires </li>
<li>LED (red preffered)</li>
<li>220 ohm resistor (MUST!)</li>
<li>ofc Arduino UNO</li>
</ul>
<h2>Circuit Diagram</h2>
<img src="/images/pathway-to-arduino/blink-with-an-external-LED/4.png" alt="components" />
<blockquote>
Arduino pin 13 --> Resistor --> LED --> Arduino GND 
</blockquote>
<p>Connect the components exactly in this order.</p>

<p>Make sure the LED polarity is correct.<br />Longer side (+) Anode connected to source side.<br />Shorter side (-) Cathode connected to ground.</p>
<img src="/images/pathway-to-arduino/blink-with-an-external-LED/5.jpg" alt="components" />
<img src="/images/pathway-to-arduino/blink-with-an-external-LED/6.jpg" alt="components" />
<h2>Code</h2>
<p>Upload the following code to your Arduino:</p>
<pre>
<code>
void setup() {
  pinMode(13, OUTPUT);
}

void loop() {
  digitalWrite(13, HIGH);
  delay(1000);
  digitalWrite(13, LOW);
  delay(1000);
}

</code>
</pre>

<p>As you can observe, this is the same code as before.<br />The only change is replacing LED_BUILTIN with pin 13, where our external LED is connected.</p>
<p>Compile and upload the code.</p>
<h2>Result</h2>
<div class="video-embed">
  <iframe
    src="https://www.youtube.com/embed/62NnJl6dVho"
    title="Live demo: Arduino Uno explanation"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen>
  </iframe>
</div>
<p class="video-caption">
  Live demo of Blink Circuit.
</p>
<p>You should now see the external LED blinking, exactly the same way the onboard LED did in the previous post.</p>
<p>At this point, code is no longer abstract — it is directly controlling a real circuit.</p>
<hr class="section-divider"/>
<h1>✨Reflections</h1>
<p>We can now clearly understand the concept of pins and digital output.</p>
<p>What the code is doing:</p>
<ul>
<li><p>Pin 13 is set as an output</p>
</li>
<li><p>The pin alternates between HIGH (5V) and LOW (0V)</p>
</li>
<li><p>Each state is held for 1 second using delay()</p>
</li>
</ul>
<p>Key Takeaways</p>
<ul>
<li><p>Arduino has pins that act as output interfaces</p>
</li>
<li><p>Output pins can be set HIGH or LOW using digitalWrite()</p>
</li>
<li><p>HIGH/LOW logic works like an ON/OFF switch</p>
</li>
<li><p>delay() controls how long a state is maintained</p>
</li>
</ul>
<p>Don’t pressure yourself to understand everything immediately.<br />As we move forward and build more examples, these ideas will connect naturally.</p>
<p>This is exactly how I learned it — step by step.</p>
<hr class="section-divider"/>
<h1>❗Important Concepts</h1>
<h2>Why Is the Resistor a MUST?</h2>
<p>An LED is a fragile device.<br />If the current through it exceeds its limit, it can burn instantly.</p>
<p>Connecting an LED directly to 5V causes excessive current flow, which can damage:</p>
<ul>
<li><p>the LED</p>
</li>
<li><p>the Arduino pin</p>
</li>
</ul>
<p>A resistor limits the current and protects the circuit.</p>
<p><em>This is your first lesson in circuit protection — and yes, I learned it after burning a few LEDs.</em></p>
<h3>Why 220 Ω?</h3>
<p>Most LEDs operate safely at 10–20 mA.</p>
<p>Using Ohm’s Law, 220 Ω is a safe lower limit for 5V operation.<br />Do not go below this, especially for blue or white LEDs.</p>
<p>And yes! The onboard LED already includes a built-in resistor.</p>
<h3>Did you look closely?</h3>
<p>If you did, you might have noticed the onboard LED was also blinking this whole time along with the external LED. Why? because that LED is connected to none other than pin 13. In short, BUILTIN_LED is the other name of pin 13. The pin 13 which you connected is internally also connected with the onboard LED!</p>
<h2>Other Precautions?</h2>
<ul>
<li><p>Never connect 5V directly to GND</p>
</li>
<li><p>Be careful with pins set to HIGH (they output 5V)</p>
</li>
<li><p>Always check LED polarity before powering the circuit</p>
</li>
</ul>
<p>These small checks prevent big mistakes.</p>
<hr class="section-divider"/>

<p>What’s Next</p>
<p>Now that we’ve built and seen digital output in action, we’re ready to properly understand:</p>
<p>What HIGH and LOW really mean electrically.</p>
<p>That’s exactly what we’ll cover in the next.</p>