---
title: "TitleBelowCover"
subtitle: "Subtitle"
description: "description"
date: "2026-01-01"
cover: "https://www.youtube.com/embed/GH0lQ8gcdgc"
draft: true
---

<h1>SiliconPen Custom Tags — Demo</h1>
  <p>Use this page to preview all your special elements.</p>

  <sp-line>Pins control signals, not power.</sp-line>

  <sp-rule>Always add a current-limiting resistor to LEDs.</sp-rule>

  <sp-warning>Do NOT power motors directly from microcontroller pins.</sp-warning>

  <sp-tip>Use color-coded wires to debug circuits faster.</sp-tip>

  <sp-fact>Capacitors store energy, not charge.</sp-fact>

  <sp-example>
    digitalWrite(13, HIGH) turns ON the LED.
  </sp-example>

  <sp-error>Common mistake: forgetting to share ground between modules.</sp-error>

  <sp-success>Upload successful! Board communication verified.</sp-success>

  <sp-q>Why does PWM dim an LED even though voltage stays 5V?</sp-q>

  <sp-answer>Because the duty cycle reduces effective power.</sp-answer>

  <sp-pro>Simple to prototype on breadboard.</sp-pro>

  <sp-con>Not stable for RF or high-speed signals.</sp-con>

  <sp-equation>V = IR</sp-equation>

  <sp-block>
    Think of voltage as pressure and current as flow.
  </sp-block>

  <sp-sidenote>
    You’ll revisit this in the MOSFET switching chapter.
  </sp-sidenote>

  <sp-quote>
    “Engineering is the art of applying science.”
  </sp-quote>

  <sp-video
  src="https://www.youtube.com/embed/GH0lQ8gcdgc"
  title="Live demo: Arduino and Potentiometer"
  caption="Live demo of Arduino and Potentiometer.">
  </sp-video>

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

  <sp-checkpoint>
  Before moving on, make sure you understand:<br />
  • What HIGH and LOW physically mean  <br />
  • Why floating pins are dangerous  <br />
  • How pull-ups stabilize inputs
  </sp-checkpoint>

  <sp-quiz title="Digital Input Basics">
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
  </sp-quiz>

  <sp-reveal title="Quiz Answers!">
  Most beginners confuse logical HIGH with physical voltage.
  That mental model breaks in real circuits.
  </sp-reveal>