---
title: "Delays vs Non-Blocking Code millis()"
subtitle: "Why delay() Freezes Your Arduino — and How millis() Frees It"
description: "Using delay() works for beginners, but it stops your Arduino from doing multiple tasks. This chapter explains why delay() becomes a bottleneck and how millis() helps you write smooth, non-blocking, multitasking-friendly code."
date: "2026-07-20"
cover: "/images/pathway-to-arduino/cover.webp"
series: "pathway-to-arduino"
order: 11
tags:
  - "electronics"
  - "arduino"
  - "delay"
  - "inputs"
  - "signals"
  - "explainer"
draft: false
---

<h1>Chapter 11</h1>
<p>Up to now, we’ve used <code>delay()</code> everywhere.</p>
<p>And that’s okay — for learning.</p>
<sp-quote><p>But at some point, <code>delay()</code> stops being your friend.</p></sp-quote>
<p>This chapter explains why, and introduces a better way to handle time on Arduino.</p>
<hr class="section-divider"/>

<h1>⏳ What <code>delay()</code> Actually Does</h1>
<p>When you write:<br /><code>delay(1000);</code></p>
<p>Arduino does exactly this:</p>
<sp-warning><p>Stop everything. Wait for 1 second. Then continue.</p></sp-warning>
<p>During that delay:</p>
<ul>
<li><p>no buttons are read</p>
</li>
<li><p>no sensors are checked</p>
</li>
<li><p>no logic runs</p>
</li>
<li><p>nothing else happens</p>
</li>
</ul>
<p>The microcontroller is literally doing nothing.</p>
<hr class="section-divider"/>

<h1>🧠 Why This Is a Problem</h1>
<p>Imagine you want to:</p>
<ul>
<li><p>blink an LED</p>
</li>
<li><p>read a button</p>
</li>
<li><p>update a display</p>
</li>
</ul>
<p>at the same time.</p>
<p>With <code>delay()</code>:</p>
<ul>
<li><p>LED blocks button reading</p>
</li>
<li><p>button blocks sensor updates</p>
</li>
<li><p>everything waits on everything else</p>
</li>
</ul>
<sp-example><p>This creates <strong>unresponsive systems</strong>.</p></sp-example>
<hr class="section-divider"/>

<h1>🧪 Simple Example of the Problem</h1>
<pre><code>digitalWrite(LED_PIN, HIGH);
delay(1000);
digitalWrite(LED_PIN, LOW);
delay(1000);
</code></pre>
<p>During those 2 seconds:</p>
<ul>
<li><p>a button press is ignored</p>
</li>
<li><p>a sensor change is missed</p>
</li>
</ul>
<p>This is fine for demos, <strong>not for real systems</strong>.</p>
<sp-lab
  title="Blocking Delays"
  subtitle="Interactive simulation built in Tinkercad"
  link="https://www.tinkercad.com/things/1fkyfMkIOo6-blocking-delay"
  button="Open Simulation in Tinkercad"
  image="/images/pathway-to-arduino/delays-vs-non-blocking-code-millis/1.png"
  >
    Try using the button in this simulation to notice the blocking nature of Delay!
  </sp-lab>
<hr class="section-divider"/>

<h1>🔢 What Is millis()?</h1>
<p>Instead of waiting, we can ask Arduino:</p>
<sp-fact><p>“Has enough time passed?”</p></sp-fact>
<p>That’s what <code>millis()</code> does.</p>
<h3><code>millis()</code> returns:</h3>
<ul>
<li><p>the number of milliseconds</p>
</li>
<li><p>since the Arduino started running</p>
</li>
</ul>
<p>It keeps increasing:</p>
<pre>0, 1, 2, 3, ...</pre>

<p>And it never blocks your program.</p>
<hr class="section-divider"/>

<h1>🔁 The Core Idea (Very Important)</h1>
<p>Instead of this:<br /><code>delay(1000);</code></p>
<h3>We do this:</h3>
<ul>
<li><p>remember the last time something happened</p>
</li>
<li><p>compare it to the current time</p>
</li>
<li><p>act only if enough time has passed</p>
</li>
</ul>
<hr class="section-divider"/>

