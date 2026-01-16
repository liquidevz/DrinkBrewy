# BINN Architecture Requirements (Extracted from Whiteboard)

## Core Components
1.  **Dopamine System**:
    *   Function: Regulates threshold, energy used, and tokens.
    *   Mechanism: Influenced by "Emotion Wheel" and "Value Spikes".
2.  **SNN (Spiking Neural Network)**:
    *   Type: Threshold-based.
    *   Analogy: Neuron synapses.
    *   Learning: Actual learning methods (not hallucinations).
3.  **Emotion Wheel**:
    *   Categories: Ego, Excitement, Angry, Happy, Sad.
    *   Function: Regulates Dopamine.
4.  **Memory / State Space Model**:
    *   Function: Low energy memory storage for SNN.
    *   Implementation: State Space Model (SSM) approach.

## Integration Logic
*   Emotion Wheel -> Regulates Dopamine.
*   Dopamine -> Regulates SNN (Threshold, Energy, Tokens).
*   SNN -> Interacts with Memory (SSM).
*   Value Spikes -> Input to the system affecting Dopamine.
