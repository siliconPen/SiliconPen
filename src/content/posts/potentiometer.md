---
title: "Potentiometer"
subtitle: "The Variable Resistor That Lets You Control Electronics Smoothly"
description: "A beginner-friendly look at potentiometers—what they are, how they work, and why they let humans control circuits smoothly instead of just ON/OFF. Clear, practical, and perfect for real-world electronics learning."
date: "2026-01-09"
cover: "/images/real-circuits/cover.png"
series: "real-circuits"
order: 4
tags:
  - "electronics"
  - "analog"
  - "circuits"
  - "inputs"
  - "foundations"
  - "explainer"
draft: false
---

<h1>The One-Line Definition</h1>
<p>A potentiometer is a resistor whose value you can change manually.</p>
<p>In simple words:<br /><sp-fact>It lets a human control a circuit smoothly instead of ON/OFF.</sp-fact></p>
<hr class="section-divider">

<h1>What a Potentiometer Really Is</h1>
<img src="/images/real-circuits/potentiometer/1.jpeg" alt="" />
<p>From the outside, a potentiometer looks simple:<br />a knob and three pins.</p>
<p>Inside, it’s even simpler.</p>
<img src="/images/real-circuits/potentiometer/2.png" alt="" />
<h2>Inside a potentiometer</h2>
<h3>Internally, a potentiometer has:</h3>
<ul>
<li><p>A resistive track</p>
</li>
<li><p>A wiper (metal contact)</p>
</li>
<li><p>A rotating shaft that moves the wiper</p>
</li>
</ul>
<h3>When you rotate the knob:</h3>
<ul>
<li><p>The wiper slides along the resistive track</p>
</li>
<li><p>The resistance between pins changes continuously</p>
</li>
</ul>
<p>Nothing digital.<br />Nothing smart.<br />Just <strong>metal sliding on resistance</strong>.</p>
<hr class="section-divider">

<h1>The Three Pins</h1>
<p>A potentiometer always has three pins:</p>
<ul>
<li><p>Pin 1 → One end of resistive track</p>
</li>
<li><p>Pin 2 (Middle) → Wiper</p>
</li>
<li><p>Pin 3 → Other end of resistive track</p>
</li>
</ul>
<p>The middle pin is the most important one.<br />It is the output of the potentiometer.</p>
<hr class="section-divider">

<h1>Two Ways to Use a Potentiometer</h1>
<p>This is where most confusion happens.<br /><sp-q>A potentiometer is <strong>one component</strong>, but it has <strong>two common uses</strong>.</sp-q></p>
<h2>🔹 1) Potentiometer as a Voltage Divider</h2>
<img src="/images/real-circuits/potentiometer/3.png" alt="" />
<p>This is the most common and most useful mode.</p>
<h3>How it’s connected</h3>
<ul>
<li><p>One end → 5V</p>
</li>
<li><p>Other end → GND</p>
</li>
<li><p>Middle pin → Output</p>
</li>
</ul>
<p>Now the potentiometer splits the voltage.</p>
<h3>What happens when you rotate it</h3>
<ul>
<li><p>Knob left → output near 0V</p>
</li>
<li><p>Knob right → output near 5V</p>
</li>
<li><p>Anywhere in between → proportional voltage</p>
</li>
</ul>
<p>The potentiometer is acting as a <strong>manual voltage divider</strong>.</p>
<h3>This is how:</h3>
<ul>
<li><p>Volume knobs work</p>
</li>
<li><p>Brightness controls work</p>
</li>
<li><p>Speed knobs work</p>
</li>
</ul>
<hr class="section-divider">

<h2>🔹 2) Potentiometer as a Variable Resistor</h2>
<img src="/images/real-circuits/potentiometer/4.png" alt="" />
<p>Here, we use only <strong>two pins</strong>:</p>
<ul>
<li><p>One end pin</p>
</li>
<li><p>The middle (wiper) pin</p>
</li>
</ul>
<p>The potentiometer now behaves like a <strong>resistor whose value changes</strong> as you rotate it.</p>
<h3>This mode is useful when:</h3>
<ul>
<li><p>You want to control current</p>
</li>
<li><p>You want to tune a value</p>
</li>
<li><p>You want adjustment, not absolute voltage</p>
</li>
</ul>
<p>This is often called a <strong>rheostat</strong> configuration.</p>
<hr class="section-divider">

<h1>⚠️ Important Real Circuits Insight</h1>
<p><sp-warning>A potentiometer does not “set a value”.</sp-warning>It negotiates a value with the circuit connected to it.</p>
<h3>If the circuit draws current:</h3>
<ul>
<li><p>The output voltage can shift</p>
</li>
<li><p>The divider assumption breaks</p>
</li>
</ul>
<p>We’ll see this clearly in later posts.</p>
<hr class="section-divider">

<h1>🧪 Practical Circuit</h1>
<h2>Components Required</h2>
<ul>
<li><p>Potentiometer (10k recommended)</p>
</li>
<li><p>LED</p>
</li>
<li><p>Resistor (220Ω–330Ω)</p>
</li>
<li><p>Breadboard</p>
</li>
<li><p>Wires</p>
</li>
<li><p>Power source</p>
</li>
</ul>
<h2>Circuit Idea</h2>
<ul>
<li><p>Potentiometer controls voltage</p>
</li>
<li><p>LED brightness changes smoothly</p>
</li>
</ul>
<h2>Circuit Diagram: </h2>
<img src="/images/real-circuits/potentiometer/5.png" alt="" />
<h2>Completed Circuit: </h2>
<img src="/images/real-circuits/potentiometer/6.jpeg" alt="" />
<h2>Video Demo: </h2>
<div class="video-embed">
  <iframe
    src="https://www.youtube.com/embed/PJb9DAd-wRk"
    title="Live demo: Potentiometer"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen>
  </iframe>
</div>
<p class="video-caption">
  Live demo of Potentiometer LED Brightness Control
</p>
<h2>What to observe</h2>
<ul>
<li><p>Brightness changes smoothly</p>
</li>
<li><p>No sudden jumps</p>
</li>
<li><p>Human hand controls analog behavior</p>
</li>
</ul>
<p><sp-warning>This is <em>not PWM</em>.</sp-warning><sp-example>This is <b>pure analog control</b>.</sp-example></p>
<hr class="section-divider">

<h1>🧠 What Beginners Usually Miss</h1>
<ul>
<li><p>Middle pin is the output</p>
</li>
<li><p>End pins can be swapped (direction reverses)</p>
</li>
<li><p>Cheap pots are noisy</p>
</li>
<li><p>Wiper contact is imperfect</p>
</li>
<li><p>Dirt causes jitter</p>
</li>
</ul>
<p>If brightness flickers:</p>
<ul>
<li>It’s mechanical, not logical</li>
</ul>
<hr class="section-divider">

<h1>🔗 Where This Leads Next</h1>
<p>Potentiometers are often used as:</p>
<ul>
<li><p>Inputs to microcontrollers</p>
</li>
<li><p>Manual tuning elements</p>
</li>
<li><p>Calibration tools</p>
</li>
</ul>
<hr class="section-divider">

<h3>Next Post Coming Soon!!</h3>