<h1>🧩 Non-Blocking Blink Example</h1>
<pre><code>const int ledPin = 13;
unsigned long previousTime = 0;
const long interval = 1000;

void setup() {
  pinMode(ledPin, OUTPUT);
}

void loop() {
  unsigned long currentTime = millis();

  if (currentTime - previousTime >= interval) {
    previousTime = currentTime;
    digitalWrite(ledPin, !digitalRead(ledPin));
  }
}
</code></pre>
<p>This LED still blinks every second.</p>
<p>But now:</p>
<ul>
<li><p>the loop keeps running</p>
</li>
<li><p>buttons can be read</p>
</li>
<li><p>sensors can be checked</p>
</li>
<li><p>multiple tasks can coexist</p>
</li>
</ul>
 <sp-lab
  title="Non-Blocking Millis"
  subtitle="Interactive simulation built in Tinkercad"
  link="https://www.tinkercad.com/things/jzL6xxqgbjb-non-blocking-delay-millus"
  button="Open Simulation in Tinkercad"
  image="/images/pathway-to-arduino/delays-vs-non-blocking-code-millis/1.png"
  >
    Try using the button in this simulation to notice the non blocking nature of Millis!
  </sp-lab>
<hr class="section-divider"/>

<h1>🧠 Why This Works</h1>
<sp-pro><p>You’re no longer <strong>pausing time</strong>.</p></sp-pro>
<p>You’re:</p>
<ul>
<li><p>letting the program run freely</p>
</li>
<li><p>making decisions based on time differences</p>
</li>
</ul>
<p>This is how <strong>real embedded systems</strong> work.</p>
<hr class="section-divider"/>

<sp-quiz title="Delays vs Non-Blocking Code (millis())">
  <sp-q>
    <q>What happens when your Arduino executes <code>delay(1000)</code>?</q>
    <o>It can perform other tasks while waiting</o>
    <o correct>It pauses the program, preventing other code from running during the delay</o>
    <o>It automatically checks button inputs in the background</o>
  </sp-q>

  <sp-q>
    <q>Why is <code>millis()</code> preferred over <code>delay()</code> for many Arduino projects?</q>
    <o>It makes the Arduino run faster</o>
    <o correct>It allows multiple tasks to run without blocking the program</o>
    <o>It uses less memory than variables</o>
  </sp-q>
</sp-quiz>

<sp-reveal title="Quiz Answers!">
Using <code>delay()</code> blocks the Arduino from doing anything else until the delay finishes.
With <code>millis()</code>, the Arduino keeps checking the elapsed time while continuing to read sensors, respond to buttons, and control outputs.
</sp-reveal>

<hr class="section-divider"/>
<h1>⚠️ Important Notes</h1>
<ul>
<li><p><code>millis()</code> uses <code>unsigned long</code></p>
</li>
<li><p>it overflows after ~49 days (we’ll handle that later)</p>
</li>
<li><p>this pattern scales to many tasks</p>
</li>
</ul>
<p>Don’t worry if this feels harder than <code>delay()</code> — that’s normal.</p>
<hr class="section-divider"/>

<h1>🧰 Common Beginner Mistakes</h1>
<ul>
<li><p>Mixing <code>delay()</code> and <code>millis()</code> blindly</p>
</li>
<li><p>Forgetting to update previous time</p>
</li>
<li><p>Using <code>int</code> instead of <code>unsigned long</code></p>
</li>
<li><p>Overcomplicating the logic early</p>
</li>
</ul>
<p>Master the <strong>idea</strong>, not the syntax.</p>
<hr class="section-divider"/>

<h1>📌 What Comes Next</h1>
<p>Now that we can:</p>
<ul>
<li><p>control outputs</p>
</li>
<li><p>read inputs</p>
</li>
<li><p>handle time properly</p>
</li>
</ul>
<p>We need a way to see what’s happening inside our code.</p>
<h3>👉 Next Chapter — Serial Monitor: Your First Debug Tool</h3>