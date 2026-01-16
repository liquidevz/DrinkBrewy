# Biology-Informed Neural Network (BINN) Design

The BINN architecture is designed to simulate biological neural processes by integrating emotional regulation, neuromodulation, and efficient memory structures. This design moves away from traditional backpropagation-based AI toward a more biologically plausible "actual learning" framework.

## 1. Neuromodulation: The Dopamine System
The **Dopamine System** acts as a global regulator for the network. It does not carry specific data but instead modulates the sensitivity and metabolic efficiency of the neurons.
*   **Threshold Regulation**: High dopamine levels lower the firing threshold of neurons, making the network more "excitable" and prone to exploration.
*   **Energy Management**: Dopamine levels correlate with the "energy" available for synaptic updates and firing, simulating metabolic constraints.
*   **Token Allocation**: In a computational context, dopamine regulates the number of "tokens" or processing steps the network can take for a given input.

## 2. Emotional Regulation: The Emotion Wheel
The **Emotion Wheel** provides the input for the Dopamine System. It consists of five primary states: **Ego, Excitement, Angry, Happy, and Sad**.
*   **State Mapping**: Each emotional state is represented as a vector that influences the dopamine baseline. For example, "Excitement" increases dopamine, while "Sad" might decrease it.
*   **Value Spikes**: External rewards or significant inputs create "Value Spikes" that shift the emotional state, subsequently triggering a dopamine response.

## 3. Processing Core: Spiking Neural Network (SNN)
The **SNN** is the primary computational engine, utilizing threshold-based firing rather than continuous activation functions.
*   **Leaky Integrate-and-Fire (LIF)**: Neurons accumulate input over time and fire a spike when a threshold is reached.
*   **Synaptic Plasticity**: Learning is achieved through **Spike-Timing-Dependent Plasticity (STDP)**, where the strength of a synapse is adjusted based on the relative timing of pre- and post-synaptic spikes.

## 4. Memory Architecture: State Space Model (SSM)
To achieve "low energy memory storage," the system utilizes a **State Space Model**.
*   **Linear Recurrence**: Unlike traditional RNNs, the SSM uses linear recurrences that can be computed efficiently, mimicking the long-term potential (LTP) in biological brains.
*   **State Compression**: The SSM compresses the history of spikes into a compact state vector, allowing the SNN to access past information without the high energy cost of maintaining a full attention matrix.

## 5. System Integration Flow
| Component | Input | Output | Biological Analogue |
| :--- | :--- | :--- | :--- |
| **Emotion Wheel** | Value Spikes | Emotional State Vector | Amygdala / Limbic System |
| **Dopamine System** | Emotional State | Modulation Parameters | Substantia Nigra / VTA |
| **SNN Core** | Raw Input + Modulation | Spikes | Neocortex |
| **SSM Memory** | Spikes | Contextual State | Hippocampus |
