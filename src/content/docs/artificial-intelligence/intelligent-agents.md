---
title: Intelligent Agents
description: What AI is (the four approaches and the Turing test), agents and environments, rationality, PEAS descriptions, the properties of task environments, and the five types of agent.
sidebar:
  label: "1. Intelligent agents"
  order: 1
lesson:
  module: Foundations
  outcomes:
    - Compare the four approaches to defining AI
    - Write a PEAS description for an agent
    - Classify a task environment by its properties
    - Describe the five agent types from simple reflex to learning agents
  keyIdea: >-
    Modern AI is about building **rational agents**: systems that perceive their environment through sensors and act through actuators to maximise a **performance measure**. The right agent design depends on the environment: whether it is fully observable, deterministic, static, discrete and single-agent.
---

## 1. What is AI?

Four ways to define it, depending on whether we care about **thinking** or **acting**, and about matching **humans** or being **rational**:

| | Human-like | Rational |
|---|---|---|
| **Thinking** | Thinking humanly: model human thought (cognitive science) | Thinking rationally: correct reasoning ("laws of thought", logic) |
| **Acting** | Acting humanly: the **Turing test** | **Acting rationally: rational agents** (the modern approach) |

**The Turing test** (1950): a human judge chats by text with a hidden human and a hidden machine. If the judge can't reliably tell which is the machine, it passes. Passing requires natural language processing, knowledge representation, reasoning and learning. The **total Turing test** adds vision and robotics.

**Weak (narrow) AI** solves specific tasks (chess, translation); **strong (general) AI** would match human intelligence across tasks.

## 2. Agents and environments

An **agent** perceives its **environment** through **sensors** and acts on it through **actuators**. The **agent function** maps the history of percepts (the **percept sequence**) to an action; the **agent program** implements it.

A **rational agent** chooses the action expected to **maximise its performance measure**, given its percepts so far and its built-in knowledge. Rational does not mean all-knowing (omniscient): it means doing the best with the information available. Rational agents also **gather information** (explore) and **learn**.

## 3. PEAS

Specify a task environment by its **P**erformance measure, **E**nvironment, **A**ctuators and **S**ensors.

| Agent | Performance | Environment | Actuators | Sensors |
|---|---|---|---|---|
| Self-driving taxi | Safe, fast, legal, comfortable trip; profit | Roads, traffic, pedestrians, weather | Steering, accelerator, brake, horn, display | Cameras, lidar, GPS, speedometer |
| Medical diagnosis system | Patient health, cost | Patient, hospital | Display questions, tests, diagnoses | Keyboard entry of symptoms and results |
| Vacuum robot | Cleanliness, battery use | Rooms, dirt, furniture | Wheels, brushes, suction | Dirt sensor, bump sensor, camera |
| Spam filter | Correctly classified mail | Inbox, senders | Mark as spam / not spam | Incoming messages |

## 4. Properties of environments

| Property | One end | Other end |
|---|---|---|
| **Observable** | Fully: sensors see the complete state (chess) | Partially (poker, driving in fog) |
| **Agents** | Single (crossword) | Multi-agent: competitive (chess) or cooperative |
| **Deterministic** | Deterministic: the next state is fixed by the action (chess) | **Stochastic** (dice, traffic) |
| **Episodic** | Episodic: each decision is independent (image classification) | **Sequential**: actions affect the future (chess, driving) |
| **Static** | Static: the world waits while the agent thinks (crossword) | **Dynamic**: it changes meanwhile (driving) |
| **Discrete** | Discrete states and actions (chess) | **Continuous** (driving) |
| **Known** | The rules are known | Unknown: the agent must learn how the world works |

The hardest case, as for a taxi, is partially observable, multi-agent, stochastic, sequential, dynamic and continuous.

## 5. Agent types

| Agent | Decides using | Strength / weakness |
|---|---|---|
| **Simple reflex** | Condition–action rules on the **current** percept only | Fast, but fails if the environment is partially observable |
| **Model-based reflex** | An internal **model** of the world, updated from the percept history | Handles partial observability |
| **Goal-based** | A model plus **goals**; plans sequences of actions to reach them (search, planning) | Flexible: change the goal, not the rules |
| **Utility-based** | A **utility function** measuring how desirable each state is | Handles trade-offs and uncertainty (choose the best, not just any, goal state) |
| **Learning** | Any of the above, plus a learning element that improves performance from experience | Can work in unknown environments |

A learning agent has four parts: the **performance element** (chooses actions), the **critic** (judges how well it is doing against a standard), the **learning element** (makes improvements) and the **problem generator** (suggests exploratory actions).

**Example.** A simple reflex vacuum agent: "if the current square is dirty, suck; otherwise move to the other square." It fails if it can't sense where it is or what has already been cleaned; a model-based agent remembers.

## Summary

- The modern approach to AI is building rational agents that act to maximise expected performance.
- The Turing test judges whether a machine can act indistinguishably from a human in conversation.
- PEAS describes a task: performance measure, environment, actuators, sensors.
- Environments vary: observable, multi-agent, stochastic, sequential, dynamic, continuous, unknown.
- Agent types: simple reflex, model-based, goal-based, utility-based, learning.

## Check yourself

<details>
<summary>Is a rational agent always successful?</summary>

No. It chooses the action with the best **expected** outcome given what it knows. It can still fail through bad luck or missing information; rationality is not omniscience.
</details>

<details>
<summary>Classify the environment for playing poker.</summary>

Partially observable (you can't see others' cards), multi-agent (competitive), stochastic (the deal), sequential, static (in turn-based play), discrete.
</details>

<details>
<summary>Why does a simple reflex agent struggle in a partially observable environment?</summary>

It acts only on the current percept. If that percept doesn't reveal the full situation, the same percept can call for different actions, and the agent can't tell them apart without remembering history.
</details>
